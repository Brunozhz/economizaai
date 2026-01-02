import { Zap, Shield, Star, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Entrega Automática",
    description: "Acesso imediato",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Pagamento protegido",
  },
  {
    icon: Star,
    title: "Garantia 7 Dias",
    description: "Satisfação garantida",
  },
  {
    icon: TrendingUp,
    title: "IA Premium",
    description: "Melhores preços",
  },
];

const BenefitsBar = () => {
  return (
    <section className="py-10 border-y border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;