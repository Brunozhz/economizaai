import { Download, Smartphone, Zap, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState } from "react";

const InstallAppBanner = () => {
  const { isInstallable, isInstalled, isIOS, installApp, canShowInstall } = usePWAInstall();
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed || !canShowInstall) return null;

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      await installApp();
    }
  };

  return (
    <>
      {/* Floating Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 animate-fade-in">
        <div className="relative bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-[0_8px_40px_rgba(34,197,94,0.25)]">
          {/* Close button */}
          <button 
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary animate-pulse" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-bold text-foreground text-sm mb-1">
                Instalar Economiza.IA
              </h4>
              
              {/* Benefits */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Zap className="h-3 w-3 text-primary" />
                  Acesso rápido
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Wifi className="h-3 w-3 text-primary" />
                  Funciona offline
                </span>
              </div>

              <Button 
                onClick={handleInstall}
                size="sm"
                className="w-full h-9 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-semibold text-xs rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Baixar App Grátis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-card border border-border/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
            {/* Close */}
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                Instalar no iPhone
              </h3>
              <p className="text-sm text-muted-foreground">
                Siga os passos abaixo
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p className="text-sm text-foreground">
                  Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p className="text-sm text-foreground">
                  Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p className="text-sm text-foreground">
                  Toque em <strong>"Adicionar"</strong> no canto superior direito
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setShowIOSInstructions(false)}
              className="w-full h-11 bg-gradient-to-r from-primary to-emerald-600 text-white font-semibold rounded-xl"
            >
              Entendi
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallAppBanner;
