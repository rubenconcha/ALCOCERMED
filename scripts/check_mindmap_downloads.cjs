const fs=require('fs'),path=require('path'),vm=require('node:vm'),assert=require('node:assert/strict');
const p=require(process.env.MINDMAP_PUPPETEER||'C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),base=process.env.MINDMAP_BASE_URL||'http://127.0.0.1:8771';
const catalog=JSON.parse(fs.readFileSync(path.join(root,'content/mindmaps-catalog.json'),'utf8'));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'mindmap-detailed-content.js'),'utf8'),context);
const sources=context.window.MINDMAP_ASSETS;
const targets=['morfo_01_anatomia_y_fisiologia.webp','biocel_01_introduccion.png','salud_03_promocion_prevencion.png'];
const campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),markup=campus.slice(campus.indexOf('<div id="mm-lightbox"'),campus.indexOf('<dialog id="mm-unlock-dialog"'));
(async()=>{const browser=await p.launch({executablePath:process.env.MINDMAP_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
 page.on('request',r=>{
  const url=new URL(r.url()),pathname=url.pathname;
  if(pathname==='/qa-downloads')return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/mindmaps/fonts/outfit.css"><link rel="stylesheet" href="/mindmap-viewer.css"></head><body>${markup}<script>window.CampusAccess={isFree:()=>false};</script><script src="/mindmap-branch-labels.js"></script><script src="/mindmap-content.js"></script><script src="/mindmap-detailed-content.js"></script><script src="/mindmap-download.js"></script><script src="/mindmap-viewer.js"></script></body></html>`});
  if(url.origin!==new URL(base).origin)return r.abort();
  const asset=path.resolve(root,'.'+decodeURIComponent(pathname));
  if(!asset.startsWith(root+path.sep)||!fs.existsSync(asset)||!fs.statSync(asset).isFile())return r.respond({status:404,body:''});
  const types={'.js':'application/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf'};
  return r.respond({contentType:types[path.extname(asset)]||'application/octet-stream',body:fs.readFileSync(asset)});
 });
 await page.setViewport({width:1440,height:1000});await page.goto(base+'/qa-downloads');
 await page.waitForFunction(()=>window.MINDMAP_CONTENT&&window.MINDMAP_ASSETS&&window.MindmapDownload&&window.openMmLightbox);
 const folder=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'alcocermed-mapas-'));const session=await page.createCDPSession();await session.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:folder});
 for(const key of targets){const x=catalog.find(x=>x.key===key),a=sources[key];await page.evaluate(async x=>{closeMmLightbox();await openMmLightbox({titulo:x.title,materia:x.subject,url_imagen:'mapas mentales/'+x.key})},x);
  await page.waitForSelector('#mm-lb-download:not(:disabled)');
  await page.click('#mm-lb-download');
  const file=path.join(folder,a.filename);
  for(let i=0;i<100&&!fs.existsSync(file);i++)await new Promise(r=>setTimeout(r,100));
  assert.ok(fs.existsSync(file),JSON.stringify({key,files:fs.readdirSync(folder),status:await page.$eval('#mm-lb-status',n=>n.textContent),errors}));
  const result=fs.readFileSync(file),original=fs.readFileSync(path.join(root,a.download.split('?')[0]));
  const width=original.readUInt32BE(16),height=original.readUInt32BE(20);
  assert.equal(result.readUInt32BE(16),width,key);
  assert.equal(result.readUInt32BE(20),height+2*Math.round(width*.018),key);
  const footer=await page.evaluate(async (data,height)=>{
   const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height-height;
   const context=canvas.getContext('2d');context.drawImage(image,0,-height);
   const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
   return pixels.some((value,i)=>i%4===0&&value===65&&pixels[i+1]===97&&pixels[i+2]===131);
  },result.toString('base64'),height);
  assert.equal(footer,true,key);
  console.log('Downloaded full map with readable footer: '+key);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
