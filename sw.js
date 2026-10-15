const CACHE_NAME = 'alcocermed-main-v80';
const APP_SHELL = [
    './campus',
    './campus.html',
    './index.html',
    './ventas.html',
    './assets/study-tools.svg',
    './assets/study-art/cards.png',
    './assets/study-art/map.png',
    './assets/study-art/quiz.png',
    './assets/study-art/word.png',
    './logo%20app%20juegos.png',
    './assets/flashcard-icons/mal-3d.png',
    './assets/flashcard-icons/regular-3d.png',
    './assets/flashcard-icons/bien-smile-3d.png',
    './assets/flashcard-icons/facil-3d.png',
    './manifest.webmanifest',
    './styles.css?v=37',
    './commerce.css?v=1',
    './student-white.css?v=2',
    './campus-theme.css?v=3',
    './campus-access.css?v=2',
    './campus-navigation.css?v=3',
    './campus-home.css?v=5',
    './campus-topics.css?v=4',
    './login-polish.css?v=1',
    './campus-preview.css?v=3',
    './platform-polish.js?v=1',
    './config.js',
    './device_guard.js?v=4',
    './campus-access.js?v=9',
    './study-depth.js?v=1',
    './study-depth.css?v=2',
    './script.js?v=51',
    './mindmap-branch-labels.js?v=3',
    './mindmap-content.js?v=2',
    './mindmap-premium-catalog.js?v=2',
    './mindmap-premium.js?v=2',
    './mindmap-detailed-content.js?v=4',
    './mindmap-practice.js?v=1',
    './mindmap-viewer.js?v=16',
    './mindmap-viewer.css?v=7',
    './assets/mindmaps/fonts/outfit.css?v=1',
    './assets/mindmaps/fonts/outfit-0.ttf',
    './assets/mindmaps/fonts/outfit-1.ttf',
    './assets/mindmaps/fonts/outfit-2.ttf',
    './assets/mindmaps/fonts/outfit-3.ttf',
    './assets/mindmaps/fonts/outfit-4.ttf',

    './intocables-hub.js?v=1',
    './simulacro-ingreso.js?v=3',
    './student-library.js?v=8',
    './study-summaries.js?v=4',
    './past-exams.js?v=3',
    './past-exams.css?v=2',
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
    if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.endsWith('.pdf')) return;

    event.respondWith(
        fetch(request)
            .then(function (response) {
                if (response && response.ok && response.type !== 'opaque' && !/no-store|private/i.test(response.headers.get('Cache-Control') || '')) {
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
                    if (request.mode === 'navigate') {
                        return caches.match(url.pathname === '/' || url.pathname === '/planes' ? './index.html' : './campus.html');
                    }
                    return undefined;
                });
            })
    );
});
