import { useState } from "react";
import { Smartphone, Monitor, Apple, Download, Check, ArrowLeft, Zap, Wifi, Shield, Share2, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Link } from "react-router-dom";

type Platform = 'android' | 'ios' | 'desktop';

const Install = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('android');
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  const handleInstall = async () => {
    await installApp();
  };

  const platforms = [
    { id: 'android' as Platform, label: 'Android', icon: Smartphone, color: 'from-green-500 to-emerald-600' },
    { id: 'ios' as Platform, label: 'iPhone/iPad', icon: Apple, color: 'from-slate-400 to-slate-600' },
    { id: 'desktop' as Platform, label: 'Desktop', icon: Monitor, color: 'from-blue-500 to-indigo-600' },
  ];

  const benefits = [
    { icon: Zap, text: 'Acesso instantâneo com um toque', color: 'text-yellow-500' },
    { icon: Wifi, text: 'Funciona mesmo offline', color: 'text-cyan-500' },
    { icon: Shield, text: 'Seguro e sem ocupar espaço', color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <span className="font-display font-bold text-lg text-foreground">
            Economiza<span className="text-primary">.IA</span>
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 shadow-xl shadow-primary/30 mb-6">
            <Download className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Instale o <span className="text-primary">Economiza.IA</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Tenha acesso rápido às melhores ofertas de créditos Lovable direto na tela inicial do seu dispositivo
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
            >
              <benefit.icon className={`h-5 w-5 ${benefit.color} shrink-0`} />
              <span className="text-sm text-foreground font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Already Installed */}
        {isInstalled && (
          <div className="mb-10 p-6 rounded-2xl bg-primary/10 border border-primary/30 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">App já instalado!</h3>
            <p className="text-muted-foreground text-sm">
              O Economiza.IA já está instalado no seu dispositivo. Procure pelo ícone na tela inicial.
            </p>
          </div>
        )}

        {/* Quick Install Button (when available) */}
        {isInstallable && !isInstalled && (
          <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/30 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">Instalação rápida disponível!</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Seu navegador suporta instalação automática. Clique no botão abaixo.
            </p>
            <Button 
              onClick={handleInstall}
              className="h-12 px-8 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
            >
              <Download className="h-5 w-5 mr-2" />
              Instalar Agora
            </Button>
          </div>
        )}

        {/* Platform Selector */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">
            Ou siga as instruções para seu dispositivo:
          </h2>
          <div className="flex justify-center gap-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                  selectedPlatform === platform.id
                    ? `bg-gradient-to-r ${platform.color} text-white border-transparent shadow-lg`
                    : 'bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                <platform.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{platform.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
          {/* Android Instructions */}
          {selectedPlatform === 'android' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Android (Chrome)</h3>
              </div>

              <div className="space-y-4">
                <Step number={1} title="Abra o menu do navegador">
                  <p>Toque nos <strong>três pontinhos (⋮)</strong> no canto superior direito do Chrome</p>
                </Step>
                <Step number={2} title="Encontre a opção de instalação">
                  <p>Procure por <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong></p>
                </Step>
                <Step number={3} title="Confirme a instalação">
                  <p>Toque em <strong>"Instalar"</strong> no pop-up que aparecer</p>
                </Step>
                <Step number={4} title="Pronto!">
                  <p>O ícone do Economiza.IA aparecerá na sua tela inicial</p>
                </Step>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Se aparecer uma barra na parte inferior da tela com "Adicionar à tela inicial", é só tocar nela!
                </p>
              </div>
            </div>
          )}

          {/* iOS Instructions */}
          {selectedPlatform === 'ios' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">iPhone / iPad (Safari)</h3>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                <p className="text-sm text-amber-400 font-medium">
                  ⚠️ Importante: Use o Safari para instalar. Outros navegadores não suportam essa função no iOS.
                </p>
              </div>

              <div className="space-y-4">
                <Step number={1} title="Toque no botão Compartilhar" icon={Share2}>
                  <p>Encontre o ícone <strong>Compartilhar</strong> (quadrado com seta para cima ⬆️) na barra inferior do Safari</p>
                </Step>
                <Step number={2} title="Role a lista de opções">
                  <p>Role para baixo na lista de ações que aparecer</p>
                </Step>
                <Step number={3} title="Adicionar à Tela de Início" icon={PlusSquare}>
                  <p>Toque em <strong>"Adicionar à Tela de Início"</strong></p>
                </Step>
                <Step number={4} title="Confirme o nome">
                  <p>Você pode editar o nome se quiser. Depois toque em <strong>"Adicionar"</strong></p>
                </Step>
                <Step number={5} title="Pronto!">
                  <p>O app estará na sua tela inicial como qualquer outro aplicativo</p>
                </Step>
              </div>
            </div>
          )}

          {/* Desktop Instructions */}
          {selectedPlatform === 'desktop' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Desktop (Chrome/Edge)</h3>
              </div>

              <div className="space-y-4">
                <Step number={1} title="Procure o ícone de instalação">
                  <p>Na barra de endereço do navegador, procure um ícone de <strong>monitor com seta</strong> ou <strong>+ dentro de um círculo</strong></p>
                </Step>
                <Step number={2} title="Clique em Instalar">
                  <p>Clique no ícone e depois em <strong>"Instalar"</strong></p>
                </Step>
                <Step number={3} title="Confirme">
                  <p>Uma janela irá aparecer. Clique em <strong>"Instalar"</strong> novamente</p>
                </Step>
                <Step number={4} title="Pronto!">
                  <p>O app será instalado e você poderá acessá-lo pelo Menu Iniciar ou Dock</p>
                </Step>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Alternativa:</strong> Você também pode clicar no menu do navegador (⋮) e procurar por "Instalar Economiza.IA..."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/#catalogo">
            <Button 
              variant="outline" 
              className="h-11 px-6 border-primary/30 text-primary hover:bg-primary/10 font-medium rounded-xl"
            >
              Ver Catálogo de Créditos
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

// Step component
const Step = ({ number, title, children, icon: Icon }: { 
  number: number; 
  title: string; 
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex gap-4">
    <div className="shrink-0">
      <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
        {number}
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold text-foreground">{title}</h4>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export default Install;
