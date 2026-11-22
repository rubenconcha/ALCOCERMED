const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const loginSource = fs.readFileSync('campus-login.js', 'utf8');
const html = fs.readFileSync('campus.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const registro = fs.readFileSync('registro.html', 'utf8');
const registration = fs.readFileSync('registration.js', 'utf8');

test('una cuenta demo de Juegos no entra al campus y se explica el motivo', async () => {
  const start = loginSource.indexOf('let campusEntry = null;');
  const end = loginSource.indexOf('/** handleLogin */', start);
  const events = [];
  const demo = { id: 'demo-1', email: 'olga.claros.05j6y@demo.alcocermed.app' };
  const context = {
    currentUser: demo, currentCampusSessionId: 'session-1',
    verifiedCampusUserId: null, verifiedCampusSessionId: null, campusSigningOut: false, ADMIN_EMAILS: [],
    document: { body: { classList: { contains: () => false } } },
    window: { loadCampusAssets: async () => {}, CampusStudy: { activate() { events.push('entered'); } } },
    DeviceGuard: { activateDevice: async () => ({ ok: true, access: { ready: true, premium: true } }) },
    getSupabase: () => ({ auth: { signOut: async () => { events.push('sign-out'); } } }),
    setCampusSession() {},
    showLoginScreen() { events.push('login'); },
    showLoginError() {},
    showLoginNotice(message) { events.push(message); },
  };
  vm.runInNewContext(loginSource.slice(start, end), context);
  await context.enterApp(demo);
  assert.equal(events.includes('entered'), false);
  assert.ok(events.includes('login'));
  assert.ok(events.some(message => /cuenta demo de Juegos/.test(message)));
});

test('el campus ya no inicia sesión automáticamente con la sesión guardada', () => {
  const init = loginSource.slice(loginSource.indexOf('async function initAuth()'), loginSource.indexOf('function showLoginScreen()'));
  assert.ok(init.length > 0);
  assert.doesNotMatch(init, /setCampusSession\(session\);\s*await enterApp/);
  assert.match(init, /if \(session\?\.user && !currentUser\) \{[\s\S]*?showLoginScreen\(\)/);
  assert.match(init, /Por seguridad, elige tu cuenta e inicia sesión para continuar\./);
  assert.match(init, /isDemoGuestUser\(session\.user\)/);
});

test('el login muestra el aviso y la versión nueva de los archivos', () => {
  assert.match(html, /id="login-notice"/);
  assert.match(html, /campus-login\.js\?v=9/);
  assert.match(html, /campus-access\.css\?v=5/);
  assert.match(fs.readFileSync('campus-access.css', 'utf8'), /\.login-notice\{/);
  const cacheVersion = Number(sw.match(/CACHE_NAME = 'alcocermed-main-v(\d+)-[^']+'/)?.[1]);
  assert.ok(cacheVersion >= 209, 'mantiene una versión de caché igual o más reciente');
  assert.match(sw, /'\.\/campus-login\.js\?v=9'/);
});

test('el registro cierra la sesión anterior antes de crear la cuenta nueva', () => {
  assert.match(registro, /registration\.js\?v=3/);
  assert.match(registration, /signOut\(\{scope:'local'\}\)/);
  assert.match(registration, /Cerramos la sesión anterior para que puedas crear una cuenta nueva\./);
});
