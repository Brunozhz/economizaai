import { Zap, Shield, Star } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Entrega Automática",
    description: "Acesso imediato após pagamento",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Ambiente 100% seguro",
  },
  {
    icon: Star,
    title: "Garantia de Qualidade",
    description: "7 dias para testar",
  },
];

const BenefitsBar = () => {
  return (
    <section className="py-8 border-y border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-4 justify-center md:justify-start"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;
