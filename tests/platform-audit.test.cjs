const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function worker(file) {
  const events = {}, writes = [], deleted = [];
  let response = { ok: true, status: 200, type: 'basic', headers: { get: () => '' }, clone: () => ({}) };
  const context = {
    self: { location: { origin: 'https://alcocermed.com' }, addEventListener: (name, fn) => { events[name] = fn; }, skipWaiting() {}, clients: { claim() {} } },
    caches: {
      keys: async () => ['alcocermed-main-old', 'alcocermed-juegos-old', 'another-app'],
      delete: async key => { deleted.push(key); },
      open: async () => ({ put: async req => { writes.push(req.url); } }),
      match: async () => undefined
    },
    fetch: async () => response, URL
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
  return { events, writes, deleted, response: value => { response = value; } };
}

for (const [file, prefix] of [['sw.js', 'alcocermed-main-'], ['juegos/sw.js', 'alcocermed-juegos-']]) {
  test(`${file}: actualizar la aplicación conserva la caché de la otra sección`, async () => {
    const w = worker(file);
    let completion;
    w.events.activate({ waitUntil: promise => { completion = promise; } });
    await completion;
    assert.deepEqual(w.deleted, [prefix + 'old']);
  });
  test(`${file}: no guarda respuestas privadas ni peticiones de cuentas`, async () => {
    const w = worker(file);
    let completion;
    const run = url => w.events.fetch({ request: { url, method: 'GET' }, respondWith: promise => { completion = promise; } });
    run('https://alcocermed.com/api/resumen?file=morfofuncion-tema-3');
    assert.equal(completion, undefined);
    run('https://example.supabase.co/auth/v1/user');
    assert.equal(completion, undefined);
    w.response({ ok: true, status: 200, type: 'basic', headers: { get: () => 'private, no-store' } });
    run('https://alcocermed.com/private-resource');
    await completion;
    assert.deepEqual(w.writes, []);
    w.response({ ok: true, status: 200, type: 'basic', headers: { get: () => 'public, max-age=3600' }, clone: () => ({}) });
    run('https://alcocermed.com/assets/example.webp');
    await completion;
    assert.deepEqual(w.writes, ['https://alcocermed.com/assets/example.webp']);
  });
}

test('una comprobación repetida de la misma sesión conserva la sección del campus', async () => {
  const source = fs.readFileSync('script.js', 'utf8');
  const start = source.indexOf('function enterApp(user)');
  const end = source.indexOf('function enterVerifiedApp(user)', start);
  const context = {
    verifiedCampusUserId: 'student-1', currentUser: { id: 'student-1' },
    document: { body: { classList: { contains: () => false } } },
    Promise
  };
  vm.runInNewContext(source.slice(start, end), context);
  // No cliente ni navegación: si intenta reiniciar la entrada, esta prueba falla.
  await context.enterApp({ id: 'student-1' });
});

test('los archivos precargados coinciden con las versiones actuales de campus y juegos', () => {
  for (const [html, sw] of [['campus.html', 'sw.js'], ['juegos/index.html', 'juegos/sw.js']]) {
    const page = fs.readFileSync(html, 'utf8'), worker = fs.readFileSync(sw, 'utf8');
    for (const [, src] of page.matchAll(/(?:src|href)="([^"#]+\.(?:js|css)\?v=\d+)"/g)) {
      if (src.startsWith('http')) continue;
      assert.ok(worker.includes(src), `${sw} no precarga ${src}`);
    }
  }
});

test('volver a la ventana de Juegos no reinicia una partida por SIGNED_IN repetido', () => {
  const source = fs.readFileSync('juegos/app.js', 'utf8').replace(/\r\n/g, '\n');
  const start = source.indexOf('    client.auth.onAuthStateChange(function(event, session)');
  const end = source.indexOf('\n}\n', start);
  let listener, entries = 0;
  const context = {
    client: { auth: { onAuthStateChange: fn => { listener = fn; } } },
    currentUser: { id: 'student-1' },
    isDemoGuestExpired: () => false,
    document: { getElementById: () => ({ classList: { contains: () => false } }) },
    enterApp: () => { entries++; }
  };
  vm.runInNewContext(source.slice(start, end), context);
  listener('SIGNED_IN', { user: { id: 'student-1' } });
  assert.equal(entries, 0);
  listener('SIGNED_IN', { user: { id: 'student-2' } });
  assert.equal(entries, 1);
});

test('desbloquear desde Resúmenes recuerda esa sección', () => {
  let saved;
  const context = {
    currentCampusScreen: 'resumenes-screen',
    window: { location: {} }, document: { getElementById: () => null },
    sessionStorage: { setItem: (key, value) => { saved = JSON.parse(value); } }
  };
  vm.runInNewContext(fs.readFileSync('campus-access.js', 'utf8'), context);
  context.window.CampusAccess.unlock();
  assert.equal(saved.screen, 'resumenes-screen');
  assert.equal(context.window.location.href, '/planes?desde=campus');
});

test('volver desde planes a Resúmenes abre el listado, sin enviarlo al inicio', async () => {
  const source = fs.readFileSync('script.js', 'utf8');
  const start = source.indexOf('async function restoreCampusAfterPlans()');
  const end = source.indexOf('/** handleLogin */', start);
  let opened = false;
  const context = {
    window: { location: { search: '?volver=campus', pathname: '/campus' } },
    sessionStorage: { getItem: () => '{"screen":"resumenes-screen"}', removeItem() {} },
    history: { replaceState() {} }, document: { title: '' }, URLSearchParams,
    openResumenes: () => { opened = true; }
  };
  await vm.runInNewContext(source.slice(start, end) + '\nrestoreCampusAfterPlans()', context);
  assert.ok(opened);
});
