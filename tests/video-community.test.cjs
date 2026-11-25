const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const model=require('../video-community.js');
const tick=()=>new Promise(r=>setImmediate(r));

test('playback coverage does not count seeks, replays, malformed timings or a reaction as watched time',()=>{
 const t=model.coverageTracker();
 assert.equal(t.percent(),0);
 t.observe(0,100);t.observe(1,100);t.observe(2,100);assert.equal(t.percent(),2);
 t.observe(99,100);t.observe(100,100);assert.equal(t.percent(),3);
 t.observe(0,100);t.observe(1,100);t.observe(2,100);assert.equal(t.percent(),3);
 t.observe(Infinity,100);t.observe(500,100);t.observe(2,0);assert.equal(t.percent(),3);
 const full=model.coverageTracker();for(let i=0;i<=100;i++)full.observe(i,100);assert.equal(full.percent(),100);
});
test('only exact Bunny player origin and source can report events',()=>{
 const frame={contentWindow:{}},url='https://player.mediadelivery.net/embed/123/test?token=ephemeral';
 const event={origin:'https://player.mediadelivery.net',source:frame.contentWindow,data:JSON.stringify({context:'player.js',event:'ended'})};
 assert.equal(model.playerMessage(event,frame,url).event,'ended');
 assert.equal(model.playerMessage({...event,source:{}},frame,url),null);
 assert.equal(model.playerMessage({...event,origin:'https://evil.example'},frame,url),null);
 assert.equal(model.playerMessage({...event,data:'malformed'},frame,url),null);
 assert.equal(model.playerMessage(event,frame,'https://evil.example/embed'),null);
});

class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.attrs={};this.value='';this.hidden=false;this.disabled=false;this.textContent='';}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(){}
}
function harness(){
 let current=true,summary={counts:{love:2},mine:null},commentError=false,delaySummary=null;
 const calls=[],listeners={},host=new Element('div');
 const comments=[{id:'comment-a',user_id:'other',author_name:'<img src=x onerror=evil()>',body:'<script>evil()</script>',created_at:'2026-11-24T20:00:00Z'}];
 const sb={rpc:async(name,args)=>{calls.push({name,args});if(name==='campus_video_reaction_summary'){if(delaySummary)return delaySummary;return {data:summary};}return {};},from(table){
  const state={table,filters:[]};
  const q={select(){return q;},eq(k,v){state.filters.push([k,v]);return q;},order(){return q;},range:async()=>({data:comments}),
   upsert:async(row)=>{calls.push({table,op:'upsert',row});summary={counts:{love:3},mine:row.reaction};return {};},
   insert:async(row)=>{calls.push({table,op:'insert',row});return {error:commentError?{message:'offline'}:null};},
   delete(){state.op='delete';return q;},then(resolve){calls.push(state);resolve({});}};return q;
 }};
 const win={addEventListener:(name,fn)=>listeners[name]=fn};
 const context={window:win,document:{createElement:t=>new Element(t),getElementById:()=>null},AbortController,URL,console};
 vm.runInNewContext(fs.readFileSync('video-community.js','utf8'),context);
 function find(node,cls){if(node.className===cls)return node;return node.children.map(c=>find(c,cls)).find(Boolean);}
 win.VideoCommunity.mount({host,sb,user:{id:'owner'},videoId:'ben-carson-5050',isCurrent:()=>current,frame:null,playerUrl:''});
 return {win,calls,host,find,current:v=>current=v,commentError:v=>commentError=v,delaySummary:v=>delaySummary=v};
}
test('reactions persist the authenticated account and never mark completion; comments render as text',async()=>{
 const h=harness();await tick();
 const panel=h.host.children[0],row=h.find(panel,'vc-reactions');
 assert.equal(row.children.length,4);assert.equal(row.children[1].attrs['aria-pressed'],'false');
 await row.children[1].onclick();
 assert.equal(h.calls.find(c=>c.op==='upsert').row.user_id,'owner');
 assert.equal(h.find(panel,'vc-reactions').children[1].attrs['aria-pressed'],'true');
 assert.deepEqual(h.calls.filter(c=>c.name==='campus_record_video_activity').map(c=>c.args.p_progress),[0]);
 const comment=h.find(panel,'vc-comment');assert.equal(comment.children[0].textContent,'<img src=x onerror=evil()>');
 assert.equal(comment.children[2].textContent,'<script>evil()</script>');assert.equal(comment.children.length,3);
});
test('failed comment keeps the draft and supports retry; account change cannot publish',async()=>{
 const h=harness();await tick();const panel=h.host.children[0],form=h.find(panel,'vc-comment-form'),input=form.children[1];
 input.value='Mi pregunta';h.commentError(true);await form.onsubmit({preventDefault(){}});assert.equal(input.value,'Mi pregunta');
 h.commentError(false);await form.onsubmit({preventDefault(){}});assert.equal(input.value,'');
 const payload=h.calls.find(c=>c.op==='insert').row;assert.deepEqual(Object.keys(payload).sort(),['body','user_id','video_id']);
 h.current(false);input.value='No publicar';const before=h.calls.length;await form.onsubmit({preventDefault(){}});assert.equal(h.calls.length,before);
 h.win.VideoCommunity.close();assert.equal(h.host.children.length,0);
});
test('late summary cannot update a closed video or another account',async()=>{
 const h=harness();await tick();const panel=h.host.children[0];let resolve;
 h.delaySummary(new Promise(r=>resolve=r));const pending=h.find(panel,'vc-reactions').children[1].onclick();await tick();
 h.current(false);h.win.VideoCommunity.close();resolve({data:{counts:{love:900},mine:'love'}});await pending;assert.equal(h.host.children.length,0);
});
test('student and teacher entry points mount participation and clear it on logout; opening no longer marks 100%',()=>{
 const script=fs.readFileSync('script.js','utf8');const block=script.slice(script.indexOf('window.openVcModal'),script.indexOf('function setVcState'));
 assert.match(block,/community.mount\(/);assert.match(block,/VideoCommunity\?\.close/);
 assert.doesNotMatch(block,/registrarVideoVistoEnNube|asumimos 100%/);
 const admin=fs.readFileSync('admin.js','utf8');assert.match(admin,/community.mountAdmin/);assert.match(admin,/VideoCommunity\?\.clearAdmin/);
});
