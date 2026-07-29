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
                        <li><a href="/test" data-i18n="nav_test">반려견 기질 검사</a></li>
                        <li><a href="/size-calculator" data-i18n="nav_size">의류 사이즈 추천기</a></li>
                        <li><a href="/age-calculator" data-i18n="nav_age">나이 계산기</a></li>
                    </ul>
                </li>
            </ul>
        </nav>`;

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
            // Regex to match header <nav> ... </nav>
            // Note: footer has a nav too, so we target <nav> inside header or first <nav> before </header>
            const headerNavRegex = /<header[\s\S]*?<\/header>/;
            const headerMatch = content.match(headerNavRegex);

            if (headerMatch) {
                let headerContent = headerMatch[0];
                const navRegex = /<nav>[\s\S]*?<\/nav>/;
                if (navRegex.test(headerContent)) {
                    let updatedHeader = headerContent.replace(navRegex, newNav);
                    // Ensure logo link points to '/'
                    updatedHeader = updatedHeader.replace(/<a href="index\.html" class="logo"/, '<a href="/" class="logo"');
                    content = content.replace(headerContent, updatedHeader);
                    fs.writeFileSync(fullPath, content, 'utf8');
                    count++;
                }
            }
        }
    }
}

processDir('.');
console.log(`Successfully updated ${count} HTML files.`);
