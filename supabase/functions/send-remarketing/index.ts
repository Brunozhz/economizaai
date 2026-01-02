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
  {
    title: "Ei, você esqueceu algo... 🎁",
    content: `Oi! Percebi que você estava quase lá... 

O PIX que você gerou ainda não foi pago, e eu entendo - às vezes a gente se distrai, né?

Mas olha, eu não quero que você perca essa oportunidade! Os créditos que você escolheu vão te ajudar a turbinar seus resultados.

⏰ **Seu PIX ainda está válido!**

Aproveita que ainda dá tempo, copia o código e finaliza. Eu prometo que você não vai se arrepender! 

Qualquer dúvida, estou aqui para ajudar. 💚`
  },
  {
    title: "Não deixe escapar! 🚀",
    content: `Opa, tudo bem?

Vi aqui que você começou uma compra mas não finalizou... 

Eu sei que às vezes a gente fica na dúvida, mas deixa eu te contar um segredo: **quem investe em si mesmo, colhe os resultados.**

Os créditos que você ia comprar podem ser exatamente o que falta para você dar aquele próximo passo!

💡 **Dica:** O PIX que você gerou ainda está ativo. É só copiar o código e pagar pelo app do seu banco!

Bora finalizar? Estou torcendo por você! ✨`
  },
  {
    title: "Última chance! ⚡",
    content: `Ei, voltei aqui rapidinho...

Seu PIX está prestes a expirar e eu ficaria muito triste se você perdesse essa chance!

Pensa comigo: você já deu o primeiro passo ao escolher os créditos. Agora só falta o último - o pagamento.

🔥 **Não deixe para depois o que pode mudar seu jogo hoje!**

Copia o código PIX e finaliza agora. Vai por mim, você merece isso!

Te espero do outro lado! 🎯`
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

    console.log(`Sending remarketing message for email: ${email}, pix: ${pixId}`);

    // Check if we already sent a message for this PIX
    const { data: existingMessage } = await supabase
      .from("messages")
      .select("id")
      .eq("pix_id", pixId)
      .single();

    if (existingMessage) {
      console.log("Message already sent for this PIX");
      return new Response(
        JSON.stringify({ success: true, message: "Already sent" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pick a random remarketing message
    const randomMessage = remarketingMessages[Math.floor(Math.random() * remarketingMessages.length)];

    // Insert the message
    const { error: insertError } = await supabase
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

    if (insertError) {
      console.error("Error inserting message:", insertError);
      throw insertError;
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
