const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../suficiencia-core.js');
const results = require('../student-results.js');
const base = require('../api/_sufficiency/bank.json');
const official = require('../api/_sufficiency/umsa-2026.cjs');
const baseMedical = require('../api/_sufficiency/medicina-oficial.json');
const reviewed = require('../api/_sufficiency/articulaciones-examen.json');
const additional = require('../api/_sufficiency/medicina-preguntas-por-tema.json');
const medical = { ...baseMedical, questions: baseMedical.questions.concat(reviewed, additional) };
const topics = require('../content/topic-evaluations/catalog.json').exams;
const endpoint = require('../api/suficiencia.js');

const bank = { ...base, questions: base.questions.concat(official, medical.questions) };

test('every Medicine topic offers all three levels with official, identifiable references', () => {
    assert.equal(medical.collection, C.biomedicalCollection);
    assert.equal(baseMedical.questions.length, 680);
    assert.equal(reviewed.length, 12);
    assert.equal(new Set(medical.questions.map(q => q.id)).size, medical.questions.length);
    const difficultCounts = new Map([
        ['morfo-01', 20], ['morfo-08', 17], ['morfo-09', 18], ['biologia-01', 22],
    ]);
    assert.equal(C.validate(bank), true);
    const subjects = [
        ['morfofuncion', 'morfo-', 'Kenneth S. Saladin', 29, 1251],
        ['biologia-celular', 'biologia-', 'Alfonso Calvo González', 18, 829],
        ['educacion-salud', 'salud-', 'UMSS', 21, 232],
    ];
    for (const [subject, prefix, title, count, pdfSize] of subjects) {
        const expected = topics.filter(t => t.id.startsWith(prefix));
        assert.equal(expected.length, count);
        assert.deepEqual(C.topics(bank, subject).map(t => t.key), expected.map(t => t.id));
        for (const topic of expected) {
            const configuration = { subject, topic: topic.id, level: 'todos' };
            const hard = difficultCounts.get(topic.id) ?? 6;
            assert.equal(C.configurationCount(bank, configuration), Math.min(hard + 8, 20));
            assert.equal(C.selectConfiguration(bank, { ...configuration, level: 'dificil' }, 44).length, Math.min(hard, 20));
            for (const [level, size] of [['facil', 4], ['intermedio', 4], ['dificil', hard]]) {
                const rows = C.configurationPool(bank, { ...configuration, level });
                assert.equal(rows.length, size);
                for (const q of rows) {
                    assert.ok(C.isBiomedical(q));
                    assert.equal(q.subject, subject);
                    assert.equal(q.topic, topic.title);
                    assert.equal(q.difficulty, level);
                    assert.equal(new Set(q.options).size, q.options.length);
                    assert.ok(q.source.document.startsWith(title));
                    assert.ok(q.source.pdfPages.every(page => page <= pdfSize));
                    assert.equal(q.source.printedPages.length === 0, subject === 'biologia-celular');
                    if (level === 'dificil') {
                        const triple = q.truth_values.length === 3;
                        assert.match(q.text, /^Señala cuáles.+\n1\. .+\n2\. .+(?:\n3\. .+)?$/);
                        assert.equal(q.text.split('\n').length, triple ? 4 : 3);
                        const reasons = q.explanation.split('\n');
                        assert.equal(reasons.length, q.truth_values.length);
                        reasons.forEach((reason, i) => {
                            const label = q.truth_values[i] ? 'Correcta' : 'Incorrecta';
                            assert.ok(reason.startsWith((i + 1) + '. ' + label + '. '));
                        });
                        assert.deepEqual(q.options, [
                            'Solo la afirmación 1 es correcta', 'Solo la afirmación 2 es correcta',
                            ...(triple ? ['Solo la afirmación 3 es correcta', 'Todas las afirmaciones son correctas']
                                : ['Ambas afirmaciones son correctas']),
                            'Ninguna afirmación es correcta',
                        ]);
                        const keys = triple ? ['100', '010', '001', '111', '000'] : ['10', '01', '11', '00'];
                        assert.equal(q.correct, keys.indexOf(q.truth_values.map(Number).join('')));
                        assert.deepEqual(Object.keys(q.comentarios_opciones), [...'ABCDE'.slice(0, keys.length)]);
                        if (q.id.includes('-ampliacion-')) {
                            assert.equal(q.source.statements.length, q.truth_values.length);
                            for (const reference of q.source.statements) {
                                assert.ok(reference.anchor || reference.cardId);
                                assert.ok(reference.section);
                                assert.ok(q.source.pdfPages.includes(reference.pdfPage));
                                if (subject !== 'biologia-celular') assert.ok(q.source.printedPages.includes(reference.printedPage));
                            }
                        }
                        assert.ok(q.id.endsWith('-umss'));
                    }
                }
            }
        }
        const random = C.selectConfiguration(bank, { subject, topic: '*', level: 'todos' }, 42);
        assert.equal(random.length, 20);
        assert.ok(random.every(q => q.subject === subject));
    }
});

