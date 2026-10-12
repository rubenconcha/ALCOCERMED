const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const catalog = require('../content/past-exams/catalog.json');

test('los 15 exámenes conservan gestión, numeración, preguntas y patrones completos disponibles', () => {
    assert.equal(catalog.exams.length, 15);
    assert.deepEqual([...new Set(catalog.exams.map(exam => exam.year))], ['2021', '2021–2022', '2022–2023', '2023–2024', '2024–2025', '2025–2026']);
    assert.equal(catalog.exams.reduce((total, exam) => total + exam.count, 0), 1491);
    for (const exam of catalog.exams) {
        const paper = require('../api/_past_exams/' + exam.id + '.json');
        assert.equal(exam.duration, 100);
        assert.equal(paper.duration, 100);
        assert.equal(paper.questions.length, exam.count);
        const numbers = paper.questions.map(q => q.numero_original);
        assert.equal(new Set(numbers).size, exam.count);
        assert.deepEqual([...numbers].sort((a, b) => a - b), numbers);
        assert.equal(numbers.length + exam.missingNumbers.length + exam.excludedQuestions.length, 100);
        assert.ok(fs.existsSync('api/_past_exams/' + exam.id + '-pattern.webp'));
        assert.equal(fs.existsSync('content/past-exams/' + exam.id + '.json'), false, 'paid questions must not be public static files');
        for (const q of paper.questions) {
            assert.ok(q.pregunta.trim());
            assert.ok(!q.pregunta.includes('\ufffd'));
            for (const key of q.respuestas_aceptadas) assert.ok(q['opcion_' + key.toLowerCase()]);
        }
    }
    const final = catalog.exams.find(exam => exam.id === '2025-2026-3');
    assert.deepEqual(final.missingNumbers, [67]);
    assert.equal(final.excludedQuestions[0].numero_original, 66);
});

test('el cronómetro de exámenes pasados permite responder después de 100 minutos y conserva el cierre de simulacros', () => {
    const source = fs.readFileSync('script.js', 'utf8');
    let tick, finished = 0;
    const display = {}, wrap = { classList: { toggle() {} } };
    const context = {
        simState: { mode: 'pasado', secondsLeft: 6000, endTimestamp: 6000000 },
        Date: { now: () => 6005000 },
        document: { getElementById: id => id === 'sim-timer-display' ? display : wrap },
        setInterval: fn => { tick = fn; return 1; }, clearInterval() {},
        showToast() {}, finalizarSimulacro: () => { finished++; }
    };
    vm.runInNewContext(source.slice(source.indexOf('function startSimTimer()'), source.indexOf('function renderSimQuestion()')), context);
    context.startSimTimer(); tick();
    assert.equal(finished, 0);
    assert.equal(context.simState.secondsLeft, -5);
    assert.equal(display.textContent, '+00:05');
    context.Date.now = () => 6120000; tick();
    assert.equal(display.textContent, '+02:00');
    assert.equal(finished, 0);
    context.simState.mode = 'aleatorio'; context.startSimTimer(); tick();
    assert.equal(finished, 1);
    assert.equal(display.textContent, '00:00');
});

test('las claves especiales de los exámenes originales aceptan las alternativas marcadas y corregidas', () => {
    const source = fs.readFileSync('script.js', 'utf8');
    const context = { campo: (row, name) => row[name] };
    vm.runInNewContext(source.slice(source.indexOf('function simAcceptedAnswerIndices(q)'), source.indexOf('window.finalizarSimulacro')), context);
    const paper = require('../api/_past_exams/2025-2026-2.json');
    for (const number of [95, 97, 100]) {
        const indices = context.simAcceptedAnswerIndices(paper.questions.find(q => q.numero_original === number));
        assert.deepEqual(Array.from(indices), [0, 2]);
    }
    assert.deepEqual(Array.from(context.simAcceptedAnswerIndices({ respuesta_correcta: 'B' })), [1]);
    assert.deepEqual(Array.from(context.simAcceptedAnswerIndices({ respuesta_correcta: '3' })), [2]);
    const annulled = require('../api/_past_exams/2022-2023-3.json').questions.find(q => q.numero_original === 52);
    assert.deepEqual(Array.from(context.simAcceptedAnswerIndices(annulled)), [0, 1, 2, 3, 4]);
});

