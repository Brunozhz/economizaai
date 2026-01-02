import { ExternalLink, Check, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  originalPrice: number;
  discountPrice: number;
  credits: number;
  tag?: string;
  popular?: boolean;
}

const ProductCard = ({ name, originalPrice, discountPrice, credits, tag = "RECARGA", popular = false }: ProductCardProps) => {
  const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

  return (
    <div className={`group relative bg-card rounded-2xl border overflow-hidden hover-lift shadow-card ${popular ? 'border-primary/50' : 'border-border/50'}`}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 right-0 z-10">
          <div className="gradient-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl">
            ⭐ POPULAR
          </div>
        </div>
      )}
      
      {/* Discount Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-bold shadow-lg">
        <TrendingDown className="h-3 w-3" />
        -{discount}%
      </div>

      {/* Product Image/Preview */}
      <div className="relative aspect-[4/3] gradient-card p-6 flex items-center justify-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </div>
        
        <div className="text-center space-y-3 relative">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground border border-border/50">
            {tag}
          </span>
          
          <p className="text-4xl md:text-5xl font-black">
            <span className="gradient-text">+{credits}</span>
          </p>
          <p className="text-lg font-bold text-foreground/70 tracking-wide">CRÉDITOS</p>
          
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center shadow-glow-sm">
              <span className="text-sm font-black text-primary-foreground">D</span>
            </div>
            <span className="text-base font-bold text-foreground">Digital</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-4 border-t border-border/30">
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <p className="text-sm text-price-old line-through">
              R$ {originalPrice.toFixed(2)}
            </p>
            <span className="px-2 py-0.5 rounded bg-pix-badge/20 text-pix-badge text-xs font-medium">
              Economia R$ {(originalPrice - discountPrice).toFixed(2)}
            </span>
          </div>
          
          <p className="text-2xl font-black text-price-new">
            R$ {discountPrice.toFixed(2)}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-pix-badge flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </span>
            <span className="text-sm text-muted-foreground">À vista no Pix</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full h-12 gradient-primary text-primary-foreground font-bold rounded-xl shadow-glow-sm hover:shadow-glow hover:scale-[1.02] transition-all duration-300 group/btn"
        >
          <span>Ver Detalhes</span>
          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
