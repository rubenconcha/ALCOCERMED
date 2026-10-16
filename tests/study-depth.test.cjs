const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup({free=false,status=200,changeSession=false}={}){
 let calls=0,sessions=0;const official=[{id:'morfo-01-001',pregunta:'¿Qué estudia la anatomía?',respuesta:'La estructura corporal.'}];
 const c={window:null,CampusAccess:{isFree:()=>free},OfficialFlashcards:{load:async()=>official},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:changeSession&&++sessions>1?'changed':'paid-test'}}})}}),AbortSignal,fetch:async(url,options)=>{calls++;assert.equal(options.headers.Authorization,'Bearer paid-test');return {ok:status===200,json:async()=>JSON.parse(fs.readFileSync('api/_mindmaps/'+new URL(url,'https://qa.test').searchParams.get('id')+'.json','utf8'))};}};c.window=c;
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
 const t=setup(),bank=await t.merge([],'bank');assert.equal(bank.length,84);
 assert.ok(bank.every(q=>q.EXPLICACION.includes('A. ')&&q.EXPLICACION.includes('D. ')&&q.FUENTE&&q.PAGINAS_PDF));
 assert.equal(bank.filter(q=>q.TEMA==='sangre').length,54);assert.equal((await t.merge(bank,'bank')).length,84);
});
test('bank content still fails closed on revocation and account changes',async()=>{
 await assert.rejects(setup({status:403}).merge([],'bank'),/No pudimos/);
 await assert.rejects(setup({changeSession:true}).merge([],'bank'),/sesión cambió/);
});
