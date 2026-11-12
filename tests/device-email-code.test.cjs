const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const dir=process.argv[2]||'.';const source=fs.readFileSync(path.join(dir,'dispositivos.js'),'utf8');
const guard=fs.readFileSync(path.join(dir,'device_guard.js'),'utf8');
const markup=fs.readFileSync(path.join(dir,'dispositivos.html'),'utf8');
function fixture(options={}){
 const nodes={},calls=[],redirects=[];let now=Date.now()+(options.clockOffset||0),timer,finishVerification;class Clock extends Date{static now(){return now;}}const hidden=new Set(['account','success','support','code-form']);
 const node=id=>({hidden:hidden.has(id),dataset:{},children:[],value:'',textContent:'',disabled:false,readOnly:false,listeners:{},addEventListener(t,f){this.listeners[t]=f;},append(...n){this.children.push(...n);},replaceChildren(){this.children=[];},checkValidity(){return true;},focus(){}});
 const el=id=>nodes[id]||(nodes[id]=node(id));
 const email='student@example.com';const session={user:{id:'student',email},access_token:'x.'+Buffer.from(JSON.stringify({amr:[{method:'otp',timestamp:Date.now()/1000-(options.staleSession?7200:0)}]})).toString('base64')+'.x'};
 const devices=options.devices||[{device_id:'old',name:'Anterior',last_seen:new Date().toISOString()}];
 const client={
  auth:{
   async getSession(){return {data:{session:options.resume?session:null}};},
   async getUser(){return {data:{user:{id:'student',email}}};},
   async signInWithOtp(args){calls.push({name:'send',args});return options.sendError?{error:options.sendError}:{};},
   async verifyOtp(args){
    calls.push({name:'verify',args});
    if(options.holdVerification)await new Promise(resolve=>{finishVerification=resolve;});
    return options.invalid?{error:{code:'otp_expired',status:403}}:{data:{user:{id:'student',email},session}};
   }
  },
  async rpc(name,args){
   calls.push({name,args});
   if(name==='check_device_active')return {data:{active:!!options.alreadyAuthorized}};
   if(name==='campus_my_devices')return options.staleSession?{error:{code:'42501'},status:403}
    :{data:{devices,can_replace:!options.usedChange,next_change_at:options.legacyChangeDate||null}};
   if(options.replaceError)return {data:{ok:false,code:options.replaceError}};
   return {data:{ok:true}};
  }
 };
 const store=options.store||new Map([['alcocer_device_change_email',email]]);
 const context=vm.createContext({
  document:{getElementById:el,createElement:()=>node('')},window:{ALCOCER_CONFIG:{},supabase:{createClient:()=>client}},
  localStorage:{getItem:()=> 'new'},navigator:{userAgent:'Chrome'},URL,
  sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},
  location:{origin:'https://alcocermed.com',hash:'',replace:target=>redirects.push(target)},
  atob:s=>Buffer.from(s,'base64').toString(),Date:Clock,console,setTimeout,clearTimeout,
  setInterval:fn=>{timer=fn;return 1;},clearInterval:()=>{timer=null;}
 });
 vm.runInContext(guard,context);
 vm.runInContext(source,context);
 async function submit(id){await el(id).listeners.submit({preventDefault(){}});}
 return {el,calls,store,redirects,ready:()=>new Promise(setImmediate),advance(ms){now+=ms;if(timer)timer();},
  finishVerification(){finishVerification();},
  async send(){await new Promise(setImmediate);await submit('send-form');},
  async verify(code='123456'){await new Promise(setImmediate);el('code').value=code;await submit('code-form');}
 };
}
(async()=>{
 assert.match(markup,/href="https:\/\/wa\.me\/59164840819"[^>]*>WhatsApp de soporte · 64840819/);
 assert.doesNotMatch(markup,/7 días/);
 let f=fixture();assert.equal(f.el('email').value,'student@example.com');await f.send();assert.equal(f.el('code-form').hidden,false);assert.equal(f.calls[0].args.options.shouldCreateUser,false);
 await f.verify('123');assert.equal(f.calls.filter(c=>c.name==='verify').length,0);await f.verify();assert.equal(f.el('success').hidden,false);assert.equal(f.calls.at(-1).name,'campus_replace_device');assert.equal(f.calls.at(-1).args.p_old_device_id,'old');assert.equal(f.calls.at(-1).args.p_new_device_id,'new');
 f=fixture({invalid:true});await f.send();await f.verify();assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);assert.match(f.el('status').textContent,/incorrecto/);
 f=fixture({usedChange:true});await f.send();await f.verify();assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);assert.equal(f.el('support').hidden,false);
 f=fixture({legacyChangeDate:'2026-11-05T00:00:00Z'});await f.send();await f.verify();assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);assert.equal(f.el('support').hidden,false);
 f=fixture({replaceError:'SUPPORT_REQUIRED'});await f.send();await f.verify();assert.equal(f.el('success').hidden,true);assert.equal(f.el('support').hidden,false);
 f=fixture({sendError:{code:'email_address_not_authorized'}});await f.send();assert.equal(f.el('code-form').hidden,true);assert.equal(f.el('send').disabled,false);assert.match(f.el('status').textContent,/no está disponible/);
 f=fixture();await f.send();await f.send();assert.equal(f.calls.filter(c=>c.name==='send').length,1);
 f=fixture({devices:[{device_id:'one',name:'Uno'},{device_id:'two',name:'Dos'}]});await f.send();await f.verify();assert.equal(f.el('account').hidden,false);assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);await f.el('device-list').children[0].children[1].onclick();assert.equal(f.calls.at(-1).args.p_old_device_id,'one');assert.equal(f.el('success').hidden,false);
 f=fixture();await f.send();assert.equal(f.el('send').disabled,true);assert.match(f.el('send').textContent,/60 s/);f.advance(60000);assert.equal(f.el('send').disabled,false);await f.send();assert.equal(f.calls.filter(c=>c.name==='send').length,2);
 f=fixture({sendError:{status:429,code:'over_email_send_rate_limit',message:'For security purposes, you can only request this after 45 seconds.'}});await f.send();assert.match(f.el('send').textContent,/45 s/);assert.equal(f.el('send').disabled,true);f.advance(45000);assert.equal(f.el('send').disabled,false);
 f=fixture({sendError:{status:429,code:'over_email_send_rate_limit',message:'email rate limit exceeded'}});await f.send();
 assert.equal(f.el('send').disabled,true);assert.match(f.el('status').textContent,/El servicio limitó/);assert.equal(f.el('code-form').hidden,false);
 f.advance(60000);assert.equal(f.el('send').disabled,false);await f.verify();assert.deepEqual(f.redirects,['/campus']);
 f=fixture({sendError:{name:'AuthRetryableFetchError'}});await f.send();assert.equal(f.el('code-form').hidden,false);
 assert.match(f.el('status').textContent,/No pudimos confirmar el envío/);
 f=fixture({holdVerification:true,invalid:true});await f.send();const attempt=f.verify();await f.ready();
 f.advance(60000);assert.equal(f.el('send').disabled,true);f.finishVerification();await attempt;
 assert.equal(f.el('send').disabled,false);
 f=fixture();await f.send();const restored=fixture({store:f.store});assert.equal(restored.el('code-form').hidden,false);assert.equal(restored.el('send').disabled,true);assert.equal(restored.calls.length,0);await restored.verify();assert.equal(restored.el('success').hidden,false);
 assert.deepEqual(restored.redirects,['/campus']);
 f=fixture({usedChange:true});await f.ready();await f.send();await f.verify();assert.equal(f.el('title').textContent,'Ya cambiaste de dispositivo');assert.equal(f.el('verification').hidden,true);assert.deepEqual(f.redirects,[]);
 f=fixture({resume:true});await f.ready();assert.deepEqual(f.redirects,['/campus']);assert.equal(f.calls.some(c=>c.name==='verify'||c.name==='send'),false);
 f=fixture({resume:true,staleSession:true,alreadyAuthorized:true});await f.ready();assert.deepEqual(f.redirects,['/campus']);assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);
 f=fixture({resume:true,staleSession:true});await f.ready();assert.deepEqual(f.redirects,[]);assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);
 assert.equal(f.el('verification').hidden,false);assert.match(f.el('status').textContent,/Pide un código nuevo/);
 f=fixture({resume:true,usedChange:true});await f.ready();assert.equal(f.el('title').textContent,'Ya cambiaste de dispositivo');assert.deepEqual(f.redirects,[]);
 f=fixture({clockOffset:3600000});await f.send();await f.verify();assert.deepEqual(f.redirects,['/campus']);
 f=fixture({resume:true,clockOffset:-3600000});await f.ready();assert.deepEqual(f.redirects,['/campus']);
 f=fixture({resume:true,store:new Map([['alcocer_device_change_return','/juegos/jugar?code=demo']])});await f.ready();assert.deepEqual(f.redirects,['/juegos/jugar?code=demo']);
 f=fixture({resume:true,store:new Map([['alcocer_device_change_return','https://example.invalid/']])});await f.ready();assert.deepEqual(f.redirects,['/campus']);
 console.log('PASS: código, reloj desajustado, reenvío, recuperación, cambio y retorno al destino original.');
})().catch(e=>{console.error(e);process.exitCode=1;});
