import { Sparkles, ArrowRight, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVideoVisible) {
            setIsVideoVisible(true);
            video.play().catch((error) => {
              console.log("Autoplay prevented:", error);
            });
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [isVideoVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(video.currentTime);
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (video && !audioEnabled) {
      video.muted = false;
      video.volume = 1;
      video.currentTime = 0;
      setAudioEnabled(true);
      video.play();
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    video.currentTime = clickPosition * video.duration;
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return <section className="relative pt-8 pb-24 md:pt-12 md:pb-36 overflow-hidden bg-background">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />
      
      {/* Enhanced animated orbs - Purple/Magenta/Orange theme */}
      <div className="absolute top-10 left-5 w-80 h-80 bg-purple-500/30 rounded-full blur-[120px] animate-pulse-soft opacity-50" />
      <div className="absolute top-40 right-20 w-64 h-64 bg-pink-500/30 rounded-full blur-[100px] animate-pulse-soft opacity-40" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-10 right-5 w-[500px] h-[500px] bg-orange-500/25 rounded-full blur-[150px] animate-pulse-soft opacity-35" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-500/15 rounded-full blur-[200px] opacity-15" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern overlay with fade */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(hsl(330, 85%, 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(330, 85%, 55%) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          {/* Premium Badge */}
          <div className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass glass-border text-primary text-sm font-semibold cursor-default hover:border-primary/50 transition-all duration-500 opacity-0 animate-[fade-in-up_0.8s_ease-out_0s_forwards]" style={{
            backgroundImage: 'linear-gradient(90deg, transparent, hsl(330, 85%, 55%, 0.15), transparent)',
            backgroundSize: '200% 100%'
          }}>
            <Crown className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">A autoridade em créditos Lovable</span>
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </div>
          
          {/* Main headline with staggered animation */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight opacity-0 animate-[fade-in-up_0.8s_ease-out_0.2s_forwards]">
              <span className="text-foreground">Créditos Lovable</span>
            </h1>
            
            <div className="relative inline-block opacity-0 animate-[fade-in-up_0.8s_ease-out_0.4s_forwards]">
              <span className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-gradient-animated tracking-tight">
                a partir de R$ 24,90
              </span>
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-orange-500/20 blur-3xl rounded-full opacity-50 -z-10 animate-pulse" />
            </div>
            
            <p className="opacity-0 animate-[fade-in-up_0.8s_ease-out_0.6s_forwards]">
              <span className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-gradient-animated">melhor preço do Brasil</span>
            </p>
          </div>
          
          {/* Subheadlines with better hierarchy */}
          <div className="space-y-4 max-w-3xl">
            <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Economize agora e desbloqueie seu potencial criativo.
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Acesso imediato, transparência total e uma experiência premium que cabe no seu bolso.
            </p>
          </div>
          
          <p className="text-xl font-bold text-foreground/90 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/20">
            ✨ Não pague mais caro para criar sem limites.
          </p>
          
          {/* VSL Video Section */}
          <div className="w-full max-w-6xl mx-auto space-y-4 md:space-y-6 mt-8 md:mt-12 px-2 md:px-4 opacity-0 animate-[fade-in-up_0.8s_ease-out_0.8s_forwards]">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gradient-animated tracking-tight">
                ATENÇÃO
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                VEJA ESSE VIDEO ABAIXO 👇
              </p>
            </div>
            
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl" style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #db2777 50%, #ea580c 100%)',
              padding: '4px'
            }}>
              <div className="relative bg-black rounded-[1rem] md:rounded-[1.375rem] overflow-hidden group">
                <video
                  ref={videoRef}
                  className="w-full h-auto cursor-pointer"
                  playsInline
                  muted
                  preload="metadata"
                  onClick={handleVideoClick}
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect width='1920' height='1080' fill='%23000000'/%3E%3C/svg%3E"
                >
                  <source src="https://fsyzkjag8xspq00w.public.blob.vercel-storage.com/0118%281%29.mov" type="video/mp4" />
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
                
                {/* Sound activation overlay - VSL style */}
                {!audioEnabled && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer z-10 transition-opacity duration-500"
                    onClick={handleVideoClick}
                  >
                    <div className="text-center space-y-3 md:space-y-4 animate-pulse-soft px-4 md:px-6">
                      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-md transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 md:h-8 md:w-8 animate-bounce" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" 
                            />
                          </svg>
                          <p className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-wider">
                            Clique no Vídeo
                          </p>
                        </div>
                        <p className="text-base md:text-lg lg:text-xl font-bold uppercase tracking-wide">
                          Para Ativar o SOM 🔊
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-white/90">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-xs md:text-sm font-semibold uppercase tracking-wider">
                          Áudio Importante
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Custom Video Controls */}
                {audioEnabled && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    {/* Custom Progress Bar */}
                    <div 
                      ref={progressBarRef}
                      className="w-full h-1.5 md:h-2 bg-white/20 rounded-full cursor-pointer mb-2 md:mb-3 overflow-hidden hover:h-2 md:hover:h-3 transition-all duration-200"
                      onClick={handleProgressBarClick}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-100 relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg"></div>
                      </div>
                    </div>
                    
                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2 md:gap-3">
                        {/* Play/Pause Button */}
                        <button
                          onClick={togglePlayPause}
                          className="hover:scale-110 transition-transform"
                        >
                          {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                        
                        {/* Time Display */}
                        <span className="text-xs md:text-sm font-semibold">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      {/* Volume Indicator */}
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Gradient overlay at edges */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
                }} />
              </div>
              
              {/* Pulsing glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl md:rounded-3xl blur-xl opacity-50 animate-pulse -z-10" />
            </div>
            
            <p className="text-center text-xs md:text-sm text-muted-foreground italic px-2">
              📹 Descubra como economizar e criar sem limites
            </p>
          </div>
          
          {/* Enhanced CTA */}
          <div className="flex flex-wrap justify-center gap-5 pt-4">
            <Button size="lg" className="h-16 px-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all duration-500 hover:scale-105 animate-gradient group" style={{
              backgroundSize: '200% auto'
            }} onClick={() => {
              document.getElementById('catalogo')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}>
              <Zap className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
              COMPRAR AGORA
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

export default HeroSection;