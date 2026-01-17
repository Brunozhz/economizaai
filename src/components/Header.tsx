import { Search, Menu, Download, X, Monitor, Smartphone } from "lucide-react";
import LovableHeart3D from "./LovableHeart3D";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";
type DeviceType = 'android' | 'ios' | 'desktop-chrome' | 'desktop-edge' | 'desktop-other';

const Header = () => {
  const { isInstallable, isInstalled, isIOS, installApp, canShowInstall } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop-other');

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isAndroid = /android/.test(ua);
      const isIOSDevice = /iphone|ipad|ipod/.test(ua);
      const isChrome = /chrome/.test(ua) && !/edge|edg/.test(ua);
      const isEdge = /edge|edg/.test(ua);

      if (isIOSDevice) return 'ios';
      if (isAndroid) return 'android';
      if (isEdge) return 'desktop-edge';
      if (isChrome) return 'desktop-chrome';
      return 'desktop-other';
    };
    setDeviceType(detectDevice());
  }, []);

  const handleInstall = async () => {
    // Se pode instalar diretamente (Android/Chrome/Edge), tenta instalar
    if (isInstallable && !isIOS) {
      const installed = await installApp();
      if (!installed) {
        // Se falhou, mostra modal com instruções
        setShowInstallModal(true);
      }
    } else {
      // iOS ou navegadores que não suportam, mostra instruções
      setShowInstallModal(true);
    }
  };

  const getDeviceInstructions = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: 'Instalar no iPhone',
          icon: <Smartphone className="h-7 w-7 text-white" />,
          steps: [
            { text: 'Toque em', highlight: 'Compartilhar', icon: '⬆️' },
            { text: 'Selecione', highlight: '"Adicionar à Tela de Início"', icon: '➕' },
            { text: 'Toque em', highlight: '"Adicionar"', icon: '✓' },
          ]
        };
      case 'android':
        return {
          title: 'Instalar no Android',
          icon: <Smartphone className="h-7 w-7 text-white" />,
          steps: [
            { text: 'Toque no menu', highlight: '⋮', icon: '⋮' },
            { text: 'Selecione', highlight: '"Instalar aplicativo"', icon: '📲' },
            { text: 'Confirme tocando em', highlight: '"Instalar"', icon: '✓' },
          ]
        };
      case 'desktop-chrome':
        return {
          title: 'Instalar no Chrome',
          icon: <Monitor className="h-7 w-7 text-white" />,
          steps: [
            { text: 'Clique no ícone', highlight: '⊕', icon: '⊕' },
            { text: 'Na barra de endereço (à direita)', highlight: '', icon: '🔗' },
            { text: 'Clique em', highlight: '"Instalar"', icon: '✓' },
          ]
        };
      case 'desktop-edge':
        return {
          title: 'Instalar no Edge',
          icon: <Monitor className="h-7 w-7 text-white" />,
          steps: [
            { text: 'Clique no menu', highlight: '...', icon: '⋯' },
            { text: 'Selecione', highlight: '"Aplicativos" → "Instalar este site"', icon: '📲' },
            { text: 'Clique em', highlight: '"Instalar"', icon: '✓' },
          ]
        };
      default:
        return {
          title: 'Instalar o App',
          icon: <Download className="h-7 w-7 text-white" />,
          steps: [
            { text: 'Abra o menu do navegador', highlight: '', icon: '☰' },
            { text: 'Procure por', highlight: '"Instalar" ou "Adicionar à tela inicial"', icon: '📲' },
            { text: 'Confirme a instalação', highlight: '', icon: '✓' },
          ]
        };
    }
  };

  const instructions = getDeviceInstructions();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <LovableHeart3D className="h-10 w-10 group-hover:scale-110 transition-transform duration-500" />
            <span className="font-display font-bold text-xl text-foreground">
              Lovable
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Buscar produtos..." 
                className="pl-10 h-10 bg-secondary/50 border-border/50 rounded-lg"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Install App Button - Always visible when available */}
            {canShowInstall && (
              <Button 
                size="sm"
                onClick={handleInstall}
                className="h-9 px-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-pink-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Baixar App
              </Button>
            )}
            
            <Button 
              size="sm" 
              className="hidden md:flex h-9 px-4 bg-primary text-primary-foreground font-medium"
              onClick={() => window.open('https://chat.whatsapp.com/LFYmqa09RCI5e7KecBQ8FG', '_blank')}
            >
              Grupo VIP
            </Button>
          </div>
        </div>
      </header>

      {/* Install Modal - Device Specific */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-card border border-border/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up">
            <button 
              onClick={() => setShowInstallModal(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="text-center mb-6">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-4">
                {instructions.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {instructions.title}
              </h3>
            </div>

            <div className="space-y-3 mb-5 text-sm">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-foreground/90">
                    {step.text} {step.highlight && <strong>{step.highlight}</strong>}
                  </p>
                </div>
              ))}
            </div>

            <Button 
              onClick={() => setShowInstallModal(false)}
              className="w-full h-10 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl"
            >
              Entendi
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;