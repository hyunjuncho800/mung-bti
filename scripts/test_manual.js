// 멍설명서 문구 규칙 테스트: 점수 조건 밖에서는 문구가 안 나오고, 같은 점수는 같은 결과, 공유 데이터 검증.
// 실행: node scripts/test_manual.js
const assert = require('assert');
const path = require('path');
const P = require(path.join(__dirname, '..', 'mung-profile.js'));
const R = require(path.join(__dirname, '..', 'manual-rules.js'));

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };
const AX = P.AXIS_ORDER;
const mine = (type, scores) => ({ type, typeName: P.TYPES[type].name, name: '', scores });

// 1) 규칙 구조: 요청한 항목(조건, 대상, 문구, 강도, 제외, 버전)이 다 있고 id가 겹치지 않음
const ids = new Set();
for (const r of R.RULES) {
    ok(!ids.has(r.id), `id 중복 ${r.id}`); ids.add(r.id);
    ok(['trait', 'env', 'approach', 'activity'].includes(r.target), `${r.id} 대상`);
    ok(Object.keys(r.when).length >= 1 && Object.keys(r.when).every(k => AX.includes(k) && ['h', 'l'].includes(r.when[k])), `${r.id} 조건`);
    ok(r.text && r.short && r.short.length <= 18 && r.version === R.VERSION, `${r.id} 문구/버전/짧은 문구 길이(${r.short.length})`);
    // 검사로 알 수 없는 단정 금지
    for (const bad of ['안기', '싫어해요', '물지 않', '안전해요', '절대', '반드시', '100%']) ok(!(r.text + r.short + (r.strong || '')).includes(bad), `${r.id}: "${bad}" 금지`);
}

// 2) 모든 점수가 '보통'(2.6~3.4)이면 검사 기반 문구는 하나도 안 나옴
for (const v of [2.6, 3, 3.4]) {
    const g = R.build(mine(3, Object.fromEntries(AX.map(k => [k, v]))));
    eq([g.traits, g.env, g.activities].map(a => a.length), [0, 0, 0], `보통 ${v}`);
    eq(g.approach.map(a => a.source), ['general'], '일반 안내만');
}

// 3) 모든 조합(축마다 1, 2.5, 3, 3.5, 5)에서: 나온 문구는 조건을 만족하고, 같은 입력은 같은 결과
const levels = [1, 2.5, 3, 3.5, 5];
let combos = 0;
const walk = (i, s) => {
    if (i === AX.length) {
        combos++;
        const b = P.bandsOf(s);
        const g = R.build(mine(1, s));
        for (const it of [...g.traits, ...g.env, ...g.approach, ...g.activities]) {
            if (it.source !== 'test') continue;
            const r = R.ruleById(it.id);
            if (!Object.keys(r.when).every(k => b[k] === r.when[k])) assert.fail(`${it.id} 조건 밖에서 나옴`);
            if (r.exclude && Object.keys(r.exclude).every(k => b[k] === r.exclude[k])) assert.fail(`${it.id} 제외 조건인데 나옴`);
        }
        if (g.traits.length > 3 || g.env.length > 2 || g.activities.length > 3) assert.fail('개수 제한');
        if (JSON.stringify(g) !== JSON.stringify(R.build(mine(1, { ...s })))) assert.fail('같은 입력 다른 결과');
        return;
    }
    for (const v of levels) walk(i + 1, { ...s, [AX[i]]: v });
};
walk(0, {});
ok(combos === 5 ** 7, `조합 ${combos}개 확인`);

// 4) 대표 예시와 강도
{
    const g = R.build(mine(3, { e: 1.5, s: 4.7, m: 3.8, f: 3, i: 2.0, o: 2.3, x: 2.0 }));
    eq(g.typeName, '소심형 철학자');
    eq(g.traits.map(t => t.id), ['t_s_h', 't_e_l', 't_i_l'], '3에서 멀수록 먼저');
    eq(g.traits[0].strength, 'strong');
    ok(g.traits[0].text.includes('자주 보여요'), '강한 표현');
    ok(g.approach.some(a => a.id === 'a_s_h') && g.approach.at(-1).source === 'general', '배려할 점 + 일반 안내');
    ok(!g.approach.some(a => a.id === 'a_o_h'), '경계가 높으면 손 받아들인다는 말 안 함');
}
// 5) 예전 검사(점수 없음): 대표 성향만, 검사 기반 문구 없음
{
    const g = R.build({ type: 2, typeName: '', name: '', scores: null }, { likes: '공놀이', dislikes: '청소기 소리', note: '간식 주기 전에 물어봐 주세요' });
    ok(!g.hasScores && g.traits.length === 0 && g.env.length === 0, '점수 없으면 단정 안 함');
    eq([g.likes[0].source, g.dislikes[0].source, g.note[0].source], ['owner', 'owner', 'owner'], '보호자 입력은 출처 owner');
}
// 6) 보호자 입력 정리: 꺾쇠·제어문자 제거, 길이 제한
{
    const g = R.build(mine(1, null), { likes: '<img src=x onerror=alert(1)>공놀이' + 'ㅋ'.repeat(80), note: 'a\u0000b\nc' });
    ok(!g.likes[0].text.includes('<') && g.likes[0].text.length <= 40, '꺾쇠 제거, 40자');
    eq(g.note[0].text, 'ab c');
}
// 7) 공유 데이터: 한글 왕복, 깨진 값 거부
{
    const o = { v: 1, t: 3, n: '초코', r: ['t_s_h'] };
    eq(P.unpack(P.pack(o)), o, '한글 포함 왕복');
    for (const bad of ['', '%%%', 'e30', P.pack([1, 2]), 'a'.repeat(5000)]) ok(P.unpack(bad) === null || bad === 'e30', `거부: ${bad.slice(0, 10)}`);
    eq(P.hashParam('#g=abc&via=link', 'via'), 'link');
    eq(P.hashParam('#g=abc', 'via'), null);
}
// 8) 저장값 읽기: mung_result가 있으면 점수, 없으면 유형만, 값이 이상하면 점수 버림
{
    const st = o => ({ getItem: k => (k in o ? o[k] : null) });
    eq(P.readMine(st({})), null);
    eq(P.readMine(st({ mung_dog: '{"name":"초코","type":3,"typeName":"소심형 철학자"}' })).scores, null, '예전 검사');
    const full = P.readMine(st({ mung_dog: '{"name":"초코","type":3}', mung_result: JSON.stringify({ v: 1, type: 3, e: 2, s: 4, m: 3, f: 3, i: 3, o: 3, x: 3 }) }));
    eq([full.name, full.scores.s], ['초코', 4]);
    eq(P.readMine(st({ mung_result: JSON.stringify({ v: 1, type: 3, e: 9, s: 4, m: 3, f: 3, i: 3, o: 3, x: 3 }) })).scores, null, '범위 밖 점수 버림');
}

console.log(`멍설명서 규칙 테스트 통과: ${n}개 확인 (점수 조합 ${combos}개)`);
