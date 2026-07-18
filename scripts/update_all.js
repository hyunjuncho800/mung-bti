const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\HJ\\Desktop\\강아지심리테스트';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newNav = `<nav>
            <ul>
                <li><a href="index.html" class="active" data-i18n="nav_home">홈</a></li>
                <li><a href="breeds.html" data-i18n="nav_breeds">견종 백과사전</a></li>
                <li><a href="diagnostics.html" data-i18n="nav_diagnostics">자가진단 가이드</a></li>
                <li><a href="travel.html" data-i18n="nav_travel">여행 가이드</a></li>
            </ul>
        </nav>`;

const newFooter = `<footer class="site-footer" style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; margin-top: 40px;">
    <div class="footer-links" style="margin-bottom: 10px; font-size: 0.9rem;">
        <a href="about.html" style="color: var(--text-muted); text-decoration: none; margin: 0 5px;">사이트 소개(About)</a> |
        <a href="privacy.html" style="color: var(--text-muted); text-decoration: none; margin: 0 5px;">개인정보처리방침</a> |
        <a href="terms.html" style="color: var(--text-muted); text-decoration: none; margin: 0 5px;">이용약관</a> |
        <a href="contact.html" style="color: var(--text-muted); text-decoration: none; margin: 0 5px;">문의(Contact)</a>
    </div>
    <p style="font-size: 0.8rem; color:var(--text-muted); margin: 0;">&copy; 2026 mung-test.com. All rights reserved.</p>
</footer>`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Update Nav
    content = content.replace(/<nav>[\s\S]*?<\/nav>/, newNav);
    
    // Update Footer
    content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/, newFooter);
    
    // Hide specific services in index.html
    if (file === 'index.html') {
        const servicesToHide = [
            'href="mung-test.html"',
            'href="blog.html"',
            'href="food-guide.html"',
            'href="size-calculator.html"',
            'href="age-calculator.html"'
        ];
        
        servicesToHide.forEach(svc => {
            const regex = new RegExp(`(<a\\s+${svc}[\\s\\S]*?</a>)`, 'g');
            content = content.replace(regex, '<!-- $1 -->');
        });
    }

    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

console.log('HTML files updated successfully.');
