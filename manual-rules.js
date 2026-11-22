// 멍설명서 문구 규칙 (규칙 기반, 외부 AI 없음). 같은 점수면 언제나 같은 문구가 나온다.
// 규칙 하나 = { id, version, target(적용 대상), when(검사 결과 조건), exclude(제외 조건), text, short, strong(강한 표현) }
// 조건은 기질검사 점수의 단계(h 높음 3.5 이상 / l 낮음 2.5 이하)로만 쓴다. '보통'인 축은 아무 말도 하지 않는다.
// 문구는 각 축 문항이 실제로 묻는 범위(mung-profile.js의 AXES.about)를 넘지 않게 썼다.
// 예: 사교성은 '다른 강아지와 인사, 미용 참기, 낯선 사람이 내민 손'만 묻으므로 '안기는 걸 좋아한다/싫어한다'는 쓰지 않는다.
(function (root) {
    var P = typeof module !== 'undefined' && module.exports ? require('./mung-profile.js') : root.MungProfile;
    var VERSION = 1;

    var RULES = [
        // ---- trait: 주요 기질 특성 (카드의 '특징 3가지'도 여기서 고름)
        { id: 't_e_h', target: 'trait', when: { e: 'h' }, short: '새로운 것에 먼저 다가가요', text: '처음 보는 길이나 물건에 먼저 다가가 냄새를 맡는 편이에요.', strong: '처음 보는 길이나 물건이 보이면 먼저 다가가 냄새를 맡는 모습이 자주 보여요.' },
        { id: 't_e_l', target: 'trait', when: { e: 'l' }, short: '새로운 건 천천히 살펴봐요', text: '처음 보는 것에는 서두르지 않고 지켜본 뒤에 움직이는 편이에요.' },
        { id: 't_s_h', target: 'trait', when: { s: 'h' }, short: '큰 소리와 낯선 곳에 조심스러워요', text: '큰 소리나 처음 가는 곳에서 놀라거나 보호자 뒤로 숨는 모습이 있는 편이에요.', strong: '큰 소리나 처음 가는 곳에서 놀라거나 보호자 뒤로 숨는 모습이 자주 보여요.' },
        { id: 't_s_l', target: 'trait', when: { s: 'l' }, short: '웬만한 소리에는 덤덤해요', text: '갑작스러운 소리나 처음 가는 곳에도 비교적 덤덤한 편이에요.' },
        { id: 't_m_h', target: 'trait', when: { m: 'h' }, short: '보호자 목소리에 바로 반응해요', text: '보호자가 이름을 부르거나 눈을 맞추면 금방 반응하고, 말과 손길만으로도 좋아하는 편이에요.' },
        { id: 't_m_l', target: 'trait', when: { m: 'l' }, short: '애정 표현이 담백해요', text: '보호자를 좋아해도 표현은 담백하게 하는 편이에요.' },
        { id: 't_f_h', target: 'trait', when: { f: 'h' }, short: '한번 시작하면 끝까지 해요', text: '노즈워크나 개껌처럼 한 가지에 오래 집중하는 편이에요.' },
        { id: 't_f_l', target: 'trait', when: { f: 'l' }, short: '여러 놀이를 바꿔 가며 놀아요', text: '한 가지를 오래 하기보다 여러 놀이로 자주 바꾸는 편이에요.' },
        { id: 't_i_h', target: 'trait', when: { i: 'h' }, short: '혼자서도 차분하게 쉬어요', text: '보호자가 나가도 자기 자리에서 차분하게 쉬고, 혼자만의 시간을 잘 보내는 편이에요.' },
        { id: 't_i_l', target: 'trait', when: { i: 'l' }, short: '보호자 곁이 제일 편해요', text: '보호자 가까이에 있을 때 가장 편안해하는 편이에요.' },
        { id: 't_o_h', target: 'trait', when: { o: 'h' }, short: '다른 강아지와 인사를 잘 나눠요', text: '다른 강아지와 부드럽게 인사를 주고받고, 미용이나 발톱 깎기도 비교적 잘 참는 편이에요.' },
        { id: 't_o_l', target: 'trait', when: { o: 'l' }, short: '친해지는 데 시간이 필요해요', text: '낯선 사람이나 다른 강아지와 가까워지는 데 시간이 필요한 편이에요.' },
        { id: 't_x_h', target: 'trait', when: { x: 'h' }, short: '새 환경에도 금방 적응해요', text: '이사나 여행처럼 환경이 바뀌어도 비교적 빨리 적응하는 편이에요.' },
        { id: 't_x_l', target: 'trait', when: { x: 'l' }, short: '익숙한 곳이 편해요', text: '환경이 바뀌면 적응할 시간이 필요한 편이에요.' },

        // ---- env: 편안하게 느끼는 환경
        { id: 'v_s_h', target: 'env', when: { s: 'h' }, short: '조용하고 숨을 곳이 있는 자리', text: '조용하고, 놀랐을 때 들어가 쉴 수 있는 자리가 있으면 편안해해요.' },
        { id: 'v_x_l', target: 'env', when: { x: 'l' }, short: '익숙한 자리와 물건', text: '익숙한 자리와 물건이 있을 때 편안해요. 바꾸는 건 하나씩 천천히 해 주세요.' },
        { id: 'v_i_h', target: 'env', when: { i: 'h' }, short: '혼자 쉴 수 있는 자기 자리', text: '혼자 쉴 수 있는 자기 자리를 좋아하는 편이에요.' },
        { id: 'v_i_l', target: 'env', when: { i: 'l' }, short: '보호자가 보이는 곳', text: '보호자가 보이는 곳에서 쉴 때 편안해하는 편이에요.' },
        { id: 'v_x_h', target: 'env', when: { x: 'h' }, exclude: { s: 'h' }, short: '새로운 곳도 괜찮아요', text: '새로운 장소에서도 비교적 금방 자리를 잡는 편이에요.' },

        // ---- approach: 접근할 때 배려할 점 (안전을 보장하는 말은 쓰지 않는다)
        { id: 'a_s_h', target: 'approach', when: { s: 'h' }, short: '예고 없이 다가가지 않기', text: '예고 없이 다가가면 놀랄 수 있어요. 보호자에게 먼저 물어보고, 강아지가 먼저 다가올 때까지 기다려 주세요.' },
        { id: 'a_o_l', target: 'approach', when: { o: 'l' }, short: '손 내밀기보다 옆에서 기다리기', text: '낯선 손길이 아직 부담스러울 수 있어요. 손을 내밀기보다 옆으로 서서 기다려 주세요.' },
        { id: 'a_x_l', target: 'approach', when: { x: 'l' }, short: '조용한 곳에서 짧게 인사하기', text: '처음 만나는 장소가 낯설면 더 긴장할 수 있어요. 조용한 곳에서 짧게 인사해 주세요.' },
        { id: 'a_e_h', target: 'approach', when: { e: 'h' }, exclude: { s: 'h' }, short: '반갑게, 하지만 천천히', text: '궁금한 게 많아 먼저 다가올 수 있어요. 반갑게 맞되 갑자기 몸을 숙이거나 붙잡지는 말아 주세요.' },
        { id: 'a_o_h', target: 'approach', when: { o: 'h' }, exclude: { s: 'h' }, short: '만지기 전엔 보호자에게 먼저', text: '조심스럽게 내민 손도 비교적 잘 받아들이는 편이에요. 그래도 만지기 전엔 보호자에게 먼저 물어봐 주세요.' },

        // ---- activity: 함께 즐기기 좋은 활동
        { id: 'p_e_h', target: 'activity', when: { e: 'h' }, short: '새로운 산책길 탐험', text: '새로운 산책길 걷기, 상자 속 간식 찾기처럼 새로운 걸 알아보는 놀이' },
        { id: 'p_f_h', target: 'activity', when: { f: 'h' }, short: '어려운 노즈워크', text: '난이도 있는 노즈워크나 퍼즐 장난감처럼 오래 몰두하는 놀이' },
        { id: 'p_f_l', target: 'activity', when: { f: 'l' }, short: '짧은 놀이 여러 개', text: '짧은 놀이 여러 개를 바꿔 가며 하기' },
        { id: 'p_m_h', target: 'activity', when: { m: 'h' }, short: '이름 부르기 게임', text: '이름 부르기 게임, 칭찬하며 하는 간단한 훈련처럼 보호자와 함께하는 놀이' },
        { id: 'p_o_h', target: 'activity', when: { o: 'h' }, exclude: { s: 'h' }, short: '친구와 함께 걷기', text: '잘 맞는 강아지 친구와 함께 걷기' },
        { id: 'p_s_h', target: 'activity', when: { s: 'h' }, short: '조용한 길 냄새 산책', text: '사람과 차가 적은 길에서 냄새 맡으며 천천히 걷기' },
        { id: 'p_e_l', target: 'activity', when: { e: 'l' }, exclude: { s: 'h' }, short: '익숙한 길 냄새 산책', text: '익숙한 길에서 냄새 맡으며 느긋하게 걷기' },
    ];
    RULES.forEach(function (r) { r.version = VERSION; });
    var BY_ID = {};
    RULES.forEach(function (r) { BY_ID[r.id] = r; });

    // 검사에서 나오지 않는 일반 안내 (출처를 '일반 안내'로 따로 표시)
    var GENERAL_APPROACH = { id: 'a_general', short: '강아지가 먼저 다가오게 기다리기', text: '검사 결과는 보호자가 답한 평소 모습이에요. 처음 만날 땐 보호자에게 먼저 물어보고, 강아지가 다가올 때까지 기다려 주세요.' };

    function matches(cond, bands) {
        return Object.keys(cond).every(function (k) { return bands[k] === cond[k]; });
    }
    // 규칙의 기준 축 점수가 3에서 얼마나 떨어졌는지 (클수록 먼저 보여 줌)
    function weight(rule, scores) {
        var k = Object.keys(rule.when)[0];
        return Math.abs(scores[k] - 3);
    }

    // scores가 없으면(예전 검사) 규칙을 쓰지 않는다. 유형만으로는 각 축 점수를 알 수 없기 때문.
    function pick(scores, target, max) {
        if (!scores) return [];
        var bands = P.bandsOf(scores);
        var hits = RULES.filter(function (r) { return r.target === target && matches(r.when, bands) && !(r.exclude && matches(r.exclude, bands)); });
        hits.sort(function (a, b) { return weight(b, scores) - weight(a, scores) || RULES.indexOf(a) - RULES.indexOf(b); });
        return hits.slice(0, max).map(function (r) {
            var k = Object.keys(r.when)[0];
            var st = P.strength(scores[k]);
            return { id: r.id, source: 'test', strength: st, short: r.short, text: st === 'strong' && r.strong ? r.strong : r.text };
        });
    }

    // 설명서 전체 내용. owner: 보호자가 직접 쓴 것 { likes, dislikes, note } (검사 결과와 출처를 나눠 둔다)
    function build(mine, owner) {
        owner = owner || {};
        var t = P.TYPES[mine.type];
        var s = mine.scores;
        var likes = P.cleanText(owner.likes, 40), dislikes = P.cleanText(owner.dislikes, 40), note = P.cleanText(owner.note, 60);
        return {
            version: VERSION,
            type: mine.type, typeName: t.name, typeSub: t.sub, hasScores: !!s,
            traits: pick(s, 'trait', 3),            // 2. 주요 기질 특성 (카드의 특징 3가지)
            likes: likes ? [{ source: 'owner', short: likes, text: likes }] : [],   // 3. 좋아하는 활동 (보호자 입력만)
            dislikes: dislikes ? [{ source: 'owner', short: dislikes, text: dislikes }] : [], // 불편해하는 상황 (보호자 입력만)
            env: pick(s, 'env', 2),                  // 4. 편안하게 느끼는 환경
            approach: pick(s, 'approach', 2).concat([{ id: GENERAL_APPROACH.id, source: 'general', short: GENERAL_APPROACH.short, text: GENERAL_APPROACH.text }]), // 5. 접근할 때 배려할 점
            activities: pick(s, 'activity', 3),      // 6. 함께 즐기기 좋은 활동
            note: note ? [{ source: 'owner', short: note, text: note }] : [],        // 7. 보호자가 직접 쓴 정보
        };
    }

    // 공유 링크에 담을 수 있는 건 규칙 id뿐 (점수는 담지 않음). 받은 쪽은 id로 문구를 다시 찾는다.
    function ruleById(id) { return BY_ID[id] || (id === GENERAL_APPROACH.id ? GENERAL_APPROACH : null); }

    var api = { VERSION: VERSION, RULES: RULES, build: build, pick: pick, ruleById: ruleById, GENERAL_APPROACH: GENERAL_APPROACH };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.MungManualRules = api;
})(this);
