import { useState, useEffect } from "react";
import { X, Clock, Zap, AlertCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExitOfferModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
  product: {
    name: string;
    credits: number;
    originalPrice: number;
    discountPrice: number;
  } | null;
}

const ExitOfferModal = ({ isOpen, onAccept, onReject, product }: ExitOfferModalProps) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto close when timer ends
          onReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, onReject]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !product) return null;

  // Calculate 15% discount
  const discountPercent = 15;
  const discountAmount = product.discountPrice * (discountPercent / 100);
  const finalPrice = product.discountPrice - discountAmount;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop - darker */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onReject}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card border-2 border-yellow-500/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl p-[2px] animate-border-glow" style={{
          background: 'linear-gradient(90deg, #facc15, #f59e0b, #f97316, #f59e0b, #facc15)',
          backgroundSize: '300% 100%',
        }}>
          <div className="absolute inset-[2px] rounded-2xl bg-card" />
        </div>

        {/* Content */}
        <div className="relative p-6 md:p-8">
          {/* Close button */}
          <button
            onClick={onReject}
            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/40 mb-4">
              <Gift className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-bold text-yellow-500">OFERTA RELÂMPAGO</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              🚨 ESPERE! 🚨
            </h2>
            <p className="text-xl md:text-2xl font-bold text-yellow-500 mb-2">
              Vou te dar uma ÚLTIMA OPORTUNIDADE
            </p>
            <p className="text-base text-muted-foreground">
              de comprar conosco o <strong className="text-foreground">melhor preço do mercado do Brasil</strong>
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-3 mb-6 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30">
            <Clock className="h-6 w-6 text-red-500 animate-pulse" />
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Esta oferta expira em:</p>
              <p className="text-3xl font-black text-red-500 tabular-nums">{formatTime(timeLeft)}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
          </div>

          {/* Offer details */}
          <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/30">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Você estava comprando:</p>
              <p className="text-xl font-bold text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">+{product.credits} créditos</p>
              
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-yellow-500/20">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Preço Original</p>
                  <p className="text-lg line-through text-muted-foreground">
                    R$ {product.discountPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-2xl font-bold text-yellow-500">→</div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Com {discountPercent}% OFF</p>
                  <p className="text-2xl font-black text-yellow-500">
                    R$ {finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-yellow-500/20">
                <p className="text-sm font-semibold text-green-500">
                  💰 Você economiza R$ {discountAmount.toFixed(2)}!
                </p>
              </div>
            </div>
          </div>

          {/* Warning message */}
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-center text-sm font-bold text-red-400">
              ⚠️ Esta é sua ÚLTIMA CHANCE!
            </p>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Se você sair agora, essa oferta especial será perdida para sempre
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={onAccept}
              className="w-full h-14 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-white font-black text-lg rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_8px_30px_rgba(250,204,21,0.5)]"
            >
              <Zap className="mr-2 h-5 w-5" />
              SIM! QUERO ESSA OFERTA ESPECIAL
            </Button>
            
            <Button
              onClick={onReject}
              variant="outline"
              className="w-full h-12 font-bold text-sm rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
            >
              Não, obrigado. Prefiro pagar mais caro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitOfferModal;
