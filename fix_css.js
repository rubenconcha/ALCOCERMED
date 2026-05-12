const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

const idx = css.indexOf('/* ================= WAYGROUND CSS ================= */');
if (idx !== -1) {
  let mainCss = css.substring(0, idx);
  let wgCss = css.substring(idx);
  
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
    const regex = new RegExp('\\.' + oldCls + '(?![a-zA-Z0-9_-])', 'g');
    wgCss = wgCss.replace(regex, '.' + newCls);
  }
  
  fs.writeFileSync('styles.css', mainCss + wgCss);
  console.log('Fixed CSS prefixes!');
} else {
  console.log('WAYGROUND CSS section not found.');
}
