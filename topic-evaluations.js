'use strict';
(() => {
    const $ = id => document.getElementById(id);
    let catalogPromise, request = 0, loading = false;
    const labels = {'MORFOFUNCION':'Morfofunción','BIOLOGIA CELULAR':'Biología celular','SALUD PUBLICA':'Educación en Salud e Investigación'};
    async function catalog() {
        if (!catalogPromise) catalogPromise = fetch('/content/topic-evaluations/catalog.json?v=1')
            .then(r => { if (!r.ok) throw new Error('No se pudo cargar la lista de evaluaciones.'); return r.json(); })
            .catch(error => { catalogPromise = null; throw error; });
        return catalogPromise;
    }
    async function render() {
        const data = await catalog();
        const subject = $('topic-eval-subject').value;
        const query = $('topic-eval-search').value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
        const exams = data.exams.filter(exam => (!subject || subject === exam.subject) &&
            (exam.title+' '+exam.topic).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query));
        const grid = $('topic-eval-grid'); grid.replaceChildren();
        $('topic-eval-count').textContent = exams.length + ' evaluaciones';
        $('topic-eval-status').textContent = exams.length ? '' : 'No hay temas que coincidan con tu búsqueda.';
        exams.forEach(exam => {
            const card = document.createElement('article'); card.className = 'past-card';
            const eyebrow = document.createElement('span'); eyebrow.className = 'entrance-eyebrow'; eyebrow.textContent = labels[exam.subject] + ' · Tema ' + exam.number;
            const title = document.createElement('h3'); title.textContent = exam.title;
            const count = document.createElement('p'); count.textContent = exam.count + ' preguntas · ' + exam.duration + ' minutos';
            const note = document.createElement('p'); note.className = 'past-card-note'; note.textContent = exam.source + ' · Fuente por pregunta al finalizar.';
            const button = document.createElement('button'); button.type='button';button.className='btn-primary';
            button.textContent = window.CampusAccess?.isFree() ? 'Desbloquear evaluación' : 'Realizar evaluación →';
            button.addEventListener('click', () => start(exam, button));
            card.append(eyebrow,title,count,note,button);grid.append(card);
        });
    }
    const originalOpen = window.openEvaluacion;
    window.openEvaluacion = function() {
        originalOpen();
        // showScreen may retain the current exam when its discard dialog is cancelled.
        if (currentCampusScreen !== 'evaluacion-screen') return;
        ++request;
        $('topic-eval-status').textContent='Cargando evaluaciones…';
        render().catch(error => { $('topic-eval-status').textContent=error.message; });
    };
    async function start(exam, button) {
        if (loading) return;
        if (!window.CampusAccess || CampusAccess.isFree()) return window.CampusAccess?.unlock();
        const number=++request, account=currentUser?.id;
        loading=true;button.disabled=true;button.textContent='Preparando evaluación…';
        try {
            const session=(await getSupabase().auth.getSession()).data.session;
            if (!session?.access_token) throw new Error('Vuelve a iniciar sesión para abrir la evaluación.');
            const response=await fetch('/api/topic-evaluation?id='+encodeURIComponent(exam.id),{
                headers:{Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(15000)
            });
            if(response.status===403){CampusAccess.unlock();return;}
            if(!response.ok)throw new Error(response.status===401?'Tu sesión venció. Vuelve a iniciar sesión.':'No se pudo cargar la evaluación. Intenta de nuevo.');
            const paper=await response.json();
            const liveSession=(await getSupabase().auth.getSession()).data.session;
            if(number!==request||account!==currentUser?.id||liveSession?.access_token!==session.access_token||currentCampusScreen!=='evaluacion-screen'||CampusAccess.isFree())return;
            if(paper.id!==exam.id||paper.questions.length!==exam.count)throw new Error('El contenido recibido no corresponde a este tema.');
            simState.mode='tema';simState.selectedMateria=exam.subject;simState.selectedExamen='Evaluación: '+exam.title;
            simState.topicEvaluationId=exam.id;simState.pastExamId=null;simState.strictTiming=true;simState.entranceOrigin=false;simState.independentScope=null;
            simState.duracion=paper.duration;simState.nPreguntas=paper.questions.length;simState.preguntas=paper.questions;
            simState.answers=paper.questions.map(()=>({selected:null}));simState.currentIdx=0;simState.finalized=false;
            simState.secondsLeft=paper.duration*60;simState.startTimestamp=Date.now();simState.endTimestamp=Date.now()+simState.secondsLeft*1000;
            $('sim-exam-materia').textContent=simState.selectedExamen;
            $('sim-exam-nq-info').textContent=paper.count+' preguntas';$('sim-total-num').textContent=paper.count;
            $('sim-another-exam').textContent='Elegir otra evaluación';
            $('past-result-tools').hidden=true;$('past-pattern-image').hidden=true;
            showScreen('simulacro-screen');showSimScreen('sim-exam');buildSimCircles();renderSimQuestion();startSimTimer();
        } catch(error) {showToast(error.message,'error');}
        finally {loading=false;button.disabled=false;button.textContent='Realizar evaluación →';}
    }
    const returnToSelection=window.returnToExamSelection;
    window.returnToExamSelection=function(){
        if(simState.mode==='tema'){
            if(campusScreenHistory.at(-1)==='evaluacion-screen')campusScreenHistory.pop();
            currentCampusScreen='evaluacion-screen';
            window.openEvaluacion();
        }else returnToSelection();
    };
    $('topic-eval-subject').addEventListener('change',()=>render().catch(error=>{$('topic-eval-status').textContent=error.message;}));
    $('topic-eval-search').addEventListener('input',()=>render().catch(error=>{$('topic-eval-status').textContent=error.message;}));
    window.addEventListener('campus-access-change',()=>{++request;if(currentCampusScreen==='evaluacion-screen')render().catch(()=>{});});
})();
