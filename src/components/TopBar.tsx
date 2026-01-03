import { useState } from "react";
import { Mail, Zap, Gift } from "lucide-react";
import EmailCaptureModal from "./EmailCaptureModal";

const TopBar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="w-full bg-primary py-2.5 px-4 cursor-pointer hover:bg-primary/90 transition-colors"
      >
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground">
          <Zap className="h-4 w-4 animate-pulse" />
          <span className="hidden sm:inline">BAIXE O APP E CRIE SUA CONTA - Ganhe</span>
          <span className="sm:hidden">Baixe o app e ganhe</span>
          <span className="font-black text-yellow-300">20% OFF</span>
          <Gift className="h-4 w-4" />
        </div>
      </div>
      
      <EmailCaptureModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
};

export default TopBar;