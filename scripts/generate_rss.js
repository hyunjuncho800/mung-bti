const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const domain = 'https://mung-test.com';

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

// 1. Data Loading
let blogData = [];
let foodData = [];
let breedsData = [];

try {
    const blogRaw = fs.readFileSync(path.join(rootDir, 'blog_data_merged.json'), 'utf-8');
    blogData = JSON.parse(blogRaw);
} catch (e) {
    console.error('Error loading blog data:', e);
}

try {
    const foodRaw = fs.readFileSync(path.join(rootDir, 'food_data.json'), 'utf-8');
    foodData = JSON.parse(foodRaw);
} catch (e) {
    console.error('Error loading food data:', e);
}

try {
    const breedsRaw = fs.readFileSync(path.join(rootDir, 'breeds_data.json'), 'utf-8');
    breedsData = JSON.parse(breedsRaw);
} catch (e) {
    console.error('Error loading breeds data:', e);
}

// 2. Prepare feed items
const feedItems = [];
const baseDate = new Date('2026-08-01T09:00:00+09:00');

// Blog items (Latest posts: id 30 down to 18 -> 13 items)
const latestBlogPosts = [...blogData].sort((a, b) => b.id - a.id).slice(0, 13);
latestBlogPosts.forEach((post, index) => {
    const itemDate = new Date(baseDate.getTime() - index * 3600 * 1000 * 12); // Every 12h backwards
    const cleanDesc = stripHtml(post.content || post.description || '').substring(0, 250);
    feedItems.push({
        title: `[댕댕이팁] ${post.title}`,
        link: `${domain}/blog/${post.id}`,
        guid: `${domain}/blog/${post.id}`,
        description: cleanDesc,
        category: post.category || '댕댕이팁',
        pubDate: itemDate.toUTCString(),
        timestamp: itemDate.getTime()
    });
});

// Food items (Selected top/recent foods -> 4 items)
const selectedFoodItems = [...foodData].slice(0, 4);
selectedFoodItems.forEach((food, index) => {
    const itemDate = new Date(baseDate.getTime() - (13 + index) * 3600 * 1000 * 12);
    const canEatStr = food.canEat ? '급여 가능 (O)' : '급여 금지 (X)';
    const title = `[음식 가이드] 강아지 ${food.name} 먹어도 될까요? ${canEatStr}`;
    const cleanDesc = `${food.name} (${food.category}): ${food.safetyLevel || ''}. ${food.description || ''}`.substring(0, 250);
    feedItems.push({
        title: title,
        link: `${domain}/food/${food.id}`,
        guid: `${domain}/food/${food.id}`,
        description: cleanDesc,
        category: '음식 가이드',
        pubDate: itemDate.toUTCString(),
        timestamp: itemDate.getTime()
    });
});

// Breeds items (Selected top breeds -> 3 items)
const selectedBreeds = [...breedsData].slice(0, 3);
selectedBreeds.forEach((breed, index) => {
    const itemDate = new Date(baseDate.getTime() - (17 + index) * 3600 * 1000 * 12);
    const title = `[견종 백과] ${breed.breedNameKo} (${breed.breedNameEn}) 성격 및 건강 관리 가이드`;
    const personality = breed.ko ? breed.ko.personality : '';
    const cleanDesc = `${breed.breedNameKo}: ${personality}`.substring(0, 250);
    feedItems.push({
        title: title,
        link: `${domain}/breeds/${breed.id}`,
        guid: `${domain}/breeds/${breed.id}`,
        description: cleanDesc,
        category: '견종 백과사전',
        pubDate: itemDate.toUTCString(),
        timestamp: itemDate.getTime()
    });
});

// Sort total 20 items by timestamp descending
feedItems.sort((a, b) => b.timestamp - a.timestamp);
const finalItems = feedItems.slice(0, 20);

const lastBuildDate = new Date().toUTCString();

// 3. Generate XML
const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>mung-test - 댕댕이 팁 &amp; 반려견 가이드</title>
    <link>${domain}</link>
    <description>강아지 기질 검사, 댕댕이 팁(블로그), 음식 가이드, 견종 백과사전 등 안전한 반려견 양육을 위한 종합 정보 가이드입니다.</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml" />
${finalItems.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <description>${escapeXml(item.description)}</description>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>
`;

// 4. Save to rss.xml in root
const targetPath = path.join(rootDir, 'rss.xml');
fs.writeFileSync(targetPath, rssXml, 'utf-8');
console.log(`Successfully generated valid RSS XML with ${finalItems.length} items at ${targetPath}`);

// 5. Also prepare rss/index.xml and rss/index.html for static hosting fallback
const rssDir = path.join(rootDir, 'rss');
if (!fs.existsSync(rssDir)) {
    fs.mkdirSync(rssDir, { recursive: true });
}
fs.writeFileSync(path.join(rssDir, 'index.xml'), rssXml, 'utf-8');
fs.writeFileSync(path.join(rssDir, 'index.html'), rssXml, 'utf-8');
console.log(`Saved copies to ${path.join(rssDir, 'index.xml')} and ${path.join(rssDir, 'index.html')}`);
