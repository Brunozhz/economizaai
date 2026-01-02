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
    <section className="py-12 border-y border-border/30 bg-gradient-to-r from-secondary/50 via-card/30 to-secondary/50 relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-4 p-5 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon container */}
              <div className={`relative h-12 w-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              
              <div className="relative">
                <h3 className="font-bold text-foreground text-sm md:text-base group-hover:text-primary transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
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