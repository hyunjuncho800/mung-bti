// 멍시그널 3D 화면: 장면, 카메라, 그리기 반복, 시점, 부위 누르기. 멍시그널 본 화면과 멍퀴즈가 함께 쓴다.
// 성능: 휴대폰 DPR·30fps 상한, 화면 밖·숨긴 탭·일시정지면 그리기 멈춤, 페이지를 떠나면 GPU 자원 정리.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { createDog } from 'signal-dog';
import { createProps } from 'signal-props';
import { createEnv } from 'signal-env';

// state: { target, motion, paused, loop, speed } 를 읽어 매 프레임 강아지 자세를 만든다. 모델을 못 불러오면 예외를 던진다.
// opts.onPick(part): 강아지를 짧게 누른 부위, opts.onFail(msg): 그리기 도중 문제가 생겼을 때
export async function createView(stage, state, D, opts = {}) {
    // 견종: 무대의 data-models에 견종별 모델 주소. state.breed로 고르고, 바꾸면 모델만 갈아 끼운다.
    const MODELS = JSON.parse(stage.dataset.models);
    const load = b => createDog(MODELS[b] || MODELS.shiba, b);
    let breed = MODELS[state.breed] ? state.breed : 'shiba';
    let dog = await load(breed);

    const coarse = matchMedia('(pointer: coarse)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: 'low-power', alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', '강아지 3D 화면. 끌어서 돌리고, 두 손가락이나 휠로 확대해요.');
    canvas.setAttribute('role', 'img');
    stage.prepend(canvas);

    const scene = new THREE.Scene();
    const hemi = new THREE.HemisphereLight(0xffffff, 0x8a7a66, 1.6);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(1.5, 3, 2);
    scene.add(sun);
    // 배경(바닥·벽·하늘·소품). 조명 밝기는 배경에 맞춤 (밤 방은 어둡게)
    const env = createEnv(scene);
    const setEnv = id => { const f = env.set(id); hemi.intensity = 1.6 * f; sun.intensity = 1.6 * f; };
    setEnv(state.env || 'home');
    scene.add(dog.root);
    // 멍상황 소품 (상대 강아지는 편안한 자세로 꼬리를 살랑)
    const otherDogPose = Object.assign({}, D.DEFAULTS, D.BEHAVIORS[0].pose, { wagSpeed: 0.4, wagRange: 0.5 });
    const props = createProps(scene, { loadOther: () => load(breed === 'shiba' ? 'husky' : 'shiba'), otherDogPose }); // 상대 강아지는 다른 견종

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0.42, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 0.45;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    // 시점: [카메라 위치, 바라볼 곳]. face는 귀·눈·입 신호를 가까이 보는 시점
    const BODY = [0, 0.42, 0];
    const VIEWS = { angle: [[1.5, 0.85, 1.9], BODY], front: [[0, 0.62, 2.4], BODY], side: [[2.4, 0.62, 0], BODY], back: [[0, 0.75, -2.4], BODY], face: [[0.3, 0.76, 1.02], [0, 0.69, 0.45]], scene: [[3.9, 1.9, 1.0], [0.1, 0.62, 1.0]] };
    camera.position.set(...VIEWS.angle[0]);


    // 자세: 지금 값이 목표 값으로 부드럽게 따라감
    // 자세(서기·앉기·엎드리기·눕기)와 냄새 맡기·앞발 들기는 0~1 무게로 바꿔 부드럽게 섞는다
    const W = { sitW: t => t.posture === 'sit', lieW: t => t.posture === 'lie', backW: t => t.posture === 'back', sniffW: t => t.sniff, pawW: t => t.paw, jumpW: t => t.jump };
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
        // 얼어붙기는 갑자기 멈추는 게 특징이라 빠르게 바꿈
        const k = 1 - Math.exp(-dt * (state.target.freeze ? 12 : 4)), kw = 1 - Math.exp(-dt * 2.5);
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
        if (props.update(simT, state.paused ? 0 : dt * state.speed)) busy = true;
        renderer.render(scene, camera);
        frames++;
        if (now - fpsT >= 1000) { stage.dataset.fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
        if (busy) schedule();
    }
    // 휴대폰: 위아래로 밀면 화면 스크롤, 옆으로 밀면 회전 (OrbitControls가 none으로 바꾼 걸 되돌림)
    canvas.style.touchAction = 'pan-y';
    // 짧게 누르면(끌지 않고) 그 자리의 부위 설명
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let down = null;
    canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    canvas.addEventListener('pointerup', e => {
        if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.t > 500) return;
        const r = canvas.getBoundingClientRect();
        ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const part = dog.pick(ray);
        if (part && opts.onPick) opts.onPick(part);
    });
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
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); if (opts.onFail) opts.onFail('3D 화면이 멈췄어요. 새로고침하면 다시 볼 수 있어요.'); });
    addEventListener('pagehide', () => {
        cancelAnimationFrame(raf);
        controls.dispose(); dog.dispose(); props.dispose(); env.dispose(); renderer.dispose();
    });

    const view = {
        wake,
        // 공유 이미지용: 바닥과 배경 없이 강아지만 지금 화면 그대로 복사
        capture(w = 900, h = 760) {
            const bg = scene.background;
            scene.background = null; env.group.visible = false;
            renderer.render(scene, camera);
            const c = document.createElement('canvas'); c.width = w; c.height = h;
            const src = renderer.domElement, k = Math.max(w / src.width, h / src.height);
            c.getContext('2d').drawImage(src, (w - src.width * k) / 2, (h - src.height * k) / 2, src.width * k, src.height * k);
            scene.background = bg; env.group.visible = true;
            wake();
            return c;
        },
        poseChanged() { if (state.paused) snap(); wake(); },
        // 행동을 고르면 그 행동의 동작을 바로 한 번 보여 줌
        replay() { for (const a in EVERY) if (state.target[a]) { timers[a] = 0; dog[a](); } wake(); },
        play(k) { if (EVERY[k]) { timers[k] = 0; dog[k](); } wake(); },
        setScene(sc) { props.setScene(sc); wake(); },
        setEnv(id) { if (env.id !== id) { setEnv(id); wake(); } },
        async setBreed(b) {
            if (!MODELS[b] || b === breed) return;
            const next = await load(b);
            scene.remove(dog.root); dog.dispose();
            dog = next; breed = b; scene.add(dog.root);
            this.replay();
        },
        setView(v) {
            let [pos, target] = VIEWS[v] || VIEWS.angle;
            follow = v === 'face';
            if (follow) { dog.headWorld(headV); target = headV.toArray(); pos = headV.clone().add(FACE_OFFSET).toArray(); }
            // 상황 장면은 사람·소품까지 보여야 해서 좁은 화면(휴대폰)에서는 더 멀리서 봄
            if (v === 'scene' && camera.aspect < 1.1) pos = pos.map((x, i) => target[i] + (x - target[i]) * 1.5);
            tween = { from: camera.position.clone(), to: new THREE.Vector3(...pos), fromT: controls.target.clone(), toT: new THREE.Vector3(...target), t0: performance.now() };
            wake();
        },
    };
    stage.classList.add('is-ready');
    resize();
    return view;
}
