'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {createHash}=require('node:crypto');

function setup(load=async()=>{}, open=async()=>{}) {
  const nodes=new Map(), calls=[];
  function node(id) {
    if(!nodes.has(id)) nodes.set(id,{id,hidden:true,handlers:{},addEventListener(name,fn){this.handlers[name]=fn;},showModal(){this.open=true;},close(){this.open=false;this.handlers.close?.();}});
    return nodes.get(id);
  }
  const bodyClasses=new Set();
  const context={URL,location:{href:'https://www.alcocermed.com/campus',origin:'https://www.alcocermed.com'},window:{loadCampusAssets:load},document:{getElementById:node,body:{classList:{add:n=>bodyClasses.add(n),remove:n=>bodyClasses.delete(n)}}},
    SummaryPdfReader:class {
      constructor(){calls.push('create');}
      destroy(){calls.push('destroy');}
      open(url,options){calls.push({url,options});return open();}
    }
  };
  vm.runInNewContext(fs.readFileSync('campus-information.js','utf8'),context);
  function click(slug='temario-oficial',options={},query=''){
    let prevented=false;
    const link={href:`https://www.alcocermed.com/documentos/umss-2027/${slug}.pdf${query}`,dataset:{infoDocument:slug}};
    node('campus-information-screen').handlers.click({button:0,target:{closest:()=>link},preventDefault(){prevented=true;},...options});
    return prevented;
  }
  return {node,calls,click,context,bodyClasses};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));

test('los 13 PDF están íntegros y todos los enlaces de lectura usan el alojamiento propio',()=>{
  const docs=JSON.parse(fs.readFileSync('documentos/umss-2027/manifest.json','utf8')).documents;
  assert.equal(docs.length,13);
  const html=fs.readFileSync('campus.html','utf8');
  const panel=html.slice(html.indexOf('<section id="campus-information-screen"'),html.indexOf('<dialog id="campus-information-reader"'));
  assert.doesNotMatch(panel,/drive\.google\.com|href="https:[^"]+\.pdf/);
  for(const doc of docs){
    const bytes=fs.readFileSync('.'+doc.path);
    assert.equal(bytes.length,doc.bytes,doc.id);
    assert.equal(bytes.subarray(0,4).toString(),'%PDF');
    assert.equal(createHash('sha256').update(bytes).digest('hex'),doc.sha256,doc.id);
    const href=doc.path+(doc.revision?'?v='+doc.revision:'');
    assert.ok(panel.includes('href="'+href+'"'),doc.id);
  }
});

test('el documento abre dentro del campus con lectura parcial y descarga local',async()=>{
  const t=setup();
  assert.equal(t.click('quimica-texto',{},'?v=5894733f8a2f'),true);
  await flush();
  assert.equal(t.node('campus-information-reader').open,true);
  assert.equal(t.node('info-reader-status').hidden,true);
  const call=t.calls.find(c=>c.url);
  assert.equal(call.url,'https://www.alcocermed.com/documentos/umss-2027/quimica-texto.pdf?v=5894733f8a2f');
  assert.equal(call.options.rangeOnly,true);
  assert.equal(t.node('info-reader-download').download,'quimica-texto.pdf');
  assert.equal(t.node('info-reader-native').href,call.url);
  t.context.window.CampusInformation.close();
  assert.equal(t.node('campus-information-reader').open,false);
  assert.equal(t.bodyClasses.size,0);
});

test('Ctrl y clic conservan la apertura normal del PDF sin abrir otro lector',async()=>{
  const t=setup();
  assert.equal(t.click('temario-oficial',{ctrlKey:true}),false);
  await flush();
  assert.equal(t.node('campus-information-reader').open,undefined);
  assert.deepEqual(t.calls,[]);
});

test('cerrar mientras se cargan los recursos cancela la apertura pendiente',async()=>{
  let finish;
  const t=setup(()=>new Promise(resolve=>{finish=resolve;}));
  t.click();
  t.context.window.CampusInformation.close();
  finish();
  await flush();
  assert.deepEqual(t.calls,[]);
  assert.equal(t.node('campus-information-reader').open,false);
});

test('un fallo ofrece reintento y conserva la descarga sin depender de Drive',async()=>{
  let attempts=0;
  const t=setup(async()=>{},async()=>{if(++attempts===1)throw Error('offline');});
  t.click('fisica-texto');
  await flush();
  assert.equal(t.node('info-reader-retry').hidden,false);
  assert.match(t.node('info-reader-status').textContent,/Reintenta/);
  assert.match(t.node('info-reader-download').href,/\/documentos\/umss-2027\/fisica-texto.pdf$/);
  t.node('info-reader-retry').onclick();
  await flush();
  assert.equal(t.node('info-reader-status').hidden,true);
  assert.equal(t.node('info-reader-retry').hidden,true);
});
