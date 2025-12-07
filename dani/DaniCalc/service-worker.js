const CACHE_NAME = 'aiDANaI-Fusion-v2';
const CORE_ASSETS = [
    '.',
    'index.html',
    'manifest.json',
    'https://cdn.jsdelivr.net/npm/apexcharts' // Librería de gráficos
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // 1. API CoinGecko: Network First (Prioridad a datos frescos)
    if (url.hostname.includes('coingecko.com')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                    return res;
                })
                .catch(() => caches.match(e.request)) // Fallback a caché si no hay internet
        );
        return;
    }

    // 2. Fuentes de Google y Estilos Externos: Stale-While-Revalidate
    // (Usa caché pero actualiza en segundo plano)
    if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
        e.respondWith(
            caches.match(e.request).then(cachedResponse => {
                const networkFetch = fetch(e.request).then(res => {
                    caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
                    return res;
                });
                return cachedResponse || networkFetch;
            })
        );
        return;
    }

    // 3. Archivos propios de la App: Cache First (Velocidad máxima)
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});