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
 */
export async function checkPixStatus(
  correlationID: string
): Promise<PixStatusData> {
  try {
    const response = await fetch(
      `/api/check-pix-status-pushinpay?correlationID=${encodeURIComponent(correlationID)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData: PaymentError = await response.json();
      throw new Error(errorData.error || 'Falha ao verificar status do pagamento');
    }

    const data: PixStatusData = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar status PIX:', error);
    throw error;
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
 * Envia webhook para URL configurada
 */
export async function sendWebhook(payload: WebhookPayload): Promise<boolean> {
  try {
    const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn('VITE_WEBHOOK_URL não configurada. Webhook não será enviado.');
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Erro ao enviar webhook:', {
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }

    console.log('Webhook enviado com sucesso:', payload.status);
    return true;
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    // Não lança erro para não interromper o fluxo de pagamento
    return false;
  }
}
