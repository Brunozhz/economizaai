import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, whatsapp, plano } = await req.json();
    
    const webhookPayload = {
      email: email || 'emailteste@agenciapara.com',
      whatsapp: whatsapp || '55997029710',
      status: 'paid',
      plano: plano || 'Start - 50 Créditos',
    };
    
    console.log('Sending test payment webhook:', webhookPayload);
    
    const response = await fetch('https://n8n.infinityunlocker.com.br/webhook/v1/pagamento-confirmado', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });
    
    const responseText = await response.text();
    console.log('Webhook response status:', response.status);
    console.log('Webhook response:', responseText);
    
    return new Response(JSON.stringify({
      success: response.ok,
      status: response.status,
      webhookResponse: responseText,
      sentPayload: webhookPayload,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
