import { ExternalLink, Check, TrendingDown, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

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
    <div className={`group relative bg-card rounded-3xl border overflow-hidden hover-lift shadow-card ${popular ? 'border-accent/50 ring-1 ring-accent/20' : 'border-border/50'}`}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="gradient-purple text-accent-foreground text-xs font-bold px-4 py-2 flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            MAIS VENDIDO
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
      
      {/* Discount Badge */}
      <div className={`absolute ${popular ? 'top-12' : 'top-4'} left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold shadow-lg`}>
        <TrendingDown className="h-3 w-3" />
        -{discount}%
      </div>

      {/* Product Image/Preview */}
      <div className={`relative aspect-[4/3] gradient-card p-6 flex items-center justify-center overflow-hidden ${popular ? 'pt-12' : ''}`}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full orb-orange group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full orb-purple blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        
        <div className="text-center space-y-3 relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/80 text-xs font-semibold text-muted-foreground border border-border/50">
            <Zap className="h-3 w-3 text-primary" />
            {tag}
          </span>
          
          <p className="text-5xl md:text-6xl font-black font-display">
            <span className="gradient-text-mixed">+{credits}</span>
          </p>
          <p className="text-lg font-bold text-foreground/70 tracking-widest uppercase">Créditos</p>
          
          <div className="flex items-center justify-center pt-2">
            <img 
              src={logo} 
              alt="Economiza.IA" 
              className="h-8 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-4 border-t border-border/30 bg-gradient-to-b from-card to-secondary/20">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-price-old line-through">
              R$ {originalPrice.toFixed(2)}
            </p>
            <span className="px-2.5 py-1 rounded-lg bg-pix-badge/15 text-pix-badge text-xs font-bold border border-pix-badge/30">
              -R$ {(originalPrice - discountPrice).toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black gradient-text font-display">
              R$ {discountPrice.toFixed(2)}
            </p>
          </div>
          
          <div className="flex items-center gap-2 pt-1">
            <span className="h-5 w-5 rounded-full bg-pix-badge flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </span>
            <span className="text-sm text-muted-foreground">À vista no <span className="text-pix-badge font-semibold">Pix</span></span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleBuy}
          className="w-full h-12 gradient-mixed text-primary-foreground font-bold rounded-xl shadow-glow-sm hover:shadow-glow hover:scale-[1.02] transition-all duration-300 group/btn"
        >
          <Zap className="mr-2 h-4 w-4" />
          <span>Comprar Agora</span>
          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border-glow" />
    </div>
  );
};

export default ProductCard;
