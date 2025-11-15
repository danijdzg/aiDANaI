const CACHE_NAME = 'aidanai-calc';

// Lista de archivos que se guardarán en la caché para el funcionamiento offline
const URLS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta y archivos añadidos');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en la caché, lo devuelve desde ahí. Si no, lo pide a la red.
        return response || fetch(event.request);
      })
  );
});

// Este código ayuda a que el Service Worker se actualice correctamente
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});