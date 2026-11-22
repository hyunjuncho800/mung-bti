// SEO 점검: sitemap의 모든 페이지가 검색엔진이 읽을 수 있는 상태인지, 사이트 안 링크가 깨지지 않았는지 확인한다.
// 실행: node scripts/check_seo.js   (빌드 후)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://mung-test.com';
const ALIASES = { '/test': 'mung-test.html', '/personality-test': 'mung-test.html', '/size-recommend': 'size-calculator.html', '/age-calc': 'age-calculator.html', '/rss': 'rss.xml' };

// 주소 -> 실제 파일 (Cloudflare Pages처럼 /a -> a.html, /a/ -> a/index.html)
function fileOf(url) {
    const p = decodeURI(url.split('#')[0].split('?')[0]);
    if (ALIASES[p]) return path.join(ROOT, ALIASES[p]);
    const cands = p.endsWith('/') ? [p + 'index.html'] : [p, p + '.html', p + '/index.html'];
    return cands.map(c => path.join(ROOT, c)).find(f => fs.existsSync(f) && fs.statSync(f).isFile()) || null;
}
const get = (html, re) => (html.match(re) || [])[1];

const urls = [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].replace(SITE, ''));
const problems = [];
const seenTitle = {}, seenDesc = {};
const bad = (u, msg) => problems.push(`${u}: ${msg}`);

for (const u of urls) {
    const f = fileOf(u);
    if (!f) { bad(u, '파일 없음'); continue; }
    const html = fs.readFileSync(f, 'utf8');
    const title = get(html, /<title>([^<]*)<\/title>/);
    const desc = get(html, /<meta name="description" content="([^"]*)"/);
    const canonical = get(html, /<link rel="canonical" href="([^"]*)"/);
    const robots = get(html, /<meta name="robots" content="([^"]*)"/) || '';
    if (!title) bad(u, 'title 없음'); else (seenTitle[title] = seenTitle[title] || []).push(u);
    if (!desc) bad(u, 'description 없음'); else {
        (seenDesc[desc] = seenDesc[desc] || []).push(u);
        const len = desc.replace(/&(quot|amp|lt|gt|#39);/g, '_').length;
        if (len < 50 || len > 170) bad(u, `description 길이 ${len}자`);
    }
    if (canonical !== SITE + u) bad(u, `canonical 다름: ${canonical}`);
    if (/noindex/.test(robots)) bad(u, 'sitemap에 있는데 noindex');
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) bad(u, `h1 ${(html.match(/<h1[\s>]/g) || []).length}개`);
    for (const p of ['og:title', 'og:description', 'og:image', 'og:url']) if (!html.includes(`property="${p}"`)) bad(u, `${p} 없음`);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try { JSON.parse(m[1]); } catch (e) { bad(u, '구조화 데이터 JSON 오류'); }
    }
    for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
        const href = m[1];
        if (href.startsWith('//') || /\.(css|png|jpg|webp|ico|xml|js)(\?|$)/.test(href.split('#')[0])) continue;
        if (!fileOf(href)) bad(u, `깨진 링크 ${href}`);
    }
}
for (const [t, us] of Object.entries(seenTitle)) if (us.length > 1) problems.push(`title 중복 "${t}": ${us.join(', ')}`);
for (const [d, us] of Object.entries(seenDesc)) if (us.length > 1) problems.push(`description 중복: ${us.join(', ')}`);

// robots.txt가 sitemap 페이지를 막지 않는지 (단순 접두어 규칙만 확인)
const robotsTxt = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
const disallow = [...robotsTxt.matchAll(/^Disallow:\s*(\S+)/gm)].map(m => m[1]).filter(r => !r.includes('*'));
for (const u of urls) if (disallow.some(r => r !== '/' && u.startsWith(r))) bad(u, 'robots.txt가 막음');
if (!/Sitemap:\s*https:\/\/mung-test\.com\/sitemap\.xml/.test(robotsTxt)) problems.push('robots.txt에 sitemap 주소 없음');

if (problems.length) {
    console.log(problems.join('\n'));
    console.log(`\n문제 ${problems.length}개 (페이지 ${urls.length}개 점검)`);
    process.exit(1);
}
console.log(`SEO 점검 통과: sitemap 페이지 ${urls.length}개`);
