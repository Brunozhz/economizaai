import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to send webhook to n8n
async function sendWebhookToN8N(data: {
  pixId: string;
  productName: string;
  productId: string;
  value: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  userId?: string;
  status: string;
  qrCode: string;
}) {
  const webhookUrl = 'https://n8n.infinityunlocker.com.br/webhook-test/pix-gerado';
  
  try {
    console.log('Sending webhook to n8n:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pix_id: data.pixId,
        produto: data.productName,
        produto_id: data.productId,
        valor: data.value,
        nome: data.customerName,
        email: data.customerEmail,
        whatsapp: data.customerPhone || '',
        user_id: data.userId || '',
        status: data.status,
        qr_code: data.qrCode,
        created_at: new Date().toISOString(),
      }),
    });
    
    console.log('Webhook response status:', response.status);
    const result = await response.text();
    console.log('Webhook response:', result);
    
    return { success: true, status: response.status };
  } catch (error) {
    console.error('Error sending webhook to n8n:', error);
    return { success: false, error };
  }
}

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

// Function to schedule remarketing after 2 minutes
async function scheduleRemarketing(
  supabaseUrl: string, 
  supabaseKey: string, 
  pixId: string,
  customerEmail: string,
  customerName: string,
  customerPhone: string | undefined,
  productName: string,
  value: number,
  userId: string | undefined
) {
  // Wait 2 minutes before checking if payment was made
  console.log(`Scheduling remarketing check for PIX ${pixId} in 2 minutes...`);
  
  await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)); // 2 minutes
  
  console.log(`Checking payment status for PIX ${pixId}...`);
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if payment was completed
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id, status')
    .eq('pix_code', pixId)
    .eq('status', 'paid')
    .single();
  
  if (purchase) {
    console.log(`PIX ${pixId} was paid, skipping remarketing`);
    return;
  }
  
  console.log(`PIX ${pixId} not paid, sending remarketing...`);
  
  // Send remarketing
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-remarketing`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        phone: customerPhone || '',
        productName,
        productPrice: value,
        pixId,
        userId,
      }),
    });
    
    const result = await response.json();
    console.log(`Remarketing sent for PIX ${pixId}:`, result);
  } catch (error) {
    console.error(`Error sending remarketing for PIX ${pixId}:`, error);
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

    const { value, productName, productId, customerName, customerEmail, customerPhone, userId } = await req.json();
    
    console.log('Creating PIX payment:', { value, productName, productId, customerName, customerEmail });

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

    // 🔔 Send push notification to admins about new PIX generated
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

    await notifyAdmins(
      supabaseUrl,
      supabaseKey,
      '💰 PIX Gerado!',
      `${customerName || 'Cliente'} gerou um PIX de ${formattedValue} para ${productName}`,
      {
        type: 'pix_generated',
        pixId: data.id,
        productName,
        value,
        customerEmail,
      }
    );

    // 📩 Schedule remarketing after 2 minutes if payment not completed
    // Using EdgeRuntime.waitUntil to run in background
    const remarketingTask = scheduleRemarketing(
      supabaseUrl,
      supabaseKey,
      data.id,
      customerEmail,
      customerName,
      customerPhone,
      productName,
      value,
      userId
    );

    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(remarketingTask);
    }

    // 🔗 Send webhook to n8n with all payment data
    const webhookResult = await sendWebhookToN8N({
      pixId: data.id,
      productName,
      productId,
      value,
      customerName,
      customerEmail,
      customerPhone,
      userId,
      status: data.status,
      qrCode: data.qr_code,
    });
    
    console.log('Webhook to n8n result:', webhookResult);

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
