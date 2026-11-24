const {test}=require('node:test'); const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function setup(response){
  const elements=new Map();
  const el=id=>{if(!elements.has(id))elements.set(id,{hidden:true});return elements.get(id)};
  const classes=new Set();
  let email='';
  const context={
    window:{location:{href:''},dispatchEvent(){},
      get CampusStudentEmail(){return email}, set CampusStudentEmail(value){email=value}},
    document:{body:{classList:{toggle(name,on){on?classes.add(name):classes.delete(name)}}},getElementById:el,querySelectorAll:()=>[]},
    Date,Event:class Event{constructor(type){this.type=type}}
  };
  vm.createContext(context);vm.runInContext(fs.readFileSync('campus-access.js','utf8'),context);
  return {access:context.window.CampusAccess,client:{rpc:async()=>response},el,classes,location:context.window.location,window:context.window};
}
test('una cuenta registrada sin plan entra al campus pero solo ve Inicio',async()=>{
  const t=setup({data:{ready:true,premium:false,expires_at:'2020-01-01T00:00:00Z'}});
  await t.access.resolve(t.client);
  assert.ok(t.access.isFree());
  assert.ok(t.access.isRegistered());
  assert.equal(t.access.permits('home-screen'),true);
  for(const screen of ['study-library','flashcards-screen','simulations-screen','atlas-screen','videoclases-screen','study-calendar-screen','campus-information-screen'])assert.equal(t.access.permits(screen),false);
  assert.equal(t.el('free-account-banner').hidden,false);
  assert.ok(t.classes.has('campus-pending'));
});
test('el aviso de cuenta registrada muestra el correo para activarla por WhatsApp',async()=>{
  const t=setup({data:{ready:true,premium:false}});
  t.window.CampusStudentEmail='estudiante+turno@correo.com';
  await t.access.resolve(t.client);
  assert.equal(t.el('free-account-email').textContent,'estudiante+turno@correo.com');
  const href=t.el('free-account-whatsapp').href;
  assert.match(href,/^https:\/\/wa\.me\/59175960539\?text=/);
  assert.equal(new URL(href).searchParams.get('text'),'Hola, me registré en AlcocerMed con el correo estudiante+turno@correo.com y quiero activar mi cuenta.');
});
test('verified current subscription unlocks resources',async()=>{
  const t=setup({data:{ready:true,premium:true,expires_at:'2099-01-01T00:00:00Z'}});
  await t.access.resolve(t.client);
  assert.ok(!t.access.isFree());
  assert.equal(t.access.permits('home-screen'),true);
  assert.equal(t.access.permits('study-library'),true);
  assert.equal(t.access.permits('atlas-screen'),false);
  assert.equal(t.el('free-account-banner').hidden,true);
  assert.ok(!t.classes.has('campus-pending'));
});
test('access errors never unlock a new account',async()=>{
  const t=setup({error:{message:'offline'}});
  await assert.rejects(t.access.resolve(t.client));
  assert.ok(t.access.isFree());
  assert.equal(t.access.permits('home-screen'),false);
});
test('el cierre de sesión quita el Inicio y el aviso de la cuenta',async()=>{
  const t=setup({data:{ready:true,premium:false}});
  await t.access.resolve(t.client);
  t.access.reset();
  assert.equal(t.access.permits('home-screen'),false);
  assert.equal(t.el('free-account-banner').hidden,true);
  assert.ok(!t.classes.has('campus-pending'));
});
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

test('el login público ofrece registrarse y /registro abre el alta de estudiantes', () => {
  const { redirects, rewrites } = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  for (const route of ['/', '/planes', '/propedeutico', '/index.html', '/ventas.html']) {
    assert.equal(redirects.find(redirect => redirect.source === route)?.destination, '/campus', route);
  }
  assert.equal(redirects.find(redirect => redirect.source === '/registro'), undefined);
  assert.equal(redirects.find(redirect => redirect.source === '/registro.html'), undefined);
  assert.equal(rewrites.find(rewrite => rewrite.source === '/registro')?.destination, '/registro.html');
  assert.equal(rewrites.find(rewrite => rewrite.source === '/campus')?.destination, '/campus.html');
  const login = fs.readFileSync('campus.html', 'utf8').split('<!-- Decoración flotante -->')[0];
  assert.match(login, /onclick="continueWithGoogle\(this\)"/);
  assert.match(login, /<form id="login-form"[^>]* onsubmit="handleLogin\(event\)"/);
  assert.match(login, /href="\/recuperar\.html"/);
  assert.match(login, /<p class="login-register">[^<]*<a href="\/registro">Regístrate aquí<\/a>/);
  assert.match(login, /<div class="login-assistance">\s*<a href="https:\/\/wa\.me\/59175960539"/);
});

