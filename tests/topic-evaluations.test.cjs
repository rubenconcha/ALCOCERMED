const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const catalog=require('../content/topic-evaluations/catalog.json');
const sufficiency=require('../api/_evaluations/suficiencia.cjs');
const audit=require('../api/_evaluations/source-audit.json');
const publishedOptions=q=>Array.from('abcde', letter=>q['opcion_'+letter]).filter(Boolean);
const reviewed=new Set(['morfo-01','morfo-08','morfo-09']);
const authored=new Map([
 ...require('../api/_sufficiency/medicina-oficial.json').questions,
 ...require('../api/_sufficiency/medicina-preguntas-por-tema.json'),
 ...require('../api/_mindmaps/banco-verificado.json'),
].map(q=>['evaluacion:'+q.id,q]));

test('los 68 temas de Medicina tienen alternativas redactadas para sus enunciados y referencias oficiales',()=>{
 assert.equal(catalog.exams.length,68);
 assert.deepEqual(['morfo','biologia','salud'].map(p=>catalog.exams.filter(e=>e.id.startsWith(p)).length),[29,18,21]);
 const evidence=new Map(audit.map(row=>[row.question,row]));
 assert.equal(evidence.size,audit.length);
 for(const exam of catalog.exams){
  const paper=require('../api/_evaluations/'+exam.id+'.json');
  assert.equal(paper.count,paper.questions.length);
  assert.equal(exam.count,paper.count);
  assert.ok(paper.count>=8,exam.id);
  assert.equal(paper.duration,paper.count);
  const prompts=new Set();
  paper.questions.forEach((q,i)=>{
   const entry=evidence.get(q.content_id);
   assert.equal(entry?.paper,exam.id,q.content_id);
   evidence.delete(q.content_id);
   assert.equal(q.numero_pregunta,i+1);
   assert.equal(q.tema,exam.topic);
   assert.equal(q.materia,exam.subject);
   const options=publishedOptions(q);
   assert.ok(options.length>=4 && options.length<=5);
   assert.equal(new Set(options).size,options.length);
   assert.ok(options['ABCDE'.indexOf(q.respuesta_correcta)]);
   assert.ok(q.justificacion?.trim());
   assert.ok(!prompts.has(q.pregunta));
   prompts.add(q.pregunta);
   if(reviewed.has(exam.id)){
    assert.equal(Object.keys(q.comentarios_opciones).length,options.length);
    assert.ok(q.source.sha256 && q.source.pdf_pages.length);
    return;
   }
   assert.equal(entry.authored_options,true);
   assert.equal(entry.option_source_ids,undefined);
   assert.equal(q.source.topicId,exam.id);
   assert.deepEqual(entry.pdf_pages,q.lecturas_comentario.map(ref=>ref.page));
   assert.ok(q.lecturas_comentario.every(ref=>Number.isInteger(ref.page)&&ref.section&&ref.slug));
   if(exam.id==='morfo-18')return;
   const original=authored.get(q.content_id);
   assert.ok(original,q.content_id);
   assert.equal(q.pregunta,original.text||original.prompt);
   if(original.options)assert.deepEqual(options,original.options);
   else assert.deepEqual(new Set(options),new Set([original.answer,...original.distractors]));
   assert.equal(options['ABCDE'.indexOf(q.respuesta_correcta)],original.answer||original.options[original.correct]);
  });
 }
 assert.equal(evidence.size,0);
});
test('Sangre conserva treinta preguntas con opciones comparables, comentarios y páginas destacadas',()=>{
 const paper=require('../api/_evaluations/morfo-18.json');
 assert.equal(paper.count,30);
 assert.equal(paper.duration,30);
 const first=paper.questions[0];
 assert.match(first.pregunta,/dos componentes principales de la sangre/);
 assert.deepEqual(new Set(publishedOptions(first)),new Set([
  'Plasma y elementos formes.','Plasma y eritrocitos.',
  'Plasma y proteínas plasmáticas.','Suero y elementos formes.',
 ]));
 assert.equal(first['opcion_'+first.respuesta_correcta.toLowerCase()],'Plasma y elementos formes.');
 for(const q of paper.questions){
  assert.equal(q.source.sha256,'e00074c7105c10052637b1c2a82f2b8959cf7c4cb9a91c4abd058ce958e58148');
  assert.ok(q.source.verified_anchors.every(ref=>ref.pdf_page-ref.printed_page===28 && ref.anchor));
  assert.deepEqual(Object.keys(q.comentarios_opciones),['A','B','C','D']);
  assert.ok(Object.values(q.comentarios_opciones).every(reason=>reason.trim()));
  assert.equal(new Set(Object.values(q.comentarios_opciones)).size,4);
  assert.ok(q.lecturas_comentario.every(ref=>ref.page>=708 && ref.page<=738 && ref.marks.length));
 }
});
test('Articulaciones evalúa la clasificación con cuatro alternativas comparables', () => {
 const { questions } = require('../api/_evaluations/morfo-09.json');
 assert.equal(questions.length, 28);
 const first = questions[0];
 assert.match(first.pregunta, /clasificación estructural de I a IV/);
 for (const letter of 'abcd') {
  const classes = first['opcion_' + letter].replace(/\.$/, '').toLowerCase().split(', ').sort();
  assert.deepEqual(classes, ['cartilaginosa', 'fibrosa', 'sinovial', 'ósea']);
 }
 assert.equal(first['opcion_' + first.respuesta_correcta.toLowerCase()], 'Ósea, fibrosa, cartilaginosa, sinovial.');
});

