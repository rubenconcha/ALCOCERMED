const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../suficiencia-core.js');
const bank = require('../api/_sufficiency/bank.json');
const handler = require('../api/suficiencia.js');

test('800 questions, four areas and forty complete readings with page references', () => {
    assert.equal(C.validate(bank), true);
    assert.equal(bank.questions.length, 800);
    assert.deepEqual(Object.keys(C.subjects).map(s => bank.questions.filter(q => q.subject === s).length), [200, 200, 200, 200]);
    assert.equal(bank.passages.length, 40);
    assert.equal(bank.source.institution, 'UMSA');
    assert.equal(bank.source.originalPatternIncluded, false);
    for (const q of bank.questions) {
        assert.ok(!q.text.includes('según Saladin'));
        assert.ok(q.source.pdfPages.every(p => Number.isInteger(p) && p > 0));
        if (q.subject !== 'lectura') assert.ok(q.source.pdfPages.every(p => p <= 44));
    }
    for (const p of bank.passages) assert.equal(bank.questions.filter(q => q.passageId === p.id).length, 5);
});
test('every integral is balanced, unique and contains two complete readings', () => {
    const signatures = new Set();
    for (let seed = 1; seed <= 100; seed++) {
        const qs = C.select(bank, 'integral', seed);
        assert.equal(qs.length, 40);
        assert.equal(new Set(qs.map(q => q.id)).size, 40);
        for (const s of Object.keys(C.subjects)) assert.equal(qs.filter(q => q.subject === s).length, 10);
        const texts = [...new Set(qs.filter(q => q.passageId).map(q => q.passageId))];
        assert.equal(texts.length, 2);
        for (const id of texts) assert.equal(qs.filter(q => q.passageId === id).length, 5);
        signatures.add(qs.map(q => q.id).join(','));
    }
    assert.equal(signatures.size, 100);
    assert.deepEqual(C.select(bank, 'integral', 42), C.select(bank, 'integral', 42));
});
test('subject practice includes its entire bank; individual readings have five items', () => {
    for (const s of Object.keys(C.subjects)) {
        const selected = C.select(bank, s, 89);
        assert.equal(selected.length, bank.questions.filter(q => q.subject === s).length);
        assert.ok(selected.every(q => q.subject === s));
    }
    for (const p of bank.passages) assert.equal(C.select(bank, 'texto:' + p.id, 1).length, 5);
});
test('grading supports A–E, omitted answers and correct subject breakdowns', () => {
    const questions = C.select(bank, 'integral', 9), answers = {};
    for (const q of questions) answers[q.id] = q.correct;
    assert.equal(C.grade(questions, answers).percent, 100);
    assert.equal(C.grade(questions, {}).skipped, 40);
    assert.equal(C.grade([], {}).percent, 0);
    const fifth = bank.questions.find(q => q.correct === 4);
    assert.equal(C.grade([fifth], { [fifth.id]: 4 }).correct, 1);
    assert.equal(C.grade([fifth], { [fifth.id]: -1 }).skipped, 1);
    assert.equal(C.grade([fifth], { [fifth.id]: 8 }).skipped, 1);
    delete answers[questions[0].id]; answers[questions[1].id] = (questions[1].correct + 1) % questions[1].options.length;
    const result = C.grade(questions, answers);
    assert.deepEqual([result.correct, result.wrong, result.skipped, result.percent], [38, 1, 1, 95]);
    assert.equal(result.subjects.matematicas.correct, 8);
});
test('restore refuses another account, removed questions and old bank versions', () => {
    const saved = { owner: 'student-a', version: bank.version, ids: bank.questions.slice(0, 3).map(q => q.id), answers: {}, flags: [], index: 1, deadline: Date.now() + 60000 };
    assert.ok(C.restore(saved, bank, 'student-a'));
    assert.equal(C.restore(saved, bank, 'student-b'), null);
    assert.equal(C.restore({ ...saved, version: 0 }, bank, 'student-a'), null);
    assert.equal(C.restore({ ...saved, ids: ['missing'] }, bank, 'student-a'), null);
    assert.equal(C.restore({ ...saved, ids: [saved.ids[0], saved.ids[0]] }, bank, 'student-a'), null);
    assert.equal(C.restore({ ...saved, deadline: null }, bank, 'student-a'), null);
    const expired = C.restore({ ...saved, deadline: 1, index: 999, flags: ['missing'], answers: { [saved.ids[0]]: 999, [saved.ids[1]]: 0 } }, bank, 'student-a');
    assert.equal(expired.deadline, 1); // UI immediately finishes; no reset of the clock on reload.
    assert.equal(expired.index, 2);
    assert.deepEqual(expired.flags, []);
    assert.deepEqual(expired.answers, { [saved.ids[1]]: 0 });
});
test('reject duplicated answer options, invalid answer keys and missing reading passages', () => {
    for (const mutate of [b => { b.questions[0].correct = 8; }, b => { b.questions[0].options[1] = b.questions[0].options[0]; }, b => { b.questions[1].id = b.questions[0].id; }, b => { b.passages = []; }]) {
        const changed = structuredClone(bank); mutate(changed); assert.equal(C.validate(changed), false);
    }
});
test('independent numerical checks for repaired and representative source problems', () => {
    const answer = id => { const q = bank.questions.find(q => q.id === id); assert.ok(q, id); return q.options[q.correct]; };
    assert.equal(answer('abp-13-05'), String(30.5 * 8 - 210));
    assert.equal(answer('abp-31-40'), '26,28');
    assert.equal(8 * (8 / (6 / .12)) + (29 - 4), 26.28);
    assert.equal(answer('abp-26-38'), '−3/2');
    assert.equal(-1 * 6 / 4, -1.5);
    assert.equal(answer('abp-05-16'), (3 * (5 + 8) - 13) + ' km');
    assert.equal(answer('abp-21-30'), ((120 + 100) * .055).toFixed(1).replace('.', ',') + ' V');
    assert.equal(answer('abp-25-25'), (134400 / 22.4 / 3 * 160 / 1000 / 400 * 100) + ' %');
    assert.equal(answer('abp-36-57'), (250 / 22.4 / 2 * 30).toFixed(1).replace('.', ',') + ' g');
    assert.equal(answer('abp-43-43'), (100 * 294 / (3 * 254)).toFixed(1).replace('.', ',') + ' g');
    assert.equal(answer('abp-44-46'), (10 / 89 / 2 * 22.4).toFixed(2).replace('.', ',') + ' L');
    assert.equal(bank.questions.some(q => q.id === 'abp-17-25' || q.id === 'abp-17-30'), false);
    assert.equal(bank.questions.find(q => q.id === 'abp-35-46').source.kind, 'adaptada');
});
function response() { return { code: 0, body: '', headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, end(body = '') { this.body = body; return this; } }; }
test('private endpoint: anonymous, expired, non-premium and unavailable permissions cannot download bank', async () => {
    const originalFetch = global.fetch;
    try {
        let res = response(); await handler({ method: 'GET', headers: {}, query: {} }, res); assert.equal(res.code, 401); assert.equal(res.body, '');
        res = response(); await handler({ method: 'POST', headers: {}, query: {} }, res); assert.equal(res.code, 405);
        res = response(); await handler({ method: 'GET', headers: {}, query: { invalid: '1' } }, res); assert.equal(res.code, 404);
        for (const access of [{ ready: true, premium: false }, { ready: false, premium: true }, { ready: true, premium: true, expires_at: '2000-01-01' }]) {
            global.fetch = async () => ({ ok: true, json: async () => access });
            res = response(); await handler({ method: 'GET', headers: { authorization: 'Bearer test' }, query: {} }, res); assert.equal(res.code, 403); assert.equal(res.body, '');
        }
        global.fetch = async () => { throw new Error('offline'); };
        res = response(); await handler({ method: 'GET', headers: { authorization: 'Bearer test' }, query: {} }, res); assert.equal(res.code, 503); assert.equal(res.body, '');
        global.fetch = async () => ({ ok: false, status: 401 });
        res = response(); await handler({ method: 'GET', headers: { authorization: 'Bearer test' }, query: {} }, res); assert.equal(res.code, 401);
    } finally { global.fetch = originalFetch; }
});
test('active subscriber receives validated private bank, with bearer forwarded only to Supabase', async () => {
    const originalFetch = global.fetch;
    const originalCwd = process.cwd();
    try {
        process.chdir(path.join(__dirname, '..'));
        global.fetch = async (url, options) => {
            assert.equal(url, 'https://asnwhddmurstzmghuyin.supabase.co/rest/v1/rpc/campus_access');
            assert.equal(options.headers.Authorization, 'Bearer student-token');
            const payload = JSON.parse(Buffer.from(options.headers.apikey.split('.')[1], 'base64url').toString());
            assert.equal(payload.iss, 'supabase'); assert.equal(payload.role, 'anon');
            return { ok: true, json: async () => ({ ready: true, premium: true, expires_at: '2099-01-01' }) };
        };
        const res = response(); await handler({ method: 'GET', headers: { authorization: 'Bearer student-token' }, query: {} }, res);
        assert.equal(res.code, 200); assert.equal(JSON.parse(res.body).questions.length, 800);
        assert.equal(res.headers['Cache-Control'], 'private, no-store');
    } finally { global.fetch = originalFetch; process.chdir(originalCwd); }
});
test('sidebar and screen integration do not remove the original three-subject simulator', () => {
    const html = fs.readFileSync(path.join(__dirname, '../campus.html'), 'utf8');
    assert.ok(html.includes('onclick="Sufficiency.open(); return false;"'));
    assert.ok(html.includes('<span class="nav-label">simulacro</span>'));
    assert.ok(!html.includes('id="nav-suficiencia"'));
    assert.ok(!html.includes('data-sf-area='));
    assert.ok(html.includes('id="suficiencia-screen"')); assert.ok(html.includes('id="simulacro-screen"'));
    const config = require('../vercel.json');
    assert.ok(config.rewrites.some(r => r.source === '/api/_sufficiency/:path*' && r.destination === '/api/suficiencia?invalid=1'));
    assert.equal(config.functions['api/suficiencia.js'].includeFiles, 'api/_sufficiency/**');
    const sw = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
    assert.ok(sw.includes("url.pathname.startsWith('/api/')"));
    assert.ok(!sw.includes('_sufficiency/bank.json'));
});
test('student module finishes automatically at the absolute deadline and clears content on logout', async () => {
    const vm = require('node:vm');
    let now = 1700000000000, authCallback, topicOpens = 0;
    const handlers = {}, intervals = new Map(), storage = new Map();
    const root = { innerHTML: '', classList: { contains: () => false }, addEventListener: (type, fn) => { handlers[type] = fn; }, replaceChildren() { this.innerHTML = ''; }, scrollIntoView() {}, querySelector: () => null };
    let intervalId = 0;
    const context = {
        currentUser: { id: 'student-a' },
        document: { hidden: false, getElementById: id => id === 'nav-simulacro' ? { classList: { add() {}, remove() {} } } : root, querySelectorAll: () => [], addEventListener() {} },
        location: { search: '' }, URLSearchParams, Uint32Array, AbortSignal,
        crypto: { getRandomValues: arr => { arr[0] = 27; return arr; } },
        Date: class extends Date { static now() { return now; } },
        localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
        setInterval: fn => { intervals.set(++intervalId, fn); return intervalId; }, clearInterval: id => intervals.delete(id), setTimeout() {},
        showScreen: () => true, ensureSupabaseSdk: async () => {},
        fetch: async () => ({ ok: true, json: async () => structuredClone(bank) })
    };
    context.window = { SufficiencyCore: C, CampusAccess: { isFree: () => false }, openSimulacro: () => { topicOpens++; }, addEventListener() {} };
    context.getSupabase = () => ({ auth: { getSession: async () => ({ data: { session: { user: context.currentUser, access_token: 'fixture' } } }), onAuthStateChange: fn => { authCallback = fn; } } });
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../suficiencia.js'), 'utf8'), context);
    await context.window.Sufficiency.open('integral');
    const click = (action, area) => handlers.click({ target: { closest: () => ({ disabled: false, dataset: { sf: action, area } }) } });
    await click('topics');
    assert.equal(topicOpens, 1); // Original catalogue remains reachable without calling the new wrapper recursively.
    await click('run', 'simulacro:completo-01');
    assert.match(root.innerHTML, /Pregunta 1/);
    const saved = JSON.parse([...storage.values()][0]);
    assert.equal(saved.ids.length, 40); assert.equal(saved.deadline - now, 3600000);
    assert.equal(saved.questions, undefined); assert.equal(saved.correct, undefined);
    assert.ok(intervals.size > 0);
    now += 3600001;
    for (const fn of [...intervals.values()]) fn();
    assert.match(root.innerHTML, /Se terminó el tiempo/);
    assert.match(root.innerHTML, /40 sin responder/);
    assert.equal(intervals.size, 0);
    assert.equal(JSON.parse([...storage.values()][0]).finished, true);
    const completed = JSON.parse(storage.get('alcocermed:suficiencia:v1:student-a:papers'));
    assert.equal(completed['completo-01'].owner, 'student-a');
    assert.equal(completed['completo-01'].total, 40);
    authCallback('SIGNED_OUT', null); context.currentUser = null;
    assert.equal(root.innerHTML, '');
    context.currentUser = { id: 'student-b' };
    await context.window.Sufficiency.open('matematicas');
    assert.ok(!root.innerHTML.includes('Tu último resultado'));
    assert.ok(!root.innerHTML.includes('Tienes una práctica en curso'));
    context.window.CampusAccess.isFree = () => true;
    await context.window.openSimulacro();
    assert.equal(topicOpens, 2); // Free mini simulations from the previous catalogue remain accessible.
});

