import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CreatePixPayload {
  value: number;
  productName: string;
  correlationID?: string;
}

interface PushinPayChargeRequest {
  value: number;
  webhook_url?: string;
  external_id?: string;
  description?: string;
}

interface PushinPayResponse {
  id?: string;
  value?: number;
  status?: string;
  qr_code?: string;
  qrcode?: string;
  qr_code_base64?: string;
  qrcode_base64?: string;
  brcode?: string;
  br_code?: string;
  payment_code?: string;
  copy_paste?: string;
  emv?: string;
  emv_code?: string;
  expires_at?: string;
  expiration?: string;
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

    // Credenciais da PushinPay
    const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
    const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';

    if (!pushinPayApiKey) {
      console.error('Chave da PushinPay não configurada');
      return res.status(500).json({ error: 'Configuração de pagamento não disponível' });
    }

    // Gera correlationID único se não fornecido
    const finalCorrelationID = correlationID || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Payload para criar cobrança PIX (PushinPay)
    const pixPayload: PushinPayChargeRequest = {
      value: Math.round(value * 100), // Converte para centavos
      description: `Pagamento - ${productName}`,
      external_id: finalCorrelationID,
    };

    const chargeUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/pix/cashIn`;

    const response = await fetch(chargeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pushinPayApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(pixPayload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      return res.status(response.status).json({ 
        error: 'Falha ao criar cobrança PIX',
        status: response.status
      });
    }

    const data: PushinPayResponse = await response.json();

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
    console.error('Erro no handler create-pix-pushinpay:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao processar pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
