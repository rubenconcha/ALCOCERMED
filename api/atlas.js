const fs = require('node:fs/promises');
const path = require('node:path');
const COOKIE = 'alcocer_atlas_session';
// These public Supabase configuration values never grant course access.
const URL = 'https://asnwhddmurstzmghuyin.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

module.exports = async (req,res) => {
 res.setHeader('Cache-Control','private, no-store');
 res.setHeader('X-Robots-Tag','noindex, nofollow');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(!['GET','POST'].includes(req.method))return res.status(405).end();
 const redirect = () => {res.setHeader('Location','/campus?seccion=atlas');return res.status(302).end();};
 const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(s=>s.trim().split(/=(.*)/s).slice(0,2)));
 const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1] || cookies[COOKIE];
 if(!token)return req.method==='GET'?redirect():res.status(401).json({allowed:false});
 try {
  const response=await fetch(URL+'/rest/v1/rpc/campus_atlas_access',{
   method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},
   body:'{}',signal:AbortSignal.timeout(8000)
  });
  if(!response.ok)return req.method==='GET'?redirect():res.status(response.status===401?401:503).json({allowed:false});
  const access=await response.json();
  if(!access?.ready||!access.allowed){res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');return req.method==='GET'?redirect():res.status(403).json({allowed:false});}
  if(req.method==='POST'){
   res.setHeader('Set-Cookie',COOKIE+'='+token+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=300');
   return res.status(200).json({allowed:true});
  }
  const html=await fs.readFile(path.join(process.cwd(),'api','_atlas','atlas.html'),'utf8');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  return res.status(200).send(html.replace('<head>','<head><base href="/">'));
 }catch(_){return req.method==='GET'?redirect():res.status(503).json({allowed:false});}
};
