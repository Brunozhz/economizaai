import type { VercelRequest, VercelResponse } from '@vercel/node';

type WebhookPayload = {
  status?: string;
  correlationID?: string;
  [key: string]: any;
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { body, error: bodyError } = parseJsonBody<WebhookPayload>(req);
    if (!body) {
      return res.status(400).json({ error: bodyError || 'Payload inválido' });
    }

    const { status, correlationID } = body;

    if (!status || !correlationID) {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    const webhookUrl = process.env.WEBHOOK_URL || process.env.VITE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('WEBHOOK_URL não configurada. Webhook não será enviado.');
      return res.status(200).json({
        success: false,
        message: 'Webhook URL não configurada',
      });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Erro ao enviar webhook:', {
        status: response.status,
        statusText: response.statusText,
      });
      return res.status(response.status).json({
        success: false,
        error: 'Falha ao enviar webhook',
        status: response.status,
      });
    }

    console.log('Webhook enviado com sucesso:', status);
    return res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Erro no handler send-webhook:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar webhook',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    });
  }
}
