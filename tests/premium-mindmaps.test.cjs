const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {Writable}=require('node:stream');
const catalog=require('../content/mindmaps-premium-catalog.json');
const script=fs.readFileSync('script.js','utf8');
const handler=require('../api/mindmap.js');

test('all 79 general maps are free and every topic has six separately locked maps',async()=>{
 const start=script.indexOf('async function loadMapasMentales()'),end=script.indexOf('function populateMmMaterias()',start);
 const ctx={mmState:{},MINDMAP_PREMIUM_CATALOG:catalog,setMmState(){},populateMmMaterias(){},populateMmTemas(){},updateIntocStats(){},filterMapas(){},console};ctx.window=ctx;
 vm.runInNewContext(script.slice(start,end),ctx);await ctx.loadMapasMentales();
 assert.equal(ctx.mmState.allMapas.length,553);
 const general=ctx.mmState.allMapas.filter(m=>!m.premium);assert.equal(general.length,79);assert.ok(general.every(m=>m.acceso_gratis));
 for(const m of general){const key=m.url_imagen.split('/').pop(),details=catalog.filter(d=>d.parent_key===key);assert.equal(details.length,6,key);assert.ok(details.every(d=>d.premium&&!d.acceso_gratis));}
 const topicStart=script.indexOf('function mmTopicKey('),topicEnd=script.indexOf('function populateMmTemas',topicStart);
 ctx.campo=(m,k)=>m[k];vm.runInNewContext(script.slice(topicStart,topicEnd),ctx);
 assert.equal(ctx.mmTopicKey(general[0]),ctx.mmTopicKey(catalog[0]));
});

async function call({id=catalog[0].id,format='json',token,method='GET',access,status=200,fail=false}){
 const original=global.fetch;let calls=0;
 global.fetch=async(url,options)=>{calls++;assert.match(url,/\/rpc\/campus_access$/);assert.equal(options.headers.Authorization,'Bearer '+token);if(fail)throw new Error('unavailable');return{ok:status===200,status,json:async()=>access};};
 const chunks=[];const response=new Writable({write(chunk,enc,done){chunks.push(chunk);done();}});
 response.statusCode=200;response.headers={};response.setHeader=(k,v)=>response.headers[k]=v;response.status=n=>{response.statusCode=n;return response;};
 const ended=new Promise(resolve=>response.on('finish',resolve));
 try{await handler({method,query:{id,format},headers:{authorization:token?'Bearer '+token:undefined}},response);await ended;return{code:response.statusCode,headers:response.headers,body:Buffer.concat(chunks),calls};}finally{global.fetch=original;}
}
test('no token, expired session, or free subscription cannot obtain premium explanations or downloads',async()=>{
 const missing=await call({});assert.equal(missing.code,401);assert.equal(missing.calls,0);assert.equal(missing.body.length,0);
 const expired=await call({token:'expired',status:401});assert.equal(expired.code,401);assert.equal(expired.body.length,0);
 for(const format of ['json','image']){const free=await call({token:'free',format,access:{ready:true,premium:false}});assert.equal(free.code,403);assert.equal(free.body.length,0);}
 const unavailable=await call({token:'paid',fail:true});assert.equal(unavailable.code,503);assert.equal(unavailable.body.length,0);
});
test('an active subscription receives the correct private map and complete image',async()=>{
 for(const format of ['json','image']){
  const result=await call({token:'paid',format,access:{ready:true,premium:true}});assert.equal(result.code,200);assert.equal(result.headers['Cache-Control'],'private, no-store');
  const ext=format==='image'?'webp':'json';assert.deepEqual(result.body,fs.readFileSync('api/_mindmaps/'+catalog[0].id+'.'+ext));
 }
});
test('unknown IDs, path traversal and invalid formats fail before authentication; raw files have a blocked route',async()=>{
 for(const args of [{id:'../../config'},{id:'invalid'},{format:'pdf'}]){const result=await call(args);assert.equal(result.code,404);assert.equal(result.calls,0);}
 assert.equal((await call({method:'POST'})).code,405);
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.ok(config.rewrites.some(r=>r.source==='/api/_mindmaps/:path*'&&r.destination==='/api/mindmap?id=invalid'));
 assert.ok(!fs.existsSync('content/mindmaps-premium-editorial.json'));
});

test('every detailed map has distinct concepts, expanded prose and recorded source references',()=>{
 for(const map of catalog){const data=JSON.parse(fs.readFileSync('api/_mindmaps/'+map.id+'.json','utf8'));assert.equal(data.id,map.id);assert.ok(data.sections.length>=3&&data.sections.length<=6,map.id);
  const items=data.sections.flatMap(s=>s.groups.flatMap(g=>g.items));assert.ok(items.length>=5,map.id);assert.ok(items.some(i=>i.text.length>=150&&i.source),map.id);
  for(const item of items){assert.ok(item.title&&item.text);assert.ok(!item.text.includes('\ufffd'));}
  assert.ok(fs.existsSync(data.assets.image.slice(1)),map.id);
 }
});