test('Medicine practice grades, restores its filters and freezes a citable review', () => {
    const configuration = { subject: 'morfofuncion', topic: 'morfo-08', level: 'dificil' };
    const rows = C.selectConfiguration(bank, configuration, 77);
    const savedRows = rows.filter(q => baseMedical.questions.some(original => original.id === q.id));
    assert.equal(rows.length, 17);
    assert.equal(savedRows.length, 2);
    const answers = { [rows[0].id]: rows[0].correct };
    const owner = 'fixture';
    const attempt = {
        version: bank.version, area: 'config', owner, configuration, ids: rows.map(q => q.id),
        answers, deadline: Date.now() + 300_000, finishedAt: Date.now(),
    };
    assert.deepEqual(C.restore(attempt, bank, owner).answers, answers);
    assert.equal(C.restore(attempt, bank, 'other'), null);
    assert.deepEqual(C.restore({ ...attempt, ids: savedRows.map(q => q.id), answers: {} }, bank, owner).ids,
        savedRows.map(q => q.id));
    const oldIds = attempt.ids.map(id => id.replace(/-umss$/, ''));
    assert.equal(C.restore({ ...attempt, ids: oldIds }, bank, owner), null);
    assert.equal(C.restore({ ...attempt, configuration: { ...configuration, level: 'facil' } }, bank, owner), null);
    assert.deepEqual(C.grade(rows, answers), {
        correct: 1, wrong: 0, skipped: 16, total: 17, percent: 6,
        subjects: { morfofuncion: { correct: 1, wrong: 0, skipped: 16, total: 17 } },
    });
    const snapshot = results.freezeSufficiency(rows, attempt, bank, C, 'Simulacro de Medicina');
    const item = snapshot.question_review.items[0];
    assert.equal(item.materia, 'Morfofunción');
    assert.match(item.source, /Saladin.+Tema 8.+pág\. impresa.+pág\. PDF/);
    assert.equal(item.explanation, rows[0].explanation);
    assert.deepEqual(C.selectConfiguration(bank, { subject: 'integral', topic: '*', level: 'todos' }, 19),
        C.selectConfiguration(base, { subject: 'integral', topic: '*', level: 'todos' }, 19));
});

test('Medicine API is private and only returns the new collection to active accounts', async t => {
    const request = async (query, authorization, ids) => {
        const res = {
            headers: {}, code: 0, body: '',
            setHeader(name, value) { this.headers[name] = value; },
            status(code) { this.code = code; return this; },
            end(body = '') { this.body = body; },
        };
        await endpoint({ method: ids ? 'POST' : 'GET', headers: { authorization }, query, body: ids && { ids } }, res);
        return res;
    };
    const query = { collection: C.biomedicalCollection };
    let premium = false;
    t.mock.method(global, 'fetch', async () => ({ ok: true, json: async () => ({ ready: true, premium }) }));
    assert.equal((await request(query)).code, 401);
    assert.equal((await request({ ...query, invalid: '1' }, 'Bearer fixture')).code, 404);
    assert.equal((await request(query, 'Bearer fixture')).code, 403);
    const catalogueQuery = { collection: C.officialCollection, vista: 'catalogo' };
    assert.equal((await request(catalogueQuery, 'Bearer fixture')).code, 403);
    premium = true;
    const res = await request(query, 'Bearer fixture');
    assert.equal(res.code, 200);
    assert.equal(res.headers['Cache-Control'], 'private, no-store');
    assert.deepEqual(JSON.parse(res.body), medical);

    const indexResponse = await request(catalogueQuery, 'Bearer fixture');
    assert.equal(indexResponse.code, 200);
    assert.equal(indexResponse.headers['Cache-Control'], 'private, no-store');
    const index = JSON.parse(indexResponse.body);
    assert.ok(index.questions.every(q => q.optionCount > 1 && !q.options && !q.text && !q.solution));
    assert.ok(index.questions.some(C.isBiomedical));
    const reading = index.questions.find(q => q.passageId);
    const expanded = additional.find(q => q.source.topicId === 'morfo-01' && q.options.length === 5);
    assert.ok(expanded);
    assert.equal(index.questions.find(q => q.id === expanded.id).optionCount, 5);
    const ids = [expanded.id, reading.id];
    const packQuery = { ...catalogueQuery, vista: 'preguntas' };
    assert.equal((await request(packQuery, undefined, ids)).code, 401);
    assert.equal((await request(packQuery, 'Bearer fixture', [reading.id, reading.id])).code, 400);
    const pack = JSON.parse((await request(packQuery, 'Bearer fixture', ids)).body);
    assert.deepEqual(pack.questions.map(q => q.id), ids);
    assert.deepEqual(pack.questions[0], expanded);
    assert.deepEqual(pack.passages.map(p => p.id), [reading.passageId]);
    assert.ok(pack.passages[0].text.length);
});
