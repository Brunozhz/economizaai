import { MessageCircle, Instagram, Heart, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative border-t border-primary/20 pt-20 pb-10 bg-gradient-to-b from-background to-card/50 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand - Enhanced */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 border border-primary/30 flex items-center justify-center shadow-lg">
                <Brain className="h-7 w-7 text-primary" style={{ filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.8))' }} />
              </div>
              <span className="font-display font-black text-2xl text-foreground">
                Economiza<span className="text-primary">.IA</span>
              </span>
            </div>
            <p className="text-base text-muted-foreground max-w-md leading-relaxed">
              A primeira loja de produtos digitais do Brasil com Inteligência Artificial. 
              Preços imbatíveis, entrega instantânea e suporte dedicado.
            </p>
            
            <div className="flex gap-3">
              <a href="https://www.instagram.com/economiza.ia/" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/50 hover:scale-110 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links - Enhanced */}
          <div className="space-y-5">
            <h4 className="font-bold text-lg text-foreground">Links Úteis</h4>
            <ul className="space-y-3">
              {['Catálogo', 'Termos de Uso'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-base text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Enhanced */}
          <div className="space-y-5">
            <h4 className="font-bold text-lg text-foreground">Suporte</h4>
            <ul className="space-y-4">
              <li>
                <a href="https://api.whatsapp.com/send/?phone=5521965987305&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-base text-muted-foreground hover:text-foreground transition-colors group">
                  <div className="h-10 w-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366]/30 transition-colors">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* WhatsApp CTA Section */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-[#25D366]/10 via-card to-[#25D366]/10 border border-[#25D366]/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">💬 Precisa tirar mais dúvidas?</h3>
              <p className="text-muted-foreground">Clique no link e fale direto com nosso especialista no WhatsApp!</p>
            </div>
            
            <Button 
              className="h-14 px-8 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-base rounded-xl shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-105 transition-all duration-300"
              onClick={() => window.open('https://api.whatsapp.com/send/?phone=5521965987305&text&type=phone_number&app_absent=0', '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com Especialista
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Bottom - Enhanced */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Economiza.IA. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Feito com <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> no Brasil 🇧🇷
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;