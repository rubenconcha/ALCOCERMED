const fs=require('node:fs'),assert=require('node:assert/strict');
const p=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
(async()=>{
 fs.mkdirSync('output/atlas-mobile',{recursive:true});
 const browser=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();let allowed=true;const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setBypassServiceWorker(true);await page.setRequestInterception(true);page.on('request',r=>{
   if(!r.url().startsWith('http://127.0.0.1:8794/'))return r.respond({contentType:'application/javascript',body:r.url().includes('@supabase')?'window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({})}})};':''});
   if(r.url().endsWith('/api/atlas'))return r.respond({status:allowed?200:403,contentType:'application/json',body:JSON.stringify({allowed})});
   if(r.url().includes('/atlas-anatomico?'))return r.respond({contentType:'text/html',body:fs.readFileSync('api/_atlas/atlas.html','utf8').replace('<head>','<head><base href="/">')});
   const file=decodeURIComponent(new URL(r.url()).pathname).slice(1);if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:({'.js':'application/javascript','.css':'text/css','.html':'text/html','.wasm':'application/wasm','.glb':'model/gltf-binary','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf'})[require('node:path').extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});r.continue();
  });
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:3});
  await page.goto('http://127.0.0.1:8794/campus.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof openAtlas==='function');
  await page.evaluate(()=>{
   window.showScreen=id=>{document.querySelectorAll('main>section').forEach(n=>n.classList.add('hidden'));document.getElementById(id).classList.remove('hidden');return true};
   window.ensureSupabaseSdk=async()=>{};window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'local-paid-student-fixture'}}})}});
   document.body.classList.remove('login-active');document.getElementById('login-screen').classList.add('hidden');
  });
  await page.evaluate(()=>openAtlas());
  const frame=await (await page.$('#campus-atlas-frame')).contentFrame();
  await frame.waitForFunction(()=>window.musclePreview?.ready,{timeout:90000});
  assert.equal(await frame.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const beforeZoom=await frame.evaluate(()=>musclePreview.camera);
  await frame.click('#zoom-in');const afterZoom=await frame.evaluate(()=>musclePreview.camera);
  assert.ok(afterZoom.some((v,i)=>Math.abs(v-beforeZoom[i])>.01),'Zoom control responds');
  await frame.click('#zoom-out');
  const canvas=await frame.$eval('canvas',n=>{const r=n.getBoundingClientRect();return {x:r.x+r.width*.5,y:r.y+r.height*.5}});
  const bounds=await page.$eval('#campus-atlas-frame',n=>{const r=n.getBoundingClientRect();return {x:r.x,y:r.y}});
  const touch=await page.createCDPSession(),x=canvas.x+bounds.x,y=canvas.y+bounds.y;
  const beforeDrag=await frame.evaluate(()=>musclePreview.camera);
  await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+55,y:y+20}]});
  await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.ok((await frame.evaluate(()=>musclePreview.camera)).some((v,i)=>Math.abs(v-beforeDrag[i])>.01),'Touch drag rotates the model');
  await frame.click('#reset');
  await page.screenshot({path:'output/atlas-mobile/mobile-390.png'});
  await frame.click('[data-panel="search"]');
  assert.ok(await frame.$eval('#stage',n=>n.getBoundingClientRect().height>100));
  assert.ok(await frame.evaluate(()=>document.getElementById('stage').getBoundingClientRect().bottom<=document.getElementById('drawer').getBoundingClientRect().top+2),'Panel must not cover model');
  await frame.$eval('#search',n=>{n.value='bíceps';n.dispatchEvent(new Event('input',{bubbles:true}))});
  await frame.waitForSelector('.search-result');
  await page.screenshot({path:'output/atlas-mobile/mobile-search.png'});
  await frame.click('#close-panel');
  await page.evaluate(()=>{document.getElementById('atlas-screen').requestFullscreen=undefined});
  await page.click('#campus-atlas-fullscreen');
  assert.ok(await page.$eval('#atlas-screen',n=>n.classList.contains('atlas-expanded')));
  assert.ok(await page.$eval('#campus-atlas-frame',n=>n.getBoundingClientRect().height>650));
  await page.screenshot({path:'output/atlas-mobile/mobile-expanded.png'});
  await page.click('#campus-atlas-fullscreen');
  assert.equal(await page.$eval('#atlas-screen',n=>n.classList.contains('atlas-expanded')),false);
  for(const size of [{width:360,height:640},{width:740,height:360},{width:844,height:390},{width:1440,height:900}]){
   await page.setViewport({...size,isMobile:true,hasTouch:true});
   assert.equal(await frame.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,JSON.stringify(size));
   await page.screenshot({path:`output/atlas-mobile/atlas-${size.width}.png`});
  }
  await page.evaluate(()=>showScreen('home-screen'));
  await page.waitForFunction(()=>!document.getElementById('campus-atlas-frame').hasAttribute('src'));
  allowed=false;await page.evaluate(()=>openAtlas());
  await page.waitForFunction(()=>document.getElementById('atlas-access-status').textContent.includes('Tu cuenta'));
  assert.equal(await page.$eval('#campus-atlas-frame',n=>n.hasAttribute('src')),false);
  console.log('PASS: allowed/denied access, real 3D mobile rendering, search, unobstructed model, iOS fullscreen fallback, portrait/landscape/desktop and cleanup.');
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

