const CACHE_NAME = 'alcocermed-juegos-v118-muestra';
const ASSETS_TO_CACHE = [
    './game-rounds.js?v=1',
    './game-practice.js?v=20261021-visual5b',
    './game-question-images.js?v=1',
    './app.js?v=2026111205',
    './styles.css?v=87',
    '/juegos/logo-ben-carson-160.webp',
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
    './logo-app-240.webp',
    '/assets/vendor/supabase.js?v=2.118.0',
    '/assets/vendor/font-awesome-6.4.0/css/all.min.css',
    '/assets/fonts/inter/inter.css?v=1',
    '/assets/fonts/inter/latin.woff2',
    '/assets/fonts/inter/latin-ext.woff2',
    '../device_guard.js?v=12',
    '/device-limit.css?v=1',
    './tejido-nervioso-imagenes.js?v=5',
    './encefalo-native-data.js?v=1',
    './sentidos-imagenes.js?v=1',
    './relacionar.js?v=2',
    './acceso-noche.js?v=1',
    './game-access.js?v=3',
    './premium-game-images.js?v=6',
    './quiz-copy.js?v=1',
    './tejido-nervioso.js?v=16',
];

const STATIC_ASSETS = new Set(ASSETS_TO_CACHE.map(asset => new URL(asset, self.location.origin + '/juegos/').href));
const ENTRY_ASSETS = ASSETS_TO_CACHE.filter(asset => !/(?:tejido-nervioso(?:-imagenes)?|encefalo-native-data|sentidos-imagenes|relacionar|premium-game-images|game-practice|game-question-images)\./.test(asset) &&
    !asset.includes('/assets/preguntas') &&
    !asset.endsWith('result_arena_bg.png') && !asset.endsWith('logo-ben-carson-160.webp') &&
    !asset.endsWith('latin-ext.woff2'));

// Instalar el Service Worker y almacenar en caché los recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(ENTRY_ASSETS.map((asset) => cache.add(asset)));
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

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (como el API de Supabase)
  if (event.request.method !== 'GET' || event.request.headers?.has('Range') ||
      event.request.headers?.has('Authorization')) return;
  
  // Ignorar absolutamente todo lo que vaya a Supabase para evitar cuelgues de red en PWA
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  
  // Ignorar extensiones de Chrome y peticiones cruzadas extrañas
  if (!event.request.url.startsWith('http')) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (STATIC_ASSETS.has(url.href) && (url.searchParams.has('v') || url.pathname.startsWith('/assets/vendor/'))) {
      const hit = await cache.match(event.request);
      if (hit) return hit;
    }
    try {
      const response = await fetch(event.request);
      if (response.status === 200 && response.type === 'basic' &&
          !/no-store|private/i.test(response.headers.get('Cache-Control') || '')) {
        cache.put(event.request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return (await cache.match(event.request)) || Response.error();
    }
  })());
});
