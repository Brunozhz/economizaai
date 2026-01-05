import { ExternalLink, Check, Zap, Crown, Clock, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import cardBackground from "@/assets/card-background.png";

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

        {/* Product Preview - COM IMAGEM DE FUNDO */}
        <div 
          className={`relative px-5 py-8 md:py-6 flex items-center justify-center overflow-hidden ${popular ? 'pt-16 md:pt-14' : ''}`}
          style={{
            backgroundImage: `url(${cardBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Glow do tier por cima */}
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)`
            }}
          />
          
          <div className="relative text-center space-y-2 z-10">
            {/* Title com fundo semi-transparente */}
            <div className="inline-block px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
              <h3 className={`text-base md:text-sm font-extrabold tracking-[0.15em] uppercase text-white`}
                style={{
                  textShadow: `0 0 20px ${colors.primary}, 0 2px 4px rgba(0,0,0,0.8)`
                }}
              >
                {name}
              </h3>
            </div>
            
            {/* Credits display - maior destaque */}
            <div className="relative py-3 md:py-2">
              <p 
                className="text-7xl md:text-6xl font-black font-display leading-none text-white"
                style={{
                  textShadow: `0 0 40px ${colors.primary}, 0 0 80px ${colors.glow}, 0 4px 8px rgba(0,0,0,0.9)`,
                  WebkitTextStroke: `1px ${colors.primary}`,
                }}
              >
                {credits}
              </p>
            </div>
            
            {/* Label Créditos com estilo */}
            <div className="inline-block px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">
              <p 
                className="text-xs md:text-[10px] font-bold uppercase tracking-[0.25em] text-white/95"
                style={{
                  textShadow: `0 0 10px ${colors.primary}, 0 1px 2px rgba(0,0,0,0.8)`
                }}
              >
                Créditos
              </p>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="relative px-5 md:px-4 py-6 md:py-5 space-y-5 md:space-y-4 bg-gradient-to-b from-card via-card to-background/90">
          {/* Duration & Usage */}
          <div className={`p-4 md:p-3 rounded-xl border text-sm md:text-xs ${
            isElite ? 'bg-yellow-500/8 border-yellow-500/25' :
            isAdvanced ? 'bg-purple-500/8 border-purple-500/25' :
            tier === 'plus' ? 'bg-purple-500/8 border-purple-500/25' :
            tier === 'basic' ? 'bg-cyan-500/8 border-cyan-500/25' :
            'bg-emerald-500/8 border-emerald-500/25'
          }`}>
            <div className="flex items-center gap-2.5 mb-2">
              <Clock className={`h-4 w-4 md:h-3.5 md:w-3.5 ${colors.textClass} opacity-80`} />
              <span className="text-foreground font-semibold text-base md:text-[13px]">{duration}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Target className={`h-4 w-4 md:h-3.5 md:w-3.5 mt-0.5 shrink-0 ${colors.textClass} opacity-80`} />
              <p className="text-muted-foreground/90 leading-relaxed line-clamp-2 text-sm md:text-[12px]">{usage}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 md:space-y-3 text-center py-2 md:py-1">
            {/* Original price */}
            <div className="flex items-center justify-center gap-2">
              <X className="h-4 w-4 md:h-3.5 md:w-3.5 text-red-400/80" />
              <span className="text-red-400/90 line-through text-base md:text-sm font-medium">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-red-400/60 text-xs md:text-[10px] font-medium">(Oficial)</span>
            </div>
            
            {/* Our price - Destacado */}
            <p className={`text-4xl md:text-[32px] font-black leading-none bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
              style={isHot ? {
                filter: `drop-shadow(0 0 12px ${colors.glow})`,
              } : {}}
            >
              R$ {price.toFixed(2).replace('.', ',')}
            </p>
            
            {/* Pix badge */}
            <div className={`inline-flex items-center justify-center gap-2.5 md:gap-2 px-5 md:px-4 py-2.5 md:py-2 rounded-lg ${
              isElite ? 'bg-yellow-500/12 border border-yellow-500/20' :
              isAdvanced ? 'bg-purple-500/12 border border-purple-500/20' :
              tier === 'plus' ? 'bg-purple-500/12 border border-purple-500/20' :
              tier === 'basic' ? 'bg-cyan-500/12 border border-cyan-500/20' :
              'bg-emerald-500/12 border border-emerald-500/20'
            }`}>
              <span className={`h-5 w-5 md:h-4 md:w-4 rounded-full flex items-center justify-center ${colors.bgClass}`}>
                <Check className="h-3 w-3 md:h-2.5 md:w-2.5 text-white" />
              </span>
              <span className="text-sm md:text-[11px] text-foreground/90 font-medium">À vista no <span className={`font-bold ${colors.textClass}`}>Pix</span></span>
            </div>
          </div>

          {/* Action Button - Premium */}
          <Button 
            onClick={handleBuy}
            className={`w-full h-14 md:h-12 font-bold text-base md:text-[13px] rounded-xl transition-all duration-300 ease-out bg-gradient-to-r ${colors.gradient} hover:scale-[1.03] active:scale-[0.98] ${
              isElite ? 'shadow-[0_4px_20px_rgba(250,204,21,0.35)] hover:shadow-[0_8px_30px_rgba(250,204,21,0.5)]' :
              isAdvanced ? 'shadow-[0_4px_16px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_24px_rgba(168,85,247,0.45)]' :
              'shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            <Zap className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Comprar Agora
            <ExternalLink className="ml-2 h-4 w-4 md:h-3.5 md:w-3.5 opacity-70" />
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
