// service-worker.js

// ✅ CAMBIO: Versión del caché actualizada para forzar la recarga de assets.
const CACHE_NAME = 'aidanai-agenda-cache-v1.2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './aiDANaI.webp',
    // Assets de CDNs - cruciales para el funcionamiento offline
    'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
    'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
    // ✅ CAMBIO: URL ambigua reemplazada por la URL explícita del recurso.
    'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js',
    'https://npmcdn.com/flatpickr/dist/l10n/es.js',
    'https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore-compat.js',
    'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.css',
    'https://cdn.jsdelivr.net/npm/driver.js@1.0.1/dist/driver.js.iife.js',
    // Fuentes (URLs obtenidas inspeccionando la red en DevTools)
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://fonts.gstatic.com/s/archivonarrow/v29/k3k_oo_2_kc2v-E9zroG22_s9132qg.woff2',
    'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5fCRc4AMP6lbA.woff2'
];

// Evento 'install': se dispara cuando el SW se instala por primera vez.
// Aquí es donde cacheamos los assets de la aplicación.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Abriendo caché y añadiendo assets iniciales.');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Service Worker: Fallo al cachear assets iniciales:', error);
            })
    );
});

// Evento 'activate': se dispara después de la instalación.
// Aquí limpiamos cachés antiguos para evitar usar archivos desactualizados.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Limpiando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Tomar control inmediato de la página
    return self.clients.claim();
});

// Evento 'fetch': se dispara cada vez que la app solicita un recurso (una imagen, un script, una petición a la API).
// Interceptamos la petición y respondemos con la versión del caché si está disponible.
self.addEventListener('fetch', event => {
    // No interceptar las peticiones a Firebase Firestore, ya que tiene su propio manejo offline.
    if (event.request.url.includes('firestore.googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el recurso está en el caché, lo devolvemos.
                if (response) {
                    // console.log('Service Worker: Sirviendo desde caché:', event.request.url);
                    return response;
                }
                
                // Si no está en el caché, vamos a la red a buscarlo.
                // console.log('Service Worker: Sirviendo desde la red:', event.request.url);
                return fetch(event.request);
            })
    );
});