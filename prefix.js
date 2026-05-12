const fs = require('fs');

const srcDir = 'C:/Users/PC/Documents/proyecto quizziz';
const destDir = 'C:/Users/PC/Documents/2DO AÑO RESIDENCIA/RUBEN/RUBEN/PLATAFORMA BENCARSON/ALCOCERMED';

let css = fs.readFileSync(srcDir + '/styles.css', 'utf8');
let editorCss = fs.readFileSync(srcDir + '/editor.css', 'utf8');
let html = fs.readFileSync(srcDir + '/index.html', 'utf8');
let editorHtml = fs.readFileSync(srcDir + '/editor.html', 'utf8');
let js = fs.readFileSync(srcDir + '/app.js', 'utf8');
let editorJs = fs.readFileSync(srcDir + '/editor.js', 'utf8');

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
  const regex = new RegExp('\\\\.' + oldCls + '\\\\b', 'g');
  css = css.replace(regex, '.' + newCls);
  
  const classRegex = new RegExp('class="([^"]*)' + oldCls + '([^"]*)"', 'g');
  html = html.replace(classRegex, 'class="$1' + newCls + '$2"');
}

for (const [oldCls, newCls] of Object.entries(classPrefixes)) {
  js = js.replace(new RegExp('\\\\.' + oldCls + '\\\\b', 'g'), '.' + newCls);
}

js = js.replace(/getElementById\('sidebar'\)/g, "getElementById('wg-sidebar')");
js = js.replace(/getElementById\('sidebar-overlay'\)/g, "getElementById('wg-sidebar-overlay')");
js = js.replace(/getElementById\('hamburger-btn'\)/g, "getElementById('wg-hamburger-btn')");
js = js.replace(/getElementById\('main-search-input'\)/g, "getElementById('wg-main-search-input')");
js = js.replace(/getElementById\('global-search-input'\)/g, "getElementById('wg-global-search-input')");
js = js.split("getElementById('page-' +").join("getElementById('wg-page-' +");

html = html.replace(/id="sidebar"/g, 'id="wg-sidebar"');
html = html.replace(/id="sidebar-overlay"/g, 'id="wg-sidebar-overlay"');
html = html.replace(/id="hamburger-btn"/g, 'id="wg-hamburger-btn"');
html = html.replace(/id="main-search-input"/g, 'id="wg-main-search-input"');
html = html.replace(/id="global-search-input"/g, 'id="wg-global-search-input"');
html = html.replace(/id="page-/g, 'id="wg-page-');

css = css.replace(/--primary/g, '--wg-primary');
css = css.replace(/--accent/g, '--wg-accent');
css = css.replace(/--bg/g, '--wg-bg');
css = css.replace(/--text-/g, '--wg-text-');
css = css.replace(/--border/g, '--wg-border');
css = css.replace(/--yellow/g, '--wg-yellow');
css = css.replace(/--green/g, '--wg-green');
css = css.replace(/--red/g, '--wg-red');
css = css.replace(/--blue/g, '--wg-blue');
css = css.replace(/--sidebar-w/g, '--wg-sidebar-w');
css = css.replace(/--topbar-h/g, '--wg-topbar-h');
css = css.replace(/--bottombar-h/g, '--wg-bottombar-h');
css = css.replace(/--radius/g, '--wg-radius');
css = css.replace(/--shadow/g, '--wg-shadow');

// Quick fixes for the Quizziz styles resetting everything
css = css.replace('*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}', '/* resets removed */');
css = css.replace('html{font-size:14px;scroll-behavior:smooth}', '/* html styles removed */');
css = css.replace(/body\{[^\}]+\}/g, '/* body styles removed */');
css = css.replace('a{text-decoration:none;color:inherit}', '/* a styles removed */');
css = css.replace('button{border:none;cursor:pointer;font-family:inherit;font-size:inherit}', '/* button styles removed */');
css = css.replace('input{font-family:inherit;outline:none;border:none}', '/* input styles removed */');
css = css.replace('ul{list-style:none}', '/* ul styles removed */');
css = css.replace('img{max-width:100%;display:block}', '/* img styles removed */');

editorCss = editorCss.replace('html{font-size:14px}', '/* html styles removed */');
editorCss = editorCss.replace(/body\{[^\}]+\}/g, '/* body styles removed */');
editorCss = editorCss.replace('*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}', '/* resets removed */');
editorCss = editorCss.replace('.editor-topbar', '.wg-editor-topbar');
editorCss = editorCss.replace('.editor-container', '.wg-editor-container');

editorHtml = editorHtml.replace(/class="editor-topbar"/g, 'class="wg-editor-topbar"');
editorHtml = editorHtml.replace(/class="editor-container"/g, 'class="wg-editor-container"');


fs.writeFileSync(destDir + '/wg_styles.css', '\\n/* ================= WAYGROUND CSS ================= */\\n' + css + '\\n\\n/* ================= EDITOR CSS ================= */\\n' + editorCss);
fs.writeFileSync(destDir + '/wg_app.js', '\\n/* ================= WAYGROUND JS ================= */\\n' + js + '\\n\\n/* ================= EDITOR JS ================= */\\n' + editorJs);

const bodyMatch = html.match(/<body>([\s\S]*?)<script/);
const editorBodyMatch = editorHtml.match(/<body>([\s\S]*?)<script/);

let combinedHtml = '\\n<!-- ================= WAYGROUND SCREEN ================= -->\\n<section id="wayground-screen" class="hidden wg-wrapper" style="position: relative; min-height: 100vh;">\\n' + 
                   (bodyMatch ? bodyMatch[1] : '') + 
                   '\\n</section>\\n\\n' +
                   '<!-- ================= WAYGROUND EDITOR SCREEN ================= -->\\n<section id="wayground-editor-screen" class="hidden wg-wrapper" style="position: relative; min-height: 100vh; background: #F0F4FF;">\\n' + 
                   (editorBodyMatch ? editorBodyMatch[1] : '') + 
                   '\\n</section>\\n';

fs.writeFileSync(destDir + '/wg_html.txt', combinedHtml);
console.log('Done generating prefixed files');
