const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const M=require('../admin-flashcard-topics.js'),tracking=require('../admin-section-tracking.js'),dates=require('../admin-topic-results.js');
const event=(id,resource,extra={})=>({id,user_id:'fixture-a',section:'flashcards',action:'reviewed',subject:'MORFOFUNCION',topic:'Tema A',resource_key:resource,created_at:'2026-10-21T03:30:00Z',...extra});
const rows=events=>tracking.records({activity:events});
test('repeated reviews are events, not new cards; duplicate event IDs count once',()=>{
 const a=event('1','c1'),m=M.build(rows([a,a,event('2','c1'),event('3','c2')]),'fixture-a');assert.equal(m.unique,2);assert.equal(m.reviews,3);assert.equal(m.duplicates,1);assert.equal(m.topicCount,1);
});
test('deck opens and menu visits are distinct from card evidence',()=>{
 const m=M.build(rows([event('1','menu',{action:'opened'}),event('2','deck',{action:'opened'}),event('3','deck',{action:'opened'}),event('4','unknown',{action:'opened'})]),'fixture-a');
 assert.equal(m.openings,2);assert.equal(m.visits,1);assert.equal(m.unique,0);assert.equal(m.reviews,0);assert.equal(m.unclassified,1);
});
test('subjects, aliases and topics remain explicit; no invented attribution',()=>{
 const m=M.build(rows([event('1','1',{subject:'SALUD PUBLICA'}),event('2','2',{subject:'educación para la salud'}),event('3','3',{subject:'BIOLOGIA CELULAR'}),event('4','4',{subject:'Biología desconocida'}),event('5','5',{subject:'',topic:''})]),'fixture-a');
 assert.equal(m.topics.length,4);assert.equal(m.topics.find(g=>g.subject==='Educación en Salud e Investigación').unique,2);assert.ok(m.topics.some(g=>g.subject==='Biología desconocida'));assert.ok(m.topics.some(g=>g.topic==='Sin tema registrado'));assert.equal(m.topicCount,3);
 assert.equal(rows([event('6','6',{subject:'Biología desconocida'})])[0].subject,'Biología desconocida');
});
test('missing card IDs do not invent a unique card; shared cards are deduplicated globally',()=>{
 const m=M.build(rows([event('1',''),event('2','c1'),event('3','c1',{topic:'Tema B'})]),'fixture-a');assert.equal(m.unique,1);assert.equal(m.reviews,3);assert.equal(m.topics.reduce((n,g)=>n+g.unique,0),2);assert.equal(m.topics.find(g=>g.topic==='Tema A').withoutId,1);
});
test('scope is a student UUID, never a name; no activity and no historical reconstruction',()=>{
 const m=M.build(tracking.records({activity:[event('1','c1'),event('2','c2',{user_id:'fixture-b'})],flashcards:[{user_id:'fixture-a',repasos_totales:500,ultima_sesion:'2026-10-21'}]}),'fixture-b');assert.equal(m.unique,1);assert.equal(m.reviews,1);assert.equal(M.build([],'fixture-a').topics.length,0);assert.equal(M.build(tracking.records({flashcards:[{user_id:'fixture-a',repasos_totales:500}]}),'fixture-a').unique,0);
});
test('date and subject/topic subsets supplied by existing view are preserved',()=>{
 const all=rows([event('1','1'),event('2','2',{created_at:'2026-10-21T04:00:00Z'}),event('3','3',{topic:'Tema B'})]);
 const filtered=all.filter(r=>dates.day(r.date)==='2026-10-20'&&r.source.topic==='Tema A');assert.equal(M.build(filtered,'fixture-a').unique,1);assert.equal(M.build(all,'fixture-a').unique,3);
});
test('latest activity uses real valid timestamps',()=>{
 const m=M.build(rows([event('1','1',{created_at:'invalid'}),event('2','2'),event('3','3',{created_at:'2026-10-22T02:00:00Z'})]),'fixture-a');assert.equal(m.topics[0].last,'2026-10-22T02:00:00Z');
});
test('new summary is read-only and is present in both existing student entry points',()=>{
 const source=fs.readFileSync('admin-flashcard-topics.js','utf8'),integration=fs.readFileSync('admin-section-tracking.js','utf8');assert.doesNotMatch(source,/getSupabase|\.insert\(|\.upsert\(|\.rpc\(|fetch\(/);assert.match(integration,/function detail\(s\)\{\s+if\(!currentAdmin\)return/);assert.equal((integration.match(/AdminFlashcardTopics\.render\(/g)||[]).length,2);assert.match(source,/no son porcentajes de avance/);assert.match(source,/Consultar detalle individual/);
});
