// Offline browser QA. Run with PLAYWRIGHT_MODULE pointing to an installed Playwright.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'outputs','subject-errors-qa');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})}),page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
 try{
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>route.abort());
  let html=fs.readFileSync(path.join(root,'admin.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');
  html=html.replace('</head>','<style>'+['admin.css','admin-topic-results.css'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n')+'</style></head>');
  await page.setContent(html);
  await page.evaluate(()=>{
   window.currentAdmin={id:'admin-fixture'};window.ADMIN_EMAILS=['admin@test.invalid'];
   const make=(id,materia,correctas,incorrectas,user='fixture-a')=>({id,user_id:user,materia,correctas,incorrectas,sin_respuesta:0,porcentaje:50,simulacro_titulo:'Evaluación: Tema de prueba',created_at:'2026-10-20T18:00:00Z'});
   window.cachedData={sims:[make('1','MORFOFUNCION',18,2),make('2','SALUD PUBLICA',1,3),make('3','MATEMATICAS',90,10),make('4','BIOLOGIA CELULAR',2,5),make('5','todas',0,20),make('6','MORFOFUNCION',20,0,'fixture-b')],banco:[],errors:[],activity:[],games:[],videos:[]};
   window.getStudent=id=>({display:id==='fixture-a'?'Estudiante de prueba A':id==='fixture-b'?'Estudiante de prueba B':'Sin actividad de prueba',email:'fixture@test.invalid'});
   window.getSupabase=()=>({from(table){let id;const q={select(){return q;},eq(key,value){id=value;return q;},order(){return q;},range(){return Promise.resolve({data:cachedData[table==='resultados_simulacros'?'sims':'banco'].filter(r=>r.user_id===id).map(r=>({id:r.id,question_review:null}))});}};return q;}});
   document.getElementById('admin-login-screen').classList.add('hidden');document.getElementById('admin-app').style.display='flex';
  });
  for(const file of ['question-review.js','admin-topic-results.js','admin-subject-errors.js','admin-section-tracking.js'])await page.addScriptTag({content:fs.readFileSync(path.join(root,file),'utf8')});
  const section=page.locator('.student-subject-errors');
  await page.evaluate(()=>AdminSectionTracking.openStudent('fixture-a'));
  await section.getByText('20 errores atribuibles',{exact:true}).waitFor();
  await page.waitForFunction(()=>getComputedStyle(document.getElementById('modal-estudiante')).opacity==='1');
  assert.equal(await page.locator('#modal-est-body .student-subject-errors').count(),1);
  assert.equal(await page.locator('#tracking-results .student-subject-errors').count(),0);
  await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
  await section.evaluate(e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:path.join(out,'mobile-chart.png'),fullPage:true});
  await section.locator('table').evaluate(e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:path.join(out,'mobile-table.png'),fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await section.evaluate(e=>e.scrollWidth<=e.clientWidth),true);
  await page.locator('#modal-est-body input[type=date]').fill('2026-10-21');await section.getByText('Sin datos suficientes',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Todas las fechas',exact:true}).click();await section.getByText('20 errores atribuibles',{exact:true}).waitFor();
  await page.evaluate(()=>{cachedData.sims[0].incorrectas=4;AdminSectionTracking.refreshProfile();});await section.getByText('22 errores atribuibles',{exact:true}).waitFor();
  await page.evaluate(()=>AdminSectionTracking.openStudent('fixture-b'));await section.getByText('Sin errores registrados',{exact:true}).waitFor();assert.equal(await section.locator('.subject-error-pie').count(),0);
  await page.screenshot({path:path.join(out,'zero-errors.png'),fullPage:true});
  await page.evaluate(()=>AdminSectionTracking.openStudent('fixture-empty'));await section.getByText('Sin datos suficientes',{exact:true}).waitFor();assert.equal(await section.locator('.subject-error-pie').count(),0);
  // Delay A's response, replace the profile, then finish A: it cannot overwrite B.
  await page.evaluate(()=>{window.originalLoad=AdminSubjectErrors.load;AdminSubjectErrors.load=()=>new Promise(resolve=>{window.finishOld=resolve;});AdminSectionTracking.openStudent('fixture-a');AdminSubjectErrors.load=originalLoad;AdminSectionTracking.openStudent('fixture-b');});
  await section.getByText('Sin errores registrados',{exact:true}).waitFor();await page.evaluate(()=>finishOld({errors:[]}));await page.waitForTimeout(40);assert.match(await section.innerText(),/Sin errores registrados/i);
  await page.evaluate(()=>{currentAdmin=null;AdminSectionTracking.clear();});assert.equal(await section.count(),0);await page.evaluate(()=>AdminSectionTracking.openStudent('fixture-a'));assert.equal(await section.count(),0);
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({passed:true,checks:['desktop 1440x1100','mobile 390x844, no overflow','date filter and reset','refresh recalculates','zero errors','no activity','student switch','late response isolation','logout and admin guard'],pageErrors:errors},null,2));
  console.log('Offline browser QA passed; screenshots: '+out);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
