/* Independent reviewed sets use the existing authenticated content endpoint. */
(function(){
 const topics={sangre:{id:'morfo_18_sangre__09',chapter:18},'organos de los sentidos':{id:'morfo_16_organos_sentidos__11',chapter:16}};
 window.StudyAssessments={
  async load(topic,kind){
   const config=Object.hasOwn(topics,topic)?topics[topic]:null;
   if(!config||!['simulation','evaluation'].includes(kind))throw new Error('Prueba desconocida.');
   if(!window.CampusAccess||CampusAccess.isFree())throw new Error('Esta prueba requiere acceso vigente.');
   const session=(await getSupabase().auth.getSession()).data.session;
   if(!session?.access_token)throw new Error('Inicia sesión para abrir esta prueba.');
   const response=await fetch('/api/mindmap?id='+encodeURIComponent(config.id),{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('No pudimos cargar la prueba. Comprueba tu acceso y vuelve a intentar.');
   const payload=await response.json();
   if(payload.id!==config.id)throw new Error('La prueba recibida no corresponde al tema.');
   const pack=payload.assets?.independent_assessments?.[kind];
   const current=(await getSupabase().auth.getSession()).data.session;
   if(CampusAccess.isFree()||current?.access_token!==session.access_token)throw new Error('Tu sesión cambió. Vuelve a abrir la prueba.');
   if(!pack||pack.questions.length!==6)throw new Error('Esta prueba no tiene la distribución completa.');
   return pack.questions.map((q,index)=>{
    const references=q.supplementary_references.length?' · Complementos: '+q.supplementary_references.join(' · '):'';
    const row={content_id:q.content_id,materia:'MORFOFUNCION',tema:topic,numero_pregunta:index+1,pregunta:q.question,respuesta_correcta:'ABCD'[q.correct],justificacion:q.reasons.map((r,i)=>'ABCD'[i]+'. '+r).join('\n\n'),fuente:'Saladin, Anatomía y fisiología · capítulo '+config.chapter+references,paginas_pdf:q.pdf_pages.join(', '),dificultad:q.difficulty};
    'abcd'.split('').forEach((letter,i)=>row['opcion_'+letter]=q.options[i]);return row;
   });
  }
 };
})();
