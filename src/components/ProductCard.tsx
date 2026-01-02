import { ExternalLink, Check, Zap, Crown, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  originalPrice: number;
  discountPrice: number;
  credits: number;
  tag?: string;
  popular?: boolean;
  onBuy: (product: { name: string; credits: number; originalPrice: number; discountPrice: number }) => void;
}

const ProductCard = ({ name, originalPrice, discountPrice, credits, tag = "RECARGA", popular = false, onBuy }: ProductCardProps) => {
  const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

  const handleBuy = () => {
    onBuy({ name, credits, originalPrice, discountPrice });
  };

  return (
    <div className={`group relative rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-3 ${popular ? 'shadow-2xl shadow-primary/40' : 'hover:shadow-2xl hover:shadow-primary/20'}`}>
      {/* Animated gradient border */}
      <div className={`absolute inset-0 rounded-3xl ${popular ? 'bg-gradient-to-r from-primary via-emerald-400 to-cyan-500 p-[2px] animate-gradient' : 'bg-gradient-to-r from-border/50 via-primary/30 to-border/50 p-[1px]'}`} style={{ backgroundSize: '200% auto' }}>
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary via-emerald-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ padding: '1px' }} />
      </div>
      
      {/* Card content */}
      <div className="relative bg-card rounded-3xl overflow-hidden m-[1px]">
        {/* Popular Badge */}
        {popular && (
          <div className="absolute top-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 text-primary-foreground text-xs font-bold px-4 py-2.5 flex items-center justify-center gap-2 shadow-lg">
              <Crown className="h-4 w-4" />
              <span className="tracking-widest">MAIS VENDIDO</span>
              <Crown className="h-4 w-4" />
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        <div className={`absolute ${popular ? 'top-14' : 'top-4'} left-4 z-20`}>
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-lg opacity-60 rounded-xl" />
            <div className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black shadow-xl">
              <Flame className="h-4 w-4" />
              -{discount}% OFF
            </div>
          </div>
        </div>

        {/* Product Preview */}
        <div className={`relative aspect-[4/3] p-8 flex items-center justify-center overflow-hidden ${popular ? 'pt-16' : ''}`}
          style={{
            background: 'radial-gradient(ellipse at top, rgba(34,197,94,0.2) 0%, transparent 60%), linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)'
          }}
        >
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-primary/20 group-hover:scale-125 group-hover:border-primary/40 transition-all duration-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
          
          <div className="relative text-center space-y-5 z-10">
            {/* Tag */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary backdrop-blur-sm shadow-inner">
              <Sparkles className="h-3.5 w-3.5" />
              {tag}
            </span>
            
            {/* Credits display */}
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-primary/40 rounded-full scale-150" />
              <p className="relative text-6xl md:text-7xl font-black font-display bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                +{credits}
              </p>
            </div>
            
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.25em]">Créditos</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="relative p-6 space-y-5 bg-gradient-to-b from-card to-background/80">
          {/* Divider with glow */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <h3 className="font-semibold text-foreground text-base line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-400/80 line-through font-medium">
                R$ {originalPrice.toFixed(2)}
              </p>
              <span className="px-3 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/20">
                Economize R$ {(originalPrice - discountPrice).toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-end gap-2">
              <p className="text-4xl font-black text-primary drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                R$ {discountPrice.toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
              <span className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/40">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </span>
              <span className="text-sm text-foreground font-medium">À vista no <span className="text-primary font-bold">Pix</span></span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleBuy}
            className={`w-full h-14 font-bold text-base rounded-2xl transition-all duration-300 ${
              popular 
                ? 'bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.02] animate-gradient' 
                : 'bg-gradient-to-r from-primary to-emerald-600 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]'
            }`}
            style={{ backgroundSize: '200% auto' }}
          >
            <Zap className="mr-2 h-5 w-5" />
            Comprar Agora
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;