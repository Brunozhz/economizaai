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

  // Tier-based color schemes: green/cyan → purple → purple
  const tierColors = {
    start: {
      primary: 'rgb(0, 255, 136)', // green neon
      glow: 'rgba(0, 255, 136, 0.4)',
      gradient: 'from-emerald-400 to-cyan-400',
      textClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500',
    },
    basic: {
      primary: 'rgb(0, 255, 255)', // cyan
      glow: 'rgba(0, 255, 255, 0.4)',
      gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
      textClass: 'text-cyan-400',
      bgClass: 'bg-cyan-500',
    },
    plus: {
      primary: 'rgb(168, 85, 247)', // purple-500
      glow: 'rgba(168, 85, 247, 0.4)',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
      textClass: 'text-purple-400',
      bgClass: 'bg-purple-500',
    },
    advanced: {
      primary: 'rgb(168, 85, 247)', // purple-500
      glow: 'rgba(168, 85, 247, 0.5)',
      gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
      textClass: 'text-purple-400',
      bgClass: 'bg-purple-500',
    },
    elite: {
      primary: 'rgb(168, 85, 247)', // purple-500
      glow: 'rgba(168, 85, 247, 0.6)',
      gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
      textClass: 'text-purple-400',
      bgClass: 'bg-gradient-to-r from-purple-500 to-violet-500',
    },
  };

  const colors = tierColors[tier];
  const isElite = tier === 'elite';
  const isAdvanced = tier === 'advanced';
  const isHot = isElite || isAdvanced;

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
        isElite ? 'shadow-[0_0_40px_rgba(168,85,247,0.4)]' :
        isAdvanced ? 'shadow-[0_0_25px_rgba(168,85,247,0.3)]' :
        tier === 'plus' ? 'shadow-[0_0_20px_rgba(168,85,247,0.25)]' :
        tier === 'basic' ? 'shadow-[0_0_15px_rgba(0,255,255,0.2)]' :
        'shadow-[0_0_15px_rgba(0,255,136,0.2)]'
      } ${
        isElite ? 'hover:shadow-[0_0_60px_rgba(168,85,247,0.5)]' :
        isAdvanced ? 'hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]' :
        tier === 'plus' ? 'hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]' :
        'hover:shadow-xl'
      }`}
    >
      {/* Animated gradient border for Elite */}
      {isElite && (
        <div className="absolute inset-0 rounded-2xl p-[2px] animate-border-glow" style={{
          background: 'linear-gradient(90deg, #a855f7, #8b5cf6, #c026d3, #8b5cf6, #a855f7)',
          backgroundSize: '300% 100%',
        }}>
          <div className="absolute inset-[2px] rounded-2xl bg-card" />
        </div>
      )}
      
      {/* Standard border */}
      {!isElite && (
        <div className={`absolute inset-0 rounded-2xl border ${
          isAdvanced ? 'border-purple-500/50' :
          tier === 'plus' ? 'border-purple-500/40' :
          tier === 'basic' ? 'border-cyan-500/30' :
          'border-emerald-500/30'
        }`} />
      )}
      
      {/* Card content */}
      <div className={`relative bg-card rounded-2xl overflow-hidden ${isElite ? 'm-[2px]' : ''}`}>
        {/* Popular Badge - Elite only */}
        {popular && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-2 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(168,85,247,0.5)]">
              <Crown className="h-3.5 w-3.5" />
              <span className="tracking-wider">⚡ MAIS VENDIDO ⚡</span>
              <Crown className="h-3.5 w-3.5" />
            </div>
          </div>
        )}

        {/* Product Preview - More compact */}
        <div className={`relative p-5 flex items-center justify-center overflow-hidden ${popular ? 'pt-12' : ''}`}
          style={{
            background: `radial-gradient(ellipse at top, ${colors.glow} 0%, transparent 70%), linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)`
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-40`}
              style={{ backgroundColor: colors.primary }}
            />
          </div>
          
          <div className="relative text-center space-y-2 z-10">
            {/* Title */}
            <h3 className={`text-lg font-bold tracking-wide uppercase ${colors.textClass}`}>{name}</h3>
            
            {/* Credits display */}
            <div className="relative">
              <p className={`text-4xl font-black font-display bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                {credits}
              </p>
            </div>
            
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Créditos</p>
          </div>
        </div>

        {/* Product Info - More compact */}
        <div className="relative p-4 space-y-3 bg-gradient-to-b from-card to-background/80">
          {/* Duration & Usage combined */}
          <div className={`p-2.5 rounded-lg border text-xs ${
            isHot ? 'bg-purple-500/10 border-purple-500/20' :
            tier === 'plus' ? 'bg-purple-500/10 border-purple-500/20' :
            tier === 'basic' ? 'bg-cyan-500/10 border-cyan-500/20' :
            'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className={`h-3.5 w-3.5 ${colors.textClass}`} />
              <span className="text-foreground font-semibold">{duration}</span>
            </div>
            <div className="flex items-start gap-2">
              <Target className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${colors.textClass}`} />
              <p className="text-muted-foreground leading-relaxed line-clamp-2">{usage}</p>
            </div>
          </div>

          {/* Pricing with comparison */}
          <div className="space-y-2 text-center">
            {/* Original price crossed out */}
            <div className="flex items-center justify-center gap-1.5">
              <X className="h-4 w-4 text-red-500" />
              <span className="text-red-500 line-through text-sm font-medium">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-red-400 text-[10px]">(Oficial)</span>
            </div>
            
            {/* Our price */}
            <p className={`text-3xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
              style={isHot ? {
                textShadow: `0 0 20px ${colors.glow}`,
              } : {}}
            >
              R$ {price.toFixed(2).replace('.', ',')}
            </p>
            
            <div className={`flex items-center justify-center gap-2 p-2 rounded-lg ${
              isHot ? 'bg-purple-500/10' :
              tier === 'plus' ? 'bg-purple-500/10' :
              tier === 'basic' ? 'bg-cyan-500/10' :
              'bg-emerald-500/10'
            }`}>
              <span className={`h-5 w-5 rounded-full flex items-center justify-center ${colors.bgClass}`}>
                <Check className="h-3 w-3 text-white" />
              </span>
              <span className="text-xs text-foreground font-medium">À vista no <span className={`font-bold ${colors.textClass}`}>Pix</span></span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleBuy}
            className={`w-full h-11 font-bold text-sm rounded-xl transition-all duration-300 bg-gradient-to-r ${colors.gradient} hover:scale-[1.02] ${
              isElite ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]' :
              isAdvanced ? 'shadow-lg hover:shadow-xl' :
              ''
            }`}
          >
            <Zap className="mr-1.5 h-4 w-4" />
            Comprar Agora
            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Elite energized effect */}
      {isElite && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(168,85,247,0.2) 50%, transparent 60%)',
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
