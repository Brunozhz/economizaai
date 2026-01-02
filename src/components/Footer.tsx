import { Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-[hsl(220,15%,12%)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <defs>
                  <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                    <stop offset="35%" stopColor="hsl(185, 80%, 45%)" />
                    <stop offset="65%" stopColor="hsl(215, 85%, 55%)" />
                    <stop offset="100%" stopColor="hsl(265, 75%, 55%)" />
                  </linearGradient>
                </defs>
                <path 
                  d="M16 28.5C16 28.5 3.5 20 3.5 11.5C3.5 6.5 7.5 3 12 3C14.5 3 16 4.5 16 4.5C16 4.5 17.5 3 20 3C24.5 3 28.5 6.5 28.5 11.5C28.5 20 16 28.5 16 28.5Z"
                  fill="url(#footer-gradient)"
                />
              </svg>
            </div>
            <span className="font-semibold text-foreground">
              Créditos<span className="text-gradient-lovable">Lovable</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#catalogo" className="hover:text-foreground transition-colors">
              Catálogo
            </a>
            <a href="#beneficios" className="hover:text-foreground transition-colors">
              Benefícios
            </a>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-9 h-9 rounded-lg bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,15%)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[hsl(220,15%,20%)] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-lg bg-[hsl(220,20%,10%)] border border-[hsl(220,15%,15%)] flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-[hsl(220,15%,20%)] transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-[hsl(220,15%,10%)] text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CréditosLovable. Revenda autorizada.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
