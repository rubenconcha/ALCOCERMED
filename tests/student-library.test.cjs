const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../student-library.js'), 'utf8');
class Element {
  constructor() { this.children = []; this.events = {}; this.value = ''; this.dataset = {}; }
  addEventListener(name, callback) { this.events[name] = callback; }
  setAttribute(name, value) { this[name] = value; }
  replaceChildren() { this.children = []; }
  append(...nodes) { this.children.push(...nodes); }
  click() { return this.events.click(); }
}
function setup(load, access) {
  const ids = Object.fromEntries(['library-topics-panel', 'library-topics', 'library-status', 'library-search', 'library-subjects', 'library-back', 'library-title', 'library-instruction'].map(id => [id, new Element()]));
  const buttons = ['MORFOFUNCION', 'BIOLOGIA CELULAR'].map(subject => Object.assign(new Element(), { dataset: { subject } }));
  const starts = [];
  const window = {};
  const screens = [];
  window.CampusAccess = access;
  vm.runInNewContext(source, { window, CampusAccess: access, showScreen: id => screens.push(id), document: { getElementById: id => ids[id], querySelectorAll: () => buttons, createElement: () => new Element() }, normalizeDbText: x => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(), campo: (r, k) => r[k] || r[k.toUpperCase()], loadFlashcards: load, startDeck: (...args) => starts.push(args) });
  return { ids, buttons, starts, window, screens };
}
test('groups actual topics, searches accents, opens only selected subject data', async () => {
  const h = setup(async () => [{ MATERIA: 'MORFOFUNCION', TEMA: 'Óseo' }, { materia: 'MORFOFUNCION', tema: 'óseo' }, { materia: 'BIOLOGIA CELULAR', tema: 'Óseo' }]);
  await h.buttons[0].click();
  const list = h.ids['library-topics'];
  assert.equal(list.children.length, 1);
  assert.equal(list.children[0].className, 'library-topic-row');
  assert.equal(list.children[0].children[1].textContent, 'Empezar');
  assert.doesNotMatch(JSON.stringify(list.children), /2 tarjetas/);
  h.ids['library-search'].value = 'oseo';
  h.ids['library-search'].events.input();
  list.children[0].children[1].click();
  assert.equal(h.starts[0][1], 'MORFOFUNCION');
  assert.equal(h.starts[0][2].length, 2);
  h.ids['library-search'].value = 'no existe';
  h.ids['library-search'].events.input();
  assert.equal(list.children.length, 0);
});
test('stale subject responses cannot replace current subject', async () => {
  const pending = [];
  const h = setup(() => new Promise(resolve => pending.push(resolve)));
  const a = h.buttons[0].click();
  const b = h.buttons[1].click();
  pending[1]([{ materia: 'BIOLOGIA CELULAR', tema: 'Célula' }]);
  await b;
  pending[0]([{ materia: 'MORFOFUNCION', tema: 'Hueso' }]);
  await a;
  assert.equal(h.ids['library-topics'].children[0].children[0].textContent, 'Célula');
});
test('failed load exposes retry and recovers', async () => {
  let calls = 0;
  const h = setup(async () => { if (++calls === 1) throw Error('offline'); return [{ materia: 'MORFOFUNCION', tema: 'Músculo' }]; });
  await h.buttons[0].click();
  assert.match(h.ids['library-status'].textContent, /No pudimos/);
  await h.ids['library-topics'].children[0].click();
  assert.equal(h.ids['library-topics'].children[0].children[0].textContent, 'Músculo');
});

test('subject selection never starts a deck and returning preserves topic choices', async () => {
  const h = setup(async () => [{materia:'MORFOFUNCION',tema:'Hueso'}]);
  h.window.openStudyLibrary();
  assert.equal(h.ids['library-subjects'].hidden, false);
  assert.equal(h.ids['library-topics-panel'].hidden, true);
  await h.buttons[0].click();
  assert.equal(h.starts.length, 0);
  assert.equal(h.ids['library-subjects'].hidden, true);
  h.ids['library-topics'].children[0].children[1].click();
  assert.equal(h.starts.length, 1);
  h.window.backToStudyTopics();
  assert.equal(h.ids['library-topics-panel'].hidden, false);
  assert.equal(h.ids['library-topics'].children[0].children[0].textContent, 'Hueso');
  h.window.openStudyLibrary();
  assert.equal(h.ids['library-topics-panel'].hidden, true);
});

test('free account opens listed topics and sends locked topics directly to plans', async () => {
  const access = { isFree: () => true, catalog: async () => [
    {materia:'MORFOFUNCION',tema:'temas principales de anatomia y fisiologia',free_count:3},
    {materia:'MORFOFUNCION',tema:'la quimica de la vida',free_count:2},
    {materia:'MORFOFUNCION',tema:'histologia',free_count:0},
  ]};
  const h = setup(async () => [
    {materia:'MORFOFUNCION',tema:'temas principales de anatomia y fisiologia'},
    {materia:'MORFOFUNCION',tema:'la quimica de la vida'},
  ], access);
  await h.buttons[0].click();
  const rows = h.ids['library-topics'].children;
  assert.equal(rows.length, 3);
  assert.equal(rows[0].children[1].textContent, 'Empezar');
  assert.equal(rows[1].children[1].textContent, 'Empezar');
  assert.equal(rows[2].children[1].href, '/planes#planes');
  assert.equal(rows[2].children[0].children[0].textContent, '🔒');
  rows[0].children[1].click();
  assert.equal(h.starts.length, 1);
  assert.equal(h.starts[0][2].length, 2);
});
