const assert = require('node:assert/strict');
const { createHmac } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { PassThrough } = require('node:stream');
const test = require('node:test');
const vm = require('node:vm');
const { exercises, reference, parseNumber, isCorrect, formatAnswer } = require('../sufficiency-practice-content.js');

const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('practice covers all ten adapted cases and the two conversion blocks', () => {
    assert.equal(exercises.filter(block => block.kind === 'Casos aplicados').length, 10);
    assert.equal(exercises.filter(block => block.kind === 'Conversiones').length, 2);
    assert.deepEqual([...new Set(exercises.map(block => block.subject))].sort(), ['Física', 'Matemáticas', 'Química']);
    assert.equal(new Set(exercises.map(block => block.id)).size, exercises.length);
    const questions = exercises.flatMap(block => block.questions);
    assert.equal(questions.length, 81);
    for (const question of questions) {
        assert.ok(Number.isFinite(question.answer), question.prompt);
        assert.ok(question.unit && question.steps.length, question.prompt);
        assert.ok(isCorrect(formatAnswer(question), question), question.prompt);
        assert.ok(!isCorrect('1e999', question), question.prompt);
    }
});

test('numeric inputs accept the displayed formats and grade the corrected calculations', () => {
    for (const value of ['1 440 000', '1.440.000', '1440000', '1,44e6']) {
        assert.equal(parseNumber(value), 1440000);
        assert.ok(isCorrect(value, exercises[0].questions[2]));
    }
    assert.equal(parseNumber(' 2.200,41 '), 2200.41);
    assert.equal(parseNumber('0.195'), .195);
    assert.equal(parseNumber('−1,2'), -1.2);
    for (const invalid of ['', '540 cm³/h', '2,2,1', 'NaN', '1e500']) assert.equal(parseNumber(invalid), null);
    const thirdContainer = exercises.find(block => block.id === 'medicion-neonatal').questions[5];
    assert.ok(isCorrect('35,4', thirdContainer));
    assert.ok(!isCorrect('11,8', thirdContainer));
    assert.ok(!isCorrect('2,5', exercises.find(block => block.id === 'medicion-neonatal').questions[4]));
    const surface = exercises.find(block => block.id === 'superficie-concentracion').questions[2];
    assert.ok(isCorrect('0,8314', surface));
    assert.ok(!isCorrect('0,8308', surface));
});

test('conversion reference uses the corrected acre, joule, kelvin and SI prefix entries', () => {
    const rows = Object.fromEntries(reference.flatMap(group => group.rows));
    assert.match(rows['1 acre'], /^43 560 ft²/);
    assert.match(rows['1 J'], /10⁷ erg/);
    assert.equal(rows['De °C a K'], '°C + 273,15');
    assert.equal(rows['deca (da)'], '10¹');
});

test('the three verified UMSS books open their PDF and request a temporary download', async () => {
    const downloads = [];
    function node() {
        return {
            children: [],
            append(...children) { this.children.push(...children); },
            replaceChildren(...children) { this.children = children; },
            setAttribute(name, value) { this[name] = value; },
            addEventListener(event, handler) { this[event] = handler; },
            showModal() { this.open = true; },
            close() { this.open = false; },
            click() { downloads.push(this.href); },
            remove() {},
        };
    }
    const nodes = new Map();
    const document = {
        body: node(),
        createElement: node,
        getElementById(id) {
            if (!nodes.has(id)) nodes.set(id, node());
            return nodes.get(id);
        },
    };
    const get = suffix => document.getElementById('official-texts-' + suffix);
    const loaded = [];
    const window = {};
    vm.runInNewContext(read('official-texts.js'), {
        document, window,
        getSupabase: () => ({ auth: { getSession: async () => ({ data: { session: { access_token: 'test' } } }) } }),
        fetch: async (url, options) => {
            assert.equal(options.method, 'POST');
            assert.equal(options.headers.Authorization, 'Bearer test');
            return Response.json({ grant: 'fixture' });
        },
        SummaryPdfReader: class {
            constructor(host, options) {
                assert.equal(host, get('pages'));
                assert.equal(options.label, 'texto oficial');
                assert.equal(options.pageJump, true);
            }
            async open(url, options) {
                assert.equal(options.headers.Authorization, 'Bearer test');
                assert.equal(options.rangeOnly, true);
                assert.equal(options.initialPage, url.endsWith('biologia-celular') ? 9 : undefined);
                loaded.push(url);
            }
        },
    });
    assert.deepEqual(get('grid').children.map(card => card.children[1].textContent),
        ['Morfofunción', 'Biología Celular y Molecular', 'Educación en Salud e Investigación']);
    assert.match(get('grid').children[0].children[4].textContent, /6.ª edición/);
    assert.equal(get('grid').children[1].children[3].textContent, 'Alfonso Calvo González');
    assert.match(get('grid').children[1].children[4].textContent, /1.ª edición · Elsevier España · 2015/);
    for (const [index, card] of get('grid').children.entries()) {
        const [open, save] = card.children[5].children;
        const url = '/api/texto-oficial?materia=' + ['morfofuncion', 'biologia-celular', 'educacion-salud'][index];
        await open.onclick();
        await save.onclick();
        assert.equal(loaded[index], url);
        assert.equal(downloads[index], url + '&descarga=fixture');
        assert.equal(get('reader-title').textContent, card.children[2].textContent);
        assert.equal(get('status').hidden, true);
    }
    await get('download').onclick();
    assert.equal(downloads.at(-1), loaded.at(-1) + '&descarga=fixture');
    assert.equal(new Set(loaded).size, 3);
});

