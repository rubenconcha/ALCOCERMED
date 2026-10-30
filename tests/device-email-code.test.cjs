const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const dir=process.argv[2]||'.';const source=fs.readFileSync(path.join(dir,'dispositivos.js'),'utf8');
function fixture(options={}){
 const nodes={},calls=[];let now=Date.now(),timer;class Clock extends Date{static now(){return now;}}const hidden=new Set(['account','success','code-form']);
 const node=id=>({hidden:hidden.has(id),dataset:{},children:[],value:'',textContent:'',disabled:false,readOnly:false,listeners:{},addEventListener(t,f){this.listeners[t]=f;},append(...n){this.children.push(...n);},replaceChildren(){this.children=[];},checkValidity(){return true;},focus(){}});
 const el=id=>nodes[id]||(nodes[id]=node(id));
 const email='student@example.com';const session={access_token:'x.'+Buffer.from(JSON.stringify({amr:[{method:'otp',timestamp:Date.now()/1000}]})).toString('base64')+'.x'};
 const devices=options.devices||[{device_id:'old',name:'Anterior',last_seen:new Date().toISOString()}];
 const client={auth:{async signInWithOtp(args){calls.push({name:'send',args});return options.sendError?{error:options.sendError}:{};},async verifyOtp(args){calls.push({name:'verify',args});return options.invalid?{error:{code:'otp_expired',status:403}}:{data:{user:{id:'student',email},session}};}},async rpc(name,args){calls.push({name,args});return {data:name==='campus_my_devices'?{devices,can_replace:!options.cooldown,next_change_at:'2026-11-05T00:00:00Z'}:options.replaceError?{ok:false,code:'CHANGE_COOLDOWN',next_change_at:'2026-11-05T00:00:00Z'}:{ok:true}};}};
 const store=options.store||new Map([['alcocer_device_change_email',email]]);
 vm.runInNewContext(source,{document:{getElementById:el,createElement:()=>node('')},DeviceGuard:{getDeviceId:()=> 'new',getDeviceName:()=> 'Nuevo',activateDevice:async()=>({ok:true})},window:{ALCOCER_CONFIG:{},supabase:{createClient:()=>client}},sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},location:{hash:''},atob:s=>Buffer.from(s,'base64').toString(),Date:Clock,JSON,console,setInterval:fn=>{timer=fn;return 1;},clearInterval:()=>{timer=null;}});
 async function submit(id){await el(id).listeners.submit({preventDefault(){}});}
 return {el,calls,store,advance(ms){now+=ms;if(timer)timer();},async send(){await submit('send-form');},async verify(code='123456'){el('code').value=code;await submit('code-form');}};
}
(async()=>{
 let f=fixture();assert.equal(f.el('email').value,'student@example.com');await f.send();assert.equal(f.el('code-form').hidden,false);assert.equal(f.calls[0].args.options.shouldCreateUser,false);
 await f.verify('123');assert.equal(f.calls.filter(c=>c.name==='verify').length,0);await f.verify();assert.equal(f.el('success').hidden,false);assert.equal(f.calls.at(-1).name,'campus_replace_device');assert.equal(f.calls.at(-1).args.p_old_device_id,'old');assert.equal(f.calls.at(-1).args.p_new_device_id,'new');
 f=fixture({invalid:true});await f.send();await f.verify();assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);assert.match(f.el('status').textContent,/incorrecto/);
 f=fixture({cooldown:true});await f.send();await f.verify();assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);assert.match(f.el('status').textContent,/Podrás cambiar/);
 f=fixture({replaceError:true});await f.send();await f.verify();assert.equal(f.el('success').hidden,true);assert.match(f.el('status').textContent,/Podrás cambiar/);
 f=fixture({sendError:{code:'email_address_not_authorized'}});await f.send();assert.equal(f.el('code-form').hidden,true);assert.equal(f.el('send').disabled,false);assert.match(f.el('status').textContent,/no está disponible/);
 f=fixture();await f.send();await f.send();assert.equal(f.calls.filter(c=>c.name==='send').length,1);
 f=fixture({devices:[{device_id:'one',name:'Uno'},{device_id:'two',name:'Dos'}]});await f.send();await f.verify();assert.equal(f.el('account').hidden,false);assert.equal(f.calls.some(c=>c.name==='campus_replace_device'),false);await f.el('device-list').children[0].children[1].onclick();assert.equal(f.calls.at(-1).args.p_old_device_id,'one');assert.equal(f.el('success').hidden,false);
 f=fixture();await f.send();assert.equal(f.el('send').disabled,true);assert.match(f.el('send').textContent,/60 s/);f.advance(60000);assert.equal(f.el('send').disabled,false);await f.send();assert.equal(f.calls.filter(c=>c.name==='send').length,2);
 f=fixture({sendError:{status:429,code:'over_email_send_rate_limit',message:'For security purposes, you can only request this after 45 seconds.'}});await f.send();assert.match(f.el('send').textContent,/45 s/);assert.equal(f.el('send').disabled,true);f.advance(45000);assert.equal(f.el('send').disabled,false);
 f=fixture({sendError:{status:429,code:'over_email_send_rate_limit',message:'email rate limit exceeded'}});await f.send();assert.equal(f.el('send').disabled,true);assert.match(f.el('status').textContent,/Esperar un minuto no/);assert.equal(f.el('code-form').hidden,true);
 f=fixture();await f.send();const restored=fixture({store:f.store});assert.equal(restored.el('code-form').hidden,false);assert.equal(restored.el('send').disabled,true);assert.equal(restored.calls.length,0);await restored.verify();assert.equal(restored.el('success').hidden,false);
 console.log('PASS: countdown, accurate rate-limit messages, reload without resend; 6 digits, OTP failure, transfer, cooldown, resend, SMTP failure, two-browser choice');
})().catch(e=>{console.error(e);process.exitCode=1;});
