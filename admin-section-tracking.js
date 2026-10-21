'use strict';
(function(root){
  const sections={flashcards:'Flashcards',mapas:'Mapas mentales',atlas:'Atlas anatómico',resumenes:'Resúmenes',intocables:'Intocables',banco:'Banco de preguntas',examenes:'Exámenes pasados',simulacros:'Simulacros',evaluaciones:'Evaluación',quiz:'Quiz relámpago',ahorcado:'Ahorcado médico',juegos:'Juegos por materias',historico:'Exámenes y simulacros sin clasificación histórica'};
  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const subjectLabel=v=>{const s=norm(v);return s.startsWith('morfo')?'Morfofunción':s.includes('biolog')?'Biología celular':/salud|educacion/.test(s)?'Educación en Salud e Investigación':v||'Sin materia registrada';};
  function records(data){
    const rows=[];
    const add=(r,section,action,topic,subject,grade,date)=>{if(r.user_id)rows.push({user_id:String(r.user_id),section,action,topic:topic||'Sin tema registrado',subject:subjectLabel(subject),grade:grade==null?null:Number(grade),date:date||r.created_at,source:r});};
    (data.activity||[]).forEach(r=>{if(sections[r.section])add(r,r.section,r.resource_key==='menu'?'Sección visitada':r.action==='reviewed'?'Tarjeta repasada':r.action==='completed'?'Intento finalizado':'Recurso abierto',r.topic,r.subject,r.grade);});
    (data.sims||[]).forEach(r=>add(r,['evaluaciones','examenes','simulacros'].includes(r.menu_section)?r.menu_section:/^evaluaci[oó]n\s*:/i.test(r.simulacro_titulo||'')?'evaluaciones':'historico','Entrega guardada',r.simulacro_titulo,r.materia,r.porcentaje??r.score));
    (data.banco||[]).forEach(r=>add(r,'banco','Entrega guardada',r.tema,r.materia,r.porcentaje));
    (data.flashcards||[]).forEach(r=>add(r,'flashcards','Total histórico: '+Number(r.repasos_totales||0)+' repasos','Total general · sin desglose por tema','',null,r.ultima_sesion));
    const catalog=new Map((data.gameCatalog||[]).map(r=>[String(r.id),r]));
    (data.games||[]).forEach(r=>{const c=catalog.get(String(r.evaluacion_id));add(r,'juegos','Resultado guardado',c?.titulo||'Actividad '+r.evaluacion_id,c?.asignatura,r.porcentaje);});
    return rows;
  }
  root.SectionTrackingModel={sections,records,norm};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.SectionTrackingModel;
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id),host=$('section-tracking');if(!host)return;
  const el=(tag,value,cls)=>{const e=document.createElement(tag);if(value!=null)e.textContent=value;if(cls)e.className=cls;return e;};
  let visible=[];
  const menu=$('admin-menu-toggle'),sidebar=$('admin-sidebar');
  menu?.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  sidebar?.addEventListener('click',e=>{if(e.target.closest('a')){sidebar.classList.remove('open');menu?.setAttribute('aria-expanded','false');}});
  const picker=$('tracking-section'),subject=$('tracking-subject'),topic=$('tracking-topic');
  Object.entries(sections).forEach(([id,label])=>picker.add(new Option(label,id)));
  picker.value='evaluaciones';
  function selectedRows(){return records(cachedData).filter(r=>r.section===picker.value && r.user_id!==currentAdmin?.id && !ADMIN_EMAILS.includes(String(cachedData.userMap?.[r.user_id]?.email||r.source.user_email||'').toLowerCase()));}
  function populate(which){
    const rows=selectedRows();
    if(which!=='topic'){subject.replaceChildren(new Option('Todas las materias',''));[...new Set(rows.map(r=>r.subject))].sort().forEach(v=>subject.add(new Option(v,v)));}
    topic.replaceChildren(new Option('Todos los temas',''));[...new Set(rows.filter(r=>!subject.value||r.subject===subject.value).map(r=>r.topic))].sort().forEach(v=>topic.add(new Option(v,v)));
    render();
  }
  function render(){
    if(!currentAdmin)return;
    const section=picker.value,evalOnly=section==='evaluaciones';
    $('topic-report').hidden=!evalOnly;
    $('tracking-general').hidden=evalOnly;
    if(evalOnly)return;
    const target=$('tracking-results');target.replaceChildren();
    if(cachedData.loading){visible=[];$('tracking-export').disabled=true;$('tracking-status').textContent='Cargando los registros de esta sección…';return;}
    const from=$('tracking-from').value,to=$('tracking-to').value;
    if(from&&to&&from>to){$('tracking-status').textContent='La fecha inicial debe ser anterior o igual a la final.';visible=[];$('tracking-export').disabled=true;return;}
    const sources={examenes:['resultados_simulacros','campus_section_activity'],simulacros:['resultados_simulacros','campus_section_activity'],banco:['resultados_banco'],flashcards:['progreso_flashcards','campus_section_activity'],juegos:['evaluacion_resultados','evaluaciones'],historico:['resultados_simulacros']};
    const errors=(cachedData.errors||[]).filter(e=>(sources[section]||['campus_section_activity']).includes(e.table));
    const query=norm($('tracking-search').value),status=$('tracking-state').value;
    const rows=selectedRows().filter(r=>(!subject.value||r.subject===subject.value)&&(!topic.value||r.topic===topic.value)&&(!from||TopicResultsModel.day(r.date)>=from)&&(!to||(TopicResultsModel.day(r.date)&&TopicResultsModel.day(r.date)<=to)));
    const admins=new Set(ADMIN_EMAILS),people=new Map(Object.entries(cachedData.userMap||{}).map(([id,v])=>[String(id),{...v,user_id:String(id)}]));
    (cachedData.estudiantes||[]).forEach(s=>people.set(String(s.user_id),{...people.get(String(s.user_id)),...s}));
    rows.forEach(r=>{if(!people.has(r.user_id))people.set(r.user_id,{user_id:r.user_id,display:'Cuenta '+r.user_id.slice(-6)});});
    visible=[...people.values()].filter(s=>s.user_id!==currentAdmin.id&&!admins.has(String(s.email||'').toLowerCase())).map(s=>({...s,display:s.name||s.display||s.email||s.user_id,rows:rows.filter(r=>r.user_id===s.user_id).sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0))})).filter(s=>(!query||norm(s.display+' '+s.email).includes(query))&&(!status||(status==='active'?s.rows.length:!s.rows.length)));
    $('tracking-status').textContent=errors.length?'Consulta incompleta: no se pudieron leer '+errors.map(e=>e.table).join(', ')+'. La ausencia de datos no permite determinar la actividad.':visible.length+' estudiantes · '+rows.length+(rows.length===1?' registro':' registros')+' en esta sección. Abrir un recurso no acredita haberlo terminado. Las fechas se muestran en hora de Bolivia.';
    $('tracking-export').disabled=!!errors.length;
    const table=el('table'),head=el('thead'),tr=el('tr');['Estudiante','Registros','Última actividad','Seguimiento'].forEach(v=>tr.append(el('th',v)));head.append(tr);table.append(head);const body=el('tbody');
    visible.forEach(s=>{const row=el('tr');[s.display,errors.length&&!s.rows.length?'—':s.rows.length,s.rows[0]?formatDate(s.rows[0].date):errors.length?'Consulta incompleta':'Sin actividad registrada'].forEach(v=>row.append(el('td',v)));const cell=el('td'),button=el('button','Ver historial','btn btn-secondary');button.type='button';button.onclick=()=>detail(s);cell.append(button);row.append(cell);body.append(row);});
    table.append(body);const wrap=el('div',null,'table-wrap');wrap.append(table);target.append(wrap);
    if(!rows.length)target.prepend(el('p','Esta sección no tiene registros en los filtros elegidos. Las herramientas que antes no guardaban actividad no permiten reconstruir el uso pasado.'));
  }
  const formatDate=v=>v&&Number.isFinite(Date.parse(v))?new Date(v).toLocaleString('es-BO',{timeZone:'America/La_Paz'}):'Sin fecha registrada';
  function detail(s){
    $('tracking-person').textContent=s.display+' · '+sections[picker.value];const content=$('tracking-detail');content.replaceChildren();
    if(!s.rows.length)content.append(el('p','Sin actividad registrada. Esto no demuestra que el estudiante no haya utilizado el recurso.'));
    s.rows.forEach(r=>{const card=el('article',null,'topic-report-stat');card.append(el('strong',r.topic),el('p',r.subject+' · '+r.action),el('p',formatDate(r.date)+(r.grade==null?'':' · Nota: '+r.grade+'%')));content.append(card);});
    $('tracking-dialog').showModal();
  }
  picker.onchange=()=>populate();subject.onchange=()=>populate('topic');topic.onchange=render;
  ['tracking-search','tracking-state','tracking-from','tracking-to'].forEach(id=>$(id).addEventListener(id==='tracking-search'?'input':'change',render));
  $('tracking-close').onclick=()=>$('tracking-dialog').close();
  $('tracking-export').onclick=()=>{if(!currentAdmin||$('tracking-export').disabled)return;const lines=[['Sección','Estudiante','Correo','Materia','Tema','Actividad','Nota (%)','Fecha Bolivia']];visible.forEach(s=>s.rows.length?s.rows.forEach(r=>lines.push([sections[picker.value],s.display,s.email,r.subject,r.topic,r.action,r.grade??'',formatDate(r.date)])):lines.push([sections[picker.value],s.display,s.email,'','','Sin actividad registrada','','']));const url=URL.createObjectURL(new Blob(['\ufeff'+lines.map(r=>r.map(TopicResultsModel.csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=el('a');a.href=url;a.download='seguimiento-'+picker.value+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  root.AdminSectionTracking={render:()=>populate(),clear:()=>{visible=[];$('tracking-results').replaceChildren();$('tracking-detail').replaceChildren();$('tracking-export').disabled=true;if($('tracking-dialog').open)$('tracking-dialog').close();}};
})(typeof window==='undefined'?globalThis:window);
