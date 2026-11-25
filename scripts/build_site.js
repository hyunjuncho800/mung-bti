// 멍테스트 페이지 생성기. 성격 테스트(index.html)를 뺀 모든 페이지를 하나의 레이아웃으로 만든다.
// 실행: node scripts/build_site.js   (외부 패키지 없음)
// 원본: *_data.json, content/pages/*.html, content/tools/*.html
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://mung-test.com';
const TODAY = new Date().toISOString().slice(0, 10);
const ADSENSE = 'ca-pub-4790912864460441';
// 애드센스 스크립트는 운영 주소(mung-test.com)에서, 사람이 보는 브라우저일 때만 불러온다.
// - 로컬 미리보기, 다른 주소, 자동화 브라우저(navigator.webdriver)에서는 불러오지 않음 → 무효 트래픽 예방
// - 주소 뒤에 ?noads=1 을 붙여 한 번 열면 그 기기에서는 계속 안 불러옴 (?noads=0 으로 되돌림). 운영자 본인 기기용
// 소유 확인은 <meta name="google-adsense-account">로 하므로 심사에는 영향 없음.
const ADS_LOADER = `<!-- ads-loader --><script>(function(){var off=false;try{var q=location.search;if(/[?&]noads=1(&|$)/.test(q))localStorage.setItem('mung_noads','1');if(/[?&]noads=0(&|$)/.test(q))localStorage.removeItem('mung_noads');off=localStorage.getItem('mung_noads')==='1';}catch(e){}if(off||navigator.webdriver||location.hostname!=='mung-test.com')return;var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}';document.head.appendChild(s);})();</script><!-- /ads-loader -->`;

const readJson = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
// 정적 파일 주소 뒤 버전: 파일 내용의 해시. 내용이 바뀔 때만 주소가 바뀌어서, 브라우저가 4시간 동안 잡고 있는 예전 파일을 쓰지 않는다.
// (날짜로 하면 같은 날 두 번 배포할 때 주소가 같아 예전 파일이 남는다)
const V = f => require('crypto').createHash('sha1').update(fs.readFileSync(path.join(ROOT, f))).digest('hex').slice(0, 10);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plain = html => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).trim() + '…' : s);
const firstSentence = s => (plain(s).match(/^.*?[.!?](\s|$)/) || [plain(s)])[0].trim();

const sitemap = [];

// ---------------------------------------------------------------- 레이아웃
const NAV = [
    ['/', '성격 테스트', 'test'],
    ['/manual/', '멍설명서', 'manual'],
    ['/match/', '멍궁합', 'match'],
    ['/check/', '멍고민', 'check'],
    ['/food/', '먹어도 돼?', 'food'],
    ['/health/', '건강', 'health'],
    ['/breeds/', '견종', 'breeds'],
    ['/blog/', '생활 가이드', 'blog'],
];

