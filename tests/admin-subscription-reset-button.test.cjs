const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const script = fs.readFileSync('membership-admin.js', 'utf8');
class El {
  constructor() { this.children = []; this.events = {}; }
  append(...nodes) { this.children.push(...nodes); }
  prepend(...nodes) { this.children.unshift(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(name,fn) { this.events[name] = fn; }
  setAttribute(k,v) { this[k] = v; }
}
function render(status, scope, email, pendingWrite, currentAdmin, filterValue=status) {
  const calls = [];
  const table = new El();
  const row = {status, scope, email, starts_on: '2026-11-27'};
  const sandbox = { window:{restaurarDispositivo: email=>calls.push(email)}, rows:[row], table, pendingWrite, currentAdmin,
    search:{value:''}, listGroup:{value:''}, filter:{value:filterValue}, studentGroupsByEmail:null,
    cell:()=>new El(), document:{createElement:()=>new El(),createDocumentFragment:()=>new El()}, planLabels:{},
    statuses:{}, formatDate: x=>x, feedback:()=>{}, listStatus:{}, manageableStatuses:new Set(['active','staff','blocked','included','scheduled']) };
  const start = script.indexOf('  function render() {');
  const end = script.indexOf('\n  }', start)+4;
  const actualFunction = script.slice(start,end).replace(/\n    table.replaceChildren\(body\);[\s\S]*/, '\n    table.replaceChildren(body);\n  }');
  vm.runInNewContext(actualFunction+'\nrender();', sandbox);
  return {calls, actions:table.children[0].children[0].children.at(-1).children};
}
test('ofrece restaurar y quitar con el correo exacto en acceso completo vigente',()=>{
  const email = "student+sample@example.org";
  const r = render('active','full',email,false,{},'active');
  assert.deepEqual(r.actions.map(x=>x.textContent),['Restaurar dispositivo','Quitar']);
  assert.equal(r.actions[0]['aria-label'],'Restaurar dispositivo de '+email);
  r.actions[0].events.click();
  assert.deepEqual(r.calls,[email]);
});
test('también se puede restaurar una cuenta bloqueada, sin reactivar su acceso',()=>{
  const r = render('blocked','full','s@example.org',false,{});
  assert.equal(r.actions[0].textContent,'Restaurar dispositivo');
});
test('no ofrece restaurar staff, programado, solo vídeo, sin correo ni histórico',()=>{
  for (const [st,scope,email] of [['staff','full','s@example.org'],['scheduled','full','s@example.org'],['active','videos','s@example.org'],['active','full',''],['cancelled','full','s@example.org'],['expired','full','s@example.org']]){
    assert.ok(!render(st,scope,email,false,{}).actions.some(x=>x.textContent==='Restaurar dispositivo'));
  }
  assert.match(script,/rows = subscriptions\.filter\(row => manageableStatuses\.has\(row\.status\)\)/);
  assert.match(script,/const manageableStatuses = new Set\(\['active', 'staff', 'blocked', 'included', 'scheduled'\]\)/);
});
test('no llama al restaurador sin admin o durante otra escritura',()=>{
  for (const [pending, admin] of [[true,{}],[false,null]]) {
    const r = render('active','full','s@example.org',pending,admin);
    assert.equal(r.actions[0].disabled,pending);
    r.actions[0].events.click();
    assert.deepEqual(r.calls,[]);
  }
});
