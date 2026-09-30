// Convierte el banco revisado al esquema del juego existente. No ejecuta SQL.
const fs = require('node:fs');
const crypto = require('node:crypto');
const bank = JSON.parse(fs.readFileSync('juegos/encefalo-preguntas.json', 'utf8'));
const uuid = name => {
  const h = crypto.createHash('sha256').update('alcocermed-native-' + name).digest('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
};
const lit = value => "'" + String(value).replaceAll("'", "''") + "'";
const json = value => lit(JSON.stringify(value)) + '::jsonb';
const images = {};
const evaluations = [];
const sql = ['-- Añade únicamente las dos rondas de encéfalo al juego existente. Reejecutable.', 'begin;'];
bank.rounds.forEach((round, ri) => {
  const id = uuid('round-' + ri);
  const ids = round.questions.map(q => uuid(q.id));
  evaluations.push({id, title: round.title, code: 'ENCEFALO' + (ri + 1), questionIds: ids});
  const config = {maxQuestions: 10, questionOrder: ids, enabledPowerups: ['x2', 'time', 'retry']};
  sql.push(`insert into public.evaluaciones (id,titulo,asignatura,nivel,idioma,visibilidad,objetivo,codigo,publicado,created_by,created_at,updated_at,iniciado,tema,modo_sesion,config_juego) values (${lit(id)},${lit('Encéfalo — Ronda ' + (ri + 1) + ': ' + round.title + ' (10 preguntas)')},'MORFOFUNCION','Residencia','espanol','publica',${lit(bank.scope)},${lit('ENCEFALO' + (ri + 1))},true,'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',now(),now(),true,${lit('Encéfalo: ' + round.title)},'individual',${json(config)}) on conflict(id) do update set titulo=excluded.titulo,tema=excluded.tema,objetivo=excluded.objetivo,publicado=true,iniciado=true,config_juego=excluded.config_juego,updated_at=now();`);
  round.questions.forEach((q, qi) => {
    const opts = q.type === 'match' ? q.pairs.map(p => ({text:p[0],match:p[1]})) : q.options.map((text, i) => ({text,correct:q.correct.includes(i)}));
    opts[0].pregunta_imagen = '/juegos/' + q.image;
    opts[0].explicacion = q.explanation;
    images[ids[qi]] = {src:'/juegos/' + q.image,alt:q.alt,credit:q.caption};
    sql.push(`insert into public.evaluacion_preguntas (id,evaluacion_id,tipo,texto,opciones,multiple_correctas,orden,puntos,temporizador) values (${lit(ids[qi])},${lit(id)},${lit(q.type)},${lit(q.prompt)},${json(opts)},${q.type === 'ms'},${qi+1},1,${q.type === 'match' ? 90 : 60}) on conflict(id) do update set tipo=excluded.tipo,texto=excluded.texto,opciones=excluded.opciones,multiple_correctas=excluded.multiple_correctas,orden=excluded.orden,puntos=excluded.puntos,temporizador=excluded.temporizador;`);
  });
});
sql.push('commit;', `select e.titulo, count(p.id) as preguntas from public.evaluaciones e join public.evaluacion_preguntas p on p.evaluacion_id=e.id where e.id in (${evaluations.map(e=>lit(e.id)).join(',')}) group by e.id,e.titulo order by e.titulo;`);
fs.writeFileSync('juegos/SUPABASE_ENCEFALO_20.sql', sql.join('\n\n')+'\n');
fs.writeFileSync('juegos/encefalo-native-data.js', '// Banco incorporado a las evaluaciones originales.\nvar encefaloEvaluations = '+JSON.stringify(evaluations,null,2)+';\nObject.assign(nervousQuestionImages, '+JSON.stringify(images,null,2)+');\n');
console.log(evaluations);
