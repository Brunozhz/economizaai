import { Mail, MessageCircle, Instagram, Heart, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 pt-16 pb-8 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12 p-6 rounded-xl bg-card border border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1">Receba ofertas exclusivas</h3>
              <p className="text-sm text-muted-foreground">Seja o primeiro a saber das promoções</p>
            </div>
            
            <div className="flex w-full md:w-auto gap-2">
              <Input 
                placeholder="seu@email.com" 
                className="h-10 bg-background border-border/50 min-w-[220px]"
              />
              <Button className="h-10 px-4 bg-primary text-primary-foreground font-medium">
                Inscrever
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 border border-primary/30 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))' }} />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Economiza<span className="text-primary">.IA</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              A primeira loja de produtos digitais do Brasil com Inteligência Artificial. 
              Preços imbatíveis, entrega instantânea e suporte dedicado.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-2">
              <a href="#" className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Links Úteis</h4>
            <ul className="space-y-2">
              {['Catálogo', 'Meus Pedidos', 'FAQ', 'Termos de Uso'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>contato@economiza.ia</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Economiza.IA. Todos os direitos reservados.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Feito com <Heart className="h-3 w-3 text-primary fill-primary" /> no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;