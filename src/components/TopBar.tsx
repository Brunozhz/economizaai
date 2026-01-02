import { Zap } from "lucide-react";

const TopBar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[hsl(160,84%,39%)] via-[hsl(185,80%,45%)] to-[hsl(215,85%,55%)] py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-white">
        <Zap className="h-4 w-4" />
        <span>Até 86% OFF em todos os planos • Entrega imediata</span>
      </div>
    </div>
  );
};

export default TopBar;
