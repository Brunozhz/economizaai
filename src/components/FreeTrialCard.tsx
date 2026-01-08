import { useState, useEffect, useRef } from "react";
import { Gift, Sparkles, PartyPopper, Star, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface FreeTrialCardProps {
  onClaim: () => void;
}

const FreeTrialCard = ({ onClaim }: FreeTrialCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Confetti animation when card enters viewport
  useEffect(() => {
    if (!cardRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            // Fire confetti from both sides
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            
            const randomInRange = (min: number, max: number) => {
              return Math.random() * (max - min) + min;
            };

            const interval = setInterval(() => {
              const timeLeft = animationEnd - Date.now();
              if (timeLeft <= 0) {
                clearInterval(interval);
                return;
              }

              const particleCount = 50 * (timeLeft / duration);
              
              // Left side confetti
              confetti({
                particleCount: Math.floor(particleCount / 2),
                startVelocity: 30,
                spread: 60,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#facc15', '#f97316'],
              });
              
              // Right side confetti
              confetti({
                particleCount: Math.floor(particleCount / 2),
                startVelocity: 30,
                spread: 60,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#facc15', '#f97316'],
              });
            }, 250);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_8px_40px_rgba(34,197,94,0.35)] hover:shadow-[0_16px_60px_rgba(34,197,94,0.5)] h-full"
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl p-[3px] animate-border-glow"
        style={{
          background: 'linear-gradient(90deg, #22c55e, #10b981, #14b8a6, #06b6d4, #22c55e)',
          backgroundSize: '300% 100%',
        }}
      >
        <div className="absolute inset-[3px] rounded-2xl bg-card" />
      </div>

      {/* Floating confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.6,
            }}
          >
            {i % 3 === 0 ? (
              <Sparkles className="h-4 w-4 text-yellow-400" />
            ) : i % 3 === 1 ? (
              <Star className="h-3 w-3 text-emerald-400" />
            ) : (
              <PartyPopper className="h-4 w-4 text-cyan-400" />
            )}
          </div>
        ))}
      </div>

      {/* Card content */}
      <div className="relative bg-card rounded-2xl overflow-hidden m-[2px] h-full flex flex-col">
        {/* Header Badge */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white text-xs font-bold px-3 py-2 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(34,197,94,0.5)]">
            <Gift className="h-3.5 w-3.5" />
            <span className="tracking-wider">🎉 GRÁTIS 🎉</span>
            <Gift className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Product Preview */}
        <div
          className="relative p-5 pt-14 flex items-center justify-center overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(34,197,94,0.4) 0%, transparent 70%), linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-50 bg-emerald-500 animate-pulse" />
          </div>

          <div className="relative text-center space-y-2 z-10">
            <h3 className="text-lg font-bold tracking-wide uppercase text-emerald-400">
              Demonstração
            </h3>
            <div className="relative">
              <p
                className="text-5xl font-black font-display bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(34,197,94,0.5))',
                }}
              >
                20
              </p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Créditos Grátis
            </p>
          </div>
        </div>

        {/* Product Info */}
        <div className="relative p-4 space-y-3 bg-gradient-to-b from-card to-background/80 flex-1 flex flex-col">
          {/* Features */}
          <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-foreground font-semibold">Teste a plataforma</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-foreground font-semibold">Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">Ativação imediata</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 text-center flex-1 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground line-through">R$ 14,90</p>
            <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              GRÁTIS
            </p>
            <p className="text-xs text-emerald-400 font-medium">Experimente agora!</p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClaim}
            className="w-full h-11 font-bold text-sm rounded-xl transition-all duration-300 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] animate-pulse"
          >
            <Gift className="mr-1.5 h-4 w-4" />
            Resgatar Agora
          </Button>
        </div>
      </div>

      {/* Energized effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(45deg, transparent 40%, rgba(34,197,94,0.2) 50%, transparent 60%)',
            backgroundSize: '200% 200%',
            animation: 'energy-flow 3s linear infinite',
          }}
        />
      </div>
    </div>
  );
};

export default FreeTrialCard;
