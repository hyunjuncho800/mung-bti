// 멍시그널 행동 언어 규칙 엔진. 몸 신호 값의 '조합'으로 가능한 해석을 고른다.
// - 한 부위만으로 감정을 단정하지 않는다 (규칙마다 최소 두 가지 신호를 본다)
// - 긍정 신호와 경계 신호가 함께 있으면 '신호가 섞여 있어요'로 알리고, 확인할 것을 안내한다
// - 확률이나 점수는 내지 않는다. 같은 입력이면 언제나 같은 결과.
(function (root) {
    var NODE = typeof module !== 'undefined' && module.exports;
    var D = NODE ? require('./signal-data.js') : root.MungSignalData;

    // 값 -> 읽기 쉬운 신호
    function signalsOf(p) {
        var v = Object.assign({}, D.DEFAULTS, p || {});
        var wagging = v.wagSpeed >= 0.2 && v.wagRange >= 0.15;
        return {
            loose: v.tension <= 0.35, stiff: v.tension >= 0.65,
            earsBack: v.earBack >= 0.55, earsForward: v.earForward >= 0.6 && v.earBack < 0.3,
            tailTucked: v.tailHeight <= -0.6, tailLow: v.tailHeight <= -0.25, tailHigh: v.tailHeight >= 0.5,
            wagging: wagging, wagBroad: wagging && v.wagRange >= 0.6 && v.wagSpeed >= 0.4, wagNarrow: wagging && v.wagRange < 0.3,
            lowered: v.bodyHeight <= -0.4, bowing: v.bow >= 0.6,
            weightBack: v.weight <= -0.35, weightForward: v.weight >= 0.4,
            headDown: v.headPitch <= -0.3, headTilt: Math.abs(v.headTilt) >= 0.4,
            gazeAverted: v.gaze <= -0.4, stare: v.gaze >= 0.6,
            mouthSoft: v.mouthOpen >= 0.2 && v.mouthOpen <= 0.75 && v.lipCurl < 0.3, mouthClosed: v.mouthOpen < 0.1,
            lipCurl: v.lipCurl >= 0.4,
            lick: !!v.lick, yawn: !!v.yawn, freeze: !!v.freeze, shake: !!v.shake, sniff: !!v.sniff, paw: !!v.paw, bowl: !!v.bowl,
            sitting: v.posture === 'sit', lyingDown: v.posture === 'lie', onBack: v.posture === 'back',
        };
    }

    // 신호 이름 (화면에 '눈에 띄는 신호'로 보여 줄 때)
    var LABELS = {
        loose: '몸이 풀려 있음', stiff: '몸이 굳어 있음', earsBack: '귀가 뒤로 젖혀짐', earsForward: '귀가 앞으로 섬',
        tailTucked: '꼬리를 다리 사이로 말음', tailLow: '꼬리가 낮음', tailHigh: '꼬리가 높음',
        wagBroad: '꼬리를 넓게 흔듦', wagNarrow: '꼬리를 좁고 딱딱하게 흔듦', lowered: '몸을 낮춤', bowing: '앞을 낮추고 엉덩이를 듦',
        weightBack: '체중을 뒤로 뺌', weightForward: '체중이 앞으로 쏠림', headDown: '고개를 숙임', headTilt: '고개를 기울임',
        gazeAverted: '시선을 피함', stare: '똑바로 응시함', mouthSoft: '입이 편하게 벌어짐', lipCurl: '입술을 들어 이빨을 보임',
        lick: '입술을 핥음', yawn: '하품함', freeze: '움직임이 멈춤', shake: '젖지 않았는데 몸을 텀', sniff: '갑자기 땅 냄새를 맡음', paw: '앞발을 듦',
        bowl: '밥그릇이 앞에 있음', sitting: '앉아 있음', lyingDown: '엎드려 있음', onBack: '배를 보이며 누움',
    };

    // 해석 규칙. kind: positive(편안·놀이 쪽) / concern(불편·경계 쪽). 순서가 곧 우선순위.
    var RULES = [
        { id: 'guarding', kind: 'concern', tone: 'warning', when: function (s) { return s.bowl && (s.stiff || s.freeze || s.stare); },
          title: '먹을 것을 지키는 중일 수 있어요', text: '밥그릇처럼 소중한 것 앞에서 몸이 굳거나 멈추거나 똑바로 쳐다본다면, 빼앗기지 않으려고 지키는 것일 수 있어요.' },
        { id: 'warning', kind: 'concern', tone: 'warning', when: function (s) { return s.lipCurl && (s.stiff || s.stare); },
          title: '경고 신호일 수 있어요', text: '몸이 굳거나 똑바로 응시하면서 이빨을 보이는 건 "더 다가오지 마"라는 경고로 자주 해석돼요.' },
        { id: 'fear_warning', kind: 'concern', tone: 'warning', when: function (s) { return s.lipCurl && (s.lowered || s.earsBack || s.tailTucked); },
          title: '두려움에서 나온 경고일 수 있어요', text: '몸을 낮추거나 꼬리를 말면서 이빨을 보인다면, 무서워서 스스로를 지키려는 경고일 수 있어요.' },
        { id: 'freeze', kind: 'concern', tone: 'warning', when: function (s) { return s.freeze && (s.stiff || s.stare || s.lowered || s.earsBack); },
          title: '얼어붙은 것일 수 있어요', text: '갑자기 움직임을 멈추고 굳는 건 강한 긴장이나 두려움의 신호일 수 있어요. 이어서 경고나 방어 행동이 나올 수 있어요.' },
        { id: 'appeasement', kind: 'concern', tone: 'fear', when: function (s) { return s.onBack && (s.tailTucked || s.earsBack || s.stiff); },
          title: '불안해서 배를 보이는 것일 수 있어요', text: '몸이 굳은 채 배를 보이며 눕고 꼬리를 말거나 귀를 젖혔다면, 위협을 느껴 "다가오지 마세요"라고 말하는 것일 수 있어요.' },
        { id: 'fear', kind: 'concern', tone: 'fear', when: function (s) { return s.lowered && s.tailTucked && (s.earsBack || s.weightBack); },
          title: '두려움 신호일 수 있어요', text: '몸을 낮추고 꼬리를 말아 넣고 귀를 젖히거나 체중을 뒤로 빼는 조합은 무서워하는 모습으로 자주 보여요.' },
        { id: 'anxious', kind: 'concern', tone: 'stress', when: function (s) { return (s.earsBack || s.gazeAverted) && (s.tailLow || s.weightBack || s.headDown) && !(s.lowered && s.tailTucked); },
          title: '불안하거나 불편할 수 있어요', text: '귀를 젖히거나 시선을 피하면서 꼬리가 낮거나 몸을 뒤로 빼는 건 지금 상황이 부담스럽다는 신호일 수 있어요.' },
        { id: 'stress_signals', kind: 'concern', tone: 'stress', when: function (s) { return (s.lick || s.yawn || s.shake || s.sniff || s.paw) && (s.earsBack || s.gazeAverted || s.tailLow || s.stiff); },
          title: '스트레스 신호가 함께 보여요', text: '입술 핥기, 하품, 몸 털기, 갑작스런 냄새 맡기, 앞발 들기가 귀 젖히기, 시선 피하기, 낮은 꼬리와 함께 나오면 불편함을 달래려는 신호일 수 있어요.' },
        { id: 'tense_wag', kind: 'concern', tone: 'caution', when: function (s) { return (s.wagBroad || s.wagNarrow || s.wagging) && (s.stiff || s.stare); },
          title: '꼬리를 흔들어도 긴장했을 수 있어요', text: '몸이 굳거나 시선이 한곳에 고정된 채 흔드는 꼬리는 반가움보다 긴장이나 경계와 관련 있을 수 있어요.' },
        { id: 'alert', kind: 'concern', tone: 'caution', when: function (s) { return s.earsForward && (s.stiff || s.weightForward) && (s.stare || s.tailHigh); },
          title: '무언가에 집중하거나 경계하고 있어요', text: '귀를 세우고 체중을 앞으로 싣고 한곳을 바라보는 건 대상을 살피는 중이라는 뜻이에요. 궁금해서일 수도, 경계해서일 수도 있어요.' },
        { id: 'play', kind: 'positive', tone: 'positive', when: function (s) { return s.bowing && s.loose && (s.wagging || s.mouthSoft); },
          title: '놀자고 하는 것일 수 있어요', text: '앞을 낮추고 엉덩이를 드는 자세를 몸이 풀린 채로 한다면 놀이를 청하는 신호로 자주 보여요.' },
        { id: 'happy_arousal', kind: 'positive', tone: 'positive', when: function (s) { return s.wagBroad && s.loose && !s.stare; },
          title: '반갑거나 신난 상태일 수 있어요', text: '몸이 풀린 채로 꼬리를 넓게 흔든다면 반가움이나 즐거운 흥분일 수 있어요.' },
        { id: 'curious', kind: 'positive', tone: 'positive', when: function (s) { return s.headTilt && (s.earsForward || s.mouthSoft) && !s.stiff; },
          title: '궁금해하는 것일 수 있어요', text: '고개를 기울이고 귀를 기울이는 건 소리나 대상을 더 알아보려는 모습일 수 있어요.' },
        { id: 'belly_relaxed', kind: 'positive', tone: 'calm', when: function (s) { return s.onBack && s.loose && !s.earsBack && !s.tailTucked; },
          title: '편하게 배를 보이는 것일 수 있어요', text: '몸과 다리가 축 늘어진 채 배를 보인다면 편안하고, 쓰다듬어 달라는 뜻일 수 있어요.' },
        { id: 'relaxed', kind: 'positive', tone: 'calm', when: function (s) { return s.loose && (s.mouthSoft || !s.tailLow) && !s.earsBack && !s.stare && !s.lipCurl && !s.lowered && !s.freeze && !s.gazeAverted; },
          title: '편안한 상태일 수 있어요', text: '몸이 풀려 있고 귀, 꼬리, 시선에 특별한 긴장이 없다면 편안한 상태일 수 있어요.' },
    ];

    var ACTIONS = {
        warning: ['움직임을 멈추고 등을 보이지 말고 천천히 거리를 벌려 주세요.', '경고했다고 혼내지 마세요. 경고를 혼나면 다음엔 경고 없이 물 수 있어요.', '같은 상황에서 반복된다면 수의사나 반려견 행동 전문가와 상담해 주세요.'],
        fear: ['무서워하는 대상에서 멀어지게 해 주고, 숨을 곳을 막지 마세요.', '억지로 만지거나 끌어내지 마세요.'],
        stress: ['불편해하는 원인에서 거리를 벌리고 쉴 시간을 주세요.', '하던 일(만지기, 빗질 등)을 잠깐 멈춰 보세요.'],
        caution: ['무엇을 보고 있는지 확인하고, 긴장이 오르기 전에 조용히 주의를 돌리거나 거리를 벌려 주세요.'],
        positive: ['놀이나 교감을 이어가되, 중간중간 쉬는 시간을 넣어 주세요.'],
        calm: ['지금처럼 조용한 환경을 유지해 주세요.'],
        mixed: ['확실해질 때까지 다가가거나 만지지 말고, 조금 떨어져서 지켜봐 주세요.'],
        none: ['몸 전체와 주변 상황을 조금 더 지켜봐 주세요.'],
    };
    var TONE_ORDER = ['warning', 'fear', 'stress', 'caution', 'positive', 'calm'];

    // 결과: { tone, title, readings:[{id,title,text}], signals:[...], checks:[...], actions:[...], mixed }
    function interpret(p) {
        var s = signalsOf(p);
        var hits = RULES.filter(function (r) { return r.when(s); });
        var pos = hits.filter(function (r) { return r.kind === 'positive'; });
        var con = hits.filter(function (r) { return r.kind === 'concern'; });
        var signals = Object.keys(LABELS).filter(function (k) { return s[k]; }).map(function (k) { return LABELS[k]; });
        var checks = [];
        var out = { readings: hits.map(function (r) { return { id: r.id, title: r.title, text: r.text, kind: r.kind }; }), signals: signals, mixed: false };

        if (pos.length && con.length) {
            // 서로 다른 방향의 신호가 함께 있으면 단정하지 않는다
            out.mixed = true;
            out.tone = 'mixed';
            out.title = '신호가 섞여 있어요';
            checks.push('편안해 보이는 신호와 긴장한 신호가 함께 있어요. 한 가지 결론을 내리기보다 몇 초 동안 몸이 어느 쪽으로 바뀌는지 지켜봐 주세요.');
            checks.push('몸이 점점 굳는지, 아니면 풀리는지 보세요.');
            checks.push('지금 무엇이 가까이 있는지(사람, 다른 강아지, 음식, 장난감) 확인해 보세요.');
            out.actions = ACTIONS.mixed.concat(ACTIONS[con[0].tone] || []);
        } else if (hits.length) {
            var top = hits.slice().sort(function (a, b) { return TONE_ORDER.indexOf(a.tone) - TONE_ORDER.indexOf(b.tone); })[0];
            out.tone = top.tone;
            out.title = top.title;
            out.actions = ACTIONS[top.tone];
        } else {
            out.tone = 'none';
            out.title = '뚜렷한 신호가 적어요';
            out.actions = ACTIONS.none;
        }
        // 공통 확인 항목
        if ((s.lick || s.yawn) && !hits.some(function (r) { return r.id === 'stress_signals'; })) {
            checks.push('입술 핥기와 하품은 먹은 뒤나 졸릴 때도 나와요. 다른 신호와 상황을 함께 봐야 해요.');
        }
        if (s.shake && !hits.some(function (r) { return r.id === 'stress_signals'; })) checks.push('몸 털기는 젖었을 때도 해요. 젖지 않았는데 무슨 일 뒤에 턴다면 긴장을 털어 내는 것일 수 있어요.');
        if (s.sniff && !hits.some(function (r) { return r.id === 'stress_signals'; })) checks.push('냄새 맡기는 대부분 자연스러운 탐색이에요. 무언가와 마주친 직후에 갑자기 나오는지 보세요.');
        if (s.onBack) checks.push('배를 보일 땐 몸이 말랑한지, 굳었는지부터 보세요. 굳어 있다면 만지지 말아 주세요.');
        if (s.bowl && !hits.some(function (r) { return r.id === 'guarding'; })) checks.push('먹고 있을 땐 다가가지 않는 게 서로 편해요.');
        if (s.wagging && !s.stiff && !s.stare && !s.wagBroad) checks.push('꼬리 흔들기만으로는 기분을 알기 어려워요. 몸이 풀렸는지, 시선이 부드러운지 함께 보세요.');
        if (s.tailHigh || s.tailLow) checks.push('꼬리 높이는 견종마다 평소 위치가 달라요. 우리 강아지의 평소 꼬리 위치와 비교해 보세요.');
        checks.push('갑자기 행동이 바뀌었거나 아파 보인다면 동물병원 진료를 먼저 받아 주세요.');
        out.checks = checks;
        return out;
    }

    var api = { signalsOf: signalsOf, interpret: interpret, RULES: RULES, LABELS: LABELS };
    if (NODE) module.exports = api;
    else root.MungSignalRules = api;
})(this);