function header(section) {
    const items = NAV.map(([href, label, key]) =>
        `<li><a href="${href}"${key === section ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
    return `<header class="site-header">
    <div class="header-inner">
        <a href="/" class="logo">멍테스트</a>
        <nav class="site-nav" aria-label="주요 메뉴"><ul>${items}</ul></nav>
        <button type="button" id="btn-theme" class="theme-btn" aria-pressed="false">어둡게</button>
    </div>
</header>`;
}

const FOOTER = `<footer class="site-footer">
    <ul>
        <li><a href="/about">사이트 소개</a></li>
        <li><a href="/terms">이용약관</a></li>
        <li><a href="/privacy">개인정보처리방침</a></li>
        <li><a href="/contact">문의하기</a></li>
    </ul>
    <p>&copy; 2026 mung-test.com</p>
</footer>`;

function layout({ title, desc, url, section, body, noindex = false, preCss = '', extraHead = '', extraBody = '', ld = null, image = '/og-image.png' }) {
    const canonical = SITE + url;
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
    <meta name="google-adsense-account" content="${ADSENSE}">
    ${ADS_LOADER}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="멍테스트">
    <meta property="og:locale" content="ko_KR">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}${image}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap">
    ${preCss}
    <link rel="stylesheet" href="/site.css?v=${V('site.css')}">
    <script src="/site.js?v=${V('site.js')}"></script>
    ${ld ? `<script type="application/ld+json">${JSON.stringify(ld)}</script>` : ''}
    ${extraHead}
</head>
<body>
${header(section)}
<main>
${body}
</main>
${FOOTER}
${extraBody}
</body>
</html>
`;
}

function write(rel, html, { index = true } = {}) {
    const file = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    if (index) sitemap.push('/' + rel.replace(/index\.html$/, '').replace(/\.html$/, ''));
}

// 옛 주소에서 새 주소로 보내는 페이지 (검색에는 안 나오게)
function redirect(rel, to) {
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>페이지를 옮겼어요 | 멍테스트</title>
    <link rel="canonical" href="${SITE}${to.split('#')[0]}">
    <meta name="robots" content="noindex, follow">
    <meta http-equiv="refresh" content="0; url=${to}">
    <script>location.replace(${JSON.stringify(to)});</script>
</head>
<body><p><a href="${to}">새 페이지로 이동하기</a></p></body>
</html>
`;
    write(rel, html, { index: false });
}

const img = (name, alt = '', w = 400, h = 400, extra = '') =>
    `<img src="/img/${name}.webp" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy"${extra}>`;

const hero = ({ tone, title, text = '', image = '', eyebrow = '', width = 'wrap' }) => `
<div class="page-hero" style="--band:${tone}">
    <div class="${width}">
        <div>
            ${eyebrow}
            <h1>${title}</h1>
            ${text ? `<p>${text}</p>` : ''}
        </div>
        ${image}
    </div>
</div>`;

const TEST_CTA = `
<aside class="cta-box section">
    ${img('type-2', '', 440, 370)}
    <div>
        <b>우리 강아지는 어떤 성격일까?</b>
        <p>20개 질문에 답하면 성격 유형과 보호자 궁합을 카드로 알려드려요.</p>
        <a class="btn" href="/">성격 테스트 하기</a>
    </div>
</aside>`;

const DISCLAIMER = `<p class="callout callout-note section">일반적인 정보예요. 수의사의 진찰과 진단을 대신하지 않아요. 증상이 심하거나 오래가면 동물병원에서 진료를 받아 주세요.</p>`;

const row = (href, title, sub, thumb = '', tone = 'var(--green)') => `
<li><a class="row-link${thumb ? '' : ' plain'}" href="${href}" style="--tone:${tone}">
    ${thumb ? `<div class="thumb">${thumb}</div>` : ''}
    <div><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>
</a></li>`;

const TONES = ['var(--green)', 'var(--sky)', 'var(--mustard)', 'var(--pink)', 'var(--lav)'];

// ---------------------------------------------------------------- 데이터 정리
const TOPICS = {
    training: { name: '훈련·행동', tone: 'var(--pink)', img: 'guide-training', text: '짖음, 분리불안, 배변 실수처럼 행동 고민을 풀어요.' },
    care: { name: '건강·케어', tone: 'var(--sky)', img: 'guide-care', text: '예방접종, 양치, 털 관리처럼 매일의 건강 관리.' },
    food: { name: '음식·영양', tone: 'var(--mustard)', img: 'hub-food', text: '사료 고르는 법과 급여량, 자연식 이야기.' },
    walk: { name: '산책·여행', tone: 'var(--green)', img: 'hub-guide', text: '산책 코스부터 자동차, 기차, 비행기 여행까지.' },
    gear: { name: '생활·용품', tone: 'var(--lav)', img: 'guide-gear', text: '옷 사이즈, 집 환경, 여러 마리 함께 키우기.' },
};
const POST_TOPIC = {
    1: 'training', 7: 'training', 16: 'training', 21: 'training', 22: 'training', 25: 'training', 29: 'training',
    3: 'care', 5: 'care', 8: 'care', 10: 'care', 12: 'care', 13: 'care', 14: 'care', 15: 'care', 17: 'care', 19: 'care', 23: 'care', 24: 'care', 27: 'care', 28: 'care',
    4: 'food', 9: 'food', 18: 'food', 26: 'food',
    11: 'walk', 20: 'walk', 30: 'walk',
    2: 'gear', 6: 'gear',
};

// 블로그 글: "서론: / 본론 1: / 결론:" 같은 틀 제목을 걷어냄
const cleanPost = html => html
    .replace(/<h2>\s*(서론|본론\s*\d+|결론)\s*:\s*/g, '<h2>')
    .replace(/(<br>\s*){2,}/g, '<br>');

// 문단 구분이 없는 글은 세 문장씩 문단으로 나눔
function toParagraphs(text) {
    const sentences = plain(text).split(/(?<=[.!?])\s+/);
    const out = [];
    for (let i = 0; i < sentences.length; i += 3) out.push(`<p>${esc(sentences.slice(i, i + 3).join(' '))}</p>`);
    return out.join('\n');
}

const posts = [];
for (const p of readJson('blog_data.json')) {
    posts.push({ id: Number(p.id), title: p.title, topic: POST_TOPIC[p.id] || 'care', html: cleanPost(p.content), image: null });
}
for (const t of readJson('travel_data.json')) {
    posts.push({ id: 30 + Number(t.id), title: t.titleKo, topic: 'walk', html: toParagraphs(t.ko.content), image: `travel-${t.id}` });
}
// 다시 쓴 글(content/posts/N.html)이 있으면 원래 데이터 대신 사용
for (const p of posts) {
    const file = path.join(ROOT, 'content/posts', `${p.id}.html`);
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8');
    p.title = meta(src, 'title') || p.title;
    p.html = src.replace(/^(<!--.*?-->\n)+/, '').trim();
}
posts.forEach(p => { p.desc = cut(plain(p.html), 150); p.url = `/blog/${p.id}/`; });
const postById = Object.fromEntries(posts.map(p => [p.id, p]));

// 성격 유형별로 먼저 권하는 글
const TYPE_NAMES = { 1: '이중인격 브레이크형', 2: '폭주 호기심형', 3: '소심형 철학자', 4: '무소유 집돌이형' };
const TYPE_PICKS = { 1: [16, 11, 7], 2: [11, 21, 30], 3: [16, 22, 29], 4: [7, 15, 6] };

function myDogBox() {
    const picks = Object.entries(TYPE_PICKS).map(([type, ids]) => `
        <div data-for-type="${type}" hidden>
            <ul>${ids.map(id => `<li><a href="${postById[id].url}">${esc(postById[id].title)}</a></li>`).join('')}</ul>
        </div>`).join('');
    return `<section class="my-dog section" data-my-dog hidden>
        <h2><span data-dog-name></span>에게 먼저 권하는 글</h2>
        ${picks}
    </section>`;
}

// ---------------------------------------------------------------- 행동 이해하기 (검색 의도별 정보 페이지)
// 원본: content/guides/<주소>.html (머리 주석에 제목, 설명, 연결할 체크와 글)
const GUIDE_ORDER = ['barking-on-walks', 'alone-anxiety', 'walk-refusal', 'temperament-socialization', 'personality-test-vs-temperament'];
const guides = GUIDE_ORDER.map(slug => {
    const src = fs.readFileSync(path.join(ROOT, 'content/guides', `${slug}.html`), 'utf8');
    const g = { slug, url: `/guide/${slug}/`, body: src.replace(/^(<!--.*?-->\n)+/, '').trim() };
    for (const k of ['title', 'h1', 'desc', 'short', 'tone', 'img', 'check', 'read', 'published']) g[k] = meta(src, k);
    g.read = g.read.split(/\s+/).filter(Boolean).map(Number);
    return g;
});
const guideByCheck = Object.fromEntries(guides.filter(g => g.check).map(g => [g.check, g]));
const guideRows = list => list.map(g => row(g.url, g.h1, g.short, img(g.img, '', 56, 56), g.tone)).join('');

function buildGuides() {
    const { CHECKS } = require(path.join(ROOT, 'check.js'));
    for (const g of guides) {
        const c = g.check && CHECKS[g.check];
        const reads = g.read.map(id => postById[id]).filter(Boolean);
        const others = guides.filter(o => o !== g);
        const checkBox = c ? `
            <aside class="cta-box section" style="background:${g.tone}">
                ${img(c.img, '', 110, 110)}
                <div>
                    <b>우리 강아지는 어느 쪽일까?</b>
                    <p>상황 질문 7~8개에 답하면 가능한 원인과 지켜볼 점을 정리해 드려요. 1~2분이면 끝나요.</p>
                    <a class="btn" href="/check/${g.check}/">1분 행동 체크 하기</a>
                </div>
            </aside>` : '';
        write(`guide/${g.slug}/index.html`, layout({
            title: `${g.title} | 멍테스트`, desc: g.desc, url: g.url, section: 'blog',
            ld: [
                { '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, description: g.desc, inLanguage: 'ko', datePublished: g.published, dateModified: g.published, image: `${SITE}/img/${g.img}.webp`, author: { '@type': 'Organization', name: '멍테스트', url: `${SITE}/` }, publisher: { '@type': 'Organization', name: '멍테스트' }, mainEntityOfPage: `${SITE}${g.url}` },
                { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: '멍테스트', item: `${SITE}/` },
                    { '@type': 'ListItem', position: 2, name: '생활 가이드', item: `${SITE}/blog/` },
                    { '@type': 'ListItem', position: 3, name: g.h1, item: `${SITE}${g.url}` },
                ] },
            ],
            body: hero({ tone: g.tone, width: 'narrow', eyebrow: '<a class="eyebrow-link" href="/blog/#understand">생활 가이드 / 행동 이해하기</a>', title: esc(g.h1), image: img(g.img, '', 400, 400).replace(' loading="lazy"', '') }) +
                `<div class="narrow">
                    <p class="guide-meta">${g.published} 작성 · 멍테스트 편집</p>
                    <article class="prose section">${g.body}</article>
                    ${DISCLAIMER}
                    ${checkBox}
                    ${TEST_CTA}
                    ${reads.length ? `<section class="section"><h2 class="section-title">함께 읽으면 좋은 글</h2><ul class="rows">${reads.map(p => row(p.url, p.title, cut(p.desc, 60))).join('')}</ul></section>` : ''}
                    <section class="section"><h2 class="section-title">행동 이해하기 다른 글</h2><ul class="rows">${guideRows(others)}</ul></section>
                </div>`,
        }));
    }
}

// ---------------------------------------------------------------- 생활 가이드
function buildBlog() {
    const sections = Object.entries(TOPICS).map(([key, t]) => {
        const list = posts.filter(p => p.topic === key);
        return `<section class="section" id="${key}">
            <h2 class="section-title">${t.name}</h2>
            <p class="lead">${t.text}</p>
            <ul class="rows">${key === 'walk' ? row('/abroad/', '반려동물 해외여행 나라별 입국 조건', '일본, 미국, 유럽, 대만 등 항체검사와 대기 기간 비교', img('travel-7', '', 56, 56), t.tone) : ''}${list.map(p => row(p.url, p.title, cut(p.desc, 70), img(p.image || t.img, '', 56, 56), t.tone)).join('')}</ul>
        </section>`;
    }).join('');
    const chips = Object.entries(TOPICS).map(([key, t]) => `<a class="chip" href="#${key}">${t.name}</a>`).join('');
    write('blog/index.html', layout({
        title: '생활 가이드: 강아지 훈련, 건강, 산책, 여행 | 멍테스트',
        desc: '강아지 훈련과 행동, 건강 관리, 음식과 영양, 산책과 여행, 생활 용품까지 주제별로 정리한 반려견 생활 가이드예요.',
        url: '/blog/', section: 'blog',
        body: hero({ tone: 'var(--green)', title: '생활 가이드', text: '훈련, 건강 관리, 음식, 산책과 여행, 생활 용품까지. 강아지와 사는 데 필요한 글을 주제별로 모았어요.', image: img('hub-guide', '산책하는 강아지 그림', 400, 400, ' fetchpriority="high"').replace(' loading="lazy"', '') }) +
            `<div class="narrow">${myDogBox()}<nav class="chips section" aria-label="주제"><a class="chip" href="#understand">행동 이해하기</a>${chips}</nav><section class="section" id="understand"><h2 class="section-title">행동 이해하기</h2><p class="lead">자주 묻는 행동 고민을 원인부터 차근차근 풀었어요.</p><ul class="rows">${guideRows(guides)}</ul></section>${sections}</div>`,
    }));

    for (const p of posts) {
        const t = TOPICS[p.topic];
        const related = posts.filter(o => o.topic === p.topic && o.id !== p.id).slice(0, 3);
        const toolLink = p.topic === 'gear' ? `<p class="callout callout-note section">옷을 사기 전에 <a href="/size-calculator">옷 사이즈 계산기</a>로 우리 강아지 치수를 확인해 보세요.</p>`
            : p.topic === 'walk' ? `<p class="callout callout-note section">해외로 간다면 <a href="/abroad/">나라별 반려동물 입국 조건</a>을 먼저 확인해 보세요. 일본은 준비에만 8개월 이상 걸려요.</p>` : '';
        write(`blog/${p.id}/index.html`, layout({
            title: `${p.title} | 멍테스트`, desc: p.desc, url: p.url, section: 'blog',
            ld: { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, inLanguage: 'ko', image: `${SITE}/img/${p.image || t.img}.webp`, publisher: { '@type': 'Organization', name: '멍테스트' } },
            body: hero({ tone: t.tone, width: 'narrow', eyebrow: `<a class="eyebrow-link" href="/blog/#${p.topic}">생활 가이드 / ${t.name}</a>`, title: esc(p.title), image: img(p.image || t.img, '', 400, 400).replace(' loading="lazy"', '') }) +
                `<div class="narrow">
                    <article class="prose section">${p.html}</article>
                    ${toolLink}
                    ${related.length ? `<section class="section"><h2 class="section-title">${t.name} 다른 글</h2><ul class="rows">${related.map(o => row(o.url, o.title, cut(o.desc, 60), img(o.image || t.img, '', 56, 56), t.tone)).join('')}</ul></section>` : ''}
                    ${TEST_CTA}
                </div>`,
        }));
    }
    for (let i = 1; i <= 30; i++) redirect(`post-${i}.html`, `/blog/${i}/`);
    redirect('travel.html', '/blog/#walk');
}

// ---------------------------------------------------------------- 먹어도 돼?
const VERDICT = {
    '안전': { cls: 'ok', label: '먹어도 돼요', key: 'ok', tone: 'var(--green)' },
    '소량만 급여 가능': { cls: 'warn', label: '조금만 줘요', key: 'warn', tone: 'var(--mustard)' },
    '절대 금지': { cls: 'no', label: '먹이면 안 돼요', key: 'no', tone: 'var(--pink)' },
};
// 음식 데이터 + 다시 쓴 설명(content/food_notes) + 상세 페이지 여부(content/food_pages)
function loadFoods() {
    const notes = {};
    const dir = path.join(ROOT, 'content/food_notes');
    if (fs.existsSync(dir)) {
        for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.json'))) {
            for (const n of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) notes[n.id] = n;
        }
    }
    return readJson('food_data.json').map(f => {
        const n = notes[f.id] || {};
        const level = n.level || f.safetyLevel;
        const page = path.join(ROOT, 'content/food_pages', `${f.id}.html`);
        return { ...f, v: VERDICT[level], desc: n.desc || f.description, how: n.how || '', eaten: n.eaten || '', page: fs.existsSync(page) ? page : null };
    });
}

