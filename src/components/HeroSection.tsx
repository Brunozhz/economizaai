import { Sparkles, ArrowRight, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoTransparent from "@/assets/logo-transparent.png";

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Economize até 80% com IA</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="text-foreground">Produtos Digitais</span>
              <br />
              <span className="text-primary">com Inteligência</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              A primeira loja do Brasil que usa IA para encontrar os melhores preços em produtos digitais. PIX instantâneo.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 py-2">
              {[
                { value: '50K+', label: 'Clientes' },
                { value: '4.9', label: 'Avaliação', icon: true },
                { value: '24h', label: 'Suporte' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {stat.value}
                    {stat.icon && <Star className="inline h-4 w-4 text-primary fill-primary ml-0.5" />}
                  </span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="h-12 px-6 bg-primary text-primary-foreground font-semibold">
                <Zap className="mr-2 h-5 w-5" />
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 border-primary/30 text-primary hover:bg-primary/5">
                <Sparkles className="mr-2 h-5 w-5" />
                Grupo VIP
              </Button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-card border border-border/50 p-8">
              <div className="text-center space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  <Zap className="h-4 w-4" />
                  SUPER PROMOÇÃO
                </span>
                
                <div className="space-y-2">
                  <p className="text-6xl md:text-7xl font-black font-display text-primary">
                    +100
                  </p>
                  <p className="text-xl font-semibold text-muted-foreground uppercase tracking-wider">
                    Créditos
                  </p>
                </div>
                
                <div className="flex items-center justify-center">
                  <img 
                    src={logoTransparent} 
                    alt="Economiza.IA" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Direto na sua conta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;