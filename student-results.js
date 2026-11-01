'use strict';
(function(root){
 const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const localDate=v=>typeof v==='number'&&Number.isFinite(v)?new Date(v).toISOString():String(v||'');
 const count=v=>v!==null&&v!==undefined&&v!==''&&Number.isSafeInteger(Number(v))&&Number(v)>=0?Number(v):null;
 const aliases={'morfofuncion':'Morfofunción','morfo funcion':'Morfofunción','biologia celular':'Biología celular','salud publica':'Salud pública','educacion en salud e investigacion':'Salud pública','matematicas':'Matemáticas','matematica':'Matemáticas','fisica':'Física','quimica':'Química','lectura':'Lectura comprensiva','lectura comprensiva':'Lectura comprensiva'};
 const subject=v=>aliases[norm(v)]||null;
 function inspect(payload){
  if(!payload||payload.version!==1||!Array.isArray(payload.items)||!payload.items.length)return null;
  return payload.items.map(q=>{
   q=q&&typeof q==='object'?q:{};
   const options=Array.isArray(q.options)?q.options:[],selected=Number.isInteger(q.selected)&&q.selected>=0&&q.selected<options.length?q.selected:null;
   const key=Array.isArray(q.accepted)&&q.accepted.length>0&&q.accepted.every(n=>Number.isInteger(n)&&n>=0&&n<options.length);
   const status=q.selected===null?'unanswered':selected===null||!key?'unknown':q.accepted.includes(selected)?'correct':'wrong';
   return {...q,options,selected,status,key};
  });
 }
 function freezeSufficiency(questions,attempt,bank,C,label){
  const score=C.grade(questions,attempt.answers);
  const question_review={version:1,items:questions.map((q,index)=>({number:index+1,id:String(q.id),question:q.text,options:q.options.map((_,i)=>C.optionText(q,i)),selected:attempt.answers[q.id]??null,accepted:[q.correct],materia:C.subjects[q.subject]||q.subject,tema:q.topic||'',explanation:q.explanation||'',source:typeof q.source?.document==='string'?q.source.document:'',passage:bank.passages?.find(p=>p.id===q.passageId)?.text||''}))};
  return {owner:attempt.owner,paperId:C.paper(bank,attempt.area)?.id||'last-practice',title:label,at:attempt.finishedAt,percent:score.percent,correct:score.correct,total:score.total,question_review};
 }
 function localRows(storage,id){
  if(!id)return [];try{
   const records=JSON.parse(storage.getItem('alcocermed:suficiencia:v1:'+id+':papers')||'{}'),last=JSON.parse(storage.getItem('alcocermed:suficiencia:v1:'+id)||'null');
   const entries=Object.entries(records);if(last?.owner===id&&last.finished===true&&last.result_snapshot)entries.push([last.result_snapshot.paperId,last.result_snapshot]);
   return own(entries.flatMap(([key,r])=>r&&r.owner===id&&r.paperId===key&&count(r.correct)!==null&&count(r.total)!==null&&r.correct<=r.total&&r.percent!==null&&Number.isFinite(r.percent)&&r.percent>=0&&r.percent<=100&&Number.isFinite(Date.parse(localDate(r.at)))?[{id:'local:'+key+':'+localDate(r.at),user_id:id,menu_section:'simulacros',simulacro_titulo:r.title||'Simulacro '+key,materia:'Sin materia registrada',created_at:localDate(r.at),porcentaje:r.percent,correctas:r.correct,incorrectas:null,sin_respuesta:null,local:true,question_review:r.question_review??null}]:[]),id);
  }catch(_){return [];}
 }
 function kind(r){return ['simulacros','evaluaciones','examenes'].includes(r.menu_section)?r.menu_section:/^evaluaci[oó]n\s*:/i.test(r.simulacro_titulo||'')?'evaluaciones':'historicos';}
 function own(rows,id,filters={}){
  if(!id)return [];
  const seen=new Set();
  return rows.filter(r=>{
   if(r.user_id!==id||r.id==null||seen.has(String(r.id)))return false;
   seen.add(String(r.id));const day=String(r.created_at||'').slice(0,10);
   return (!filters.type||kind(r)===filters.type)&&(!filters.from||day>=filters.from)&&(!filters.to||day<=filters.to);
  }).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
 }
 function summary(r){
  const items=inspect(r.question_review);
  if(items)return {correct:items.filter(q=>q.status==='correct').length,wrong:items.filter(q=>q.status==='wrong').length,omitted:items.filter(q=>q.status==='unanswered').length,unknown:items.filter(q=>q.status==='unknown').length,items};
  return {correct:count(r.correctas),wrong:count(r.incorrectas),omitted:count(r.sin_respuesta),unknown:null,items:null};
 }
 function analyze(rows){
  const subjects=new Map(),questions=new Map(),topics=new Map();let excluded=0,historical=0;
  const add=(label,c,w,o,u)=>{if(!subjects.has(label))subjects.set(label,{label,correct:0,wrong:0,omitted:0,unknown:0});const s=subjects.get(label);s.correct+=c;s.wrong+=w;s.omitted+=o;s.unknown+=u;};
  rows.forEach(r=>{
   const s=summary(r),fallback=subject(r.materia);
   if(s.items){s.items.forEach(q=>{
    const rawSubject=q.materia||q.subject,label=rawSubject?subject(rawSubject):fallback;
    if(label)add(label,+(q.status==='correct'),+(q.status==='wrong'),+(q.status==='unanswered'),+(q.status==='unknown'));else excluded++;
    if((q.tema||q.topic)&&['correct','wrong'].includes(q.status)){const labelTopic=(label?label+' · ':'')+String(q.tema||q.topic);if(!topics.has(labelTopic))topics.set(labelTopic,{label:labelTopic,wrong:0,answered:0});const t=topics.get(labelTopic);t.answered++;t.wrong+=+(q.status==='wrong');}
    if(q.question&&['correct','wrong'].includes(q.status)){
     // Text plus presented options avoids joining changed exam versions by recycled IDs.
     const key=JSON.stringify([q.question,q.options,q.accepted]);
     if(!questions.has(key))questions.set(key,{label:q.question,wrong:0,answered:0});
     const item=questions.get(key);item.answered++;item.wrong+=+(q.status==='wrong');
    }
   });}else if(r.question_review==null&&fallback&&s.correct!==null&&s.wrong!==null&&s.omitted!==null){add(fallback,s.correct,s.wrong,s.omitted,0);historical++;}else excluded++;
  });
  const result=[...subjects.values()],totalWrong=result.reduce((n,s)=>n+s.wrong,0);
  result.forEach(s=>{s.answered=s.correct+s.wrong;s.share=totalWrong?s.wrong/totalWrong*100:0;s.rate=s.answered?s.wrong/s.answered*100:null;});
  return {subjects:result,totalWrong,excluded,historical,topics:[...topics.values()].filter(t=>t.wrong).sort((a,b)=>b.wrong-a.wrong).slice(0,5),questions:[...questions.values()].filter(q=>q.wrong).sort((a,b)=>b.wrong-a.wrong||b.answered-a.answered).slice(0,5)};
 }
 // One account-scoped request generation: stale successes AND failures cannot overwrite another account.
 function loader(api,actor,deliver){let generation=0;return {clear(){generation++;deliver(null);},async load(){const request=++generation,id=actor();deliver(null);if(!id)return;try{
  const session=(await api.auth.getSession()).data.session;if(session?.user?.id!==id)throw Error('Vuelve a iniciar sesión para consultar tus resultados.');
  const fields='id,user_id,materia,simulacro_titulo,created_at,porcentaje,correctas,incorrectas,sin_respuesta,tiempo_segundos,menu_section,question_review';
  let rows=[],offset=0,columns=fields;
  for(;;){let res=await api.from('resultados_simulacros').select(columns).eq('user_id',id).order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+99);
   if(['PGRST204','42703'].includes(res.error?.code)){const missing=['menu_section','question_review'].find(k=>columns.includes(','+k)&&res.error.message.includes(k));if(missing){columns=columns.replace(','+missing,'');continue;}}
   if(res.error)throw Error('No se pudo cargar tu historial. Intenta actualizarlo.');if(!Array.isArray(res.data))throw Error('Historial no disponible.');
   if(request!==generation||actor()!==id)return;rows.push(...own(res.data,id));if(res.data.length<100)break;offset+=100;
  }
  const live=(await api.auth.getSession()).data.session;if(request===generation&&actor()===id&&live?.user?.id===id)deliver({rows:own(rows,id),owner:id});
 }catch(error){if(request===generation&&actor()===id)deliver({error:error.message});}}};}
 root.StudentResultsModel={inspect,kind,own,summary,analyze,loader,localRows,freezeSufficiency};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.StudentResultsModel;
 if(typeof document==='undefined')return;
 const el=(tag,value,cls)=>{const n=document.createElement(tag);if(value!=null)n.textContent=value;if(cls)n.className=cls;return n;};
 const labels={simulacros:'Simulacro',evaluaciones:'Evaluación',examenes:'Examen',historicos:'Histórico sin tipo registrado'},states={correct:'Acertada',wrong:'Incorrecta',unanswered:'Omitida',unknown:'Sin clave válida / detalle incompleto'};
 const pct=n=>n===null||!Number.isFinite(Number(n))||Number(n)<0||Number(n)>100?'—':Number(n).toLocaleString('es-BO',{maximumFractionDigits:1})+'%';
 const screen=el('section',null,'student-results hidden');screen.id='student-results-screen';
 const header=el('div',null,'sim-header'),back=el('button','← Volver','btn-back-game'),heading=el('div');back.type='button';back.onclick=()=>goBack();heading.append(el('span','PREPARATORIA BEN CARSON · MEDICINA UMSS','entrance-eyebrow'),el('h2','Mis resultados'),el('p','Tu historial de simulacros, evaluaciones y exámenes realizados.'));header.append(back,heading);
 const filters=el('div',null,'past-filters'),type=el('select'),from=el('input'),to=el('input'),refresh=el('button','Actualizar','btn-back-game');from.type=to.type='date';refresh.type='button';
 [['','Todos los tipos'],['simulacros','Simulacros'],['evaluaciones','Evaluaciones'],['examenes','Exámenes'],['historicos','Históricos sin tipo']].forEach(([value,label])=>{const o=el('option',label);o.value=value;type.append(o);});
 [['Tipo',type],['Desde (UTC)',from],['Hasta (UTC)',to]].forEach(([label,input])=>{const l=el('label',label);input.setAttribute('aria-label',label);l.append(input);filters.append(l);});filters.append(refresh);
 const status=el('p'),content=el('div'),detail=el('div');status.setAttribute('role','status');screen.append(header,filters,status,content,detail);document.querySelector('main').append(screen);
 let data=null,detailGeneration=0,owner=null;
 function clear(){data=null;owner=null;detailGeneration++;content.replaceChildren();detail.replaceChildren();status.textContent='';}
 let api,load;
 const actor=()=>typeof currentUser==='undefined'?null:currentUser?.id;
 function reset(){if(load)load.clear();else clear();content.hidden=false;filters.hidden=false;type.value=from.value=to.value='';}
 root.StudentResults={clear:reset};
 async function ready(){
  if(load)return;
  if(typeof ensureSupabaseSdk==='function')await ensureSupabaseSdk();
  api=getSupabase();
  load=loader(api,actor,value=>{clear();if(!value){status.textContent=actor()?'Cargando tu historial…':'Inicia sesión para ver tus resultados.';return;}if(value.error){status.textContent=value.error;return;}let local=[];try{local=localRows(localStorage,value.owner);}catch(_){}data=[...value.rows,...local];owner=value.owner;render();});
  api.auth.onAuthStateChange(event=>{if(!['INITIAL_SESSION','TOKEN_REFRESHED'].includes(event))reset();});
 }
 async function reload(){const account=actor();reset();try{await ready();if(actor()===account&&currentCampusScreen===screen.id)await load.load();}catch(_){if(actor()===account)status.textContent='No se pudo conectar. Vuelve a intentar actualizar tu historial.';}}
 function metric(label,value){const card=el('div',null,'eval-metric-card');card.append(el('strong',value,'eval-metric-num'),el('span',label));return card;}
 function render(){
  if(!data||actor()!==owner)return;detailGeneration++;detail.replaceChildren();content.replaceChildren();
  if(from.value&&to.value&&from.value>to.value){status.textContent='La fecha inicial debe ser anterior a la final.';return;}
  const rows=own(data,owner,{type:type.value,from:from.value,to:to.value});status.textContent=rows.length?rows.length+' intentos realizados · más recientes primero':'No tienes intentos realizados en este período.';
  const scores=rows.map(r=>r.porcentaje).filter(n=>n!==null&&n!==''&&Number.isFinite(Number(n))&&Number(n)>=0&&Number(n)<=100).map(Number),metrics=el('div',null,'eval-metrics-grid');
  metrics.append(metric('Intentos',rows.length),metric('Simulacros',rows.filter(r=>kind(r)==='simulacros').length),metric('Promedio de notas registradas',pct(scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null)),metric('Mejor nota registrada',pct(scores.length?Math.max(...scores):null)));content.append(metrics);
  const note=el('p','El historial usa resultados guardados en tu cuenta; no incluye actividad de flashcards. Suficiencia conserva los últimos resultados locales por simulacro y cuenta en este navegador; se identifica como local, sin reconstruir sus respuestas. Los intentos antiguos sin tipo se muestran como históricos.','sr-note');content.append(note);
  const list=el('div',null,'sr-attempts');rows.forEach(r=>{const card=el('article',null,'eval-section-card'),text=el('div');text.append(el('small',labels[kind(r)]+(r.local?' · Último resultado local':'')+' · '+String(r.created_at||'').replace('T',' ').slice(0,16)+' UTC'),el('h3',r.simulacro_titulo||'Intento realizado'),el('p',(r.materia||'Materia sin registrar')+' · Nota registrada: '+pct(r.porcentaje==null?null:Number(r.porcentaje))));const button=el('button','Ver resultado y revisar preguntas','btn-primary');button.type='button';button.onclick=()=>review(r);card.append(text,button);list.append(card);});drawAnalysis(rows,content);content.append(el('h3','Historial de intentos'),list);
 }
 function drawAnalysis(rows,target){
  const a=analyze(rows),box=el('section',null,'eval-section-card');box.append(el('h3','Errores por materia'));
  if(!a.subjects.length)box.append(el('p','No hay detalle suficiente para atribuir errores por materia.'));
  if(a.totalWrong){const chart=el('div',null,'sr-chart'),pie=el('div',null,'sr-pie'),legend=el('div'),colors=['#218bc1','#d49318','#8062bc','#26977c','#c15a53','#54769b','#89744a'];let cursor=0;const stops=[];
   a.subjects.forEach((s,i)=>{stops.push(colors[i%colors.length]+' '+cursor+'% '+(cursor+s.share)+'%');cursor+=s.share;const line=el('p',s.label+': '+s.wrong+' errores · '+pct(s.share)+' del total de errores');line.style.borderLeft='8px solid '+colors[i%colors.length];line.style.paddingLeft='10px';legend.append(line);});pie.style.background='conic-gradient('+stops.join(',')+')';pie.setAttribute('role','img');pie.setAttribute('aria-label','Distribución de '+a.totalWrong+' errores por materia; cifras en la leyenda.');chart.append(pie,legend);box.append(chart);
  }else box.append(el('p','Sin errores atribuibles en este intento.'));
  a.subjects.forEach(s=>{const row=el('div',null,'sr-rate');row.append(el('p',s.label+' · '+pct(s.rate)+' errores / respondidas con clave ('+s.wrong+'/'+s.answered+')'),el('small',s.omitted+' omitidas · '+s.unknown+' sin clave o detalle válido'));const bar=el('div',null,'sr-bar'),fill=el('span');fill.style.width=(s.rate||0)+'%';bar.append(fill);row.append(bar);box.append(row);});
  if(a.excluded)box.append(el('p',a.excluded+' preguntas o intentos excluidos del análisis por materia por falta de atribución fiable. Los simulacros mixtos requieren materia por pregunta.','sr-note'));
  if(a.historical)box.append(el('p','Incluye agregados históricos de una sola materia. No permiten identificar preguntas individuales ni verificar retrospectivamente sus claves.','sr-note'));
  if(a.topics.length){box.append(el('h3','Temas con más errores (detalle guardado)'));a.topics.forEach(t=>{const row=el('div',null,'sr-rate');row.append(el('p',t.label+' · '+t.wrong+' errores / '+t.answered+' respuestas con clave'));const bar=el('div',null,'sr-bar'),fill=el('span');fill.style.width=(t.wrong/a.topics[0].wrong*100)+'%';bar.append(fill);row.append(bar);box.append(row);});}
  if(a.questions.length){box.append(el('h3','Preguntas con más errores (detalle guardado)'));a.questions.forEach(q=>{const row=el('div',null,'sr-rate');row.append(el('p',q.label+' · '+q.wrong+' errores / '+q.answered+' respuestas con clave'));const bar=el('div',null,'sr-bar'),fill=el('span');fill.style.width=(q.wrong/a.questions[0].wrong*100)+'%';bar.append(fill);row.append(bar);box.append(row);});}
  target.append(box);
 }
 async function review(row){
  if(actor()!==owner)return;const account=owner,request=++detailGeneration;content.hidden=true;filters.hidden=true;detail.replaceChildren();const close=el('button','← Volver a mi historial','btn-back-game');close.type='button';close.onclick=()=>{detailGeneration++;detail.replaceChildren();content.hidden=false;filters.hidden=false;};detail.append(close,el('h2',row.simulacro_titulo||'Resultado'),el('p','Cargando respuestas guardadas…'));detail.scrollIntoView({block:'start'});
  const valid=()=>request===detailGeneration&&actor()===account&&owner===account;
  try{
   const session=(await api.auth.getSession()).data.session;if(session?.user?.id!==account)throw Error('Vuelve a iniciar sesión.');
   const res=row.local?{data:{id:row.id,user_id:account,question_review:row.question_review??null}}:await api.from('resultados_simulacros').select('id,user_id,question_review').eq('user_id',account).eq('id',row.id).single();
   const missing=['PGRST204','42703'].includes(res.error?.code)&&/question_review/.test(res.error.message);
   if(res.error&&!missing)throw Error('No se pudo cargar el detalle de este intento. Vuelve al historial e inténtalo de nuevo.');
   const live=(await api.auth.getSession()).data.session;if(!valid()||live?.user?.id!==account)return;
   if(!missing&&(res.data?.user_id!==account||String(res.data?.id)!==String(row.id)))throw Error('Este intento no está disponible para tu cuenta.');
   const record={...row,question_review:missing?null:res.data.question_review},s=summary(record);detail.replaceChildren(close,el('h2',row.simulacro_titulo||'Resultado'));
   const stats=el('div',null,'eval-metrics-grid');[['correct','Aciertos'],['wrong','Errores'],['omitted','Omitidas'],['unknown','Sin clave / detalle incompleto']].forEach(([key,label])=>stats.append(metric(label,s[key]??'No registrado')));detail.append(stats);drawAnalysis([record],detail);
   if(!s.items){detail.append(el('p',record.question_review==null?'Este intento conserva solo el resumen. No se guardaron las respuestas individuales; no es posible reconstruir aciertos y errores por pregunta.':'El detalle guardado está incompleto o no tiene un formato compatible. Se conserva la nota original.','sr-note'));return;}
   const tabs=el('div',null,'sr-review-filters'),questions=el('div');detail.append(tabs,questions);
   function draw(filter){tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));questions.replaceChildren();const items=s.items.filter(q=>filter==='all'||q.status===filter);if(!items.length)questions.append(el('p','No hay preguntas en esta categoría.'));items.forEach((q,i)=>{const card=el('article',null,'eval-section-card sr-question '+q.status);card.append(el('small','Pregunta '+(q.number||i+1)+' · '+states[q.status]),el('h3',q.question||'Enunciado no guardado'));if(q.passage)card.append(el('p',q.passage,'sr-passage'));q.options.forEach((o,index)=>{const p=el('p',String.fromCharCode(65+index)+'. '+String(o),'sr-option');if(q.selected===index){p.classList.add('selected');p.append(el('strong',' · Tu respuesta'));}if(q.key&&q.accepted.includes(index)){p.classList.add('accepted');p.append(el('strong',' · Correcta según la clave guardada'));}card.append(p);});if(q.status==='unanswered')card.append(el('p','No respondiste esta pregunta.'));if(q.status==='unknown')card.append(el('p','No hay clave o detalle válido suficiente para calificar esta respuesta.'));if(q.explanation)card.append(el('p','Comentario: '+q.explanation));if(q.option_explanations?.[q.selected])card.append(el('p','Sobre tu respuesta: '+q.option_explanations[q.selected]));if(q.source)card.append(el('small','Fuente: '+q.source));questions.append(card);});}
   [['all','Todas'],['correct','Acertadas'],['wrong','Incorrectas'],['unanswered','Omitidas'],['unknown','Sin clave / detalle incompleto']].forEach(([key,label])=>{const b=el('button',label,'btn-back-game');b.type='button';b.dataset.filter=key;b.onclick=()=>draw(key);tabs.append(b);});draw('all');
  }catch(error){if(valid())detail.replaceChildren(close,el('p',error.message));}
 }
 refresh.onclick=reload;[type,from,to].forEach(n=>n.addEventListener('change',render));
 root.openStudentResults=()=>{if(showScreen(screen.id)===false)return;return reload();};
 // Browser Back / campus navigation must invalidate pending detail requests as well.
 new MutationObserver(()=>{if(screen.classList.contains('hidden')){reset();}}).observe(screen,{attributes:true,attributeFilter:['class']});
})(typeof window==='undefined'?globalThis:window);
