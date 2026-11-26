// 멍퀴즈·학습 기록·기질검사 연동 점검: 문항 형식, 10문항 뽑기(중복 없음), 등급 경계, 기록 저장, 추천.
// 실행: node scripts/test_quiz.js
const assert = require('assert');
const D = require('../signal-data.js');
const S = require('../signal-scenes.js');
const QD = require('../signal-quiz-data.js');
const L = require('../signal-learn.js');

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const Q = QD.QUESTIONS;

ok(Q.length >= 30, `문항 ${Q.length}개 (30개 이상)`);
for (const lv of [1, 2, 3]) ok(Q.filter(q => q.level === lv).length >= 10, `${QD.LEVELS[lv]} 10문항 이상`);
ok(new Set(Q.map(q => q.id)).size === Q.length, '문항 id 중복 없음');
for (const t of Object.keys(QD.TYPES)) ok(Q.some(q => q.type === t), `문제 유형 ${QD.TYPES[t]} 있음`);
for (const q of Q) {
    ok(q.choices.length === 4, `${q.id}: 4지선다`);
    ok(q.answer >= 0 && q.answer < 4, `${q.id}: 정답 번호`);
    ok(q.choices.every(c => c[0] && c[1]), `${q.id}: 보기마다 해설`);
    ok(new Set(q.choices.map(c => c[0])).size === 4, `${q.id}: 보기 중복 없음`);
    ok(D.BEHAVIORS.some(b => b.id === q.show.behavior), `${q.id}: 3D 행동 있음`);
    ok(!q.show.scene || S.SCENES.some(s => s.id === q.show.scene), `${q.id}: 상황 있음`);
    ok(q.tags.length && q.tags.every(t => QD.TOPICS[t]), `${q.id}: 주제 태그`);
    // 정답이 억지로 하기·혼내기가 되지 않게
    ok(!/억지로|혼낸|끌고|꽉 붙잡/.test(q.choices[q.answer][0]), `${q.id}: 정답에 강제·처벌 없음`);
}

// 10문항 뽑기: 여러 번 돌려도 중복 없음, 난이도 맞음
let seed = 1;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
for (let i = 0; i < 50; i++) {
    for (const lv of [1, 2, 3, 'mix']) {
        const p = L.pick(lv, rnd);
        ok(p.length === 10 && new Set(p.map(q => q.id)).size === 10, `${lv}: 중복 없는 10문항`);
        if (lv !== 'mix') ok(p.every(q => q.level === lv), `${lv}: 난이도 맞음`);
    }
}
const mix = L.pick('mix', rnd);
ok([1, 2, 3].every(lv => mix.some(q => q.level === lv)), '섞어서: 세 난이도 모두');
const rev = L.pick('review', rnd, ['b1', 'm3', 'zzz']);
ok(rev.length === 2 && rev.every(q => ['b1', 'm3'].includes(q.id)), '복습: 틀린 문항만');
const ch = L.choicesOf(Q[0], rnd);
ok(ch.length === 4 && ch.filter(c => c.correct).length === 1, '보기 섞기: 정답 하나');

// 점수와 등급 (명세: 0~30 새싹, 40~50 탐험가, 60~70 이해자, 80~90 통역사, 100 마스터)
const EXP = { 0: 'sprout', 10: 'sprout', 30: 'sprout', 40: 'explorer', 50: 'explorer', 60: 'reader', 70: 'reader', 80: 'interpreter', 90: 'interpreter', 100: 'master' };
for (const [s, g] of Object.entries(EXP)) ok(L.gradeOf(+s).id === g, `${s}점 → ${g}`);
const res = Q.slice(0, 10).map((q, i) => ({ q, correct: i < 7 }));
ok(L.scoreOf(res).score === 70, '7개 맞히면 70점');
const sum = L.summarize(res);
ok(sum.review.length > 0 && sum.good.every(t => !sum.review.some(r => r.id === t.id)), '잘 이해한 주제와 복습 주제가 겹치지 않음');

// 기록 저장
const mem = {}; const st = { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } };
let r = L.saveRound(st, 1, res, '2026-11-26');
ok(r.attempts === 1 && r.best === 70 && r.wrong.length === 3, '첫 기록: 도전 1번, 최고 70점, 틀린 3문항');
r = L.saveRound(st, 'review', [{ q: res[7].q, correct: true }], '2026-11-26');
ok(r.attempts === 1 && r.wrong.length === 2, '복습으로 맞히면 목록에서 빠지고 도전 횟수는 그대로');
mem.mung_signal_quiz = '{broken';
ok(L.loadRecord(st).attempts === 0, '깨진 기록은 처음부터');
L.markSeen(st, 'relaxed'); L.markSeen(st, 'relaxed'); L.markSeen(st, 'warning');
ok(L.seenList(st).length === 2, '살펴본 행동 중복 없이');

// 기질검사 연동: 점수가 있으면 축 기준, 없으면 유형 기준. 항상 존재하는 행동만
const recA = L.recommend({ type: 3, typeName: '소심형 철학자', scores: { e: 2, s: 4.5, m: 3, f: 3, i: 2, o: 2, x: 3 } });
ok(recA.length === 3 && recA[0].behavior === 'fearful', '조심스러움 높음 → 두려움 신호 먼저');
const recB = L.recommend({ type: 2, typeName: '폭주 호기심형', scores: null });
ok(recB.map(x => x.behavior).join() === 'excited,play_bow,alert', '점수 없으면 유형 기준');
ok(L.recommend(null).length === 0, '검사 결과 없으면 추천 없음');
for (const t of [1, 2, 3, 4]) ok(L.recommend({ type: t, typeName: 'x', scores: null }).every(x => D.BEHAVIORS.some(b => b.id === x.behavior)), `유형 ${t}: 있는 행동만`);

// 문체: 확률·점수 단정, 상투어, ~습니다 없음
const text = JSON.stringify([Q, L.GRADES, L.AXIS_FOCUS]);
ok(!/확률|퍼센트|\d\s*%/.test(text), '확률 표현 없음');
ok(!/습니다[.!?"]/.test(text), '"~습니다" 문체 없음');
ok(!['필수적', '핵심', '완벽', '반드시', '다양한', '효과적', '골든타임'].some(w => text.includes(w)), '상투어 없음');

console.log(`멍퀴즈 테스트 통과: ${n}개 확인`);
