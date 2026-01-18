import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CreatePixRequest {
  value: number;
  productName: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  lovableInviteLink: string;
  userId?: string;
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
  lovableInviteLink: string;
  userId?: string;
  status: string;
  qrCode: string;
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
      lovable_invite_link: data.lovableInviteLink,
      user_id: data.userId || '',
      status: data.status,
      qr_code: data.qrCode,
      created_at: new Date().toISOString(),
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
      value, 
      productName, 
      productId, 
      customerName, 
      customerEmail, 
      customerPhone,
      lovableInviteLink,
      userId 
    } = req.body as CreatePixRequest;
    
    console.log('Creating PIX payment via Cakto:', { value, productName, productId, customerName, customerEmail });

    // Converter valor para centavos (Cakto exige valor em centavos)
    const valueInCentavos = Math.round(value * 100);

    if (valueInCentavos < 50) {
      return res.status(400).json({
        success: false,
        error: 'Valor mínimo é R$ 0,50'
      });
    }

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

    // 2. Criar pedido na Cakto com método de pagamento PIX
    const orderRequest = {
      product_name: productName,
      amount: valueInCentavos,
      payment_method: 'pix',
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    };

    const orderResponse = await fetch('https://api.cakto.com.br/public_api/orders/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRequest),
    });

    const orderData = await orderResponse.json();
    
    console.log('Cakto order response status:', orderResponse.status);
    console.log('Cakto order response:', JSON.stringify(orderData));

    if (!orderResponse.ok) {
      console.error('Cakto error:', orderData);
      const errorMsg = orderData.error || orderData.message || 'Erro ao criar pedido PIX';
      return res.status(400).json({
        success: false,
        error: errorMsg
      });
    }

    const orderId = orderData.id || orderData.order_id;
    if (!orderId) {
      console.error('Order ID not found in response:', orderData);
      return res.status(500).json({
        success: false,
        error: 'Pedido criado mas ID não encontrado na resposta'
      });
    }

    // 3. Buscar QR code do pedido (pode vir na resposta ou precisar buscar)
    let qrCode = orderData.qr_code || orderData.pix_qr_code || orderData.pix_code;
    let qrCodeBase64 = orderData.qr_code_base64 || orderData.qr_image || orderData.qr_code_image;

    // Se não veio o QR code, buscar do pedido
    if (!qrCode) {
      const getOrderResponse = await fetch(`https://api.cakto.com.br/public_api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (getOrderResponse.ok) {
        const getOrderData = await getOrderResponse.json();
        qrCode = getOrderData.qr_code || getOrderData.pix_qr_code || getOrderData.pix_code;
        qrCodeBase64 = getOrderData.qr_code_base64 || getOrderData.qr_image || getOrderData.qr_code_image;
      }
    }

    if (!qrCode) {
      console.error('QR code not found in order:', orderData);
      return res.status(500).json({
        success: false,
        error: 'QR code PIX não encontrado na resposta da API'
      });
    }

    // 🔗 Send webhook to n8n with all payment data with status "pending"
    const webhookResult = await sendWebhookToN8N({
      pixId: orderId,
      productName,
      productId,
      value,
      customerName,
      customerEmail,
      customerPhone,
      lovableInviteLink,
      userId,
      status: 'pending',
      qrCode: qrCode,
    });
    
    console.log('Webhook to n8n result (pending):', webhookResult);

    return res.status(200).json({
      success: true,
      pixId: orderId,
      qrCode: qrCode,
      qrCodeBase64: qrCodeBase64 || qrCode,
      status: orderData.status || 'pending',
      value: value,
      productName,
      productId,
    });
  } catch (error: unknown) {
    console.error('Error in create-pix function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento';
    return res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
}
