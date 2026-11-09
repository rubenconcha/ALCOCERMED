'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validate } = require('../simulation-scope.js');
const handler = require('../api/simulation.js');
const entries = require('../content/simulacros-catalog.json').entries.filter(entry => entry.scope === 'prepa');

function fixture(format) {
    return {
        id: format.curatedId, scope: 'prepa', title: format.title, duration: format.minutes, total_points: format.questionCount,
        questions: Array.from({ length: format.questionCount }, (_, index) => {
            const n = index + 1;
            const number = format.stage === 'second' && n > 25 ? n + 25 : n;
            const source = {'prepa-07':'prepa-07-08', 'prepa-08':'prepa-08-09', 'prepa-09':'prepa-08-09'}[format.curatedId] || format.curatedId;
            return {
                id: source + '-' + number, numero_pregunta: n, numero_original: number,
                ...(format.regrouped ? { source_numero_original: number, tema: format.title } : {}),
                pregunta: 'Enunciado de prueba\n1. Primera\n2. Segunda' + (n <= 25 ? '\n3. Tercera' : ''),
                opcion_a: 'Primera', opcion_b: 'Segunda', opcion_c: 'Combinación', opcion_d: 'Otra',
                ...(n <= 25 ? { opcion_e: 'Ninguna' } : {}),
                respuesta_correcta: 'B', respuestas_aceptadas: ['B'], puntos: 1, materia: 'MORFOFUNCION',
                revision_docente: {
                    concepto: 'Concepto de ejemplo',
                    afirmaciones: Array.from({ length: n <= 25 ? 3 : 2 }, () => ({
                        estado: 'correcta', comentario: 'Fundamento de ejemplo', pagina: 72
                    })),
                    repaso: [{ tema: 'Lectura de ejemplo', pagina: 72, impresa: 44 }]
                }
            };
        })
    };
}

test('catalog gives each chapter its own exam and retains all 1,100 questions in private storage', () => {
    assert.equal(entries.length, 23);
    assert.equal(new Set(entries.map(entry => entry.curatedId)).size, 23);
    assert.equal(entries.filter(entry => entry.topics?.length === 1).length, 22);
    assert.deepEqual(entries.filter(entry => entry.stage === 'second').map(entry => entry.curatedId), ['prepa-segundo-a']);
    assert.deepEqual(entries.filter(entry => entry.regrouped).map(entry => [entry.topics[0].id,entry.questionCount]),
        [['morfo-6',39],['morfo-7',41],['morfo-8',49],['morfo-9',21]]);
    assert.ok(entries.every(entry => entry.questionCount === entry.minutes && !entry.questions));
    assert.equal(entries.reduce((sum, entry) => sum + entry.questionCount, 0), 1100);
});

test('exam validator preserves the question numbering and both answer formats', () => {
    for (const format of entries) {
        const paper = fixture(format);
        assert.ok(validate(paper, 'prepa', format));
        const index = Math.min(25, paper.questions.length - 1);
        const item = paper.questions[index];
        assert.equal(item.numero_original, format.stage === 'second' ? 51 : index + 1);
        const optionE = item.opcion_e;
        item.opcion_e = optionE ? '' : 'Opción de otra sección';
        assert.equal(validate(paper, 'prepa', format), false);
        item.opcion_e = optionE;
        item.numero_original++;
        assert.equal(validate(paper, 'prepa', format), false);
        item.numero_original--;
        item.revision_docente.repaso[0].impresa = 72;
        assert.equal(validate(paper, 'prepa', format), false);
        item.revision_docente.repaso[0].impresa = 44;
        item.revision_docente.afirmaciones.pop();
        assert.equal(validate(paper, 'prepa', format), false);
    }
});

test('the private paper is requested only after the campus authorizes paid access', async t => {
    const format = entries[0];
    const secret = process.env.BLOB_READ_WRITE_TOKEN;
    process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';
    t.after(() => {
        if (secret === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
        else process.env.BLOB_READ_WRITE_TOKEN = secret;
    });
    let reads = 0;
    const fetchMock = t.mock.method(globalThis, 'fetch', async (url, init) => {
        if (String(url).endsWith('/rpc/campus_access')) {
            return Response.json({ ready: true, premium: init.headers.Authorization === 'Bearer paid' });
        }
        assert.match(String(url), /\/simulacros\/preparatoria-v3\/prepa-01\.json$/);
        assert.equal(init.headers.Authorization, 'Bearer test-blob-token');
        reads++;
        return Response.json(fixture(format));
    });

    async function call(token) {
        const res = {
            headers: {},
            setHeader(key, value) { this.headers[key] = value; },
            status(status) { this.code = status; return this; },
            end(body) { this.body = body; }
        };
        await handler({
            method: 'GET', query: { id: format.curatedId },
            headers: token ? { authorization: 'Bearer ' + token } : {}
        }, res);
        return res;
    }

    assert.equal((await call()).code, 401);
    assert.equal(fetchMock.mock.callCount(), 0);
    assert.equal((await call('free')).code, 403);
    assert.equal(reads, 0);
    const paid = await call('paid');
    assert.equal(paid.code, 200);
    assert.equal(paid.headers['Cache-Control'], 'private, no-store');
    assert.equal(JSON.parse(paid.body).questions.length, 50);
    assert.equal(reads, 1);
});

