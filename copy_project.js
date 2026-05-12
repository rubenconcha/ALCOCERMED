const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\PC\\Documents\\proyecto quizziz';
const destDir = 'c:\\Users\\PC\\Documents\\2DO AÑO RESIDENCIA\\RUBEN\\RUBEN\\PLATAFORMA BENCARSON\\ALCOCERMED\\juegos';

function copyFiles(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    
    fs.readdirSync(src).forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyFiles(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

copyFiles(srcDir, destDir);
console.log('Copied all Quizziz files to juegos folder.');
