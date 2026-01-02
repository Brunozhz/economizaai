import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoTransparent from "@/assets/logo-transparent.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <img 
            alt="Economiza.IA" 
            className="h-8 w-auto object-contain" 
            src={logoTransparent} 
          />
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