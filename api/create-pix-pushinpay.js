/**
 * API Route: /api/create-pix-pushinpay
 *
 * Cria cobrança PIX via PushinPay
 *
 * Observação: o projeto está como "type": "module".
 * Por isso exportamos com ESM (`export default`) para evitar
 * erros como "module is not defined in ES module scope".
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('[CREATE-PIX] Recebendo requisição:', req.body);

    const { value, productName, correlationID } = req.body;

    // Validação
    if (!value || value <= 0) {
      console.log('[CREATE-PIX] Valor inválido:', value);
      return res.status(400).json({ error: 'Valor inválido' });
    }

    if (!productName) {
      console.log('[CREATE-PIX] Nome do produto ausente');
      return res.status(400).json({ error: 'Nome do produto é obrigatório' });
    }

    // Credenciais da PushinPay
    const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
    const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';

    console.log('[CREATE-PIX] Variáveis de ambiente:', {
      hasApiKey: !!pushinPayApiKey,
      apiUrl: pushinPayApiUrl
    });

    if (!pushinPayApiKey) {
      console.error('[CREATE-PIX] Chave da PushinPay não configurada');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    // Gera correlationID único se não fornecido
    const finalCorrelationID = correlationID || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Payload para criar cobrança PIX (PushinPay)
    const pixPayload = {
      value: Math.round(value * 100), // Converte para centavos
      description: `Pagamento - ${productName}`,
      external_id: finalCorrelationID,
    };

    const chargeUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/pix/cashIn`;

    console.log('[CREATE-PIX] Chamando PushinPay:', chargeUrl);

    const response = await fetch(chargeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pushinPayApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pixPayload),
    });

    console.log('[CREATE-PIX] Resposta PushinPay:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      console.error('[CREATE-PIX] Erro ao criar PIX:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Falha ao criar cobrança PIX',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();

    console.log('[CREATE-PIX] Dados recebidos da PushinPay:', data);

    // Extrai código PIX (prioriza campos mais comuns)
    const brCode = data.brcode || data.br_code || data.emv || data.qr_code || data.qrcode || '';

    // Extrai QR Code (gera URL se não tiver imagem)
    const qrCodeImage = data.qr_code_base64 || data.qrcode_base64 || 
      (brCode ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(brCode)}` : '');

    const correlation = data.id || finalCorrelationID;

    // Calcula expiração de 15 minutos (900000ms)
    const expirationTime = 15 * 60 * 1000; // 15 minutos em milissegundos
    const expiresAt = data.expires_at || data.expiration || new Date(Date.now() + expirationTime).toISOString();

    // Retorna dados do PIX para o frontend
    return res.status(200).json({
      success: true,
      correlationID: correlation,
      value: (data.value ?? pixPayload.value) / 100,
      brCode,
      qrCodeImage,
      paymentLink: '',
      expiresAt: expiresAt,
      expiresIn: 0,
      status: data.status || 'created',
    });

  } catch (error) {
    console.error('[CREATE-PIX] Erro no handler:', error);
    console.error('[CREATE-PIX] Stack trace:', error.stack);
    return res.status(500).json({ 
      error: 'Erro interno ao processar pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
