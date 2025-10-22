// service-worker.js

const CACHE_NAME = 'ctas-aidanai-cache-v2';
// Lista de todos los ficheros que componen la "carcasa" de tu aplicación.
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'style.css',
  'main.js',
  'manifest.json', // Es buena práctica cachear también el manifest
  'aiDANaI.webp',  // Cachear la imagen principal
  'icons/android-chrome-192x192.png',
  'icons/android-chrome-512x512.png',
  'views/inicio.html', // <-- CAMBIADO,
  'views/diario.html',
  'views/inversiones.html',
  // --- INICIO DE LA CORRECCIÓN ---
  // Se eliminan los archivos antiguos y se añaden los nuevos.
  'views/analisis.html',
  'views/ajustes.html'
  // --- FIN DE LA CORRECCIÓN ---
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  // skipWaiting() fuerza al nuevo Service Worker a activarse inmediatamente.
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta. Guardando ficheros de la app...');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (CACHE_NAME !== cacheName) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de las páginas abiertas.
  );
});

// Evento 'fetch': Se dispara CADA VEZ que la app pide un recurso.
self.addEventListener('fetch', event => {
  // Solo aplicamos la estrategia de caché para peticiones GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      // 1. Intentar obtener el recurso de la red (Estrategia: Network First)
      return fetch(event.request)
        .then(networkResponse => {
          // Si la petición a la red tiene éxito, la guardamos en caché y la devolvemos
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // 2. Si la red falla, buscamos en la caché como respaldo (Offline Fallback)
          return cache.match(event.request).then(cachedResponse => {
            return cachedResponse || Response.error();
          });
        });
    })
  );
});