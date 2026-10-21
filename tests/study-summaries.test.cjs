const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../study-summaries.js'), 'utf8');
class Element {
    constructor() { this.children = []; this.events = {}; this.value = ''; this.hidden = false; this.open = false; }
    addEventListener(name, handler) { this.events[name] = handler; }
    setAttribute(name, value) { this[name] = value; }
    append(...nodes) { this.children.push(...nodes); }
    replaceChildren(...nodes) { this.children = nodes; }
    add(option) { this.children.push(option); }
    click() { return this.events.click?.(); }
    showModal() { this.open = true; }
    close() { this.open = false; this.events.close?.(); }
}
function setup({ open = async () => {}, status = 200 } = {}) {
    const ids = Object.fromEntries(['resumenes-grid', 'resumenes-search', 'resumenes-subject', 'resumenes-topic', 'resumenes-count', 'resumenes-empty', 'resumenes-viewer', 'resumenes-frame', 'resumenes-retry', 'resumenes-loading', 'resumenes-download', 'resumenes-viewer-subject', 'resumenes-viewer-title', 'resumenes-clear', 'resumenes-close'].map(id => [id, new Element()]));
    const calls = [], requests = [], revoked = [];
    class Reader { destroy() {} async open(url) { calls.push(url); await open(url); } }
    vm.runInNewContext(source, { document: { getElementById: id => ids[id], createElement: () => new Element() }, window: { CampusAccess: { isFree: () => false }, addEventListener() {} }, SummaryPdfReader: Reader, CampusAccess: { isFree: () => false },
        Option: function(text, value) { return { text, value }; }, AbortController, setTimeout, clearTimeout,
        URL: { createObjectURL: () => 'blob:summary-test', revokeObjectURL: value => revoked.push(value) },
        getSupabase: () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: 'test-user' }, access_token: 'test-token' } } }) } }),
        fetch: async (url, options) => { requests.push({ url, options }); return { ok: status === 200, status, blob: async () => ({ type: 'application/pdf' }) }; }
    });
    const card = index => ids['resumenes-grid'].children[index].children[1].children[3];
    const byTitle = title => ids['resumenes-grid'].children.find(n => n.children[1].children[1].textContent === title).children[1].children[3];
    return { ids, calls, requests, revoked, card, byTitle };
}
test('public summaries render in the reader and keep the original download', async () => {
    const t = setup(); await t.card(0).click();
    assert.equal(t.calls[0], '/resumenes/biologia-tema-1.pdf?v=20261021');
    assert.equal(t.requests.length, 0);
    assert.equal(t.ids['resumenes-loading'].hidden, true);
    assert.equal(t.ids['resumenes-download'].download, 'biologia-tema-1.pdf');
});
test('Sangre passes through authenticated access before its temporary URL reaches the reader', async () => {
    const t = setup(); await t.byTitle('Sangre').click();
    assert.equal(t.requests[0].url, '/api/resumen?file=morfofuncion-sangre');
    assert.equal(t.requests[0].options.headers.Authorization, 'Bearer test-token');
    assert.equal(t.requests[0].options.cache, 'no-store');
    assert.deepEqual(t.calls, ['blob:summary-test']);
});
test('a denied premium response never reaches the renderer', async () => {
    const t = setup({ status: 403 }); await t.byTitle('Sangre').click();
    assert.equal(t.calls.length, 0);
    assert.match(t.ids['resumenes-loading'].textContent, /suscripción activa/);
    assert.equal(t.ids['resumenes-retry'].hidden, false);
});
test('a failed render can be retried without leaving the summary', async () => {
    let attempts = 0;
    const t = setup({ open: async () => { if (++attempts === 1) throw Error('Error de lectura'); } });
    await t.card(0).click();
    assert.equal(t.ids['resumenes-loading'].hidden, false);
    assert.equal(t.ids['resumenes-retry'].hidden, false);
    t.ids['resumenes-retry'].click();
    await new Promise(setImmediate);
    assert.equal(attempts, 2);
    assert.equal(t.ids['resumenes-loading'].hidden, true);
});
test('a previous document finishing after close cannot hide the new loading status', async () => {
    const pending = [];
    const t = setup({ open: () => new Promise(resolve => pending.push(resolve)) });
    const first = t.card(0).click();
    t.ids['resumenes-viewer'].close();
    const second = t.card(1).click();
    pending[0](); await first;
    assert.equal(t.ids['resumenes-loading'].hidden, false);
    assert.match(t.ids['resumenes-download'].download, /capitulo-2/);
    pending[1](); await second;
    assert.equal(t.ids['resumenes-loading'].hidden, true);
});
