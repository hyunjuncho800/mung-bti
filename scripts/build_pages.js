const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// 1. Read layout base from index.html to get header and footer
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const headerMatch = indexHtml.match(/<header>[\s\S]*?<\/header>/i);
const footerMatch = indexHtml.match(/<footer[^>]*>[\s\S]*?<\/footer>/i);
const headerHtml = headerMatch ? headerMatch[0] : '';
const footerHtml = footerMatch ? footerMatch[0] : '';

// Common dynamic links for the bottom
const dynamicLinks = `
<div style="margin-top: 40px; padding: 30px; background: #fff; border-radius: 12px; text-align: center; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
    <h3 style="margin-bottom: 20px; color: var(--primary-dark); font-size: 1.3rem;">더 많은 맞춤 정보를 확인해보세요!</h3>
    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <a href="/mung-test.html" style="background-color: var(--primary); color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">반려견 기질 검사하기 🐕</a>
        <a href="/size-calculator.html" style="background-color: var(--primary); color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">맞춤 의류 사이즈 찾기 👕</a>
    </div>
</div>
`;

function generateHTML(title, desc, contentBody, canonicalUrl) {
    const fullCanonical = `https://mung-test.com${canonicalUrl}`;
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | mung-test.com</title>
    <meta name="description" content="${desc}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${fullCanonical}">
    
    <!-- OpenGraph SEO -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title} | mung-test.com">
    <meta property="og:description" content="${desc}">
    <meta property="og:url" content="${fullCanonical}">
    <meta property="og:site_name" content="mung-test.com">
    <meta property="og:image" content="https://mung-test.com/share_thumbnail.jpg">

    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="/style.css">
    <script src="/i18n.js"></script>
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <style>
        .post-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background: var(--bg);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            border: 1px solid var(--border);
        }
        .content-body h1 { font-size: 2rem; color: var(--primary-dark); margin-bottom: 20px; border-bottom: 2px solid var(--border); padding-bottom: 10px; line-height: 1.3; }
        .content-body h2 { font-size: 1.4rem; color: var(--text); margin-top: 30px; margin-bottom: 16px; }
        .content-body p { font-size: 1.05rem; line-height: 1.8; color: var(--text); margin-bottom: 16px; }
        .content-body ul { margin-bottom: 16px; padding-left: 20px; }
        .content-body li { font-size: 1.05rem; line-height: 1.8; color: var(--text); margin-bottom: 8px; }
        .back-link { display: inline-block; margin-bottom: 20px; color: var(--primary); font-weight: bold; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
        @media(max-width: 600px) {
            .post-container { padding: 20px; margin: 20px; border-radius: 12px; }
            .content-body h1 { font-size: 1.5rem; }
        }
    </style>
</head>
<body>
${headerHtml}
<main class="container">
    <div class="post-container">
        <div class="content-body">
            ${contentBody}
        </div>
        ${dynamicLinks}
    </div>
</main>
${footerHtml}
</body>
</html>`;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// 1. Build Blog
const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'blog_data_merged.json'), 'utf-8'));
blogData.forEach(post => {
    const dir = path.join(rootDir, 'blog', String(post.id));
    ensureDir(dir);
    
    // clean excerpt
    const desc = (post.content || '').replace(/<[^>]*>?/gm, '').substring(0, 150).trim() + '...';
    
    const body = `
        <a href="/blog.html" class="back-link">← 목록으로 돌아가기</a>
        <h1>${post.title}</h1>
        <div>${post.content}</div>
    `;
    
    const html = generateHTML(post.title, desc, body, `/blog/${post.id}`);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
});

// 2. Build Food
const foodData = JSON.parse(fs.readFileSync(path.join(rootDir, 'food_data.json'), 'utf-8'));
foodData.forEach(item => {
    const dir = path.join(rootDir, 'food', String(item.id));
    ensureDir(dir);
    
    const title = `${item.name} (${item.category})`;
    const desc = `우리 강아지 ${item.name} 먹어도 될까요? 급여 안전도: ${item.safetyLevel}. ${item.description.substring(0, 100)}`;
    
    let safetyColor = item.canEat ? '#4CAF50' : '#F44336';
    if(item.safetyLevel.includes('소량')) safetyColor = '#FF9800';

    const body = `
        <a href="/food-guide.html" class="back-link">← 음식 가이드로 돌아가기</a>
        <h1>강아지 ${item.name} 급여 가이드</h1>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid ${safetyColor};">
            <h2 style="margin-top: 0;">급여 안전도: <span style="color: ${safetyColor};">${item.safetyLevel}</span></h2>
        </div>
        <h2>상세 설명</h2>
        <p>${item.description}</p>
    `;
    
    const html = generateHTML(title, desc, body, `/food/${item.id}`);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
});

// 3. Build Breeds
const breedsData = JSON.parse(fs.readFileSync(path.join(rootDir, 'breeds_data.json'), 'utf-8'));
breedsData.forEach(breed => {
    const dir = path.join(rootDir, 'breeds', String(breed.id));
    ensureDir(dir);
    
    const title = `${breed.breedNameKo} (${breed.breedNameEn})`;
    const desc = `${breed.breedNameKo}의 역사, 성격, 주의할 건강 문제와 맞춤형 의류 팁까지 한눈에 확인하세요.`;
    
    const body = `
        <a href="/breeds.html" class="back-link">← 견종 백과로 돌아가기</a>
        <h1>${breed.breedNameKo} 백과사전</h1>
        
        <h2>📜 역사 및 기원</h2>
        <p>${breed.ko.history}</p>
        
        <h2>🧠 성격 및 기질</h2>
        <p>${breed.ko.personality}</p>
        
        <h2>🩺 건강 관리</h2>
        <p>${breed.ko.health}</p>
        
        <h2>👕 의류 및 사이즈 팁</h2>
        <p>${breed.ko.clothing}</p>
    `;
    
    const html = generateHTML(title, desc, body, `/breeds/${breed.id}`);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
});

console.log('Static Pages Built successfully.');
