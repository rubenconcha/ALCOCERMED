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
            return {
                id: format.curatedId + '-' + number, numero_pregunta: n, numero_original: number,
                pregunta: 'Enunciado de prueba\n1. Primera\n2. Segunda' + (n <= 25 ? '\n3. Tercera' : ''),
                opcion_a: 'Primera', opcion_b: 'Segunda', opcion_c: 'Combinación', opcion_d: 'Otra',
                ...(n <= 25 ? { opcion_e: 'Ninguna' } : {}),
                respuesta_correcta: 'B', respuestas_aceptadas: ['B'], puntos: 1, materia: 'MORFOFUNCION'
            };
        })
    };
}

test('catalog lists 21 topic papers and the separate second-partial form without the private questions', () => {
    assert.equal(entries.length, 22);
    assert.equal(new Set(entries.map(entry => entry.curatedId)).size, 22);
    assert.equal(entries.filter(entry => entry.topics?.length).length, 21);
    assert.deepEqual(entries.filter(entry => entry.stage === 'second').map(entry => entry.curatedId), ['prepa-segundo-a']);
    assert.deepEqual(entries.filter(entry => entry.topics?.some(topic => topic.id === 'morfo-8')).map(entry => entry.curatedId), ['prepa-07-08', 'prepa-08-09']);
    assert.ok(entries.every(entry => entry.questionCount === 50 && entry.minutes === 50 && !entry.questions));
});

test('exam validator preserves the question numbering and both answer formats', () => {
    for (const format of entries) {
        const paper = fixture(format);
        assert.ok(validate(paper, 'prepa', format));
        assert.equal(paper.questions[25].numero_original, format.stage === 'second' ? 51 : 26);
        paper.questions[25].opcion_e = 'Opción de otra sección';
        assert.equal(validate(paper, 'prepa', format), false);
        delete paper.questions[25].opcion_e;
        paper.questions[25].numero_original++;
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
        assert.match(String(url), /\/simulacros\/preparatoria-v1\/prepa-01\.json$/);
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

