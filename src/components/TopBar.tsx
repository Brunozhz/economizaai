import { Mail, MessageCircle } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full">
      {/* Email Banner */}
      <div className="gradient-primary py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
          <Mail className="h-4 w-4" />
          <span>Cadastre seu e-mail e ganhe desconto exclusivo</span>
        </div>
      </div>
      
      {/* WhatsApp Support */}
      <div className="bg-secondary py-2 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>Dúvidas? Fale com nosso suporte via WhatsApp</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
