const CACHE_NAME = 'alcocermed-main-v185-apertura';
const APP_SHELL = [
    './student-results.js?v=6',
    './student-results.css?v=1',
    './question-review.js?v=12',
    './suficiencia-core.js?v=12',
    './suficiencia.js?v=17',
    './suficiencia.css?v=9',
    './campus',
    './campus.html',
    './index.html',
    './ventas.html',
    './assets/study-tools.svg',
    './assets/study-art/cards.webp',
    './assets/study-art/map.webp',
    './assets/study-art/quiz.webp',
    './assets/study-art/past-exams.webp',
    './assets/study-art/word.webp',
    './logo%20app%20juegos.png',
    './assets/flashcard-icons/mal-3d.png',
    './assets/flashcard-icons/regular-3d.png',
    './assets/flashcard-icons/bien-smile-3d.png',
    './assets/flashcard-icons/facil-3d.png',
    './manifest.webmanifest',
    './styles.css?v=46',
    './commerce.css?v=1',
    './student-white.css?v=2',
    './campus-theme.css?v=4',
    './campus-access.css?v=2',
    './campus-navigation.css?v=4',
    './campus-atlas.css?v=5',
    '/device-limit.css?v=1',
    './campus-home.css?v=5',
    './campus-topics.css?v=4',
    './login-polish.css?v=3',
    './campus-preview.css?v=3',
    './platform-polish.js?v=1',
    './config.js',
    './device_guard.js?v=9',
    './campus-access.js?v=10',
    './official-flashcards.js?v=2',
    './study-depth.js?v=20',
    './study-depth.css?v=3',
    './flashcard-workspace.css?v=5',
    './flashcard-approved.css?v=6',
    './assets/fonts/outfit-900.woff2',
    './flashcard-workspace.js?v=20261109-foco',
    './script.js?v=20261109-apertura',
    './campus-login.js?v=2',
    './campus-catalogs.js?v=1',
    './campus-exam-engine.js?v=1',
    './topic-evaluations.js?v=20261109-apertura',
    './topic-evaluations.css?v=5',
    './recuperar.html',
    './password-recovery.js?v=1',
    './password-recovery-redirect.js?v=1',
    './mindmap-branch-labels.js?v=20261021-visual5b',
    './mindmap-content.js?v=3',
    './mindmap-premium-catalog.js?v=20261021-visual5b',
    './mindmap-premium.js?v=3',
    './mindmap-detailed-content.js?v=20261021-visual5b',
    './mindmap-practice.js?v=20261021-visual5b',
    './mindmap-viewer.js?v=20',
    './mindmap-viewer.css?v=8',
    './assets/mindmaps/fonts/outfit.css?v=3',
    './assets/mindmaps/fonts/outfit-variable.woff2',
    './assets/mindmaps/fonts/outfit-variable-latin-ext.woff2',
    '/assets/vendor/supabase.js?v=2.118.0',
    '/assets/vendor/font-awesome-6.4.0/css/all.min.css',
    '/assets/vendor/font-awesome-6.4.0/webfonts/fa-brands-400.woff2',
    '/assets/vendor/font-awesome-6.4.0/webfonts/fa-regular-400.woff2',
    '/assets/vendor/font-awesome-6.4.0/webfonts/fa-solid-900.woff2',
    '/assets/vendor/font-awesome-6.4.0/webfonts/fa-v4compatibility.woff2',

    './intocables-hub.js?v=5',
    './intocables-sheets.css?v=1',
    './assets/study-art/intocables-hero.webp',
    './study-assessments.js?v=2',
    './simulation-scope.js?v=11',
    './simulacro-ingreso.js?v=14',
    './simulacro-library.js?v=10',
    './simulacro-library.css?v=7',
    './student-library.js?v=11',
    './study-summaries.js?v=20261109-apertura',
    './summary-pdf-reader.js?v=9',
    './summary-pdf-reader.css?v=5',
    './campus-study-resources.css?v=8',
    './study-calendar.css?v=12',
    './study-calendar-data.js?v=7',
    './study-calendar-pdf.js?v=2',
    './study-calendar.js?v=14',
    './campus-shell.css?v=4',
    './campus-shell.js?v=4',
    './campus-section-tracking.js?v=1',
    './campus-atlas.js?v=12',
    './study-media.js?v=20261021-visual5b',
    './study-media.css?v=20261021-visual5c',
    './assets/campus-moods-512.webp',
    './assets/campus-logo.webp',
    './assets/campus-study-brand.webp',
    './assets/calendar-icons.svg',
    './assets/calendar-study-art.svg',
    './assets/fonts/poppins/400.woff2',
    './assets/fonts/poppins/500.woff2',
    './assets/fonts/poppins/600.woff2',
    './assets/fonts/poppins/700.woff2',
    './vendor/jspdf/jspdf.umd.min.js',
    './vendor/pdfjs/pdf.min.mjs',
    './vendor/pdfjs/pdf.worker.min.mjs',
    './official-texts.js?v=13',
    './assets/study-art/morphology.webp',
    './assets/study-art/cell.webp',
    './assets/study-art/health-education.webp',
    './sufficiency-practice-content.js?v=2',
    './sufficiency-practice.js?v=3',
    './past-exams.js?v=15',
    './past-exam-breakdown.js?v=8',
    './past-exams.css?v=7',
    './content/past-exams/catalog.json?v=examenes-umss',
];

const BOOTSTRAP = new Set([
    './campus', './campus.html', './index.html', './ventas.html', './config.js',
    './styles.css', './campus-shell.css', './campus-login.js', './assets/calendar-icons.svg',
]);
const staticUrls = new Set(APP_SHELL
    .filter(url => !/\.html$|\/campus$/.test(url))
    .map(url => new URL(url, self.location.origin + '/').href));

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return Promise.allSettled(APP_SHELL.filter(url => BOOTSTRAP.has(url.split('?')[0]))
                    .map(url => cache.add(url)));
            })
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

    if (request.method !== 'GET' || url.protocol.indexOf('http') !== 0 || request.headers?.has('Authorization')) return;
    if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.endsWith('.pdf')) return;

    const network = () => fetch(request)
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
            });
    event.respondWith(staticUrls.has(url.href) && request.mode !== 'navigate'
        ? caches.match(request, { cacheName: CACHE_NAME }).catch(() => undefined)
            .then(cached => cached || network())
        : network());
});
