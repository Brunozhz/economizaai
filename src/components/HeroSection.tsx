import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-glow opacity-60" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="h-4 w-4" />
              <span>Até 80% de desconto</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Produtos Digitais{" "}
              <span className="gradient-text block mt-2">Premium</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Adquira produtos digitais de alta qualidade com os melhores preços do mercado. 
              <span className="text-foreground font-medium"> Pagamento via PIX com liberação instantânea.</span>
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-bold gradient-primary text-primary-foreground rounded-xl shadow-glow hover:shadow-glow-sm hover:scale-105 transition-all duration-300 group"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg font-semibold border-2 border-border/60 text-foreground hover:bg-secondary hover:border-primary/30 rounded-xl transition-all duration-300"
              >
                Grupo VIP
              </Button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative animate-slide-up">
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-[60px] opacity-20 animate-pulse-soft" />
              
              <div className="relative rounded-3xl overflow-hidden gradient-card border border-border/50 shadow-card hover-lift">
                <div className="aspect-[4/3] flex items-center justify-center p-10 relative">
                  {/* Decorative circles */}
                  <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-primary/20" />
                  <div className="absolute bottom-10 left-6 w-14 h-14 rounded-full bg-primary/10" />
                  
                  <div className="text-center space-y-6 relative">
                    <span className="inline-block px-5 py-2 rounded-full gradient-primary text-sm font-bold text-primary-foreground shadow-glow-sm animate-glow">
                      🔥 PROMOÇÃO
                    </span>
                    
                    <div className="space-y-2">
                      <p className="text-6xl md:text-7xl font-black">
                        <span className="gradient-text">+100</span>
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground/80 tracking-wide">
                        CRÉDITOS
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
                        <span className="text-2xl font-black text-primary-foreground">D</span>
                      </div>
                      <span className="text-3xl font-bold text-foreground">Digital</span>
                    </div>
                    
                    <p className="text-muted-foreground text-lg tracking-widest uppercase">
                      Direto na sua conta
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl gradient-primary opacity-20 blur-2xl animate-float" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
