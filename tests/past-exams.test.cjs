const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const catalog = require('../content/past-exams/catalog.json');
const thematicIndex = require('../api/_past_exams/topic-index.json');

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
        assert.equal(numbers.length + paper.missingNumbers.length + paper.excludedQuestions.length, 100);
        assert.equal('missingNumbers' in exam || 'excludedQuestions' in exam, false);
        assert.ok(fs.existsSync('api/_past_exams/' + exam.id + '-pattern.webp'));
        assert.equal(fs.existsSync('content/past-exams/' + exam.id + '.json'), false, 'paid questions must not be public static files');
        for (const q of paper.questions) {
            assert.ok(q.pregunta.trim());
            assert.ok(!q.pregunta.includes('\ufffd'));
            for (const key of q.respuestas_aceptadas) assert.ok(q['opcion_' + key.toLowerCase()]);
        }
    }
    const final = require('../api/_past_exams/2025-2026-3.json');
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
            if (expected === 200) {
                const paper = JSON.parse(questionResponse.bytes);
                assert.equal(paper.questions.length, exam.count);
                assert.equal(paper.type, exam.type);
                assert.equal('missingNumbers' in paper || 'excludedQuestions' in paper, false);
            }
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
        URL: { revokeObjectURL() {} }, AbortSignal
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
    assert.equal(elements.has('past-source-notes'), false);
    assert.doesNotMatch(JSON.stringify(cards), /observaciones del documento|en el Word original/i);
    free = false;
    await context.window.openPastExams();
    assert.equal(get('past-grid').children.filter(card => card.className.includes('past-card-locked')).length, 0);
});

test('el índice temático se alinea con la numeración histórica y las fuentes oficiales', () => {
    let tagged = 0;
    for (const exam of catalog.exams) {
        const indexed = thematicIndex.exams[exam.id];
        const paper = require('../api/_past_exams/' + exam.id + '.json');
        assert.equal(indexed.length, 100);
        assert.equal(indexed.filter(Boolean).length, paper.questions.length);
        for (const q of paper.questions) {
            const key = indexed[q.numero_original - 1];
            if (thematicIndex.topics[key]) tagged++;
            else assert.ok(thematicIndex.sources[key], q.id + ' debe mantener su materia');
        }
        for (const n of [...paper.missingNumbers, ...paper.excludedQuestions.map(q => q.numero_original)]) {
            assert.equal(indexed[n - 1], null);
        }
    }
    assert.equal(tagged, 1424);
    for (const topic of Object.values(thematicIndex.topics)) {
        assert.ok(thematicIndex.sources[topic.subject]);
        assert.ok(thematicIndex.sources[topic.source || topic.subject]);
        assert.ok(topic.section && topic.title && topic.pdfPage > 0);
        assert.ok(topic.printedPage === null || topic.printedPage > 0);
    }
    assert.equal(thematicIndex.exams['2025-2026-1'][0], 'morfo-10');
    assert.equal(thematicIndex.exams['2025-2026-3'][90], 'salud-16');
    assert.equal(thematicIndex.exams['2021-1'][89], 'salud');
    assert.equal(thematicIndex.topics['morfo-08'].pdfPage, 261);
    assert.equal(thematicIndex.topics['morfo-08'].printedPage, 233);
});

test('el desglose aplica filtros, conserva las claves originales y protege las preguntas de otras gestiones', async () => {
    const handler = require('../api/past-exam.js');
    const originalFetch = global.fetch;
    let premium = false;
    async function request(query, token = 'test') {
        const res = { headers: {}, setHeader(key, val) { this.headers[key] = val; },
            status(code) { this.code = code; return this; }, end(bytes) { this.body = bytes && JSON.parse(bytes); } };
        await handler({ method: 'GET', query: { id: 'desglose', ...query },
            headers: token ? { authorization: 'Bearer ' + token } : {} }, res);
        assert.equal(res.headers['Cache-Control'], 'private, no-store');
        return res;
    }
    try {
        global.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium }) });
        assert.equal((await request({}, '')).code, 401);
        const locked = (await request({ year: '2021', all: '1' })).body;
        assert.equal(locked.locked, true);
        assert.deepEqual(locked.questions, []);
        assert.deepEqual(locked.topics, []);
        const free = (await request({ all: '1', page: '2' })).body;
        assert.equal(free.available, 298);
        assert.equal(free.page, 2);
        assert.equal(free.questions.length, 24);
        assert.ok(free.questions.every(row => row.year === catalog.freeYear));
        const filtered = (await request({ year: catalog.freeYear, type: 'Primer parcial', subjects: 'morfo',
            topics: 'morfo-10', search: 'músculo geniogloso' })).body;
        assert.equal(filtered.count, 1);
        const original = require('../api/_past_exams/2025-2026-1.json').questions[0];
        assert.deepEqual(filtered.questions[0].question, original);
        assert.equal(filtered.questions[0].topic, 'morfo-10');
        premium = true;
        const available = (await request({})).body;
        assert.equal(available.available, 1491);
        assert.equal(available.requested, false);
        const unconfirmed = (await request({ unconfirmed: '1', page: '999' })).body;
        assert.equal(unconfirmed.count, 67);
        assert.equal(unconfirmed.page, unconfirmed.pages);
        assert.ok(unconfirmed.questions.every(row => !row.topic));
        const cross = (await request({ subjects: 'biologia', topics: 'biologia-19' })).body;
        assert.ok(cross.count > 10);
        assert.ok(cross.questions.every(row => row.subject === 'biologia' && row.topic === 'biologia-19'));
        assert.match(cross.topics.find(t => t.id === 'biologia-19').bibliography.credit, /Saladin/);
    } finally { global.fetch = originalFetch; }
});
