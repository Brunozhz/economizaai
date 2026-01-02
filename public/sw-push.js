// Custom service worker for push notifications
// This file extends the VitePWA service worker

self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  let data = {
    title: 'Economiza.IA',
    body: 'Você tem uma nova oferta exclusiva!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: {},
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.error('Error parsing push data:', e);
    }
  }

  // Check if this is a sales notification
  const notificationType = data.data?.type;
  const isSalesNotification = notificationType === 'pix_generated' || notificationType === 'pix_approved';

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: isSalesNotification ? [200, 100, 200, 100, 300] : [200, 100, 200],
    data: data.data,
    actions: [
      { action: 'open', title: 'Ver Oferta' },
      { action: 'close', title: 'Fechar' },
    ],
    requireInteraction: true,
    tag: notificationType || 'economiza-notification',
    renotify: true,
  };

  event.waitUntil(
    (async () => {
      // Show the notification
      await self.registration.showNotification(data.title, options);

      // Send message to all clients to play the appropriate sound
      if (isSalesNotification) {
        const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        allClients.forEach(client => {
          client.postMessage({
            type: 'PLAY_SALES_SOUND',
            notificationType: notificationType
          });
        });
      }
    })()
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          // Navigate to admin for sales notifications, otherwise messages
          const notificationType = event.notification.data?.type;
          if (notificationType === 'pix_generated' || notificationType === 'pix_approved') {
            client.navigate('/admin');
          } else if (event.notification.data?.url) {
            client.navigate(event.notification.data.url);
          } else {
            client.navigate('/messages');
          }
          return;
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        const notificationType = event.notification.data?.type;
        if (notificationType === 'pix_generated' || notificationType === 'pix_approved') {
          return clients.openWindow('/admin');
        }
        const url = event.notification.data?.url || '/messages';
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
