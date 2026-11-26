// 멍시그널 3D 강아지: Quaternius의 시바견 모델(CC0, models/README.txt)에 몸 신호 값을 뼈대 회전으로 연결한다.
// 모델에는 입·혀·눈꺼풀 뼈대가 없어서, 이빨·혀·입 안·눈꺼풀은 머리 뼈에 작은 부품을 붙여 만든다.
// 좌표: 모델 공간 기준 x = 강아지 왼쪽, y = 위, z = 앞. 회전은 '부모가 처음 자세일 때의 모델 축' 기준.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const S = 0.27; // 모델 키 약 3.1 -> 화면에서 약 0.84
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const tri = (v, lo, mid, hi) => (v < 0 ? lerp(mid, lo, -v) : lerp(mid, hi, v));

// 견종별 설정: 재질 이름(털·흰 털·눈)과 머리에 붙일 부품 위치(처음 자세의 모델 좌표). 두 모델은 뼈대가 같다.
export const BREEDS = {
    shiba: { name: '시바견', file: 'shiba', fur: 'Main', light: 'Main_Light', lightColor: 0xeee2cc, eyes: ['Eyes_White', 'Eyes_Pupil', 'Eyes_Black'],
        eye: [0.22, 2.707, 2.087], mouth: [0, 2.43, 2.33], tongue: [0, 2.43, 2.36], tongueOut: [0, 2.36, 2.5], tongueUp: [0, 2.55, 2.47], teeth: [0, 2.458, 2.425] },
    husky: { name: '허스키', file: 'husky', fur: 'Material', light: 'Material.001', lightColor: 0xf0f0ec, eyes: ['Material.003', 'Material.002'],
        eye: [0.204, 2.683, 1.963], mouth: [0, 2.42, 2.25], tongue: [0, 2.42, 2.28], tongueOut: [0, 2.35, 2.42], tongueUp: [0, 2.54, 2.39], teeth: [0, 2.448, 2.345] },
};

