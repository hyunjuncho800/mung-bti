// 멍루틴: 기질검사 유형(1~4)별 7일 활동, 진행 기록(브라우저 저장), 화면.
// 유형 번호는 script.js와 같은 기준(탐험성·안전성 3.5)으로 저장된 mung_dog.type을 그대로 쓴다.
// 브라우저에서는 /routine/ 페이지가, Node에서는 build_site.js와 테스트가 불러 쓴다.
(function () {
    var ACTIVITIES = {
        sniff_cups: {
            name: '컵 세 개 간식 찾기', min: 5,
            purpose: '코를 쓰는 놀이는 몸을 크게 움직이지 않아도 머리를 많이 써요. 스스로 찾아냈다는 경험도 쌓여요.',
            gear: ['종이컵이나 플라스틱 컵 3개', '작은 간식 몇 알'],
            steps: ['강아지가 보는 앞에서 컵 하나 밑에 간식을 넣어요.', '"찾아" 하고 기다려요. 코나 발로 컵을 건드리면 컵을 들어 간식을 먹게 해요.', '쉬워하면 컵을 섞어 보고, 어려워하면 컵 하나로 돌아가요.', '다섯 번 정도 하고 끝내요.'],
            caution: ['컵을 물어서 씹으면 종이컵 대신 단단한 그릇을 써요.'],
            next: '간식을 수건 사이나 상자 안에 숨겨서 조금 더 어렵게 해 보세요.',
        },
        towel_roll: {
            name: '수건 말아 간식 숨기기', min: 5,
            purpose: '돌돌 만 수건을 풀면서 간식을 찾는 놀이예요. 코와 발을 같이 써서 짧은 시간에도 만족감이 커요.',
            gear: ['큰 수건 1장', '작은 간식 5~6알'],
            steps: ['수건을 펼치고 간식을 군데군데 올려요.', '수건을 느슨하게 돌돌 말아요.', '"찾아" 하고 내려놓고, 다 풀 때까지 지켜봐요.', '처음엔 반만 말아서 쉽게 시작해요.'],
            caution: ['수건을 뜯어 삼키지 않는지 옆에서 지켜봐요.'],
            next: '말아 둔 수건을 매듭처럼 한 번 묶어서 난이도를 올려 보세요.',
        },
        scatter: {
            name: '바닥에 뿌린 간식 찾기', min: 5,
            purpose: '고개를 숙이고 냄새를 맡는 동작은 들뜬 마음을 가라앉히는 데 도움이 돼요.',
            gear: ['러그나 매트', '작은 간식 10알 정도'],
            steps: ['러그나 매트 위에 간식을 넓게 흩뿌려요.', '"찾아" 하고 놓아 줘요.', '다 찾을 때까지 말을 걸지 않고 지켜봐요.', '흥분이 큰 날은 산책 전이나 손님이 오기 전에 해 보세요.'],
            caution: ['다른 반려동물이 있으면 따로 해서 다툼이 없게 해요.'],
            next: '잔디밭처럼 냄새가 많은 곳에서 해 보세요.',
        },
        mat_settle: {
            name: '매트에서 쉬기', min: 10,
            purpose: '정해진 자리에서 스스로 차분해지는 연습이에요. 신나는 일이 많은 강아지에게도, 불안한 강아지에게도 쉴 곳이 생겨요.',
            gear: ['매트나 접은 수건', '작은 간식'],
            steps: ['매트를 바닥에 두고, 강아지가 매트에 발을 올리면 매트 위에 간식을 놓아요.', '앉거나 엎드리면 간식을 조금 더 자주 놓아요.', '보호자는 옆에 앉아 책이나 휴대폰을 봐요. 조용히 있으면 가끔 간식을 놓아요.', '매트를 떠나도 부르지 않고 그대로 둬요. 다시 오면 또 간식이 생겨요.'],
            caution: ['억지로 눕히거나 매트에 붙잡아 두지 않아요.'],
            next: '초인종이 울리거나 손님이 올 때 매트로 가는 연습으로 이어 보세요.',
        },
        wait_door: {
            name: '문 앞에서 잠깐 기다리기', min: 5,
            purpose: '신나는 순간에 한 번 멈추는 연습이에요. 문이 열리는 건 차분할 때라는 걸 알려 줘요.',
            gear: ['산책 줄'],
            steps: ['산책 줄을 채운 뒤 문고리를 잡아요.', '앞으로 튀어 나가려 하면 손을 떼고 기다려요.', '네 발이 바닥에 있고 잠깐 조용해지면 문을 조금 열어요.', '열자마자 뛰어나가려 하면 다시 닫고 처음부터 해요. 차분하게 나가면 그대로 산책을 시작해요.'],
            caution: ['문을 닫을 때 발이나 꼬리가 끼지 않게 천천히 움직여요.'],
            next: '차 문, 엘리베이터 문 앞에서도 같은 방식으로 해 보세요.',
        },
        name_game: {
            name: '이름 부르면 오기 게임', min: 5,
            purpose: '이름을 들으면 보호자에게 오는 게 즐거운 일이 되게 해요. 밖에서 급할 때 큰 도움이 돼요.',
            gear: ['좋아하는 간식'],
            steps: ['가까이에서 이름을 부르고, 쳐다보면 바로 간식을 줘요.', '한두 걸음 떨어져서 부르고, 오면 간식과 칭찬을 줘요.', '거리를 조금씩 늘리고, 다른 방에서도 불러 봐요.', '열 번이 넘지 않게 하고, 잘 될 때 끝내요.'],
            caution: ['혼낼 때는 이름을 부르지 않아요. 이름이 나쁜 신호가 되지 않게요.'],
            next: '산책 중 사람이 적은 곳에서 긴 줄을 쓰고 해 보세요.',
        },
        hand_target: {
            name: '손바닥에 코 대기', min: 5,
            purpose: '손바닥에 코를 대면 좋은 일이 생기는 간단한 놀이예요. 낯선 상황에서 할 일을 주는 신호로 쓸 수 있어요.',
            gear: ['작은 간식'],
            steps: ['손바닥을 강아지 코 앞 10cm쯤에 내밀어요.', '코가 손에 닿으면 "옳지" 하고 다른 손으로 간식을 줘요.', '손 위치를 옆, 아래로 조금씩 바꿔요.', '잘하면 손을 내밀 때 "터치"라고 말을 붙여요.'],
            caution: ['손을 얼굴 쪽으로 들이밀지 않고, 강아지가 다가오게 해요.'],
            next: '낯선 물건 바로 옆에 손바닥을 대고 터치하게 해 보세요.',
        },
        box_explore: {
            name: '상자 탐험', min: 10,
            purpose: '처음 보는 걸 스스로 알아보는 작은 성공을 쌓는 놀이예요.',
            gear: ['테이프와 스테이플러를 뗀 종이상자', '작은 간식'],
            steps: ['상자를 눕혀 두고 근처에 간식 몇 알을 놓아요.', '스스로 다가가면 상자 입구 쪽에 간식을 놓아요.', '들어가든 안 들어가든 그대로 둬요. 보호자가 밀어 넣지 않아요.', '익숙해지면 상자 안에 구긴 종이와 간식을 같이 넣어요.'],
            caution: ['겁을 내면 상자를 더 멀리 두고 간식만 줘요.'],
            next: '상자 두세 개를 이어 터널처럼 만들어 보세요.',
        },
        new_object: {
            name: '낯선 물건 천천히 알아보기', min: 5,
            purpose: '새 물건을 스스로 확인하고 괜찮다고 느끼는 경험이에요. 억지로 가까이 가지 않아도 된다는 것도 함께 배워요.',
            gear: ['집에 있는 낯선 물건 하나(접은 우산, 빈 장바구니, 냄비 등)', '작은 간식'],
            steps: ['쉬는 자리에서 먼 곳에 물건을 둬요.', '물건을 쳐다보기만 해도 간식을 줘요.', '스스로 다가가 냄새를 맡으면 간식을 줘요.', '물건을 들이밀거나 강아지를 끌고 가지 않아요.'],
            caution: ['우산을 펼치는 것처럼 갑자기 움직이거나 소리 나게 하지 않아요.'],
            next: '물건 위치를 바꾸거나 조금 더 큰 물건으로 해 보세요.',
        },
        sound_low: {
            name: '작은 소리와 간식 짝짓기', min: 5,
            purpose: '청소기, 초인종처럼 놀라는 소리를 아주 작게 듣고 좋은 일과 연결하는 연습이에요.',
            gear: ['휴대폰(생활 소리 영상)', '작은 간식'],
            steps: ['겨우 들릴 만큼 작은 볼륨으로 소리를 1~2초 틀어요.', '소리가 나면 간식을 주고, 소리가 멈추면 간식도 멈춰요.', '열 번 정도 하고 끝내요.', '며칠 동안 편안해 보이면 그다음 날 볼륨을 아주 조금 올려요.'],
            caution: ['귀를 젖히거나 자리를 피하면 볼륨을 낮춰요. 아무 반응 없는 볼륨에서 끝내는 게 좋아요.'],
            next: '다른 방에서 소리를 틀어 거리를 바꿔 보세요.',
        },
        sniff_walk: {
            name: '냄새 산책 10분', min: 10,
            purpose: '걷는 거리보다 냄새 맡는 시간이 목표인 산책이에요. 강아지가 고르게 해 주면 짧아도 만족해요.',
            gear: ['산책 줄(2~3m면 더 편해요)', '배변 봉투'],
            steps: ['사람과 강아지가 적은 시간과 길을 골라요.', '안전한 범위에서 강아지가 방향을 고르게 해 줘요.', '오래 냄새를 맡아도 기다려 줘요.', '줄은 느슨하게 잡고, 10분이 되면 천천히 돌아와요.'],
            caution: ['더운 날은 손등을 바닥에 5초 대 봐서 뜨거우면 나가지 않아요.', '바닥의 음식이나 쓰레기를 먹지 않는지 살펴봐요.'],
            next: '처음 가 보는 조용한 길에서 해 보세요.',
        },
        loose_leash: {
            name: '느슨한 줄로 몇 걸음', min: 5,
            purpose: '줄이 느슨할 때 앞으로 갈 수 있다는 걸 알려 줘요. 밖보다 자극이 적은 집 안에서 먼저 연습해요.',
            gear: ['산책 줄', '작은 간식'],
            steps: ['집 안에서 줄을 채우고 나란히 서요.', '줄이 느슨한 채로 한 걸음 걸으면 다리 옆에서 간식을 줘요.', '줄이 팽팽해지면 멈춰서 기다리고, 느슨해지면 다시 걸어요.', '다섯 걸음에 성공하면 끝내요.'],
            caution: ['줄을 잡아채거나 당기지 않아요.'],
            next: '집 앞 조용한 골목에서 똑같이 해 보세요.',
        },
        tug_pause: {
            name: '터그 놀이와 잠깐 쉬기', min: 5,
            purpose: '신나게 놀다가도 멈출 수 있게 하는 놀이예요. 놀이가 끝나지 않는다는 걸 알면 더 쉽게 멈춰요.',
            gear: ['터그 장난감'],
            steps: ['터그 장난감으로 10초 정도 놀아요.', '장난감을 몸에 붙이고 가만히 있어요.', '강아지가 놓으면 "옳지" 하고 바로 다시 놀아요.', '놀이와 쉬기를 다섯 번쯤 반복하고 장난감을 치워요.'],
            caution: ['이빨이 손에 닿으면 바로 놀이를 멈춰요.', '어린 강아지는 이가 빠지는 시기라 세게 당기지 않아요.'],
            next: '쉬는 동안 "앉아"를 하면 놀이를 다시 시작해 보세요.',
        },
        body_touch: {
            name: '몸 만지기 연습', min: 5,
            purpose: '발, 귀를 만지는 걸 편하게 여기게 해서 병원과 미용을 덜 힘들게 해요.',
            gear: ['작은 간식'],
            steps: ['어깨처럼 좋아하는 곳을 1초 만지고 간식을 줘요.', '다리 위쪽, 발등 순서로 아주 조금씩 옮겨 가요.', '몸을 빼면 그 전 단계로 돌아가요.', '하루에 한 부위만 해요.'],
            caution: ['몸을 빼는 건 "그만"이라는 뜻이에요. 붙잡지 않아요.', '만지면 아파하는 곳이 있으면 연습 대신 진료를 받아요.'],
            next: '발톱깎이를 옆에 두고 발 만지기를 해 보세요. 깎지는 않아요.',
        },
        lazy_trail: {
            name: '간식 길 따라가기', min: 5,
            purpose: '쉬는 걸 좋아하는 강아지가 부담 없이 몇 걸음 더 움직이게 해요.',
            gear: ['작은 간식 6알', '좋아하는 장난감'],
            steps: ['쉬는 자리에서 거실 쪽으로 1m 간격으로 간식을 놓아요.', '마지막 자리에 좋아하는 장난감이나 간식 두 알을 둬요.', '스스로 따라오면 칭찬해요. 안 오면 첫 간식을 더 가까이 둬요.', '두세 번 하고 끝내요.'],
            caution: ['억지로 일으키지 않아요. 자는 중이면 깬 다음에 해요.'],
            next: '간식 길을 계단 없는 다른 방까지 늘려 보세요.',
        },
    };

    var PLANS = {
        1: {
            goal: '궁금한 건 스스로 알아보고, 무서우면 쉬어 갈 수 있게',
            why: '호기심은 많은데 낯선 게 갑자기 다가오면 덜컥 겁을 내는 유형이에요. 스스로 다가가서 확인하는 놀이를 하고, 겁날 때 할 일(손바닥 터치)을 하나 만들어 줘요.',
            days: [['sniff_cups', 'hand_target'], ['box_explore'], ['hand_target', 'new_object'], ['sniff_walk'], ['sound_low', 'sniff_cups'], ['new_object', 'mat_settle'], ['sniff_walk', 'hand_target']],
        },
        2: {
            goal: '신나는 건 그대로, 멈추는 법은 하나 더',
            why: '겁이 없고 에너지가 넘치는 유형이에요. 뛰게 해서 지치게 하기보다는 냄새 맡기와 쉬기 연습으로 스스로 흥분을 가라앉히는 경험을 늘려요.',
            days: [['scatter', 'mat_settle'], ['wait_door', 'sniff_walk'], ['tug_pause'], ['name_game', 'scatter'], ['loose_leash', 'mat_settle'], ['tug_pause', 'wait_door'], ['sniff_walk', 'name_game']],
        },
        3: {
            goal: '예측할 수 있는 하루와 작은 성공',
            why: '낯선 자극을 만나면 피하는 쪽이 먼저인 유형이에요. 안전한 자리를 만들고, 아주 작은 단계로 새로운 걸 경험하게 해요. 성공하는 단계에서 끝내는 게 중요해요.',
            days: [['mat_settle'], ['hand_target', 'sniff_cups'], ['scatter'], ['sound_low'], ['new_object', 'hand_target'], ['box_explore'], ['sound_low', 'mat_settle']],
        },
        4: {
            goal: '짧고 가볍게, 조금 더 움직이게',
            why: '느긋하고 쉬는 걸 좋아하는 유형이에요. 무리하게 뛰게 하기보다 냄새 놀이와 짧은 산책으로 움직이는 재미를 조금씩 늘려요.',
            days: [['lazy_trail'], ['sniff_cups'], ['sniff_walk'], ['lazy_trail', 'body_touch'], ['towel_roll'], ['sniff_walk', 'sniff_cups'], ['towel_roll', 'body_touch']],
        },
    };
    var TYPE_NAMES = { 1: '이중인격 브레이크형', 2: '폭주 호기심형', 3: '소심형 철학자', 4: '무소유 집돌이형' };

    var STOP = ['하품, 입술 핥기, 고개 돌리기를 여러 번 해요', '꼬리를 내리거나 몸을 낮추고 피해요', '좋아하던 간식을 먹지 않아요', '헐떡임이 심해지거나 몸을 떨어요', '흥분해서 손이나 옷을 물어요'];

    // ---------------------------------------------------------------- 기록 (순수 함수, 테스트 대상)
    var KEY = 'mung_routine';
    function ymd(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    // 시작일을 1일차로 셈. 날짜가 바뀔 때마다 하루씩 늘어남 (시간대 영향 없도록 날짜만 비교)
    function dayNumber(start, today) {
        var a = start.split('-').map(Number), b = today.split('-').map(Number);
        var diff = Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
        return Math.max(1, diff + 1);
    }
    function newState(type, today) { return { v: 1, type: type, start: today, done: {}, note: null }; }
    // 저장값이 깨졌거나 다른 형식이면 버림
    function parse(raw) {
        try {
            var s = JSON.parse(raw);
            if (!s || s.v !== 1 || !PLANS[s.type] || !/^\d{4}-\d{2}-\d{2}$/.test(s.start) || typeof s.done !== 'object' || !s.done) return null;
            Object.keys(s.done).forEach(function (d) { if (!(d >= 1 && d <= 7)) delete s.done[d]; });
            return s;
        } catch (e) { return null; }
    }
    function progress(state, today) {
        var remaining = [];
        for (var d = 1; d <= 7; d++) if (!state.done[d]) remaining.push(d);
        var dn = dayNumber(state.start, today);
        return { done: 7 - remaining.length, remaining: remaining, finished: remaining.length === 0, today: Math.min(dn, 7), overdue: dn > 7 && remaining.length > 0, next: remaining[0] || null };
    }
    function toggleDay(state, day, today) {
        var s = JSON.parse(JSON.stringify(state));
        if (s.done[day]) delete s.done[day]; else s.done[day] = today;
        return s;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ACTIVITIES: ACTIVITIES, PLANS: PLANS, TYPE_NAMES: TYPE_NAMES, STOP: STOP, dayNumber: dayNumber, newState: newState, parse: parse, progress: progress, toggleDay: toggleDay };
        return;
    }

    // ---------------------------------------------------------------- 화면
    function h(tag, attrs, kids) {
        var el = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            if (k === 'text') el.textContent = attrs[k];
            else if (k === 'on') el.addEventListener('click', attrs[k]);
            else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
        });
        (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
        return el;
    }
    function list(items, tag) { return h(tag || 'ul', {}, items.map(function (t) { return h('li', { text: t }); })); }

    var storageOk = (function () { try { localStorage.setItem('mung_t', '1'); localStorage.removeItem('mung_t'); return true; } catch (e) { return false; } })();
    function load() { try { return parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
    function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
    function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }
    function myDog() {
        try { var d = JSON.parse(localStorage.getItem('mung_dog') || 'null'); return d && PLANS[d.type] ? d : null; } catch (e) { return null; }
    }

    function activityCard(id) {
        var a = ACTIVITIES[id];
        return h('section', { class: 'routine-act' }, [
            h('h4', {}, [a.name, h('span', { class: 'routine-min', text: a.min + '분' })]),
            h('p', { text: a.purpose }),
            h('p', { class: 'routine-label', text: '준비물' }), list(a.gear),
            h('p', { class: 'routine-label', text: '이렇게 해요' }), list(a.steps, 'ol'),
            h('p', { class: 'routine-label', text: '조심할 점' }), list(a.caution),
        ]);
    }

    function track(name, params) { if (window.mungTrack) window.mungTrack(name, params); }
    function begin(type, day) { save(newState(type, day)); track('routine_start', { type: type }); }

    function start(app) {
        var panel = app.querySelector('[data-panel]');
        var today = ymd(new Date());

        function render() {
            var state = load(), dog = myDog();
            var kids = [];
            if (!storageOk) kids.push(h('p', { class: 'callout callout-danger', text: '이 브라우저에서는 기록을 저장할 수 없어요. 시크릿 모드라면 일반 창에서 열어 주세요. 활동 내용은 그대로 볼 수 있어요.' }));
            if (!state) {
                if (!dog) {
                    kids.push(h('p', { class: 'check-eyebrow', text: '아직 기질검사 결과가 없어요' }));
                    kids.push(h('h2', { class: 'check-q', text: '먼저 우리 강아지 기질을 알아봐 주세요' }));
                    kids.push(h('p', { text: '멍루틴은 기질검사에서 나온 유형에 맞춰 7일 활동을 골라 드려요. 검사는 20문항, 3분 정도 걸리고 결과는 이 브라우저에만 저장돼요.' }));
                    kids.push(h('a', { class: 'btn', href: '/?start=true', text: '우리 강아지 기질 알아보기' }));
                } else {
                    var plan = PLANS[dog.type];
                    kids.push(h('p', { class: 'check-eyebrow', text: (dog.name || '우리 강아지') + ' · ' + (dog.typeName || TYPE_NAMES[dog.type]) }));
                    kids.push(h('h2', { class: 'check-q', text: plan.goal }));
                    kids.push(h('p', { text: plan.why }));
                    kids.push(h('ol', { class: 'routine-preview' }, plan.days.map(function (ids, i) {
                        return h('li', {}, [h('b', { text: (i + 1) + '일차 ' }), ids.map(function (id) { return ACTIVITIES[id].name; }).join(', ')]);
                    })));
                    kids.push(h('p', { class: 'check-note', text: '하루 5~10분이면 돼요. 기록은 이 브라우저에만 저장되고, 방문 기록을 지우거나 다른 기기에서 열면 보이지 않아요.' }));
                    kids.push(h('button', { type: 'button', class: 'btn', text: '오늘부터 7일 시작하기', disabled: !storageOk, on: function () { begin(dog.type, today); render(); } }));
                }
                return panel.replaceChildren.apply(panel, kids);
            }

            var p = progress(state, today), planNow = PLANS[state.type];
            kids.push(h('p', { class: 'check-eyebrow', text: (dog && dog.type === state.type && dog.name ? dog.name + ' · ' : '') + TYPE_NAMES[state.type] + ' 7일 루틴' }));
            kids.push(h('h2', { class: 'check-q', text: p.finished ? '7일 루틴을 모두 마쳤어요' : p.done + '일 완료, ' + (7 - p.done) + '일 남았어요' }));
            kids.push(h('div', { class: 'check-progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '7', 'aria-valuenow': String(p.done), 'aria-label': '루틴 진행률' }, [h('i', { style: 'width:' + Math.round(p.done / 7 * 100) + '%' })]));
            if (!p.finished) {
                kids.push(h('p', { class: 'check-note', text: (p.overdue ? '시작한 지 7일이 지났어요. 남은 날은 천천히 이어서 해도 괜찮아요. ' : '오늘은 ' + p.today + '일차예요. ') + '남은 일정: ' + p.remaining.map(function (d) { return d + '일차'; }).join(', ') }));
            }
            if (dog && dog.type !== state.type) {
                kids.push(h('div', { class: 'callout callout-note' }, [
                    h('p', { text: '기질검사 결과가 바뀌었어요(지금 결과: ' + (dog.typeName || TYPE_NAMES[dog.type]) + '). 새 결과에 맞춘 루틴으로 다시 시작할 수 있어요.' }),
                    h('button', { type: 'button', class: 'btn btn-ghost', text: '새 결과로 다시 시작', on: function () { begin(dog.type, today); render(); } }),
                ]));
            }

            kids.push(h('div', { class: 'routine-days' }, planNow.days.map(function (ids, i) {
                var day = i + 1, done = !!state.done[day];
                return h('details', { class: 'routine-day' + (done ? ' is-done' : ''), open: day === p.next }, [
                    h('summary', {}, [h('span', { class: 'routine-dot', 'aria-hidden': 'true', text: done ? '✓' : String(day) }), h('b', { text: day + '일차' }), h('span', { text: ids.map(function (id) { return ACTIVITIES[id].name; }).join(', ') }), h('span', { class: 'sr-only', text: done ? ' (완료)' : '' })]),
                    h('div', { class: 'routine-body' }, ids.map(activityCard).concat([
                        h('button', { type: 'button', class: done ? 'btn btn-ghost' : 'btn', 'aria-pressed': String(done), text: done ? day + '일차 완료 취소' : day + '일차 활동을 마쳤어요', on: function () {
                            save(toggleDay(state, day, today));
                            if (!done) track('routine_day_complete', { type: state.type, day: day, days_since_start: dayNumber(state.start, today) - 1 });
                            render();
                        } }),
                    ])),
                ]);
            })));

            if (p.finished) kids.push(finishBlock(state));
            kids.push(h('div', { class: 'check-actions' }, [
                h('button', { type: 'button', class: 'text-link', text: '기록 지우고 처음으로', on: function () { if (confirm('7일 루틴 기록을 지울까요? 지운 기록은 되돌릴 수 없어요.')) { clear(); render(); } } }),
            ]));
            panel.replaceChildren.apply(panel, kids);
        }

        // 7일 완료 후: 간단한 관찰 기록과 다음 활동 안내
        function finishBlock(state) {
            var ids = [];
            PLANS[state.type].days.forEach(function (d) { d.forEach(function (id) { if (ids.indexOf(id) === -1) ids.push(id); }); });
            var opts = function (first) { return [h('option', { value: '', text: first })].concat(ids.map(function (id) { return h('option', { value: id, text: ACTIVITIES[id].name }); })); };
            var note = state.note;
            if (note) {
                var tips = [];
                if (note.fav) tips.push(ACTIVITIES[note.fav].name + ' 다음 단계: ' + ACTIVITIES[note.fav].next);
                if (note.hard) tips.push(ACTIVITIES[note.hard].name + ': 첫 단계로 돌아가 한 주 더 천천히 해 보세요. 성공하는 단계에서 끝내는 게 좋아요.');
                tips.push('잘 맞은 활동 두세 개를 골라 평소 하루 일과에 넣어 보세요.');
                return h('section', { class: 'routine-finish' }, [
                    h('h3', { text: '다음에 해 볼 것' }), list(tips),
                    note.memo ? h('p', { class: 'check-note', text: '내 관찰 메모: ' + note.memo }) : null,
                    h('div', { class: 'check-actions' }, [
                        h('button', { type: 'button', class: 'btn', text: '7일 다시 시작하기', on: function () { var d = myDog(); begin(d ? d.type : state.type, ymd(new Date())); render(); } }),
                        h('a', { class: 'btn btn-ghost', href: '/check/', text: '행동 고민 체크' }),
                    ]),
                ]);
            }
            var fav = h('select', { id: 'r-fav' }, opts('고르지 않음'));
            var hard = h('select', { id: 'r-hard' }, opts('없었어요'));
            var memo = h('textarea', { id: 'r-memo', maxlength: '200', rows: '3', placeholder: '예: 3일차부터 컵 찾기를 먼저 하자고 졸랐어요' });
            return h('section', { class: 'routine-finish' }, [
                h('h3', { text: '7일 동안 어땠나요?' }),
                h('p', { class: 'check-note', text: '이 기록은 이 브라우저에만 저장돼요. 강아지 이름이나 개인정보는 적지 않아도 돼요.' }),
                h('label', { for: 'r-fav', text: '가장 즐거워한 활동' }), fav,
                h('label', { for: 'r-hard', text: '힘들어한 활동' }), hard,
                h('label', { for: 'r-memo', text: '관찰 메모 (선택, 200자)' }), memo,
                h('button', { type: 'button', class: 'btn', text: '기록하고 다음 활동 보기', on: function () {
                    var s = load() || state;
                    s.note = { fav: fav.value || null, hard: hard.value || null, memo: memo.value.trim().slice(0, 200) };
                    save(s); render();
                } }),
            ]);
        }

        render();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var app = document.querySelector('[data-routine]');
        if (app) start(app);
    });
})();
