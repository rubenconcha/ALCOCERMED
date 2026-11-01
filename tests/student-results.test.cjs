const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../student-results.js');
const item=(selected,accepted=[0],extra={})=>({question:'Enunciado',options:['A','B'],selected,accepted,...extra});
const payload=items=>({version:1,items});
const row=(id,extra={})=>({id,user_id:'a',created_at:'2026-10-20T10:00:00Z',materia:'MORFOFUNCION',menu_section:'simulacros',correctas:2,incorrectas:1,sin_respuesta:0,...extra});
test('only current account, unique IDs, mixed types and date bounds',()=>{
 const rows=[row('1'),row('2',{menu_section:'evaluaciones'}),row('3',{menu_section:'examenes',created_at:'2026-10-21T10:00:00Z'}),row('4',{user_id:'b'}),row('1')];
 assert.equal(M.own(rows,'a').length,3);assert.equal(M.own(rows,null).length,0);assert.deepEqual(M.own(rows,'a',{type:'evaluaciones',from:'2026-10-20',to:'2026-10-20'}).map(r=>r.id),['2']);assert.equal(M.own(rows,'a',{from:'2026-10-22'}).length,0);
});
test('historical type is explicit instead of inventing simulacro',()=>{assert.equal(M.kind({}), 'historicos');assert.equal(M.kind({simulacro_titulo:'Evaluación: Tema'}),'evaluaciones');});
test('stored snapshots distinguish all four statuses without live exam keys',()=>{
 assert.deepEqual(M.inspect(payload([item(0),item(1),item(null),item(0,[]),item(9)])).map(q=>q.status),['correct','wrong','unanswered','unknown','unknown']);
 assert.equal(M.inspect(null),null);assert.equal(M.inspect(payload([])),null);
});
test('summary preserves historic missing values and stored snapshot truth',()=>{
 assert.equal(M.summary({correctas:0}).wrong,null);assert.equal(M.summary(row('1',{question_review:payload([item(1)])})).wrong,1);
});
test('mixed simulacros use per-question subject and exclude unattributed detail',()=>{
 const a=M.analyze([row('1',{materia:'todas',question_review:payload([item(1,[0],{materia:'MATEMATICAS'}),item(0,[0],{materia:'BIOLOGIA CELULAR'}),item(1)])})]);
 assert.equal(a.excluded,1);assert.equal(a.totalWrong,1);assert.equal(a.subjects.find(s=>s.label==='Matemáticas').rate,100);assert.equal(a.subjects.find(s=>s.label==='Biología celular').wrong,0);
});
test('pie share and error rate have different denominators; omit and unknown separated',()=>{
 const a=M.analyze([row('1',{question_review:payload([item(0),item(1),item(null),item(0,[])])}),row('2',{materia:'MATEMATICAS',correctas:0,incorrectas:3})]);
 const s=a.subjects.find(s=>s.label==='Morfofunción');assert.equal(s.rate,50);assert.equal(s.share,25);assert.equal(s.omitted,1);assert.equal(s.unknown,1);assert.equal(a.totalWrong,4);
});
test('legacy mixed attempts and malformed snapshots are excluded from subject analysis',()=>{
 const a=M.analyze([row('1',{materia:'todas'}),row('2',{question_review:{version:9}})]);assert.equal(a.excluded,2);assert.equal(a.totalWrong,0);
});
test('question ranking does not join changed options by reused id',()=>{
 const a=M.analyze([row('1',{question_review:payload([item(1,[0],{id:'same'}),item(1,[0],{id:'same',options:['X','Y']})])})]);assert.equal(a.questions.length,2);
});
test('topics are counted only from stored detail; explicit unknown subject is not reassigned',()=>{
 const a=M.analyze([row('1',{question_review:payload([item(1,[0],{materia:'Desconocida',tema:'Tema guardado'}),item(null,[0],{tema:'Otro'})])})]);assert.equal(a.totalWrong,0);assert.equal(a.excluded,1);assert.equal(a.topics[0].wrong,1);assert.equal(a.topics[0].answered,1);
});
test('Mis resultados is its own campus screen and logout clears it synchronously',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),source=fs.readFileSync('script.js','utf8'),html=fs.readFileSync('campus.html','utf8');
 assert.match(html,/onclick="openStudentResults\(\)"><svg[\s\S]*?<strong>Mis resultados/);assert.match(html,/student-results.js\?v=1/);assert.match(source,/function showLoginScreen\(\) \{\s*window.StudentResults\?\.clear\(\)/);
 const visible=new Set(['home-screen']),ids=['home-screen','student-results-screen','evaluacion-screen'];
 const context={window:{scrollTo(){},innerWidth:1200},document:{getElementById:id=>ids.includes(id)?{classList:{remove:()=>visible.add(id),add:()=>visible.delete(id)}}:null},closeMobileSidebar(){},quizTimer:null,flashcardReviewTimer:null,bancoState:null,updateHomeStats(){},confirm:()=>true};
 const start=source.indexOf("let currentCampusScreen = 'home-screen';"),end=source.indexOf('function updateHomeStats()',start);vm.runInNewContext(source.slice(start,end),context);context.showScreen('student-results-screen');assert.deepEqual([...visible],['student-results-screen']);context.window.goBack();assert.deepEqual([...visible],['home-screen']);
});
test('per-account local sufficiency only uses valid owned last result; no reconstructed wrong answers',()=>{
 const storage={getItem:()=>JSON.stringify({p:{owner:'a',paperId:'p',correct:2,total:3,percent:67,at:'2026-10-20T10:00:00Z'},q:{owner:'b',paperId:'q',correct:1,total:1,percent:100,at:'2026-10-20'}})};
 const rows=M.localRows(storage,'a');assert.equal(rows.length,1);assert.equal(rows[0].incorrectas,null);assert.equal(M.localRows({getItem:()=>'{bad'},'a').length,0);
});
test('future sufficiency snapshot freezes submitted options, keys and explanation, numeric timestamps work',()=>{
 const q={id:'q',subject:'fisica',topic:'Fuerza',text:'Enunciado original',options:['Uno','Dos'],correct:0,explanation:'Comentario guardado'};
 const C={grade:()=>({percent:0,correct:0,total:1}),optionText:(q,i)=>q.options[i],subjects:{fisica:'Física'},paper:()=>({id:'p'})};
 const saved=M.freezeSufficiency([q],{owner:'a',area:'simulacro:p',answers:{q:1},finishedAt:1792490400000},{passages:[]},C,'Título guardado');q.options[0]='Actualizada';
 assert.equal(saved.question_review.items[0].options[0],'Uno');
 const storage={getItem:k=>k.endsWith(':papers')?JSON.stringify({p:saved}):JSON.stringify({owner:'a',finished:true,result_snapshot:saved})};
 const rows=M.localRows(storage,'a');assert.equal(rows.length,1);assert.equal(M.summary(rows[0]).wrong,1);assert.equal(M.analyze(rows).subjects[0].label,'Física');
});
function apiFactory(handler,session=()=>({user:{id:'a'}})){
 return {auth:{getSession:async()=>({data:{session:session()}})},from(table){assert.equal(table,'resultados_simulacros');const q={columns:'',filters:[],select(c){q.columns=c;return q;},eq(k,v){q.filters.push([k,v]);return q;},order(){return q;},range(a,b){assert.deepEqual(q.filters,[['user_id','a']]);return handler(q,a,b);}};return q;}};
}
test('loader pages own data and filters unexpected foreign rows defensively',async()=>{
 const calls=[],api=apiFactory(async(q,offset)=>{calls.push(offset);return {data:offset?[]:Array.from({length:100},(_,i)=>row(String(i),i===99?{user_id:'b'}:{}))};});let result;
 await M.loader(api,()=> 'a',v=>result=v).load();assert.deepEqual(calls,[0,100]);assert.equal(result.rows.length,99);
});
test('missing optional schema fields retry only those fields, preserving summary',async()=>{
 let calls=0,result;const api=apiFactory(async q=>{calls++;if(q.columns.includes('menu_section'))return {error:{code:'42703',message:'menu_section does not exist'}};if(q.columns.includes('question_review'))return {error:{code:'PGRST204',message:'question_review missing'}};return {data:[row('1')]};});
 await M.loader(api,()=> 'a',v=>result=v).load();assert.equal(calls,3);assert.equal(result.rows.length,1);
});
test('authorization failure surfaces as error, never falls back to shared local history',async()=>{
 let result;await M.loader(apiFactory(async()=>({error:{code:'42501'}})),()=> 'a',v=>result=v).load();assert.match(result.error,/historial/);
});
test('stale success after account switch cannot populate UI',async()=>{
 let resolve,actor='a',result;const api=apiFactory(()=>new Promise(r=>resolve=r));const l=M.loader(api,()=>actor,v=>result=v),p=l.load();await new Promise(r=>setImmediate(r));actor='b';l.clear();resolve({data:[row('1')]});await p;assert.equal(result,null);
});
test('stale rejected load after logout cannot populate error UI',async()=>{
 let reject,actor='a',result;const api=apiFactory(()=>new Promise((_,r)=>reject=r));const l=M.loader(api,()=>actor,v=>result=v),p=l.load();await new Promise(r=>setImmediate(r));actor=null;l.clear();reject(Error('late'));await p;assert.equal(result,null);
});
test('zero attempts is honest empty data and refresh requests fresh data',async()=>{
 let result,calls=0;const l=M.loader(apiFactory(async()=>{calls++;return {data:[]};}),()=> 'a',v=>result=v);await l.load();await l.load();assert.equal(result.rows.length,0);assert.equal(calls,2);
});
