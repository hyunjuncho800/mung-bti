// 멍고민 행동 체크 테스트: 데이터 오류, 조건부 문항, 같은 답 같은 결과, 위험 신호 안내.
// 실행: node scripts/test_check.js
const assert = require('assert');
const path = require('path');
const { CHECKS, analyze, visibleQuestions } = require(path.join(__dirname, '..', 'check.js'));

let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

// 1) 데이터: 원인·신호 이름이 모두 정의돼 있고, 문항 수 5~8개, 조건이 앞 문항을 가리킴
for (const [key, c] of Object.entries(CHECKS)) {
    const base = c.questions.filter(q => !q.showIf).length;
    ok(base >= 5 && c.questions.length <= 8 + 2, `${key}: 문항 수`);
    ok(base <= 8, `${key}: 기본 문항 8개 이하`);
    c.questions.forEach((q, qi) => {
        q.o.forEach(o => {
            Object.keys(o.c).forEach(k => ok(c.causes[k], `${key}.${q.id}: 없는 원인 ${k}`));
            if (o.f) ok(c.flags[o.f], `${key}.${q.id}: 없는 신호 ${o.f}`);
        });
        if (q.showIf) Object.entries(q.showIf).forEach(([id, idx]) => {
            const parent = c.questions.findIndex(p => p.id === id);
            ok(parent > -1 && parent < qi, `${key}.${q.id}: 조건 문항은 앞에 있어야 함`);
            idx.forEach(i => ok(c.questions[parent].o[i], `${key}.${q.id}: 조건 선택지 번호`));
        });
    });
    Object.values(c.causes).forEach(x => ok(x.why.length && x.observe.length && x.do.length, `${key}: 원인 설명 빠짐`));
}

// 2) 조건부 문항: 답에 따라 나타나고 사라짐, 숨은 문항 답은 결과에 안 들어감
{
    const c = CHECKS.barking;
    ok(!visibleQuestions(c, {}).some(q => q.id === 'change'), '갑자기가 아니면 change 숨김');
    ok(visibleQuestions(c, { when: 2 }).some(q => q.id === 'change'), '갑자기면 change 보임');
    const hidden = analyze(c, { when: 0, change: 0 });
    ok(!hidden.flags.includes('pain'), '숨은 문항의 위험 신호는 무시');
    ok(hidden.score.pain === 0, '숨은 문항의 점수는 무시');
}

// 3) 같은 답이면 항상 같은 결과 (모든 주제, 무작위 답 200번씩)
let seed = 7;
const rand = m => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % m; };
for (const c of Object.values(CHECKS)) {
    for (let t = 0; t < 200; t++) {
        const a = {};
        for (let i = 0; i < c.questions.length; i++) {
            const q = visibleQuestions(c, a).find(x => !(x.id in a));
            if (!q) break;
            a[q.id] = rand(q.o.length);
        }
        const r1 = analyze(c, a), r2 = analyze(c, JSON.parse(JSON.stringify(a)));
        assert.deepStrictEqual(r1, r2); n++;
        ok(r1.causes.length <= 3, '원인은 최대 3개');
        ok(new Set(r1.causes).size === r1.causes.length, '원인 중복 없음');
    }
}

// 4) 대표 시나리오
const pick = (c, ans) => analyze(CHECKS[c], ans);
{
    // 몸 낮추고 물러남 + 숨음 + 좁은 길 -> 부담스러운 쪽
    const r = pick('barking', { dist: 2, body: 0, offleash: 1, when: 0, where: 1, calm: 2, bite: 1 });
    ok(r.causes[0] === 'fear', '짖음: 두려움');
    ok(r.flags.length === 0, '짖음: 위험 신호 없음');
}
{
    // 꼬리 흔들며 당김 + 줄 없으면 잘 놂 -> 반가운데 답답한 쪽
    const r = pick('barking', { dist: 1, body: 1, offleash: 0, when: 1, where: 2, calm: 0, bite: 1 });
    ok(r.causes[0] === 'frustration', '짖음: 답답함');
}
{
    // 문 적 있음 + 갑자기 + 다리 절기 -> 안내 3개, 통증 원인 포함
    const r = pick('barking', { dist: 3, body: 2, offleash: 3, when: 2, change: 0, where: 3, calm: 0, bite: 0 });
    ok(['bite', 'sudden', 'pain'].every(f => r.flags.includes(f)), '짖음: 위험 신호');
    ok(r.causes.includes('pain'), '짖음: 통증 원인');
}
{
    const r = pick('alone', { prep: 0, what: 1, chew: 0, start: 0, food: 0, exercise: 1, harm: 3 });
    ok(r.causes[0] === 'separation', '혼자: 분리 불안');
    const b = pick('alone', { prep: 2, what: 1, chew: 1, start: 1, food: 1, exercise: 0, harm: 3 });
    ok(b.causes[0] === 'boredom', '혼자: 심심함');
    const u = pick('alone', { prep: 2, what: 2, potty: 2, start: 3, food: 2, exercise: 1, harm: 3 });
    ok(u.causes[0] === 'toilet' && u.flags.includes('urine'), '혼자: 배변 + 소변 신호');
}
{
    const r = pick('walk', { when: 1, place: 0, after: 1, weather: 2, age: 1, recent: 3, since: 0, home: 1 });
    ok(r.causes[0] === 'fear', '산책: 무서움');
    const p = pick('walk', { when: 2, after: 3, weather: 0, age: 2, recent: 3, since: 1, home: 0 });
    ok(p.causes[0] === 'pain' && ['limp', 'heat', 'sudden', 'pain'].every(f => p.flags.includes(f)), '산책: 통증 + 신호');
    const s = pick('walk', { when: 3, after: 0, weather: 2, age: 1, recent: 3, since: 0, home: 1 });
    ok(s.causes[0] === 'sniff', '산책: 냄새');
    const g = pick('walk', { when: 0, after: 2, weather: 2, age: 1, recent: 0, since: 0, home: 1 });
    ok(g.causes[0] === 'gear', '산책: 장비');
    const h = pick('walk', { when: 2, after: 2, weather: 2, age: 1, recent: 2, since: 0, home: 1 });
    ok(h.causes[0] === 'home', '산책: 집에 가고 싶음');
}
{
    // 전부 모르겠어요 -> 원인 없음 (빈 결과 화면)
    const none = analyze(CHECKS.alone, {});
    ok(none.causes.length === 0 && none.flags.length === 0, '답 없음 -> 원인 없음');
}

console.log(`행동 체크 테스트 통과: ${n}개 확인`);
