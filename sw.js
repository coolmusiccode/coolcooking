const CACHE_NAME = 'kochapp-v3-0-2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/pdfs/ZitronenmelisseLimo.pdf',
  '/pdfs/ErdbeerLimoLemon.pdf',
  '/arisdunkinicedcoffee.html',
  '/pdfs/ArisDunkinIcedCoffee.pdf',
  '/photos/arisdunkinicedcoffee.jpg',
  '/limolemon.html',
  '/limostrawberry.html',
  '/manifest.json',
  '/icons/lemonade-8163072_1280.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Installieren: Alle Dateien zwischenspeichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Aktivieren: Alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Abruf: Cache zuerst, danach Update
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(networkResponse => {
        if (networkResponse.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
