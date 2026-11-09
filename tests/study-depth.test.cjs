const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const readBank=require('../api/_mindmaps/bank.cjs');
const teaching=require('../api/_mindmaps/banco-docente.json');
function setup({free=false,status=200,changeSession=false}={}){
 let calls=0,sessions=0;const official=[{id:'morfo-01-001',pregunta:'¿Qué estudia la anatomía?',respuesta:'La estructura corporal.'}];
 const c={window:null,CampusAccess:{isFree:()=>free},OfficialFlashcards:{load:async()=>official},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:changeSession&&++sessions>1?'changed':'paid-test'}}})}}),AbortSignal,fetch:async(url,options)=>{calls++;assert.equal(url,'/api/mindmap?id=banco-ampliado&revision=docente');assert.equal(options.headers.Authorization,'Bearer paid-test');return {ok:status===200,json:async()=>({questions:JSON.parse(await readBank()),teaching})};}};c.window=c;
 vm.runInNewContext(fs.readFileSync('study-depth.js','utf8'),c);return {c,official,calls:()=>calls,merge:c.StudyDepth.merge};
}
test('legacy flashcard merging is replaced entirely, including long answers and supplemental sources',async()=>{
 const t=setup(),legacy=[{id:123,respuesta:'A long legacy answer',fuente:'Complemento externo'}];
 const result=await t.merge(legacy,'flashcards');assert.equal(result,t.official);assert.equal(t.calls(),0);assert.equal(legacy[0].id,123);
});
test('free and paid flashcards both use server-authorized official content',async()=>{
 const t=setup({free:true});assert.equal(await t.merge([],'flashcards'),t.official);assert.equal(t.calls(),0);
});
test('the existing question bank keeps its sourced answers and explanations',async()=>{
 const t=setup(),bank=await t.merge(Promise.resolve([]),'bank');assert.equal(bank.length,84);assert.equal(t.calls(),1);
 assert.ok(bank.every(q=>q.EXPLICACION.includes('A. ')&&q.EXPLICACION.includes('D. ')&&q.FUENTE&&q.PAGINAS_PDF));
 assert.equal(bank.filter(q=>q.TEMA==='sangre').length,54);assert.equal((await t.merge(bank,'bank')).length,84);
});
test('bank content still fails closed on revocation and account changes',async()=>{
 await assert.rejects(setup({status:403}).merge([],'bank'),/No pudimos/);
 await assert.rejects(setup({changeSession:true}).merge([],'bank'),/sesión cambió/);
});

test('course review covers every Ciclo celular question without changing its key or legacy rows', async()=>{
 const rows=require('../content/banco_bibliografia_2026.json');
 const cycle=rows.filter(row=>row.MATERIA==='BIOLOGIA CELULAR'&&row.TEMA==='ciclo celular');
 const t=setup();
 const bank=await t.merge(cycle,'bank');
 const questions=bank.slice(0,cycle.length).map(t.c.StudyDepth.prepareBankQuestion);
 assert.equal(questions.length,98);
 assert.equal(questions.filter(q=>q.DIFICULTAD==='dificil').length,14);
 for(const [i,row] of questions.entries()){
  assert.ok(row.justificacion.length>100,cycle[i].PREGUNTA);
  assert.ok(row.banco_lectura.title&&row.banco_lectura.start);
  assert.equal(row.RESPUESTA_CORRECTA,cycle[i].RESPUESTA_CORRECTA);
  assert.equal(cycle[i].justificacion,undefined);
 }
 const sample=questions.find(q=>q.pregunta?.includes('roturas de doble hebra'));
 assert.ok(sample.justificacion.includes('G2/M'));
 assert.deepEqual(Array.from(sample.banco_lectura.figures, f=>f.page),[606,607]);
 assert.equal(sample.opcion_a,'Dar tiempo para reparar las roturas antes del reparto cromosómico.');
 assert.equal(Object.keys(sample.comentarios_opciones).length,4);
 const altered={...cycle[65],RESPUESTA_CORRECTA:'B'};
 const mismatched=(await t.merge([altered],'bank'))[0];
 assert.equal(t.c.StudyDepth.prepareBankQuestion(mismatched),altered);
});

test('verified Saladin reading groups add figures and tables while retaining each existing explanation', async()=>{
 const rows=require('../content/banco_bibliografia_2026.json').filter(q=>/capítulo (16|18)$/.test(q.FUENTE));
 const t=setup();
 const bank=await t.merge(rows,'bank');
 const questions=bank.slice(0,rows.length).map(t.c.StudyDepth.prepareBankQuestion);
 assert.equal(questions.length,160);
 for(const [i,row] of questions.entries()){
  assert.equal(row.EXPLICACION,rows[i].EXPLICACION);
  assert.ok(row.banco_lectura.figures.length);
  for(const f of row.banco_lectura.figures)assert.equal(f.page-f.printed,28);
 }
});
