'use strict';
(() => {
 const $=id=>document.getElementById(id),list=$('sim-library-list');if(!list)return;
 const search=$('sim-library-search'),kind=$('sim-library-kind'),topic=$('sim-library-topic'),partial=$('sim-library-scope');
 const isTopic=e=>Boolean(e.topics?.length);
 let catalogPromise,entries=[],launchPending=false;
 const normalize=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const locked=e=>!e.demo&&!e.free&&CampusAccess.isFree();
 function render(){
  const query=normalize(search.value),scope=partial.value;
  topic.disabled=kind.value==='general';
  topic.closest('label').hidden=topic.disabled;
  partial.disabled=kind.value==='topic';
  partial.closest('label').hidden=partial.disabled;
  const visible=entries.filter(e=>{
   if(kind.value && (kind.value==='topic')!==isTopic(e))return false;
   if(topic.value && !e.topics?.some(t=>t.id===topic.value))return false;
   if(scope && !(scope==='mini-foundations'?e.kind==='mini':(e.stage||e.scope)===scope))return false;
   return normalize([e.title,e.type,...(e.topics||[]).map(t=>t.label)].join(' ')).includes(query);
  });
  list.replaceChildren();
  for(const e of visible){
   const card=document.createElement('article');card.id='entrance-'+e.key;card.dataset.examKey=e.key;card.className='sim-library-card';
   const tag=document.createElement('span');tag.className='sim-library-stage';tag.textContent=e.demo ? e.type + ' · Muestra gratuita' : e.type;
   const title=document.createElement('h3');title.textContent=e.title;
   const metrics=document.createElement('p');metrics.textContent=(e.questionCount||100)+' preguntas · '+e.minutes+' minutos';
   const button=document.createElement('button');button.type='button';button.className='btn-primary';button.textContent=e.kind==='mini'?'comenzar minisimulacro →':'realizar simulacro →';button.setAttribute('aria-label','Realizar '+e.title+' · '+e.type);button.disabled=launchPending;
   button.addEventListener('click',async()=>{
    if(launchPending)return;
    if(locked(e))return CampusAccess.unlock();
    selectEntranceExam(e.key);
    launchPending=true;list.querySelectorAll('button').forEach(b=>b.disabled=true);button.textContent='Preparando preguntas…';
    try{await iniciarSimulacro();}finally{launchPending=false;render();}
   });
   card.append(tag,title,metrics,button);list.append(card);
  }
  $('sim-library-status').textContent=visible.length===1?'1 simulacro':visible.length+' simulacros';
  if(!visible.length){const empty=document.createElement('p');empty.className='sim-library-empty';empty.textContent='No encontramos simulacros con esos filtros.';list.append(empty);}
 }
 function updateTopics(){
  const selected=topic.value;
  const topics=new Map(entries.flatMap(e=>(e.topics||[]).map(t=>[t.id,t.label])));
  topic.replaceChildren(new Option('Todos los temas',''));
  const options=[...topics].sort((a,b)=>Number(a[0].split('-').at(-1))-Number(b[0].split('-').at(-1)));
  for(const [id,label] of options)topic.add(new Option(label,id));
  if(topics.has(selected))topic.value=selected;
 }
 async function open(){
  try{
   if(!catalogPromise)catalogPromise=fetch('/content/simulacros-catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{catalogPromise=null;throw e;});
   entries=(await catalogPromise).entries;updateTopics();render();
  }catch(_){$('sim-library-status').textContent='No pudimos cargar las pruebas.';list.replaceChildren();window.clearEntranceExam();const retry=document.createElement('button');retry.type='button';retry.className='sim-library-retry';retry.textContent='Volver a cargar';retry.onclick=open;list.append(retry);}
 }
 window.EntranceLibrary={
  open,
  format:key=>entries.find(e=>e.key===key),
  reveal(entry){
   kind.value=isTopic(entry)?'topic':'';
   topic.value='';partial.value='';search.value=entry.title;
   render();
  },
  markSelected(key){list.querySelectorAll('[data-exam-key]').forEach(card=>card.classList.toggle('is-selected',card.dataset.examKey===key));}
 };
 search.addEventListener('input',render);
 kind.addEventListener('change',()=>{
  if(kind.value==='topic')partial.value='';
  else topic.value='';
  render();
 });
 topic.addEventListener('change',()=>{
  if(topic.value){kind.value='topic';partial.value='';}
  render();
 });
 partial.addEventListener('change',render);
 window.addEventListener('campus-access-change',()=>{if(window.getSelectedEntranceExam?.()&&locked(window.EntranceLibrary.format(window.getSelectedEntranceExam())||{}))window.clearEntranceExam();if(entries.length)render();});
})();
