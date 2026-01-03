import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, email } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const systemPrompt = `Você é o assistente de suporte da nossa loja de créditos Lovable. Seja educado, prestativo e profissional.

INSTRUÇÕES IMPORTANTES:
1. Se o cliente ainda não informou o email, peça educadamente o email para que possamos entrar em contato.
2. Responda dúvidas sobre:
   - Nossos planos e créditos
   - Formas de pagamento (PIX)
   - Como usar os créditos
   - Problemas com pagamentos
   - Promoções e cupons
3. Se a dúvida for muito específica ou precisar de atendimento humano, informe que um de nossos atendentes irá responder em breve.
4. Mantenha respostas curtas e objetivas (máximo 3 frases).
5. Use emojis com moderação para tornar a conversa amigável.

INFORMAÇÕES SOBRE A LOJA:
- Vendemos créditos para uso na plataforma Lovable
- Pagamento via PIX instantâneo
- Cupons de desconto disponíveis para novos clientes
- Suporte disponível 24/7`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Serviço temporariamente indisponível." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Erro ao processar mensagem");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";

    // Update conversation in database
    if (conversationId) {
      const updatedMessages = [...messages, { role: "assistant", content: assistantMessage }];
      
      await supabase
        .from('support_conversations')
        .update({ 
          messages: updatedMessages,
          email: email || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    }

    console.log("Support chat response generated successfully");

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      conversationId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Support chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
