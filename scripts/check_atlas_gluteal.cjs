const fs=require('fs'),assert=require('node:assert/strict'),p=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
(async()=>{const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});try{const page=await b.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewport({width:1440,height:1000});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(process.env.ATLAS_URL||'http://127.0.0.1:8775/musculos-interactivos.html');await page.waitForFunction(()=>window.musclePreview?.ready,{timeout:120000});
for(const side of ['left','right']){
 await page.evaluate(async side=>{await musclePreview.select('gluteus',false,side);await musclePreview.relationView('nerve')},side);
 assert.match(await page.$eval('#relation-status',n=>n.textContent),/Reconstrucción educativa/);
 assert.equal(await page.$$eval('#relation-targets button',bs=>bs.length),2);
 const keys=await page.evaluate(()=>musclePreview.visibleKeys);assert.ok(keys.some(k=>k.includes('Inferior gluteal nerve')));assert.ok(!keys.some(k=>k.includes('Superior gluteal nerve')));
 await page.click('#relation-targets button');assert.equal(await page.$eval('#relation-targets button',b=>b.getAttribute('aria-pressed')),'true');
 await page.click('#relation-targets button:last-child');
 await page.screenshot({path:'output/cell-qa/atlas-thirteen-gluteal-nerve-'+side+'.png'});
 await page.evaluate(()=>musclePreview.relationView('irrigation'));assert.equal(await page.$$eval('#relation-targets button',bs=>bs.length),3);
 await page.screenshot({path:'output/cell-qa/atlas-thirteen-gluteal-arteries-'+side+'.png'});
 await page.evaluate(()=>musclePreview.relationView('irrigation'));assert.equal(await page.$('#relation-targets'),null);assert.deepEqual(await page.evaluate(()=>musclePreview.visibleSystems.sort()),['muscular','skeletal']);
}
await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});await page.waitForFunction(()=>musclePreview?.ready,{timeout:120000});await page.evaluate(async()=>{await musclePreview.select('gluteus',false,'left');await musclePreview.relationView('nerve')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'output/cell-qa/atlas-thirteen-gluteal-mobile.png'});assert.deepEqual(errors,[]);console.log('PASS: bilateral inferior gluteal extension, two original gluteal arteries, individual zoom, restoration, mobile and no runtime errors.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
