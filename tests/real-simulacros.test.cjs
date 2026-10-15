const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const catalog=JSON.parse(fs.readFileSync('content/past-exams/catalog.json','utf8'));
const papers=catalog.exams.filter(e=>e.count===100&&!e.missingNumbers.length&&!e.excludedQuestions.length);
function setup({free=false,wrong=false,change=false}={}){
 const nodes=new Map(),events=[];let calls=0,sessions=0;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',disabled:false,classList:{toggle(){},remove(){}},setAttribute(){},replaceChildren(){}});return nodes.get(id);};
 const c={console:{error(){}},Date,Set,AbortSignal,currentUser:{id:'qa'},currentCampusScreen:'simulacro-screen',document:{getElementById:node},CampusAccess:{isFree:()=>free,unlock:()=>events.push('unlock')},campo:(r,k)=>r[k]??r[k.toUpperCase()],getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:change&&++sessions>1?'changed':'qa'}}})}}),fetch:async(url,opt)=>{calls++;assert.equal(opt.cache,'no-store');assert.equal(opt.headers.Authorization,'Bearer qa');const id=new URL(url,'https://qa.test').searchParams.get('id');const p=JSON.parse(fs.readFileSync('api/_past_exams/'+id+'.json','utf8'));if(wrong)p.id='different';return {ok:true,status:200,json:async()=>p};},simState:{},showScreen(){},showSimScreen:x=>events.push(x),buildSimCircles(){},renderSimQuestion(){},startSimTimer:()=>events.push('timer'),showToast:x=>events.push(x),clearInterval(){},confirm:()=>true,innerWidth:1440};c.window=c;
 c.EntranceLibrary={format:key=>{const e=papers.find(e=>'real:'+e.id===key);return e&&{...e,pastId:e.id,title:e.title,minutes:100,free:e.year===catalog.freeYear};},markSelected(){},open(){}};
 vm.createContext(c);vm.runInContext(fs.readFileSync('simulacro-ingreso.js','utf8'),c);return {c,events,calls:()=>calls,nodes};
}
test('all eleven real full papers start as strict 100-question 100-minute simulations with original keys',async()=>{
 const t=setup();assert.equal(papers.length,11);
 for(const paper of papers){t.c.selectEntranceExam('real:'+paper.id);await t.c.iniciarSimulacro();assert.equal(t.c.simState.preguntas.length,100);assert.equal(t.c.simState.secondsLeft,6000);assert.equal(t.c.simState.strictTiming,true);assert.equal(t.c.simState.entranceOrigin,true);assert.equal(t.c.simState.pastExamId,paper.id);assert.equal(t.c.simState.mode,'pasado');assert.deepEqual(JSON.parse(JSON.stringify(t.c.simState.preguntas)),JSON.parse(fs.readFileSync('api/_past_exams/'+paper.id+'.json','utf8')).questions);}
 assert.equal(t.events.filter(e=>e==='timer').length,11);
});
test('incomplete historical papers and mini formats cannot be selected as complete simulators',()=>{
 const t=setup();for(const id of ['real:2025-2026-3','real:2024-2025-1','mini','premium-mini']){t.c.clearEntranceExam();t.c.selectEntranceExam(id);assert.equal(t.c.getSelectedEntranceExam(),null);}
 const h=fs.readFileSync('campus.html','utf8'),config=h.slice(h.indexOf('id="sim-config"'),h.indexOf('id="sim-exam"'));
 assert.ok(!config.includes('6</b>')&&!config.includes('40</b>')&&!config.includes('Mini simulacro'));
 const evaluation=h.slice(h.indexOf('id="evaluacion-screen"'));assert.ok(evaluation.includes('id="entrance-blood-depth-simulation"')&&evaluation.includes('startTopicAssessment'));
});
test('free access remains limited to the existing free year; locked selection does not fetch questions',async()=>{
 const t=setup({free:true});t.c.clearEntranceExam();t.c.selectEntranceExam('real:2024-2025-2');assert.equal(t.c.getSelectedEntranceExam(),null);assert.ok(t.events.includes('unlock'));assert.equal(t.calls(),0);
 t.c.selectEntranceExam('real:2025-2026-1');await t.c.iniciarSimulacro();assert.equal(t.c.simState.preguntas.length,100);
});
test('wrong papers, changed sessions and changed accounts cannot start an exam',async()=>{
 for(const opts of [{wrong:true},{change:true}]){const t=setup(opts);t.c.selectEntranceExam('real:2025-2026-1');await t.c.iniciarSimulacro();assert.ok(!t.events.includes('timer'));}
 const t=setup();t.c.selectEntranceExam('real:2025-2026-1');const p=t.c.iniciarSimulacro();t.c.currentUser={id:'another'};await p;assert.ok(!t.events.includes('timer'));
});
test('strict historical simulations submit at the deadline; archival exam overtime remains available',()=>{
 const src=fs.readFileSync('script.js','utf8');let tick,finished=0;const c={simState:{mode:'pasado',strictTiming:true,endTimestamp:0,secondsLeft:6000},Date:{now:()=>1000},document:{getElementById:()=>({classList:{toggle(){}}})},setInterval:fn=>{tick=fn;return 1;},clearInterval(){},showToast(){},finalizarSimulacro:()=>finished++};vm.runInNewContext(src.slice(src.indexOf('function startSimTimer()'),src.indexOf('function renderSimQuestion()')),c);c.startSimTimer();tick();assert.equal(finished,1);assert.equal(c.simState.secondsLeft,0);c.simState.strictTiming=false;c.startSimTimer();tick();assert.equal(finished,1);assert.equal(c.simState.secondsLeft,-1);
});
