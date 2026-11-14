// 멍테스트 페이지 생성기. 성격 테스트(index.html)를 뺀 모든 페이지를 하나의 레이아웃으로 만든다.
// 실행: node scripts/build_site.js   (외부 패키지 없음)
// 원본: *_data.json, content/pages/*.html, content/tools/*.html
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://mung-test.com';
const TODAY = new Date().toISOString().slice(0, 10);
const ADSENSE = 'ca-pub-4790912864460441';

const readJson = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const plain = html => String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).trim() + '…' : s);
const firstSentence = s => (plain(s).match(/^.*?[.!?](\s|$)/) || [plain(s)])[0].trim();

const sitemap = [];

// ---------------------------------------------------------------- 레이아웃
const NAV = [
    ['/', '성격 테스트', 'test'],
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
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}" crossorigin="anonymous"></script>
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="멍테스트">
    <meta property="og:locale" content="ko_KR">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}${image}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" type="image/png" href="/favicon.png">
    ${preCss}
    <link rel="stylesheet" href="/site.css?v=${TODAY}">
    <script src="/site.js?v=${TODAY}"></script>
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

// ---------------------------------------------------------------- 생활 가이드
function buildBlog() {
    const sections = Object.entries(TOPICS).map(([key, t]) => {
        const list = posts.filter(p => p.topic === key);
        return `<section class="section" id="${key}">
            <h2 class="section-title">${t.name}</h2>
            <p class="lead">${t.text}</p>
            <ul class="rows">${list.map(p => row(p.url, p.title, cut(p.desc, 70), img(p.image || t.img, '', 56, 56), t.tone)).join('')}</ul>
        </section>`;
    }).join('');
    const chips = Object.entries(TOPICS).map(([key, t]) => `<a class="chip" href="#${key}">${t.name}</a>`).join('');
    write('blog/index.html', layout({
        title: '생활 가이드: 강아지 훈련, 건강, 산책, 여행 | 멍테스트',
        desc: '강아지 훈련과 행동, 건강 관리, 음식과 영양, 산책과 여행, 생활 용품까지 주제별로 정리한 반려견 생활 가이드예요.',
        url: '/blog/', section: 'blog',
        body: hero({ tone: 'var(--green)', title: '생활 가이드', text: '훈련, 건강 관리, 음식, 산책과 여행, 생활 용품까지. 강아지와 사는 데 필요한 글을 주제별로 모았어요.', image: img('hub-guide', '산책하는 강아지 그림', 400, 400, ' fetchpriority="high"').replace(' loading="lazy"', '') }) +
            `<div class="narrow">${myDogBox()}<nav class="chips section" aria-label="주제">${chips}</nav>${sections}</div>`,
    }));

    for (const p of posts) {
        const t = TOPICS[p.topic];
        const related = posts.filter(o => o.topic === p.topic && o.id !== p.id).slice(0, 3);
        const toolLink = p.topic === 'gear' ? `<p class="callout callout-note section">옷을 사기 전에 <a href="/size-calculator">옷 사이즈 계산기</a>로 우리 강아지 치수를 확인해 보세요.</p>` : '';
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
        const css = meta(src, 'css').split(/\s+/).filter(Boolean).map(c => `<link rel="stylesheet" href="/${c}">`).join('\n    ');
        const scripts = meta(src, 'scripts').split(/\s+/).filter(Boolean)
            .map(s => `<script src="${/^https?:/.test(s) ? s : '/' + s}"></script>`).join('\n');
        write(`${name}.html`, layout({
            title: meta(src, 'title').replace(' | mung-test.com', ' | 멍테스트'), desc: meta(src, 'desc'),
            url: `/${name}`, section,
            preCss: '<link rel="stylesheet" href="/style.css?v=card_v1">', extraHead: css,
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
    fs.writeFileSync(file, s);
    sitemap.unshift('/');
}

function buildSitemap() {
    const urls = [...new Set(sitemap)].map(u => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n  </url>`).join('\n');
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

buildBlog();
buildFood();
buildHealth();
buildBreeds();
buildTools();
patchHome();
buildSitemap();
console.log(`pages in sitemap: ${new Set(sitemap).size}`);
