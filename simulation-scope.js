/* Shared curriculum boundary validation; metadata only, no questions. */
(function(root){
 const rules={first:{MORFOFUNCION:[1,11],'BIOLOGIA CELULAR':[1,6],'SALUD PUBLICA':[1,6]},second:{MORFOFUNCION:[12,20],'BIOLOGIA CELULAR':[7,12],'SALUD PUBLICA':[7,12]},final:{MORFOFUNCION:[1,29],'BIOLOGIA CELULAR':[1,18],'SALUD PUBLICA':[1,21]},'mini-foundations':{MORFOFUNCION:[1,8],'BIOLOGIA CELULAR':[1,1]}};
 function validateWeek2(paper){
  if(paper.id!=='semana2-testb-virtual'||paper.scope!=='semana2-testb-virtual'||paper.duration!==50||paper.total_points!==50||paper.questions?.length!==50)return false;
  const ids=new Set(),stems=new Set();
  return paper.questions.every((q,i)=>{
   const n=i+1,subject=n<=30?'MORFOFUNCION':'BIOLOGIA CELULAR',topic=n<=14?'Articulaciones':n<=30?'Músculos':'Biología Celular';
   const letters=n<=40?'ABCDE':'ABCD',stem=String(q.pregunta||'').trim();
   if(q.numero_original!==n||q.numero_pregunta!==n||q.puntos!==1||q.materia!==subject||q.tema!==topic||!q.id||ids.has(q.id)||!stem||stems.has(stem)||!q.comentario||q.respuestas_aceptadas?.length!==1||q.respuestas_aceptadas[0]!==q.respuesta_correcta||!letters.includes(q.respuesta_correcta)||q.respuesta_correcta.length!==1)return false;
   const options=[...letters].map(l=>q['opcion_'+l.toLowerCase()]);
   if(options.some(o=>!String(o||'').trim())||new Set(options).size!==letters.length||(n>40&&q.opcion_e))return false;
   if((stem.match(/^(?:I|II|III)\./gm)||[]).length!==(n<=40?3:2))return false;
   ids.add(q.id);stems.add(stem);return true;
  });
 }
 function validate(paper,scope){
  if(scope==='semana2-testb-virtual')return validateWeek2(paper);
  const mini=scope==='mini-foundations',total=mini?50:100;
  const rule=rules[scope];if(!rule||paper.scope!==scope||paper.duration!==total||paper.questions?.length!==total)return false;
  if(mini&&(paper.questions.filter(q=>q.coverage?.subject==='MORFOFUNCION'&&q.coverage.chapter===1).length!==15||paper.questions.filter(q=>q.coverage?.subject==='MORFOFUNCION'&&q.coverage.chapter===8).length!==15))return false;
  const counts={MORFOFUNCION:0,'BIOLOGIA CELULAR':0,'SALUD PUBLICA':0},ids=new Set(),stems=new Set();
  for(const q of paper.questions){
   const stem=String(q.pregunta||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
   const c=q.coverage,bounds=rule[c?.subject];if(!bounds||!Number.isInteger(c.chapter)||c.chapter<bounds[0]||c.chapter>bounds[1])return false;
   if(q.materia!==c.subject||!q.id||ids.has(q.id)||!q.pregunta||stems.has(stem)||!['a','b','c','d'].every(l=>q['opcion_'+l])||q.respuestas_aceptadas?.length!==1)return false;
   const options=['a','b','c','d','e'].filter(l=>q['opcion_'+l]).map(l=>String(q['opcion_'+l]).trim().toLowerCase());
   if(new Set(options).size!==options.length||q.respuesta_correcta!==q.respuestas_aceptadas[0]||!q['opcion_'+q.respuesta_correcta?.toLowerCase()])return false;
   ids.add(q.id);stems.add(stem);counts[c.subject]++;
  }
  return counts.MORFOFUNCION===(mini?30:50)&&counts['BIOLOGIA CELULAR']===(mini?20:30)&&counts['SALUD PUBLICA']===(mini?0:20);
 }
 const api={rules,validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SimulationScope=api;
})(typeof window!=='undefined'?window:globalThis);
