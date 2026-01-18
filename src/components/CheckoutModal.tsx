import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Clock, QrCode, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPixPayment, checkPixStatus, copyPixCode, formatCurrency, formatTimeRemaining, type PixPaymentData } from "@/services/paymentService";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    credits: number;
    originalPrice: number;
    discountPrice: number;
  } | null;
}

type PaymentStep = 'initial' | 'loading' | 'pix-generated' | 'paid' | 'expired' | 'error';

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [step, setStep] = useState<PaymentStep>('initial');
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Reset quando o modal abre
  useEffect(() => {
    if (isOpen && product) {
      setStep('initial');
      setPixData(null);
      setCopied(false);
      setTimeRemaining('');
      setErrorMessage('');
    }
  }, [isOpen, product]);

  // Limpa intervalo ao desmontar
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  // Atualiza tempo restante
  useEffect(() => {
    if (pixData && step === 'pix-generated') {
      const updateTime = () => {
        const remaining = formatTimeRemaining(pixData.expiresAt);
        setTimeRemaining(remaining);
        
        if (remaining === 'Expirado') {
          setStep('expired');
          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current);
          }
        }
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);

      return () => clearInterval(timer);
    }
  }, [pixData, step]);

  // Verifica status do pagamento periodicamente
  useEffect(() => {
    if (pixData && step === 'pix-generated') {
      const checkStatus = async () => {
        try {
          const status = await checkPixStatus(pixData.correlationID);
          
          if (status.isPaid) {
            setStep('paid');
            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current);
            }
            toast.success('Pagamento confirmado! 🎉');
            
            // Fecha o modal após 3 segundos
            setTimeout(() => {
              onClose();
            }, 3000);
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      };

      // Verifica a cada 5 segundos
      statusCheckInterval.current = setInterval(checkStatus, 5000);

      return () => {
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
        }
      };
    }
  }, [pixData, step, onClose]);

  const handleGeneratePix = async () => {
    if (!product) return;

    setStep('loading');
    setErrorMessage('');

    try {
      const data = await createPixPayment(product.discountPrice, product.name);
      setPixData(data);
      setStep('pix-generated');
      toast.success('PIX gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      setStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao gerar pagamento PIX');
      toast.error('Erro ao gerar PIX. Tente novamente.');
    }
  };

  const handleCopyPixCode = async () => {
    if (!pixData) return;

    const success = await copyPixCode(pixData.brCode);
    if (success) {
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Erro ao copiar código');
    }
  };

  const handleClose = () => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {step === 'paid' ? 'Pagamento Confirmado!' : 'Checkout PIX'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 'paid' ? 'Seu pedido foi processado' : 'Pagamento via PIX'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Product Info */}
          {product && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 mb-5">
              <div>
                <p className="font-semibold text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">+{product.credits} créditos</p>
              </div>
              <div className="text-right">
                {product.originalPrice > 0 && (
                  <p className="text-sm text-price-old line-through">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </p>
                )}
                <p className="text-xl font-bold text-price-new">
                  R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          )}

          {/* Initial Step */}
          {step === 'initial' && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <QrCode className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Pagamento via PIX</h3>
                <p className="text-sm text-muted-foreground">
                  Clique no botão abaixo para gerar o código PIX e realizar o pagamento de forma rápida e segura.
                </p>
              </div>
            </div>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
              <p className="text-sm text-muted-foreground">Gerando código PIX...</p>
            </div>
          )}

          {/* PIX Generated Step */}
          {step === 'pix-generated' && pixData && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="bg-white p-4 rounded-xl">
                <img 
                  src={pixData.qrCodeImage} 
                  alt="QR Code PIX" 
                  className="w-full h-auto max-w-xs mx-auto"
                />
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-muted-foreground">Expira em:</span>
                <span className="font-semibold text-foreground">{timeRemaining}</span>
              </div>

              {/* PIX Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Código PIX Copia e Cola:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixData.brCode}
                    className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground font-mono truncate"
                  />
                  <Button
                    onClick={handleCopyPixCode}
                    variant="outline"
                    size="icon"
                    className="shrink-0 h-10 w-10"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Como pagar:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Abra o app do seu banco</li>
                  <li>Escolha pagar via PIX</li>
                  <li>Escaneie o QR Code ou cole o código</li>
                  <li>Confirme o pagamento</li>
                </ol>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Aguardando pagamento...</span>
              </div>
            </div>
          )}

          {/* Paid Step */}
          {step === 'paid' && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 animate-bounce">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Pagamento Confirmado!</h3>
                <p className="text-sm text-muted-foreground">
                  Seus créditos serão adicionados em instantes.
                </p>
              </div>
            </div>
          )}

          {/* Expired Step */}
          {step === 'expired' && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">PIX Expirado</h3>
                <p className="text-sm text-muted-foreground">
                  O tempo para pagamento expirou. Gere um novo código PIX para continuar.
                </p>
              </div>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao Gerar PIX</h3>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-secondary/20">
          {step === 'initial' && (
            <Button
              onClick={handleGeneratePix}
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Gerar PIX
            </Button>
          )}

          {step === 'loading' && (
            <Button
              disabled
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl opacity-50"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Gerando...
            </Button>
          )}

          {step === 'pix-generated' && (
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full h-12 font-bold rounded-xl"
            >
              Cancelar
            </Button>
          )}

          {(step === 'expired' || step === 'error') && (
            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePix}
                className="flex-1 h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 h-12 font-bold rounded-xl"
              >
                Fechar
              </Button>
            </div>
          )}

          {step === 'paid' && (
            <Button
              onClick={handleClose}
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
            >
              Concluir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
