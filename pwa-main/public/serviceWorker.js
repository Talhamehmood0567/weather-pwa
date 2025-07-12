self.addEventListener('push', function (event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.png'
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
  self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-weather') {
    event.waitUntil(syncQueuedRequests());
  }
});

async function syncQueuedRequests() {
  const queued = await getFromStorage(); // Implement with IndexedDB/localStorage
  for (const city of queued) {
    await fetch(`/weather?city=${city}`); // Call your API
  }
}

function getFromStorage() {
  return new Promise((resolve) => {
    const data = localStorage.getItem('offlineQueue');
    resolve(JSON.parse(data || '[]'));
  });
}

});
