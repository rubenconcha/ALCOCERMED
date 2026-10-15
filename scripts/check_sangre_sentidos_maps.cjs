const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const p=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:8771';
const source=fs.readFileSync(path.join(root,'script.js'),'utf8'),code=source.slice(source.indexOf('async function loadMapasMentales()'),source.indexOf('function updateIntocStats()',source.indexOf('async function loadMapasMentales()')));
const campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),viewer=campus.slice(campus.indexOf('<div id="mm-lightbox"'),campus.indexOf('<dialog id="mm-unlock-dialog"')),dialog=campus.slice(campus.indexOf('<dialog id="mm-unlock-dialog"'),campus.indexOf('</dialog>',campus.indexOf('<dialog id="mm-unlock-dialog"'))+9);
(async()=>{const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const errors=[];let requests=0,deny=false;
try{const page=await b.newPage();page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);page.on('request',r=>{
 if(r.url().includes('/qa-grid'))return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/mindmap-viewer.css"></head><body><main style="width:1100px;max-width:100%;margin:auto;padding:20px"><div id="mm-materia-dropdown"></div><span id="mm-materia-text"></span><button id="mm-materia-btn"></button><select id="mm-tema-select" style="max-width:100%"></select><input id="mm-search-input"><p id="mm-results-count"></p><div id="mm-grid" class="mm-grid"></div></main>${viewer}${dialog}<script>window.mmState={allMapas:[],filteredMapas:[],selectedMateria:null,selectedTema:null};window.campo=(m,k)=>m[k];window.setMmState=()=>{};window.updateIntocStats=()=>{};window.CampusAccess={isFree:()=>window.freeMode,unlock:()=>window.planVisits++};window.freeMode=true;window.planVisits=0;window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa-paid'}}})}});</script><script src="/mindmap-premium-catalog.js"></script><script>${code}</script><script src="/mindmap-branch-labels.js"></script><script src="/mindmap-content.js"></script><script src="/mindmap-detailed-content.js"></script><script src="/mindmap-premium.js"></script><script src="/mindmap-viewer.js"></script></body></html>`});
 if(r.url().includes('/api/mindmap?')){requests++;assert.equal(r.headers().authorization,'Bearer qa-paid');if(deny)return r.respond({status:403,body:''});const id=new URL(r.url()).searchParams.get('id');return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_mindmaps',id+'.json'),'utf8')});}
 const file=path.join(root,new URL(r.url()).pathname.slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:{'.js':'application/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'}[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});r.respond({status:404,body:''});
 });
 await page.goto(base+'/qa-grid');await page.evaluate(()=>loadMapasMentales());
 const maps=await page.evaluate(()=>mmState.allMapas.filter(m=>/^morfo_(16_organos_sentidos|18_sangre)(?:__\d+)?\.(png|json)$/.test(m.url_imagen.split('/').pop())));
 assert.equal(maps.length,14);await page.evaluate(()=>{freeMode=false;filterMapas()});
 fs.mkdirSync(path.join(root,'output/mapas-qa'),{recursive:true});
 for(const width of [1440,390]){
  await page.setViewport({width,height:1000});
  for(const map of maps){
   await page.evaluate(async map=>{closeMmLightbox();await openMmLightbox(map)},map);
   await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.mm-root-anatomy').decode()});
   await new Promise(r=>setTimeout(r,100));
   const view=await page.evaluate(()=>({title:document.querySelector('#mm-lb-title').textContent,open:document.querySelectorAll('.mm-concept-branch[aria-expanded="true"]').length,explanations:[...document.querySelectorAll('.mm-leaf-explanation')].filter(n=>n.offsetHeight>0).length,status:document.querySelector('#mm-lb-status').textContent,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.equal(view.open,1,JSON.stringify({map:map.titulo,width,view}));assert.ok(view.explanations>=1,JSON.stringify({map:map.titulo,width,view}));assert.equal(view.status,'');assert.equal(view.overflow,false,JSON.stringify({map:map.titulo,width,view}));
   await page.evaluate(()=>document.querySelector('.mm-concept-branch').click());assert.equal(await page.$$eval('.mm-concept-branch[aria-expanded="true"]',n=>n.length),0);
   await page.evaluate(()=>document.querySelector('.mm-concept-branch').click());assert.equal(await page.$$eval('.mm-concept-branch[aria-expanded="true"]',n=>n.length),1);
   if(!map.premium)await page.screenshot({path:path.join(root,'output/mapas-qa',map.url_imagen.split('/').pop().replace('.png','')+'-'+width+'.png')});
  }
 }
 await page.evaluate(()=>closeMmLightbox());assert.deepEqual(errors,[]);
 console.log('PASS: Sangre and Sentidos, 14 maps at desktop/mobile widths; opening, visible explanation, branch toggles and no page errors.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
