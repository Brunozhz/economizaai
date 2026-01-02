import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Copy, Check, Sparkles, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COUPON_CODE = 'BEMVINDO20';

const EmailCaptureModal = ({ open, onOpenChange }: EmailCaptureModalProps) => {
  const { user, profile } = useAuth();
  const [email, setEmail] = useState(profile?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save lead to database
      const { error } = await supabase
        .from('leads')
        .upsert(
          { 
            email: email.toLowerCase().trim(), 
            source: 'popup_cupom',
            coupon_code: COUPON_CODE,
            user_id: user?.id || null
          },
          { onConflict: 'email' }
        );

      if (error) throw error;

      // Save coupon and email to localStorage for auto-apply in checkout
      localStorage.setItem('promo_coupon', JSON.stringify({
        code: COUPON_CODE,
        discount: 20,
        email: email.toLowerCase().trim()
      }));

      setShowCoupon(true);
      toast.success('Cupom liberado! 🎉');
    } catch (error) {
      console.error('Error saving email:', error);
      toast.error('Erro ao processar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      toast.success('Cupom copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after modal closes
    setTimeout(() => {
      setShowCoupon(false);
      setCopied(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-primary/30 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-center justify-center">
            {showCoupon ? (
              <>
                <PartyPopper className="h-6 w-6 text-yellow-500" />
                <span>Parabéns!</span>
                <PartyPopper className="h-6 w-6 text-yellow-500" />
              </>
            ) : (
              <>
                <Gift className="h-6 w-6 text-primary" />
                <span>Ganhe 20% OFF</span>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {!showCoupon ? (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Cadastre seu e-mail e ganhe um cupom de
              </p>
              <p className="text-3xl font-black text-primary">
                20% de desconto
              </p>
              <p className="text-sm text-muted-foreground">
                na sua primeira compra!
              </p>
            </div>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Digite seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-center text-lg border-primary/30 focus:border-primary"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? 'Liberando cupom...' : 'Quero meu cupom! 🎁'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Fique tranquilo, não enviamos spam.
            </p>
          </form>
        ) : (
          <div className="space-y-6 pt-4 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Seu cupom de desconto exclusivo:
              </p>
              
              <div 
                onClick={handleCopy}
                className="relative group cursor-pointer p-6 rounded-xl bg-primary/10 border-2 border-dashed border-primary/50 hover:border-primary transition-colors"
              >
                <p className="text-4xl font-black text-primary tracking-wider">
                  {COUPON_CODE}
                </p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Clique para copiar
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full h-12 border-primary/50 text-primary hover:bg-primary/10"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5" />
                    Copiar Cupom
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  handleClose();
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full h-12 bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-bold"
              >
                Usar agora no catálogo
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Válido para a primeira compra. Use no checkout.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
