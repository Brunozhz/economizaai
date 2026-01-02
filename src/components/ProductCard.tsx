import { ExternalLink, Check, Zap, Crown, Clock, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  price: number;
  credits: number;
  duration: string;
  usage: string;
  originalPrice: number;
  tier: 'start' | 'basic' | 'plus' | 'advanced' | 'elite';
  popular?: boolean;
  onBuy: (product: { name: string; credits: number; price: number }) => void;
}

const ProductCard = ({ name, price, credits, duration, usage, originalPrice, tier, popular = false, onBuy }: ProductCardProps) => {
  const handleBuy = () => {
    onBuy({ name, credits, price });
  };

  // Tier-based styling configurations
  const tierStyles = {
    start: {
      borderClass: 'border border-gray-600/50',
      glowClass: '',
      bgGlow: 'rgba(34,197,94,0.05)',
      hoverEffect: '',
      cardBg: 'bg-card/90',
    },
    basic: {
      borderClass: 'border border-primary/30',
      glowClass: 'shadow-[0_0_20px_rgba(34,197,94,0.15),0_0_20px_rgba(0,255,255,0.1)]',
      bgGlow: 'rgba(34,197,94,0.1)',
      hoverEffect: 'hover:shadow-[0_0_30px_rgba(34,197,94,0.25),0_0_30px_rgba(0,255,255,0.15)]',
      cardBg: 'bg-card/95',
    },
    plus: {
      borderClass: 'border-2 border-transparent bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-border',
      glowClass: 'shadow-[0_0_25px_rgba(34,197,94,0.2),0_0_25px_rgba(0,255,255,0.15)]',
      bgGlow: 'rgba(34,197,94,0.15)',
      hoverEffect: 'hover:shadow-[0_0_40px_rgba(34,197,94,0.35),0_0_40px_rgba(0,255,255,0.25)] hover:scale-[1.02]',
      cardBg: 'bg-card',
    },
    advanced: {
      borderClass: 'border-2 border-primary/60',
      glowClass: 'shadow-[0_0_35px_rgba(34,197,94,0.3),0_0_35px_rgba(0,255,255,0.2)]',
      bgGlow: 'rgba(34,197,94,0.2)',
      hoverEffect: 'hover:shadow-[0_0_50px_rgba(34,197,94,0.45),0_0_50px_rgba(0,255,255,0.3)] hover:scale-[1.02]',
      cardBg: 'bg-card',
    },
    elite: {
      borderClass: '',
      glowClass: 'shadow-[0_0_50px_rgba(34,197,94,0.4),0_0_50px_rgba(0,255,255,0.3)]',
      bgGlow: 'rgba(34,197,94,0.25)',
      hoverEffect: 'hover:shadow-[0_0_70px_rgba(34,197,94,0.6),0_0_70px_rgba(0,255,255,0.4)] hover:scale-[1.03]',
      cardBg: 'bg-card',
    },
  };

  const currentStyle = tierStyles[tier];
  const isElite = tier === 'elite';

  return (
    <div className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 ${currentStyle.glowClass} ${currentStyle.hoverEffect}`}>
      {/* Animated gradient border for Elite */}
      {isElite && (
        <div className="absolute inset-0 rounded-3xl p-[3px] animate-border-glow" style={{
          background: 'linear-gradient(90deg, #00FF00, #00FFFF, #00FF00, #00FFFF, #00FF00)',
          backgroundSize: '300% 100%',
        }}>
          <div className="absolute inset-[3px] rounded-3xl bg-card" />
        </div>
      )}
      
      {/* Standard border for non-elite */}
      {!isElite && (
        <div className={`absolute inset-0 rounded-3xl ${currentStyle.borderClass}`} />
      )}
      
      {/* Plus tier pulse effect */}
      {tier === 'plus' && (
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, rgba(34,197,94,0.3), rgba(0,255,255,0.3), rgba(34,197,94,0.3))',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Advanced tier circuit lines effect */}
      {tier === 'advanced' && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 49%, rgba(34,197,94,0.5) 50%, transparent 51%),
                linear-gradient(0deg, transparent 49%, rgba(0,255,255,0.5) 50%, transparent 51%)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </div>
      )}
      
      {/* Card content */}
      <div className={`relative ${currentStyle.cardBg} rounded-3xl overflow-hidden ${isElite ? 'm-[3px]' : 'm-[1px]'}`}>
        {/* Popular Badge - Elite only */}
        {popular && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 text-primary-foreground text-xs font-bold px-4 py-3 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(34,197,94,0.5)]"
              style={{
                animation: 'badge-pulse 2s ease-in-out infinite',
              }}
            >
              <Crown className="h-4 w-4 animate-pulse" />
              <span className="tracking-widest text-sm">⚡ MAIS VENDIDO ⚡</span>
              <Crown className="h-4 w-4 animate-pulse" />
            </div>
          </div>
        )}

        {/* Product Preview */}
        <div className={`relative aspect-[4/3] p-8 flex items-center justify-center overflow-hidden ${popular ? 'pt-16' : ''}`}
          style={{
            background: `radial-gradient(ellipse at top, ${currentStyle.bgGlow} 0%, transparent 60%), linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)`
          }}
        >
          {/* Animated background effects - intensity based on tier */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 ${
              tier === 'start' ? 'bg-primary/10' :
              tier === 'basic' ? 'bg-primary/15' :
              tier === 'plus' ? 'bg-primary/20' :
              tier === 'advanced' ? 'bg-primary/25' :
              'bg-primary/30'
            }`} />
            {(tier !== 'start') && (
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 group-hover:scale-125 transition-all duration-500 ${
                tier === 'basic' ? 'border-primary/20 group-hover:border-primary/30' :
                tier === 'plus' ? 'border-primary/30 group-hover:border-primary/50' :
                tier === 'advanced' ? 'border-primary/40 group-hover:border-primary/60' :
                'border-primary/50 group-hover:border-primary/80'
              }`} />
            )}
            {(tier === 'advanced' || tier === 'elite') && (
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border group-hover:scale-110 transition-transform duration-700 ${
                tier === 'advanced' ? 'border-cyan-400/20' : 'border-cyan-400/30'
              }`} />
            )}
          </div>
          
          <div className="relative text-center space-y-4 z-10">
            {/* Title */}
            <h3 className={`font-bold text-foreground tracking-wide uppercase ${
              isElite ? 'text-3xl bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent' : 'text-2xl'
            }`}>{name}</h3>
            
            {/* Credits display */}
            <div className="relative">
              <div className={`absolute inset-0 blur-3xl rounded-full scale-150 ${
                tier === 'start' ? 'bg-primary/20' :
                tier === 'basic' ? 'bg-primary/30' :
                tier === 'plus' ? 'bg-primary/35' :
                tier === 'advanced' ? 'bg-primary/40' :
                'bg-primary/50'
              }`} />
              <p className={`relative font-black font-display bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl ${
                isElite ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl'
              }`}>
                {credits}
              </p>
            </div>
            
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.25em]">Créditos Lovable</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="relative p-6 space-y-5 bg-gradient-to-b from-card to-background/80">
          {/* Divider with glow */}
          <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent to-transparent ${
            tier === 'start' ? 'via-gray-600/50' :
            tier === 'basic' ? 'via-primary/40' :
            tier === 'plus' ? 'via-primary/50' :
            tier === 'advanced' ? 'via-primary/60' :
            'via-primary/80'
          }`} />
          
          {/* Duration */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${
            tier === 'start' ? 'bg-muted/30 border-border/30' :
            tier === 'basic' ? 'bg-muted/40 border-border/40' :
            tier === 'plus' ? 'bg-muted/50 border-primary/20' :
            tier === 'advanced' ? 'bg-muted/50 border-primary/30' :
            'bg-primary/10 border-primary/40'
          }`}>
            <Clock className={`h-5 w-5 shrink-0 ${isElite ? 'text-cyan-400' : 'text-primary'}`} />
            <div>
              <span className="text-xs text-muted-foreground font-medium">Duração</span>
              <p className="text-sm text-foreground font-semibold">{duration}</p>
            </div>
          </div>

          {/* Usage */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${
            tier === 'start' ? 'bg-muted/30 border-border/30' :
            tier === 'basic' ? 'bg-muted/40 border-border/40' :
            tier === 'plus' ? 'bg-muted/50 border-primary/20' :
            tier === 'advanced' ? 'bg-muted/50 border-primary/30' :
            'bg-primary/10 border-primary/40'
          }`}>
            <Target className={`h-5 w-5 shrink-0 mt-0.5 ${isElite ? 'text-cyan-400' : 'text-primary'}`} />
            <div>
              <span className="text-xs text-muted-foreground font-medium">Uso</span>
              <p className="text-sm text-foreground font-medium leading-relaxed">{usage}</p>
            </div>
          </div>

          {/* Pricing with comparison */}
          <div className="space-y-3">
            {/* Original price crossed out */}
            <div className="flex items-center justify-center gap-2">
              <X className="h-5 w-5 text-red-500 shrink-0" />
              <span className="text-red-500 line-through text-lg font-semibold">
                ~R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-red-400 text-xs">(Oficial)</span>
            </div>
            
            {/* Our price */}
            <div className="flex items-end gap-2 justify-center">
              <p className={`font-black drop-shadow-[0_0_25px_rgba(34,197,94,0.7)] ${
                isElite 
                  ? 'text-5xl md:text-6xl text-transparent bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text animate-pulse' 
                  : 'text-4xl text-primary'
              }`}
                style={isElite ? {
                  textShadow: '0 0 30px rgba(34,197,94,0.8), 0 0 60px rgba(0,255,255,0.5)',
                } : {}}
              >
                R$ {price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${
              tier === 'start' ? 'bg-primary/5 border-primary/10' :
              tier === 'basic' ? 'bg-primary/10 border-primary/15' :
              tier === 'plus' ? 'bg-primary/10 border-primary/20' :
              tier === 'advanced' ? 'bg-primary/15 border-primary/25' :
              'bg-primary/20 border-primary/40'
            }`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center ${
                isElite 
                  ? 'bg-gradient-to-r from-primary via-cyan-500 to-primary shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
                  : 'bg-gradient-to-r from-primary to-emerald-500 shadow-lg shadow-primary/40'
              }`}>
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
              <span className="text-sm text-foreground font-medium">À vista no <span className={`font-bold ${isElite ? 'text-cyan-400' : 'text-primary'}`}>Pix</span></span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleBuy}
            className={`w-full h-14 font-bold text-base rounded-2xl transition-all duration-300 ${
              isElite 
                ? 'bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:scale-[1.02] animate-gradient text-lg' 
                : tier === 'advanced'
                ? 'bg-gradient-to-r from-primary via-emerald-500 to-cyan-600 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]'
                : tier === 'plus'
                ? 'bg-gradient-to-r from-primary to-emerald-500 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02]'
                : tier === 'basic'
                ? 'bg-gradient-to-r from-primary to-emerald-600 hover:shadow-lg hover:shadow-primary/30'
                : 'bg-primary hover:bg-primary/90 hover:shadow-md'
            }`}
            style={isElite ? { backgroundSize: '200% auto' } : {}}
          >
            <Zap className={`mr-2 ${isElite ? 'h-6 w-6' : 'h-5 w-5'}`} />
            Comprar Agora
            <ExternalLink className={`ml-2 ${isElite ? 'h-5 w-5' : 'h-4 w-4'}`} />
          </Button>
        </div>
      </div>

      {/* Elite energized effect */}
      {isElite && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(34,197,94,0.1) 50%, transparent 60%)',
              backgroundSize: '200% 200%',
              animation: 'energy-flow 3s linear infinite',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
