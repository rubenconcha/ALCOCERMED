'use strict';
(() => {
 const screen=document.getElementById('atlas-screen'),frame=document.getElementById('campus-atlas-frame'),item=document.getElementById('nav-atlas');
 const source='/atlas-anatomico?embed=campus&revision=26';
 let request=0;
 const gate=document.getElementById('atlas-enrollment-gate'),status=document.getElementById('atlas-access-status'),viewport=document.getElementById('campus-atlas-viewport'),fullscreen=document.getElementById('campus-atlas-fullscreen');
 window.openAtlas=async function(){
  if(showScreen('atlas-screen')===false)return;
  const version=++request;gate.hidden=false;viewport.hidden=true;fullscreen.hidden=true;status.textContent='Verificando tu inscripción…';
  frame.removeAttribute('src');
  try{
   await ensureSupabaseSdk();const {data,error}=await getSupabase().auth.getSession();
   if(error||!data?.session?.access_token)throw new Error('Ingresa con la cuenta que usaste al inscribirte.');
   const response=await fetch('/api/atlas',{method:'POST',headers:{Authorization:'Bearer '+data.session.access_token}});
   if(version!==request||screen.classList.contains('hidden'))return;
   if(response.status===403){status.textContent='Si ya estás inscrito, escríbenos con el correo de tu cuenta para confirmar tu acceso.';return}
   if(!response.ok)throw new Error('No pudimos verificar tu inscripción. Vuelve a intentarlo.');
   const access=await response.json();if(!access.allowed)throw new Error('No pudimos verificar tu inscripción.');
   gate.hidden=true;viewport.hidden=false;fullscreen.hidden=false;status.textContent='';
   document.getElementById('campus-atlas-loading').hidden=false;frame.src=source;
  }catch(error){if(version===request)status.textContent=error.message || 'No pudimos verificar tu inscripción. Vuelve a intentarlo.';}
 };
 document.getElementById('atlas-recheck').onclick=()=>window.openAtlas();
 window.leaveAtlas=async function(){if(document.fullscreenElement===screen)await document.exitFullscreen();goBack()};
 frame.addEventListener('load',()=>{if(frame.hasAttribute('src'))document.getElementById('campus-atlas-loading').hidden=true});
 document.getElementById('campus-atlas-fullscreen').onclick=async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else if(screen.requestFullscreen)await screen.requestFullscreen();else location.href='/atlas-anatomico?desde=campus'}catch(_){location.href='/atlas-anatomico?desde=campus'}
 };
 document.addEventListener('fullscreenchange',()=>{document.getElementById('campus-atlas-fullscreen').textContent=document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa'});
 // Release WebGL and its animation loop when the student leaves this screen.
 new MutationObserver(()=>{
  const visible=!screen.classList.contains('hidden');if(!visible)request++;item.classList.toggle('active',visible);document.body.classList.toggle('campus-atlas-active',visible);
  const link=item.querySelector('a');if(visible)link.setAttribute('aria-current','page');else{link.removeAttribute('aria-current');if(frame.hasAttribute('src')){frame.removeAttribute('src');frame.contentWindow?.location.replace('about:blank')}}
 }).observe(screen,{attributes:true,attributeFilter:['class']});
})();