test('20 fixed complete papers and 40 subject papers cover the entire bank without repetition in either series', () => {
    assert.equal(bank.papers.length, 60);
    const lookup = new Map(bank.questions.map(q => [q.id, q]));
    const complete = bank.papers.filter(p => p.subject === 'integral');
    const subject = bank.papers.filter(p => p.subject !== 'integral');
    assert.equal(complete.length, 20); assert.equal(subject.length, 40);
    for (const p of bank.papers) {
        const selected = C.select(bank, 'simulacro:' + p.id, 1);
        assert.deepEqual(selected.map(q => q.id), C.select(bank, 'simulacro:' + p.id, 9981).map(q => q.id));
        assert.equal(selected.length, p.subject === 'integral' ? 40 : 20);
        assert.equal(p.minutes, p.subject === 'integral' ? 60 : 30);
        assert.equal(p.commented, true);
        for (const pid of new Set(selected.filter(q => q.passageId).map(q => q.passageId))) {
            assert.equal(selected.filter(q => q.passageId === pid).length, 5);
        }
        if (p.subject === 'integral') {
            for (const area of Object.keys(C.subjects)) assert.equal(selected.filter(q => q.subject === area).length, 10);
            for (const area of ['matematicas', 'fisica', 'quimica']) {
                assert.ok(new Set(selected.filter(q => q.subject === area).map(q => q.family || 'original:' + q.topic)).size >= 8);
            }
        } else assert.ok(selected.every(q => q.subject === p.subject));
    }
    for (const series of [complete, subject]) {
        const ids = series.flatMap(p => p.questionIds);
        assert.equal(ids.length, 800); assert.equal(new Set(ids).size, 800);
        assert.ok(ids.every(id => lookup.has(id)));
    }
    for (const area of Object.keys(C.subjects)) assert.equal(subject.filter(p => p.subject === area).length, 10);
});

