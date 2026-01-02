import { Sparkles, ArrowRight, Zap, Star, Brain, Crown, Shield, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-background">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 orb-green blur-3xl animate-pulse-soft opacity-40" />
      <div className="absolute bottom-20 right-10 w-96 h-96 orb-emerald blur-3xl animate-pulse-soft opacity-30" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-green blur-3xl opacity-20" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(145, 80%, 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(145, 80%, 45%) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass glass-border text-primary text-sm font-semibold animate-shimmer"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, hsl(145, 80%, 45%, 0.1), transparent)',
                backgroundSize: '200% 100%'
              }}
            >
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>A autoridade em créditos Lovable</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="text-foreground">Autoridade</span>
              <span className="text-gradient-animated"> máxima</span>
              <br />
              <span className="text-primary drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">Créditos Lovable</span>
              <br />
              <span className="text-muted-foreground text-xl md:text-2xl lg:text-3xl font-medium mt-4 block">
                Liberdade total para criar sem limites.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Créditos Lovable com acesso imediato, transparência total e experiência premium.
              <span className="block mt-3 font-semibold text-foreground">
                Crie sem interrupções. Escale sem limites.
              </span>
            </p>
            
            {/* Stats with enhanced styling */}
            <div className="flex flex-wrap gap-8 py-4">
              {[
                { value: '50K+', label: 'Clientes Satisfeitos', icon: null },
                { value: '4.9', label: 'Avaliação Média', icon: Star },
                { value: '24h', label: 'Suporte Dedicado', icon: null },
              ].map((stat, i) => (
                <div key={i} className="relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col p-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300">
                    <span className="text-2xl font-black text-foreground flex items-center gap-1">
                      {stat.value}
                      {stat.icon && <stat.icon className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="h-14 px-8 bg-gradient-to-r from-primary via-emerald-500 to-primary text-primary-foreground font-bold text-base rounded-xl shadow-glow hover:shadow-glow-accent transition-all duration-500 hover:scale-105 animate-gradient"
                style={{ backgroundSize: '200% auto' }}
                onClick={() => {
                  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Zap className="mr-2 h-5 w-5" />
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 border-primary/40 text-primary hover:bg-primary/10 font-semibold text-base rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary"
                onClick={() => window.open('https://chat.whatsapp.com/LFYmqa09RCI5e7KecBQ8FG', '_blank')}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Grupo VIP
              </Button>
            </div>
          </div>

          {/* Hero Card - Enhanced */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-emerald-500/30 blur-3xl opacity-60 animate-pulse-soft" />
            
            <div className="relative">
              {/* Animated border */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 rounded-3xl opacity-70 animate-gradient" style={{ backgroundSize: '200% auto' }} />
              
              <div className="relative rounded-3xl overflow-hidden bg-card p-10 backdrop-blur-xl">
                {/* Inner glow */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
                
                <div className="relative text-center space-y-8">
                  {/* Top badge */}
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 text-primary-foreground text-sm font-bold shadow-lg shadow-primary/30">
                    <Zap className="h-4 w-4 animate-pulse" />
                    SUPER PROMOÇÃO
                    <Zap className="h-4 w-4 animate-pulse" />
                  </div>
                  
                  {/* Credits display */}
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 blur-3xl bg-primary/40 rounded-full" />
                      <p className="relative text-7xl md:text-8xl font-black font-display text-gradient-animated drop-shadow-2xl">
                        +100
                      </p>
                    </div>
                    <p className="text-xl font-bold text-muted-foreground uppercase tracking-[0.3em]">
                      Créditos
                    </p>
                  </div>
                  
                  {/* Icon */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
                      <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-emerald-500/30 border border-primary/40 flex items-center justify-center backdrop-blur-sm">
                        <Brain className="h-10 w-10 text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { icon: Rocket, text: 'Entrega Imediata' },
                      { icon: Shield, text: 'Pagamento Seguro' },
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 text-sm text-muted-foreground">
                        <feature.icon className="h-4 w-4 text-primary" />
                        {feature.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;