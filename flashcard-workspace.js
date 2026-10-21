/* Session controls preserve saved review dates; browsing never rates a card. */
(function(){
 const modeSelect=document.getElementById('flashcard-mode'),subSelect=document.getElementById('flashcard-subtopic');
 if(!modeSelect||!subSelect)return;
 const settingsToggle=document.getElementById('flashcard-settings-toggle');
 function setSettings(open){
  document.getElementById('study-area').classList.toggle('fc-settings-open',open);
  if(settingsToggle){settingsToggle.setAttribute('aria-expanded',String(open));settingsToggle.textContent=open?'Cerrar':'Ajustes';}
 }
 settingsToggle?.addEventListener('click',()=>setSettings(settingsToggle.getAttribute('aria-expanded')!=='true'));
 let topic='',subject='',all=[],mode='due',subtopic='',pending=false,owner=null;
 const value=(row,key)=>row?.[key]??row?.[key.toUpperCase()]??'';
 const make=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
 function decorate(card){
  const front=document.querySelector('#card .front .text-inner');
  if(!front)return;
  front.querySelectorAll('.fc-topic-chip,.fc-context-art,.fc-recall-hint').forEach(n=>n.remove());
  if(!card)return;
  document.querySelectorAll('#card .face').forEach(face=>{
   if(!face.querySelector('.fc-brand-wordmark')){
    const brand=make('div','fc-brand-wordmark');
    brand.append(make('small','','PREPARATORIA'),make('strong','','ben carson'));
    face.append(brand);
   }
  });
  front.prepend(make('span','fc-topic-chip',value(card,'subtema')||value(card,'tema')));
  const art=window.StudyMedia?.create(card.study_image);
  if(art){const figure=make('figure','fc-context-art fc-study-figure');figure.append(art);front.append(figure);}
 }
 function restart(){if(!all.length||typeof currentUser==='undefined'||currentUser?.id!==owner)return;pending=true;startDeck(topic,subject,all);}
 modeSelect.addEventListener('change',()=>{mode=modeSelect.value;restart();});
 subSelect.addEventListener('change',()=>{subtopic=subSelect.value;restart();});
 document.getElementById('flashcard-shuffle').addEventListener('click',restart);
 window.FlashcardWorkspace={
  clear(){setSettings(false);topic='';subject='';all=[];mode='due';subtopic='';pending=false;owner=null;document.getElementById('flashcard-inventory').textContent='';document.getElementById('flashcard-context').textContent='';},
  isExploring:()=>mode==='all',
  renderAnswer(node,card){
   node.replaceChildren();
   node.append(make('span','fc-answer-lead',String(value(card,'respuesta'))));
   const back=node.closest('.back-text');
   let source=back.querySelector('.fc-answer-source');
   if(!source){source=make('div','fc-answer-source');back.append(source);}
   source.textContent=value(card,'reference');
   back.querySelectorAll('.fc-answer-table').forEach(table=>table.remove());
   back.classList.toggle('has-answer-table',Boolean(card.answer_table));
   if(card.answer_table){
    const data=card.answer_table,figure=make('figure','fc-answer-table');
    const table=make('table','');table.append(make('caption','',data.title));
    const head=make('thead',''),header=make('tr','');
    data.columns.forEach(label=>{const cell=make('th','',label);cell.scope='col';header.append(cell);});head.append(header);table.append(head);
    const body=make('tbody','');
    data.rows.forEach(row=>{const tr=make('tr','');row.forEach((text,index)=>{const cell=make(index?'td':'th','',String(text).replace(/\bAnti-/g,'Anti‑'));if(!index)cell.scope='row';tr.append(cell);});body.append(tr);});
    table.append(body);figure.append(table,make('figcaption','',data.note));
    if(data.reference!==value(card,'reference'))figure.append(make('small','fc-table-reference',data.reference));
    back.insertBefore(figure,source);
   }
   node.parentElement.scrollTop=0;
  },
  prepare(name,materia,cards){
   if(!pending||name!==topic||materia!==subject){mode='due';subtopic='';setSettings(false);}
   pending=false;topic=name;subject=materia;all=cards;owner=typeof currentUser==='undefined'?null:currentUser?.id;
   modeSelect.value=mode;
   const groups=new Map();
   for(const card of cards){const label=value(card,'subtema')||'Base del tema';groups.set(label,(groups.get(label)||0)+1);}
   subSelect.replaceChildren();
   const every=document.createElement('option');every.value='';every.textContent='Todos los subtemas · '+cards.length;subSelect.append(every);
   for(const [label,count] of groups){const o=document.createElement('option');o.value=label;o.textContent=label+' · '+count+' tarjetas';subSelect.append(o);}
   subSelect.value=subtopic;
   const filtered=cards.filter(c=>!subtopic||(value(c,'subtema')||'Base del tema')===subtopic);
   const due=filtered.filter(isCardDue).length;
   document.getElementById('flashcard-inventory').textContent=cards.length+' tarjetas en el tema · '+filtered.length+' en esta selección · '+due+' disponibles hoy';
   document.getElementById('flashcard-mode-help').textContent=mode==='all'?'Exploración: puedes verlas todas sin cambiar tus fechas de repaso.':'Repaso programado: las tarjetas calificadas vuelven cuando llega su fecha.';
   document.getElementById('study-area').classList.toggle('fc-exploring',mode==='all');
   return filtered;
  },
  render(card){
   decorate(card);
   const meta=document.getElementById('flashcard-context');
   meta.textContent='';
   const n=document.getElementById('card-total');
   const label=document.getElementById('flashcard-session-label');
   if(label)label.textContent=mode==='all'?'Exploración':'Repaso de hoy';
   const fill=document.getElementById('flashcard-progress-fill');
   const total=Number(n?.textContent)||0;
   if(fill)fill.style.width=(total?Math.min(100,(Number(document.getElementById('card-num').textContent)||0)/total*100):0)+'%';
  }
 };
})();
