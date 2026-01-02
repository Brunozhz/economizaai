import { Mail, MessageCircle, Instagram, Heart } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-gradient-to-b from-background to-secondary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Economiza.IA" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              A melhor loja de produtos digitais do Brasil. Preços imbatíveis, entrega instantânea e suporte dedicado para você.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-lg">Links Úteis</h4>
            <ul className="space-y-3">
              {['Catálogo', 'Meus Pedidos', 'FAQ', 'Termos de Uso'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-lg">Suporte</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                  </div>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-500" />
                  </div>
                  E-mail
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Economiza.IA. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Feito com <Heart className="h-4 w-4 text-destructive fill-destructive" /> no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
