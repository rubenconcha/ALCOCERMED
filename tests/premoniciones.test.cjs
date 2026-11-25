const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');

const premoniciones = require('../api/_premoniciones/premoniciones.json');
const html = fs.readFileSync('campus.html', 'utf8');
const hub = fs.readFileSync('intocables-hub.js', 'utf8');
const css = fs.readFileSync('intocables-sheets.css', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

test('el material conserva Morfofunción e incorpora los diez puntos de Macrotransporte', () => {
  assert.equal(premoniciones.length, 8);
  const morphology = premoniciones.filter(item => item.materia === 'Morfofunción');
  assert.deepEqual(morphology.map(item => item.orden), [1, 2, 5, 6, 7, 8, 9]);
  assert.ok(morphology.every(item => item.items.length >= 11));
  assert.ok(premoniciones.every(item => /^Capítulo \d+$/.test(item.capitulo)));
  assert.equal(new Set(premoniciones.map(item => item.id)).size, 8);
  const macro = premoniciones.find(item => item.id === 'premo-bio-05');
  assert.equal(macro.items.length, 10);
  assert.equal(macro.source.slug, 'biologia-celular');
  assert.deepEqual(macro.items.map(item => item.page || item.pages[0].page), [218, 222, 226, 229, 231, 232, 235, 238, 240, 242]);
  assert.match(macro.items[7].text, /ARF.*5\.19.*5\.20/);
  assert.match(macro.items[9].text, /SNARE.*5\.22/);
});

test('cada tema identifica su libro oficial, sección y páginas válidas con su numeración impresa', () => {
  const official = JSON.parse(fs.readFileSync('referencias-oficiales/manifest.json', 'utf8')).archivos;
  const books = {
    morfofuncion: official.find(book => book.archivo.startsWith('morfofisiliologia')),
    'biologia-celular': official.find(book => book.archivo.startsWith('Biologia_Celular')),
  };
  for (const item of premoniciones) {
    const source = books[item.source.slug];
    assert.equal(item.source.sha256, source.sha256);
    assert.ok(item.source.author && item.source.edition && item.source.title);
    for (const entry of item.items) {
      assert.ok(entry.text && entry.section && entry.pages.length, item.id);
      assert.ok(entry.pages.some(ref => ref.page === (entry.page || entry.pages[0].page)));
      for (const ref of entry.pages) {
        assert.ok(Number.isInteger(ref.page) && ref.page >= 1 && ref.page <= source.paginas_pdf, entry.text);
        assert.equal(ref.page - ref.printed, item.source.slug === 'morfofuncion' ? 28 : 0);
        for (const mark of ref.marks || []) {
          assert.equal(mark.length, 4);
          assert.ok(mark.every(number => Number.isFinite(number) && number >= 0 && number <= 1));
          assert.ok(mark[0] + mark[2] <= 1.001 && mark[1] + mark[3] <= 1.001);
        }
      }
    }
  }
});

test('el catálogo público de Intocables incluye la subdivisión de premociones', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync('campus-catalogs.js', 'utf8'), context);
  const list = context.window.CampusCatalogs.premoniciones;
  assert.equal(list.length, premoniciones.length);
  assert.deepEqual(Array.from(list, item => item.count), premoniciones.map(item => item.items.length));
  assert.ok(list.every(item => !('items' in item)));
});

test('Intocables muestra Láminas y la nueva subdivisión Premoniciones Ben Carson', () => {
  assert.match(html, /<button type="button" data-format="sheets"[^>]*>Láminas<\/button>/);
  assert.match(html, /data-format="premoniciones"[^>]*>Premoniciones Ben Carson<\/button>/);
  assert.match(html, /id="itc-premonition-dialog"/);
  assert.match(html, /id="itc-premonition-list"/);
  assert.match(html, /intocables-hub\.js\?v=9/);
  assert.match(html, /intocables-sheets\.css\?v=\d+/);
  assert.match(html, /campus-catalogs\.js\?v=\d+/);
  assert.match(css, /\.itc-premonition-list/);
  assert.match(css, /\.itc-premonition-hotspot/);
  assert.doesNotMatch(hub, /itc-premonition-banner/);
});

