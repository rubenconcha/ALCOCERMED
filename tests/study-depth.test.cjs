const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup({free=false,status=200,changeSession=false}={}){
 let calls=0,sessions=0;
 const context={window:{},CampusAccess:{isFree:()=>free},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:changeSession&&++sessions>1?'changed':'paid-test'}}})}}),AbortSignal,fetch:async(url,options)=>{
  calls++;assert.equal(options.headers.Authorization,'Bearer paid-test');assert.equal(options.cache,'no-store');
  return {ok:status===200,json:async()=>JSON.parse(fs.readFileSync('api/_mindmaps/'+new URL(url,'https://qa.test').searchParams.get('id')+'.json','utf8'))};
 }};context.window=context;
 vm.runInNewContext(fs.readFileSync('study-depth.js','utf8'),context);return {context,merge:context.StudyDepth.merge,calls:()=>calls};
}
test('free accounts do not request or receive the protected supplement',async()=>{
 const t=setup({free:true}),rows=[{materia:'BIOLOGIA CELULAR',pregunta:'Existing'}];assert.equal(await t.merge(rows,'flashcards'),rows);assert.equal(t.calls(),0);
});
test('library and bank share authenticated in-flight requests; feedback and stable SRS identities survive conversion',async()=>{
 const t=setup(),[cards,bank]=await Promise.all([t.merge([],'flashcards'),t.merge([],'bank')]);
 assert.equal(t.calls(),9);assert.equal(cards.length,90);assert.equal(bank.length,54);
 assert.equal(new Set(cards.map(c=>c.id)).size,90);assert.ok(cards.every(c=>c.id.startsWith('depth:')&&c.respuesta.includes('Fuente: Saladin')));
 assert.ok(bank.every(q=>!q.id&&q.content_id&&q.EXPLICACION.includes('A. ')&&q.EXPLICACION.includes('D. ')&&q.FUENTE&&q.PAGINAS_PDF));
 assert.equal(bank.filter(q=>q.TEMA==='sangre').length,24);
 const again=await t.merge(cards,'flashcards');assert.equal(again.length,90);assert.deepEqual(again.map(c=>c.id),cards.map(c=>c.id));
 assert.equal(t.calls(),18,'no persistent private cache in supplement');
});
test('a database row wins over a matching supplement without replacing its identity or student progress',async()=>{
 const t=setup(),cards=await t.merge([],'flashcards'),existing={...cards[0],id:123};const merged=await t.merge([existing],'flashcards');assert.equal(merged.length,90);assert.equal(merged[0],existing);
});
test('revoked access or a session change cannot populate the library cache',async()=>{
 await assert.rejects(setup({status:403}).merge([],'bank'),/No pudimos/);
 await assert.rejects(setup({changeSession:true}).merge([],'flashcards'),/sesión cambió/);
});
test('real data loaders merge supplements after pagination and share them with custom practice',async()=>{
 const t=setup(),s=fs.readFileSync('script.js','utf8');t.context.flashcardsCache=null;t.context.bancoState={_cache:[]};t.context.simState={};
 const sessionClient=t.context.getSupabase();t.context.getSupabase=()=>({...sessionClient,from:()=>({select:()=>({order:()=>({range:async()=>({data:[],error:null})})})})});
 vm.runInNewContext(s.slice(s.indexOf('async function loadFlashcards()'),s.indexOf('\nwindow.toggleMenu',s.indexOf('async function loadFlashcards()'))),t.context);
 vm.runInNewContext(s.slice(s.indexOf('let bancoQuestionsPromise = null;'),s.indexOf('async function preloadAppData()',s.indexOf('let bancoQuestionsPromise = null;'))),t.context);
 assert.equal((await t.context.loadFlashcards()).length,90);assert.equal((await t.context.fetchAllBancoQuestions()).length,54);assert.equal(t.context.simState._cache.length,54);
});
