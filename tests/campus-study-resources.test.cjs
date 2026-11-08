const assert = require('node:assert/strict');
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

test('official guide cards open the matching PDF and offer its direct download', async () => {
    function node() {
        return {
            children: [],
            append(...children) { this.children.push(...children); },
            replaceChildren(...children) { this.children = children; },
            setAttribute(name, value) { this[name] = value; },
            addEventListener(event, handler) { this[event] = handler; },
            showModal() { this.open = true; },
            close() { this.open = false; },
        };
    }
    const nodes = new Map();
    const document = {
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
        SummaryPdfReader: class {
            constructor(host, options) {
                assert.equal(host, get('pages'));
                assert.equal(options.label, 'texto oficial');
                assert.equal(options.pageJump, true);
            }
            async open(url) { loaded.push(url); }
        },
    });
    assert.deepEqual(get('grid').children.map(card => card.children[1].textContent),
        ['Matemáticas', 'Física', 'Química', 'Biología', 'Lenguaje']);
    for (const [index, card] of get('grid').children.entries()) {
        const [button, link] = card.children[3].children;
        await button.onclick();
        assert.equal(loaded[index], link.href);
        assert.equal(get('download').href, link.href);
        assert.equal(get('status').hidden, true);
        assert.equal(link.href, '/api/texto-oficial?materia=' + ['matematicas', 'fisica', 'quimica', 'biologia', 'lenguaje'][index]);
    }
    assert.equal(new Set(loaded).size, 5);
});

test('the PDF relay only fetches official IDs, streams valid ranges and discards HTML errors', async () => {
    const calls = [];
    let upstream = new Response('%PDF-', {
        status: 206,
        headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': '5', 'Content-Range': 'bytes 0-4/2830038' },
    });
    const module = { exports: {} };
    vm.runInNewContext(read('api/texto-oficial.js'), {
        module, require, URL, AbortSignal,
        fetch: async (url, options) => { calls.push([url, options]); return upstream; },
    });
    async function request(subject, method = 'GET') {
        const res = new PassThrough();
        const chunks = [];
        const headers = {};
        res.on('data', chunk => chunks.push(chunk));
        res.setHeader = (name, value) => { headers[name] = value; };
        await module.exports({
            method,
            query: { materia: subject },
            headers: { range: 'bytes=0-4', authorization: 'Bearer test', cookie: 'session=test' },
        }, res);
        return { status: res.statusCode, headers, body: Buffer.concat(chunks).toString() };
    }
    assert.equal((await request('https://example.com')).status, 404);
    assert.equal((await request('matematicas', 'POST')).status, 405);
    assert.equal(calls.length, 0);
    const result = await request('matematicas');
    assert.equal(result.status, 206);
    assert.equal(result.body, '%PDF-');
    assert.equal(result.headers['Content-Range'], 'bytes 0-4/2830038');
    assert.equal(result.headers['Content-Type'], 'application/pdf');
    assert.match(result.headers['Content-Disposition'], /attachment/);
    assert.equal(calls[0][0].hostname, 'drive.usercontent.google.com');
    assert.equal(calls[0][0].searchParams.get('id'), '1IRuuJCW8oBAOqL2uqwHZv4eWSVtZkwqF');
    assert.deepEqual(Object.keys(calls[0][1].headers).sort(), ['Accept-Encoding', 'Range']);
    upstream = new Response('<h1>Denied</h1>', { headers: { 'Content-Type': 'text/html' } });
    const rejected = await request('matematicas');
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
