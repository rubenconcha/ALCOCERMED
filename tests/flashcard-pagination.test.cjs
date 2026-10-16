const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('the official loader accepts an entire catalogue beyond the legacy database limits',async()=>{
 const source=fs.readFileSync('script.js','utf8'),start=source.indexOf('async function loadFlashcards()'),end=source.indexOf('\nwindow.toggleMenu',start);
 const rows=Array.from({length:6201},(_,i)=>({id:'official-'+i}));
 const official={load:async()=>rows},context={window:{OfficialFlashcards:official},OfficialFlashcards:official,flashcardsCache:null};
 vm.runInNewContext(source.slice(start,end),context);
 const data=await context.loadFlashcards();assert.equal(data.length,6201);assert.equal(data[6200].id,'official-6200');
});
