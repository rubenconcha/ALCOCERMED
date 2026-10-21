'use strict';
(() => {
 const screen=document.getElementById('atlas-screen'),frame=document.getElementById('campus-atlas-frame'),item=document.getElementById('nav-atlas');
 const source='/atlas-anatomico?embed=campus&revision=28';
 let request=0;
 const gate=document.getElementById('atlas-enrollment-gate'),status=document.getElementById('atlas-access-status'),viewport=document.getElementById('campus-atlas-viewport'),fullscreen=document.getElementById('campus-atlas-fullscreen');
 window.openAtlas=async function(){
  if(showScreen('atlas-screen')===false)return;
  const version=++request;gate.hidden=false;viewport.hidden=true;fullscreen.hidden=true;status.textContent='Verificando tu inscripción…';
  frame.removeAttribute('src');
  try{
   await ensureSupabaseSdk();const {data,error}=await getSupabase().auth.getSession();
   if(error||!data?.session?.access_token)throw new Error('Ingresa con la cuenta que usaste al inscribirte.');
   const response=await fetch('/api/atlas',{method:'POST',headers:{Authorization:'Bearer '+data.session.access_token},signal:AbortSignal.timeout(15000)});
   if(version!==request||screen.classList.contains('hidden'))return;
   if(response.status===403){status.textContent='Tu cuenta todavía no tiene habilitado el atlas. Si tu plan lo incluye, escríbenos con el correo de tu cuenta para revisar tu acceso.';return}
   if(!response.ok)throw new Error('No pudimos verificar tu inscripción. Vuelve a intentarlo.');
   const access=await response.json();if(!access.allowed)throw new Error('No pudimos verificar tu inscripción.');
   gate.hidden=true;viewport.hidden=false;fullscreen.hidden=false;status.textContent='';
   document.getElementById('campus-atlas-loading').hidden=false;frame.src=source;
  }catch(error){if(version===request)status.textContent=error.message || 'No pudimos verificar tu inscripción. Vuelve a intentarlo.';}
 };
 function expanded(){return document.fullscreenElement===screen||screen.classList.contains('atlas-expanded')}
 function syncFullscreen(){fullscreen.textContent=expanded()?'Salir de pantalla completa':'Pantalla completa';fullscreen.setAttribute('aria-pressed',String(expanded()))}
 window.leaveAtlas=async function(){screen.classList.remove('atlas-expanded');if(document.fullscreenElement===screen)await document.exitFullscreen();syncFullscreen();goBack()};
 frame.addEventListener('load',()=>{
  if(!frame.hasAttribute('src')||frame.contentWindow?.location.href==='about:blank')return;
  document.getElementById('campus-atlas-loading').hidden=true;
  try{if(frame.contentDocument?.getElementById('atlas'))window.CampusTracking?.record('atlas','opened','MORFOFUNCION','Atlas anatómico','atlas');if(!frame.contentDocument?.getElementById('atlas')){viewport.hidden=true;fullscreen.hidden=true;gate.hidden=false;status.textContent='No se pudo abrir el atlas. Vuelve a comprobar tu acceso.'}}catch(_){}
 });
 document.getElementById('campus-atlas-retry').onclick=()=>window.openAtlas();
 document.getElementById('campus-atlas-fullscreen').onclick=async()=>{
  if(screen.classList.contains('atlas-expanded'))screen.classList.remove('atlas-expanded');
  else try{if(document.fullscreenElement)await document.exitFullscreen();else if(screen.requestFullscreen)await screen.requestFullscreen();else screen.classList.add('atlas-expanded')}catch(_){screen.classList.add('atlas-expanded')}
  syncFullscreen();
 };
 document.addEventListener('fullscreenchange',syncFullscreen);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){screen.classList.remove('atlas-expanded');syncFullscreen()}});
 // Release WebGL and its animation loop when the student leaves this screen.
 new MutationObserver(()=>{
  const visible=!screen.classList.contains('hidden');if(!visible){request++;if(screen.classList.contains('atlas-expanded'))screen.classList.remove('atlas-expanded');syncFullscreen()}item.classList.toggle('active',visible);document.body.classList.toggle('campus-atlas-active',visible);
  const link=item.querySelector('a');if(visible)link.setAttribute('aria-current','page');else{link.removeAttribute('aria-current');if(frame.hasAttribute('src')){frame.removeAttribute('src');frame.contentWindow?.location.replace('about:blank')}}
 }).observe(screen,{attributes:true,attributeFilter:['class']});
})();
