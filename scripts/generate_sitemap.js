const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const domain = 'https://mung-test.com';

// Strict Whitelist definition
const sitemapUrls = [
    // 1. 메인 홈
    '/',

    // 2. 주요 검사 / 계산기 / 가이드 진입 대표 페이지 (단, 결과/파라미터 제외)
    '/mung-test.html',
    '/size-calculator.html',
    '/age-calculator.html',
    '/blog.html',
    '/food-guide.html',
    '/breeds.html',
    '/diagnostics.html',
    '/travel.html',

    // 3. 필수 정책 페이지
    '/about',
    '/privacy',
    '/terms',
    '/contact'
];

// 4. 정보성 풍부한 아티클 정적 포스팅 (블로그 글 1~30)
try {
    const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'blog_data_merged.json'), 'utf-8'));
    blogData.forEach(post => {
        if (post && post.id) {
            sitemapUrls.push(`/blog/${post.id}`);
        }
    });
} catch(e) {
    console.error('Error reading blog data', e);
}

// 5. 견종 백과사전 개별 정적 아티클
try {
    const breedsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'breeds_data.json'), 'utf-8'));
    breedsData.forEach(breed => {
        if (breed && breed.id) {
            sitemapUrls.push(`/breeds/${breed.id}`);
        }
    });
} catch(e) {
    console.error('Error reading breeds data', e);
}

// 최종 화이트리스트 필터링: 파라미터(?), result, quiz, share 등 동적 URL 배제
const whitelistUrls = Array.from(new Set(sitemapUrls)).filter(url => {
    if (!url) return false;
    if (url.includes('?') || url.includes('#')) return false;
    if (url.includes('/result') || url.includes('/quiz') || url.includes('/share')) return false;
    return true;
});

const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${whitelistUrls.map(url => `  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : (url.startsWith('/about') || url.startsWith('/privacy') || url.startsWith('/terms') || url.startsWith('/contact')) ? '0.5' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`Generated whitelist-based sitemap.xml with exactly ${whitelistUrls.length} URLs.`);


