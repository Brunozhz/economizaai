// Tipos para a API de pagamento PushinPay
export interface CreatePixRequest {
  value: number;
  productName: string;
  correlationID?: string;
}

export interface PixPaymentData {
  success: boolean;
  correlationID: string;
  value: number;
  brCode: string; // Código PIX Copia e Cola
  qrCodeImage: string; // URL da imagem do QR Code
  paymentLink: string;
  expiresAt: string;
  expiresIn: number;
  status: string;
}

export interface PixStatusData {
  success: boolean;
  correlationID: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  value: number;
  paidAt?: string;
  expiresAt?: string;
  isPaid: boolean;
  isExpired: boolean;
  isActive: boolean;
}

export interface PaymentError {
  error: string;
  details?: string;
  message?: string;
}

export interface WebhookPayload {
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

/**
 * Cria uma nova cobrança PIX via PushinPay
 */
export async function createPixPayment(
  value: number,
  productName: string
): Promise<PixPaymentData> {
  try {
    const response = await fetch('/api/create-pix-pushinpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        productName,
      } as CreatePixRequest),
    });

    if (!response.ok) {
      const errorData: PaymentError = await response.json();
      throw new Error(errorData.error || 'Falha ao criar pagamento PIX');
    }

    const data: PixPaymentData = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    throw error;
  }
}

/**
 * Verifica o status de um pagamento PIX via PushinPay
 * ✅ Chama API route do servidor (/api/check-status)
 * ✅ Nunca expõe chaves de API ao frontend
 * ✅ Autenticação com PushinPay feita 100% no servidor
 * 
 * ATUALIZAÇÃO: Agora usa /api/check-status (seguro)
 */
export async function checkPixStatus(
  correlationID: string
): Promise<PixStatusData> {
  try {
    // ✅ Chama endpoint SEGURO no servidor (Vercel) - v2.0
    const response = await fetch(
      `/api/check-status?correlationID=${encodeURIComponent(correlationID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Para qualquer erro (404, 500, etc), retorna status padrão sem logar
      // Isso permite que a verificação continue sem poluir o console
      return {
        success: false,
        correlationID,
        status: 'ACTIVE',
        value: 0,
        isPaid: false,
        isExpired: false,
        isActive: true,
      };
    }

    const data: PixStatusData = await response.json();
    return data;
  } catch (error) {
    // Não loga erro para não poluir o console
    // Retorna status padrão para continuar verificando
    return {
      success: false,
      correlationID,
      status: 'ACTIVE',
      value: 0,
      isPaid: false,
      isExpired: false,
      isActive: true,
    };
  }
}

/**
 * Copia o código PIX para a área de transferência
 */
export async function copyPixCode(brCode: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(brCode);
      return true;
    } else {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = brCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (error) {
    console.error('Erro ao copiar código PIX:', error);
    return false;
  }
}

/**
 * Formata valor em reais
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata tempo restante para expiração
 */
export function formatTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffMs = expires.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expirado';
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (diffHours > 0) {
    return `${diffHours}h ${remainingMinutes}m`;
  }

  return `${diffMinutes} minutos`;
}

/**
 * Envia webhook para URL configurada via API route (evita problemas de CORS)
 */
export async function sendWebhook(payload: WebhookPayload): Promise<boolean> {
  try {
    // Envia webhook através da API route do próprio servidor (evita CORS)
    const response = await fetch('/api/send-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Não loga erro para não poluir o console
      return false;
    }

    const data = await response.json();
    if (data.success) {
      console.log('✅ Webhook enviado com sucesso:', payload.status);
      return true;
    }

    return false;
  } catch (error) {
    // Não loga erro para não poluir o console
    // Não lança erro para não interromper o fluxo de pagamento
    return false;
  }
}
