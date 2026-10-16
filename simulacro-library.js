'use strict';
(() => {
 const $=id=>document.getElementById(id),list=$('sim-library-list');if(!list)return;
 let catalogPromise,entries=[],launchPending=false;
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const locked=e=>!e.demo&&!e.free&&CampusAccess.isFree();
 function render(){
  const query=normalize($('sim-library-search').value),scope=$('sim-library-scope').value;
   const visible=entries.filter(e=>(!scope||e.scope===scope)&&normalize(e.title+' '+e.type).includes(query));
  list.replaceChildren();
  for(const e of visible){
   const card=document.createElement('article');card.id='entrance-'+e.key;card.dataset.examKey=e.key;card.className='sim-library-card';
   const tag=document.createElement('span');tag.className='sim-library-stage';tag.textContent=e.type;
   const title=document.createElement('h3');title.textContent=e.title;
   const metrics=document.createElement('p');metrics.textContent='100 preguntas · '+e.minutes+' minutos';
   const button=document.createElement('button');button.type='button';button.className='btn-primary';button.textContent='realizar simulacro →';button.setAttribute('aria-label','Realizar '+e.title+' · '+e.type);button.disabled=launchPending;
   button.addEventListener('click',async()=>{
    if(launchPending)return;
    if(locked(e))return CampusAccess.unlock();
    selectEntranceExam(e.key);
    launchPending=true;list.querySelectorAll('button').forEach(b=>b.disabled=true);button.textContent='Preparando preguntas…';
    try{await iniciarSimulacro();}finally{launchPending=false;render();}
   });
   card.append(tag,title,metrics,button);list.append(card);
  }
  $('sim-library-status').textContent=visible.length+' '+(visible.length===1?'simulacro':'simulacros');
  if(!visible.length){const empty=document.createElement('p');empty.className='sim-library-empty';empty.textContent='No encontramos simulacros para esta búsqueda. Prueba otro nombre o parcial.';list.append(empty);}
 }
 async function open(){
  try{
   if(!catalogPromise)catalogPromise=fetch('/content/simulacros-catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{catalogPromise=null;throw e;});
   entries=(await catalogPromise).entries;render();
  }catch(_){$('sim-library-status').textContent='No pudimos cargar las pruebas.';list.replaceChildren();window.clearEntranceExam();const retry=document.createElement('button');retry.type='button';retry.className='sim-library-retry';retry.textContent='Volver a cargar';retry.onclick=open;list.append(retry);}
 }
 window.EntranceLibrary={open,format:key=>entries.find(e=>e.key===key),markSelected(key){list.querySelectorAll('[data-exam-key]').forEach(card=>card.classList.toggle('is-selected',card.dataset.examKey===key));}};
 $('sim-library-search').addEventListener('input',render);
 $('sim-library-scope').addEventListener('change',render);
 window.addEventListener('campus-access-change',()=>{if(window.getSelectedEntranceExam?.()&&locked(window.EntranceLibrary.format(window.getSelectedEntranceExam())||{}))window.clearEntranceExam();if(entries.length)render();});
})();
