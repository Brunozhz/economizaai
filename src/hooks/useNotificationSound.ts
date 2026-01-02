import { useCallback, useRef, useEffect } from 'react';

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const cashRegisterAudioRef = useRef<HTMLAudioElement | null>(null);

  // Preload cash register sound
  useEffect(() => {
    cashRegisterAudioRef.current = new Audio('/sounds/cash-register.mp3');
    cashRegisterAudioRef.current.preload = 'auto';

    // Listen for service worker messages to play sales sound
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PLAY_SALES_SOUND') {
        console.log('Playing sales sound for:', event.data.notificationType);
        playCashRegisterSound();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  const vibrate = useCallback(() => {
    // Check if Vibration API is available
    if ('vibrate' in navigator) {
      // Pattern: vibrate 200ms, pause 100ms, vibrate 200ms
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  const vibrateStrong = useCallback(() => {
    // Stronger vibration pattern for sales
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  }, []);

  const playCashRegisterSound = useCallback(() => {
    // Trigger strong vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }

    try {
      if (cashRegisterAudioRef.current) {
        cashRegisterAudioRef.current.currentTime = 0;
        cashRegisterAudioRef.current.volume = 0.8;
        cashRegisterAudioRef.current.play().catch(e => {
          console.log('Could not play cash register sound:', e);
          // Fallback to synthesized sound
          playSynthesizedCashSound();
        });
      } else {
        playSynthesizedCashSound();
      }
    } catch (error) {
      console.log('Error playing cash register sound:', error);
      playSynthesizedCashSound();
    }
  }, []);

  const playSynthesizedCashSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      
      // Cash register "cha-ching" sound
      // First bell tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.setValueAtTime(1400, now + 0.05);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.4, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Second bell tone (higher)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1800, now + 0.1);
      osc2.frequency.setValueAtTime(2200, now + 0.15);
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.5, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.4);

      // Coin sound (metallic)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(2500, now + 0.2);
      osc3.frequency.exponentialRampToValueAtTime(3000, now + 0.25);
      gain3.gain.setValueAtTime(0, now + 0.2);
      gain3.gain.linearRampToValueAtTime(0.3, now + 0.22);
      gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc3.start(now + 0.2);
      osc3.stop(now + 0.5);

    } catch (error) {
      console.log('Could not play synthesized cash sound:', error);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    // Trigger vibration
    vibrate();

    try {
      // Create or reuse AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      
      // Resume context if suspended (required for autoplay policies)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      
      // Create oscillator for main tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Pleasant notification sound - two-tone chime
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, now); // A5
      oscillator.frequency.setValueAtTime(1108.73, now + 0.1); // C#6
      
      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.4);

      // Second harmonic for richness
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      
      gainNode2.gain.setValueAtTime(0, now + 0.08);
      gainNode2.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      oscillator2.start(now + 0.08);
      oscillator2.stop(now + 0.5);

    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  }, [vibrate]);

  return { 
    playNotificationSound, 
    playCashRegisterSound,
    vibrate,
    vibrateStrong 
  };
};
