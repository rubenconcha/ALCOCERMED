const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {validate}=require('../simulation-scope.js');
const paper=require('../api/_simulations/semana4-grupo-virtual-2.json');
const catalog=require('../content/simulacros-catalog.json');
const keys=['DAABBDBABC','DEABCECDEC','DACDDDAADD','BAABABDBCD','AAACBCADCA'].join('');

test('Semana 4 retains all 50 teacher keys and the corrected combination for question 30',()=>{
 assert.equal(keys.length,50);
 assert.ok(validate(paper,paper.id));
 assert.equal(paper.questions.map(q=>q.respuesta_correcta).join(''),keys);
 assert.equal(paper.questions.filter(q=>q.materia==='MORFOFUNCION').length,30);
 assert.equal(paper.questions.filter(q=>q.opcion_e).length,30);
 assert.deepEqual(paper.questions[29].truth_values,[false,true,true]);
 assert.equal(paper.questions[29].opcion_d,'2 y 3 son correctos');
 for(const mutate of [p=>p.questions.pop(),p=>p.questions[1]=p.questions[0],p=>p.questions[29].opcion_d='Todos son correctos',p=>p.questions[29].respuesta_correcta='B',p=>p.duration=100]){
  const bad=structuredClone(paper);mutate(bad);assert.equal(validate(bad,paper.id),false);
 }
});

test('Semana 4 appears directly after Semana 3 in both catalog paths',()=>{
 const index=catalog.entries.findIndex(e=>e.key===paper.id),entry=catalog.entries[index];
 assert.equal(catalog.entries[index-1].key,'semana3-grupo-virtual-2');
 assert.deepEqual([entry.minutes,entry.questionCount,entry.split],[50,50,[30,20,0]]);
 const context={window:{}};vm.runInNewContext(fs.readFileSync('campus-catalogs.js','utf8'),context);
 assert.equal(JSON.stringify(context.window.CampusCatalogs.simulations),JSON.stringify(catalog));
});

test('Semana 4 requires paid access and serves the complete protected paper',async t=>{
 const handler=require('../api/simulation.js');
 let calls=0,premium=false;
 t.mock.method(global,'fetch',async()=>{calls++;return Response.json({ready:true,premium});});
 async function request(token){const result={headers:{}};await handler({method:'GET',query:{id:paper.id},headers:token?{authorization:'Bearer '+token}:{}},{setHeader(k,v){result.headers[k]=v;},status(code){result.status=code;return this;},end(body){result.body=body;}});return result;}
 assert.equal((await request()).status,401);assert.equal(calls,0);
 assert.equal((await request('qa-free')).status,403);
 premium=true;const response=await request('qa-paid');
 assert.equal(response.status,200);assert.equal(response.headers['Cache-Control'],'private, no-store');
 assert.deepEqual(JSON.parse(response.body),paper);
 assert.ok(require('../vercel.json').rewrites.some(r=>r.source==='/api/_simulations/:path*'));
});

function environment(){
 class Element {
  constructor(){this.textContent='';this.children=[];this.style={};this.dataset={};this.classList={toggle(){},remove(){},add(){}};}
  append(...children){this.children.push(...children);} appendChild(child){this.append(child);return child;}
  replaceChildren(...children){this.children=children;} setAttribute(){} addEventListener(){} querySelectorAll(){return [];}
 }
 const nodes=new Map(),events=[];
 const node=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
 const c={console,Date,Set,AbortSignal,simState:{},currentUser:{id:'qa-local'},currentCampusScreen:'simulacro-screen',
  document:{getElementById:node,createElement:()=>new Element(),querySelector:()=>null},
  campo:(q,k)=>q[k],normalizeDbText:s=>s,CampusAccess:{isFree:()=>false},
  getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:'local-test'}}})}}),
  fetch:async()=>Response.json(paper),SimulationScope:{validate},
  showScreen(){},showSimScreen:s=>events.push(s),showToast:s=>{throw Error(s);},
  clearInterval(){},setInterval(){return 1;},guardarEnHistorial(){},guardarResultadoSimulacroEnNube:r=>events.push(r),
  simAcceptedAnswerIndices:q=>q.respuestas_aceptadas.map(k=>'ABCDE'.indexOf(k)),
 };
 c.window=c;c.EntranceLibrary={format:key=>catalog.entries.find(e=>e.key===key),markSelected(){}};
 vm.createContext(c);
 for(const file of ['question-review.js','campus-exam-engine.js','simulacro-ingreso.js'])vm.runInContext(fs.readFileSync(file,'utf8'),c);
 c.buildSimCircles=()=>{};c.renderSimQuestion=()=>{};
 return {c,nodes,events};
}

test('the student flow starts 50 minutes and finishes with all 50 answer reviews and score out of 50',async()=>{
 const {c,nodes,events}=environment();c.selectEntranceExam(paper.id);await c.iniciarSimulacro();
 assert.equal(c.simState.preguntas.length,50);assert.equal(c.simState.secondsLeft,3000);
 assert.equal(c.simState.strictTiming,true);assert.ok(events.includes('sim-exam'));
 c.simState.answers=paper.questions.map((q,i)=>({selected:i%3===0?'ABCDE'.indexOf(q.respuesta_correcta):i%3===1?null:('ABCDE'.indexOf(q.respuesta_correcta)+1)%4}));
 c.finalizarSimulacro();assert.ok(events.includes('sim-result'));
 assert.match(nodes.get('sim-result-score').textContent,/17\/50 puntos/);
 assert.equal(nodes.get('sim-review-list').children.length,50);
 const saved=events.find(e=>e?.questionReview);
 assert.equal(saved.menuSection,'simulacros');
 assert.equal(saved.questionReview.items.length,50);
 saved.questionReview.items.forEach((q,i)=>assert.equal(q.accepted[0],'ABCDE'.indexOf(keys[i])));
 assert.equal(saved.questionReview.items[29].options[3],'2 y 3 son correctos');
});
