const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),scope=require('../simulation-scope.js');
const catalog={entries:require('../content/simulacros-catalog.json').entries.filter(e=>e.kind!=='mini')};
const demo=require('../content/simulacros_demo_2026.json');
const archives=new Map();
for(const f of fs.readdirSync('api/_past_exams').filter(f=>f.endsWith('.json'))){const p=JSON.parse(fs.readFileSync('api/_past_exams/'+f,'utf8'));for(const q of p.questions||[])archives.set(q.id,q);}
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
test('all fourteen served simulations have exactly 50/30/20, valid topics and unambiguous answer options',()=>{
 assert.equal(catalog.entries.length,14);
 for(const e of catalog.entries){
  const p=e.demo?{id:'demo-full',scope:'final',duration:100,questions:demo.full}:require('../api/_simulations/'+e.curatedId+'.json');
  assert.ok(scope.validate(p,e.scope),e.title);
  assert.equal(p.questions.length,100);
  assert.deepEqual(Object.fromEntries(['MORFOFUNCION','BIOLOGIA CELULAR','SALUD PUBLICA'].map(s=>[s,p.questions.filter(q=>q.materia===s).length])),{MORFOFUNCION:50,'BIOLOGIA CELULAR':30,'SALUD PUBLICA':20});
  for(const q of p.questions){
   assert.ok(q.fuente&&q.pregunta);assert.equal(q.respuestas_aceptadas.length,1);
   const answers=['a','b','c','d','e'].filter(l=>q['opcion_'+l]).map(l=>q['opcion_'+l].toLowerCase().trim().replace(/\s+/g,' '));assert.equal(new Set(answers).size,answers.length);
   if(q.source_question_id){const original=archives.get(q.source_question_id);assert.ok(original,q.source_question_id);assert.ok(q.source_sha256);if(!q.adaptation){assert.equal(q.pregunta,original.pregunta);assert.deepEqual(q.respuestas_aceptadas,original.respuestas_aceptadas);for(const l of 'abcde')assert.equal(q['opcion_'+l],original['opcion_'+l]);}}
  }
  const mutated=structuredClone(p);mutated.questions[0].coverage.subject='SALUD PUBLICA';assert.equal(scope.validate(mutated,e.scope),false,'mislabelled subject must fail');
  const duplicate=structuredClone(p);duplicate.questions[1].pregunta=duplicate.questions[0].pregunta;assert.equal(scope.validate(duplicate,e.scope),false);
  const badKey=structuredClone(p);badKey.questions[0].respuestas_aceptadas=['A','B'];assert.equal(scope.validate(badKey,e.scope),false);
 }
});
test('health scope follows last-year partials and originals remain archival references',()=>{
 const first=require('../api/_simulations/partial-first.json'),second=require('../api/_simulations/partial-second.json');
 const health=p=>p.questions.filter(q=>q.materia==='SALUD PUBLICA');
 assert.equal(health(first).length,20);assert.equal(health(second).length,20);
 const seen=new Set();for(const n of [3,4,5,6,8]){const p=require('../api/_simulations/final-'+n+'.json');for(const q of health(p)){assert.ok(q.source_question_id.startsWith('2025-2026-3-'));assert.ok(q.coverage.chapter>=14);assert.ok(!seen.has(normalize(q.pregunta)));seen.add(normalize(q.pregunta));}}
 const report=require('../quality/simulation-composition-audit.json');assert.equal(report.archival_files_unchanged,true);
 assert.equal(report.models.length,14);assert.ok(report.fixed.some(t=>t.includes('50/50/0')));
});
test('catalog cards contain only stage, title, metrics and start control',()=>{
 const js=fs.readFileSync('simulacro-library.js','utf8');assert.ok(!js.includes('sim-library-description'));assert.ok(!js.includes('sim-library-access'));assert.ok(js.includes('card.append(tag,title,metrics,button)'));
 const entry=fs.readFileSync('simulacro-ingreso.js','utf8');assert.ok(entry.includes("curatedId: 'final-8'"));assert.ok(!entry.includes('fetchAllBancoQuestions()'));
});

test('expansion adds six materially different models across all three stages',()=>{
 const added=catalog.entries.slice(8),prior=new Set(),fresh=new Set();
 assert.deepEqual(['first','second','final'].map(s=>added.filter(e=>e.scope===s).length),[2,2,2]);
 for(const e of catalog.entries.slice(0,8)){
  const rows=e.demo?demo.full:require('../api/_simulations/'+e.curatedId+'.json').questions;
  for(const q of rows)prior.add(normalize(q.pregunta));
 }
 for(const e of added){
  const rows=require('../api/_simulations/'+e.curatedId+'.json').questions;
  for(const q of rows)fresh.add(normalize(q.pregunta));
  assert.ok(rows.filter(q=>!prior.has(normalize(q.pregunta))).length>=40,e.title+' must add content beyond existing models');
  if(e.scope==='final')for(const sub of ['MORFOFUNCION','BIOLOGIA CELULAR']){
   const chapters=rows.filter(q=>q.materia===sub).map(q=>q.coverage.chapter);
   assert.ok(chapters.some(n=>n<=(sub==='MORFOFUNCION'?11:6)));
   assert.ok(chapters.some(n=>n>(sub==='MORFOFUNCION'?20:12)),'final-only topics must be represented');
  }
 }
 assert.ok([...fresh].filter(s=>!prior.has(s)).length>=400,'adding shuffled clones is not an expansion');
 const report=require('../quality/simulation-composition-audit.json').expansion;
 assert.equal(report.distinct_added_stems,fresh.size);
 assert.equal(report.stems_not_in_previous_models,[...fresh].filter(s=>!prior.has(s)).length);
});
