'use strict';
(function(root){
  const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_\s]+/g,' ').trim();
  const labels={'morfofuncion':'Morfofunción','morfo funcion':'Morfofunción','salud publica':'Educación en Salud e Investigación','educacion para la salud':'Educación en Salud e Investigación','educacion en salud':'Educación en Salud e Investigación','educacion en salud e investigacion':'Educación en Salud e Investigación','biologia celular':'Biología celular','matematicas':'Matemáticas','matematica':'Matemáticas'};
  const subjectLabel=v=>labels[norm(v)]||String(v??'').trim()||'Sin materia registrada';
  function build(rows,userId){
    const groups=new Map(),seen=new Set(),cards=new Set();let duplicates=0,visits=0,unclassified=0;
    for(const row of rows){
      if(row.section!=='flashcards'||String(row.user_id)!==String(userId))continue;
      const r=row.source||{},id=r.id==null?null:String(r.id);
      if(!['opened','reviewed'].includes(r.action))continue;
      if(id&&seen.has(id)){duplicates++;continue;}if(id)seen.add(id);
      if(r.resource_key==='menu'){visits++;continue;}
      // The current writer stores 'deck' for topic opens and a card ID for reviews.
      if(r.action==='opened'&&r.resource_key!=='deck'){unclassified++;continue;}
      const rawSubject=String(r.subject||'').trim(),subject=subjectLabel(rawSubject);
      const rawTopic=String(r.topic||'').trim(),topic=rawTopic||'Sin tema registrado',key=JSON.stringify([norm(subject),norm(topic)]);
      if(!groups.has(key))groups.set(key,{key,subject,topic,knownTopic:!!rawTopic,knownSubject:!!rawSubject,cards:new Set(),reviews:0,openings:0,last:null,events:[],withoutId:0});
      const g=groups.get(key);g.events.push(row);
      if(r.action==='opened')g.openings++;
      else{
        g.reviews++;
        const card=String(r.resource_key??'').trim();
        if(card&&!['deck','menu'].includes(card)){g.cards.add(card);cards.add(JSON.stringify([norm(subject),card]));}
        else g.withoutId++;
      }
      if(Number.isFinite(Date.parse(row.date))&&(!g.last||Date.parse(row.date)>Date.parse(g.last)))g.last=row.date;
    }
    const topics=[...groups.values()].map(g=>({...g,unique:g.cards.size})).sort((a,b)=>b.unique-a.unique||b.reviews-a.reviews||b.openings-a.openings||a.subject.localeCompare(b.subject,'es')||a.topic.localeCompare(b.topic,'es'));
    return {topics,unique:cards.size,reviews:topics.reduce((n,g)=>n+g.reviews,0),openings:topics.reduce((n,g)=>n+g.openings,0),topicCount:topics.filter(g=>g.knownTopic&&g.knownSubject).length,duplicates,visits,unclassified};
  }
  root.AdminFlashcardTopics={build,subjectLabel};if(typeof module!=='undefined'&&module.exports)module.exports=root.AdminFlashcardTopics;
  if(typeof document==='undefined')return;
  const el=(tag,value,cls)=>{const n=document.createElement(tag);if(value!=null)n.textContent=value;if(cls)n.className=cls;return n;};
  const date=v=>v&&Number.isFinite(Date.parse(v))?new Date(v).toLocaleString('es-BO',{timeZone:'America/La_Paz'}):'Sin fecha registrada';
  function render(rows,userId,options={}){
    const host=el('section',null,'flashcard-topic-summary');host.setAttribute('aria-label','Flashcards por materia y tema');
    host.append(el('h4','Flashcards por materia y tema'),el('p',options.period||'Todas las fechas','student-attempt-meta'));
    if(options.loading){host.append(el('p','Cargando actividad de flashcards…'));return host;}
    const errors=options.errors||[],activityFailed=errors.some(e=>e.table==='campus_section_activity');
    if(errors.length)host.append(el('p','Consulta incompleta: '+errors.map(e=>e.table).join(', ')+'. No se puede determinar toda la actividad.','subject-error-warning'));
    const m=build(activityFailed?[]:rows,userId);
    if(!activityFailed){
      const stats=el('div',null,'student-tool-overview');
      [['Temas con actividad identificada',m.topicCount],['Tarjetas únicas con repaso',m.unique],['Eventos de repaso',m.reviews]].forEach(([name,value])=>{const box=el('div',null,'topic-report-stat');box.append(el('strong',name),el('span',value));stats.append(box);});host.append(stats);
      host.append(el('p','Tarjetas únicas con repaso = mínimo de tarjetas vistas que puede verificarse en este registro; no incluye todas las visualizaciones. Repetir una tarjeta suma repasos, no tarjetas únicas. Ver o repasar no demuestra dominio ni acierto.','student-profile-note'));
      if(!m.topics.length)host.append(el('p','Sin actividad por tema registrada para estos filtros. Esto no demuestra que el estudiante no haya estudiado.'));
      else{
        const label=el('label','Gráfico por tema: '),metric=el('select');metric.setAttribute('aria-label','Medida del gráfico de flashcards');
        [['unique','Tarjetas únicas con repaso'],['reviews','Eventos de repaso'],['openings','Aperturas de tema']].forEach(([key,name])=>{const o=el('option',name);o.value=key;metric.append(o);});metric.value=m.unique?'unique':m.openings?'openings':'reviews';label.append(metric);host.append(label);
        const chart=el('div',null,'flashcard-topic-chart');host.append(chart);
        function draw(){
          chart.replaceChildren();const field=metric.value,max=Math.max(1,...m.topics.map(g=>g[field]));
          for(const subject of [...new Set(m.topics.map(g=>g.subject))]){
            const group=el('div',null,'flashcard-subject-group'),list=el('ul',null,'flashcard-topic-bars'),topics=m.topics.filter(g=>g.subject===subject);
            group.append(el('h5',subject),el('p',topics.length+' grupos de tema · '+topics.reduce((n,g)=>n+g.reviews,0)+' repasos · '+topics.reduce((n,g)=>n+g.openings,0)+' aperturas','student-attempt-meta'));
            topics.forEach(g=>{
              const item=el('li'),heading=el('div',null,'flashcard-topic-label');heading.append(el('strong',g.topic),el('span',g[field]+' '+metric.selectedOptions[0].textContent.toLowerCase()));
              const track=el('div',null,'flashcard-bar-track'),bar=el('span');track.setAttribute('aria-hidden','true');bar.style.width=(g[field]/max*100)+'%';track.append(bar);item.append(heading,track,el('p',g.unique+' tarjetas únicas con repaso · '+g.reviews+' repasos · '+g.openings+' aperturas · Última actividad: '+date(g.last),'student-attempt-meta'));
              if(g.withoutId)item.append(el('p',g.withoutId+' repasos sin ID de tarjeta: no permiten contar tarjetas únicas.','student-profile-note'));
              list.append(item);
            });group.append(list);chart.append(group);
          }
        }
        metric.onchange=draw;draw();host.append(el('p','Las barras comparan cantidades con el máximo visible; no son porcentajes de avance. No se calcula progreso por tema porque el registro no conserva un total fiable de tarjetas del tema. Las tarjetas compartidas entre temas pueden aparecer en ambos; el total general se deduplica por materia e ID.','student-profile-note'));
        const detail=el('details',null,'student-profile-note');detail.append(el('summary','Consultar detalle individual de tarjetas y eventos'));
        const list=el('div');detail.append(list);let shown=0;const events=m.topics.flatMap(g=>g.events.map(row=>({row,g}))).sort((a,b)=>(Date.parse(b.row.date)||0)-(Date.parse(a.row.date)||0));
        const more=el('button','Mostrar más registros','btn btn-secondary');more.type='button';
        function append(){events.slice(shown,shown+50).forEach(({row,g})=>{const r=row.source,card=el('article',null,'student-attempt-card');card.append(el('strong',g.topic),el('p',g.subject+' · '+(r.action==='reviewed'?'Repaso de tarjeta'+(r.resource_key?' · ID: '+r.resource_key:' · Sin ID'):'Apertura del tema'),'student-attempt-meta'),el('p',date(row.date),'student-attempt-meta'));list.append(card);});shown=Math.min(events.length,shown+50);more.hidden=shown>=events.length;}
        detail.addEventListener('toggle',()=>{if(detail.open&&!shown)append();});more.onclick=append;detail.append(more);host.append(detail);
      }
      host.append(el('p',m.openings+' aperturas de tema · '+m.visits+' visitas al menú (fuera de las barras) · '+m.unclassified+' aperturas sin clasificación fiable · '+m.duplicates+' eventos duplicados omitidos.','student-profile-note'));
    }
    const history=el('details',null,'student-profile-note');history.append(el('summary','Totales históricos y límites del registro'));
    const historical=(options.historical||[]).filter(r=>String(r.user_id)===String(userId)),latest=historical.filter(r=>r.repasos_totales!=null&&String(r.repasos_totales).trim()!==''&&Number.isFinite(Number(r.repasos_totales))&&Number(r.repasos_totales)>=0).sort((a,b)=>(Date.parse(b.ultima_sesion)||0)-(Date.parse(a.ultima_sesion)||0))[0];
    history.append(el('p',errors.some(e=>e.table==='progreso_flashcards')?'No se pudo consultar el acumulado histórico.':latest?'Último acumulado histórico: '+Number(latest.repasos_totales)+' repasos; sincronización: '+date(latest.ultima_sesion)+'. Sin desglose de materia, tema o tarjetas.':'Sin acumulado histórico consultable.'));
    history.append(el('p','El acumulado es global, no corresponde al período filtrado y no se suma a los eventos: pueden estar incluidos en él. Las aperturas de un tema no acreditan haber visto sus tarjetas. No se reconstruyen temas ni visualizaciones anteriores al registro. Los filtros se aplican a los eventos del registro, en hora de Bolivia.'));host.append(history);return host;
  }
  root.AdminFlashcardTopics.render=render;
})(typeof window==='undefined'?globalThis:window);
