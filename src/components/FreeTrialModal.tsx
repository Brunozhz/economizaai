import { useState, useEffect } from "react";
import { X, Gift, Loader2, CheckCircle, PartyPopper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import confetti from "canvas-confetti";

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStatus = 'form' | 'loading' | 'success';

const FreeTrialModal = ({ isOpen, onClose }: FreeTrialModalProps) => {
  const { profile, user } = useAuth();
  const [status, setStatus] = useState<ModalStatus>('form');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { toast } = useToast();

  const isLoggedIn = !!user && !!profile;

  const formatPhone = (value: string) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('55')) {
      numbers = numbers.slice(2);
    }
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
    
    if (isLoggedIn) return true;
    
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
    
    return isValid;
  };

  const getEffectiveName = () => isLoggedIn && profile?.name ? profile.name : customerName.trim();
  const getEffectiveEmail = () => isLoggedIn && profile?.email ? profile.email : email;
  const getEffectivePhone = () => {
    const phoneValue = isLoggedIn && profile?.phone ? profile.phone : phone;
    const phoneNumbers = phoneValue.replace(/\D/g, '');
    return phoneNumbers.startsWith('55') ? phoneNumbers : `55${phoneNumbers}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStatus('loading');

    const effectiveName = getEffectiveName();
    const effectiveEmail = getEffectiveEmail();
    const effectivePhone = getEffectivePhone();

    // Fire Meta Pixel InitiateCheckout event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: 0,
        currency: 'BRL',
        content_name: 'Demonstração - 20 Créditos Grátis',
        content_type: 'product',
        content_ids: ['free_trial_20'],
        num_items: 1,
      });
      console.log('Meta Pixel InitiateCheckout event fired: Free Trial');
    }

    try {
      // Chamar edge function para validar e registrar o resgate
      const { data, error } = await supabase.functions.invoke('claim-free-trial', {
        body: {
          email: effectiveEmail,
          phone: effectivePhone,
          name: effectiveName,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error('Erro ao processar resgate');
      }

      if (!data.success) {
        // Erro de validação (email/telefone já usado)
        setStatus('form');
        toast({
          title: "Não foi possível resgatar",
          description: data.error || "Este e-mail ou telefone já foi utilizado.",
          variant: "destructive",
        });
        return;
      }

      console.log('Free trial claimed successfully');
      setStatus('success');

      // Fire Meta Pixel Purchase event
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Purchase', {
          value: 0,
          currency: 'BRL',
          content_name: 'Demonstração - 20 Créditos Grátis',
          content_type: 'product',
          content_ids: ['free_trial_20'],
        });
        console.log('Meta Pixel Purchase event fired: Free Trial');
      }

      // Fire confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 100,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#22c55e', '#10b981', '#14b8a6', '#facc15', '#f97316'],
        });
      }, 300);

      toast({
        title: "🎉 Créditos Resgatados!",
        description: "Aguarde, nosso Agente de Ativação entrará em contato via WhatsApp!",
      });
    } catch (error) {
      console.error('Error claiming free trial:', error);
      setStatus('form');
      toast({
        title: "Erro",
        description: "Não foi possível resgatar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('form');
      setCustomerName('');
      setPhone('');
      setEmail('');
      setNameError('');
      setPhoneError('');
      setEmailError('');
    }
  }, [isOpen]);

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
        {/* Green badge */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white text-xs font-bold py-2 text-center flex items-center justify-center gap-2">
          <Gift className="h-3.5 w-3.5" />
          <span>🎉 20 CRÉDITOS GRÁTIS 🎉</span>
          <Gift className="h-3.5 w-3.5" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 pt-12 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Resgate Grátis</h2>
            <p className="text-sm text-muted-foreground">Preencha seus dados para ativar</p>
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
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 mb-5">
            <div>
              <p className="font-semibold text-foreground">Demonstração</p>
              <p className="text-sm text-muted-foreground">+20 créditos grátis</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground line-through">R$ 14,90</p>
              <p className="text-xl font-bold text-emerald-400">GRÁTIS</p>
            </div>
          </div>

          {/* Form State */}
          {status === 'form' && (
            <div className="space-y-4">
              {isLoggedIn ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-foreground">Conta conectada</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile?.name || 'Usuário'} • {profile?.email}
                  </p>
                </div>
              ) : (
                <>
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Seu Nome</Label>
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

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp</Label>
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

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
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
                </>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full h-12 font-bold gradient-primary hover:scale-[1.02] transition-transform"
              >
                <Gift className="h-5 w-5 mr-2" />
                Resgatar Meus 20 Créditos
              </Button>
            </div>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 text-emerald-400 animate-spin" />
              <p className="text-lg font-medium text-foreground">Ativando seus créditos...</p>
              <p className="text-sm text-muted-foreground">Aguarde um momento</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
                <PartyPopper className="h-10 w-10 text-emerald-400" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  🎉 Parabéns!
                </h3>
                <p className="text-muted-foreground">
                  Seus 20 créditos foram ativados com sucesso!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  <span className="font-bold text-emerald-400">+20 Créditos Adicionados</span>
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Aguarde, nosso Agente de Ativação entrará em contato via WhatsApp!
                </p>
              </div>

              <Button
                onClick={onClose}
                className="w-full h-12 font-bold bg-emerald-500 hover:bg-emerald-600"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Entendi
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreeTrialModal;
