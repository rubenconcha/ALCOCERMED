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
 assert.equal(t.calls(),13);assert.equal(cards.length,1578);assert.equal(bank.length,66);
 assert.equal(new Set(cards.map(c=>c.id)).size,1578);assert.ok(cards.every(c=>c.id.startsWith('depth:')&&c.respuesta.includes('Fuente: ')&&c.fuente&&c.paginas_pdf));
 assert.ok(bank.every(q=>!q.id&&q.content_id&&q.EXPLICACION.includes('A. ')&&q.EXPLICACION.includes('D. ')&&q.FUENTE&&q.PAGINAS_PDF));
 assert.equal(bank.filter(q=>q.TEMA==='sangre').length,36);
 const again=await t.merge(cards,'flashcards');assert.equal(again.length,1578);assert.deepEqual(again.map(c=>c.id),cards.map(c=>c.id));
 assert.equal(t.calls(),26,'no persistent private cache in supplement');
});
test('a database row wins over a matching supplement without replacing its identity or student progress',async()=>{
 const t=setup(),cards=await t.merge([],'flashcards'),existing={...cards[0],id:123};const merged=await t.merge([existing],'flashcards');assert.equal(merged.length,1578);assert.equal(merged[0],existing);
});
test('four original neural cards get sourced explanations without changing database identities',async()=>{
 const t=setup(),pack=JSON.parse(fs.readFileSync('content/flashcards_morfo_2026.json','utf8')).groups.find(g=>g.tema==='tejido nervioso');
 const rows=pack.cards.map(([PREGUNTA,RESPUESTA],i)=>({id:800+i,MATERIA:'MORFOFUNCION',TEMA:'tejido nervioso',PREGUNTA,RESPUESTA}));
 const cards=(await t.merge(rows,'flashcards')).filter(c=>(c.tema||c.TEMA)==='tejido nervioso');
 assert.equal(cards.length,52);assert.deepEqual(cards.slice(0,4).map(c=>c.id),[800,801,802,803]);
 assert.ok(cards.slice(0,4).every(c=>c.RESPUESTA.length>180&&c.source_reviewed));
 assert.match(cards[1].RESPUESTA,/nodos|Ranvier/);assert.match(cards[3].RESPUESTA,/retroalimentación/);
 const authored=JSON.parse(fs.readFileSync('api/_mindmaps/morfo_12_tejido_nervioso__01.json','utf8')).assets.flashcard_library.flashcards;
 assert.equal(new Set(authored.map(c=>c.subtopic)).size,7);assert.ok(authored.every(c=>c.answer.split(/\s+/).length>=30&&c.pdf_pages.every(p=>p>=470&&p<=501)));
});
test('revoked access or a session change cannot populate the library cache',async()=>{
 await assert.rejects(setup({status:403}).merge([],'bank'),/No pudimos/);
 await assert.rejects(setup({changeSession:true}).merge([],'flashcards'),/sesión cambió/);
});

