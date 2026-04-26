const CACHE_NAME = 'aidanai-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Instalar el Service Worker y guardar en caché los archivos principales
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos cacheados correctamente');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar las peticiones de red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devuelve la versión en caché si existe, si no, va a la red
                return response || fetch(event.request);
            })
    );
});
