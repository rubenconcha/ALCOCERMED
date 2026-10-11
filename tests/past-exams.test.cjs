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
        const sample = await run('2021-1');
        assert.equal(sample.code, 200); assert.equal(JSON.parse(sample.bytes).questions.length, 100);
        assert.equal((await run('2025-2026-2')).code, 403);
        assert.equal((await run('2025-2026-2', 'valid', '1')).code, 403);
        global.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: true }) });
        assert.equal((await run('2025-2026-3')).code, 200);
        const pattern = await run('2025-2026-2', 'valid', '1');
        assert.equal(pattern.code, 200); assert.equal(pattern.headers['Content-Type'], 'image/webp');
        global.fetch = async () => { throw new Error('timeout'); };
        assert.equal((await run('2025-2026-2')).code, 503);
    } finally { global.fetch = originalFetch; }
});
