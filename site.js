// 멍테스트 공통 스크립트: 화면 밝기, 우리 강아지 맞춤 추천
(function () {
    function store(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            localStorage.setItem(key, value);
        } catch (e) { return null; }
    }

    // 영어 버전은 운영하지 않음 (예전에 영어를 골랐던 방문자도 한국어로)
    store('mung_lang', 'ko');

    // ---------------------------------------------------------------- 분석 이벤트
    // GA4 측정 ID(G-로 시작)를 넣으면 그때부터 전송. 비어 있으면 아무 데도 보내지 않음.
    // 확인용: 주소 뒤에 ?track_debug 또는 localStorage.mung_track_debug=1 이면 콘솔에 출력.
    var GA_ID = '';
    // 보낼 수 있는 이벤트와 항목만 여기 적는다. 강아지 이름, 답변, MBTI, 메모 같은 값은 넣지 않는다.
    var EVENTS = {
        behavior_check_view: { check: 'key' },
        behavior_check_start: { check: 'key' },
        behavior_check_complete: { check: 'key', result: 'key', causes: 'int' },
        temperament_test_start: {},
        temperament_test_complete: { type: 'int', has_mbti: 'bool' },
        routine_start: { type: 'int' },
        routine_day_complete: { type: 'int', day: 'int', days_since_start: 'int' },
        result_share: { content: 'key', method: 'key', with_name: 'bool' },
        shared_link_visit: { content: 'key', via: 'key' },
        // 멍설명서
        guide_view: { has_result: 'bool' },
        guide_generate: { type: 'int', card: 'key', has_scores: 'bool' },
        guide_edit: { field: 'key' },
        guide_image_download: { format: 'key', card: 'key', theme: 'key', has_photo: 'bool' },
        guide_share_click: { method: 'key', card: 'key' },
        guide_public_link_create: { card: 'key', with_name: 'bool', with_owner_text: 'bool' },
        guide_public_link_visit: { via: 'key', card: 'key' },
        // 멍궁합
        match_start: { mode: 'key' },
        match_complete: { mode: 'key', nickname: 'key' },
        match_share_click: { mode: 'key', method: 'key' },
        match_invite_create: { with_name: 'bool' },
        match_invite_visit: { via: 'key', state: 'key' },
        match_invite_accept: {},
        match_invite_complete: { nickname: 'key' },
        // 멍시그널
        signal_view: { webgl: 'bool' },
        signal_behavior: { behavior: 'key' },
        signal_control: { param: 'key' },
        signal_part: { part: 'key' },
        signal_scene: { scene: 'key' },
        signal_scene_choice: { scene: 'key', verdict: 'key' },
        // 공유 링크로 들어온 사람이 직접 검사를 하는지
        shared_visitor_test_start: { from: 'key' },
        shared_visitor_test_complete: { from: 'key' },
    };
    function clean(name, params) {
        var spec = EVENTS[name];
        if (!spec) return null;
        var out = {};
        Object.keys(spec).forEach(function (k) {
            var v = params && params[k];
            if (v === undefined || v === null) return;
            if (spec[k] === 'int') { v = parseInt(v, 10); if (!isFinite(v) || v < 0 || v > 999) return; }
            else if (spec[k] === 'bool') v = !!v;
            else { v = String(v); if (!/^[a-z0-9_]{1,30}$/.test(v)) return; }
            out[k] = v;
        });
        return out;
    }
    var debug = /[?&]track_debug\b/.test(location.search) || store('mung_track_debug') === '1';
    window.mungTrack = function (name, params) {
        var p = clean(name, params);
        if (!p) return;
        if (debug && window.console) console.log('[track]', name, p);
        if (window.gtag && GA_ID) window.gtag('event', name, p);
    };
    window.mungTrack.clean = clean;
    // GA는 페이지 주소를 통째로 모으는데, 공유 결과 주소(?e=..&owner=..&name=..)에는 MBTI와 강아지 이름이 들어갈 수 있음.
    // 그래서 utm_ 유입 정보만 남기고 나머지 쿼리와 # 뒤는 지운 주소를 넘긴다.
    function safeUrl(u) {
        try {
            var x = new URL(u, location.href), keep = new URLSearchParams();
            x.searchParams.forEach(function (v, k) { if (/^utm_/.test(k)) keep.set(k, v); });
            var q = keep.toString();
            return x.origin + x.pathname + (q ? '?' + q : '');
        } catch (e) { return location.origin + location.pathname; }
    }
    window.mungTrack.safeUrl = safeUrl;
    if (GA_ID) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        // 광고 개인화·구글 신호 끔: 방문 통계와 위 이벤트만 씀
        var cfg = { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: safeUrl(location.href) };
        if (document.referrer) cfg.page_referrer = safeUrl(document.referrer);
        if (debug) cfg.debug_mode = true; // GA4 DebugView에서 바로 보이게
        window.gtag('config', GA_ID, cfg);
        var gs = document.createElement('script');
        gs.async = true; gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(gs);
    }

    function applyTheme(dark) {
        document.body.classList.toggle('dark-mode', dark);
        var btn = document.getElementById('btn-theme');
        if (btn) {
            btn.textContent = dark ? '밝게' : '어둡게';
            btn.setAttribute('aria-pressed', String(dark));
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var saved = store('mung_theme');
        applyTheme(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
        var btn = document.getElementById('btn-theme');
        if (btn) btn.addEventListener('click', function () {
            var dark = !document.body.classList.contains('dark-mode');
            applyTheme(dark);
            store('mung_theme', dark ? 'dark' : 'light');
        });

        // 모바일 메뉴: 끝까지 밀면 흐림 표시 없앰, 지금 페이지 메뉴가 보이게 스크롤
        var nav = document.querySelector('.site-nav');
        if (nav) {
            var edge = function () { nav.classList.toggle('at-end', nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4); };
            var cur = nav.querySelector('[aria-current="page"]');
            if (cur && cur.offsetLeft + cur.offsetWidth > nav.clientWidth) nav.scrollLeft = cur.offsetLeft - 16;
            nav.addEventListener('scroll', edge, { passive: true });
            edge();
        }

        // 해외여행 체크리스트: 나라별로 체크한 항목 id를 이 브라우저에 저장
        document.querySelectorAll('[data-checklist]').forEach(function (box) {
            var key = 'mung_abroad_' + box.getAttribute('data-checklist');
            var inputs = Array.prototype.slice.call(box.querySelectorAll('input[data-id]'));
            var saved = [];
            try { saved = JSON.parse(store(key) || '[]') || []; } catch (e) { saved = []; }
            inputs.forEach(function (i) { i.checked = saved.indexOf(i.getAttribute('data-id')) !== -1; });
            var paint = function () {
                var done = inputs.filter(function (i) { return i.checked; }).length;
                box.querySelector('[data-done]').textContent = done;
                box.querySelector('[data-bar]').style.width = Math.round(done / inputs.length * 100) + '%';
                box.classList.toggle('is-complete', done === inputs.length);
            };
            var save = function () {
                var ids = inputs.filter(function (i) { return i.checked; }).map(function (i) { return i.getAttribute('data-id'); });
                if (ids.length) store(key, JSON.stringify(ids)); else { try { localStorage.removeItem(key); } catch (e) {} }
                paint();
            };
            inputs.forEach(function (i) { i.addEventListener('change', save); });
            box.querySelector('[data-reset]').addEventListener('click', function () {
                if (!confirm('이 나라 체크리스트의 체크를 모두 지울까요?')) return;
                inputs.forEach(function (i) { i.checked = false; });
                save();
            });
            paint();
        });

        // 홈: 다시 온 방문자에게 지난 결과와 7일 활동 이어 하기
        var resume = document.querySelector('[data-home-resume]');
        if (resume) {
            var me = null, rt = null;
            try { me = JSON.parse(store('mung_dog') || 'null'); rt = JSON.parse(store('mung_routine') || 'null'); } catch (e) {}
            if (me && me.typeName) {
                var done = rt && rt.done ? Object.keys(rt.done).length : 0;
                var last = me.typeName.charCodeAt(me.typeName.length - 1);
                var ieyo = last >= 0xAC00 && last <= 0xD7A3 && (last - 0xAC00) % 28 ? '이에요. ' : '예요. ';
                resume.textContent = (me.name || '우리 강아지') + '의 지난 결과는 ' + me.typeName + ieyo;
                var a = document.createElement('a');
                a.href = '/routine/';
                a.textContent = rt ? (done >= 7 ? '7일 활동 기록 보기' : '7일 맞춤 활동 이어 하기 (' + done + '/7일)') : '이 유형에 맞춘 7일 활동 보기';
                resume.appendChild(a);
                resume.hidden = false;
            }
        }

        // 성격 테스트 결과가 있으면 그 유형에 맞는 추천 보여주기
        var box = document.querySelector('[data-my-dog]');
        if (!box) return;
        var dog = null;
        try { dog = JSON.parse(store('mung_dog') || 'null'); } catch (e) { dog = null; }
        if (!dog || !dog.type) return;
        var pick = box.querySelector('[data-for-type="' + dog.type + '"]');
        if (!pick) return;
        box.querySelectorAll('[data-dog-name]').forEach(function (el) {
            el.textContent = (dog.name || '우리 강아지') + (dog.typeName ? ' (' + dog.typeName + ')' : '');
        });
        pick.hidden = false;
        box.hidden = false;
    });
})();
