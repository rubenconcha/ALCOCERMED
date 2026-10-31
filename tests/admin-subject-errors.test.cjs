const {test}=require('node:test'),assert=require('node:assert/strict');
global.QuestionReview=require('../question-review.js');
global.TopicResultsModel=require('../admin-topic-results.js');
const M=require('../admin-subject-errors.js');
const attempt=(id,materia,correctas,incorrectas,extra={})=>({id,user_id:'fixture-a',materia,correctas,incorrectas,sin_respuesta:0,created_at:'2026-10-21T03:00:00Z',...extra});
test('four subjects use errors as pie denominator and answered as rate denominator',()=>{
 const data={sims:[attempt('1','MORFOFUNCION',18,2),attempt('2','SALUD PUBLICA',1,3),attempt('3','MATEMÁTICAS',90,10),attempt('4','BIOLOGIA CELULAR',2,5)]};
 const r=M.build(data,'fixture-a');assert.equal(r.totalWrong,20);assert.deepEqual(r.rows.map(s=>s.share),[10,15,50,25]);assert.equal(r.rows[0].rate,10);assert.equal(r.rows[1].rate,75);assert.equal(r.rows[2].answered,100);assert.equal(r.historical,4);
});
test('does not derive wrong from percentage, games, flashcards or mixed exams',()=>{
 const r=M.build({sims:[attempt('1','todas',0,50),attempt('2','General',0,5),attempt('3','Anatomía',0,5),attempt('4','MORFOFUNCION',null,null,{porcentaje:0})],games:[{user_id:'fixture-a',puntaje:0,total:10}],flashcards:[{user_id:'fixture-a',repasos_totales:500}],activity:[{user_id:'fixture-a',grade:0}]},'fixture-a');
 assert.equal(r.totalWrong,0);assert.equal(r.attempts,0);assert.equal(r.excluded,4);
});
test('same ID counted once per source, different attempts retained, students never merged',()=>{
 const a=attempt('1','MORFOFUNCION',5,2),r=M.build({sims:[a,a,attempt('2','MORFOFUNCION',5,2),{...a,id:'3',user_id:'fixture-b'}],banco:[{...a,total:10}]},'fixture-a');
 assert.equal(r.attempts,3);assert.equal(r.duplicates,1);assert.equal(r.totalWrong,6);assert.equal(r.omitted,3);
 assert.equal(M.build({sims:[a]},'fixture-b').totalWrong,0);
});
test('zero wrong, no activity, and only omissions stay distinct',()=>{
 assert.equal(M.build({},'fixture-a').attempts,0);
 const r=M.build({sims:[attempt('1','MORFOFUNCION',20,0)]},'fixture-a');assert.equal(r.attempts,1);assert.equal(r.totalWrong,0);assert.equal(r.rows[0].rate,0);assert.equal(r.rows[1].rate,null);
 const o=M.build({sims:[attempt('1','MORFOFUNCION',0,0,{sin_respuesta:5})]},'fixture-a');assert.equal(o.omitted,5);assert.equal(o.rows[0].answered,0);assert.equal(o.rows[0].rate,null);
});
test('saved detail separates omissions and unkeyed responses without using aggregate wrong',()=>{
 const item={options:['A','B'],accepted:[0]},snapshot={version:1,items:[{...item,selected:0},{...item,selected:1},{...item,selected:null},{...item,selected:1,accepted:[]}]};
 const r=M.build({sims:[attempt('1','BIOLOGIA CELULAR',0,4)]},'fixture-a','',{'resultados_simulacros:1':snapshot});
 assert.equal(r.totalWrong,1);assert.equal(r.rows[3].answered,2);assert.equal(r.omitted,1);assert.equal(r.unknown,1);assert.equal(r.historical,0);
});
test('malformed/empty detail and invalid counters are excluded; explicit null uses history',()=>{
 const rows=[attempt('1','MORFOFUNCION',-1,2),attempt('2','MORFOFUNCION',1,1.5),attempt('3','MORFOFUNCION',1,2,{question_review:{version:8,items:[]}}),attempt('4','MORFOFUNCION',1,2,{question_review:{version:1,items:[]}})];
 assert.equal(M.build({sims:rows},'fixture-a').excluded,4);
 assert.equal(M.build({sims:[attempt('5','MORFOFUNCION',1,2,{question_review:null})]},'fixture-a').totalWrong,2);
 assert.equal(M.build({banco:[attempt('1','MORFOFUNCION',10,2,{total:5})]},'fixture-a').excluded,1);
});
test('date is Bolivia day; pie percentages sum to exactly 100.0%',()=>{
 const data={sims:[attempt('1','MORFOFUNCION',0,1),attempt('2','SALUD PUBLICA',0,1),attempt('3','BIOLOGIA CELULAR',0,1),attempt('4','MATEMATICAS',0,100,{created_at:'2026-10-21T04:00:00Z'})]};
 const r=M.build(data,'fixture-a','2026-10-20');assert.equal(r.totalWrong,3);assert.equal(r.rows.reduce((n,s)=>n+Math.round(s.share*10),0),1000);assert.deepEqual(r.rows.map(s=>s.share),[33.4,33.3,0,33.3]);
 assert.equal(M.build(data,'fixture-a','2026-10-21').totalWrong,100);
});
test('failed sources are excluded and do not pretend zero activity is complete',()=>{
 const data={sims:[attempt('1','MORFOFUNCION',5,2)],banco:[attempt('2','MORFOFUNCION',5,3,{total:8})]};
 const r=M.build(data,'fixture-a','',{errors:['resultados_simulacros']});assert.equal(r.totalWrong,3);assert.equal(r.excluded,1);
});
test('detail queries are admin-only, scoped by user, paginated and read-only',async()=>{
 const calls=[];global.currentAdmin=null;global.getSupabase=()=>{throw Error('unexpected request');};await M.load({sims:[attempt('1','MORFOFUNCION',1,1)]},'fixture-a');
 global.currentAdmin={id:'admin-fixture'};global.getSupabase=()=>({from(table){const query={select(columns){calls.push(['select',table,columns]);return query;},eq(key,value){calls.push(['eq',key,value]);return query;},order(){return query;},range(from,to){calls.push(['range',from,to]);return Promise.resolve({data:from===0?Array.from({length:100},(_,i)=>({id:String(i),question_review:null})):[],error:null});}};return query;}});
 const d=await M.load({sims:[attempt('1','MORFOFUNCION',1,1)]},'fixture-a');assert.deepEqual(d.errors,[]);assert.ok(calls.some(c=>c[0]==='eq'&&c[1]==='user_id'&&c[2]==='fixture-a'));assert.deepEqual(calls.filter(c=>c[0]==='range'),[['range',0,99],['range',100,199]]);delete global.currentAdmin;delete global.getSupabase;
});
