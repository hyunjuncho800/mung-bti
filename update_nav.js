const fs = require('fs');

const files = [
    'index.html',
    'mung-test.html',
    'blog.html',
    'food-guide.html',
    'age-calculator.html',
    'size-calculator.html'
];

const newLinks = `                <li><a href="breeds.html" data-i18n="nav_breeds">견종 백과사전</a></li>
                <li><a href="diagnostics.html" data-i18n="nav_diagnostics">자가진단 가이드</a></li>
                <li><a href="travel.html" data-i18n="nav_travel">여행 가이드</a></li>
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if already added
    if (!content.includes('nav_breeds')) {
        // Insert right before </ul> inside <nav>
        content = content.replace(/(\s*)<\/ul>\s*<\/nav>/, `\n${newLinks}$1</ul>\n        </nav>`);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated nav in ${file}`);
    } else {
        console.log(`Nav already updated in ${file}`);
    }
});