test('new content is explicit practice with source anchors, not attributed to an original official paper', () => {
    const base = require('../api/_sufficiency/base-selection.json');
    const original = new Map(base.questions.map(q => [q.id, q]));
    for (const q of base.questions) {
        const { solution, ...unchanged } = bank.questions.find(row => row.id === q.id);
        assert.deepEqual(unchanged, q);
    }
    const variants = bank.questions.filter(q => q.source.kind === 'variante de práctica');
    assert.equal(variants.length, 508);
    for (const q of variants) {
        assert.equal(q.source.original, false);
        const parent = original.get(q.source.parentId); assert.ok(parent);
        assert.deepEqual(q.source.pdfPages, parent.source.pdfPages);
        assert.ok(q.explanation.length > 80);
        assert.ok(!/\b(?:NaN|Infinity|undefined|null)\b/.test([q.text, ...q.options, q.explanation].join(' ')));
    }
    assert.equal(new Set(bank.questions.filter(q => q.subject !== 'lectura').map(q => q.text)).size, 600);
    assert.equal(new Set(bank.passages.map(p => p.text)).size, 40);
    for (const p of bank.passages) {
        assert.ok(p.text.split(/\s+/).length >= 90);
        assert.equal(p.source.author, 'Kenneth S. Saladin');
        assert.deepEqual(p.source.printedPages, p.source.pdfPages.map(n => n - 28));
    }
    assert.equal(bank.statistics.newPractice, 678);
});

