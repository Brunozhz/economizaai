import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Endpoint para simular um pagamento aprovado
 * Este endpoint simula que um PIX foi pago e envia o webhook
 * 
 * Uso (POST):
 *   /api/simulate-payment
 *   body: { correlationID: string, value?: number }
 */

interface SimulatePaymentBody {
  correlationID: string;
  value?: number;
  productName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  lovableLink?: string;
  product?: {
    name: string;
    credits: number;
    originalPrice: number;
    discountPrice: number;
    finalPrice: number;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { 
      correlationID, 
      value = 24.90, 
      productName = 'EconomizaAI Premium',
      customerName = 'Bruno Elias Santos',
      email = 'Brunoeliassantos097@gmail.com',
      phone = '47992683132',
      lovableLink = 'https://lovable.dev/invite/bruno-elias',
      product
    } = req.body as SimulatePaymentBody;

    if (!correlationID) {
      return res.status(400).json({ error: 'correlationID é obrigatório' });
    }

    console.log('[SIMULATE-PAYMENT] Simulando pagamento aprovado:', {
      correlationID,
      value,
      productName,
      customerName,
      email,
      phone
    });

    // Estrutura do produto (usa dados fornecidos ou valores padrão)
    const productData = product || {
      name: productName,
      credits: 500,
      originalPrice: 49.90,
      discountPrice: 24.90,
      finalPrice: value,
    };

    // Prepara o payload do webhook IDÊNTICO ao checkout real
    const webhookPayload = {
      status: 'paid',
      correlationID: correlationID,
      value: value,
      product: {
        name: productData.name,
        credits: productData.credits,
        originalPrice: productData.originalPrice,
        discountPrice: productData.discountPrice,
        finalPrice: productData.finalPrice,
      },
      customer: {
        name: customerName,
        email: email,
        phone: phone,
        lovableLink: lovableLink,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('[SIMULATE-PAYMENT] Payload do webhook:', webhookPayload);

    // Busca a URL do webhook
    const webhookUrl = process.env.WEBHOOK_URL || process.env.VITE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('[SIMULATE-PAYMENT] WEBHOOK_URL não configurada. Simulação criada mas webhook não enviado.');
      return res.status(200).json({
        success: true,
        simulated: true,
        webhookSent: false,
        message: 'Pagamento simulado mas webhook não enviado (URL não configurada)',
        payload: webhookPayload,
      });
    }

    // Envia o webhook
    console.log('[SIMULATE-PAYMENT] Enviando webhook para:', webhookUrl);

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Webhook-Event': 'pix.paid',
      },
      body: JSON.stringify(webhookPayload),
    });

    const webhookResponseText = await webhookResponse.text().catch(() => '');

    if (!webhookResponse.ok) {
      console.error('[SIMULATE-PAYMENT] Erro ao enviar webhook:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        response: webhookResponseText
      });

      return res.status(200).json({
        success: true,
        simulated: true,
        webhookSent: false,
        webhookError: {
          status: webhookResponse.status,
          message: webhookResponseText.slice(0, 500)
        },
        message: 'Pagamento simulado mas webhook falhou',
        payload: webhookPayload,
      });
    }

    console.log('[SIMULATE-PAYMENT] Webhook enviado com sucesso!');

    return res.status(200).json({
      success: true,
      simulated: true,
      webhookSent: true,
      message: 'Pagamento simulado e webhook enviado com sucesso',
      payload: webhookPayload,
      webhookResponse: {
        status: webhookResponse.status,
        body: webhookResponseText.slice(0, 500)
      }
    });

  } catch (error) {
    console.error('[SIMULATE-PAYMENT] Erro no handler:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao simular pagamento',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
    });
  }
}
