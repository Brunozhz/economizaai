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
          <div className="relative flex items-center justify-center group">
            {/* Outer glow ring */}
            <div className="absolute h-14 w-14 rounded-full bg-gradient-to-r from-primary via-emerald-400 to-cyan-500 opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500" />
            
            {/* Rotating ring */}
            <div 
              className="absolute h-12 w-12 rounded-full border border-primary/30 animate-[spin_8s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(34,197,94,0.3), transparent)'
              }}
            />
            
            {/* Main container */}
            <div className="relative h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-primary/40 shadow-lg shadow-primary/20">
              {/* Inner highlight */}
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              
              {/* Circuit lines decoration */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />
              </div>
              
              {/* Brain icon */}
              <Brain 
                className="h-5 w-5 relative z-10 text-primary group-hover:text-emerald-400 transition-colors duration-300"
                strokeWidth={1.5}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.6))'
                }}
              />
              
              {/* Pulsing dot */}
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/50" />
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