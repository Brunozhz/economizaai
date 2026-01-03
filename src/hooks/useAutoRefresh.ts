import { useEffect, useRef } from 'react';

export const useAutoRefresh = () => {
  const lastHiddenTime = useRef<number | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is being hidden - save the time
        lastHiddenTime.current = Date.now();
      } else {
        // Tab is visible again - check if enough time passed (5+ seconds)
        if (lastHiddenTime.current) {
          const timePassed = Date.now() - lastHiddenTime.current;
          if (timePassed > 5000) {
            // Force reload to get latest version
            window.location.reload();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