function buildFood() {
    const foods = loadFoods();
    const cats = [...new Set(foods.map(f => f.category))];
    const groups = cats.map(c => `
        <section class="food-group section" data-group>
            <h2 class="section-title">${esc(c)}</h2>
            <ul class="food-list">${foods.filter(f => f.category === c).map(f => `
                <li id="f-${f.id}" class="food-item" data-level="${f.v.key}" data-search="${esc((f.name + ' ' + (f.name_en || '') + ' ' + f.category).toLowerCase())}">
                    <div class="food-head"><h3>${esc(f.name)}</h3><span class="badge badge-${f.v.cls}">${f.v.label}</span></div>
                    <p>${esc(f.desc)}</p>
                    ${f.how ? `<p class="food-tip"><b>주는 법</b>${esc(f.how)}</p>` : ''}
                    ${f.eaten ? `<p class="food-tip food-tip-no"><b>먹었다면</b>${esc(f.eaten)}</p>` : ''}
                    ${f.page ? `<a class="food-more" href="/food/${f.id}/">${esc(f.name)} 자세히 보기</a>` : ''}
                </li>`).join('')}</ul>
        </section>`).join('');
    const foodLink = f => (f.page ? `/food/${f.id}/` : `#f-${f.id}`);
    const popular = ['포도', '초콜릿', '양파', '사과', '바나나', '고구마', '수박', '우유', '계란', '치즈']
        .map(n => foods.find(f => f.name.startsWith(n))).filter(Boolean)
        .map(f => `<a class="chip" href="${foodLink(f)}">${esc(f.name)}</a>`).join('');
    const counts = Object.values(VERDICT).map(v => [v, foods.filter(f => f.v.key === v.key).length]);
    const detailed = foods.filter(f => f.page);

    const style = `<style>
        .food-search { display: grid; gap: 14px; }
        .food-search input { width: 100%; height: 60px; border-radius: 16px; border: 2px solid var(--border); background: var(--card); color: var(--text); padding: 0 20px; font: inherit; font-size: 1.1rem; }
        .food-search input:focus { outline: none; border-color: var(--primary); }
        .food-list { list-style: none; display: grid; gap: 10px; }
        .food-item { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 16px 18px; scroll-margin-top: 140px; }
        .food-item:target { border: 2px solid var(--primary); }
        .food-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
        .food-head h3 { font-size: 1.15rem; font-weight: 800; }
        .food-item p { color: var(--text-muted); line-height: 1.75; word-break: keep-all; }
        .food-item .food-tip { color: var(--text); margin-top: 8px; }
        .food-tip b { color: var(--primary-dark); margin-right: 8px; }
        .food-tip-no b { color: var(--danger); }
        .food-more { display: inline-block; margin-top: 8px; font-weight: 700; }
        .food-empty { padding: 24px 0; }
    </style>`;
    const script = `<script>
    (function () {
        var input = document.getElementById('food-q'), filters = document.querySelectorAll('[data-filter]'), level = 'all';
        var items = document.querySelectorAll('.food-item'), groups = document.querySelectorAll('[data-group]'), empty = document.getElementById('food-empty');
        function run() {
            var q = input.value.trim().toLowerCase(), shown = 0;
            items.forEach(function (el) {
                var ok = (!q || el.dataset.search.indexOf(q) > -1) && (level === 'all' || el.dataset.level === level);
                el.hidden = !ok; if (ok) shown++;
            });
            groups.forEach(function (g) { g.hidden = !g.querySelector('.food-item:not([hidden])'); });
            empty.hidden = shown > 0;
        }
        input.addEventListener('input', run);
        filters.forEach(function (b) {
            b.addEventListener('click', function () {
                level = b.dataset.filter;
                filters.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
                run();
            });
        });
    })();
    </script>`;

    write('food/index.html', layout({
        title: '강아지가 먹어도 되는 음식, 안 되는 음식 100가지 | 멍테스트',
        desc: '포도, 초콜릿, 양파부터 사과, 고구마, 수박까지. 강아지가 먹어도 되는 음식과 먹이면 안 되는 음식 100가지, 주는 법과 먹었을 때 할 일을 정리했어요.',
        url: '/food/', section: 'food', extraHead: style, extraBody: script,
        body: hero({ tone: 'var(--mustard)', title: '강아지가 먹어도 되는 음식', text: '음식 이름을 검색하면 강아지에게 줘도 되는지, 어떻게 주면 되는지, 먹었을 때 무엇을 해야 하는지 알려드려요. 과일, 채소, 고기, 가공식품 100가지를 정리했어요.', image: img('hub-food', '음식 냄새를 맡는 강아지 그림').replace(' loading="lazy"', '') }) +
            `<div class="narrow">
                <div class="food-search section">
                    <label for="food-q" class="section-title" style="margin:0">어떤 음식이 궁금해요?</label>
                    <input id="food-q" type="search" placeholder="예: 포도, 고구마, 치즈" autocomplete="off">
                    <div class="chips" aria-label="많이 찾는 음식">${popular}</div>
                    <div class="chips" role="group" aria-label="판정으로 거르기">
                        <button type="button" class="chip" data-filter="all" aria-pressed="true">전체 ${foods.length}</button>
                        ${counts.map(([v, n]) => `<button type="button" class="chip" data-filter="${v.key}" aria-pressed="false">${v.label} ${n}</button>`).join('')}
                    </div>
                </div>
                <section class="callout callout-danger section">
                    <h2>먹이면 안 되는 음식을 먹었다면</h2>
                    <p>먹은 음식과 양, 먹은 시간을 적어 두고 바로 동물병원에 전화하세요. 수의사가 시키지 않았다면 억지로 토하게 하지 마세요. 증상이 늦게 나타나는 음식도 있어서, 지금 괜찮아 보여도 상담을 받는 게 안전해요.</p>
                </section>
                <section class="section">
                    <h2 class="section-title">자세히 정리한 음식</h2>
                    <ul class="rows">${detailed.map(f => row(`/food/${f.id}/`, f.name, f.v.label, '', f.v.tone)).join('')}</ul>
                </section>
                <p id="food-empty" class="food-empty section" hidden>아직 정리하지 못한 음식이에요. 확실하지 않으면 먹이지 말고 동물병원에 물어보세요.</p>
                ${groups}
                <section class="section">
                    <h2 class="section-title">음식에 관한 글</h2>
                    <ul class="rows">${posts.filter(p => p.topic === 'food').map(p => row(p.url, p.title, cut(p.desc, 60), img('hub-food', '', 56, 56), TOPICS.food.tone)).join('')}</ul>
                </section>
                ${DISCLAIMER}
            </div>`,
    }));

    // 많이 찾는 음식은 상세 페이지, 나머지는 목록 안의 해당 음식으로 보냄
    const detailStyle = `<style>
        .prose .answer { font-size: 1.12rem; font-weight: 800; background: var(--card); border: 2px solid var(--border); border-radius: 16px; padding: 16px 18px; }
        .page-hero .badge { font-size: 0.95rem; padding: 5px 14px; background: #fff; }
    </style>`;
    for (const f of foods) {
        if (!f.page) { redirect(`food/${f.id}/index.html`, `/food/#f-${f.id}`); continue; }
        const src = fs.readFileSync(f.page, 'utf8');
        const title = meta(src, 'title') || `강아지 ${f.name} 먹어도 될까요`;
        const body = src.replace(/^(<!--.*?-->\n)+/, '').trim();
        const answer = plain((body.match(/<p class="answer">([\s\S]*?)<\/p>/) || ['', ''])[1]);
        const others = [...detailed.filter(o => o.id !== f.id && o.v.key === f.v.key), ...detailed.filter(o => o.v.key !== f.v.key)].slice(0, 5);
        write(`food/${f.id}/index.html`, layout({
            title: `${title} | 멍테스트`,
            desc: cut(`${answer} ${f.desc}`, 155),
            url: `/food/${f.id}/`, section: 'food', extraHead: detailStyle,
            ld: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: `강아지가 ${f.name}${/[가-힣]$/.test(f.name) && (f.name.charCodeAt(f.name.length - 1) - 0xAC00) % 28 ? '을' : '를'} 먹어도 되나요?`, acceptedAnswer: { '@type': 'Answer', text: `${answer} ${f.desc}` } }] },
            body: hero({ tone: f.v.tone, width: 'narrow', eyebrow: `<a class="eyebrow-link" href="/food/">먹어도 돼? / ${esc(f.category)}</a>`, title: esc(title), text: `<span class="badge badge-${f.v.cls}">${f.v.label}</span>`, image: img('hub-food', '').replace(' loading="lazy"', '') }) +
                `<div class="narrow">
                    <article class="prose section">${body}</article>
                    ${DISCLAIMER}
                    <section class="section">
                        <h2 class="section-title">다른 음식도 확인해 보세요</h2>
                        <ul class="rows">${others.map(o => row(`/food/${o.id}/`, o.name, o.v.label, '', o.v.tone)).join('')}</ul>
                        <p style="margin-top:16px"><a class="btn btn-ghost" href="/food/">음식 100가지 전체 보기</a></p>
                    </section>
                    ${TEST_CTA}
                </div>`,
        }));
    }
    redirect('food-guide.html', '/food/');
}

