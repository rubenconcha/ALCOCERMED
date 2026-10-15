const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const payload=JSON.parse(fs.readFileSync('api/_mindmaps/morfo_18_sangre__09.json','utf8'));
function setup({free=false,status=200,change=false}={}){
 let calls=0,sessions=0;
 const c={console,AbortSignal,CampusAccess:{isFree:()=>free},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:change&&++sessions>1?'changed':'qa'}}})}}),fetch:async(url,opt)=>{calls++;assert.equal(opt.headers.Authorization,'Bearer qa');assert.equal(opt.cache,'no-store');return {ok:status===200,json:async()=>payload};}};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync('study-assessments.js','utf8'),c);return{c,calls:()=>calls};
}
test('independent sets are distinct from each other, original exams and map practice, with complete reasoning',()=>{
 const packs=JSON.parse(fs.readFileSync('content/morfo_sangre_sentidos_2026.json','utf8')).packs;
 const old=new Set(packs.flatMap(p=>[...p.simulacro.map(q=>q.pregunta),...p.evaluation.questions.map(q=>q.texto)]));
 for(const file of fs.readdirSync('api/_mindmaps').filter(f=>f.endsWith('.json'))){const p=JSON.parse(fs.readFileSync('api/_mindmaps/'+file,'utf8'));for(const q of p.assets?.practice?.questions||[])old.add(q.question);}
 const seen=new Set();for(const pack of Object.values(payload.assets.independent_assessments)){
  assert.equal(pack.questions.length,6);assert.ok(pack.scope.includes('no examen integral'));
  for(const q of pack.questions){assert.ok(!old.has(q.question)&&!seen.has(q.question));seen.add(q.question);assert.equal(new Set(q.options).size,4);assert.equal(q.reasons.length,4);assert.match(q.reasons[q.correct],/^Correcto:/);assert.ok(q.reasons.every(r=>r.length>65));assert.ok(q.pdf_pages.length&&q.difficulty_reason);}
 }assert.equal(seen.size,12);
});
test('paid sets preserve source and all alternatives without inventing database row IDs',async()=>{
 const t=setup();for(const kind of ['simulation','evaluation']){const rows=await t.c.StudyAssessments.load('sangre',kind);assert.equal(rows.length,6);assert.ok(rows.every(q=>!q.id&&q.content_id&&q.fuente&&q.paginas_pdf&&q.justificacion.includes('D. ')));}
 assert.equal(t.calls(),2);
});
test('free, denied and changed sessions fail closed',async()=>{
 const t=setup({free:true});await assert.rejects(t.c.StudyAssessments.load('sangre','simulation'));assert.equal(t.calls(),0);
 await assert.rejects(setup({status:403}).c.StudyAssessments.load('sangre','simulation'));
 await assert.rejects(setup({change:true}).c.StudyAssessments.load('sangre','evaluation'),/sesión cambió/);
});
test('new choices start independent six-question timers through the actual exam controller',async()=>{
 const t=setup(),nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',disabled:false,classList:{toggle(){}},setAttribute(){},replaceChildren(){}});return nodes.get(id);};
 let started=0;t.c.document={getElementById:node};t.c.campo=(r,k)=>r[k]??r[k.toUpperCase()];t.c.simState={};t.c.buildSimCircles=()=>{};t.c.showSimScreen=()=>{};t.c.renderSimQuestion=()=>{};t.c.startSimTimer=()=>started++;t.c.showToast=()=>{};
 vm.runInContext(fs.readFileSync('simulacro-ingreso.js','utf8'),t.c);
 const stems=[];for(const key of ['blood-depth-simulation','blood-depth-evaluation']){t.c.selectEntranceExam(key);await t.c.iniciarSimulacro();assert.equal(t.c.simState.duracion,8);assert.equal(t.c.simState.secondsLeft,480);assert.equal(t.c.simState.preguntas.length,6);assert.equal(t.c.simState.independentScope,true);stems.push(...t.c.simState.preguntas.map(q=>q.pregunta));}
 assert.equal(started,2);assert.equal(new Set(stems).size,12);
});
