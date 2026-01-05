import { Check, X, TrendingDown, Sparkles } from "lucide-react";

const comparisonData = [
  { credits: 50, lovablePrice: 68.00, appPrice: 14.90 },
  { credits: 100, lovablePrice: 135.00, appPrice: 27.90 },
  { credits: 200, lovablePrice: 270.00, appPrice: 49.90 },
  { credits: 400, lovablePrice: 540.00, appPrice: 89.90 },
  { credits: 800, lovablePrice: 1080.00, appPrice: 149.90 },
];

const PriceComparison = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-card/50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingDown className="h-4 w-4" />
            Economia de até 80%
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Compare e <span className="text-primary">Economize</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Veja quanto você economiza comprando créditos Lovable através do nosso app
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-4 px-4">
            <div className="text-sm font-medium text-muted-foreground">Créditos</div>
            <div className="text-sm font-medium text-muted-foreground text-center">
              <span className="hidden md:inline">Preço </span>Lovable
            </div>
            <div className="text-sm font-medium text-primary text-center">
              <span className="hidden md:inline">Preço </span>App
            </div>
            <div className="text-sm font-medium text-emerald-500 text-center">
              Economia
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {comparisonData.map((item, index) => (
              <div
                key={index}
                className="group grid grid-cols-4 gap-2 md:gap-4 items-center p-4 md:p-5 rounded-2xl bg-card/80 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Credits */}
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary hidden md:block" />
                  <span className="font-bold text-foreground text-sm md:text-base">
                    {item.credits.toLocaleString()}
                  </span>
                </div>

                {/* Lovable Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <X className="h-4 w-4 text-destructive" />
                    <span className="line-through text-sm md:text-base">
                      R$ {item.lovablePrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* App Price */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary font-bold">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm md:text-lg">
                      R$ {item.appPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Savings Badge */}
                <div className="text-center">
                  <span className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-500 font-bold text-sm md:text-base px-2 md:px-3 py-1 rounded-full">
                    💰
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              * Preços comparativos baseados nos valores oficiais da Lovable
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-emerald-500/20 text-foreground px-6 py-3 rounded-full border border-primary/30">
              <TrendingDown className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Economize até <span className="text-primary font-bold">R$ 680</span> em 5.000 créditos
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
