import { Mail, Zap } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full bg-primary py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
        <Zap className="h-4 w-4" />
        <span>OFERTA ESPECIAL: Cadastre seu e-mail e ganhe até 40% OFF</span>
        <Mail className="h-4 w-4" />
      </div>
    </div>
  );
};

export default TopBar;