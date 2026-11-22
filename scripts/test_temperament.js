// 기질검사 채점 회귀 테스트: script.js의 채점·유형 결과가 저장해 둔 기준과 같은지 확인한다.
// 실행: node scripts/test_temperament.js          (기준 갱신: --update, 채점을 일부러 바꿨을 때만)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const FIXTURE = path.join(__dirname, 'fixtures', 'temperament.json');

// 브라우저 없이 돌리기 위한 최소한의 가짜 DOM
const els = {};
const el = id => els[id] || (els[id] = { id, style: {}, dataset: {}, classList: { add() {}, toggle() {} }, value: '', textContent: '', innerHTML: '', hidden: false, src: '', alt: '', disabled: false });
const store = {};
const ctx = {
    console, URLSearchParams, Math, JSON,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    document: { getElementById: el, querySelector: () => el('_q'), querySelectorAll: () => [], addEventListener() {} },
    history: { replaceState() {} },
    navigator: { userAgent: 'node' },
    Kakao: { init() {} },
};
ctx.window = ctx;
ctx.window.addEventListener = () => {};
ctx.window.scrollTo = () => {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8'), ctx);

// 1) 문항 답 -> 점수 -> 유형 (공유 링크 없이 직접 검사한 경우)
function runAnswers(ans, mbti) {
    for (const k of Object.keys(store)) delete store[k];
    ctx.__ans = ans;
    ctx.__mbti = mbti || '';
    vm.runInContext(`questions = baseQuestions.slice(); answers = {}; baseQuestions.forEach(q => { answers[q.id] = __ans[q.id - 1]; });
        window.dogName = '초코'; document.getElementById('owner-mbti').value = __mbti; calculateAndShowResults();`, ctx);
    return { scores: { ...ctx.currentScores }, type: ctx.currentDogType, card: el('card-img').src, url: ctx.currentResultUrl, saved: store.mung_dog || null };
}
// 2) 공유 링크로 들어온 경우 (저장하지 않아야 함)
function runShared(passed) {
    for (const k of Object.keys(store)) delete store[k];
    ctx.__p = passed;
    vm.runInContext('calculateAndShowResults(__p);', ctx);
    return { scores: { ...ctx.currentScores }, type: ctx.currentDogType, card: el('card-img').src, chem: el('res-chemistry-score').textContent, saved: store.mung_dog || null };
}

const cases = {};
const patterns = {
    all5: Array(20).fill(5), all1: Array(20).fill(1), all3: Array(20).fill(3), all4: Array(20).fill(4),
    // 축 경계(3.5) 근처: E 3.7 / S 3.3 같은 조합
    mixA: [4, 4, 3, 3, 4, 3, 5, 5, 5, 2, 2, 2, 4, 4, 3, 3, 3, 4, 2, 5],
    mixB: [2, 3, 2, 5, 4, 4, 1, 2, 3, 4, 4, 4, 2, 2, 2, 5, 5, 5, 3, 3],
    mixC: [5, 4, 5, 2, 1, 2, 3, 3, 3, 5, 1, 3, 4, 5, 4, 1, 2, 1, 4, 4],
    edge: [4, 3, 4, 4, 3, 4, 3, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
};
for (const [k, a] of Object.entries(patterns)) {
    cases['answers_' + k] = runAnswers(a);
    cases['answers_' + k + '_enfp'] = runAnswers(a, 'ENFP');
    cases['answers_' + k + '_istj'] = runAnswers(a, 'ISTJ');
}
for (const [e, s] of [[5, 5], [5, 1], [1, 5], [1, 1], [3.5, 3.5], [3.4, 3.5], [3.5, 3.4]]) {
    cases[`shared_e${e}_s${s}`] = runShared({ e, s, m: 4, f: 3, i: 2, o: 5, x: 3.5, owner: 'INFP', name: '' });
}

if (process.argv.includes('--update')) {
    fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
    fs.writeFileSync(FIXTURE, JSON.stringify(cases, null, 2) + '\n');
    console.log(`기준 저장: ${Object.keys(cases).length}개`);
} else {
    const want = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
    assert.deepStrictEqual(cases, want);
    console.log(`기질검사 채점 회귀 테스트 통과: ${Object.keys(cases).length}개`);
}
