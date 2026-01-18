import type { VercelRequest, VercelResponse } from '@vercel/node';

type CreatePixBody = {
  value?: number;
  productName?: string;
  correlationID?: string;
};

function parseJsonBody<T>(req: VercelRequest): { body: T | null; error?: string } {
  const raw = req.body;
  if (raw === undefined || raw === null) return { body: null, error: 'Body vazio' };
  if (typeof raw === 'object') return { body: raw as T };
  if (typeof raw === 'string') {
    try {
      return { body: JSON.parse(raw) as T };
    } catch (err) {
      return { body: null, error: `JSON inválido: ${(err as Error).message}` };
    }
  }
  return { body: null, error: 'Formato de body não suportado' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { body, error: bodyError } = parseJsonBody<CreatePixBody>(req);
    if (!body) {
      return res.status(400).json({ error: bodyError || 'Body inválido' });
    }

    const { value, productName, correlationID } = body;

    if (!value || typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    if (!productName || typeof productName !== 'string' || !productName.trim()) {
      return res.status(400).json({ error: 'Nome do produto é obrigatório' });
    }

    const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
    const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';

    console.log('[CREATE-PIX] Variáveis de ambiente:', {
      hasApiKey: !!pushinPayApiKey,
      apiUrl: pushinPayApiUrl,
    });

    if (!pushinPayApiKey) {
      console.error('[CREATE-PIX] Chave da PushinPay não configurada');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    const finalCorrelationID =
      correlationID || `ORDER_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const pixPayload = {
      value: Math.round(value * 100), // centavos
      description: `Pagamento - ${productName}`,
      external_id: finalCorrelationID,
    };

    const chargeUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/pix/cashIn`;
    console.log('[CREATE-PIX] Chamando PushinPay:', chargeUrl, 'payload:', pixPayload);

    const response = await fetch(chargeUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pushinPayApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
        details: errorText?.slice(0, 500),
      });
    }

    const rawBody = await response.text();
    let data: any;
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr) {
      console.error('[CREATE-PIX] Resposta não JSON da PushinPay:', rawBody);
      return res.status(502).json({
        error: 'Falha ao interpretar resposta da PushinPay',
        status: 502,
        details: rawBody?.slice(0, 500) || 'Resposta vazia',
      });
    }

    console.log('[CREATE-PIX] Dados recebidos da PushinPay:', data);

    const brCode =
      data.brcode ||
      data.br_code ||
      data.emv ||
      data.qr_code ||
      data.qrcode ||
      data.pixCopiaECola ||
      '';

    const qrCodeImage =
      data.qr_code_base64 ||
      data.qrcode_base64 ||
      (brCode
        ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(brCode)}`
        : '');

    const correlation = data.id || finalCorrelationID;
    const expirationTime = 15 * 60 * 1000;
    const expiresAt =
      data.expires_at || data.expiration || new Date(Date.now() + expirationTime).toISOString();

    return res.status(200).json({
      success: true,
      correlationID: correlation,
      value: (data.value ?? pixPayload.value) / 100,
      brCode,
      qrCodeImage,
      paymentLink: '',
      expiresAt,
      expiresIn: 0,
      status: data.status || 'created',
    });
  } catch (error) {
    console.error('[CREATE-PIX] Erro no handler:', error);
    return res.status(500).json({
      error: 'Erro interno ao processar pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    });
  }
}