test('508 generated keys match the independent numerical and symbolic verification across 59 problem families', () => {
    const report = require('../api/_sufficiency/calculation-review.json');
    assert.equal(report.verified, 508);
    assert.equal(report.checks.length, 508);
    assert.equal(Object.keys(report.families).length, 59);
    for (const check of report.checks) {
        const q = bank.questions.find(q => q.id === check.id); assert.ok(q);
        assert.equal(check.verified, true);
        assert.equal(check.answer, q.options[q.correct]);
        assert.ok(check.expected.length > 0);
    }
});

test('paper integrity rejects split texts, unknown questions, repeated identifiers and invalid duration', () => {
    for (const mutate of [
        b => { b.papers[1].id = b.papers[0].id; },
        b => { b.papers[0].questionIds[0] = 'missing'; },
        b => { b.papers[0].minutes = -1; },
        b => { b.papers[20].subject = 'lectura'; },
        b => { b.papers[0].questionIds[31] = b.questions.find(q => q.subject === 'lectura' && !b.papers[0].questionIds.includes(q.id)).id; }
    ]) {
        const changed = structuredClone(bank); mutate(changed); assert.equal(C.validate(changed), false);
    }
    assert.throws(() => C.select(bank, 'simulacro:missing', 1), /no encontrado/);
});

