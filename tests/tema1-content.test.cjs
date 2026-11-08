const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const paper=require('../api/_evaluations/morfo-01.json');

test('Tema 1: twenty distinct questions, balanced keys and feedback for every alternative',()=>{
 assert.equal(paper.count,20);assert.equal(paper.duration,20);
 assert.equal(new Set(paper.questions.map(q=>q.pregunta)).size,20);
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
 assert.deepEqual(Object.values(keys),[5,5,5,5]);
});

test('The review displays each option and its source in both topic evaluations and mock exams',()=>{
 const code=fs.readFileSync('script.js','utf8');
 const review=code.slice(code.indexOf("    var reviewList = document.getElementById('sim-review-list');"),code.indexOf('    // Guardar en historial local'));
 class Node{
  constructor(tag){this.tag=tag;this.children=[];this.textContent='';this.classList={add:()=>{}};}
  append(...nodes){this.children.push(...nodes)}
  replaceChildren(...nodes){this.children=nodes}
  setAttribute(){}
  find(className){return this.className===className?this:this.children.map(child=>child.find(className)).find(Boolean)}
 }
 const list=new Node('div');
 const state={mode:'tema',preguntas:paper.questions,answers:paper.questions.map((_,i)=>({selected:i%3===0?null:i%4}))};
 const context=vm.createContext({document:{getElementById:()=>list,createElement:tag=>new Node(tag)},simState:state,campo:(q,k)=>q[k],simAcceptedAnswerIndices:q=>['ABCD'.indexOf(q.respuesta_correcta)]});
 vm.runInContext(fs.readFileSync('question-review.js','utf8'),context);
 for(const mode of ['tema','oficial']){
  state.mode=mode;
  vm.runInContext(review,context);
  assert.equal(list.children.length,20);
  list.children.forEach((item,i)=>{
   assert.equal(item.find('qr-answers').children.length,4);
   const comments=item.find('qr-reasons');
   assert.equal(comments.children.length,4);
   comments.children.forEach((block,j)=>{
    assert.equal(block.find('qr-commentary-copy').textContent,paper.questions[i].comentarios_opciones['ABCD'[j]].replace(/^(?:Correcta|Revisa)\.\s*/,''));
   });
   assert.match(item.find('qr-reference').children.at(-1).textContent,/Pág\. impresa .*Pág\. PDF/);
  });
 }
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
