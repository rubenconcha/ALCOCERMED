const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const review=require('../question-review.js');
const read=(q,key)=>q[key]??q[key.toUpperCase()];

function browserReview() {
 const vm = require('node:vm');
 class Element {
  constructor(tag) {
   this.tagName = tag.toUpperCase(); this.children = []; this.attributes = {};
   this.className = ''; this.hidden = false; this.isConnected = true;
   this.classList = { add: value => { this.className += ' ' + value; } };
  }
  append(...nodes) { nodes.forEach(node => { node.parentElement = this; this.children.push(node); }); }
  remove() { const parent = this.parentElement; if (parent) parent.children = parent.children.filter(node => node !== this); }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key]; }
  hasAttribute(key) { return key in this.attributes; }
  removeAttribute(key) { delete this.attributes[key]; }
  closest() { return null; }
  get firstElementChild() { return this.children[0]; }
  get childElementCount() { return this.children.length; }
 }
 const context = { document: { createElement: tag => new Element(tag) } };
 vm.runInNewContext(fs.readFileSync('question-review.js', 'utf8'), context);
 function find(node, className) {
  return node.className.split(/\s+/).includes(className) ? node : node.children.map(child => find(child, className)).find(Boolean);
 }
 return { context, Element, find, show: context.QuestionReview.showCommentary };
}

test('teacher stays beside the explanation while bibliography remains outside the text column', () => {
 const {show, find} = browserReview();
 const panel = show({explanation:'Explicación original', source:'Libro oficial', accepted:[0], selected:1});
 const layout = find(panel, 'qr-commentary-layout');
 assert.equal(layout.children[0].className, 'qr-commentary-text');
 assert.equal(layout.children[1].className, 'qr-teacher');
 assert.equal(find(layout, 'qr-commentary-copy').textContent, 'Explicación original');
 assert.equal(find(panel, 'qr-reference').parentElement, panel);
 const image = find(panel, 'qr-teacher-image');
 assert.equal(image.src, '/assets/teacher-stickers/vamos-estudiante.webp');
 assert.equal(image.loading, 'lazy');
 assert.equal(image.decoding, 'async');
 image.onerror();
 assert.equal(find(panel, 'qr-teacher'), undefined);
 assert.equal(find(panel, 'qr-commentary-copy').textContent, 'Explicación original');
});

test('locked questions and key-only feedback do not expose a teacher before an explanation', () => {
 const {show, find} = browserReview();
 const locked = show({explanation:'Contenido oculto'}, {lockedMessage:'Responde primero'});
 assert.equal(find(locked, 'qr-teacher'), undefined);
 assert.equal(find(locked, 'qr-commentary-copy'), undefined);
 assert.equal(find(locked, 'qr-commentary-muted').textContent, 'Responde primero');
 assert.equal(find(show({accepted:[0], options:['A']}), 'qr-teacher'), undefined);
});

test('teacher messages follow explicit commentary cues and preserve accepted answer semantics', () => {
 const {show, find} = browserReview();
 const examples = [
  [{explanation:'Recuerda el concepto.'}, 'recuerda'],
  [{explanation:'Una pregunta trampa.'}, 'ojo-pregunta-trampa'],
  [{explanation:'Es importante comparar.'}, 'importante'],
  [{explanation:'Nota: comprueba la unidad.'}, 'nota'],
  [{explanation:'Explicación', source:'Examen pasado · Primer parcial'}, 'pregunta-de-examen'],
  [{explanation:'Explicación', source:'Saladin · PDF 72', pastExam:true}, 'pregunta-de-examen'],
  [{explanation:'Explicación', selected:1, accepted:[0,1]}, 'cree-en-ti'],
  [{explanation:'Explicación', selected:null, accepted:[0]}, 'recuerda'],
 ];
 examples.forEach(([item, expected]) => {
  assert.equal(find(show(item), 'qr-teacher-image').src, '/assets/teacher-stickers/' + expected + '.webp');
 });
 assert.equal(review.commentaryData({fuente:'Examen pasado · Primer parcial', fuente_comentario:'Saladin · PDF 72'}, read).pastExam, true);
});

