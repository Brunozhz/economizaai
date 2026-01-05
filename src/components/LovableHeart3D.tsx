const LovableHeart3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`} style={{ perspective: '200px' }}>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-xl opacity-60 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(236,72,153,0.6) 50%, rgba(249,115,22,0.4) 100%)',
          borderRadius: '50%',
          transform: 'scale(1.5)'
        }}
      />
      
      {/* 3D Heart SVG */}
      <svg 
        viewBox="0 0 100 100" 
        className="relative z-10 w-full h-full drop-shadow-2xl"
        style={{
          transform: 'rotate(-25deg) rotateY(-15deg) rotateX(10deg)',
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 4px 12px rgba(139,92,246,0.5)) drop-shadow(0 8px 24px rgba(236,72,153,0.3))'
        }}
      >
        <defs>
          {/* Main gradient - matching Lovable colors */}
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="25%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="75%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          
          {/* Highlight gradient for 3D effect */}
          <linearGradient id="heartHighlight" x1="0%" y1="0%" x2="50%" y2="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          
          {/* Shadow gradient for depth */}
          <linearGradient id="heartShadow" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>

          {/* Radial glow */}
          <radialGradient id="innerGlow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* Heart shape - Lovable style (more rounded, tilted) */}
        <path
          d="M50 88 C20 60 5 40 15 25 C25 10 40 12 50 28 C60 12 75 10 85 25 C95 40 80 60 50 88Z"
          fill="url(#heartGradient)"
        />
        
        {/* 3D highlight overlay */}
        <path
          d="M50 88 C20 60 5 40 15 25 C25 10 40 12 50 28 C60 12 75 10 85 25 C95 40 80 60 50 88Z"
          fill="url(#heartHighlight)"
        />
        
        {/* Inner glow for depth */}
        <path
          d="M50 88 C20 60 5 40 15 25 C25 10 40 12 50 28 C60 12 75 10 85 25 C95 40 80 60 50 88Z"
          fill="url(#innerGlow)"
        />
        
        {/* Subtle shadow at bottom for 3D effect */}
        <path
          d="M50 88 C20 60 5 40 15 25 C25 10 40 12 50 28 C60 12 75 10 85 25 C95 40 80 60 50 88Z"
          fill="url(#heartShadow)"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default LovableHeart3D;
