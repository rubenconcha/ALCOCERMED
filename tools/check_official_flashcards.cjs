/* Browser smoke test with isolated authentication and no writes to the real backend. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PACKAGE||'playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:process.env.QA_BROWSER||'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1100},serviceWorkers:'block'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='cdn.jsdelivr.net'&&url.pathname.includes('supabase-js'))return route.fulfill({contentType:'application/javascript',body:"window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({})}})};"});
  if(url.hostname!=='127.0.0.1')return route.abort();
  let file=path.join(root,decodeURIComponent(url.pathname));
  if(url.pathname==='/campus')file=path.join(root,'campus.html');
  try{return await route.fulfill({path:file});}catch(_){return route.fulfill({status:404,body:''});}
 });
 await page.goto('http://127.0.0.1:8765/campus.html',{waitUntil:'networkidle'});
 const libraryPath=path.join(root,'api/_flashcards/library.json');
 const cards=JSON.parse(fs.readFileSync(libraryPath,'utf8')).cards.filter(c=>c.materia==='MORFOFUNCION'&&c.tema==='medula espinal y reflejos');
 assert.ok(cards.length>1);
 await page.evaluate(rows=>{currentUser={id:'qa-only'};document.body.classList.remove('login-active');document.getElementById('login-screen').classList.add('hidden');document.querySelectorAll('.login-checking').forEach(e=>e.remove());startDeck(rows[0].tema,rows[0].materia,rows);document.body.append(document.createElement('vercel-live-feedback'));},cards);
 const sample=await page.evaluate(()=>deck[currentIndex]);
 assert.equal(await page.locator('vercel-live-feedback').evaluate(e=>getComputedStyle(e).display),'none');
 assert.equal(await page.locator('#card-total').innerText(),String(cards.length));
 const directory=path.join(root,'tmp','official-flashcards-qa');fs.mkdirSync(directory,{recursive:true});
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1100});await page.waitForTimeout(400);
  const metrics=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,study:document.getElementById('study-area').getBoundingClientRect().toJSON(),overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&getComputedStyle(e).display!=='none';}).slice(0,10).map(e=>({id:e.id,cls:e.className,right:e.getBoundingClientRect().right}))}));
  console.log(JSON.stringify({width,metrics}));
  assert.ok(metrics.scroll<=width+1,'horizontal overflow at '+width);
  await page.screenshot({path:path.join(directory,'question-'+width+'.png'),fullPage:true});
  await page.locator('#btn-reveal').click();
  assert.equal(await page.locator('.fc-answer-source').innerText(),sample.reference);
  assert.equal(await page.locator('#anki-buttons .btn-anki:visible').count(),4);
  await page.screenshot({path:path.join(directory,'answer-'+width+'.png'),fullPage:true});
  await page.evaluate(()=>renderCard());
 }
 const groups=[...new Set(cards.map(c=>c.subtema))];
 for(const section of groups){
  const expected=cards.filter(c=>c.subtema===section).length;
  await page.locator('#flashcard-subtopic').selectOption(section);
  assert.equal(await page.locator('#card-total').innerText(),String(expected));
  assert.match(await page.locator('#flashcard-subtopic option:checked').innerText(),new RegExp(' · '+expected+' tarjetas$'));
 }
 await page.locator('#flashcard-subtopic').selectOption('');
 assert.equal(await page.locator('#card-total').innerText(),String(cards.length));
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log('PC and mobile study flow passed.');
})().catch(error=>{console.error(error);process.exit(1);});
