const CACHE_NAME = 'aiDANaI-Calc-v3'; // Cambié la versión para forzar actualización
const CORE_ASSETS = [
    '.',
    'index.html',
    'manifest.json',
    'https://cdn.jsdelivr.net/npm/apexcharts',
    'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Lexend:wght@300;400;500;700;800&family=Poppins:wght@400;500;700&family=Inter:wght@400;600&display=swap'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', e => {
    e.waitUntil(clients.claim());
    // Limpiar cachés antiguas para asegurar que se borran errores previos
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // 1. API CoinGecko: Network First con Validación Estricta
    if (url.hostname.includes('coingecko.com')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    // CRUCIAL: Solo cachear si la respuesta es válida (Status 200)
                    // Si da error 429 (Rate Limit) o 404, NO lo guardamos.
                    if (!res || res.status !== 200 || res.type !== 'cors') {
                        return res;
                    }
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                    return res;
                })
                .catch(() => caches.match(e.request)) // Si no hay internet, usa lo guardado
        );
        return;
    }

    // 2. Fuentes y Estilos: Stale-While-Revalidate
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

    // 3. Archivos App: Cache First
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});