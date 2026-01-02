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
  return <section className="relative py-24 md:py-36 overflow-hidden bg-background">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Enhanced animated orbs with layered depth */}
      <div className="absolute top-10 left-5 w-80 h-80 orb-green blur-[120px] animate-pulse-soft opacity-50" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-500/30 rounded-full blur-[100px] animate-pulse-soft opacity-40" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-10 right-5 w-[500px] h-[500px] orb-emerald blur-[150px] animate-pulse-soft opacity-35" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-green blur-[200px] opacity-15" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern overlay with fade */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(hsl(145, 80%, 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(145, 80%, 45%) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10 animate-fade-in">
          {/* Premium Badge */}
          <div className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass glass-border text-primary text-sm font-semibold cursor-default hover:border-primary/50 transition-all duration-500 animate-shimmer" style={{
            backgroundImage: 'linear-gradient(90deg, transparent, hsl(145, 80%, 45%, 0.15), transparent)',
            backgroundSize: '200% 100%'
          }}>
            <Crown className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">A autoridade em créditos Lovable</span>
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </div>
          
          {/* Main headline with enhanced typography */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight">
            <span className="text-foreground block mb-2">Créditos Lovable com o </span>
            <span className="relative inline-block">
              <span className="text-gradient-animated text-6xl md:text-8xl lg:text-9xl">Melhor Preço</span>
              <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full opacity-50 -z-10" />
            </span>
            <br />
            <span className="text-primary drop-shadow-[0_0_40px_rgba(34,197,94,0.6)] mt-2 inline-block">do Brasil.</span>
          </h1>
          
          {/* Subheadlines with better hierarchy */}
          <div className="space-y-4 max-w-3xl">
            <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Economize agora e desbloqueie seu potencial criativo.
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Acesso imediato, transparência total e uma experiência premium que cabe no seu bolso.
            </p>
          </div>
          
          <p className="text-xl font-bold text-foreground/90 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/20">
            ✨ Não pague mais caro para criar sem limites.
          </p>
          
          {/* Enhanced CTAs */}
          <div className="flex flex-wrap justify-center gap-5 pt-4">
            <Button size="lg" className="h-16 px-10 bg-gradient-to-r from-primary via-emerald-500 to-primary text-primary-foreground font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] transition-all duration-500 hover:scale-105 animate-gradient group" style={{
              backgroundSize: '200% auto'
            }} onClick={() => {
              document.getElementById('catalogo')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}>
              <Zap className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Ver Catálogo
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 border-2 border-primary/50 text-primary hover:bg-primary/10 font-bold text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] group" onClick={() => window.open('https://chat.whatsapp.com/LFYmqa09RCI5e7KecBQ8FG', '_blank')}>
              <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Grupo VIP
            </Button>
          </div>

          {/* Enhanced Carousel */}
          <div className="w-full max-w-lg pt-8">
            <Carousel 
              className="w-full" 
              opts={{ loop: true, duration: 15, dragFree: true }}
              plugins={[Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]}
            >
              <CarouselContent className="-ml-2">
                {[carousel1, carousel2, carousel3, carousel4].map((image, index) => (
                  <CarouselItem key={index} className="pl-2">
                    <div className="p-2">
                      <div className="relative group overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        <img 
                          src={image} 
                          alt={`Motivo ${index + 1}`} 
                          className="w-full h-auto rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105"
                          loading="eager"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 h-12 w-12 bg-background/90 border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-lg" />
              <CarouselNext className="right-2 h-12 w-12 bg-background/90 border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 shadow-lg" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;