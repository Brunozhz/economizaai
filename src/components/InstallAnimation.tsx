import { useState, useEffect } from "react";
import { Smartphone, Monitor, Share2, MoreVertical, Plus, Check, Download, ArrowDown, Hand } from "lucide-react";

type Platform = 'android' | 'ios' | 'desktop';

interface InstallAnimationProps {
  platform: Platform;
}

const InstallAnimation = ({ platform }: InstallAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = {
    android: [
      { action: 'idle', description: 'Abra o site no Chrome' },
      { action: 'tap-menu', description: 'Toque no menu (⋮)' },
      { action: 'menu-open', description: 'Menu aberto' },
      { action: 'tap-install', description: 'Toque em "Instalar app"' },
      { action: 'confirm', description: 'Confirme a instalação' },
      { action: 'done', description: 'App instalado! ✓' },
    ],
    ios: [
      { action: 'idle', description: 'Abra o site no Safari' },
      { action: 'tap-share', description: 'Toque em Compartilhar' },
      { action: 'share-open', description: 'Menu aberto' },
      { action: 'scroll-menu', description: 'Role para baixo' },
      { action: 'tap-add', description: 'Toque em "Adicionar à Tela"' },
      { action: 'confirm', description: 'Toque em "Adicionar"' },
      { action: 'done', description: 'App instalado! ✓' },
    ],
    desktop: [
      { action: 'idle', description: 'Abra o site no Chrome' },
      { action: 'highlight-bar', description: 'Veja a barra de endereço' },
      { action: 'tap-install-icon', description: 'Clique no ícone de instalar' },
      { action: 'popup', description: 'Pop-up de instalação' },
      { action: 'confirm', description: 'Clique em "Instalar"' },
      { action: 'done', description: 'App instalado! ✓' },
    ],
  };

  const currentSteps = steps[platform];

  useEffect(() => {
    setCurrentStep(0);
  }, [platform]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= currentSteps.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, currentSteps.length, platform]);

  const handleReplay = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone/Desktop Frame */}
      <div className="relative mb-6">
        {platform === 'desktop' ? (
          <DesktopFrame step={currentSteps[currentStep].action} />
        ) : (
          <PhoneFrame platform={platform} step={currentSteps[currentStep].action} />
        )}
      </div>

      {/* Step Indicator */}
      <div className="text-center mb-4">
        <p className="text-lg font-semibold text-foreground animate-fade-in" key={currentStep}>
          {currentSteps[currentStep].description}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mb-4">
        {currentSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentStep(index); setIsPlaying(false); }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? 'w-8 bg-primary' 
                : index < currentStep 
                  ? 'w-2.5 bg-primary/50' 
                  : 'w-2.5 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={handleReplay}
        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        ↻ Repetir animação
      </button>
    </div>
  );
};

