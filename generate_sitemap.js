const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://mung-test.com';

function generateSitemap() {
    const urls = [];

    // 1. Home
    urls.push({ loc: `${DOMAIN}/`, changefreq: 'daily', priority: '1.0' });

    // 2. Main services & tools
    const mainPages = [
        '/breeds',
        '/diagnostics',
        '/blog',
        '/food-guide',
        '/travel',
        '/mung-test',
        '/size-calculator',
        '/age-calculator'
    ];

    for (const page of mainPages) {
        urls.push({ loc: `${DOMAIN}${page}`, changefreq: 'weekly', priority: '0.8' });
    }

    // 3. Policy & Info pages
    const infoPages = [
        '/about',
        '/privacy',
        '/terms',
        '/contact'
    ];

    for (const page of infoPages) {
        urls.push({ loc: `${DOMAIN}${page}`, changefreq: 'monthly', priority: '0.5' });
    }

    // 4. Blog Posts (1 to 30)
    for (let i = 1; i <= 30; i++) {
        if (fs.existsSync(path.join('blog', String(i), 'index.html'))) {
            urls.push({ loc: `${DOMAIN}/blog/${i}`, changefreq: 'weekly', priority: '0.7' });
        }
    }

    // 5. Breed Guides (1 to 10)
    for (let i = 1; i <= 10; i++) {
        if (fs.existsSync(path.join('breeds', String(i), 'index.html'))) {
            urls.push({ loc: `${DOMAIN}/breeds/${i}`, changefreq: 'weekly', priority: '0.7' });
        }
    }

    // 6. Food Guides (1 to 100)
    for (let i = 1; i <= 100; i++) {
        if (fs.existsSync(path.join('food', String(i), 'index.html'))) {
            urls.push({ loc: `${DOMAIN}/food/${i}`, changefreq: 'weekly', priority: '0.7' });
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
    console.log(`Successfully generated sitemap.xml with ${urls.length} clean URLs.`);
}

generateSitemap();
