const CACHE_NAME = 'alcocermed-juegos-v107-ranking';
const ASSETS_TO_CACHE = [
    './game-rounds.js?v=1',
    './game-practice.js?v=2',
    './game-question-images.js?v=1',
    './app.js?v=105',
    './styles.css?v=86',
    './assets/preguntas-apoyo/mano-muneca.svg',
    './',
    './index.html',
    './assets/result_arena_bg.png',
    './assets/preguntas-contextuales/teoria-celular.svg',
    './assets/preguntas-contextuales/procariota.svg',
    './assets/preguntas-contextuales/eucariota.svg',
    './assets/preguntas-contextuales/adn.svg',
    './assets/preguntas-contextuales/arn.svg',
    './assets/preguntas-contextuales/virus.svg',
    './assets/preguntas-contextuales/prion.svg',
    './assets/preguntas-contextuales/modelo-biologico.svg',
    './assets/preguntas-contextuales/bacterias-modelo.svg',
    './assets/preguntas-contextuales/biomedicina-celular.svg',
    './assets/preguntas-contextuales/membrana-plasmatica.svg',
    './assets/preguntas-contextuales/citoplasma.svg',
    './assets/preguntas-contextuales/nucleo.svg',
    './assets/preguntas-contextuales/homeostasis-celular.svg',
    './assets/preguntas-contextuales/expresion-genica.svg',
    './assets/preguntas-contextuales/proteina-funcion.svg',
    './assets/preguntas-contextuales/evolucion-celular.svg',
    './assets/preguntas-contextuales/comparacion-celulas.svg',
    './assets/preguntas-contextuales/componentes-celulares.svg',
    './assets/preguntas-contextuales/sistemas-acelulares.svg',
    './assets/preguntas-contextuales/rasgos-eucariotas.svg',
    './assets/preguntas-contextuales/funciones-proteinas.svg',
    './assets/preguntas-contextuales/conceptos-introductorios.svg',
    './assets/preguntas-contextuales/niveles-informacion.svg',
    './assets/preguntas-contextuales/salud-colectiva.svg',
    './assets/preguntas-contextuales/promocion-salud.svg',
    './assets/preguntas-contextuales/prevencion.svg',
    './tejido-nervioso.css?v=8',
    './manifest.json',
    '././logo_app.png',
    './bg_music.mp4',
    '../device_guard.js?v=6',
    './tejido-nervioso-imagenes.js?v=5',
    './encefalo-native-data.js?v=1',
    './sentidos-imagenes.js?v=1',
    './relacionar.js?v=2',
    './acceso-noche.js?v=1',
    './game-access.js?v=2',
    './premium-game-images.js?v=6',
    './quiz-copy.js?v=1',
    './tejido-nervioso.js?v=14',
];

// Instalar el Service Worker y almacenar en caché los recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(ASSETS_TO_CACHE.map((asset) => cache.add(asset)));
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
          if (cacheName !== CACHE_NAME && cacheName.startsWith('alcocermed-juegos-')) {
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
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  
  // Ignorar extensiones de Chrome y peticiones cruzadas extrañas
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clonar la respuesta de la red y actualizar la caché si es un recurso local o de asset
        if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic' && !/no-store|private/i.test(networkResponse.headers.get('Cache-Control') || '')) {
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
