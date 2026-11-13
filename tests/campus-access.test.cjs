const {test}=require('node:test'); const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function setup(response){const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,{hidden:true});return elements.get(id)};const context={window:{location:{href:''},dispatchEvent(){}},document:{body:{classList:{toggle(){}}},getElementById:el,querySelectorAll:()=>[]},Date,Event:class Event{constructor(type){this.type=type}}};vm.createContext(context);vm.runInContext(fs.readFileSync('campus-access.js','utf8'),context);return {access:context.window.CampusAccess,client:{rpc:async()=>response},el,location:context.window.location};}
test('server-classified free account is locked',async()=>{const t=setup({data:{ready:true,premium:false,expires_at:'2020-01-01T00:00:00Z'}});await t.access.resolve(t.client);assert.ok(t.access.isFree());assert.equal(t.el('free-account-banner').hidden,false)});
test('verified current subscription unlocks resources',async()=>{const t=setup({data:{ready:true,premium:true,expires_at:'2099-01-01T00:00:00Z'}});await t.access.resolve(t.client);assert.ok(!t.access.isFree());assert.equal(t.el('free-account-banner').hidden,true)});
test('access errors never unlock a new account',async()=>{const t=setup({error:{message:'offline'}});await assert.rejects(t.access.resolve(t.client));assert.ok(t.access.isFree())});
test('locked content offers WhatsApp without leaving the current page', () => {
  const t = setup({});
  const dialog = t.el('campus-unlock');
  let openings = 0;
  dialog.showModal = () => { dialog.open = true; openings++; };
  t.access.unlock();
  t.access.unlock();
  assert.equal(openings, 1);
  assert.equal(t.location.href, '');
});

test('the public entry and former sales routes lead to the existing login', () => {
  const { redirects, rewrites } = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  for (const route of ['/', '/planes', '/propedeutico', '/index.html', '/ventas.html']) {
    assert.equal(redirects.find(redirect => redirect.source === route)?.destination, '/campus', route);
  }
  assert.equal(rewrites.find(rewrite => rewrite.source === '/campus')?.destination, '/campus.html');
  const login = fs.readFileSync('campus.html', 'utf8').split('<!-- Decoración flotante -->')[0];
  assert.match(login, /onclick="continueWithGoogle\(this\)"/);
  assert.match(login, /<form id="login-form"[^>]* onsubmit="handleLogin\(event\)"/);
  assert.match(login, /href="\/recuperar\.html"/);
  assert.match(login, /<div class="login-assistance">\s*<a href="https:\/\/wa\.me\/59177921731"[^>]*>Inscríbete al curso por WhatsApp<\/a>/);
});

test('password login accepts a full email or a username assigned by the prepa', async () => {
  const source = fs.readFileSync('campus-login.js', 'utf8');
  const start = source.indexOf('window.handleLogin =');
  const end = source.indexOf('/** Toggle visibilidad contraseña */', start);
  assert.ok(start >= 0 && end > start);
  const fields = { 'login-email': { value: '' }, 'login-password': { value: 'test-password' } };
  const emails = [];
  const errors = [];
  const context = {
    window: { loadCampusAssets: async () => {} },
    document: { getElementById: id => fields[id] },
    currentUser: { id: 'test-student' },
    campusSigningOut: false,
    hideLoginError() {},
    showLoginError: message => errors.push(message),
    setLoginLoading() {},
    ensureSupabaseSdk: async () => {},
    getSupabase: () => ({
      auth: { signInWithPassword: async ({ email }) => {
        emails.push(email);
        return { data: { session: {} } };
      } }
    }),
    setCampusSession() {},
    enterApp: async () => {}
  };
  vm.runInNewContext(source.slice(start, end), context);
  for (const value of ['student@example.invalid', ' Student.Test ', 'student.test@prepa.com', 'no válido@']) {
    fields['login-email'].value = value;
    await context.window.handleLogin({ preventDefault() {} });
  }
  assert.deepEqual(emails, ['student@example.invalid', 'student.test@prepa.com', 'student.test@prepa.com']);
  assert.deepEqual(errors, ['escribe tu correo completo o tu usuario asignado']);
});
test('signup does not claim a paid role; Google requests account selection',()=>{const s=fs.readFileSync('registration.js','utf8');assert.doesNotMatch(s,/premium\s*:|role\s*:/);assert.match(fs.readFileSync('campus-access.js','utf8'),/prompt:'select_account'/)});

test('a videos-only entitlement opens videoclases while full campus features stay restricted', async () => {
  const t = setup({ data: { ready: true, premium: false, atlas: false, videos: true } });
  await t.access.resolve(t.client);
  assert.equal(t.access.permits('videoclases-screen'), true);
  assert.equal(t.access.isFree(), true);
  for (const screen of ['atlas-screen', 'game-quiz', 'game-hangman', 'study-calendar-screen']) {
    assert.equal(t.access.permits(screen), false);
  }
  assert.equal(await t.access.refresh({ rpc: async () => ({
    data: { ready: true, premium: false, atlas: false, videos: false },
  }) }, () => false), false);
  assert.equal(t.access.permits('videoclases-screen'), true);
  await t.access.refresh({ rpc: async () => ({
    data: { ready: true, premium: false, atlas: false, videos: false },
  }) }, () => true);
  assert.equal(t.access.permits('videoclases-screen'), false);
});
