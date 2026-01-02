import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to notify admins
async function notifyAdmins(supabaseUrl: string, supabaseKey: string, title: string, body: string, data?: Record<string, unknown>) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-push`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        admin_only: true,
        data,
      }),
    });
    
    const result = await response.json();
    console.log('Admin notification result:', result);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PUSHINPAY_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!apiKey) {
      console.error('PUSHINPAY_API_KEY not configured');
      throw new Error('API key not configured');
    }

    const { pixId, productName, value } = await req.json();
    
    console.log('Checking PIX status for:', pixId);

    const response = await fetch(`https://api.pushinpay.com.br/api/transactions/${pixId}`, {
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

    // 🔔 Send push notification to admins when payment is approved
    if (data.status === 'paid' || data.status === 'approved' || data.status === 'completed') {
      const formattedValue = value 
        ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100)
        : `R$ ${(data.value / 100).toFixed(2)}`;

      await notifyAdmins(
        supabaseUrl,
        supabaseKey,
        '✅ Venda Aprovada!',
        `PIX de ${formattedValue} foi pago${data.payer_name ? ` por ${data.payer_name}` : ''}${productName ? ` - ${productName}` : ''}`,
        {
          type: 'pix_approved',
          pixId: data.id,
          productName,
          value: data.value,
          payerName: data.payer_name,
        }
      );
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
