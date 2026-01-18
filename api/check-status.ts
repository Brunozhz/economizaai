import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: /api/check-status
 * 
 * Endpoint de verificação de status de pagamento PIX via PushinPay
 * ✅ Executa 100% no servidor (Vercel)
 * ✅ Usa process.env.PUSHINPAY_API_KEY (nunca exposta ao frontend)
 * ✅ Autentica com Bearer Token na API da PushinPay
 * ✅ Retorna apenas status essencial para o frontend
 * 
 * @version 2.0.2
 */

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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers para permitir requisições do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // ✅ SEGURANÇA: Usa variável de ambiente do servidor (nunca exposta ao frontend)
    const pushinPayApiKey = process.env.PUSHINPAY_API_KEY;
    const pushinPayApiUrl = process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com.br/api';

    if (!pushinPayApiKey) {
      console.error('[API CHECK-STATUS] Chave da PushinPay não configurada');
      return res.status(500).json({ 
        error: 'Configuração de pagamento não disponível',
        success: false 
      });
    }

    console.log('[API CHECK-STATUS] Verificando status do PIX:', correlationID);

    // ✅ Chama API da PushinPay com Bearer Token (servidor para servidor)
    const statusUrl = `${pushinPayApiUrl.replace(/\/$/, '')}/transaction/${encodeURIComponent(correlationID)}`;

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${pushinPayApiKey}`, // ✅ Chave de API segura
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData: string;
      try {
        errorData = await response.text();
        console.error('[API CHECK-STATUS] Erro ao verificar status PIX:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
      } catch (e) {
        errorData = `Erro ao ler resposta: ${e}`;
      }
      
      // Retorna erro genérico para o frontend (não expõe detalhes da API)
      return res.status(response.status).json({ 
        error: 'Falha ao verificar status do pagamento',
        success: false,
        status: 'ACTIVE', // Status padrão para continuar verificando
        isPaid: false,
        isExpired: false,
        isActive: true,
      });
    }

    const data = await response.json() as PushinPayChargeStatus;

    const status = data.status || 'created';
    const isPaid = status === 'paid' || status === 'PAID' || status === 'completed' || status === 'COMPLETED';
    const isExpired = status === 'canceled' || status === 'CANCELED' || status === 'expired' || status === 'EXPIRED';

    console.log('[API CHECK-STATUS] Status PIX obtido:', {
      correlationID: data.id || correlationID,
      status,
      isPaid
    });

    // ✅ Retorna apenas dados essenciais para o frontend
    return res.status(200).json({
      success: true,
      correlationID: data.id || correlationID,
      status: status.toUpperCase(), // CREATED/PAID/CANCELED
      isPaid, // ✅ Campo principal que o frontend precisa
      isExpired,
      isActive: !isPaid && !isExpired,
      // Dados adicionais (opcionais)
      value: data.value ? data.value / 100 : 0,
      paidAt: data.paidAt,
      expiresAt: data.expiresDate,
    });

  } catch (error) {
    console.error('[API CHECK-STATUS] Erro no handler:', error);
    
    // Retorna status padrão para o frontend continuar verificando
    return res.status(200).json({ 
      success: false,
      error: 'Erro interno ao verificar pagamento',
      status: 'ACTIVE',
      isPaid: false,
      isExpired: false,
      isActive: true,
    });
  }
}
