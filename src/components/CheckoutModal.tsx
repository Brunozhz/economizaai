import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

type PaymentStatus = 'loading' | 'created' | 'paid' | 'expired' | 'error';

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [pixData, setPixData] = useState<{
    pixId: string;
    qrCode: string;
    qrCodeBase64: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const { toast } = useToast();

  const createPix = useCallback(async () => {
    if (!product) return;
    
    setStatus('loading');
    setPixData(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: {
          value: product.discountPrice,
          productName: product.name,
          productId: `credits-${product.credits}`,
        },
      });

      if (error) throw error;
      
      if (data.success) {
        setPixData({
          pixId: data.pixId,
          qrCode: data.qrCode,
          qrCodeBase64: data.qrCodeBase64,
        });
        setStatus('created');
        setTimeLeft(900);
      } else {
        throw new Error(data.error || 'Erro ao criar PIX');
      }
    } catch (error: any) {
      console.error('Error creating PIX:', error);
      setStatus('error');
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [product, toast]);

  // Create PIX when modal opens
  useEffect(() => {
    if (isOpen && product) {
      createPix();
    } else {
      setStatus('loading');
      setPixData(null);
      setTimeLeft(900);
    }
  }, [isOpen, product, createPix]);

  // Check payment status periodically
  useEffect(() => {
    if (!pixData?.pixId || status !== 'created') return;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-pix-status', {
          body: { pixId: pixData.pixId },
        });

        if (error) throw error;

        if (data.success && data.status === 'paid') {
          setStatus('paid');
          toast({
            title: "Pagamento Confirmado! 🎉",
            description: `Seus ${product?.credits} créditos foram liberados!`,
          });
        } else if (data.status === 'expired' || data.status === 'canceled') {
          setStatus('expired');
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [pixData?.pixId, status, product?.credits, toast]);

  // Countdown timer
  useEffect(() => {
    if (status !== 'created' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const copyToClipboard = async () => {
    if (!pixData?.qrCode) return;
    
    try {
      await navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no app do seu banco para pagar.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Checkout</h2>
            <p className="text-sm text-muted-foreground">Pagamento via PIX</p>
          </div>
          <button
            onClick={onClose}
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
                <p className="text-sm text-price-old line-through">R$ {product.originalPrice.toFixed(2)}</p>
                <p className="text-xl font-bold text-price-new">R$ {product.discountPrice.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center animate-pulse">
                <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
              </div>
              <p className="text-muted-foreground">Gerando código PIX...</p>
            </div>
          )}

          {/* QR Code */}
          {status === 'created' && pixData && (
            <div className="space-y-5">
              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Expira em <strong className="text-foreground">{formatTime(timeLeft)}</strong></span>
              </div>

              {/* QR Code Image */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-2xl">
                  <img 
                    src={pixData.qrCodeBase64} 
                    alt="QR Code PIX" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code acima ou copie o código abaixo
                </p>
              </div>

              {/* Copy Button */}
              <Button
                onClick={copyToClipboard}
                className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Código Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copiar Código PIX
                  </>
                )}
              </Button>

              {/* Waiting for payment */}
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                <span className="text-sm text-yellow-500 font-medium">Aguardando pagamento...</span>
              </div>
            </div>
          )}

          {/* Payment Confirmed */}
          {status === 'paid' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-20 w-20 rounded-full bg-pix-badge/20 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-pix-badge" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Pagamento Confirmado!</h3>
                <p className="text-muted-foreground">
                  Seus {product?.credits} créditos foram liberados com sucesso.
                </p>
              </div>
              <Button
                onClick={onClose}
                className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl mt-4"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Expired State */}
          {status === 'expired' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">PIX Expirado</h3>
                <p className="text-muted-foreground">
                  O tempo para pagamento expirou.
                </p>
              </div>
              <Button
                onClick={createPix}
                className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl mt-4"
              >
                Gerar Novo PIX
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="h-20 w-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Erro ao Gerar PIX</h3>
                <p className="text-muted-foreground">
                  Não foi possível criar o pagamento.
                </p>
              </div>
              <Button
                onClick={createPix}
                className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl mt-4"
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-secondary/20">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>🔒 Pagamento seguro via</span>
            <span className="font-semibold text-foreground">PushinPay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
