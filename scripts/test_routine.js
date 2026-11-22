// 멍루틴 테스트: 일정 데이터, 날짜 계산, 진행률, 저장값 복원.
// 실행: node scripts/test_routine.js
const assert = require('assert');
const path = require('path');
const R = require(path.join(__dirname, '..', 'routine.js'));

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };

// 1) 유형 1~4 모두 7일, 하루 1~2개, 활동은 5~10분이고 내용이 다 있음
eq(Object.keys(R.PLANS), ['1', '2', '3', '4'], '기질검사 유형 4개와 같은 번호');
for (const [t, p] of Object.entries(R.PLANS)) {
    eq(p.days.length, 7, `유형 ${t}: 7일`);
    p.days.forEach((d, i) => {
        ok(d.length >= 1 && d.length <= 2, `유형 ${t} ${i + 1}일차: 1~2개`);
        d.forEach(id => ok(R.ACTIVITIES[id], `유형 ${t}: 없는 활동 ${id}`));
    });
}
for (const [id, a] of Object.entries(R.ACTIVITIES)) {
    ok(a.min >= 5 && a.min <= 10, `${id}: 5~10분`);
    ok(a.purpose && a.gear.length && a.steps.length && a.caution.length && a.next, `${id}: 내용 빠짐`);
}

// 2) 날짜: 시작일 = 1일차, 월말·연말 넘어감, 과거 날짜는 1일차
eq(R.dayNumber('2026-11-23', '2026-11-23'), 1);
eq(R.dayNumber('2026-11-23', '2026-11-29'), 7);
eq(R.dayNumber('2026-11-28', '2026-12-02'), 5);
eq(R.dayNumber('2026-12-30', '2027-01-02'), 4);
eq(R.dayNumber('2026-03-28', '2026-04-01'), 5);
eq(R.dayNumber('2026-11-23', '2026-11-20'), 1);

// 3) 진행률과 완료 체크
let s = R.newState(3, '2026-11-23');
let p = R.progress(s, '2026-11-23');
eq([p.done, p.today, p.next, p.finished, p.overdue], [0, 1, 1, false, false]);
s = R.toggleDay(s, 1, '2026-11-23');
s = R.toggleDay(s, 2, '2026-11-24');
p = R.progress(s, '2026-11-25');
eq([p.done, p.today, p.next, p.remaining], [2, 3, 3, [3, 4, 5, 6, 7]]);
s = R.toggleDay(s, 2, '2026-11-25');
eq(R.progress(s, '2026-11-25').remaining, [2, 3, 4, 5, 6, 7], '완료 취소');
const before = JSON.stringify(s);
R.toggleDay(s, 4, '2026-11-25');
eq(JSON.stringify(s), before, '원래 기록을 직접 바꾸지 않음');
p = R.progress(s, '2026-12-10');
ok(p.overdue && p.today === 7, '7일 지나도 남은 날 표시');
for (let d = 1; d <= 7; d++) if (!s.done[d]) s = R.toggleDay(s, d, '2026-12-10');
ok(R.progress(s, '2026-12-10').finished, '7일 완료');

// 4) 저장값 복원: 저장했다 다시 읽으면 같고, 깨진 값은 버림
eq(R.parse(JSON.stringify(s)), s, '저장 후 복원');
for (const bad of ['', 'null', '{', '[]', '{"v":2,"type":1,"start":"2026-11-23","done":{}}', '{"v":1,"type":9,"start":"2026-11-23","done":{}}', '{"v":1,"type":1,"start":"어제","done":{}}', '{"v":1,"type":1,"start":"2026-11-23"}']) {
    eq(R.parse(bad), null, `깨진 값 버림: ${bad}`);
}
eq(R.parse('{"v":1,"type":2,"start":"2026-11-23","done":{"1":"2026-11-23","9":"x","abc":"x"}}').done, { 1: '2026-11-23' }, '없는 날짜 기록 제거');

console.log(`멍루틴 테스트 통과: ${n}개 확인`);
