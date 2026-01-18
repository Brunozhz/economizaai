import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CheckStatusPayload {
  correlationID: string;
}

interface PushinPayChargeStatus {
  id?: string;
  status?: string;
  value?: number;
  brCode?: string;
  expiresDate?: string;
  paidAt?: string;
  createdAt?: string;
}

module.exports = async function handler(
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

    // Credenciais da PushinPay
    const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
    const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';

    if (!pushinPayApiKey) {
      console.error('Chave da PushinPay não configurada');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    console.log('Verificando status do PIX:', correlationID);

    const statusUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/transaction/${encodeURIComponent(correlationID)}`;

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${pushinPayApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

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

    const data: PushinPayChargeStatus = await response.json();

    const status = data.status || 'created';
    const isPaid = status === 'paid' || status === 'PAID' || status === 'completed' || status === 'COMPLETED';
    const isExpired = status === 'canceled' || status === 'CANCELED' || status === 'expired' || status === 'EXPIRED';

    console.log('Status PIX obtido:', {
      correlationID: data.id || correlationID,
      status
    });

    // Retorna status do pagamento
    return res.status(200).json({
      success: true,
      correlationID: data.id || correlationID,
      status: status.toUpperCase(), // CREATED/PAID/CANCELED
      value: data.value ? data.value / 100 : 0, // Converte de centavos para reais
      paidAt: data.paidAt,
      expiresAt: data.expiresDate,
      isPaid,
      isExpired,
      isActive: !isPaid && !isExpired,
    });

  } catch (error) {
    console.error('Erro no handler check-pix-status-pushinpay:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao verificar pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
