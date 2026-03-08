/* Service Worker for pwa-counter */
/* Handles background notification scheduling */

let notificationTimer = null;

function scheduleNextNotification(intervalMs, counters) {
  if (notificationTimer) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }
  if (!intervalMs || intervalMs <= 0) return;

  notificationTimer = setTimeout(() => {
    const body = counters && counters.length > 0
      ? counters.map(c => `${c.name}: ${c.count}`).join(' | ')
      : 'Open the app to check your counters.';

    self.registration.showNotification('Counter', {
      body,
      icon: 'https://fakeimg.pl/192x192/fde047/000/?font=bebas&font_size=192&text=C',
      badge: 'https://fakeimg.pl/192x192/fde047/000/?font=bebas&font_size=192&text=C',
      tag: 'counter-notification',
      renotify: true,
    });

    scheduleNextNotification(intervalMs, counters);
  }, intervalMs);
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, intervalMs, counters } = event.data || {};
  if (type === 'SCHEDULE_NOTIFICATION') {
    scheduleNextNotification(intervalMs, counters);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('pwa-counter') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/pwa-counter/');
      }
    })
  );
});
