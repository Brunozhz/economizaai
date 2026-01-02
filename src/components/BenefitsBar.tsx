import { Zap, Shield, Star, TrendingUp, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Entrega Automática",
    description: "Acesso imediato aos créditos",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Pagamento via PIX protegido",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    title: "Garantia 7 Dias",
    description: "Satisfação garantida ou devolvemos",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Melhor Preço",
    description: "Economia de até 80%",
    color: "from-primary to-emerald-500",
  },
];

const BenefitsBar = () => {
  return (
    <section className="py-16 border-y border-primary/20 bg-gradient-to-r from-card/80 via-background to-card/80 relative overflow-hidden">
      {/* Animated glow lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section title */}
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Por que escolher a Economiza.IA?</h3>
          <p className="text-muted-foreground">Benefícios exclusivos para você</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-card/70 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon container with enhanced styling */}
              <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <benefit.icon className="h-8 w-8 text-white" />
                {/* Icon glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} blur-xl opacity-50 group-hover:opacity-80 transition-opacity -z-10`} />
              </div>
              
              <div className="relative space-y-2">
                <h3 className="font-bold text-foreground text-base md:text-lg group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;