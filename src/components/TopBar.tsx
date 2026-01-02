import { Mail, MessageCircle, Sparkles, Zap } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full">
      {/* Email Banner - Gradient Green */}
      <div className="gradient-primary py-3 px-4 relative overflow-hidden">
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)] animate-shimmer" />
        
        {/* Decorative elements */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-20 h-20 orb-green blur-2xl opacity-50" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-20 h-20 orb-emerald blur-2xl opacity-50" />
        
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm font-bold text-primary-foreground relative">
          <Zap className="h-4 w-4 animate-pulse" />
          <span className="tracking-wide">🔥 OFERTA ESPECIAL: Cadastre seu e-mail e ganhe até 40% OFF</span>
          <Mail className="h-4 w-4" />
        </div>
      </div>
      
      {/* WhatsApp Support */}
      <div className="glass-green py-2.5 px-4 border-b border-primary/20">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-foreground/80">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pix-badge/20 border border-pix-badge/30">
            <MessageCircle className="h-3.5 w-3.5 text-pix-badge" />
            <span className="text-pix-badge font-medium">WhatsApp 24h</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span>Suporte rápido e personalizado</span>
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;