test('evaluaciones mantienen su propia navegación, protección y presentación',()=>{
 const html=fs.readFileSync('campus.html','utf8');const section=html.slice(html.indexOf('id="evaluacion-screen"'),html.indexOf('id="videoclases-screen"'));assert.ok(section.includes('topic-eval-grid'));assert.ok(!section.includes('/juegos/'));assert.ok(html.includes('topic-evaluations.js'));
 const config=require('../vercel.json');assert.ok(config.rewrites.some(r=>r.source==='/api/_evaluations/:path*'));
 assert.ok(!fs.existsSync('content/topic-evaluations/morfo-01.json'));
});
test('Suficiencia ofrece todo el banco en partes de hasta 30 y conserva cada lectura completa', () => {
 const core = require('../suficiencia-core.js');
 const base = require('../api/_sufficiency/bank.json');
 const guides = require('../api/_sufficiency/umsa-2026.cjs');
 const bank = {...base, questions:base.questions.concat(guides)};
 const expected = new Map(bank.questions.map(q => ['suficiencia:' + q.id, q]));
 const bySubject = {};
 const titles = new Set();
 const exams = sufficiency.metadata();
 assert.equal(exams.length, 111);
 for (const exam of exams) {
  const titleKey = exam.subject + '|' + exam.title;
  assert.ok(!titles.has(titleKey), titleKey);
  titles.add(titleKey);
  bySubject[exam.subject] = (bySubject[exam.subject] || 0) + 1;
  assert.ok(exam.count > 0 && exam.count <= 30);
  assert.equal(exam.duration, 2 * exam.count);
  assert.equal(exam.questions, undefined);
  assert.equal(exam.source, undefined);
  assert.doesNotMatch(exam.title, /UMSA|ABP/);
  const paper = sufficiency.paper(exam.id);
  assert.equal(paper.questions.length, exam.count);
  const readings = new Set();
  for (const q of paper.questions) {
   const original = expected.get(q.content_id);
   assert.ok(original, q.content_id);
   expected.delete(q.content_id);
   assert.equal(core.subjects[original.subject], exam.subject);
   assert.equal(core.topicFor(original, bank).label, exam.topic);
   assert.equal(q.respuesta_correcta, 'ABCDE'[original.correct]);
   assert.equal(q['opcion_' + 'abcde'[original.correct]], core.optionText(original, original.correct));
   assert.equal(q.fuente, undefined);
   assert.ok(original.source.pdfPages.length);
   assert.match(q.justificacion, /\S/);
   if (original.passageId) {
    readings.add(q.passage.id);
    assert.equal(q.passage.text, base.passages.find(p => p.id === original.passageId).text);
   }
  }
  if (exam.subject === 'Lectura comprensiva') {
   assert.equal(readings.size, 1);
   assert.equal(exam.count, 5);
  }
 }
 assert.deepEqual(bySubject, {'Matemáticas':22,'Física':24,'Química':25,'Lectura comprensiva':40});
 assert.equal(expected.size, 0);
});
test('API rechaza accesos no autorizados y entrega todos los temas al estudiante habilitado',async()=>{
 const handler=require('../api/topic-evaluation.js');const original=global.fetch;let access={ready:true,premium:true};global.fetch=async()=>({ok:true,json:async()=>access});
 async function call(id,auth='Bearer test',method='GET'){let output={headers:{}};await handler({method,query:{id},headers:{authorization:auth}},{setHeader(k,v){output.headers[k]=v},status(s){output.status=s;return this},end(body){output.body=body}});return output;}
 try{assert.equal((await call('../source-cards')).status,404);assert.equal((await call('morfo-01','')).status,401);assert.equal((await call('morfo-01','Bearer test','POST')).status,405);access={ready:true,premium:false};assert.equal((await call('morfo-01')).status,403);access={ready:false,premium:true};assert.equal((await call('morfo-01')).status,403);access={ready:true,premium:true};for(const e of catalog.exams){const r=await call(e.id);assert.equal(r.status,200);assert.equal(JSON.parse(r.body).questions.length,e.count);assert.equal(r.headers['Cache-Control'],'private, no-store');}global.fetch=async()=>{throw new Error('offline')};assert.equal((await call('morfo-01')).status,503);}finally{global.fetch=original;}
});
test('catálogo combinado entrega metadatos públicos y protege las evaluaciones de Suficiencia', async t => {
 const handler = require('../api/topic-evaluation.js');
 let access = {ready:true, premium:true};
 const upstream = t.mock.method(global, 'fetch', async () => ({ok:true, json:async () => access}));
 async function call(id, token) {
  const output = {headers:{}, body:''};
  await handler({method:'GET',query:{id},headers:{authorization:token}}, {
   setHeader(name,value) {output.headers[name] = value;},
   status(code) {output.status = code; return this;},
   end(body = '') {output.body = body;},
  });
  return output;
 }
 const result = await call('catalogo');
 assert.equal(result.status, 200);
 const publicExams = JSON.parse(result.body).exams;
 assert.equal(publicExams.length, 179);
 assert.deepEqual(publicExams.slice(0, 68), catalog.exams);
 assert.ok(!/questions|respuesta_correcta|opcion_a|pdfPages/.test(result.body));
 assert.equal(upstream.mock.callCount(), 0);
 const id = publicExams.find(e => e.subject === 'Lectura comprensiva').id;
 assert.equal((await call(id)).status, 401);
 assert.equal((await call('suf-no-existe','Bearer test')).status, 404);
 access = {ready:true,premium:true,expires_at:'2000-01-01'};
 assert.equal((await call(id,'Bearer test')).status, 403);
 access = {ready:true,premium:true};
 const paper = await call(id,'Bearer test');
 assert.equal(paper.status, 200);
 assert.equal(paper.headers['Cache-Control'], 'private, no-store');
 assert.deepEqual(JSON.parse(paper.body), sufficiency.paper(id));
});
function uiSetup({free=false,changed=false}={}){
 const vm=require('node:vm'),nodes=new Map(),events=[];let sessions=0;
 function element(){return {value:'',textContent:'',children:[],disabled:false,handlers:{},replaceChildren(){this.children=[]},append(...items){this.children.push(...items)},addEventListener(name,fn){this.handlers[name]=fn}};}
 const node=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)};
 const published={exams:catalog.exams.concat(sufficiency.metadata())};
 const c={Date,AbortSignal,console,currentUser:{id:'test'},currentCampusScreen:'home-screen',campusScreenHistory:[],document:{getElementById:node,createElement:element},CampusAccess:{isFree:()=>free,unlock:()=>events.push('unlock')},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{user:{id:'test'},access_token:changed&&++sessions>1?'changed':'test'}}})}}),
  fetch:async(url)=>({ok:true,json:async()=>{
   const id=new URL(url,'http://test').searchParams.get('id');
   if(id==='catalogo')return published;
   return id.startsWith('suf-')?sufficiency.paper(id):require('../api/_evaluations/'+id+'.json');
  }}),
  simState:{},openEvaluacion:()=>{c.currentCampusScreen='evaluacion-screen'},returnToExamSelection:()=>events.push('other'),showScreen:screen=>{c.currentCampusScreen=screen},showSimScreen:screen=>events.push(screen),buildSimCircles(){},renderSimQuestion(){},startSimTimer:()=>events.push('timer'),showToast:m=>events.push(m),clearInterval:()=>events.push('clear'),addEventListener(){}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('topic-evaluations.js','utf8'),c);
 return {c,node,events,settle:()=>new Promise(resolve=>setImmediate(resolve))};
}
test('filtros, inicio por materia, retorno y protección ante sesión cambiada',async()=>{
 for(const subject of ['MORFOFUNCION','BIOLOGIA CELULAR','SALUD PUBLICA','Matemáticas','Física','Química','Lectura comprensiva']){const t=uiSetup();t.c.openEvaluacion();await t.settle();assert.equal(t.node('topic-eval-grid').children.length,179);t.node('topic-eval-subject').value=subject;await t.node('topic-eval-subject').handlers.change();const card=t.node('topic-eval-grid').children[0];await card.children[4].handlers.click();assert.equal(t.c.simState.mode,'tema');assert.equal(t.c.simState.selectedMateria,subject);assert.ok(t.events.includes('timer'));t.c.campusScreenHistory.push('evaluacion-screen');t.c.returnToExamSelection();assert.equal(t.c.currentCampusScreen,'evaluacion-screen');assert.equal(t.c.campusScreenHistory.length,0);}
 for(const opts of [{free:true},{changed:true}]){const t=uiSetup(opts);t.c.openEvaluacion();await t.settle();await t.node('topic-eval-grid').children[0].children[4].handlers.click();assert.ok(!t.events.includes('timer'));}
 const t=uiSetup();t.c.openEvaluacion();await t.settle();t.node('topic-eval-subject').value='MORFOFUNCION';t.node('topic-eval-search').value='quimica';await t.node('topic-eval-search').handlers.input();assert.equal(t.node('topic-eval-grid').children.length,1);t.node('topic-eval-search').value='sin coincidencia';await t.node('topic-eval-search').handlers.input();assert.equal(t.node('topic-eval-grid').children.length,0);
});
test('abrir una evaluación desde el calendario selecciona su identificador y permite cambiar la búsqueda', async () => {
 const { c, node, events } = uiSetup();
 node('topic-eval-subject').value = 'BIOLOGIA CELULAR';
 node('topic-eval-search').value = 'membrana';
 await c.openEvaluacion('morfo-18');
 const cards = node('topic-eval-grid').children;
 assert.equal(cards.length, 1);
 assert.equal(cards[0].children[1].textContent, 'El aparato circulatorio: sangre');
 assert.equal(node('topic-eval-subject').value, 'MORFOFUNCION');
 assert.equal(node('topic-eval-search').value, cards[0].children[1].textContent);
 assert.equal(events.includes('timer'), false);
 await cards[0].children[4].handlers.click();
 assert.equal(c.simState.topicEvaluationId, 'morfo-18');
 assert.ok(events.includes('timer'));
 await c.openEvaluacion('salud-01');
 assert.equal(node('topic-eval-grid').children[0].children[1].textContent, 'Educación en salud');
 node('topic-eval-subject').value = '';
 node('topic-eval-search').value = 'histología';
 await node('topic-eval-search').handlers.input();
 assert.ok(node('topic-eval-grid').children.some(card => card.children[1].textContent === 'Histología'));
});
test('el calendario inicia su evaluación en el horario y descarta las aperturas que ya no corresponden', async () => {
 const { c, node, events } = uiSetup();
 c.currentCampusScreen = 'study-calendar-screen';
 const exam = await c.TopicEvaluations.describe('morfo-18');
 const button = node('calendar-assigned-test');
 button.textContent = 'Iniciar evaluación';
 let current = false, mounted = 0, returned = 0;
 const assigned = {
  isCurrent: () => current,
  mount: () => { mounted += 1; },
  signal: new AbortController().signal,
 };
 await c.TopicEvaluations.startAssigned(exam, button, assigned);
 assert.equal(mounted, 0);
 assert.ok(!events.includes('timer'));
 assert.equal(button.textContent, 'Iniciar evaluación');
 current = true;
 await c.TopicEvaluations.startAssigned(exam, button, assigned);
 assert.equal(mounted, 1);
 assert.equal(c.simState.topicEvaluationId, 'morfo-18');
 assert.equal(c.currentCampusScreen, 'study-calendar-screen');
 assert.deepEqual(events, ['sim-exam', 'timer']);
 c.CampusCalendar = { returnFromEvaluation: () => { returned += 1; return true; } };
 c.returnToExamSelection();
 assert.equal(returned, 1);
 assert.equal(c.currentCampusScreen, 'study-calendar-screen');
});

