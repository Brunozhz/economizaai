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

// Generate random discount between 10% and 30%
const getRandomDiscount = () => {
  const discounts = [10, 15, 20, 25, 30];
  return discounts[Math.floor(Math.random() * discounts.length)];
};

// Generate coupon code
const generateCouponCode = (discount: number) => {
  const codes = [
    `VOLTE${discount}`,
    `DESCONTO${discount}`,
    `ESPECIAL${discount}`,
    `PROMO${discount}`,
    `VIP${discount}`
  ];
  return codes[Math.floor(Math.random() * codes.length)];
};

// Messages with {NAME}, {PRODUCT}, {DISCOUNT}, {COUPON} placeholders
const remarketingMessages = [
  // Manhã - Motivacional (com cupom)
  {
    title: "Bom dia, {NAME}! ☀️ Presente especial pra você",
    content: `Bom dia, {NAME}! ☀️

Acordei pensando em você... e na oportunidade que está esperando sua decisão!

Para te ajudar a dar esse passo, preparei um **presente especial**:

🎁 **Cupom exclusivo: {COUPON}**
💰 **{DISCOUNT}% de desconto** em {PRODUCT}!

Esse cupom foi feito especialmente para você e expira em breve.

🌟 **Hoje é o dia perfeito para começar.**

Não deixe o medo te impedir de alcançar o que você merece. Bora junto?`,
    hasCoupon: true
  },
  {
    title: "Ei, {NAME}! 🚀 Vim te dar um empurrãozinho",
    content: `Oi, {NAME}! Tudo bem? ☀️

Passou pela minha cabeça agora cedo que você ainda não finalizou sua compra de {PRODUCT}...

Olha, eu sei que às vezes a gente precisa de um empurrãozinho. Então deixa eu te dar um motivo extra:

🎁 **Cupom: {COUPON}**
💰 **{DISCOUNT}% OFF** só pra você!

💡 **Pensa comigo:** Qual versão de você vai existir daqui a um mês? A que tomou atitude ou a que deixou passar?

Estou aqui torcendo por você! 🙌`,
    hasCoupon: true
  },
  // Manhã - Sem cupom
  {
    title: "Bom dia, {NAME}! ☀️ Seu sucesso te espera",
    content: `Bom dia, {NAME}! ☀️

Acordei pensando em você... e na oportunidade que está esperando sua decisão!

Sabe aquele momento em que a gente sente que precisa dar um passo? **Esse momento é AGORA.**

Os créditos de {PRODUCT} que você escolheu podem ser o combustível que faltava para você decolar. Imagina daqui a uma semana, olhando para trás e pensando: "Ainda bem que eu fiz isso!"

🌟 **Hoje é o dia perfeito para começar.**

Não deixe o medo te impedir de alcançar o que você merece. Bora junto?`,
    hasCoupon: false
  },
  // Tarde - Urgência (com cupom)
  {
    title: "⚡ {NAME}, olha só o que eu consegui pra você!",
    content: `Ei, {NAME}! Passando rapidinho aqui...

Já é tarde e você ainda não garantiu {PRODUCT}! 😱

Consegui liberar um **desconto especial** só pra você:

🎁 **Use o cupom: {COUPON}**
💰 **{DISCOUNT}% de desconto!**

⏰ **O melhor momento era ontem. O segundo melhor é AGORA.**

Vamos fazer acontecer? Estou aqui esperando você do outro lado! 💚`,
    hasCoupon: true
  },
  {
    title: "🔥 {NAME}, você está deixando passar!",
    content: `Opa, {NAME}! Tudo bem?

Olha, vou ser direto com você: **cada minuto que passa é uma oportunidade escapando.**

Eu sei que você veio até aqui porque quer algo melhor. Você não é alguém que fica parado esperando as coisas acontecerem, né?

Para te ajudar, liberei um cupom exclusivo:

🎁 **{COUPON}** = **{DISCOUNT}% OFF** em {PRODUCT}

Seja qual for o motivo da hesitação, saiba que **os melhores resultados vêm para quem age rápido.**

Bora transformar essa vontade em ação? 🚀`,
    hasCoupon: true
  },
  // Tarde - Sem cupom
  {
    title: "⚡ {NAME}, não deixe para amanhã!",
    content: `Ei, {NAME}! Passando rapidinho aqui...

Já é tarde e você ainda não garantiu {PRODUCT}! 😱

Eu entendo que a vida é corrida, mas pensa comigo: **quanto tempo você já perdeu pensando nisso?**

Enquanto você hesita, outras pessoas estão lá na frente colhendo resultados. Não deixe o "depois" roubar suas conquistas!

⏰ **O melhor momento era ontem. O segundo melhor é AGORA.**

Vamos fazer acontecer? Estou aqui esperando você do outro lado! 💚`,
    hasCoupon: false
  },
  // Noite - Reflexão (com cupom)
  {
    title: "🌙 {NAME}, antes de dormir... um presente",
    content: `Boa noite, {NAME}! 🌙

Antes de você encerrar o dia, quero deixar uma perguntinha:

**O que você fez hoje para chegar mais perto dos seus objetivos?**

Para te ajudar a tomar essa decisão, liberei um desconto especial:

🎁 **Cupom: {COUPON}**
💰 **{DISCOUNT}% OFF** em {PRODUCT}!

Imagina acordar amanhã sabendo que você tomou uma decisão importante hoje... Que sensação boa, né?

✨ **Não vá dormir com arrependimento. Vá dormir com a certeza de que agiu.**

Te espero! 💚`,
    hasCoupon: true
  },
  {
    title: "💭 {NAME}, última mensagem do dia...",
    content: `Ei, {NAME}, tudo bem? 🌙

O dia foi longo, eu sei. Mas antes de descansar, deixa eu te fazer uma pergunta sincera:

**O que está te impedindo?**

Medo? Dúvida? Procrastinação? 

Seja o que for, saiba que **as pessoas que vencem são as que agem mesmo com medo.**

Para te dar aquele empurrãozinho final:

🎁 **Cupom exclusivo: {COUPON}**
💰 **{DISCOUNT}% de desconto** em {PRODUCT}!

Você já demonstrou interesse, já escolheu o que quer... Só falta o último passo!

🌟 **Amanhã pode ser tarde demais. Hoje ainda dá tempo.**

Durma bem, mas antes... pensa nisso! 💭`,
    hasCoupon: true
  },
  // Noite - Sem cupom
  {
    title: "🌙 {NAME}, antes de dormir... uma reflexão",
    content: `Boa noite, {NAME}! 🌙

Antes de você encerrar o dia, quero deixar uma perguntinha:

**O que você fez hoje para chegar mais perto dos seus objetivos?**

Às vezes, um pequeno passo pode mudar tudo. E esse passo pode ser finalizar a compra de {PRODUCT} que você começou.

Imagina acordar amanhã sabendo que você tomou uma decisão importante hoje... Que sensação boa, né?

✨ **Não vá dormir com arrependimento. Vá dormir com a certeza de que agiu.**

Te espero! 💚`,
    hasCoupon: false
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

    console.log(`Processing remarketing for email: ${email}, pix: ${pixId}, name: ${userName}`);

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

    // Pick a random message based on time of day
    const hour = new Date().getHours();
    let messagePool;
    if (hour >= 6 && hour < 12) {
      messagePool = remarketingMessages.slice(0, 3); // Morning (2 with coupon, 1 without)
    } else if (hour >= 12 && hour < 18) {
      messagePool = remarketingMessages.slice(3, 6); // Afternoon (2 with coupon, 1 without)
    } else {
      messagePool = remarketingMessages.slice(6, 9); // Evening (2 with coupon, 1 without)
    }
    
    const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
    
    // Get personalized name
    const personalizedName = getGreeting(userName || '');
    
    // Generate discount and coupon if needed
    const discount = randomMessage.hasCoupon ? getRandomDiscount() : 0;
    const couponCode = randomMessage.hasCoupon ? generateCouponCode(discount) : '';
    
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
      const pushBody = randomMessage.hasCoupon 
        ? `🎁 ${personalizedName}, você ganhou ${discount}% OFF em ${productName}!`
        : `Você tem uma oferta exclusiva para ${productName}!`;
        
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
      // Don't throw, just log - push is optional
    }

    console.log("Remarketing message sent successfully", { hasCoupon: randomMessage.hasCoupon, discount, couponCode });

    return new Response(
      JSON.stringify({ success: true, hasCoupon: randomMessage.hasCoupon, discount, couponCode }),
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
