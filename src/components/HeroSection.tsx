import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[hsl(160,84%,39%,0.08)] rounded-full blur-[120px] animate-pulse-soft" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[hsl(215,85%,55%,0.06)] rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,18%)] text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-[hsl(160,84%,45%)] animate-pulse" />
            <span>Revenda oficial de créditos Lovable</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Créditos Lovable com</span>
            <br />
            <span className="text-gradient-lovable">até 86% de desconto</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Transforme suas ideias em aplicações reais. 
            Entrega rápida, pagamento seguro via Pix.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-[hsl(160,84%,39%)] via-[hsl(185,80%,45%)] to-[hsl(215,85%,55%)] text-white font-semibold text-base rounded-xl hover:opacity-90 transition-opacity shadow-[0_4px_24px_hsl(185,80%,45%,0.3)]"
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Zap className="mr-2 h-5 w-5" />
              Ver catálogo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[hsl(185,80%,45%)]" />
              <span>Entrega imediata</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[hsl(160,84%,45%)]" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[hsl(215,85%,55%)]" />
              <span>Créditos oficiais</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