test('contactos directos de la prepa usan Omar sin redirigir soporte de login ni pagos', () => {
  const extractLinks = name => Array.from(fs.readFileSync(name,'utf8').matchAll(/<a\b[^>]*\bhref="(https:\/\/wa\.me\/[^"]+)"[^>]*>/g),
      ([tag,href]) => ({tag,url:new URL(href)}));
  const campus=extractLinks('campus.html');
  assert.equal(campus.filter(({url})=>url.pathname==='/59175960539').length,6);
  for(const id of ['free-account-whatsapp','atlas-enrollment-whatsapp','campus-toolbar-support','support-float']) {
    assert.equal(campus.find(({tag})=>tag.includes(id))?.url.pathname,'/59175960539',id);
  }
  assert.equal(campus.find(({url})=>url.searchParams.get('text')?.includes('necesito ayuda para ingresar'))?.url.pathname,'/59173752688');
  const sales=extractLinks('ventas.html');
  assert.equal(sales.find(({tag})=>tag.includes('support-whatsapp'))?.url.pathname,'/59175960539');
  assert.equal(sales.find(({tag})=>tag.includes('planWhatsApp'))?.url.pathname,'/59173752688');
  assert.equal(extractLinks('juegos/index.html')[0]?.url.pathname,'/59175960539');
  assert.equal(extractLinks('dispositivos.html')[0]?.url.pathname,'/59164840819');
});

test('la página de registro crea la cuenta y guarda el correo sin pedir plan', () => {
  const page = fs.readFileSync('registro.html', 'utf8');
  const script = fs.readFileSync('registration.js', 'utf8');
  assert.match(page, /<form id="register-form"/);
  assert.match(page, /id="register-email"/);
  assert.match(page, /registration\.js\?v=3/);
  const campusAccessAsset=fs.readFileSync('campus.html','utf8').match(/campus-access\.js\?v=\d+/)?.[0];
  assert.ok(campusAccessAsset);
  assert.ok(page.includes(campusAccessAsset));
  assert.ok(fs.readFileSync('sw.js','utf8').includes(campusAccessAsset));
  assert.match(page, /href="\/ingresar"/);
  assert.doesNotMatch(script, /rpc\('campus_access'\)/);
  assert.match(script, /auth\.signUp/);
  assert.match(script, /signOut\(\{scope:'local'\}\)/);
  assert.match(script, /location\.assign\('\/campus'\)/);
  assert.doesNotMatch(script, /premium\s*:|role\s*:/);
  assert.doesNotMatch(script, /muestra sin registro/);
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

test('a videos-only entitlement stays on Inicio; stale refreshes cannot revoke the next premium session', async () => {
  const t = setup({ data: { ready: true, premium: false, atlas: false, videos: true } });
  await t.access.resolve(t.client);
  assert.equal(t.access.permits('videoclases-screen'), false);
  assert.equal(t.access.isFree(), true);
  assert.equal(t.access.permits('home-screen'), true);
  for (const screen of ['atlas-screen', 'game-quiz', 'game-hangman', 'study-calendar-screen']) {
    assert.equal(t.access.permits(screen), false);
  }
  t.access.apply({ready:true,premium:true,atlas:true});
  assert.equal(await t.access.refresh({ rpc: async () => ({
    data: { ready: true, premium: false, atlas: false, videos: false },
  }) }, () => false), false);
  assert.equal(t.access.permits('videoclases-screen'), true);
  await assert.rejects(t.access.refresh({ rpc: async () => ({
    data: { ready: true, premium: false, atlas: false, videos: false },
  }) }, () => true), {code:'PREMIUM_REQUIRED'});
  assert.equal(t.access.permits('videoclases-screen'), false);
});
