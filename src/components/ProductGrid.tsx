import { useState } from "react";
import { Flame, TrendingUp, Sparkles, Crown, Zap, Gift, Star } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";

const categories = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "popular", label: "Mais Vendidos", icon: Crown },
  { id: "starter", label: "Iniciante", icon: Zap },
  { id: "pro", label: "Profissional", icon: Star },
  { id: "enterprise", label: "Empresarial", icon: Gift },
];

const products = [
  // Starter
  { name: "Pacote Iniciante - 25 créditos", originalPrice: 45.00, discountPrice: 9.90, credits: 25, tag: "INICIANTE", category: "starter" },
  { name: "Recarga Básica - 50 créditos", originalPrice: 72.00, discountPrice: 14.89, credits: 50, tag: "RECARGA", category: "starter" },
  { name: "Pacote Econômico - 75 créditos", originalPrice: 99.00, discountPrice: 19.90, credits: 75, tag: "ECONÔMICO", category: "starter" },
  
  // Popular
  { name: "Recarga +100 créditos na sua conta", originalPrice: 157.00, discountPrice: 27.24, credits: 100, popular: true, tag: "MAIS VENDIDO", category: "popular" },
  { name: "Pacote Premium - 150 créditos", originalPrice: 199.00, discountPrice: 39.90, credits: 150, tag: "PREMIUM", category: "popular" },
  { name: "Recarga +200 créditos na sua conta", originalPrice: 250.00, discountPrice: 51.94, credits: 200, tag: "DESTAQUE", category: "popular" },
  { name: "Mega Pack - 300 créditos", originalPrice: 350.00, discountPrice: 74.90, credits: 300, popular: true, tag: "MEGA PACK", category: "popular" },
  { name: "Recarga +400 créditos na sua conta", originalPrice: 400.00, discountPrice: 97.44, credits: 400, popular: true, tag: "TOP VENDAS", category: "popular" },
  
  // Pro
  { name: "Pacote Pro - 500 créditos", originalPrice: 550.00, discountPrice: 119.90, credits: 500, tag: "PRO", category: "pro" },
  { name: "Ultra Pack - 600 créditos", originalPrice: 650.00, discountPrice: 139.90, credits: 600, tag: "ULTRA", category: "pro" },
  { name: "Super Pack - 700 créditos", originalPrice: 750.00, discountPrice: 149.90, credits: 700, tag: "SUPER", category: "pro" },
];

interface Product {
  name: string;
  credits: number;
  originalPrice: number;
  discountPrice: number;
  tag?: string;
  popular?: boolean;
  category?: string;
}

const ProductGrid = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = activeCategory === "all" 
    ? products 
    : activeCategory === "popular"
    ? products.filter(p => p.popular)
    : products.filter(p => p.category === activeCategory);

  return (
    <>
      <section id="catalogo" className="py-16 md:py-20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
                  <Flame className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  Catálogo Completo
                </h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-lg">
                Escolha o pacote ideal para você com os melhores descontos do mercado
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">{filteredProducts.length}</strong> produtos disponíveis</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard {...product} onBuy={handleBuy} />
              </div>
            ))}
          </div>

          {/* Load more hint */}
          {filteredProducts.length > 8 && (
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                Mostrando todos os <strong className="text-primary">{filteredProducts.length}</strong> produtos disponíveis
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductGrid;
