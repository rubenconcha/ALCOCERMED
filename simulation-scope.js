/* Shared curriculum boundary validation; metadata only, no questions. */
(function(root){
 const rules={first:{MORFOFUNCION:[1,11],'BIOLOGIA CELULAR':[1,6],'SALUD PUBLICA':[1,6]},second:{MORFOFUNCION:[12,20],'BIOLOGIA CELULAR':[7,12],'SALUD PUBLICA':[7,12]},final:{MORFOFUNCION:[1,29],'BIOLOGIA CELULAR':[1,18],'SALUD PUBLICA':[1,21]},'mini-foundations':{MORFOFUNCION:[1,8],'BIOLOGIA CELULAR':[1,1]}};
 function validateWeek2(paper){
  if(paper.id!=='semana2-testb-virtual'||paper.scope!=='semana2-testb-virtual'||paper.duration!==50||paper.total_points!==50||paper.questions?.length!==50||paper.review_status!=='approved'||paper.source?.library_file_id!=='libfile_f07bb5b6ade08191ada6ac361f117fdc')return false;
  const ids=new Set(),stems=new Set();
  const three=['1 es correcto','2 es correcto','3 es correcto','Todos son correctos','Ninguno es correcto'];
  const two=['1 es correcto','2 es correcto','Ambos son correctos','Ninguno es correcto'];
  const keys3={'100':'A','010':'B','001':'C','111':'D','000':'E'},keys2={'10':'A','01':'B','11':'C','00':'D'};
  return paper.questions.every((q,i)=>{
   const n=i+1,count=n<=30?3:2,options=count===3?three:two;
   const biology=(n>=21&&n<=30)||n>=41,subject=biology?'BIOLOGIA CELULAR':'MORFOFUNCION',topic=biology?'Biología Celular':n<=10?'Articulaciones':'Músculos';
   const stem=String(q.pregunta||'').trim(),v=q.truth_values;
   if(q.numero_original!==n||q.numero_pregunta!==n||q.puntos!==1||q.materia!==subject||q.tema!==topic||!q.id||ids.has(q.id)||!stem||stems.has(stem)||!q.comentario||q.respuestas_aceptadas?.length!==1||q.respuestas_aceptadas[0]!==q.respuesta_correcta)return false;
   if(!Array.isArray(v)||v.length!==count||v.some(value=>typeof value!=='boolean'))return false;
   const key=(count===3?keys3:keys2)[v.map(value=>value?'1':'0').join('')];
   if(!key||key!==q.respuesta_correcta||options.some((text,j)=>q['opcion_'+'abcde'[j]]!==text)||(count===2&&q.opcion_e))return false;
   const premiseNumbers=Array.from(stem.matchAll(/(?:^|\s)([123])(?:\.(?:-)?|-)/g),match=>Number(match[1]));
   if(premiseNumbers.length!==count||premiseNumbers.some((number,j)=>number!==j+1))return false;
   if(q.source_numero_original!==n||q.source?.library_file_id!==paper.source.library_file_id)return false;
   ids.add(q.id);stems.add(stem);return true;
  });
 }
 function validateWeek3(paper, scope){
  if(paper?.id!==scope||paper.scope!==scope||paper.duration!==50||paper.total_points!==50||paper.questions?.length!==50)return false;
  return paper.questions.every((q,i)=>{
   const n=i+1, count=n<=30?3:2, letters=count===3?'ABCDE':'ABCD';
   const biology=(n>=21&&n<=30)||n>=41, subject=biology?'BIOLOGIA CELULAR':'MORFOFUNCION';
   const statements=Array.from(String(q.pregunta||'').matchAll(/^([123])\. .+/gm),match=>Number(match[1]));
   return q.id===`semana3-virtual-${n}`&&q.numero_pregunta===n&&q.numero_original===n&&q.materia===subject&&Boolean(q.tema)&&q.puntos===1&&
    statements.length===count&&statements.every((number,j)=>number===j+1)&&
    [...letters].every(l=>Boolean(q['opcion_'+l.toLowerCase()]))&&(count===3||!q.opcion_e)&&
    [...letters].includes(q.respuesta_correcta)&&q.respuestas_aceptadas?.length===1&&q.respuestas_aceptadas[0]===q.respuesta_correcta;
  });
 }
 function isAssertionQuestion(q){
  const first=String(q.opcion_a||'').toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'');
  if(first!=='sololaafirmacion1escorrecta'&&!/^(?:si)?1(?:es)?(?:correct[oa]|incorrect[oa])$/.test(first))return false;
  if(q.truth_values===undefined)return true;
  const count=q.opcion_e?3:2;
  const combinations=count===3?['100','010','001','111','000']:['10','01','11','00'];
  if(!Array.isArray(q.truth_values)||q.truth_values.length!==count||q.truth_values.some(value=>typeof value!=='boolean'))return false;
  const lines=String(q.pregunta||'').split('\n').slice(1);
  return lines.length===count&&lines.every((line,i)=>line.startsWith((i+1)+'. '))&&
   combinations['ABCDE'.indexOf(q.respuesta_correcta)]===q.truth_values.map(Number).join('');
 }
 function validateTeaching(review, count){
  if(!review?.concepto?.trim() || review.afirmaciones?.length!==count ||
     !Array.isArray(review.repaso) || !review.repaso.length || review.repaso.length>count)return false;
  const pages=new Set();
  for(const entry of review.repaso){
   if(!Number.isInteger(entry.pagina)||entry.pagina<29||entry.pagina>1175||
      entry.impresa!==entry.pagina-28||!entry.tema?.trim()||pages.has(entry.pagina))return false;
   pages.add(entry.pagina);
  }
  return Array.isArray(review.afirmaciones)&&review.afirmaciones.every(row=>
   ['correcta','incorrecta','contraste'].includes(row.estado)&&row.comentario?.trim()&&pages.has(row.pagina));
 }
 function validatePrepa(paper, format){
  if(!format || paper?.id!==format.curatedId || paper.scope!=='prepa' || paper.title!==format.title ||
     paper.duration!==format.minutes || paper.total_points!==format.questionCount ||
     paper.questions?.length!==format.questionCount)return false;
  const second=paper.id==='prepa-segundo-a';
  const sources={
   'prepa-06':['prepa-06'],
   'prepa-07':['prepa-06','prepa-07-08'],
   'prepa-08':['prepa-07-08','prepa-08-09'],
   'prepa-09':['prepa-08-09']
  }[paper.id];
  const ids=new Set();
  return paper.questions.every((q,i)=>{
   const index=i+1,number=second&&index>25?index+25:index;
   const sourceNumber=sources?q.source_numero_original:number;
   const count=(sources?sourceNumber:index)<=25?3:2,letters=count===3?'ABCDE':'ABCD';
   const lines=String(q.pregunta||'').split('\n');
   const validId=sources?sources.some(id=>q.id===id+'-'+sourceNumber):q.id===paper.id+'-'+number;
   if(ids.has(q.id))return false;
   ids.add(q.id);
   return validId&&Number.isInteger(sourceNumber)&&sourceNumber>=1&&(!sources||sourceNumber<=50&&q.tema===format.title)&&q.numero_pregunta===index&&q.numero_original===number&&
    q.materia==='MORFOFUNCION'&&q.puntos===1&&Boolean(lines[0])&&lines.length===count+1&&
    lines.slice(1).every((line,j)=>line.startsWith((j+1)+'. ')&&line.slice(3).trim())&&
    [...letters].every(letter=>Boolean(q['opcion_'+letter.toLowerCase()]))&&(count===3||!q.opcion_e)&&
    [...letters].includes(q.respuesta_correcta)&&q.respuestas_aceptadas?.length===1&&
    q.respuestas_aceptadas[0]===q.respuesta_correcta&&validateTeaching(q.revision_docente,count);
  });
 }
 function validate(paper,scope,format){
  if(scope==='prepa')return validatePrepa(paper,format);
  if(scope==='semana2-testb-virtual')return validateWeek2(paper);
  if(scope==='semana3-grupo-virtual-2')return validateWeek3(paper,scope);
  const mini=scope==='mini-foundations',total=mini?50:100;
  const rule=rules[scope];if(!rule||paper.scope!==scope||paper.duration!==total||paper.questions?.length!==total)return false;
  if(mini&&(paper.questions.filter(q=>q.coverage?.subject==='MORFOFUNCION'&&q.coverage.chapter===1).length!==15||paper.questions.filter(q=>q.coverage?.subject==='MORFOFUNCION'&&q.coverage.chapter===8).length!==15))return false;
  const counts={MORFOFUNCION:0,'BIOLOGIA CELULAR':0,'SALUD PUBLICA':0},ids=new Set(),stems=new Set();
  for(const q of paper.questions){
   const stem=String(q.pregunta||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
   const c=q.coverage,bounds=rule[c?.subject];if(!bounds||!Number.isInteger(c.chapter)||c.chapter<bounds[0]||c.chapter>bounds[1])return false;
   if(q.materia!==c.subject||!q.id||ids.has(q.id)||!q.pregunta||stems.has(stem)||!['a','b','c','d'].every(l=>q['opcion_'+l])||q.respuestas_aceptadas?.length!==1)return false;
   const options=['a','b','c','d','e'].filter(l=>q['opcion_'+l]).map(l=>String(q['opcion_'+l]).trim().toLowerCase());
   if(!isAssertionQuestion(q)||new Set(options).size!==options.length||q.respuesta_correcta!==q.respuestas_aceptadas[0]||!q['opcion_'+q.respuesta_correcta?.toLowerCase()])return false;
   ids.add(q.id);stems.add(stem);counts[c.subject]++;
  }
  return counts.MORFOFUNCION===(mini?30:50)&&counts['BIOLOGIA CELULAR']===(mini?20:30)&&counts['SALUD PUBLICA']===(mini?0:20);
 }
 const api={rules,validate,isAssertionQuestion};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SimulationScope=api;
})(typeof window!=='undefined'?window:globalThis);
