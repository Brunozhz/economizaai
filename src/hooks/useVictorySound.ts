import { useCallback, useRef } from "react";

export const useVictorySound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    gain: number = 0.3
  ) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, []);

  const playVictorySound = useCallback((discountPercent: number) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (discountPercent >= 50) {
        // Epic fanfare for legendary wins (50%+)
        const notes = [
          { freq: 523.25, time: 0, dur: 0.15 },    // C5
          { freq: 659.25, time: 0.12, dur: 0.15 }, // E5
          { freq: 783.99, time: 0.24, dur: 0.15 }, // G5
          { freq: 1046.50, time: 0.36, dur: 0.4 }, // C6 (hold)
          { freq: 987.77, time: 0.5, dur: 0.15 },  // B5
          { freq: 1046.50, time: 0.65, dur: 0.5 }, // C6 (finale)
        ];
        notes.forEach(n => playNote(ctx, n.freq, now + n.time, n.dur, 0.35));
      } else if (discountPercent >= 30) {
        // Exciting sound for rare wins (30-49%)
        const notes = [
          { freq: 523.25, time: 0, dur: 0.12 },    // C5
          { freq: 659.25, time: 0.1, dur: 0.12 },  // E5
          { freq: 783.99, time: 0.2, dur: 0.12 },  // G5
          { freq: 1046.50, time: 0.3, dur: 0.35 }, // C6
        ];
        notes.forEach(n => playNote(ctx, n.freq, now + n.time, n.dur, 0.3));
      } else {
        // Simple cheerful sound for normal wins
        const notes = [
          { freq: 523.25, time: 0, dur: 0.1 },     // C5
          { freq: 659.25, time: 0.08, dur: 0.1 },  // E5
          { freq: 783.99, time: 0.16, dur: 0.2 },  // G5
        ];
        notes.forEach(n => playNote(ctx, n.freq, now + n.time, n.dur, 0.25));
      }
    } catch (error) {
      console.error("Error playing victory sound:", error);
    }
  }, [getAudioContext, playNote]);

  return { playVictorySound };
};