// ---------------------------------------------------------------- 건강
function buildHealth() {
    const items = readJson('diagnostics_data.json');
    const symptomRows = items.map(d => row(`/health/${d.id}/`, d.titleKo, cut(firstSentence(d.ko.physical), 70))).join('');
    const tools = [
        ['/age-calculator', '강아지 나이 계산기', '견종 크기를 고려해 사람 나이로 바꿔 드려요'],
        ['/blog/8/', '첫 예방접종 일정', '생애 첫 예방접종과 필수 백신 정리'],
        ['/blog/19/', '여름철 열사병 응급처치', '증상과 바로 해야 할 일'],
        ['/blog/24/', '구토 색깔로 보는 병원 가야 할 때', '집에서 지켜봐도 되는 구토와 아닌 구토'],
        ['/blog/13/', '심장사상충과 구충제 주기', '내외부 기생충 예방 일정'],
    ];
    write('health/index.html', layout({
        title: '강아지 건강 체크: 이상 행동, 병원 가야 할 때 | 멍테스트',
        desc: '발 핥기, 식욕 저하, 떨림, 갑작스러운 공격성까지. 강아지 이상 행동의 원인과 바로 병원에 가야 하는 신호를 정리했어요.',
        url: '/health/', section: 'health',
        body: hero({ tone: 'var(--sky)', title: '강아지 건강 체크', text: '평소와 다른 행동을 보일 때 원인이 무엇인지, 집에서 지켜봐도 되는지, 바로 병원에 가야 하는지 확인해 보세요.', image: img('hub-health', '진찰받는 강아지 그림').replace(' loading="lazy"', '') }) +
            `<div class="narrow">
                <section class="section">
                    <h2 class="section-title">이런 행동을 보이나요?</h2>
                    <ul class="rows">${symptomRows}</ul>
                </section>
                <section class="section">
                    <h2 class="section-title">건강 도구와 글</h2>
                    <ul class="rows">${tools.map(([h, t, s]) => row(h, t, s, img('guide-care', '', 56, 56), 'var(--sky)')).join('')}</ul>
                </section>
                ${DISCLAIMER}
            </div>`,
    }));

    for (const d of items) {
        const others = items.filter(o => o.id !== d.id).slice(0, 4);
        const extra = d.buttonType === 'FOOD'
            ? `<p class="callout callout-note section">먹는 것과 관련된 문제라면 <a href="/food/">먹어도 되는 음식 목록</a>도 확인해 보세요.</p>`
            : TEST_CTA;
        write(`health/${d.id}/index.html`, layout({
            title: `강아지가 ${d.titleKo}: 원인과 병원 가야 할 신호 | 멍테스트`,
            desc: cut(`${d.titleKo}. ${firstSentence(d.ko.physical)} ${firstSentence(d.ko.redflag)}`, 155),
            url: `/health/${d.id}/`, section: 'health',
            body: hero({ tone: 'var(--sky)', width: 'narrow', eyebrow: '<a class="eyebrow-link" href="/health/">건강 체크</a>', title: esc(d.titleKo) }) +
                `<div class="narrow">
                    <section class="callout callout-danger section">
                        <h2>이럴 땐 바로 동물병원에 가세요</h2>
                        <p>${esc(d.ko.redflag)}</p>
                    </section>
                    <article class="prose section">
                        <h2>몸에서 오는 원인</h2>${toParagraphs(d.ko.physical)}
                        <h2>마음에서 오는 원인</h2>${toParagraphs(d.ko.psychological)}
                        <h2>집에서 해볼 수 있는 것</h2>${toParagraphs(d.ko.homecare)}
                    </article>
                    ${DISCLAIMER}
                    ${extra}
                    <section class="section">
                        <h2 class="section-title">다른 행동도 확인해 보세요</h2>
                        <ul class="rows">${others.map(o => row(`/health/${o.id}/`, o.titleKo, '')).join('')}</ul>
                    </section>
                </div>`,
        }));
    }
    redirect('diagnostics.html', '/health/');
}

// ---------------------------------------------------------------- 견종
// 원본: content/breeds/N.html (머리 주석에 기본 정보, 아래는 본문)
const FACTS = [['size', '크기'], ['weight', '몸무게'], ['life', '평균 수명'], ['shed', '털 빠짐'], ['energy', '활동량'], ['bark', '짖음'], ['alone', '혼자 있기']];
function loadBreeds() {
    const dir = path.join(ROOT, 'content/breeds');
    return fs.readdirSync(dir).filter(n => /^\d+\.html$/.test(n))
        .map(n => {
            const src = fs.readFileSync(path.join(dir, n), 'utf8');
            const b = { id: Number(n.replace('.html', '')), body: src.replace(/^(<!--.*?-->\n)+/, '').trim() };
            for (const k of ['nameKo', 'nameEn', 'summary', ...FACTS.map(f => f[0])]) b[k] = meta(src, k);
            return b;
        })
        .sort((a, b) => a.id - b.id);
}

function buildBreeds() {
    const breeds = loadBreeds();
    const sizes = ['소형', '중형', '대형'];
    const tone = b => TONES[(b.id - 1) % TONES.length];
    const listStyle = `<style>
        .tile .tile-meta { font-size: 0.85rem; opacity: 0.8; margin-top: 2px; }
    </style>`;
    const listScript = `<script>
    (function () {
        var chips = document.querySelectorAll('[data-size]'), tiles = document.querySelectorAll('[data-breed-size]');
        chips.forEach(function (c) {
            c.addEventListener('click', function () {
                var s = c.dataset.size;
                chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
                tiles.forEach(function (t) { t.hidden = s !== 'all' && t.dataset.breedSize !== s; });
            });
        });
    })();
    </script>`;
    write('breeds/index.html', layout({
        title: '견종 백과: 말티즈, 푸들, 포메라니안 등 인기 견종 20가지 성격과 건강 | 멍테스트',
        desc: '말티즈, 푸들, 포메라니안, 비숑, 웰시코기, 진돗개, 시바견, 비글 등 우리나라에서 많이 키우는 견종 20가지의 성격, 크기, 털 빠짐, 운동량, 건강 주의점을 정리했어요.',
        url: '/breeds/', section: 'breeds', extraHead: listStyle, extraBody: listScript,
        body: hero({ tone: 'var(--green)', title: '견종 백과', text: '우리나라에서 많이 키우는 견종 20가지의 성격, 크기, 털 빠짐, 운동량, 건강하게 키우는 법을 정리했어요. 같은 견종이라도 강아지마다 차이가 크다는 점도 함께 기억해 주세요.', image: img('hub-breeds', '여러 견종 강아지 그림', 480, 320).replace(' loading="lazy"', '') }) +
            `<div class="wrap section">
                <div class="chips" role="group" aria-label="크기로 거르기" style="margin-bottom:20px">
                    <button type="button" class="chip" data-size="all" aria-pressed="true">전체 ${breeds.length}</button>
                    ${sizes.map(s => `<button type="button" class="chip" data-size="${s}" aria-pressed="false">${s}견 ${breeds.filter(b => b.size === s).length}</button>`).join('')}
                </div>
                <ul class="tiles">${breeds.map(b => `<li data-breed-size="${esc(b.size)}"><a class="tile" href="/breeds/${b.id}/" style="--tone:${tone(b)}">
                    ${img(`breed-${b.id}`, `${b.nameKo} 그림`)}
                    <b>${esc(b.nameKo)}</b><span>${esc(b.nameEn)}</span><span class="tile-meta">${esc(b.size)}견, ${esc(b.weight.split(' (')[0])}</span></a></li>`).join('')}</ul>
            </div>`,
    }));

    const detailStyle = `<style>
        .facts { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
        .facts div { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; }
        .facts dt { font-size: 0.85rem; color: var(--text-muted); }
        .facts dd { font-weight: 800; word-break: keep-all; }
        .facts-note { font-size: 0.88rem; color: var(--text-muted); margin-top: 8px; }
    </style>`;
    for (const b of breeds) {
        const others = [...breeds.filter(o => o.id !== b.id && o.size === b.size), ...breeds.filter(o => o.size !== b.size)].slice(0, 5);
        write(`breeds/${b.id}/index.html`, layout({
            title: `${b.nameKo} 성격, 크기, 털 빠짐, 건강 관리 (${b.nameEn}) | 멍테스트`,
            desc: cut(`${b.nameKo}(${b.nameEn}) ${b.summary} 몸무게 ${b.weight}, 평균 수명 ${b.life}. 성격, 잘 맞는 집, 운동량, 건강 주의점, 털 관리를 정리했어요.`, 155),
            url: `/breeds/${b.id}/`, section: 'breeds', extraHead: detailStyle,
            body: hero({ tone: tone(b), width: 'narrow', eyebrow: `<a class="eyebrow-link" href="/breeds/">견종 백과 / ${esc(b.size)}견</a>`, title: esc(b.nameKo), text: esc(b.summary), image: img(`breed-${b.id}`, `${b.nameKo} 그림`).replace(' loading="lazy"', '') }) +
                `<div class="narrow">
                    <section class="section" aria-labelledby="facts-title">
                        <h2 class="section-title" id="facts-title">한눈에 보기</h2>
                        <dl class="facts">${FACTS.map(([k, label]) => `<div><dt>${label}</dt><dd>${esc(k === 'size' ? b[k] + '견' : b[k])}</dd></div>`).join('')}</dl>
                        <p class="facts-note">일반적인 경향이에요. 같은 견종이라도 강아지마다 차이가 커요.</p>
                    </section>
                    <article class="prose section">${b.body}</article>
                    <p class="callout callout-note section">옷을 고를 때는 <a href="/size-calculator">옷 사이즈 계산기</a>로 치수를 먼저 확인해 보세요. 나이에 맞는 관리가 궁금하다면 <a href="/age-calculator">나이 계산기</a>로 사람 나이를 확인해 보세요.</p>
                    ${TEST_CTA}
                    <section class="section">
                        <h2 class="section-title">다른 견종</h2>
                        <ul class="rows">${others.map(o => row(`/breeds/${o.id}/`, o.nameKo, `${o.size}견, ${o.summary}`, img(`breed-${o.id}`, '', 56, 56), tone(o))).join('')}</ul>
                    </section>
                </div>`,
        }));
    }
}

