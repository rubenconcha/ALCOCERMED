'use strict';
(function(root){
 function snapshot(questions,answers,read,accepted){
  return {version:1,items:questions.map((q,i)=>{
   const options=['a','b','c','d','e'].map(k=>read(q,'opcion_'+k)).filter(v=>v!=null&&String(v).trim()!=='').map(String);
   const selected=answers[i]?.selected??null;
   return {number:q.numero_original||i+1,id:String(q.id||''),materia:String(read(q,'materia')||q.subject||''),tema:String(read(q,'tema')||q.topic||''),question:String(read(q,'pregunta')||''),options,selected,accepted:accepted(q,i),option_explanations:options.map((_,index)=>String(q.comentarios_opciones?.['ABCDE'[index]]||'')),explanation:String(read(q,'justificacion')||read(q,'comentario')||''),source:String(q.fuente||''),printed_page:String(q.pagina_impresa||''),pdf_page:String(q.paginas_pdf||'')};
  })};
 }
 function inspect(payload){
  if(!payload||payload.version!==1||!Array.isArray(payload.items))return null;
  return payload.items.map(q=>{
   if(!q||typeof q!=='object')return {question:'Detalle incompleto',options:[],selected:null,accepted:[],status:'unknown'};
   const valid=Array.isArray(q.options)&&Array.isArray(q.accepted)&&q.accepted.length>0&&q.accepted.every(n=>Number.isInteger(n)&&n>=0&&n<q.options.length)&&(q.selected===null||(Number.isInteger(q.selected)&&q.selected>=0&&q.selected<q.options.length));
   return {...q,status:!valid?'unknown':q.selected===null?'unanswered':q.accepted.includes(q.selected)?'correct':'wrong'};
  });
 }
 root.QuestionReview={snapshot,inspect};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.QuestionReview;
 if(typeof document==='undefined')return;
 const el=(tag,value,cls)=>{const node=document.createElement(tag);if(value!=null)node.textContent=value;if(cls)node.className=cls;return node;};
 let dialog,body,title,generation=0;
 function clear(){++generation;if(body)body.replaceChildren();if(dialog?.open)dialog.close();}
 async function open(table,id,label,inline){
  if(typeof currentAdmin==='undefined'||!currentAdmin)return;
  const actor=currentAdmin.id,request=++generation;
  if(!dialog){dialog=el('dialog',null,'question-review-dialog');dialog.id='question-review-dialog';title=el('h2');title.id='question-review-title';dialog.setAttribute('aria-labelledby',title.id);const header=el('header'),close=el('button','Cerrar','btn btn-secondary');close.type='button';close.onclick=()=>dialog.close();header.append(title,close);body=el('div');dialog.append(header,body);document.body.append(dialog);}
  title.textContent=label||'Revisión de respuestas';body.replaceChildren(el('p','Cargando respuestas del intento…'));if(!dialog.open)dialog.showModal();
  try{
   let payload=inline;
   if(payload===undefined&&id&&['resultados_simulacros','resultados_banco'].includes(table)){
    const {data,error}=await getSupabase().from(table).select('question_review').eq('id',id).single();if(error)throw Error('No se pudo consultar el detalle. Actualiza el panel e inténtalo de nuevo.');payload=data?.question_review;
   }
   if(request!==generation||actor!==currentAdmin?.id)return;
   const items=inspect(payload);body.replaceChildren();
   if(!items){body.append(el('p','Este intento antiguo solo conserva el resultado global. No guardó las respuestas por pregunta; no es posible reconstruir en cuáles se equivocó.','review-empty'));return;}
   const stats=el('div',null,'review-stats');[['correct','Correctas'],['wrong','Incorrectas'],['unanswered','Sin responder']].forEach(([key,label])=>{const card=el('div');card.append(el('strong',items.filter(q=>q.status===key).length),el('span',label));stats.append(card);});body.append(stats);if(items.some(q=>q.status==='unknown'))body.append(el('p','Algunas respuestas tienen un detalle incompleto; no se clasifican como correctas o incorrectas.'));
   const filters=el('div',null,'review-filters'),list=el('div',null,'review-question-list');body.append(filters,list);
   function draw(filter){
    filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));list.replaceChildren();
    const rows=items.filter(q=>filter==='all'||q.status===filter);
    if(!rows.length)list.append(el('p','No hay preguntas en esta categoría.'));
    rows.forEach(q=>{
     const card=el('article',null,'review-question '+q.status);card.append(el('span','Pregunta '+q.number+' · '+({wrong:'Incorrecta',correct:'Correcta',unanswered:'Sin responder',unknown:'Detalle incompleto'}[q.status]),'review-question-label'),el('h3',q.question));
     (q.options||[]).forEach((option,index)=>{const answer=el('p',String.fromCharCode(65+index)+'. '+option,'review-option');if(q.accepted?.includes(index)){answer.classList.add('accepted');answer.append(el('strong',' · Correcta'));}if(q.selected===index){answer.classList.add('selected');answer.append(el('strong',' · Eligió el estudiante'));}card.append(answer);});
     if(q.selected===null)card.append(el('p','El estudiante no respondió esta pregunta.'));
     if(q.selected!==null&&q.option_explanations?.[q.selected])card.append(el('p','Sobre la opción elegida: '+q.option_explanations[q.selected],'review-explanation'));
     if(q.explanation)card.append(el('p',q.explanation,'review-explanation'));
     if(q.source)card.append(el('small','Fuente del material: '+q.source+(q.printed_page?' · Página impresa: '+q.printed_page:'')+(q.pdf_page?' · Página PDF: '+q.pdf_page:'')));
     list.append(card);
    });
   }
   [['wrong','Incorrectas'],['unanswered','Sin responder'],['all','Todas las preguntas']].forEach(([key,label])=>{const button=el('button',label,'btn btn-secondary');button.type='button';button.dataset.filter=key;button.onclick=()=>draw(key);filters.append(button);});draw('wrong');
  }catch(error){if(request===generation&&actor===currentAdmin?.id)body.replaceChildren(el('p',error.message));}
 }
 root.QuestionReview.open=open;root.QuestionReview.clear=clear;
})(typeof window==='undefined'?globalThis:window);
