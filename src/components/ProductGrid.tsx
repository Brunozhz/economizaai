import { useState } from "react";
import { Flame, TrendingUp } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";

const products = [
  {
    name: "Start",
    price: 14.90,
    originalPrice: 68.00,
    credits: 50,
    duration: "1 a 2 dias",
    usage: "Pequenos ajustes de design, correções rápidas de bugs e testes iniciais de interface.",
    tier: "start" as const,
    popular: false,
  },
  {
    name: "Basic",
    price: 27.90,
    originalPrice: 135.00,
    credits: 100,
    duration: "3 a 5 dias",
    usage: "Criação de Landing Pages completas e desenvolvimento de MVPs (Mínimo Produto Viável) simples.",
    tier: "basic" as const,
    popular: false,
  },
  {
    name: "Plus",
    price: 49.90,
    originalPrice: 270.00,
    credits: 200,
    duration: "7 a 10 dias",
    usage: "Desenvolvimento de aplicações multipáginas e protótipos funcionais intermediários.",
    tier: "plus" as const,
    popular: false,
  },
  {
    name: "Advanced",
    price: 89.90,
    originalPrice: 540.00,
    credits: 400,
    duration: "15 a 20 dias",
    usage: "Projetos profissionais robustos e construção de estruturas completas para SaaS.",
    tier: "advanced" as const,
    popular: false,
  },
  {
    name: "Elite",
    price: 149.90,
    originalPrice: 1080.00,
    credits: 800,
    duration: "25 a 30 dias",
    usage: "Nível Software House. Ideal para quem gerencia múltiplos projetos ou sistemas de alta complexidade.",
    tier: "elite" as const,
    popular: true,
  },
];

interface Product {
  name: string;
  credits: number;
  price: number;
}

const ProductGrid = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <section id="catalogo" className="py-16 md:py-20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
                  <Flame className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground">
                  Pacotes de Créditos
                </h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Escolha o pacote ideal para o seu projeto
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span><strong className="text-foreground">{products.length}</strong> pacotes disponíveis</span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} onBuy={handleBuy} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        product={selectedProduct ? {
          name: selectedProduct.name,
          credits: selectedProduct.credits,
          originalPrice: selectedProduct.price,
          discountPrice: selectedProduct.price,
        } : null}
      />
    </>
  );
};

export default ProductGrid;
