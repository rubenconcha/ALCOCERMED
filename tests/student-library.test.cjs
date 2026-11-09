const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../student-library.js'), 'utf8');
class Element {
  constructor() { this.children = []; this.events = {}; this.value = ''; this.dataset = {}; }
  addEventListener(name, callback) { this.events[name] = callback; }
  setAttribute(name, value) { this[name] = value; }
  removeAttribute(name) { delete this[name]; }
  replaceChildren() { this.children = []; }
  append(...nodes) { this.children.push(...nodes); }
  click() { return this.events.click(); }
}
function setup({ catalog = [], load = async () => [], access = { isFree: () => false } } = {}) {
  const ids = Object.fromEntries(['library-topics-panel', 'library-topics', 'library-status', 'library-search', 'library-subjects', 'library-back', 'library-title', 'library-instruction', 'study-area', 'current-subject', 'card-tema-name', 'study-topic-message'].map(id => [id, new Element()]));
  const buttons = ['MORFOFUNCION', 'BIOLOGIA CELULAR'].map(subject => Object.assign(new Element(), { dataset: { subject } }));
  ids['library-subjects'].querySelectorAll = () => buttons;
  const starts = [], screens = [];
  const window = { CampusAccess: access, CampusCatalogs: { flashcards: catalog }, loadCampusAssets: async () => {} };
  const context = {
    window, CampusAccess: access, currentUser: { id: 'student' },
    showScreen(id) { context.currentCampusScreen = id; screens.push(id); },
    document: { getElementById: id => ids[id], createElement: () => new Element() },
    normalizeDbText: x => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(),
    OfficialFlashcards: { load },
    startDeck: (...args) => starts.push(args),
  };
  vm.runInNewContext(source, context);
  return { ids, buttons, starts, window, screens };
}
const morfo = (tema, count = 20) => ({ materia: 'MORFOFUNCION', tema, count });
const openFirst = fixture => fixture.ids['library-topics'].children[0].children[1].click();

test('topics are immediate and search accents without requesting any cards', async () => {
  const calls = [];
  const cards = [{ id: 1 }, { id: 2 }];
  const h = setup({ catalog: [morfo('Óseo', 2), { materia: 'BIOLOGIA CELULAR', tema: 'Célula', count: 3 }],
    load: async (...scope) => { calls.push(scope); return cards; } });
  h.buttons[0].click();
  const list = h.ids['library-topics'];
  assert.equal(list.children.length, 1);
  assert.equal(list.children[0].children[1].textContent, 'Empezar');
  assert.match(JSON.stringify(list.children), /2 tarjetas/);
  h.ids['library-search'].value = 'oseo';
  h.ids['library-search'].events.input();
  assert.equal(calls.length, 0);
  const opening = openFirst(h);
  assert.equal(h.screens.at(-1), 'study-area');
  assert.equal(h.ids['card-tema-name'].textContent, 'Óseo');
  await opening;
  assert.deepEqual(calls, [['MORFOFUNCION', 'Óseo']]);
  assert.equal(h.starts[0][2], cards);
  h.ids['library-search'].value = 'no existe';
  h.ids['library-search'].events.input();
  assert.equal(list.children.length, 0);
});
test('leaving while a deck loads does not replace the current subject', async () => {
  let release;
  const h = setup({ catalog: [morfo('Hueso'), { materia: 'BIOLOGIA CELULAR', tema: 'Célula', count: 3 }],
    load: () => new Promise(resolve => release = resolve) });
  h.buttons[0].click();
  const opening = openFirst(h);
  h.window.openStudyLibrary();
  h.buttons[1].click();
  release([{ id: 1 }]);
  await opening;
  assert.equal(h.starts.length, 0);
  assert.equal(h.ids['library-topics'].children[0].children[0].children[0].textContent, 'Célula');
});
test('failed deck load keeps the topic visible and can be retried from topics', async () => {
  let calls = 0;
  const h = setup({ catalog: [morfo('Músculo')], load: async () => {
    if (++calls === 1) throw Error('offline');
    return [{ id: 1 }];
  } });
  h.buttons[0].click();
  await openFirst(h);
  assert.match(h.ids['study-topic-message'].textContent, /No pudimos/);
  h.window.backToStudyTopics();
  await openFirst(h);
  assert.equal(h.starts.length, 1);
});
test('subject selection never starts a deck and returning preserves topic choices', async () => {
  const h = setup({ catalog: [morfo('Hueso')], load: async () => [{ id: 1 }] });
  h.window.openStudyLibrary();
  assert.equal(h.ids['library-subjects'].hidden, false);
  assert.equal(h.ids['library-topics-panel'].hidden, true);
  h.buttons[0].click();
  assert.equal(h.starts.length, 0);
  assert.equal(h.ids['library-subjects'].hidden, true);
  await openFirst(h);
  assert.equal(h.starts.length, 1);
  h.window.backToStudyTopics();
  assert.equal(h.ids['library-topics-panel'].hidden, false);
  assert.equal(h.ids['library-topics'].children[0].children[0].children[0].textContent, 'Hueso');
  h.window.openStudyLibrary();
  assert.equal(h.ids['library-topics-panel'].hidden, true);
});
test('free access lists topics, then marks premium topics and opens only the allowed cards', async () => {
  const access = { isFree: () => true, catalog: async () => [
    { ...morfo('Anatomía'), free_count: 3 }, { ...morfo('Química'), free_count: 2 }, { ...morfo('Histología'), free_count: 0 },
  ] };
  const h = setup({ catalog: [morfo('Anatomía'), morfo('Química'), morfo('Histología')], access, load: async () => [{ id: 1 }] });
  h.buttons[0].click();
  assert.equal(h.ids['library-topics'].children.length, 3);
  await Promise.resolve();
  const rows = h.ids['library-topics'].children;
  assert.equal(rows[0].children[1].textContent, 'Empezar');
  assert.equal(rows[2].children[1].href, '/planes?desde=campus#planes');
  await openFirst(h);
  assert.equal(h.starts.length, 1);
  assert.equal(h.starts[0][2].length, 1);
});