// ---------------------------------------------------------------- 멍고민 행동 체크
// 문항과 결과 문구는 /check.js 한 곳에만 있음. 여기서는 검색엔진이 읽을 소개와 문항 목록을 HTML로 만든다.
function buildCheck() {
    const { CHECKS } = require(path.join(ROOT, 'check.js'));
    const entries = Object.entries(CHECKS);
    write('check/index.html', layout({
        title: '멍고민 행동 체크: 짖음, 분리불안, 산책 거부 | 멍테스트',
        desc: '산책 중 짖음, 혼자 있을 때 불안, 산책 거부처럼 자주 겪는 강아지 행동 고민을 상황 질문으로 체크하고, 가능한 원인과 관찰 포인트, 안전한 대응 방법을 확인해 보세요.',
        url: '/check/', section: 'check',
        body: hero({ tone: 'var(--pink)', title: '멍고민 행동 체크', text: '우리 강아지가 왜 그러는지 궁금할 때, 상황 질문 몇 개에 답하면 가능한 원인과 지켜볼 점, 집에서 해 볼 방법을 정리해 드려요. 가입 없이 1~2분이면 끝나요.', image: img('guide-training', '강아지 그림').replace(' loading="lazy"', '') }) +
            `<div class="narrow">
                <section class="section">
                    <h2 class="section-title">어떤 고민인가요?</h2>
                    <ul class="rows">${entries.map(([k, c]) => row(`/check/${k}/`, c.title, c.short, img(c.img, '', 56, 56), c.tone)).join('')}</ul>
                </section>
                <section class="section"><h2 class="section-title">행동 이해하기</h2><ul class="rows">${guideRows(guides)}</ul></section>
                <p class="callout callout-note section">체크 결과는 답변을 바탕으로 한 참고 정보예요. 진단이 아니에요. 물거나 물려고 하는 행동, 심한 스트레스, 통증이 의심되거나 행동이 갑자기 바뀌었다면 동물병원이나 반려견 행동 전문가와 상담해 주세요.</p>
                ${TEST_CTA}
            </div>`,
    }));

    for (const [key, c] of entries) {
        const base = c.questions.filter(q => !q.showIf);
        const others = entries.filter(([k]) => k !== key);
        const reads = [guideByCheck[key] && { url: guideByCheck[key].url, title: guideByCheck[key].h1, desc: guideByCheck[key].desc }, ...c.read.map(id => postById[id])].filter(Boolean);
        write(`check/${key}/index.html`, layout({
            title: `${c.seoTitle} | 멍테스트`, desc: c.desc, url: `/check/${key}/`, section: 'check',
            extraBody: `<script src="/share-card.js?v=${V('share-card.js')}"></script>\n<script src="/check.js?v=${V('check.js')}"></script>`,
            body: hero({ tone: c.tone, width: 'narrow', eyebrow: '<a class="eyebrow-link" href="/check/">멍고민 행동 체크</a>', title: esc(c.title), text: esc(c.short) }) +
                `<div class="narrow">
                    <div class="check-app section" data-check="${key}">
                        <div class="check-panel" data-panel tabindex="-1">
                            <p class="check-eyebrow">질문 ${base.length}~${c.questions.length}개, 1~2분</p>
                            <h2 class="check-q">최근 한 달 모습을 떠올리며 답해 주세요</h2>
                            <p>답에 따라 가능한 원인, 지켜볼 점, 집에서 해 볼 방법, 하지 말아야 할 것을 정리해 드려요. 답변은 서버로 보내지 않고 이 화면에서만 계산해요.</p>
                            <button type="button" class="btn" data-start>체크 시작하기</button>
                            <noscript><p class="check-note">체크는 자바스크립트를 켜야 동작해요.</p></noscript>
                        </div>
                    </div>
                    <section class="section prose">
                        <h2>이 체크에서 묻는 것</h2>
                        <ol>${base.map(q => `<li>${esc(q.q)}</li>`).join('')}</ol>
                        <h2>결과로 살펴보는 원인</h2>
                        <ul>${Object.values(c.causes).map(x => `<li><b>${esc(x.name)}</b>: ${esc(x.summary)}</li>`).join('')}</ul>
                        <h2>하지 말아 주세요</h2>
                        <ul>${c.avoid.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
                    </section>
                    ${reads.length ? `<section class="section"><h2 class="section-title">함께 읽으면 좋은 글</h2><ul class="rows">${reads.map(p => row(p.url, p.title, cut(p.desc, 60))).join('')}</ul></section>` : ''}
                    <section class="section">
                        <h2 class="section-title">다른 고민도 체크해 보세요</h2>
                        <ul class="rows">${others.map(([k, o]) => row(`/check/${k}/`, o.title, o.short, img(o.img, '', 56, 56), o.tone)).join('')}</ul>
                    </section>
                </div>`,
        }));
    }
}

// ---------------------------------------------------------------- 멍루틴 (기질별 7일 활동)
// 활동과 일정은 /routine.js 한 곳에만 있음. 여기서는 유형별 일정 미리 보기를 HTML로 만든다.
function buildRoutine() {
    const { ACTIVITIES, PLANS, TYPE_NAMES, STOP } = require(path.join(ROOT, 'routine.js'));
    const plans = Object.entries(PLANS).map(([type, p]) => `
        <section class="section" id="type-${type}">
            <h3 class="routine-type">${img(`type-${type}`, '', 56, 56)}<span>${esc(TYPE_NAMES[type])}<small>${esc(p.goal)}</small></span></h3>
            <p>${esc(p.why)}</p>
            <ol>${p.days.map((ids, i) => `<li><b>${i + 1}일차</b> ${ids.map(id => `${esc(ACTIVITIES[id].name)}(${ACTIVITIES[id].min}분)`).join(', ')}</li>`).join('')}</ol>
        </section>`).join('');
    const acts = Object.values(ACTIVITIES).map(a => `<li><b>${esc(a.name)}</b>: ${esc(a.purpose)}</li>`).join('');
    write('routine/index.html', layout({
        title: '멍루틴: 강아지 기질별 7일 맞춤 활동 | 멍테스트',
        desc: '강아지 기질검사 유형에 맞춰 하루 5~10분, 7일 동안 해 볼 노즈워크, 쉬기 연습, 산책 활동을 골라 드려요. 가입 없이 진행 기록을 브라우저에 저장할 수 있어요.',
        url: '/routine/', section: '',
        extraBody: `<script src="/routine.js?v=${V('routine.js')}"></script>`,
        body: hero({ tone: 'var(--mustard)', title: '멍루틴 7일 맞춤 활동', text: '기질검사 결과에 맞춰 하루 5~10분씩 7일 동안 해 볼 활동을 골라 드려요. 매일 체크하면서 진행 상황을 볼 수 있어요.', image: img('type-4', '쉬고 있는 강아지 그림', 440, 370).replace(' loading="lazy"', '') }) +
            `<div class="narrow">
                <div class="check-app section" data-routine>
                    <div class="check-panel" data-panel tabindex="-1">
                        <h2 class="check-q">기질검사 유형에 맞춘 7일 활동</h2>
                        <p>기질검사를 마치면 이 화면에서 우리 강아지 유형에 맞춘 7일 루틴을 시작할 수 있어요.</p>
                        <a class="btn" href="/?start=true">우리 강아지 기질 알아보기</a>
                        <noscript><p class="check-note">진행 기록은 자바스크립트를 켜야 동작해요. 아래 일정은 그대로 볼 수 있어요.</p></noscript>
                    </div>
                </div>
                <section class="callout callout-danger section">
                    <h2>이럴 땐 그날 활동을 멈춰 주세요</h2>
                    <ul>${STOP.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
                    <p>쉬었다가 다음 날 더 쉬운 단계로 돌아가면 돼요. 관절이나 심장 질환처럼 운동 제한이 있는 강아지는 수의사가 권한 범위 안에서 해 주세요.</p>
                </section>
                <section class="section prose">
                    <h2>유형별 7일 일정</h2>
                    ${plans}
                    <h2>활동 목록</h2>
                    <ul>${acts}</ul>
                </section>
                <p class="callout callout-note section">기질검사와 멍루틴은 일반적인 성향을 바탕으로 한 참고 활동이에요. 강아지마다 좋아하는 것과 힘들어하는 게 달라서, 반응을 보며 강도를 조절해 주세요.</p>
            </div>`,
    }));
}

