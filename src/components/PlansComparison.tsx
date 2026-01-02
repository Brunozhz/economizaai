import { Check, X, Zap, Crown, Sparkles, TrendingUp, Clock, Target, Shield, Users, Headphones, Star } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Start",
    credits: 50,
    price: 14.90,
    pricePerCredit: "R$ 0,30",
    tier: "start" as const,
    color: "green",
    features: {
      credits: "50 créditos",
      duration: "1-2 dias",
      support: "Básico",
      projects: "1 projeto",
      priority: false,
      vip: false,
      customization: false,
      analytics: false,
    }
  },
  {
    name: "Basic",
    credits: 100,
    price: 27.90,
    pricePerCredit: "R$ 0,28",
    tier: "basic" as const,
    color: "cyan",
    features: {
      credits: "100 créditos",
      duration: "3-5 dias",
      support: "Básico",
      projects: "2 projetos",
      priority: false,
      vip: false,
      customization: false,
      analytics: false,
    }
  },
  {
    name: "Plus",
    credits: 200,
    price: 49.90,
    pricePerCredit: "R$ 0,25",
    tier: "plus" as const,
    color: "purple",
    features: {
      credits: "200 créditos",
      duration: "7-10 dias",
      support: "Prioritário",
      projects: "5 projetos",
      priority: true,
      vip: false,
      customization: false,
      analytics: true,
    }
  },
  {
    name: "Advanced",
    credits: 400,
    price: 89.90,
    pricePerCredit: "R$ 0,22",
    tier: "advanced" as const,
    color: "pink",
    popular: true,
    features: {
      credits: "400 créditos",
      duration: "15-20 dias",
      support: "Prioritário",
      projects: "10 projetos",
      priority: true,
      vip: true,
      customization: true,
      analytics: true,
    }
  },
  {
    name: "Elite",
    credits: 800,
    price: 149.90,
    pricePerCredit: "R$ 0,19",
    tier: "elite" as const,
    color: "yellow",
    features: {
      credits: "800 créditos",
      duration: "25-30 dias",
      support: "VIP 24/7",
      projects: "Ilimitados",
      priority: true,
      vip: true,
      customization: true,
      analytics: true,
    }
  },
];

const featureRows = [
  { key: "credits", label: "Créditos", icon: Zap, description: "Total de créditos disponíveis" },
  { key: "duration", label: "Duração Estimada", icon: Clock, description: "Tempo médio de uso" },
  { key: "projects", label: "Projetos Simultâneos", icon: Target, description: "Quantidade de projetos" },
  { key: "support", label: "Suporte", icon: Headphones, description: "Tipo de suporte disponível" },
  { key: "priority", label: "Fila Prioritária", icon: TrendingUp, description: "Processamento mais rápido", boolean: true },
  { key: "vip", label: "Atendimento VIP", icon: Crown, description: "Suporte exclusivo", boolean: true },
  { key: "customization", label: "Customização Avançada", icon: Sparkles, description: "Recursos extras", boolean: true },
  { key: "analytics", label: "Relatórios e Analytics", icon: Shield, description: "Acompanhamento detalhado", boolean: true },
];

const colorClasses = {
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
    gradient: "from-green-400 to-emerald-500",
    pill: "bg-green-500",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    gradient: "from-cyan-400 to-sky-500",
    pill: "bg-cyan-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    gradient: "from-purple-400 to-violet-500",
    pill: "bg-purple-500",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    text: "text-pink-400",
    glow: "shadow-[0_0_30px_rgba(236,72,153,0.3)]",
    gradient: "from-pink-400 to-rose-500",
    pill: "bg-pink-500",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    glow: "shadow-[0_0_40px_rgba(250,204,21,0.4)]",
    gradient: "from-yellow-400 to-orange-500",
    pill: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
};

const PlansComparison = () => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section id="comparativo" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Compare os Planos</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            <span className="text-foreground">Encontre o </span>
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Plano Ideal
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veja todas as features lado a lado e escolha o melhor para você
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[900px]">
            {/* Plans Header */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              {/* Empty cell for feature labels */}
              <div className="p-4" />
              
              {/* Plan Headers */}
              {plans.map((plan) => {
                const colors = colorClasses[plan.color as keyof typeof colorClasses];
                const isHovered = hoveredPlan === plan.name;
                
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl p-4 transition-all duration-300 cursor-pointer ${colors.bg} border ${colors.border} ${
                      isHovered ? `${colors.glow} scale-[1.02]` : ''
                    } ${plan.popular ? 'ring-2 ring-pink-500/50' : ''}`}
                    onMouseEnter={() => setHoveredPlan(plan.name)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                        Mais Popular
                      </div>
                    )}
                    
                    <div className="text-center space-y-2">
                      <span className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>
                        {plan.name}
                      </span>
                      <p className={`text-2xl font-black bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                        {plan.credits}
                      </p>
                      <p className="text-xs text-muted-foreground">créditos</p>
                      <div className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold ${colors.pill} text-white`}>
                        {plan.pricePerCredit}/cr
                      </div>
                      <p className={`text-lg font-bold ${colors.text}`}>
                        R$ {plan.price.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Rows */}
            <div className="space-y-2">
              {featureRows.map((row, rowIndex) => {
                const Icon = row.icon;
                
                return (
                  <div
                    key={row.key}
                    className={`grid grid-cols-6 gap-3 ${rowIndex % 2 === 0 ? 'bg-card/30' : ''} rounded-xl`}
                  >
                    {/* Feature Label */}
                    <div className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{row.label}</p>
                        <p className="text-xs text-muted-foreground hidden md:block">{row.description}</p>
                      </div>
                    </div>

                    {/* Feature Values */}
                    {plans.map((plan) => {
                      const colors = colorClasses[plan.color as keyof typeof colorClasses];
                      const value = plan.features[row.key as keyof typeof plan.features];
                      const isHovered = hoveredPlan === plan.name;
                      
                      return (
                        <div
                          key={`${plan.name}-${row.key}`}
                          className={`p-4 flex items-center justify-center transition-all duration-300 ${
                            isHovered ? `${colors.bg} rounded-xl` : ''
                          }`}
                          onMouseEnter={() => setHoveredPlan(plan.name)}
                          onMouseLeave={() => setHoveredPlan(null)}
                        >
                          {row.boolean ? (
                            value ? (
                              <div className={`p-1.5 rounded-full ${colors.pill}`}>
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-full bg-muted">
                                <X className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )
                          ) : (
                            <span className={`text-sm font-medium ${isHovered ? colors.text : 'text-foreground'}`}>
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA Row */}
            <div className="grid grid-cols-6 gap-3 mt-6">
              <div className="p-4" />
              {plans.map((plan) => {
                const colors = colorClasses[plan.color as keyof typeof colorClasses];
                
                return (
                  <div key={`cta-${plan.name}`} className="p-2">
                    <a
                      href="#catalogo"
                      className={`block w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${colors.gradient} ${
                        plan.name === 'Elite' ? 'shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'shadow-lg'
                      }`}
                    >
                      Escolher
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile-friendly cards hint */}
        <p className="text-center text-xs text-muted-foreground mt-4 md:hidden">
          ← Deslize para ver todos os planos →
        </p>
      </div>
    </section>
  );
};

export default PlansComparison;
