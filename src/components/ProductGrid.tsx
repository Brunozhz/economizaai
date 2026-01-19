import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Flame, TrendingUp, Rocket, Building2, Zap, Users, TrendingDown, Sparkles, Crown, Gift, Infinity, Shield, Mail, CheckCircle2, Clock } from "lucide-react";
import ProductCard from "./ProductCard";
import CheckoutModal from "./CheckoutModal";
import EnterpriseChatModal from "./EnterpriseChatModal";
import { Button } from "@/components/ui/button";
import lovableLogo from "@/assets/lovable-logo-new.png";
import cardBackground from "@/assets/card-background.png";
import confetti from "canvas-confetti";

const products = [
  {
    name: "Noob marketing",
    price: 24.90,
    originalPrice: 39.90,
    credits: 250,
    duration: "Inserção imediata",
    usage: "Método garantido 100%. Inserimos os créditos diretamente na sua conta Lovable. Sem golpe e sem burocracia. 100% transparente.",
    tier: "noob" as const,
    popular: false,
  },
  {
    name: "Escala fofo",
    price: 37.00,
    originalPrice: 67.00,
    credits: 500,
    duration: "Inserção imediata",
    usage: "Método garantido 100%. Inserimos os créditos diretamente na sua conta Lovable. Sem golpe e sem burocracia. 100% transparente.",
    tier: "escala" as const,
    popular: false,
  },
  {
    name: "Escala Pesado",
    price: 67.99,
    originalPrice: 119.90,
    credits: 1000,
    duration: "Inserção imediata",
    usage: "Método garantido 100%. Inserimos os créditos diretamente na sua conta Lovable. Sem golpe e sem burocracia. 100% transparente.",
    tier: "pesado" as const,
    popular: false,
  },
  {
    name: "Happy Nation",
    price: 97.00,
    originalPrice: 179.90,
    credits: 1500,
    duration: "Inserção imediata",
    usage: "Perfeito para quem quer investir criando vários aplicativos, escalar infoprodutos com aplicativos, criar plataformas pesadas e muito do marketing digital. Máximo poder criativo!",
    tier: "legendary" as const,
    popular: true,
  },
];

interface Product {
  name: string;
  credits: number;
  price: number;
  originalPrice: number;
}

const ProductGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Restaura estado do modal do sessionStorage antes da primeira renderização
  const getInitialCheckoutState = () => {
    if (typeof window === 'undefined') return { isOpen: false, product: null };
    
    const savedCheckoutState = sessionStorage.getItem('checkoutModalState');
    if (savedCheckoutState) {
      try {
        const { isOpen, product } = JSON.parse(savedCheckoutState);
        if (isOpen && product) {
          return { isOpen: true, product };
        }
      } catch (error) {
        console.error('Erro ao restaurar estado do modal:', error);
      }
    }
    return { isOpen: false, product: null };
  };

  const initialState = getInitialCheckoutState();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(initialState.isOpen);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialState.product);
  const [showInfinitePrice, setShowInfinitePrice] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const confettiFired = useRef(false);

  // Salva estado do modal no sessionStorage quando muda
  useEffect(() => {
    if (isCheckoutOpen && selectedProduct) {
      sessionStorage.setItem('checkoutModalState', JSON.stringify({
        isOpen: true,
        product: selectedProduct,
      }));
    }
  }, [isCheckoutOpen, selectedProduct]);

  // Restaura o modal quando o usuário volta para a aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isCheckoutOpen) {
        // Quando a aba fica visível e o modal está fechado, verifica se deve reabrir
        const savedCheckoutState = sessionStorage.getItem('checkoutModalState');
        if (savedCheckoutState) {
          try {
            const { isOpen, product } = JSON.parse(savedCheckoutState);
            if (isOpen && product) {
              setSelectedProduct(product);
              setIsCheckoutOpen(true);
            }
          } catch (error) {
            console.error('Erro ao restaurar estado do modal:', error);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCheckoutOpen]);

  const handleBuy = (product: Product) => {
    const productData = {
      name: product.name,
      credits: product.credits,
      originalPrice: product.originalPrice,
      discountPrice: product.price,
    };
    setSelectedProduct(productData);
    setIsCheckoutOpen(true);
    // Salva no sessionStorage imediatamente
    sessionStorage.setItem('checkoutModalState', JSON.stringify({
      isOpen: true,
      product: productData,
    }));
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    // Limpa o estado do modal do sessionStorage quando fecha
    sessionStorage.removeItem('checkoutModalState');
    // Mantém os dados do PIX e formulário caso o usuário volte
    // Eles só serão limpos quando o usuário completar ou realmente sair do fluxo
  };

  // Confetti effect when scrolling to products section (first time only)
  useEffect(() => {
    // Check if confetti was already fired in this session
    const confettiAlreadyFired = sessionStorage.getItem('products_confetti_fired') === 'true';
    
    if (confettiAlreadyFired || !sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !confettiFired.current) {
            confettiFired.current = true;
            sessionStorage.setItem('products_confetti_fired', 'true');

            // Fire multiple confetti bursts for amazing effect
            const duration = 3000;
            const end = Date.now() + duration;

            const interval = setInterval(() => {
              if (Date.now() > end) {
                return clearInterval(interval);
              }

              // Left confetti burst
              confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'],
              });

              // Right confetti burst
              confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'],
              });
            }, 200);

            // Main confetti burst from center
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'],
            });

            // Additional burst after 500ms
            setTimeout(() => {
              confetti({
                particleCount: 50,
                angle: 90,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'],
              });
            }, 500);

            // Disconnect observer after firing
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <section id="catalogo" ref={sectionRef} className="py-20 md:py-28 relative overflow-hidden">
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
                <span className="text-sm md:text-sm font-semibold"><span className="text-primary">{products.length}</span> <span className="text-foreground">planos</span></span>
              </div>
              <div className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-orange-500/8 border border-orange-500/20 backdrop-blur-sm hover:bg-orange-500/12 transition-colors cursor-default">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-orange-500" />
                <span className="text-sm md:text-sm font-semibold text-foreground">Entrega imediata</span>
              </div>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="flex justify-center mb-8 md:mb-12 px-2">
            <div className="relative group w-full max-w-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              
              <div className="relative flex flex-col md:flex-row items-center gap-3 md:gap-4 px-5 md:px-8 py-4 md:py-5 bg-gradient-to-r from-emerald-500/25 via-green-500/20 to-emerald-500/25 border-2 border-emerald-400/60 rounded-2xl backdrop-blur-sm">
                {/* Shield icon + Checkmark - Mobile: centered, Desktop: left */}
                <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <svg className="w-8 h-8 md:w-9 md:h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                
                {/* Text - Centered on mobile */}
                <div className="text-center md:text-left flex-1">
                  <p className="text-base md:text-xl lg:text-2xl font-black text-white tracking-tight leading-tight">
                    🔒 Método garantido 100% • Inserimos créditos diretamente na sua conta
                  </p>
                  <p className="text-sm md:text-base text-emerald-300 mt-1 font-semibold">
                    ✅ Sem golpe • Sem burocracia • 100% transparente
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-5">
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
        product={selectedProduct}
      />

    </>
  );
};

export default ProductGrid;
