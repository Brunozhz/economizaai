import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.jpeg";
const Header = () => {
  return <header className="sticky top-0 z-50 w-full glass glass-border">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] gradient-primary" />
      
      <div className="container mx-auto flex h-20 items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <img alt="Economiza.IA" className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(255,140,50,0.5)]" src="/lovable-uploads/d6d83b8a-054b-4418-b0eb-a7353be82c0d.png" />
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-foreground">Economiza.</span>
            <span className="text-[#22c55e]">IA</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input type="text" placeholder="Buscar produtos digitais..." className="pl-11 h-12 bg-secondary/60 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-300 placeholder:text-muted-foreground/60 hover:bg-secondary/80" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Cart */}
          <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground shadow-glow-sm">
              0
            </span>
          </Button>
          
          {/* Login */}
          <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl border-border/50 text-foreground hover:text-primary-foreground hover:border-primary hover:bg-primary/90 transition-all duration-300 group">
            <User className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">Entrar</span>
          </Button>
          
          {/* CTA */}
          <Button size="sm" className="hidden md:flex h-10 px-5 rounded-xl gradient-mixed text-primary-foreground font-bold shadow-glow-sm hover:shadow-glow hover:scale-105 transition-all duration-300">
            Grupo VIP
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;