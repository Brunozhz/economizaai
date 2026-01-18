import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CheckPixStatusRequest {
  pixId: string;
  productName?: string;
  productId?: string;
  value?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  lovableInviteLink?: string;
  userId?: string;
}

// Function to send webhook to n8n with payment data
async function sendWebhookToN8N(data: {
  pixId: string;
  productName: string;
  productId: string;
  value: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  lovableInviteLink?: string;
  userId?: string;
  status: string;
  qrCode: string;
  payerName?: string;
  payerDocument?: string;
  endToEndId?: string;
}) {
  const webhookUrl = process.env.VITE_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('VITE_WEBHOOK_URL not configured, skipping webhook');
    return { success: false, error: 'Webhook URL not configured' };
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
      lovable_invite_link: data.lovableInviteLink || '',
      user_id: data.userId || '',
      status: data.status,
      qr_code: data.qrCode,
      created_at: new Date().toISOString(),
      
      // Payment data (only available when paid)
      payer_name: data.payerName || '',
      payer_document: data.payerDocument || '',
      end_to_end_id: data.endToEndId || '',
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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientId = process.env.CAKTO_CLIENT_ID;
    const clientSecret = process.env.CAKTO_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('CAKTO_CLIENT_ID or CAKTO_CLIENT_SECRET not configured');
      throw new Error('Credenciais Cakto não configuradas');
    }

    const { 
      pixId, 
      productName, 
      productId,
      value,
      customerName,
      customerEmail,
      customerPhone,
      lovableInviteLink,
      userId,
    } = req.body as CheckPixStatusRequest;
    
    console.log('Checking PIX status for order:', pixId);
    console.log('With data:', { productName, productId, customerName, customerEmail });

    // 1. Obter access_token da Cakto
    const tokenResponse = await fetch('https://api.cakto.com.br/public_api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.json().catch(() => ({}));
      console.error('Erro ao obter token Cakto:', tokenError);
      return res.status(401).json({
        success: false,
        error: tokenError.error || 'Erro ao autenticar na API Cakto'
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Buscar status do pedido na Cakto
    const response = await fetch(`https://api.cakto.com.br/public_api/orders/${pixId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Cakto status response:', response.status);
    console.log('Cakto status data:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Cakto error:', data);
      throw new Error(data.message || data.error || 'Erro ao consultar pedido');
    }

    const effectiveStatus = data.status || data.payment_status || 'pending';
    console.log('Effective status:', effectiveStatus);

    // 🔔 When payment is approved: send webhook with payment confirmation
    const paidStatuses = ['paid', 'PAID', 'approved', 'APPROVED', 'completed', 'COMPLETED', 'pago'];
    if (paidStatuses.includes(effectiveStatus)) {
      // Value comes in centavos from PushinPay, but we receive `value` in reais from frontend
      const valueInReais = value || (data.value / 100);
      
      // 🔗 Send webhook to n8n with payment confirmation (status: paid)
      const webhookResult = await sendWebhookToN8N({
        pixId: data.id || pixId,
        productName: productName || '',
        productId: productId || '',
        value: valueInReais,
        customerName: customerName || data.payer_name || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        lovableInviteLink: lovableInviteLink || '',
        userId: userId || '',
        status: 'paid',
        qrCode: '', // QR code not needed for paid status
        payerName: data.payer_name,
        payerDocument: data.payer_national_registration,
        endToEndId: data.end_to_end_id || '',
      });
      
      console.log('Webhook to n8n result (paid):', webhookResult);
    }

    return res.status(200).json({
      success: true,
      pixId: data.id,
      status: effectiveStatus,
      value: data.value,
      payerName: data.payer_name || null,
      payerDocument: data.payer_national_registration,
      endToEndId: data.end_to_end_id || null,
    });
  } catch (error: unknown) {
    console.error('Error in check-pix-status function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao verificar status';
    return res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
}
