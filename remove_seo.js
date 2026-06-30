const fs = require('fs');
let c = fs.readFileSync('mung-test.html', 'utf8');
const startTag = '<!-- SEO를 위한 상세 가이드 아티클 (약 1,500자 분량) -->';
const endTag = '</article>';
const startIndex = c.indexOf(startTag);
if (startIndex !== -1) {
    const endIndex = c.indexOf(endTag, startIndex);
    if (endIndex !== -1) {
        c = c.substring(0, startIndex) + c.substring(endIndex + endTag.length);
        fs.writeFileSync('mung-test.html', c);
        console.log('Removed SEO article successfully.');
    }
}
