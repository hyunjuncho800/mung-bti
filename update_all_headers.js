const fs = require('fs');
const path = require('path');

const newNav = `        <nav>
            <ul class="nav-links">
                <li><a href="/" data-i18n="nav_home">홈</a></li>
                <li><a href="/breeds" data-i18n="nav_breeds">견종 백과사전</a></li>
                <li><a href="/diagnostics" data-i18n="nav_diagnostics">자가진단 가이드</a></li>
                <li><a href="/blog" data-i18n="nav_blog">댕댕이팁</a></li>
                <li><a href="/food" data-i18n="nav_food">음식 가이드</a></li>
                <li><a href="/travel" data-i18n="nav_travel">여행 가이드</a></li>
                <li class="nav-dropdown">
                    <a href="javascript:void(0)" class="dropdown-toggle" data-i18n="nav_calculators">추천 및 계산기 ▾</a>
                    <ul class="dropdown-menu">
                        <li><a href="/personality-test" data-i18n="nav_test">반려견 기질 검사</a></li>
                        <li><a href="/size-recommend" data-i18n="nav_size">의류 사이즈 추천기</a></li>
                        <li><a href="/age-calc" data-i18n="nav_age">나이 계산기</a></li>
                    </ul>
                </li>
            </ul>
        </nav>`;

const newFooter = `<footer class="site-footer" style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; margin-top: 40px;">
    <nav style="margin-bottom: 20px;">
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <li><a href="/about" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">사이트 소개</a></li>
            <li><a href="/terms" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">이용약관</a></li>
            <li><a href="/privacy" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">개인정보처리방침</a></li>
            <li><a href="/contact" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">문의하기</a></li>
        </ul>
    </nav>
    <p style="font-size: 0.8rem; color:var(--text-muted); margin: 0;">&copy; 2026 mung-test.com. All rights reserved.</p>
</footer>`;

let count = 0;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '.git' && file !== 'scripts' && file !== 'node_modules') {
                processDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // 1. Header update
            const headerNavRegex = /<header[\s\S]*?<\/header>/;
            const headerMatch = content.match(headerNavRegex);
            if (headerMatch) {
                let headerContent = headerMatch[0];
                const navRegex = /<nav>[\s\S]*?<\/nav>/;
                if (navRegex.test(headerContent)) {
                    let updatedHeader = headerContent.replace(navRegex, newNav);
                    updatedHeader = updatedHeader.replace(/<a href="index\.html" class="logo"/, '<a href="/" class="logo"');
                    content = content.replace(headerContent, updatedHeader);
                }
            }

            // 2. Footer update
            const footerRegex = /<footer[\s\S]*?<\/footer>/;
            if (footerRegex.test(content)) {
                content = content.replace(footerRegex, newFooter);
            }

            fs.writeFileSync(fullPath, content, 'utf8');
            count++;
        }
    }
}

processDir('.');
console.log(`Successfully updated ${count} HTML files for Header & Footer.`);
