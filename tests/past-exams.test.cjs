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

test('cada pregunta histórica tiene un comentario y las referencias distinguen los folios', () => {
    const comments = require('../api/_past_exams/commentaries.json');
    const withCommentary = require('../api/_past_exams/commentaries.cjs');
    const validBooks = { M: 1251, B: 829, S: 232 };
    const readerSlugs = { M: 'morfofuncion', B: 'biologia-celular', S: 'educacion-salud' };
    const questions = catalog.exams.flatMap(exam => require('../api/_past_exams/' + exam.id + '.json').questions);
    assert.deepEqual(Object.keys(comments).sort(), questions.map(question => question.id).sort());
    for (const question of questions) {
        const { text, status, references } = comments[question.id];
        assert.ok(text.length >= 58, question.id);
        assert.doesNotMatch(text, /Respuesta según el patrón original|\ufffd/i, question.id);
        assert.ok(['v', 'p', 'd', 'l'].includes(status), question.id);
        assert.equal(references.length > 0, status !== 'l', question.id);
        for (const reference of references) {
            assert.ok(Number.isInteger(reference.pdf) && reference.pdf >= 1 && reference.pdf <= validBooks[reference.book], question.id);
            assert.ok(reference.section?.trim(), question.id);
            assert.ok(reference.printed === null || Number.isInteger(reference.printed) && reference.printed > 0, question.id);
        }
        const enriched = withCommentary(question);
        assert.equal(enriched.justificacion, text, question.id);
        assert.equal(enriched.lectura_revision, 3);
        const readings = enriched.lecturas_comentario || [];
        assert.equal(readings.length > 0, references.length > 0, question.id);
        for (const { slug, section, page, printed, marks } of readings) {
            assert.ok(references.some(ref => readerSlugs[ref.book] === slug && ref.section === section &&
                ref.pdf === page && ref.printed === printed), question.id);
            assert.ok(marks?.length, question.id);
            for (const [x, y, w, h] of marks) {
                assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.0001 && y + h <= 1.0001, question.id);
            }
        }
        assert.deepEqual(enriched.respuestas_aceptadas, question.respuestas_aceptadas, question.id);
        assert.equal(Boolean(enriched.clave_en_discrepancia), status === 'd', question.id);
    }
    const blood = withCommentary(questions.find(question => question.id === '2025-2026-2-5'));
    assert.match(blood.justificacion, /albúmina.*pequeña.*globulinas/i);
    assert.match(blood.fuente_comentario, /Saladin.*pág\. impresa 681.*pág\. PDF 709/);
    const elements = withCommentary(questions.find(question => question.id === '2025-2026-1-2'));
    const [{ marks, ...elementCitation }] = elements.lecturas_comentario;
    assert.deepEqual(elementCitation, {
        slug: 'morfofuncion', label: 'Saladin', section: 'Cuadro 2.1 · Elementos del cuerpo humano', page: 72, printed: 44,
    });
    assert.equal(marks.length, 3);
    const capsule = withCommentary(questions.find(question => question.id === '2025-2026-1-29'));
    assert.deepEqual(capsule.lecturas_comentario.map(ref => ref.page), [42, 43]);
    const angiotensin = withCommentary(questions.find(question => question.id === '2021-1-1'));
    assert.deepEqual(angiotensin.lecturas_comentario.map(ref => [ref.page, ref.printed]), [[670, 642], [937, 909]]);
    assert.match(angiotensin.justificacion, /hipotálamo.*\n.*angiotensina II.*sed.*vasoconstricción/);
});

