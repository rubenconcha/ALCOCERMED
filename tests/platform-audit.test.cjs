const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function worker(file) {
  const events = {}, writes = [], deleted = [], matches = [];
  let response = { ok: true, status: 200, type: 'basic', headers: { get: () => '' }, clone: () => ({}) };
  const context = {
    self: { location: { origin: 'https://alcocermed.com' }, addEventListener: (name, fn) => { events[name] = fn; }, skipWaiting() {}, clients: { claim() {} } },
    caches: {
      keys: async () => ['alcocermed-main-old', 'alcocermed-juegos-old', 'another-app'],
      delete: async key => { deleted.push(key); },
      open: async () => ({ put: async req => { writes.push(req.url); } }),
      match: async key => {
        matches.push(key);
        return key === './campus.html' ? { campus: true } : undefined;
      }
    },
    fetch: async () => {
      if (!response) throw new Error('offline');
      return response;
    }, URL
  };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
  return { events, writes, deleted, matches, response: value => { response = value; } };
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
  const source = fs.readFileSync('campus-login.js', 'utf8');
  const start = source.indexOf('function enterApp(');
  const end = source.indexOf('/** handleLogin */', start);
  const context = {
    verifiedCampusUserId: 'student-1', currentUser: { id: 'student-1' },
    currentCampusSessionId: 'session-1', verifiedCampusSessionId: 'session-1', campusSigningOut: false,
    document: { body: { classList: { contains: () => false } } },
    Promise
  };
  vm.runInNewContext(source.slice(start, end), context);
  // No cliente ni navegación: si intenta reiniciar la entrada, esta prueba falla.
  await context.enterApp({ id: 'student-1' });
});

test('un dispositivo rechazado no abre el campus ni consulta los permisos de estudio', async () => {
  const source = fs.readFileSync('campus-login.js', 'utf8');
  const start = source.indexOf('let campusEntry = null;');
  const end = source.indexOf('/** handleLogin */', start);
  const student = { id: 'student-1', email: 'student@example.invalid' };
  const events = [];
  let finishDevice;
  const context = {
    currentUser: student, currentCampusSessionId: 'session-1', verifiedCampusUserId: null,
    campusSigningOut: false, ADMIN_EMAILS: [],
    setCampusSession() { context.currentUser = null; context.currentCampusSessionId = null; },
    getSupabase: () => ({ auth: { signOut: async () => { events.push('sign-out'); } } }),
    DeviceGuard: {
      activateDevice: () => new Promise(resolve => { finishDevice = resolve; }),
      showDeviceLimit(email) { events.push(email); }
    },
    CampusAccess: { check: async () => { events.push('check'); return { ready: true }; }, apply: () => events.push('apply') },
    showLoginScreen() {},
    showLoginError(message) { events.push(message); },
    window: { loadCampusAssets: async () => {} },
  };
  vm.runInNewContext(source.slice(start, end), context);
  const entry = context.enterApp(student);
  assert.deepEqual(events, []);
  finishDevice({ ok: false, code: 'DEVICE_LIMIT', error: 'Dispositivo bloqueado' });
  await entry;
  assert.deepEqual(events, ['sign-out', 'Dispositivo bloqueado', student.email]);
});

test('una respuesta anterior de la misma cuenta no puede cerrar la nueva sesión', async () => {
  const source = fs.readFileSync('campus-login.js', 'utf8');
  const student = { id: 'student-1', email: 'student@example.invalid' };
  const requests = [];
  let entries = 0;
  const context = {
    currentUser: student, currentCampusSessionId: 'session-1', verifiedCampusUserId: null,
    verifiedCampusSessionId: null, campusSigningOut: false, ADMIN_EMAILS: [],
    getSupabase: () => ({ auth: { signOut: () => assert.fail('cerró la sesión nueva') } }),
    DeviceGuard: { activateDevice: () => new Promise(resolve => requests.push(resolve)) },
    window: { loadCampusAssets: async () => {}, CampusStudy: { activate() { entries++; } } },
  };
  vm.runInNewContext(source.slice(source.indexOf('let campusEntry = null;'), source.indexOf('/** handleLogin */')), context);
  const oldEntry = context.enterApp(student);
  context.currentCampusSessionId = 'session-2';
  const newEntry = context.enterApp(student);
  requests[0]({ ok: false, code: 'DEVICE_LIMIT' });
  requests[1]({ ok: true, access: { ready: true } });
  await Promise.all([oldEntry, newEntry]);
  assert.equal(entries, 1);
  assert.equal(context.verifiedCampusSessionId, 'session-2');
});

