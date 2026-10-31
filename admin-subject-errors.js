'use strict';
(function(root){
  const subjects=[['morfofuncion','Morfofunción','#1685bd'],['salud publica','Salud Pública','#d49318'],['matematicas','Matemáticas','#8062bc'],['biologia celular','Biología Celular','#26977c']];
  const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_\s]+/g,' ').trim();
  const aliases={'morfofuncion':'morfofuncion','morfo funcion':'morfofuncion','salud publica':'salud publica','educacion para la salud':'salud publica','educacion en salud':'salud publica','educacion en salud e investigacion':'salud publica','matematicas':'matematicas','matematica':'matematicas','biologia celular':'biologia celular'};
  const count=value=>value!==null&&value!==undefined&&value!==''&&Number.isSafeInteger(Number(value))&&Number(value)>=0?Number(value):null;
  function build(data,userId,date='',details={}){
    const rows=subjects.map(([key,label,color])=>({key,label,color,wrong:0,answered:0,omitted:0,unknown:0,attempts:0,historical:0}));
    const result={rows,totalWrong:0,attempts:0,historical:0,excluded:0,duplicates:0,omitted:0,unknown:0,errors:details.errors||[]};
    const seen=new Set();
    for(const [source,table] of [['sims','resultados_simulacros'],['banco','resultados_banco']]){
      for(const r of data[source]||[]){
        if(String(r.user_id)!==String(userId)||date&&root.TopicResultsModel.day(r.created_at)!==date)continue;
        const id=r.id==null?null:table+':'+r.id;
        if(id&&seen.has(id)){result.duplicates++;continue;}if(id)seen.add(id);
        const row=rows.find(s=>s.key===aliases[norm(r.materia)]);
        if(!row||result.errors.includes(table)||(data.errors||[]).some(e=>e.table===table)){result.excluded++;continue;}
        const payload=id&&Object.prototype.hasOwnProperty.call(details,id)?details[id]:r.question_review;
        // A malformed non-null snapshot is not a historical aggregate.
        const items=root.QuestionReview.inspect(payload);
        if(payload!=null&&(!items||!items.length)){result.excluded++;continue;}
        if(items){
          for(const q of items){
            if(q.status==='correct'||q.status==='wrong'){row.answered++;if(q.status==='wrong')row.wrong++;}
            else if(q.status==='unanswered')row.omitted++;
            else row.unknown++;
          }
        }else{
          const correct=count(r.correctas),wrong=count(r.incorrectas),total=count(r.total),omitted=source==='banco'&&total!==null&&correct!==null&&wrong!==null?total-correct-wrong:count(r.sin_respuesta);
          if(correct===null||wrong===null||omitted===null||omitted<0){result.excluded++;continue;}
          row.wrong+=wrong;row.answered+=correct+wrong;row.omitted+=omitted;row.historical++;result.historical++;
        }
        row.attempts++;result.attempts++;
      }
    }
    result.totalWrong=rows.reduce((sum,r)=>sum+r.wrong,0);
    result.omitted=rows.reduce((sum,r)=>sum+r.omitted,0);result.unknown=rows.reduce((sum,r)=>sum+r.unknown,0);
    // Largest remainders ensure the displayed pie shares add up to 100.0%.
    const shares=rows.map((r,index)=>({index,raw:result.totalWrong?r.wrong/result.totalWrong*1000:0}));
    const units=shares.map(s=>Math.floor(s.raw));let left=result.totalWrong?1000-units.reduce((a,b)=>a+b,0):0;
    shares.sort((a,b)=>(b.raw-units[b.index])-(a.raw-units[a.index])||a.index-b.index).forEach(s=>{if(left>0){units[s.index]++;left--;}});
    rows.forEach((r,i)=>{r.share=units[i]/10;r.rate=r.answered?r.wrong/r.answered*100:null;});
    return result;
  }
  async function load(data,userId){
    const details={errors:[]};
    if(typeof currentAdmin==='undefined'||!currentAdmin)return details;
    const actor=currentAdmin.id;
    await Promise.all([['sims','resultados_simulacros'],['banco','resultados_banco']].map(async([source,table])=>{
      if(!(data[source]||[]).some(r=>String(r.user_id)===String(userId)))return;
      try{
        const size=100;let offset=0,page;
        do{
          if(currentAdmin?.id!==actor)return;
          const response=await getSupabase().from(table).select('id,question_review').eq('user_id',userId).order('id',{ascending:true}).range(offset,offset+size-1);
          if(response.error)throw response.error;
          page=response.data;if(!Array.isArray(page))throw Error('Respuesta incompleta');
          page.forEach(r=>{details[table+':'+r.id]=r.question_review??null;});offset+=page.length;
        }while(page.length===size);
        if((data[source]||[]).some(r=>String(r.user_id)===String(userId)&&!Object.prototype.hasOwnProperty.call(details,table+':'+r.id)))throw Error('Intento no disponible');
      }catch(_){details.errors.push(table);}
    }));
    return details;
  }
  root.AdminSubjectErrors={build,load};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.AdminSubjectErrors;
  if(typeof document==='undefined')return;
  const el=(tag,value,cls)=>{const node=document.createElement(tag);if(value!=null)node.textContent=value;if(cls)node.className=cls;return node;};
  const pct=value=>value.toLocaleString('es-BO',{minimumFractionDigits:1,maximumFractionDigits:1})+'%';
  function render(data,userId,date,details){
    const section=el('section',null,'student-subject-errors');section.setAttribute('aria-label','Errores por materia');
    section.append(el('h4','Errores por materia'),el('p',date?'Fecha: '+date+' · Hora de Bolivia':'Todas las fechas · Intentos guardados','subject-error-period'));
    if(data.loading||!details){const status=el('p','Cargando el análisis de respuestas…');status.setAttribute('role','status');section.append(status);return section;}
    const result=build(data,userId,date,details),failed=[...new Set([...result.errors,...(data.errors||[]).filter(e=>['resultados_simulacros','resultados_banco'].includes(e.table)).map(e=>e.table)])];
    if(failed.length)section.append(el('p','Consulta incompleta. No se incluyen las fuentes que no se pudieron leer: '+failed.join(', ')+'.','subject-error-warning'));
    const layout=el('div',null,'subject-error-layout'),figure=el('figure',null,'subject-error-figure');
    if(result.totalWrong){
      let end=0;const stops=result.rows.filter(r=>r.wrong>0).map(r=>{const start=end;end+=r.wrong/result.totalWrong*100;return r.color+' '+start+'% '+end+'%';});
      const pie=el('div',null,'subject-error-pie');pie.style.background='conic-gradient('+stops.join(',')+')';pie.setAttribute('role','img');pie.setAttribute('aria-label','Distribución de '+result.totalWrong+' errores. '+result.rows.map(r=>r.label+': '+r.wrong+' errores, '+pct(r.share)).join('; '));figure.append(pie,el('figcaption',result.totalWrong+' errores atribuibles'));
    }else{
      figure.append(el('div',result.attempts?(result.rows.some(r=>r.answered)?'Sin errores registrados':'Sin respuestas calificables'):'Sin datos suficientes','subject-error-empty'),el('figcaption',result.attempts?'En los intentos incluidos para este período.':'No hay intentos atribuibles a estas materias en este período.'));
    }
    layout.append(figure);const legend=el('ul',null,'subject-error-legend');
    result.rows.forEach(r=>{const item=el('li'),name=el('span',null,'subject-error-name'),swatch=el('i');swatch.style.backgroundColor=r.color;swatch.setAttribute('aria-hidden','true');name.append(swatch,el('strong',r.label));item.append(name,el('span',r.attempts?r.wrong+' errores · '+(result.totalWrong?pct(r.share)+' del total':'Sin porcentaje de torta'):'Sin datos atribuibles'));legend.append(item);});layout.append(legend);section.append(layout);
    section.append(el('p','La torta muestra errores de cada materia ÷ total de errores atribuibles. La tasa de error usa las preguntas respondidas de cada materia.','subject-error-note'));
    const wrap=el('div',null,'table-wrap'),table=el('table'),caption=el('caption','Respuestas por materia'),thead=el('thead'),head=el('tr');
    ['Materia','Errores / respondidas','Tasa de error','Omisiones','Sin clave / detalle válido'].forEach(v=>head.append(el('th',v)));thead.append(head);table.append(caption,thead);const body=el('tbody');
    result.rows.forEach(r=>{const tr=el('tr'),name=el('th',r.label);name.scope='row';tr.append(name);[r.attempts?r.wrong+' / '+r.answered:'Sin datos',r.rate===null?'—':pct(r.rate),r.attempts?r.omitted:'—',!r.attempts?'—':r.historical?(r.unknown?r.unknown+' + histórico no verificable':'Histórico no verificable'):r.unknown].forEach(v=>tr.append(el('td',v)));body.append(tr);});table.append(body);wrap.append(table);section.append(wrap);
    const note=el('details',null,'subject-error-note');note.append(el('summary','Fuente y cobertura del cálculo'),el('p',result.attempts+' intentos incluidos; '+result.historical+' con recuentos históricos sin respuestas individuales; '+result.excluded+' excluidos; '+result.duplicates+' duplicados omitidos. '+result.omitted+' omisiones y '+result.unknown+' respuestas sin clave o detalle válido, fuera de errores y respondidas.'));
    note.append(el('p','Fuente: evaluaciones, exámenes y simulacros de resultados_simulacros y prácticas de resultados_banco del estudiante. Se incluyen todos los intentos únicos por tabla e ID, con el filtro de fecha del perfil. Se usan respuestas guardadas cuando existen; en históricos monomateria, correctas e incorrectas explícitas. Sus claves no pueden verificarse retrospectivamente. En banco, las omisiones históricas son total − correctas − incorrectas.'));
    note.append(el('p','Se excluyen intentos mixtos o sin materia identificable, recuentos incompletos y detalles no válidos. No se reparten errores de exámenes mixtos: las instantáneas actuales no guardan materia por pregunta. Juegos, visitas y repasos de flashcards no se cuentan. Salud Pública corresponde también al código del catálogo Educación en Salud e Investigación.'));
    section.append(note);return section;
  }
  root.AdminSubjectErrors.render=render;
})(typeof window==='undefined'?globalThis:window);
