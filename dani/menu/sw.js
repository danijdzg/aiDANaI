const CACHE_NAME = 'aidanai-v3'; // Subimos la versión para forzar la actualización
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. INSTALACIÓN: Precargar y forzar actualización
self.addEventListener('install', event => {
  // self.skipWaiting() obliga al Service Worker a instalarse inmediatamente,
  // sin esperar a que el usuario cierre todas las pestañas de la app.
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precargando recursos estáticos');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ACTIVACIÓN: Limpiar cachés antiguas y tomar el control
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    // self.clients.claim() hace que el Service Worker tome el control de la página 
    // en la primera carga, sin requerir recargar la página.
    .then(() => self.clients.claim()) 
  );
});

// 3. FETCH: Estrategia Stale-While-Revalidate (Sirve rápido, actualiza en silencio)
self.addEventListener('fetch', event => {
  // Solo interceptamos peticiones GET (ignoramos envíos de formularios, etc.)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        
        // Petición a la red que se ejecuta en segundo plano
        const fetchedResponse = fetch(event.request).then(networkResponse => {
          // Si la respuesta es válida, actualizamos la caché con la nueva versión
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Aquí podríamos devolver una página de "Estás offline" si lo deseamos en el futuro
          console.log('[Service Worker] Red no disponible, usando solo caché.');
        });

        // La magia ocurre aquí: 
        // 1. Devuelve la caché de inmediato si existe (carga instantánea).
        // 2. Si no hay caché, espera a la red.
        // Mientras tanto, la petición de red (fetchedResponse) actualiza la caché en silencio.
        return cachedResponse || fetchedResponse;
      });
    })
  );
});