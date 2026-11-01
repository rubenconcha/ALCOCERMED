"""Offline UI QA. No production requests or student records."""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'outputs'/'student-results-qa'
OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1440,'height':1100})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('**/*',lambda route:route.abort())
    css='\n'.join((ROOT/f).read_text(encoding='utf-8') for f in ['styles.css','student-white.css','campus-theme.css','past-exams.css','student-results.css'])
    page.set_content('<html><head><style>'+css+'</style><style>body{background:#f1f4f8}main{max-width:1200px;margin:auto}.hidden{display:none!important}</style></head><body><main><section id="home-screen">Inicio</section></main></body></html>')
    page.evaluate("""() => {
      window.currentUser={id:'fixture-a'};window.currentCampusScreen='home-screen';window.authEvents=[];window.storage=new Map();
      Object.defineProperty(window,'localStorage',{value:{getItem:k=>storage.get(k)||null}});
      window.showScreen=id=>{currentCampusScreen=id;document.querySelectorAll('main>section').forEach(n=>n.classList.toggle('hidden',n.id!==id));return true;};
      window.goBack=()=>showScreen('home-screen');
      const item=(selected,extra={})=>({number:1,question:'¿Qué estructura participa en la respuesta de prueba?',options:['Opción uno','Opción dos'],selected,accepted:[0],explanation:'Comentario almacenado en el intento.',...extra});
      const r=(id,extra={})=>({id,user_id:'fixture-a',simulacro_titulo:'Simulacro de práctica guardado',menu_section:'simulacros',materia:'MORFOFUNCION',correctas:1,incorrectas:1,sin_respuesta:1,porcentaje:25,created_at:'2026-10-20T12:00:00Z',...extra});
      window.rows=[r('1',{question_review:{version:1,items:[item(0),item(1),item(null),item(0,{accepted:[]})]}}),r('2',{menu_section:'evaluaciones',simulacro_titulo:'Evaluación: Tema de prueba',question_review:null}),r('3',{menu_section:'examenes',simulacro_titulo:'Examen realizado',created_at:'2026-10-21T12:00:00Z',question_review:null}),r('foreign',{user_id:'fixture-b',simulacro_titulo:'No debe mostrarse'})];
      window.deny=false;window.delay=false;window.calls=[];
      window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:currentUser?{user:{id:currentUser.id}}:null}}),onAuthStateChange:fn=>{authEvents.push(fn);queueMicrotask(()=>fn('INITIAL_SESSION'));}},from(table){const q={filters:[],select(c){q.columns=c;return q;},eq(k,v){q.filters.push([k,v]);return q;},order(){return q;},range(){return finish(false);},single(){return finish(true);}};
        async function finish(single){calls.push({table,filters:q.filters,columns:q.columns});if(delay)await new Promise(r=>window.resolveDetail=r);if(deny)return {error:{code:'42501'}};const data=rows.filter(r=>q.filters.every(([k,v])=>r[k]===v));return {data:single?data[0]:data};}return q;}});
      window.sdkReady=false;window.ensureSupabaseSdk=async()=>{await new Promise(r=>setTimeout(r,20));sdkReady=true;};const originalClient=getSupabase;window.getSupabase=()=>{if(!sdkReady)throw Error('SDK pendiente');return originalClient();};
    }""")
    page.add_script_tag(content=(ROOT/'student-results.js').read_text(encoding='utf-8'))
    page.evaluate('openStudentResults()')
    page.get_by_text('3 intentos realizados · más recientes primero',exact=True).wait_for()
    assert page.locator('.sr-attempts article').count()==3
    assert page.get_by_text('No debe mostrarse',exact=True).count()==0
    assert page.locator('.sr-pie').count()==1
    page.screenshot(path=str(OUT/'desktop-history.png'),full_page=True)
    page.get_by_label('Tipo',exact=True).select_option('simulacros')
    assert page.locator('.sr-attempts article').count()==1
    page.get_by_role('button',name='Ver resultado y revisar preguntas').click()
    page.get_by_role('button',name='Acertadas',exact=True).wait_for()
    assert page.locator('.sr-question').count()==4
    for name,n in [('Acertadas',1),('Incorrectas',1),('Omitidas',1),('Sin clave / detalle incompleto',1),('Todas',4)]:
        page.get_by_role('button',name=name,exact=True).click()
        assert page.locator('.sr-question').count()==n
    assert page.get_by_text('Comentario: Comentario almacenado en el intento.',exact=True).count()==4
    assert page.get_by_text('· Correcta según la clave guardada',exact=False).count()==3
    page.screenshot(path=str(OUT/'desktop-review.png'),full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path=str(OUT/'mobile-review.png'),full_page=True)
    page.get_by_role('button',name='← Volver a mi historial',exact=True).click()
    page.get_by_label('Tipo',exact=True).select_option('evaluaciones')
    page.get_by_role('button',name='Ver resultado y revisar preguntas').click()
    page.get_by_text('Este intento conserva solo el resumen.',exact=False).wait_for()
    assert page.locator('.sr-question').count()==0
    page.get_by_role('button',name='← Volver a mi historial',exact=True).click()
    page.get_by_label('Tipo',exact=True).select_option('')
    page.get_by_label('Desde (UTC)',exact=True).fill('2026-10-22')
    page.get_by_text('No tienes intentos realizados en este período.',exact=True).wait_for()
    assert page.locator('.sr-pie').count()==0
    page.get_by_label('Hasta (UTC)',exact=True).fill('2026-10-20')
    page.get_by_text('La fecha inicial debe ser anterior a la final.',exact=True).wait_for()
    page.evaluate('openStudentResults()')
    page.get_by_text('3 intentos realizados · más recientes primero',exact=True).wait_for()
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    page.screenshot(path=str(OUT/'mobile-history.png'),full_page=True)
    # Load failure, refresh and zero attempts.
    page.evaluate('deny=true')
    page.get_by_role('button',name='Actualizar',exact=True).click()
    page.get_by_text('No se pudo cargar tu historial.',exact=False).wait_for()
    assert page.locator('.sr-attempts article').count()==0
    page.evaluate("deny=false;currentUser={id:'fixture-empty'};authEvents.forEach(f=>f());openStudentResults()")
    page.get_by_text('No tienes intentos realizados en este período.',exact=True).wait_for()
    # Saved per-account local snapshots are reviewed without a cloud detail request.
    page.evaluate("""() => {storage.set('alcocermed:suficiencia:v1:fixture-a:papers',JSON.stringify({p:{owner:'fixture-a',paperId:'p',title:'Simulacro local guardado',correct:0,total:1,percent:0,at:1792490400000,question_review:{version:1,items:[{question:'Pregunta local congelada',options:['Uno','Dos'],selected:1,accepted:[0],materia:'Matemáticas',explanation:'Comentario local guardado'}]}}}));currentUser={id:'fixture-a'};authEvents.forEach(f=>f());openStudentResults();}""")
    page.get_by_text('4 intentos realizados · más recientes primero',exact=True).wait_for()
    before=page.evaluate('calls.length')
    page.locator('.sr-attempts article').filter(has=page.get_by_role('heading',name='Simulacro local guardado',exact=True)).get_by_role('button').click()
    page.get_by_text('Pregunta local congelada',exact=True).wait_for()
    assert page.get_by_text('Comentario: Comentario local guardado',exact=True).count()==1
    assert page.evaluate('calls.length')==before
    page.get_by_role('button',name='← Volver a mi historial',exact=True).click()
    page.evaluate('storage.clear()')
    # Return after navigation reloads, late detail after logout never renders content.
    page.evaluate("currentUser={id:'fixture-a'};authEvents.forEach(f=>f());openStudentResults()")
    page.get_by_text('3 intentos realizados · más recientes primero',exact=True).wait_for()
    page.evaluate('delay=true')
    page.get_by_role('button',name='Ver resultado y revisar preguntas').first.click()
    page.wait_for_function("typeof resolveDetail==='function'")
    page.evaluate("currentUser=null;authEvents.forEach(f=>f());resolveDetail()")
    page.wait_for_timeout(50)
    assert page.locator('.sr-question').count()==0
    assert page.locator('.sr-attempts article').count()==0
    assert page.get_by_text('Inicia sesión para ver tus resultados.',exact=True).count()==1
    assert page.evaluate("calls.every(c=>c.table==='resultados_simulacros'&&c.filters.some(([k,v])=>k==='user_id'&&v.startsWith('fixture-')))")
    assert not errors,errors
    browser.close()
print('PASS: offline desktop/mobile history, detail filters, historical summaries, date filters, reload, empty account, denied query, logout and late detail; no network or writes.')
