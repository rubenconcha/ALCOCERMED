const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const readBank=require('../api/_mindmaps/bank.cjs');
const teaching=require('../api/_mindmaps/banco-docente.json');
const reviewed=require('../api/_mindmaps/verified-bank.cjs');
const authored=require('../api/_mindmaps/banco-verificado.json');
function setup({free=false,status=200,changeSession=false,reviewedQuestions=[]}={}){
 let calls=0,sessions=0;const official=[{id:'morfo-01-001',pregunta:'¿Qué estudia la anatomía?',respuesta:'La estructura corporal.'}];
 const c={window:null,CampusAccess:{isFree:()=>free},OfficialFlashcards:{load:async()=>official},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:changeSession&&++sessions>1?'changed':'paid-test'}}})}}),AbortSignal,fetch:async(url,options)=>{calls++;assert.equal(url,'/api/mindmap?id=banco-ampliado&revision=docente');assert.equal(options.headers.Authorization,'Bearer paid-test');return {ok:status===200,json:async()=>({questions:JSON.parse(await readBank()),teaching,reviewedQuestions})};}};c.window=c;
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
 const t=setup(),bank=await t.merge(Promise.resolve([]),'bank');assert.equal(bank.length,30);assert.equal(t.calls(),1);
 assert.ok(bank.every(q=>q.EXPLICACION.includes('A. ')&&q.EXPLICACION.includes('D. ')&&q.FUENTE&&q.PAGINAS_PDF));
 assert.equal(bank.filter(q=>q.TEMA==='sangre').length,30);assert.equal((await t.merge(bank,'bank')).length,30);
});
test('bank content still fails closed on revocation and account changes',async()=>{
 await assert.rejects(setup({status:403}).merge([],'bank'),/No pudimos/);
 await assert.rejects(setup({changeSession:true}).merge([],'bank'),/sesión cambió/);
});

test('Ciclo celular keeps the existing teaching feedback and keys for easy and medium questions', async()=>{
 const rows=require('../content/banco_bibliografia_2026.json');
 const cycle=rows.filter(row=>row.MATERIA==='BIOLOGIA CELULAR'&&row.TEMA==='ciclo celular'&&row.DIFICULTAD!=='dificil');
 const t=setup();
 const bank=await t.merge(cycle,'bank');
 const questions=bank.slice(0,cycle.length).map(t.c.StudyDepth.prepareBankQuestion);
 assert.equal(questions.length,84);
 for(const [i,row] of questions.entries()){
  assert.ok(row.justificacion.length>100,cycle[i].PREGUNTA);
  assert.ok(row.banco_lectura.title&&row.banco_lectura.start);
  assert.equal(row.RESPUESTA_CORRECTA,cycle[i].RESPUESTA_CORRECTA);
  assert.equal(cycle[i].justificacion,undefined);
 }
 const altered={...cycle[0],RESPUESTA_CORRECTA:'X'};
 const mismatched=(await t.merge([altered],'bank'))[0];
 assert.equal(t.c.StudyDepth.prepareBankQuestion(mismatched),altered);
});

test('verified Saladin reading groups add figures and tables while retaining each existing explanation', async()=>{
 const rows=require('../content/banco_bibliografia_2026.json').filter(q=>/capítulo (16|18)$/.test(q.FUENTE)&&q.DIFICULTAD!=='dificil');
 const t=setup();
 const bank=await t.merge(rows,'bank');
 const questions=bank.slice(0,rows.length).map(t.c.StudyDepth.prepareBankQuestion);
 assert.equal(questions.length,rows.length);
 for(const [i,row] of questions.entries()){
  assert.equal(row.EXPLICACION,rows[i].EXPLICACION);
  assert.ok(row.banco_lectura.figures.length);
  for(const f of row.banco_lectura.figures)assert.equal(f.page-f.printed,28);
 }
});

test('the difficult Medicine bank replaces unaudited items and links every comment to its checked PDF pages', async()=>{
 const legacy = require('../content/banco_bibliografia_2026.json');
 const old = { materia:'Morfofunción', tema:'temas principales de anatomia y fisiologia', dificultad:'Muy difícil',
  pregunta:'¿Cuál es la diferencia entre una ley natural y una teoría científica?' };
 const other = { materia:'Matemáticas', dificultad:'difícil', pregunta:'Pregunta de suficiencia' };
 const external = { materia:'Morfofunción', dificultad:'medio', fuente:'Ampliación fisiológica: https://example.org', pregunta:'Ampliación' };
 const t = setup({reviewedQuestions:reviewed});
 const bank = await t.merge([...legacy, old, other, external],'bank');
 assert.ok(!bank.includes(old));
 assert.ok(!bank.includes(external));
 assert.ok(bank.includes(other));
 assert.equal(bank.filter(q=>q.DIFICULTAD==='dificil').length,0);
 assert.equal(bank.filter(q=>q.dificultad==='dificil'&&q!==other).length,86);
 assert.equal(new Set(reviewed.map(q=>q.materia+'|'+q.tema)).size,68);
 assert.equal(reviewed.filter(q=>q.content_id.startsWith('banco-verificado:morfo-01:')).length,16);
 const read = (q,name) => q[name];
 const { commentaryData } = require('../question-review.js');
 const direct = new Map(authored.map(entry=>[entry.id,entry]));
 for (const q of reviewed) {
  const review = commentaryData(q,read);
  assert.ok(review.references.every(ref=>ref.page>0&&ref.marks.length&&ref.marks.every(
   ([x,y,w,h])=>x>=0&&y>=0&&w>0&&h>0&&x+w<=1.0001&&y+h<=1.0001
  )),q.content_id);
  assert.match(q.pregunta,/^[^?\n]+\?$/u,q.content_id);
  assert.equal(new Set(review.options).size,4,q.content_id);
  assert.ok(review.options.every(option=>!/(?:afirmaci[oó]n\s+\d|ambas afirmaciones|ninguna afirmación)/i.test(option)),q.content_id);
  assert.equal(review.options['ABCD'.indexOf(q.respuesta_correcta)],direct.get(q.content_id).answer,q.content_id);
  assert.ok(review.explanation.length>50&&!review.teaching,q.content_id);
 }
 const law=reviewed.find(q=>q.content_id.endsWith(':ley-teoria'));
 assert.match(law.justificacion,/Boyle/);
 assert.deepEqual(law.lecturas_comentario.map(({page,printed})=>[page,printed]),[[37,9]]);
 const variation=reviewed.find(q=>q.content_id.endsWith(':variacion'));
 assert.match(variation.pregunta,/dos arterias renales/);
 assert.deepEqual(variation.lecturas_comentario.map(({page,printed})=>[page,printed]),[[42,14]]);
});
