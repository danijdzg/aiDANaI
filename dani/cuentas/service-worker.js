// service-worker.js

const CACHE_NAME = 'ctas-aidanai-cache-v1';
// Lista de todos los ficheros que componen la "carcasa" de tu aplicación.
const URLS_TO_CACHE = [
  '/',
  'index.html',
  'style.css',
  'main.js',
  'icons/android-chrome-192x192.png',
  'icons/android-chrome-512x512.png',
  'views/panel.html',
  'views/diario.html',
  'views/inversiones.html',
  'views/planificacion.html',
  'views/informes.html',
  'views/configuracion.html'
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
// Aquí es donde guardamos la "carcasa" de la app en la caché.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta. Guardando ficheros de la app...');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
// Aquí limpiamos cachés antiguas para asegurarnos de que el usuario siempre tenga la última versión.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre de la caché no es el actual, la borramos.
          if (CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch': Se dispara CADA VEZ que la app pide un recurso (un fichero, una imagen, etc.).
// Aquí es donde interceptamos la petición y decidimos qué hacer.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. Si encontramos el recurso en la caché...
        if (response) {
          // ...lo devolvemos directamente. ¡Esto es súper rápido!
          return response;
        }

        // 2. Si no está en la caché, vamos a internet a buscarlo.
        return fetch(event.request).then(
          networkResponse => {
            // Si la respuesta de la red es válida...
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // 3. Hacemos una copia de la respuesta y la guardamos en la caché para la próxima vez.
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});