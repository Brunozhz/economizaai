import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Endpoint de diagnóstico para capturar a resposta bruta da PushinPay.
 * Protegido por token simples para evitar uso público.
 *
 * Uso (POST):
 *   /api/pushinpay-probe?token=SEU_TOKEN
 *   body: { value: number, productName: string }
 *
 * Configure em produção:
 *   PUSHINPAY_DEBUG_TOKEN=<um token forte>
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const debugToken = process.env.PUSHINPAY_DEBUG_TOKEN;
  if (!debugToken) {
    return res.status(500).json({ error: 'Debug token não configurado' });
  }

  const provided = (req.query.token as string) || '';
  if (provided !== debugToken) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const { value, productName } = req.body || {};
  if (!value || typeof value !== 'number' || value <= 0) {
    return res.status(400).json({ error: 'Valor inválido' });
  }
  if (!productName || typeof productName !== 'string') {
    return res.status(400).json({ error: 'productName inválido' });
  }

  const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
  const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';
  if (!pushinPayApiKey) {
    return res.status(500).json({ error: 'PUSHINPAY_API_KEY não configurada' });
  }

  const payload = {
    value: Math.round(value * 100),
    description: `Pagamento - ${productName}`,
    external_id: `DEBUG_${Date.now()}`,
  };

  const chargeUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/pix/cashIn`;

  try {
    const response = await fetch(chargeUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pushinPayApiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text().catch(() => '');

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      raw: text?.slice(0, 1000) ?? '',
      hint:
        'Se status for 401/403, verifique a PUSHINPAY_API_KEY. Se 4xx com HTML, confira o endpoint/rota. Se 5xx, pode ser instabilidade PushinPay.',
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Falha ao chamar PushinPay',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
