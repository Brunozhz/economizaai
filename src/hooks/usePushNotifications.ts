import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// VAPID public key - this is safe to expose
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

export const usePushNotifications = () => {
  const { user, profile } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);
        
        // Check if already subscribed
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    };

    checkSupport();
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      console.log('Push notifications not supported');
      return false;
    }

    setLoading(true);

    try {
      // Request notification permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        console.log('Notification permission denied');
        setLoading(false);
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('Push subscription:', subscription);

      // Extract keys from subscription
      const subscriptionJson = subscription.toJSON();
      const p256dh = subscriptionJson.keys?.p256dh || '';
      const auth = subscriptionJson.keys?.auth || '';

      // Save subscription to database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user?.id,
          email: profile?.email,
          endpoint: subscription.endpoint,
          p256dh,
          auth,
        }, {
          onConflict: 'endpoint',
        });

      if (error) {
        console.error('Error saving subscription:', error);
        throw error;
      }

      setIsSubscribed(true);
      setLoading(false);
      return true;

    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      setLoading(false);
      return false;
    }
  }, [isSupported, user, profile]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return false;

    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Remove from database
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
      }

      setIsSubscribed(false);
      setLoading(false);
      return true;

    } catch (error) {
      console.error('Error unsubscribing:', error);
      setLoading(false);
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe,
  };
};
