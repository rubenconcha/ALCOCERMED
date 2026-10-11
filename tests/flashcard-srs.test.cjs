const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('script.js', 'utf8');

function setup(saved = new Map(), now = 1800000000000) {
    const timers = new Map();
    let timerId = 0;
    const nodes = new Map();
    const context = vm.createContext({
        currentUser: { id: 'student-one' }, currentCampusScreen: 'study-area',
        deck: [], currentIndex: 0, flashcardTopicCards: [], flashcardReviewTimer: null,
        flashcardRatingPending: false, totalReviews: 0, ultimaMateria: '', temasVistos: new Set(),
        window: { innerWidth: 1200 },
        document: {
            addEventListener() {},
            getElementById(id) {
                if (!nodes.has(id)) nodes.set(id, { innerText: '', classList: { add() {}, remove() {} } });
                return nodes.get(id);
            }
        },
        Date: { now: () => now },
        localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) },
        setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
        clearTimeout: id => timers.delete(id),
        campo: (card, name) => card[name] ?? card[name.toUpperCase()] ?? '',
        normalizeDbText: value => String(value).toUpperCase(), shuffleArray: cards => cards,
        showScreen: screen => { context.currentCampusScreen = screen; },
        renderCard: () => { context.renders++; }, renders: 0,
        actualizarProgreso() {}, showToast() {}, playFlashcardRatingSound() {},
        incrementDailyCount: () => 1, updateStreak() {}, sincronizarFlashcardsEnNube() {}, DAILY_GOAL: 20
    });
    vm.runInContext(source.slice(source.indexOf('const SRS_INTERVALS ='), source.indexOf('const DAILY_GOAL =')), context);
    vm.runInContext(source.slice(source.indexOf('function startDeck('), source.indexOf('function renderCard(')), context);
    vm.runInContext(source.slice(source.indexOf('window.rateCard ='), source.indexOf('window.goNextCard =')), context);
    return { context, saved, timers, advance(ms) { now += ms; }, now: () => now };
}

const card = { id: 1, materia: 'MORFOFUNCION', tema: 'Anatomía', pregunta: '¿Qué estudia la anatomía?' };

for (const [score, minutes] of [[0, 1], [1, 10], [2, 1440], [3, 4320]]) {
    test(`la calificación ${score} vuelve exactamente después de ${minutes} minutos`, () => {
        const h = setup();
        h.context.startDeck('Anatomía', 'MORFOFUNCION', [card]);
        h.context.window.rateCard(score);
        assert.equal(h.context.getCardReviewTime(card), h.now() + minutes * 60000);
        assert.equal(h.context.isCardDue(card), false);
        h.advance(minutes * 60000 - 1);
        h.context.refreshFlashcardReviews();
        assert.equal(h.context.deck.length, 1);
        h.advance(1);
        const before = h.context.renders;
        h.context.refreshFlashcardReviews();
        assert.equal(h.context.deck.length, 2);
        assert.equal(h.context.deck[h.context.currentIndex].id, card.id);
        assert.equal(h.context.renders, before + 1);
        h.context.refreshFlashcardReviews();
        assert.equal(h.context.deck.length, 2, 'la tarjeta no se duplica al reactivar la pestaña');
    });
}

test('volver a abrir el tema conserva la espera y vuelve a mostrarlo al vencer', () => {
    const h = setup();
    h.context.startDeck('Anatomía', 'MORFOFUNCION', [card]);
    h.context.window.rateCard(2);
    const reopened = setup(h.saved, h.now());
    reopened.context.startDeck('Anatomía', 'MORFOFUNCION', [card]);
    assert.equal(reopened.context.deck.length, 0);
    assert.equal([...reopened.timers.values()][0].delay, 86400000);
    reopened.advance(86400000);
    reopened.context.refreshFlashcardReviews();
    assert.equal(reopened.context.deck.length, 1);
});

test('un repaso vencido va después de la pregunta actual sin interrumpirla', () => {
    const h = setup();
    const second = { ...card, id: 2, pregunta: 'Otra pregunta' };
    const third = { ...card, id: 3, pregunta: 'Una tercera pregunta' };
    h.context.startDeck('Anatomía', 'MORFOFUNCION', [card, second, third]);
    h.context.window.rateCard(0);
    const before = h.context.renders;
    h.advance(60000);
    h.context.refreshFlashcardReviews();
    assert.equal(h.context.deck[h.context.currentIndex].id, 2);
    assert.equal(h.context.renders, before);
    assert.equal(h.context.deck[h.context.currentIndex + 1].id, 1);
    h.context.window.rateCard(2);
    assert.equal(h.context.deck[h.context.currentIndex].id, 1);
});

test('las fechas no se mezclan entre tarjetas ni entre cuentas', () => {
    const h = setup();
    const other = { ...card, id: 2 };
    h.context.saveSrs(card, 60000);
    assert.equal(h.context.isCardDue(other), true);
    h.context.currentUser = { id: 'student-two' };
    assert.equal(h.context.isCardDue(card), true);
    assert.notEqual(h.context.getSrsKey({ ...card, id: '', pregunta: 'Inicio común: primera' }),
        h.context.getSrsKey({ ...card, id: '', pregunta: 'Inicio común: segunda' }));
});

test('una doble pulsación no califica dos tarjetas', () => {
    const h = setup();
    h.context.window.event = { currentTarget: { classList: { add() {}, remove() {} } } };
    h.context.startDeck('Anatomía', 'MORFOFUNCION', [card, { ...card, id: 2 }]);
    h.context.window.rateCard(0);
    h.context.window.rateCard(2);
    assert.equal(h.context.totalReviews, 1);
    assert.equal(h.context.currentIndex, 1);
});

test('cerrar sesión conserva las fechas de repaso y elimina la sesión de acceso', () => {
    const stored = {
        alcocer_device_id: 'device-one', srs_v2_student_one_card_1: '1800000060000',
        'sb-auth-token': 'session', other: 'temporary'
    };
    const localStorage = { ...stored };
    Object.defineProperty(localStorage, 'removeItem', { value: key => delete localStorage[key] });
    const context = vm.createContext({
        window: { location: { origin: 'https://alcocermed.com', pathname: '/campus' } },
        localStorage, sessionStorage: { clear() {} }, currentUser: { id: 'student-one' },
        getSupabase: () => ({ auth: { signOut() {} } }), showLoginScreen() {},
        history: { replaceState() {} }, document: { title: 'Campus' }
    });
    vm.runInContext(source.slice(source.indexOf('window.handleLogout ='), source.indexOf('/** Toggle visibilidad contraseña */')), context);
    context.window.handleLogout();
    assert.equal(localStorage.srs_v2_student_one_card_1, stored.srs_v2_student_one_card_1);
    assert.equal(localStorage.alcocer_device_id, stored.alcocer_device_id);
    assert.equal(localStorage['sb-auth-token'], undefined);
    assert.equal(context.currentUser, null);
});
