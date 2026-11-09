'use strict';
(function(root){
 function studentComment(value) {
  return typeof value === 'string'
   ? value.replace(/\s*Adaptación del concepto evaluado en el examen de referencia; se eliminó la clave ambigua\.?/ig, '').trim()
   : '';
 }
 function commentaryData(q, read) {
  let explanation = studentComment(read(q, 'justificacion') || read(q, 'explicacion') || read(q, 'comentario'));
  const options = [...'abcde'].map(letter => read(q, 'opcion_' + letter)).filter(value => value != null && String(value).trim()).map(String);
  const comments = read(q, 'comentarios_opciones');
  const reading = read(q, 'banco_lectura');
  const references = read(q, 'lecturas_comentario');
  const teaching = read(q, 'revision_docente');
  const option_explanations = options.map((_, i) => String(comments?.['ABCDE'[i]] || '').trim());
  const blocks = explanation.split(/\n\s*\n/);
  // Some saved bank questions carry their existing option comments in a single field.
  if (options.length && blocks.length === options.length && blocks.every((block, i) => block.startsWith('ABCDE'[i] + '. '))) {
   blocks.forEach((block, i) => { option_explanations[i] ||= block.slice(3).trim(); });
   explanation = '';
  }
  return {
   options, explanation, option_explanations,
   source: String(read(q, 'fuente_comentario') || read(q, 'fuente') || ''),
   printed_page: String(read(q, 'pagina_impresa') || ''),
   pdf_page: String(read(q, 'paginas_pdf') || ''),
   ...(reading?.title ? { reading } : {}),
   ...(Array.isArray(references) && references.length ? { references } : {}),
   ...(teaching?.concepto && teaching.afirmaciones?.length ? { teaching } : {}),
  };
 }
 function snapshot(questions, answers, read, accepted) {
  return {version: 1, items: questions.map((q, i) => ({
   ...commentaryData(q, read),
   number: q.numero_original || i + 1,
   id: String(q.id ?? q.content_id ?? ''),
   materia: String(read(q, 'materia') || q.subject || ''),
   tema: String(read(q, 'tema') || q.topic || ''),
   question: String(read(q, 'pregunta') || ''),
   selected: answers[i]?.selected ?? null,
   accepted: accepted(q, i),
   ...(q.passage?.text ? {passage: q.passage.text} : {}),
  }))};
 }
 function inspect(payload){
  if(!payload||payload.version!==1||!Array.isArray(payload.items))return null;
  return payload.items.map(q=>{
   if(!q||typeof q!=='object')return {question:'Detalle incompleto',options:[],selected:null,accepted:[],status:'unknown'};
   const valid=Array.isArray(q.options)&&Array.isArray(q.accepted)&&q.accepted.length>0&&q.accepted.every(n=>Number.isInteger(n)&&n>=0&&n<q.options.length)&&(q.selected===null||(Number.isInteger(q.selected)&&q.selected>=0&&q.selected<q.options.length));
   return {...q,status:!valid?'unknown':q.selected===null?'unanswered':q.accepted.includes(q.selected)?'correct':'wrong'};
  });
 }
 root.QuestionReview={snapshot,inspect,commentaryData};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.QuestionReview;
 if(typeof document==='undefined')return;
 const el=(tag,value,cls)=>{const node=document.createElement(tag);if(value!=null)node.textContent=value;if(cls)node.className=cls;return node;};
 function showReading(reading, openReading) {
  const block = el('section', null, 'qr-reading');
  block.append(el('h5', 'Qué repasar', 'qr-subheading'));
  block.append(el('p', 'Capítulo ' + reading.chapter + ' · ' + reading.chapterTitle, 'qr-reading-chapter'));
  block.append(el('p', reading.title, 'qr-reading-section'));

  function pageAction(label, page, printed, end = page) {
   const locator = (printed ? 'Pág. impresa ' + printed + ' · ' : '') + 'PDF ' + (end === page ? page : page + '–' + end);
   if (!openReading) return el('strong', label + ' · ' + locator, 'qr-reading-page');
   const action = el('button', null, 'qr-reading-link');
   action.type = 'button';
   action.append(el('span', label), el('small', locator));
   action.onclick = () => openReading(reading.slug, page, action, end, Number.parseInt(printed, 10));
   return action;
  }

  block.append(pageAction('Leer el apartado', reading.start, reading.printed, reading.end));
  if (reading.figures?.length) {
   const list = el('ul', null, 'qr-reading-visuals');
   for (const figure of reading.figures) {
    const item = el('li');
    item.append(pageAction(figure.label, figure.page, figure.printed), el('p', figure.note));
    list.append(item);
   }
   block.append(list);
  }
  return block;
 }

 let referencePreloadScheduled = false;
 function warmReferenceReader() {
  if (referencePreloadScheduled || root.navigator?.connection?.saveData) return;
  referencePreloadScheduled = true;
  const preload = () => root.loadCampusAssets('texts')
   .then(() => root.OfficialTexts?.preload())
   .catch(() => { referencePreloadScheduled = false; });
  if (typeof root.requestIdleCallback === 'function') root.requestIdleCallback(preload, { timeout: 1200 });
  else root.setTimeout(preload, 300);
 }

 async function openReference(reference, button) {
  if (button.hasAttribute('aria-busy')) return;
  button.setAttribute('aria-busy', 'true');
  const label = button.firstElementChild;
  const originalLabel = label.textContent;
  label.textContent = 'Abriendo página…';
  try {
   await root.loadCampusAssets('texts');
   if (button.isConnected && !button.closest('.hidden, [hidden]')) {
    await root.OfficialTexts.readPage(reference.slug, reference.page, reference.citations);
   }
  } catch (_) {
   if (button.isConnected) root.showToast?.('No pudimos abrir el texto. Vuelve a intentarlo.', 'error');
  } finally {
   button.removeAttribute('aria-busy');
   label.textContent = originalLabel;
  }
 }

 function showReferences(references) {
  const block = el('section', null, 'qr-reading qr-source-reading');
  block.append(el('h5', 'Fuente oficial', 'qr-subheading'));
  const byBook = new Map();
  for (const reference of references) {
   if (!byBook.has(reference.slug)) byBook.set(reference.slug, new Map());
   byBook.get(reference.slug).set(reference.page, reference);
  }
  for (const pages of byBook.values()) {
   const citations = [...pages.values()].sort((a, b) => a.page - b.page);
   const { slug, label } = citations[0];
   const page = (citations.find(reference => reference.marks?.length) || citations[0]).page;
   const printed = citations.map(reference => reference.printed).filter(Boolean);
   const digital = citations.map(reference => reference.page);
   const sameNumbers = citations.every(reference => reference.printed === reference.page);
   const sections = [...new Set(citations.map(reference => reference.section).filter(Boolean))];
   const locator = sameNumbers
    ? (digital.length === 1 ? 'Pág. ' : 'Págs. ') + digital.join(', ')
    : [
      printed.length && (printed.length === 1 ? 'Pág. impresa ' : 'Págs. impresas ') + printed.join(', '),
      'PDF ' + digital.join(', '),
     ].filter(Boolean).join(' · ');
   const button = el('button', null, 'qr-reading-link');
   button.type = 'button';
   button.append(el('span', 'Ver en el texto'), el('small', [label, ...sections, locator].join(' · ')));
   button.onclick = () => openReference({ slug, page, citations }, button);
   block.append(button);
  }
  warmReferenceReader();
  return block;
 }

 function showTeaching(teaching) {
  const content = el('div', null, 'qr-teaching');
  content.append(el('h5', 'Idea clave', 'qr-subheading'), el('p', teaching.concepto, 'qr-commentary-copy'));
  const list = el('ol', null, 'qr-reasons qr-teaching-claims');
  teaching.afirmaciones.forEach(({ estado, comentario }, index) => {
   const row = el('li', null, 'qr-reason');
   const label = el('div', null, 'qr-reason-label');
   const state = { correcta: 'Correcta', incorrecta: 'Incorrecta', contraste: 'Revisar con el texto' }[estado];
   if (estado === 'correcta') row.classList.add('is-correct');
   if (estado === 'incorrecta') row.classList.add('is-wrong');
   label.append(el('strong', 'Afirmación ' + (index + 1)), el('span', state, 'qr-reason-state'));
   row.append(label, el('p', comentario, 'qr-commentary-copy'));
   list.append(row);
  });
  content.append(list);
  if (teaching.repaso?.length) {
   const reading = el('section', null, 'qr-reading');
   reading.append(el('h5', 'Qué repasar', 'qr-subheading'));
   for (const { pagina, impresa, tema } of teaching.repaso) {
    const button = el('button', null, 'qr-reading-link');
    button.type = 'button';
    button.append(el('span', tema), el('small', 'Pág. impresa ' + impresa + ' · PDF ' + pagina));
    button.onclick = () => openReference({
     slug: 'morfofuncion', page: pagina, citations: [{ page: pagina, printed: impresa }],
    }, button);
    reading.append(button);
   }
   content.append(reading);
  }
  return content;
 }

 function showCommentary(review, { lockedMessage, workedSolution, sourceNote, compactSource = false, bankMode = false, openReading } = {}) {
  const panel = el('section', null, 'qr-commentary');
  const heading = el('h4', null, 'qr-commentary-title');
  const icon = el('i', null, 'far fa-comment-alt');
  icon.setAttribute('aria-hidden', 'true');
  heading.append(icon, el('span', review.teaching ? 'Comentario docente' : 'Comentario'));
  panel.append(heading);

  if (lockedMessage) {
   panel.classList.add('qr-locked');
   panel.append(el('p', lockedMessage, 'qr-commentary-muted'));
   return panel;
  }

  if (review.teaching) panel.append(showTeaching(review.teaching));

  const { options = [], selected, accepted = [], option_explanations = [], source, printed_page, pdf_page, reading } = review;
  const explanation = studentComment(review.explanation);
  const fromPattern = /^Examen pasado\b/i.test(source || '');
  const patternOnly = fromPattern && (!explanation || /^Respuesta según el patrón original\./i.test(explanation));
  const reasons = options.flatMap((_, index) => {
   const comment = option_explanations?.[index]?.replace?.(/^(?:Correcta|Revisa)\.\s*/, '');
   return typeof comment === 'string' && comment.trim() ? [{ index, comment: comment.trim() }] : [];
  });

  if (!review.teaching && workedSolution) {
   if (bankMode) panel.append(el('h5', 'Cómo se resuelve', 'qr-subheading'));
   panel.append(workedSolution);
  } else if (!review.teaching && !patternOnly && explanation && !reasons.some(({ comment }) => comment === explanation)) {
   if (bankMode) {
    const tidy = text => String(text || '').trim().toLowerCase().replace(/[.!?]+$/, '');
    const echo = accepted.some(index => tidy(options[index]) === tidy(explanation));
    panel.append(el('h5', echo ? 'Respuesta correcta' : 'Por qué es correcta', 'qr-subheading'));
   }
   panel.append(el('p', explanation, 'qr-commentary-copy'));
  }

  if (reasons.length) {
   const list = el('ul', null, 'qr-reasons');
   const more = bankMode && reasons.length > 1 ? el('ul', null, 'qr-reasons') : null;
   for (const { index, comment } of reasons) {
    const correct = accepted.includes(index);
    const state = accepted.length ? (correct ? 'Correcta' : 'Incorrecta') : '';
    const entry = el('li', null, 'qr-reason');
    if (correct) entry.classList.add('is-correct');
    else if (index === selected && accepted.length) entry.classList.add('is-wrong');
    const label = el('div', null, 'qr-reason-label');
    label.append(el('strong', 'Inciso ' + 'ABCDE'[index]));
    if (state) label.append(el('span', state, 'qr-reason-state'));
    if (index === selected) label.append(el('span', 'Tu respuesta', 'qr-selected'));
    entry.append(label, el('p', comment, 'qr-commentary-copy'));
    const showNow = index === selected && !correct || correct && !explanation && !workedSolution;
    (more && !showNow ? more : list).append(entry);
   }
   if (list.childElementCount) panel.append(list);
   if (more?.childElementCount) {
    const detail = el('details', null, 'qr-bank-reasons');
    detail.append(el('summary', 'Revisar los incisos'), more);
    panel.append(detail);
   }
  }

  if (!review.teaching && !workedSolution && !reasons.length && (patternOnly || !explanation)) {
   const keys = accepted.map(index => 'ABCDE'[index]).filter(Boolean).join(', ');
   if (keys) panel.append(el('p', (bankMode ? 'Respuesta correcta · ' : 'Clave del examen · ') + keys, 'qr-commentary-copy'));
   else if (!source) panel.hidden = true;
  }

  if (reading) panel.append(showReading(reading, openReading));

  const linkedSource = review.references?.length && typeof root.loadCampusAssets === 'function';
  if (linkedSource) panel.append(showReferences(review.references));
  else if (source && !(compactSource && fromPattern)) {
   const reference = el(compactSource ? 'details' : 'div', null, compactSource ? 'qr-reference qr-reference-compact' : 'qr-reference');
   const label = compactSource ? 'Fuente oficial' : fromPattern ? 'Origen de la clave' : reading ? 'Bibliografía oficial' : 'Fuente del comentario';
   reference.append(el(compactSource ? 'summary' : 'strong', label));
   const printed = printed_page && !source.includes('p. impresa ' + printed_page) ? 'Pág. impresa ' + printed_page : '';
   const digital = pdf_page && !source.includes('p. PDF ' + pdf_page) ? 'Pág. PDF ' + pdf_page : '';
   reference.append(el('p', [source, printed, digital].filter(Boolean).join(' · ')));
   if (sourceNote) reference.append(el('p', sourceNote));
   panel.append(reference);
  }
  return panel;
 }

 function showOptions({ options, selected, accepted = [] }, correctLabel = 'Correcta') {
  const list = el('ul', null, 'qr-answers');
  options.forEach((option, index) => {
   const item = el('li', null, 'qr-answer');
   const correct = accepted.includes(index);
   if (correct) item.classList.add('is-correct');
   else if (index === selected && accepted.length) item.classList.add('is-wrong');
   const tags = el('span', null, 'qr-answer-tags');
   if (correct) tags.append(el('span', correctLabel, 'qr-reason-state'));
   if (index === selected) tags.append(el('span', 'Tu respuesta', 'qr-selected'));
   item.append(el('strong', 'ABCDE'[index], 'qr-answer-letter'), el('span', option), tags);
   list.append(item);
  });
  return list;
 }

 root.QuestionReview.showCommentary = showCommentary;
 root.QuestionReview.showOptions = showOptions;
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
     if(q.passage)card.append(el('p',q.passage,'review-explanation'));
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
