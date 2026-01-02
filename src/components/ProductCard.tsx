import { ExternalLink, Check, TrendingDown, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoTransparent from "@/assets/logo-transparent.png";

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
    <div className={`group relative bg-card rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${popular ? 'border-primary ring-1 ring-primary/20' : 'border-border/50'}`}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            MAIS VENDIDO
          </div>
        </div>
      )}
      
      {/* Discount Badge */}
      <div className={`absolute ${popular ? 'top-10' : 'top-3'} left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-xs font-semibold`}>
        <TrendingDown className="h-3 w-3" />
        -{discount}%
      </div>

      {/* Product Preview */}
      <div className={`relative aspect-[4/3] bg-secondary/50 p-6 flex items-center justify-center ${popular ? 'pt-10' : ''}`}>
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-background/80 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            {tag}
          </span>
          
          <p className="text-4xl md:text-5xl font-black font-display text-primary">
            +{credits}
          </p>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Créditos</p>
          
          <div className="flex items-center justify-center pt-1">
            <img 
              src={logoTransparent} 
              alt="Economiza.IA" 
              className="h-6 w-auto object-contain opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3 border-t border-border/30">
        <h3 className="font-medium text-foreground text-sm line-clamp-2 min-h-[40px]">
          {name}
        </h3>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground line-through">
              R$ {originalPrice.toFixed(2)}
            </p>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
              -R$ {(originalPrice - discountPrice).toFixed(2)}
            </span>
          </div>
          
          <p className="text-2xl font-bold text-primary">
            R$ {discountPrice.toFixed(2)}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-primary-foreground" />
            </span>
            <span className="text-sm text-muted-foreground">À vista no <span className="text-primary font-medium">Pix</span></span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleBuy}
          className="w-full h-10 bg-primary text-primary-foreground font-semibold"
        >
          <Zap className="mr-2 h-4 w-4" />
          Comprar Agora
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;