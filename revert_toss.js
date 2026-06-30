const fs = require('fs');

// 1. Revert style.css variables
let style = fs.readFileSync('style.css', 'utf8');

// Replace light mode variables
style = style.replace(/--bg: #FFFFFF;\s*--primary: #0064FF;\s*--primary-dark: #0050CC;\s*--primary-light: #E5F0FF;\s*--accent: #FF5C00;\s*--green: #27ae60;\s*--green-light: #e8f8ef;\s*--text: #191F28;\s*--text-muted: #8B95A1;\s*--card: #F2F4F6;\s*--border: transparent;\s*--shadow-sm: 0 2px 8px rgba\(0,0,0,0\.04\);\s*--shadow-md: 0 8px 24px rgba\(0,0,0,0\.06\);\s*--shadow-lg: 0 16px 40px rgba\(0,0,0,0\.08\);\s*--radius: 16px;\s*--radius-lg: 24px;\s*--transition: 0\.2s cubic-bezier\(0\.25, 0\.8, 0\.25, 1\);/, 
`--bg: #F9F6F0;
        --primary: #FF7A45;
        --primary-dark: #E66533;
        --primary-light: #FFF0EB;
        --accent: #f5a623;
        --green: #27ae60;
        --green-light: #e8f8ef;
        --text: #2A2A2A;
        --text-muted: #6B7280;
        --card: #FFFFFF;
        --border: #E5E0D8;
        --shadow-sm: 0 4px 12px rgba(0,0,0,0.02);
        --shadow-md: 0 8px 30px rgba(0,0,0,0.02);
        --shadow-lg: 0 16px 40px rgba(0,0,0,0.04);
        --radius: 16px;
        --radius-lg: 24px;
        --transition: 0.2s ease;`);

// Replace dark mode variables
style = style.replace(/--bg: #191F28;\s*--card: #242A32;\s*--text: #F9FAFB;\s*--text-muted: #8B95A1;\s*--border: transparent;\s*--primary: #3384FF;\s*--primary-dark: #0064FF;\s*--primary-light: #1A3C6B;/, 
`--bg: #18191A;
            --card: #242526;
            --text: #E4E6EB;
            --text-muted: #B0B3B8;
            --border: #3A3B3C;
            --primary: #FF8E5E;
            --primary-dark: #FF7A45;
            --primary-light: #3A251E;`);

// Replace hover shadow
style = style.replace(/box-shadow: 0 4px 15px rgba\(0, 100, 255, 0\.2\);/, 'box-shadow: 0 4px 15px rgba(255, 122, 69, 0.2);');

fs.writeFileSync('style.css', style, 'utf8');

// 2. Revert index.html layout and animation
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/ class="([^"]*)fade-in-up([^"]*)"/g, ' class="$1$2"');
indexHtml = indexHtml.replace(/ class="([^"]*) fade-in-up([^"]*)"/g, ' class="$1$2"');
// Clean up double spaces in class
indexHtml = indexHtml.replace(/ class="([^"]*)  ([^"]*)"/g, ' class="$1 $2"');

// Revert styles
indexHtml = indexHtml.replace(/padding: 100px 20px 80px;/g, 'padding: 60px 20px 40px;');
indexHtml = indexHtml.replace(/font-size: 3\.5rem; font-weight: 900; letter-spacing: -0\.03em;/g, 'font-size: 2.8rem;');
indexHtml = indexHtml.replace(/font-size: 1\.25rem;/g, 'font-size: 1.15rem;');
indexHtml = indexHtml.replace(/gap: 32px;/g, 'gap: 20px;');
indexHtml = indexHtml.replace(/padding: 40px 32px;/g, 'padding: 30px 24px;');
indexHtml = indexHtml.replace(/border-radius: 16px;/g, 'border-radius: 20px;');

// Remove Toss style block
indexHtml = indexHtml.replace(/\/\* Toss Redesign Styles \*\/[\s\S]*?<\/style>/, '</style>');
// Remove script block
indexHtml = indexHtml.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => {[\s\S]*?IntersectionObserver[\s\S]*?<\/script>\s*<\/body>/, '</body>');

fs.writeFileSync('index.html', indexHtml, 'utf8');

// 3. Revert hero backgrounds in subpages
const revertHero = (file, gradient, border) => {
    if (!fs.existsSync(file)) return;
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/background: var\(--bg\);/, `background: ${gradient};`);
    c = c.replace(/border-bottom: none;/, `border-bottom: ${border};`);
    // ensure version query is updated
    c = c.replace(/style\.css\?v=[a-zA-Z0-9_]+/g, 'style.css?v=original_v1');
    fs.writeFileSync(file, c, 'utf8');
};

revertHero('blog.html', 'linear-gradient(135deg, #fff7e6 0%, #fff 100%)', '1px solid #f0e6d2');
revertHero('food-guide.html', 'linear-gradient(135deg, #e8f8ef 0%, #fff 100%)', '1px solid #d1eedc');
revertHero('age-calculator.html', 'linear-gradient(135deg, #FFF0EB 0%, #fff 100%)', '1px solid #FFE0D1');
revertHero('size-calculator.html', 'linear-gradient(135deg, #F0F4FF 0%, #fff 100%)', '1px solid #D9E4FF');

// Update other html files cache string
['index.html', 'mung-test.html', 'breeds.html', 'diagnostics.html', 'travel.html'].forEach(file => {
    if(!fs.existsSync(file)) return;
    let c = fs.readFileSync(file, 'utf8');
    c = c.replace(/style\.css\?v=[a-zA-Z0-9_]+/g, 'style.css?v=original_v1');
    fs.writeFileSync(file, c, 'utf8');
});

// Update the logo text color logic we added in fix_header.js (if any, keep the color logic but maybe change it back to original orange var(--primary))
// Actually #FF5C00 is fine, or we can change it to var(--primary) which is #FF7A45. Let's do var(--primary).
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/style="color: #FF5C00;"/g, 'style="color: var(--primary);"');
    fs.writeFileSync(f, c, 'utf8');
});

console.log('Reverted to original design.');
