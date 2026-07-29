const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const domain = 'https://mung-test.com';

const baseRoutes = [
    '/',
    '/mung-test.html',
    '/blog.html',
    '/food-guide.html',
    '/breeds.html',
    '/size-calculator.html',
    '/age-calculator.html',
    '/diagnostics.html',
    '/travel.html',
    '/about.html',
    '/privacy.html',
    '/terms.html',
    '/contact.html'
];

const urls = [...baseRoutes];

// 1. Add blog URLs
try {
    const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'blog_data_merged.json'), 'utf-8'));
    blogData.forEach(post => urls.push(`/blog/${post.id}`));
} catch(e) { console.error('Error reading blog data', e); }

// 2. Add food URLs
try {
    const foodData = JSON.parse(fs.readFileSync(path.join(rootDir, 'food_data.json'), 'utf-8'));
    foodData.forEach(item => urls.push(`/food/${item.id}`));
} catch(e) { console.error('Error reading food data', e); }

// 3. Add breeds URLs
try {
    const breedsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'breeds_data.json'), 'utf-8'));
    breedsData.forEach(breed => urls.push(`/breeds/${breed.id}`));
} catch(e) { console.error('Error reading breeds data', e); }

const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
