/* Use the approved native viewer for every premium preview and complete download. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const p=require(process.env.MINDMAP_PUPPETEER||'C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),base=process.env.MINDMAP_BASE_URL||'http://127.0.0.1:8771';
const all=JSON.parse(fs.readFileSync(path.join(root,'content/mindmaps-premium-catalog.json'),'utf8'));
const selected=(process.env.MINDMAP_KEYS||'').split(',').filter(Boolean),catalog=selected.length?all.filter(x=>selected.includes(x.id)):all;
const campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),markup=campus.slice(campus.indexOf('<div id="mm-lightbox"'),campus.indexOf('<dialog id="mm-unlock-dialog"'));
const css=fs.readFileSync(path.join(root,'mindmap-viewer.css'),'utf8'),out=path.join(root,'assets/mindmaps/premium-previews');fs.mkdirSync(out,{recursive:true});
fs.mkdirSync(path.join(root,'output/mapas-qa'),{recursive:true});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function localResponse(r){const file=path.join(root,decodeURIComponent(new URL(r.url()).pathname).replace(/^\//,''));if(fs.existsSync(file)&&fs.statSync(file).isFile()){const ext=path.extname(file),type={'.js':'application/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf','.html':'text/html'}[ext]||'application/octet-stream';return r.respond({contentType:type,body:fs.readFileSync(file)});}return r.continue();}
(async()=>{const browser=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});const checks=[],errors=[];
try{
 const page=await browser.newPage(),exportPage=await browser.newPage();page.setDefaultTimeout(20000);page.on('requestfailed',r=>console.log('Request failed',r.url()));console.log('Initializing premium viewer');page.on('pageerror',e=>errors.push(e.message));
 await page.setRequestInterception(true);page.on('request',r=>{
  if(r.url().includes('/qa-premium'))return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><link rel="stylesheet" href="/mindmap-viewer.css"></head><body>${markup}<script>window.CampusAccess={isFree:()=>false};window.openMmUnlockDialog=()=>window.lockOpened=true;window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa-paid'}}})}});</script><script src="/mindmap-branch-labels.js"></script><script src="/mindmap-content.js"></script><script src="/mindmap-detailed-content.js"></script><script src="/mindmap-premium.js"></script><script src="/mindmap-viewer.js"></script></body></html>`});
  if(r.url().includes('/api/mindmap?')){assert.equal(r.headers().authorization,'Bearer qa-paid');const id=new URL(r.url()).searchParams.get('id');return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_mindmaps',id+'.json'),'utf8')});}
  localResponse(r);
 });
 await exportPage.setRequestInterception(true);exportPage.on('request',localResponse);
 await page.setViewport({width:1440,height:1000});await page.goto(base+'/qa-premium');console.log('Viewer loaded');await page.evaluate(()=>document.fonts.ready);console.log('Fonts loaded');
 await exportPage.setViewport({width:2280,height:1400,deviceScaleFactor:1.5});await exportPage.goto(base+'/tmp/mapas-export-shell.html');console.log('Export ready');
 async function click(selector){await page.evaluate(selector=>{const n=document.querySelector(selector),stage=document.querySelector('.mm-lb-stage'),r=n.getBoundingClientRect(),s=stage.getBoundingClientRect();if(r.top<s.top)stage.scrollTop+=r.top-s.top-15;if(r.bottom>s.bottom)stage.scrollTop+=r.bottom-s.bottom+15},selector);await delay(45);const b=await page.$eval(selector,n=>{const r=n.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}});await page.mouse.click(b.x,b.y);await delay(45);}
 for(const map of catalog){
  const payload=JSON.parse(fs.readFileSync(path.join(root,'api/_mindmaps',map.id+'.json'),'utf8'));
  await page.bringToFront();await page.setViewport({width:1440,height:1000});await page.evaluate(async map=>{closeMmLightbox();await openMmLightbox(map)},map);await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.mm-root-anatomy').decode()});await delay(35);
  assert.equal(await page.$$eval('.mm-concept-branch',n=>n.filter(x=>x.getAttribute('aria-expanded')==='true').length),0,map.id);
  assert.equal(await page.$$eval('.mm-concept-branch',n=>n.length),payload.sections.length);
  assert.deepEqual(await page.$$eval('.mm-concept-root>*',n=>n.map(x=>x.tagName)),['STRONG','IMG']);
  const clip=await page.$eval('#mm-tree',n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}});await page.screenshot({path:path.join(out,map.id+'.webp'),type:'webp',quality:80,clip,captureBeyondViewport:true});
  await click('.mm-concept-branch');assert.equal(await page.$eval('#mm-detail-0-0',n=>n.hidden),true);await click('#mm-children-0 .mm-detail-heading');assert.equal(await page.$eval('#mm-detail-0-0 .mm-leaf-explanation',n=>n.hidden),true);await click('#mm-detail-0-0 .mm-concept-leaf');assert.equal(await page.$eval('#mm-detail-0-0 .mm-leaf-explanation',n=>n.hidden),false);
  await page.setViewport({width:390,height:844});await delay(25);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,map.id);
  await page.evaluate(()=>{document.querySelector('#mm-branch-all').click();document.querySelectorAll('.mm-detail-heading').forEach(n=>{if(n.getAttribute('aria-expanded')!=='true')n.click()});document.querySelectorAll('.mm-detail-nodes>.mm-concept-leaf').forEach(n=>{if(n.getAttribute('aria-expanded')!=='true')n.click()})});
  const count=await page.$$eval('.mm-detail-nodes>.mm-concept-leaf',n=>n.length);assert.ok(count>=5,map.id);
  await page.setViewport({width:2300,height:1400});await page.evaluate(()=>{document.querySelector('#mm-tree').style.width='2200px';document.querySelector('#mm-tree').style.transform='none'});await delay(80);
  const tree=await page.$eval('#mm-tree',n=>n.outerHTML);
  await exportPage.bringToFront();await exportPage.setContent(`<!doctype html><html><head><meta charset="utf-8"><base href="${base}/"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><style>${css}body{margin:0;background:#f5f8fb}.mm-lightbox{position:static;height:auto;display:block;overflow:visible;padding:40px}.mm-tree.mm-concept-map{position:relative!important;transform:none!important;background:#f5f8fb}</style></head><body><div class="mm-lightbox">${tree}</div></body></html>`,{waitUntil:'load'});
  await exportPage.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.mm-root-anatomy').decode()});
  const layout=await exportPage.evaluate(()=>({visible:[...document.querySelectorAll('.mm-detail-nodes>.mm-concept-leaf')].filter(n=>n.offsetHeight>0).length,overflow:[...document.querySelectorAll('.mm-concept-leaf')].filter(n=>n.scrollWidth>n.clientWidth+2).length,h:Math.ceil(document.querySelector('#mm-tree').getBoundingClientRect().bottom+40),w:document.documentElement.scrollWidth}));assert.equal(layout.visible,count);assert.equal(layout.overflow,0,map.id);
  await exportPage.screenshot({path:path.join(root,'api/_mindmaps',map.id+'.webp'),type:'webp',quality:95,clip:{x:0,y:0,width:layout.w,height:layout.h},captureBeyondViewport:true});
  await page.evaluate(async map=>{closeMmLightbox();CampusAccess.isFree=()=>true;window.lockOpened=false;await openMmLightbox(map)},map);assert.equal(await page.evaluate(()=>window.lockOpened),true);await page.evaluate(()=>CampusAccess.isFree=()=>false);
  checks.push({id:map.id,nodes:count,height:layout.h,desktop:true,mobile:true,manual:true,locked:true});fs.writeFileSync(path.join(root,'output/mapas-qa/premium-render-report.json'),JSON.stringify({maps:checks.length,errors,checks},null,2));console.log(checks.length+'/'+catalog.length+' '+map.id+' '+count+' nodes');
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
