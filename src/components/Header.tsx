import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full glass glass-border">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm transition-all duration-300 group-hover:shadow-glow group-hover:scale-110">
            <span className="text-2xl font-black text-primary-foreground">E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground tracking-tight">Economiza.IA</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Produtos Digitais</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder="Pesquisar produto..."
              className="pl-11 h-12 bg-secondary/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300 placeholder:text-muted-foreground/60"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-5 rounded-xl border-border/50 text-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
          >
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline font-medium">Entrar</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
