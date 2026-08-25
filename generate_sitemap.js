const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://mung-test.com';
const MIN_TEXT_LENGTH = 400; // 애드센스용 양질 포스트 최소 텍스트 글자 수 기준

// Strip HTML tags and collapse whitespace to count pure readable Korean/English text
function getPureTextLength(filePath) {
    if (!fs.existsSync(filePath)) return 0;
    const raw = fs.readFileSync(filePath, 'utf8');

    // Extract main content zone if present
    let contentZone = raw;
    const bodyMatch = raw.match(/<main[\s\S]*?<\/main>/i) || raw.match(/<body[\s\S]*?<\/body>/i);
    if (bodyMatch) {
        contentZone = bodyMatch[0];
    }

    // Strip header, footer, script, style tags
    contentZone = contentZone.replace(/<header[\s\S]*?<\/header>/gi, '');
    contentZone = contentZone.replace(/<footer[\s\S]*?<\/footer>/gi, '');
    contentZone = contentZone.replace(/<script[\s\S]*?<\/script>/gi, '');
    contentZone = contentZone.replace(/<style[\s\S]*?<\/style>/gi, '');
    contentZone = contentZone.replace(/<!--[\s\S]*?-->/g, '');

    // Strip all HTML tags
    const pureText = contentZone.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return pureText.length;
}

function generateSitemap() {
    const urls = [];
    const excludedUrls = [];

    // 1. Core pages (Main, Major Directories, Policies)
    const corePages = [
        { path: 'index.html', loc: '/', freq: 'daily', prio: '1.0' },
        { path: 'breeds.html', loc: '/breeds', freq: 'weekly', prio: '0.8' },
        { path: 'diagnostics.html', loc: '/diagnostics', freq: 'weekly', prio: '0.8' },
        { path: 'blog.html', loc: '/blog', freq: 'weekly', prio: '0.8' },
        { path: 'food-guide.html', loc: '/food-guide', freq: 'weekly', prio: '0.8' },
        { path: 'travel.html', loc: '/travel', freq: 'weekly', prio: '0.8' },
        { path: 'about.html', loc: '/about', freq: 'monthly', prio: '0.5' },
        { path: 'privacy.html', loc: '/privacy', freq: 'monthly', prio: '0.5' },
        { path: 'terms.html', loc: '/terms', freq: 'monthly', prio: '0.5' },
        { path: 'contact.html', loc: '/contact', freq: 'monthly', prio: '0.5' }
    ];

    for (const page of corePages) {
        const textLen = getPureTextLength(page.path);
        if (textLen >= 200 || page.loc === '/' || page.loc === '/blog' || page.loc === '/breeds') {
            urls.push({ loc: `${DOMAIN}${page.loc}`, changefreq: page.freq, priority: page.prio, len: textLen });
        } else {
            excludedUrls.push({ loc: `${DOMAIN}${page.loc}`, reason: `Text length too short (${textLen} chars)` });
        }
    }

    // 2. Blog Posts (1 to 30) - Check quality text length
    for (let i = 1; i <= 30; i++) {
        const filePath = path.join('blog', String(i), 'index.html');
        const textLen = getPureTextLength(filePath);
        if (textLen >= MIN_TEXT_LENGTH) {
            urls.push({ loc: `${DOMAIN}/blog/${i}`, changefreq: 'weekly', priority: '0.7', len: textLen });
        } else if (fs.existsSync(filePath)) {
            excludedUrls.push({ loc: `${DOMAIN}/blog/${i}`, reason: `Text length too short (${textLen} chars < ${MIN_TEXT_LENGTH})` });
        }
    }

    // 3. Breed Guides (1 to 10) - Check quality text length
    for (let i = 1; i <= 10; i++) {
        const filePath = path.join('breeds', String(i), 'index.html');
        const textLen = getPureTextLength(filePath);
        if (textLen >= MIN_TEXT_LENGTH) {
            urls.push({ loc: `${DOMAIN}/breeds/${i}`, changefreq: 'weekly', priority: '0.7', len: textLen });
        } else if (fs.existsSync(filePath)) {
            excludedUrls.push({ loc: `${DOMAIN}/breeds/${i}`, reason: `Text length too short (${textLen} chars < ${MIN_TEXT_LENGTH})` });
        }
    }

    // 4. Food Guides (1 to 100) - Check quality text length (Short single-line food pages will be filtered out)
    for (let i = 1; i <= 100; i++) {
        const filePath = path.join('food', String(i), 'index.html');
        const textLen = getPureTextLength(filePath);
        if (textLen >= MIN_TEXT_LENGTH) {
            urls.push({ loc: `${DOMAIN}/food/${i}`, changefreq: 'weekly', priority: '0.7', len: textLen });
        } else if (fs.existsSync(filePath)) {
            excludedUrls.push({ loc: `${DOMAIN}/food/${i}`, reason: `Short content filtered out (${textLen} chars < ${MIN_TEXT_LENGTH})` });
        }
    }

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const u of urls) {
        xml += `  <url>\n`;
        xml += `    <loc>${u.loc}</loc>\n`;
        xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
        xml += `    <priority>${u.priority}</priority>\n`;
        xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    fs.writeFileSync('sitemap.xml', xml, 'utf8');

    console.log(`==========================================`);
    console.log(`Sitemap generated successfully!`);
    console.log(`- Included Quality URLs: ${urls.length}`);
    console.log(`- Excluded Thin Content URLs: ${excludedUrls.length}`);
    console.log(`==========================================`);
}

generateSitemap();
