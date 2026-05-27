// sw.js
const CACHE_NAME = 'aidanai-v2'; // Versión bumpeada para limpiar caché con código MSAL antiguo // Subimos versión
const CACHE_URLS = [
    './', 
    './index.html', 
    './manifest.json', 
    'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
    'https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 1. INSTALACIÓN
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('📦 SW: Cacheando archivos estáticos');
            return Promise.allSettled(
                CACHE_URLS.map(url => cache.add(url).catch(err => console.warn('No se pudo cachear:', url, err)))
            );
        })
    );
    self.skipWaiting(); 
});

// 2. ACTIVACIÓN: Limpiamos cachés antiguas
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim(); 
});

// 3. INTERCEPTOR DE RED (Fetch) - MODO VELOCIDAD EXTREMA
self.addEventListener('fetch', e => {
    const url = e.request.url;
    
    // 🛑 REGLA 1: Llamadas a la nube NUNCA se cachean (Microsoft y Graph)
    if (
        url.includes('graph.microsoft.com') || 
        url.includes('login.microsoftonline.com') || 
        url.includes('login.live.com') || 
        url.includes('msauth') || 
        url.includes('alcdn.msauth.net') ||  // MSAL library auth calls
        url.includes('login.microsoft.com') ||
        url.includes('api.binance.com') ||   // API de precios en tiempo real
        url.includes('api.coingecko.com') || // API de precios crypto
        url.includes('www.alphavantage.co')  // API de precios acciones
    ) {
        return; // Deja pasar a la red nativamente (datos en tiempo real / auth)
    }
    
    // 🟢 REGLA 2: Stale-While-Revalidate (La app vuela y se actualiza en la sombra)
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            const fetchPromise = fetch(e.request).then(networkResponse => {
                if (e.request.url.startsWith('http') && networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return networkResponse;
            }).catch(() => {
                // Si falla la red y no hay caché, devolver respuesta offline
                return new Response('Sin conexión', { 
                    status: 503, 
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            });
            
            // Devuelve la caché de inmediato si existe, si no, espera a la red
            return cachedResponse || fetchPromise;
        })
    );
});