test('all 800 questions have beginner lessons and the final answer agrees with the preserved key', () => {
    assert.equal(bank.teachingRevision, 1);
    assert.equal(bank.questions.length, 800);
    for (const q of bank.questions) {
        const s = q.solution;
        assert.equal(s.level, 'desde-cero', q.id);
        assert.equal(s.answer, q.options[q.correct], q.id);
        assert.ok(s.steps.length >= 4 && s.steps.length <= 12, q.id);
        for (const field of ['goal', 'basics', 'mistake', 'check']) assert.ok(s[field].length > 20, q.id + ':' + field);
        for (const row of s.steps) assert.ok(row.title.length > 5 && row.text.length > 10, q.id);
        assert.ok(!/\b(?:NaN|Infinity|undefined)\b|\{(?:a|b|c|value)\}/.test(JSON.stringify(s)), q.id);
        assert.match(C.solutionHtml(q), /<ol class="sf-steps">/);
    }
    // The private response stays below Vercel's response-size limit.
    assert.ok(Buffer.byteLength(JSON.stringify(bank)) < 4_000_000);
});

test('reading explanations cite exact evidence from the identified paragraph and keep negative questions negative', () => {
    const passages = new Map(bank.passages.map(p => [p.id, p]));
    for (const q of bank.questions.filter(q => q.subject === 'lectura')) {
        const quotes = q.solution.steps.filter(s => s.quote);
        assert.ok(quotes.length >= 1, q.id);
        for (const row of quotes) assert.ok(passages.get(q.passageId).text.split('\n\n')[row.paragraph - 1].includes(row.quote), q.id);
        if (q.topic === 'Idea principal') assert.deepEqual([...new Set(quotes.map(row => row.paragraph))], [1, 2]);
    }
    for (const id of ['lectura-hipotesis-5', 'lectura-homeostasis-3', 'lectura-ampliada-agua-3']) {
        const q = bank.questions.find(q => q.id === id);
        assert.match(q.solution.steps.at(-1).text, /rechazar|no se puede suponer/);
        assert.match(q.solution.check, /pregunta negativa/);
    }
});

test('worked examples expose unit conversions, intermediate arithmetic and sign changes', () => {
    const text = id => JSON.stringify(bank.questions.find(q => q.id === id).solution);
    for (const expected of ['144000', '3600', '40', '5', '6000']) assert.ok(text('abp-11-19').includes(expected));
    assert.match(text('abp-13-19'), /20\+15\+12/);
    assert.match(text('abp-13-19'), /47\/60/);
    assert.match(text('abp-41-30'), /−2bcyz.*positivo/);
    assert.match(text('abp-35-56'), /no son un redondeo exacto/);
    assert.match(text('abp-43-43'), /3\(d\+3\)−4d=5/);
    assert.match(text('abp-31-40'), /600\/12=50/);
});

test('a damaged lesson, mismatched answer or invented reading citation is rejected', () => {
    for (const mutate of [
        b => { delete b.questions[0].solution; },
        b => { b.questions[0].solution.steps = []; },
        b => { b.questions[0].solution.answer = 'incorrect key'; },
        b => { b.questions.find(q => q.subject === 'lectura').solution.steps.find(s => s.quote).quote = 'This is not in the text.'; },
        b => { b.questions.find(q => q.subject === 'lectura').solution.steps.find(s => s.quote).paragraph = 999; }
    ]) {
        const changed = structuredClone(bank); mutate(changed); assert.equal(C.validate(changed), false);
    }
});

test('lesson rendering escapes text, formulas and quotes and keeps the legacy fallback', () => {
    const q = structuredClone(bank.questions.find(q => q.subject === 'lectura'));
    q.solution.basics = '<img src=x onerror=alert(1)>';
    q.solution.steps[0].formula = '<script>alert(1)</script>';
    q.solution.steps[1].quote = '<iframe src=x></iframe>';
    const html = C.solutionHtml(q);
    assert.ok(!/<(?:img|script|iframe)\b/.test(html));
    assert.match(html, /&lt;img/); assert.match(html, /&lt;script/); assert.match(html, /&lt;iframe/);
    assert.match(C.solutionHtml({ explanation: '<img src=x>' }), /&lt;img/);
});
