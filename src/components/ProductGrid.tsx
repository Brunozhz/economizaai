import { useState } from "react";
import { Flame, TrendingUp, Rocket, Building2, Zap, Users, TrendingDown, Sparkles, Crown, Gift } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import EnterpriseChatModal from "./EnterpriseChatModal";
import { Button } from "@/components/ui/button";
import lovableLogo from "@/assets/lovable-logo-new.png";

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
      <section id="catalogo" className="py-20 md:py-28 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/50" />
          
          {/* Orbs decorativos */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header - Enhanced */}
          <div className="flex flex-col items-center text-center gap-8 mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm shadow-lg shadow-primary/10">
              <Gift className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-base font-bold text-primary tracking-wide">Oferta Especial por Tempo Limitado</span>
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>
            
            {/* Title */}
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="text-foreground">Pacotes de </span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Créditos
                  </span>
                  <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full -z-10" />
                </span>
              </h2>
              
              {/* Logo com glow premium e animação */}
              <div className="flex items-center justify-center mt-10">
                <a 
                  href="https://lovable.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative group animate-float"
                >
                  {/* Glow externo pulsante */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl blur-3xl opacity-50 group-hover:opacity-100 animate-pulse transition-all duration-700" />
                  
                  {/* Glow intermediário */}
                  <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-80 transition-all duration-500" />
                  
                  {/* Borda animada */}
                  <div 
                    className="absolute -inset-[4px] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(90deg, #f97316, #ec4899, #8b5cf6, #06b6d4, #8b5cf6, #ec4899, #f97316)',
                      backgroundSize: '300% 100%',
                      animation: 'gradient-x 3s linear infinite'
                    }}
                  />
                  
                  {/* Imagem da logo */}
                  <img 
                    src={lovableLogo} 
                    alt="Lovable" 
                    className="relative h-24 rounded-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 z-10"
                  />
                </a>
              </div>
              
              <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
                Escolha o pacote ideal para transformar suas ideias em realidade
              </p>
            </div>
            
            {/* Stats - Enhanced */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-sm hover:scale-105 transition-transform cursor-default">
                <Crown className="h-6 w-6 text-yellow-500" />
                <span className="text-base font-bold text-foreground">Até 86% de desconto</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-sm hover:scale-105 transition-transform cursor-default">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-base font-bold"><span className="text-primary">{products.length + 1}</span> <span className="text-foreground">pacotes</span></span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm hover:scale-105 transition-transform cursor-default">
                <Zap className="h-6 w-6 text-orange-500" />
                <span className="text-base font-bold text-foreground">Entrega imediata</span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard {...product} onBuy={handleBuy} />
              </div>
            ))}
            
            {/* Enterprise Card - Inline */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: `${products.length * 0.1}s` }}
            >
              <div className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] h-full">
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl p-[2px] animate-border-glow" style={{
                  background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #3b82f6, #8b5cf6, #06b6d4)',
                  backgroundSize: '300% 100%',
                }}>
                  <div className="absolute inset-[2px] rounded-2xl bg-card" />
                </div>
                
                {/* Card content */}
                <div className="relative bg-card rounded-2xl overflow-hidden m-[2px] h-full flex flex-col">
                  {/* Header Badge */}
                  <div className="absolute top-0 left-0 right-0 z-20">
                    <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-2 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(6,182,212,0.5)]">
                      <Building2 className="h-3.5 w-3.5" />
                      <span className="tracking-wider">ENTERPRISE</span>
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Product Preview */}
                  <div className="relative p-5 pt-12 flex items-center justify-center overflow-hidden"
                    style={{
                      background: 'radial-gradient(ellipse at top, rgba(6,182,212,0.4) 0%, transparent 70%), linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)'
                    }}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl opacity-40 bg-cyan-500" />
                    </div>
                    
                    <div className="relative text-center space-y-2 z-10">
                      <h3 className="text-lg font-bold tracking-wide uppercase text-cyan-400">Atacado</h3>
                      <div className="relative">
                        <p className="text-4xl font-black font-display bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                          1000+
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Créditos</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="relative p-4 space-y-3 bg-gradient-to-b from-card to-background/80 flex-1 flex flex-col">
                    {/* Features */}
                    <div className="p-2.5 rounded-lg border bg-cyan-500/10 border-cyan-500/20 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-foreground font-semibold">A partir de 1.000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-3.5 w-3.5 text-green-400" />
                        <span className="text-green-400 font-bold">R$ 0,20/crédito</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-purple-400" />
                        <span className="text-muted-foreground">Atendimento VIP</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 text-center flex-1 flex flex-col justify-center">
                      <p className="text-sm text-muted-foreground">Preço negociável</p>
                      <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Sob consulta
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => setIsEnterpriseChatOpen(true)}
                      className="w-full h-11 font-bold text-sm rounded-xl transition-all duration-300 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                    >
                      <Rocket className="mr-1.5 h-4 w-4" />
                      Solicitar Cotação
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Enterprise Chat Modal */}
      <EnterpriseChatModal 
        isOpen={isEnterpriseChatOpen} 
        onClose={() => setIsEnterpriseChatOpen(false)} 
      />
    </>
  );
};

export default ProductGrid;
