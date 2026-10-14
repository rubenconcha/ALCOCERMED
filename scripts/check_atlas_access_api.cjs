const assert=require('node:assert/strict'),handler=require('../api/atlas');
const original=global.fetch;let access={ready:true,allowed:false},calls=0;
global.fetch=async(url,options)=>{calls++;assert.ok(url.endsWith('/rpc/campus_atlas_access'));assert.equal(JSON.parse(options.body).premium,undefined);return {ok:true,json:async()=>access}};
async function call(method,headers={}){const res={headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},end(){return this},json(body){this.body=body;return this},send(body){this.body=body;return this}};await handler({method,headers},res);return res;}
(async()=>{try{
 let r=await call('GET');assert.equal(r.code,302);assert.equal(r.headers.Location,'/campus?seccion=atlas');assert.equal(calls,0);
 r=await call('POST');assert.equal(r.code,401);
 r=await call('POST',{authorization:'Bearer unverified-premium-user'});assert.equal(r.code,403);assert.ok(r.headers['Set-Cookie'].includes('Max-Age=0'));
 r=await call('GET',{cookie:'alcocer_atlas_session=unverified-user'});assert.equal(r.code,302);assert.equal(r.body,undefined);
 access={ready:true,allowed:true};r=await call('POST',{authorization:'Bearer verified-course-student'});assert.equal(r.code,200);assert.equal(r.body.allowed,true);assert.ok(r.headers['Set-Cookie'].includes('HttpOnly; Secure; SameSite=Lax'));
 r=await call('GET',{cookie:'alcocer_atlas_session=verified-course-student'});assert.equal(r.code,200);assert.ok(r.body.includes('<base href="/">'));assert.ok(r.body.includes('musculos-interactivos.js'));assert.equal(r.headers['Cache-Control'],'private, no-store');
 access={ready:true,allowed:false};r=await call('GET',{cookie:'alcocer_atlas_session=verified-course-student'});assert.equal(r.code,302);
 global.fetch=async()=>{throw Error('offline')};r=await call('POST',{authorization:'Bearer student'});assert.equal(r.code,503);
 console.log('PASS: no HTML without verified course enrolment, secure cookie, revocation, and errors deny access');
 }finally{global.fetch=original}})().catch(e=>{console.error(e);process.exit(1)});
