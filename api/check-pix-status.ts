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

    if (!clientId) {
      console.error('Credenciais de pagamento não configuradas');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    console.log('Verificando status do PIX:', correlationID);

    // Chama API OpenPix para verificar status
    // OpenPix usa o CLIENT_ID no header Authorization
    const response = await fetch(
      `https://api.openpix.com.br/api/v1/charge?correlationID=${encodeURIComponent(correlationID)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': clientId, // OpenPix usa o CLIENT_ID como Authorization
          'Content-Type': 'application/json',
        },
      }
    );

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
