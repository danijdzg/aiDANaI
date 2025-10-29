const CACHE_NAME = 'aidanai-cache-v1';
const urlsToCache = [
  './',
  './index.html', // Asegúrate de que el nombre del fichero es correcto
  './aiDANaI.webp',
  'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
  'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devolver desde la caché
        }
        return fetch(event.request); // Si no, ir a la red
      }
    )
  );
});