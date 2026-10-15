'use strict';
(() => {
 const $=id=>document.getElementById(id),list=$('sim-library-list');if(!list)return;
 let catalogPromise,entries=[],category='all',page=0;const pageSize=6;
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const tabs=[...document.querySelectorAll('[data-sim-category]')];
 const locked=entry=>!entry.demo&&!entry.free&&CampusAccess.isFree();
 function render(){
  const query=normalize($('sim-library-search').value),year=$('sim-library-year').value,type=$('sim-library-type').value;
  const visible=entries.filter(e=>(category==='all'||e.category===category)&&(!year||e.year===year)&&(!type||e.type===type)&&normalize(e.title+' '+e.year+' '+e.description).includes(query));
  const pages=Math.ceil(visible.length/pageSize);page=Math.max(0,Math.min(page,pages-1));const shown=visible.slice(page*pageSize,(page+1)*pageSize);
  list.replaceChildren();
  for(const e of shown){
   const button=document.createElement('button');button.type='button';button.id='entrance-'+e.key;button.dataset.examKey=e.key;button.className='entrance-choice'+(locked(e)?' entrance-choice-premium':'');
   button.setAttribute('aria-label','Seleccionar '+e.title);button.setAttribute('aria-pressed','false');
   const top=document.createElement('span');top.className='entrance-choice-top';
   const tag=document.createElement('span');tag.className='entrance-choice-tag';tag.textContent=e.pastId?'EXAMEN REAL · '+e.year:'PRÁCTICA INTEGRAL';
   const radio=document.createElement('span');radio.className='entrance-choice-radio';radio.setAttribute('aria-hidden','true');top.append(tag,radio);
   const title=document.createElement('strong');title.textContent=e.title;
   const description=document.createElement('span');description.className='entrance-choice-description';description.textContent=e.description;
   const metrics=document.createElement('span');metrics.className='entrance-choice-metrics';metrics.innerHTML='<span><b>100</b> preguntas</span><span><b>100</b> minutos</span>';
   const access=document.createElement('span');access.className='entrance-choice-split';access.textContent=e.demo?'Acceso abierto · 50 / 30 / 20':locked(e)?'Requiere un plan vigente':e.free?'Disponible con tu cuenta':'Incluido en tu plan';
   button.append(top,title,description,metrics,access);button.addEventListener('click',()=>{selectEntranceExam(e.key);if(!locked(e))document.querySelector('.entrance-launch').scrollIntoView({block:'center'});});list.append(button);
  }
  $('sim-library-status').textContent=visible.length?'Mostrando '+(page*pageSize+1)+'–'+Math.min((page+1)*pageSize,visible.length)+' de '+visible.length+' simulacros completos':'No encontramos pruebas con esos filtros.';
  $('sim-library-pages').hidden=pages<=1;$('sim-library-prev').disabled=page===0;$('sim-library-next').disabled=page>=pages-1;$('sim-library-page').textContent='Página '+(page+1)+' de '+Math.max(1,pages);
  if(!visible.length){const empty=document.createElement('div');empty.className='sim-library-empty';empty.textContent='Prueba otra gestión o limpia los filtros para ver todas las pruebas.';list.append(empty);}
  const selected=window.getSelectedEntranceExam?.();if(selected&&!shown.some(e=>e.key===selected))window.clearEntranceExam();
  window.EntranceLibrary.markSelected(window.getSelectedEntranceExam?.());
 }
 async function open(){
  try{
   if(!catalogPromise)catalogPromise=fetch('/content/past-exams/catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{catalogPromise=null;throw e;});
   const data=await catalogPromise;
   const papers=data.exams.filter(e=>e.count===100&&!e.missingNumbers.length&&!e.excludedQuestions.length).slice().reverse();
   entries=papers.map(e=>({key:'real:'+e.id,pastId:e.id,title:e.title,year:e.year,type:e.type,category:'real',minutes:100,free:e.year===data.freeYear,description:'Preguntas y clave del examen original. Simulación con entrega automática a los 100 minutos.'}));
   entries.push({key:'full',title:'Práctica integral · acceso abierto',year:'',type:'Práctica integral',category:'practice',minutes:100,demo:true,description:'Un modelo completo para conocer la dinámica: 50 Morfofunción, 30 Biología Celular y 20 Educación para la Salud.'},{key:'premium-full',title:'Práctica integral · nueva selección',year:'',type:'Práctica integral',category:'practice',minutes:100,description:'Una selección del banco bibliográfico con el reparto 50 / 30 / 20. Las preguntas pueden coincidir entre intentos.'});
   $('sim-real-count').textContent=papers.length;
   const year=$('sim-library-year'),previous=year.value;year.replaceChildren(new Option('Todas las gestiones',''));
   [...new Set(papers.map(e=>e.year))].forEach(v=>year.add(new Option(v,v)));year.value=previous;
   render();
  }catch(_){$('sim-library-status').textContent='No pudimos cargar el catálogo. Puedes volver a intentarlo.';list.replaceChildren();window.clearEntranceExam();const retry=document.createElement('button');retry.type='button';retry.className='sim-library-retry';retry.textContent='Volver a cargar';retry.onclick=open;list.append(retry);}
 }
 window.EntranceLibrary={open,format:key=>entries.find(e=>e.key===key),markSelected(key){list.querySelectorAll('[data-exam-key]').forEach(b=>{b.classList.toggle('is-selected',b.dataset.examKey===key);b.setAttribute('aria-pressed',String(b.dataset.examKey===key));});}};
 tabs.forEach(b=>b.addEventListener('click',()=>{page=0;category=b.dataset.simCategory;tabs.forEach(t=>t.setAttribute('aria-pressed',String(t===b)));render();}));
 const filter=()=>{page=0;render();};$('sim-library-search').addEventListener('input',filter);['sim-library-year','sim-library-type'].forEach(id=>$(id).addEventListener('change',filter));
 $('sim-library-prev').addEventListener('click',()=>{page--;render();});$('sim-library-next').addEventListener('click',()=>{page++;render();});
 $('sim-library-reset').addEventListener('click',()=>{page=0;category='all';$('sim-library-search').value='';$('sim-library-year').value='';$('sim-library-type').value='';tabs.forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.simCategory==='all')));render();});
 window.addEventListener('campus-access-change',()=>{if(window.getSelectedEntranceExam?.()&&locked(window.EntranceLibrary.format(window.getSelectedEntranceExam())||{}))window.clearEntranceExam();if(entries.length)render();});
})();
