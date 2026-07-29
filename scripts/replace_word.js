const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '..');
const targetWord = /멍BTI/g;
const replacement = '반려견 기질 검사';

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['.git', 'node_modules', 'scripts'].includes(file)) {
                walkDir(fullPath);
            }
        } else {
            if (/\.(html|js|json)$/.test(file)) {
                let content = fs.readFileSync(fullPath, 'utf-8');
                if (targetWord.test(content)) {
                    content = content.replace(targetWord, replacement);
                    fs.writeFileSync(fullPath, content, 'utf-8');
                    console.log(`Replaced in: ${fullPath}`);
                }
            }
        }
    });
}

walkDir(directory);
console.log('Replacement complete.');
