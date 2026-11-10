'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/banco.js');
const { questions, sample } = require('../api/_banco/curso.json');

test('the Medicine catalogue is scoped, omits answers, and fetches only selected approved rows', async t => {
    const requests = [];
    let access = { ready: true, premium: true };
    const originalFetch = global.fetch;
    t.after(() => { global.fetch = originalFetch; });
    global.fetch = async (input, { headers }) => {
        assert.equal(headers.Authorization, 'Bearer test-token');
        requests.push(new URL(input).pathname);
        return { ok: true, json: async () => access };
    };

    async function request(method, ids, authorization = 'Bearer test-token') {
        const response = {
            headers: {}, statusCode: 0,
            setHeader(key, value) { this.headers[key] = value; },
            status(value) { this.statusCode = value; return this; },
            end(body) { this.data = body && JSON.parse(body); },
        };
        await handler({ method, body: { ids }, headers: { authorization } }, response);
        assert.equal(response.headers['Cache-Control'], 'private, no-store');
        return response;
    }

    assert.equal((await request('GET', undefined, '')).statusCode, 401);
    assert.equal((await request('POST', ['db:11,12'])).statusCode, 400);
    assert.equal(requests.length, 0);
    access = { ready: false, premium: true };
    assert.equal((await request('GET')).statusCode, 403);
    access = { ready: true, premium: true };
    const catalogue = await request('GET');
    assert.equal(catalogue.statusCode, 200);
    const groups = catalogue.data.groups;
    const allIds = groups.flatMap(group => group.ids);
    assert.equal(new Set(allIds).size, questions.length);
    assert.equal(new Set(groups.map(group => group.materia + '/' + group.tema)).size, 68);
    for (const group of groups) {
        assert.deepEqual(Object.keys(group).sort(), ['dificultad', 'ids', 'materia', 'tema']);
    }
    const ids = [allIds.at(-1), allIds[0]];
    const attempt = await request('POST', ids);
    assert.equal(attempt.statusCode, 200);
    assert.deepEqual(attempt.data.questions.map(q => 'lib:' + q.id), ids);
    assert.equal((await request('POST', ['db:12'])).statusCode, 409);

    access = { ready: true, premium: false };
    const freeGroups = (await request('GET')).data.groups;
    const freeIds = freeGroups.flatMap(group => group.ids);
    assert.deepEqual(freeGroups.map(group => group.ids.length), [3, 3, 3]);
    assert.equal(new Set(freeGroups.map(group => group.materia)).size, 3);
    assert.equal((await request('POST', ids)).statusCode, 403);
    assert.deepEqual(new Set((await request('POST', freeIds)).data.questions.map(q => q.content_id)), new Set(sample));
    access = { ready: true, premium: true, expires_at: '2020-01-01T00:00:00Z' };
    assert.deepEqual((await request('GET')).data.groups, freeGroups);
    assert.ok(requests.every(path => path === '/rest/v1/rpc/campus_access'));
});

test('every Medicine item has a distinct answer and at most two marked pages of its subject book', () => {
    const official = {
        MORFOFUNCION: ['morfofuncion', 1251],
        'BIOLOGIA CELULAR': ['biologia-celular', 829],
        'SALUD PUBLICA': ['educacion-salud', 232],
    };
    const topics = new Map();
    for (const q of questions) {
        const { materia, tema, dificultad, lecturas_comentario: refs } = q;
        const [book, pageCount] = official[materia];
        const options = [...'abcd'].map(letter => q['opcion_' + letter]);
        assert.ok(q.pregunta && q.justificacion && options.every(Boolean), q.content_id);
        assert.equal(new Set(options.map(option => option.trim().toLowerCase())).size, 4, q.content_id);
        assert.match(q.respuesta_correcta, /^[ABCD]$/);
        assert.ok(!options.some(option => /^(solo|amb[ao]s|ningun[ao]|tod[ao]s)\b.*\b(afirmaci[oó]n(?:es)?|enunciados?)\b/i.test(option)), q.content_id);
        assert.ok(refs.length >= 1 && refs.length <= 2, q.content_id);
        for (const ref of refs) {
            assert.equal(ref.slug, book);
            assert.ok(ref.section && Number.isInteger(ref.page) && ref.page >= 1 && ref.page <= pageCount);
            assert.ok(ref.marks.length > 0);
            for (const [x, y, w, h] of ref.marks) {
                assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1.001 && y + h <= 1.001);
            }
        }
        const key = materia + '/' + tema;
        if (!topics.has(key)) topics.set(key, new Set());
        topics.get(key).add(dificultad);
    }
    for (const levels of topics.values()) assert.deepEqual(levels, new Set(['facil', 'medio', 'dificil']));
    const bacterium = questions.find(q => q.content_id === 'banco-curso:biologia-01:espirilo');
    assert.equal(bacterium.opcion_b, 'Espirilo');
    assert.equal(bacterium.opcion_d, 'Bacilo curvo (vibrio)');
    assert.match(bacterium.comentarios_opciones.D, /curvatura/);
    assert.deepEqual(bacterium.lecturas_comentario.map(ref => ref.page), [42, 44]);
});
