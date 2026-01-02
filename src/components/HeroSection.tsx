import { Sparkles, ArrowRight, Zap, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden mesh-gradient noise-overlay">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-glow opacity-80" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-[10%] w-80 h-80 orb-orange blur-[120px] animate-pulse-soft" />
      <div className="absolute top-40 right-[15%] w-96 h-96 orb-purple blur-[140px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-[30%] w-64 h-64 orb-purple blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-purple border border-accent/30 text-accent text-sm font-semibold shadow-glow-purple">
              <Crown className="h-4 w-4" />
              <span>Economize até 80% com IA</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              <span className="text-foreground">Produtos</span>{" "}
              <span className="gradient-text-mixed">Digitais</span>
              <br />
              <span className="text-foreground">com</span>{" "}
              <span className="gradient-text">Inteligência</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              A <span className="text-primary font-semibold">primeira loja</span> do Brasil que usa IA para encontrar os 
              <span className="text-accent font-semibold"> melhores preços</span> em produtos digitais.
              <span className="text-foreground font-medium"> PIX instantâneo.</span>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 py-4">
              {[
                { value: '50K+', label: 'Clientes' },
                { value: '4.9', label: 'Avaliação', icon: Star },
                { value: '24h', label: 'Suporte' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-foreground font-display">
                    {stat.value}
                    {stat.icon && <Star className="inline h-4 w-4 text-primary fill-primary ml-1" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-bold gradient-primary text-primary-foreground rounded-2xl shadow-glow hover:shadow-glow-sm hover:scale-105 transition-all duration-300 group"
              >
                <Zap className="mr-2 h-5 w-5" />
                Ver Catálogo
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg font-semibold border-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent rounded-2xl transition-all duration-300"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Grupo VIP
              </Button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative animate-slide-up">
            <div className="relative">
              {/* Rotating ring */}
              <div className="absolute inset-[-20px] rounded-[40px] border border-dashed border-primary/20 animate-spin-slow" />
              <div className="absolute inset-[-40px] rounded-[50px] border border-dashed border-accent/10 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
              
              {/* Glow effect behind card */}
              <div className="absolute inset-0 gradient-mixed rounded-3xl blur-[80px] opacity-25 animate-pulse-soft" />
              
              <div className="relative rounded-3xl overflow-hidden gradient-card border border-border/60 shadow-card hover-lift border-gradient">
                <div className="aspect-[4/3] flex items-center justify-center p-10 relative">
                  {/* Inner decorations */}
                  <div className="absolute top-6 right-6 w-24 h-24 rounded-full border-2 border-primary/20 animate-pulse-soft" />
                  <div className="absolute top-10 right-10 w-16 h-16 rounded-full border border-accent/30" />
                  <div className="absolute bottom-10 left-6 w-16 h-16 rounded-full gradient-purple opacity-30 blur-xl" />
                  
                  <div className="text-center space-y-6 relative z-10">
                    <span className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-mixed text-sm font-bold text-primary-foreground shadow-glow animate-glow">
                      <Zap className="h-4 w-4" />
                      SUPER PROMOÇÃO
                    </span>
                    
                    <div className="space-y-2">
                      <p className="text-7xl md:text-8xl font-black font-display">
                        <span className="gradient-text-mixed">+100</span>
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground/80 tracking-widest uppercase">
                        Créditos
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center pt-4">
                      <img 
                        src={logo} 
                        alt="Economiza.IA" 
                        className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,140,50,0.3)]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm tracking-widest uppercase">
                      <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                      Direto na sua conta
                      <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-2xl gradient-primary opacity-25 blur-2xl animate-float" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full gradient-purple opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
