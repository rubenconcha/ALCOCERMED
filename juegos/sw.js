const CACHE_NAME = 'alcocermed-juegos-v44';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  './logo_app.png'
];

// Instalar el Service Worker y almacenar en caché los recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activar el Service Worker y limpiar cachés antiguas si las hay
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de Fetch: Network First, fallback to Cache
// Para que siempre intente traer la versión más nueva de la red, pero si no hay internet cargue la caché.
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (como el API de Supabase)
  if (event.request.method !== 'GET') return;
  
  // Ignorar absolutamente todo lo que vaya a Supabase para evitar cuelgues de red en PWA
  if (event.request.url.includes('supabase.co')) return;
  
  // Ignorar extensiones de Chrome y peticiones cruzadas extrañas
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clonar la respuesta de la red y actualizar la caché si es un recurso local o de asset
        if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si falla la red (offline), intentar desde la caché
        return caches.match(event.request);
      })
  );
});
