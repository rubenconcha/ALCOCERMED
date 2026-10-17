const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const practice=require('../juegos/game-practice.js'),rounds=require('../juegos/game-rounds.js');
const {selectQuestions,topicIds}=require('../api/_game-practice/select.cjs');
const bank=require('../api/_game-practice/bank.json');
const sample={id:'11111111-1111-1111-1111-111111111111',codigo:'BC03P1',asignatura:'BIOLOGIA CELULAR',tema:'Membrana'};
const extra=selectQuestions(sample);assert(extra.length>=20&&extra.length<=30);assert(extra.every(q=>q.evaluacion_id===sample.id&&q.opciones.filter(o=>o.correct).length===1));
assert.deepEqual(topicIds({...sample,codigo:'SP10P2',asignatura:'EDUCACION PARA LA SALUD'}),['investigacion-cualitativa']);
assert.equal(selectQuestions({...sample,codigo:'DEMOBIO26'}).length,8);
assert.equal(selectQuestions({...sample,codigo:'unknown',titulo:'Sin relación',tema:'sin relación'}).length,0);
const a=selectQuestions({...sample,codigo:'SENTIDOS1',titulo:'Sentidos — Ronda 1: Receptores, dolor, gusto y olfato',asignatura:'MORFOFUNCION',tema:'Sentidos'});
const b=selectQuestions({...sample,codigo:'SENTIDOS2',titulo:'Sentidos — Ronda 2: Audición, equilibrio y visión',asignatura:'MORFOFUNCION',tema:'Sentidos'});
assert(a.length&&b.length);assert(!a.some(q=>b.some(r=>r.texto===q.texto)));
for(const topic of bank)for(const q of topic.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(practice.norm)).size,4);assert(q.answer>=0&&q.answer<4);}
const original=[{...extra[0],id:'original'}];assert.equal(practice.merge(original,extra).length,extra.length);assert.equal(practice.merge(original,extra)[0].id,'original');
const all=practice.merge(original,extra),r1=rounds.questions({},all,1),r2=rounds.questions({},all,2);assert.equal(r1.length+r2.length,all.length);assert(!r1.some(q=>r2.includes(q)));
const memory=new Map();global.sessionStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
const handler=require('../api/game-practice.js');
async function request(req){const res={code:0,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},end(body){this.body=body;return this}};await handler(req,res);return res;}
(async()=>{
 let calls=0;global.fetch=async(url,opts)=>{calls++;return {ok:true,status:200,json:async()=>url.includes('/rpc/')?true:[sample]}};
 assert.equal((await request({method:'GET',query:{id:sample.id},headers:{}})).code,401);assert.equal(calls,0);
 let res=await request({method:'GET',query:{id:sample.id},headers:{authorization:'Bearer fixture'}});assert.equal(res.code,200);assert.equal(JSON.parse(res.body).questions.length,extra.length);assert.equal(res.headers['Cache-Control'],'private, no-store');
 global.fetch=async()=>({ok:true,json:async()=>false});res=await request({method:'GET',query:{id:sample.id},headers:{authorization:'Bearer fixture'}});assert.equal(res.code,403);assert(!res.body);
 global.fetch=async()=>{throw Error('offline')};res=await request({method:'GET',query:{id:sample.id},headers:{authorization:'Bearer fixture'}});assert.equal(res.code,503);
 let apiCalls=0;global.fetch=async()=>{apiCalls++;return {ok:true,json:async()=>({questions:extra})}};const client={auth:{getSession:async()=>({data:{session:{access_token:'fixture'}}})}};
 const loaded=await practice.load(client,sample,original,'code',false);assert.equal(loaded.length,extra.length);global.fetch=async()=>{throw Error('reload offline')};assert.deepEqual(await practice.load(client,sample,original,'code',true),loaded);assert.equal(apiCalls,1);
 const source=fs.readFileSync('juegos/app.js','utf8'),start=source.indexOf('function normalizedGameSearch('),end=source.indexOf('function fetchGameCatalog(',start);const ctx={resolveEvaluationSubject:ev=>ev.asignatura};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);
 const ev={titulo:'Órganos de los sentidos',tema:'Audición y visión',asignatura:'MORFOFUNCION'};assert(ctx.matchesGameSearch(ev,'vision organos'));assert(ctx.matchesGameSearch(ev,'MORFOFUNCION'));assert(!ctx.matchesGameSearch(ev,'mitocondria'));assert(!ctx.matchesGameSearch(ev,'<script>'));
 console.log('OK: búsqueda por materia y sin tildes; 1.820 preguntas fuente, temas, deduplicación, rondas, permisos y restauración sin red.');
})().catch(e=>{console.error(e);process.exitCode=1});
