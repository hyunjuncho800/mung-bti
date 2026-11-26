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
    paused: matchMedia('(prefers-reduced-motion: reduce)').matches,
    loop: true,
    speed: 1,
};
let view3d = null; // 3D가 준비되면 { wake, setView, snap, reset }

// ---------------------------------------------------------------- 자세와 해석
function setBehavior(id, fromUser) {
    const b = D.BEHAVIORS.find(x => x.id === id) || D.BEHAVIORS[0];
    state.behavior = b.id;
    state.target = Object.assign({}, D.DEFAULTS, b.pose);
    state.motion = b.motion;
    app.querySelectorAll('[data-behavior]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.behavior === b.id)));
    app.querySelectorAll('[data-explain]').forEach(el => { el.hidden = el.dataset.explain !== b.id; });
    syncControls();
    poseChanged();
    if (view3d) view3d.replay();
    if (fromUser) track('signal_behavior', { behavior: b.id });
}

function poseChanged() {
    renderResult();
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
        app.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === t)));
        app.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== t.dataset.tab; });
    }));
    app.querySelectorAll('[data-behavior]').forEach(b => b.addEventListener('click', () => setBehavior(b.dataset.behavior, true)));
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

// ---------------------------------------------------------------- 3D
function hasWebGL() {
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
    let THREE, OrbitControls, dog;
    try {
        let createDog;
        [THREE, { OrbitControls }, { createDog }] = await Promise.all([import('three'), import('three/addons/OrbitControls.js'), import('signal-dog')]);
        dog = await createDog(stage.dataset.model);
    } catch (e) { fallback(stage, '3D 화면을 불러오지 못했어요. 새로고침해 보세요.'); return; }

    const coarse = matchMedia('(pointer: coarse)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', '강아지 3D 화면. 끌어서 돌리고, 두 손가락이나 휠로 확대해요.');
    canvas.setAttribute('role', 'img');
    stage.prepend(canvas);

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7a66, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(1.5, 3, 2);
    scene.add(sun);
    const floorGeo = new THREE.CircleGeometry(1.4, 48), floorMat = new THREE.MeshLambertMaterial({ color: 0xdfe8df });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    scene.add(dog.root);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0.42, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 0.45;
    controls.maxDistance = 4;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    // 시점: [카메라 위치, 바라볼 곳]. face는 귀·눈·입 신호를 가까이 보는 시점
    const BODY = [0, 0.42, 0];
    const VIEWS = { angle: [[1.5, 0.85, 1.9], BODY], front: [[0, 0.62, 2.4], BODY], side: [[2.4, 0.62, 0], BODY], back: [[0, 0.75, -2.4], BODY], face: [[0.3, 0.76, 1.02], [0, 0.69, 0.45]] };
    camera.position.set(...VIEWS.angle[0]);

    const theme = () => { const dark = document.body.classList.contains('dark-mode'); scene.background = new THREE.Color(dark ? 0x1e2521 : 0xf7faf6); floorMat.color.set(dark ? 0x2b352f : 0xdfe8df); };
    theme();
    new MutationObserver(() => { theme(); wake(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // 자세: 지금 값이 목표 값으로 부드럽게 따라감
    // 자세(서기·앉기·엎드리기·눕기)와 냄새 맡기·앞발 들기는 0~1 무게로 바꿔 부드럽게 섞는다
    const W = { sitW: t => t.posture === 'sit', lieW: t => t.posture === 'lie', backW: t => t.posture === 'back', sniffW: t => t.sniff, pawW: t => t.paw };
    const cur = Object.assign({}, state.target);
    const copyFlags = () => {
        cur.freeze = state.target.freeze; cur.bowl = state.target.bowl;
        cur.tremble = !!state.motion.tremble; cur.wiggle = !!state.motion.wiggle;
    };
    const snap = () => { Object.assign(cur, state.target); for (const k in W) cur[k] = W[k](state.target) ? 1 : 0; copyFlags(); };
    snap();
    // 한 번씩 하는 동작: 반복 재생이면 주기마다 다시
    const EVERY = { lick: 3, yawn: 5, shake: 4 };
    const timers = { lick: 0, yawn: 0, shake: 0 };
    let simT = 0, tween = null, interacting = false, dirty = true, follow = false;
    const headV = new THREE.Vector3(), headD = new THREE.Vector3(), FACE_OFFSET = new THREE.Vector3(0.3, 0.07, 0.57);
    const step = dt => {
        const k = 1 - Math.exp(-dt * 4), kw = 1 - Math.exp(-dt * 2.5);
        D.PARAMS.forEach(p => { cur[p.id] += (state.target[p.id] - cur[p.id]) * k; });
        for (const w in W) cur[w] += ((W[w](state.target) ? 1 : 0) - cur[w]) * kw;
        copyFlags();
        for (const a in EVERY) if (state.loop && state.target[a] && (timers[a] += dt) > EVERY[a]) { timers[a] = 0; dog[a](); }
    };

    // 그리기: 보이는 동안만, 휴대폰은 30fps 상한. 일시정지 중엔 조작할 때만 그림.
    const minFrame = 1000 / (coarse ? 30 : 60);
    let raf = 0, last = performance.now(), onScreen = true, frames = 0, fpsT = last;
    const visible = () => onScreen && !document.hidden;
    function schedule() { if (!raf && visible()) raf = requestAnimationFrame(frame); }
    function wake() { dirty = true; schedule(); }
    function frame(now) {
        raf = 0;
        if (now - last < minFrame - 2) { schedule(); return; }
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        let busy = !state.paused || interacting || dirty;
        dirty = false;
        if (!state.paused) { simT += dt * state.speed; step(dt * state.speed); }
        if (tween) {
            const t = Math.min((now - tween.t0) / 600, 1), e = t * t * (3 - 2 * t);
            camera.position.lerpVectors(tween.from, tween.to, e);
            controls.target.lerpVectors(tween.fromT, tween.toT, e);
            if (t >= 1) tween = null;
            busy = true;
        }
        // 얼굴 시점: 자세가 바뀌어도 머리를 따라감 (돌려 보는 각도는 그대로)
        if (follow && !tween) {
            dog.headWorld(headV);
            headD.subVectors(headV, controls.target).multiplyScalar(1 - Math.exp(-dt * 5));
            if (headD.lengthSq() > 1e-8) { controls.target.add(headD); camera.position.add(headD); busy = true; }
        }
        if (controls.update()) busy = true;
        dog.update(cur, simT, state.paused ? 0 : dt * state.speed);
        renderer.render(scene, camera);
        frames++;
        if (now - fpsT >= 1000) { stage.dataset.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
        if (busy) schedule();
    }
    controls.addEventListener('start', () => { interacting = true; tween = null; wake(); });
    controls.addEventListener('end', () => { interacting = false; wake(); });
    controls.addEventListener('change', schedule);

    const resize = () => {
        const w = stage.clientWidth, h = stage.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        wake();
    };
    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (onScreen) { last = performance.now(); wake(); } }).observe(stage);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); wake(); } });
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); fallback(stage, '3D 화면이 멈췄어요. 새로고침하면 다시 볼 수 있어요.'); });
    addEventListener('pagehide', () => {
        cancelAnimationFrame(raf);
        controls.dispose(); dog.dispose(); floorGeo.dispose(); floorMat.dispose(); renderer.dispose();
    });

    view3d = {
        wake,
        poseChanged() { if (state.paused) snap(); wake(); },
        // 행동을 고르면 그 행동의 동작을 바로 한 번 보여 줌
        replay() { for (const a in EVERY) if (state.target[a]) { timers[a] = 0; dog[a](); } wake(); },
        play(k) { if (EVERY[k]) { timers[k] = 0; dog[k](); } wake(); },
        setView(v) {
            let [pos, target] = VIEWS[v] || VIEWS.angle;
            follow = v === 'face';
            if (follow) { dog.headWorld(headV); target = headV.toArray(); pos = headV.clone().add(FACE_OFFSET).toArray(); }
            tween = { from: camera.position.clone(), to: new THREE.Vector3(...pos), fromT: controls.target.clone(), toT: new THREE.Vector3(...target), t0: performance.now() };
            wake();
        },
    };
    stage.classList.add('is-ready');
    resize();
    view3d.poseChanged();
    view3d.replay();
}

if (app && D && R) {
    buildControls();
    bindUi();
    setBehavior('relaxed');
    track('signal_view', { webgl: hasWebGL() });
    start3d();
}
