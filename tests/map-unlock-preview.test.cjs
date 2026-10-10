const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const script = fs.readFileSync('script.js', 'utf8');
const start = script.indexOf('function renderMmGrid()');
const end = script.indexOf('function updateIntocStats()', start);

test('cada mapa local tiene una miniatura ligera', () => {
  const sources = [...script.matchAll(/url_imagen: '(mapas mentales\/[^']+)'/g)].map(match => match[1]);
  assert.ok(sources.length >= 34);
  for (const source of sources) {
    const thumbnail = source.replace('mapas mentales/', 'mapas mentales/thumbs/').replace(/\.[^.]+$/, '.webp');
    assert.ok(fs.existsSync(thumbnail), `Falta la miniatura: ${thumbnail}`);
    assert.ok(fs.statSync(thumbnail).size < fs.statSync(source).size, `La miniatura no es menor: ${thumbnail}`);
  }
});

test('el mapa bloqueado muestra la vista previa antes de abrir los planes', () => {
  assert.ok(start >= 0 && end > start);
  const map = { titulo: 'Forma y función celulares', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_03_forma_y_funcion_celulares.png' };
  const grid = { innerHTML: '', cards: [], appendChild(card) { this.cards.push(card); } };
  const dialog = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
  const title = { textContent: '' };
  const image = { src: '', dataset: {}, style: {} };
  let planVisits = 0;
  const elements = { 'mm-grid': grid, 'mm-unlock-dialog': dialog, 'mm-unlock-title': title, 'mm-unlock-image': image };
  const context = {
    mmState: { filteredMapas: [map] },
    CampusAccess: { isFree: () => true, unlock() { planVisits++; } },
    document: { getElementById: id => elements[id], createElement: () => ({ setAttribute() {} }) },
    campo: (item, key) => item[key],
    setMmState() {},
    openMmLightbox() { throw new Error('El contenido bloqueado no debe abrirse'); }
  };
  context.window = context;
  vm.runInNewContext(script.slice(start, end), context);
  vm.runInNewContext('renderMmGrid()', context);

  assert.equal(grid.cards.length, 1);
  assert.match(grid.cards[0].innerHTML, /mm-card-img-locked/);
  assert.match(grid.cards[0].innerHTML, /src="mapas mentales\/thumbs\/morfo_03_forma_y_funcion_celulares.webp"/);
  assert.match(grid.cards[0].innerHTML, />Desbloquear<\/span>/);
  grid.cards[0].onclick();
  assert.equal(dialog.open, true);
  assert.equal(title.textContent, map.titulo);
  assert.equal(image.src, 'mapas mentales/thumbs/morfo_03_forma_y_funcion_celulares.webp');
  assert.equal(planVisits, 0);

  context.window.confirmMmUnlock();
  assert.equal(dialog.open, false);
  assert.equal(planVisits, 1);
});

test('el mapa disponible aparece enseguida y luego se ve en resolución completa', () => {
  const lightboxStart = script.indexOf('window.openMmLightbox = function');
  const lightboxEnd = script.indexOf('window.closeMmLightbox', lightboxStart);
  assert.ok(lightboxStart >= 0 && lightboxEnd > lightboxStart);
  const map = { titulo: 'La Célula', materia: 'Biología Celular', url_imagen: 'mapas mentales/lacelula.png', acceso_gratis: true };
  const image = { src: '', dataset: {} };
  const download = { href: '' };
  const lightbox = { classList: { remove() {} } };
  const elements = {
    'mm-lightbox': lightbox,
    'mm-lb-img': image,
    'mm-lb-title': {},
    'mm-lb-materia': {},
    'mm-lb-desc': {},
    'mm-lb-download': download
  };
  const requested = [];
  function PreviewImage() { requested.push(this); }
  const context = {
    CampusAccess: { isFree: () => true },
    Image: PreviewImage,
    document: { getElementById: id => elements[id], body: { style: {} } },
    campo: (item, key) => item[key]
  };
  context.window = context;
  vm.runInNewContext(script.slice(start, end) + script.slice(lightboxStart, lightboxEnd), context);
  context.window.openMmLightbox(map);
  assert.equal(image.src, 'mapas mentales/thumbs/lacelula.webp');
  assert.equal(requested.length, 1);
  assert.equal(requested[0].src, map.url_imagen);
  assert.equal(download.href, map.url_imagen);
  requested[0].onload();
  assert.equal(image.src, map.url_imagen);
});
