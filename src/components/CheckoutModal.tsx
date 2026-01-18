import { useState, useEffect, useRef } from "react";
import { X, ShoppingCart, Loader2, CheckCircle, AlertCircle, Timer, Gift, Sparkles, Zap, Copy, Check, QrCode, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createPixPayment, checkPixStatus, copyPixCode, formatTimeRemaining, sendWebhook, type PixPaymentData } from "@/services/paymentService";

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

type CheckoutStep = 'form' | 'loading' | 'pix-generated' | 'paid' | 'expired' | 'success' | 'error';

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  const [step, setStep] = useState<CheckoutStep>('form');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lovableLink, setLovableLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [pixTimeRemaining, setPixTimeRemaining] = useState<string>('');

  // Exit offer modal
  const [showExitOffer, setShowExitOffer] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutos em segundos
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [linkError, setLinkError] = useState('');

  // Calcula preços com desconto (precisa estar antes dos useEffects)
  const discountPercentage = discountApplied ? 15 : 0;
  const finalPrice = product 
    ? product.discountPrice * (1 - discountPercentage / 100)
    : 0;
  const discountAmount = product ? product.discountPrice - finalPrice : 0;

  // Restaura estado do PIX do sessionStorage ao montar
  useEffect(() => {
    if (isOpen && product) {
      const savedPixData = sessionStorage.getItem('pixPaymentData');
      const savedStep = sessionStorage.getItem('checkoutStep');
      const savedFormData = sessionStorage.getItem('checkoutFormData');
      
      if (savedPixData) {
        try {
          const pix = JSON.parse(savedPixData);
          setPixData(pix);
          
          // Restaura o step se existir
          if (savedStep && ['pix-generated', 'paid', 'expired'].includes(savedStep)) {
            setStep(savedStep as CheckoutStep);
          } else {
            setStep('pix-generated');
          }
          
          // Restaura dados do formulário se existirem
          if (savedFormData) {
            const formData = JSON.parse(savedFormData);
            setCustomerName(formData.customerName || '');
            setEmail(formData.email || '');
            setPhone(formData.phone || '');
            setLovableLink(formData.lovableLink || '');
            setDiscountApplied(formData.discountApplied || false);
          }
        } catch (error) {
          console.error('Erro ao restaurar dados do PIX:', error);
        }
      } else {
        // Reset apenas se não houver dados salvos (abertura nova)
        setStep('form');
        setCustomerName('');
        setEmail('');
        setPhone('');
        setLovableLink('');
        setErrorMessage('');
        setNameError('');
        setEmailError('');
        setPhoneError('');
        setLinkError('');
        setShowExitOffer(false);
        setDiscountApplied(false);
        setTimeRemaining(300);
        setPixData(null);
        setCopied(false);
        setPixTimeRemaining('');
      }
    }
  }, [isOpen, product]);
  
  // Salva dados do PIX no sessionStorage quando mudam
  useEffect(() => {
    if (pixData) {
      sessionStorage.setItem('pixPaymentData', JSON.stringify(pixData));
    }
  }, [pixData]);
  
  // Salva step no sessionStorage
  useEffect(() => {
    if (step !== 'form' && isOpen) {
      sessionStorage.setItem('checkoutStep', step);
    }
  }, [step, isOpen]);
  
  // Salva dados do formulário no sessionStorage
  useEffect(() => {
    if (isOpen && (customerName || email || phone || lovableLink)) {
      sessionStorage.setItem('checkoutFormData', JSON.stringify({
        customerName,
        email,
        phone,
        lovableLink,
        discountApplied,
      }));
    }
  }, [customerName, email, phone, lovableLink, discountApplied, isOpen]);

  // Limpa intervalos ao desmontar
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  // Atualiza tempo restante do PIX
  useEffect(() => {
    if (pixData && step === 'pix-generated') {
      const updateTime = () => {
        if (pixData.expiresAt) {
          const remaining = formatTimeRemaining(pixData.expiresAt);
          setPixTimeRemaining(remaining);
          
          if (remaining === 'Expirado') {
            setStep('expired');
            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current);
            }
          }
        }
      };

      updateTime();
      const timer = setInterval(updateTime, 1000);

      return () => clearInterval(timer);
    }
  }, [pixData, step]);

  // Verifica status do pagamento periodicamente (a cada 1 segundo)
  useEffect(() => {
    // Só inicia verificação se PIX foi gerado e está na etapa correta
    if (!pixData || step !== 'pix-generated' || !product) {
      return;
    }

    // Limpa qualquer intervalo anterior antes de criar um novo
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
      statusCheckInterval.current = null;
    }

    let isChecking = false; // Flag para evitar múltiplas verificações simultâneas
    let checkCount = 0; // Contador de verificações
    const correlationID = pixData.correlationID; // Captura o ID para evitar problemas de closure

    const checkStatus = async () => {
      // Evita múltiplas verificações simultâneas
      if (isChecking) {
        return;
      }

        try {
          isChecking = true;
          checkCount++;
          
          // Log informativo de verificação apenas a cada 5 tentativas para não poluir o console
          if (checkCount === 1 || checkCount % 5 === 0) {
            console.log(`🔄 Verificando pagamento... (tentativa ${checkCount})`);
          }
          
          const status = await checkPixStatus(correlationID);
        
        if (status.isPaid) {
          // Limpa o intervalo imediatamente
          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current);
            statusCheckInterval.current = null;
          }

            console.log('✅ Pagamento confirmado!');
            setStep('paid');
            
            // Atualiza dados salvos
            sessionStorage.setItem('checkoutStep', 'paid');
            
            toast.success('Pagamento confirmado! 🎉');
            
            // Envia webhook com status "paid" quando pagamento confirmado
            await sendWebhook({
            status: 'paid',
            correlationID: correlationID,
            value: pixData.value,
            product: {
              name: product.name,
              credits: product.credits,
              originalPrice: product.originalPrice,
              discountPrice: product.discountPrice,
              finalPrice: finalPrice,
            },
            customer: {
              name: customerName,
              email: email,
              phone: phone,
              lovableLink: lovableLink,
            },
            timestamp: new Date().toISOString(),
          });
          
          // Fire Meta Pixel Purchase event
          if (typeof window !== 'undefined' && (window as any).fbq) {
            const purchaseData = {
              value: finalPrice,
              currency: 'BRL',
              content_name: product.name,
              content_type: 'product',
              content_ids: [product.name],
              num_items: 1,
              transaction_id: correlationID, // ID único da transação
            };
            
            (window as any).fbq('track', 'Purchase', purchaseData);
            
            // Log para debug
            console.log('✅ Meta Pixel Purchase event disparado:', {
              event: 'Purchase',
              data: purchaseData,
              timestamp: new Date().toISOString(),
            });
          } else {
            console.warn('⚠️ Meta Pixel (fbq) não está disponível. Evento Purchase não foi disparado.');
          }

          // Fire Google Analytics purchase event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'purchase', {
              transaction_id: `order_${Date.now()}`,
              value: finalPrice,
              currency: 'BRL',
              items: [{
                item_id: product.name,
                item_name: product.name,
                price: finalPrice,
                quantity: 1,
              }],
            });
          }
          
            // Limpa dados do sessionStorage após confirmar pagamento
            sessionStorage.removeItem('pixPaymentData');
            sessionStorage.removeItem('checkoutModalState');
            sessionStorage.removeItem('checkoutStep');
            sessionStorage.removeItem('checkoutFormData');
            
            // Redireciona para página de sucesso após 2 segundos
            setTimeout(() => {
              onClose();
              // Redireciona para página de sucesso
              window.location.href = '/success?correlationID=' + encodeURIComponent(correlationID);
            }, 2000);
        } else {
          // Pagamento ainda não confirmado, continua verificando
          // Log apenas a cada 10 tentativas
          if (checkCount % 10 === 0) {
            console.log(`⏳ Aguardando pagamento... (tentativa ${checkCount})`);
          }
        }
        } catch (error) {
          // Não mostra erro ao usuário, apenas log silencioso
          // Continua verificando infinitamente até o pagamento ser confirmado
          // Log apenas a cada 10 tentativas para não poluir o console
          if (checkCount % 10 === 0) {
            console.log(`🔄 Verificando pagamento... (tentativa ${checkCount} - aguardando resposta)`);
          }
        } finally {
        isChecking = false;
      }
    };

    // Inicia verificação imediatamente e depois a cada 5 segundos
    checkStatus(); // Primeira verificação imediata
    statusCheckInterval.current = setInterval(checkStatus, 5000); // 5 segundos

    // Cleanup: limpa o intervalo quando o componente desmonta ou quando as condições mudam
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
        statusCheckInterval.current = null;
      }
    };
  }, [pixData?.correlationID, step]); // Dependências reduzidas para evitar re-execuções desnecessárias

  // Timer para a oferta
  useEffect(() => {
    if (showExitOffer && timeRemaining > 0) {
      timerInterval.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerInterval.current) {
              clearInterval(timerInterval.current);
            }
            setShowExitOffer(false);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [showExitOffer, timeRemaining, onClose]);

  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    let numbers = value.replace(/\D/g, '');
    
    // Limitar a 11 dígitos (DDD + 9 dígitos)
    const limited = numbers.slice(0, 11);
    
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

  const validateForm = () => {
    let isValid = true;
    
    if (!customerName.trim() || customerName.trim().length < 2) {
      setNameError('Digite seu nome completo');
      isValid = false;
    }
    
    const phoneNumbers = phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setPhoneError('Digite um telefone válido com DDD');
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Digite um e-mail válido');
      isValid = false;
    }

    if (!lovableLink.trim()) {
      setLinkError('Digite o link de convite da sua conta Lovable');
      isValid = false;
    } else if (!lovableLink.includes('lovable.dev') && !lovableLink.includes('lovable.app')) {
      setLinkError('Link inválido. Use um link de convite do Lovable');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !product) return;

    setStep('loading');
    setErrorMessage('');

    try {
      // Cria pagamento PIX via PushinPay
      const paymentValue = finalPrice; // Usa o preço final (com desconto se aplicado)
      const data = await createPixPayment(paymentValue, product.name);
      
      setPixData(data);
      setStep('pix-generated');
      
      // Salva dados do PIX no sessionStorage para restaurar se sair do site
      sessionStorage.setItem('pixPaymentData', JSON.stringify(data));
      sessionStorage.setItem('checkoutStep', 'pix-generated');
      
      toast.success('PIX gerado com sucesso!');

      // Envia webhook com status "pending" imediatamente após gerar o PIX
      await sendWebhook({
        status: 'pending',
        correlationID: data.correlationID,
        value: data.value,
        product: {
          name: product.name,
          credits: product.credits,
          originalPrice: product.originalPrice,
          discountPrice: product.discountPrice,
          finalPrice: paymentValue,
        },
        customer: {
          name: customerName,
          email: email,
          phone: phone,
          lovableLink: lovableLink,
        },
        timestamp: new Date().toISOString(),
      });

      // Fire Meta Pixel InitiateCheckout event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          value: finalPrice,
          currency: 'BRL',
          content_name: product.name,
          content_type: 'product',
          content_ids: [product.name],
          num_items: 1,
        });
      }

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
    // Se tentar fechar, mostra oferta de desconto
    if (step === 'form' && !discountApplied && !showExitOffer) {
      setShowExitOffer(true);
      setTimeRemaining(300);
      return;
    }
    
    // Limpa intervalos ao fechar
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }
    
    onClose();
  };

  const handleAcceptDiscount = () => {
    setDiscountApplied(true);
    setShowExitOffer(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    toast.success('Desconto de 15% aplicado! 🎉');
  };

  const handleRejectDiscount = () => {
    setShowExitOffer(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    onClose();
  };

  // Formata tempo restante para oferta
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-card overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {step === 'paid' ? 'Pagamento Confirmado!' : step === 'pix-generated' ? 'Pagamento via PIX' : step === 'success' ? 'Pedido Confirmado!' : 'Finalizar Compra'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 'paid' ? 'Seu pagamento foi aprovado' : step === 'pix-generated' ? 'Escaneie o QR Code ou copie o código' : step === 'success' ? 'Seu pedido foi enviado' : 'Preencha seus dados'}
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
              {discountApplied && (
                <>
                  <p className="text-xs text-muted-foreground line-through">
                    R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded">
                      -15%
                    </span>
                    <p className="text-xl font-bold text-emerald-500">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <p className="text-xs text-emerald-500 font-semibold">
                    Você economizou R$ {discountAmount.toFixed(2).replace('.', ',')}!
                  </p>
                </>
              )}
              {!discountApplied && (
                <p className="text-xl font-bold text-price-new">
                  R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>
          </div>

          {/* Discount Applied Banner */}
          {discountApplied && step === 'form' && (
            <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 border-2 border-emerald-500/50">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  Seu desconto foi aplicado com sucesso! 🎉
                </p>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                Preencha seus dados abaixo para finalizar sua compra com 15% OFF!
              </p>
            </div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Digite seu nome completo"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setNameError('');
                  }}
                  className={nameError ? 'border-destructive' : ''}
                />
                {nameError && <p className="text-xs text-destructive">{nameError}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={emailError ? 'border-destructive' : ''}
                />
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp *</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-secondary rounded-lg border border-input">
                    <span className="text-sm text-muted-foreground">+55</span>
                  </div>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className={`flex-1 ${phoneError ? 'border-destructive' : ''}`}
                  />
                </div>
                {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
              </div>

              {/* Lovable Invite Link */}
              <div className="space-y-2">
                {/* Mensagem de Atenção */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-2">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">⚠️ Atenção:</span> Aqui neste campo abaixo você tem que colocar o link de convite da sua conta Lovable que vai receber os créditos. Qualquer dúvida, volte no vídeo acima desta página para poder entender.
                  </p>
                </div>
                <Label htmlFor="lovableLink">Link de Convite da sua conta Lovable *</Label>
                <Input
                  id="lovableLink"
                  placeholder="https://lovable.dev/..."
                  value={lovableLink}
                  onChange={(e) => {
                    setLovableLink(e.target.value);
                    setLinkError('');
                  }}
                  className={linkError ? 'border-destructive' : ''}
                />
                {linkError && <p className="text-xs text-destructive">{linkError}</p>}
                <p className="text-xs text-muted-foreground">
                  Cole o link de convite da sua conta Lovable para recebermos os créditos
                </p>
              </div>
            </div>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Gerando código PIX...</p>
            </div>
          )}

          {/* PIX Generated Step */}
          {step === 'pix-generated' && pixData && (
            <div className="space-y-4">
              {/* QR Code */}
              {pixData.qrCodeImage && (
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-xl inline-block">
                    <img 
                      src={pixData.qrCodeImage || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.brCode)}`} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 mx-auto"
                      onError={(e) => {
                        // Fallback: gera QR Code via API online se a imagem falhar
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.brCode)}`;
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Timer */}
              {pixData.expiresAt && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">Expira em:</span>
                  <span className="font-semibold text-foreground">{pixTimeRemaining || 'Verificando...'}</span>
                </div>
              )}

              {/* PIX Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Código PIX Copia e Cola:</label>
                <div className="flex gap-2">
                  <Input
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
                <CheckCircle className="h-8 w-8 text-emerald-500" />
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

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Pedido Enviado!</h3>
                <p className="text-sm text-muted-foreground">
                  Entraremos em contato via WhatsApp em breve para finalizar seu pedido.
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
                <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao Enviar</h3>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-secondary/20">
          {step === 'form' && (
            <Button
              onClick={handleSubmit}
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Comprar Agora
            </Button>
          )}

          {step === 'loading' && (
            <Button
              disabled
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl opacity-50"
            >
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processando...
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
                onClick={handleSubmit}
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

          {step === 'success' && (
            <Button
              onClick={handleClose}
              className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl"
            >
              Concluir
            </Button>
          )}
        </div>
      </div>

      {/* Exit Offer Modal - Aparece por cima */}
      {showExitOffer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={handleRejectDiscount}
          />
          
          {/* Modal de Oferta */}
          <div className="relative w-full max-w-md bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 border-2 border-white/30 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            {/* Timer Header */}
            <div className="bg-black/30 backdrop-blur-sm px-6 py-3 flex items-center justify-between border-b border-white/20">
              <div className="flex items-center gap-2 text-white">
                <Timer className="h-5 w-5 animate-pulse" />
                <span className="text-sm font-medium">Oferta expira em:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-lg animate-pulse">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 text-yellow-300 text-3xl animate-bounce">✨</div>
              <div className="absolute top-4 right-4 text-yellow-300 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</div>
              <div className="absolute bottom-4 left-8 text-yellow-300 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>💎</div>
              <div className="absolute bottom-4 right-8 text-yellow-300 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>🔥</div>

              {/* Main Content */}
              <div className="relative z-10 space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 animate-pulse">
                  <Gift className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-3xl font-black text-white mb-2">
                  ESPERA! 🛑
                </h3>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30">
                  <p className="text-white text-lg font-bold mb-2">
                    Não vá embora ainda!
                  </p>
                  <p className="text-white/90 text-sm">
                    Você tem uma oferta exclusiva esperando!
                  </p>
                </div>

                {/* Discount Badge */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full px-6 py-3 inline-flex items-center gap-2 font-black text-2xl shadow-xl">
                  <Zap className="h-6 w-6" />
                  <span>15% DE DESCONTO AGORA!</span>
                  <Zap className="h-6 w-6" />
                </div>

                {/* Price Comparison */}
                {product && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="text-sm">Preço Original:</span>
                      <span className="text-lg line-through opacity-70">
                        R$ {product.discountPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="text-sm font-semibold">Desconto (15%):</span>
                      <span className="text-lg font-bold text-yellow-300">
                        -R$ {(product.discountPrice * 0.15).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="border-t border-white/30 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">Preço Final:</span>
                        <span className="text-3xl font-black text-yellow-300">
                          R$ {(product.discountPrice * 0.85).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-white/90 text-sm font-medium">
                  ⏰ Esta oferta é válida apenas por <span className="font-black text-yellow-300">5 minutos</span>!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-black/30 backdrop-blur-sm p-6 space-y-3">
              <Button
                onClick={handleAcceptDiscount}
                className="!w-full !h-14 !bg-white !text-emerald-600 hover:!bg-yellow-300 !font-black !text-lg !rounded-xl !shadow-xl hover:!scale-105 !transition-transform"
                style={{ color: '#059669', backgroundColor: '#ffffff' }}
              >
                <Sparkles className="mr-2 h-5 w-5" style={{ color: '#059669' }} />
                EU QUERO! APLICAR DESCONTO AGORA
              </Button>
              
              <button
                onClick={handleRejectDiscount}
                className="w-full text-white/70 hover:text-white text-sm underline"
              >
                Não, obrigado. Quero pagar o preço normal.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutModal;
