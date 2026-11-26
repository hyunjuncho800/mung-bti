// 광고 스크립트 로더 테스트: 운영 주소에서 사람 브라우저일 때만 애드센스를 불러오는지 확인 (무효 트래픽 예방).
// 실행: node scripts/test_ads.js   (빌드 후)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const blocks = home.match(/<!-- ads-loader -->[\s\S]*?<!-- \/ads-loader -->/g) || [];
ok(blocks.length === 1, `홈에 로더가 하나만 (${blocks.length})`);
ok(!/<script async src="https:\/\/pagead2/.test(home), '홈에 무조건 불러오는 광고 스크립트 없음');
ok(home.includes('<meta name="google-adsense-account" content="ca-pub-4790912864460441">'), '소유 확인 메타 태그는 그대로');
const code = blocks[0].match(/<script>([\s\S]*?)<\/script>/)[1];

// 로더 실행: 광고 스크립트를 붙였는지와 저장값을 돌려준다
function run({ host = 'mung-test.com', search = '', webdriver = false, stored = null, storageThrows = false }) {
    const store = stored ? { mung_noads: stored } : {};
    const added = [];
    const ctx = {
        location: { hostname: host, search },
        navigator: { webdriver },
        localStorage: storageThrows
            ? { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } }
            : { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { createElement: () => ({}), head: { appendChild: el => added.push(el) } },
    };
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
    return { loaded: added.length === 1 && /adsbygoogle\.js\?client=ca-pub-4790912864460441$/.test(added[0].src) && added[0].async === true, store };
}

ok(run({}).loaded, '운영 주소, 일반 방문: 불러옴');
ok(!run({ host: 'localhost' }).loaded, '로컬 미리보기: 안 불러옴');
ok(!run({ host: 'www.mung-test.com' }).loaded, '다른 주소(www는 운영에서 리디렉트됨): 안 불러옴');
ok(!run({ host: 'mung-bti.pages.dev' }).loaded, 'Cloudflare 미리보기 주소: 안 불러옴');
ok(!run({ webdriver: true }).loaded, '자동화 브라우저: 안 불러옴');
{
    const r = run({ search: '?noads=1' });
    ok(!r.loaded && r.store.mung_noads === '1', '?noads=1: 안 불러오고 기기에 기억');
}
ok(!run({ stored: '1' }).loaded, '기억된 기기: 계속 안 불러옴');
{
    const r = run({ search: '?x=1&noads=0', stored: '1' });
    ok(r.loaded && !('mung_noads' in r.store), '?noads=0: 기억 지우고 다시 불러옴');
}
ok(run({ search: '?noads=10' }).loaded, '?noads=10 같은 다른 값은 무시');
ok(run({ storageThrows: true }).loaded, '저장소가 막힌 브라우저(시크릿 등)도 운영 주소에선 정상');

// 모든 생성 페이지에 같은 로더가 있고, 무조건 불러오는 태그는 없는지
const pages = [];
const walk = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    if (f.name.startsWith('.') || f.name === 'node_modules' || f.name === 'content' || f.name === 'scripts') continue;
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p); else if (f.name.endsWith('.html')) pages.push(p);
} };
walk(ROOT);
const withAds = pages.filter(p => fs.readFileSync(p, 'utf8').includes('googlesyndication'));
ok(withAds.length > 100, `광고가 있는 페이지 ${withAds.length}개`);
for (const p of withAds) {
    const s = fs.readFileSync(p, 'utf8');
    if (/<script async src="https:\/\/pagead2/.test(s)) assert.fail(`무조건 불러오는 광고 태그: ${path.relative(ROOT, p)}`);
    if ((s.match(/<!-- ads-loader -->/g) || []).length !== 1) assert.fail(`로더 개수 이상: ${path.relative(ROOT, p)}`);
}
n++;
// 멍시그널: 3D 조작 버튼·슬라이더 옆에 광고가 붙지 않게 광고 없음
ok(!fs.readFileSync(path.join(ROOT, 'mung-signal/index.html'), 'utf8').includes('googlesyndication'), '멍시그널 페이지는 광고 없음');
// 멍퀴즈: 보기·공유 버튼 옆 광고 방지
for (const f of ['mung-signal/quiz/index.html', ...['sprout', 'explorer', 'reader', 'interpreter', 'master'].map(g => `mung-signal/quiz/s/${g}/index.html`)])
    ok(!fs.readFileSync(path.join(ROOT, f), 'utf8').includes('googlesyndication'), `${f}: 광고 없음`);

console.log(`광고 로더 테스트 통과: ${n}개 확인 (페이지 ${withAds.length}개)`);
