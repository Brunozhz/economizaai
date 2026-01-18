import { useState } from "react";
import { Check, Crown, Zap, DollarSign, Code2, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderBumpData {
  id: string; // orderbump_1, orderbump_2, etc.
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  imageUrl?: string; // URL da imagem do order bump
  icon?: 'crown' | 'zap' | 'dollar' | 'code' | 'sparkles' | 'users'; // Fallback se não houver imagem
  theme: 'gold' | 'green' | 'purple' | 'yellow';
  proofText: string; // Ex: "74% aproveitam essa oferta"
  badges?: string[]; // Ex: ["Acesso Vitalício", "Sem mensalidade"]
  callToAction?: string; // Ex: "Oferta Única"
}

interface OrderBumpProps {
  data: OrderBumpData;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const OrderBump = ({ data, isSelected, onToggle }: OrderBumpProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Configurações de tema
  const themeConfig = {
    gold: {
      border: 'border-yellow-400/60',
      borderActive: 'border-yellow-400',
      glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]',
      glowActive: 'shadow-[0_0_30px_rgba(250,204,21,0.6)]',
      bg: 'bg-yellow-500/8',
      bgActive: 'bg-yellow-500/15',
      text: 'text-yellow-400',
      checkbox: 'bg-yellow-500',
      checkboxBorder: 'border-yellow-400',
      gradient: 'from-yellow-400 via-amber-500 to-orange-500',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
    },
    green: {
      border: 'border-emerald-400/60',
      borderActive: 'border-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      glowActive: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
      bg: 'bg-emerald-500/8',
      bgActive: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      checkbox: 'bg-emerald-500',
      checkboxBorder: 'border-emerald-400',
      gradient: 'from-emerald-400 to-cyan-400',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    purple: {
      border: 'border-purple-400/60',
      borderActive: 'border-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      glowActive: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
      bg: 'bg-purple-500/8',
      bgActive: 'bg-purple-500/15',
      text: 'text-purple-400',
      checkbox: 'bg-purple-500',
      checkboxBorder: 'border-purple-400',
      gradient: 'from-purple-500 via-violet-500 to-fuchsia-500',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
    yellow: {
      border: 'border-yellow-300/60',
      borderActive: 'border-yellow-300',
      glow: 'shadow-[0_0_20px_rgba(253,224,71,0.3)]',
      glowActive: 'shadow-[0_0_30px_rgba(253,224,71,0.6)]',
      bg: 'bg-yellow-400/8',
      bgActive: 'bg-yellow-400/15',
      text: 'text-yellow-300',
      checkbox: 'bg-yellow-400',
      checkboxBorder: 'border-yellow-300',
      gradient: 'from-yellow-300 via-yellow-400 to-amber-400',
      iconBg: 'bg-yellow-400/20',
      iconColor: 'text-yellow-300',
    },
  };

  const theme = themeConfig[data.theme];

  // Ícones (fallback se não houver imagem)
  const IconComponent = data.icon ? {
    crown: Crown,
    zap: Zap,
    dollar: DollarSign,
    code: Code2,
    sparkles: Sparkles,
    users: Users,
  }[data.icon] : Sparkles;

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
        isSelected 
          ? `${theme.borderActive} ${theme.bgActive} ${theme.glowActive}` 
          : `${theme.border} ${theme.bg} ${theme.glow}`,
        isHovered && !isSelected && "scale-[1.02]"
      )}
      onClick={() => onToggle(data.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border effect for selected state */}
      {isSelected && (
        <div 
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 40%, ${data.theme === 'gold' ? 'rgba(250,204,21,0.2)' : data.theme === 'green' ? 'rgba(16,185,129,0.2)' : data.theme === 'purple' ? 'rgba(168,85,247,0.2)' : 'rgba(253,224,71,0.2)'} 50%, transparent 60%)`,
            backgroundSize: '200% 200%',
            animation: 'energy-flow 3s linear infinite',
          }}
        />
      )}

      <div className="relative p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Header: Icon + Title */}
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Icon/Image */}
          {data.imageUrl && !imageError ? (
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-border/50">
              <img 
                src={data.imageUrl} 
                alt={data.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className={cn(
              "flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center",
              theme.iconBg
            )}>
              <IconComponent className={cn("h-4 w-4 sm:h-5 sm:w-5", theme.iconColor)} />
            </div>
          )}

          {/* Title and Proof */}
          <div className="flex-1 min-w-0">
            <p className={cn("font-bold text-xs sm:text-sm", theme.text)}>
              Sim! {data.title}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
              {data.proofText}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className={cn("text-lg sm:text-xl font-black", theme.text)}>
          +R$ {data.price.toFixed(2).replace('.', ',')}
        </div>

        {/* Description */}
        <div className="space-y-0.5 sm:space-y-1">
          {data.subtitle && (
            <p className={cn("font-bold text-xs sm:text-sm uppercase tracking-wide line-clamp-1", theme.text)}>
              {data.subtitle}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
            {data.description}
          </p>
        </div>

        {/* Badges */}
        {data.badges && data.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {data.badges.map((badge, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold",
                  theme.bg,
                  theme.text
                )}
              >
                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="whitespace-nowrap">{badge}</span>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action Badge */}
        {data.callToAction && (
          <div className="flex justify-end">
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r",
              theme.gradient,
              "text-white shadow-lg"
            )}>
              <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {data.callToAction}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderBump;