test('the PDF relay checks campus access, streams private PDFs and grants one short-lived download', async () => {
    const calls = [];
    const blobResponse = () => new Response('%PDF-', {
        status: 206,
        headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': '5', 'Content-Range': 'bytes 0-4/2830038' },
    });
    let upstream = blobResponse;
    let ready = true;
    const secret = 'test-blob-key';
    const module = { exports: {} };
    vm.runInNewContext(read('api/texto-oficial.js'), {
        module, require, URL, AbortSignal, Buffer,
        process: { env: { SUPABASE_ANON_KEY: 'test-anon-key', BLOB_READ_WRITE_TOKEN: secret } },
        fetch: async (url, options) => {
            calls.push([new URL(url), options]);
            if (new URL(url).pathname.endsWith('/rpc/campus_access')) return Response.json({ ready });
            return upstream();
        },
    });
    async function request(subject, { method = 'GET', authorization, grant } = {}) {
        const res = new PassThrough();
        const chunks = [];
        const headers = {};
        res.on('data', chunk => chunks.push(chunk));
        res.setHeader = (name, value) => { headers[name] = value; };
        await module.exports({
            method,
            query: { materia: subject, descarga: grant },
            headers: { range: 'bytes=0-4', authorization, cookie: 'session=test' },
        }, res);
        return { status: res.statusCode, headers, body: Buffer.concat(chunks).toString() };
    }
    assert.equal((await request('https://example.com')).status, 404);
    assert.equal((await request('matematicas')).status, 404);
    assert.equal((await request('morfofuncion', { method: 'DELETE' })).status, 405);
    assert.equal((await request('morfofuncion')).status, 401);
    assert.equal(calls.length, 0);
    const authorization = 'Bearer test';
    ready = false;
    assert.equal((await request('morfofuncion', { authorization })).status, 403);
    assert.equal(calls.length, 1);
    ready = true;
    const result = await request('morfofuncion', { authorization });
    assert.equal(result.status, 206);
    assert.equal(result.body, '%PDF-');
    assert.equal(result.headers['Content-Range'], 'bytes 0-4/2830038');
    assert.equal(result.headers['Content-Type'], 'application/pdf');
    assert.match(result.headers['Content-Disposition'], /^inline; filename="UMSS-2025-2026-morfofuncion.pdf"$/);
    assert.equal(result.headers['Cache-Control'], 'private, no-store');
    const [blobUrl, blobOptions] = calls.at(-1);
    assert.match(blobUrl.hostname, /\.private\.blob\.vercel-storage\.com$/);
    assert.match(blobUrl.pathname, /\/morfofuncion\.pdf$/);
    assert.equal(blobOptions.headers.Authorization, 'Bearer ' + secret);
    assert.equal(blobOptions.headers.Range, 'bytes=0-4');
    assert.equal(blobOptions.headers.cookie, undefined);
    const granted = await request('morfofuncion', { method: 'POST', authorization });
    assert.equal(granted.status, 200);
    assert.equal(calls.at(-1)[0].pathname, '/rest/v1/rpc/campus_access');
    const { grant } = JSON.parse(granted.body);
    assert.equal((await request('biologia-celular', { grant })).status, 401);
    const attachment = await request('morfofuncion', { grant });
    assert.equal(attachment.status, 206);
    assert.match(attachment.headers['Content-Disposition'], /^attachment/);
    const old = Math.floor(Date.now() / 1000) - 1;
    const proof = createHmac('sha256', secret).update('texto-oficial:morfofuncion:' + old).digest('base64url');
    assert.equal((await request('morfofuncion', { grant: old + '.' + proof })).status, 401);
    upstream = () => new Response('<h1>Denied</h1>', { headers: { 'Content-Type': 'text/html' } });
    const rejected = await request('morfofuncion', { authorization });
    assert.equal(rejected.status, 502);
    assert.equal(rejected.body, '');
});

test('campus navigation and app shell include both sections with current asset versions', () => {
    const campus = read('campus.html');
    const script = read('script.js');
    const worker = read('sw.js');
    for (const [slug, screen] of [
        ['textos-oficiales', 'official-texts-screen'], ['practica-suficiencia', 'sufficiency-practice-screen'],
    ]) {
        assert.ok(campus.includes('href="/campus?seccion=' + slug + '"'));
        assert.ok(campus.includes('<section id="' + screen + '"'));
        assert.ok(script.includes("section === '" + slug + "'"));
        assert.ok(script.includes("'" + screen + "'"));
    }
    const assets = [...campus.matchAll(/(?:src|href)="((?:official-texts|sufficiency-practice(?:-content)?|campus-study-resources|summary-pdf-reader)\.(?:js|css)\?v=\d+)"/g)];
    assert.equal(assets.length, 6);
    for (const [, asset] of assets) assert.ok(worker.includes("'./" + asset + "'"), asset);
});
