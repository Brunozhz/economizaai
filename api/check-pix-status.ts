import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CheckStatusPayload {
  correlationID: string;
}

interface OpenPixChargeStatus {
  charge: {
    status: string;
    correlationID: string;
    value: number;
    brCode?: string;
    expiresDate?: string;
    paidAt?: string;
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Aceita GET e POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Suporta correlationID via query param (GET) ou body (POST)
    const correlationID = req.method === 'GET' 
      ? (req.query.correlationID as string)
      : (req.body as CheckStatusPayload).correlationID;

    // Validação
    if (!correlationID) {
      return res.status(400).json({ error: 'correlationID é obrigatório' });
    }

    // Credenciais da API
    const clientId = process.env.PAYMENT_CLIENT_ID;
    const clientSecret = process.env.PAYMENT_CLIENT_SECRET;
    const paymentApiUrl = process.env.PAYMENT_API_URL || 'https://api.openpix.com.br/api/v1';

    if (!clientId || !clientSecret) {
      console.error('Credenciais de pagamento não configuradas');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    console.log('Verificando status do PIX:', correlationID);

    const statusUrl = `${paymentApiUrl.replace(/\/$/, '')}/charge?correlationID=${encodeURIComponent(correlationID)}`;

    const authAttempts = [
      {
        label: 'auth-appid',
        headers: { 'Authorization': clientId },
      },
      {
        label: 'auth-secret',
        headers: { 'Authorization': clientSecret },
      },
      {
        label: 'bearer-appid',
        headers: { 'Authorization': `Bearer ${clientId}` },
      },
      {
        label: 'basic-appid-secret',
        headers: { 'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` },
      },
    ];

    let response: Response | null = null;
    let lastAttemptLabel = 'auth-appid';

    for (const attempt of authAttempts) {
      lastAttemptLabel = attempt.label;
      response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          ...attempt.headers,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 401) {
        break;
      }
    }

    if (!response) {
      return res.status(500).json({ error: 'Falha ao conectar com a API de pagamento' });
    }

    if (!response.ok) {
      let errorData: string;
      try {
        errorData = await response.text();
        console.error('Erro ao verificar status PIX:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
      } catch (e) {
        errorData = `Erro ao ler resposta: ${e}`;
      }
      return res.status(response.status).json({ 
        error: 'Falha ao verificar status do pagamento',
        status: response.status,
        statusText: response.statusText,
        authAttempt: lastAttemptLabel,
        details: errorData 
      });
    }

    const data: OpenPixChargeStatus = await response.json();

    console.log('Status PIX obtido:', {
      correlationID: data.charge.correlationID,
      status: data.charge.status
    });

    // Retorna status do pagamento
    return res.status(200).json({
      success: true,
      correlationID: data.charge.correlationID,
      status: data.charge.status, // ACTIVE, COMPLETED, EXPIRED
      value: data.charge.value / 100, // Converte de centavos para reais
      paidAt: data.charge.paidAt,
      expiresAt: data.charge.expiresDate,
      isPaid: data.charge.status === 'COMPLETED',
      isExpired: data.charge.status === 'EXPIRED',
      isActive: data.charge.status === 'ACTIVE',
    });

  } catch (error) {
    console.error('Erro no handler check-pix-status:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao verificar pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