test('worked solutions and reference actions survive teacher layout without changing cited pages', async () => {
 const {context, show, find, Element} = browserReview();
 const calls = [];
 context.loadCampusAssets = async () => {};
 context.requestIdleCallback = () => {};
 context.OfficialTexts = { readPage: async (...args) => { calls.push(args); } };
 const worked = new Element('div');
 worked.textContent = 'Procedimiento original';
 const citations = [{slug:'morfofuncion', label:'Saladin', page:72, printed:44, marks:[{term:'hidrógeno'}]}];
 const panel = show({references:citations}, {workedSolution:worked});
 assert.equal(worked.parentElement, find(panel, 'qr-commentary-text'));
 const reference = find(panel, 'qr-source-reading');
 assert.equal(reference.parentElement, panel);
 await find(reference, 'qr-reading-link').onclick();
 assert.equal(calls[0][0], 'morfofuncion');
 assert.equal(calls[0][1], 72);
 assert.equal(calls[0][2][0].marks[0].term, 'hidrógeno');
});
test('snapshot preserves the options actually presented, chosen answer, source and original number',()=>{
 const question={id:7,numero_original:12,PREGUNTA:'Pregunta de prueba',opcion_a:'Opción 1',opcion_b:'Opción 2',justificacion:'Explicación almacenada',fuente:'Fuente del material',paginas_pdf:'10'};
 const payload=review.snapshot([question],[{selected:0}],read,()=>[1]);question.opcion_a='Modificada después';
 assert.equal(payload.items[0].options[0],'Opción 1');assert.equal(payload.items[0].number,12);assert.equal(payload.items[0].source,'Fuente del material');assert.equal(review.inspect(payload)[0].status,'wrong');
});
test('bank and saved reviews preserve the existing rationale for each alternative and both page numbers',()=>{
 const q={OPCION_A:'Primera',OPCION_B:'Segunda',EXPLICACION:'A. Motivo de A.\n\nB. Motivo de B.',FUENTE:'Texto de estudio',PAGINAS_PDF:'45',PAGINA_IMPRESA:'17'};
 const detail=review.snapshot([q],[{selected:1}],read,()=>[0]).items[0];
 assert.equal(detail.explanation,'');assert.deepEqual(detail.option_explanations,['Motivo de A.','Motivo de B.']);
 assert.equal(detail.pdf_page,'45');assert.equal(detail.printed_page,'17');
 q.EXPLICACION='A. Solo una explicación general.';
 assert.equal(review.commentaryData(q,read).explanation,q.EXPLICACION);
});
test('review distinguishes accepted alternatives, wrong answers, omissions and malformed detail',()=>{
 const item={options:['A','B','C'],accepted:[0,2]};
 const result=review.inspect({version:1,items:[{...item,selected:0},{...item,selected:2},{...item,selected:1},{...item,selected:null},{...item,selected:9}]});
 assert.deepEqual(result.map(q=>q.status),['correct','correct','wrong','unanswered','unknown']);
 assert.equal(review.inspect(null),null);assert.equal(review.inspect({version:0,items:[]}),null);
});
test('new native deliveries save review snapshots and admin fetches them only when requested',()=>{
 const script=fs.readFileSync('script.js','utf8'),admin=fs.readFileSync('admin.js','utf8'),html=fs.readFileSync('campus.html','utf8'),viewer=fs.readFileSync('question-review.js','utf8');
 assert.match(fs.readFileSync('campus-exam-engine.js','utf8'),/snapshot\(simState.preguntas,simState.answers/);assert.match(script,/snapshot\(bancoState.preguntas,bancoState.answers/);assert.equal((script.match(/question_review: resultado.questionReview/g)||[]).length,2);
 assert.ok(html.indexOf('question-review.js')<html.indexOf('script.js?v='));assert.match(viewer,/select\('question_review'\)/);assert.ok(!viewer.includes('.innerHTML'));assert.ok(!admin.includes("safeSelect(sb, 'resultados_simulacros', '*'"));
});
test('both cloud writers send the captured review in the same insert as the grade',async()=>{
 const vm=require('node:vm'),src=fs.readFileSync('script.js','utf8'),calls=[];
 const context={currentUser:{id:'actor',email:'actor@example.invalid',user_metadata:{}},console,getSupabase:()=>({from:table=>({insert:payload=>{calls.push({table,payload});return Promise.resolve({error:null});}})})};
 vm.createContext(context);vm.runInContext(src.slice(src.indexOf('async function guardarResultadoSimulacroEnNube('),src.indexOf('async function registrarVideoVistoEnNube(')),context);
 const payload={version:1,items:[{selected:0,accepted:[1],options:['A','B']}]};
 await context.guardarResultadoSimulacroEnNube({questionReview:payload,titulo:'Prueba',menuSection:'evaluaciones',porcentaje:0});
 await context.guardarResultadoBancoEnNube({questionReview:payload,total:1,correctas:0,incorrectas:1,porcentaje:0});
 assert.equal(calls.length,2);assert.deepEqual(calls.map(c=>c.table),['resultados_simulacros','resultados_banco']);calls.forEach(c=>{assert.equal(c.payload.question_review,payload);assert.equal(c.payload.porcentaje,0);assert.equal(c.payload.user_id,'actor');});
});