export async function createDog(url, breed = 'shiba') {
    const cfg = BREEDS[breed] || BREEDS.shiba;
    const gltf = await new GLTFLoader().loadAsync(url);
    const model = gltf.scene;
    const root = new THREE.Group();
    root.add(model);
    root.updateMatrixWorld(true);

    const B = {}, ends = {};
    let fur = null;
    model.traverse(o => {
        if (o.isBone) B[o.name] = o;
        else if (/_end$/.test(o.name)) ends[o.name] = o;
        if (o.isSkinnedMesh) {
            o.frustumCulled = false; // 자세를 크게 바꾸면 처음 경계 상자를 벗어남
            o.material.roughness = 1; o.material.metalness = 0;
            if (o.material.name === cfg.light) o.material.color.set(cfg.lightColor); // 흰 털을 밝게
            if (o.material.name === cfg.fur) fur = o.material;
        }
    });

    // 처음 자세 기록. 매 프레임 여기서 다시 시작해 값만큼 돌린다.
    const rest = {}, parentQ = {}, parentInvQ = {}, parentScale = {};
    Object.values(B).forEach(b => {
        rest[b.name] = { q: b.quaternion.clone(), p: b.position.clone(), s: b.scale.clone(), wq: b.getWorldQuaternion(new THREE.Quaternion()) };
        parentQ[b.name] = b.parent.getWorldQuaternion(new THREE.Quaternion());
        parentInvQ[b.name] = parentQ[b.name].clone().invert();
        parentScale[b.name] = b.parent.getWorldScale(new THREE.Vector3()).x;
    });
    const resetBones = () => Object.values(B).forEach(b => { const r = rest[b.name]; b.quaternion.copy(r.q); b.position.copy(r.p); b.scale.copy(r.s); });

    const e = new THREE.Euler(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), tv = new THREE.Vector3();
    function rotQ(name, q) {
        qb.copy(parentInvQ[name]).multiply(q).multiply(parentQ[name]);
        B[name].quaternion.premultiply(qb);
    }
    const rot = (name, x, y = 0, z = 0) => { if (x || y || z) rotQ(name, qa.setFromEuler(e.set(x, y, z, 'YXZ'))); };
    const rotAxis = (name, axis, angle) => rotQ(name, qa.setFromAxisAngle(axis, angle));
    function move(name, dx, dy, dz) {
        tv.set(dx, dy, dz).applyQuaternion(parentInvQ[name]).divideScalar(parentScale[name]);
        B[name].position.add(tv);
    }
    const local = (o, out) => root.worldToLocal(o.getWorldPosition(out)); // 모델 공간 위치

    // 다리: 2관절 IK로 발을 처음 자리(바닥)에 붙인다. 뒷다리 발목 아래 마디는 처음 방향을 유지.
    const legs = ['L', 'R'].flatMap(s => [
        { upper: B['FrontUpperLeg' + s], lower: B['FrontLowerLeg' + s], end: ends['FrontLowerLeg' + s + '_end'], front: true, foot: 'IKFrontLeg' + s, tip: ends['FrontLowerLeg' + s + '_end'] },
        { upper: B['BackLeg' + s], lower: B['BackUpperLeg' + s], end: B['BackLowerLeg' + s], keep: B['BackLowerLeg' + s], front: false, foot: 'IKBackLeg' + s, tip: ends['BackLowerLeg' + s + '_end'] },
    ]);
    const H = new THREE.Vector3(), K = new THREE.Vector3(), E = new THREE.Vector3(), T = new THREE.Vector3(), U = new THREE.Vector3(), N = new THREE.Vector3(), KD = new THREE.Vector3();
    legs.forEach(l => {
        local(l.upper, H); local(l.lower, K); local(l.end, E);
        l.L1 = H.distanceTo(K); l.L2 = K.distanceTo(E);
        l.target = E.clone();
        l.tipRest = model.worldToLocal(l.tip.getWorldPosition(new THREE.Vector3()));
    });
    // 발 부분 메시는 모델의 발 목표 뼈(IK...)에 붙어 있어서, 다리 끝을 따라가게 옮겨 준다
    const syncFeet = () => {
        model.updateMatrixWorld(true);
        legs.forEach(l => { model.worldToLocal(l.tip.getWorldPosition(E)).sub(l.tipRest); move(l.foot, E.x, E.y, E.z); });
    };
    const wq = new THREE.Quaternion(), pq = new THREE.Quaternion(), dq = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
    function aim(bone, pivot, from, to) {
        v1.subVectors(from, pivot).normalize(); v2.subVectors(to, pivot).normalize();
        dq.setFromUnitVectors(v1, v2);
        bone.getWorldQuaternion(wq); bone.parent.getWorldQuaternion(pq);
        bone.quaternion.copy(pq.invert().multiply(dq.multiply(wq)));
        bone.updateMatrixWorld(true);
    }
    function solveLeg(l, reach, lift = 0) {
        local(l.upper, H); local(l.lower, K);
        T.copy(l.target); T.z += reach; T.y += lift;
        U.subVectors(T, H);
        const d = clamp(U.length(), Math.abs(l.L1 - l.L2) + 0.01, l.L1 + l.L2 - 0.005);
        U.normalize();
        N.subVectors(K, H); N.addScaledVector(U, -N.dot(U)); // 무릎이 접히는 쪽은 처음 자세 그대로
        if (N.lengthSq() < 1e-8) N.set(0, 0, l.front ? -1 : 1);
        N.normalize();
        const a = (l.L1 * l.L1 - l.L2 * l.L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(l.L1 * l.L1 - a * a, 0));
        KD.copy(H).addScaledVector(U, a).addScaledVector(N, h);
        aim(l.upper, H, K, KD);
        local(l.end, E); local(l.lower, K);
        aim(l.lower, K, E, T);
        if (l.keep) { l.keep.parent.getWorldQuaternion(pq); l.keep.quaternion.copy(pq.invert().multiply(rest[l.keep.name].wq)); }
    }

    // 머리에 붙이는 부품 (처음 자세의 모델 좌표로 만들어 Head 뼈에 붙임)
    const geos = [], mats = [];
    const mat = c => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }); mats.push(m); return m; };
    const ball = new THREE.SphereGeometry(1, 16, 12);
    geos.push(ball);
    const attach = (obj, pos, scale) => {
        obj.position.set(...pos); if (scale) obj.scale.set(...scale);
        root.add(obj); root.updateMatrixWorld(true);
        B.Head.attach(obj);
        return { obj, scale: obj.scale.clone(), pos: obj.position.clone() };
    };
    const toHead = (x, y, z) => B.Head.worldToLocal(root.localToWorld(new THREE.Vector3(x, y, z)));
    // 눈꺼풀: 눈을 감싸는 반구 껍질. 눈이 보는 방향(앞·바깥) 기준으로 위에서 아래로 굴러 내려와 눈을 덮는다.
    const capGeo = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    geos.push(capGeo);
    const lids = [1, -1].map(s => {
        const g = new THREE.Group();
        g.position.set(cfg.eye[0] * s, cfg.eye[1], cfg.eye[2]);
        g.lookAt(g.position.clone().add(new THREE.Vector3(0.5 * s, 0, 0.87))); // 눈이 보는 방향
        g.scale.set(0.076, 0.04, 0.04);
        const cap = new THREE.Mesh(capGeo, fur);
        g.add(cap);
        root.add(g); root.updateMatrixWorld(true);
        B.Head.attach(g);
        return cap;
    });
    const mouth = attach(new THREE.Mesh(ball, mat(0x3a1a1e)), cfg.mouth, [0.1, 0.05, 0.1]);
    const tongue = attach(new THREE.Mesh(ball, mat(0xe0747e)), cfg.tongue, [0.065, 0.022, 0.1]);
    const tongueOut = toHead(...cfg.tongueOut).sub(tongue.pos);
    const tongueUp = toHead(...cfg.tongueUp).sub(tongue.pos);
    const teethG = new THREE.Group();
    const gumGeo = new THREE.BoxGeometry(0.16, 0.03, 0.05), fangGeo = new THREE.ConeGeometry(0.016, 0.06, 6), incGeo = new THREE.BoxGeometry(0.015, 0.025, 0.012);
    geos.push(gumGeo, fangGeo, incGeo);
    const toothMat = mat(0xf6f1e4);
    const gum = new THREE.Mesh(gumGeo, mat(0xb8505c)); gum.position.set(0, 0.015, -0.01); teethG.add(gum);
    for (const x of [-0.06, 0.06]) { const f = new THREE.Mesh(fangGeo, toothMat); f.position.set(x, -0.02, 0.005); f.rotation.x = Math.PI; teethG.add(f); }
    for (const x of [-0.03, -0.01, 0.01, 0.03]) { const t = new THREE.Mesh(incGeo, toothMat); t.position.set(x, -0.005, 0.015); teethG.add(t); }
    const teeth = attach(teethG, cfg.teeth, [1.35, 1.35, 1.35]);

    // 바닥 그림자
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const cx = cv.getContext('2d'), grd = cx.createRadialGradient(32, 32, 4, 32, 32, 32);
    grd.addColorStop(0, 'rgba(0,0,0,0.35)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = grd; cx.fillRect(0, 0, 64, 64);
    const shadowTex = new THREE.CanvasTexture(cv), shadowGeo = new THREE.PlaneGeometry(1.4, 4.6);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, 0.01, 0.5);
    root.add(shadow);

    const tailDir = local(B.Tail2, new THREE.Vector3()).sub(local(B.Tail1, new THREE.Vector3())).normalize();
    const X = new THREE.Vector3(1, 0, 0), wagAxis = new THREE.Vector3();

    // 밥그릇 (자원 지키기)
    const bowlG = new THREE.Group();
    const bowlGeo = new THREE.LatheGeometry([[0.26, 0], [0.33, 0.02], [0.4, 0.17], [0.37, 0.17], [0.3, 0.05], [0, 0.05]].map(([x, y]) => new THREE.Vector2(x, y)), 28);
    const foodGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24);
    geos.push(bowlGeo, foodGeo);
    bowlG.add(new THREE.Mesh(bowlGeo, mat(0x4f78a8)));
    const food = new THREE.Mesh(foodGeo, mat(0x8a5a32)); food.position.y = 0.12; bowlG.add(food);
    bowlG.position.set(0, 0, 1.8); bowlG.visible = false;
    root.add(bowlG);

    // 화면 크기에 맞추고 몸 가운데를 원점으로
    root.scale.setScalar(S);
    root.position.z = -0.5 * S;

    // 화면을 누른 곳이 어느 부위인지: 맞은 점에서 가장 가까운 뼈로 고른다
    const pickables = [];
    model.traverse(o => { if (o.isMesh) pickables.push(o); });
    const mouthParts = new Set([mouth.obj, tongue.obj]);
    teeth.obj.traverse(o => mouthParts.add(o));
    const lidSet = new Set(lids);
    const pv = new THREE.Vector3();
    const PART_OF = [[/^Ear/, 'ears'], [/^Tail/, 'tail'], [/Leg|Shoulder/, 'legs'], [/^(Head|Neck3)$/, 'head'], [/^Neck/, 'head']];
    function pick(raycaster) {
        model.traverse(o => { if (o.isSkinnedMesh) { o.computeBoundingSphere(); o.computeBoundingBox(); } });
        const hit = raycaster.intersectObjects(pickables, false)[0];
        if (!hit) return null;
        const o = hit.object;
        if (lidSet.has(o) || cfg.eyes.includes(o.material.name)) return 'eyes';
        if (mouthParts.has(o)) return 'mouth';
        if (mouth.obj.getWorldPosition(pv).distanceTo(hit.point) < 0.045) return 'mouth';
        let best = 'Body', bd = Infinity;
        for (const name in B) {
            if (/^(IK|FF|Pole)/.test(name)) continue;
            const d = B[name].getWorldPosition(pv).distanceToSquared(hit.point);
            if (d < bd) { bd = d; best = name; }
        }
        const m = PART_OF.find(([re]) => re.test(best));
        return m ? m[1] : 'body';
    }

    const ev = { lick: -1, yawn: -1, shake: -1, blink: 1.5 };
    const tick = (k, len) => { if (ev[k] < 0) return 0; ev[k] += dtNow; const v = Math.sin(clamp(ev[k] / len, 0, 1) * Math.PI); if (ev[k] > len) ev[k] = -1; return v; };
    let dtNow = 0;
    function update(p, t, dt) {
        resetBones();
        dtNow = dt;
        const sitW = p.sitW || 0, lieW = p.lieW || 0, backW = p.backW || 0, sniffW = p.sniffW || 0, pawW = p.pawW || 0, jumpW = p.jumpW || 0;
        const still = p.freeze ? 0.15 : 1;
        const breathe = Math.sin(t * (p.tension > 0.6 ? 3.2 : 2.1)) * (p.freeze ? 0.3 : 1);
        const lick = tick('lick', 0.55), yawn = tick('yawn', 1.8), shakeAmp = tick('shake', 1.0);
        const shake = shakeAmp * Math.sin((ev.shake < 0 ? 0 : ev.shake) * 30);

        // 몸: 높이, 놀이 인사(앞을 숙임), 체중 이동, 앉기(엉덩이 내리고 앞을 듦), 엎드리기
        const stand = 1 - Math.max(sitW, lieW);
        const pitch = (p.bow * 0.38 + (p.bodyHeight < 0 ? p.bodyHeight * 0.12 : 0)) * stand - sitW * 0.5;
        move('Body', 0, (p.bodyHeight * (p.bodyHeight < 0 ? 0.62 : 0.25) - p.bow * 0.15) * stand - sitW * 1.05 - lieW * 1.0 + breathe * 0.008, p.weight * 0.22 * stand);
        rot('Back', pitch);
        if (p.wiggle) { const w = Math.sin(t * 9) * 0.13 * still; rot('Back', 0, w); rot('Torso3', 0, -w * 0.8); }
        if (shake) { rot('Back', 0, 0, -shake * 0.12); rot('Torso2', 0, 0, shake * 0.22); rot('Torso3', 0, 0, shake * 0.3); }
        B.Torso2.scale.set(1 + breathe * 0.012, 1, 1 + breathe * 0.012);
        // 배 보이며 눕기: 몸 가운데를 축으로 옆·등 쪽으로 굴림
        const roll = backW * 2.2, h = lerp(1.7, 0.62, backW);
        // 펄쩍 뛰기: 몸 전체가 통통 뛰어오름 / 몸 돌리기: 다가오는 쪽(앞)에서 몸을 돌림
        const hop = jumpW * Math.abs(Math.sin(t * 6.5)) * 0.5 * still;
        model.rotation.set(0, (p.bodyTurn || 0) * 0.9, roll);
        model.position.set(1.7 * Math.sin(roll) + (p.tremble ? Math.sin(t * 55) * 0.015 : 0), h - 1.7 * Math.cos(roll) + hop, 0);

        // 목과 머리: 고개 높이, 기울이기(귀도 같이), 시선 피하면 고개 돌림, 냄새 맡기. 숙인 몸만큼 고개를 들어 앞을 봄
        const hp = -p.headPitch;
        rot('Neck1', hp * 0.3 - pitch * 0.55 + sniffW * 0.55);
        rot('Neck2', hp * 0.25 + sniffW * 0.45, 0, shake * 0.4);
        rot('Neck3', hp * 0.2 + sniffW * 0.3, (p.gaze < 0 ? p.gaze * 0.6 : 0) + Math.sin(t * 1.3) * 0.25 * sniffW, p.headTilt * 0.4);
        rot('Head', hp * 0.15 - yawn * 0.35 + sniffW * (0.2 + Math.sin(t * 8) * 0.05));

        // 귀: 앞으로 세우기 / 뒤로 젖히고 옆으로 눕히기 / 털 때 펄럭임
        for (const [s, side] of [['L', 1], ['R', -1]]) {
            rot('Ear1' + s, p.earForward * 0.3 - p.earBack * 1.0, 0, -side * p.earBack * 0.55 + side * p.earForward * 0.12 + shake * 0.5);
            rot('Ear2' + s, -p.earBack * 0.35);
        }

        // 꼬리: 높이(내리면 다리 사이로), 높을수록 말림, 흔들기
        const tp = tri(p.tailHeight, -2.3, 0, 0.75);
        rot('Tail1', tp);
        const curl = p.tailHeight > 0.3 ? (p.tailHeight - 0.3) * 0.9 : p.tailHeight < -0.5 ? (p.tailHeight + 0.5) * 0.8 : 0;
        rot('Tail2', curl); rot('Tail3', curl);
        const wag = (p.wagSpeed > 0.02 ? Math.sin(t * lerp(4, 16, p.wagSpeed)) * p.wagRange * 0.7 * still : 0) + shake * 0.5;
        if (wag) {
            v1.copy(tailDir).applyAxisAngle(X, tp);
            wagAxis.crossVectors(v1, X).normalize();
            rotAxis('Tail1', wagAxis, wag);
        }

        root.updateMatrixWorld(true);
        if (backW < 0.5) {
            // 발을 바닥에: 놀이 인사는 앞발을 앞으로, 엎드리면 앞발을 쭉 뻗고, 앉거나 엎드리면 뒷발을 앞으로
            legs.forEach((l, i) => {
                const lift = l.front && i === 0 ? pawW : 0; // 왼쪽 앞발 들기
                solveLeg(l, l.front ? p.bow * 0.45 * stand + lieW * 1.3 + lift * 0.3 : sitW * 1.05 + lieW * 1.0, lift * 0.42);
            });
        } else {
            // 누우면 다리를 접어 둠. 말랑하면 축 늘어지고, 굳어 있으면 뻣뻣하게 뻗고 뒷다리 하나를 듦
            const loose = p.tension < 0.45 ? 1 : 0;
            for (const s of ['L', 'R']) {
                rot('FrontUpperLeg' + s, loose ? -0.9 : -0.35);
                rot('FrontLowerLeg' + s, loose ? 1.4 : 0.25);
                rot('BackLeg' + s, loose ? -0.6 : s === 'L' ? -1.25 : -0.3);
                rot('BackUpperLeg' + s, loose ? 0.7 : 0.15);
            }
        }

        syncFeet();

        // 눈꺼풀: 깜빡임, 편할 땐 살짝 내려옴(엎드려 쉬면 더), 하품할 땐 감음
        ev.blink -= dt;
        if (ev.blink < 0) ev.blink = (p.gaze > 0.6 || p.freeze ? 6 : 2.5) + Math.random() * 2.5;
        const blink = ev.blink < 0.14 ? Math.sin(ev.blink / 0.14 * Math.PI) : 0;
        const soft = p.tension < 0.3 && p.gaze <= 0.5 ? 0.22 + lieW * 0.35 : 0;
        const close = Math.max(blink, yawn * 0.9, soft);
        lids.forEach(cap => { cap.visible = close > 0.02; cap.rotation.x = lerp(-1.75, 1.57, close); }); // 뒤(머리 속)에서 앞으로 덮음

        // 입: 헐떡임, 하품, 입술 핥기, 이빨
        const pant = p.mouthOpen > 0.3 && !p.freeze ? (Math.sin(t * 9) + 1) * 0.08 : 0;
        const open = Math.max(p.mouthOpen * (1 - p.lipCurl * 0.7) + pant, yawn);
        mouth.obj.visible = open > 0.05;
        mouth.obj.scale.set(mouth.scale.x, mouth.scale.y * open * 1.4, mouth.scale.z);
        tongue.obj.visible = open > 0.25 || lick > 0.02;
        tongue.obj.position.copy(tongue.pos)
            .addScaledVector(tongueOut, Math.max(open > 0.45 ? (open - 0.45) * 1.6 : 0, lick * 0.6))
            .addScaledVector(tongueUp, lick);
        teeth.obj.visible = p.lipCurl > 0.04;
        teeth.obj.scale.set(teeth.scale.x, teeth.scale.y * clamp(p.lipCurl * 1.3, 0.05, 1), teeth.scale.z);
        bowlG.visible = !!p.bowl;
    }

    return {
        root, update,
        headWorld: out => B.Head.getWorldPosition(out),
        pick,
        lick() { ev.lick = 0; },
        yawn() { ev.yawn = 0; },
        shake() { ev.shake = 0; },
        dispose() {
            model.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
            geos.forEach(g => g.dispose()); mats.forEach(m => m.dispose());
            shadowGeo.dispose(); shadowMat.dispose(); shadowTex.dispose();
        },
    };
}
