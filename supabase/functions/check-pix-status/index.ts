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

    const { pixId } = await req.json();
    
    console.log('Checking PIX status for:', pixId);

    const response = await fetch(`https://api.pushinpay.com.br/api/pix/cashIn/${pixId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('PushinPay status response:', response.status);
    console.log('PushinPay status data:', JSON.stringify(data));

    if (!response.ok) {
      console.error('PushinPay error:', data);
      throw new Error(data.message || 'Erro ao consultar PIX');
    }

    return new Response(JSON.stringify({
      success: true,
      pixId: data.id,
      status: data.status,
      value: data.value,
      payerName: data.payer_name,
      payerDocument: data.payer_national_registration,
      endToEndId: data.end_to_end_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error in check-pix-status function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar status';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
