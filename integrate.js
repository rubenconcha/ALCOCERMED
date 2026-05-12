const fs = require('fs');

try {
    const htmlFile = 'index.html';
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Insert nav item
    const navItem = `
                    <li class="nav-item nav-item-simple" id="nav-wayground">
                        <a href="#" onclick="openWayground(); return false;" data-tooltip="wayground">
                            <span class="nav-icon" style="background: linear-gradient(135deg, #6C2EB9, #8B5CF6); color: #fff;">
                                <i class="fas fa-gamepad"></i>
                            </span>
                            <span class="nav-label">wayground</span>
                            <span class="nav-badge badge-new">NUEVO</span>
                        </a>
                    </li>
    `;

    // Only insert if it doesn't exist
    if (!html.includes('id="nav-wayground"')) {
        // Fix the regex to avoid removing closing ul tag accidentally
        const idx = html.indexOf('<!-- ══ JUEGOS ══ -->');
        if (idx !== -1) {
            // Find the </ul> immediately preceding JUEGOS
            const subHtml = html.substring(0, idx);
            const ulIdx = subHtml.lastIndexOf('</ul>');
            if (ulIdx !== -1) {
                html = subHtml.substring(0, ulIdx) + navItem + subHtml.substring(ulIdx) + html.substring(idx);
            }
        }
    }

    // Insert home card
    const homeCard = `
                    <div class="home-card" style="background: linear-gradient(135deg, #F0EAFF, #E8DEFF); border: 1px solid #C4A1FF;" onclick="openWayground()">
                        <div class="hc-icon" style="color: #6C2EB9;"><i class="fas fa-gamepad"></i></div>
                        <div class="hc-body">
                            <h3 style="color: #6C2EB9;">wayground</h3>
                            <p style="color: #6C2EB9;">creador de evaluaciones y recursos interactivos</p>
                        </div>
                        <i class="fas fa-arrow-right hc-arrow" style="color: #6C2EB9;"></i>
                    </div>
    `;

    if (!html.includes('openWayground()')) {
        const hIdx = html.indexOf('<!-- Sección materias -->');
        if (hIdx !== -1) {
            const hSub = html.substring(0, hIdx);
            const divIdx = hSub.lastIndexOf('</div>');
            if (divIdx !== -1) {
                html = hSub.substring(0, divIdx) + homeCard + hSub.substring(divIdx) + html.substring(hIdx);
            }
        }
    }

    // Insert screens
    if (!html.includes('id="wayground-screen"')) {
        const screensHtml = fs.readFileSync('wg_html.txt', 'utf8');
        html = html.replace('</main>', screensHtml + '\\n    </main>');
    }

    fs.writeFileSync(htmlFile, html);
    
    // Process JS
    let js = fs.readFileSync('script.js', 'utf8');
    if (!js.includes('window.openWayground')) {
        const jsAppend = `
// ==========================================
// WAYGROUND INTEGRATION
// ==========================================
window.openWayground = function() {
    showScreen('wayground-screen');
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
};

window.openWaygroundEditor = function() {
    showScreen('wayground-editor-screen');
};
`;
        
        // Also add wayground-screen to showScreen array
        js = js.replace(/const screens = \['(.*?)'\];/, "const screens = ['$1', 'wayground-screen', 'wayground-editor-screen'];");
        
        fs.writeFileSync('script.js', js + '\\n' + fs.readFileSync('wg_app.js', 'utf8') + '\\n' + jsAppend);
    }
    
    // Process CSS
    let css = fs.readFileSync('styles.css', 'utf8');
    if (!css.includes('WAYGROUND CSS')) {
        fs.writeFileSync('styles.css', css + '\\n\\n' + fs.readFileSync('wg_styles.css', 'utf8'));
    }

    console.log('Integration completed successfully!');
} catch (e) {
    console.error(e);
}