// ---------------------------------------------------------------- 멍설명서 · 멍궁합
// 화면은 브라우저에서 그린다(manual.js, match.js). 여기서는 페이지 틀, 검색엔진용 소개, 공유 미리보기 페이지를 만든다.
// 공유 페이지(/manual/s/, /match/s/, /match/invite/)는 검색에 안 나오게 하고, 미리보기 봇이 읽을 og 정보만 둔다.
const KAKAO_SDK = '<script src="https://developers.kakao.com/sdk/js/kakao.min.js" defer></script>';
const appScripts = names => KAKAO_SDK + '\n' + names.map(n => `<script src="/${n}.js?v=${V(n + '.js')}"></script>`).join('\n');
const appShell = (attr, intro) => `
    <div class="check-app section" ${attr}>
        <div class="check-panel" data-panel tabindex="-1">${intro}
            <noscript><p class="check-note">이 화면은 자바스크립트를 켜야 동작해요.</p></noscript>
        </div>
    </div>`;
function sharePage(rel, { title, desc, image, h1, attr, scripts, tone }) {
    write(rel, layout({
        title, desc, url: '/' + rel.replace(/index\.html$/, ''), section: '', noindex: true, image, extraBody: appScripts(scripts),
        body: hero({ tone, width: 'narrow', title: esc(h1) }) + `<div class="narrow">${appShell(attr, '<p>불러오는 중이에요...</p>')}</div>`,
    }), { index: false });
}
function buildManual() {
    const { TYPES } = require(path.join(ROOT, 'mung-profile.js'));
    const R = require(path.join(ROOT, 'manual-rules.js'));
    const scripts = ['mung-profile', 'manual-rules', 'share-card', 'manual'];
    const sample = { trait: '주요 기질 특성', env: '편안하게 느끼는 환경', approach: '다가올 때 배려할 점', activity: '함께 즐기기 좋은 활동' };
    write('manual/index.html', layout({
        title: '멍설명서: 우리 강아지 사용설명서 카드 만들기 | 멍테스트',
        desc: '강아지 기질검사 결과로 성격 소개 카드, 사용설명서, 인사하는 방법 카드를 만들고 인스타 피드·스토리 이미지로 저장하거나 링크로 공유해 보세요.',
        url: '/manual/', section: 'manual', extraBody: appScripts(scripts),
        body: hero({ tone: 'var(--mustard)', title: '멍설명서', text: '기질검사 결과로 우리 강아지 사용설명서를 만들어요. 이름과 사진을 넣고, 이미지로 저장하거나 링크로 공유할 수 있어요.', image: img('type-2', '설명서 카드 그림', 440, 370).replace(' loading="lazy"', '') }) +
            `<div class="narrow">${appShell('data-manual', '<p>불러오는 중이에요...</p>')}
                <section class="section prose">
                    <h2>설명서에 들어가는 것</h2>
                    <p>설명서는 세 가지 종류가 있어요. <b>성격 소개 카드</b>는 이름, 대표 성향, 특징 세 가지를 담고, <b>사용설명서</b>는 좋아하는 것과 불편해하는 것, 편하게 대하는 법을, <b>인사하는 방법</b>은 처음 만날 때 배려할 점을 담아요.</p>
                    <p>문장은 기질검사 점수가 높거나 낮게 나온 부분에서만 골라요. 점수가 보통인 부분은 아무 말도 하지 않고, 검사가 묻지 않은 것(예: 안기는 걸 좋아하는지)은 쓰지 않아요. 좋아하는 것, 불편해하는 상황처럼 검사로 알 수 없는 건 보호자가 직접 적고, 설명서에도 "보호자가 알려 줌"으로 따로 표시돼요.</p>
                    <h2>검사 결과로 고르는 문장들</h2>
                    ${Object.entries(sample).map(([k, t]) => `<h3>${t}</h3><ul>${R.RULES.filter(r => r.target === k).slice(0, 4).map(r => `<li>${esc(r.text)}</li>`).join('')}</ul>`).join('')}
                    <h2>사진과 공유</h2>
                    <p>사진은 이 기기 안에서만 쓰고 서버로 보내지 않아요. 저장하는 이미지에만 들어가요. 공유 링크에는 고른 공개 항목(이름, 특성 문장, 보호자 글)만 들어가고, 점수와 사진은 들어가지 않아요.</p>
                </section>
                ${DISCLAIMER}
            </div>`,
    }));
    for (const t of Object.keys(TYPES)) {
        sharePage(`manual/s/${t}/index.html`, {
            title: `${TYPES[t].name} 강아지 설명서 | 멍테스트`, desc: `${TYPES[t].sub}, 우리 강아지 사용설명서를 받았어요. 우리 강아지 설명서도 만들어 보세요.`,
            image: `/img/og-guide-${t}.jpg`, h1: '우리 강아지 설명서', attr: `data-manual data-manual-shared="${t}"`, scripts, tone: TYPES[t].tone,
        });
    }
}
function buildMatch() {
    const M = require(path.join(ROOT, 'match.js'));
    const scripts = ['mung-profile', 'share-card', 'match'];
    write('match/index.html', layout({
        title: '멍궁합: 보호자와 강아지 생활 궁합, 친구 강아지와 성향 궁합 | 멍테스트',
        desc: '기질검사 결과로 보호자와 우리 강아지의 생활 궁합, 친구 강아지와의 성향 궁합을 재미로 비교해 보세요. 비슷한 점, 다른 점, 함께 할 활동을 알려 드려요.',
        url: '/match/', section: 'match', extraBody: appScripts(scripts),
        body: hero({ tone: 'var(--pink)', title: '멍궁합', text: '보호자와 우리 강아지, 우리 강아지와 친구 강아지의 성향을 재미로 비교해요. 비슷한 점과 다른 점, 함께 해 볼 활동을 알려 드려요.', image: img('type-1', '두 강아지 그림', 440, 370).replace(' loading="lazy"', '') }) +
            `<div class="narrow">${appShell('data-match="main"', '<p>불러오는 중이에요...</p>')}
                <section class="section prose">
                    <h2>어떻게 비교하나요</h2>
                    <p><b>보호자와 우리 강아지</b>: 보호자의 생활 패턴 ${M.OWNER_Q.length}문항에 답하면, 기질검사에서 실제로 잰 성향(새로운 것에 대한 태도, 교감, 만남, 환경 변화, 혼자 있기)과 나란히 놓고 비슷한 점과 다른 점을 보여 줘요. 활동량처럼 검사에 없는 항목은 비교하지 않고 생활 정보로만 따로 보여 줘요.</p>
                    <p><b>친구 강아지와</b>: 초대 링크를 보내고 친구가 자기 강아지 결과로 참여하면, 두 강아지의 탐험성, 조심성, 사교성, 환경 적응, 놀이 몰두를 높음·보통·낮음으로 비교해요. 처음 만날 때 주의할 점도 함께 알려 드려요.</p>
                    <p>궁합 이름은 재미로 붙인 표현이고, 점수나 백분율은 만들지 않아요. 적합성을 검사하거나 잘 지낼지를 판단하는 결과가 아니에요. 실제로 만날 땐 두 강아지의 몸짓과 스트레스 신호를 살펴 주세요.</p>
                </section>
            </div>`,
    }));
    sharePage('match/invite/index.html', { title: '우리 강아지와 궁합 볼래요? | 멍테스트', desc: '친구가 강아지 성향 궁합 초대를 보냈어요. 우리 강아지 기질검사 결과로 참여해 보세요.', image: '/img/og-match-invite.jpg', h1: '강아지 궁합 초대', attr: 'data-match="invite"', scripts, tone: 'var(--pink)' });
    for (const [k, name] of Object.entries(M.NICKNAMES)) {
        const friend = k.startsWith('f_');
        sharePage(`match/s/${k}/index.html`, {
            title: `${name} | ${friend ? '강아지 친구 성향 궁합' : '보호자와 강아지 생활 궁합'} | 멍테스트`, desc: `멍궁합 결과는 "${name}"이에요. 재미로 보는 비교예요. 우리 강아지 궁합도 확인해 보세요.`,
            image: `/img/og-match-${friend ? 'friend' : 'owner'}.jpg`, h1: name, attr: 'data-match="shared"', scripts, tone: friend ? 'var(--pink)' : 'var(--mustard)',
        });
    }
}

