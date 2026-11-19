const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const premoniciones = require('../api/_premoniciones/premoniciones.json');
const html = fs.readFileSync('campus.html', 'utf8');
const hub = fs.readFileSync('intocables-hub.js', 'utf8');
const css = fs.readFileSync('intocables-sheets.css', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

test('el material tiene las siete premociones de Morfofunción con sus listas', () => {
  assert.equal(premoniciones.length, 7);
  assert.deepEqual(premoniciones.map(item => item.orden), [1, 2, 5, 6, 7, 8, 9]);
  assert.ok(premoniciones.every(item => item.materia === 'Morfofunción'));
  assert.ok(premoniciones.every(item => /^Capítulo \d+$/.test(item.capitulo)));
  assert.ok(premoniciones.every(item => Array.isArray(item.items) && item.items.length >= 11));
  assert.equal(new Set(premoniciones.map(item => item.id)).size, 7);
  assert.ok(premoniciones.reduce((total, item) => total + item.items.length, 0) >= 90);
});

test('el catálogo público de Intocables incluye la subdivisión de premociones', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync('campus-catalogs.js', 'utf8'), context);
  const list = context.window.CampusCatalogs.premoniciones;
  assert.equal(list.length, 7);
  assert.deepEqual(Array.from(list, item => item.count), premoniciones.map(item => item.items.length));
  assert.ok(list.every(item => !('items' in item)));
});

test('Intocables muestra Láminas y la nueva subdivisión Premoniciones Ben Carson', () => {
  assert.match(html, /<button type="button" data-format="sheets"[^>]*>Láminas<\/button>/);
  assert.match(html, /data-format="premoniciones"[^>]*>Premoniciones Ben Carson<\/button>/);
  assert.match(html, /id="itc-premonition-dialog"/);
  assert.match(html, /id="itc-premonition-list"/);
  assert.match(html, /intocables-hub\.js\?v=7/);
  assert.match(html, /intocables-sheets\.css\?v=2/);
  assert.match(html, /campus-catalogs\.js\?v=4/);
  assert.match(css, /\.itc-premonition-list/);
  assert.match(css, /\.itc-premonition-banner/);
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
  assert.match(sw, /CACHE_NAME = 'alcocermed-main-v209-sesion-demo'/);
  assert.match(sw, /'\.\/intocables-hub\.js\?v=7'/);
  assert.match(sw, /'\.\/intocables-sheets\.css\?v=2'/);
});
