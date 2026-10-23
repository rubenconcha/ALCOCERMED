const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {validate}=require('../simulation-scope.js'),paper=require('../api/_simulations/mini-foundations.json');
const catalog=require('../content/simulacros-catalog.json');
test('requested mini is exactly 15 Morfo 1, 15 Morfo 8 and 20 Calvo 1, with a 50-minute deadline',()=>{
 assert.ok(validate(paper,'mini-foundations'));assert.equal(validate(paper,'first'),false);
 assert.equal(paper.duration,50);assert.equal(paper.questions.length,50);
 const counts={};for(const q of paper.questions){const key=q.materia+':'+q.coverage.chapter;counts[key]=(counts[key]||0)+1;}
 assert.deepEqual(counts,{'MORFOFUNCION:1':15,'MORFOFUNCION:8':15,'BIOLOGIA CELULAR:1':20});
 assert.deepEqual(paper.questions.map(q=>q.numero_original),Array.from({length:50},(_,i)=>i+1));
 const foreign=structuredClone(paper);foreign.questions[0].coverage.chapter=2;assert.equal(validate(foreign,'mini-foundations'),false);
 const wrongBio=structuredClone(paper);wrongBio.questions[30].coverage.chapter=2;assert.equal(validate(wrongBio,'mini-foundations'),false);
 const wrongSplit=structuredClone(paper);wrongSplit.questions[15].coverage.chapter=1;assert.equal(validate(wrongSplit,'mini-foundations'),false);
 const short=structuredClone(paper);short.questions.pop();assert.equal(validate(short,'mini-foundations'),false);
 const deadline=structuredClone(paper);deadline.duration=100;assert.equal(validate(deadline,'mini-foundations'),false);
});
test('every mini question cites verified official PDF pages and has one answer with a contextual explanation',()=>{
 const hashes={'morfofisiliologia-saladin-anatomia-y-fisiologia (1) (3).pdf':'e00074c7105c10052637b1c2a82f2b8959cf7c4cb9a91c4abd058ce958e58148','Biologia_Celular_Biomedica_St_Alfonso_Ca (1).pdf':'6a9e9d5f3bada584603d87ef954237ce9f8d5f02f28a16c90b3228bd7328d72b'};
 for(const q of paper.questions){
  assert.equal(q.source.sha256,hashes[q.source.file]);assert.equal(q.coverage.curriculum,'official-pdfs-2026-10-19');
  assert.ok(q.source.pdf_pages.includes(q.source.evidence_page));assert.ok(q.source.evidence_excerpt.toLowerCase().includes(q.source.anchor.toLowerCase()));
  assert.ok(q.justificacion.length>35);assert.equal(q.comentario,q.justificacion);assert.deepEqual(q.respuestas_aceptadas,[q.respuesta_correcta]);
  assert.ok(q['opcion_'+q.respuesta_correcta.toLowerCase()]);assert.match(q.fuente,/p\. PDF/);
  if(q.materia==='BIOLOGIA CELULAR'){assert.match(q.fuente,/Alfonso Calvo/);assert.ok(!/Alberts/.test(q.fuente));assert.equal(q.source.printed_pages,null);assert.match(q.source.printed_page_note,/repaginado/);assert.ok(q.source.pdf_pages.every(n=>n>=34&&n<=52));}
  else{assert.equal(q.source.chapter,q.coverage.chapter);assert.deepEqual(q.source.printed_pages,q.source.pdf_pages.map(n=>String(n-28)));}
 }
 const report=require('../quality/mini-foundations-audit.json');assert.equal(report.total,50);assert.equal(report.items.length,50);
});
test('mini is catalogued with its actual length and full models retain their existing format',()=>{
 const entry=catalog.entries.find(e=>e.curatedId===paper.id);assert.equal(entry.questionCount,50);assert.deepEqual(entry.split,[30,20,0]);assert.equal(entry.kind,'mini');
 assert.equal(catalog.entries.filter(e=>e.kind!=='mini').length,14);
 assert.ok(fs.readFileSync('campus.html','utf8').includes('<option value="mini-foundations">minisimulacros</option>'));
});
test('new protected API serves the mini only after checking paid access',async()=>{
 const handler=require('../api/simulation.js'),original=global.fetch;
 async function call(token,premium){let status,body,headers={};global.fetch=async()=>({ok:true,json:async()=>({ready:true,premium})});await handler({method:'GET',query:{id:'mini-foundations'},headers:token?{authorization:'Bearer '+token}:{}},{setHeader(k,v){headers[k]=v},status(code){status=code;return this},end(value){body=value}});return{status,body,headers};}
 try{
  assert.equal((await call(null,true)).status,401);assert.equal((await call('free',false)).status,403);
  const result=await call('paid',true);assert.equal(result.status,200);assert.equal(result.headers['Cache-Control'],'private, no-store');assert.ok(validate(JSON.parse(result.body),'mini-foundations'));
 }finally{global.fetch=original;}
});
