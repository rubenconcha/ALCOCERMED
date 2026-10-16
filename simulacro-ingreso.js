'use strict';
(() => {
    const formats = {
        full: { title: 'Simulacro 7', minutes: 100, split: [50, 30, 20], scope: 'final', demo: true },
        'premium-full': { title: 'Simulacro 8', minutes: 100, split: [50, 30, 20], curatedId: 'final-8', scope: 'final' },
        'morfo-sangre': { title: 'Sangre · Morfofunción', minutes: 40, split: [40, 0, 0], topic: 'sangre', examName: 'Práctica bibliográfica - Morfofunción - Sangre (40 preguntas)' },
        'blood-depth-simulation': { title: 'Sangre · Casos razonados', minutes: 8, split: [6, 0, 0], topic: 'sangre', depthSet: 'simulation' },
        'blood-depth-evaluation': { title: 'Sangre · Autoevaluación de mecanismos', minutes: 8, split: [6, 0, 0], topic: 'sangre', depthSet: 'evaluation' },
        'senses-depth-simulation': { title: 'Sentidos · Casos razonados', minutes: 8, split: [6, 0, 0], topic: 'organos de los sentidos', depthSet: 'simulation' },
        'senses-depth-evaluation': { title: 'Sentidos · Autoevaluación de mecanismos', minutes: 8, split: [6, 0, 0], topic: 'organos de los sentidos', depthSet: 'evaluation' },
        'morfo-sentidos': { title: 'Órganos de los sentidos · Morfofunción', minutes: 40, split: [40, 0, 0], topic: 'organos de los sentidos', examName: 'Práctica bibliográfica - Morfofunción - Órganos de los sentidos (40 preguntas)' }
    };
    const subjects = ['MORFOFUNCION', 'BIOLOGIA CELULAR', 'SALUD PUBLICA'];
    let selected = 'full';
    let demoPromise;
    let launchRequest = 0;
    const formatFor = key => formats[key] || window.EntranceLibrary?.format(key);
    const requiresPlan = format => !format.demo && !format.free;

    const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
    const validQuestion = row =>
        row && String(campo(row, 'pregunta') || '').trim() &&
        ['A', 'B', 'C', 'D'].includes(normalized(campo(row, 'respuesta_correcta'))) &&
        ['a', 'b', 'c', 'd'].every(letter => String(campo(row, 'opcion_' + letter) || '').trim());

    async function demoQuestions() {
        if (!demoPromise) demoPromise = fetch('/content/simulacros_demo_2026.json?v=2', { cache: 'no-cache' })
            .then(response => { if (!response.ok) throw new Error('No se pudo cargar el simulacro de prueba.'); return response.json(); })
            .catch(error => { demoPromise = null; throw error; });
        return demoPromise;
    }

    function verifyDistribution(rows, format) {
        const total = format.split.reduce((sum, count) => sum + count, 0);
        if (rows.length !== total || new Set(rows.map(row => normalized(campo(row, 'pregunta')))).size !== total ||
            subjects.some((subject, index) => rows.filter(row => normalized(campo(row, 'materia')) === subject).length !== format.split[index]) ||
            rows.some(row => !validQuestion(row))) {
            throw new Error('Este simulacro no tiene la distribución completa. Intenta de nuevo.');
        }
    }

    async function loadQuestions(format) {
        if (format.curatedId) {
            const session=(await getSupabase().auth.getSession()).data.session;
            if(!session?.access_token)throw new Error('Vuelve a iniciar sesión.');
            const response=await fetch('/api/simulation?id='+encodeURIComponent(format.curatedId),{headers:{Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(15000)});
            if(response.status===403){CampusAccess.unlock();return null;}
            if(!response.ok)throw new Error('No pudimos abrir este simulacro. Reintenta.');
            const paper=await response.json(),current=(await getSupabase().auth.getSession()).data.session;
            if(current?.access_token!==session.access_token||CampusAccess.isFree())throw new Error('Tu sesión cambió. Vuelve a abrir el simulacro.');
            if(paper.id!==format.curatedId||!SimulationScope.validate(paper,format.scope))throw new Error('El contenido no corresponde al parcial elegido.');
            return paper.questions;
        }
        if (format.pastId) {
            const session = (await getSupabase().auth.getSession()).data.session;
            if (!session?.access_token) throw new Error('Vuelve a iniciar sesión para abrir el examen.');
            const response = await fetch('/api/past-exam?id='+encodeURIComponent(format.pastId), {headers:{Authorization:'Bearer '+session.access_token},cache:'no-store',signal:AbortSignal.timeout(15000)});
            if (response.status===403) { CampusAccess.unlock(); return null; }
            if (!response.ok) throw new Error('No pudimos cargar el examen real. Comprueba tu sesión y vuelve a intentar.');
            const paper=await response.json();
            const current=(await getSupabase().auth.getSession()).data.session;
            if(current?.access_token!==session.access_token || (requiresPlan(format)&&CampusAccess.isFree())) throw new Error('Tu sesión cambió. Vuelve a abrir el examen.');
            if(paper.id!==format.pastId || paper.type!==format.type || paper.duration!==100 || paper.questions?.length!==100 || new Set(paper.questions.map(q=>q.numero_original)).size!==100 || paper.questions.some(q=>!q.pregunta||!['a','b','c','d'].every(l=>q['opcion_'+l])||!q.respuestas_aceptadas?.length)) throw new Error('El examen no contiene las 100 preguntas originales completas.');
            return paper.questions;
        }
        if (format.demo) {
            const bank = await demoQuestions();
            const rows = bank.full;
            verifyDistribution(rows, format);
            if(!SimulationScope.validate({scope:'final',duration:100,questions:rows},'final'))throw new Error('El simulacro no cumple la distribución 50/30/20 o el temario.');
            return rows;
        }
        if (CampusAccess.isFree()) { CampusAccess.unlock(); return null; }
        if (format.depthSet) {
            const rows = await StudyAssessments.load(format.topic, format.depthSet);
            verifyDistribution(rows, format);
            if (rows.some(row => normalized(campo(row, 'tema')) !== normalized(format.topic))) throw new Error('La prueba contiene otro tema.');
            return rows;
        }
        if (format.examName) {
            const { data, error } = await getSupabase().from('simulacros').select('*')
                .eq('nombre', format.examName).order('numero_pregunta', { ascending: true });
            if (error) throw error;
            const rows = data || [];
            verifyDistribution(rows, format);
            if (rows.some(row => normalized(campo(row, 'tema')) !== normalized(format.topic))) {
                throw new Error('El simulacro contiene preguntas de otro tema. Intenta de nuevo.');
            }
            return rows;
        }
        throw new Error('Este formato de simulacro no está disponible.');
    }

    window.selectEntranceExam = function (key) {
        const format = formatFor(key);
        if (!format) return;
        if (requiresPlan(format) && CampusAccess.isFree()) return CampusAccess.unlock();
        ++launchRequest;
        selected = key;
        Object.keys(formats).forEach(id => {
            const button = document.getElementById('entrance-' + id);
            if (!button) return;
            button.classList.toggle('is-selected', id === selected);
            button.setAttribute('aria-pressed', String(id === selected));
        });
        document.getElementById('entrance-selected-name').textContent = format.title;
        document.getElementById('entrance-selected-detail').textContent =
            `${(format.pastId || format.curatedId) ? 100 : format.split.reduce((sum, n) => sum + n, 0)} preguntas · ${format.minutes} minutos`;
        document.getElementById('sim-start-btn').disabled=false;
        window.EntranceLibrary?.markSelected(key);
    };
    window.getSelectedEntranceExam=()=>selected;
    window.clearEntranceExam=function(){selected=null;++launchRequest;document.getElementById('entrance-selected-name').textContent='Elige una prueba';document.getElementById('entrance-selected-detail').textContent='Selecciona una tarjeta del catálogo para comenzar.';document.getElementById('sim-start-btn').disabled=true;};
    window.startTopicAssessment=async function(key){
        if(!formats[key] || formats[key].demo)return;
        if(CampusAccess.isFree())return CampusAccess.unlock();
        showScreen('simulacro-screen');selectEntranceExam(key);await window.iniciarSimulacro();
    };

    window.openSimulacro = function () {
        if (simState.timerInterval) {
            if (!confirm('Hay un simulacro en curso. ¿Deseas descartarlo?')) return;
            clearInterval(simState.timerInterval);
            simState.timerInterval = null;
        }
        simState.finalized = false; simState.mode = 'oficial'; simState.pastExamId = null;
        simState.strictTiming = false; simState.entranceOrigin = false;
        document.getElementById('sim-another-exam').textContent = 'Nuevo simulacro';
        document.getElementById('past-result-tools').hidden = true;
        showSimScreen('sim-config');
        showScreen('simulacro-screen');
        window.clearEntranceExam();
        window.EntranceLibrary?.open();
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('overlay').classList.remove('active');
        }
    };

    window.iniciarSimulacro = async function () {
        const format = formatFor(selected);
        if (!format) return showToast('Elige una prueba del catálogo.', 'info');
        if (requiresPlan(format) && CampusAccess.isFree()) return CampusAccess.unlock();
        const request=++launchRequest,account=typeof currentUser==='undefined'?null:currentUser?.id;
        const button = document.getElementById('sim-start-btn');
        button.disabled = true;
        button.textContent = 'Preparando preguntas…';
        try {
            const rows = await loadQuestions(format);
            if (!rows || request!==launchRequest || (typeof currentUser==='undefined'?null:currentUser?.id)!==account || (typeof currentCampusScreen!=='undefined'&&currentCampusScreen!=='simulacro-screen')) return;
            simState.mode = (format.pastId || format.curatedId) ? 'pasado' : 'oficial';
            simState.pastExamId = format.pastId || null;
            simState.strictTiming = Boolean(format.pastId || format.curatedId);
            simState.entranceOrigin = Boolean(format.pastId || format.curatedId);
            document.getElementById('sim-another-exam').textContent = format.pastId ? 'Elegir otro simulacro' : 'Nuevo simulacro';
            document.getElementById('past-result-tools').hidden=true;
            simState.selectedExamen = format.title;
            simState._oficialesCache = [{ nombre: format.title, materia: format.topic ? 'MORFOFUNCION' : 'INTEGRAL' }];
            simState.duracion = format.minutes;
            simState.nPreguntas = rows.length;
            simState.preguntas = rows;
            simState.answers = rows.map(() => ({ selected: null }));
            simState.currentIdx = 0;
            simState.finalized = false;
            simState.independentScope = Boolean(format.topic);
            document.getElementById('sim-review-list')?.replaceChildren();
            simState.secondsLeft = format.minutes * 60;
            simState.startTimestamp = Date.now();
            simState.endTimestamp = simState.startTimestamp + simState.secondsLeft * 1000;
            document.getElementById('sim-exam-materia').textContent = format.title;
            document.getElementById('sim-exam-nq-info').textContent = rows.length + ' preguntas';
            document.getElementById('sim-total-num').textContent = rows.length;
            buildSimCircles();
            showSimScreen('sim-exam');
            renderSimQuestion();
            startSimTimer();
        } catch (error) {
            console.error('[Simulacro]', error);
            showToast(error.message || 'No se pudo preparar el simulacro.', 'error');
        } finally {
            button.disabled = !selected;
            button.innerHTML = '<i class="fas fa-play"></i> Comenzar';
        }
    };

    window.renderEntranceBreakdown = function () {
        const root = document.getElementById('sim-subject-breakdown');
        if (!root) return;
        root.replaceChildren();
        if (simState.mode === 'pasado') return;
        subjects.forEach((subject, index) => {
            const entries = simState.preguntas.map((row, questionIndex) => ({ row, questionIndex }))
                .filter(entry => normalized(campo(entry.row, 'materia')) === subject);
            if (!entries.length) return;
            const correct = entries.filter(({ row, questionIndex }) =>
                'ABCD'[simState.answers[questionIndex].selected] === normalized(campo(row, 'respuesta_correcta'))).length;
            const box = document.createElement('div');
            const label = document.createElement('span');
            const number = document.createElement('strong');
            label.textContent = ['Morfofunción', 'Biología celular', 'Educación para la Vida'][index];
            number.textContent = `${correct} / ${entries.length}`;
            box.append(label, number);
            root.append(box);
        });
    };
})();
