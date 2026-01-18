import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CreatePixPayload {
  value: number;
  productName: string;
  correlationID?: string;
}

interface OpenPixCharge {
  correlationID: string;
  value: number;
  comment?: string;
  identifier?: string;
}

interface OpenPixResponse {
  charge: {
    status: string;
    correlationID: string;
    value: number;
    brCode: string;
    expiresIn: number;
    expiresDate: string;
    paymentLinkUrl: string;
    qrCodeImage: string;
  };
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
    const { value, productName, correlationID }: CreatePixPayload = req.body;

    // Validação
    if (!value || value <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    if (!productName) {
      return res.status(400).json({ error: 'Nome do produto é obrigatório' });
    }

    // Credenciais da API
    const clientId = process.env.PAYMENT_CLIENT_ID;
    const clientSecret = process.env.PAYMENT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Credenciais de pagamento não configuradas');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    // Gera correlationID único se não fornecido
    const finalCorrelationID = correlationID || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Payload para criar cobrança PIX
    const pixPayload: OpenPixCharge = {
      correlationID: finalCorrelationID,
      value: Math.round(value * 100), // Converte para centavos
      comment: `Pagamento - ${productName}`,
    };

    console.log('Criando cobrança PIX:', { correlationID: finalCorrelationID, value: pixPayload.value });

    // Chama API OpenPix para criar cobrança
    const response = await fetch('https://api.openpix.com.br/api/v1/charge', {
      method: 'POST',
      headers: {
        'Authorization': clientSecret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pixPayload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro ao criar cobrança PIX:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'Falha ao criar cobrança PIX',
        details: errorData 
      });
    }

    const data: OpenPixResponse = await response.json();

    console.log('Cobrança PIX criada com sucesso:', data.charge.correlationID);

    // Retorna dados do PIX para o frontend
    return res.status(200).json({
      success: true,
      correlationID: data.charge.correlationID,
      value: data.charge.value / 100, // Converte de centavos para reais
      brCode: data.charge.brCode, // Código PIX Copia e Cola
      qrCodeImage: data.charge.qrCodeImage, // URL da imagem do QR Code
      paymentLink: data.charge.paymentLinkUrl,
      expiresAt: data.charge.expiresDate,
      expiresIn: data.charge.expiresIn,
      status: data.charge.status,
    });

  } catch (error) {
    console.error('Erro no handler create-pix:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao processar pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
