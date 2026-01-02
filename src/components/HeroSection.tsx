import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Produtos Digitais com{" "}
              <span className="gradient-text">80% de Desconto</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Adquira produtos digitais premium com os melhores preços. Pagamento via PIX com liberação instantânea.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity">
                <Sparkles className="mr-2 h-4 w-4" />
                Ver Catálogo
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                Grupo VIP
              </Button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-border">
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-background flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <span className="inline-block px-4 py-1.5 rounded-full gradient-primary text-sm font-semibold text-primary-foreground">
                    PROMOÇÃO
                  </span>
                  <div className="space-y-1">
                    <p className="text-5xl md:text-6xl font-bold">
                      <span className="gradient-text">+100</span>
                      <span className="text-foreground text-2xl md:text-3xl ml-2">CRÉDITOS</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-foreground">D</span>
                      </div>
                      <span className="text-2xl font-bold text-foreground">Digital</span>
                    </div>
                    <p className="text-muted-foreground text-lg mt-2">DIRETO NA SUA CONTA</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
