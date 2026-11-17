const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const accessSource=fs.readFileSync('campus-access.js','utf8');
const loginSource=fs.readFileSync('campus-login.js','utf8');
function entryFixture(access) {
  const events=[];
  const student={id:'student',email:'student@example.invalid',user_metadata:{premium:true}};
  const context={
    window:{dispatchEvent(){},loadCampusAssets:async()=>{},CampusStudy:{activate(user,permissions){context.CampusAccess.apply(permissions);events.push('entered');}}},
    document:{body:{classList:{toggle(){},contains:()=>true}},getElementById:()=>null,querySelectorAll:()=>[]},
    Event:class {},Date,currentUser:student,currentCampusSessionId:'session',verifiedCampusSessionId:null,campusSigningOut:false,ADMIN_EMAILS:[],
    DeviceGuard:{activateDevice:async()=>({ok:true,access})},
    getSupabase:()=>({rpc:async()=>assert.fail('device response is already authoritative'),auth:{signOut:async()=>events.push('signed-out')}}),
    setCampusSession(){context.currentUser=null;context.currentCampusSessionId=null;},
    showLoginScreen(){context.CampusAccess.reset();events.push('login');},
    showLoginError(message){events.push(message);},
  };
  vm.createContext(context);vm.runInContext(accessSource,context);
  context.CampusAccess=context.window.CampusAccess;
  vm.runInContext(loginSource.slice(loginSource.indexOf('let campusEntry = null;'),loginSource.indexOf('/** handleLogin */')),context);
  return {context,events,enter:()=>context.enterApp(student)};
}
for (const [name,access] of Object.entries({
  nueva:{ready:true,premium:false},
  solo_videos:{ready:true,premium:false,videos:true},
  solo_atlas:{ready:true,premium:false,atlas:true},
  vencida:{ready:true,premium:true,expires_at:'2020-01-01'},
  prueba:{ready:true,premium:true,trial:true},
  fecha_invalida:{ready:true,premium:true,expires_at:'invalid'},
  servidor_pendiente:{ready:false,premium:false,code:'PREMIUM_REQUIRED'},
})) test(`ingreso ${name}: entra al campus pero solo puede abrir Inicio`,async()=>{
  const f=entryFixture(access);await f.enter();
  assert.ok(f.events.includes('entered'));
  assert.equal(f.events.includes('signed-out'),false);
  assert.equal(f.context.CampusAccess.permits('home-screen'),true);
  for (const screen of ['study-library','flashcards-screen','banco-screen','past-exams-screen','simulacro-screen','atlas-screen','videoclases-screen','study-calendar-screen']) {
    assert.equal(f.context.CampusAccess.permits(screen),false,screen);
  }
});
test('Premium vigente entra y el cierre de sesión elimina los permisos anteriores',async()=>{
  const f=entryFixture({ready:true,premium:true,atlas:true,expires_at:'2099-01-01'});await f.enter();
  assert.deepEqual(f.events,['entered']);
  assert.ok(f.context.CampusAccess.permits('home-screen'));
  assert.ok(f.context.CampusAccess.permits('study-library'));
  f.context.CampusAccess.reset();
  assert.equal(f.context.CampusAccess.permits('home-screen'),false);
  assert.equal(f.context.CampusAccess.canUseVideos(),false);
});
test('un fallo al comprobar el acceso nunca activa el campus',async()=>{
  const f=entryFixture({ready:false});await f.enter();
  assert.equal(f.events.includes('entered'),false);
  assert.ok(f.events.includes('login'));
});
test('Google puede iniciar OAuth sin sesión; la comprobación de cuenta ocurre después',async()=>{
  const calls=[];
  const context={window:{},document:{getElementById:()=>({})},ensureSupabaseSdk:async()=>{},
    getSupabase:()=>({rpc:()=>assert.fail('No hay cuenta antes de OAuth'),auth:{signInWithOAuth:async options=>{calls.push(options);return {};}}}),
    SUPABASE_URL:'https://example.invalid',SUPABASE_KEY:'public-anon',location:{origin:'https://alcocermed.com'},
    fetch:async()=>({ok:true,json:async()=>({external:{google:true}})})};
  vm.runInNewContext(accessSource,context);await context.window.continueWithGoogle({});
  assert.equal(calls.length,1);assert.equal(calls[0].provider,'google');
  assert.equal(calls[0].options.redirectTo,'https://alcocermed.com/campus');
});
test('una sesión abierta vuelve al login al perder Premium y detiene las comprobaciones',async()=>{
  const handlers=new Map(),reasons=[];
  const listeners={addEventListener:(name,fn)=>handlers.set(name,fn),removeEventListener:name=>handlers.delete(name)};
  const context={window:listeners,document:{...listeners,visibilityState:'visible'},localStorage:{getItem:()=> 'test-device'},setInterval:()=>1,clearInterval(){},console};
  vm.runInNewContext(fs.readFileSync('device_guard.js','utf8'),context);
  context.DeviceGuard.startChecking({rpc:async()=>({data:{active:false,code:'PREMIUM_REQUIRED'}})},reason=>reasons.push(reason));
  await handlers.get('focus')();
  assert.equal(reasons.length,1);assert.match(reasons[0],/Premium completa/);assert.equal(handlers.size,0);
});
