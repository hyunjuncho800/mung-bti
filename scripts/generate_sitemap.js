const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const domain = 'https://mung-test.com';

// 유의미한 주요 정적 정보 및 서비스 메인 라우트
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

const rawUrls = [...baseRoutes];

// 1. 블로그 아티클 정적 라우트
try {
    const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'blog_data_merged.json'), 'utf-8'));
    blogData.forEach(post => {
        if (post && post.id) {
            rawUrls.push(`/blog/${post.id}`);
        }
    });
} catch(e) { console.error('Error reading blog data', e); }

// 2. 음식 가이드 정적 라우트
try {
    const foodData = JSON.parse(fs.readFileSync(path.join(rootDir, 'food_data.json'), 'utf-8'));
    foodData.forEach(item => {
        if (item && item.id) {
            rawUrls.push(`/food/${item.id}`);
        }
    });
} catch(e) { console.error('Error reading food data', e); }

// 3. 견종 백과 정적 라우트
try {
    const breedsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'breeds_data.json'), 'utf-8'));
    breedsData.forEach(breed => {
        if (breed && breed.id) {
            rawUrls.push(`/breeds/${breed.id}`);
        }
    });
} catch(e) { console.error('Error reading breeds data', e); }

// 제외 필터링 (파라미터 URL, 퀴즈, 결과, 공유 등 동적 URL 철저히 제외)
const filteredUrls = Array.from(new Set(rawUrls)).filter(url => {
    if (!url) return false;
    if (url.includes('?') || url.includes('#')) return false;
    if (url.includes('/result') || url.includes('/quiz') || url.includes('/share')) return false;
    return true;
});

const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${filteredUrls.map(url => `  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : (url.includes('/about') || url.includes('/privacy') || url.includes('/terms') || url.includes('/contact')) ? '0.5' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`Successfully generated sitemap.xml with ${filteredUrls.length} valid static URLs.`);

