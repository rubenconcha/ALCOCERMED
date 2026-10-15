const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('script.js','utf8');
function setup(){
 const frames=[],nodes=new Map();
 function node(){const classes=new Set();return {innerText:'',style:{},parentElement:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,on)=>on?classes.add(x):classes.delete(x)},querySelectorAll:()=>[]};}
 const get=id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);};
 get('card').classList.add('flipped');
 const c={deck:[{pregunta:'Question',respuesta:'Private answer'}],currentIndex:0,currentUser:{id:'first-account'},campo:(r,k)=>r[k],window:{},actualizarProgreso(){},requestAnimationFrame:cb=>frames.push(cb),document:{getElementById:get,querySelector:()=>({}),createElement:node}};
 vm.runInNewContext(source.slice(source.indexOf('function renderCard()'),source.indexOf('const SRS_INTERVALS')),c);
 return {c,get,flush(){while(frames.length)frames.shift()();}};
}
test('a pending flip cannot read an emptied deck after account/session controls clear',()=>{
 const t=setup();t.c.renderCard();t.c.deck=[];t.c.currentUser={id:'second-account'};
 assert.doesNotThrow(()=>t.flush());assert.equal(t.get('a-text').innerText,'');
});
test('a pending flip cannot reveal a previous account answer even if the old deck object survives',()=>{
 const t=setup();t.c.renderCard();t.c.currentUser=null;t.flush();assert.equal(t.get('a-text').innerText,'');
});
test('the active card still renders normally when its owner and selection stay unchanged',()=>{
 const t=setup();t.c.renderCard();t.flush();assert.equal(t.get('a-text').innerText,'Private answer');
});
