const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const script = read('script.js');
const start = script.indexOf('const BEN_CARSON_5050_LESSON =');
const code = script.match(/function campo\(row, nombre\) \{[\s\S]*?\n\}/)[0] +
  script.slice(start, script.indexOf('// ██  INTOCABLES + MAPAS MENTALES', start));
const rows = [
  { titulo: 'Uno', materia: 'MORFOFUNCIÓN', tema: ' Ángulos   de prueba ', descripcion: 'frase particular' },
  { TITULO: 'Dos', MATERIA: 'MORFOFUNCIÓN', TEMA: 'A\u0301NGULOS DE PRUEBA' },
  { TITULO: 'Legado', MATERIA: 'MORFOFUNCIÓN', TEMA: '   ' },
  { TITULO: 'Biología', MATERIA: 'BIOLOGÍA CELULAR', TEMA: 'Membrana celular' }
];

function node() {
  const hidden = new Set(['hidden']);
  return {
    children: [], textContent: '', value: '', disabled: false, attrs: {}, innerHTML: '',
    classList: {
      add: name => hidden.add(name), remove: name => hidden.delete(name),
      contains: name => hidden.has(name),
      toggle: (name, on) => on ? hidden.add(name) : hidden.delete(name),
    },
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; },
    appendChild(child) { this.children.push(child); },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) { this.children = children; },
    querySelector() { return this.body ||= node(); }
  };
}

function harness(videos = rows) {
  const nodes = new Map();
  const listeners = {};
  const calls = [];
  const selection = node();
  nodes.set('vc-tema-select', selection);
  const document = {
    createElement: node, createDocumentFragment: node,
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); }
  };
  const context = vm.createContext({
    document, performance, navigator: { connection: { saveData: true } },
    currentUser: { id: 'fixture-role' }, currentCampusScreen: 'videoclases-screen',
    allowed: true, results: () => Promise.resolve({ data: videos }),
    showScreen(id) { calls.push(id); },
    showToast() {},
    window: { addEventListener(name, fn) { listeners[name] = fn; } },
    getSupabase() {
      return { from(table) {
        return { select(projection) { return { neq(column, value) {
          return { order(orderBy) { calls.push([table, projection, column, value, orderBy]); return context.results(); } };
        } }; } };
      } };
    },
    console
  });
  context.CampusAccess = { canUseVideos: () => context.allowed };
  vm.runInContext(code, context);
  context.filterVideoclases = context.window.filterVideoclases;
  const opts = () => selection.children.map(el => el.textContent);
  const list = () => Array.from(context.vcState.filteredVideos, v => v.TITULO || v.titulo);
  return { context, calls, document, selection, listeners, opts, list };
}

test('arriba están Materia, Tema y búsqueda, con CSS móvil y recursos versionados coherentemente', () => {
  const html = read('campus.html');
  const section = html.slice(html.indexOf('id="videoclases-screen"'), html.indexOf('id="videoclases-screen"') + 4000);
  const topic = section.indexOf('<select id="vc-tema-select"');
  assert.ok(section.indexOf('id="vc-materia-btn"') < topic && topic < section.indexOf('id="vc-search-input"'));
  assert.match(section, /<label class="banco-select-label" for="vc-tema-select"/);
  const css = read('styles.css');
  assert.match(css, /@media \(max-width: 768px\)\s*\{[^]*?\.vc-filters \{\s*display: grid;\s*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(css, /\.vc-filters \.vc-search-wrap \{\s*grid-column: 1 \/ -1/);
  const sw = read('sw.js');
  for (const asset of ['styles.css', 'script.js']) {
    const match = html.match(new RegExp('(?:href|src)="(' + asset.replace('.', '\\.') + '\\?v=[^"]+)"'));
    assert.ok(match && sw.includes("'./" + match[1] + "'"), asset);
  }
});

test('deduplica temas, conserva clases sin tema, combina búsqueda y vuelve a todos al cambiar materia', async () => {
  const t = harness();
  await t.context.loadVideoclases();
  assert.deepEqual(t.calls[0], ['videoclases', '*', 'id', 1, 'MATERIA']);
  assert.deepEqual(t.opts(), ['todos los temas', 'Ángulos de prueba', 'Membrana celular', 'Posición, planos y términos anatómicos', 'sin tema asignado']);
  assert.deepEqual(t.list(), ['Uno', 'Dos', 'Legado', 'Biología', 'Ben Carson 50/50']);
  t.context.window.selectVcMateria('MORFOFUNCIÓN');
  assert.deepEqual(t.opts(), ['todos los temas', 'Ángulos de prueba', 'Posición, planos y términos anatómicos', 'sin tema asignado']);
  t.selection.value = 'tema:ángulos de prueba';
  t.context.filterVideoclases();
  assert.deepEqual(t.list(), ['Uno','Dos']);
  assert.deepEqual(t.calls, [['videoclases', '*', 'id', 1, 'MATERIA']]);
  const search = t.document.getElementById('vc-search-input');
  search.value = 'particular';
  t.context.filterVideoclases();
  assert.deepEqual(t.list(), ['Uno']);
  search.value = 'otra frase';
  t.context.filterVideoclases();
  assert.equal(t.document.getElementById('vc-no-results').classList.contains('hidden'), false);
  assert.equal(t.document.getElementById('vc-empty').classList.contains('hidden'), true);
  search.value = '';
  t.selection.value = 'sin-tema';
  t.context.filterVideoclases();
  assert.deepEqual(t.list(), ['Legado']);
  t.context.window.selectVcMateria('BIOLOGÍA CELULAR');
  assert.deepEqual(t.opts(), ['todos los temas', 'Membrana celular']);
  assert.equal(t.selection.value, '');
  assert.deepEqual(t.list(), ['Biología']);
});

test('desautorizar limpia tarjetas y temas, y descarta una carga resuelta después', async () => {
  const t = harness();
  t.context.allowed = false;
  await t.context.loadVideoclases();
  assert.equal(t.calls.length, 0);
  t.context.allowed = true;
  await t.context.loadVideoclases();
  t.selection.value = 'tema:ángulos de prueba';
  t.context.vcState.catalog.expires = 0;
  // An explicit refresh is already in flight.
  t.context.vcState.catalog = null;
  let resolve;
  t.context.results = () => new Promise(r => { resolve = r; });
  const pending = t.context.loadVideoclases();
  t.context.allowed = false;
  t.listeners['campus-access-change']();
  resolve({ data: rows });
  await pending;
  assert.deepEqual(t.list(), []);
  assert.deepEqual(t.opts(), ['todos los temas']);
  assert.equal(t.selection.disabled, true);
  assert.equal(t.calls.at(-1), 'home-screen');
});

test('sin tema seleccionado la clase protegida sigue disponible y su flujo no se modifica', async () => {
  const t = harness([]);
  await t.context.loadVideoclases();
  assert.deepEqual(t.list(), ['Ben Carson 50/50']);
  assert.match(script, /const secured = v === BEN_CARSON_5050_LESSON;/);
  assert.match(script, /const BEN_CARSON_5050_PLAYBACK_PATH = '\/api\/flashcards\?bc5050_playback=1';/);
});