test('abrir una premonición consulta la API protegida y pinta la lista', () => {
  assert.match(hub, /format==='premoniciones'\?premoniciones/);
  assert.match(hub, /\/api\/premoniciones\?id=/);
  assert.match(hub, /meta\.kind==='premoniciones'\)return openPremonition/);
  assert.match(hub, /function renderPremonition\(item\)/);
  assert.match(hub, /itc-premonition-list/);
  assert.match(hub, /response\.status===403/);
  assert.match(hub, /CampusAccess\?\.isFree\(\)\)return window\.CampusAccess\.unlock\(\)/);
});

test('la API de premociones exige una sesión Premium y no expone el contenido', async () => {
  const handler = require('../api/premoniciones.js');
  const makeRes = () => {
    const res = { headers: {}, statusCode: 200, body: undefined };
    res.setHeader = (key, value) => { res.headers[key.toLowerCase()] = value; };
    res.status = code => { res.statusCode = code; return res; };
    res.end = body => { res.body = body; return res; };
    return res;
  };
  const req = id => ({ method: 'GET', query: { id }, headers: {} });
  const originalFetch = globalThis.fetch;

  let res = makeRes();
  await handler(req('premo-morfo-01'), res);
  assert.equal(res.statusCode, 401);

  res = makeRes();
  await handler({ method: 'GET', query: { id: 'no-existe' }, headers: { authorization: 'Bearer token' } }, res);
  assert.equal(res.statusCode, 404);

  globalThis.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: false }) });
  res = makeRes();
  await handler({ method: 'GET', query: { id: 'premo-morfo-01' }, headers: { authorization: 'Bearer token' } }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body, undefined);

  globalThis.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: true }) });
  res = makeRes();
  await handler({ method: 'GET', query: { id: 'premo-morfo-01' }, headers: { authorization: 'Bearer token' } }, res);
  assert.equal(res.statusCode, 200);
  const payload = JSON.parse(res.body);
  assert.equal(payload.id, 'premo-morfo-01');
  assert.ok(Array.isArray(payload.items) && payload.items.length >= 11);

  globalThis.fetch = originalFetch;
});

