-- Importa Tema 2 de Morfofuncion (Saladin, Anatomia y Fisiologia) con 30 preguntas visuales.
-- La evaluacion muestra 10 preguntas por intento desde un banco de 30.
-- Tipos incluidos: seleccion unica (mc), seleccion multiple (ms), verdadero/falso (tf) y relacionar sobre imagen (dnd).
--
-- Requisitos:
-- 1) Desplegar la carpeta: juegos/assets/capitulo2-tema2-saladin/
-- 2) Ejecutar este archivo en Supabase SQL Editor.
-- 3) Entrar a Juegos > MORFOFUNCION > "Tema 2 Morfofuncion - La quimica de la vida".

begin;

insert into public.evaluaciones (
  id,
  titulo,
  asignatura,
  nivel,
  idioma,
  visibilidad,
  objetivo,
  codigo,
  publicado,
  created_by,
  created_at,
  updated_at,
  iniciado,
  tema,
  modo_sesion,
  config_juego
) values (
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'Tema 2 Morfofuncion - La quimica de la vida',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Repasar conceptos esenciales del tema 2: atomos, iones, enlaces, agua, pH, energia, reacciones, compuestos organicos, proteinas, enzimas, ATP y acidos nucleicos.',
  'T2MORF',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Tema 2: La quimica de la vida',
  'test',
  '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo,
  asignatura = excluded.asignatura,
  nivel = excluded.nivel,
  idioma = excluded.idioma,
  visibilidad = excluded.visibilidad,
  objetivo = excluded.objetivo,
  codigo = excluded.codigo,
  publicado = excluded.publicado,
  updated_at = now(),
  iniciado = excluded.iniciado,
  tema = excluded.tema,
  modo_sesion = excluded.modo_sesion,
  config_juego = excluded.config_juego;

delete from public.evaluacion_preguntas
where evaluacion_id = 'a19f2789-872e-5f1e-9682-e16448dbee05';

insert into public.evaluacion_preguntas (
  id,
  evaluacion_id,
  tipo,
  texto,
  opciones,
  multiple_correctas,
  orden,
  puntos,
  temporizador
) values
(
  'a1ad1c19-6427-531d-b360-8619d455bf86',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'Cuales son los seis elementos principales que representan cerca del 98.5% del peso corporal?',
  $$[
    {
        "text": "Oxigeno, carbono, hidrogeno, nitrogeno, calcio y fosforo",
        "correct": true,
        "color": "ac-blue"
    },
    {
        "text": "Sodio, cloro, potasio, magnesio, hierro y azufre",
        "correct": false,
        "color": "ac-green"
    },
    {
        "text": "Carbono, sodio, potasio, yodo, zinc y cobre",
        "correct": false,
        "color": "ac-yellow"
    },
    {
        "text": "Calcio, fosforo, hierro, yodo, fluor y selenio",
        "correct": false,
        "color": "ac-pink"
    }
]$$::jsonb,
  false,
  0,
  1,
  45
),
(
  '844e7cc7-7333-53b2-ae52-bea3e1212929',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'dnd',
  'Relaciona cada modelo de Bohr con el elemento correspondiente.',
  $$[
    {
        "text": "Carbono",
        "correct": true,
        "color": "ac-blue",
        "pinX": 12,
        "pinY": 66,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_modelos_bohr.png"
    },
    {
        "text": "Nitrogeno",
        "correct": true,
        "color": "ac-green",
        "pinX": 30,
        "pinY": 67,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_modelos_bohr.png"
    },
    {
        "text": "Sodio",
        "correct": true,
        "color": "ac-yellow",
        "pinX": 51,
        "pinY": 59,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_modelos_bohr.png"
    },
    {
        "text": "Potasio",
        "correct": true,
        "color": "ac-pink",
        "pinX": 79,
        "pinY": 48,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_modelos_bohr.png"
    }
]$$::jsonb,
  false,
  1,
  1,
  60
),
(
  '9856c030-ab33-592a-b108-7eca78af6932',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Selecciona las afirmaciones correctas sobre isotopos y radioisotopos.',
  $$[
    {
        "text": "Los isotopos de un elemento difieren en el numero de neutrones y en su masa atomica",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_isotopos_hidrogeno.png"
    },
    {
        "text": "Los isotopos de un mismo elemento tienen el mismo numero de protones",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_isotopos_hidrogeno.png"
    },
    {
        "text": "Los radioisotopos son inestables y emiten radiacion al degradarse",
        "correct": true,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_isotopos_hidrogeno.png"
    },
    {
        "text": "Los isotopos se diferencian porque cambian su numero atomico",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_isotopos_hidrogeno.png"
    },
    {
        "text": "Todos los isotopos de todos los elementos son radiactivos",
        "correct": false,
        "color": "ac-purple",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_isotopos_hidrogeno.png"
    }
]$$::jsonb,
  true,
  2,
  1,
  55
),
(
  '34b0b7c5-cf31-551b-865f-ff0d13504937',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'En la ionizacion del sodio mostrada en la figura, el ion Na+ se forma porque el sodio:',
  $$[
    {
        "text": "Pierde un electron y queda como cation",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_ionizacion_sodio_cloro.png"
    },
    {
        "text": "Gana un electron y queda como anion",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_ionizacion_sodio_cloro.png"
    },
    {
        "text": "Gana un proton dentro del nucleo",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_ionizacion_sodio_cloro.png"
    },
    {
        "text": "Comparte electrones por igual con el cloro",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_ionizacion_sodio_cloro.png"
    }
]$$::jsonb,
  false,
  3,
  1,
  45
),
(
  '2bb04c02-e258-59ff-afc6-d122b203cba2',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Sobre los electrolitos, selecciona las afirmaciones correctas.',
  $$[
    {
        "text": "Son sustancias que se ionizan en agua",
        "correct": true,
        "color": "ac-blue"
    },
    {
        "text": "Forman soluciones capaces de conducir electricidad",
        "correct": true,
        "color": "ac-green"
    },
    {
        "text": "Son importantes para funciones nerviosas, musculares y equilibrio de agua",
        "correct": true,
        "color": "ac-yellow"
    },
    {
        "text": "No tienen carga y por eso no afectan la actividad electrica corporal",
        "correct": false,
        "color": "ac-pink"
    },
    {
        "text": "Siempre son lipidos organicos insolubles en agua",
        "correct": false,
        "color": "ac-purple"
    }
]$$::jsonb,
  true,
  4,
  1,
  55
),
(
  '40cd43b1-1449-582a-984b-d4b730edd5a1',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'Un enlace covalente se forma principalmente cuando dos atomos:',
  $$[
    {
        "text": "Comparten pares de electrones",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enlaces_covalentes_polares.png"
    },
    {
        "text": "Transfieren completamente electrones de uno a otro",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enlaces_covalentes_polares.png"
    },
    {
        "text": "Se atraen solo por fuerzas de van der Waals",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enlaces_covalentes_polares.png"
    },
    {
        "text": "Pierden todos sus electrones de valencia",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enlaces_covalentes_polares.png"
    }
]$$::jsonb,
  false,
  5,
  1,
  45
),
(
  '042a7b88-1bf7-576b-b570-1b356648c94e',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'tf',
  'Los puentes de hidrogeno son atracciones debiles entre regiones parcialmente positivas y negativas de moleculas polares.',
  $$[
    {
        "text": "Verdadero",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_puentes_hidrogeno_agua.png"
    },
    {
        "text": "Falso",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_puentes_hidrogeno_agua.png"
    }
]$$::jsonb,
  false,
  6,
  1,
  35
),
(
  '9d36c5b5-d767-52dd-98a6-b47287886779',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Que propiedades biologicas importantes del agua se explican por su polaridad y sus puentes de hidrogeno?',
  $$[
    {
        "text": "Capacidad de disolver sustancias polares o cargadas",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_agua_esferas_hidratacion.png"
    },
    {
        "text": "Cohesion y adhesion entre moleculas o superficies",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_agua_esferas_hidratacion.png"
    },
    {
        "text": "Estabilidad termica y alta capacidad calorifica",
        "correct": true,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_agua_esferas_hidratacion.png"
    },
    {
        "text": "Participacion en reacciones como hidrolisis y sintesis por deshidratacion",
        "correct": true,
        "color": "ac-purple",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_agua_esferas_hidratacion.png"
    },
    {
        "text": "Comportamiento completamente no polar e hidrofobo",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_agua_esferas_hidratacion.png"
    }
]$$::jsonb,
  true,
  7,
  1,
  55
),
(
  '37847ca1-caf7-58b9-8288-bf93c8e871dd',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'Una solucion, a diferencia de un coloide o una suspension, se caracteriza porque:',
  $$[
    {
        "text": "El soluto permanece mezclado y sus particulas son demasiado pequenas para dispersar la luz",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_solucion_coloide_suspension.png"
    },
    {
        "text": "Las particulas se sedimentan rapidamente al dejarla reposar",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_solucion_coloide_suspension.png"
    },
    {
        "text": "Siempre contiene celulas visibles suspendidas en plasma",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_solucion_coloide_suspension.png"
    },
    {
        "text": "Sus particulas son tan grandes que no atraviesan ninguna membrana",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_solucion_coloide_suspension.png"
    }
]$$::jsonb,
  false,
  8,
  1,
  45
),
(
  '7d1757f1-4092-5dcf-838a-3d3c22669530',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'dnd',
  'Relaciona cada tipo de mezcla con el tubo correspondiente.',
  $$[
    {
        "text": "Solucion",
        "correct": true,
        "color": "ac-blue",
        "pinX": 18,
        "pinY": 60,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_mezclas_tubos_sin_rotulos.png"
    },
    {
        "text": "Coloide",
        "correct": true,
        "color": "ac-green",
        "pinX": 40,
        "pinY": 60,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_mezclas_tubos_sin_rotulos.png"
    },
    {
        "text": "Suspension",
        "correct": true,
        "color": "ac-yellow",
        "pinX": 64,
        "pinY": 60,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_mezclas_tubos_sin_rotulos.png"
    }
]$$::jsonb,
  false,
  9,
  1,
  55
),
(
  'fe831901-ef66-5e91-ae4a-80fb1b6f2fff',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'La molaridad expresa la concentracion como:',
  $$[
    {
        "text": "Moles de soluto por litro de solucion",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_concentracion_porcentaje_molaridad.png"
    },
    {
        "text": "Gramos de soluto por cada 100 ml de solucion",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_concentracion_porcentaje_molaridad.png"
    },
    {
        "text": "Solo el volumen del solvente sin considerar el soluto",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_concentracion_porcentaje_molaridad.png"
    },
    {
        "text": "La carga electrica total de un ion multiplicada por el pH",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_concentracion_porcentaje_molaridad.png"
    }
]$$::jsonb,
  false,
  10,
  1,
  45
),
(
  '4ec4253d-2aa3-593e-8000-79dbea097612',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'Segun la escala de pH, una solucion con pH menor de 7 se considera:',
  $$[
    {
        "text": "Acida",
        "correct": true,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_escala_ph.png"
    },
    {
        "text": "Neutra",
        "correct": false,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_escala_ph.png"
    },
    {
        "text": "Basica o alcalina",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_escala_ph.png"
    },
    {
        "text": "Sin iones hidrogeno",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_escala_ph.png"
    }
]$$::jsonb,
  false,
  11,
  1,
  40
),
(
  '5eea353d-61a2-53cd-b17c-0fd69b262466',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'dnd',
  'Relaciona cada esquema con la clase de reaccion quimica.',
  $$[
    {
        "text": "Descomposicion",
        "correct": true,
        "color": "ac-pink",
        "pinX": 15,
        "pinY": 48,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reacciones_descomposicion_sintesis_intercambio.png"
    },
    {
        "text": "Sintesis",
        "correct": true,
        "color": "ac-blue",
        "pinX": 47,
        "pinY": 48,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reacciones_descomposicion_sintesis_intercambio.png"
    },
    {
        "text": "Intercambio",
        "correct": true,
        "color": "ac-green",
        "pinX": 81,
        "pinY": 48,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reacciones_descomposicion_sintesis_intercambio.png"
    }
]$$::jsonb,
  false,
  12,
  1,
  60
),
(
  '060dcb11-e7bf-5d11-960e-1725528b0f20',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'La relacion correcta entre catabolismo y anabolismo es:',
  $$[
    {
        "text": "Catabolismo descompone y libera energia; anabolismo sintetiza moleculas y requiere energia",
        "correct": true,
        "color": "ac-blue"
    },
    {
        "text": "Catabolismo siempre sintetiza proteinas; anabolismo siempre degrada glucosa",
        "correct": false,
        "color": "ac-green"
    },
    {
        "text": "Ambos son procesos sin relacion con la energia",
        "correct": false,
        "color": "ac-yellow"
    },
    {
        "text": "Anabolismo y catabolismo son sinonimos de pH acido y pH basico",
        "correct": false,
        "color": "ac-pink"
    }
]$$::jsonb,
  false,
  13,
  1,
  45
),
(
  '7f5fb31c-bc79-5598-913e-daf8ee2512f9',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'dnd',
  'Relaciona cada estructura con su grupo funcional.',
  $$[
    {
        "text": "Hidroxilo",
        "correct": true,
        "color": "ac-blue",
        "pinX": 50,
        "pinY": 12,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_grupos_funcionales_estructuras.png"
    },
    {
        "text": "Metilo",
        "correct": true,
        "color": "ac-green",
        "pinX": 50,
        "pinY": 31,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_grupos_funcionales_estructuras.png"
    },
    {
        "text": "Carboxilo",
        "correct": true,
        "color": "ac-yellow",
        "pinX": 50,
        "pinY": 50,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_grupos_funcionales_estructuras.png"
    },
    {
        "text": "Amino",
        "correct": true,
        "color": "ac-pink",
        "pinX": 50,
        "pinY": 68,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_grupos_funcionales_estructuras.png"
    },
    {
        "text": "Fosfato",
        "correct": true,
        "color": "ac-purple",
        "pinX": 50,
        "pinY": 87,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_grupos_funcionales_estructuras.png"
    }
]$$::jsonb,
  false,
  14,
  1,
  70
),
(
  'bc339c21-1a37-52b3-9d32-18d5ef75cecf',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'En una molecula organica, los grupos funcionales son importantes porque:',
  $$[
    {
        "text": "Determinan gran parte de sus propiedades quimicas y su comportamiento fisiologico",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_compuestos_organicos_grupos_funcionales.png"
    },
    {
        "text": "Siempre eliminan el carbono de la molecula",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_compuestos_organicos_grupos_funcionales.png"
    },
    {
        "text": "Hacen que todos los compuestos organicos tengan la misma funcion",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_compuestos_organicos_grupos_funcionales.png"
    },
    {
        "text": "Solo aparecen en sustancias inorganicas",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_compuestos_organicos_grupos_funcionales.png"
    }
]$$::jsonb,
  false,
  15,
  1,
  45
),
(
  'a154af6f-8853-5cbc-b718-c49e71787b57',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'Glucosa, galactosa y fructosa son ejemplos de:',
  $$[
    {
        "text": "Monosacaridos",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_carbohidratos_monosacaridos_disacaridos.png"
    },
    {
        "text": "Disacaridos",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_carbohidratos_monosacaridos_disacaridos.png"
    },
    {
        "text": "Polipeptidos",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_carbohidratos_monosacaridos_disacaridos.png"
    },
    {
        "text": "Esteroides",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_carbohidratos_monosacaridos_disacaridos.png"
    }
]$$::jsonb,
  false,
  16,
  1,
  40
),
(
  '6bb6ef14-dd1b-5f40-985d-c94382d40bef',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Selecciona las afirmaciones correctas sobre trigliceridos y grasas.',
  $$[
    {
        "text": "Un triglicerido se forma por glicerol unido a tres acidos grasos",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_trigliceridos_grasas.png"
    },
    {
        "text": "La sintesis de trigliceridos produce agua como producto secundario",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_trigliceridos_grasas.png"
    },
    {
        "text": "Los acidos grasos saturados no tienen dobles enlaces carbono-carbono",
        "correct": true,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_trigliceridos_grasas.png"
    },
    {
        "text": "Los acidos grasos insaturados tienen uno o mas dobles enlaces C=C",
        "correct": true,
        "color": "ac-purple",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_trigliceridos_grasas.png"
    },
    {
        "text": "Todos los lipidos se disuelven con libertad en agua",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_trigliceridos_grasas.png"
    }
]$$::jsonb,
  true,
  17,
  1,
  60
),
(
  'f331a639-78f8-57c6-bc09-1445a45a8d06',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'tf',
  'Una grasa trans suele tener una cadena mas recta que una grasa cis, lo que favorece que se comporte mas como grasa saturada.',
  $$[
    {
        "text": "Verdadero",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_acidos_grasos_trans_cis.png"
    },
    {
        "text": "Falso",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_acidos_grasos_trans_cis.png"
    }
]$$::jsonb,
  false,
  18,
  1,
  35
),
(
  '207d7c69-59e3-5b64-b667-0f88e46455b9',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'La caracteristica anfifila de un fosfolipido significa que:',
  $$[
    {
        "text": "Tiene una cabeza hidrofilica y colas hidrofobicas",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fosfolipido_lecitina.png"
    },
    {
        "text": "Toda la molecula repele el agua por igual",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fosfolipido_lecitina.png"
    },
    {
        "text": "Carece de grupo fosfato",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fosfolipido_lecitina.png"
    },
    {
        "text": "Solo se encuentra en el nucleo celular como DNA",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fosfolipido_lecitina.png"
    }
]$$::jsonb,
  false,
  19,
  1,
  45
),
(
  '8c01d1e4-65b2-5b1c-90dc-4bf2109dd80f',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'tf',
  'El colesterol es un esteroide y puede servir como precursor de otros esteroides como cortisol, progesterona, estrogenos y testosterona.',
  $$[
    {
        "text": "Verdadero",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_colesterol_esteroide.png"
    },
    {
        "text": "Falso",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_colesterol_esteroide.png"
    }
]$$::jsonb,
  false,
  20,
  1,
  35
),
(
  '95d420d8-a191-5a42-8ce5-24bf6814afdc',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Sobre aminoacidos, peptidos y proteinas, selecciona las afirmaciones correctas.',
  $$[
    {
        "text": "Un aminoacido posee un grupo amino, un grupo carboxilo y un grupo R",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_aminoacidos_peptidos.png"
    },
    {
        "text": "Los enlaces peptidicos unen aminoacidos para formar peptidos y polipeptidos",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_aminoacidos_peptidos.png"
    },
    {
        "text": "La union peptidica se forma por sintesis por deshidratacion",
        "correct": true,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_aminoacidos_peptidos.png"
    },
    {
        "text": "Todos los aminoacidos son iguales porque todos tienen el mismo grupo R",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_aminoacidos_peptidos.png"
    },
    {
        "text": "Una proteina no puede tener mas de un aminoacido",
        "correct": false,
        "color": "ac-purple",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_aminoacidos_peptidos.png"
    }
]$$::jsonb,
  true,
  21,
  1,
  60
),
(
  'a6ca8bfe-19b3-5ad8-963b-c925f67d147d',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'dnd',
  'Relaciona cada zona del esquema con el nivel de estructura proteica.',
  $$[
    {
        "text": "Primaria",
        "correct": true,
        "color": "ac-blue",
        "pinX": 55,
        "pinY": 12,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_niveles_estructura_proteinas.png"
    },
    {
        "text": "Secundaria",
        "correct": true,
        "color": "ac-green",
        "pinX": 52,
        "pinY": 31,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_niveles_estructura_proteinas.png"
    },
    {
        "text": "Terciaria",
        "correct": true,
        "color": "ac-yellow",
        "pinX": 55,
        "pinY": 59,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_niveles_estructura_proteinas.png"
    },
    {
        "text": "Cuaternaria",
        "correct": true,
        "color": "ac-pink",
        "pinX": 55,
        "pinY": 87,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_niveles_estructura_proteinas.png"
    }
]$$::jsonb,
  false,
  22,
  1,
  70
),
(
  'bb013ffb-d81a-5955-8ddd-096b1c622262',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'En la estructura primaria de una proteina, lo que se describe principalmente es:',
  $$[
    {
        "text": "La secuencia de aminoacidos unidos por enlaces peptidicos",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_insulina_estructura_primaria.png"
    },
    {
        "text": "La union de varias cadenas ya plegadas en una proteina final",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_insulina_estructura_primaria.png"
    },
    {
        "text": "La forma globular producida por interacciones con el agua",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_insulina_estructura_primaria.png"
    },
    {
        "text": "La cantidad de lipidos adheridos a la membrana",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_insulina_estructura_primaria.png"
    }
]$$::jsonb,
  false,
  23,
  1,
  45
),
(
  'ef6d1201-154f-512c-ab5c-a771692792d8',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'El efecto principal de una enzima sobre una reaccion quimica es:',
  $$[
    {
        "text": "Disminuir la energia de activacion y acelerar la reaccion sin consumirse",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enzima_energia_activacion.png"
    },
    {
        "text": "Aumentar siempre la energia de activacion",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enzima_energia_activacion.png"
    },
    {
        "text": "Convertirse de manera permanente en producto",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enzima_energia_activacion.png"
    },
    {
        "text": "Eliminar la necesidad de sustrato",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_enzima_energia_activacion.png"
    }
]$$::jsonb,
  false,
  24,
  1,
  45
),
(
  '6d040d1c-794c-5127-ae52-fa34ea07bfc1',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'En una reaccion enzimatica como la de la sacarasa, cuales pasos o ideas son correctos?',
  $$[
    {
        "text": "El sustrato se une al sitio activo de la enzima",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reaccion_enzimatica_sacarasa.png"
    },
    {
        "text": "Se forma un complejo enzima-sustrato",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reaccion_enzimatica_sacarasa.png"
    },
    {
        "text": "La enzima libera productos y puede catalizar otra reaccion",
        "correct": true,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reaccion_enzimatica_sacarasa.png"
    },
    {
        "text": "La enzima queda consumida como parte del producto final",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reaccion_enzimatica_sacarasa.png"
    },
    {
        "text": "La especificidad enzima-sustrato no depende del sitio activo",
        "correct": false,
        "color": "ac-purple",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_reaccion_enzimatica_sacarasa.png"
    }
]$$::jsonb,
  true,
  25,
  1,
  60
),
(
  '682e2e89-d640-55b7-be04-eddbfc6e17bd',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'mc',
  'En el ATP, la energia transferible se asocia sobre todo con:',
  $$[
    {
        "text": "Los enlaces de alta energia entre los grupos fosfato",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_atp_camp.png"
    },
    {
        "text": "La eliminacion completa de la adenina",
        "correct": false,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_atp_camp.png"
    },
    {
        "text": "La ausencia total de ribosa",
        "correct": false,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_atp_camp.png"
    },
    {
        "text": "La conversion de ATP en DNA",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_atp_camp.png"
    }
]$$::jsonb,
  false,
  26,
  1,
  45
),
(
  '5c47ac83-2a8c-554b-97fd-1ef4968396f0',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Selecciona funciones o ideas correctas sobre el ATP en la celula.',
  $$[
    {
        "text": "La oxidacion de glucosa ayuda a generar ATP",
        "correct": true,
        "color": "ac-blue",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fuente_funciones_atp.png"
    },
    {
        "text": "El ATP puede sostener contraccion muscular, actividad ciliar y transporte activo",
        "correct": true,
        "color": "ac-green",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fuente_funciones_atp.png"
    },
    {
        "text": "La hidrolisis de ATP a ADP y Pi libera energia util",
        "correct": true,
        "color": "ac-yellow",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fuente_funciones_atp.png"
    },
    {
        "text": "La fosforilacion puede activar o desactivar rutas metabolicas",
        "correct": true,
        "color": "ac-purple",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fuente_funciones_atp.png"
    },
    {
        "text": "El ATP es una reserva estable que no necesita resintetizarse durante el dia",
        "correct": false,
        "color": "ac-pink",
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_fuente_funciones_atp.png"
    }
]$$::jsonb,
  true,
  27,
  1,
  60
),
(
  '386c3255-e847-51d3-b502-85f5fc6f67d2',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'dnd',
  'Relaciona cada ruta de produccion de ATP con la region del esquema.',
  $$[
    {
        "text": "Glucolisis",
        "correct": true,
        "color": "ac-blue",
        "pinX": 36,
        "pinY": 17,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_produccion_atp.png"
    },
    {
        "text": "Fermentacion anaerobica",
        "correct": true,
        "color": "ac-yellow",
        "pinX": 35,
        "pinY": 42,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_produccion_atp.png"
    },
    {
        "text": "Respiracion aerobica",
        "correct": true,
        "color": "ac-pink",
        "pinX": 38,
        "pinY": 74,
        "pregunta_imagen": "/juegos/assets/capitulo2-tema2-saladin/cap2_produccion_atp.png"
    }
]$$::jsonb,
  false,
  28,
  1,
  65
),
(
  '6c7b8c8f-b220-5c9b-b0a5-52d5c0deaf0f',
  'a19f2789-872e-5f1e-9682-e16448dbee05',
  'ms',
  'Sobre acidos nucleicos, DNA y RNA, selecciona las afirmaciones correctas.',
  $$[
    {
        "text": "Los acidos nucleicos son polimeros de nucleotidos",
        "correct": true,
        "color": "ac-blue"
    },
    {
        "text": "El DNA constituye los genes y transfiere informacion hereditaria",
        "correct": true,
        "color": "ac-green"
    },
    {
        "text": "El RNA participa en aplicar las instrucciones del DNA para sintetizar proteinas",
        "correct": true,
        "color": "ac-yellow"
    },
    {
        "text": "Las proteinas son los monomeros que forman DNA y RNA",
        "correct": false,
        "color": "ac-pink"
    },
    {
        "text": "Los acidos nucleicos no guardan ninguna relacion con nucleotidos",
        "correct": false,
        "color": "ac-purple"
    }
]$$::jsonb,
  true,
  29,
  1,
  60
);

commit;
