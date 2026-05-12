const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const idx = js.indexOf('/* ================= WAYGROUND JS ================= */');
if (idx !== -1) {
  let mainJs = js.substring(0, idx);
  let wgJs = js.substring(idx);
  
  const classPrefixes = {
    'topbar': 'wg-topbar',
    'sidebar': 'wg-sidebar',
    'main-content': 'wg-main-content',
    'bottom-nav': 'wg-bottom-nav',
    'page': 'wg-page',
    'sidebar-overlay': 'wg-sidebar-overlay',
    'hamburger': 'wg-hamburger'
  };

  for (const [oldCls, newCls] of Object.entries(classPrefixes)) {
    // replace cases like: classList.add('sidebar') -> classList.add('wg-sidebar')
    let classRegex = new RegExp("(['\\\"])(" + oldCls + ")(['\\\"])", 'g');
    wgJs = wgJs.replace(classRegex, "$1" + newCls + "$3");
    
    // replace cases like: querySelector('.sidebar') -> querySelector('.wg-sidebar')
    let selectorRegex = new RegExp("(['\\\"]\\\\.)(" + oldCls + ")(['\\\"])", 'g');
    wgJs = wgJs.replace(selectorRegex, "$1" + newCls + "$3");
  }
  
  fs.writeFileSync('script.js', mainJs + wgJs);
  console.log('Fixed JS prefixes!');
} else {
  console.log('WAYGROUND JS section not found.');
}
