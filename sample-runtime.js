'use strict';
// Public-only state: no Supabase, authentication, storage, or ranking writes.
const sampleCards = QUIZ_QUESTIONS.map(question => ({ question: question.q, answer: question.opts[question.answer] }));
let sampleIndex = 0;
let activeSample = 'study-area';
let quizStarted = false;
let hangmanStarted = false;
let sampleTimerActive = false;
const sampleScreens = ['study-area', 'sample-maps', 'game-quiz', 'game-hangman', 'sample-finished'];
const sampleButtons = [...document.querySelectorAll('[data-screen]')];
function campo(row, key) { return row[key] || ''; }
const mmState = { filteredMapas: [{ titulo: 'La Célula', materia: 'Biología Celular', url_imagen: 'mapas mentales/lacelula.png', descripcion: 'Visión general de la célula: tipos, organelos y funciones fundamentales.' }] };

function selectSample(id) {
    if (!sampleScreens.includes(id)) return;
    if (id === 'study-area' && sampleIndex >= sampleCards.length) id = 'sample-finished';
    activeSample = id;
    sampleScreens.forEach(screen => document.getElementById(screen).classList.toggle('hidden', screen !== id));
    sampleButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.screen === id)));
    if (id === 'game-quiz' && !quizStarted) { quizStarted = true; startQuiz(); }
    if (id === 'game-hangman' && !hangmanStarted) { hangmanStarted = true; startHangman(); }
    syncSampleHeight();
}
sampleButtons.forEach(button => button.addEventListener('click', () => selectSample(button.dataset.screen)));
window.goHome = () => selectSample('study-area');
window.goBack = window.goHome;

function renderSampleCard() {
    if (sampleIndex >= sampleCards.length) { selectSample('sample-finished'); return; }
    const card = sampleCards[sampleIndex];
    document.getElementById('card').classList.remove('flipped');
    document.getElementById('q-text').textContent = card.question;
    document.getElementById('a-text').textContent = card.answer;
    document.getElementById('card-num').textContent = sampleIndex + 1;
    document.getElementById('card-total').textContent = sampleCards.length;
    document.getElementById('btn-reveal').classList.remove('hidden');
    document.getElementById('anki-buttons').classList.add('hidden');
}
document.getElementById('current-subject').textContent = 'Biología celular';
document.getElementById('card-tema-name').textContent = 'La célula · 5 tarjetas de muestra';
document.getElementById('btn-reveal').addEventListener('click', () => {
    document.getElementById('card').classList.add('flipped');
    document.getElementById('btn-reveal').classList.add('hidden');
    document.getElementById('anki-buttons').classList.remove('hidden');
});
window.rateCard = () => { sampleIndex++; renderSampleCard(); };
window.prevCard = () => { sampleIndex = Math.max(0, sampleIndex - 1); renderSampleCard(); };
window.goNextCard = () => { sampleIndex++; renderSampleCard(); };
window.resetFlashcards = () => { sampleIndex = 0; selectSample('study-area'); renderSampleCard(); };

renderMmGrid();
document.querySelectorAll('.mm-card').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Ampliar mapa La Célula');
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); } });
});
const originalOpenMap = window.openMmLightbox;
window.openMmLightbox = map => { originalOpenMap(map); document.querySelector('.mm-lb-close').focus(); };
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMmLightbox(); document.querySelector('.mm-card').focus(); } });

// Timed sample games only advance while the quiz is visible, including inside the landing iframe.
const nativeInterval = window.setInterval;
window.setInterval = (callback, delay, ...args) => nativeInterval(() => {
    if (activeSample === 'game-quiz' && sampleTimerActive && !document.hidden) callback(...args);
}, delay);
new IntersectionObserver(entries => { sampleTimerActive = entries[0].isIntersecting; }, { threshold: 0.3 }).observe(document.getElementById('game-quiz'));
function syncSampleHeight() {
    if (window.parent !== window) window.parent.postMessage({ type: 'alcocer-sample-height', height: document.body.offsetHeight + 8 }, location.origin);
}
new ResizeObserver(syncSampleHeight).observe(document.getElementById('sample-content'));
window.addEventListener('load', syncSampleHeight);
renderSampleCard();
selectSample('study-area');