test('el servidor verifica la sesión y el plan antes de entregar preguntas o patrones', async () => {
    const handler = require('../api/past-exam.js');
    const originalFetch = global.fetch;
    function response() {
        return { headers: {}, code: 0, bytes: null, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, end(bytes) { this.bytes = bytes; } };
    }
    async function run(id, token = 'valid', pattern) {
        const res = response();
        await handler({ method: 'GET', query: { id, pattern }, headers: { authorization: token ? 'Bearer ' + token : '' } }, res);
        assert.equal(res.headers['Cache-Control'], 'private, no-store');
        return res;
    }
    try {
        global.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: false }) });
        assert.equal((await run('2021-1', '')).code, 401);
        assert.equal((await run('../resumen')).code, 404);
        assert.equal(catalog.freeYear, '2025–2026');
        for (const exam of catalog.exams) {
            const questionResponse = await run(exam.id);
            const patternResponse = await run(exam.id, 'valid', '1');
            const expected = exam.year === catalog.freeYear ? 200 : 403;
            assert.equal(questionResponse.code, expected, exam.id + ' questions');
            assert.equal(patternResponse.code, expected, exam.id + ' pattern');
            if (expected === 200) assert.equal(JSON.parse(questionResponse.bytes).questions.length, exam.count);
        }
        global.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: true }) });
        for (const exam of catalog.exams) {
            assert.equal((await run(exam.id)).code, 200);
            const pattern = await run(exam.id, 'valid', '1');
            assert.equal(pattern.code, 200); assert.equal(pattern.headers['Content-Type'], 'image/webp');
        }
        global.fetch = async () => { throw new Error('timeout'); };
        assert.equal((await run('2025-2026-2')).code, 503);
    } finally { global.fetch = originalFetch; }
});

test('la cuenta gratuita ve tres exámenes abiertos de la última gestión y doce con candado que llevan a planes', async () => {
    function element() {
        return { children: [], value: '', options: [{}], events: {}, className: '',
            append(...children) { this.children.push(...children); this.options.push(...children); },
            replaceChildren(...children) { this.children = children; },
            addEventListener(name, fn) { this.events[name] = fn; }, setAttribute() {}, removeAttribute() {} };
    }
    const elements = new Map();
    const get = id => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
    let free = true, planVisits = 0;
    const context = {
        window: { addEventListener() {} },
        document: { getElementById: get, createElement: element, createTextNode: text => ({ textContent: text }) },
        fetch: async () => ({ ok: true, json: async () => catalog }),
        CampusAccess: { isFree: () => free, unlock: () => { planVisits++; } },
        currentUser: { id: 'student' }, simState: { timerInterval: null },
        sessionStorage: { getItem: () => null }, showScreen() {},
        URL: { revokeObjectURL() {} }
    };
    vm.runInNewContext(fs.readFileSync('past-exams.js', 'utf8'), context);
    await context.window.openPastExams();
    const cards = get('past-grid').children;
    assert.equal(cards.length, 15);
    const locked = cards.filter(card => card.className.includes('past-card-locked'));
    assert.equal(locked.length, 12);
    assert.equal(locked[0].children[0].children[1].children[0].className, 'fas fa-lock');
    locked[0].children.at(-1).events.click();
    assert.equal(planVisits, 1);
    const latest = cards.filter(card => !card.className.includes('past-card-locked'));
    assert.equal(latest.length, 3);
    latest[0].children.at(-1).events.click();
    assert.match(get('past-detail-title').textContent, /2025–2026/);
    assert.equal(get('past-start').textContent, 'Comenzar examen');
    free = false;
    await context.window.openPastExams();
    assert.equal(get('past-grid').children.filter(card => card.className.includes('past-card-locked')).length, 0);
});
