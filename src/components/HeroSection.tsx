import { Sparkles, ArrowRight, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return <section className="relative py-24 md:py-36 overflow-hidden bg-background">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Enhanced animated orbs - Purple/Magenta/Orange theme */}
      <div className="absolute top-10 left-5 w-80 h-80 bg-purple-500/30 rounded-full blur-[120px] animate-pulse-soft opacity-50" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-pink-500/30 rounded-full blur-[100px] animate-pulse-soft opacity-40" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-10 right-5 w-[500px] h-[500px] bg-orange-500/25 rounded-full blur-[150px] animate-pulse-soft opacity-35" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-500/15 rounded-full blur-[200px] opacity-15" />
      
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
        backgroundImage: 'linear-gradient(hsl(330, 85%, 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(330, 85%, 55%) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10 animate-fade-in">
          {/* Premium Badge */}
          <div className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass glass-border text-primary text-sm font-semibold cursor-default hover:border-primary/50 transition-all duration-500 opacity-0 animate-[fade-in-up_0.8s_ease-out_0s_forwards]" style={{
            backgroundImage: 'linear-gradient(90deg, transparent, hsl(330, 85%, 55%, 0.15), transparent)',
            backgroundSize: '200% 100%'
          }}>
            <Crown className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">A autoridade em créditos Lovable</span>
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </div>
          
          {/* Main headline with staggered animation */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]">
              <span className="text-foreground">Créditos Lovable</span>
            </h1>
            
            <div className="relative inline-block opacity-0 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards]">
              <span className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-gradient-animated tracking-tight">
                a partir de R$ 24,90
              </span>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-orange-500/20 blur-3xl rounded-full opacity-50 -z-10 animate-pulse" />
            </div>
            
            <p className="opacity-0 animate-[fade-in-up_0.8s_ease-out_0.6s_forwards]">
              <span className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-gradient-animated">melhor preço do Brasil</span>
            </p>
          </div>
          
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
          
          {/* Enhanced CTA */}
          <div className="flex flex-wrap justify-center gap-5 pt-4">
            <Button size="lg" className="h-16 px-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all duration-500 hover:scale-105 animate-gradient group" style={{
              backgroundSize: '200% auto'
            }} onClick={() => {
              document.getElementById('catalogo')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}>
              <Zap className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              COMPRAR AGORA
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;