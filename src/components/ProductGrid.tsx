import { useState } from "react";
import { Building2, Zap, Users, TrendingDown, Rocket } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import EnterpriseChatModal from "./EnterpriseChatModal";
import { Button } from "@/components/ui/button";

const products = [
  {
    name: "Start",
    price: 14.90,
    originalPrice: 68.00,
    credits: 50,
    duration: "1 a 2 dias",
    usage: "Pequenos ajustes de design e correções rápidas",
    tier: "start" as const,
    popular: false,
  },
  {
    name: "Basic",
    price: 27.90,
    originalPrice: 135.00,
    credits: 100,
    duration: "3 a 5 dias",
    usage: "Landing Pages e MVPs simples",
    tier: "basic" as const,
    popular: false,
  },
  {
    name: "Plus",
    price: 49.90,
    originalPrice: 270.00,
    credits: 200,
    duration: "7 a 10 dias",
    usage: "Aplicações multipáginas e protótipos",
    tier: "plus" as const,
    popular: false,
  },
  {
    name: "Advanced",
    price: 89.90,
    originalPrice: 540.00,
    credits: 400,
    duration: "15 a 20 dias",
    usage: "Projetos profissionais e estruturas SaaS",
    tier: "advanced" as const,
    popular: true,
  },
  {
    name: "Elite",
    price: 149.90,
    originalPrice: 1080.00,
    credits: 800,
    duration: "25 a 30 dias",
    usage: "Múltiplos projetos e alta complexidade",
    tier: "elite" as const,
    popular: false,
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
  const [isEnterpriseChatOpen, setIsEnterpriseChatOpen] = useState(false);

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
      <section id="catalogo" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha seu plano
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Créditos oficiais Lovable com entrega rápida e pagamento seguro via Pix
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 max-w-7xl mx-auto">
            {products.map((product, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <ProductCard {...product} onBuy={handleBuy} />
              </div>
            ))}
            
            {/* Enterprise Card */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: `${products.length * 0.08}s` }}
            >
              <div className="group relative flex flex-col h-full rounded-2xl bg-gradient-to-b from-[hsl(220,20%,9%)] to-[hsl(220,20%,5%)] ring-1 ring-[hsl(265,75%,55%,0.3)] hover:ring-[hsl(265,75%,55%,0.5)] transition-all duration-300 hover:-translate-y-1">
                
                <div className="flex flex-col h-full p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-1">Enterprise</h3>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(265,75%,55%,0.1)] text-[hsl(265,75%,55%)] text-xs font-medium">
                      <Building2 className="h-3 w-3" />
                      <span>Atacado</span>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-gradient-lovable mb-1">
                      1000+
                    </div>
                    <div className="text-sm text-muted-foreground">créditos</div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2.5 mb-5 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-[hsl(160,84%,45%)]" />
                      <span>A partir de R$ 0,20/crédito</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-[hsl(185,80%,45%)]" />
                      <span>Atendimento VIP</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 text-[hsl(215,85%,55%)]" />
                      <span>Preço negociável</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Sob consulta</div>
                    <div className="text-2xl font-bold text-foreground">
                      Fale conosco
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => setIsEnterpriseChatOpen(true)}
                    className="w-full h-11 font-semibold text-sm rounded-xl bg-[hsl(220,20%,15%)] hover:bg-[hsl(220,20%,20%)] text-foreground transition-all duration-300"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Solicitar cotação
                  </Button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted-foreground">
                    <span>✓ Volume especial</span>
                    <span>✓ Suporte dedicado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
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

      <EnterpriseChatModal 
        isOpen={isEnterpriseChatOpen} 
        onClose={() => setIsEnterpriseChatOpen(false)} 
      />
    </>
  );
};

export default ProductGrid;
