// 멍궁합: 보호자와 우리 강아지(생활 궁합), 친구 강아지와(성향 궁합). 재미로 보는 비교이고 적합성 검사가 아니다.
// 비교는 기질검사가 실제로 재는 축에서만 하고, 검사에 없는 보호자 생활 정보는 비교하지 않고 따로 보여 준다.
// 궁합 백분율은 만들지 않는다. 같은 입력이면 언제나 같은 결과.
(function (root) {
    var NODE = typeof module !== 'undefined' && module.exports;
    var P = NODE ? require('./mung-profile.js') : root.MungProfile;
    var LV = { h: 3, m: 2, l: 1 };

    // ---------------------------------------------------------------- 보호자 생활 문답 (7개)
    // axis가 있는 문항만 강아지 점수와 비교한다. activity, outdoor는 검사에 대응하는 축이 없어 비교하지 않는다.
    var OWNER_Q = [
        { id: 'activity', axis: null, q: '평소 하루에 몸을 움직이는 시간은 어느 정도인가요?', o: ['30분이 안 돼요', '30분에서 1시간', '1시간이 넘어요'], show: ['평소 활동량', ['30분 미만', '30분~1시간', '1시간 이상']] },
        { id: 'outdoor', axis: null, q: '쉬는 날에는 주로 어떻게 보내나요?', o: ['집에서 쉬어요', '반반이에요', '밖으로 나가요'], show: ['쉬는 날', ['집에서 쉬는 편', '반반', '밖으로 나가는 편']] },
        { id: 'novelty', axis: 'e', q: '처음 가 보는 곳이나 새로운 걸 해 보는 건 어때요?', o: ['익숙한 게 좋아요', '가끔은 좋아요', '새로운 게 좋아요'] },
        { id: 'close', axis: 'm', q: '강아지와 쉬는 시간은 어떻게 보내고 싶나요?', o: ['각자 편하게 쉬어요', '가끔 놀아 주고 쉬어요', '붙어서 말 걸고 쓰다듬어요'] },
        { id: 'social', axis: 'o', q: '사람이 많은 곳이나 모임은 어때요?', o: ['조용한 게 좋아요', '가끔은 괜찮아요', '좋아해요'] },
        { id: 'change', axis: 'x', q: '여행, 이사처럼 생활이 바뀌는 건 어때요?', o: ['정해진 일상이 좋아요', '크게 상관없어요', '자주 바뀌어도 괜찮아요'] },
        { id: 'alone', axis: 'i', special: true, q: '평일에 강아지가 혼자 있는 시간은 어느 정도인가요?', o: ['거의 없어요', '4시간 이하', '4시간이 넘어요'] },
    ];
    var A2B = ['l', 'm', 'h'];

    var OWNER_TEXT = {
        e: { hh: '둘 다 새로운 걸 해 보는 걸 좋아해요', ll: '둘 다 익숙한 것이 편해요', hl: '보호자는 새로운 걸 좋아하지만, 강아지는 처음 보는 건 천천히 살펴보는 편이에요', lh: '강아지는 새로운 걸 먼저 알아보고 싶어 하는 편이에요' },
        m: { hh: '둘 다 붙어서 교감하는 시간을 좋아해요', ll: '둘 다 각자의 시간을 편하게 여겨요', hl: '보호자는 붙어 있고 싶지만, 강아지는 애정 표현이 담백한 편이에요', lh: '강아지는 보호자의 목소리와 손길에 크게 반응하는 편이에요' },
        o: { hh: '둘 다 새로운 만남을 비교적 편하게 받아들여요', ll: '둘 다 조용하고 익숙한 만남이 편해요', hl: '보호자는 모임을 좋아하지만, 강아지는 친해지는 데 시간이 필요한 편이에요', lh: '강아지는 다른 강아지와의 인사를 비교적 부드럽게 하는 편이에요' },
        x: { hh: '둘 다 생활이 바뀌어도 금방 적응해요', ll: '둘 다 정해진 일상이 편해요', hl: '보호자는 변화가 괜찮지만, 강아지는 적응할 시간이 필요한 편이에요', lh: '강아지는 환경이 바뀌어도 비교적 빨리 적응하는 편이에요' },
    };
    var OWNER_TIP = {
        e: { hl: '새로운 곳은 짧게 머물고, 강아지가 먼저 다가갈 때까지 기다려 주세요.', lh: '산책 코스를 가끔 바꾸거나 상자 속 간식 찾기로 궁금증을 채워 주세요.' },
        m: { hl: '쓰다듬기는 강아지가 먼저 다가올 때 짧게 해 주세요.', lh: '하루 몇 분이라도 이름을 부르고 눈을 맞추는 시간을 만들어 주세요.' },
        o: { hl: '모임에 데려갈 땐 조용히 쉴 수 있는 자리를 먼저 챙겨 주세요.', lh: '잘 맞는 강아지 친구를 한두 마리 만들어 주면 좋아해요.' },
        x: { hl: '여행이나 이사 땐 익숙한 담요나 장난감을 꼭 챙겨 주세요.', lh: '' },
    };

    // answers: { 문항id: 0~2 }, dogScores: 기질검사 7개 축 점수
    function compareOwner(answers, dogScores) {
        var db = P.bandsOf(dogScores), similar = [], different = [], tips = [], pairs = {};
        OWNER_Q.forEach(function (q) {
            if (!q.axis || q.special || answers[q.id] == null) return;
            var ob = A2B[answers[q.id]], d = db[q.axis];
            var diff = Math.abs(LV[ob] - LV[d]);
            if (diff === 0 && ob !== 'm') { similar.push(OWNER_TEXT[q.axis][ob + d]); pairs[q.axis] = ob + d; }
            else if (diff === 2) { different.push(OWNER_TEXT[q.axis][ob + d]); pairs[q.axis] = ob + d; if (OWNER_TIP[q.axis][ob + d]) tips.push(OWNER_TIP[q.axis][ob + d]); }
            // 한 단계 차이, 둘 다 보통은 말하지 않는다 (근거가 약함)
        });
        // 혼자 있는 시간 x 독립성
        var al = answers.alone;
        if (al === 2 && db.i === 'l') { different.push('혼자 있는 시간이 긴 편인데, 강아지는 보호자 곁을 편하게 여기는 편이에요'); tips.push('혼자 있는 시간을 조금씩 늘리는 연습과 노즈워크 장난감을 함께 써 보세요.'); pairs.i = 'long_l'; }
        else if (al === 2 && db.i === 'h') { similar.push('혼자 있는 시간이 있어도 강아지가 비교적 차분하게 쉬는 편이에요'); pairs.i = 'long_h'; }
        else if (al === 0 && db.i === 'l') { similar.push('보호자가 곁에 있는 시간이 많고, 강아지도 보호자 곁을 편하게 여겨요'); pairs.i = 'none_l'; }
        // 검사에 없는 생활 정보는 따로
        var info = OWNER_Q.filter(function (q) { return !q.axis && answers[q.id] != null; }).map(function (q) { return q.show[0] + ': ' + q.show[1][answers[q.id]]; });
        // 함께 할 활동
        var acts = [];
        if (pairs.e === 'hh') acts.push('처음 가 보는 산책길 함께 걷기');
        if (pairs.m === 'hh') acts.push('이름 부르기 게임, 칭찬하며 하는 짧은 훈련');
        if (pairs.o === 'hh' && db.s !== 'h') acts.push('잘 맞는 강아지 친구와 함께 걷기');
        if (pairs.e === 'll' || pairs.x === 'll' || (answers.outdoor === 0 && db.e === 'l')) acts.push('익숙한 길에서 느긋하게 냄새 산책');
        if (db.f === 'h') acts.push('간식을 숨긴 노즈워크 놀이');
        if (acts.length < 2) acts.push('하루 10분 냄새 맡는 산책');
        var nk = pairs.e === 'hh' ? 'explore'
            : (pairs.e === 'll' || pairs.x === 'll' || (answers.activity === 0 && db.e === 'l')) ? 'calm'
            : (pairs.o === 'hh' || pairs.m === 'hh') ? 'energy' : 'care';
        return { mode: 'owner', nickname: nk, similar: similar, different: different, activities: acts.slice(0, 3), tips: tips.slice(0, 3), info: info, pairs: pairs };
    }

    // ---------------------------------------------------------------- 친구 강아지와 (두 강아지의 단계만 비교)
    // 비교 축: 탐험성(e), 새로운 자극에 대한 조심성(s), 다른 강아지·사람과의 인사(o), 환경 적응(x), 놀이 몰두(f)
    var FRIEND_AXES = ['e', 's', 'o', 'x', 'f'];
    var FRIEND_TEXT = {
        e: { hh: '둘 다 새로운 걸 먼저 알아보는 편이에요', ll: '둘 다 새로운 건 천천히 살펴보는 편이에요', diff: '한 친구는 먼저 다가가고, 한 친구는 천천히 살펴보는 편이에요' },
        s: { hh: '둘 다 큰 소리나 낯선 곳에 조심스러운 편이에요', ll: '둘 다 웬만한 소리에는 덤덤한 편이에요', diff: '한 친구가 낯선 자극에 더 조심스러운 편이에요' },
        o: { hh: '둘 다 다른 강아지와 인사를 비교적 부드럽게 나누는 편이에요', ll: '둘 다 친해지는 데 시간이 필요한 편이에요', diff: '친해지는 속도가 서로 다를 수 있어요' },
        x: { hh: '둘 다 새로운 장소에 비교적 빨리 적응해요', ll: '둘 다 익숙한 곳이 편해요', diff: '새로운 장소에 적응하는 속도가 달라요' },
        f: { hh: '둘 다 한 가지 놀이에 오래 몰두해요', ll: '둘 다 여러 놀이를 바꿔 가며 노는 편이에요', diff: '노는 방식이 달라서 각자 놀이 시간을 따로 주면 좋아요' },
    };
    var FIRST_MEET = ['사람과 강아지가 적은 공원처럼 어느 쪽 집도 아닌 곳에서, 줄을 한 채로 만나요.', '마주 보고 다가가기보다 몇 미터 떨어져 나란히 걸으며 시작해요.', '인사는 3초쯤 짧게 하고 잠깐 떨어졌다가 다시 만나요.', '몸이 굳거나, 하품·입술 핥기·고개 돌리기가 보이면 거리를 벌려 주세요.', '장난감과 간식은 서로 보이지 않는 곳에서 따로 주세요.'];

    function friendBands(b) { return typeof b === 'string' && /^[hml]{5}$/.test(b) ? b : null; }
    function bandsString(scores) { var b = P.bandsOf(scores); return FRIEND_AXES.map(function (k) { return b[k]; }).join(''); }
    function compareFriends(aStr, bStr) {
        var common = [], diff = [], same = 0, opp = 0;
        FRIEND_AXES.forEach(function (k, i) {
            var a = aStr[i], b = bStr[i];
            if (a === b && a !== 'm') { common.push(FRIEND_TEXT[k][a + b]); same++; }
            else if (LV[a] && Math.abs(LV[a] - LV[b]) === 2) { diff.push(FRIEND_TEXT[k].diff); opp++; }
        });
        var at = function (s, k) { return s[FRIEND_AXES.indexOf(k)]; };
        var cautious = at(aStr, 's') === 'h' || at(bStr, 's') === 'h' || at(aStr, 'o') === 'l' || at(bStr, 'o') === 'l';
        var care = [];
        if (cautious) care.push('한 친구가 조심스러운 편이라 처음엔 거리를 두고 나란히 걸어 주세요.');
        if (at(aStr, 'e') !== at(bStr, 'e') && (at(aStr, 'e') === 'h' || at(bStr, 'e') === 'h')) care.push('먼저 다가가는 친구가 너무 가까이 붙지 않게 줄을 느슨하게 잡고 지켜봐 주세요.');
        if (at(aStr, 'f') === 'h' || at(bStr, 'f') === 'h') care.push('좋아하는 장난감이나 개껌은 함께 있을 때 꺼내지 않는 게 좋아요.');
        var acts = [];
        if (at(aStr, 'e') === 'h' && at(bStr, 'e') === 'h' && !cautious) acts.push('처음 가 보는 공원을 줄을 하고 함께 걷기');
        acts.push('몇 미터 떨어져 나란히 걷는 산책');
        if (at(aStr, 'f') === 'h' && at(bStr, 'f') === 'h') acts.push('각자 노즈워크 매트로 따로 놀고 같은 공간에서 쉬기');
        var nk = cautious ? 'f_slow' : (at(aStr, 'e') === 'h' && at(bStr, 'e') === 'h') ? 'f_explore' : same >= 3 ? 'f_twin' : opp >= 2 ? 'f_diff' : 'f_walk';
        return { mode: 'friend', nickname: nk, common: common, different: diff, activities: acts, care: care, firstMeet: FIRST_MEET };
    }

    var NICKNAMES = {
        explore: '함께 탐험하는 파트너', calm: '느긋한 힐링 메이트', energy: '에너지를 나누는 친구', care: '서로 배려하는 단짝',
        f_slow: '천천히 친해질 친구', f_explore: '함께 탐험하는 산책 메이트', f_twin: '닮은꼴 단짝', f_diff: '서로 다른 매력 친구', f_walk: '함께 걸을 산책 친구',
    };
    var INVITE_DAYS = 30;
    function inviteExpired(d, now) {
        if (!/^\d{8}$/.test(String(d))) return true;
        var t = Date.UTC(+String(d).slice(0, 4), +String(d).slice(4, 6) - 1, +String(d).slice(6, 8));
        return !(now - t >= -86400000 && now - t <= INVITE_DAYS * 86400000);
    }

    var api = { OWNER_Q: OWNER_Q, FRIEND_AXES: FRIEND_AXES, NICKNAMES: NICKNAMES, compareOwner: compareOwner, compareFriends: compareFriends, bandsString: bandsString, friendBands: friendBands, inviteExpired: inviteExpired, INVITE_DAYS: INVITE_DAYS, OWNER_TEXT: OWNER_TEXT };
    if (NODE) { module.exports = api; return; }
    root.MungMatch = api;

    // ================================================================ 화면
    var KAKAO_KEY = '9c311733c910878af9ea27cd77bb3f4b';
    var DISCLAIMER = '재미로 보는 비교예요. 적합성을 검사하거나 잘 지낼지를 판단하는 결과가 아니에요.';
    function track(name, params) { if (window.mungTrack) window.mungTrack(name, params); }
    function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return v === undefined ? null : false; } }
    function h(tag, attrs, kids) {
        var el = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            var v = attrs[k];
            if (v === false || v == null) return;
            if (k === 'text') el.textContent = v; else if (k === 'on') el.addEventListener('click', v); else if (k === 'onchange') el.addEventListener('change', v);
            else el.setAttribute(k, v === true ? '' : v);
        });
        (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
        return el;
    }
    // replaceChildren은 null을 "null" 글자로 넣으므로, 빈 항목을 빼고 넣는다
    function put(el, kids) { el.replaceChildren.apply(el, kids.filter(function (k) { return k; })); }
    function list(title, items, cls) { return items.length ? h('section', { class: 'man-sec ' + (cls || '') }, [h('h3', { text: title }), h('ul', {}, items.map(function (t) { return h('li', { text: t }); }))]) : null; }
    function kakaoReady() { try { if (typeof Kakao === 'undefined') return false; if (!Kakao.isInitialized()) Kakao.init(KAKAO_KEY); return Kakao.isInitialized(); } catch (e) { return false; } }
    function copy(url, btn) {
        var done = function () { var t = btn.textContent; btn.textContent = '링크를 복사했어요'; setTimeout(function () { btn.textContent = t; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('링크를 복사해 주세요', url); }); else prompt('링크를 복사해 주세요', url);
    }
    // 공유 버튼 묶음. evt: 기록할 이벤트 이름, base: 이벤트 공통 값
    function shareButtons(url, title, desc, image, evt, base) {
        var t = function (m) { var p = Object.assign({}, base, { method: m }); track(evt, p); };
        var b = [h('button', { type: 'button', class: 'btn', text: '카카오톡으로 보내기', on: function (e) {
            if (!kakaoReady()) { t('link'); copy(url + '&via=link', e.currentTarget); return; }
            try { (Kakao.Share || Kakao.Link).sendDefault({ objectType: 'feed', content: { title: title, description: desc, imageUrl: location.origin + image, link: { mobileWebUrl: url + '&via=kakao', webUrl: url + '&via=kakao' } }, buttons: [{ title: '보러 가기', link: { mobileWebUrl: url + '&via=kakao', webUrl: url + '&via=kakao' } }] }); t('kakao'); }
            catch (err) { t('link'); copy(url + '&via=link', e.currentTarget); }
        } })];
        if (navigator.share) b.push(h('button', { type: 'button', class: 'btn btn-ghost', text: '다른 앱으로 공유', on: function () { t('native'); navigator.share({ title: title, text: desc, url: url + '&via=native' }).catch(function () {}); } }));
        b.push(h('button', { type: 'button', class: 'btn btn-ghost', text: '링크 복사', on: function (e) { t('link'); copy(url + '&via=link', e.currentTarget); } }));
        return h('div', { class: 'check-actions' }, b);
    }
    function imageButtons(make, mode) {
        var dl = function (fmt) {
            return h('button', { type: 'button', class: 'btn btn-ghost', text: fmt === 'feed' ? '피드 이미지 저장' : '스토리 이미지 저장', on: function (e) {
                var btn = e.currentTarget, label = btn.textContent;
                btn.textContent = '이미지 만드는 중...'; btn.disabled = true;
                track('match_share_click', { mode: mode, method: 'image_' + fmt });
                MungCard.profile(make(fmt)).then(function (c) { return MungCard.deliver(c, 'mungtest-match-' + fmt + '.png', ''); })
                    .catch(function () { alert('이미지를 만들지 못했어요.'); }).then(function () { btn.textContent = label; btn.disabled = false; });
            } });
        };
        return h('div', { class: 'check-actions' }, [dl('feed'), dl('story')]);
    }
    function seenOnce(key) {
        var seen = [];
        try { seen = JSON.parse(store('mung_seen_links') || '[]'); } catch (e) {}
        if (seen.indexOf(key) !== -1) return false;
        store('mung_seen_links', JSON.stringify(seen.concat([key]).slice(-50)));
        return true;
    }

    // ---- 결과 보기 (보호자/친구 공용). shared: 공유받아 보는 중
    function ownerResult(r, dogName, type, shared) {
        return [
            h('p', { class: 'check-eyebrow', text: (shared ? '공유받은 ' : '') + '보호자와 ' + dogName + '의 생활 궁합' }),
            h('h2', { class: 'check-q match-nick', text: NICKNAMES[r.nickname] }),
            h('p', { class: 'check-note', text: '궁합 이름은 재미로 붙인 표현이에요.' }),
            list('비슷한 부분', r.similar),
            list('서로 다를 수 있는 부분', r.different),
            list('함께 즐겨 볼 활동', r.activities),
            list('보호자가 조금 맞춰 주면 좋은 부분', r.tips),
            r.info && r.info.length ? list('보호자 생활 정보 (검사에 없는 항목이라 비교하지 않았어요)', r.info, 'match-info') : null,
            r.similar.length + r.different.length === 0 ? h('p', { class: 'check-note', text: '답과 검사 결과가 대부분 "보통"이라 뚜렷하게 비교할 부분이 적었어요.' }) : null,
            h('p', { class: 'check-note', text: DISCLAIMER }),
        ];
    }
    function friendResult(r, aName, bName, shared) {
        return [
            h('p', { class: 'check-eyebrow', text: (shared ? '공유받은 ' : '') + aName + ' & ' + bName + ' 성향 궁합' }),
            h('h2', { class: 'check-q match-nick', text: NICKNAMES[r.nickname] }),
            h('p', { class: 'check-note', text: '궁합 이름은 재미로 붙인 표현이에요.' }),
            list('닮은 점', r.common), list('다른 점', r.different), list('함께 해 볼 활동', r.activities), list('서로 배려하면 좋은 부분', r.care),
            list('처음 만날 때', r.firstMeet),
            h('p', { class: 'check-note', text: '실제로 잘 지낼지는 만나 봐야 알 수 있어요. 만나는 동안 두 강아지의 몸짓과 스트레스 신호를 계속 살펴 주세요. ' + DISCLAIMER }),
        ];
    }
    function ownerCard(r, dogName, type, fmt) {
        return { format: fmt, theme: 'pastel', type: type, name: dogName + ' & 보호자', headline: NICKNAMES[r.nickname], sub: '보호자와 강아지 생활 궁합', photo: null, footer: 'mung-test.com/match',
            blocks: [{ title: '비슷한 부분', items: r.similar.slice(0, 2) }, { title: '함께 즐겨 볼 활동', items: r.activities.slice(0, 2) }].filter(function (b) { return b.items.length; }) };
    }
    function friendCard(r, aName, bName, type, fmt) {
        return { format: fmt, theme: 'character', type: type, name: aName + ' & ' + bName, headline: NICKNAMES[r.nickname], sub: '강아지 친구 성향 궁합', photo: null, footer: 'mung-test.com/match',
            blocks: [{ title: '닮은 점', items: r.common.slice(0, 2) }, { title: '함께 해 볼 활동', items: r.activities.slice(0, 2) }].filter(function (b) { return b.items.length; }) };
    }
    var CTA_FOR_VISITOR = function () {
        var me = P.readMine(localStorage);
        return h('div', { class: 'check-actions' }, me
            ? [h('a', { class: 'btn', href: '/match/', text: '우리 강아지 궁합 결과 보기' }), h('a', { class: 'btn btn-ghost', href: '/manual/', text: '내 강아지 설명서 만들기' })]
            : [h('a', { class: 'btn', href: '/?start=true', text: '우리 강아지도 검사하기' }), h('a', { class: 'btn btn-ghost', href: '/match/', text: '멍궁합이 뭔지 보기' })]);
    };

    // ---------------------------------------------------------------- /match/ 메인
    function main(app) {
        var panel = app.querySelector('[data-panel]');
        var mine = P.readMine(localStorage);
        var pending = store('mung_pending_invite');
        function home() {
            var kids = [];
            if (pending && /^\/match\/invite\/#p=[A-Za-z0-9_-]+$/.test(pending)) kids.push(h('div', { class: 'callout callout-note' }, [h('b', { text: '받은 친구 궁합 초대가 있어요. ' }), h('a', { href: pending, text: '초대 이어서 보기' })]));
            if (!mine || !mine.scores) {
                kids.push(h('h2', { class: 'check-q', text: mine ? '궁합을 보려면 기질검사를 한 번 더 해 주세요' : '궁합은 기질검사 결과로 봐요' }));
                kids.push(h('p', { text: mine ? '예전에 한 검사라 비교에 필요한 특성 점수가 저장돼 있지 않아요. 3분이면 다시 할 수 있어요.' : '우리 강아지 기질검사(20문항, 3분)를 먼저 해 주세요. 결과는 이 브라우저에만 저장돼요.' }));
                kids.push(h('a', { class: 'btn', href: '/?start=true', text: '우리 강아지 기질검사 하기' }));
                return put(panel, kids);
            }
            var nm = mine.name || '우리 강아지';
            kids.push(h('h2', { class: 'check-q', text: '어떤 궁합을 볼까요?' }));
            kids.push(h('div', { class: 'match-modes' }, [
                h('button', { type: 'button', class: 'next-card', style: '--tone:#FFCF5C', on: ownerFlow }, [h('b', { text: '보호자와 ' + nm }), h('span', { text: '생활 패턴 7문항, 1분' })]),
                h('button', { type: 'button', class: 'next-card', style: '--tone:#FFB8C6', on: inviteFlow }, [h('b', { text: '친구 강아지와 ' + nm }), h('span', { text: '초대 링크를 보내고, 친구가 참여하면 결과가 나와요' })]),
            ]));
            var sent = [];
            try { sent = JSON.parse(store('mung_invites') || '[]'); } catch (e) {}
            if (sent.length) kids.push(list('보낸 초대', sent.map(function (s) { return s.d.slice(0, 4) + '.' + s.d.slice(4, 6) + '.' + s.d.slice(6) + '에 보냄 · ' + (inviteExpired(s.d, Date.now()) ? '만료됨' : INVITE_DAYS + '일 동안 열려요') + ' · 친구가 결과를 공유해 주면 볼 수 있어요'; })));
            put(panel, kids);
        }
        function ownerFlow() {
            track('match_start', { mode: 'owner' });
            var answers = {}, idx = 0;
            function q() {
                var Q = OWNER_Q[idx];
                put(panel, [
                    h('div', { class: 'check-progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(OWNER_Q.length), 'aria-valuenow': String(idx + 1), 'aria-label': '진행률' }, [h('i', { style: 'width:' + Math.round((idx + 1) / OWNER_Q.length * 100) + '%' })]),
                    h('p', { class: 'check-count', text: (idx + 1) + ' / ' + OWNER_Q.length + (Q.axis ? '' : ' · 보호자 생활 정보') }),
                    h('h2', { class: 'check-q', text: Q.q }),
                    h('div', { class: 'check-opts' }, Q.o.map(function (t, i) { return h('button', { type: 'button', class: 'check-opt', 'aria-pressed': String(answers[Q.id] === i), text: t, on: function () { answers[Q.id] = i; setTimeout(function () { if (++idx >= OWNER_Q.length) done(); else q(); }, 160); } }); })),
                    h('div', { class: 'check-nav' }, [h('button', { type: 'button', class: 'btn btn-ghost', text: idx ? '이전' : '처음으로', on: function () { if (idx) { idx--; q(); } else home(); } })])
                ]);
            }
            function done() {
                var r = compareOwner(answers, mine.scores), nm = mine.name || '우리 강아지';
                track('match_complete', { mode: 'owner', nickname: r.nickname });
                var withName = h('input', { type: 'checkbox', id: 'mo-name' });
                var shareArea = h('div');
                var payload = function () { var o = { v: 1, m: 'o', t: mine.type, k: r.nickname, p: r.pairs }; if (withName.checked && mine.name) o.n = mine.name; return o; };
                var url = function () { return location.origin + '/match/s/' + r.nickname + '/#m=' + P.pack(payload()); };
                var paint = function () { shareArea.replaceChildren(shareButtons(url(), '보호자와 ' + (withName.checked && mine.name ? mine.name : '우리 강아지') + ': ' + NICKNAMES[r.nickname], '멍테스트 생활 궁합 · 재미로 보는 비교', '/img/og-match-owner.jpg', 'match_share_click', { mode: 'owner' })); };
                withName.addEventListener('change', paint);
                put(panel, ownerResult(r, nm, mine.type, false).concat([
                    h('h3', { class: 'man-sub', text: '공유하기' }),
                    mine.name ? h('label', { class: 'man-check', for: 'mo-name' }, [withName, h('span', {}, [h('b', { text: '공유할 때 이름(' + mine.name + ') 넣기' }), h('small', { text: '링크에는 궁합 이름과 비교 결과만 들어가요. 생활 정보와 점수는 들어가지 않아요.' })])]) : null,
                    shareArea,
                    imageButtons(function (fmt) { return ownerCard(r, withName.checked && mine.name ? mine.name : '우리 강아지', mine.type, fmt); }, 'owner'),
                    h('button', { type: 'button', class: 'text-link', text: '다른 궁합 보기', on: home }),
                ]));
                paint();
            }
            q();
        }
        // 친구 초대 만들기: 동의를 받고, 링크에 들어갈 내용을 먼저 보여 준다
        function inviteFlow() {
            track('match_start', { mode: 'friend' });
            var bands = bandsString(mine.scores);
            var consent = h('input', { type: 'checkbox', id: 'mi-ok' });
            var withName = h('input', { type: 'checkbox', id: 'mi-name' });
            var out = h('div');
            put(panel, [
                h('h2', { class: 'check-q', text: '친구 강아지에게 궁합 초대 보내기' }),
                h('p', { text: '친구가 링크를 열고 자기 강아지 기질검사 결과로 참여하면, 두 강아지의 성향 궁합이 나와요. 연락처를 묻거나 자동으로 메시지를 보내지 않아요.' }),
                list('링크에 들어가는 것', ['대표 유형: ' + mine.typeName, '비교에 쓰는 성향 5가지의 단계(높음·보통·낮음): 탐험성, 조심성, 사교성, 적응, 놀이 몰두', '만든 날짜 (' + INVITE_DAYS + '일 뒤 만료)', '강아지 이름 (아래에서 고른 경우만)']),
                h('label', { class: 'man-check', for: 'mi-ok' }, [consent, h('span', {}, [h('b', { text: '위 내용을 친구와 비교하는 데 써도 돼요' }), h('small', { text: '점수와 문항 답은 들어가지 않아요. 보낸 링크는 서버에 저장되지 않아 나중에 취소할 수 없어요.' })])]),
                mine.name ? h('label', { class: 'man-check', for: 'mi-name' }, [withName, h('span', {}, [h('b', { text: '이름(' + mine.name + ')도 보여 주기' })])]) : null,
                h('div', { class: 'check-actions' }, [h('button', { type: 'button', class: 'btn', text: '초대 링크 만들기', on: function (e) {
                    if (!consent.checked) { e.currentTarget.textContent = '먼저 동의에 체크해 주세요'; return; }
                    var d = new Date(), ds = '' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
                    var o = { v: 1, t: mine.type, b: bands, d: ds };
                    if (withName.checked && mine.name) o.n = mine.name;
                    var url = location.origin + '/match/invite/#p=' + P.pack(o);
                    var sent = [];
                    try { sent = JSON.parse(store('mung_invites') || '[]'); } catch (err) {}
                    store('mung_invites', JSON.stringify(sent.concat([{ d: ds }]).slice(-10)));
                    track('match_invite_create', { with_name: !!o.n });
                    out.replaceChildren(
                        h('p', { class: 'check-note', text: '초대 링크를 만들었어요. 친구에게 보내 주세요.' }),
                        shareButtons(url, (o.n || '우리 강아지') + '와 궁합 볼래요?', '우리 강아지들 성향 궁합 보기 · 멍테스트', '/img/og-match-invite.jpg', 'match_share_click', { mode: 'invite' })
                    );
                } }), h('button', { type: 'button', class: 'btn btn-ghost', text: '처음으로', on: home })]),
                out
            ]);
        }
        home();
    }

    // ---------------------------------------------------------------- /match/invite/ 초대받은 화면
    function invite(app) {
        var panel = app.querySelector('[data-panel]');
        var raw = P.hashParam(location.hash, 'p');
        var o = P.unpack(raw);
        var via = P.hashParam(location.hash, 'via') || 'unknown';
        var valid = o && P.TYPES[o.t] && friendBands(o.b);
        var expired = valid && inviteExpired(o.d, Date.now());
        var mine = P.readMine(localStorage);
        var state = !valid ? 'invalid' : expired ? 'expired' : mine && mine.scores ? 'has_result' : 'new';
        if (raw && seenOnce('i' + raw.slice(0, 24))) track('match_invite_visit', { via: /^[a-z]+$/.test(via) ? via : 'unknown', state: state });
        P.markShared(localStorage, 'match_invite');
        if (!valid) return put(panel, [h('h2', { class: 'check-q', text: '초대 내용을 읽을 수 없어요' }), h('p', { text: '링크가 잘렸을 수 있어요. 친구에게 다시 받아 주세요.' }), h('a', { class: 'btn', href: '/match/', text: '멍궁합 보러 가기' })]);
        var an = P.cleanText(o.n, 10) || '친구 강아지';
        var profile = [
            h('div', { class: 'man-shared-head' }, [h('img', { src: '/img/type-' + o.t + '.webp', alt: '', width: '96', height: '96' }), h('div', {}, [h('p', { class: 'check-eyebrow', text: '궁합 초대' }), h('h2', { class: 'check-q', text: an + '와 궁합 볼래요?' })])]),
            h('p', {}, [h('b', { text: an }), '의 대표 성향은 ' + P.TYPES[o.t].name + '이에요.']),
        ];
        if (expired) return put(panel, profile.concat([h('p', { class: 'callout callout-note', text: '이 초대는 만든 지 ' + INVITE_DAYS + '일이 지나 끝났어요. 친구에게 새 초대를 받아 주세요.' }), CTA_FOR_VISITOR()]));
        if (!mine || !mine.scores) {
            // 아직 결과가 없으면 검사하고 돌아오게
            return put(panel, profile.concat([
                h('p', { text: mine ? '예전에 한 검사라 비교에 필요한 특성 점수가 없어요. 기질검사를 한 번 더 하면 바로 궁합을 볼 수 있어요.' : '우리 강아지 기질검사(20문항, 3분)를 하면 바로 궁합을 볼 수 있어요. 검사 결과 화면에서 이 초대로 다시 돌아올 수 있어요.' }),
                h('div', { class: 'check-actions' }, [h('a', { class: 'btn', href: '/?start=true', text: '우리 강아지 기질검사 하기', on: function () { store('mung_pending_invite', '/match/invite/#p=' + raw); track('match_invite_accept'); } })]),
            ]));
        }
        var bn = mine.name || '우리 강아지';
        var consent = h('input', { type: 'checkbox', id: 'fi-ok' });
        var withName = h('input', { type: 'checkbox', id: 'fi-name' });
        put(panel, profile.concat([
            h('label', { class: 'man-check', for: 'fi-ok' }, [consent, h('span', {}, [h('b', { text: '우리 강아지 성향 단계(높음·보통·낮음)를 이 비교에 써도 돼요' }), h('small', { text: '이 기기 안에서만 비교해요. 결과를 공유할 때만 링크에 두 강아지의 단계와 유형이 들어가요.' })])]),
            mine.name ? h('label', { class: 'man-check', for: 'fi-name' }, [withName, h('span', {}, [h('b', { text: '공유할 때 이름(' + mine.name + ') 넣기' })])]) : null,
            h('div', { class: 'check-actions' }, [h('button', { type: 'button', class: 'btn', text: '궁합 보기', on: function (e) {
                if (!consent.checked) { e.currentTarget.textContent = '먼저 동의에 체크해 주세요'; return; }
                track('match_invite_accept');
                var mb = bandsString(mine.scores);
                var r = compareFriends(o.b, mb);
                track('match_invite_complete', { nickname: r.nickname });
                store('mung_pending_invite', null);
                var share = function () {
                    var p = { v: 1, m: 'f', a: { t: o.t, b: o.b }, c: { t: mine.type, b: mb }, k: r.nickname };
                    if (o.n) p.a.n = an;
                    if (withName.checked && mine.name) p.c.n = mine.name;
                    return location.origin + '/match/s/' + r.nickname + '/#m=' + P.pack(p);
                };
                var cn = withName.checked && mine.name ? mine.name : '우리 강아지';
                put(panel, friendResult(r, an, bn, false).concat([
                    h('h3', { class: 'man-sub', text: '결과 공유하기' }),
                    h('p', { class: 'check-note', text: '초대한 친구는 이 결과를 볼 수 없어요. 링크를 보내 주면 친구도 볼 수 있어요.' }),
                    shareButtons(share(), an + ' & ' + cn + ': ' + NICKNAMES[r.nickname], '강아지 친구 성향 궁합 · 재미로 보는 비교', '/img/og-match-friend.jpg', 'match_share_click', { mode: 'friend' }),
                    imageButtons(function (fmt) { return friendCard(r, an, cn, o.t, fmt); }, 'friend'),
                ]));
            } })]),
        ]));
    }

    // ---------------------------------------------------------------- /match/s/<궁합>/ 공유받은 결과
    function sharedResult(app) {
        var panel = app.querySelector('[data-panel]');
        var o = P.unpack(P.hashParam(location.hash, 'm'));
        var via = P.hashParam(location.hash, 'via') || 'unknown';
        P.markShared(localStorage, 'match');
        var bad = function () { put(panel, [h('h2', { class: 'check-q', text: '궁합 결과를 읽을 수 없어요' }), h('p', { text: '링크가 잘렸을 수 있어요.' }), CTA_FOR_VISITOR()]); };
        if (!o) return bad();
        if (seenOnce('m' + P.hashParam(location.hash, 'm').slice(0, 24))) track('shared_link_visit', { content: 'match', via: /^[a-z]+$/.test(via) ? via : 'unknown' });
        if (o.m === 'f' && o.a && o.c && P.TYPES[o.a.t] && P.TYPES[o.c.t] && friendBands(o.a.b) && friendBands(o.c.b)) {
            // 받은 단계로 결과를 다시 계산 (주소에 적힌 문장을 그대로 믿지 않음)
            var r = compareFriends(o.a.b, o.c.b);
            return put(panel, friendResult(r, P.cleanText(o.a.n, 10) || '친구 강아지', P.cleanText(o.c.n, 10) || '친구 강아지', true).concat([CTA_FOR_VISITOR()]));
        }
        if (o.m === 'o' && P.TYPES[o.t] && o.p && typeof o.p === 'object') {
            var sim = [], dif = [];
            Object.keys(o.p).forEach(function (k) {
                var v = String(o.p[k]);
                if (OWNER_TEXT[k] && OWNER_TEXT[k][v]) (v[0] === v[1] ? sim : dif).push(OWNER_TEXT[k][v]);
            });
            if (o.p.i === 'long_l') dif.push('혼자 있는 시간이 긴 편인데, 강아지는 보호자 곁을 편하게 여기는 편이에요');
            if (o.p.i === 'long_h') sim.push('혼자 있는 시간이 있어도 강아지가 비교적 차분하게 쉬는 편이에요');
            if (o.p.i === 'none_l') sim.push('보호자가 곁에 있는 시간이 많고, 강아지도 보호자 곁을 편하게 여겨요');
            var nk = NICKNAMES[o.k] && o.k.indexOf('f_') !== 0 ? o.k : 'care';
            return put(panel, ownerResult({ nickname: nk, similar: sim, different: dif, activities: [], tips: [], info: [] }, P.cleanText(o.n, 10) || '우리 강아지', o.t, true).concat([CTA_FOR_VISITOR()]));
        }
        bad();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var app = document.querySelector('[data-match]');
        if (!app) return;
        var mode = app.getAttribute('data-match');
        if (mode === 'invite') invite(app); else if (mode === 'shared') sharedResult(app); else main(app);
    });
})(this);
