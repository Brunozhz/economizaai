import { Mail, MessageCircle, Sparkles } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full">
      {/* Email Banner */}
      <div className="gradient-primary py-2.5 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-shimmer" />
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-semibold text-primary-foreground relative">
          <Sparkles className="h-4 w-4" />
          <span>Cadastre seu e-mail e ganhe desconto exclusivo</span>
          <Mail className="h-4 w-4" />
        </div>
      </div>
      
      {/* WhatsApp Support */}
      <div className="bg-secondary/60 py-2 px-4 border-b border-border/30">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>Dúvidas? Fale com nosso suporte via WhatsApp</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
