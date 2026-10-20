const {selectQuestions,replacesQuestions}=require('./_game-practice/select.cjs');
const anonKey=require('./_game-practice/config.json').anonKey;
const base='https://asnwhddmurstzmghuyin.supabase.co';
module.exports=async function(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex');
 if(req.method!=='GET')return res.status(405).end();
 const id=typeof req.query.id==='string'?req.query.id:'';
 if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))return res.status(400).end();
 const token=/^Bearer\s+(.+)$/i.exec(req.headers.authorization||'')?.[1];if(!token)return res.status(401).end();
 const headers={apikey:anonKey,Authorization:'Bearer '+token,'Content-Type':'application/json'};
 try{
  const access=await fetch(base+'/rest/v1/rpc/campus_game_access',{method:'POST',headers,body:JSON.stringify({p_id:id}),signal:AbortSignal.timeout(8000)});
  if(!access.ok)return res.status(access.status===401?401:503).end();
  if((await access.json())!==true)return res.status(403).end();
  const response=await fetch(base+'/rest/v1/evaluaciones?select=id,titulo,tema,codigo,asignatura&id=eq.'+id+'&publicado=eq.true',{headers,signal:AbortSignal.timeout(8000)});
  if(!response.ok)return res.status(response.status===401?401:503).end();
  const rows=await response.json();if(!Array.isArray(rows)||rows.length!==1)return res.status(403).end();
  const questions=selectQuestions(rows[0]);res.setHeader('Content-Type','application/json; charset=utf-8');return res.status(200).end(JSON.stringify({version:2,replace:replacesQuestions(rows[0]),questions}));
 }catch(_){return res.status(503).end();}
};
