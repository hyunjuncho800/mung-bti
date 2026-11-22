// 멍궁합 테스트: 검사에 있는 축만 비교, 근거 약한 경우 말하지 않기, 백분율·보장 표현 없음, 초대 만료, 같은 입력 같은 결과.
// 실행: node scripts/test_match.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const P = require(path.join(__dirname, '..', 'mung-profile.js'));
const M = require(path.join(__dirname, '..', 'match.js'));

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };
const S = (o) => Object.assign({ e: 3, s: 3, m: 3, f: 3, i: 3, o: 3, x: 3 }, o);

// 1) 문항: 5~7개, 비교 축은 기질검사에 실제로 있는 축만
ok(M.OWNER_Q.length >= 5 && M.OWNER_Q.length <= 7, '보호자 문항 5~7개');
for (const q of M.OWNER_Q) ok(q.axis === null || P.AXIS_ORDER.includes(q.axis), `${q.id} 축`);
ok(M.OWNER_Q.filter(q => !q.axis).every(q => q.show), '비교 안 하는 문항은 생활 정보로 표시');
ok(M.FRIEND_AXES.every(k => P.AXIS_ORDER.includes(k)), '친구 비교 축도 검사에 있는 축');

// 2) 금지 표현: 백분율, 보장, 진단
const src = fs.readFileSync(path.join(__dirname, '..', 'match.js'), 'utf8');
for (const bad of ['%', '궁합 점수', '잘 지낼 거', '보장', '완벽', '진단 결과']) {
    const texts = [...src.matchAll(/'([^'\n]*[가-힣][^'\n]*)'/g)].map(m => m[1]).filter(t => t.includes(bad));
    ok(texts.every(t => /아니에요|않아요/.test(t)), `"${bad}"는 부정문에서만: ${texts.join(' / ')}`);
}

// 3) 보호자 궁합
{
    // 강아지가 모든 축 보통이면 비교 문장 없음 (근거 약함)
    const r = M.compareOwner({ activity: 2, outdoor: 2, novelty: 2, close: 2, social: 2, change: 2, alone: 1 }, S({}));
    eq([r.similar.length, r.different.length], [0, 0], '모두 보통이면 말하지 않음');
    eq(r.info, ['평소 활동량: 1시간 이상', '쉬는 날: 밖으로 나가는 편'], '검사에 없는 항목은 정보로만');
}
{
    const r = M.compareOwner({ activity: 2, outdoor: 2, novelty: 2, close: 2, social: 0, change: 0, alone: 2 }, S({ e: 4.5, m: 4, o: 4.2, x: 1.8, i: 2 }));
    eq(r.nickname, 'explore', '둘 다 새로운 걸 좋아하면 탐험 파트너');
    ok(r.similar.includes(M.OWNER_TEXT.e.hh) && r.similar.includes(M.OWNER_TEXT.m.hh), '비슷한 점');
    ok(r.different.includes(M.OWNER_TEXT.o.lh), '보호자 조용 vs 강아지 사교');
    ok(r.similar.includes(M.OWNER_TEXT.x.ll) && !r.different.includes(M.OWNER_TEXT.x.ll), 'x: 보호자 낮음, 강아지 낮음이면 비슷한 부분');
    ok(r.different.some(t => t.includes('혼자 있는 시간')), '혼자 있는 시간 x 독립성');
    ok(r.tips.length >= 1 && r.activities.length >= 2 && r.activities.length <= 3, '활동과 맞춰 줄 점');
}
{
    // 한 단계 차이(보호자 '가끔' vs 강아지 높음)는 말하지 않음
    const r = M.compareOwner({ novelty: 1 }, S({ e: 4.8 }));
    eq([r.similar.length, r.different.length], [0, 0]);
}
// 4) 모든 답 조합 x 강아지 점수 몇 가지: 같은 입력 같은 결과, 별칭은 4개 중 하나
const dogs = [S({}), S({ e: 4.5, s: 1.5 }), S({ e: 1.5, s: 4.5, x: 1.5, i: 1.5 }), S({ m: 4.6, o: 4.4, f: 4 }), S({ e: 2, m: 2, o: 2, x: 4, i: 4 })];
let combos = 0;
const walk = (i, a) => {
    if (i === M.OWNER_Q.length) {
        for (const d of dogs) {
            combos++;
            const r1 = M.compareOwner(a, d), r2 = M.compareOwner({ ...a }, { ...d });
            if (JSON.stringify(r1) !== JSON.stringify(r2)) assert.fail('같은 입력 다른 결과');
            if (!['explore', 'calm', 'energy', 'care'].includes(r1.nickname)) assert.fail('별칭');
        }
        return;
    }
    for (const v of [0, 1, 2]) walk(i + 1, { ...a, [M.OWNER_Q[i].id]: v });
};
walk(0, {});
ok(combos === 3 ** 7 * dogs.length, `보호자 조합 ${combos}개`);

// 5) 친구 궁합
eq(M.bandsString(S({ e: 4, s: 2, o: 3, x: 1, f: 3.5 })), 'hlmlh', '순서: e s o x f');
{
    const r = M.compareFriends('hlhhh', 'hlhhh');
    eq(r.nickname, 'f_explore');
    eq(r.common.length, 5); eq(r.different.length, 0);
    ok(r.firstMeet.length >= 4, '첫 만남 안내는 항상');
}
{
    const r = M.compareFriends('hhmmm', 'llmmm');
    eq(r.nickname, 'f_slow', '한쪽이 조심스러우면 천천히');
    ok(r.care.some(t => t.includes('거리를 두고')), '거리 두기 안내');
    eq(r.different.length, 2);
}
eq(M.compareFriends('mmmmm', 'mmmmm').common.length, 0, '보통끼리는 닮았다고 하지 않음');
const B = ['h', 'm', 'l'];
let fc = 0;
for (let a = 0; a < 243; a++) for (const b of [0, 60, 121, 200, 242]) {
    const s = x => [0, 1, 2, 3, 4].map(i => B[Math.floor(x / 3 ** i) % 3]).join('');
    const r = M.compareFriends(s(a), s(b));
    if (!M.NICKNAMES[r.nickname]) assert.fail('친구 별칭');
    if (JSON.stringify(r) !== JSON.stringify(M.compareFriends(s(a), s(b)))) assert.fail('친구 같은 입력 다른 결과');
    fc++;
}
ok(fc === 1215, '친구 조합');
eq([M.friendBands('hmlhm'), M.friendBands('hml'), M.friendBands('<b>xx'), M.friendBands(5)], ['hmlhm', null, null, null], '단계 문자열 검증');

// 6) 초대 만료 (30일)
const day = (y, m, d) => Date.UTC(y, m - 1, d);
eq(M.inviteExpired('20261123', day(2026, 11, 23)), false);
eq(M.inviteExpired('20261123', day(2026, 12, 23)), false, '30일째는 열림');
eq(M.inviteExpired('20261123', day(2026, 12, 24) + 1), true, '31일째 만료');
eq(M.inviteExpired('20261130', day(2026, 11, 23)), true, '미래 날짜는 거부');
eq(M.inviteExpired('abc', day(2026, 11, 23)), true);

console.log(`멍궁합 테스트 통과: ${n}개 확인 (보호자 조합 ${combos}개, 친구 조합 ${fc}개)`);
