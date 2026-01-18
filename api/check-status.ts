import type { VercelRequest, VercelResponse } from '@vercel/node';

type CheckStatusBody = {
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    let correlationID: string | undefined;
    if (req.method === 'GET') {
      const q = req.query?.correlationID;
      correlationID = Array.isArray(q) ? q[0] : q;
    } else {
      const { body, error: bodyError } = parseJsonBody<CheckStatusBody>(req);
      if (!body) {
        return res.status(400).json({ error: bodyError || 'Body inválido' });
      }
      correlationID = body.correlationID;
    }

    if (!correlationID) {
      return res.status(400).json({ error: 'correlationID é obrigatório' });
    }

    const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
    const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';

    if (!pushinPayApiKey) {
      console.error('[API CHECK-STATUS] Chave da PushinPay não configurada');
      return res.status(500).json({
        error: 'Configuração de pagamento não disponível',
        success: false,
      });
    }

    console.log('[API CHECK-STATUS] Verificando status do PIX:', correlationID);

    const statusUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/transactions/${encodeURIComponent(
      correlationID
    )}`;

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${pushinPayApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => 'Erro desconhecido');
      console.error('[API CHECK-STATUS] Erro ao verificar status PIX:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return res.status(response.status).json({
        error: 'Falha ao verificar status do pagamento',
        success: false,
        status: 'ACTIVE',
        isPaid: false,
        isExpired: false,
        isActive: true,
        details: errorData?.slice(0, 500),
      });
    }

    const rawBody = await response.text();
    let data: any;
    try {
      data = JSON.parse(rawBody);
    } catch (err) {
      console.error('[API CHECK-STATUS] Resposta não JSON da PushinPay:', rawBody);
      return res.status(502).json({
        error: 'Falha ao interpretar resposta da PushinPay',
        success: false,
        status: 'ACTIVE',
        isPaid: false,
        isExpired: false,
        isActive: true,
        details: rawBody?.slice(0, 500) || 'Resposta vazia',
      });
    }

    const status = data.status || 'created';
    const isPaid = ['paid', 'PAID', 'completed', 'COMPLETED'].includes(status);
    const isExpired = ['canceled', 'CANCELED', 'expired', 'EXPIRED'].includes(status);

    console.log('[API CHECK-STATUS] Status PIX obtido:', {
      correlationID: data.id || correlationID,
      status,
      isPaid,
    });

    return res.status(200).json({
      success: true,
      correlationID: data.id || correlationID,
      status: status.toUpperCase(),
      isPaid,
      isExpired,
      isActive: !isPaid && !isExpired,
      value: data.value ? data.value / 100 : 0,
      paidAt: data.paidAt,
      expiresAt: data.expiresDate,
    });
  } catch (error) {
    console.error('[API CHECK-STATUS] Erro no handler:', error);

    return res.status(200).json({
      success: false,
      error: 'Erro interno ao verificar pagamento',
      status: 'ACTIVE',
      isPaid: false,
      isExpired: false,
      isActive: true,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    });
  }
}
