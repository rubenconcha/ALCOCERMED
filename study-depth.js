/* Reviewed supplements are read from the same protected source as their maps. */
(function(){
 const topics=[{id:'morfo_18_sangre__07',topic:'sangre',chapter:18},{id:'morfo_16_organos_sentidos__07',topic:'organos de los sentidos',chapter:16},{id:'morfo_16_organos_sentidos__08',topic:'organos de los sentidos',chapter:16},{id:'morfo_18_sangre__08',topic:'sangre',chapter:18},{id:'morfo_16_organos_sentidos__09',topic:'organos de los sentidos',chapter:16},{id:'morfo_16_organos_sentidos__10',topic:'organos de los sentidos',chapter:16},{id:'morfo_16_organos_sentidos__11',topic:'organos de los sentidos',chapter:16},{id:'morfo_18_sangre__09',topic:'sangre',chapter:18},{id:'morfo_18_sangre__10',topic:'sangre',chapter:18},{id:'morfo_18_sangre__11',topic:'sangre',chapter:18},{id:'morfo_18_sangre__12',topic:'sangre',chapter:18},{id:'morfo_18_sangre__13',topic:'sangre',chapter:18},{id:'morfo_18_sangre__14',topic:'sangre',chapter:18},{id:'morfo_18_sangre__15',topic:'sangre',chapter:18},{id:'morfo_12_tejido_nervioso__01',topic:'tejido nervioso',chapter:12,library:'flashcard_library'}];
 topics.push({id:'flashcards_official_2026',library:'flashcard_library'});
 let pending=null;
 const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');
 const field=(row,key)=>row[key]??row[key.toUpperCase()];
 const key=row=>['materia','tema','pregunta'].map(k=>normalize(field(row,k))).join('|');
 function identity(text){let hash=2166136261;for(const char of text){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16);}
 async function load(){
  if(!window.CampusAccess||CampusAccess.isFree())return {flashcards:[],bank:[]};
  const {data}=await getSupabase().auth.getSession(),token=data.session?.access_token;
  if(!token)throw new Error('Inicia sesión para cargar la ampliación de estudio.');
  // Share simultaneous library/bank requests only; keep no content cache across sessions.
  if(pending&&pending.token===token)return pending.promise;
  const promise=(async()=>{
   const packs=await Promise.all(topics.map(async topic=>{
    const response=await fetch('/api/mindmap?id='+encodeURIComponent(topic.id),{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('No pudimos cargar la ampliación de estudio. Reintenta en unos momentos.');
    const payload=await response.json();
    const practice=payload.assets?.[topic.library||'practice'];
    if(payload.id!==topic.id||!practice)throw new Error('La ampliación de estudio no está disponible.');
    return {topic:{...topic,label:payload.title},practice};
   }));
   const result={flashcards:[],bank:[],revisions:new Map()};
   for(const {topic,practice} of packs){
    const source=topic.chapter?'Saladin, Anatomía y fisiología · capítulo '+topic.chapter+(practice.supplementary_reference?' · Ampliación fisiológica: '+practice.supplementary_reference:''):'';
    const convert=card=>{
     const cardSource=(card.source||source)+(card.supplementary_reference?' · Complemento: '+card.supplementary_reference:'');
     const pages=card.pdf_span?'rango del capítulo: '+card.pdf_span.join('–')+' del PDF':'páginas '+card.pdf_pages.join(', ')+' del PDF';
     return {id:'depth:'+topic.id+':fc:'+identity(card.materia?card.materia+'|'+card.tema+'|'+card.question:card.question),materia:card.materia||'MORFOFUNCION',tema:card.tema||topic.topic,pregunta:card.match_question||card.question,revised_question:card.match_question?card.question:null,respuesta:card.answer+'\n\nFuente: '+cardSource+' · '+pages+'.',fuente:cardSource,paginas_pdf:(card.pdf_span||card.pdf_pages).join('–'),subtema:card.subtopic||topic.label||'',tipo:card.type||'Repaso',source_reviewed:true};
    };
    practice.flashcards.forEach(card=>result.flashcards.push(convert(card)));
    (practice.revisions||[]).forEach(card=>{const row=convert(card);result.revisions.set(key(row),row);if(!card.existing_only)result.flashcards.push(row);});
    practice.questions.forEach(q=>{
     const row={MATERIA:'MORFOFUNCION',TEMA:topic.topic,PREGUNTA:q.question,RESPUESTA_CORRECTA:'ABCD'[q.correct],EXPLICACION:q.reasons.map((reason,i)=>'ABCD'[i]+'. '+reason).join('\n\n'),DIFICULTAD:'medio',FUENTE:source,PAGINAS_PDF:q.pdf_pages.join(', '),content_id:'depth:'+topic.id+':q:'+identity(q.question)};
     'ABCD'.split('').forEach((letter,i)=>row['OPCION_'+letter]=q.options[i]);
     // No database row is invented: existing cloud-error tracking requires a real database ID.
     result.bank.push(row);
    });
   }
   const current=await getSupabase().auth.getSession();
   if(current.data.session?.access_token!==token||CampusAccess.isFree())throw new Error('Tu sesión cambió. Vuelve a abrir el recurso.');
   return result;
  })();
  pending={token,promise};
  try{return await promise;}finally{if(pending?.promise===promise)pending=null;}
 }
 window.StudyDepth={
  async merge(rows,kind){
   if(!window.CampusAccess||CampusAccess.isFree())return rows;
   const loaded=await load(),supplement=loaded[kind];
   if(!supplement)throw new Error('Recurso de estudio desconocido.');
   const revised=kind==='flashcards'?rows.map(row=>{const replacement=loaded.revisions.get(key(row));if(!replacement)return row;const copy={...row,respuesta:replacement.respuesta,subtema:replacement.subtema,tipo:replacement.tipo,fuente:replacement.fuente,paginas_pdf:replacement.paginas_pdf,source_reviewed:true};if(Object.hasOwn(row,'RESPUESTA'))copy.RESPUESTA=replacement.respuesta;if(replacement.revised_question){copy.pregunta=replacement.revised_question;if(Object.hasOwn(row,'PREGUNTA'))copy.PREGUNTA=replacement.revised_question;}return copy;}):rows;
   const seen=new Set(revised.map(key));
   return revised.concat(supplement.filter(row=>{const k=key(row);if(seen.has(k))return false;seen.add(k);return true;}));
  }
 };
})();
