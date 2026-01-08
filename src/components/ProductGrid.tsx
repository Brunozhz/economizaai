import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Flame, TrendingUp, Rocket, Building2, Zap, Users, TrendingDown, Sparkles, Crown, Gift } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import EnterpriseChatModal from "./EnterpriseChatModal";
import FreeTrialCard from "./FreeTrialCard";
import FreeTrialModal from "./FreeTrialModal";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEnterpriseChatOpen, setIsEnterpriseChatOpen] = useState(false);
  const [isFreeTrialOpen, setIsFreeTrialOpen] = useState(false);

  // Check for remarketing redirect on mount
  useEffect(() => {
    const productParam = searchParams.get('produto');
    const isRemarketing = searchParams.get('remarketing') === 'true';
    
    if (productParam && isRemarketing) {
      // Find the product by name
      const product = products.find(p => p.name.toLowerCase() === productParam.toLowerCase());
      if (product) {
        setSelectedProduct({
          name: product.name,
          credits: product.credits,
          price: product.price
        });
        setIsCheckoutOpen(true);
      }
      
      // Clear the URL params
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    // Clear remarketing offer after closing
    localStorage.removeItem('remarketing_offer');
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
        
        <div className="container mx-auto px-3 md:px-4 relative z-10">
          {/* Section Header - Enhanced */}
          <div className="flex flex-col items-center text-center gap-6 md:gap-8 mb-12 md:mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 md:gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-primary/10 border border-primary/25 backdrop-blur-sm">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-xs md:text-sm font-semibold text-primary tracking-wide">Oferta Especial por Tempo Limitado</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            
            {/* Title */}
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="text-foreground">Pacotes de </span>
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Créditos
                  </span>
                  <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full -z-10" />
                </span>
              </h2>
              
              {/* Logo com glow premium e animação */}
              <div className="flex items-center justify-center mt-6 md:mt-10">
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
                    className="relative h-20 md:h-24 rounded-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 z-10"
                  />
                </a>
              </div>
              
              <p className="text-muted-foreground text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed px-2">
                Escolha o pacote ideal para transformar suas ideias em realidade
              </p>
            </div>
            
            {/* Stats - Refined */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-4 md:mt-8">
              <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-yellow-500/8 border border-yellow-500/20 backdrop-blur-sm hover:bg-yellow-500/12 transition-colors cursor-default">
                <Crown className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                <span className="text-sm md:text-sm font-semibold text-foreground">Até 86% OFF</span>
              </div>
              <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-primary/8 border border-primary/20 backdrop-blur-sm hover:bg-primary/12 transition-colors cursor-default">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-sm md:text-sm font-semibold"><span className="text-primary">{products.length + 1}</span> <span className="text-foreground">pacotes</span></span>
              </div>
              <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-orange-500/8 border border-orange-500/20 backdrop-blur-sm hover:bg-orange-500/12 transition-colors cursor-default">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                <span className="text-sm md:text-sm font-semibold text-foreground">Entrega imediata</span>
              </div>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              
              <div className="relative flex items-center gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 bg-gradient-to-r from-emerald-500/20 via-green-500/15 to-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl backdrop-blur-sm">
                {/* Shield icon */}
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                {/* Text */}
                <div className="text-center md:text-left">
                  <p className="text-lg md:text-xl lg:text-2xl font-black text-emerald-400 tracking-tight">
                    Acesso garantido ou seu dinheiro de volta em 24h
                  </p>
                  <p className="text-xs md:text-sm text-emerald-300/70 mt-1">
                    Sua compra 100% protegida • Sem riscos
                  </p>
                </div>
                
                {/* Checkmark badge */}
                <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 items-center justify-center shadow-lg shadow-emerald-500/50">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 sm:gap-4 md:gap-5 xl:gap-4">
            {/* Free Trial Card - First Position */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: '0s' }}
            >
              <FreeTrialCard onClaim={() => setIsFreeTrialOpen(true)} />
            </div>
            
            {products.map((product, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
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

      {/* Free Trial Modal */}
      <FreeTrialModal 
        isOpen={isFreeTrialOpen} 
        onClose={() => setIsFreeTrialOpen(false)} 
      />
    </>
  );
};

export default ProductGrid;