test('la ruta queda registrada con sus archivos y bloqueada al acceso directo', () => {
  assert.deepEqual(vercel.functions['api/premoniciones.js'], { includeFiles: 'api/_premoniciones/**' });
  const rewrite = vercel.rewrites.find(item => item.source === '/api/_premoniciones/:path*');
  assert.equal(rewrite?.destination, '/api/premoniciones?id=invalid');
  const cacheVersion = Number(sw.match(/CACHE_NAME = 'alcocermed-main-v(\d+)-[^']+'/)?.[1]);
  assert.ok(cacheVersion >= 209, 'mantiene una versión de caché igual o más reciente');
  assert.match(sw, /'\.\/intocables-hub\.js\?v=9'/);
  const stylesheet = html.match(/href="(intocables-sheets\.css\?v=\d+)"/)?.[1];
  assert.ok(stylesheet, 'el campus carga la hoja de estilo con versión');
  assert.ok(sw.includes("'./" + stylesheet + "'"), 'el caché usa la misma versión que el campus');
});

test('los temas abren su lectura específica y conservan la lista al cerrar el lector', async () => {
  const nodes = new Map();
  const get = id => {
    if (!nodes.has(id)) nodes.set(id, { textContent: '', innerHTML: '', open: true, style: {}, classList: { toggle() {} } });
    return nodes.get(id);
  };
  const calls = [];
  let free = false;
  const context = {
    $: get,
    esc: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    activePremonition: null, premonitionRequest: 0,
    premonitionZoom: 1, covers: new Map([['premo-bio-05', 'blob:original-image']]),
    currentUser: { id: 'student' }, currentCampusScreen: 'intocables-hub-screen',
    window: {
      CampusAccess: { isFree: () => free, unlock: () => calls.push('locked') },
      loadCampusAssets: async group => { assert.equal(group, 'texts'); },
      OfficialTexts: { readPage: async (...args) => calls.push(args) },
    },
  };
  vm.createContext(context);
  const start = hub.indexOf(' function readingPageLabel(');
  const end = hub.indexOf(' async function openPremonition(', start);
  vm.runInContext(hub.slice(start, end), context);
  const macro = premoniciones.find(item => item.id === 'premo-bio-05');
  context.renderPremonition(macro);
  assert.equal((get('itc-premonition-list').innerHTML.match(/data-premonition-index=/g) || []).length, 10);
  assert.match(get('itc-premonition-list').innerHTML, /SNARE/);
  assert.equal(get('itc-premonition-list').hidden, true);
  assert.equal(get('itc-premonition-image').src, 'blob:original-image');
  assert.equal((get('itc-premonition-hotspots').innerHTML.match(/data-premonition-index=/g) || []).length, 10);
  context.setPremonitionZoom(3);
  assert.equal(get('itc-premonition-board').style.width, '300%');
  assert.equal(get('itc-premonition-zoom-value').textContent, '300%');
  assert.match(get('itc-premonition-source').textContent, /Alfonso Calvo/);
  assert.equal(context.readingPageLabel([{ printed: 173 }, { printed: 175 }]), 'Págs. 173, 175');
  const button = { disabled: false, setAttribute() {}, removeAttribute() {} };
  for (let i = 0; i < macro.items.length; i++) {
    await context.readPremonition(i, button);
    const [slug, page, refs] = calls.at(-1);
    assert.equal(slug, 'biologia-celular');
    assert.equal(page, macro.items[i].page || macro.items[i].pages[0].page);
    assert.equal(refs, macro.items[i].pages);
    assert.equal(get('itc-premonition-dialog').open, true);
    assert.equal(button.disabled, false);
  }
  context.window.loadCampusAssets = async () => { throw new Error('offline'); };
  await context.readPremonition(0, button);
  assert.match(get('itc-premonition-status').textContent, /reintentar/);
  assert.equal(button.disabled, false);
  context.window.loadCampusAssets = async () => { context.currentUser = { id: 'another-student' }; };
  const before = calls.length;
  await context.readPremonition(0, button);
  assert.equal(calls.length, before, 'una lectura pendiente se cancela si cambia la cuenta');
  free = true;
  await context.readPremonition(0, button);
  assert.equal(calls.at(-1), 'locked');
});

test('la imagen original se conserva íntegra y las diez zonas se mantienen dentro de sus renglones', () => {
  const macro = premoniciones.find(item => item.id === 'premo-bio-05');
  const original = fs.readFileSync('api/_premoniciones/' + macro.image.file);
  assert.equal(crypto.createHash('sha256').update(original).digest('hex'), macro.image.sha256);
  assert.equal(macro.image.sha256, '9e40bf9ac309c4a8973d1caa9a3ab45ef263d4ed32c39bfe4e5a1d974d245693');
  assert.equal(original.readUInt32BE(16), macro.image.width);
  assert.equal(original.readUInt32BE(20), macro.image.height);
  for (const [index, entry] of macro.items.entries()) {
    const [x, y, width, height] = entry.region;
    assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0);
    assert.ok(x + width <= macro.image.width && y + height <= macro.image.height);
    const next = macro.items[index + 1];
    if (next) assert.ok(y + height <= next.region[1], 'las zonas no se superponen');
  }
});

test('la imagen de la premonición exige el mismo acceso que su lectura y devuelve los bytes originales', async () => {
  const handler = require('../api/premoniciones.js');
  const request = { method: 'GET', query: { id: 'premo-bio-05', format: 'image' }, headers: {} };
  const response = () => ({
    headers: {}, statusCode: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(value) { this.statusCode = value; return this; },
    end(body) { this.body = body; return this; },
  });
  let res = response();
  await handler(request, res);
  assert.equal(res.statusCode, 401);
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: false }) });
    request.headers.authorization = 'Bearer student';
    res = response();
    await handler(request, res);
    assert.equal(res.statusCode, 403);
    assert.equal(res.body, undefined);
    global.fetch = async () => ({ ok: true, json: async () => ({ ready: true, premium: true }) });
    res = response();
    await handler(request, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['Content-Type'], 'image/png');
    assert.equal(res.headers['Cache-Control'], 'private, no-store');
    assert.deepEqual(res.body, fs.readFileSync('api/_premoniciones/images/macrotransporte.png'));
  } finally {
    global.fetch = originalFetch;
  }
});
