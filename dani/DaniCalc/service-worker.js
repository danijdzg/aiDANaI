const CACHE_NAME = 'aiDANaI-Calc';
const ASSETS = ['.', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));

self.addEventListener('fetch', e => {
    // Estrategia diferente para API y Assets
    if (e.request.url.includes('api.coingecko.com')) {
        // Network First para precios (queremos datos frescos)
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
    } else {
        // Cache First para la app (velocidad instantánea)
        e.respondWith(
            caches.match(e.request).then(res => res || fetch(e.request))
        );
    }
});