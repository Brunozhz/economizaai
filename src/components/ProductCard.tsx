import { Check, Clock, Zap } from "lucide-react";
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

  return (
    <div className={`group relative flex flex-col h-full rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
      popular 
        ? 'bg-gradient-to-b from-[hsl(220,20%,10%)] to-[hsl(220,20%,6%)] ring-2 ring-[hsl(185,80%,45%)] shadow-[0_0_40px_hsl(185,80%,45%,0.2)]' 
        : 'bg-gradient-to-b from-[hsl(220,20%,9%)] to-[hsl(220,20%,5%)] ring-1 ring-[hsl(220,15%,18%)] hover:ring-[hsl(220,15%,25%)]'
    }`}>
      
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[hsl(160,84%,39%)] via-[hsl(185,80%,45%)] to-[hsl(215,85%,55%)]">
            ⭐ Mais Vendido
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className={`flex flex-col h-full p-5 ${popular ? 'pt-8' : ''}`}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(160,84%,39%,0.1)] text-[hsl(160,84%,45%)] text-xs font-medium">
            <span>-{discount}% OFF</span>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-gradient-lovable mb-1">
            {credits}
          </div>
          <div className="text-sm text-muted-foreground">créditos</div>
        </div>

        {/* Info */}
        <div className="space-y-2.5 mb-5 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-[hsl(185,80%,45%)]" />
            <span>Entrega: {duration}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-[hsl(160,84%,45%)] mt-0.5 shrink-0" />
            <span className="line-clamp-2">{usage}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-4">
          <div className="text-sm text-muted-foreground line-through mb-1">
            R$ {originalPrice.toFixed(2).replace('.', ',')}
          </div>
          <div className="text-3xl font-bold text-foreground">
            R$ {price.toFixed(2).replace('.', ',')}
          </div>
          <div className="text-xs text-[hsl(160,84%,45%)] font-medium mt-1">
            via Pix
          </div>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleBuy}
          className={`w-full h-11 font-semibold text-sm rounded-xl transition-all duration-300 ${
            popular 
              ? 'bg-gradient-to-r from-[hsl(160,84%,39%)] via-[hsl(185,80%,45%)] to-[hsl(215,85%,55%)] hover:opacity-90 shadow-[0_4px_20px_hsl(185,80%,45%,0.3)]' 
              : 'bg-[hsl(220,20%,15%)] hover:bg-[hsl(220,20%,20%)] text-foreground'
          }`}
        >
          <Zap className="mr-2 h-4 w-4" />
          Comprar agora
        </Button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground">
          <span>✓ Créditos oficiais</span>
          <span>✓ Pagamento seguro</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
