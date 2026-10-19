const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const helpers = source.slice(source.indexOf('const BANCO_TOPIC_ORDER ='), source.indexOf('// Fin del orden de capítulos del banco.'));
function setup() {
    const nodes = new Map();
    const node = () => ({ textContent: '', dataset: {}, children: [], classList: { add() {}, remove() {}, toggle() {} }, appendChild(child) { this.children.push(child); } });
    const document = { getElementById(id) { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); }, createElement: node, querySelectorAll() { return document.getElementById('banco-tema-dropdown').children; } };
    const state = { selectedMateria: 'BIOLOGIA CELULAR', _cache: [
        {materia:'BIOLOGIA CELULAR',tema:'ciclo celular'},
        {materia:'BIOLOGIA CELULAR',tema:'introduccion a la biologia celular'},
        {materia:'MORFOFUNCION',tema:'sistema endocrino'},
        {materia:'BIOLOGIA CELULAR',tema:'citoesqueleto'}
    ] };
    const context = { document, bancoState: state, window: {}, CampusAccess: { isFree: () => false }, campo: (r,k) => r[k], loadBancoPreguntas: async () => {}, console };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(helpers, context);
    return {context, document, state};
}
test('chapter numbers follow both books and the continuous health course sequence', () => {
    const {context:c} = setup();
    assert.equal(c.bancoTopicChapter('MORFOFUNCION','sistema endocrino'),17);
    assert.equal(c.bancoTopicChapter('BIOLOGIA CELULAR','ciclo celular'),14);
    assert.equal(c.bancoTopicChapter('SALUD PUBLICA','educacion en salud'),1);
    assert.equal(c.bancoTopicChapter('SALUD PUBLICA','analisis de datos en excel y spss'),21);
    assert.equal(c.bancoTopicChapter('BIOLOGÍA CELULAR',' INTRODUCCIÓN A LA BIOLOGÍA CELULAR '),1);
});
test('sorts numerically without mutating topics or renumbering a filtered subset', () => {
    const {context:c} = setup();
    const topics = ['sistema endocrino','el sistema muscular','temas principales de anatomia y fisiologia','articulaciones'];
    const sorted = c.sortBancoTopics('MORFOFUNCION',topics);
    assert.equal(JSON.stringify(sorted), JSON.stringify([topics[2],topics[3],topics[1],topics[0]]));
    assert.equal(topics[0], 'sistema endocrino');
    assert.equal(c.bancoTopicLabel('MORFOFUNCION','sistema endocrino'),'Capítulo 17 · sistema endocrino');
    assert.equal(c.bancoTopicLabel('MORFOFUNCION','tema nuevo'),'tema nuevo');
});
test('dropdown labels change while selection retains original database topic keys', async () => {
    const {context:c,document,state} = setup();
    const start=source.indexOf('async function loadBancoTemas(materia) {');
    const end=source.indexOf('async function loadBancoPreguntas()',start);
    vm.runInContext(source.slice(start,end),c);
    await c.loadBancoTemas('BIOLOGIA CELULAR');
    const buttons=document.getElementById('banco-tema-dropdown').children;
    assert.equal(buttons[0].textContent,'todos los temas');
    assert.equal(buttons[1].textContent,'Capítulo 1 · introduccion a la biologia celular');
    assert.equal(buttons[2].textContent,'Capítulo 12 · citoesqueleto');
    assert.equal(buttons[3].textContent,'Capítulo 14 · ciclo celular');
    await buttons[3].onclick();
    assert.equal(state.selectedTema,'ciclo celular');
    assert.equal(document.getElementById('banco-tema-text').textContent,'Capítulo 14 · ciclo celular');
    await buttons[0].onclick();
    assert.equal(state.selectedTema,null);
});
