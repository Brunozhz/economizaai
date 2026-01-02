import { Check, Zap, Crown, Clock, Target, Sparkles, TrendingUp, Shield, Star } from "lucide-react";
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

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const tierColors = {
    start: {
      primary: 'rgb(34, 197, 94)',
      glow: 'rgba(34, 197, 94, 0.3)',
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      textClass: 'text-green-400',
      bgClass: 'bg-green-500',
      borderClass: 'border-green-500/30',
      accentBg: 'bg-green-500/10',
    },
    basic: {
      primary: 'rgb(6, 182, 212)',
      glow: 'rgba(6, 182, 212, 0.3)',
      gradient: 'from-cyan-400 via-sky-500 to-blue-500',
      textClass: 'text-cyan-400',
      bgClass: 'bg-cyan-500',
      borderClass: 'border-cyan-500/30',
      accentBg: 'bg-cyan-500/10',
    },
    plus: {
      primary: 'rgb(168, 85, 247)',
      glow: 'rgba(168, 85, 247, 0.35)',
      gradient: 'from-purple-400 via-violet-500 to-fuchsia-500',
      textClass: 'text-purple-400',
      bgClass: 'bg-purple-500',
      borderClass: 'border-purple-500/40',
      accentBg: 'bg-purple-500/10',
    },
    advanced: {
      primary: 'rgb(236, 72, 153)',
      glow: 'rgba(236, 72, 153, 0.4)',
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      textClass: 'text-pink-400',
      bgClass: 'bg-pink-500',
      borderClass: 'border-pink-500/50',
      accentBg: 'bg-pink-500/10',
    },
    elite: {
      primary: 'rgb(250, 204, 21)',
      glow: 'rgba(250, 204, 21, 0.5)',
      gradient: 'from-yellow-300 via-amber-400 to-orange-500',
      textClass: 'text-yellow-400',
      bgClass: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      borderClass: 'border-yellow-500/60',
      accentBg: 'bg-yellow-500/15',
    },
  };

  const colors = tierColors[tier];
  const isElite = tier === 'elite';
  const isAdvanced = tier === 'advanced';

  return (
    <div 
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 ${
        isElite ? 'scale-[1.02]' : ''
      }`}
    >
      {/* Outer glow effect */}
      <div 
        className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
        style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
      />
      
      {/* Animated gradient border */}
      <div 
        className={`absolute inset-0 rounded-3xl p-[2px] ${isElite ? 'animate-border-glow' : ''}`}
        style={{
          background: isElite 
            ? 'linear-gradient(90deg, #facc15, #f59e0b, #f97316, #f59e0b, #facc15)'
            : `linear-gradient(135deg, ${colors.primary}40, transparent 50%, ${colors.primary}40)`,
          backgroundSize: isElite ? '300% 100%' : '100% 100%',
        }}
      >
        <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
      </div>

      {/* Card content */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Popular Badge - Enhanced */}
        {popular && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="relative overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-slate-900 text-xs font-black px-4 py-2.5 flex items-center justify-center gap-2">
                <Crown className="h-4 w-4 animate-pulse" />
                <span className="tracking-widest uppercase">🔥 Mais Vendido 🔥</span>
                <Crown className="h-4 w-4 animate-pulse" />
              </div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}

        {/* Discount Badge */}
        <div className={`absolute ${popular ? 'top-14' : 'top-4'} right-4 z-10`}>
          <div className={`px-3 py-1.5 rounded-full ${colors.accentBg} border ${colors.borderClass} backdrop-blur-sm`}>
            <span className={`text-xs font-bold ${colors.textClass}`}>-{discount}% OFF</span>
          </div>
        </div>

        {/* Header Section */}
        <div 
          className={`relative p-6 ${popular ? 'pt-14' : ''}`}
          style={{
            background: `radial-gradient(ellipse at top, ${colors.glow} 0%, transparent 60%), 
                         linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,1) 100%)`
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 opacity-20">
            <Sparkles className={`h-6 w-6 ${colors.textClass}`} />
          </div>
          
          {/* Floating orbs */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ backgroundColor: colors.primary }}
          />

          <div className="relative text-center space-y-4 z-10">
            {/* Tier Name */}
            <div className="inline-flex items-center gap-2">
              {isElite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
              <span className={`text-sm font-bold uppercase tracking-[0.2em] ${colors.textClass}`}>
                {name}
              </span>
              {isElite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
            </div>
            
            {/* Credits display - Massive and bold */}
            <div className="relative py-4">
              <p 
                className={`text-6xl md:text-7xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent drop-shadow-2xl`}
                style={{
                  textShadow: `0 0 40px ${colors.glow}`,
                }}
              >
                {credits.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Zap className={`h-4 w-4 ${colors.textClass}`} />
                <span className={`text-sm font-bold uppercase tracking-widest ${colors.textClass}`}>
                  Créditos
                </span>
                <Zap className={`h-4 w-4 ${colors.textClass}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="relative p-5 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-900">
          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`flex items-center gap-2.5 p-3 rounded-xl ${colors.accentBg} border ${colors.borderClass}`}>
              <div className={`p-1.5 rounded-lg ${colors.bgClass}`}>
                <Clock className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-foreground">{duration}</span>
            </div>
            <div className={`flex items-center gap-2.5 p-3 rounded-xl ${colors.accentBg} border ${colors.borderClass}`}>
              <div className={`p-1.5 rounded-lg ${colors.bgClass}`}>
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-foreground">Garantido</span>
            </div>
          </div>

          {/* Usage Info */}
          <div className={`p-3 rounded-xl ${colors.accentBg} border ${colors.borderClass}`}>
            <div className="flex items-start gap-2.5">
              <div className={`p-1.5 rounded-lg ${colors.bgClass} mt-0.5`}>
                <Target className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{usage}</p>
            </div>
          </div>

          {/* Pricing Section - Enhanced */}
          <div className={`relative p-4 rounded-2xl ${colors.accentBg} border ${colors.borderClass} overflow-hidden`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(${colors.primary} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }} />
            </div>
            
            <div className="relative space-y-3">
              {/* Original price */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">De:</span>
                <span className="text-lg text-red-400 line-through font-medium">
                  R$ {originalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              
              {/* Current price */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Por apenas:</span>
                <p 
                  className={`text-4xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent mt-1`}
                >
                  R$ {price.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Pix badge */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${colors.bgClass}`}>
                  <Check className="h-4 w-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">
                    À vista no Pix
                  </span>
                </div>
              </div>

              {/* Savings */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <TrendingUp className={`h-4 w-4 ${colors.textClass}`} />
                <span className={`text-sm font-bold ${colors.textClass}`}>
                  Economia de R$ {(originalPrice - price).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Button - Enhanced */}
          <Button 
            onClick={handleBuy}
            className={`relative w-full h-14 font-black text-base rounded-2xl transition-all duration-300 bg-gradient-to-r ${colors.gradient} hover:scale-[1.02] hover:shadow-2xl overflow-hidden group/btn ${
              isElite ? 'shadow-[0_0_30px_rgba(250,204,21,0.4)]' : 'shadow-lg'
            }`}
          >
            {/* Button shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
            
            <span className="relative flex items-center justify-center gap-2 text-white drop-shadow-md">
              <Zap className="h-5 w-5 animate-pulse" />
              <span className="uppercase tracking-wide">Comprar Agora</span>
              <Sparkles className="h-5 w-5" />
            </span>
          </Button>
        </div>
      </div>

      {/* Elite special effects */}
      {isElite && (
        <>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
            <div className="absolute top-4 left-4 w-8 h-[2px] bg-gradient-to-r from-yellow-400 to-transparent" />
            <div className="absolute top-4 left-4 w-[2px] h-8 bg-gradient-to-b from-yellow-400 to-transparent" />
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
            <div className="absolute bottom-4 right-4 w-8 h-[2px] bg-gradient-to-l from-yellow-400 to-transparent" />
            <div className="absolute bottom-4 right-4 w-[2px] h-8 bg-gradient-to-t from-yellow-400 to-transparent" />
          </div>
          
          {/* Energy flow effect */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                background: 'linear-gradient(45deg, transparent 40%, rgba(250,204,21,0.3) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
                animation: 'energy-flow 3s linear infinite',
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
