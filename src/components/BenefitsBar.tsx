import { Zap, Shield, Star, Clock } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Entrega Automática",
    description: "Acesso imediato após pagamento",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Ambiente 100% seguro",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Star,
    title: "Garantia de Qualidade",
    description: "7 dias para testar",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Clock,
    title: "Suporte 24/7",
    description: "Atendimento rápido",
    color: "from-blue-500 to-cyan-500",
  },
];

const BenefitsBar = () => {
  return (
    <section className="py-10 border-y border-border/30 bg-gradient-to-b from-secondary/20 to-transparent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground text-sm md:text-base">{benefit.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;
