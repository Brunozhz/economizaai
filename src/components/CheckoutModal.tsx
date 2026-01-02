import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Loader2, CheckCircle, Clock, AlertCircle, Gift, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type PaymentStatus = 'form' | 'loading' | 'created' | 'paid' | 'expired' | 'error';

const VALID_COUPONS: Record<string, number> = {
  'BEMVINDO20': 20,
  'DESCONTO15': 15,
  'VIP10': 10,
};

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [status, setStatus] = useState<PaymentStatus>('form');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pixData, setPixData] = useState<{
    pixId: string;
    qrCode: string;
    qrCodeBase64: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [showExitOffer, setShowExitOffer] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [hasSeenExitOffer, setHasSeenExitOffer] = useState(false);
  const [couponTimeLeft, setCouponTimeLeft] = useState(120); // 2 minutes countdown
  const [remarketingSent, setRemarketingSent] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(15);
  const { toast } = useToast();

  const EXIT_OFFER_DISCOUNT = 15;
  const COUPON_EXPIRE_SECONDS = 120; // 2 minutes
  const discountedPrice = product ? product.discountPrice * (1 - discountPercent / 100) : 0;

  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (DDD + 9 dígitos)
    const limited = numbers.slice(0, 11);
    
    // Formatar como (XX) XXXXX-XXXX
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setPhoneError('');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validar telefone (deve ter 11 dígitos)
    const phoneNumbers = phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setPhoneError('Digite um telefone válido com DDD');
      isValid = false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Digite um e-mail válido');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmitForm = () => {
    if (validateForm()) {
      createPix();
    }
  };

  const createPix = useCallback(async () => {
    if (!product) return;
    
    setStatus('loading');
    setPixData(null);
    
    const finalPrice = couponApplied ? discountedPrice : product.discountPrice;
    const couponLabel = appliedCouponCode ? `(cupom ${appliedCouponCode})` : '(com cupom 15%)';
    
    try {
      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: {
          value: finalPrice,
          productName: couponApplied ? `${product.name} ${couponLabel}` : product.name,
          productId: `credits-${product.credits}`,
          customerPhone: phone.replace(/\D/g, ''),
          customerEmail: email,
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
  }, [product, phone, email, toast, couponApplied, discountedPrice]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setStatus('form');
      setPhone('');
      setEmail('');
      setPhoneError('');
      setEmailError('');
      setPixData(null);
      setTimeLeft(900);
      setShowExitOffer(false);
      setCouponApplied(false);
      setHasSeenExitOffer(false);
      setRemarketingSent(false);
      setCouponCode('');
      setCouponError('');
      setAppliedCouponCode('');
      setDiscountPercent(15);
    }
  }, [isOpen, product]);

  // Handle close with exit offer
  const handleClose = () => {
    // Show exit offer only if user hasn't seen it and hasn't applied coupon yet
    if (!hasSeenExitOffer && !couponApplied && status !== 'paid' && status !== 'loading') {
      setShowExitOffer(true);
      setHasSeenExitOffer(true);
      setCouponTimeLeft(COUPON_EXPIRE_SECONDS); // Reset coupon timer
    } else {
      onClose();
    }
  };

  // Coupon countdown timer
  useEffect(() => {
    if (!showExitOffer || couponTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setCouponTimeLeft((prev) => {
        if (prev <= 1) {
          // Coupon expired, close the offer
          setShowExitOffer(false);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showExitOffer, couponTimeLeft, onClose]);

  // Apply exit offer coupon
  const applyExitCoupon = () => {
    setCouponApplied(true);
    setShowExitOffer(false);
    setDiscountPercent(EXIT_OFFER_DISCOUNT);
    setAppliedCouponCode('SAIANAO15');
    toast({
      title: "🎉 Cupom aplicado!",
      description: `Desconto de ${EXIT_OFFER_DISCOUNT}% aplicado com sucesso!`,
    });
  };

  // Apply manual coupon
  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    
    if (!code) {
      setCouponError('Digite um código de cupom');
      return;
    }

    if (VALID_COUPONS[code]) {
      const discount = VALID_COUPONS[code];
      setCouponApplied(true);
      setDiscountPercent(discount);
      setAppliedCouponCode(code);
      setCouponError('');
      toast({
        title: "🎉 Cupom aplicado!",
        description: `Desconto de ${discount}% aplicado com sucesso!`,
      });
    } else {
      setCouponError('Cupom inválido ou expirado');
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setAppliedCouponCode('');
    setDiscountPercent(15);
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido do seu pedido.",
    });
  };

  // Continue without coupon
  const continueWithoutCoupon = () => {
    setShowExitOffer(false);
    onClose();
  };

  // Format coupon time
  const formatCouponTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Remarketing timer - sends message after 1 minute if not paid
  useEffect(() => {
    if (status !== 'created' || remarketingSent || !pixData?.pixId || !product) return;

    const remarketingTimer = setTimeout(async () => {
      if (status === 'created' && !remarketingSent) {
        console.log('Sending remarketing message...');
        try {
          await supabase.functions.invoke('send-remarketing', {
            body: {
              email,
              phone: phone.replace(/\D/g, ''),
              productName: product.name,
              productPrice: couponApplied ? discountedPrice : product.discountPrice,
              pixId: pixData.pixId,
            },
          });
          setRemarketingSent(true);
          console.log('Remarketing message sent');
        } catch (error) {
          console.error('Error sending remarketing:', error);
        }
      }
    }, 60000); // 1 minute

    return () => clearTimeout(remarketingTimer);
  }, [status, remarketingSent, pixData?.pixId, product, email, phone, couponApplied, discountedPrice]);

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
        onClick={handleClose}
      />
      
      {/* Exit Offer Modal */}
      {showExitOffer && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-card border-2 border-primary/50 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-2xl blur-lg opacity-30 animate-pulse" />
            
            <div className="relative bg-card rounded-2xl overflow-hidden">
              {/* Header with gift icon */}
              <div className="bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.3),transparent_70%)]" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-emerald-500 mb-4 animate-bounce">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-1">Espera! 🎁</h3>
                  <p className="text-muted-foreground text-sm">Temos um presente especial para você</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Countdown Timer */}
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-destructive/10 border border-destructive/30">
                  <Clock className="h-5 w-5 text-destructive animate-pulse" />
                  <span className="text-sm font-medium text-destructive">
                    Oferta expira em: <strong className="text-lg">{formatCouponTime(couponTimeLeft)}</strong>
                  </span>
                </div>

                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">CUPOM EXCLUSIVO</span>
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  
                  <p className="text-4xl font-black bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                    {EXIT_OFFER_DISCOUNT}% OFF
                  </p>
                  
                  <p className="text-muted-foreground text-sm">
                    Aplicado automaticamente no seu pedido!
                  </p>
                  
                  {product && (
                    <div className="mt-4 p-3 rounded-xl bg-secondary/50 border border-border">
                      <p className="text-sm text-muted-foreground">Novo valor:</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg text-muted-foreground line-through">R$ {product.discountPrice.toFixed(2)}</span>
                        <span className="text-2xl font-black text-primary">R$ {discountedPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-primary mt-1 font-medium">
                        Você economiza R$ {(product.discountPrice - discountedPrice).toFixed(2)}!
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={applyExitCoupon}
                    className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl shadow-glow-sm hover:scale-[1.02] transition-transform animate-pulse"
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    Aplicar Desconto Agora!
                  </Button>
                  
                  <button
                    onClick={continueWithoutCoupon}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Não, obrigado. Sair mesmo assim.
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fade-in">
        {/* Coupon Applied Badge */}
        {couponApplied && (
          <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-primary via-emerald-500 to-primary text-white text-xs font-bold py-2 text-center flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>CUPOM DE {discountPercent}% APLICADO!</span>
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        )}
        
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b border-border ${couponApplied ? 'pt-10' : ''}`}>
          <div>
            <h2 className="text-xl font-bold text-foreground">Checkout</h2>
            <p className="text-sm text-muted-foreground">Pagamento via PIX</p>
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
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 mb-5 relative overflow-hidden">
              {couponApplied && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-emerald-500/5" />
              )}
              <div className="relative">
                <p className="font-semibold text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">+{product.credits} créditos</p>
              </div>
              <div className="text-right relative">
                {couponApplied ? (
                  <>
                    <p className="text-sm text-muted-foreground line-through">R$ {product.discountPrice.toFixed(2)}</p>
                    <p className="text-xl font-bold text-primary">R$ {discountedPrice.toFixed(2)}</p>
                    <span className="text-xs text-primary font-medium">-{discountPercent}%</span>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-price-old line-through">R$ {product.originalPrice.toFixed(2)}</p>
                    <p className="text-xl font-bold text-price-new">R$ {product.discountPrice.toFixed(2)}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Form State */}
          {status === 'form' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Telefone (WhatsApp)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={phoneError ? 'border-destructive' : ''}
                />
                {phoneError && (
                  <p className="text-xs text-destructive">{phoneError}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={emailError ? 'border-destructive' : ''}
                />
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              {/* Coupon Area */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Tem um cupom?
                </Label>
                
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Digite o código"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      className={`flex-1 uppercase ${couponError ? 'border-destructive' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyCoupon}
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      Aplicar
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="font-medium text-primary">{appliedCouponCode}</span>
                      <span className="text-sm text-primary">(-{discountPercent}%)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                )}
                
                {couponError && (
                  <p className="text-xs text-destructive">{couponError}</p>
                )}
              </div>

              <Button
                onClick={handleSubmitForm}
                className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl mt-4"
              >
                Gerar PIX
              </Button>
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
                <p className="text-muted-foreground text-sm px-4">
                  {product && product.discountPrice > 150 
                    ? "Valor máximo para PIX é R$ 150,00. Escolha um pacote menor."
                    : "Não foi possível criar o pagamento. Tente novamente."
                  }
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full h-12 font-bold rounded-xl mt-4"
              >
                Escolher Outro Pacote
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
