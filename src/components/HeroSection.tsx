import { Sparkles, ArrowRight, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import carousel1 from "@/assets/carousel-1.png";
import carousel2 from "@/assets/carousel-2.png";
import carousel3 from "@/assets/carousel-3.png";
import carousel4 from "@/assets/carousel-4.png";

const HeroSection = () => {
  return <section className="relative py-20 md:py-32 overflow-hidden bg-background">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 orb-green blur-3xl animate-pulse-soft opacity-40" />
      <div className="absolute bottom-20 right-10 w-96 h-96 orb-emerald blur-3xl animate-pulse-soft opacity-30" style={{
      animationDelay: '1s'
    }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-green blur-3xl opacity-20" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: 'linear-gradient(hsl(145, 80%, 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(145, 80%, 45%) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-border text-primary text-sm font-semibold animate-shimmer" style={{
          backgroundImage: 'linear-gradient(90deg, transparent, hsl(145, 80%, 45%, 0.1), transparent)',
          backgroundSize: '200% 100%'
        }}>
            <Crown className="h-4 w-4 text-yellow-500" />
            <span>A autoridade em créditos Lovable</span>
            <Sparkles className="h-4 w-4" />
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            <span className="text-foreground">Créditos Lovable com o </span>
            <span className="text-gradient-animated">Melhor Preço</span>
            <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">do Brasil.</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-semibold text-foreground">
            Economize agora e desbloqueie seu potencial criativo.
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Acesso imediato, transparência total e uma experiência premium que cabe no seu bolso.
          </p>
          
          <p className="text-lg font-semibold text-foreground">
            Não pague mais caro para criar sem limites.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-primary via-emerald-500 to-primary text-primary-foreground font-bold text-base rounded-xl shadow-glow hover:shadow-glow-accent transition-all duration-500 hover:scale-105 animate-gradient" style={{
            backgroundSize: '200% auto'
          }} onClick={() => {
            document.getElementById('catalogo')?.scrollIntoView({
              behavior: 'smooth'
            });
          }}>
              <Zap className="mr-2 h-5 w-5" />
              Ver Catálogo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-primary/40 text-primary hover:bg-primary/10 font-semibold text-base rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary" onClick={() => window.open('https://chat.whatsapp.com/LFYmqa09RCI5e7KecBQ8FG', '_blank')}>
              <Sparkles className="mr-2 h-5 w-5" />
              Grupo VIP
            </Button>
          </div>

          {/* Carousel */}
          <div className="w-full max-w-md pt-6">
          <Carousel 
              className="w-full" 
              opts={{ loop: true, duration: 20 }}
              plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
            >
              <CarouselContent>
                {[carousel1, carousel2, carousel3, carousel4].map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img 
                        src={image} 
                        alt={`Motivo ${index + 1}`} 
                        className="w-full h-auto rounded-xl shadow-xl"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-background/80 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="right-2 bg-background/80 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;