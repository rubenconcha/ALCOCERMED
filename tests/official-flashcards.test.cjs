const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const ROOT=path.join(__dirname,'..');
const row={id:'morfo-01-001',materia:'MORFOFUNCION',tema:'anatomia',pregunta:'¿Qué estudia la anatomía?',respuesta:'La estructura del cuerpo.',chapter_title:'Temas principales',reference:'Saladin · Capítulo 1: Temas principales · pág. 1',official_source:'morfo',free_sample:true};
const library={schema:'official-flashcards-v1',version:'test',cards:[row,{...row,id:'morfo-01-002',free_sample:false}],catalog:[{materia:'MORFOFUNCION',tema:'anatomia',count:2,free_count:1},{materia:'MORFOFUNCION',tema:'hueso',count:10,free_count:0}]};

function frontend({status=200,changed=false,payload=library}={}){
 let sessions=0,calls=0;const events={};
 const c={AbortSignal,window:null,fetch:async()=>{calls++;return {ok:status===200,json:async()=>payload};},getSupabase:()=>({auth:{getSession:async()=>({data:{session:{access_token:changed&&++sessions>1?'other':'account'}}})}}),addEventListener:(name,cb)=>events[name]=cb};c.window=c;
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'official-flashcards.js'),'utf8'),c);
 return {c,events,calls:()=>calls};
}
test('official loader shares concurrent requests and does not mix in legacy cards',async()=>{
 const t=frontend();const [a,b]=await Promise.all([t.c.OfficialFlashcards.load(),t.c.OfficialFlashcards.load()]);
 assert.equal(t.calls(),1);assert.equal(a,b);assert.equal(a[0].id,row.id);assert.equal(t.c.OfficialFlashcards.catalog().length,2);
 await t.c.OfficialFlashcards.load();assert.equal(t.calls(),2,'membership is checked again on the next load');
});
test('errors, incomplete references and account changes fail closed',async()=>{
 await assert.rejects(frontend({status:403}).c.OfficialFlashcards.load(),/No pudimos/);
 await assert.rejects(frontend({changed:true}).c.OfficialFlashcards.load(),/sesión cambió/);
 await assert.rejects(frontend({payload:{...library,cards:[{...row,chapter_title:''}]}}).c.OfficialFlashcards.load(),/referencia incompleta/);
});
test('entitlement changes invalidate an in-flight load even when the token stays the same',async()=>{
 const t=frontend();let release;t.c.fetch=()=>new Promise(r=>release=r);
 const result=t.c.OfficialFlashcards.load();await new Promise(r=>setImmediate(r));
 t.events['campus-access-change']();release({ok:true,json:async()=>library});
 await assert.rejects(result,/sesión cambió/);assert.equal(t.c.OfficialFlashcards.catalog().length,0);
});
function server({premium=true,ready=true,status=200,token='valid'}={}){
 const response={headers:{},code:null,body:null,setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},end(){return this;},json(body){this.body=body;return this;}};
 const c={module:{exports:{}},process:{env:{}},AbortSignal,fetch:async url=>({ok:status===200,status,json:async()=>url.endsWith('campus_catalog')?[{materia:'MORFOFUNCION',tema:'anatomia',free_count:1}]:({premium,ready})}),require:name=>name==='node:fs'?{promises:{readFile:async()=>JSON.stringify(library)}}:name==='node:path'?path:name==='./_flashcards/config.json'?{anonKey:'public-test'}:null,__dirname:path.join(ROOT,'api')};
 vm.runInNewContext(fs.readFileSync(path.join(ROOT,'api/flashcards.js'),'utf8'),c);
 return {run:()=>c.module.exports({method:'GET',headers:{authorization:token?'Bearer '+token:''},query:{}},response),response};
}
test('paid catalogue requires a ready authenticated membership; free users receive only reviewed samples',async()=>{
 const unauth=server({token:''});await unauth.run();assert.equal(unauth.response.code,401);
 const denied=server({ready:false});await denied.run();assert.equal(denied.response.code,403);
 const unavailable=server({status:503});await unavailable.run();assert.equal(unavailable.response.code,503);
 const paid=server();await paid.run();assert.equal(paid.response.body.cards.length,2);assert.equal(paid.response.headers['Cache-Control'],'private, no-store');
 const free=server({premium:false});await free.run();assert.equal(free.response.body.cards.length,1);assert.equal(free.response.body.catalog[1].locked,true);
 assert.equal(free.response.body.cards[0].evidence,undefined);
});
test('main loader replaces database flashcards and never calls the old supplemental merge',async()=>{
 const source=fs.readFileSync(path.join(ROOT,'script.js'),'utf8');const begin=source.indexOf('async function loadFlashcards()'),end=source.indexOf('\nwindow.toggleMenu',begin);
 let called=0;const c={window:{},OfficialFlashcards:{load:async()=>{called++;return [row];}},flashcardsCache:null,getSupabase:()=>{throw Error('legacy database called');},StudyDepth:{merge:()=>{throw Error('legacy supplements called');}}};c.window.OfficialFlashcards=c.OfficialFlashcards;
 vm.runInNewContext(source.slice(begin,end),c);assert.equal((await c.loadFlashcards())[0],row);assert.equal(called,1);
});
test('authoring sources are behind a blocked route and UI does not render chapter ranges or duplicate page labels',()=>{
 const config=JSON.parse(fs.readFileSync(path.join(ROOT,'vercel.json'),'utf8'));assert.ok(config.rewrites.some(r=>r.source==='/api/_flashcards/:path*'));
 const ui=fs.readFileSync(path.join(ROOT,'flashcard-workspace.js'),'utf8');assert.ok(ui.includes("value(card,'reference')"));assert.ok(!ui.includes('Piensa tu respuesta'));
});
test('the final library covers all 68 topics with short answers, complete chapter names and source audit hashes',()=>{
 const directory=path.join(ROOT,'api','_flashcards');
 const raw=fs.readFileSync(path.join(directory,'library.json'));
 const data=JSON.parse(raw),audit=JSON.parse(fs.readFileSync(path.join(directory,'audit.json'),'utf8'));
 assert.equal(audit.verified_against_pdf,true);
 assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),audit.library_sha256);
 assert.equal(data.catalog.length,68);
 assert.equal(new Set(data.cards.map(c=>c.id)).size,data.cards.length);
 assert.equal(new Set(data.catalog.map(c=>c.materia+'|'+c.tema)).size,68,'topics shared by several source chapters appear once');
 for(const [source,expected] of [['morfo',29],['biologia',18],['salud',21]]){
  const rawSource=fs.readFileSync(path.join(directory,'sources',source+'.json'));
  const authored=JSON.parse(rawSource);const summary=audit.subjects.find(s=>s.source_sha256===crypto.createHash('sha256').update(rawSource).digest('hex'));
  assert.ok(summary,'source was changed after source-page verification: '+source);
  assert.equal(summary.topics,expected);
  const cards=data.cards.filter(c=>c.official_source===source);
  const originalFile={morfo:'flashcards_morfo_2026.json',biologia:'flashcards_oficiales_2026.json',salud:'flashcards_salud_investigacion_2026.json'}[source];
  const original=JSON.parse(fs.readFileSync(path.join(ROOT,'content',originalFile),'utf8'));
  assert.deepEqual([...new Set(cards.map(c=>c.tema))].sort(),[...new Set(original.groups.map(g=>g.tema))].sort(),'every original topic remains covered');
  assert.equal(cards.length,authored.chapters.reduce((sum,ch)=>sum+ch.cards.length,0));
  assert.ok(cards.every(c=>!Object.hasOwn(c,'free_sample')),'free access is decided by the existing server policy');
  assert.ok(cards.every(c=>c.respuesta.split(/\s+/).length<=25&&c.chapter_title&&c.reference.includes(c.chapter_title)&&c.page&&c.pdf_page));
  assert.ok(cards.every(c=>!c.reference.includes('página impresa')&&!c.reference.includes('rango del capítulo')));
 }
 for(const topic of data.catalog){assert.equal(topic.count,data.cards.filter(c=>c.materia===topic.materia&&c.tema===topic.tema).length);}
});

