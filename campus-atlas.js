'use strict';
(() => {
 const screen=document.getElementById('atlas-screen'),frame=document.getElementById('campus-atlas-frame'),item=document.getElementById('nav-atlas');
 const source='/atlas-anatomico?embed=campus&revision=19';
 window.openAtlas=function(){
  if(showScreen('atlas-screen')===false)return;
  if(!frame.hasAttribute('src')){document.getElementById('campus-atlas-loading').hidden=false;frame.src=source}
 };
 window.leaveAtlas=async function(){if(document.fullscreenElement===screen)await document.exitFullscreen();goBack()};
 frame.addEventListener('load',()=>{if(frame.hasAttribute('src'))document.getElementById('campus-atlas-loading').hidden=true});
 document.getElementById('campus-atlas-fullscreen').onclick=async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else if(screen.requestFullscreen)await screen.requestFullscreen();else location.href='/atlas-anatomico?desde=campus'}catch(_){location.href='/atlas-anatomico?desde=campus'}
 };
 document.addEventListener('fullscreenchange',()=>{document.getElementById('campus-atlas-fullscreen').textContent=document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa'});
 // Release WebGL and its animation loop when the student leaves this screen.
 new MutationObserver(()=>{
  const visible=!screen.classList.contains('hidden');item.classList.toggle('active',visible);document.body.classList.toggle('campus-atlas-active',visible);
  const link=item.querySelector('a');if(visible)link.setAttribute('aria-current','page');else{link.removeAttribute('aria-current');if(frame.hasAttribute('src')){frame.removeAttribute('src');frame.contentWindow?.location.replace('about:blank')}}
 }).observe(screen,{attributes:true,attributeFilter:['class']});
})();
