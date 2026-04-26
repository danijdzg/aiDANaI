const CACHE_NAME = 'aidanai-cache-v1';
const CORE_URLS = ['./', './index.html', './manifest.json'];

// Instalar el Service Worker: cachea solo los 3 archivos de código
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_URLS))
    );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
