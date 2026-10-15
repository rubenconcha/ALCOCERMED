/* Independent reviewed sets use the existing authenticated content endpoint. */
(function(){
 window.StudyAssessments={
  async load(topic,kind){
   if(topic!=='sangre'||!['simulation','evaluation'].includes(kind))throw new Error('Prueba desconocida.');
   if(!window.CampusAccess||CampusAccess.isFree())throw new Error('Esta prueba requiere acceso vigente.');
   const session=(await getSupabase().auth.getSession()).data.session;
   if(!session?.access_token)throw new Error('Inicia sesión para abrir esta prueba.');
   const response=await fetch('/api/mindmap?id=morfo_18_sangre__09',{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('No pudimos cargar la prueba. Comprueba tu acceso y vuelve a intentar.');
   const pack=(await response.json()).assets?.independent_assessments?.[kind];
   const current=(await getSupabase().auth.getSession()).data.session;
   if(CampusAccess.isFree()||current?.access_token!==session.access_token)throw new Error('Tu sesión cambió. Vuelve a abrir la prueba.');
   if(!pack||pack.questions.length!==6)throw new Error('Esta prueba no tiene la distribución completa.');
   return pack.questions.map((q,index)=>{
    const references=q.supplementary_references.length?' · Complementos: '+q.supplementary_references.join(' · '):'';
    const row={content_id:q.content_id,materia:'MORFOFUNCION',tema:'sangre',numero_pregunta:index+1,pregunta:q.question,respuesta_correcta:'ABCD'[q.correct],justificacion:q.reasons.map((r,i)=>'ABCD'[i]+'. '+r).join('\n\n'),fuente:'Saladin, Anatomía y fisiología · capítulo 18'+references,paginas_pdf:q.pdf_pages.join(', '),dificultad:q.difficulty};
    'abcd'.split('').forEach((letter,i)=>row['opcion_'+letter]=q.options[i]);return row;
   });
  }
 };
})();
