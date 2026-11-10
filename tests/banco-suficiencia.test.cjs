const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../suficiencia-core.js');
const review = require('../question-review.js');
const base = require('../api/_sufficiency/bank.json');
const guides = require('../api/_sufficiency/umsa-2026.cjs');

const source = fs.readFileSync(require.resolve('../script.js'), 'utf8');
const banco = source.slice(source.indexOf('let bancoState ='), source.indexOf('var simState ='));
const bank = { ...base, questions: base.questions.concat(guides) };
const existing = [{ id: 7, MATERIA: 'MORFOFUNCION', TEMA: 'el sistema oseo', DIFICULTAD: 'facil' }];
const course = { groups: [{ materia: 'MORFOFUNCION', tema: 'el sistema oseo', dificultad: 'facil', ids: ['lib:-7'] }] };

function fixture() {
    const nodes = new Map();
    const listeners = new Map();
    const element = () => ({
        textContent: '', dataset: {}, children: [], classList: { add() {}, remove() {}, toggle() {} },
        setAttribute(k, value) { this[k] = value; },
        removeAttribute(k) { delete this[k]; },
        appendChild(child) { this.children.push(child); },
        replaceChildren() { this.children = []; },
    });
    let free = false;
    const requests = [];
    const context = {
        document: {
            addEventListener() {}, createElement: element,
            getElementById(id) {
                if (!nodes.has(id)) nodes.set(id, element());
                return nodes.get(id);
            },
        },
        addEventListener(name, listener) { listeners.set(name, listener); },
        currentUser: { id: 'student-fixture' },
        SufficiencyCore: core,
        CampusAccess: { isFree: () => free },
        getSupabase: () => ({
            auth: { getSession: async () => ({
                data: { session: { user: { id: 'student-fixture' }, access_token: 'fixture-token' } },
            }) },
        }),
        fetch: async (url, config) => {
            requests.push({ url, config });
            return { ok: true, json: async () => url === '/api/banco' ? course : bank };
        },
        fetchAllBancoQuestions: async () => existing,
        freePracticeRows: () => existing,
        campo: (row, key) => row[key] ?? row[key.toUpperCase()],
        shuffleArray: rows => rows.slice().reverse(),
        console, AbortSignal,
    };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(banco + '\nbancoState._cache = fixtureRows; globalThis.state = bancoState;', Object.assign(context, { fixtureRows: existing }));
    return {
        context, state: context.state, requests,
        setFree() { free = true; listeners.get('campus-access-change')(); },
    };
}

test('uses all four existing Sufficiency subjects with topics, levels, five options and explanations', async () => {
    const { context, state, requests } = fixture();
    await context.loadBancoMaterias();
    assert.equal(requests.length, 2);
    const sufficiency = requests.find(r => r.url === '/api/suficiencia?collection=umsa-2026');
    assert.equal(sufficiency.config.headers.Authorization, 'Bearer fixture-token');
    assert.equal(sufficiency.config.cache, 'no-store');
    const menu = context.document.getElementById('banco-materia-dropdown');
    assert.deepEqual(menu.children.map(g => g['aria-label']), ['Materias de Medicina', 'Suficiencia académica']);
    const counts = Object.fromEntries(Object.values(core.subjects).map(subject => [subject, context.bancoMateriaRows(subject).length]));
    assert.deepEqual(counts, { 'Matemáticas': 274, 'Física': 272, 'Química': 272, 'Lectura comprensiva': 200 });
    assert.equal(state._cache, existing);
    const q = state.suficiencia.find(q => q.guiaUmsa && q.dificultad === 'medio');
    assert.ok(q);
    assert.equal(q.fuente, undefined);
    assert.match(q.justificacion, /\n\n1\. /);
    state.selectedMateria = q.materia;
    state.selectedTema = q.tema;
    state.selectedDificultad = q.dificultad;
    await context.loadBancoPreguntas();
    assert.ok(state.allPreguntas.includes(q));
    assert.ok(state.allPreguntas.every(r => r.tema === q.tema && r.dificultad === 'medio'));
    const fifth = state.suficiencia.find(q => q.respuesta_correcta === 'E');
    assert.ok(fifth.opcion_e);
    assert.equal(context.bancoClave(fifth), 4);
    const recorded = review.snapshot([fifth], [{ selected: 4 }], context.campo, q => [context.bancoClave(q)]);
    assert.equal(review.inspect(recorded)[0].status, 'correct');
    assert.equal(recorded.items[0].id, fifth.content_id);
    assert.equal(recorded.items[0].options.length, 5);
});

test('reading keeps full passages and freezes the passage with the submitted answer', async () => {
    const { context } = fixture();
    await context.loadBancoMaterias();
    const pool = context.bancoMateriaRows('Lectura comprensiva');
    const attempt = context.sampleBancoQuestions(pool);
    assert.equal(attempt.length, 50);
    for (let i = 0; i < attempt.length; i += 5) {
        const passage = attempt[i].passage;
        assert.ok(passage.text.length > 100);
        assert.deepEqual(Array.from(attempt.slice(i, i + 5)), Array.from(pool.filter(q => q.passage === passage)));
    }
    const recorded = review.snapshot([attempt[0]], [], context.campo, q => [context.bancoClave(q)]);
    assert.equal(recorded.items[0].passage, attempt[0].passage.text);
});

test('free and expired access cannot keep private Sufficiency questions; the course stays usable', async () => {
    const { context, state, requests, setFree } = fixture();
    context.fetch = async url => url === '/api/banco' ? { ok: true, json: async () => course } : { ok: false, status: 403 };
    await context.loadBancoMaterias();
    assert.equal(state.suficiencia.length, 0);
    assert.equal(context.bancoMateriaRows('MORFOFUNCION').length, 1);
    assert.match(context.document.getElementById('banco-materia-dropdown').children.at(-1).textContent, /cargar Suficiencia/);
    let resolve, requestStarted;
    const started = new Promise(ready => { requestStarted = ready; });
    context.fetch = () => new Promise(resolveRequest => { resolve = resolveRequest; requestStarted(); });
    const pending = context.loadBancoMaterias();
    await started;
    setFree();
    resolve({ ok: true, json: async () => bank });
    await pending;
    assert.equal(state.suficiencia.length, 0);
    context.fetch = async url => {
        requests.push(url);
        assert.equal(url, '/api/banco');
        return { ok: true, json: async () => course };
    };
    await context.loadBancoMaterias();
    assert.deepEqual(requests, ['/api/banco']);
    assert.equal(context.bancoMateriaRows('MORFOFUNCION').length, 1);
});
