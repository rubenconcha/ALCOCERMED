'use strict';
(() => {
    const $ = id => document.getElementById(id);
    const subjectFilter = $('topic-eval-subject');
    const topicFilter = $('topic-eval-search');
    let catalogPromise, request = 0, loading = 0, topicId = '';
    const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const questionCount = count => count + (count === 1 ? ' pregunta' : ' preguntas');
    async function catalog() {
        if (!catalogPromise) catalogPromise = fetch('/api/topic-evaluation?id=catalogo')
            .then(r => { if (!r.ok) throw new Error('No se pudo cargar la lista de evaluaciones.'); return r.json(); })
            .catch(error => { catalogPromise = null; throw error; });
        return catalogPromise;
    }
    async function render() {
        const data = await catalog();
        if (currentCampusScreen !== 'evaluacion-screen') return;
        const requested = topicId ? data.exams.find(exam => exam.id === topicId) : null;
        if (requested) {
            subjectFilter.value = requested.subject;
            topicFilter.value = requested.title;
        }
        const query = normalize(topicFilter.value);
        const exams = topicId
            ? (requested ? [requested] : [])
            : data.exams.filter(exam => (!subjectFilter.value || subjectFilter.value === exam.subject) &&
                normalize([exam.title, exam.topic, exam.subjectLabel, exam.source, exam.number && 'Tema ' + exam.number].filter(Boolean).join(' ')).includes(query));
        const grid = $('topic-eval-grid'); grid.replaceChildren();
        $('topic-eval-count').textContent = exams.length + (exams.length === 1 ? ' evaluación' : ' evaluaciones');
        $('topic-eval-status').textContent = exams.length ? '' : 'No hay temas que coincidan con tu búsqueda.';
        exams.forEach(exam => {
            const card = document.createElement('article'); card.className = 'past-card';
            const eyebrow = document.createElement('span'); eyebrow.className = 'entrance-eyebrow';
            eyebrow.textContent = exam.subjectLabel + (exam.number ? ' · Tema ' + exam.number : ' · Suficiencia académica');
            const title = document.createElement('h3'); title.textContent = exam.title;
            const count = document.createElement('p'); count.textContent = questionCount(exam.count) + ' · ' + exam.duration + ' minutos';
            const note = document.createElement('p'); note.className = 'past-card-note'; note.textContent = exam.source + ' · Fuente por pregunta al finalizar.';
            const button = document.createElement('button'); button.type='button';button.className='btn-primary';
            button.textContent = window.CampusAccess?.isFree() ? 'Desbloquear evaluación' : 'Realizar evaluación →';
            button.addEventListener('click', () => start(exam, button));
            card.append(eyebrow,title,count,note,button);grid.append(card);
        });
    }
    const originalOpen = window.openEvaluacion;
    window.openEvaluacion = function(requestedTopicId) {
        originalOpen();
        // showScreen may retain the current exam when its discard dialog is cancelled.
        if (currentCampusScreen !== 'evaluacion-screen') return;
        ++request; loading = 0;
        if (typeof requestedTopicId === 'string') {
            topicId = requestedTopicId;
            $('topic-eval-grid').replaceChildren();
            $('topic-eval-count').textContent = '';
        }
        $('topic-eval-status').textContent='Cargando evaluaciones…';
        return render().catch(error => { $('topic-eval-status').textContent=error.message; });
    };
    async function start(exam, button, assigned) {
        if (loading) return;
        if (!window.CampusAccess || CampusAccess.isFree()) return window.CampusAccess?.unlock();
        const number=++request, account=currentUser?.id;
        const label = button.textContent;
        const isCurrent = () => number === request && account === currentUser?.id && !CampusAccess.isFree()
            && (assigned ? assigned.isCurrent() : currentCampusScreen === 'evaluacion-screen');
        loading=number;button.disabled=true;button.textContent='Preparando evaluación…';
        try {
            const session=(await getSupabase().auth.getSession()).data.session;
            if (!session?.access_token || session.user?.id !== account) throw new Error('Vuelve a iniciar sesión para abrir la evaluación.');
            if (!isCurrent()) return;
            const response=await fetch('/api/topic-evaluation?id='+encodeURIComponent(exam.id),{
                headers:{Authorization:'Bearer '+session.access_token},cache:'no-store',
                signal: assigned ? AbortSignal.any([assigned.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000)
            });
            if (!isCurrent()) return;
            if(response.status===403){CampusAccess.unlock();return;}
            if(!response.ok)throw new Error(response.status===401?'Tu sesión venció. Vuelve a iniciar sesión.':'No se pudo cargar la evaluación. Intenta de nuevo.');
            const paper=await response.json();
            const liveSession=(await getSupabase().auth.getSession()).data.session;
            if (!isCurrent() || liveSession?.access_token !== session.access_token) return;
            if (paper.id !== exam.id || paper.duration !== exam.duration || paper.questions?.length !== exam.count) {
                throw new Error('El contenido recibido no corresponde a este tema.');
            }
            if ($('sim-passage')?.dataset?.passage) renderPracticePassage('sim', null);
            simState.mode='tema';simState.selectedMateria=exam.subject;simState.selectedExamen='Evaluación: '+exam.title;
            simState.topicEvaluationId=exam.id;simState.pastExamId=null;simState.strictTiming=true;simState.entranceOrigin=false;simState.independentScope=null;
            simState.duracion=paper.duration;simState.nPreguntas=paper.questions.length;simState.preguntas=paper.questions;
            simState.answers=paper.questions.map(()=>({selected:null}));simState.currentIdx=0;simState.finalized=false;
            simState.secondsLeft=paper.duration*60;simState.startTimestamp=Date.now();simState.endTimestamp=Date.now()+simState.secondsLeft*1000;
            $('sim-exam-materia').textContent=simState.selectedExamen;
            $('sim-exam-nq-info').textContent=questionCount(paper.count);$('sim-total-num').textContent=paper.count;
            $('sim-another-exam').textContent=assigned ? 'Volver al horario de evaluación' : 'Elegir otra evaluación';
            $('past-result-tools').hidden=true;$('past-pattern-image').hidden=true;
            if (assigned) assigned.mount();
            else showScreen('simulacro-screen');
            showSimScreen('sim-exam');buildSimCircles();renderSimQuestion();startSimTimer();
        } catch(error) {if (isCurrent()) showToast(error.message,'error');}
        finally {
            if (loading === number) loading = 0;
            button.disabled = false;
            button.textContent = CampusAccess.isFree() ? 'Desbloquear evaluación' : label;
        }
    }
    const returnToSelection=window.returnToExamSelection;
    window.returnToExamSelection=function(){
        if(simState.mode==='tema'){
            if (window.CampusCalendar?.returnFromEvaluation()) return;
            if(campusScreenHistory.at(-1)==='evaluacion-screen')campusScreenHistory.pop();
            currentCampusScreen='evaluacion-screen';
            window.openEvaluacion();
        }else returnToSelection();
    };
    function filterChanged() {
        topicId = '';
        return render().catch(error => { $('topic-eval-status').textContent = error.message; });
    }
    subjectFilter.addEventListener('change', filterChanged);
    topicFilter.addEventListener('input', filterChanged);
    function clear() {
        ++request; loading = 0;
        if (simState.mode !== 'tema') return;
        clearInterval(simState.timerInterval);
        simState.timerInterval = null;
        simState.finalized = true;
        simState.preguntas = [];
        simState.answers = [];
        if ($('sim-passage')?.dataset?.passage) renderPracticePassage('sim', null);
        $('sim-question-text').textContent = '';
        for (const id of ['sim-options', 'sim-circles', 'sim-review-list']) $(id).replaceChildren();
    }
    window.TopicEvaluations = {
        clear,
        describe: async id => (await catalog()).exams.find(exam => exam.id === id),
        startAssigned: start,
    };
    window.addEventListener('campus-access-change', () => {
        if (CampusAccess.isFree()) clear();
        else { ++request; loading = 0; }
        if (currentCampusScreen === 'evaluacion-screen') render().catch(() => {});
    });
})();
