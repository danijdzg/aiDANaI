// service-worker.js

// 1. DEFINICIÓN DE LA CACHÉ
// ==========================================================

// Nombre de la caché. Es una buena práctica versionarla.
// Si actualizas los archivos de tu app, cambia el número (p. ej., 'aidanai-cache-v2').
const CACHE_NAME = 'aidanai-cache-v2';

// Lista de archivos fundamentales para que la aplicación funcione (el "App Shell").
// Estos son los archivos que se guardarán para poder usarlos sin conexión.
const urlsToCache = [
  // --- Archivos locales de tu app ---
  './', // La página principal (index.html)
  './manifest.json', // El manifiesto de la PWA (si sigues la recomendación de crearlo)
  './aiDANaI.webp', // El logo de tu aplicación

  // --- Librerías y estilos de CDNs ---
  'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
  'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
  'https://cdn.jsdelivr.net/npm/flatpickr',
  'https://unpkg.com/flatpickr/dist/l10n/es.js'
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore-compat.js',
  'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css',
  'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js'
];


// 2. EVENTOS DEL SERVICE WORKER
// ==========================================================

/**
 * Evento 'install': Se dispara cuando el navegador instala el Service Worker por primera vez.
 * Aquí es donde abrimos la caché y guardamos nuestros archivos.
 */
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  // waitUntil espera a que la promesa se resuelva antes de terminar la instalación.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caché abierta. Guardando archivos del App Shell.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Archivos del App Shell cacheados con éxito.');
        // skipWaiting() fuerza al nuevo Service Worker a activarse inmediatamente.
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Falló el cacheo de archivos durante la instalación.', err);
      })
  );
});

/**
 * Evento 'activate': Se dispara una vez que el Service Worker se ha instalado y está listo para tomar el control.
 * Aquí limpiamos las cachés antiguas para liberar espacio.
 */
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Si el nombre de una caché no coincide con la actual, la eliminamos.
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpiando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
        console.log('Service Worker: Activado y listo para controlar la aplicación.');
        // clients.claim() permite que el SW controle las páginas ya abiertas inmediatamente.
        return self.clients.claim();
    })
  );
});


/**
 * Evento 'fetch': Se dispara cada vez que la aplicación realiza una petición de red (p.ej., pedir una imagen, un script, etc.).
 * Aquí interceptamos la petición y decidimos si la servimos desde la caché o desde la red.
 */
self.addEventListener('fetch', event => {
  const { request } = event;

  // No interceptamos peticiones que no sean GET (como POST) ni las de las APIs de Google/Firebase.
  // Es importante dejar que las peticiones a las APIs lleguen a la red para la sincronización de datos.
	if (request.method !== 'GET' || request.url.includes('googleapis.com') || request.url.includes('google.com/js/api.js') || request.url.includes('apis.google.com')) {
    event.respondWith(fetch(request));
    return;
  }

  // Estrategia: "Cache, falling back to Network" (Primero caché, si falla, vamos a la red).
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Si la respuesta está en la caché, la devolvemos directamente.
        if (cachedResponse) {
          // console.log('Service Worker: Sirviendo desde la caché:', request.url);
          return cachedResponse;
        }

        // Si no está en la caché, la pedimos a la red.
        // console.log('Service Worker: No está en caché. Pidiendo a la red:', request.url);
        return fetch(request).then(networkResponse => {
          // Y guardamos la respuesta de la red en la caché para la próxima vez.
          return caches.open(CACHE_NAME).then(cache => {
            // Clonamos la respuesta porque solo se puede consumir una vez.
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch(error => {
        // Si tanto la caché como la red fallan (p.ej., sin conexión y el archivo no está en caché).
        console.error('Service Worker: Error en el fetch:', error);
        // Podrías devolver una página de "error de conexión" aquí si quisieras.
      })
  );
});