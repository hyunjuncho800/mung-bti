// 멍퀴즈·학습 기록·기질검사 연동 엔진. 화면 없이 계산만 한다(Node 테스트 가능).
// 기록은 이 브라우저 localStorage에만 남는다. 서버로 보내지 않는다.
(function (root) {
    var NODE = typeof module !== 'undefined' && module.exports;
    var QD = NODE ? require('./signal-quiz-data.js') : root.MungQuizData;

    // 멍통역사 등급 (점수는 10점 단위). 재미와 학습용이며 전문 자격이나 실제 강아지 평가가 아니다.
    var GRADES = [
        { id: 'sprout', name: '멍언어 새싹', min: 0, pose: 'curious', line: '몸짓 읽기를 막 시작했어요. 꼬리와 귀부터 하나씩 살펴봐요.' },
        { id: 'explorer', name: '멍언어 탐험가', min: 40, pose: 'alert', line: '대표 신호는 알아보기 시작했어요. 여러 신호를 함께 보는 연습을 해 봐요.' },
        { id: 'reader', name: '멍언어 이해자', min: 60, pose: 'attention', line: '신호를 꽤 잘 읽어요. 상황 속에서 읽는 연습을 더 해 봐요.' },
        { id: 'interpreter', name: '멍언어 통역사', min: 80, pose: 'greeting', line: '여러 신호를 함께 보고 읽을 줄 알아요.' },
        { id: 'master', name: '멍언어 마스터', min: 100, pose: 'play_bow', line: '10문제를 모두 맞혔어요.' },
    ];
    function gradeOf(score) {
        var g = GRADES[0];
        GRADES.forEach(function (x) { if (score >= x.min) g = x; });
        return g;
    }

    function shuffle(arr, rnd) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
        return a;
    }
    // level: 1|2|3 (그 난이도에서 10문항), 'mix'(초급 3·중급 4·고급 3), 'review'(ids로 받은 틀린 문항, 최대 10)
    function pick(level, rnd, ids) {
        rnd = rnd || Math.random;
        var all = QD.QUESTIONS;
        var of = function (lv) { return all.filter(function (q) { return q.level === lv; }); };
        if (level === 'review') return shuffle(all.filter(function (q) { return (ids || []).indexOf(q.id) !== -1; }), rnd).slice(0, 10);
        if (level === 'mix') return shuffle(shuffle(of(1), rnd).slice(0, 3).concat(shuffle(of(2), rnd).slice(0, 4), shuffle(of(3), rnd).slice(0, 3)), rnd);
        return shuffle(of(level), rnd).slice(0, 10);
    }
    // 보기 순서를 섞고 정답 표시를 붙임
    function choicesOf(q, rnd) {
        return shuffle(q.choices.map(function (c, i) { return { text: c[0], why: c[1], correct: i === q.answer }; }), rnd || Math.random);
    }
    // 정답 수 기준 100점 만점
    function scoreOf(results) {
        var right = results.filter(function (r) { return r.correct; }).length;
        return { right: right, total: results.length, score: Math.round(right / Math.max(results.length, 1) * 100) };
    }
    // results: [{ q, correct }] -> 잘 이해한 주제(틀린 적 없음) / 복습할 주제(하나라도 틀림)
    function summarize(results) {
        var t = {};
        results.forEach(function (r) {
            r.q.tags.forEach(function (tag) { t[tag] = t[tag] || { right: 0, wrong: 0 }; t[tag][r.correct ? 'right' : 'wrong']++; });
        });
        var keys = Object.keys(t);
        var good = keys.filter(function (k) { return t[k].wrong === 0; }).sort(function (a, b) { return t[b].right - t[a].right; });
        var review = keys.filter(function (k) { return t[k].wrong > 0; }).sort(function (a, b) { return t[b].wrong - t[a].wrong; });
        var info = function (k) { return Object.assign({ id: k }, QD.TOPICS[k]); };
        return { good: good.slice(0, 4).map(info), review: review.slice(0, 4).map(info) };
    }

    // ---------------------------------------------------------------- 학습 기록 (localStorage)
    var KEY = 'mung_signal_quiz', SEEN = 'mung_signal_seen';
    function read(storage, key, def) {
        try { var v = JSON.parse(storage.getItem(key) || 'null'); return v && typeof v === 'object' ? v : def; } catch (e) { return def; }
    }
    function write(storage, key, v) { try { storage.setItem(key, JSON.stringify(v)); } catch (e) {} }
    var ids = new Set(QD.QUESTIONS.map(function (q) { return q.id; }));
    function loadRecord(storage) {
        var r = read(storage, KEY, {});
        return {
            attempts: Number.isFinite(r.attempts) ? r.attempts : 0,
            best: Number.isFinite(r.best) ? r.best : null,
            last: r.last && Number.isFinite(r.last.score) ? r.last : null,
            wrong: Array.isArray(r.wrong) ? r.wrong.filter(function (id) { return ids.has(id); }) : [],
        };
    }
    // 한 판이 끝날 때. 틀린 문항은 복습 목록에 넣고, 맞힌 문항은 뺀다.
    function saveRound(storage, level, results, today) {
        var r = loadRecord(storage), s = scoreOf(results);
        var wrong = r.wrong.filter(function (id) { return !results.some(function (x) { return x.q.id === id && x.correct; }); });
        results.forEach(function (x) { if (!x.correct && wrong.indexOf(x.q.id) === -1) wrong.push(x.q.id); });
        if (level !== 'review') {
            r.attempts += 1;
            r.best = r.best === null ? s.score : Math.max(r.best, s.score);
            r.last = { score: s.score, level: String(level), date: today };
        }
        r.wrong = wrong.slice(-30);
        write(storage, KEY, r);
        return r;
    }
    function markSeen(storage, behavior) {
        var seen = read(storage, SEEN, { list: [] }).list || [];
        if (seen.indexOf(behavior) === -1) { seen.push(behavior); write(storage, SEEN, { list: seen.slice(-50) }); }
        return seen;
    }
    function seenList(storage) { var v = read(storage, SEEN, { list: [] }).list; return Array.isArray(v) ? v : []; }

    // ---------------------------------------------------------------- 기질검사 연동
    // mine: MungProfile.readMine() 결과 { type, typeName, scores } (점수가 없을 수도 있음)
    // 기질검사 점수의 높고 낮음으로 "먼저 익혀 두면 좋은 신호"를 고른다. 강아지의 실제 감정을 판단하지 않는다.
    var AXIS_FOCUS = [
        { axis: 's', band: 'h', behavior: 'fearful', why: '큰 소리나 낯선 곳에서 조심스러운 편으로 나왔어요. 두려움 신호를 일찍 알아차리면 도움이 돼요.' },
        { axis: 'o', band: 'l', behavior: 'appeasement', why: '낯선 사람이나 강아지와의 만남이 부담스러운 편으로 나왔어요. 상대를 달래는 신호를 익혀 두세요.' },
        { axis: 'i', band: 'l', behavior: 'anxious', scene: 'leaving', why: '보호자가 나갈 때 차분하기 어려운 편으로 나왔어요. 외출 준비 때 보이는 불안 신호를 살펴보세요.' },
        { axis: 'e', band: 'h', behavior: 'excited', why: '새로운 것과 놀이에 푹 빠지는 편으로 나왔어요. 신난 흥분과 불안한 들뜸을 구별해 보세요.' },
        { axis: 'm', band: 'h', behavior: 'attention', why: '보호자의 부름과 손길에 잘 반응하는 편으로 나왔어요. 관심을 바라는 신호를 읽어 보세요.' },
        { axis: 's', band: 'l', behavior: 'alert', why: '낯선 것에 거리낌이 적은 편으로 나왔어요. 무언가에 집중할 때의 신호를 살펴보세요.' },
    ];
    var TYPE_FOCUS = {
        1: ['curious', 'fearful', 'avoidance'],
        2: ['excited', 'play_bow', 'alert'],
        3: ['anxious', 'freeze', 'stress_yawn'],
        4: ['resting', 'attention', 'avoidance'],
    };
    function recommend(mine) {
        if (!mine) return [];
        var out = [];
        if (mine.scores) {
            AXIS_FOCUS.forEach(function (f) {
                var v = mine.scores[f.axis], band = v >= 3.5 ? 'h' : v <= 2.5 ? 'l' : 'm';
                if (band === f.band && !out.some(function (o) { return o.behavior === f.behavior; })) out.push({ behavior: f.behavior, scene: f.scene || null, why: f.why });
            });
        }
        (TYPE_FOCUS[mine.type] || []).forEach(function (b) {
            if (out.length < 3 && !out.some(function (o) { return o.behavior === b; })) out.push({ behavior: b, scene: null, why: mine.typeName + ' 결과가 나온 보호자에게 먼저 권하는 신호예요.' });
        });
        return out.slice(0, 3);
    }

    var api = { GRADES: GRADES, gradeOf: gradeOf, pick: pick, choicesOf: choicesOf, scoreOf: scoreOf, summarize: summarize,
        loadRecord: loadRecord, saveRound: saveRound, markSeen: markSeen, seenList: seenList, recommend: recommend, AXIS_FOCUS: AXIS_FOCUS };
    if (NODE) module.exports = api;
    else root.MungLearn = api;
})(this);
