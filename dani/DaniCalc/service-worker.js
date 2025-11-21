// Define un nombre y versión para la caché de la aplicación
const CACHE_NAME = 'danicalc-v1';

// Lista de archivos que se guardarán en la caché para el funcionamiento offline
const URLS_TO_CACHE = [
  '.', // El archivo HTML principal (index)
  'Danicalc.html', // Nombre explícito del archivo por si acaso
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  // Espera hasta que la promesa se resuelva
  event.waitUntil(
    // Abre la caché con el nombre que definimos
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta');
        // Añade todos los archivos de nuestra lista a la caché
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la página solicita un recurso (imágenes, scripts, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Busca si el recurso solicitado ya está en la caché
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en la caché, lo devuelve desde ahí
        if (response) {
          return response;
        }
        // Si no está en la caché, lo pide a la red como se haría normalmente
        return fetch(event.request);
      })
  );
});