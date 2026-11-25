const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const data=require('../study-calendar-data.js');

class Element {
 constructor(tag='div'){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.listeners={};this.value='';this.hidden=false;this.textContent='';}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(key,value){this.attributes[key]=value;}
 addEventListener(name,listener){this.listeners[name]=listener;}
}
function home(group,date='2026-11-24'){
 const nodes=new Map(),saved=new Map([['ben-carson:calendar-group:student',group]]),calls=[];
 const byId=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
 const context={data,byId,userId:'student',selectedDate:date,document:{createElement:tag=>new Element(tag)},
  storage:(key,value)=>{if(value===undefined)return saved.get(key)??null;saved.set(key,value);},
  window:{addEventListener(){},dispatchEvent(){},openStudyCalendar:(...args)=>calls.push(args)},CustomEvent:class{}};
 vm.createContext(context);
 const source=fs.readFileSync('campus-shell.js','utf8');
 vm.runInContext(source.slice(source.indexOf("    const homeGroup ="),source.indexOf('    function renderMonth(')),context);
 context.renderDay();
 return{context,nodes,byId,calls,saved,rows:()=>byId('campus-home-classes').children};
}

test('Inicio has exactly one button per calendar activity for all three groups, including evening classes',()=>{
 for(const group of ['virtual','presencial_1','presencial_2']){
  const ui=home(group),expected=data.groupDay('2026-11-24',group);
  assert.equal(ui.rows().length,expected.length,group);
  assert.equal(ui.byId('campus-guided-preview').hidden,true);
  assert.equal(ui.byId('campus-plan-preview').children.length,0);
  ui.rows().forEach((row,index)=>{
   const button=row.children[0],activity=expected[index];
   assert.equal(button.tagName,'button');
   assert.equal(button.dataset.activity,activity.id);
   assert.equal(button.dataset.kind,activity.kind);
   assert.equal(button.dataset.subject,activity.reading?.slug||activity.readingSlug);
   button.onclick();
   assert.deepEqual(ui.calls.at(-1),['2026-11-24',activity.id]);
  });
  if(group==='virtual'){
   assert.equal(expected.filter(item=>item.id.endsWith('-clases')).length,1);
   const live=ui.rows()[expected.findIndex(item=>item.id.endsWith('-clases'))].children[0];
   const hint=live.children[1].children[1].textContent;
   assert.match(hint,/17:00–18:00 · Biología Celular/);
   assert.match(hint,/18:05–19:20 · Morfofunción/);
   assert.match(hint,/19:30–21:00 · Física/);
  }
 }
});

test('Inicio uses the date picked in the mini calendar and updates the same account group',()=>{
 const ui=home('virtual');
 ui.context.selectedDate='2026-11-25';ui.context.renderDay();
 ui.rows()[0].children[0].onclick();
 assert.deepEqual(ui.calls.at(-1),['2026-11-25',data.groupDay('2026-11-25','virtual')[0].id]);
 ui.byId('campus-home-group').value='presencial_2';
 ui.byId('campus-home-group').listeners.change();
 assert.equal(ui.saved.get('ben-carson:calendar-group:student'),'presencial_2');
 assert.equal(ui.rows().length,data.groupDay('2026-11-25','presencial_2').length);
 ui.rows()[0].children[0].onclick();
 assert.deepEqual(ui.calls.at(-1),['2026-11-25',data.groupDay('2026-11-25','presencial_2')[0].id]);
});

test('no selection, weekends and dates outside the course never show stale sample activities',()=>{
 for(const [group,date] of [['','2026-11-24'],['virtual','2026-11-28'],['presencial_1','2027-01-16']]){
  const ui=home(group,date);assert.equal(ui.rows().length,0);
  assert.match(ui.byId('campus-home-group-note').textContent,group?/Sin actividades/:/Selecciona tu grupo/);
  assert.equal(ui.byId('campus-guided-preview').hidden,true);
 }
});
