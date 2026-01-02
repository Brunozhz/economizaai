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

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      { action: 'open', title: 'Ver Oferta' },
      { action: 'close', title: 'Fechar' },
    ],
    requireInteraction: true,
    tag: 'economiza-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
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
          // Navigate to messages if we have data
          if (event.notification.data?.url) {
            client.navigate(event.notification.data.url);
          } else {
            client.navigate('/messages');
          }
          return;
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        const url = event.notification.data?.url || '/messages';
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});