test('el cronómetro de exámenes pasados permite responder después de 100 minutos y conserva el cierre de simulacros', () => {
    const source = fs.readFileSync('campus-exam-engine.js', 'utf8');
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
    vm.runInNewContext(source.slice(source.indexOf('function simAcceptedAnswerIndices(q)'), source.indexOf('function guardarEnHistorial')), context);
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
    assert.equal(tagged, 1490);
    for (const topic of Object.values(thematicIndex.topics)) {
        assert.ok(thematicIndex.sources[topic.subject]);
        assert.ok(thematicIndex.sources[topic.source || topic.subject]);
        assert.ok(topic.section && topic.title && (topic.pdfPage === null || topic.pdfPage > 0));
        assert.ok(topic.printedPage === null || topic.printedPage > 0);
    }
    assert.equal(thematicIndex.exams['2025-2026-1'][0], 'morfo-10');
    assert.equal(thematicIndex.exams['2025-2026-3'][90], 'salud-16');
    assert.equal(thematicIndex.exams['2021-1'][89], 'salud-30');
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
        const { justificacion, fuente_comentario, lecturas_comentario, lectura_revision, ...originalFields } = filtered.questions[0].question;
        assert.equal(lectura_revision, 3);
        assert.equal(lecturas_comentario[0].slug, 'morfofuncion');
        assert.deepEqual(originalFields, original);
        assert.match(justificacion, /geniogloso/i);
        assert.match(fuente_comentario, /Saladin.*Cap.tulo 10/i);
        assert.equal(filtered.questions[0].topic, 'morfo-10');
        const studyTopic = { subjects: 'morfo', topics: 'morfo-18' };
        const freeBlood = (await request(studyTopic)).body;
        assert.equal(freeBlood.count, 8);
        assert.ok(freeBlood.questions.every(row => row.topic === 'morfo-18' && row.year === catalog.freeYear));
        premium = true;
        const blood = (await request(studyTopic)).body;
        assert.equal(blood.count, 45);
        assert.ok(blood.questions.every(row => row.topic === 'morfo-18'));
        const barrier = { search: 'barrera hematoencefálica', subjects: 'morfo' };
        const nervousTissue = (await request({ ...barrier, topics: 'morfo-12' })).body;
        assert.equal(nervousTissue.count, 0);
        const brain = (await request({ ...barrier, topics: 'morfo-14' })).body;
        const bloodBrain = brain.questions.find(row => row.question.id === '2024-2025-3-8');
        assert.ok(bloodBrain);
        assert.deepEqual(bloodBrain.question.lecturas_comentario.map(ref => [ref.page, ref.printed]), [[549, 521]]);
        assert.match(bloodBrain.question.justificacion, /endoteliales.*\n.*ependimarias/);
        const hormonal = (await request({ topics: 'morfo-17', search: 'angiotensina II neurohipófisis' })).body;
        assert.deepEqual(hormonal.questions.map(row => row.question.id), ['2021-1-1']);
        const spineFilter = { subjects: 'morfo', topics: 'morfo-13' };
        const spineFirst = (await request(spineFilter)).body;
        const spineLast = (await request({ ...spineFilter, page: '2' })).body;
        const spine = [...spineFirst.questions, ...spineLast.questions];
        assert.equal(spineFirst.count, 41);
        assert.equal(spine.length, 41);
        const spinalQuestions = new Map(spine.map(row => [row.question.id, row.question]));
        assert.ok(spine.every(row => row.topic === 'morfo-13' && row.question.lecturas_comentario.length &&
            row.question.lecturas_comentario.every(ref => ref.slug === 'morfofuncion' && ref.marks.length)));
        assert.deepEqual(spinalQuestions.get('2022-2023-1-52').respuestas_aceptadas, ['E']);
        assert.equal(spinalQuestions.get('2022-2023-1-52').clave_en_discrepancia, true);
        assert.equal(spinalQuestions.get('2024-2025-3-73').clave_en_discrepancia, true);
        assert.deepEqual(spinalQuestions.get('2024-2025-3-24').lecturas_comentario.map(ref => ref.page), [532, 533]);
        assert.deepEqual(spinalQuestions.get('2024-2025-1-64').lecturas_comentario.map(ref => ref.page), [535]);
        assert.match(spinalQuestions.get('2025-2026-1-62').justificacion, /axilar.*deltoides y el redondo menor/);
        assert.equal(spinalQuestions.has('2021-1-27'), false);
        const emptyTopic = (await request({ subjects: 'salud', topics: 'salud-03' })).body;
        assert.equal(emptyTopic.count, 0);
        assert.deepEqual(emptyTopic.questions, []);
        assert.equal(emptyTopic.topics.find(topic => topic.id === 'salud-03')?.count, 0);

        const available = (await request({})).body;
        assert.equal(available.available, 1491);
        assert.equal(available.requested, false);
        const unconfirmed = (await request({ unconfirmed: '1', page: '999' })).body;
        assert.equal(unconfirmed.count, 1);
        assert.equal(unconfirmed.page, unconfirmed.pages);
        assert.ok(unconfirmed.questions.every(row => !row.topic));
        const cross = (await request({ subjects: 'biologia', topics: 'biologia-19' })).body;
        assert.ok(cross.count > 10);
        assert.ok(cross.questions.every(row => row.subject === 'biologia' && row.topic === 'biologia-19'));
        assert.match(cross.topics.find(t => t.id === 'biologia-19').bibliography.credit, /Saladin/);
    } finally { global.fetch = originalFetch; }
});
