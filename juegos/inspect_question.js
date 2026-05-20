const https = require('https');

const SUPABASE_URL = 'asnwhddmurstzmghuyin.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY
};

const path = `/rest/v1/evaluacion_preguntas?texto=ilike.*vasos%20sanguineos*&select=id,texto,tipo,opciones,evaluacion_id`;

function makeRequest(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: SUPABASE_URL,
      path: path,
      method: 'GET',
      headers: headers
    };
    https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    }).on('error', err => resolve({error: err.message})).end();
  });
}

makeRequest(path).then(res => {
  console.log('Question Data:', JSON.stringify(res, null, 2));
});
