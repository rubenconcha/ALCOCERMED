(function () {
 'use strict';
 const el=id=>document.getElementById(id);
 let client,user,verified=false,busy=false,state,currentId;
 function status(text,error=false){el('status').textContent=text;el('status').dataset.error=String(error);}
 function date(value){return new Date(value).toLocaleString('es-BO',{dateStyle:'short',timeStyle:'short'});}
 function freshEmail(session){
  try {const claims=JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));const now=Date.now()/1000;return Array.isArray(claims.amr)&&claims.amr.some(a=>a.method==='otp'&&a.timestamp>=now-600&&a.timestamp<=now+30);}
  catch(_){return false;}
 }
 function failure(error){return error?.status===429||/rate|seconds|too many/i.test(error?.message||'')?'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.':'No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.';}
 async function sessionWithDeadline(){
  let timer;try{return await Promise.race([client.auth.getSession(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('connection_timeout')),12000);})]);}finally{clearTimeout(timer);}
 }
 async function refresh(){
  const result=await sessionWithDeadline();
  if(result.error)throw result.error;
  const session=result.data.session;
  if(!session){user=null;el('account').hidden=true;el('verify').hidden=false;status('Confirma tu correo para ver los dispositivos y reemplazar uno.');return;}
  const checked=await client.auth.getUser();if(checked.error)throw checked.error;user=checked.data.user;
  verified=freshEmail(session);
  const response=await client.rpc('campus_my_devices');if(response.error)throw response.error;state=response.data;
  el('account').hidden=false;el('verify').hidden=verified;
  el('email').value=user.email;el('email').readOnly=true;el('email-label').textContent=user.email;
  el('count').textContent=state.devices.length+' / 2';
  el('device-list').replaceChildren();
  const current=state.devices.some(d=>d.device_id===currentId);
  for(const device of state.devices){
   const row=document.createElement('article');row.className='device';const info=document.createElement('div');
   const name=document.createElement('strong');name.textContent=device.name||'Navegador';info.append(name);
   const seen=document.createElement('small');seen.textContent='Último uso: '+date(device.last_seen);info.append(seen);row.append(info);
   if(device.device_id===currentId){const badge=document.createElement('span');badge.className='pill';badge.textContent='Este navegador';info.append(document.createElement('br'),badge);}
   else if(!current){const button=document.createElement('button');button.type='button';button.textContent=verified?'Reemplazar por este navegador':'Verifica tu correo para reemplazar';button.disabled=!verified||!state.can_replace;button.onclick=()=>confirmReplace(device);row.append(button);}
   el('device-list').append(row);
  }
  if(!state.devices.length)el('device-list').textContent='Todavía no tienes dispositivos autorizados. Puedes entrar al campus para registrar este navegador.';
  el('cooldown').textContent=state.can_replace?'Puedes reemplazar un dispositivo. Después del cambio deberás esperar 7 días para hacer otro.':'Próximo cambio disponible: '+date(state.next_change_at)+'.';
  el('current-note').textContent=current?'Este navegador ya está autorizado. Para cambiar otro, abre esta página desde el navegador que quieras registrar.':'El dispositivo que elijas dejará de tener acceso y este navegador ocupará su lugar.';
  status(verified?'Correo confirmado. Elige el dispositivo que quieras reemplazar.':'Confirma tu correo antes de reemplazar un dispositivo.');
 }
 let selected=null;
 function confirmReplace(device){if(busy)return;selected=device;el('confirm-text').textContent='Vas a reemplazar «'+(device.name||'Navegador')+'» por «'+DeviceGuard.getDeviceName()+'».';el('confirm').showModal();}
 el('confirm').addEventListener('close',async()=>{
  if(el('confirm').returnValue!=='replace'||!selected||busy)return;
  busy=true;status('Guardando el cambio…');
  try {
   const result=await client.rpc('campus_replace_device',{p_old_device_id:selected.device_id,p_new_device_id:currentId,p_device_name:DeviceGuard.getDeviceName()});
   if(result.error)throw result.error;
   if(!result.data?.ok){
    const code=result.data?.code;
    await refresh();
    status(code==='EMAIL_VERIFICATION_REQUIRED'?'La verificación venció. Solicita un enlace nuevo.':code==='CHANGE_COOLDOWN'?'Ya realizaste un cambio. Revisa la fecha del próximo reemplazo.':'La lista cambió. Revisa los dispositivos y vuelve a intentarlo.',true);
    if(code==='EMAIL_VERIFICATION_REQUIRED'){verified=false;el('verify').hidden=false;}
    return;
   }
   el('account').hidden=true;el('verify').hidden=true;el('success').hidden=false;status('Dispositivo reemplazado correctamente.');
  }catch(error){status(failure(error),true);}finally{busy=false;}
 });
 el('email-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!client)return;
  busy=true;el('send').disabled=true;status('Enviando enlace…');
  try{
   const email=el('email').value.trim();
   const result=await client.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:new URL('/dispositivos.html',location.origin).href}});
   if(result.error)throw result.error;
   status('Si ese correo tiene una cuenta, recibirás un enlace. Revisa también spam y ábrelo en el navegador que deseas autorizar.');
  }catch(error){status(failure(error),true);}finally{busy=false;el('send').disabled=false;}
 });
 async function init(){
  try{
   currentId=DeviceGuard.getDeviceId();const cfg=window.ALCOCER_CONFIG;
   client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_KEY);
   await refresh();
   // Remove consumed tokens from the address bar without retaining them in page links.
   if(location.hash)history.replaceState(null,'',location.pathname);
  }catch(error){el('verify').hidden=!client;status(failure(error),true);}
 }
 init();
})();
