const fs = require('fs');

const fileMap = {
    'index.html': { i18n: 'index_logo', text: '🐾 반려견 종합 라이프 가이드' },
    'breeds.html': { i18n: 'nav_breeds', text: '🐾 견종 백과사전' },
    'diagnostics.html': { i18n: 'nav_diagnostics', text: '🐾 자가진단 가이드' },
    'travel.html': { i18n: 'nav_travel', text: '🐾 여행 가이드' },
    'blog.html': { i18n: 'nav_blog', text: '🐾 댕댕이 팁(Blog)' },
    'food-guide.html': { i18n: 'nav_food', text: '🐾 음식 가이드' },
    'size-calculator.html': { i18n: 'nav_size', text: '🐾 의류 사이즈 추천기' },
    'age-calculator.html': { i18n: 'nav_age', text: '🐾 나이 계산기' },
    'mung-test.html': { i18n: 'nav_start', text: '🐾 반려견 기질 검사' }
};

const files = Object.keys(fileMap);

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Update logo
    const info = fileMap[file];
    const logoRegex = /<a href="index\.html" class="logo"[^>]*>.*?<\/a>/s;
    const newLogo = `<a href="index.html" class="logo" data-i18n="${info.i18n}" style="color: #FF5C00;">${info.text}</a>`;
    content = content.replace(logoRegex, newLogo);

    // 2. Re-order nav and header-actions
    // The standard we want:
    // <div class="header-inner">
    //   <a ...logo...>
    //   <button class="menu-toggle"...>
    //   <nav>...</nav>
    //   <div class="header-actions">...</div>
    // </div>

    // Check if header-actions comes before nav
    const actionsRegex = /(<div class="header-actions">[\s\S]*?<\/div>)\s*(<nav>[\s\S]*?<\/nav>)/;
    if (actionsRegex.test(content)) {
        content = content.replace(actionsRegex, '$2\n        $1');
    }

    // Ensure menu-toggle is OUTSIDE header-actions and BEFORE nav
    // If it's inside header-actions, move it out.
    if (content.includes('<button class="menu-toggle"')) {
        // remove it from wherever it is
        content = content.replace(/\s*<button class="menu-toggle"[^>]*>.*?<\/button>/, '');
        // insert before <nav>
        content = content.replace('<nav>', '<button class="menu-toggle" aria-label="메뉴 열기">☰</button>\n        <nav>');
    }

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed headers in all files.');
