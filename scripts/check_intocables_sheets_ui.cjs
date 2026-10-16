const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),campus=fs.readFileSync(path.join(root,'campus.html'),'utf8');
const start=campus.indexOf('<section id="intocables-hub-screen"'),hub=campus.slice(start,campus.indexOf('</section>',start)+10);
const catalog=require('../content/mindmaps-premium-catalog.json'),sheets=catalog.filter(m=>m.curated);
(async()=>{const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];let privateRequests=0;page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
page.on('request',r=>{const url=new URL(r.url());
 if(url.pathname==='/qa-sheets')return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/intocables-sheets.css"></head><body>${hub}<script>
 window.freeMode=true;window.planVisits=0;window.openedSheet=null;
 window.CampusAccess={isFree:()=>freeMode,unlock:()=>planVisits++};
 window.ensureSupabaseSdk=async()=>{};window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:freeMode?'qa-free':'qa-paid'}}})},from:()=>({select:()=>({order:async()=>({data:window.cardFixtures,error:null})})})});
 window.openMmLightbox=async meta=>{window.openedSheet=meta};window.goBack=()=>{};window.openMindMaps=()=>{};
 </script><script src="/mindmap-premium-catalog.js"></script><script src="/intocables-hub.js"></script></body></html>`});
 if(url.pathname==='/api/mindmap'){privateRequests++;assert.equal(r.headers().authorization,'Bearer qa-paid');const id=url.searchParams.get('id');assert.ok(sheets.some(m=>m.id===id));return r.respond({contentType:'image/webp',body:fs.readFileSync(path.join(root,'api/_mindmaps',id+'.webp'))});}
 const file=path.join(root,decodeURIComponent(url.pathname).slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:{'.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf'}[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});return r.respond({status:404,body:''});
});
for(const width of [1440,390]){
 await page.setViewport({width,height:1000});await page.goto('http://127.0.0.1:8771/qa-sheets');
 await page.evaluate(async()=>{document.getElementById('intocables-hub-screen').classList.remove('hidden');await IntocablesHub.open()});
 assert.equal(await page.$$eval('.itc-sheet-card',a=>a.length),sheets.length);assert.equal(await page.$$eval('.itc-sheet-card.is-locked',a=>a.length),sheets.length);assert.equal(privateRequests,0);
 await page.$eval('.itc-sheet-card',n=>n.click());assert.equal(await page.evaluate(()=>planVisits),1);assert.equal(await page.evaluate(()=>openedSheet),null);
 await page.evaluate(()=>{freeMode=false;window.dispatchEvent(new Event('campus-access-change'))});
 await page.waitForFunction(()=>document.querySelector('.itc-sheet-cover img[data-sheet-id]')?.naturalWidth===1536);
 await page.waitForFunction(()=>document.querySelectorAll('.itc-sheet-card.is-locked').length===0);
 const coverIds=await page.$$eval('.itc-sheet-cover',a=>a.map(n=>n.dataset.coverId));assert.deepEqual(coverIds,sheets.map(m=>m.id));
 await page.$eval('.itc-sheet-card',n=>n.click());assert.equal(await page.evaluate(()=>openedSheet.section),'intocables');assert.equal(await page.evaluate(()=>openedSheet.id),sheets[0].id);
 await page.select('#itc-topic','Órganos de los sentidos');
 assert.ok((await page.$$eval('.itc-sheet-card',a=>a.length))>0);assert.ok((await page.$$eval('.itc-sheet-card',a=>a.every(n=>n.textContent.includes('Órganos de los sentidos')))));
 await page.select('#itc-topic','');await page.$eval('#itc-search',n=>{n.value='eritropoyesis';n.dispatchEvent(new Event('input'))});assert.equal(await page.$$eval('.itc-sheet-card',a=>a.length),1);
 await page.$eval('#itc-search',n=>{n.value='';n.dispatchEvent(new Event('input'))});
 const fixture=JSON.parse(fs.readFileSync(path.join(root,'content/intocables_catalogo_2026.json'),'utf8')).map(n=>({...n,clave:'Idea central',explicacion:'Explicación de prueba',error_comun:'Confusión',pregunta:'Pregunta',respuesta:'Respuesta',fuente:'Fuente de prueba'}));await page.evaluate(data=>{window.cardFixtures=data},fixture);
 await page.click('[data-format="cards"]');await page.waitForFunction(()=>document.querySelectorAll('.itc-card:not(.itc-sheet-card)').length===18);await page.$eval('.itc-card',n=>n.click());assert.equal(await page.$eval('#itc-dialog',n=>n.open),true);await page.click('#itc-reveal');assert.equal(await page.$eval('#itc-answer',n=>n.hidden),false);
 await page.evaluate(()=>{freeMode=true;window.dispatchEvent(new Event('campus-access-change'))});assert.equal(await page.$eval('#itc-dialog',n=>n.open),false);assert.equal(await page.$eval('#itc-explain',n=>n.textContent),'');
 await page.click('[data-format="sheets"]');await page.waitForFunction(()=>document.querySelectorAll('.itc-sheet-card').length===14);assert.equal(await page.$$eval('img[data-sheet-id][src]',a=>a.length),0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.evaluate(()=>{freeMode=false;window.dispatchEvent(new Event('campus-access-change'))});await page.waitForFunction(()=>document.querySelector('.itc-sheet-cover img[data-sheet-id]')?.naturalWidth===1536);
 await page.waitForFunction(()=>document.querySelectorAll('.itc-sheet-card.is-locked').length===0);
 await page.$eval('#itc-formats',n=>n.scrollIntoView({block:'start'}));const dir=path.join(root,'output/study-depth-qa/intocables-sheets');fs.mkdirSync(dir,{recursive:true});await page.screenshot({path:path.join(dir,width+'.png')});
 await page.evaluate(()=>document.getElementById('intocables-hub-screen').classList.add('hidden'));await page.waitForFunction(()=>document.querySelectorAll('img[data-sheet-id][src]').length===0);
 privateRequests=0;
}
assert.deepEqual(errors,[]);console.log('PASS: actual Intocables hub at 1440/390; 14 protected sheets, exact private covers, filters/search, opening route, 18 essential cards, answer reveal, session cleanup, no overflow/errors.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
