const bank = require('./bank.json');
const crypto = require('node:crypto');
function norm(value) { return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
const byCode = {
 T1MORF:['morfo-01'],DEMOMORFO26:['morfo-01'],T2MORF:['morfo-02'],C12M2:['morfo-12'],CAP13M:['morfo-13'],PC14M:['morfo-14'],SNA15M:['morfo-15'],OS16M:['morfo-16'],END17M:['morfo-17'],SAN18M:['morfo-18'],COR19M:['morfo-19'],VAS20M:['morfo-20'],DEMOBIO26:['biologia-01'],DEMOSALUD26:['salud-01'],
 SP01P1:['salud-01','salud-04','salud-05'],SP02P1:['salud-03'],SP03P1:['salud-09'],SP04P1:['salud-10'],SP05P1:['salud-11','salud-12'],SP06P1:['salud-13'],SP07P2:['salud-16'],SP08P2:['investigacion-diseno'],SP09P2:['investigacion-cuantitativa'],SP10P2:['investigacion-cualitativa'],SP11P2:['salud-14'],SP12P2:['salud-16']
};
for(let i=1;i<=12;i++) byCode['BC'+String(i).padStart(2,'0')+(i<=6?'P1':'P2')]=['biologia-'+String(i).padStart(2,'0')];
const aliases = {
 'morfo-01':['anatomia y fisiologia','organizacion corporal','conceptos basicos'],
 'morfo-02':['quimica de la vida'], 'morfo-05':['histologia','tipos de tejidos'],
 'morfo-07':['tejido oseo'], 'morfo-08':['sistema oseo'], 'morfo-09':['articulaciones'],
 'morfo-10':['sistema muscular'], 'morfo-11':['tejido muscular','propiedades musculares'],
 'morfo-12':['tejido nervioso','neuroglia','mielina','sinapsis y circuitos'],
 'morfo-13':['medula espinal','medula y reflejos'], 'morfo-14':['encefalo'],
 'morfo-15':['sna y reflejos','sistema nervioso autonomo'], 'morfo-16':['sentidos'],
 'morfo-17':['sistema endocrino'], 'morfo-18':['sangre'], 'morfo-19':['corazon'],
 'morfo-20':['vasos y circulacion','vasos sanguineos']
};
function topicIds(ev) {
 const code=String(ev.codigo||'').toUpperCase(); if(byCode[code]) return byCode[code];
 const subject=norm(ev.asignatura), text=norm([ev.titulo,ev.tema].join(' '));
 const candidates=bank.filter(b=>norm(b.subject)===subject || subject==='educacion para la salud'&&norm(b.subject)==='salud publica');
 const exact=candidates.find(b=>norm(b.topic)===norm(ev.tema)); if(exact)return [exact.id];
 if(subject==='morfofuncion')for(const [id,terms] of Object.entries(aliases))if(terms.some(t=>text.includes(t)))return [id];
 return [];
}
function selectQuestions(ev) {
 const ids=topicIds(ev),text=norm(ev.titulo),round=/\bronda (\d+)\b/.exec(text);
 let pool=bank.filter(b=>ids.includes(b.id)).flatMap(b=>b.questions);
 // Existing topical rounds retain their scope instead of adding the same bank twice.
 if(text.includes('sentidos')&&round)pool=pool.filter(q=>{const t=norm(q.text),second=/oido|auditiv|audicion|equilibrio|vision|retina|cristalino|cornea|coclea|pupila|luz|conos|bastones|macula|sonido|fotorreceptor/.test(t);return round[1]==='1'?!second&&/receptor|dolor|gusto|olfat|papila|nocicep|sabor/.test(t):second;});
 else if(text.includes('encefalo')&&round)pool=pool.filter(q=>round[1]==='2'?/ventricul|liquido cefalorraquideo|lcr|barrera|plexo coroideo/.test(norm(q.text)):!/ventricul|liquido cefalorraquideo|lcr|barrera|plexo coroideo/.test(norm(q.text)));
 else if(round)pool=pool.filter((q,i)=>i%Math.max(2,Number(round[1]))===Number(round[1])-1);
 const seen=new Set();pool=pool.filter(q=>{const k=norm(q.text);if(seen.has(k))return false;seen.add(k);return true;});
 const max=/^DEMO/.test(String(ev.codigo||''))?8:30;
 return pool.slice(0,max).map((q,i)=>{
  const hash=crypto.createHash('sha256').update('game-expansion-v1:'+ev.id+':'+q.key).digest('hex').slice(0,32);
  return {id:hash.slice(0,8)+'-'+hash.slice(8,12)+'-'+hash.slice(12,16)+'-'+hash.slice(16,20)+'-'+hash.slice(20),evaluacion_id:ev.id,tipo:'mc',texto:q.text,opciones:q.options.map((text,index)=>({text,correct:index===q.answer})),multiple_correctas:false,orden:10000+i,puntos:1,temporizador:40,fuente:q.source,paginas:q.pages};
 });
}
module.exports={norm,topicIds,selectQuestions};
