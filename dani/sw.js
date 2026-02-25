// sw.js
const CACHE_NAME = 'aidanai-v3'; // Subimos versión para forzar la actualización
const CACHE_URLS = [
    './', // Cachea la raíz
    './index.html', // Cachea tu app
    './manifest.json', // El manifiesto
    './favicon.ico', // El logo
    'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js',
    'https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// 1. INSTALACIÓN: Guardamos todo en caché
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('📦 SW: Cacheando archivos estáticos');
            return Promise.allSettled(
                CACHE_URLS.map(url => cache.add(url).catch(err => console.warn('No se pudo cachear:', url, err)))
            );
        })
    );
    self.skipWaiting(); // Fuerza a que este SW tome el control inmediatamente
});

// 2. ACTIVACIÓN: Limpiamos cachés antiguas
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim(); // Toma el control de las pestañas abiertas
});

// 3. INTERCEPTOR DE RED (Fetch)
self.addEventListener('fetch', e => {
    const url = e.request.url;
    
    // 🛑 REGLA 1: Dejar pasar intactas las llamadas de Microsoft (Login y OneDrive)
    // No queremos cachear datos financieros privados ni tokens de seguridad
    if (url.includes('graph.microsoft.com') || url.includes('login.microsoftonline.com') || url.includes('msauth')) {
        return; // Pasa directo a la red
    }
    
    // 🟢 REGLA 2: Cache-First con Network Fallback para todo lo demás
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached; // Devuelve de caché si existe
            
            // Si no está en caché, ve a la red
            return fetch(e.request).then(response => {
                // Guardamos en caché para la próxima vez (solo respuestas válidas)
                if (response && response.status === 200 && response.type !== 'opaque') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return response;
            }).catch(() => {
                // Si falla la red y no está en caché (modo offline profundo)
                return new Response('Sin conexión', { status: 503, statusText: 'Offline' });
            });
        })
    );
});