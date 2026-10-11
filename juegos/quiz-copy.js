// Correcciones editoriales de preguntas heredadas. Solo cambia el texto visible:
// los IDs, las opciones originales y sus respuestas correctas permanecen intactos.
(function (root) {
    'use strict';

    var spelling = {
        anatomia: 'anatomía', fisiologia: 'fisiología', funcion: 'función', funciones: 'funciones',
        organo: 'órgano', organos: 'órganos', celula: 'célula', celulas: 'células',
        nucleo: 'núcleo', nucleolo: 'nucléolo', proteina: 'proteína', proteinas: 'proteínas',
        lipido: 'lípido', lipidos: 'lípidos', acido: 'ácido', acidos: 'ácidos',
        quimica: 'química', quimico: 'químico', quimicos: 'químicos', composicion: 'composición',
        solucion: 'solución', soluciones: 'soluciones', acida: 'ácida', acidas: 'ácidas',
        aparicion: 'aparición', dano: 'daño', danos: 'daños', teoria: 'teoría',
        molecula: 'molécula', moleculas: 'moléculas', microscopia: 'microscopía',
        ionico: 'iónico', ionica: 'iónica', glandula: 'glándula', glandulas: 'glándulas',
        somatico: 'somático', somatica: 'somática', vesicula: 'vesícula', vesiculas: 'vesículas',
        electrica: 'eléctrica', electrico: 'eléctrico', electronica: 'electrónica', electron: 'electrón',
        mecanica: 'mecánica', unico: 'único', unica: 'única', aerobico: 'aeróbico',
        fasciculo: 'fascículo', fasciculos: 'fascículos', axon: 'axón',
        glandular: 'glandular', glia: 'glía', microglia: 'microglía', neuroglia: 'neuroglía',
        ventriculo: 'ventrículo', ventriculos: 'ventrículos', glucagon: 'glucagón',
        etica: 'ética', razon: 'razón', guia: 'guía', particulas: 'partículas',
        numericas: 'numéricas', genica: 'génica', asimetria: 'asimetría',
        toracica: 'torácica', toracicas: 'torácicas', epifisaria: 'epifisaria',
        nicotinico: 'nicotínico', muscarinico: 'muscarínico', sinaptica: 'sináptica',
        adrenergico: 'adrenérgico', adrenergica: 'adrenérgica', aortica: 'aórtica',
        sistolico: 'sistólico', foliculos: 'folículos', coagulo: 'coágulo', tapon: 'tapón',
        vestibulo: 'vestíbulo', estimulo: 'estímulo', estimulos: 'estímulos',
        cefalica: 'cefálica', pelvica: 'pélvica', epigastrica: 'epigástrica',
        hipogastrica: 'hipogástrica', cigomatico: 'cigomático', esplacnico: 'esplácnico',
        hematoencefalica: 'hematoencefálica', encefalico: 'encefálico',
        utriculo: 'utrículo', saculo: 'sáculo', sistemico: 'sistémico',
        postsinaptico: 'postsináptico', postsinaptica: 'postsináptica',
        estatico: 'estático', oncotica: 'oncótica', isovolumetrica: 'isovolumétrica',
        hidrostatica: 'hidrostática', venula: 'vénula', organicos: 'orgánicos',
        trafico: 'tráfico', catalitica: 'catalítica', macroscopica: 'macroscópica',
        meteorologia: 'meteorología', terapeutico: 'terapéutico', osmotica: 'osmótica',
        anfipaticos: 'anfipáticos', hidrofobico: 'hidrofóbico',
        antagonicas: 'antagónicas', tipicos: 'típicos', tipico: 'típico', tipica: 'típica',
        colinergica: 'colinérgica', mielinica: 'mielínica', amielinica: 'amielínica',
        enterico: 'entérico', tonico: 'tónico', fasico: 'fásico', corpusculos: 'corpúsculos',
        timpanica: 'timpánica', ciclico: 'cíclico', plasmaticas: 'plasmáticas',
        elasticas: 'elásticas', fagocitica: 'fagocítica', linfaticos: 'linfáticos',
        radiologia: 'radiología', cirugia: 'cirugía', exploracion: 'exploración',
        diagnostico: 'diagnóstico', clinico: 'clínico', clinica: 'clínica',
        diseccion: 'disección', disecciones: 'disecciones', cadaveres: 'cadáveres',
        clasificacion: 'clasificación', medico: 'médico', medicos: 'médicos',
        histologia: 'histología', citologia: 'citología', historico: 'histórico', historicos: 'históricos',
        anatomicas: 'anatómicas', anatomicos: 'anatómicos', tradicion: 'tradición', dogmatica: 'dogmática',
        hipotetico: 'hipotético', deductivo: 'deductivo', prediccion: 'predicción',
        conclusion: 'conclusión', memorizacion: 'memorización', supersticion: 'superstición',
        revision: 'revisión', estadistico: 'estadístico', estadistica: 'estadística',
        variacion: 'variación', evolucion: 'evolución', realizo: 'realizó',
        acelero: 'aceleró', ayudo: 'ayudó', abrio: 'abrió', descubrio: 'descubrió',
        biologica: 'biológica', biologico: 'biológico', biologia: 'biología',
        microscopico: 'microscópico', microscopica: 'microscópica', farmacologico: 'farmacológico',
        genetica: 'genética', genetico: 'genético', cromosomica: 'cromosómica',
        transcripcion: 'transcripción', traduccion: 'traducción', replicacion: 'replicación',
        reparacion: 'reparación', regulacion: 'regulación', glicosilacion: 'glicosilación',
        difusion: 'difusión', osmosis: 'ósmosis', endocitosis: 'endocitosis',
        sintetica: 'sintética', sintesis: 'síntesis', degradacion: 'degradación',
        membrana: 'membrana', plasmatica: 'plasmática', citoplasmatica: 'citoplasmática',
        senal: 'señal', senales: 'señales', senalado: 'señalado', senalada: 'señalada',
        senalados: 'señalados', senaladas: 'señaladas', senalizacion: 'señalización',
        peptido: 'péptido', peptidos: 'péptidos', codon: 'codón', codones: 'codones',
        microtubulos: 'microtúbulos', organulo: 'orgánulo', organulos: 'orgánulos',
        musculo: 'músculo', musculos: 'músculos', oseo: 'óseo', osea: 'ósea',
        corazon: 'corazón', cardiaco: 'cardíaco', cardiaca: 'cardíaca',
        pulmon: 'pulmón', medula: 'médula', raices: 'raíces', raiz: 'raíz',
        raquideo: 'raquídeo', raquidea: 'raquídea', anatomico: 'anatómico', anatomica: 'anatómica',
        craneo: 'cráneo', craneales: 'craneales', trigemino: 'trigémino',
        optico: 'óptico', optica: 'óptica', audicion: 'audición', vision: 'visión',
        simpatico: 'simpático', simpatica: 'simpática', parasimpatico: 'parasimpático',
        parasimpatica: 'parasimpática', autonomo: 'autónomo', autonoma: 'autónoma',
        accion: 'acción', conduccion: 'conducción', contraccion: 'contracción',
        presion: 'presión', saturacion: 'saturación', coagulacion: 'coagulación',
        sistolica: 'sistólica', diastolica: 'diastólica', oxigeno: 'oxígeno',
        hemostasia: 'hemostasia', valvulas: 'válvulas', oxigenacion: 'oxigenación',
        energia: 'energía', metabolica: 'metabólica', metabolismo: 'metabolismo',
        caracteristica: 'característica', caracteristicas: 'características',
        basica: 'básica', basicas: 'básicas', basico: 'básico', basicos: 'básicos',
        metodo: 'método', metodos: 'métodos', cientifico: 'científico',
        hipotesis: 'hipótesis', evaluacion: 'evaluación', investigacion: 'investigación',
        introduccion: 'introducción', definicion: 'definición', medicion: 'medición',
        observacion: 'observación', informacion: 'información', recoleccion: 'recolección',
        interpretacion: 'interpretación', tabulacion: 'tabulación', identificacion: 'identificación',
        justificacion: 'justificación', delimitacion: 'delimitación', seleccion: 'selección',
        inclusion: 'inclusión', exclusion: 'exclusión', poblacion: 'población',
        distribucion: 'distribución', aplicacion: 'aplicación', participacion: 'participación',
        promocion: 'promoción', prevencion: 'prevención', atencion: 'atención',
        rehabilitacion: 'rehabilitación', intervencion: 'intervención',
        politica: 'política', politicas: 'políticas', epidemiologia: 'epidemiología',
        epidemiologica: 'epidemiológica', teorico: 'teórico', teorica: 'teórica',
        metodologico: 'metodológico', metodologica: 'metodológica',
        diseno: 'diseño', disenos: 'diseños', tecnica: 'técnica', tecnicas: 'técnicas',
        analisis: 'análisis', analitico: 'analítico', analitica: 'analítica',
        sistematico: 'sistemático', sistematica: 'sistemática',
        numero: 'número', tamano: 'tamaño', mas: 'más', cuales: 'cuáles', cual: 'cuál',
        region: 'región', regiones: 'regiones', via: 'vía', vias: 'vías',
        union: 'unión', division: 'división', categorias: 'categorías', categoria: 'categoría',
        lipidica: 'lipídica', lipidico: 'lipídico', esqueletico: 'esquelético', esqueletica: 'esquelética',
        segun: 'según', capitulo: 'capítulo', practico: 'práctico', practica: 'práctica'
    };

    function preserveCase(original, corrected) {
        if (original === original.toUpperCase()) return corrected.toUpperCase();
        if (original.charAt(0) === original.charAt(0).toUpperCase()) {
            return corrected.charAt(0).toUpperCase() + corrected.slice(1);
        }
        return corrected;
    }

    function fixSpelling(text) {
        var corrected = text.replace(/(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])([A-Za-z]+)(?=$|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g,
            function (whole, before, word) {
                var lower = word.toLowerCase();
                var replacement = spelling[lower];
                if (!replacement && /(?:cion|sion)$/.test(lower)) {
                    replacement = lower.replace(/cion$/, 'ción').replace(/sion$/, 'sión');
                }
                return before + (replacement ? preserveCase(word, replacement) : word);
            });
        // «publico» también puede ser el verbo «publicó»: corregir el adjetivo solo en contexto.
        corrected = corrected.replace(/\b(salud|política|políticas|sector|servicio|servicios|sistema|sistemas) (publica|publicas|publico|publicos)\b/gi,
            function (whole, noun, adjective) {
                var accented = { publica: 'pública', publicas: 'públicas', publico: 'público', publicos: 'públicos' }[adjective.toLowerCase()];
                return noun + ' ' + preserveCase(adjective, accented);
            });
        corrected = corrected.replace(/\bpublico ilustraciones\b/gi, 'publicó ilustraciones');
        return corrected;
    }

    function asQuestion(phrase) {
        var clean = phrase.trim().replace(/[.:?]+$/, '');
        return '¿Qué concepto se describe aquí: «' + clean.charAt(0).toLowerCase() + clean.slice(1) + '»?';
    }

    function formatQuizCopy(raw, kind) {
        var text = String(raw == null ? '' : raw).trim();
        if (kind === 'question') {
            text = text.replace(/^En\s+Tema\s+\d+\s*:\s*.+?,\s*identifica\s+el\s+concepto\s+relacionado\s+con\s*:\s*(.+)$/i,
                function (_, concept) { return asQuestion(concept); });
            text = text.replace(/^En\s+el\s+cap[ií]tulo\s+\d+\s*,\s*(.+?)\s+se\s+relaciona\s+mejor\s+con\s*:\s*$/i,
                function (_, concept) { return '¿Con qué se relaciona mejor ' + concept.charAt(0).toLowerCase() + concept.slice(1) + '?'; });
            text = text.replace(/^(?:Seg[uú]n\s+el\s+tema\s+\d+|Seg[uú]n\s+el\s+cap[ií]tulo\s+\d+)\s*,\s*/i, '');
            text = text.replace(/^Cap[ií]tulo\s+\d+\s+imagen\s*:\s*/i, '');
            text = text.replace(/^En\s+el\s+cap[ií]tulo\s+\d+\s*,\s*/i, '');
            text = text.replace(/\s+(?:del|en\s+el)\s+cap[ií]tulo(?:\s+\d+)?(?=[.,:!?]|$)/gi, '');
            text = text.replace(/\s+(?:descrit[oa]s?|destacad[oa]s?)\s+en\s+el\s+tema(?=[.,:!?]|$)/gi, '');
            text = text.replace(/^Selecciona\s+pares\s+correctos\s+del\s+tema\.?$/i, 'Selecciona los pares correctos.');
            text = text.replace(/^Selecciona\s+conceptos\s+(?:centrales|introductorios)\s+del\s+cap[ií]tulo\.?$/i, 'Selecciona los conceptos correctos.');
            text = text.replace(/^Relaciona\s+(?:conceptos\s+del\s+cap[ií]tulo|etiquetas\s+del\s+tema)\.?$/i, 'Relaciona cada concepto con su imagen.');
            text = text.replace(/^Selecciona\s+componentes\s+relevantes\s+para\s+el\s+examen\s+parcial\.?$/i, 'Selecciona los componentes correctos.');
            text = text.replace(/^la anatom[ií]a se ocupa principalmente de:$/i, '¿De qué se ocupa principalmente la anatomía?');
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        return fixSpelling(text);
    }

    root.formatQuizCopy = formatQuizCopy;
    if (typeof module !== 'undefined' && module.exports) module.exports = formatQuizCopy;
})(typeof window !== 'undefined' ? window : globalThis);
