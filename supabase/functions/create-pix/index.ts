import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate coupon code
function generateCouponCode(discount: number, dayNumber: number): string {
  const timestamp = Date.now().toString(36).slice(-4).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VOLTA${discount}D${dayNumber}-${timestamp}${random}`;
}

// Get base URL for recovery links
function getBaseUrl(): string {
  return Deno.env.get('APP_BASE_URL') || 'https://economizaai.lovable.app';
}

// Generate recovery link with coupon
function generateRecoveryLink(productName: string, couponCode: string, discount: number): string {
  const baseUrl = getBaseUrl();
  const params = new URLSearchParams({
    remarketing: 'true',
    produto: productName,
    cupom: couponCode,
    desconto: discount.toString(),
  });
  return `${baseUrl}/?${params.toString()}`;
}

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
}, supabaseUrl: string, supabaseKey: string) {
  const webhookUrl = Deno.env.get('N8N_WEBHOOK_PIX_GERADO');
  
  if (!webhookUrl) {
    console.log('N8N_WEBHOOK_PIX_GERADO not configured, skipping webhook');
    return { success: false, error: 'Webhook URL not configured' };
  }
  
  // Generate 5 progressive coupons (10%, 15%, 20%, 25%, 30%)
  const coupon1Day = generateCouponCode(10, 1);
  const coupon2Days = generateCouponCode(15, 2);
  const coupon3Days = generateCouponCode(20, 3);
  const coupon4Days = generateCouponCode(25, 4);
  const coupon5Days = generateCouponCode(30, 5);
  
  // Calculate discounted values (rounded to 2 decimal places)
  const valorDesconto1 = Number((data.value * 0.10).toFixed(2));
  const valorDesconto2 = Number((data.value * 0.15).toFixed(2));
  const valorDesconto3 = Number((data.value * 0.20).toFixed(2));
  const valorDesconto4 = Number((data.value * 0.25).toFixed(2));
  const valorDesconto5 = Number((data.value * 0.30).toFixed(2));
  
  const valorFinal1 = Number((data.value - valorDesconto1).toFixed(2));
  const valorFinal2 = Number((data.value - valorDesconto2).toFixed(2));
  const valorFinal3 = Number((data.value - valorDesconto3).toFixed(2));
  const valorFinal4 = Number((data.value - valorDesconto4).toFixed(2));
  const valorFinal5 = Number((data.value - valorDesconto5).toFixed(2));
  
  // Generate recovery links
  const link1Day = generateRecoveryLink(data.productName, coupon1Day, 10);
  const link2Days = generateRecoveryLink(data.productName, coupon2Days, 15);
  const link3Days = generateRecoveryLink(data.productName, coupon3Days, 20);
  const link4Days = generateRecoveryLink(data.productName, coupon4Days, 25);
  const link5Days = generateRecoveryLink(data.productName, coupon5Days, 30);
  
  // Save coupons to database (valid for 1 day each, starting from their respective days)
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const now = new Date();
  
  // Each coupon expires 1 day after its activation day
  const expires1Day = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);   // Day 1 -> expires day 2
  const expires2Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);  // Day 2 -> expires day 3
  const expires3Days = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);  // Day 3 -> expires day 4
  const expires4Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);  // Day 4 -> expires day 5
  const expires5Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);  // Day 5 -> expires day 6
  
  // Insert all 5 coupons into remarketing_coupons table
  const couponsToInsert = [
    {
      email: data.customerEmail.toLowerCase().trim(),
      product_name: data.productName,
      product_price: data.value,
      coupon_code: coupon1Day,
      discount_percent: 10,
      pix_id: data.pixId,
      expires_at: expires1Day.toISOString(),
    },
    {
      email: data.customerEmail.toLowerCase().trim(),
      product_name: data.productName,
      product_price: data.value,
      coupon_code: coupon2Days,
      discount_percent: 15,
      pix_id: data.pixId,
      expires_at: expires2Days.toISOString(),
    },
    {
      email: data.customerEmail.toLowerCase().trim(),
      product_name: data.productName,
      product_price: data.value,
      coupon_code: coupon3Days,
      discount_percent: 20,
      pix_id: data.pixId,
      expires_at: expires3Days.toISOString(),
    },
    {
      email: data.customerEmail.toLowerCase().trim(),
      product_name: data.productName,
      product_price: data.value,
      coupon_code: coupon4Days,
      discount_percent: 25,
      pix_id: data.pixId,
      expires_at: expires4Days.toISOString(),
    },
    {
      email: data.customerEmail.toLowerCase().trim(),
      product_name: data.productName,
      product_price: data.value,
      coupon_code: coupon5Days,
      discount_percent: 30,
      pix_id: data.pixId,
      expires_at: expires5Days.toISOString(),
    },
  ];
  
  const { error: couponError } = await supabase
    .from('remarketing_coupons')
    .insert(couponsToInsert);
    
  if (couponError) {
    console.error('Error saving remarketing coupons:', couponError);
  } else {
    console.log('Saved 5 remarketing coupons for', data.customerEmail);
  }
  
  try {
    console.log('Sending webhook to n8n:', webhookUrl);
    
    const webhookPayload = {
      // Customer data
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
      
      // Coupon 1 (10% - Day 1)
      cupom_1_dia: coupon1Day,
      desconto_1_dia: 10,
      valor_desconto_1_dia: valorDesconto1,
      valor_final_1_dia: valorFinal1,
      link_cupom_1_dia: link1Day,
      expira_1_dia: expires1Day.toISOString(),
      
      // Coupon 2 (15% - Day 2)
      cupom_2_dias: coupon2Days,
      desconto_2_dias: 15,
      valor_desconto_2_dias: valorDesconto2,
      valor_final_2_dias: valorFinal2,
      link_cupom_2_dias: link2Days,
      expira_2_dias: expires2Days.toISOString(),
      
      // Coupon 3 (20% - Day 3)
      cupom_3_dias: coupon3Days,
      desconto_3_dias: 20,
      valor_desconto_3_dias: valorDesconto3,
      valor_final_3_dias: valorFinal3,
      link_cupom_3_dias: link3Days,
      expira_3_dias: expires3Days.toISOString(),
      
      // Coupon 4 (25% - Day 4)
      cupom_4_dias: coupon4Days,
      desconto_4_dias: 25,
      valor_desconto_4_dias: valorDesconto4,
      valor_final_4_dias: valorFinal4,
      link_cupom_4_dias: link4Days,
      expira_4_dias: expires4Days.toISOString(),
      
      // Coupon 5 (30% - Day 5)
      cupom_5_dias: coupon5Days,
      desconto_5_dias: 30,
      valor_desconto_5_dias: valorDesconto5,
      valor_final_5_dias: valorFinal5,
      link_cupom_5_dias: link5Days,
      expira_5_dias: expires5Days.toISOString(),
    };
    
    console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
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

    const { value, productName, productId, customerName, customerEmail, customerPhone, userId, isRecovery } = await req.json();
    
    console.log('Creating PIX payment:', { value, productName, productId, customerName, customerEmail, isRecovery: !!isRecovery });

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

    const notificationType = isRecovery ? '🔄 PIX Recuperado!' : '💰 PIX Gerado!';
    const notificationBody = isRecovery 
      ? `${customerName || 'Cliente'} recuperou carrinho: ${formattedValue} para ${productName}`
      : `${customerName || 'Cliente'} gerou um PIX de ${formattedValue} para ${productName}`;

    await notifyAdmins(
      supabaseUrl,
      supabaseKey,
      notificationType,
      notificationBody,
      {
        type: isRecovery ? 'pix_recovered' : 'pix_generated',
        pixId: data.id,
        productName,
        value,
        customerEmail,
      }
    );

    // 📩 Schedule remarketing ONLY if not a recovery (avoid duplicate remarketing loop)
    if (!isRecovery) {
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
    } else {
      console.log('Skipping remarketing for recovery PIX (avoiding loop)');
    }

    // 🔗 Send webhook to n8n with all payment data (always send for payment approval automation)
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
    }, supabaseUrl, supabaseKey);
    
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
