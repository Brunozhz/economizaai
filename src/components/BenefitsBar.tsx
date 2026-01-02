import { Zap, Shield, Clock, CheckCircle } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Entrega rápida",
    description: "Créditos liberados em minutos",
  },
  {
    icon: Shield,
    title: "Pagamento seguro",
    description: "Pix protegido e verificado",
  },
  {
    icon: CheckCircle,
    title: "Créditos oficiais",
    description: "100% Lovable original",
  },
  {
    icon: Zap,
    title: "Melhor preço",
    description: "Economia de até 86%",
  },
];

const BenefitsBar = () => {
  return (
    <section id="beneficios" className="py-16 border-t border-[hsl(220,15%,12%)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-5 rounded-xl bg-[hsl(220,20%,7%)] border border-[hsl(220,15%,12%)] hover:border-[hsl(220,15%,18%)] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(160,84%,39%,0.15)] to-[hsl(185,80%,45%,0.1)] flex items-center justify-center mb-3">
                <benefit.icon className="h-5 w-5 text-[hsl(185,80%,45%)]" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {benefit.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;
