// 멍시그널 화면: 멍관찰(행동 고르기 + 설명), 멍조작(몸 신호 조절 + 규칙 해석), 3D 화면 조작.
// 3D는 WebGL이 될 때만 불러온다. 안 되면 설명과 조작 해석만 동작한다.
const D = window.MungSignalData, R = window.MungSignalRules;
const app = document.querySelector('[data-signal]');
const track = (n, p) => window.mungTrack && window.mungTrack(n, p);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const state = {
    behavior: 'relaxed',
    target: {}, // 지금 보여 줄 자세 (몸 신호 값 + 토글)
    motion: {}, // 모양만 바꾸는 반복 동작 (tremble, wiggle)
    breed: 'shiba',
    paused: matchMedia('(prefers-reduced-motion: reduce)').matches,
    loop: true,
    speed: 1,
};
let view3d = null; // 3D가 준비되면 { wake, setView, snap, reset }

// ---------------------------------------------------------------- 자세와 해석
// 행동의 자세를 강아지에 적용 (extra: 상황별로 덧붙이는 값)
function applyPose(id, extra) {
    const b = D.BEHAVIORS.find(x => x.id === id) || D.BEHAVIORS[0];
    state.target = Object.assign({}, D.DEFAULTS, b.pose, extra || {});
    state.motion = b.motion;
    syncControls();
    poseChanged();
    if (view3d) view3d.replay();
    return b;
}
function setBehavior(id, fromUser) {
    const b = applyPose(id);
    state.behavior = b.id;
    app.querySelectorAll('[data-behavior]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.behavior === b.id)));
    app.querySelectorAll('[data-explain]').forEach(el => { el.hidden = el.dataset.explain !== b.id; });
    if (fromUser) { track('signal_behavior', { behavior: b.id }); if (L) L.markSeen(LS, b.id); }
    renderLearn();
}

// ---------------------------------------------------------------- 학습 기록과 기질검사 추천 (이 브라우저에만 저장)
const L = window.MungLearn;
const LS = (() => { try { localStorage.getItem('x'); return localStorage; } catch (e) { return { getItem: () => null, setItem() {} }; } })();
function renderLearn() {
    const box = app.querySelector('[data-learn]');
    if (!box || !L) return;
    const seen = L.seenList(LS);
    app.querySelectorAll('[data-behavior]').forEach(el => el.classList.toggle('is-seen', seen.includes(el.dataset.behavior)));
    const mine = window.MungProfile ? window.MungProfile.readMine(LS) : null;
    const tips = L.recommend(mine);
    const rec = L.loadRecord(LS);
    const parts = [];
    if (seen.length) parts.push(`<p>행동 ${D.BEHAVIORS.length}가지 중 <b>${seen.length}가지</b>를 살펴봤어요.${rec.best !== null ? ` 멍퀴즈 최고 점수는 ${rec.best}점이에요.` : ''}</p>`);
    if (tips.length) parts.push(`<p><b>${esc(mine.name || '우리 강아지')}(${esc(mine.typeName)})</b> 보호자라면 먼저 살펴보면 좋은 신호</p>
        <ul>${tips.map(t => `<li><a href="#${t.scene ? 's-' + t.scene : 'b-' + t.behavior}" data-go="${t.scene ? 's:' + t.scene : 'b:' + t.behavior}">${esc(D.BEHAVIORS.find(x => x.id === t.behavior).name)}</a> ${esc(t.why)}</li>`).join('')}</ul>
        <p class="check-note">기질검사 결과로 실제 감정을 알 수는 없어요. 먼저 익혀 두면 좋은 신호를 골랐어요.</p>`);
    box.innerHTML = parts.join('');
    box.hidden = !parts.length;
    box.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        const [k, id] = a.dataset.go.split(':');
        if (k === 'b') setBehavior(id, true);
        else { state.scene = id; app.querySelector('[data-tab="scene"]').click(); }
    }));
}

