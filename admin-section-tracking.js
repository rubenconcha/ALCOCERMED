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
  function openStudent(userId){
    if(!currentAdmin)return;
    const student=getStudent(userId),body=$('modal-est-body');
    $('modal-est-name').textContent='Ficha del estudiante';
    $('modal-estudiante').classList.add('open');$('modal-estudiante').setAttribute('aria-hidden','false');body.replaceChildren();
    const hero=el('div',null,'student-profile-hero'),avatar=el('span',student.display.split(/\s+/).slice(0,2).map(v=>v[0]).join(''),'student-profile-avatar'),identity=el('div');identity.append(el('small','Seguimiento individual'),el('h3',student.display),el('p',student.email||student.sub||''));hero.append(avatar,identity);body.append(hero);
    const controls=el('div',null,'topic-report-actions'),dateLabel=el('label','Fecha de actividad'),date=el('input');date.type='date';dateLabel.append(date);
    const today=el('button','Hoy','btn btn-secondary'),all=el('button','Todas las fechas','btn btn-secondary');today.type=all.type='button';controls.append(dateLabel,today,all);body.append(controls);
    const note=el('details',null,'student-profile-note');note.append(el('summary','Cómo interpretar este historial'),el('p','Las evaluaciones y los simulacros se muestran por separado. «Sin actividad registrada» no demuestra que no haya estudiado. El uso anterior al registro por herramienta no se puede reconstruir. Las entregas antiguas sin respuestas no permiten identificar qué preguntas falló.'));body.append(note);
    const content=el('div');body.append(content);
    function draw(){
      content.replaceChildren();
      const history=records(cachedData).filter(r=>r.user_id===String(userId)&&(!date.value||TopicResultsModel.day(r.date)===date.value));
      const overview=el('div',null,'student-tool-overview');
      const evaluationCount=history.filter(r=>r.section==='evaluaciones'&&r.grade!==null).length, simulationCount=history.filter(r=>r.section==='simulacros'&&r.grade!==null).length, openings=history.filter(r=>r.section==='flashcards'&&r.source.action==='opened'&&r.source.resource_key!=='menu').length;
      [['Evaluaciones',evaluationCount?evaluationCount+(evaluationCount===1?' entrega guardada':' entregas guardadas'):'Sin entregas registradas'],['Simulacros identificados',simulationCount?simulationCount+(simulationCount===1?' entrega guardada':' entregas guardadas'):'Sin entregas registradas'],['Aperturas nuevas de flashcards',openings?openings+(openings===1?' apertura registrada':' aperturas registradas'):'Sin aperturas registradas']].forEach(([label,value])=>{const card=el('div',null,'topic-report-stat');card.append(el('strong',label),el('span',value));overview.append(card);});content.append(overview);
      const inactive=el('details',null,'student-profile-inactive');inactive.append(el('summary','Otras herramientas · Sin actividad registrada'));
      const ordered=Object.entries(sections).sort(([a],[b])=>a==='evaluaciones'?-1:b==='evaluaciones'?1:0);
      ordered.forEach(([section,label])=>{
        const group=history.filter(r=>r.section===section).sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
        const block=el('details',null,'student-tool-history');
        const latestResult=group.find(r=>r.grade!==null);
        block.append(el('summary',label+' · '+(group.length?group.length+(group.length===1?' registro':' registros')+(latestResult?' · Último resultado: '+latestResult.grade+'%':''):'Sin actividad registrada')));
        block.open=group.length>0 && section==='evaluaciones';
        if(cachedData.loading){block.append(el('p','Consulta en curso. Actualiza el perfil al terminar.'));content.append(block);return;}
        const errors=(cachedData.errors||[]).filter(e=>section==='evaluaciones'||section==='historico'?e.table==='resultados_simulacros':section==='flashcards'?['campus_section_activity','progreso_flashcards'].includes(e.table):section==='banco'?e.table==='resultados_banco':section==='juegos'?['evaluacion_resultados','evaluaciones'].includes(e.table):['campus_section_activity','resultados_simulacros'].includes(e.table));
        if(errors.length)block.append(el('p','Consulta incompleta: '+errors.map(e=>e.table).join(', ')));
        if(!group.length){block.append(el('p',errors.length?'No se puede determinar la actividad.':'Sin actividad registrada'+(date.value?' en esta fecha.':'.')));(errors.length?content:inactive).append(block);return;}
        const graded=group.filter(r=>r.grade!==null);
        block.append(el('p',group.length+(group.length===1?' registro':' registros')+(graded.length?' · '+graded.length+(graded.length===1?' resultado guardado':' resultados guardados'):'')));
        if(section==='flashcards')block.append(el('p','Los totales históricos son acumulados; la fecha indica la última sincronización, no los repasos realizados ese día. No indican cuántas tarjetas distintas vio ni de qué tema. Los repasos nuevos aparecen por tema; no se suman al total histórico porque pueden estar incluidos en él.'));
        group.forEach(r=>{
          const card=el('article',null,'student-attempt-card'),heading=el('div',null,'student-attempt-heading');heading.append(el('strong',r.topic));if(r.grade!==null)heading.append(el('span',r.grade+'%','student-attempt-score'));card.append(heading,el('p',r.subject+' · '+formatDate(r.date),'student-attempt-meta'));
          if(r.source.correctas!=null){const chips=el('div',null,'student-attempt-chips');[['correctas','aciertos'],['incorrectas','incorrectas'],['sin_respuesta','sin responder']].forEach(([key,label])=>{if(r.source[key]!=null)chips.append(el('span',Number(r.source[key])+' '+(Number(r.source[key])===1&&label.endsWith('s')?label.slice(0,-1):label),key));});card.append(chips);}else card.append(el('p',r.action,'student-attempt-meta'));
          if(['evaluaciones','examenes','simulacros','historico','banco'].includes(section)&&r.grade!==null){const review=el('button','Ver errores y respuestas','btn review-launch');review.type='button';review.onclick=()=>QuestionReview.open(section==='banco'?'resultados_banco':'resultados_simulacros',r.source.id,r.topic,r.source.question_review);card.append(review);}block.append(card);
        });content.append(block);
      });
      if(inactive.children.length>1)content.append(inactive);
      const videos=(cachedData.videos||[]).filter(r=>String(r.user_id)===String(userId)&&(!date.value||TopicResultsModel.day(r.fecha_visto||r.created_at)===date.value));
      if(videos.length){content.append(el('h4','Videoclases'));videos.forEach(v=>content.append(el('p',(v.video_titulo||'Videoclase')+' · '+Number(v.progreso_pct||0)+'% · '+formatDate(v.fecha_visto||v.created_at))));}
    }
    date.onchange=draw;today.onclick=()=>{date.value=TopicResultsModel.day(new Date().toISOString());draw();};all.onclick=()=>{date.value='';draw();};draw();
  }
  root.AdminSectionTracking={openStudent,render:()=>populate(),clear:()=>{visible=[];$('tracking-results').replaceChildren();$('tracking-detail').replaceChildren();$('tracking-export').disabled=true;$('modal-est-body').replaceChildren();$('modal-estudiante').classList.remove('open');$('modal-estudiante').setAttribute('aria-hidden','true');if($('tracking-dialog').open)$('tracking-dialog').close();}};
})(typeof window==='undefined'?globalThis:window);
