const CACHE_NAME = 'Calculadora';
const ASSETS = ['.', 'index.html', 'manifest.json'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));

self.addEventListener('fetch', e => {
    if (e.request.url.includes('api.coingecko.com')) {
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(res => res || fetch(e.request))
        );
    }
});