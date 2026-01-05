import { Check, X, TrendingDown, Sparkles, Heart, Crown, Zap } from "lucide-react";

const comparisonData = [
  { credits: 50, lovablePrice: 68.00, appPrice: 14.90 },
  { credits: 100, lovablePrice: 135.00, appPrice: 27.90 },
  { credits: 200, lovablePrice: 270.00, appPrice: 49.90 },
  { credits: 400, lovablePrice: 540.00, appPrice: 89.90 },
  { credits: 800, lovablePrice: 1080.00, appPrice: 149.90, bestValue: true },
];

const PriceComparison = () => {
  return (
    <section className="py-16 md:py-28 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-[80px] md:blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/15 rounded-full blur-[100px] md:blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto px-3 md:px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-emerald-500/20 text-primary px-4 py-2 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6 border border-primary/30 backdrop-blur-sm">
            <TrendingDown className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>Economia de até 86%</span>
            <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6">
            <span className="text-foreground">Compare e </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Economize
              </span>
              <div className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full -z-10" />
            </span>
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Veja quanto você economiza comprando créditos Lovable através do nosso app
          </p>
        </div>

        {/* Mobile Cards Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop Table Header - Hidden on Mobile */}
          <div className="hidden md:grid grid-cols-4 gap-4 mb-6 px-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Créditos</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-muted-foreground">Lovable</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-primary">Nosso App</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-emerald-500">Economia</span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {comparisonData.map((item, index) => {
              const savings = Math.round((1 - item.appPrice / item.lovablePrice) * 100);
              const isBestValue = 'bestValue' in item && item.bestValue;
              
              return (
                <div
                  key={index}
                  className={`group relative rounded-2xl transition-all duration-500 animate-fade-in ${
                    isBestValue 
                      ? 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Best Value Badge */}
                  {isBestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg whitespace-nowrap">
                        <Crown className="h-3 w-3" />
                        MELHOR OFERTA
                      </div>
                    </div>
                  )}
                  
                  {/* Card Border Glow for Best Value */}
                  {isBestValue && (
                    <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-70" />
                  )}
                  
                  {/* Mobile Card Layout */}
                  <div className={`relative p-4 md:hidden rounded-2xl border backdrop-blur-sm ${
                    isBestValue 
                      ? 'bg-card border-emerald-500/50' 
                      : 'bg-card/80 border-border/50'
                  }`}>
                    {/* Top Row: Credits + Savings */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          isBestValue 
                            ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' 
                            : 'bg-primary/10'
                        }`}>
                          <Zap className={`h-6 w-6 ${isBestValue ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-foreground">{item.credits}</p>
                          <p className="text-xs text-muted-foreground">créditos</p>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center gap-1.5 font-black text-sm px-3 py-2 rounded-full ${
                        isBestValue 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg' 
                          : 'bg-emerald-500/15 text-emerald-500'
                      }`}>
                        <Heart className={`h-4 w-4 ${isBestValue ? 'fill-white' : 'fill-primary text-primary'}`} />
                        -{savings}%
                      </span>
                    </div>
                    
                    {/* Price Comparison Row */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background/50">
                      {/* Lovable Price */}
                      <div className="flex-1 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Lovable</p>
                        <div className="flex items-center justify-center gap-1">
                          <X className="h-3.5 w-3.5 text-destructive/70" />
                          <span className="line-through text-sm text-muted-foreground font-medium">
                            R$ {item.lovablePrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-px h-10 bg-border" />
                      
                      {/* App Price */}
                      <div className="flex-1 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-primary mb-1">Nosso App</p>
                        <div className="flex items-center justify-center gap-1">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className={`font-black text-lg ${isBestValue ? 'text-emerald-500' : 'text-primary'}`}>
                            R$ {item.appPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop Row Layout */}
                  <div className={`relative hidden md:grid grid-cols-4 gap-4 items-center p-6 rounded-2xl border backdrop-blur-sm ${
                    isBestValue 
                      ? 'bg-card border-emerald-500/50' 
                      : 'bg-card/80 border-border/50 hover:border-primary/50'
                  }`}>
                    {/* Credits */}
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isBestValue 
                          ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' 
                          : 'bg-primary/10'
                      }`}>
                        <Zap className={`h-5 w-5 ${isBestValue ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <span className="font-black text-foreground text-xl">
                        {item.credits}
                      </span>
                    </div>

                    {/* Lovable Price */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                        <X className="h-4 w-4 text-destructive/70" />
                        <span className="line-through text-base font-medium">
                          R$ {item.lovablePrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* App Price */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <span className={`font-black text-xl ${
                          isBestValue ? 'text-emerald-500' : 'text-primary'
                        }`}>
                          R$ {item.appPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="text-center">
                      <span className={`inline-flex items-center justify-center gap-1.5 font-black text-base px-4 py-2 rounded-full ${
                        isBestValue 
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30' 
                          : 'bg-emerald-500/15 text-emerald-500'
                      }`}>
                        <Heart className={`h-4 w-4 ${isBestValue ? 'fill-white animate-pulse' : 'fill-primary text-primary'}`} />
                        -{savings}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 md:mt-12 text-center">
            <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-6">
              * Preços comparativos baseados nos valores oficiais da Lovable
            </p>
            
            {/* Mobile CTA */}
            <div className="md:hidden inline-flex flex-col items-center gap-2 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-cyan-500/10 text-foreground px-6 py-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Economize até</p>
                  <p className="text-xl font-black bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                    R$ 930,10
                  </p>
                </div>
              </div>
              <span className="text-muted-foreground text-xs">em 800 créditos</span>
            </div>
            
            {/* Desktop CTA */}
            <div className="hidden md:inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-cyan-500/10 text-foreground px-8 py-4 rounded-2xl border border-primary/20 backdrop-blur-sm shadow-xl shadow-primary/5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Economize até</p>
                <p className="text-2xl font-black bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  R$ 930,10
                </p>
              </div>
              <span className="text-muted-foreground text-sm">em 800 créditos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