test('al cerrar sesión se cancela el temporizador y se retira la evaluación activa', async () => {
 const t = uiSetup();
 t.c.openEvaluacion();
 await t.settle();
 t.node('topic-eval-subject').value = 'Lectura comprensiva';
 await t.node('topic-eval-subject').handlers.change();
 await t.node('topic-eval-grid').children[0].children[4].handlers.click();
 assert.equal(t.c.simState.preguntas.length, 5);
 t.c.TopicEvaluations.clear();
 assert.ok(t.events.includes('clear'));
 assert.equal(t.c.simState.preguntas.length, 0);
 assert.equal(t.c.simState.timerInterval, null);
 assert.equal(t.c.simState.finalized, true);
});
test('salir de una evaluación permite conservar el intento o volver al catálogo sin temporizador',()=>{
 const vm=require('node:vm'),source=fs.readFileSync('campus-exam-engine.js','utf8');let accept=false,returns=0,cleared=0;const c={simState:{mode:'tema',timerInterval:42,preguntas:[{}],answers:[{}]},confirm:()=>accept,clearInterval:()=>cleared++,returnToExamSelection:()=>returns++,showSimScreen:()=>{throw new Error('No debe abrir la configuración de simulacros')}};c.window=c;vm.createContext(c);vm.runInContext(source.slice(source.indexOf('window.confirmarSalirSimulacro ='),source.indexOf('window.finalizarSimulacro')),c);c.confirmarSalirSimulacro();assert.equal(c.simState.timerInterval,42);assert.equal(returns,0);accept=true;c.confirmarSalirSimulacro();assert.equal(c.simState.timerInterval,null);assert.equal(c.simState.preguntas.length,0);assert.equal(c.simState.answers.length,0);assert.equal(cleared,1);assert.equal(returns,1);
});
