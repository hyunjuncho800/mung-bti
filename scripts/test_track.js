// 분석 이벤트 테스트: 허용된 항목만 나가고, 강아지 이름·답변·MBTI 같은 값은 절대 나가지 않는지 확인.
// 실행: node scripts/test_track.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const plainOf = v => JSON.parse(JSON.stringify(v));  // vm 안에서 만든 객체는 프로토타입이 달라 그대로 비교하면 실패함
const eq = (a, b, m) => { assert.deepStrictEqual(plainOf(a), plainOf(b), m); n++; };

// 1) site.js의 정리 함수
function loadSite() {
    const ctx = { console, location: { search: '' }, localStorage: { getItem: () => null, setItem() {} }, document: { addEventListener() {}, head: { appendChild() {} }, createElement: () => ({}) } };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8'), ctx);
    return ctx;
}
const site = loadSite();
const clean = site.mungTrack.clean;
eq(clean('nope', { a: 1 }), null, '없는 이벤트는 버림');
eq(clean('temperament_test_complete', { type: 3, has_mbti: 'ENFP', name: '초코', mbti: 'ENFP', answers: [5, 4] }), { type: 3, has_mbti: true }, '정해진 항목만, MBTI 값은 참/거짓으로만');
eq(clean('shared_link_visit', { content: 'check', via: '초코' }), { content: 'check' }, '한글·자유 문자열은 키 항목에 못 들어감');
eq(clean('shared_link_visit', { content: 'check', via: 'a@b.com' }), { content: 'check' }, '이메일 모양도 거름');
eq(clean('routine_day_complete', { type: '2', day: 'x', days_since_start: 99999 }), { type: 2 }, '숫자 범위 밖은 버림');
eq(clean('behavior_check_complete', { check: 'barking', result: 'fear', causes: 2, flags: ['bite'] }), { check: 'barking', result: 'fear', causes: 2 }, '위험 신호는 안 보냄');

// 2) 코드 안의 모든 track() 호출이 허용 목록과 맞는지 (빠뜨리거나 몰래 버려지는 항목이 없게)
const siteSrc = fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8');
const spec = {};
for (const m of siteSrc.matchAll(/^\s{8}(\w+): \{([^}]*)\},?$/gm)) spec[m[1]] = [...m[2].matchAll(/(\w+):/g)].map(x => x[1]);
const required = ['behavior_check_view', 'behavior_check_start', 'behavior_check_complete', 'temperament_test_start', 'temperament_test_complete', 'routine_start', 'routine_day_complete', 'result_share', 'shared_link_visit'];
eq(Object.keys(spec).sort(), required.slice().sort(), '요청된 이벤트 9개가 모두 정의됨');
const used = new Set();
for (const f of ['script.js', 'check.js', 'routine.js']) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/track\('(\w+)'(?:, \{([^}]*)\})?\)/g)) {
        used.add(m[1]);
        ok(spec[m[1]], `${f}: 정의 안 된 이벤트 ${m[1]}`);
        for (const k of [...(m[2] || '').matchAll(/(\w+):/g)].map(x => x[1])) ok(spec[m[1]].includes(k), `${f}: ${m[1]}에 허용 안 된 항목 ${k}`);
    }
}
eq([...used].sort(), required.slice().sort(), '9개 이벤트가 모두 코드에서 쓰임');

// 3) 기질검사를 이름·MBTI 넣고 끝까지 했을 때 실제로 나가는 값
const sent = [];
const els = {};
const el = id => els[id] || (els[id] = { id, style: {}, dataset: {}, classList: { add() {}, toggle() {} }, value: '', textContent: '', innerHTML: '', hidden: false, checked: false });
const ctx = {
    console, URLSearchParams, Math, JSON, setTimeout: () => {}, clearTimeout: () => {},
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    document: { getElementById: el, querySelector: () => el('_q'), querySelectorAll: () => [], addEventListener() {} },
    history: { replaceState() {} }, navigator: { userAgent: 'node' },
    mungTrack: (name, p) => sent.push([name, clean(name, p)]),
};
ctx.window = ctx; ctx.window.addEventListener = () => {}; ctx.window.scrollTo = () => {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8'), ctx);
el('dog-name').value = '초코';
el('test-zone');
vm.runInContext(`startTest(); baseQuestions.forEach(q => { answers[q.id] = 4; }); document.getElementById('owner-mbti').value = 'ENFP'; calculateAndShowResults();`, ctx);
el('share-name').checked = true;
ctx.navigator.clipboard = { writeText: () => Promise.resolve() };
vm.runInContext('shareResultLink();', ctx);
eq(sent.map(s => s[0]), ['temperament_test_start', 'temperament_test_complete', 'result_share'], '시작, 완료, 공유 순서');
eq(sent[1][1], { type: 1, has_mbti: true }, '완료 이벤트에는 유형 번호와 MBTI 여부만');
eq(sent[2][1], { content: 'temperament', method: 'link', with_name: true }, '이름을 넣었는지 여부만, 이름 자체는 안 나감');
const all = JSON.stringify(sent);
ok(!all.includes('초코') && !all.includes('ENFP'), '이름과 MBTI 값은 어디에도 없음');

// 4) GA4를 켰을 때 넘기는 페이지 주소에 이름·MBTI·점수가 없는지 (측정 ID를 임시로 넣고 확인)
{
    const src = fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8').replace("var GA_ID = '';", "var GA_ID = 'G-TEST';");
    const href = 'https://mung-test.com/?e=4&s=2&owner=ENFP&name=%EC%B4%88%EC%BD%94&utm_source=insta&utm_medium=bio#via=kakao';
    const g = { console, URL, URLSearchParams, location: { href, search: '?e=4&s=2&owner=ENFP&name=x', origin: 'https://mung-test.com', pathname: '/' },
        localStorage: { getItem: () => null, setItem() {} },
        document: { referrer: 'https://mung-test.com/check/alone/?r=separation&name=%EC%B4%88%EC%BD%94#via=link', addEventListener() {}, head: { appendChild() {} }, createElement: () => ({}) } };
    g.window = g;
    vm.createContext(g);
    vm.runInContext(src, g);
    const config = [...g.dataLayer].map(a => [...a]).find(a => a[0] === 'config');
    eq(config[1], 'G-TEST');
    eq(config[2].page_location, 'https://mung-test.com/?utm_source=insta&utm_medium=bio', '유입 정보(utm)만 남김');
    eq(config[2].page_referrer, 'https://mung-test.com/check/alone/', '이전 페이지 주소도 정리');
    ok(config[2].allow_google_signals === false && config[2].allow_ad_personalization_signals === false, '광고 개인화 끔');
    const conf = JSON.stringify(config);
    ok(!conf.includes('ENFP') && !conf.includes('%EC%B4%88') && !conf.includes('e=4'), '주소에 MBTI, 이름, 점수 없음');
    eq(g.mungTrack.safeUrl('/routine/?x=1'), 'https://mung-test.com/routine/');
}

console.log(`분석 이벤트 테스트 통과: ${n}개 확인`);
