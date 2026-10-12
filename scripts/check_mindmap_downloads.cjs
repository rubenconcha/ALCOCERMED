const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const p=require(process.env.MINDMAP_PUPPETEER||'C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),base=process.env.MINDMAP_BASE_URL||'http://127.0.0.1:8771';
const catalog=JSON.parse(fs.readFileSync(path.join(root,'content/mindmaps-catalog.json'),'utf8'));
const sources=JSON.parse(fs.readFileSync(path.join(root,'content/mindmaps-sources.json'),'utf8'));
const targets=['morfo_03_forma_y_funcion_celulares.png','biocel_01_introduccion.png','salud_03_promocion_prevencion.png'];
const campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),markup=campus.slice(campus.indexOf('<div id="mm-lightbox"'),campus.indexOf('<dialog id="mm-unlock-dialog"'));
(async()=>{const browser=await p.launch({executablePath:process.env.MINDMAP_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
 page.on('request',r=>r.url().includes('/qa-downloads')?r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><link rel="stylesheet" href="/mindmap-viewer.css"></head><body>${markup}<script>window.CampusAccess={isFree:()=>false};</script><script src="/mindmap-branch-labels.js"></script><script src="/mindmap-content.js"></script><script src="/mindmap-detailed-content.js"></script><script src="/mindmap-viewer.js"></script></body></html>`}):r.continue());
 await page.setViewport({width:1440,height:1000});await page.goto(base+'/qa-downloads');
 const folder=path.join(root,'output/mapas-qa/downloads-'+Date.now());fs.mkdirSync(folder,{recursive:true});const session=await page.createCDPSession();await session.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:folder});
 for(const key of targets){const x=catalog.find(x=>x.key===key),a=sources[key];await page.evaluate(x=>{closeMmLightbox();openMmLightbox({titulo:x.title,materia:x.subject,url_imagen:'mapas mentales/'+x.key})},x);
  const b=await page.$eval('#mm-lb-download',n=>{const r=n.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});await page.mouse.click(b.x,b.y);
  const file=path.join(folder,a.filename);for(let i=0;i<200&&!fs.existsSync(file);i++)await new Promise(r=>setTimeout(r,100));assert.ok(fs.existsSync(file),key);assert.deepEqual(fs.readFileSync(file),fs.readFileSync(path.join(root,a.download.split('?')[0])));console.log('Downloaded correct complete map: '+key);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
