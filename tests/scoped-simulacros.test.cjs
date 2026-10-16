const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{Writable}=require('node:stream'),scope=require('../simulation-scope.js');
const catalog=require('../content/simulacros-catalog.json');
test('partial models obey confirmed chapter ranges and retain traceable original items',()=>{
 for(const stage of ['first','second']){
  const p=require('../api/_simulations/partial-'+stage+'.json');assert.ok(scope.validate(p,stage));assert.ok(!scope.validate(p,stage==='first'?'second':'first'));
  const originals=require('../api/_past_exams/2025-2026-'+(stage==='first'?1:2)+'.json');
  for(const q of p.questions.filter(q=>q.source_question_id)){
   const original=originals.questions.find(o=>o.id===q.source_question_id);assert.ok(original);
   if(q.adaptation){assert.ok(q.adaptation.length>10);continue;}
   assert.deepEqual(q.respuestas_aceptadas,original.respuestas_aceptadas);assert.equal(q.pregunta,original.pregunta);
   // Exact original question and options are checked without relying on a language-specific serializer hash.
   for(const l of ['a','b','c','d','e'])assert.equal(q['opcion_'+l],original['opcion_'+l]);
  }
  const copy=structuredClone(p);copy.questions[0].coverage.chapter=stage==='first'?12:11;assert.equal(scope.validate(copy,stage),false);
  const bio=structuredClone(p),b=bio.questions.find(q=>q.coverage.subject==='BIOLOGIA CELULAR');b.coverage.chapter=stage==='first'?7:6;assert.equal(scope.validate(bio,stage),false);
  const health=structuredClone(p),h=health.questions.find(q=>q.coverage.subject==='SALUD PUBLICA');h.coverage.chapter=stage==='first'?7:6;assert.equal(scope.validate(health,stage),false);
 }
 const p=require('../api/_simulations/partial-first.json');assert.match(p.questions[99].pregunta,/fundamentación teórica/);assert.match(p.questions[99].fuente,/60–62/);
});
test('numbered catalog preserves partials and cumulative finals with all scopes available',()=>{
 assert.deepEqual(catalog.entries.map(e=>e.title),Array.from({length:8},(_,i)=>'Simulacro '+(i+1)));
 assert.ok(catalog.entries.every(e=>e.demo||e.curatedId));assert.ok(!catalog.entries.some(e=>e.pastId));
 const s=fs.readFileSync('simulacro-library.js','utf8'),h=fs.readFileSync('campus.html','utf8');const config=h.slice(h.indexOf('id="sim-config"'),h.indexOf('id="sim-exam"'));
 assert.ok(!config.includes('sim-library-year')&&!config.includes('sim-real-count')&&!config.includes('data-sim-category'));
 assert.ok(config.includes('id="sim-library-scope"'));assert.ok(config.includes('value=""'));assert.ok(config.includes('value="first"')&&config.includes('value="final"'));assert.ok(!config.includes('sim-library-pages'));
});
async function call(token,access,id='partial-first'){
 const original=global.fetch;global.fetch=async()=>({ok:true,json:async()=>access});let body=[];const r=new Writable({write(x,e,done){body.push(x);done();}});r.headers={};r.setHeader=(k,v)=>r.headers[k]=v;r.status=n=>{r.code=n;return r;};const done=new Promise(resolve=>r.on('finish',resolve));
 try{await require('../api/simulation.js')({method:'GET',query:{id},headers:{authorization:token?'Bearer '+token:undefined}},r);await done;return {status:r.code,headers:r.headers,body:Buffer.concat(body).toString()};}finally{global.fetch=original;}
}
test('scoped full questions require active paid/admin access; raw source path is blocked',async()=>{
 assert.equal((await call()).status,401);assert.equal((await call('free',{ready:true,premium:false})).status,403);
 for(const id of ['partial-first','partial-second','final-3','final-4','final-5','final-6','final-8']){assert.equal((await call('free',{ready:true,premium:false},id)).status,403);const r=await call('paid',{ready:true,premium:true},id);assert.equal(r.status,200);assert.equal(r.headers['Cache-Control'],'private, no-store');assert.ok(scope.validate(JSON.parse(r.body),id.startsWith('final-')?'final':id.split('-')[1]));}
 assert.equal((await call('paid',{ready:true,premium:true},'../../config')).status,404);
 assert.ok(require('../vercel.json').rewrites.some(r=>r.source==='/api/_simulations/:path*'));
});
