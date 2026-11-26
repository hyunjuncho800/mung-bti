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
    guarding: 'warning', resting: 'calm', belly_relaxed: 'calm', appeasement_roll: 'fear',
    excited: 'positive', avoidance: 'stress', freeze: 'warning', attention: 'positive', appeasement: 'stress' };
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

// 신체 부위 설명: 모든 행동 × 모든 부위에서 다섯 갈래가 다 나오고, 확률 표현이 없음
for (const b of D.BEHAVIORS) for (const part of Object.keys(R.PARTS)) {
    const info = R.partInfo(part, Object.assign({}, D.DEFAULTS, b.pose));
    ok(info.observe && info.meaning && info.check.length && info.action.length && info.mistakes.length, `${b.id}/${part}: 부위 설명 다섯 갈래`);
    ok(!/\d\s*%|확률|점수/.test(JSON.stringify(info)), `${b.id}/${part}: 확률 표현 없음`);
}
ok(R.partInfo('mouth', { lipCurl: 0.8 }).observe.includes('이빨'), '입: 이빨');
ok(R.partInfo('tail', { tailHeight: -1 }).observe.includes('말아'), '꼬리: 말아 넣음');
ok(R.partInfo('body', { posture: 'back', tension: 0.9 }).meaning.includes('다가오지'), '몸: 굳은 배 보이기');
ok(R.partInfo('nose', {}) === null, '없는 부위는 null');

// 멍상황: 12가지, 행동·출처 연결, 좋은 선택과 피할 선택이 모두 있음
const S = require('../signal-scenes.js');
ok(S.SCENES.length === 12, `멍상황 ${S.SCENES.length}가지`);
for (const sc of S.SCENES) {
    ok(D.BEHAVIORS.some(b => b.id === sc.behavior) && D.BEHAVIORS.some(b => b.id === sc.alt.behavior), `${sc.id}: 행동 연결`);
    ok(sc.signals.length && sc.meaning && sc.alt.text && sc.situation, `${sc.id}: 설명`);
    ok(sc.choices.some(c => c.verdict === 'good') && sc.choices.some(c => c.verdict === 'bad'), `${sc.id}: 좋은 선택과 피할 선택`);
    ok(sc.choices.every(c => S.VERDICT[c.verdict] && c.why), `${sc.id}: 선택지 해설`);
    ok(sc.sources.length && sc.sources.every(k => D.SOURCES[k]), `${sc.id}: 출처`);
    // 위협 신호 상황에서 억지로 하기·혼내기를 좋은 선택으로 두지 않음
    ok(!sc.choices.some(c => c.verdict === 'good' && /억지로|혼낸|끌고|꽉 붙잡/.test(c.text)), `${sc.id}: 강제·처벌은 좋은 선택 아님`);
}
// 가이드 페이지와 상투어 검사
const fs = require('fs'), path = require('path');
const gdir = path.join(__dirname, '../content/signal-guide');
const guides = fs.readdirSync(gdir).filter(f => f.endsWith('.html'));
ok(guides.length >= 7, `가이드 ${guides.length}편`);
for (const f of guides) {
    const src = fs.readFileSync(path.join(gdir, f), 'utf8');
    for (const k of ['title', 'desc', 'h1', 'view', 'sources']) ok(new RegExp(`<!-- ${k}: .+ -->`).test(src), `${f}: ${k}`);
    const view = (src.match(/<!-- view: ([bs])-([a-z_]+) -->/) || []);
    ok(view[1] === 'b' ? D.BEHAVIORS.some(b => b.id === view[2]) : S.SCENES.some(x => x.id === view[2]), `${f}: 3D 링크 대상 있음`);
    const rel = (src.match(/<!-- related: (.+) -->/) || ['', ''])[1].split(',').map(x => x.trim()).filter(Boolean);
    ok(rel.every(r => fs.existsSync(path.join(gdir, r + '.html'))), `${f}: 관련 가이드 있음`);
    ok(src.match(/<!-- sources: (.+) -->/)[1].split(',').every(k => D.SOURCES[k.trim()]), `${f}: 출처 키`);
    ok(fs.existsSync(path.join(__dirname, '../mung-signal/guide', f.replace('.html', ''), 'index.html')), `${f}: 페이지 생성됨`);
}
const STOCK = ['필수적', '핵심', '완벽', '극강', '효과적', '다양한', '섬세한', '진정한', '명심', '미연에', '비결', '첫걸음', '골든타임', '바람직', '천차만별', '결론적으로', '극대화', '현저히', '전적으로', '반드시'];
const allText = JSON.stringify([D.BEHAVIORS, R.RULES.map(r => [r.title, r.text]), R.PARTS, S.SCENES]) + guides.map(f => fs.readFileSync(path.join(gdir, f), 'utf8')).join('');
ok(STOCK.every(w => !allText.includes(w)), '상투어 없음: ' + STOCK.filter(w => allText.includes(w)).join(','));
ok(!/습니다[.!?]/.test(allText), '"~습니다" 문체 없음');

console.log(`멍시그널 규칙 테스트 통과: ${n}개 확인`);
