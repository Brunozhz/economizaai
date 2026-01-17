import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Webhook URL e API Key - usar variáveis de ambiente
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'https://n8n.infinityunlocker.com.br/webhook-test/e2bdd7b8-2639-4ea8-8800-64f2e92b5401';
const PIX_API_KEY = import.meta.env.VITE_PIX_API_KEY || '60414|Qm6v4i3AsBBomQV7S4sXmMGMVBeOZDYKRf2P2u3g32aafa32';

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [status, setStatus] = useState<PaymentStatus>('form');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [pixData, setPixData] = useState<{
    pixId: string;
    qrCode: string;
    qrCodeBase64: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [remarketingSent, setRemarketingSent] = useState(false);
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    let numbers = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (DDD + 9 dígitos) - NÃO remover 55 pois está fixo visualmente
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
    setNameError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    // Se usuário está logado, usar dados do perfil
    if (false) { // Auth removed
      return true; // Dados já validados pelo sistema de auth
    }
    
    // Validar nome
    if (!customerName.trim() || customerName.trim().length < 2) {
      setNameError('Digite seu nome completo');
      isValid = false;
    }
    
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
  
  // Get effective name, email and phone (from form fields)
  const getEffectiveName = useCallback(() => {
    return customerName.trim();
  }, [customerName]);
  
  const getEffectiveEmail = useCallback(() => {
    return email;
  }, [email]);
  
  const getEffectivePhone = useCallback(() => {
    const phoneNumbers = phone.replace(/\D/g, '');
    // Add 55 prefix if not already present
    return phoneNumbers.startsWith('55') ? phoneNumbers : `55${phoneNumbers}`;
  }, [phone]);
  

  const handleSubmitForm = () => {
    if (validateForm()) {
      createPix();
    }
  };

  const createPix = useCallback(async () => {
    if (!product) return;
    
    setStatus('loading');
    setPixData(null);
    
    const finalPrice = product.discountPrice;
    const effectiveName = getEffectiveName();
    const effectiveEmail = getEffectiveEmail();
    const effectivePhone = getEffectivePhone();
    
    try {
      // Call PIX API directly using API key from environment
      const response = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PIX_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: Math.round(finalPrice * 100), // Value in centavos
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erro ao criar PIX');
      }
      
      if (data.id && data.qr_code) {
        setPixData({
          pixId: data.id,
          qrCode: data.qr_code,
          qrCodeBase64: data.qr_code_base64 || data.qr_code,
        });
        setStatus('created');
        setTimeLeft(900);
        
        // 🔔 Send webhook with ALL variables to n8n
        try {
          const webhookPayload = {
            // Product info
            productName: product.name,
            productId: `credits-${product.credits}`,
            credits: product.credits,
            originalPrice: product.originalPrice,
            discountPrice: product.discountPrice,
            finalPrice: finalPrice,
            
            // Customer info
            customerName: effectiveName,
            customerEmail: effectiveEmail,
            customerPhone: effectivePhone.replace(/\D/g, ''),
            
            // PIX info
            pixId: data.id,
            qrCode: data.qr_code,
            status: data.status || 'pending',
            createdAt: new Date().toISOString(),
            
            // Additional info
            timestamp: Date.now(),
          };
          
          console.log('Sending webhook with all data:', webhookPayload);
          
          fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
          }).then(res => {
            if (res.ok) {
              console.log('Webhook sent successfully');
            } else {
              console.error('Webhook failed:', res.status);
            }
          }).catch(err => {
            console.error('Error sending webhook:', err);
          });
        } catch (webhookError) {
          console.error('Error sending webhook:', webhookError);
        }
      } else {
        throw new Error('Resposta inválida da API PIX');
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
  }, [product, toast, getEffectiveName, getEffectiveEmail, getEffectivePhone]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && product) {
      setStatus('form');
      setCustomerName('');
      setPhone('');
      setEmail('');
      setNameError('');
      setPhoneError('');
      setEmailError('');
      setPixData(null);
      setTimeLeft(900);
      setRemarketingSent(false);

      // Fire Meta Pixel InitiateCheckout event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          value: product.discountPrice,
          currency: 'BRL',
          content_name: product.name,
          content_type: 'product',
          content_ids: [`credits-${product.credits}`],
          num_items: 1,
        });
        console.log('Meta Pixel InitiateCheckout event fired:', product.name);
      }
    }
  }, [isOpen, product, toast]);

  // Handle close
  const handleClose = () => {
    onClose();
  };

  // All coupon-related functions removed

  // Check payment status periodically
  useEffect(() => {
    if (!pixData?.pixId || status !== 'created') return;

    const checkStatus = async () => {
      try {
        const effectiveEmailForPayment = email;
        const effectivePhoneForPayment = phone;
        const effectiveNameForPayment = customerName;
        
        // Call check-pix-status API directly
        const response = await fetch('/api/check-pix-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pixId: pixData.pixId,
            productName: product?.name,
            productId: `credits-${product?.credits}`,
            value: Math.round((product?.discountPrice || 0) * 100),
            customerName: effectiveNameForPayment,
            customerEmail: effectiveEmailForPayment,
            customerPhone: effectivePhoneForPayment.replace(/\D/g, ''),
            userId: null,
          }),
        });

        const data = await response.json();
        const error = !response.ok ? new Error(data.error || 'Erro ao verificar PIX') : null;
        
        if (error) throw error;

        if (data.success && data.status === 'paid') {
          setStatus('paid');
          
          const finalPrice = product?.discountPrice || 0;
          
          // Fire Meta Pixel Purchase event
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
              value: finalPrice,
              currency: 'BRL',
              content_name: product?.name,
              content_type: 'product',
              content_ids: [`credits-${product?.credits}`],
            });
            console.log('Meta Pixel Purchase event fired:', finalPrice);
          }
          
          toast({
            title: "Pagamento Confirmado! 🎉",
            description: "Aguarde, nosso Agente de Ativação entrará em contato via WhatsApp!",
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
          // Send remarketing via API (if needed)
          await fetch('/api/send-remarketing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              phone: phone.replace(/\D/g, ''),
              productName: product.name,
              productPrice: product.discountPrice,
              pixId: pixData.pixId,
              userName: customerName,
            }),
          });
          setRemarketingSent(true);
          console.log('Remarketing message sent');
        } catch (error) {
          console.error('Error sending remarketing:', error);
        }
      }
    }, 60000); // 1 minute

    return () => clearTimeout(remarketingTimer);
  }, [status, remarketingSent, pixData?.pixId, product, email, phone, customerName]);

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
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
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
              <div className="relative">
                <p className="font-semibold text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">+{product.credits} créditos</p>
              </div>
              <div className="text-right relative">
                <p className="text-sm text-price-old line-through">R$ {product.originalPrice.toFixed(2)}</p>
                <p className="text-xl font-bold text-price-new">R$ {product.discountPrice.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Form State */}
          {status === 'form' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-foreground">Nome Completo</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={customerName}
                  onChange={handleNameChange}
                  className={nameError ? 'border-destructive' : ''}
                />
                {nameError && (
                  <p className="text-xs text-destructive">{nameError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Telefone (WhatsApp)</Label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground text-sm font-medium">
                    +55
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`rounded-l-none ${phoneError ? 'border-destructive' : ''}`}
                  />
                </div>
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
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="h-20 w-20 rounded-full bg-pix-badge/20 flex items-center justify-center animate-pulse">
                <CheckCircle className="h-12 w-12 text-pix-badge" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Pagamento Confirmado! 🎉</h3>
                <p className="text-muted-foreground">
                  Seus <span className="font-bold text-primary">{product?.credits} créditos</span> foram liberados com sucesso.
                </p>
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-400 font-medium flex items-center justify-center gap-2">
                    <span className="text-lg">📱</span>
                    Nosso Agente de Ativação entrará em contato via WhatsApp em instantes!
                  </p>
                </div>
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
