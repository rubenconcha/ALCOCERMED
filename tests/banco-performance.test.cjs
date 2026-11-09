'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/banco.js');

test('the private catalogue sends only filters and IDs, and the attempt fetches only chosen rows', async t => {
    const rows = [
        { id: 11, MATERIA: 'MORFOFUNCION', TEMA: 'sangre', DIFICULTAD: 'facil', PREGUNTA: 'Prueba de catálogo', FUENTE: 'Saladin', OPCION_A: 'Clave', RESPUESTA_CORRECTA: 'A' },
        { id: 12, MATERIA: 'MORFOFUNCION', TEMA: 'sangre', DIFICULTAD: 'dificil', PREGUNTA: 'Versión antigua' },
    ];
    const requests = [];
    let premium = true;
    const originalFetch = global.fetch;
    t.after(() => { global.fetch = originalFetch; });
    global.fetch = async (input, { headers }) => {
        const url = new URL(input);
        assert.equal(headers.Authorization, 'Bearer test-token');
        requests.push(url);
        if (url.pathname.endsWith('/rpc/campus_access')) {
            return { ok: true, json: async () => ({ ready: true, premium }) };
        }
        const selection = url.searchParams.get('id');
        assert.ok(url.pathname.endsWith('/banco_preguntas'));
        return { ok: true, json: async () => selection ? rows.filter(row => selection.includes(String(row.id))) : rows };
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
    premium = false;
    assert.equal((await request('GET')).statusCode, 403);
    premium = true;

    const catalogue = await request('GET');
    assert.equal(catalogue.statusCode, 200);
    const groups = catalogue.data.groups;
    assert.ok(groups.some(group => group.ids.includes('db:11')));
    assert.ok(groups.some(group => group.ids.some(id => id.startsWith('lib:banco-verificado:'))));
    assert.ok(!groups.some(group => group.ids.includes('db:12')));
    assert.ok(!JSON.stringify(catalogue.data).includes('Prueba de catálogo'));
    assert.match(requests.at(-1).searchParams.get('select'), /^id,MATERIA,TEMA,DIFICULTAD,PREGUNTA,FUENTE$/);

    const attempt = await request('POST', ['db:11']);
    assert.equal(attempt.statusCode, 200);
    assert.deepEqual(attempt.data.questions, [rows[0]]);
    assert.equal(requests.at(-1).searchParams.get('id'), 'in.(11)');
    assert.equal((await request('POST', ['db:12'])).statusCode, 409);
});
