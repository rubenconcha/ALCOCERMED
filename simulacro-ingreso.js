'use strict';
(() => {
    const formats = {
        full: { title: 'Simulacro completo', minutes: 100, split: [50, 30, 20], demo: true },
        mini: { title: 'Mini simulacro', minutes: 50, split: [25, 15, 10], demo: true },
        'premium-full': { title: 'Nuevo simulacro completo', minutes: 100, split: [50, 30, 20] },
        'premium-mini': { title: 'Nuevo mini simulacro', minutes: 50, split: [25, 15, 10] },
        'morfo-sangre': { title: 'Sangre · Morfofunción', minutes: 40, split: [40, 0, 0], topic: 'sangre', examName: 'Práctica bibliográfica - Morfofunción - Sangre (40 preguntas)' },
        'morfo-sentidos': { title: 'Órganos de los sentidos · Morfofunción', minutes: 40, split: [40, 0, 0], topic: 'organos de los sentidos', examName: 'Práctica bibliográfica - Morfofunción - Órganos de los sentidos (40 preguntas)' }
    };
    const subjects = ['MORFOFUNCION', 'BIOLOGIA CELULAR', 'SALUD PUBLICA'];
    let selected = 'full';
    let demoPromise;

    const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
    const validQuestion = row =>
        row && String(campo(row, 'pregunta') || '').trim() &&
        ['A', 'B', 'C', 'D'].includes(normalized(campo(row, 'respuesta_correcta'))) &&
        ['a', 'b', 'c', 'd'].every(letter => String(campo(row, 'opcion_' + letter) || '').trim());

    async function demoQuestions() {
        if (!demoPromise) demoPromise = fetch('/content/simulacros_demo_2026.json', { cache: 'force-cache' })
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
        if (format.demo) {
            const bank = await demoQuestions();
            const rows = format === formats.full ? bank.full : bank.mini;
            verifyDistribution(rows, format);
            return rows;
        }
        if (CampusAccess.isFree()) { CampusAccess.unlock(); return null; }
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
        const demo = await demoQuestions();
        const used = new Set([...demo.full, ...demo.mini].map(row => normalized(row.pregunta)));
        const bank = await fetchAllBancoQuestions();
        const result = [];
        subjects.forEach((subject, index) => {
            const seen = new Set();
            const pool = shuffleArray(bank.filter(row => normalized(campo(row, 'materia')) === subject && validQuestion(row) &&
                !used.has(normalized(campo(row, 'pregunta'))) && !seen.has(normalized(campo(row, 'pregunta'))) &&
                seen.add(normalized(campo(row, 'pregunta')))));
            result.push(...pool.slice(0, format.split[index]));
        });
        verifyDistribution(result, format);
        return result;
    }

    window.selectEntranceExam = function (key) {
        const format = formats[key];
        if (!format) return;
        if (!format.demo && CampusAccess.isFree()) return CampusAccess.unlock();
        selected = key;
        Object.keys(formats).forEach(id => {
            const button = document.getElementById('entrance-' + id);
            if (!button) return;
            button.classList.toggle('is-selected', id === selected);
            button.setAttribute('aria-pressed', String(id === selected));
        });
        document.getElementById('entrance-selected-name').textContent = format.title;
        document.getElementById('entrance-selected-detail').textContent =
            `${format.split.reduce((sum, n) => sum + n, 0)} preguntas · ${format.minutes} minutos`;
    };

    window.openSimulacro = function () {
        if (simState.timerInterval) {
            if (!confirm('Hay un simulacro en curso. ¿Deseas descartarlo?')) return;
            clearInterval(simState.timerInterval);
            simState.timerInterval = null;
        }
        simState.finalized = false; simState.mode = 'oficial'; simState.pastExamId = null;
        document.getElementById('sim-another-exam').textContent = 'Nuevo simulacro';
        document.getElementById('past-result-tools').hidden = true;
        showSimScreen('sim-config');
        showScreen('simulacro-screen');
        selectEntranceExam('full');
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('overlay').classList.remove('active');
        }
    };

    window.iniciarSimulacro = async function () {
        const format = formats[selected];
        if (!format.demo && CampusAccess.isFree()) return CampusAccess.unlock();
        const button = document.getElementById('sim-start-btn');
        button.disabled = true;
        button.textContent = 'Preparando preguntas…';
        try {
            const rows = await loadQuestions(format);
            if (!rows) return;
            simState.mode = 'oficial';
            simState.selectedExamen = format.title;
            simState._oficialesCache = [{ nombre: format.title, materia: format.topic ? 'MORFOFUNCION' : 'INTEGRAL' }];
            simState.duracion = format.minutes;
            simState.nPreguntas = rows.length;
            simState.preguntas = rows;
            simState.answers = rows.map(() => ({ selected: null }));
            simState.currentIdx = 0;
            simState.finalized = false;
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
            button.disabled = false;
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
            label.textContent = ['Morfofunción', 'Biología celular', 'Educación para la Salud'][index];
            number.textContent = `${correct} / ${entries.length}`;
            box.append(label, number);
            root.append(box);
        });
    };
})();
