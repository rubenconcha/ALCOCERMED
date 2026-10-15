/* Shared curriculum boundary validation; metadata only, no questions. */
(function(root){
 const rules={first:{MORFOFUNCION:[1,11],'BIOLOGIA CELULAR':[1,6],'SALUD PUBLICA':[1,6]},second:{MORFOFUNCION:[12,20],'BIOLOGIA CELULAR':[7,12],'SALUD PUBLICA':[7,12]}};
 function validate(paper,scope){
  const rule=rules[scope];if(!rule||paper.scope!==scope||paper.duration!==100||paper.questions?.length!==100)return false;
  const counts={MORFOFUNCION:0,'BIOLOGIA CELULAR':0,'SALUD PUBLICA':0},ids=new Set(),stems=new Set();
  for(const q of paper.questions){
   const stem=String(q.pregunta||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
   const c=q.coverage,bounds=rule[c?.subject];if(!bounds||!Number.isInteger(c.chapter)||c.chapter<bounds[0]||c.chapter>bounds[1])return false;
   if(!q.id||ids.has(q.id)||!q.pregunta||stems.has(stem)||!['a','b','c','d'].every(l=>q['opcion_'+l])||!q.respuestas_aceptadas?.length)return false;
   ids.add(q.id);stems.add(stem);counts[c.subject]++;
  }
  return counts.MORFOFUNCION===50&&counts['BIOLOGIA CELULAR']===30&&counts['SALUD PUBLICA']===20;
 }
 const api={rules,validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SimulationScope=api;
})(typeof window!=='undefined'?window:globalThis);
