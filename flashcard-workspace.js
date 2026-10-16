/* Session controls preserve saved review dates; browsing never rates a card. */
(function(){
 const modeSelect=document.getElementById('flashcard-mode'),subSelect=document.getElementById('flashcard-subtopic');
 if(!modeSelect||!subSelect)return;
 let topic='',subject='',all=[],mode='due',subtopic='',pending=false,owner=null;
 const value=(row,key)=>row?.[key]??row?.[key.toUpperCase()]??'';
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const make=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text)n.textContent=text;return n;};
 function senseArt(card){
  if(!/sentidos/.test(normalize(value(card,'tema'))))return null;
  // The question selects context only; no answer is exposed before revealing.
  const choices=[
   [/vestibul|equilibrio|otolit|macula|cupula|semicircular/,'Equilibrio','0% 100%'],
   [/audici|sonid|oido|cocle|basilar|acustic|timpan|corti|estereo/,'Audición','100% 0%'],
   [/vision|visual|retin|ojo|fotorreceptor|baston|cono|cristalin|pupila|cornea|optico/,'Visión','50% 0%'],
   [/olfat|olor|nasal/,'Olfato','100% 100%'],
   [/gusto|gustativ|sabor|lengua|papila/,'Gusto','50% 100%']
  ];
  const match=choices.find(([re])=>re.test(normalize(value(card,'pregunta'))))||choices.find(([re])=>re.test(normalize(value(card,'subtema'))));
  return match?{label:match[1],position:match[2]}:{label:'Sensibilidad general',position:'0% 0%'};
 }
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
  const art=senseArt(card);
  if(art){
   const figure=make('figure','fc-context-art');
   const visual=make('div','fc-sense-illustration');visual.style.backgroundPosition=art.position;
   visual.setAttribute('role','img');visual.setAttribute('aria-label','Ilustración de contexto: '+art.label);
   figure.append(visual,make('figcaption','',art.label+' · ilustración de contexto'));
   front.append(figure);
  }
  front.append(make('span','fc-recall-hint','Piensa tu respuesta y luego compruébala.'));
 }
 function restart(){if(!all.length||typeof currentUser==='undefined'||currentUser?.id!==owner)return;pending=true;startDeck(topic,subject,all);}
 modeSelect.addEventListener('change',()=>{mode=modeSelect.value;restart();});
 subSelect.addEventListener('change',()=>{subtopic=subSelect.value;restart();});
 document.getElementById('flashcard-shuffle').addEventListener('click',restart);
 window.FlashcardWorkspace={
  clear(){topic='';subject='';all=[];mode='due';subtopic='';pending=false;owner=null;document.getElementById('flashcard-inventory').textContent='';document.getElementById('flashcard-context').textContent='';},
  isExploring:()=>mode==='all',
  renderAnswer(node,card){
   const raw=String(value(card,'respuesta'));
   const split=raw.match(/^([\s\S]*?)\n\nFuente:\s*([\s\S]+)$/);
   node.replaceChildren();
   const paragraphs=(split?split[1]:raw).split(/\n\s*\n/).filter(Boolean);
   const first=paragraphs[0]?.match(/^(.{30,}?[.!?])\s+(?=[A-ZÁÉÍÓÚÜÑ¿])/);
   if(first)paragraphs.splice(0,1,first[1],paragraphs[0].slice(first[0].length));
   paragraphs.forEach((text,i)=>node.append(make('span',i?'fc-answer-paragraph':'fc-answer-lead',text)));
   if(split)node.append(make('small','fc-answer-source','Fuente: '+split[2]));
   node.parentElement.scrollTop=0;
  },
  prepare(name,materia,cards){
   if(!pending||name!==topic||materia!==subject){mode='due';subtopic='';}
   pending=false;topic=name;subject=materia;all=cards;owner=typeof currentUser==='undefined'?null:currentUser?.id;
   modeSelect.value=mode;
   const groups=[...new Set(cards.map(c=>value(c,'subtema')||'Base del tema'))];
   subSelect.replaceChildren();
   for(const label of ['Todos los subtemas',...groups]){const o=document.createElement('option');o.value=label==='Todos los subtemas'?'':label;o.textContent=label;subSelect.append(o);}
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
   meta.textContent=card?[value(card,'subtema')||'Base del tema',value(card,'tipo')||'Repaso'].join(' · '):'';
   const n=document.getElementById('card-total');
   const label=document.getElementById('flashcard-session-label');
   if(label)label.textContent=mode==='all'?'Exploración':'Repaso de hoy';
   const fill=document.getElementById('flashcard-progress-fill');
   const total=Number(n?.textContent)||0;
   if(fill)fill.style.width=(total?Math.min(100,(Number(document.getElementById('card-num').textContent)||0)/total*100):0)+'%';
  }
 };
})();
