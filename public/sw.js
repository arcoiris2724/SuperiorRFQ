// Service Worker for Push Notifications
const CACHE_NAME = 'dumpster-rental-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'Dumpster Rental', body: 'You have a new notification' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error('Push data parse error:', e);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    vibrate: [100, 50, 100],
    data: data.data || {},
    tag: data.type || 'general',
    renotify: true,
    requireInteraction: data.type === 'driver_nearby',
    actions: getActionsForType(data.type)
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

function getActionsForType(type) {
  switch (type) {
    case 'driver_nearby':
      return [{ action: 'track', title: 'Track Driver' }];
    case 'delivery_complete':
      return [{ action: 'view', title: 'View Details' }];
    case 'invoice_reminder':
      return [{ action: 'pay', title: 'Pay Now' }];
    default:
      return [{ action: 'open', title: 'Open App' }];
  }
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  let url = '/customer/login';
  
  if (action === 'track' && data.quoteId) {
    url = `/track/${data.referenceNumber || ''}`;
  } else if (action === 'pay' && data.invoiceId) {
    url = '/customer/login?tab=invoices';
  } else if (action === 'view') {
    url = '/customer/login';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
