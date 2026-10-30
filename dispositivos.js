(function () {
 'use strict';
 const el=id=>document.getElementById(id);
 let client,user,state,currentId,busy=false,verified=false,sentEmail='',resendAt=0;
 function status(text,error=false){el('status').textContent=text;el('status').dataset.error=String(error);}
 function date(value){return new Date(value).toLocaleString('es-BO',{dateStyle:'short',timeStyle:'short'});}
 function failure(error,verifying=false){
  if(error?.status===429||/rate|seconds|too many/i.test(error?.message||''))return 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.';
  if(error?.code==='email_address_not_authorized'||/not authorized|smtp|sending.*email/i.test(error?.message||''))return 'El envío de correos no está disponible. Contacta con la preparatoria.';
  if(verifying&&(error?.code==='otp_expired'||error?.status===403))return 'El código es incorrecto o venció. Revísalo o pide uno nuevo.';
  return 'No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.';
 }
 function freshEmail(session){
  try{const claims=JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));const now=Date.now()/1000;return claims.amr?.some(a=>a.method==='otp'&&a.timestamp>=now-600&&a.timestamp<=now+30)===true;}catch(_){return false;}
 }
 function finish(){
  el('verification').hidden=true;el('account').hidden=true;el('success').hidden=false;
  el('title').textContent='Listo, ya puedes entrar';el('intro').textContent='Este navegador está autorizado.';status('');el('retry').hidden=true;
  try{sessionStorage.removeItem('alcocer_device_change_email');}catch(_){}
 }
 async function replace(device){
  status('Autorizando este navegador…');
  const response=await client.rpc('campus_replace_device',{p_old_device_id:device.device_id,p_new_device_id:currentId,p_device_name:DeviceGuard.getDeviceName()});
  if(response.error)throw response.error;
  if(!response.data?.ok){
   const code=response.data?.code;
   if(code==='EMAIL_VERIFICATION_REQUIRED'){
    verified=false;el('verification').hidden=false;el('account').hidden=true;status('La verificación venció. Pide un código nuevo.',true);
   }else if(code==='CHANGE_COOLDOWN'){
    el('account').hidden=true;status('Podrás cambiar de navegador el '+date(response.data.next_change_at)+'.',true);
   }else{status('No se pudo cambiar el navegador. Vuelve a intentarlo.',true);}
   return;
  }
  finish();
 }
 async function afterVerification(){
  const response=await client.rpc('campus_my_devices');if(response.error)throw response.error;state=response.data;
  if(state.devices.some(d=>d.device_id===currentId)){finish();return;}
  if(!state.can_replace){el('account').hidden=true;status('Podrás cambiar de navegador el '+date(state.next_change_at)+'.',true);return;}
  if(!state.devices.length){
   const activated=await DeviceGuard.activateDevice(client,user.email);if(!activated.ok)throw new Error(activated.error);finish();return;
  }
  // Transfer the only slot after email verification; keep the other slot on two-browser accounts.
  if(state.devices.length===1){await replace(state.devices[0]);return;}
  el('title').textContent='¿Cuál quieres reemplazar?';el('intro').textContent='Ese navegador dejará de tener acceso. El otro seguirá funcionando.';
  el('account').hidden=false;el('device-list').replaceChildren();
  for(const device of state.devices){
   const row=document.createElement('article');row.className='device';
   const info=document.createElement('div'),name=document.createElement('strong'),seen=document.createElement('small');
   name.textContent=device.name||'Navegador';seen.textContent='Último uso: '+date(device.last_seen);info.append(name,seen);
   const button=document.createElement('button');button.type='button';button.textContent='Reemplazar';
   button.onclick=async()=>{
    if(busy||!verified)return;busy=true;button.disabled=true;
    try{await replace(device);}catch(error){status(failure(error),true);}finally{busy=false;button.disabled=false;}
   };
   row.append(info,button);el('device-list').append(row);
  }
  status('Código verificado. Elige el navegador que dejarás de usar.');
 }
 el('send-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  if(Date.now()<resendAt){status('Espera un minuto antes de pedir otro código.',true);return;}
  const email=el('email').value.trim().toLowerCase();if(!email||!el('email').checkValidity())return;
  busy=true;el('send').disabled=true;status('Enviando código…');
  try{
   const response=await client.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(response.error)throw response.error;
   sentEmail=email;resendAt=Date.now()+60000;el('email').readOnly=true;el('code-form').hidden=false;el('send').textContent='Enviar otro código';
   status('Enviamos un código a '+email+'. Revisa también Spam.');el('code').focus();
  }catch(error){status(failure(error),true);}finally{busy=false;el('send').disabled=false;}
 });
 el('code-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!sentEmail)return;
  const token=el('code').value.trim();if(!/^\d{6}$/.test(token)){status('Escribe los 6 dígitos del código.',true);return;}
  busy=true;el('verify').disabled=true;status('Comprobando código…');
  try{
   const result=await client.auth.verifyOtp({email:sentEmail,token,type:'email'});if(result.error)throw result.error;
   user=result.data?.user;
   if(!user||user.email?.toLowerCase()!==sentEmail||!freshEmail(result.data.session))throw new Error('verification_failed');
   verified=true;el('code').value='';el('verification').hidden=true;await afterVerification();
  }catch(error){if(verified)el('retry').hidden=false;status(failure(error,true),true);}finally{busy=false;el('verify').disabled=false;}
 });
 el('retry').onclick=async()=>{
  if(busy||!verified)return;busy=true;el('retry').disabled=true;
  try{await afterVerification();el('retry').hidden=true;}catch(error){status(failure(error),true);}finally{busy=false;el('retry').disabled=false;}
 };
 async function init(){
  try{
   currentId=DeviceGuard.getDeviceId();const cfg=window.ALCOCER_CONFIG;client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_KEY);
   let pending='';try{pending=sessionStorage.getItem('alcocer_device_change_email')||'';}catch(_){}el('email').value=pending;
   // Support previously delivered links during the rollout.
   if(location.hash){
    const result=await client.auth.getSession();history.replaceState(null,'',location.pathname);
    if(result.data?.session&&freshEmail(result.data.session)){
     const checked=await client.auth.getUser();if(checked.error)throw checked.error;
     user=checked.data.user;verified=true;el('verification').hidden=true;await afterVerification();return;
    }
   }
   status('');
  }catch(error){el('send').disabled=true;status(failure(error),true);}
 }
 init();
})();
