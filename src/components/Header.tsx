import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(220,20%,4%,0.95)] backdrop-blur-lg border-b border-[hsl(220,15%,12%)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          {/* Lovable Heart Logo */}
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <defs>
                <linearGradient id="lovable-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
                  <stop offset="35%" stopColor="hsl(185, 80%, 45%)" />
                  <stop offset="65%" stopColor="hsl(215, 85%, 55%)" />
                  <stop offset="100%" stopColor="hsl(265, 75%, 55%)" />
                </linearGradient>
              </defs>
              <path 
                d="M16 28.5C16 28.5 3.5 20 3.5 11.5C3.5 6.5 7.5 3 12 3C14.5 3 16 4.5 16 4.5C16 4.5 17.5 3 20 3C24.5 3 28.5 6.5 28.5 11.5C28.5 20 16 28.5 16 28.5Z"
                fill="url(#lovable-gradient)"
              />
            </svg>
          </div>
          <span className="font-semibold text-lg text-foreground">
            Créditos<span className="text-gradient-lovable">Lovable</span>
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#catalogo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Catálogo
          </a>
          <a href="#beneficios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Benefícios
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="icon" 
            className="md:hidden h-9 w-9 text-muted-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Button 
            size="sm"
            className="hidden md:flex h-9 px-4 bg-gradient-to-r from-[hsl(160,84%,39%)] to-[hsl(185,80%,45%)] text-white font-medium hover:opacity-90 transition-opacity"
            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Planos
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
