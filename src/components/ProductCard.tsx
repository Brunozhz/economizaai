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
      primary: 'rgb(250, 204, 21)', // yellow-400
      glow: 'rgba(250, 204, 21, 0.6)',
      gradient: 'from-yellow-400 via-amber-500 to-orange-500',
      textClass: 'text-yellow-400',
      bgClass: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    },
  };

  const colors = tierColors[tier];
  const isElite = tier === 'elite';
  const isAdvanced = tier === 'advanced';
  const isHot = isElite || isAdvanced;

  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 ${
        isElite ? 'shadow-[0_8px_40px_rgba(250,204,21,0.35)]' :
        isAdvanced ? 'shadow-[0_8px_35px_rgba(168,85,247,0.3)]' :
        tier === 'plus' ? 'shadow-[0_8px_30px_rgba(168,85,247,0.25)]' :
        tier === 'basic' ? 'shadow-[0_8px_25px_rgba(0,255,255,0.25)]' :
        'shadow-[0_8px_25px_rgba(0,255,136,0.25)]'
      } ${
        isElite ? 'hover:shadow-[0_16px_60px_rgba(250,204,21,0.5)]' :
        isAdvanced ? 'hover:shadow-[0_16px_50px_rgba(168,85,247,0.45)]' :
        tier === 'plus' ? 'hover:shadow-[0_16px_45px_rgba(168,85,247,0.4)]' :
        tier === 'basic' ? 'hover:shadow-[0_16px_40px_rgba(0,255,255,0.35)]' :
        'hover:shadow-[0_16px_40px_rgba(0,255,136,0.35)]'
      }`}
    >
      {/* Animated gradient border for Elite */}
      {isElite && (
        <div className="absolute inset-0 rounded-2xl p-[3px] animate-border-glow" style={{
          background: 'linear-gradient(90deg, #facc15, #f59e0b, #f97316, #f59e0b, #facc15)',
          backgroundSize: '300% 100%',
        }}>
          <div className="absolute inset-[3px] rounded-2xl bg-card" />
        </div>
      )}
      
      {/* Standard border - more visible with pulse */}
      {!isElite && (
        <div className={`absolute inset-0 rounded-2xl border-2 animate-pulse-border ${
          isAdvanced ? 'border-purple-500/70' :
          tier === 'plus' ? 'border-purple-500/60' :
          tier === 'basic' ? 'border-cyan-400/50' :
          'border-emerald-400/50'
        }`} style={{
          animation: 'border-pulse 2.5s ease-in-out infinite',
        }} />
      )}
      
      {/* Card content */}
      <div className={`relative bg-card rounded-2xl overflow-hidden ${isElite ? 'm-[2px]' : ''}`}>
        {/* Popular Badge - Elite only */}
        {popular && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-2 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(250,204,21,0.5)]">
              <Crown className="h-3.5 w-3.5" />
              <span className="tracking-wider">⚡ MAIS VENDIDO ⚡</span>
              <Crown className="h-3.5 w-3.5" />
            </div>
          </div>
        )}

        {/* Product Preview */}
        <div className={`relative px-5 py-6 flex items-center justify-center overflow-hidden ${popular ? 'pt-14' : ''}`}
          style={{
            background: `radial-gradient(ellipse at top, ${colors.glow} 0%, transparent 65%), linear-gradient(180deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)`
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-3xl opacity-30`}
              style={{ backgroundColor: colors.primary }}
            />
          </div>
          
          <div className="relative text-center space-y-3 z-10">
            {/* Title */}
            <h3 className={`text-base font-bold tracking-wider uppercase ${colors.textClass} drop-shadow-sm`}>{name}</h3>
            
            {/* Credits display */}
            <div className="relative py-1">
              <p className={`text-5xl font-black font-display leading-none ${colors.textClass}`}>
                <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent drop-shadow-lg`}>
                  {credits}
                </span>
              </p>
            </div>
            
            <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">Créditos</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="relative px-4 py-5 space-y-4 bg-gradient-to-b from-card via-card to-background/90">
          {/* Duration & Usage */}
          <div className={`p-3 rounded-xl border text-xs ${
            isElite ? 'bg-yellow-500/8 border-yellow-500/25' :
            isAdvanced ? 'bg-purple-500/8 border-purple-500/25' :
            tier === 'plus' ? 'bg-purple-500/8 border-purple-500/25' :
            tier === 'basic' ? 'bg-cyan-500/8 border-cyan-500/25' :
            'bg-emerald-500/8 border-emerald-500/25'
          }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <Clock className={`h-3.5 w-3.5 ${colors.textClass} opacity-80`} />
              <span className="text-foreground font-semibold text-[13px]">{duration}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Target className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${colors.textClass} opacity-80`} />
              <p className="text-muted-foreground/90 leading-relaxed line-clamp-2 text-[12px]">{usage}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3 text-center py-1">
            {/* Original price */}
            <div className="flex items-center justify-center gap-2">
              <X className="h-3.5 w-3.5 text-red-400/80" />
              <span className="text-red-400/90 line-through text-sm font-medium">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-red-400/60 text-[10px] font-medium">(Oficial)</span>
            </div>
            
            {/* Our price - Destacado */}
            <p className={`text-[32px] font-black leading-none bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
              style={isHot ? {
                filter: `drop-shadow(0 0 12px ${colors.glow})`,
              } : {}}
            >
              R$ {price.toFixed(2).replace('.', ',')}
            </p>
            
            {/* Pix badge */}
            <div className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
              isElite ? 'bg-yellow-500/12 border border-yellow-500/20' :
              isAdvanced ? 'bg-purple-500/12 border border-purple-500/20' :
              tier === 'plus' ? 'bg-purple-500/12 border border-purple-500/20' :
              tier === 'basic' ? 'bg-cyan-500/12 border border-cyan-500/20' :
              'bg-emerald-500/12 border border-emerald-500/20'
            }`}>
              <span className={`h-4 w-4 rounded-full flex items-center justify-center ${colors.bgClass}`}>
                <Check className="h-2.5 w-2.5 text-white" />
              </span>
              <span className="text-[11px] text-foreground/90 font-medium">À vista no <span className={`font-bold ${colors.textClass}`}>Pix</span></span>
            </div>
          </div>

          {/* Action Button - Premium */}
          <Button 
            onClick={handleBuy}
            className={`w-full h-12 font-bold text-[13px] rounded-xl transition-all duration-300 ease-out bg-gradient-to-r ${colors.gradient} hover:scale-[1.03] active:scale-[0.98] ${
              isElite ? 'shadow-[0_4px_20px_rgba(250,204,21,0.35)] hover:shadow-[0_8px_30px_rgba(250,204,21,0.5)]' :
              isAdvanced ? 'shadow-[0_4px_16px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_24px_rgba(168,85,247,0.45)]' :
              'shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            <Zap className="mr-2 h-4 w-4" />
            Comprar Agora
            <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-70" />
          </Button>
        </div>
      </div>

      {/* Elite energized effect */}
      {isElite && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(45deg, transparent 40%, rgba(250,204,21,0.2) 50%, transparent 60%)',
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
