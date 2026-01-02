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
}

const remarketingMessages = [
  // Manhã - Motivacional
  {
    title: "Bom dia! ☀️ Seu sucesso te espera",
    content: `Bom dia! ☀️

Acordei pensando em você... e na oportunidade que está esperando sua decisão!

Sabe aquele momento em que a gente sente que precisa dar um passo? **Esse momento é AGORA.**

Os créditos que você escolheu podem ser o combustível que faltava para você decolar. Imagine daqui a uma semana, olhando para trás e pensando: "Ainda bem que eu fiz isso!"

🌟 **Hoje é o dia perfeito para começar.**

Não deixe o medo te impedir de alcançar o que você merece. Bora junto?`
  },
  {
    title: "Rise and shine! 🚀 Oportunidade batendo na porta",
    content: `Oi! Tudo bem? ☀️

Passou pela minha cabeça agora cedo que você ainda não finalizou sua compra...

Olha, eu sei que às vezes a gente precisa de um empurrãozinho. Então deixa eu te lembrar: **você já deu o primeiro passo escolhendo investir em você.**

O que falta agora é só o clique final! 

💡 **Pensa comigo:** Qual versão de você vai existir daqui a um mês? A que tomou atitude ou a que deixou passar?

Estou aqui torcendo por você! 🙌`
  },
  // Tarde - Urgência
  {
    title: "⚡ Não deixe para amanhã!",
    content: `Ei! Passando rapidinho aqui...

Já é tarde e você ainda não garantiu seus créditos! 😱

Eu entendo que a vida é corrida, mas pensa comigo: **quanto tempo você já perdeu pensando nisso?**

Enquanto você hesita, outras pessoas estão lá na frente colhendo resultados. Não deixe o "depois" roubar suas conquistas!

⏰ **O melhor momento era ontem. O segundo melhor é AGORA.**

Vamos fazer acontecer? Estou aqui esperando você do outro lado! 💚`
  },
  {
    title: "🔥 Você está perdendo tempo precioso!",
    content: `Opa! Tudo bem?

Olha, vou ser direto com você: **cada minuto que passa é uma oportunidade escapando.**

Eu sei que você veio até aqui porque quer algo melhor. Você não é alguém que fica parado esperando as coisas acontecerem, né?

Então por que ainda não finalizou? 🤔

Seja qual for o motivo, saiba que **os melhores resultados vêm para quem age rápido.**

Bora transformar essa vontade em ação? 🚀`
  },
  // Noite - Reflexão
  {
    title: "🌙 Antes de dormir... uma reflexão",
    content: `Boa noite! 🌙

Antes de você encerrar o dia, quero deixar uma perguntinha:

**O que você fez hoje para chegar mais perto dos seus objetivos?**

Às vezes, um pequeno passo pode mudar tudo. E esse passo pode ser finalizar a compra que você começou.

Imagina acordar amanhã sabendo que você tomou uma decisão importante hoje... Que sensação boa, né?

✨ **Não vá dormir com arrependimento. Vá dormir com a certeza de que agiu.**

Te espero! 💚`
  },
  {
    title: "💭 Última mensagem do dia...",
    content: `Ei, tudo bem? 🌙

O dia foi longo, eu sei. Mas antes de descansar, deixa eu te fazer uma pergunta sincera:

**O que está te impedindo?**

Medo? Dúvida? Procrastinação? 

Seja o que for, saiba que **as pessoas que vencem são as que agem mesmo com medo.**

Você já demonstrou interesse, já escolheu o que quer... Só falta o último passo!

🌟 **Amanhã pode ser tarde demais. Hoje ainda dá tempo.**

Durma bem, mas antes... pensa nisso! 💭`
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

    const { email, phone, productName, productPrice, pixId, userId }: RemarketingRequest = await req.json();

    console.log(`Processing remarketing for email: ${email}, pix: ${pixId}`);

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
      messagePool = remarketingMessages.slice(0, 2); // Morning
    } else if (hour >= 12 && hour < 18) {
      messagePool = remarketingMessages.slice(2, 4); // Afternoon
    } else {
      messagePool = remarketingMessages.slice(4, 6); // Evening
    }
    
    const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];

    // Insert the message
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        email,
        phone,
        user_id: userId || null,
        title: randomMessage.title,
        content: randomMessage.content,
        type: "remarketing",
        product_name: productName,
        product_price: productPrice,
        pix_id: pixId,
      });

    if (messageError) {
      console.error("Error inserting message:", messageError);
      throw messageError;
    }

    console.log("Remarketing message sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
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
