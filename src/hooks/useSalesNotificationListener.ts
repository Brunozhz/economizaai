import { useEffect, useRef } from 'react';

export const useSalesNotificationListener = () => {
  const cashRegisterAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload cash register sound
    cashRegisterAudioRef.current = new Audio('/sounds/cash-register.mp3');
    cashRegisterAudioRef.current.preload = 'auto';

    const playCashRegisterSound = () => {
      // Trigger strong vibration
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }

      if (cashRegisterAudioRef.current) {
        cashRegisterAudioRef.current.currentTime = 0;
        cashRegisterAudioRef.current.volume = 0.8;
        cashRegisterAudioRef.current.play().catch(e => {
          console.log('Could not play cash register sound:', e);
        });
      }
    };

    // Listen for service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PLAY_SALES_SOUND') {
        console.log('🔔 Playing sales sound for:', event.data.notificationType);
        playCashRegisterSound();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);
};
