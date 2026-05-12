const fs = require('fs');

// 1. Clean script.js
let js = fs.readFileSync('script.js', 'utf8');
const jsIdx = js.indexOf('/* ================= WAYGROUND JS ================= */');
if (jsIdx !== -1) {
  js = js.substring(0, jsIdx).trim();
  fs.writeFileSync('script.js', js);
  console.log('Cleaned script.js');
}

// 2. Clean styles.css
let css = fs.readFileSync('styles.css', 'utf8');
const cssIdx = css.indexOf('/* ================= WAYGROUND CSS ================= */');
if (cssIdx !== -1) {
  css = css.substring(0, cssIdx).trim();
  fs.writeFileSync('styles.css', css);
  console.log('Cleaned styles.css');
}

// 3. Clean index.html
let html = fs.readFileSync('index.html', 'utf8');
const wgScreenRegex = /<!-- ================= WAYGROUND SCREEN ================= -->[\s\S]*?<\/section>\s*<\/section>/;
html = html.replace(wgScreenRegex, '');

const wgEditorRegex = /<!-- ================= WAYGROUND EDITOR SCREEN ================= -->[\s\S]*?<\/section>/;
html = html.replace(wgEditorRegex, '');

// Also remove any stray wayground active logic
const sidebarLinkRegex = /<li class="nav-item">\s*<a onclick="openWayground\(\)">[\s\S]*?<\/li>/;
html = html.replace(sidebarLinkRegex, '');

const homeCardRegex = /<div class="home-card home-card-orange" onclick="openWayground\(\)">[\s\S]*?<\/div>/;
html = html.replace(homeCardRegex, '');

fs.writeFileSync('index.html', html);
console.log('Cleaned index.html');
