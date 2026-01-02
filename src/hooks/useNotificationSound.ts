import { useCallback, useRef } from 'react';

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const vibrate = useCallback(() => {
    // Check if Vibration API is available
    if ('vibrate' in navigator) {
      // Pattern: vibrate 200ms, pause 100ms, vibrate 200ms
      navigator.vibrate([200, 100, 200]);
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

  return { playNotificationSound, vibrate };
};
