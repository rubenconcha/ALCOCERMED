'use strict';
// Read-only reporting over the existing, server-authorized result tables.
(function (root) {
  const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const total = r => Number(r.correctas || 0) + Number(r.incorrectas || 0) + Number(r.sin_respuesta || 0);
  const score = r => Number(r.porcentaje ?? r.score ?? (total(r) ? Number(r.correctas || 0) / total(r) * 100 : 0));
  const day = value => {
    const date = new Date(value);
    return !value || !Number.isFinite(date.getTime()) ? '' : new Intl.DateTimeFormat('sv-SE', {timeZone:'America/La_Paz',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
  };
  function matches(row, exam) {
    const title = String(row.simulacro_titulo || row.titulo || '').trim();
    return /^evaluaci[oó]n\s*:/i.test(title) && norm(title.replace(/^evaluaci[oó]n\s*:/i, '')) === norm(exam.title)
      && norm(row.materia) === norm(exam.subject);
  }
  function build({exam, sims = [], students = [], userMap = {}, excludedEmails = [], excludedIds = [], query = '', from = '', to = '', state = ''}) {
    const byId = new Map(Object.entries(userMap).map(([id, info]) => [String(id), {...info, user_id:String(id)}]));
    students.forEach(s => byId.set(String(s.user_id), {...byId.get(String(s.user_id)), ...s}));
    sims.forEach(r => {
      if (!r.user_id) return;
      const id = String(r.user_id), old = byId.get(id) || {};
      byId.set(id, {...old,user_id:id,email:old.email || r.user_email || '',name:old.name || r.user_name || ''});
    });
    const adminEmails = new Set(excludedEmails.map(e => String(e).toLowerCase()));
    const adminIds = new Set(excludedIds.filter(Boolean).map(String));
    const excluded = s => adminIds.has(s.user_id) || adminEmails.has(String(s.email || '').toLowerCase());
    const attempts = exam ? sims.filter(r => matches(r, exam) && r.user_id && !excluded(byId.get(String(r.user_id)) || {}) && (!from || day(r.created_at) >= from) && (!to || (day(r.created_at) && day(r.created_at) <= to))) : [];
    const groups = new Map();
    attempts.forEach(r => {const id = String(r.user_id); if (!groups.has(id)) groups.set(id, []); groups.get(id).push(r);});
    const people = [...byId.values()].filter(s => !excluded(s)).map(s => {
      const history = (groups.get(s.user_id) || []).slice().sort((a,b) => (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0));
      return {...s,display:s.name || s.display || s.email || 'Estudiante …' + s.user_id.slice(-6),attempts:history,last:history[0] || null,best:history.length ? Math.max(...history.map(score)) : null};
    }).sort((a,b) => a.display.localeCompare(b.display,'es'));
    const delivered = people.filter(s => s.last);
    const visible = people.filter(s => (!query || norm([s.display,s.email,s.user_id].join(' ')).includes(norm(query))) && (!state || (state === 'delivered' ? !!s.last : !s.last)));
    return {people,visible,delivered:delivered.length,pending:people.length-delivered.length,attempts:attempts.length,average:delivered.length ? Math.round(delivered.reduce((sum,s) => sum + score(s.last),0)/delivered.length) : null};
  }
  const csvCell = value => {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g,'""') + '"';
  };
  root.TopicResultsModel = {norm,total,score,day,matches,build,csvCell};
  if (typeof module !== 'undefined' && module.exports) module.exports = root.TopicResultsModel;
  if (typeof document === 'undefined') return;
  const $ = id => document.getElementById(id);
  if (!$('topic-report')) return;
  let catalogPromise, exams = [], currentModel, currentExam, generation = 0;
  const text = (tag, value, className) => {const el = document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;};
  const dateLabel = value => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString('es-BO',{timeZone:'America/La_Paz',dateStyle:'medium',timeStyle:'short'}) : 'Sin fecha';
  const percent = value => value === null ? '—' : Math.round(value) + '%';
  function table(headers, rows) {
    const wrap = document.createElement('div');wrap.className='table-wrap';
    const table = document.createElement('table'), head = document.createElement('thead'), tr = document.createElement('tr'), body = document.createElement('tbody');
    headers.forEach(h => tr.append(text('th',h)));head.append(tr);
    rows.forEach(values => {const row=document.createElement('tr');values.forEach(v=>{const cell=document.createElement('td');if(v instanceof Node)cell.append(v);else cell.textContent=v;row.append(cell);});body.append(row);});
    table.append(head,body);wrap.append(table);return wrap;
  }
  function roster() {
    return build({exam:currentExam,sims:cachedData.sims,students:cachedData.estudiantes,userMap:cachedData.userMap,excludedEmails:ADMIN_EMAILS,excludedIds:[currentAdmin?.id],query:$('topic-report-search').value,from:$('topic-report-from').value,to:$('topic-report-to').value,state:$('topic-report-state').value});
  }
  function renderRows() {
    if (!currentAdmin || !currentExam) return;
    const error = (cachedData.errors || []).find(e => e.table === 'resultados_simulacros');
    const target = $('topic-report-results');target.replaceChildren();
    $('topic-report-export').disabled=!!error;
    if(error){currentModel=null;$('topic-report-stats').replaceChildren();$('topic-report-status').textContent='No se pudieron consultar las entregas. Pulsa Actualizar. No se puede determinar quién entregó hasta recuperar los datos.';return;}
    const from=$('topic-report-from').value,to=$('topic-report-to').value;
    if(from && to && from>to){$('topic-report-status').textContent='La fecha inicial debe ser anterior o igual a la final.';currentModel=null;$('topic-report-stats').replaceChildren();$('topic-report-export').disabled=true;return;}
    currentModel=roster();
    const stats=$('topic-report-stats');stats.replaceChildren();
    [['Cuentas conocidas',currentModel.people.length],['Con entrega',currentModel.delivered],['Sin entrega registrada',currentModel.pending],['Promedio de última entrega',percent(currentModel.average)]].forEach(([label,value])=>{const box=text('div','','topic-report-stat');box.append(text('strong',value),text('span',label));stats.append(box);});
    $('topic-report-status').textContent=currentModel.visible.length+' estudiantes visibles · '+currentModel.attempts+(currentModel.attempts===1?' entrega':' entregas')+' del tema en el período. Fechas y horas de Bolivia.';
    if(!currentModel.visible.length){target.append(text('p','No hay estudiantes que coincidan con estos filtros.'));return;}
    const rows=currentModel.visible.map(s=>{
      const identity=text('div','');identity.append(text('strong',s.display),text('small',s.email || 'Correo no disponible'));
      const button=text('button','Ver intentos','btn btn-secondary btn-sm');button.type='button';button.addEventListener('click',()=>detail(s));
      return [identity,s.last?'Con entrega':'Sin entrega registrada',s.attempts.length,s.last?percent(score(s.last)):'—',percent(s.best),s.last?Number(s.last.correctas||0)+' / '+total(s.last):'—',s.last?dateLabel(s.last.created_at):'—',button];
    });
    target.append(table(['Estudiante','Entrega','Intentos','Última nota','Mejor nota','Aciertos / preguntas','Última entrega','Seguimiento'],rows));
  }
  function detail(s) {
    $('topic-report-person').textContent=s.display;
    const body=$('topic-report-detail');body.replaceChildren();body.append(text('p',currentExam.subjectLabel+' · '+currentExam.title));
    if(s.attempts.length){
      const first=s.attempts.at(-1),last=s.attempts[0];
      if(s.attempts.length>1){const delta=Math.round(score(last)-score(first));body.append(text('p',total(first)===total(last)?'Cambio entre primera y última entrega: '+(delta>0?'+':'')+delta+' puntos porcentuales.':'Hay entregas de distinta cantidad de preguntas. Consulta cada intento; no se calcula un avance entre esas versiones.'));}
      body.append(table(['Fecha','Nota','Correctas','Incorrectas','Sin responder','Preguntas','Tiempo'],s.attempts.map(r=>[dateLabel(r.created_at),percent(score(r)),Number(r.correctas||0),Number(r.incorrectas||0),Number(r.sin_respuesta||0),total(r),Math.floor(Number(r.tiempo_segundos||0)/60)+' min '+Number(r.tiempo_segundos||0)%60+' s'])));
      body.append(text('p','Estos registros conservan el resultado global. Las respuestas elegidas en cada pregunta no están almacenadas en los intentos históricos.','topic-report-note'));
    }else body.append(text('p','No hay una entrega guardada de este tema para esta cuenta y el período seleccionado. Esto no permite saber si abrió la evaluación sin entregarla.'));
    const profile=text('button','Abrir perfil completo','btn btn-secondary');profile.type='button';profile.addEventListener('click',()=>{$('topic-report-dialog').close();verDetalleEstudiante(s.user_id);});body.append(profile);
    $('topic-report-dialog').showModal();
  }
  function populate() {
    const subject=$('topic-report-subject').value,select=$('topic-report-topic'),previous=select.value;
    select.replaceChildren();exams.filter(e=>e.subject===subject).forEach(e=>{const option=text('option','Tema '+e.number+' · '+e.title);option.value=e.id;select.append(option);});
    if([...select.options].some(o=>o.value===previous))select.value=previous;
    currentExam=exams.find(e=>e.id===select.value);renderRows();
  }
  async function render() {
    const request=++generation,account=currentAdmin?.id;if(!account)return;
    try{
      $('topic-report-status').textContent='Cargando seguimiento por tema…';
      if(!catalogPromise)catalogPromise=fetch('/content/topic-evaluations/catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('No se pudo cargar la lista de temas.');return r.json();}).catch(e=>{catalogPromise=null;throw e;});
      exams=(await catalogPromise).exams;
      if(request!==generation || account!==currentAdmin?.id)return;
      populate();
    }catch(e){$('topic-report-status').textContent=e.message;}
  }
  function exportCsv() {
    if(!currentAdmin || !currentModel || $('topic-report-export').disabled)return;
    const lines=[['Tema','Estudiante','Correo','Entrega','Intentos','Última nota (%)','Mejor nota (%)','Preguntas última entrega','Correctas última entrega','Última entrega (Bolivia)'],...currentModel.visible.map(s=>[currentExam.title,s.display,s.email,s.last?'Con entrega':'Sin entrega registrada',s.attempts.length,s.last?score(s.last):'',s.best??'',s.last?total(s.last):'',s.last?s.last.correctas:'',s.last?dateLabel(s.last.created_at):''])];
    const blob=new Blob(['\ufeff'+lines.map(row=>row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='seguimiento-'+currentExam.id+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  $('topic-report-subject').addEventListener('change',populate);
  $('topic-report-topic').addEventListener('change',()=>{currentExam=exams.find(e=>e.id===$('topic-report-topic').value);renderRows();});
  ['topic-report-search','topic-report-from','topic-report-to','topic-report-state'].forEach(id=>$(id).addEventListener(id==='topic-report-search'?'input':'change',renderRows));
  $('topic-report-export').addEventListener('click',exportCsv);
  $('topic-report-close').addEventListener('click',()=>$('topic-report-dialog').close());
  function clear() {
    ++generation;currentModel=null;currentExam=null;
    ['topic-report-results','topic-report-stats','topic-report-detail'].forEach(id=>$(id).replaceChildren());
    $('topic-report-export').disabled=true;
    $('topic-report-status').textContent='Inicia sesión como administrador para consultar los resultados.';
    if($('topic-report-dialog').open)$('topic-report-dialog').close();
  }
  root.AdminTopicResults={render,clear};
  if(new URLSearchParams(location.search).get('seccion')==='evaluaciones')showSection('evaluaciones');
})(typeof window === 'undefined' ? globalThis : window);
