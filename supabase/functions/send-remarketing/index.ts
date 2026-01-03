import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RemarketingRequest {
  email: string;
  phone: string;
  productName: string;
  productPrice: number;
  pixId: string;
  userId?: string;
  userName?: string;
}

// Function to get personalized greeting
const getGreeting = (name: string) => {
  const firstName = name?.split(' ')[0] || '';
  return firstName ? `${firstName}` : 'Amigo(a)';
};

// Generate discount based on cart value (higher value = higher discount)
const getDiscountByCartValue = (price: number): number => {
  if (price >= 100) return 30;      // R$100+ = 30% OFF
  if (price >= 70) return 25;       // R$70-99 = 25% OFF
  if (price >= 40) return 20;       // R$40-69 = 20% OFF
  if (price >= 20) return 15;       // R$20-39 = 15% OFF
  return 10;                         // < R$20 = 10% OFF
};

// Generate unique coupon code with timestamp to avoid collisions
const generateCouponCode = (discount: number, productName: string): string => {
  const productCode = productName.toUpperCase().substring(0, 3);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${productCode}${discount}${randomPart}`;
};

// Messages with {NAME}, {PRODUCT}, {DISCOUNT}, {COUPON} placeholders
const remarketingMessages = [
  // Manhã - Motivacional (com cupom)
  {
    title: "Bom dia, {NAME}! ☀️ Presente EXCLUSIVO pra você",
    content: `Bom dia, {NAME}! ☀️

Acordei pensando em você... e na oportunidade que está esperando sua decisão!

Como você mostrou interesse em **{PRODUCT}**, preparei um **cupom exclusivo**:

🎁 **Cupom: {COUPON}**
💰 **{DISCOUNT}% de desconto** - válido APENAS para {PRODUCT}!

⚠️ **IMPORTANTE:** Este cupom é único e só funciona para esta oferta específica.

🌟 **Hoje é o dia perfeito para começar.**

Clique em "Ver Esta Oferta" e o desconto será aplicado automaticamente!`
  },
  {
    title: "Ei, {NAME}! 🚀 Cupom personalizado pra você",
    content: `Oi, {NAME}! Tudo bem? ☀️

Vi que você se interessou por **{PRODUCT}** mas ainda não finalizou...

Olha o que eu liberei especialmente pra você:

🎁 **Seu cupom exclusivo: {COUPON}**
💰 **{DISCOUNT}% OFF** apenas em {PRODUCT}!

⚠️ Este cupom foi gerado só pra você e só funciona nesta oferta.

💡 **Pensa comigo:** Qual versão de você vai existir daqui a um mês?

Clique em "Ver Esta Oferta" para aplicar automaticamente! 🙌`
  },
  // Tarde - Urgência (com cupom)
  {
    title: "⚡ {NAME}, seu desconto especial está esperando!",
    content: `Ei, {NAME}! Passando rapidinho aqui...

Já é tarde e você ainda não garantiu **{PRODUCT}**! 😱

Liberei um desconto baseado no seu interesse:

🎁 **Cupom exclusivo: {COUPON}**
💰 **{DISCOUNT}% de desconto!**

⚠️ **Atenção:** Este cupom é ÚNICO e válido apenas para {PRODUCT}.

⏰ **O melhor momento era ontem. O segundo melhor é AGORA.**

Clique no botão abaixo e aproveite! 💚`
  },
  {
    title: "🔥 {NAME}, liberei um super desconto!",
    content: `Opa, {NAME}! Tudo bem?

Olha, vou ser direto: preparei algo especial pra você finalizar a compra de **{PRODUCT}**:

🎁 **{COUPON}** = **{DISCOUNT}% OFF**

⚠️ **Importante:** Este cupom é pessoal e só funciona para esta oferta específica. Não pode ser usado em outros produtos!

Os melhores resultados vêm para quem age rápido. Bora? 🚀`
  },
  // Noite - Reflexão (com cupom)
  {
    title: "🌙 {NAME}, antes de dormir... seu presente",
    content: `Boa noite, {NAME}! 🌙

Antes de encerrar o dia, olha o que separei pra você:

🎁 **Cupom personalizado: {COUPON}**
💰 **{DISCOUNT}% OFF** em **{PRODUCT}**!

⚠️ Este cupom foi criado especialmente para esta oferta. Não funciona em outros produtos.

Imagina acordar amanhã sabendo que você tomou uma decisão importante hoje...

✨ **Não vá dormir com arrependimento.**

Clique no botão e garanta seu desconto! 💚`
  },
  {
    title: "💭 {NAME}, última chance do dia...",
    content: `Ei, {NAME}, tudo bem? 🌙

O dia foi longo, eu sei. Mas antes de descansar, olha isso:

🎁 **Seu cupom exclusivo: {COUPON}**
💰 **{DISCOUNT}% de desconto** em **{PRODUCT}**!

⚠️ **Atenção:** Cupom válido APENAS para esta oferta específica.

Você já demonstrou interesse... Só falta o último passo!

🌟 **Amanhã pode ser tarde demais.**

Clique em "Ver Esta Oferta" agora! 💭`
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, phone, productName, productPrice, pixId, userId, userName }: RemarketingRequest = await req.json();

    console.log(`Processing remarketing for email: ${email}, pix: ${pixId}, name: ${userName}, price: ${productPrice}`);

    // Check if this lead already exists
    const { data: existingLead } = await supabase
      .from("abandoned_carts")
      .select("id, is_converted")
      .eq("email", email)
      .eq("pix_id", pixId)
      .single();

    if (existingLead?.is_converted) {
      console.log("Lead already converted, skipping");
      return new Response(
        JSON.stringify({ success: true, message: "Already converted" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If lead doesn't exist, create it
    if (!existingLead) {
      const { error: insertError } = await supabase
        .from("abandoned_carts")
        .insert({
          email,
          phone,
          product_name: productName,
          product_price: productPrice,
          pix_id: pixId,
          user_id: userId || null,
          remarketing_count: 1,
          last_remarketing_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error("Error inserting abandoned cart:", insertError);
        throw insertError;
      }
    }

    // Generate discount based on cart value
    const discount = getDiscountByCartValue(productPrice);
    const couponCode = generateCouponCode(discount, productName);
    
    console.log(`Generated coupon ${couponCode} with ${discount}% discount for price R$${productPrice}`);

    // Store the coupon in the database
    const { error: couponError } = await supabase
      .from("remarketing_coupons")
      .insert({
        email: email.toLowerCase().trim(),
        coupon_code: couponCode,
        discount_percent: discount,
        product_name: productName,
        product_price: productPrice,
        pix_id: pixId,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      });

    if (couponError) {
      console.error("Error inserting coupon:", couponError);
      // Continue anyway, just log the error
    }

    // Pick a random message based on time of day
    const hour = new Date().getHours();
    let messagePool;
    if (hour >= 6 && hour < 12) {
      messagePool = remarketingMessages.slice(0, 2); // Morning
    } else if (hour >= 12 && hour < 18) {
      messagePool = remarketingMessages.slice(2, 4); // Afternoon
    } else {
      messagePool = remarketingMessages.slice(4, 6); // Evening
    }
    
    const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
    
    // Get personalized name
    const personalizedName = getGreeting(userName || '');
    
    // Replace placeholders in message
    const personalizedTitle = randomMessage.title
      .replace(/{NAME}/g, personalizedName)
      .replace(/{PRODUCT}/g, productName)
      .replace(/{DISCOUNT}/g, discount.toString())
      .replace(/{COUPON}/g, couponCode);
    
    const personalizedContent = randomMessage.content
      .replace(/{NAME}/g, personalizedName)
      .replace(/{PRODUCT}/g, productName)
      .replace(/{DISCOUNT}/g, discount.toString())
      .replace(/{COUPON}/g, couponCode);

    // Insert the message with coupon data
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        email,
        phone,
        user_id: userId || null,
        title: personalizedTitle,
        content: personalizedContent,
        type: "remarketing",
        product_name: productName,
        product_price: productPrice,
        pix_id: pixId,
      });

    if (messageError) {
      console.error("Error inserting message:", messageError);
      throw messageError;
    }

    // Send push notification to the user
    try {
      const pushBody = `🎁 ${personalizedName}, você ganhou ${discount}% OFF em ${productName}! Cupom: ${couponCode}`;
        
      const pushResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-push`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            email,
            user_id: userId,
            title: personalizedTitle,
            body: pushBody,
            data: { url: "/messages" },
          }),
        }
      );
      console.log("Push notification response:", pushResponse.status);
    } catch (pushError) {
      console.error("Error sending push notification:", pushError);
    }

    console.log("Remarketing message sent successfully", { discount, couponCode, productName });

    return new Response(
      JSON.stringify({ success: true, discount, couponCode, productName }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-remarketing:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
