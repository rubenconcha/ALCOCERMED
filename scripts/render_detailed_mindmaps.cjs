/* Render and exercise every map through the production viewer, not a separate template. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const puppeteer=require(process.env.MINDMAP_PUPPETEER||'C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const base=process.env.MINDMAP_BASE_URL||'http://127.0.0.1:8770';
const allMaps=JSON.parse(fs.readFileSync(path.join(root,'content/mindmaps-catalog.json'),'utf8'));
const selected=(process.env.MINDMAP_KEYS||'').split(',').filter(Boolean);
const catalog=selected.length?allMaps.filter(x=>selected.includes(x.key)):allMaps;
const complete=path.join(root,'assets/mindmaps/complete'),previews=path.join(root,'assets/mindmaps/previews');
fs.mkdirSync(complete,{recursive:true});fs.mkdirSync(previews,{recursive:true});
fs.mkdirSync(path.join(root,'tmp'),{recursive:true});fs.writeFileSync(path.join(root,'tmp/mapas-export-shell.html'),'<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
const campus=fs.readFileSync(path.join(root,'campus.html'),'utf8');
const markup=campus.slice(campus.indexOf('<div id="mm-lightbox"'),campus.indexOf('<dialog id="mm-unlock-dialog"'));
const css=fs.readFileSync(path.join(root,'mindmap-viewer.css'),'utf8');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await puppeteer.launch({executablePath:process.env.MINDMAP_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 const checks=[],errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.setRequestInterception(true);page.on('request',r=>r.url().includes('/qa-all-maps')?r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="/assets/mindmaps/fonts/outfit.css" rel="stylesheet"><link rel="stylesheet" href="/mindmap-viewer.css"></head><body><button id="launch">Abrir</button>${markup}<script>window.CampusAccess={isFree:()=>false};window.openMmUnlockDialog=()=>window.lockOpened=true;</script><script src="/mindmap-branch-labels.js"></script><script src="/mindmap-content.js"></script><script src="/mindmap-detailed-content.js"></script><script src="/mindmap-viewer.js"></script></body></html>`}):r.continue());
  console.log('Loading viewer');await page.setViewport({width:1440,height:1000});await page.goto(base+'/qa-all-maps');await page.evaluate(()=>document.fonts.ready);console.log('Viewer ready',await page.evaluate(()=>({details:Object.keys(window.MINDMAP_DETAILED_CONTENT||{}).length,assets:Object.keys(window.MINDMAP_ASSETS||{}).length})),errors);assert.deepEqual(errors,[]);
  async function click(selector){
   await delay(80);
   await page.evaluate(selector=>{const n=document.querySelector(selector),r=n.getBoundingClientRect(),stage=document.querySelector('.mm-lb-stage'),s=stage.getBoundingClientRect();if(r.top<s.top)stage.scrollTop+=r.top-s.top-15;else if(r.bottom>s.bottom)stage.scrollTop+=r.bottom-s.bottom+15},selector);
   await delay(80);
   const b=await page.$eval(selector,n=>{const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
   await page.mouse.click(b.x,b.y);await delay(80);
  }
  for(const entry of catalog){
   const stem=path.parse(entry.key).name,map={titulo:entry.title,materia:entry.subject,url_imagen:'mapas mentales/'+entry.key};
   await page.setViewport({width:1440,height:1000});await page.evaluate(map=>{closeMmLightbox();document.querySelector('#launch').focus();openMmLightbox(map)},map);
   assert.ok(await page.$('.mm-root-anatomy'),entry.key+' missing illustration; errors: '+JSON.stringify(errors));await page.evaluate(async()=>{const img=document.querySelector('.mm-root-anatomy');try{await img.decode()}catch(error){img.src=img.src+'?qa-retry=1';await img.decode()}});await delay(35);
   assert.equal(await page.$$eval('.mm-concept-branch',ns=>ns.filter(n=>n.getAttribute('aria-expanded')==='true').length),0,entry.key);
   assert.equal(await page.$$eval('.mm-concept-branch',ns=>ns.length),6,entry.key);
   assert.deepEqual(await page.$$eval('.mm-concept-root>*',ns=>ns.map(n=>n.tagName)),['STRONG','IMG']);
   const clip=await page.$eval('#mm-tree',n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}});await page.screenshot({path:path.join(previews,stem+'.png'),clip,captureBeyondViewport:true});
   await click('.mm-concept-branch');assert.equal(await page.$eval('#mm-detail-0-0',n=>n.hidden),true);
   await click('#mm-children-0 .mm-detail-heading');assert.equal(await page.$eval('#mm-detail-0-0 .mm-leaf-explanation',n=>n.hidden),true);
   await click('#mm-detail-0-0 .mm-concept-leaf');assert.equal(await page.$eval('#mm-detail-0-0 .mm-leaf-explanation',n=>n.hidden),false);
    // The same structure must be usable on a narrow screen without page overflow.
   await page.setViewport({width:390,height:844});await delay(25);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,entry.key);
   await page.evaluate(()=>document.querySelector('#mm-branch-all').click());await page.evaluate(()=>document.querySelectorAll('.mm-detail-heading').forEach(n=>{if(n.getAttribute('aria-expanded')!=='true')n.click()}));
   await page.evaluate(()=>document.querySelectorAll('.mm-detail-nodes>.mm-concept-leaf,.mm-detail-note').forEach(n=>{if(n.getAttribute('aria-expanded')!=='true')n.click()}));
   const count=await page.$$eval('.mm-detail-nodes>.mm-concept-leaf',ns=>ns.length);assert.ok(count>=24);
   await page.setViewport({width:2300,height:1400});await delay(35);
   await page.evaluate(()=>{document.querySelector('#mm-tree').style.width='2200px';document.querySelector('#mm-tree').style.transform='none'});await delay(50);
   const tree=await page.$eval('#mm-tree',n=>n.outerHTML);
   const exportPage=await browser.newPage();await exportPage.setViewport({width:2280,height:1400,deviceScaleFactor:1.5});
   exportPage.on('requestfailed',r=>console.log('Export request failed',r.url(),r.failure()));
   await exportPage.goto(base+'/tmp/mapas-export-shell.html',{waitUntil:'load'});
   await exportPage.setContent(`<!doctype html><html><head><meta charset="utf-8"><base href="${base}/"><link href="/assets/mindmaps/fonts/outfit.css" rel="stylesheet"><style>${css}body{margin:0;background:#f5f8fb}.mm-lightbox{position:static;height:auto;display:block;overflow:visible;padding:40px}.mm-tree.mm-concept-map{position:relative!important;transform:none!important;background:#f5f8fb}</style></head><body><div class="mm-lightbox">${tree}</div></body></html>`,{waitUntil:'load'});
   await exportPage.evaluate(()=>document.fonts.ready);await exportPage.evaluate(()=>document.querySelector('.mm-root-anatomy').decode());
   const layout=await exportPage.evaluate(()=>({visible:[...document.querySelectorAll('.mm-detail-nodes>.mm-concept-leaf')].filter(n=>n.offsetHeight>0).length,overflow:[...document.querySelectorAll('.mm-concept-leaf')].filter(n=>n.scrollWidth>n.clientWidth+2).length,h:document.documentElement.scrollHeight}));
   assert.equal(layout.visible,count);assert.equal(layout.overflow,0,entry.key);
   await exportPage.screenshot({path:path.join(complete,stem+'.png'),fullPage:true});
   await exportPage.close();
   await page.evaluate(map=>{closeMmLightbox();CampusAccess.isFree=()=>true;window.lockOpened=false;openMmLightbox(map)},map);assert.equal(await page.evaluate(()=>window.lockOpened),true);await page.evaluate(()=>CampusAccess.isFree=()=>false);
   checks.push({key:entry.key,concepts:count,downloadHeight:layout.h,desktop:true,mobile:true,progressive:true,gated:true});
   fs.mkdirSync(path.join(root,'output/mapas-qa'),{recursive:true});fs.writeFileSync(path.join(root,'output/mapas-qa/report.json'),JSON.stringify({maps:checks.length,errors,checks},null,2));
   console.log((checks.length)+'/'+catalog.length+' '+entry.key+' '+count+' concepts');
  }
  assert.deepEqual(errors,[]);fs.mkdirSync(path.join(root,'output/mapas-qa'),{recursive:true});fs.writeFileSync(path.join(root,'output/mapas-qa/report.json'),JSON.stringify({maps:checks.length,errors,checks},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
