// 멍시그널 데이터·규칙 점검: 행동별 자세가 맞는 해석으로 이어지는지, 섞인 신호를 단정하지 않는지, 숫자 확률이 없는지.
// 실행: node scripts/test_signal.js
const assert = require('assert');
const D = require('../signal-data.js');
const R = require('../signal-rules.js');

let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const ids = new Set(D.PARAMS.map(p => p.id).concat(D.TOGGLES.map(t => t.id), ['posture']));

const EXPECT = { relaxed: 'calm', play_bow: 'positive', alert: 'caution', anxious: 'stress', fearful: 'fear', warning: 'warning',
    greeting: 'positive', curious: 'positive', stress_yawn: 'stress', shake_off: 'stress', sniff_ground: 'stress', paw_sit: 'stress',
    guarding: 'warning', resting: 'calm', belly_relaxed: 'calm', appeasement_roll: 'fear' };
for (const b of D.BEHAVIORS) {
    Object.keys(b.pose).forEach(k => ok(ids.has(k), `${b.id}: 자세 값 ${k}가 조절 항목에 있음`));
    for (const [k, v] of Object.entries(b.pose)) {
        const p = D.PARAMS.find(x => x.id === k);
        if (p) ok(v >= p.min && v <= p.max, `${b.id}: ${k}=${v} 범위 안`);
        else if (k === 'posture') ok(D.POSTURES.some(x => x.id === v), `${b.id}: 자세 ${v}`);
        else ok(typeof v === 'boolean', `${b.id}: ${k}는 켜고 끄는 값`);
    }
    const e = b.explain;
    ok(e.observe && e.meaning && e.check.length && e.action.length && e.mistakes.length, `${b.id}: 설명 다섯 부분`);
    ok(b.sources.length && b.sources.every(s => D.SOURCES[s]), `${b.id}: 출처 연결`);
    const r = R.interpret(b.pose);
    ok(r.tone === EXPECT[b.id], `${b.id}: 해석 ${r.tone} (기대 ${EXPECT[b.id]})`);
    ok(!r.mixed, `${b.id}: 대표 자세는 섞인 신호가 아님`);
}
ok(Object.keys(EXPECT).length === D.BEHAVIORS.length && Object.keys(EXPECT).every(id => D.BEHAVIORS.some(b => b.id === id)), `행동 ${D.BEHAVIORS.length}가지 모두 기대 해석 있음`);

// 배 보이기: 말랑하면 편안함, 굳고 꼬리를 말면 불안
ok(R.interpret({ posture: 'back', tension: 0.05 }).readings.some(x => x.id === 'belly_relaxed'), '말랑하게 배 보이기');
ok(R.interpret({ posture: 'back', tension: 0.8, tailHeight: -1 }).tone === 'fear', '굳은 채 배 보이기는 두려움');
// 밥그릇만 있고 몸이 풀려 있으면 지키기로 단정 안 함
ok(!R.interpret({ bowl: true, tension: 0.1 }).readings.some(x => x.id === 'guarding'), '밥그릇만으로 지키기 단정 안 함');
ok(R.interpret({ shake: true }).checks.some(c => c.includes('젖었을 때')), '몸 털기 하나는 다른 이유도 안내');

// 놀이 자세 + 이빨 + 응시: 단정하지 않고 섞였다고 알림
const mixed = R.interpret(Object.assign({}, D.BEHAVIORS.find(b => b.id === 'play_bow').pose, { lipCurl: 0.8, gaze: 1 }));
ok(mixed.mixed && mixed.tone === 'mixed' && mixed.readings.some(x => x.kind === 'positive') && mixed.readings.some(x => x.kind === 'concern'), '섞인 신호 처리');
ok(mixed.actions[0].includes('떨어져서'), '섞이면 거리 두기부터 안내');

// 한 부위만 바꿔서는 감정을 단정하지 않음
ok(R.interpret({ lipCurl: 0.8 }).readings.every(x => x.id !== 'warning'), '이빨만 보여서는 경고로 단정 안 함');
ok(R.interpret({ wagSpeed: 1, wagRange: 1 }).tone !== 'warning', '꼬리 흔들기만으로 경고 아님');
ok(R.interpret({ tailHeight: -1 }).tone !== 'fear', '꼬리만 내려서는 두려움으로 단정 안 함');
ok(R.interpret(Object.assign({}, D.DEFAULTS, { lick: true })).checks.some(c => c.includes('먹은 뒤')), '입술 핥기 하나는 다른 이유도 안내');
// 굳은 몸 + 흔드는 꼬리
ok(R.interpret({ tension: 0.9, gaze: 0.8, wagSpeed: 0.6, wagRange: 0.3 }).readings.some(x => x.id === 'tense_wag'), '굳은 채 흔드는 꼬리');

// 같은 입력이면 같은 결과, 숫자 확률·점수 없음
const sample = { tension: 0.7, earBack: 0.8, tailHeight: -0.7, bodyHeight: -0.5, yawn: true };
ok(JSON.stringify(R.interpret(sample)) === JSON.stringify(R.interpret(sample)), '결과가 매번 같음');
const texts = [];
D.BEHAVIORS.forEach(b => texts.push(b.name, b.explain.observe, b.explain.meaning, ...b.explain.check, ...b.explain.action, ...b.explain.mistakes));
R.RULES.forEach(r => texts.push(r.title, r.text));
const all = texts.join(' ') + JSON.stringify(R.interpret(sample)) + JSON.stringify(mixed);
ok(!/\d\s*%|퍼센트|확률|점수/.test(all), '확률·점수 표현 없음');
ok(!/진단합니다|확실히|틀림없/.test(all), '단정 표현 없음');
// 모든 결과에 진료 안내
ok(R.interpret({}).checks.some(c => c.includes('동물병원')), '갑작스런 변화는 진료 안내');

console.log(`멍시그널 규칙 테스트 통과: ${n}개 확인`);