test('every short official deck is expanded; subject boundaries, sources, stable IDs and quality corrections survive real merge',async()=>{
 const t=setup(),rows=[];let id=1000;
 for(const file of ['flashcards_morfo_2026','flashcards_oficiales_2026','flashcards_salud_investigacion_2026']){
  for(const g of JSON.parse(fs.readFileSync('content/'+file+'.json','utf8')).groups){
   if(['sangre','organos de los sentidos'].includes(g.tema))continue;
   for(const [pregunta,respuesta] of g.cards)rows.push({id:id++,materia:g.materia,tema:g.tema,pregunta,respuesta,next_review:'2030-01-01'});
  }
 }
 const frozen=JSON.stringify(rows),merged=await t.merge(rows,'flashcards'),groups=new Map();
 for(const c of merged){const k=c.materia+'|'+c.tema;groups.set(k,(groups.get(k)||0)+1);}
 assert.equal(groups.size,68);assert.ok([...groups.values()].every(n=>n>=20));
 assert.equal(JSON.stringify(rows),frozen,'input database records remain immutable');
 for(const old of rows){const row=merged.find(c=>c.id===old.id);assert.ok(row);assert.equal(row.next_review,'2030-01-01');assert.equal(row.materia,old.materia);assert.equal(row.tema,old.tema);}
 const pack=JSON.parse(fs.readFileSync('api/_mindmaps/flashcards_official_2026.json','utf8')).assets.flashcard_library;
 assert.equal(pack.flashcards.filter(c=>c.origin==='new_synthesis').length,692);
 assert.equal(new Set(pack.flashcards.map(c=>c.materia+'|'+c.tema)).size,65);
 assert.ok(pack.flashcards.every(c=>c.subtopic&&c.type&&c.source&&c.pdf_span.length===2&&!JSON.stringify(c).includes('\ufffd')));
 const oldKurt=JSON.parse(fs.readFileSync('api/_mindmaps/curated/flashcards_selected_expansions.json.source','utf8')).find(g=>g.base_index===66).cards[13];
 const corrected=await t.merge([{id:88,materia:'SALUD PUBLICA',tema:'dispersion y forma de los datos',pregunta:oldKurt.question,respuesta:oldKurt.answer}], 'flashcards');
 assert.match(corrected.find(c=>c.id===88).respuesta,/colas/);
 const oldHistogram=JSON.parse(fs.readFileSync('api/_mindmaps/curated/flashcards_selected_expansions.json.source','utf8')).find(g=>g.base_index===63).cards[9];
 const fixed=await t.merge([{id:89,MATERIA:'SALUD PUBLICA',TEMA:'frecuencias y graficos',PREGUNTA:oldHistogram.question,RESPUESTA:oldHistogram.answer}], 'flashcards');
 const row=fixed.find(c=>c.id===89);assert.match(row.PREGUNTA,/igual anchura/);assert.match(row.RESPUESTA,/densidad/);
 assert.equal(fixed.filter(c=>(c.pregunta||c.PREGUNTA)===row.PREGUNTA).length,1,'corrected database stem and supplement do not duplicate');
 const without=await t.merge([],'flashcards');assert.ok(!without.some(c=>c.pregunta===oldHistogram.question),'existing-only revisions do not create obsolete fallback prompts');
 const neural=JSON.parse(fs.readFileSync('api/_mindmaps/morfo_12_tejido_nervioso__01.json','utf8')).assets.flashcard_library.flashcards[0];
 let hash=2166136261;for(const ch of neural.question){hash^=ch.codePointAt(0);hash=Math.imul(hash,16777619);}
 assert.equal(without.find(c=>c.tema==='tejido nervioso'&&c.pregunta===neural.question).id,'depth:morfo_12_tejido_nervioso__01:fc:'+(hash>>>0).toString(16),'published nervous-tissue SRS IDs remain unchanged');
});
test('real data loaders merge supplements after pagination and share them with custom practice',async()=>{
 const t=setup(),s=fs.readFileSync('script.js','utf8');t.context.flashcardsCache=null;t.context.bancoState={_cache:[]};t.context.simState={};
 const sessionClient=t.context.getSupabase();t.context.getSupabase=()=>({...sessionClient,from:()=>({select:()=>({order:()=>({range:async()=>({data:[],error:null})})})})});
 vm.runInNewContext(s.slice(s.indexOf('async function loadFlashcards()'),s.indexOf('\nwindow.toggleMenu',s.indexOf('async function loadFlashcards()'))),t.context);
 vm.runInNewContext(s.slice(s.indexOf('let bancoQuestionsPromise = null;'),s.indexOf('async function preloadAppData()',s.indexOf('let bancoQuestionsPromise = null;'))),t.context);
 assert.equal((await t.context.loadFlashcards()).length,1578);assert.equal((await t.context.fetchAllBancoQuestions()).length,66);assert.equal(t.context.simState._cache.length,66);
});
