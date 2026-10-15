'use strict';
(() => {
 const $=id=>document.getElementById(id),list=$('sim-library-list');if(!list)return;
 const labels={first:'Primer parcial',second:'Segundo parcial',final:'Examen final'};
 const scopeText={first:'Morfofunción: capítulos 1–11. Biología Celular: 1–6. Educación para la Salud: temas 1–6.',second:'Morfofunción: capítulos 12–20. Biología Celular: 7–12. Educación para la Salud: temas 7–12.',final:'Acumulativo: contenidos de todo el programa, incluidos el primer y segundo parcial.'};
 let catalogPromise,entries=[],scope='first',page=0;const pageSize=6;
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const tabs=[...document.querySelectorAll('[data-sim-scope]')];
 const locked=e=>!e.demo&&!e.free&&CampusAccess.isFree();
 function render(){
  const query=normalize($('sim-library-search').value);
  const visible=entries.filter(e=>e.scope===scope&&normalize(e.title+' '+e.type+' '+e.description).includes(query));
  const pages=Math.ceil(visible.length/pageSize);page=Math.max(0,Math.min(page,pages-1));const shown=visible.slice(page*pageSize,(page+1)*pageSize);
  $('sim-scope-title').textContent=labels[scope];$('sim-scope-description').textContent=scopeText[scope];list.replaceChildren();
  for(const e of shown){
   const button=document.createElement('button');button.type='button';button.id='entrance-'+e.key;button.dataset.examKey=e.key;button.className='entrance-choice'+(locked(e)?' entrance-choice-premium':'');
   button.setAttribute('aria-label','Seleccionar '+e.title+' · '+e.type);button.setAttribute('aria-pressed','false');
   const top=document.createElement('span');top.className='entrance-choice-top';
   const tag=document.createElement('span');tag.className='entrance-choice-tag';tag.textContent=e.type;
   const radio=document.createElement('span');radio.className='entrance-choice-radio';radio.setAttribute('aria-hidden','true');top.append(tag,radio);
   const title=document.createElement('strong');title.textContent=e.title;
   const description=document.createElement('span');description.className='entrance-choice-description';description.textContent=e.description;
   const metrics=document.createElement('span');metrics.className='entrance-choice-metrics';metrics.innerHTML='<span><b>100</b> preguntas</span><span><b>100</b> minutos</span>';
   const access=document.createElement('span');access.className='entrance-choice-split';access.textContent=e.demo?'Acceso abierto':locked(e)?'Con tu plan de estudio':'Listo para comenzar';
   button.append(top,title,description,metrics,access);button.addEventListener('click',()=>{selectEntranceExam(e.key);if(!locked(e))document.querySelector('.entrance-launch').scrollIntoView({block:'center'});});list.append(button);
  }
  $('sim-library-status').textContent=visible.length?'Elige un simulacro para comenzar.':'No encontramos una prueba con ese nombre en este parcial.';
  $('sim-library-pages').hidden=pages<=1;$('sim-library-prev').disabled=page===0;$('sim-library-next').disabled=page>=pages-1;$('sim-library-page').textContent='Página '+(page+1);
  if(!visible.length){const empty=document.createElement('div');empty.className='sim-library-empty';empty.textContent='Cambia el nombre que buscas o limpia la búsqueda.';list.append(empty);}
  const selected=window.getSelectedEntranceExam?.();if(selected&&!shown.some(e=>e.key===selected))window.clearEntranceExam();
  window.EntranceLibrary.markSelected(window.getSelectedEntranceExam?.());
 }
 async function open(){
  try{
   if(!catalogPromise)catalogPromise=fetch('/content/simulacros-catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{catalogPromise=null;throw e;});
   const data=await catalogPromise;entries=data.entries;render();
  }catch(_){$('sim-library-status').textContent='No pudimos cargar las pruebas. Vuelve a intentarlo.';list.replaceChildren();window.clearEntranceExam();const retry=document.createElement('button');retry.type='button';retry.className='sim-library-retry';retry.textContent='Volver a cargar';retry.onclick=open;list.append(retry);}
 }
 window.EntranceLibrary={open,format:key=>entries.find(e=>e.key===key),markSelected(key){list.querySelectorAll('[data-exam-key]').forEach(b=>{b.classList.toggle('is-selected',b.dataset.examKey===key);b.setAttribute('aria-pressed',String(b.dataset.examKey===key));});}};
 tabs.forEach(b=>b.addEventListener('click',()=>{page=0;scope=b.dataset.simScope;tabs.forEach(t=>t.setAttribute('aria-pressed',String(t===b)));render();}));
 $('sim-library-search').addEventListener('input',()=>{page=0;render();});
 $('sim-library-prev').addEventListener('click',()=>{page--;render();});$('sim-library-next').addEventListener('click',()=>{page++;render();});
 $('sim-library-reset').addEventListener('click',()=>{page=0;$('sim-library-search').value='';render();});
 window.addEventListener('campus-access-change',()=>{if(window.getSelectedEntranceExam?.()&&locked(window.EntranceLibrary.format(window.getSelectedEntranceExam())||{}))window.clearEntranceExam();if(entries.length)render();});
})();
