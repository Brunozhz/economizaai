import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  },
  // Extra - Escassez
  {
    title: "⏳ O tempo está passando...",
    content: `Oi! Tudo bem?

Já faz um tempinho que você começou o processo de compra e ainda não finalizou...

Eu fico aqui pensando: será que você está esperando o momento perfeito? 

Spoiler: **o momento perfeito não existe.** O que existe é o momento em que você decide agir!

Cada dia que passa é um dia a menos para você aproveitar os benefícios. Não deixe isso escapar!

🎯 **Tome a decisão. Faça acontecer. Seja a mudança.**

Estou aqui torcendo por você! 💚`
  },
  {
    title: "🎁 Ainda guardando seu lugar...",
    content: `Ei! 

Só passando para avisar que ainda estou aqui, guardando sua oportunidade...

Mas confesso que fico preocupado. Será que você desistiu? Será que algo te impediu?

Se for dúvida, me conta! Estou aqui para ajudar.

Se for medo, lembra: **coragem não é ausência de medo, é agir apesar dele.**

💪 **Você é capaz. Você merece. Você consegue.**

Bora finalizar isso juntos?`
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

    console.log("Starting remarketing cron job...");

    // Get all non-converted leads that haven't received a message in the last 8 hours
    // This ensures max 3 messages per day (24h / 8h = 3)
    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();

    const { data: leads, error: fetchError } = await supabase
      .from("abandoned_carts")
      .select("*")
      .eq("is_converted", false)
      .or(`last_remarketing_at.is.null,last_remarketing_at.lt.${eightHoursAgo}`);

    if (fetchError) {
      console.error("Error fetching leads:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${leads?.length || 0} leads to send remarketing`);

    if (!leads || leads.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No leads to process" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sentCount = 0;
    let errorCount = 0;

    for (const lead of leads) {
      try {
        // Check if lead has made a purchase (converted)
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("status", "paid")
          .or(`user_id.eq.${lead.user_id},pix_code.eq.${lead.pix_id}`)
          .single();

        if (purchase) {
          // Mark as converted
          await supabase
            .from("abandoned_carts")
            .update({ is_converted: true })
            .eq("id", lead.id);
          
          console.log(`Lead ${lead.email} converted, skipping`);
          continue;
        }

        // Pick a random message based on time of day
        const hour = new Date().getHours();
        let messagePool;
        if (hour >= 6 && hour < 12) {
          messagePool = remarketingMessages.slice(0, 2); // Morning
        } else if (hour >= 12 && hour < 18) {
          messagePool = remarketingMessages.slice(2, 4); // Afternoon
        } else if (hour >= 18 && hour < 22) {
          messagePool = remarketingMessages.slice(4, 6); // Evening
        } else {
          messagePool = remarketingMessages.slice(6, 8); // Late night / early morning
        }
        
        const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];

        // Insert the message
        const { error: messageError } = await supabase
          .from("messages")
          .insert({
            email: lead.email,
            phone: lead.phone,
            user_id: lead.user_id,
            title: randomMessage.title,
            content: randomMessage.content,
            type: "remarketing",
            product_name: lead.product_name,
            product_price: lead.product_price,
            pix_id: lead.pix_id,
          });

        if (messageError) {
          console.error(`Error sending message to ${lead.email}:`, messageError);
          errorCount++;
          continue;
        }

        // Update the lead
        await supabase
          .from("abandoned_carts")
          .update({
            remarketing_count: lead.remarketing_count + 1,
            last_remarketing_at: new Date().toISOString(),
          })
          .eq("id", lead.id);

        sentCount++;
        console.log(`Sent remarketing to ${lead.email}, count: ${lead.remarketing_count + 1}`);

      } catch (leadError) {
        console.error(`Error processing lead ${lead.email}:`, leadError);
        errorCount++;
      }
    }

    console.log(`Remarketing cron completed. Sent: ${sentCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: leads.length,
        sent: sentCount,
        errors: errorCount 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in remarketing-cron:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
