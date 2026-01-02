import { Search, User, ShoppingBag, Menu, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoNew from "@/assets/logo-new.jpeg";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center group" style={{ perspective: '200px' }}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-400 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
            
            {/* 3D Container */}
            <div 
              className="relative h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(145deg, rgba(34,197,94,0.3) 0%, rgba(20,184,166,0.2) 50%, rgba(6,182,212,0.3) 100%)',
                boxShadow: `
                  0 4px 6px -1px rgba(0,0,0,0.3),
                  0 2px 4px -2px rgba(0,0,0,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -1px 0 rgba(0,0,0,0.2),
                  0 0 20px rgba(34,197,94,0.3)
                `,
                border: '1px solid rgba(34,197,94,0.4)',
                transform: 'rotateX(10deg) rotateY(-5deg)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
              
              {/* Brain icon with 3D effect */}
              <Brain 
                className="h-6 w-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{
                  color: '#22c55e',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 10px rgba(34,197,94,0.5))',
                  transform: 'translateZ(10px)'
                }}
              />
            </div>
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Economiza<span className="text-primary">.IA</span>
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
          
          <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
              0
            </span>
          </Button>
          
          <Button variant="ghost" size="sm" className="h-9 px-3 gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Entrar</span>
          </Button>
          
          <Button size="sm" className="hidden md:flex h-9 px-4 bg-primary text-primary-foreground font-medium">
            Grupo VIP
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;