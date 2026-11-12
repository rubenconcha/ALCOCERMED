(function () {
 'use strict';
 const el=id=>document.getElementById(id);
 let client,user,currentId,returnTo='/campus',initializing=true,busy=false,verified=false,sentEmail='',resendAt=0,resendTimer=null;
 function status(text,error=false){el('status').textContent=text;el('status').dataset.error=String(error);}
 function date(value){return new Date(value).toLocaleString('es-BO',{dateStyle:'short',timeStyle:'short'});}
 function failure(error,verifying=false){
  if(error?.status===429||/rate|too many/i.test(error?.message||''))return verifying?'Demasiados intentos de verificación. Espera unos minutos antes de volver a probar.':'Por ahora no podemos enviar otro código. Espera unos minutos o pide ayuda a la preparatoria.';
  if(error?.code==='email_address_not_authorized'||/not authorized|smtp|sending.*email/i.test(error?.message||''))return 'El envío de correos no está disponible. Contacta con la preparatoria.';
  if(error?.code==='otp_disabled')return 'El ingreso con código está deshabilitado. Contacta con la preparatoria.';
  if(verifying&&(error?.code==='otp_expired'||error?.status===403))return 'El código es incorrecto o venció. Revísalo o pide uno nuevo.';
  return 'No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.';
 }
 function updateResend(){
  const seconds=Math.max(0,Math.ceil((resendAt-Date.now())/1000));
  el('send').disabled=initializing||busy||seconds>0;
  el('send').textContent=seconds?'Reenviar en '+seconds+' s':sentEmail?'Reenviar código':'Enviar código';
  if(!seconds&&resendTimer!==null){clearInterval(resendTimer);resendTimer=null;}
 }
 function rememberRequest(email,sent){
  try{sessionStorage.setItem('alcocer_code_request',JSON.stringify({email,until:resendAt,sent,at:Date.now()}));sessionStorage.setItem('alcocer_device_change_email',email);}catch(_){}
 }
 function startCooldown(seconds){
  resendAt=Date.now()+seconds*1000;updateResend();
  if(resendTimer===null)resendTimer=setInterval(updateResend,1000);
 }
 function showCodeForm(email){
  sentEmail=email;el('email').readOnly=true;el('code-form').hidden=false;el('send').className='secondary';
  el('title').textContent='Escribe tu código';el('intro').textContent='Al confirmarlo, este navegador ocupará el lugar del anterior.';
 }
 async function deadline(promise){
  let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('connection_timeout')),12000);})]);}finally{clearTimeout(timer);}
 }
 function verificationFetch(url,options){
  const signal=options?.signal||AbortSignal.timeout?.(12000);
  return fetch(url,{...options,signal});
 }
 function rpc(name,args){return deadline(client.rpc(name,args));}
 function preparingAccess(){
  el('verification').hidden=true;el('account').hidden=true;el('retry').hidden=true;
  el('title').textContent='Estamos iniciando tu sesión';el('intro').textContent='Un momento, estamos autorizando este navegador.';
 }
 function showCooldown(value){
  el('verification').hidden=true;el('account').hidden=true;el('retry').hidden=true;
  el('title').textContent='Ya cambiaste de navegador';el('intro').textContent='Puedes hacer un cambio cada 7 días.';
  status('Podrás hacer otro cambio el '+date(value)+'.',true);
 }
 function requestNewCode(){
  verified=false;el('verification').hidden=false;el('account').hidden=true;el('retry').hidden=true;
  el('code').value='';showCodeForm(user.email);
  status('La verificación venció. Pide un código nuevo.',true);
 }
 function finish(){
  el('verification').hidden=true;el('account').hidden=true;el('success').hidden=false;
  el('title').textContent='Listo, ya puedes entrar';el('intro').textContent='Este navegador está autorizado.';status('');el('retry').hidden=true;
  if(resendTimer!==null){clearInterval(resendTimer);resendTimer=null;}
  el('enter').href=returnTo;
  try{sessionStorage.removeItem('alcocer_device_change_email');sessionStorage.removeItem('alcocer_code_request');sessionStorage.removeItem('alcocer_device_change_return');}catch(_){}
  location.replace(returnTo);
 }
 async function replace(device){
  status('Autorizando este navegador…');
  const response=await rpc('campus_replace_device',{p_old_device_id:device.device_id,p_new_device_id:currentId,p_device_name:DeviceGuard.getDeviceName()});
  if(response.error)throw response.error;
  if(!response.data?.ok){
   const code=response.data?.code;
   if(code==='EMAIL_VERIFICATION_REQUIRED'||code==='NOT_AUTHENTICATED'){
    requestNewCode();
   }else if(code==='CHANGE_COOLDOWN'){
    showCooldown(response.data.next_change_at);
   }else if(code==='DEVICE_CHANGED'){
    el('retry').hidden=false;status('El dispositivo autorizado cambió. Vuelve a comprobarlo.',true);
   }else{el('retry').hidden=false;status('No se pudo cambiar el navegador. Vuelve a intentarlo.',true);}
   return;
  }
  finish();
 }
 async function afterVerification(){
  preparingAccess();
  const response=await rpc('campus_my_devices');
  if(response.error?.code==='42501'||response.status===401){requestNewCode();return;}
  if(response.error)throw response.error;
  const state=response.data;
  if(state.devices.some(d=>d.device_id===currentId)){finish();return;}
  if(!state.can_replace){showCooldown(state.next_change_at);return;}
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
  event.preventDefault();if(initializing||busy)return;
  if(Date.now()<resendAt){updateResend();status('Ya solicitaste un código. Puedes escribirlo mientras termina la cuenta regresiva.');return;}
  const email=el('email').value.trim().toLowerCase();if(!email||!el('email').checkValidity())return;
  busy=true;el('send').disabled=true;status('Enviando código…');
  try{
   const response=await client.auth.signInWithOtp({email,options:{shouldCreateUser:false}});if(response.error)throw response.error;
   showCodeForm(email);startCooldown(60);rememberRequest(email,true);
   status('Solicitamos un código para '+email+'. Revisa también Spam. Si no llega, pide ayuda a la preparatoria.');el('code').focus();
  }catch(error){
   const match=String(error?.message||'').match(/(?:after|in|wait)\s+(\d+)\s*(?:seconds?|s\b)/i);
   if(match&&(error?.status===429||/security|request/i.test(error?.message||''))){
    showCodeForm(email);startCooldown(Math.max(1,Math.min(3600,Number(match[1]))));rememberRequest(email,true);
    status('Ya se solicitó un código. Revisa tu correo y espera la cuenta regresiva antes de pedir otro.');
   }else if(error?.code==='over_email_send_rate_limit'){
    showCodeForm(email);startCooldown(60);rememberRequest(email,true);
    status('El servicio limitó los envíos. Si ya tienes un código, puedes escribirlo. Si no, vuelve a intentar más tarde.',true);
   }else if(error?.name==='AuthRetryableFetchError'){
    showCodeForm(email);rememberRequest(email,true);
    status('No pudimos confirmar el envío. Si te llega un código, escríbelo aquí. También puedes volver a pedirlo.',true);
   }else{status(failure(error),true);}
  }finally{busy=false;updateResend();}
 });
 el('code-form').addEventListener('submit',async event=>{
  event.preventDefault();if(initializing||busy||!sentEmail)return;
  const token=el('code').value.trim();if(!/^\d{6}$/.test(token)){status('Escribe los 6 dígitos del código.',true);return;}
  busy=true;el('verify').disabled=true;status('Comprobando código…');
  try{
   const result=await client.auth.verifyOtp({email:sentEmail,token,type:'email'});if(result.error)throw result.error;
   user=result.data?.user;
   // Supabase comprueba la vigencia. La hora del navegador no decide si el código es válido.
   if(!user||user.email?.toLowerCase()!==sentEmail||!result.data?.session)throw new Error('verification_failed');
   verified=true;el('code').value='';el('verification').hidden=true;await afterVerification();
  }catch(error){if(verified){el('retry').hidden=false;el('title').textContent='No pudimos terminar el ingreso';}status(failure(error,!verified),true);}finally{busy=false;el('verify').disabled=false;updateResend();}
 });
 el('retry').onclick=async()=>{
  if(busy||!verified)return;busy=true;el('retry').disabled=true;
  el('retry').hidden=true;
  try{await afterVerification();}catch(error){el('retry').hidden=false;status(failure(error),true);}finally{busy=false;el('retry').disabled=false;updateResend();}
 };
 async function init(){
  try{
   currentId=DeviceGuard.getDeviceId();returnTo=DeviceGuard.deviceChangeReturn?.()||'/campus';el('back').href=returnTo;
   const cfg=window.ALCOCER_CONFIG;
   client=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_KEY,{global:{fetch:verificationFetch}});
   let pending='',saved=null;
   try{pending=sessionStorage.getItem('alcocer_device_change_email')||'';saved=JSON.parse(sessionStorage.getItem('alcocer_code_request')||'null');}catch(_){}
   el('email').value=pending;
   if(saved?.email===pending&&saved.sent&&saved.at>Date.now()-3600000){
    showCodeForm(pending);
    if(saved.until>Date.now())startCooldown(Math.ceil((saved.until-Date.now())/1000));else updateResend();
   }
   // Resume a verified transfer after refresh, including a previously completed transfer.
   const sessionResult=await deadline(client.auth.getSession());
   if(location.hash)history.replaceState(null,'',location.pathname);
   const session=sessionResult.data?.session;
   if(!sessionResult.error&&session&&(!pending||session.user?.email?.toLowerCase()===pending.toLowerCase())){
    const checked=await deadline(client.auth.getUser());
    if(!checked.error&&checked.data?.user){
     user=checked.data.user;
     const active=await rpc('check_device_active',{p_device_id:currentId});
     if(active.error)throw active.error;
     if(active.data?.active===true){finish();return;}
     if(DeviceGuard.hasEmailProof?.(session)){verified=true;await afterVerification();return;}
    }
   }
   status('');
  }catch(error){if(verified){el('retry').hidden=false;el('title').textContent='No pudimos terminar el ingreso';}status(failure(error),true);}
  finally{initializing=false;el('verify').disabled=false;updateResend();}
 }
 init();
})();