test('al volver al navegador, una sesión desplazada se cierra una sola vez', async () => {
  const handlers = new Map();
  const events = {
    addEventListener: (name, fn) => handlers.set(name, fn),
    removeEventListener: (name, fn) => {
      if (handlers.get(name) === fn) handlers.delete(name);
    }
  };
  const context = {
    window: events, document: { ...events, visibilityState: 'visible' },
    localStorage: { getItem: () => 'qa-pc' },
    setInterval: () => 1, clearInterval() {}, console
  };
  vm.runInNewContext(fs.readFileSync('device_guard.js', 'utf8'), context);
  let calls = 0, kicked = 0, finish;
  const client = {
    rpc(name, args) {
      assert.equal(name, 'check_device_active');
      assert.equal(args.p_device_id, 'qa-pc');
      calls++;
      return new Promise(resolve => { finish = resolve; });
    }
  };
  context.DeviceGuard.startChecking(client, () => { kicked++; });
  const first = handlers.get('focus')();
  await handlers.get('visibilitychange')();
  assert.equal(calls, 1);
  context.DeviceGuard.startChecking(client, () => { kicked++; });
  finish({ data: { active: false } });
  await first;
  assert.equal(kicked, 0);
  const current = handlers.get('pageshow')();
  finish({ data: { active: false } });
  await current;
  assert.equal(kicked, 1);
  assert.equal(handlers.size, 0);
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

test('volver a Juegos conserva la partida y un cambio de sesión vuelve a verificar', () => {
  const source = fs.readFileSync('juegos/app.js', 'utf8').replace(/\r\n/g, '\n');
  const start = source.indexOf('    client.auth.onAuthStateChange(function(event, session)');
  const end = source.indexOf('\n}\n', start);
  let listener, entries = 0;
  const scheduled = [];
  const context = {
    client: { auth: { onAuthStateChange: fn => { listener = fn; } } },
    currentUser: { id: 'student-1' }, gameAuthSessionId: 'session-1', gameSigningOut: false,
    setGameSession(session) {
      context.currentUser = session.user;
      context.gameAuthSessionId = session.id;
    },
    isDemoGuestExpired: () => false,
    setTimeout: fn => scheduled.push(fn),
    document: { getElementById: () => ({ classList: { contains: () => false } }) },
    enterApp: () => { entries++; }
  };
  vm.runInNewContext(source.slice(start, end), context);
  listener('SIGNED_IN', { user: { id: 'student-1' }, id: 'session-1' });
  assert.equal(scheduled.length, 0);
  listener('SIGNED_IN', { user: { id: 'student-1' }, id: 'session-2' });
  assert.equal(scheduled.length, 1);
  listener('SIGNED_IN', { user: { id: 'student-2' }, id: 'session-3' });
  assert.equal(entries, 0);
  for (const verify of scheduled) verify();
  assert.equal(entries, 1);
});

test('sin conexión, el inicio y los enlaces antiguos a planes usan la pantalla de ingreso', async () => {
  const w = worker('sw.js');
  w.response(null);
  for (const path of ['/', '/planes?desde=campus']) {
    let completion;
    w.events.fetch({
      request: { url: 'https://alcocermed.com' + path, method: 'GET', mode: 'navigate' },
      respondWith: promise => { completion = promise; }
    });
    assert.deepEqual(await completion, { campus: true });
  }
  assert.deepEqual(w.matches.filter(key => typeof key === 'string'), ['./campus.html', './campus.html']);
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
