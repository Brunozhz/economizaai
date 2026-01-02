import { Zap, Shield, Star, Clock, TrendingUp, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Entrega Automática",
    description: "Acesso imediato",
    gradient: "from-primary to-orange-400",
    glow: "group-hover:shadow-[0_0_30px_hsl(25,95%,55%,0.4)]",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Pagamento protegido",
    gradient: "from-emerald-500 to-teal-400",
    glow: "group-hover:shadow-[0_0_30px_hsl(150,80%,45%,0.4)]",
  },
  {
    icon: Star,
    title: "Garantia 7 Dias",
    description: "Satisfação garantida",
    gradient: "from-accent to-pink-400",
    glow: "group-hover:shadow-[0_0_30px_hsl(280,85%,60%,0.4)]",
  },
  {
    icon: TrendingUp,
    title: "IA Premium",
    description: "Melhores preços",
    gradient: "from-blue-500 to-cyan-400",
    glow: "group-hover:shadow-[0_0_30px_hsl(210,90%,55%,0.4)]",
  },
];

const BenefitsBar = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/20" />
      
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-primary/50" />
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-accent" />
            Por que escolher a Economiza.IA
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-accent/50" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group relative flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-card/60 border border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 ${benefit.glow}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon container */}
              <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500`}>
                <benefit.icon className="h-7 w-7 text-white" />
                {/* Glow behind icon */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-sm md:text-base">{benefit.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{benefit.description}</p>
              </div>
              
              {/* Hover gradient border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-primary/20 via-transparent to-accent/20" style={{ padding: '1px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;
