const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {selectQuestions,replacesQuestions}=require('../api/_game-practice/select.cjs');
const rounds=require('../juegos/game-rounds.js');
const practice=require('../juegos/game-practice.js');
const ev={id:'11111111-1111-1111-1111-111111111111',codigo:'T1MORF',asignatura:'MORFOFUNCION',titulo:'Tema 1 Morfofuncion - Anatomia y fisiologia',tema:'Tema 1: Temas principales de anatomia y fisiologia'};

test('Topic 1 uses exactly 20 concise sourced cards; all other published cards remain identical',()=>{
 const library=require('../api/_flashcards/library.json');
 const cards=library.cards.filter(c=>c.tema==='temas principales de anatomia y fisiologia'&&c.official_source==='morfo');
 assert.equal(cards.length,20);
 assert.equal(new Set(cards.map(c=>c.pregunta)).size,20);
 assert.ok(cards.every(c=>c.respuesta.split(/\s+/).length<=25&&c.page===c.pdf_page-28&&c.source_reviewed));
 assert.equal(library.catalog.find(c=>c.tema===cards[0].tema).count,20);
 const {execFileSync}=require('node:child_process');
 const before=JSON.parse(execFileSync('git',['show','HEAD:api/_flashcards/library.json'],{maxBuffer:20*1024*1024,encoding:'utf8'}));
 const remaining=data=>data.cards.filter(c=>!(c.tema===cards[0].tema&&c.official_source==='morfo'));
 assert.deepEqual(remaining(library),remaining(before));
});

test('The two native Topic 1 rounds have exactly 10 questions and never repeat each other',()=>{
 const all=selectQuestions(ev);assert.equal(all.length,20);assert.ok(replacesQuestions(ev));
 assert.equal(replacesQuestions({...ev,codigo:'DEMOMORFO26'}),false);
 assert.equal(replacesQuestions({...ev,codigo:'T2MORF'}),false);
 const a=rounds.questions(ev,all,1),b=rounds.questions(ev,all,2);
 assert.equal(a.length,10);assert.equal(b.length,10);
 assert.equal(new Set([...a,...b].map(q=>q.texto)).size,20);
 assert.ok(all.every(q=>q.temporizador===40&&q.puntos===1&&q.opciones.length===4&&q.opciones.filter(o=>o.correct).length===1));
});

test('Topic 1 curated game replaces legacy questions and restores the exact round after reload',async()=>{
 const oldFetch=global.fetch,oldStorage=global.sessionStorage,memory=new Map();
 try{
  global.sessionStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
  const questions=selectQuestions(ev),legacy=[{...questions[0],id:'legacy',texto:'Old question'}];
  global.fetch=async()=>({ok:true,json:async()=>({replace:true,questions})});
  const client={auth:{getSession:async()=>({data:{session:{access_token:'local-test'}}})}};
  assert.deepEqual(await practice.load(client,ev,legacy,'tema1-test',false),questions);
  global.fetch=async()=>{throw Error('offline')};
  assert.deepEqual(await practice.load(client,ev,legacy,'tema1-test',true),questions);
 }finally{global.fetch=oldFetch;global.sessionStorage=oldStorage;}
});

test('Intocables continues the protected sheet format with real illustration, map and complete practice',()=>{
 const id='morfo_01_anatomia_y_fisiologia__07',catalog=require('../content/mindmaps-premium-catalog.json');
 const entry=catalog.find(c=>c.id===id),sheet=require('../api/_mindmaps/'+id+'.json');
 assert.equal(entry.section,'intocables');assert.equal(entry.format,'illustrated-sheet');assert.equal(entry.curated,true);
 assert.equal(entry.acceso_gratis,false);assert.equal(sheet.sections.length,6);assert.equal(sheet.lecture_slide_count,41);
 assert.equal(sheet.assets.practice.flashcards.length,20);assert.equal(sheet.assets.practice.questions.length,20);
 assert.ok(fs.statSync('api/_mindmaps/'+id+'.webp').size>100000);
 assert.ok(fs.existsSync('.'+entry.preview));
 assert.ok(JSON.stringify(sheet.sections).includes('Frontal o coronal'));
 assert.ok(sheet.sections.flatMap(s=>s.groups.flatMap(g=>g.items)).every(i=>i.source&&i.source.pdfPage));
});
