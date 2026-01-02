import { Search, Menu, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoNew from "@/assets/logo-new.jpeg";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center group cursor-pointer">
            {/* Outer aurora glow */}
            <div className="absolute h-16 w-16 rounded-full opacity-40 group-hover:opacity-70 transition-all duration-700 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(34,197,94,0.8) 0%, rgba(6,182,212,0.6) 40%, rgba(139,92,246,0.3) 70%, transparent 100%)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
            
            {/* Orbiting particles */}
            <div className="absolute h-14 w-14 animate-[spin_6s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/80" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80" />
            </div>
            
            {/* Counter-rotating ring */}
            <div className="absolute h-12 w-12 rounded-full animate-[spin_4s_linear_infinite_reverse]"
              style={{
                background: 'conic-gradient(from 180deg, transparent 0%, rgba(34,197,94,0.5) 25%, transparent 50%, rgba(6,182,212,0.5) 75%, transparent 100%)',
                filter: 'blur(1px)'
              }}
            />
            
            {/* Hexagonal frame */}
            <div className="absolute h-11 w-11 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute h-full w-full opacity-60">
                <polygon 
                  points="50,2 95,25 95,75 50,98 5,75 5,25" 
                  fill="none" 
                  stroke="url(#hexGradient)" 
                  strokeWidth="1.5"
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Main glass container */}
            <div className="relative h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 50%, rgba(15,23,42,0.9) 100%)',
                boxShadow: '0 8px 32px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)',
                border: '1px solid rgba(34,197,94,0.3)'
              }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(45deg, transparent 0%, rgba(34,197,94,0.4) 50%, transparent 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              />
              
              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent rounded-t-xl" />
              
              {/* Brain icon with premium glow */}
              <Brain 
                className="h-5 w-5 relative z-10 transition-all duration-500 group-hover:scale-110"
                strokeWidth={1.5}
                style={{
                  color: '#4ade80',
                  filter: 'drop-shadow(0 0 4px rgba(74,222,128,0.8)) drop-shadow(0 0 12px rgba(34,197,94,0.6)) drop-shadow(0 0 20px rgba(6,182,212,0.4))'
                }}
              />
            </div>
            
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse shadow-lg shadow-emerald-400/60" />
              <div className="absolute h-3 w-3 rounded-full bg-emerald-400/50 animate-ping" />
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
          
          
          <Button 
            size="sm" 
            className="hidden md:flex h-9 px-4 bg-primary text-primary-foreground font-medium"
            onClick={() => window.open('https://chat.whatsapp.com/LFYmqa09RCI5e7KecBQ8FG', '_blank')}
          >
            Grupo VIP
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;