// Phone Frame Component
const PhoneFrame = ({ platform, step }: { platform: 'android' | 'ios'; step: string }) => {
  return (
    <div className="relative">
      {/* Phone Shadow */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 opacity-50" />
      
      {/* Phone Body */}
      <div 
        className="relative w-[220px] h-[440px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-2 shadow-2xl border border-slate-700"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}
      >
        {/* Notch/Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />
        
        {/* Screen */}
        <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="h-8 bg-background/80 backdrop-blur flex items-center justify-between px-6 text-[10px] text-muted-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-current rounded-sm relative">
                <div className="absolute inset-0.5 bg-current rounded-sm" style={{ width: '80%' }} />
              </div>
            </div>
          </div>

          {/* Browser Chrome */}
          <div className="h-10 bg-card border-b border-border/50 flex items-center px-3 gap-2">
            <div className="flex-1 h-6 bg-muted/50 rounded-full flex items-center px-3 text-[10px] text-muted-foreground truncate">
              economiza.ia
            </div>
            {platform === 'android' && (
              <div className={`transition-all duration-300 ${step === 'tap-menu' ? 'scale-125' : ''}`}>
                <MoreVertical className={`h-4 w-4 ${step === 'tap-menu' ? 'text-primary' : 'text-muted-foreground'}`} />
                {step === 'tap-menu' && <TapIndicator />}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 relative">
            {/* App Preview */}
            <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">E.IA</span>
            </div>
            <div className="text-center">
              <div className="h-3 w-24 mx-auto bg-muted/50 rounded-full mb-2" />
              <div className="h-2 w-32 mx-auto bg-muted/30 rounded-full" />
            </div>

            {/* Android Menu Overlay */}
            {platform === 'android' && (step === 'menu-open' || step === 'tap-install') && (
              <div className="absolute top-0 right-2 w-40 bg-card border border-border/50 rounded-lg shadow-xl animate-scale-in overflow-hidden z-10">
                <div className="py-1">
                  <MenuItem text="Nova aba" />
                  <MenuItem text="Nova aba anônima" />
                  <div className="h-px bg-border/50 my-1" />
                  <MenuItem 
                    text="Instalar app" 
                    icon={<Download className="h-3.5 w-3.5" />}
                    highlighted={step === 'tap-install'}
                  />
                  <MenuItem text="Histórico" />
                  <MenuItem text="Configurações" />
                </div>
                {step === 'tap-install' && (
                  <div className="absolute top-[68px] right-2">
                    <TapIndicator />
                  </div>
                )}
              </div>
            )}

            {/* iOS Share Sheet */}
            {platform === 'ios' && (step === 'share-open' || step === 'scroll-menu' || step === 'tap-add') && (
              <div 
                className={`absolute bottom-0 left-0 right-0 bg-card border-t border-border/50 rounded-t-2xl shadow-xl animate-slide-up z-10 transition-transform duration-500 ${
                  step === 'scroll-menu' || step === 'tap-add' ? '-translate-y-8' : ''
                }`}
              >
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-2" />
                <div className="p-4">
                  <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                    <ShareIcon label="Mensagens" color="bg-green-500" />
                    <ShareIcon label="WhatsApp" color="bg-emerald-500" />
                    <ShareIcon label="E-mail" color="bg-blue-500" />
                    <ShareIcon label="Copiar" color="bg-slate-500" />
                  </div>
                  <div className="space-y-1">
                    <IOSMenuItem text="Adicionar aos Favoritos" />
                    <IOSMenuItem 
                      text="Adicionar à Tela de Início" 
                      icon={<Plus className="h-4 w-4" />}
                      highlighted={step === 'tap-add'}
                    />
                    {step === 'tap-add' && (
                      <div className="absolute bottom-20 right-4">
                        <TapIndicator />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Dialog */}
            {step === 'confirm' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in z-20">
                <div className="bg-card border border-border/50 rounded-xl p-4 mx-4 shadow-2xl animate-scale-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">E.IA</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">Economiza.IA</p>
                      <p className="text-[10px] text-muted-foreground">economiza.ia</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 h-8 bg-muted/50 rounded-lg text-xs text-muted-foreground font-medium">
                      Cancelar
                    </button>
                    <button className="flex-1 h-8 bg-primary rounded-lg text-xs text-white font-medium relative">
                      {platform === 'ios' ? 'Adicionar' : 'Instalar'}
                      <TapIndicator small />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Done State */}
            {step === 'done' && (
              <div className="absolute inset-0 bg-background flex flex-col items-center justify-center animate-fade-in z-20">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-scale-in">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Instalado com sucesso!</p>
                <p className="text-xs text-muted-foreground mt-1">Verifique sua tela inicial</p>
              </div>
            )}
          </div>

          {/* iOS Bottom Bar */}
          {platform === 'ios' && (
            <div className="h-12 bg-card border-t border-border/50 flex items-center justify-around px-4">
              <div className="w-6 h-6 rounded bg-muted/30" />
              <div className="w-6 h-6 rounded bg-muted/30" />
              <div className={`transition-all duration-300 ${step === 'tap-share' ? 'scale-125' : ''}`}>
                <Share2 className={`h-5 w-5 ${step === 'tap-share' ? 'text-primary' : 'text-muted-foreground'}`} />
                {step === 'tap-share' && <TapIndicator />}
              </div>
              <div className="w-6 h-6 rounded bg-muted/30" />
              <div className="w-6 h-6 rounded bg-muted/30" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Desktop Frame Component
const DesktopFrame = ({ step }: { step: string }) => {
  return (
    <div className="relative">
      {/* Shadow */}
      <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-75 opacity-50" />
      
      {/* Desktop Window */}
      <div 
        className="relative w-[320px] h-[220px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-1 shadow-2xl border border-slate-700"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        {/* Title Bar */}
        <div className="h-7 bg-slate-800 rounded-t-lg flex items-center px-3 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>
        
        {/* Browser Chrome */}
        <div className="h-8 bg-card border-b border-border/50 flex items-center px-2 gap-2">
          <div className={`flex-1 h-5 bg-muted/50 rounded flex items-center px-2 text-[9px] text-muted-foreground relative ${
            step === 'highlight-bar' ? 'ring-2 ring-primary ring-offset-1 ring-offset-card' : ''
          }`}>
            <span className="truncate">economiza.ia</span>
            
            {/* Install Icon in Address Bar */}
            <div className={`ml-auto transition-all duration-300 ${step === 'tap-install-icon' ? 'scale-125' : ''}`}>
              <Download className={`h-3 w-3 ${step === 'tap-install-icon' || step === 'highlight-bar' ? 'text-primary' : 'text-muted-foreground'}`} />
              {step === 'tap-install-icon' && <TapIndicator small />}
            </div>
          </div>
          <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-background h-[calc(100%-60px)] p-4 relative rounded-b-lg overflow-hidden">
          <div className="h-10 w-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">E.IA</span>
          </div>
          <div className="text-center">
            <div className="h-2 w-16 mx-auto bg-muted/50 rounded-full mb-1" />
            <div className="h-1.5 w-24 mx-auto bg-muted/30 rounded-full" />
          </div>

          {/* Install Popup */}
          {(step === 'popup' || step === 'confirm') && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-card border border-border/50 rounded-lg p-3 shadow-xl animate-scale-in w-48 z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">E.IA</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-[10px]">Instalar Economiza.IA?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-6 bg-muted/50 rounded text-[9px] text-muted-foreground font-medium">
                  Cancelar
                </button>
                <button className="flex-1 h-6 bg-primary rounded text-[9px] text-white font-medium relative">
                  Instalar
                  {step === 'confirm' && <TapIndicator small />}
                </button>
              </div>
            </div>
          )}

          {/* Done State */}
          {step === 'done' && (
            <div className="absolute inset-0 bg-background flex flex-col items-center justify-center animate-fade-in z-20">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-2 animate-scale-in">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">Instalado!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const TapIndicator = ({ small = false }: { small?: boolean }) => (
  <div className={`absolute ${small ? '-right-1 -bottom-1' : '-right-2 -bottom-2'} pointer-events-none`}>
    <div className={`relative ${small ? 'h-4 w-4' : 'h-6 w-6'}`}>
      <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
      <Hand className={`${small ? 'h-4 w-4' : 'h-6 w-6'} text-primary animate-pulse`} />
    </div>
  </div>
);

const MenuItem = ({ text, icon, highlighted }: { text: string; icon?: React.ReactNode; highlighted?: boolean }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors ${
    highlighted ? 'bg-primary/20 text-primary font-medium' : 'text-foreground hover:bg-muted/50'
  }`}>
    {icon && <span>{icon}</span>}
    <span>{text}</span>
  </div>
);

const IOSMenuItem = ({ text, icon, highlighted }: { text: string; icon?: React.ReactNode; highlighted?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
    highlighted ? 'bg-primary/20 text-primary font-medium' : 'bg-muted/30 text-foreground'
  }`}>
    {icon && <span className={highlighted ? 'text-primary' : 'text-muted-foreground'}>{icon}</span>}
    <span className="text-xs">{text}</span>
  </div>
);

const ShareIcon = ({ label, color }: { label: string; color: string }) => (
  <div className="flex flex-col items-center gap-1 shrink-0">
    <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center`}>
      <div className="h-5 w-5 bg-white/30 rounded" />
    </div>
    <span className="text-[9px] text-muted-foreground">{label}</span>
  </div>
);

export default InstallAnimation;
