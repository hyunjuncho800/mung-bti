const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '..');

const newHeader = `<header>
    <div class="header-inner">
        <a href="/index.html" class="logo" style="color: var(--primary);">🐾 반려견 종합 라이프 가이드</a>
        <button class="menu-toggle" aria-label="메뉴 열기">☰</button>
        <nav>
            <ul>
                <li><a href="/index.html">홈</a></li>
                <li><a href="/mung-test.html">기질 검사</a></li>
                <li><a href="/blog.html">댕댕이팁</a></li>
                <li><a href="/food-guide.html">음식 가이드</a></li>
                <li><a href="/breeds.html">견종 백과</a></li>
                <li><a href="/size-calculator.html">의류/나이 계산기</a></li>
            </ul>
        </nav>
        <div class="header-actions">
            <button id="btn-lang" class="header-btn" aria-label="언어 변경">EN</button>
            <button id="btn-theme" class="header-btn" aria-label="테마 변경">🌙</button>
        </div>
    </div>
</header>`;

const newFooter = `<footer class="site-footer" style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; margin-top: 40px;">
    <nav style="margin-bottom: 20px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <li><a href="/about.html" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">사이트 소개</a></li>
            <li><a href="/terms.html" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">이용약관</a></li>
            <li><a href="/privacy.html" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">개인정보처리방침</a></li>
            <li><a href="/contact.html" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">문의하기</a></li>
        </ul>
    </nav>
    <p style="font-size: 0.8rem; color:var(--text-muted); margin: 0;">&copy; 2026 mung-test.com. All rights reserved.</p>
</footer>`;

// I will use absolute paths for href like "/index.html" to work correctly on sub-paths as well.
// But wait, the user's project might be hosted at hyunjuncho800.github.io/mung-bti/, where absolute path "/index.html" would go to hyunjuncho800.github.io/index.html instead of hyunjuncho800.github.io/mung-bti/index.html.
// So let's stick to relative paths, or check how they are currently used.
// Currently they use href="index.html" which is relative.
// For the generated blog/[id]/index.html, we can use `../../index.html` or calculate the relative path.
// The update_nav.js here only targets the root html files.

const newHeaderRoot = newHeader.replace(/href="\//g, 'href="');
const newFooterRoot = newFooter.replace(/href="\//g, 'href="');

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const fullPath = path.join(directory, file);
        let content = fs.readFileSync(fullPath, 'utf-8');
        
        // Replace header
        content = content.replace(/<header>[\s\S]*?<\/header>/i, newHeaderRoot);
        // Replace footer - find <footer ...> ... </footer>
        content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/i, newFooterRoot);
        
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated nav and footer in: ${file}`);
    }
});

console.log('Nav and footer update complete.');
