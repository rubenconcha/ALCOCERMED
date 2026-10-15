const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const p=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:8771';
const source=fs.readFileSync(path.join(root,'script.js'),'utf8'),code=source.slice(source.indexOf('async function loadMapasMentales()'),source.indexOf('function updateIntocStats()',source.indexOf('async function loadMapasMentales()')));
const campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),viewer=campus.slice(campus.indexOf('<div id="mm-lightbox"'),campus.indexOf('<dialog id="mm-unlock-dialog"')),dialog=campus.slice(campus.indexOf('<dialog id="mm-unlock-dialog"'),campus.indexOf('</dialog>',campus.indexOf('<dialog id="mm-unlock-dialog"'))+9);
(async()=>{const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const errors=[];let requests=0,deny=false;
try{const page=await b.newPage();page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);page.on('request',r=>{
 if(r.url().includes('/qa-grid'))return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/mindmap-viewer.css"><link rel="stylesheet" href="/study-depth.css"></head><body><main style="width:1100px;max-width:100%;box-sizing:border-box;margin:auto;padding:20px"><div id="mm-materia-dropdown"></div><span id="mm-materia-text"></span><button id="mm-materia-btn"></button><select id="mm-tema-select" style="max-width:100%"></select><input id="mm-search-input"><p id="mm-results-count"></p><div id="mm-grid" class="mm-grid"></div></main>${viewer}${dialog}<script>window.mmState={allMapas:[],filteredMapas:[],selectedMateria:null,selectedTema:null};window.campo=(m,k)=>m[k];window.setMmState=()=>{};window.updateIntocStats=()=>{};window.CampusAccess={isFree:()=>window.freeMode,unlock:()=>window.planVisits++};window.freeMode=true;window.planVisits=0;window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa-paid'}}})}});</script><script src="/mindmap-premium-catalog.js"></script><script>${code}</script><script src="/mindmap-branch-labels.js"></script><script src="/mindmap-content.js"></script><script src="/mindmap-detailed-content.js"></script><script src="/mindmap-premium.js"></script><script src="/mindmap-practice.js"></script><script src="/mindmap-viewer.js"></script></body></html>`});
 if(r.url().includes('/api/mindmap?')){requests++;assert.equal(r.headers().authorization,'Bearer qa-paid');if(deny)return r.respond({status:403,body:''});const params=new URL(r.url()).searchParams,id=params.get('id'),image=params.get('format')==='image';return r.respond({contentType:image?'image/webp':'application/json',body:fs.readFileSync(path.join(root,'api/_mindmaps',id+(image?'.webp':'.json')))});}
 const file=path.join(root,new URL(r.url()).pathname.slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:{'.js':'application/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'}[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});r.respond({status:404,body:''});
 });

 const id=process.argv[2]||'morfo_16_organos_sentidos__10';
 await page.goto(base+'/qa-grid');await page.evaluate(async()=>loadMapasMentales());
 await page.evaluate(id=>openMmLightbox(mmState.allMapas.find(m=>m.id===id)),id);
 assert.equal(requests,0);assert.equal(await page.$eval('#mm-unlock-dialog',n=>n.open),true);
 await page.evaluate(()=>{document.getElementById('mm-unlock-dialog').close();freeMode=false;});
 for(const width of [1440,390]){
  await page.setViewport({width,height:1000});await page.evaluate(id=>openMmLightbox(mmState.allMapas.find(m=>m.id===id)),id);
  assert.equal(await page.$$eval('.mm-concept-branch',n=>n.length),6);await page.click('#mm-visual-toggle');
  const before=await page.$eval('.mm-concept-branch',n=>n.getAttribute('aria-expanded'));await page.click('.mm-concept-branch');assert.notEqual(await page.$eval('.mm-concept-branch',n=>n.getAttribute('aria-expanded')),before);
  await page.click('#mm-visual-toggle');await page.waitForFunction(()=>document.querySelector('#mm-illustrated-image').naturalWidth===1536);
  const folder=path.join(root,'output/study-depth-qa',id,String(width));fs.mkdirSync(folder,{recursive:true});
  await page.screenshot({path:path.join(folder,'illustrated.png')});
  const session=await page.createCDPSession();await session.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:folder});
  await page.click('#mm-lb-download');const download=path.join(folder,id+'-Prepa-Ben-Carson.webp');
  for(let n=0;n<90&&!fs.existsSync(download);n++)await new Promise(r=>setTimeout(r,100));
  assert.deepEqual(fs.readFileSync(download),fs.readFileSync(path.join(root,'api/_mindmaps',id+'.webp')));await session.detach();
  await page.click('#mm-practice-toggle');assert.equal(await page.$$eval('.mm-practice-card',n=>n.length),10);
  await page.click('.mm-practice-card summary');assert.ok((await page.$eval('.mm-practice-card[open]',n=>n.innerText)).includes('Saladin'));
  for(let i=0;i<6;i++){
   await page.$eval('.mm-lb-stage',n=>n.scrollTop=0);
   await page.$eval('.mm-practice-question:nth-of-type('+(i+1)+') .mm-practice-option',n=>n.click());
  }
  assert.equal(await page.$$eval('.mm-practice-feedback p',n=>n.length),24);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.join(folder,'practice.png')});await page.evaluate(()=>closeMmLightbox());
 }
 assert.deepEqual(errors,[]);console.log('PASS: free lock, six interactive branches, full generative map and byte-identical download, ten cards and 24 per-option explanations at desktop/mobile widths.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
