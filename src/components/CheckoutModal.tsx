import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ExitOfferModal from "./ExitOfferModal";

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

// Webhook URL - usar variáveis de ambiente
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [status, setStatus] = useState<PaymentStatus>('form');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lovableInviteLink, setLovableInviteLink] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [lovableLinkError, setLovableLinkError] = useState('');
  const [pixData, setPixData] = useState<{
    pixId: string;
    qrCode: string;
    qrCodeBase64: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [remarketingSent, setRemarketingSent] = useState(false);
  const [showExitOffer, setShowExitOffer] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(0);
  const { toast } = useToast();

  // Calculate final price with discount
  const getFinalPrice = useCallback(() => {
    if (!product) return 0;
    if (currentDiscount > 0) {
      return product.discountPrice * (1 - currentDiscount / 100);
    }
    return product.discountPrice;
  }, [product, currentDiscount]);

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

  const handleLovableLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLovableInviteLink(e.target.value);
    setLovableLinkError('');
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
    
    // Validar link de convite do Lovable
    if (!lovableInviteLink.trim() || lovableInviteLink.trim().length < 10) {
      setLovableLinkError('Digite o link de convite do Lovable');
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
    
    const finalPrice = Number(getFinalPrice().toFixed(2)); // Use discounted price
    const effectiveName = getEffectiveName();
    const effectiveEmail = getEffectiveEmail();
    const effectivePhone = getEffectivePhone();

    // Função de retry com exponential backoff
    const attemptCreatePix = async (attempt = 1, maxAttempts = 3): Promise<any> => {
      try {
        console.log('=== TENTATIVA', attempt, 'DE', maxAttempts, '===');
        console.log('Criando PIX via API backend:', { 
          finalPrice, 
          product: product.name,
        });

        // Chamar endpoint backend que fará a autenticação e criação do pedido na Cakto
        const response = await fetch('/api/create-pix', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: finalPrice,
            productName: product.name,
            productId: `credits-${product.credits}`,
            customerName: effectiveName,
            customerEmail: effectiveEmail,
            customerPhone: effectivePhone,
            lovableInviteLink: lovableInviteLink.trim(),
            userId: '',
          }),
        });

        // Verificar se a resposta é JSON válido antes de fazer parse
        let data: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Se não for JSON, tentar ler como texto para debug
          const text = await response.text();
          console.error('Resposta não é JSON:', text);
          throw new Error(`Resposta inválida da API: ${text.substring(0, 100)}`);
        }
        console.log('Resposta API backend (status:', response.status, '):', JSON.stringify(data, null, 2));

        if (!response.ok) {
          // Log completo do erro para debug
          console.error('Erro detalhado da API:', {
            status: response.status,
            statusText: response.statusText,
            data: data,
          });
          
          // Se for erro 400 e ainda tem tentativas, retry
          if (response.status === 400 && attempt < maxAttempts) {
            const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.log(`⏳ Aguardando ${waitTime/1000}s antes de tentar novamente...`);
            
            toast({
              title: "Tentando novamente...",
              description: `Aguarde ${waitTime/1000} segundos (tentativa ${attempt + 1}/${maxAttempts})`,
            });
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return attemptCreatePix(attempt + 1, maxAttempts);
          }
          
          // Mensagens de erro mais amigáveis
          let errorMessage = 'Erro ao criar pedido PIX';
          
          if (data.error && typeof data.error === 'string') {
            console.error('Erro da API:', data.error);
            errorMessage = data.error;
          } else if (data.message) {
            console.error('Mensagem da API:', data.message);
            errorMessage = data.message;
          }
          
          throw new Error(errorMessage);
        }

        // Verificar se recebemos os dados necessários
        if (!data.success || !data.pixId || !data.qrCode) {
          throw new Error('Resposta inválida da API de pagamento');
        }

        return {
          id: data.pixId,
          qr_code: data.qrCode,
          qr_code_base64: data.qrCodeBase64 || data.qrCode,
          status: data.status || 'pending',
        };
      } catch (error) {
        if (attempt < maxAttempts && error instanceof Error && !error.message.includes('máximo')) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Erro de rede, aguardando ${waitTime/1000}s antes de tentar novamente...`);
          
          toast({
            title: "Reconectando...",
            description: `Tentativa ${attempt + 1}/${maxAttempts}`,
          });
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return attemptCreatePix(attempt + 1, maxAttempts);
        }
        throw error;
      }
    };

    try {
      // Tentar criar PIX com retry
      const data = await attemptCreatePix();

      // Enviar webhook para n8n com status "pending"
      if (WEBHOOK_URL) {
        try {
          const webhookPayload = {
            pix_id: data.id,
            produto: product.name,
            produto_id: `credits-${product.credits}`,
            valor: finalPrice,
            nome: effectiveName,
            email: effectiveEmail,
            whatsapp: effectivePhone,
            lovable_invite_link: lovableInviteLink.trim(),
            user_id: '',
            status: 'pending',
            qr_code: data.qr_code,
            created_at: new Date().toISOString(),
          };

          console.log('Enviando webhook (pending):', webhookPayload);

          await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
          });
        } catch (webhookError) {
          console.error('Erro ao enviar webhook:', webhookError);
          // Não bloquear o fluxo se o webhook falhar
        }
      }

      // Salvar dados do PIX
      setPixData({
        pixId: data.id,
        qrCode: data.qr_code,
        qrCodeBase64: data.qr_code_base64 || data.qr_code,
      });
      setStatus('created');
      setTimeLeft(900);

      // Meta Pixel: Track Purchase Initiation
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: product.name,
          content_ids: [`credits-${product.credits}`],
          content_type: 'product',
          value: finalPrice,
          currency: 'BRL'
        });
        console.log('Meta Pixel InitiateCheckout event fired:', product.name, 'ID:', `noob_marketing`);
      }

    } catch (error: any) {
      console.error('Error creating PIX:', error);
      setStatus('error');
      toast({
        title: "Erro ao Gerar PIX",
        description: error.message || "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive",
        duration: 8000,
      });
    }
  }, [product, toast, getEffectiveName, getEffectiveEmail, getEffectivePhone, lovableInviteLink, getFinalPrice]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && product) {
      // Check if discount was already applied for this product
      const discountApplied = sessionStorage.getItem(`discount_applied_${product.name}`);
      if (discountApplied === 'true') {
        setCurrentDiscount(15); // Apply saved discount
      } else {
        setCurrentDiscount(0); // Start with no discount
      }
      
      setStatus('form');
      setCustomerName('');
      setPhone('');
      setEmail('');
      setLovableInviteLink('');
      setNameError('');
      setPhoneError('');
      setEmailError('');
      setLovableLinkError('');
      setPixData(null);
      setTimeLeft(900);
      setRemarketingSent(false);
      setShowExitOffer(false);

      // Fire Meta Pixel InitiateCheckout event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const productId = product.name.toLowerCase().replace(/\s+/g, '_');
        (window as any).fbq('track', 'InitiateCheckout', {
          value: getFinalPrice(),
          currency: 'BRL',
          content_name: product.name,
          content_type: 'product',
          content_ids: [productId],
          content_category: 'Créditos Lovable',
          num_items: 1,
        });
        console.log('Meta Pixel InitiateCheckout event fired:', product.name, 'ID:', productId);
      }
    }
  }, [isOpen, product, toast, getFinalPrice]);

  // Handle close - intercept to show exit offer
  const handleClose = () => {
    // Only show exit offer if modal is in form status (not paid, expired, loading, created, etc.)
    // And if no PIX was generated yet
    if (status === 'form' && product && !pixData) {
      // Check if user already rejected the offer for this product
      const exitOfferRejected = sessionStorage.getItem(`exit_offer_rejected_${product.name}`);
      
      if (!exitOfferRejected) {
        setShowExitOffer(true);
        return;
      }
    }
    
    // Close normally if offer was rejected, status is not form, or PIX was already generated
    onClose();
  };

  // Handle exit offer acceptance
  const handleAcceptExitOffer = () => {
    const discountPercent = 15;
    
    // Apply discount
    setCurrentDiscount(discountPercent);
    setShowExitOffer(false);
    
    // Save discount acceptance in sessionStorage
    if (product) {
      sessionStorage.setItem(`discount_applied_${product.name}`, 'true');
    }
    
    toast({
      title: "🎉 Desconto Aplicado!",
      description: `Você ganhou ${discountPercent}% de desconto! Agora preencha os dados e gere seu PIX.`,
      duration: 5000,
    });
  };

  // Handle exit offer rejection
  const handleRejectExitOffer = () => {
    setShowExitOffer(false);
    // Mark offer as rejected for this product
    if (product) {
      sessionStorage.setItem(`exit_offer_rejected_${product.name}`, 'true');
    }
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
        
        // Chamar endpoint backend para verificar status do pedido
        const response = await fetch('/api/check-pix-status', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pixId: pixData.pixId,
            productName: product?.name,
            productId: `credits-${product?.credits}`,
            value: getFinalPrice(),
            customerName: effectiveNameForPayment,
            customerEmail: effectiveEmailForPayment,
            customerPhone: effectivePhoneForPayment,
            lovableInviteLink: lovableInviteLink.trim(),
            userId: '',
          }),
        });

        // Verificar se a resposta é JSON válido antes de fazer parse
        let data: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('Resposta não é JSON:', text);
          throw new Error(`Resposta inválida da API: ${text.substring(0, 100)}`);
        }
        console.log('Status do PIX:', data);
        
        if (!response.ok) {
          throw new Error(data.error || data.message || 'Erro ao verificar PIX');
        }

        // Verificar se foi pago (status pode variar: 'paid', 'approved', 'completed', etc)
        const paidStatuses = ['paid', 'PAID', 'approved', 'APPROVED', 'completed', 'COMPLETED', 'pago'];
        if (paidStatuses.includes(data.status)) {
          setStatus('paid');
          
          const finalPrice = getFinalPrice();
          const productId = product?.name.toLowerCase().replace(/\s+/g, '_') || '';

          // Enviar webhook para n8n com status "paid"
          if (WEBHOOK_URL) {
            try {
              const webhookPayload = {
                pix_id: pixData.pixId,
                produto: product?.name,
                produto_id: `credits-${product?.credits}`,
                valor: finalPrice,
                nome: effectiveNameForPayment,
                email: effectiveEmailForPayment,
                whatsapp: effectivePhoneForPayment,
                lovable_invite_link: lovableInviteLink.trim(),
                user_id: '',
                status: 'paid',
                qr_code: pixData.qrCode,
                created_at: new Date().toISOString(),
              };

              console.log('Enviando webhook (paid):', webhookPayload);

              await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
              });
            } catch (webhookError) {
              console.error('Erro ao enviar webhook:', webhookError);
            }
          }
          
          // Fire Meta Pixel Purchase event (após confirmação de pagamento)
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
              value: finalPrice,
              currency: 'BRL',
              content_name: product?.name,
              content_type: 'product',
              content_ids: [productId],
              content_category: 'Créditos Lovable',
              num_items: 1,
            });
            console.log('Meta Pixel Purchase event fired - Pagamento confirmado:', {
              product: product?.name,
              value: finalPrice,
              id: productId
            });
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

    const interval = setInterval(checkStatus, 1000); // Check every 1 second
    return () => clearInterval(interval);
  }, [pixData?.pixId, status, product?.credits, toast, getFinalPrice, email, phone, customerName, lovableInviteLink, product]);

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
              productPrice: getFinalPrice(),
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
    <>
      {/* Exit Offer Modal */}
      <ExitOfferModal
        isOpen={showExitOffer}
        onAccept={handleAcceptExitOffer}
        onReject={handleRejectExitOffer}
        product={product}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={showExitOffer ? undefined : handleClose}
        />
        {/* Modal */}
        <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
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
              <>
                {currentDiscount > 0 && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-500/20 to-green-500/20 border-2 border-yellow-500 rounded-xl animate-pulse">
                    <p className="text-center font-bold text-yellow-500 text-sm">
                      🎉 DESCONTO ESPECIAL DE {currentDiscount}% ATIVADO! 🎉
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 mb-5 relative overflow-hidden">
                  <div className="relative">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">+{product.credits} créditos</p>
                  </div>
                  <div className="text-right relative">
                    {currentDiscount > 0 ? (
                      <>
                        <p className="text-xs text-muted-foreground line-through">
                          De: R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-2xl font-bold text-green-500">
                          R$ {getFinalPrice().toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xs font-semibold text-yellow-500 animate-pulse">
                          Economia: R$ {(product.discountPrice - getFinalPrice()).toFixed(2).replace('.', ',')}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-price-old line-through">
                          R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xl font-bold text-price-new">
                          R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </>
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

              {/* Campo Link de Convite Lovable */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm font-bold text-yellow-500 mb-1 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Atenção</span>
                  </p>
                  <p className="text-xs text-foreground">
                    Coloque abaixo o link de convite da sua conta do Lovable que irá receber os créditos. Caso não saiba como conseguir, volte para cima e veja o Vídeo.
                  </p>
                </div>
                <Label htmlFor="lovableInviteLink" className="text-foreground">Link de Convite do Lovable</Label>
                <Input
                  id="lovableInviteLink"
                  type="url"
                  placeholder="https://lovable.dev/invite/..."
                  value={lovableInviteLink}
                  onChange={handleLovableLinkChange}
                  className={lovableLinkError ? 'border-destructive' : ''}
                />
                {lovableLinkError && (
                  <p className="text-xs text-destructive">{lovableLinkError}</p>
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
                  {product && getFinalPrice() > 150 
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
    </>
  );
};

export default CheckoutModal;