// ---------------------------------------------------------------- 멍상황
const SC = window.MungSignalScenes;
function selectScene(id, fromUser) {
    const sc = SC.SCENES.find(x => x.id === id) || SC.SCENES[0];
    state.scene = sc.id;
    state.alt = false;
    app.querySelectorAll('[data-scene]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.scene === sc.id)));
    app.querySelectorAll('[data-scene-article]').forEach(el => { el.hidden = el.dataset.sceneArticle !== sc.id; });
    app.querySelectorAll('[data-alt]').forEach(b => { b.textContent = '다른 강아지 모습 보기'; b.setAttribute('aria-pressed', 'false'); });
    applyPose(sc.behavior, sc.pose);
    state.env = sc.env;
    if (view3d) { view3d.setEnv(sc.env); view3d.setScene(sc); view3d.setView('scene'); }
    if (fromUser) track('signal_scene', { scene: sc.id });
}
function toggleAlt(btn) {
    const sc = SC.SCENES.find(x => x.id === state.scene);
    state.alt = !state.alt;
    if (state.alt) applyPose(sc.alt.behavior, sc.alt.pose); else applyPose(sc.behavior, sc.pose);
    btn.textContent = state.alt ? '원래 모습 보기' : '다른 강아지 모습 보기';
    btn.setAttribute('aria-pressed', String(state.alt));
}

function poseChanged() {
    renderResult();
    renderPart();
    if (view3d) view3d.poseChanged();
}

function renderResult() {
    const r = R.interpret(state.target);
    const box = app.querySelector('[data-result]');
    const list = (title, items) => items.length ? `<h4>${title}</h4><ul>${items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
    box.className = 'signal-result tone-' + r.tone;
    box.innerHTML = `<p class="signal-result-title">${esc(r.title)}</p>` +
        r.readings.map(x => `<p><b>${esc(x.title)}</b> ${esc(x.text)}</p>`).join('') +
        list('눈에 띄는 신호', r.signals) + list('함께 확인할 것', r.checks) + list('보호자는 이렇게', r.actions);
}

// ---------------------------------------------------------------- 신체 부위 설명
function selectPart(id) {
    state.part = state.part === id ? null : id;
    app.querySelectorAll('[data-part]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.part === state.part)));
    renderPart();
    if (state.part) track('signal_part', { part: state.part });
}
function renderPart() {
    const box = app.querySelector('[data-part-info]');
    const info = state.part && R.partInfo(state.part, state.target);
    box.hidden = !info;
    if (!info) return;
    const ul = xs => `<ul>${xs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    box.innerHTML = `<h3>${esc(info.name)}</h3><h4>지금 보이는 모습</h4><p>${esc(info.observe)}</p><h4>이럴 수 있어요</h4><p>${esc(info.meaning)}</p>` +
        `<h4>함께 확인할 신호</h4>${ul(info.check)}<h4>보호자는 이렇게</h4>${ul(info.action)}<h4>이렇게 오해하기 쉬워요</h4>${ul(info.mistakes)}`;
}

// ---------------------------------------------------------------- 멍조작: 슬라이더와 토글
function buildControls() {
    const box = app.querySelector('[data-controls]');
    box.innerHTML = D.PARAMS.map(p => `
        <label class="signal-slider">
            <span>${esc(p.label)}</span>
            <input type="range" min="${p.min}" max="${p.max}" step="${p.step}" data-param="${p.id}">
            <small><span>${esc(p.left)}</span><span>${esc(p.right)}</span></small>
        </label>`).join('') +
        `<p class="signal-group-label">자세</p><div class="chips signal-toggles">${D.POSTURES.map(t => `<button type="button" class="chip" data-posture="${t.id}" aria-pressed="false">${esc(t.label)}</button>`).join('')}</div>` +
        `<p class="signal-group-label">동작과 상황</p><div class="chips signal-toggles">${D.TOGGLES.map(t => `<button type="button" class="chip" data-toggle="${t.id}" aria-pressed="false">${esc(t.label)}</button>`).join('')}</div>`;
    const used = {};
    box.addEventListener('input', e => {
        const k = e.target.dataset.param;
        if (!k) return;
        state.target[k] = parseFloat(e.target.value);
        poseChanged();
        if (!used[k]) { used[k] = 1; track('signal_control', { param: k.replace(/[A-Z]/g, c => '_' + c.toLowerCase()) }); }
    });
    box.addEventListener('click', e => {
        const ps = e.target.dataset && e.target.dataset.posture;
        if (ps) { state.target.posture = ps; syncControls(); poseChanged(); return; }
        const k = e.target.dataset && e.target.dataset.toggle;
        if (!k) return;
        state.target[k] = !state.target[k];
        e.target.setAttribute('aria-pressed', String(state.target[k]));
        if (view3d && state.target[k]) view3d.play(k);
        poseChanged();
    });
}
function syncControls() {
    app.querySelectorAll('[data-param]').forEach(i => { i.value = state.target[i.dataset.param]; });
    app.querySelectorAll('[data-toggle]').forEach(b => b.setAttribute('aria-pressed', String(!!state.target[b.dataset.toggle])));
    app.querySelectorAll('[data-posture]').forEach(b => b.setAttribute('aria-pressed', String(state.target.posture === b.dataset.posture)));
}

// ---------------------------------------------------------------- 탭, 재생 조작
function bindUi() {
    app.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => {
        const was = state.tab;
        state.tab = t.dataset.tab;
        app.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === t)));
        app.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.tab; });
        if (state.tab === 'scene') selectScene(state.scene);
        else if (was === 'scene') { state.env = 'home'; if (view3d) { view3d.setEnv('home'); view3d.setScene(null); view3d.setView('angle'); } setBehavior(state.behavior); }
    }));
    app.querySelectorAll('[data-scene]').forEach(b => b.addEventListener('click', () => selectScene(b.dataset.scene, true)));
    app.querySelectorAll('[data-alt]').forEach(b => b.addEventListener('click', () => toggleAlt(b)));
    app.querySelectorAll('details[data-verdict]').forEach(d => d.addEventListener('toggle', () => {
        if (d.open) track('signal_scene_choice', { scene: state.scene, verdict: d.dataset.verdict });
    }));
    app.querySelectorAll('[data-behavior]').forEach(b => b.addEventListener('click', () => setBehavior(b.dataset.behavior, true)));
    app.querySelectorAll('[data-part]').forEach(b => b.addEventListener('click', () => selectPart(b.dataset.part)));
    const pause = app.querySelector('[data-pause]');
    const paintPause = () => { pause.textContent = state.paused ? '재생' : '일시정지'; pause.setAttribute('aria-pressed', String(state.paused)); };
    pause.addEventListener('click', () => { state.paused = !state.paused; paintPause(); if (view3d) view3d.wake(); });
    paintPause();
    const loop = app.querySelector('[data-loop]');
    loop.addEventListener('click', () => { state.loop = !state.loop; loop.setAttribute('aria-pressed', String(state.loop)); });
    loop.setAttribute('aria-pressed', 'true');
    app.querySelector('[data-speed]').addEventListener('change', e => { state.speed = parseFloat(e.target.value) || 1; });
    app.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => view3d && view3d.setView(b.dataset.view)));
    app.querySelector('[data-reset]').addEventListener('click', () => {
        state.speed = 1; app.querySelector('[data-speed]').value = '1';
        setBehavior(state.behavior);
        if (view3d) view3d.setView('angle');
    });
}


