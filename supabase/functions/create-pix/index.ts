import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PUSHINPAY_API_KEY');
    
    if (!apiKey) {
      console.error('PUSHINPAY_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const { value, productName, productId } = await req.json();
    
    console.log('Creating PIX payment:', { value, productName, productId });

    // PushinPay has a limit of R$ 150.00
    if (value > 150) {
      console.error('Value exceeds PushinPay limit:', value);
      return new Response(JSON.stringify({
        success: false,
        error: 'Valor máximo para PIX é R$ 150,00. Escolha um pacote menor ou entre em contato com o suporte.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PushinPay expects value in centavos (cents)
    const valueInCentavos = Math.round(value * 100);

    if (valueInCentavos < 50) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Valor mínimo é R$ 0,50'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: valueInCentavos,
      }),
    });

    const data = await response.json();
    
    console.log('PushinPay response status:', response.status);
    console.log('PushinPay response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('PushinPay error:', data);
      const errorMsg = data.error || data.message || 'Erro ao criar PIX';
      return new Response(JSON.stringify({
        success: false,
        error: errorMsg
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      pixId: data.id,
      qrCode: data.qr_code,
      qrCodeBase64: data.qr_code_base64,
      status: data.status,
      value: data.value,
      productName,
      productId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in create-pix function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
