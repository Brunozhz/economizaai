import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  originalPrice: number;
  discountPrice: number;
  credits: number;
  tag?: string;
}

const ProductCard = ({ name, originalPrice, discountPrice, credits, tag = "RECARGA" }: ProductCardProps) => {
  const discount = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover-lift shadow-card">
      {/* Product Image/Preview */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary to-background p-6 flex items-center justify-center">
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
          {tag}
        </span>
        
        <div className="text-center space-y-2">
          <p className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">+{credits}</span>
            <span className="text-foreground text-lg ml-1">CRÉDITOS</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-6 w-6 rounded gradient-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">D</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Digital</span>
          </div>
          <p className="text-xs text-muted-foreground">DIRETO NA SUA CONTA</p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-foreground text-sm line-clamp-2">
          {name}
        </h3>

        {/* Pricing */}
        <div className="space-y-1">
          <p className="text-sm text-price-old line-through">
            R$ {originalPrice.toFixed(2)}
          </p>
          <p className="text-xl font-bold text-price-new">
            R$ {discountPrice.toFixed(2)}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full bg-pix-badge flex items-center justify-center">
              <span className="text-[8px] font-bold text-primary-foreground">✓</span>
            </span>
            <span className="text-xs text-muted-foreground">À vista no Pix</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Comprar
          </Button>
          <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
