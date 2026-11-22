// 멍설명서 화면: /manual/ (만들기)와 /manual/s/N/ (공유받은 설명서 보기).
// 내용은 manual-rules.js가 만들고, 이미지는 share-card.js(MungCard.profile)가 그린다.
// 사진은 이 기기 안에서만 쓰고 서버로 보내지 않는다. 공유 링크에는 고른 공개 항목만 # 뒤에 담는다.
(function () {
    var P = window.MungProfile, R = window.MungManualRules;
    var KEY = 'mung_manual', PHOTO_KEY = 'mung_manual_photo';
    var CARDS = { A: '성격 소개 카드', B: '우리 강아지 사용설명서', C: '우리 강아지와 인사하는 방법' };
    var THEMES = { pastel: '따뜻한 파스텔', minimal: '심플 미니멀', character: '귀여운 캐릭터' };
    var KAKAO_KEY = '9c311733c910878af9ea27cd77bb3f4b';

    function track(name, params) { if (window.mungTrack) window.mungTrack(name, params); }
    function store(k, v) {
        try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return v === undefined ? null : false; }
    }
    function h(tag, attrs, kids) {
        var el = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            var v = attrs[k];
            if (v === false || v == null) return;
            if (k === 'text') el.textContent = v;
            else if (k === 'on') el.addEventListener('click', v);
            else if (k === 'onchange') el.addEventListener('change', v);
            else if (k === 'oninput') el.addEventListener('input', v);
            else el.setAttribute(k, v === true ? '' : v);
        });
        (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
        return el;
    }
    function kakaoReady() {
        try {
            if (typeof Kakao === 'undefined') return false;
            if (!Kakao.isInitialized()) Kakao.init(KAKAO_KEY);
            return Kakao.isInitialized();
        } catch (e) { return false; }
    }
    function toast(btn, msg) { var t = btn.textContent; btn.textContent = msg; setTimeout(function () { btn.textContent = t; }, 1800); }
    function copy(url, btn) {
        var done = function () { toast(btn, '링크를 복사했어요'); };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('링크를 복사해 주세요', url); });
        else prompt('링크를 복사해 주세요', url);
    }

    // 카드에 들어갈 블록 (짧은 문구). pub: 공개 항목 선택
    function blocksFor(g, card, pub) {
        var sh = function (a) { return a.map(function (x) { return x.short; }); };
        var test = pub.traits, own = pub.owner;
        if (card === 'A') {
            var items = test ? sh(g.traits) : [];
            if (items.length < 3 && own) items = items.concat(sh(g.likes)).slice(0, 3);
            return items.length ? [{ title: null, items: items }] : [];
        }
        if (card === 'B') {
            var out = [];
            if (own && g.likes.length) out.push({ title: '좋아하는 것', items: sh(g.likes) });
            else if (test && g.activities.length) out.push({ title: '좋아할 만한 놀이', items: sh(g.activities).slice(0, 2) });
            if (own && g.dislikes.length) out.push({ title: '불편해하는 것', items: sh(g.dislikes) });
            if (test && g.env.length) out.push({ title: '편하게 대하는 법', items: sh(g.env).slice(0, 2) });
            if (test && g.activities.length && own && g.likes.length) out.push({ title: '함께 하면 좋은 것', items: sh(g.activities).slice(0, 2) });
            return out;
        }
        var c = [];
        var ap = test ? g.approach : g.approach.filter(function (a) { return a.source === 'general'; });
        c.push({ title: '처음 만나면', items: sh(ap).slice(0, 3) });
        if (own && g.note.length) c.push({ title: '보호자가 부탁해요', items: sh(g.note) });
        return c;
    }

    // 설명서 전체 글 (화면용, 출처 표시)
    var SRC = { test: '검사 결과', owner: '보호자가 알려 줌', general: '일반 안내' };
    function docView(g, opts) {
        var sec = function (title, items) {
            if (!items.length) return null;
            return h('section', { class: 'man-sec' }, [h('h3', { text: title }), h('ul', {}, items.map(function (it) {
                return h('li', {}, [h('span', { class: 'src src-' + it.source, text: SRC[it.source] }), h('span', { text: it.text })]);
            }))]);
        };
        var kids = [
            h('p', { class: 'man-type' }, [h('b', { text: g.typeName }), ' · ' + g.typeSub]),
            sec('주요 기질 특성', g.traits),
            sec('좋아하는 활동', g.likes),
            sec('불편해하는 상황', g.dislikes),
            sec('편안하게 느끼는 환경', g.env),
            sec('다가올 때 배려해 주세요', g.approach),
            sec('함께 즐기기 좋은 활동', g.activities),
            sec('보호자가 알려 드려요', g.note),
        ];
        if (opts && opts.noScores) kids.splice(1, 0, h('p', { class: 'check-note', text: '예전에 한 검사라 특성 점수가 저장돼 있지 않아요. 기질검사를 다시 하면 특성과 배려할 점까지 채워져요.' }));
        return h('div', { class: 'man-doc' }, kids);
    }

    // ---------------------------------------------------------------- 만들기 화면
    function editor(app) {
        var mine = P.readMine(localStorage);
        track('guide_view', { has_result: !!mine });
        var root = app.querySelector('[data-panel]');
        if (!mine) {
            root.replaceChildren(
                h('p', { class: 'check-eyebrow', text: '아직 기질검사 결과가 없어요' }),
                h('h2', { class: 'check-q', text: '설명서는 기질검사 결과로 만들어요' }),
                h('p', { text: '20개 질문(3분)에 답하면 그 결과로 우리 강아지 설명서를 만들 수 있어요. 결과는 이 브라우저에만 저장돼요.' }),
                h('a', { class: 'btn', href: '/?start=true', text: '우리 강아지 기질검사 하기' })
            );
            return;
        }
        var saved = {};
        try { saved = JSON.parse(store(KEY) || '{}') || {}; } catch (e) {}
        var st = {
            name: P.cleanText(saved.name != null ? saved.name : mine.name, 10),
            likes: P.cleanText(saved.likes, 40), dislikes: P.cleanText(saved.dislikes, 40), note: P.cleanText(saved.note, 60),
            card: CARDS[saved.card] ? saved.card : 'A', theme: THEMES[saved.theme] ? saved.theme : 'pastel',
            pub: Object.assign({ name: true, photo: true, traits: true, owner: true }, saved.pub || {}),
            fmt: 'feed',
        };
        var photo = null, photoUrl = store(PHOTO_KEY);
        var edited = {}, generated = false;
        function save() {
            store(KEY, JSON.stringify({ v: 1, name: st.name, likes: st.likes, dislikes: st.dislikes, note: st.note, card: st.card.toLowerCase(), theme: st.theme, pub: st.pub }));
        }
        function edit(field) { if (!edited[field]) { edited[field] = 1; track('guide_edit', { field: field }); } }
        function guide() { return R.build(mine, { likes: st.likes, dislikes: st.dislikes, note: st.note }); }
        function cardData(fmt) {
            var g = guide();
            return {
                format: fmt, theme: st.theme, type: mine.type,
                name: st.pub.name && st.name ? st.name : '우리 강아지',
                headline: g.typeName, sub: st.card === 'A' ? g.typeSub : CARDS[st.card],
                photo: st.pub.photo ? photo : null,
                blocks: blocksFor(g, st.card, st.pub), footer: 'mung-test.com',
            };
        }

        // 1. 결과 확인
        var s1 = h('section', { class: 'man-step', id: 'step-1' }, [h('h2', { text: '1. 검사 결과 확인' }), docView(guide(), { noScores: !mine.scores })]);
        // 2. 이름·사진·보호자 입력
        var nameIn = h('input', { id: 'm-name', type: 'text', maxlength: '10', value: st.name, placeholder: '예: 초코', autocomplete: 'off', oninput: function () { st.name = P.cleanText(nameIn.value, 10); save(); edit('name'); queue(); } });
        var fileIn = h('input', { id: 'm-photo', type: 'file', accept: 'image/jpeg,image/png,image/webp,image/heic,image/heif', class: 'sr-only', onchange: onFile });
        var photoMsg = h('p', { class: 'check-note', 'aria-live': 'polite' });
        var photoThumb = h('div', { class: 'man-thumb' });
        var delBtn = h('button', { type: 'button', class: 'btn btn-ghost', text: '사진 삭제', on: function () { photo = null; photoUrl = null; store(PHOTO_KEY, null); edit('photo'); paintThumb(); queue(); photoMsg.textContent = '사진을 이 기기에서 지웠어요.'; } });
        var field = function (id, label, max, val, key) {
            var cnt = h('span', { class: 'man-count', text: (val || '').length + '/' + max });
            var inp = h('textarea', { id: id, maxlength: String(max), rows: '2', placeholder: '선택', oninput: function () { st[key] = P.cleanText(inp.value, max); cnt.textContent = inp.value.length + '/' + max; save(); edit(key); queue(); } });
            inp.value = val || '';
            return h('div', { class: 'man-field' }, [h('label', { for: id }, [label, cnt]), inp]);
        };
        var s2 = h('section', { class: 'man-step', id: 'step-2' }, [
            h('h2', { text: '2. 이름과 사진' }),
            h('div', { class: 'man-field' }, [h('label', { for: 'm-name', text: '강아지 이름' }), nameIn]),
            h('div', { class: 'man-photo' }, [photoThumb, h('div', {}, [
                h('label', { for: 'm-photo', class: 'btn btn-ghost', text: '사진 고르기 (선택)' }), fileIn, delBtn,
                h('p', { class: 'check-note', text: 'JPG, PNG, WEBP, 15MB까지. 사진은 이 기기 안에서만 쓰고 서버로 보내지 않아요. 저장할 때 위치 같은 사진 정보는 빠져요.' }),
                photoMsg,
            ])]),
            h('p', { class: 'man-sub', text: '보호자가 알려 주고 싶은 것 (검사 결과와 따로 표시돼요)' }),
            field('m-likes', '좋아하는 것', 40, st.likes, 'likes'),
            field('m-dislikes', '불편해하는 상황', 40, st.dislikes, 'dislikes'),
            field('m-note', '다른 사람에게 부탁할 것', 60, st.note, 'note'),
        ]);
        // 3. 스타일
        var radios = function (name, map, cur, key) {
            return h('div', { class: 'chips', role: 'radiogroup', 'aria-label': name }, Object.keys(map).map(function (k) {
                var b = h('button', { type: 'button', class: 'chip', role: 'radio', 'aria-checked': String(k === cur), text: map[k], on: function () {
                    st[key] = k; save(); edit(key);
                    b.parentNode.querySelectorAll('[role=radio]').forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); });
                    queue();
                } });
                return b;
            }));
        };
        var s3 = h('section', { class: 'man-step', id: 'step-3' }, [h('h2', { text: '3. 설명서 스타일' }), h('p', { class: 'man-sub', text: '설명서 종류' }), radios('설명서 종류', CARDS, st.card, 'card'), h('p', { class: 'man-sub', text: '카드 테마' }), radios('카드 테마', THEMES, st.theme, 'theme')]);
        // 4. 미리보기
        var preview = h('div', { class: 'man-preview', 'aria-live': 'polite' }, [h('p', { class: 'check-note', text: '미리보기를 만드는 중이에요...' })]);
        var fmtNames = { feed: '피드 1080×1350', story: '스토리 1080×1920', og: '링크 미리보기 1200×630' };
        var s4 = h('section', { class: 'man-step', id: 'step-4' }, [h('h2', { text: '4. 미리보기' }), radios('미리보기 크기', fmtNames, st.fmt, 'fmt'), preview]);
        // 5. 공개 항목
        var check = function (key, label, desc) {
            var box = h('input', { type: 'checkbox', id: 'pub-' + key, onchange: function () { st.pub[key] = box.checked; save(); edit('public'); queue(); renderLinkInfo(); } });
            box.checked = !!st.pub[key];
            return h('label', { class: 'man-check', for: 'pub-' + key }, [box, h('span', {}, [h('b', { text: label }), h('small', { text: desc })])]);
        };
        var s5 = h('section', { class: 'man-step', id: 'step-5' }, [
            h('h2', { text: '5. 공개할 항목' }),
            h('p', { class: 'check-note', text: '고른 항목만 이미지와 공유 링크에 들어가요. 대표 성향(유형 이름)은 항상 들어가요.' }),
            check('name', '강아지 이름', '끄면 "우리 강아지"로 나와요'),
            check('photo', '사진', '저장하는 이미지에만 들어가고, 공유 링크에는 들어가지 않아요'),
            check('traits', '검사로 본 특성과 배려 안내', '점수는 들어가지 않고 문장만 들어가요'),
            check('owner', '보호자가 쓴 글', '좋아하는 것, 불편해하는 상황, 부탁할 것'),
        ]);
        // 6. 저장·공유
        var linkInfo = h('div', { class: 'man-linkinfo' });
        var shareBox = h('div', { class: 'man-share', hidden: true });
        var s6 = h('section', { class: 'man-step', id: 'step-6' }, [
            h('h2', { text: '6. 이미지 저장 또는 링크 공유' }),
            h('div', { class: 'check-actions' }, [
                h('button', { type: 'button', class: 'btn', text: '피드 이미지 저장', on: function (e) { download('feed', e.currentTarget); } }),
                h('button', { type: 'button', class: 'btn btn-ghost', text: '스토리 이미지 저장', on: function (e) { download('story', e.currentTarget); } }),
            ]),
            h('p', { class: 'check-note', text: '휴대폰에서는 공유 창이 열려 인스타그램, 카카오톡에 바로 올릴 수 있어요. 인스타그램에 자동으로 올리지는 않아요.' }),
            h('h3', { class: 'man-sub', text: '공유 링크' }),
            linkInfo,
            h('button', { type: 'button', class: 'btn btn-ghost', text: '이 내용으로 공유 링크 만들기', on: makeLink }),
            shareBox,
        ]);

        var steps = ['결과 확인', '이름·사진', '스타일', '미리보기', '공개 항목', '저장·공유'];
        var nav = h('div', { class: 'man-steps', role: 'navigation', 'aria-label': '만드는 순서' }, steps.map(function (s, i) { return h('a', { href: '#step-' + (i + 1), text: (i + 1) + ' ' + s }); }));
        root.replaceChildren(nav, s1, s2, s3, s4, s5, s6);

        function paintThumb() {
            photoThumb.replaceChildren(photo ? h('img', { src: photoUrl, alt: '고른 사진' }) : h('img', { src: '/img/type-' + mine.type + '.webp', alt: '기본 그림' }));
            delBtn.hidden = !photo;
        }
        // 사진: 형식·크기 확인 → 1080px 안으로 줄여 JPEG로 다시 저장 (위치 등 사진 정보 제거)
        function onFile() {
            var f = fileIn.files && fileIn.files[0];
            fileIn.value = '';
            if (!f) return;
            if (!/^image\/(jpeg|png|webp|heic|heif)$/.test(f.type)) { photoMsg.textContent = 'JPG, PNG, WEBP 사진만 쓸 수 있어요.'; return; }
            if (f.size > 15 * 1024 * 1024) { photoMsg.textContent = '15MB보다 작은 사진을 골라 주세요.'; return; }
            photoMsg.textContent = '사진을 준비하는 중이에요...';
            var url = URL.createObjectURL(f), im = new Image();
            im.onload = function () {
                var k = Math.min(1, 1080 / Math.max(im.naturalWidth, im.naturalHeight));
                var c = document.createElement('canvas');
                c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
                c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
                URL.revokeObjectURL(url);
                photoUrl = c.toDataURL('image/jpeg', 0.85);
                loadPhoto(function () {
                    var ok = store(PHOTO_KEY, photoUrl);
                    photoMsg.textContent = ok ? '사진을 넣었어요. 이 기기에만 저장돼요.' : '사진을 넣었어요. 저장 공간이 부족해 새로고침하면 다시 골라야 해요.';
                    edit('photo'); paintThumb(); queue();
                });
            };
            im.onerror = function () { URL.revokeObjectURL(url); photoMsg.textContent = '이 사진은 열 수 없어요. 다른 사진을 골라 주세요. (아이폰 HEIC 사진은 사파리에서만 열려요)'; };
            im.src = url;
        }
        function loadPhoto(cb) {
            if (!photoUrl) { photo = null; return cb && cb(); }
            var im = new Image();
            im.onload = function () { photo = im; if (cb) cb(); };
            im.onerror = function () { photo = null; photoUrl = null; store(PHOTO_KEY, null); if (cb) cb(); };
            im.src = photoUrl;
        }

        var timer = null, busy = false, again = false;
        function queue() { clearTimeout(timer); timer = setTimeout(renderPreview, 250); }
        function renderPreview() {
            if (busy) { again = true; return; }
            busy = true;
            MungCard.profile(cardData(st.fmt)).then(function (c) {
                c.setAttribute('role', 'img');
                c.setAttribute('aria-label', CARDS[st.card] + ' 미리보기');
                preview.replaceChildren(c);
                if (!generated) { generated = true; track('guide_generate', { type: mine.type, card: st.card.toLowerCase(), has_scores: !!mine.scores }); }
            }).catch(function () {
                preview.replaceChildren(h('p', { class: 'check-note', text: '미리보기를 만들지 못했어요. 새로고침해 주세요.' }));
            }).then(function () { busy = false; if (again) { again = false; renderPreview(); } });
        }
        function download(fmt, btn) {
            var label = btn.textContent;
            btn.textContent = '이미지 만드는 중...'; btn.disabled = true;
            track('guide_image_download', { format: fmt, card: st.card.toLowerCase(), theme: st.theme, has_photo: !!(photo && st.pub.photo) });
            MungCard.profile(cardData(fmt))
                .then(function (c) { return MungCard.deliver(c, 'mungtest-guide-' + fmt + '.png', CARDS[st.card]); })
                .catch(function () { alert('이미지를 만들지 못했어요. 다시 시도해 주세요.'); })
                .then(function () { btn.textContent = label; btn.disabled = false; });
        }

        // 공유 링크에 들어갈 내용 (보이는 그대로)
        function payload() {
            var g = guide();
            var ids = [];
            if (st.pub.traits) [g.traits, g.env, g.approach, g.activities].forEach(function (a) { a.forEach(function (x) { if (x.source === 'test') ids.push(x.id); }); });
            var o = { v: 1, t: mine.type, k: st.card, r: ids };
            if (st.pub.name && st.name) o.n = st.name;
            if (st.pub.owner) { if (st.likes) o.l = st.likes; if (st.dislikes) o.d = st.dislikes; if (st.note) o.o = st.note; }
            return o;
        }
        function renderLinkInfo() {
            var o = payload(), list = ['대표 성향: ' + P.TYPES[o.t].name];
            if (o.n) list.push('이름: ' + o.n);
            if (o.r.length) list.push('검사로 본 특성 문장 ' + o.r.length + '개 (점수는 빠짐)');
            ['l', 'd', 'o'].forEach(function (k) { if (o[k]) list.push('보호자 글: ' + o[k]); });
            linkInfo.replaceChildren(h('p', { class: 'check-note', text: '링크에는 아래 내용만 들어가요. 사진과 점수는 들어가지 않아요.' }), h('ul', {}, list.map(function (t) { return h('li', { text: t }); })));
            shareBox.hidden = true;
        }
        function makeLink() {
            var o = payload();
            var url = location.origin + '/manual/s/' + o.t + '/#g=' + P.pack(o);
            track('guide_public_link_create', { card: o.k.toLowerCase(), with_name: !!o.n, with_owner_text: !!(o.l || o.d || o.o) });
            var shareText = (o.n || '우리 강아지') + '의 설명서를 만들었어요. 우리 강아지는 어떤 성향일까요?';
            var kakaoBtn = h('button', { type: 'button', class: 'btn', text: '카카오톡으로 보내기', on: function (e) {
                if (!kakaoReady()) { copy(url + '&via=link', e.currentTarget); track('guide_share_click', { method: 'link', card: o.k.toLowerCase() }); return; }
                try {
                    (Kakao.Share || Kakao.Link).sendDefault({ objectType: 'feed', content: { title: (o.n || '우리 강아지') + ' 설명서', description: P.TYPES[o.t].name + ' · ' + CARDS[o.k], imageUrl: location.origin + '/img/og-guide-' + o.t + '.jpg', link: { mobileWebUrl: url + '&via=kakao', webUrl: url + '&via=kakao' } }, buttons: [{ title: '설명서 보기', link: { mobileWebUrl: url + '&via=kakao', webUrl: url + '&via=kakao' } }] });
                    track('guide_share_click', { method: 'kakao', card: o.k.toLowerCase() });
                } catch (err) { copy(url + '&via=link', e.currentTarget); }
            } });
            var acts = [kakaoBtn];
            if (navigator.share) acts.push(h('button', { type: 'button', class: 'btn btn-ghost', text: '다른 앱으로 공유', on: function () {
                track('guide_share_click', { method: 'native', card: o.k.toLowerCase() });
                navigator.share({ title: document.title, text: shareText, url: url + '&via=native' }).catch(function () {});
            } }));
            acts.push(h('button', { type: 'button', class: 'btn btn-ghost', text: '링크 복사', on: function (e) { track('guide_share_click', { method: 'link', card: o.k.toLowerCase() }); copy(url + '&via=link', e.currentTarget); } }));
            shareBox.replaceChildren(
                h('div', { class: 'check-actions' }, acts),
                h('p', { class: 'check-note', text: '링크는 서버에 저장되지 않고 내용이 주소 안에 들어 있어요. 그래서 이미 보낸 링크를 나중에 취소할 수는 없어요. 공개 항목을 바꾸면 새 링크를 만들어 주세요.' }),
                h('button', { type: 'button', class: 'text-link', text: '공유 창 닫기', on: function () { shareBox.hidden = true; } })
            );
            shareBox.hidden = false;
        }

        loadPhoto(function () { paintThumb(); renderLinkInfo(); renderPreview(); });
    }

    // ---------------------------------------------------------------- 공유받은 설명서
    function shared(app) {
        var o = P.unpack(P.hashParam(location.hash, 'g'));
        var root = app.querySelector('[data-panel]');
        var t = o && P.TYPES[o.t] ? o.t : Number(app.getAttribute('data-manual-shared'));
        if (!o || !P.TYPES[o.t] || !CARDS[o.k]) {
            root.replaceChildren(h('h2', { class: 'check-q', text: '설명서 내용을 읽을 수 없어요' }), h('p', { text: '링크가 잘렸을 수 있어요. 보낸 사람에게 다시 받아 주세요.' }), h('a', { class: 'btn', href: '/manual/', text: '내 강아지 설명서 만들기' }));
            return;
        }
        // 받은 값은 다시 검증: 규칙 id만 문구로 바꾸고, 글은 길이 제한 후 textContent로만 넣는다
        var items = function (target) {
            return (Array.isArray(o.r) ? o.r : []).slice(0, 12).map(function (id) { return R.ruleById(String(id)); })
                .filter(function (r) { return r && r.target === target; }).map(function (r) { return { id: r.id, source: 'test', short: r.short, text: r.text }; });
        };
        var g = {
            typeName: P.TYPES[t].name, typeSub: P.TYPES[t].sub,
            traits: items('trait'), env: items('env'), activities: items('activity'),
            approach: items('approach').concat([{ source: 'general', short: R.GENERAL_APPROACH.short, text: R.GENERAL_APPROACH.text }]),
            likes: o.l ? [{ source: 'owner', text: P.cleanText(o.l, 40) }] : [], dislikes: o.d ? [{ source: 'owner', text: P.cleanText(o.d, 40) }] : [],
            note: o.o ? [{ source: 'owner', text: P.cleanText(o.o, 60) }] : [],
        };
        var name = P.cleanText(o.n, 10) || '우리 강아지';
        var via = P.hashParam(location.hash, 'via') || 'unknown';
        // 같은 링크를 여러 번 열어도 방문은 한 번만 센다 (이 브라우저 기준, 링크 앞부분만 기억)
        var seenKey = 'g' + P.hashParam(location.hash, 'g').slice(0, 24);
        var seen = [];
        try { seen = JSON.parse(store('mung_seen_links') || '[]'); } catch (e) {}
        if (seen.indexOf(seenKey) === -1) {
            track('guide_public_link_visit', { via: /^[a-z]+$/.test(via) ? via : 'unknown', card: o.k.toLowerCase() });
            store('mung_seen_links', JSON.stringify(seen.concat([seenKey]).slice(-50)));
        }
        P.markShared(localStorage, 'guide');
        var me = P.readMine(localStorage);
        var ctas = me
            ? [h('a', { class: 'btn', href: '/manual/', text: '내 강아지 설명서 만들기' }), h('a', { class: 'btn btn-ghost', href: '/match/', text: '친구와 궁합 비교하기' })]
            : [h('a', { class: 'btn', href: '/?start=true', text: '우리 강아지도 검사하기' }), h('a', { class: 'btn btn-ghost', href: '/manual/', text: '설명서가 뭔지 보기' })];
        root.replaceChildren(
            h('p', { class: 'check-eyebrow', text: '공유받은 ' + CARDS[o.k] }),
            h('div', { class: 'man-shared-head' }, [h('img', { src: '/img/type-' + t + '.webp', alt: '', width: '96', height: '96' }), h('h2', { class: 'check-q', text: name + '의 설명서' })]),
            docView(g),
            h('p', { class: 'check-note', text: '보호자가 기질검사에 답한 평소 모습과 직접 쓴 내용이에요. 실제로 만날 땐 보호자에게 먼저 물어보고, 강아지의 몸짓을 살펴 주세요.' }),
            h('div', { class: 'check-actions' }, ctas)
        );
        history.replaceState(null, '', location.pathname + '#g=' + P.hashParam(location.hash, 'g'));
    }

    document.addEventListener('DOMContentLoaded', function () {
        var app = document.querySelector('[data-manual]');
        if (!app) return;
        if (app.hasAttribute('data-manual-shared')) shared(app); else editor(app);
    });
})();
