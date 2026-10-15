const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const p=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const slug=process.argv[2]||'sangre',label=slug==='sangre'?'Sangre':'Órganos de los sentidos',count=slug==='sangre'?17:15,qa=slug==='sangre'?'pdf-depth-qa':'pdf-sentidos-depth-qa';
const root=path.resolve(__dirname,'..'),campus=fs.readFileSync(path.join(root,'campus.html'),'utf8');
const start=campus.indexOf('<section id="resumenes-screen"'),html=campus.slice(start,campus.indexOf('</section>',start)+10).replace('resumenes-screen hidden','resumenes-screen');
(async()=>{const browser=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];let requests=0;page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
page.on('request',r=>{
 const u=new URL(r.url());if(u.pathname==='/qa')return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><main style="width:100%;padding:16px">${html}</main><script>window.free=true;window.planVisits=0;window.CampusAccess={isFree:()=>free,unlock:()=>planVisits++};window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa',user:{id:'qa-user'}}}})}});</script><script src="/study-summaries.js"></script></body></html>`});
 if(u.pathname==='/api/resumen'){requests++;assert.equal(r.headers().authorization,'Bearer qa');return r.respond({contentType:'application/pdf',body:fs.readFileSync(path.join(root,`api/_pdf/morfofuncion-${slug}.pdf`))});}
 const file=path.join(root,u.pathname.slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:{'.js':'application/javascript','.css':'text/css','.png':'image/png'}[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});r.respond({status:404,body:''});
});
await page.goto('http://127.0.0.1:8771/qa');await page.type('#resumenes-search',label);assert.match(await page.$eval('.resumenes-card',n=>n.textContent),new RegExp(count+' páginas'));
await page.click('.resumenes-card button');assert.equal(requests,0);assert.equal(await page.evaluate(()=>planVisits),1);
await page.evaluate(()=>{free=false;window.dispatchEvent(new Event('campus-access-change'))});
for(const width of [1440,390]){
 await page.setViewport({width,height:1000});await page.click('.resumenes-card button');await page.waitForFunction(()=>document.querySelector('#resumenes-download').getAttribute('href')?.startsWith('blob:'));
 assert.equal(await page.$eval('#resumenes-viewer',n=>n.open),true);assert.equal(await page.$eval('#resumenes-download',n=>n.download),`morfofuncion-${slug}.pdf`);
 const dest=path.join(root,'output/morfo-sangre-sentidos',qa,'downloads',width+'-'+Date.now());fs.mkdirSync(dest,{recursive:true});const cdp=await page.target().createCDPSession();await cdp.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:dest});
 await page.click('#resumenes-download');const file=path.join(dest,`morfofuncion-${slug}.pdf`);for(let t=0;t<70&&!fs.existsSync(file);t++)await new Promise(r=>setTimeout(r,100));assert.deepEqual(fs.readFileSync(file),fs.readFileSync(path.join(root,`api/_pdf/morfofuncion-${slug}.pdf`)));await cdp.detach();
 await page.screenshot({path:path.join(root,'output/morfo-sangre-sentidos',qa,'viewer-'+width+'.png')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.click('#resumenes-close');
}
assert.deepEqual(errors,[]);console.log('PASS: summary page count, free lock, authenticated open and byte-identical downloads at desktop/mobile widths.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
