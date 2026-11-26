// 멍시그널 3D 배경: 거실, 공원 산책길, 현관, 동물병원 대기실, 밤 방, 욕실, 부엌, 침실.
// 강아지는 원점에서 앞(+z)을 본다. 벽은 안쪽에서만 보이는 한 면짜리라, 화면을 돌려 벽 뒤로 가도 강아지를 가리지 않는다.
// 몸짓이 잘 보이도록 색은 차분하게, 소품은 벽가에만 둔다. 왼쪽 뒤 모서리는 비스듬히 볼 때 강아지 바로 뒤라 비워 둔다. 배경마다 필요할 때 한 번만 만든다.
import * as THREE from 'three';

const WALL_X = -2.6, WALL_Z = -2.6, FRONT_Z = 2.6, H = 3.2;

export function createEnv(scene) {
    const geos = [], mats = {}, built = {}, textures = [];
    const mat = (c, extra) => { const k = c + (extra ? JSON.stringify(extra) : ''); return (mats[k] ||= new THREE.MeshLambertMaterial(Object.assign({ color: c }, extra))); };
    const add = (geo, c, parent, x, y, z, extra) => { geos.push(geo); const m = new THREE.Mesh(geo, mat(c, extra)); m.position.set(x, y, z); parent.add(m); return m; };
    const box = (w, h, d, c, p, x, y, z) => add(new THREE.BoxGeometry(w, h, d), c, p, x, y, z);
    const flat = (w, d, c, p, x, y, z) => { const m = add(new THREE.PlaneGeometry(w, d), c, p, x, y, z); m.rotation.x = -Math.PI / 2; return m; };
    const disc = (r, c, p, x, y, z) => { const m = add(new THREE.CircleGeometry(r, 40), c, p, x, y, z); m.rotation.x = -Math.PI / 2; return m; };
    // 방: 바닥 + 뒷벽 + 왼쪽 벽 (+ 앞벽)
    function room(g, floorC, backC, leftC, front) {
        flat(8.4, 8.4, floorC, g, 0.9, 0, 0.9);
        const back = add(new THREE.PlaneGeometry(8.4, H), backC, g, 0.9, H / 2, WALL_Z);
        const left = add(new THREE.PlaneGeometry(8.4, H), leftC, g, WALL_X, H / 2, 0.9); left.rotation.y = Math.PI / 2;
        if (front) { const f = add(new THREE.PlaneGeometry(8.4, H), front, g, 0.9, H / 2, FRONT_Z); f.rotation.y = Math.PI; }
        return { back, left };
    }
    function windowOnBack(g, x, y, pane = 0xbfe2f6) {
        box(1.6, 1.1, 0.06, 0xf7f3ec, g, x, y, WALL_Z + 0.03);
        box(1.44, 0.94, 0.07, pane, g, x, y, WALL_Z + 0.035);
        box(0.05, 0.94, 0.08, 0xf7f3ec, g, x, y, WALL_Z + 0.04);
        box(1.44, 0.05, 0.08, 0xf7f3ec, g, x, y, WALL_Z + 0.04);
    }
    function plant(g, x, z, s = 1) {
        add(new THREE.CylinderGeometry(0.2 * s, 0.15 * s, 0.38 * s, 12), 0xc77d5a, g, x, 0.19 * s, z);
        add(new THREE.IcosahedronGeometry(0.38 * s, 0), 0x6aa864, g, x, 0.62 * s, z);
        add(new THREE.IcosahedronGeometry(0.26 * s, 0), 0x7dbb73, g, x + 0.12 * s, 0.92 * s, z - 0.05);
    }
    function tree(g, x, z, s = 1) {
        add(new THREE.CylinderGeometry(0.1 * s, 0.14 * s, 1.0 * s, 8), 0x8b6b4a, g, x, 0.5 * s, z);
        add(new THREE.IcosahedronGeometry(0.75 * s, 0), 0x6aa864, g, x, 1.45 * s, z);
        add(new THREE.IcosahedronGeometry(0.5 * s, 0), 0x7fbd76, g, x + 0.25 * s, 1.95 * s, z + 0.1);
    }
    function sky(top, bottom) {
        const c = document.createElement('canvas'); c.width = 4; c.height = 256;
        const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 256);
        gr.addColorStop(0, top); gr.addColorStop(1, bottom);
        x.fillStyle = gr; x.fillRect(0, 0, 4, 256);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; textures.push(t);
        return t;
    }

    // 각 배경: [바탕색 또는 하늘, 밝기 배율, 만드는 함수]
    const BUILD = {
        home: { bg: 0xf3ece2, light: 1, make(g) {
            room(g, 0xd8b98f, 0xf2e8da, 0xece0cf);
            disc(1.2, 0xcfae9e, g, 0, 0.001, 0.1);
            windowOnBack(g, 0.6, 1.55);
            box(0.9, 0.42, 2.2, 0x8ea9be, g, -2.1, 0.21, -0.7); box(0.25, 0.55, 2.2, 0x7d97ab, g, -2.45, 0.6, -0.7); // 소파
            box(0.9, 0.12, 0.25, 0x7d97ab, g, -2.1, 0.48, 0.32); box(0.9, 0.12, 0.25, 0x7d97ab, g, -2.1, 0.48, -1.72);
            plant(g, 2.3, -2.15);
        } },
        entrance: { bg: 0xf3ece2, light: 1, make(g) {
            room(g, 0xd8b98f, 0xf2e8da, 0xece0cf, 0xefe3d2);
            flat(1.3, 0.7, 0x9c7c5e, g, 0.45, 0.001, 2.0); // 현관 매트
            box(0.3, 0.06, 1.4, 0xb08a66, g, WALL_X + 0.15, 1.55, 1.3); // 왼쪽 벽 선반
            box(0.1, 0.75, 0.38, 0x8c6f9e, g, WALL_X + 0.07, 1.1, 0.9); box(0.1, 0.65, 0.34, 0x6f8f86, g, WALL_X + 0.07, 1.15, 1.5); // 걸어 둔 외투
            plant(g, 2.3, -2.15, 0.8);
        } },
        park: { bg: 'sky', light: 1.05, make(g) {
            flat(16, 16, 0xa3cf8f, g, 0.9, 0, 0.9);
            flat(1.5, 16, 0xe2d3ad, g, 0, 0.001, 0.9); // 산책길
            [[-3, -2.6, 1], [-2.1, -4.4, 1.2], [2.8, -3.8, 1.1], [-4.2, 0.6, 0.9], [4.2, -1.4, 1], [-3.4, 3.2, 0.8]].forEach(([x, z, s]) => tree(g, x, z, s));
            [[-1.6, -1.8], [1.8, -2.2], [-2.6, 1.6]].forEach(([x, z]) => add(new THREE.IcosahedronGeometry(0.32, 0), 0x77b06b, g, x, 0.2, z));
        } },
        vet: { bg: 0xeef5f3, light: 1, make(g) {
            room(g, 0xe7ecee, 0xdcefe8, 0xd3e8e0);
            box(0.05, 0.16, 0.5, 0x5bb08a, g, WALL_X + 0.03, 1.55, 0.3); box(0.05, 0.5, 0.16, 0x5bb08a, g, WALL_X + 0.03, 1.55, 0.3); // 병원 표시
            box(0.04, 0.7, 1.0, 0xf7faf9, g, WALL_X + 0.03, 1.4, 1.75); box(0.05, 0.08, 0.7, 0xb9d8cc, g, WALL_X + 0.04, 1.6, 1.75); box(0.05, 0.05, 0.5, 0xb9d8cc, g, WALL_X + 0.04, 1.42, 1.75); // 안내판
            plant(g, 2.6, -2.15, 0.8);
        } },
        night: { bg: 0x1b2233, light: 0.55, make(g) {
            room(g, 0x4e5468, 0x353d55, 0x2f364c);
            disc(1.2, 0x6b5f7a, g, 0, 0.001, 0.1);
            box(0.9, 0.42, 2.2, 0x52627a, g, 0.9, 0.21, -2.1).rotation.y = Math.PI / 2; // 소파(뒷벽)
        } },
        bath: { bg: 0xeaf3f7, light: 1, make(g) {
            room(g, 0xdbe7ec, 0xcfe6f0, 0xc6e0eb);
            for (let i = 1; i < 8; i++) { box(8.4, 0.02, 0.01, 0xbad5e1, g, 0.9, i * 0.4, WALL_Z + 0.006); box(0.01, 0.02, 8.4, 0xbad5e1, g, WALL_X + 0.006, i * 0.4, 0.9); } // 타일 줄
            flat(0.9, 0.6, 0x9fc7d9, g, -0.2, 0.001, 1.0); // 욕실 매트
            box(0.05, 0.05, 1.0, 0xc9ced2, g, WALL_X + 0.04, 1.5, 2.1); box(0.03, 0.6, 0.5, 0xf4f0e8, g, WALL_X + 0.07, 1.22, 2.1); // 수건걸이
        } },
        kitchen: { bg: 0xf6f1e8, light: 1, make(g) {
            room(g, 0xe6d8c2, 0xf5efe4, 0xefe7da);
            box(0.62, 0.9, 3.0, 0xc9b69c, g, WALL_X + 0.31, 0.45, 1.0); box(0.68, 0.05, 3.1, 0xf2f2f0, g, WALL_X + 0.34, 0.92, 1.0); // 조리대
            box(0.4, 0.7, 3.0, 0xd8c7ae, g, WALL_X + 0.2, 2.2, 1.0); // 위 찬장
            box(0.7, 1.9, 0.8, 0xdfe3e6, g, WALL_X + 0.36, 0.95, -1.0); // 냉장고
        } },
        bedroom: { bg: 0xefedf5, light: 0.95, make(g) {
            room(g, 0xd8b98f, 0xe8e4f2, 0xe1dcee);
            box(1.7, 0.45, 2.3, 0xb7a3c9, g, -1.7, 0.22, -1.3); box(1.7, 0.12, 1.6, 0xd9cce6, g, -1.7, 0.5, -0.95); // 침대
            box(1.2, 0.14, 0.4, 0xffffff, g, -1.7, 0.52, -2.2); box(1.8, 0.8, 0.12, 0x9d86b3, g, -1.7, 0.6, WALL_Z + 0.06); // 베개, 머리판
            box(0.5, 0.5, 0.45, 0xb08a66, g, -0.4, 0.25, -2.3); add(new THREE.ConeGeometry(0.16, 0.25, 12), 0xf6e6b4, g, -0.4, 0.75, -2.3); // 협탁, 조명
        } },
    };

    const group = new THREE.Group();
    scene.add(group);
    let current = null, skyTex = null;
    // 배경 바꾸기. 반환값: 조명 밝기 배율
    function set(id) {
        const def = BUILD[id] || BUILD.home;
        id = BUILD[id] ? id : 'home';
        if (!built[id]) { built[id] = new THREE.Group(); def.make(built[id]); group.add(built[id]); }
        Object.keys(built).forEach(k => { built[k].visible = k === id; });
        current = id;
        scene.background = def.bg === 'sky' ? (skyTex ||= sky('#a8d8f2', '#eef8fd')) : new THREE.Color(def.bg);
        return def.light;
    }
    return {
        set,
        get id() { return current; },
        group,
        dispose() { geos.forEach(g => g.dispose()); Object.values(mats).forEach(m => m.dispose()); textures.forEach(t => t.dispose()); },
    };
}
