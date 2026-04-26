const CACHE_NAME = 'aidanai-cache-v1';
const CORE_URLS = ['./', './index.html', './manifest.json'];
const OPTIONAL_URLS = ['./icon-192.png', './icon-512.png'];

// Instalar el Service Worker: cachea los archivos principales obligatorios
// y los opcionales (iconos) de forma silenciosa si no existen
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            await cache.addAll(CORE_URLS);
            await Promise.allSettled(OPTIONAL_URLS.map(url => cache.add(url)));
        })
    );
});

// Interceptar peticiones: devuelve caché si existe, si no va a la red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