// ---------------------------------------------------------------- 반려동물 해외여행: 나라별 입국 조건 (/abroad/)
// 원본: content/abroad/<주소>.html (머리 주석에 한눈에 보기 항목과 공식 출처). 내용은 각국 정부 사이트를 직접 확인해 쓴다.
const ABROAD_CHECKED = '2026-11-23'; // 공식 사이트를 마지막으로 확인한 날. 내용을 다시 확인하면 같이 바꾼다.
const ABROAD_FACTS = [['test', '광견병 항체검사'], ['wait', '채혈 후 기다리는 기간'], ['prior', '미리 할 일'], ['quarantine', '도착 후 격리'], ['prep', '넉넉히 잡을 준비 기간']];
function loadAbroad() {
    const dir = path.join(ROOT, 'content/abroad');
    return fs.readdirSync(dir).filter(n => n.endsWith('.html')).map(n => {
        const src = fs.readFileSync(path.join(dir, n), 'utf8');
        const a = { slug: n.replace('.html', ''), body: src.replace(/^(<!--[\s\S]*?-->\n)+/, '').replace(/<!-- (sources|checklist):[\s\S]*?-->\s*/g, '').trim() };
        // 체크리스트: 한 줄에 '단계|항목'. 항목 id는 글자로 만든 짧은 해시라 순서를 바꿔도 체크 상태가 유지된다
        a.checklist = ((src.match(/<!-- checklist:\n([\s\S]*?)\n-->/) || ['', ''])[1]).split('\n').filter(Boolean).map(line => {
            const [phase, text] = line.split('|');
            let h = 5381; for (const ch of text) h = ((h * 33) ^ ch.codePointAt(0)) >>> 0;
            return { phase: phase.trim(), text: text.trim(), id: h.toString(36) };
        });
        for (const k of ['name', 'title', 'desc', 'order', ...ABROAD_FACTS.map(f => f[0])]) a[k] = meta(src, k);
        a.order = Number(a.order) || 50;
        a.sources = (src.match(/<!-- sources: ([\s\S]*?) -->/) || ['', ''])[1].split(' ; ').filter(Boolean).map(s => { const [label, url] = s.split('|'); return { label: label.trim(), url: url.trim() }; });
        a.url = `/abroad/${a.slug}/`;
        return a;
    }).sort((x, y) => x.order - y.order);
}
function checklistHtml(a) {
    if (!a.checklist.length) return '';
    const phases = [...new Set(a.checklist.map(c => c.phase))];
    return `<section class="section checklist" id="checklist" data-checklist="${a.slug}">
        <h2 class="section-title">빠진 게 없는지 체크해 보세요</h2>
        <p class="checklist-progress" aria-live="polite"><b data-done>0</b> / ${a.checklist.length} 완료</p>
        <div class="checklist-bar" aria-hidden="true"><i data-bar></i></div>
        ${phases.map(ph => `<h3>${esc(ph)}</h3><ul>${a.checklist.filter(c => c.phase === ph).map(c => `
            <li><label><input type="checkbox" data-id="${c.id}"><span>${esc(c.text)}</span></label></li>`).join('')}</ul>`).join('')}
        <p class="check-note">체크한 내용은 이 브라우저에만 저장돼요. 다른 기기에서는 보이지 않아요. 체크리스트는 위 내용을 줄여 놓은 것이라, 자세한 조건은 본문과 공식 확인처를 함께 봐 주세요.</p>
        <button type="button" class="text-link" data-reset>체크 모두 지우기</button>
    </section>`;
}
function buildAbroad() {
    const all = loadAbroad();
    const countries = all.filter(a => a.slug !== 'return-to-korea');
    const back = all.find(a => a.slug === 'return-to-korea');
    const CHECK_NOTE = `<p class="callout callout-note section">${ABROAD_CHECKED}에 각 나라 정부의 공식 안내를 직접 확인해 정리했어요. 입국 조건은 예고 없이 바뀌기도 해서, 출국 전에 아래 공식 사이트와 농림축산검역본부, 항공사 규정을 꼭 다시 확인해 주세요. 판매나 입양 목적의 이동, 경유 노선은 조건이 다를 수 있어요.</p>`;
    const sourceList = a => `<section class="section"><h2 class="section-title">공식 확인처</h2><ul class="src-list">${a.sources.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul></section>`;
    const table = `<div class="table-wrap"><table class="abroad-table">
        <thead><tr><th>나라</th>${ABROAD_FACTS.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead>
        <tbody>${countries.map(a => `<tr><th scope="row"><a href="${a.url}">${esc(a.name)}</a></th>${ABROAD_FACTS.map(([k, l]) => `<td data-label="${l}">${esc(a[k])}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
    write('abroad/index.html', layout({
        title: '반려동물 해외여행 나라별 입국 조건: 일본, 미국, 유럽, 중국, 태국 | 멍테스트',
        desc: '강아지, 고양이와 해외여행 갈 때 나라마다 다른 입국 조건을 한 표로 비교했어요. 일본, 미국, 캐나다, 유럽, 영국, 중국, 홍콩, 대만, 태국, 베트남, 싱가포르, 호주와 한국 귀국 조건까지 공식 자료로 정리했어요.',
        url: '/abroad/', section: 'blog',
        ld: { '@context': 'https://schema.org', '@type': 'Article', headline: '반려동물 해외여행 나라별 입국 조건', inLanguage: 'ko', dateModified: ABROAD_CHECKED, author: { '@type': 'Organization', name: '멍테스트' }, publisher: { '@type': 'Organization', name: '멍테스트' } },
        body: hero({ tone: 'var(--sky)', title: '반려동물과 해외여행, 나라별 입국 조건', text: '강아지, 고양이와 함께 해외에 가려면 나라마다 준비할 것과 기간이 크게 달라요. 가려는 나라의 조건과 한국으로 돌아올 때 필요한 것을 함께 확인하세요.', image: img('travel-7', '여행 가방 옆 강아지 그림').replace(' loading="lazy"', '') }) +
            `<div class="wrap">
                <section class="section"><h2 class="section-title">한눈에 비교</h2>${table}
                <p class="check-note">준비 기간은 광견병 접종을 처음 하는 경우를 기준으로 공식 조건의 날짜를 더해 어림한 값이에요.</p></section>
            </div>
            <div class="narrow">
                <section class="section prose">
                    <h2>어느 나라든 공통으로 거치는 순서</h2>
                    <ol>
                        <li><b>가려는 나라 조건 확인.</b> 아래 나라별 페이지와 그 나라 정부 사이트, 항공사 규정을 함께 봐요. 기내에 함께 탈 수 있는지, 이동장 크기와 무게 제한은 항공사마다 달라요.</li>
                        <li><b>마이크로칩.</b> 대부분의 나라가 ISO 11784/11785 규격 칩을 요구하고, 광견병 접종보다 먼저 심어야 해요.</li>
                        <li><b>광견병 접종.</b> 나라마다 인정하는 백신 종류와 접종 횟수가 달라요.</li>
                        <li><b>광견병 항체검사.</b> 가는 나라가 요구하지 않아도 한국으로 돌아올 때 필요해요. 검사기관도 나라마다 인정하는 곳이 달라요.</li>
                        <li><b>기다리는 기간과 사전 신고·허가.</b> 일본은 180일, 유럽과 영국은 3개월이에요. 일본은 도착 40일 전 신고, 홍콩·대만·태국·싱가포르·호주는 허가가 필요해요. 홍콩은 화물로만 보낼 수 있어요.</li>
                        <li><b>출국 전 검역증명서.</b> 동물병원 건강증명서를 챙겨 농림축산검역본부에서 검역증명서를 받아요. 반려동물을 꼭 데리고 가야 해요.</li>
                        <li><b>돌아올 때 공항 검역.</b> <a href="${back.url}">한국으로 돌아올 때</a>를 꼭 미리 읽어 두세요.</li>
                    </ol>
                </section>
                <p class="callout callout-note section">나라별 페이지마다 <b>준비 체크리스트</b>가 있어요. 하나씩 체크하면서 빠진 서류나 일정이 없는지 확인해 보세요. 체크한 내용은 이 브라우저에 저장돼서 며칠에 걸쳐 준비해도 이어서 볼 수 있어요.</p>
                <section class="section"><h2 class="section-title">나라별 자세히 보기</h2>
                    <ul class="rows">${all.map(a => row(a.url, a.name, cut(a.desc, 70), img('travel-7', '', 56, 56), 'var(--sky)')).join('')}</ul>
                </section>
                ${CHECK_NOTE}
                <section class="section"><h2 class="section-title">함께 읽으면 좋은 글</h2><ul class="rows">${[37, 33].map(id => postById[id]).filter(Boolean).map(p => row(p.url, p.title, cut(p.desc, 60))).join('')}</ul></section>
            </div>`,
    }));
    for (const a of all) {
        const others = all.filter(o => o !== a);
        write(`abroad/${a.slug}/index.html`, layout({
            title: `${a.title} | 멍테스트`, desc: a.desc, url: a.url, section: 'blog',
            ld: [
                { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.desc, inLanguage: 'ko', dateModified: ABROAD_CHECKED, author: { '@type': 'Organization', name: '멍테스트' }, publisher: { '@type': 'Organization', name: '멍테스트' }, mainEntityOfPage: `${SITE}${a.url}` },
                { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: '멍테스트', item: `${SITE}/` },
                    { '@type': 'ListItem', position: 2, name: '반려동물 해외여행 나라별 입국 조건', item: `${SITE}/abroad/` },
                    { '@type': 'ListItem', position: 3, name: a.name, item: `${SITE}${a.url}` },
                ] },
            ],
            body: hero({ tone: 'var(--sky)', width: 'narrow', eyebrow: '<a class="eyebrow-link" href="/abroad/">반려동물 해외여행 / 나라별 입국 조건</a>', title: esc(a.slug === 'return-to-korea' ? '해외여행 후 한국으로 돌아올 때' : `반려동물과 ${a.name.replace(/ \(.*\)$/, '')} 가기`) }) +
                `<div class="narrow">
                    <p class="guide-meta">${ABROAD_CHECKED} 공식 안내 확인 · 멍테스트 편집</p>
                    <section class="section" aria-labelledby="facts-title">
                        <h2 class="section-title" id="facts-title">한눈에 보기</h2>
                        <dl class="facts">${ABROAD_FACTS.map(([k, label]) => a[k] ? `<div><dt>${label}</dt><dd>${esc(a[k])}</dd></div>` : '').join('')}</dl>
                        ${a.checklist.length ? `<p class="checklist-jump"><a class="btn btn-ghost" href="#checklist">준비 체크리스트 (${a.checklist.length}개 항목)</a></p>` : ''}
                    </section>
                    <article class="prose section">${a.body}</article>
                    ${checklistHtml(a)}
                    ${sourceList(a)}
                    ${CHECK_NOTE}
                    <section class="section"><h2 class="section-title">다른 나라 조건</h2><ul class="rows">${others.map(o => row(o.url, o.name, o.prep ? `준비 기간 ${o.prep}` : '', '', 'var(--sky)')).join('')}</ul></section>
                    ${TEST_CTA}
                </div>`,
        }));
    }
}

// ---------------------------------------------------------------- 기질검사 결과 공유 페이지 (/r/1/ ~ /r/4/)
// 카톡·SNS 미리보기는 자바스크립트를 실행하지 않으므로 유형마다 고정 페이지에 미리보기 정보를 둔다.
// 점수는 주소의 # 뒤에 담겨(서버와 검색봇에 전달되지 않음) 성격 테스트 화면으로 그대로 넘긴다.
const TYPE_SHARE = {
    1: { sub: '호기심 천국 겁쟁이', line: '궁금한 건 많은데 겁도 많은 아이' },
    2: { sub: '브레이크 고장난 탐험가', line: '일단 달려가고 보는 아이' },
    3: { sub: '신중하고 세심한 파수꾼', line: '멀리서 오래 지켜보고 움직이는 아이' },
    4: { sub: '평화로운 안방 현자', line: '내 방석이 세상의 전부인 아이' },
};
function buildShare() {
    for (const [type, t] of Object.entries(TYPE_SHARE)) {
        const name = TYPE_NAMES[type];
        const title = `우리 강아지는 ${name} | 강아지 성격 테스트`;
        const desc = `${t.sub}, ${t.line}. 20개 질문으로 우리 강아지 성격 유형도 알아보세요.`;
        write(`r/${type}/index.html`, `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <link rel="canonical" href="${SITE}/">
    <meta name="robots" content="noindex, follow">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="멍테스트">
    <meta property="og:locale" content="ko_KR">
    <meta property="og:url" content="${SITE}/r/${type}/">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}/img/og-type-${type}.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(name)} 강아지 성격 카드">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${SITE}/img/og-type-${type}.jpg">
    <script>location.replace('/' + (location.hash.length > 1 ? '?' + location.hash.slice(1) : ''));</script>
</head>
<body>
    <p><a href="/">${esc(name)} 결과 보러 가기</a></p>
</body>
</html>
`, { index: false });
    }
}

// ---------------------------------------------------------------- 계산기, 안내 페이지
function meta(src, key) {
    const m = src.match(new RegExp(`<!-- ${key}: (.*?) -->`));
    return m ? m[1].trim() : '';
}
function buildTools() {
    const tools = { 'age-calculator': 'health', 'size-calculator': 'blog' };
    for (const [name, section] of Object.entries(tools)) {
        const src = fs.readFileSync(path.join(ROOT, 'content/tools', `${name}.html`), 'utf8');
        // 계산기 원본에 있던 <main>은 레이아웃의 <main>과 겹치므로 <div>로 바꿈
        const body = src.replace(/^(<!--.*?-->\n)+/, '').replace(/<main\b/g, '<div').replace(/<\/main>/g, '</div>');
        const local = f => { const name = f.split('?')[0]; return `/${name}?v=${V(name)}`; };
        const css = meta(src, 'css').split(/\s+/).filter(Boolean).map(c => `<link rel="stylesheet" href="${local(c)}">`).join('\n    ');
        const scripts = meta(src, 'scripts').split(/\s+/).filter(Boolean)
            .map(s => `<script src="${/^https?:/.test(s) ? s : local(s)}"></script>`).join('\n');
        write(`${name}.html`, layout({
            title: meta(src, 'title').replace(' | mung-test.com', ' | 멍테스트'), desc: meta(src, 'desc'),
            url: `/${name}`, section,
            preCss: `<link rel="stylesheet" href="/style.css?v=${V('style.css')}">`, extraHead: css,
            body: `<div class="tool-page">${body}</div>`, extraBody: scripts,
        }));
    }
    for (const name of ['about', 'terms', 'privacy', 'contact']) {
        const src = fs.readFileSync(path.join(ROOT, 'content/pages', `${name}.html`), 'utf8');
        const body = src.replace(/^(<!--.*?-->\n)+/, '');
        write(`${name}.html`, layout({
            title: meta(src, 'title').replace(' | mung-test.com', ' | 멍테스트'), desc: meta(src, 'desc'),
            url: `/${name}`, section: '',
            body: `<div class="narrow"><article class="prose section">${body}</article></div>`,
        }));
    }
}

// ---------------------------------------------------------------- 성격 테스트 페이지에 같은 헤더/푸터 넣기
function patchHome() {
    const file = path.join(ROOT, 'index.html');
    let s = fs.readFileSync(file, 'utf8');
    s = s.replace(/<header[\s\S]*?<\/header>/, header('test'));
    s = s.replace(/<footer[\s\S]*?<\/footer>/, FOOTER);
    s = s.replace(/"\/((?:share-card|i18n|site|script)\.js|(?:style|site)\.css)\?v=[^"]*"/g, (m, f) => `"/${f}?v=${V(f)}"`);
    s = s.replace(/<!-- ads-loader -->[\s\S]*?<!-- \/ads-loader -->|<script async src="https:\/\/pagead2\.googlesyndication\.com[^>]*><\/script>/, ADS_LOADER);
    fs.writeFileSync(file, s);
    sitemap.unshift('/');
}

// 없는 주소 (Cloudflare Pages는 이 파일이 있으면 404 상태로 보여 줌. 없으면 모든 주소에 홈을 200으로 내줌)
function build404() {
    write('404.html', layout({
        title: '페이지를 찾을 수 없어요 | 멍테스트', desc: '주소가 바뀌었거나 없는 페이지예요.', url: '/404', section: '', noindex: true,
        body: hero({ tone: 'var(--mustard)', title: '페이지를 찾을 수 없어요', text: '주소가 바뀌었거나 없는 페이지예요. 아래에서 하려던 걸 골라 주세요.', image: img('type-3', '갸웃거리는 강아지 그림').replace(' loading="lazy"', '') }) +
            `<div class="narrow"><section class="section"><ul class="rows">
                ${row('/', '우리 강아지 기질 알아보기', '20개 질문, 3분이면 끝나요', img('type-2', '', 56, 56), 'var(--mustard)')}
                ${row('/check/', '행동 고민 체크', '짖음, 혼자 있을 때, 산책 거부', img('guide-training', '', 56, 56), 'var(--pink)')}
                ${row('/routine/', '7일 맞춤 활동', '기질에 맞춘 하루 5~10분 활동', img('type-4', '', 56, 56), 'var(--green)')}
                ${row('/blog/', '생활 가이드', '훈련, 건강, 산책, 용품 글 모음', img('hub-guide', '', 56, 56), 'var(--sky)')}
            </ul></section></div>`,
    }), { index: false });
}

function buildSitemap() {
    const urls = [...new Set(sitemap)].map(u => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </url>`).join('\n');
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

buildGuides();
buildBlog();
buildFood();
buildHealth();
buildBreeds();
buildCheck();
buildRoutine();
buildManual();
buildMatch();
buildAbroad();
buildShare();
buildTools();
patchHome();
build404();
buildSitemap();
console.log(`pages in sitemap: ${new Set(sitemap).size}`);
