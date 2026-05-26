const CACHE_NAME = 'alcocermed-main-v18';
const APP_SHELL = [
    './',
    './index.html',
    './styles.css?v=18',
    './script.js?v=4',
    './config.js',
    './device_guard.js',
    './manifest.webmanifest',
    './logo%20app%20juegos.png',
    './assets/flashcard-icons/mal-3d.png',
    './assets/flashcard-icons/regular-3d.png',
    './assets/flashcard-icons/bien-smile-3d.png',
    './assets/flashcard-icons/facil-3d.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) { return cache.addAll(APP_SHELL); })
            .catch(function () { return undefined; })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                if (key !== CACHE_NAME && key.indexOf('alcocermed-main-') === 0) {
                    return caches.delete(key);
                }
                return undefined;
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.protocol.indexOf('http') !== 0) return;
    if (url.hostname.indexOf('supabase.co') !== -1) return;

    event.respondWith(
        fetch(request)
            .then(function (response) {
                if (response && response.ok && response.type !== 'opaque') {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(request, copy);
                    });
                }
                return response;
            })
            .catch(function () {
                return caches.match(request).then(function (cached) {
                    if (cached) return cached;
                    if (request.mode === 'navigate') return caches.match('./index.html');
                    return undefined;
                });
            })
    );
});