test('every selectable subtopic has several distinct cards and the published count matches its coverage audit',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(ROOT,'api/_flashcards/library.json'),'utf8'));
 const audit=JSON.parse(fs.readFileSync(path.join(ROOT,'api/_flashcards/audit.json'),'utf8'));
 const groups=new Map();
 for(const card of data.cards){const key=[card.materia,card.tema,card.subtema].join('|');groups.set(key,(groups.get(key)||0)+1);}
 assert.equal(audit.total_subtopics,groups.size);
 assert.equal(audit.minimum_cards_per_subtopic,Math.min(...groups.values()));
 for(const [key,count] of groups)assert.ok(count>=3,key+' contains only '+count+' cards');
 assert.ok(data.cards.filter(c=>c.official_source==='morfo').length>984);
 assert.ok(data.cards.filter(c=>c.official_source==='biologia').length>593);
 assert.ok(data.cards.filter(c=>c.official_source==='salud').length>451);
});
test('source-specific corrections survive rebuilding the three subjects',()=>{
 const data=JSON.parse(fs.readFileSync(path.join(ROOT,'api/_flashcards/library.json'),'utf8')).cards;
 const joints=data.find(c=>c.official_source==='morfo'&&/clases estructurales.*articulaciones/.test(c.pregunta));
 assert.ok(joints);assert.match(joints.respuesta,/óseas/i);assert.match(joints.pregunta,/cuatro/);
 const basal=data.find(c=>c.official_source==='morfo'&&c.pregunta==='¿Qué es el metabolismo basal?');
 assert.ok(basal);assert.doesNotMatch(basal.respuesta,/mínimo/i);assert.match(basal.respuesta,/despiert/i);
 const meninges=data.find(c=>c.official_source==='morfo'&&/orden.*meninges.*superficial/.test(c.pregunta));
 assert.ok(meninges);assert.match(meninges.respuesta,/Duramadre.*aracnoides.*piamadre/);assert.equal(meninges.page,481);
 const variance=data.find(c=>c.id==='salud-24-009');assert.equal(variance.page,98);assert.equal(variance.pdf_page,173);
 const chapare=data.find(c=>c.id==='salud-09-016');assert.doesNotMatch(chapare.pregunta,/familia viral/);
 const senescence=data.find(c=>c.id==='bio-14-029');assert.match(senescence.respuesta,/irreversible/);
});
