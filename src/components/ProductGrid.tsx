import { Flame, TrendingUp } from "lucide-react";
import ProductCard from "./ProductCard";

const products = [
  { name: "Recarga +50 créditos na sua conta", originalPrice: 72.00, discountPrice: 14.89, credits: 50 },
  { name: "Recarga +100 créditos na sua conta", originalPrice: 157.00, discountPrice: 27.24, credits: 100, popular: true },
  { name: "Recarga +200 créditos na sua conta", originalPrice: 250.00, discountPrice: 51.94, credits: 200 },
  { name: "Recarga +400 créditos na sua conta", originalPrice: 400.00, discountPrice: 97.44, credits: 400, popular: true },
  { name: "Recarga +800 créditos na sua conta", originalPrice: 800.00, discountPrice: 189.90, credits: 800 },
  { name: "Recarga +1000 créditos na sua conta", originalPrice: 1000.00, discountPrice: 229.90, credits: 1000 },
  { name: "Recarga +2000 créditos na sua conta", originalPrice: 2000.00, discountPrice: 449.90, credits: 2000 },
  { name: "Recarga +4000 créditos na sua conta", originalPrice: 4000.00, discountPrice: 879.90, credits: 4000 },
];

const ProductGrid = () => {
  return (
    <section id="catalogo" className="py-16 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
                <Flame className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground">
                Top Mais Procurados
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-lg">
              Os produtos mais vendidos da nossa loja com os melhores descontos
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-pix-badge" />
            <span><strong className="text-foreground">{products.length}</strong> produtos disponíveis</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
