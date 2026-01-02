import { Mail, MessageCircle, Instagram, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 pt-20 pb-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 orb-purple blur-[200px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 orb-orange blur-[200px] opacity-15" />
      
      <div className="container mx-auto px-4 relative">
        {/* Newsletter Section */}
        <div className="mb-16 p-8 rounded-3xl glass-purple border border-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 orb-orange blur-[100px] opacity-30" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Newsletter VIP</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Receba ofertas exclusivas</h3>
              <p className="text-muted-foreground">Seja o primeiro a saber das promoções</p>
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
              <Input 
                placeholder="seu@email.com" 
                className="h-12 bg-background/50 border-border/50 rounded-xl min-w-[250px]"
              />
              <Button className="h-12 px-6 gradient-mixed rounded-xl font-bold shadow-glow-sm hover:shadow-glow transition-all">
                Inscrever
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
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
              A primeira loja de produtos digitais do Brasil com <span className="text-primary font-semibold">Inteligência Artificial</span>. 
              Preços imbatíveis, entrega instantânea e suporte dedicado.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary-foreground hover:gradient-primary border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow-sm"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary-foreground hover:bg-green-600 border border-border/50 hover:border-green-500/30 transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary-foreground hover:gradient-purple border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-glow-purple"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
              <span className="h-1 w-6 gradient-primary rounded-full" />
              Links Úteis
            </h4>
            <ul className="space-y-3">
              {['Catálogo', 'Meus Pedidos', 'FAQ', 'Termos de Uso'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-glow-sm transition-all" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-bold text-foreground text-lg flex items-center gap-2">
              <span className="h-1 w-6 gradient-purple rounded-full" />
              Suporte
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-3 group">
                  <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <span className="block font-medium">WhatsApp</span>
                    <span className="text-xs text-muted-foreground">Resposta em minutos</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-3 group">
                  <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <span className="block font-medium">E-mail</span>
                    <span className="text-xs text-muted-foreground">contato@economiza.ia</span>
                  </div>
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
              Feito com <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse" /> no Brasil
              <span className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">v2.0</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
