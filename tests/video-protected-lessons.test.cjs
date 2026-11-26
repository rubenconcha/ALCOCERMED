const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {createHandler}=require('../server/ben-carson-50-50-playback.js');
const oldGuid='11111111-1111-4111-8111-111111111111',bioGuid='22222222-2222-4222-8222-222222222222',histologyGuid='33333333-3333-4333-8333-333333333333';
const env={VERCEL_ENV:'production',SUPABASE_ANON_KEY:'sb_publishable_test',ALCOCERMED_BC5050_BUNNY_VIDEO_GUID:oldGuid,ALCOCERMED_BC5050_BUNNY_EMBED_TOKEN_KEY:'unit-test-only'};
async function request({videoGuid,origin='https://www.alcocermed.com',bearer='Bearer a.b.c',allowed=true,authStatus=200,method='POST',customEnv=env}={}){
 const calls=[],result={headers:{}};
 const handler=createHandler({env:customEnv,now:()=>1800000000000,videoGuid,fetcher:async(url,options)=>{
  calls.push({url,options});return url.includes('/auth/')?{status:authStatus,ok:authStatus===200,json:async()=>({id:oldGuid})}:{status:200,ok:true,json:async()=>allowed};
 }});
 await handler({method,headers:{origin,authorization:bearer},query:{guid:'untrusted-client-guid'}},{setHeader(k,v){result.headers[k]=v;},status(n){result.status=n;return this;},json(body){result.body=body;return this;}});
 return{...result,calls};
}
test('each server-selected lesson signs only its own video after membership and device authorization',async()=>{
 for(const videoGuid of [undefined,bioGuid,histologyGuid]){
  const r=await request({videoGuid}),guid=videoGuid||oldGuid;
  assert.equal(r.status,200);assert.equal(r.calls.length,2);
  assert.ok(r.calls[1].url.endsWith('/rpc/campus_has_video_access'));assert.equal(r.calls[1].options.headers.Authorization,'Bearer a.b.c');
  const url=new URL(r.body.embedUrl);assert.equal(url.pathname,'/embed/817157/'+guid);
  assert.equal(r.body.expiresAt,1800000180);assert.equal(url.searchParams.get('token'),createHash('sha256').update('unit-test-only'+guid+'1800000180').digest('hex'));
  assert.match(r.headers['Cache-Control'],/private, no-store/);assert.equal(url.searchParams.get('autoplay'),'false');
 }
});
test('free users, invalid sessions, origins and unsupported methods receive no media URL',async()=>{
 for(const [options,status] of [[{allowed:false},403],[{bearer:''},401],[{authStatus:401},401],[{origin:'https://example.com'},403],[{method:'GET'},405],[{videoGuid:'not-a-guid'},503]]){
  const r=await request({...options,videoGuid:options.videoGuid||bioGuid});assert.equal(r.status,status);assert.ok(!r.body.embedUrl);
 }
});
test('preview access is restricted to the exact configured branch origin',async()=>{
 const customEnv={...env,VERCEL_ENV:'preview',ALCOCERMED_BC5050_PREVIEW_ORIGIN:'https://alcocermed-git-video-pichon4488-2410s-projects.vercel.app'};
 assert.equal((await request({customEnv,videoGuid:bioGuid,origin:customEnv.ALCOCERMED_BC5050_PREVIEW_ORIGIN})).status,200);
 assert.equal((await request({customEnv,videoGuid:bioGuid})).status,403);
});
test('the deployed API dispatches all protected lesson routes without exposing playback to signed-out requests',async t=>{
 const previousEnv=process.env.VERCEL_ENV;process.env.VERCEL_ENV='production';
 t.after(()=>{if(previousEnv===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=previousEnv;});
 const api=require('../api/flashcards.js');
 for(const route of ['bc5050_playback','bc_biologia_playback','bc_histologia_playback']){
  const result={headers:{}};
  const res={setHeader(k,v){result.headers[k]=v;},status(n){result.status=n;return this;},json(body){result.body=body;return this;}};
  await api({method:'POST',query:{[route]:'1'},headers:{origin:'https://www.alcocermed.com'}},res);
  assert.equal(result.status,401,route);assert.deepEqual(result.body,{error:'sign_in_required'});
 }
});
