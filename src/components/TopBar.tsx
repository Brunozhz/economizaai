import { Download, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/install');
  };

  // Formata a data atual em português brasileiro
  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long' 
    };
    return today.toLocaleDateString('pt-BR', options);
  };

  return (
    <div 
      onClick={handleClick}
      className="w-full bg-primary py-2.5 px-4 cursor-pointer hover:bg-primary/90 transition-colors"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
        <Gift className="h-4 w-4" />
        <span>Oferta de créditos limitada apenas para hoje aqui nesta página 🔥</span>
      </div>
    </div>
  );
};

export default TopBar;