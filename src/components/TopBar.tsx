import { Zap, Download, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/install')}
      className="w-full bg-primary py-2.5 px-4 cursor-pointer hover:bg-primary/90 transition-colors"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
        <Download className="h-4 w-4 animate-bounce" />
        <span className="hidden sm:inline">BAIXE O APP E CRIE SUA CONTA - Ganhe</span>
        <span className="sm:hidden">Baixe o app e ganhe</span>
        <span className="font-black text-yellow-300">20% OFF</span>
        <Gift className="h-4 w-4" />
      </div>
    </div>
  );
};

export default TopBar;