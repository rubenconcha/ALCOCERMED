const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../admin-topic-results.js');
const exam={id:'morfo-01',subject:'MORFOFUNCION',title:'Temas principales de anatomía y fisiología'};
const attempt=(id,percent,date,questions=20)=>({user_id:id,simulacro_titulo:'Evaluación: '+exam.title,materia:'morfofuncion',porcentaje:percent,correctas:questions*percent/100,incorrectas:questions*(100-percent)/100,sin_respuesta:0,created_at:date});
test('report recognizes historical titles without mixing simulations, subjects or other themes',()=>{
 assert.ok(M.matches(attempt('a',90,'2026-10-21T01:00:00Z'),exam));
 for(const change of [{simulacro_titulo:'Simulacro: '+exam.title},{simulacro_titulo:'Evaluación: Otro tema'},{materia:'BIOLOGIA CELULAR'}])assert.equal(M.matches({...attempt('a',90,''),...change},exam),false);
 assert.ok(M.matches({...attempt('a',90,''),simulacro_titulo:'evaluacion: TEMAS PRINCIPALES DE ANATOMIA Y FISIOLOGIA'},exam));
});
test('individual summaries preserve zero grades, latest vs best, all attempts and directory-only students',()=>{
 const report=M.build({exam,sims:[attempt('a',90,'2026-10-20T22:00:00Z'),attempt('a',0,'2026-10-21T01:00:00Z'),attempt('b',80,'2026-10-20T21:00:00Z',30),attempt('admin',0,'2026-10-21T00:00:00Z')],userMap:{a:{name:'Ana',email:'ana@test.invalid'},b:{name:'Bea'},c:{name:'Carla'},admin:{email:'admin@test.invalid'}},excludedEmails:['admin@test.invalid']});
 assert.equal(report.people.length,3);assert.equal(report.delivered,2);assert.equal(report.pending,1);assert.equal(report.attempts,3);assert.equal(report.average,40);const ana=report.people.find(s=>s.user_id==='a');assert.equal(ana.attempts.length,2);assert.equal(M.score(ana.last),0);assert.equal(ana.best,90);assert.equal(M.total(report.people.find(s=>s.user_id==='b').last),30);
});
test('date filters use Bolivia midnight, retain pending known accounts and separate equal names by ID',()=>{
 const rows=[attempt('a',90,'2026-10-21T03:59:59Z'),attempt('b',70,'2026-10-21T04:00:00Z')];
 const report=M.build({exam,sims:rows,students:[{user_id:'a',name:'José'},{user_id:'b',name:'José'}],from:'2026-10-20',to:'2026-10-20',query:'jose'});
 assert.equal(report.delivered,1);assert.equal(report.pending,1);assert.equal(report.visible.length,2);assert.equal(M.day(rows[0].created_at),'2026-10-20');assert.equal(M.day(rows[1].created_at),'2026-10-21');assert.equal(M.day('invalid'),'');
 const pending=M.build({exam,sims:rows,userMap:{a:{},b:{},c:{}},from:'2026-10-20',to:'2026-10-20',state:'pending'});assert.equal(pending.visible.length,2);
});
test('CSV escapes quotes, line breaks and spreadsheet formula prefixes',()=>{
 assert.equal(M.csvCell('Ana "Prueba"'),'"Ana ""Prueba"""');assert.equal(M.csvCell('=1+1'),'"\'=1+1"');assert.equal(M.csvCell('  @SUM(1)'),'"\'  @SUM(1)"');assert.equal(M.csvCell('90'),'"90"');
});
test('evaluation history selects submitters on one Bolivia day across topics and subjects',()=>{
 const rows=[
  {user_id:'a',simulacro_titulo:'Evaluación: Tema 1',materia:'MORFOFUNCION',created_at:'2026-10-21T01:12:00Z',porcentaje:85},
  {user_id:'b',simulacro_titulo:'Evaluación: Tema 2',materia:'BIOLOGIA CELULAR',created_at:'2026-10-20T18:00:00Z',porcentaje:0},
  {user_id:'c',simulacro_titulo:'Evaluación: Tema 3',materia:'MORFOFUNCION',created_at:'2026-10-21T04:00:00Z',porcentaje:90},
  {user_id:'d',simulacro_titulo:'Simulacro personalizado',materia:'MORFOFUNCION',created_at:'2026-10-20T18:00:00Z',porcentaje:100}
 ];
 const result=M.build({exam:{id:'all',subject:''},sims:rows,from:'2026-10-20',to:'2026-10-20',state:'delivered'});
 assert.deepEqual(result.visible.map(s=>s.user_id).sort(),['a','b']);assert.equal(result.attempts,2);
 assert.equal(M.build({exam:{id:'all',subject:'MORFOFUNCION'},sims:rows,from:'2026-10-20',to:'2026-10-20',state:'delivered'}).visible.length,1);
});
test('result pagination loads beyond one database page and never reports a partial fetch as complete',async()=>{
 const src=fs.readFileSync('admin.js','utf8');let calls=0,fail=false;const ctx={cachedData:{errors:[]},console};vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('async function safeSelect('),src.indexOf('async function getUserDirectory(')),ctx);
 const sb={from(){return {select(){return this},order(){return this},range(from,to){calls++;assert.equal(to-from,499);return Promise.resolve(fail&&from>0?{error:{message:'unavailable'}}:{data:Array.from({length:from===0?500:7},(_,i)=>({id:from+i}))})}}}};
 assert.equal((await ctx.safeSelect(sb,'resultados_simulacros','*',{paged:true})).length,507);assert.equal(calls,2);fail=true;assert.equal((await ctx.safeSelect(sb,'resultados_simulacros','*',{paged:true})).length,0);assert.equal(ctx.cachedData.errors.length,1);
});
test('admin report has filters, individual history, safe DOM rendering and explicit historical limitations',()=>{
 const html=fs.readFileSync('admin.html','utf8'),js=fs.readFileSync('admin-topic-results.js','utf8');for(const id of ['topic-report-topic','topic-report-search','topic-report-from','topic-report-to','topic-report-state','topic-report-dialog'])assert.ok(html.includes('id="'+id+'"'));assert.ok(js.includes("e.table === 'resultados_simulacros'"));assert.ok(js.includes('Las respuestas elegidas en cada pregunta no están almacenadas'));assert.ok(!js.includes('.innerHTML'));assert.ok(!js.includes('.insert('));assert.ok(js.includes("!currentAdmin"));
});