// ---------------------------------------------------------------- 견종 고르기 (이 브라우저에 기억)
function readBreed() { try { const b = localStorage.getItem('mung_signal_breed'); return b === 'husky' ? 'husky' : 'shiba'; } catch (e) { return 'shiba'; } }
function bindBreed(scope, getView) {
    const paint = () => scope.querySelectorAll('[data-breed]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.breed === state.breed)));
    scope.querySelectorAll('[data-breed]').forEach(b => b.addEventListener('click', () => {
        if (b.dataset.breed === state.breed) return;
        state.breed = b.dataset.breed;
        try { localStorage.setItem('mung_signal_breed', state.breed); } catch (e) {}
        paint();
        track('signal_breed', { breed: state.breed });
        const v = getView();
        if (v) v.setBreed(state.breed);
    }));
    paint();
}

// ---------------------------------------------------------------- 3D
function hasWebGL() {
    if (/[?&]nowebgl\b/.test(location.search)) return false; // 대체 화면 확인용
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
}

function fallback(stage, msg) {
    stage.classList.add('is-fallback');
    stage.querySelector('[data-stage-msg]').textContent = msg;
    app.querySelectorAll('[data-view], [data-pause], [data-loop], [data-speed]').forEach(el => { el.disabled = true; });
}

async function start3d() {
    const stage = app.querySelector('[data-stage]');
    if (!hasWebGL()) { fallback(stage, '이 기기에서는 3D 화면을 볼 수 없어요. 설명과 멍조작 해석은 그대로 쓸 수 있어요.'); return; }
    try {
        const { createView } = await import('signal-view');
        view3d = await createView(stage, state, D, {
            onPick: part => { state.part = null; selectPart(part); },
            onFail: msg => fallback(stage, msg),
        });
    } catch (e) { fallback(stage, '3D 화면을 불러오지 못했어요. 새로고침해 보세요.'); return; }
    view3d.poseChanged();
    view3d.replay();
    if (state.tab === 'scene') selectScene(state.scene);
}

if (app && D && R) {
    state.breed = readBreed();
    buildControls();
    bindUi();
    bindBreed(app, () => view3d);
    // 주소 뒤 #b-행동 또는 #s-상황으로 바로 열기 (가이드 페이지의 "3D로 보기" 링크)
    const h = location.hash.slice(1);
    const bh = h.startsWith('b-') && D.BEHAVIORS.find(b => b.id === h.slice(2));
    const sh = h.startsWith('s-') && SC.SCENES.find(x => x.id === h.slice(2));
    setBehavior(bh ? bh.id : 'relaxed');
    if (sh) { state.scene = sh.id; app.querySelector('[data-tab="scene"]').click(); }
    if (bh || sh) app.scrollIntoView({ block: 'start' });
    track('signal_view', { webgl: hasWebGL() });
    start3d();
}
