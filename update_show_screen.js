const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

js = js.replace(
`    screens.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
            if (id === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}`,
`    screens.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
            if (id === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });

    if (screenId === 'wayground-screen' || screenId === 'wayground-editor-screen') {
        document.body.classList.add('wayground-active');
    } else {
        document.body.classList.remove('wayground-active');
    }
}`
);

fs.writeFileSync('script.js', js);
console.log('Updated showScreen');
