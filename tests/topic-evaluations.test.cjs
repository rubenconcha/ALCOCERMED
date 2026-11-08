const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const catalog=require('../content/topic-evaluations/catalog.json');
const sufficiency=require('../api/_evaluations/suficiencia.cjs');
const sources=require('../api/_evaluations/source-cards.json');
const audit=require('../api/_evaluations/source-audit.json');
const cards=new Map(sources.flatMap(s=>s.chapters.flatMap(c=>c.cards.map(q=>[q.id,{...q,subject:s.source.id}]))));
test('68 temas completos con respuestas y alternativas trazables a la bibliografía',()=>{
 assert.equal(catalog.exams.length,68);assert.deepEqual(['morfo','biologia','salud'].map(p=>catalog.exams.filter(e=>e.id.startsWith(p)).length),[29,18,21]);
 const unique=new Set();
 for(const exam of catalog.exams){const paper=require('../api/_evaluations/'+exam.id+'.json');assert.equal(paper.count,paper.questions.length);assert.equal(exam.count,paper.count);assert.ok(paper.count>=7);assert.equal(paper.duration,paper.count);
 for(const q of paper.questions){assert.ok(!unique.has(q.content_id));unique.add(q.content_id);
  if (exam.id === 'morfo-09') {
   assert.equal(paper.content_revision, 1);
   assert.equal(q.dificultad, 'dificil');
   assert.equal(q.source.sha256, paper.review.source_sha256);
   assert.ok(q.source.verified_anchors.every(ref => ref.pdf_page - ref.printed_page === 28 && ref.anchor));
   const entry = audit.find(a => a.paper === exam.id && a.question === q.content_id);
   assert.equal(entry?.authored_options, true);
   assert.equal(new Set(Array.from('abcd', letter => q['opcion_' + letter])).size, 4);
   assert.deepEqual(Object.keys(q.comentarios_opciones), ['A','B','C','D']);
   continue;
  }
  if(['morfo-01','morfo-08'].includes(exam.id)){assert.equal(paper.content_revision,exam.id==='morfo-08'?5:3);assert.equal(q.source.sha256,'e00074c7105c10052637b1c2a82f2b8959cf7c4cb9a91c4abd058ce958e58148');assert.ok(q.source.evidence_excerpt.length>100);assert.equal(Object.keys(q.comentarios_opciones).length,4);assert.ok(q.source.pdf_pages.every(n=>(exam.id==='morfo-08'?n>=262&&n<=302:n>=30&&n<=65)));continue;}const source=cards.get(q.content_id);assert.ok(source);assert.equal(q.pregunta,source.question);assert.equal(q['opcion_'+q.respuesta_correcta.toLowerCase()],source.answer);assert.equal(q.paginas_pdf,String(source.pdf_page));const entry=audit.find(a=>a.paper===exam.id&&a.question===q.content_id);assert.ok(entry);const options='abcd'.split('').map(k=>q['opcion_'+k]);assert.equal(new Set(options).size,4);entry.option_source_ids.forEach((id,i)=>{assert.equal(cards.get(id).answer,options[i]);assert.equal(cards.get(id).subject,source.subject)});}
 }
 assert.equal(unique.size,audit.length);
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
   assert.equal(q.fuente, core.referenceText(original.source));
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
 const vm=require('node:vm'),source=fs.readFileSync('script.js','utf8');let accept=false,returns=0,cleared=0;const c={simState:{mode:'tema',timerInterval:42,preguntas:[{}],answers:[{}]},confirm:()=>accept,clearInterval:()=>cleared++,returnToExamSelection:()=>returns++,showSimScreen:()=>{throw new Error('No debe abrir la configuración de simulacros')}};c.window=c;vm.createContext(c);vm.runInContext(source.slice(source.indexOf('window.confirmarSalirSimulacro ='),source.indexOf('function simAcceptedAnswerIndices')),c);c.confirmarSalirSimulacro();assert.equal(c.simState.timerInterval,42);assert.equal(returns,0);accept=true;c.confirmarSalirSimulacro();assert.equal(c.simState.timerInterval,null);assert.equal(c.simState.preguntas.length,0);assert.equal(c.simState.answers.length,0);assert.equal(cleared,1);assert.equal(returns,1);
});
