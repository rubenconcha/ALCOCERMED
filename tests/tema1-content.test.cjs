const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const paper=require('../api/_evaluations/morfo-01.json');

test('Tema 1: thirty distinct questions, balanced keys and feedback for every alternative',()=>{
 assert.equal(paper.count,30);assert.equal(paper.duration,30);
 assert.equal(new Set(paper.questions.map(q=>q.pregunta)).size,30);
 const keys={A:0,B:0,C:0,D:0};
 for(const q of paper.questions){
  keys[q.respuesta_correcta]++;
  assert.equal(new Set('abcd'.split('').map(k=>q['opcion_'+k])).size,4);
  assert.equal(new Set(Object.values(q.comentarios_opciones)).size,4);
  for(const k of 'ABCD')assert.ok(q.comentarios_opciones[k].length>45);
  assert.ok(q.comentarios_opciones[q.respuesta_correcta].startsWith('Correcta.'));
  assert.ok(q.pagina_impresa);assert.ok(q.paginas_pdf);
  assert.ok(q.source.pdf_pages.includes(q.source.evidence_page));
 }
 assert.deepEqual(Object.values(keys),[8,8,7,7]);
});

test('Actual review renderer places each explanation below its option and scopes it to topic evaluation',()=>{
 const code=fs.readFileSync('script.js','utf8');
 const review=code.slice(code.indexOf("    var reviewList = document.getElementById('sim-review-list');"),code.indexOf('    // Guardar en historial local'));
 class Node{
  constructor(tag){this.tag=tag;this.children=[];this.textContent='';}
  append(...nodes){this.children.push(...nodes)}
  appendChild(node){this.children.push(node);return node}
  set innerHTML(value){this.children=[];}
 }
 const list=new Node('div');
 const state={mode:'tema',preguntas:paper.questions,answers:paper.questions.map((_,i)=>({selected:i%3===0?null:i%4}))};
 const context={document:{getElementById:()=>list,createElement:tag=>new Node(tag)},simState:state,campo:(q,k)=>q[k],simAcceptedAnswerIndices:q=>['ABCD'.indexOf(q.respuesta_correcta)],bancoComentario:()=>''};
 vm.runInNewContext(review,context);
 assert.equal(list.children.length,30);
 list.children.forEach((item,i)=>{
  const comments=item.children.find(n=>n.className==='sim-rev-option-comments');
  assert.equal(comments.children.length,4);
  comments.children.forEach((block,j)=>{
   assert.deepEqual(block.children.map(n=>n.tag),['strong','p']);
   assert.equal(block.children[1].textContent,paper.questions[i].comentarios_opciones['ABCD'[j]]);
  });
  assert.match(item.children.at(-1).textContent,/páginas impresas .*páginas PDF/);
 });
 state.mode='materia';vm.runInNewContext(review,context);
 assert.ok(list.children.every(n=>!n.children.some(c=>c.className==='sim-rev-option-comments')));
});

test('Six maps align with lecture slides and retain official PDF references',()=>{
 const covered=new Set();
 for(let i=1;i<=6;i++){
  const map=require('../api/_mindmaps/morfo_01_anatomia_y_fisiologia__0'+i+'.json');
  assert.equal(map.content_revision,3);assert.equal(map.lecture_slide_count,41);
  for(const slide of map.lecture_slides){assert.ok(slide>=2&&slide<=39);covered.add(slide)}
  const items=map.sections.flatMap(s=>s.groups.flatMap(g=>g.items));
  assert.equal(items.length,9);
  assert.ok(items.every(n=>n.text.length>40&&n.source));
  assert.ok(fs.existsSync('.'+map.assets.image));
 }
 assert.ok(covered.size>=30);
});
