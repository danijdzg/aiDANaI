const CACHE_NAME = 'aidanai-cache-v2'; // Versión actualizada para forzar la actualización de la caché
const urlsToCache = [
  './',
  './index.html',
  './style.css', // NUEVO
  './app.js',    // NUEVO
  './aiDANaI.webp',
  'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
  'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

// Durante la instalación, cacheamos los recursos de la aplicación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta, añadiendo recursos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // NUEVO: Forzamos al nuevo Service Worker a activarse inmediatamente
        return self.skipWaiting();
      })
  );
});

// NUEVO: Durante la activación, limpiamos las cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      // Tomamos control inmediato de todas las páginas abiertas
      return self.clients.claim();
    })
  );
});


// Servimos los recursos desde la caché cuando sea posible (estrategia Cache First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos el recurso en la caché, lo devolvemos
        if (response) {
          return response;
        }
        // Si no, vamos a la red
        return fetch(event.request);
      }
    )
  );
});

// ===================================================================
// NUEVO: MANEJADOR DE LA SINCRONIZACIÓN EN SEGUNDO PLANO (BACKGROUND SYNC)
// ===================================================================
self.addEventListener('sync', event => {
  // Verificamos que la etiqueta de la tarea de sincronización sea la que esperamos
  if (event.tag === 'google-sync-tag') {
    console.log('Service Worker: Evento de sincronización recibido para Google Calendar.');
    // Le decimos al navegador que no termine el service worker hasta que completemos la tarea
    event.waitUntil(
      // Buscamos todas las pestañas/ventanas abiertas de nuestra aplicación
      self.clients.matchAll({ type: 'window' }).then(clients => {
        if (clients && clients.length) {
          console.log('Enviando mensaje al cliente para que ejecute la sincronización.');
          // Enviamos un mensaje a la primera pestaña abierta que encontremos
          clients[0].postMessage({ type: 'EXECUTE_GOOGLE_SYNC' });
        } else {
          console.log('No hay clientes abiertos para ejecutar la sincronización ahora mismo.');
          // Si no hay clientes, la sincronización se realizará la próxima vez que el usuario abra la app.
          // La lógica en app.js que se ejecuta al inicio se encargaría de ello.
        }
      })
    );
  }
});
