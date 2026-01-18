import type { VercelRequest, VercelResponse } from '@vercel/node';

interface WebhookPayload {
  status: 'pending' | 'paid';
  correlationID: string;
  value: number;
  product: {
    name: string;
    credits: number;
    originalPrice: number;
    discountPrice: number;
    finalPrice: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    lovableLink: string;
  };
  timestamp: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const payload: WebhookPayload = req.body;

    // Validação básica
    if (!payload || !payload.status || !payload.correlationID) {
      return res.status(400).json({ error: 'Payload inválido' });
    }

    // Obtém URL do webhook da variável de ambiente
    // Tenta primeiro sem VITE_ (para servidor), depois com VITE_ (fallback)
    const webhookUrl = process.env.WEBHOOK_URL || process.env.VITE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('WEBHOOK_URL não configurada. Webhook não será enviado.');
      return res.status(200).json({ 
        success: false, 
        message: 'Webhook URL não configurada' 
      });
    }

    // Envia webhook via servidor (evita problemas de CORS)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Erro ao enviar webhook:', {
        status: response.status,
        statusText: response.statusText,
      });
      return res.status(response.status).json({ 
        success: false,
        error: 'Falha ao enviar webhook',
        status: response.status
      });
    }

    console.log('Webhook enviado com sucesso:', payload.status);
    return res.status(200).json({ 
      success: true,
      status: payload.status 
    });

  } catch (error) {
    console.error('Erro no handler send-webhook:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro interno ao processar webhook',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
