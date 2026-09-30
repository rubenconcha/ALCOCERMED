/* Clase de encéfalo: identidad local y Supabase Realtime público, sin Auth ni tablas. */
'use strict';
(() => {
 const $ = id => document.getElementById(id);
 const query = new URLSearchParams(location.search);
 let room = (query.get('sala') || ('AULA-' + new Date().toISOString().slice(0,10))).toUpperCase();
 if (!/^[A-Z0-9-]{3,32}$/.test(room)) room = 'AULA-ENCEFALO';
 $('room').value = room;
 let observer = query.get('podio') === '1', bank, student, channel, client, activeRound = 0, connected = false;
 let records = {}, state = { answers: [[], []] };
 const storage = {get(k,fallback){try{return JSON.parse(localStorage.getItem(k)) ?? fallback;}catch{return fallback;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{$('share-message').textContent='Este navegador no permite guardar. Descarga tus resultados antes de salir.';}}};
 const key = suffix => 'encefalo-v1:' + room + ':' + suffix;
 const safeName = s => typeof s === 'string' ? s.trim().replace(/\s+/g,' ').slice(0,60) : '';
 const show = id => ['entry','lobby','quiz','result'].forEach(x => $(x).hidden = x !== id);
 function score(answers) { return answers.reduce((sum, list) => sum + list.filter(a => a.correct).length * 100, 0); }
 function save(){ if(student) storage.set(key('student'), {student,state}); }
 function ownRecord(){return {id:student.id,name:student.name,score:score(state.answers),answered:state.answers.flat().length,rounds:state.answers.map(x=>x.length),updated:Date.now()};}
 function valid(r){return r && typeof r.id === 'string' && /^[a-zA-Z0-9-]{8,64}$/.test(r.id) && safeName(r.name).length>=3 && Number.isInteger(r.score) && r.score>=0 && r.score<=2000 && r.score%100===0 && Number.isInteger(r.answered) && r.answered>=0 && r.answered<=20 && r.score<=r.answered*100 && Number.isFinite(r.updated);}
 function merge(r){if(!valid(r))return; const old=records[r.id]; if(!old || r.answered>old.answered || (r.answered===old.answered && r.updated>old.updated)) records[r.id]={id:r.id,name:safeName(r.name),score:r.score,answered:r.answered,updated:r.updated};}
 function remember(){storage.set(key('records'),records);renderRanking();}
 function status(text, offline=false){$('connection').textContent=text;$('connection').classList.toggle('offline',offline);}
 function emit(event,payload){if(connected && channel) return channel.send({type:'broadcast',event,payload});return Promise.resolve('offline');}
 function publish(){if(!student)return;const r=ownRecord();merge(r);remember();emit('result',r);if(connected)channel.track(r);}
 function renderRanking(){
  const sorted=Object.values(records).filter(valid).sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name,'es') || a.id.localeCompare(b.id));
  $('podium').replaceChildren();$('ranking').replaceChildren();
  if(!sorted.length){const p=document.createElement('p');p.textContent='Los estudiantes aparecerán al entrar a esta sala.';$('podium').append(p);return;}
  let rank=0,last=-1;
  sorted.forEach((r,i)=>{if(r.score!==last)rank=i+1;last=r.score;
   if(i<3){const card=document.createElement('div');card.className='podium-place';const medal=document.createElement('span');medal.className='medal';medal.textContent=rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':'🏅';const name=document.createElement('strong');name.textContent=r.name;const pts=document.createElement('span');pts.textContent=r.score+' pts';const pos=document.createElement('small');pos.textContent='Puesto '+rank+' · '+r.answered+'/20';card.append(medal,name,pts,pos);$('podium').append(card);}
   const li=document.createElement('li'),name=document.createElement('span'),pts=document.createElement('span');name.textContent=rank+'. '+r.name;pts.textContent=r.score+' pts · '+r.answered+'/20';li.append(name,pts);$('ranking').append(li);
  });
 }
 async function connect(){
  $('live').hidden=false;$('room-title').textContent='Sala '+room;
  records=storage.get(key('records'),{});if(!records || typeof records!=='object')records={};renderRanking();
  if(!window.supabase || !window.ALCOCER_CONFIG){status('Sin conexión al podio. Tu avance se guarda aquí.',true);return;}
  // Clave pública anon ya utilizada por la plataforma; no crea sesión de usuario.
  client=window.supabase.createClient(window.ALCOCER_CONFIG.SUPABASE_URL,window.ALCOCER_CONFIG.SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  channel=client.channel('encefalo-v1:'+room,{config:{broadcast:{self:false},presence:{key:student ? student.id : crypto.randomUUID()}}});
  channel.on('broadcast',{event:'result'},({payload})=>{merge(payload);remember();})
   .on('broadcast',{event:'snapshot'},({payload})=>{if(Array.isArray(payload))payload.slice(0,1000).forEach(merge);remember();})
   .on('broadcast',{event:'request'},()=>{const list=Object.values(records);for(let i=0;i<list.length;i+=100)emit('snapshot',list.slice(i,i+100));})
   .on('presence',{event:'sync'},()=>{Object.values(channel.presenceState()).flat().forEach(merge);remember();})
   .subscribe(s=>{connected=s==='SUBSCRIBED';if(connected){status('● En vivo');publish();emit('request',{});}else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(s)){status('Reconectando… Tu avance está guardado en este navegador.',true);}});
 }
 function lobby(){show('lobby');$('greeting').textContent='¡Hola, '+student.name+'!';[0,1].forEach(i=>{const n=state.answers[i].length;$('round-state-'+i).textContent=n===10?'Ver resultado · '+score([state.answers[i]])+' pts':n?'Continuar · '+n+'/10 →':'Comenzar →';});}
 function endRound(){show('result');const pts=score([state.answers[activeRound]]);$('result-title').textContent=pts+' de 1000 puntos';$('result-description').textContent='Completaste la ronda '+(activeRound+1)+' con '+pts/100+' de 10 respuestas correctas. Tu total en la sala es '+score(state.answers)+' puntos.';publish();}
 function startRound(i){activeRound=i;if(state.answers[i].length===10){endRound();return;}renderQuestion();}
 function renderQuestion(){
  show('quiz');const index=state.answers[activeRound].length,q=bank.rounds[activeRound].questions[index];
  $('progress').textContent='Ronda '+(activeRound+1)+' · '+(index+1)+'/10';$('progress-bar').value=index;$('score').textContent=score([state.answers[activeRound]])+' pts';
  $('question-type').textContent={mc:'SELECCIÓN ÚNICA',ms:'SELECCIÓN MÚLTIPLE · MARCA TODAS LAS CORRECTAS',tf:'VERDADERO O FALSO',match:'RELACIONA CADA CONCEPTO'}[q.type];
  $('question-title').textContent=q.prompt;$('question-image').src=q.image;$('question-image').alt=q.alt;$('image-caption').textContent=q.caption;
  $('feedback').hidden=true;$('next-question').hidden=true;$('check-answer').hidden=false;$('check-answer').disabled=false;$('answers').replaceChildren();
  if(q.type==='match'){
   const shuffled=q.pairs.map((p,i)=>({text:p[1],value:i}));for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
   q.pairs.forEach((pair,i)=>{const label=document.createElement('label');label.className='match';label.textContent=pair[0];const select=document.createElement('select');select.name='pair-'+i;select.required=true;select.add(new Option('Elige una relación…',''));shuffled.forEach(p=>select.add(new Option(p.text,p.value)));label.append(select);$('answers').append(label);});
  }else q.options.forEach((text,i)=>{const label=document.createElement('label');label.className='option';const input=document.createElement('input');input.type=q.type==='ms'?'checkbox':'radio';input.name='answer';input.value=i;if(q.type!=='ms')input.required=true;const span=document.createElement('span');span.textContent=text;label.append(input,span);$('answers').append(label);});
  $('answer-form').onsubmit=e=>{e.preventDefault();check(q);};$('question-title').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
 }
 function check(q){
  if($('check-answer').disabled)return;let selected,correct;
  if(q.type==='match'){selected=Array.from($('answers').querySelectorAll('select')).map(x=>Number(x.value));correct=selected.every((v,i)=>v===i);}
  else{selected=Array.from($('answers').querySelectorAll('input:checked')).map(x=>Number(x.value));if(!selected.length){$('feedback').hidden=false;$('feedback').textContent='Selecciona al menos una respuesta.';return;}correct=selected.length===q.correct.length && selected.every(x=>q.correct.includes(x));}
  $('check-answer').disabled=true;$('check-answer').hidden=true;$('answers').querySelectorAll('input,select').forEach(x=>x.disabled=true);
  state.answers[activeRound].push({id:q.id,correct,selected});save();publish();
  const answer=q.type==='match'?q.pairs.map(p=>p[0]+' → '+p[1]).join('; '):q.correct.map(i=>q.options[i]).join('; ');
  $('feedback').className='feedback'+(correct?'':' wrong');$('feedback').hidden=false;$('feedback').textContent=(correct?'¡Correcto! +100 puntos. ':'Para recordar: ')+answer+'. '+q.explanation+' (Diap. '+q.slides+').';
  $('progress-bar').value=state.answers[activeRound].length;$('score').textContent=score([state.answers[activeRound]])+' pts';$('next-question').hidden=false;$('next-question').textContent=state.answers[activeRound].length===10?'Ver resultado →':'Siguiente pregunta →';
 }
 $('next-question').onclick=()=>state.answers[activeRound].length===10?endRound():renderQuestion();
 $('back-lobby').onclick=$('result-back').onclick=lobby;
 document.querySelectorAll('[data-round]').forEach(b=>b.onclick=()=>startRound(Number(b.dataset.round)));
 $('join-form').onsubmit=async e=>{e.preventDefault();if(!bank){$('entry-error').textContent='Las preguntas aún no están listas. Recarga la página.';return;}
  const name=safeName($('student-name').value);if(name.length<3){$('entry-error').textContent='Escribe al menos 3 caracteres para tu nombre.';return;}
  room=$('room').value.trim().toUpperCase();if(!/^[A-Z0-9-]{3,32}$/.test(room))return;
  const previous=storage.get(key('student'),null);if(previous && previous.student.name===name){student=previous.student;state=previous.state;}else{student={id:crypto.randomUUID(),name};state={answers:[[],[]]};}
  save();const url=new URL(location.href);url.searchParams.set('sala',room);url.searchParams.delete('podio');history.replaceState({},'',url);$('change-name').hidden=false;lobby();await connect();publish();
 };
 $('change-name').onclick=async()=>{if(channel)await client.removeChannel(channel);connected=false;student=null;$('change-name').hidden=true;$('live').hidden=true;show('entry');$('student-name').value='';$('student-name').focus();};
 $('new-room').onclick=()=>{$('room').value='NEURO-'+crypto.randomUUID().slice(0,8).toUpperCase();$('entry-error').textContent='Sala creada. Entra o abre el podio y copia el enlace para tu clase.';};
 $('open-podium').onclick=()=>{if(!$('room').checkValidity()){$('room').reportValidity();return;}const url=new URL(location.href);url.searchParams.set('sala',$('room').value.toUpperCase());url.searchParams.set('podio','1');location.href=url;};
 $('copy-link').onclick=async()=>{const url=new URL(location.href);url.searchParams.set('sala',room);url.searchParams.delete('podio');try{await navigator.clipboard.writeText(url.href);$('share-message').textContent='Enlace copiado. Compártelo con la clase.';}catch{$('share-message').textContent=url.href;}};
 $('download-results').onclick=()=>{const cell=v=>'"'+String(v).replace(/^[=+@-]/,"'").replace(/"/g,'""')+'"';const rows=[['Nombre','Puntos','Respondidas','Sala'],...Object.values(records).filter(valid).sort((a,b)=>b.score-a.score).map(r=>[r.name,r.score,r.answered,room])];const blob=new Blob(['\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='podio-'+room+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('zoom-image').onclick=()=>{$('large-image').src=$('question-image').src;$('large-image').alt=$('question-image').alt;$('image-dialog').showModal();};$('close-image').onclick=()=>$('image-dialog').close();
 window.addEventListener('offline',()=>status('Sin conexión. Tu avance se conserva aquí.',true));
 window.addEventListener('online',()=>{if(connected)publish();});
 fetch('encefalo-preguntas.json?v=1').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{bank=data;$('join-button').disabled=false;$('join-button').textContent='Entrar a jugar →';if(observer){show(null);connect();}else{const prev=storage.get(key('student'),null);if(prev)$('student-name').value=prev.student.name;}}).catch(()=>{$('entry-error').textContent='No se pudieron cargar las preguntas. Comprueba la conexión y recarga.';});
})();

