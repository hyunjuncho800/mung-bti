// 멍상황 3D 소품: 문, 사람(어른·아이), 다른 강아지, 창문과 번개, 대기실 의자, 욕조, 방석, 공, 가방.
// 강아지는 원점에서 앞(+z)을 본다. 소품은 필요할 때 한 번만 만들고 보였다 숨겼다 한다.
import * as THREE from 'three';

export function createProps(scene, { loadOther, otherDogPose }) {
    const made = {}, geos = [], mats = {};
    const mat = c => (mats[c] ||= new THREE.MeshLambertMaterial({ color: c }));
    const box = (w, h, d, c, x, y, z, parent) => {
        const g = new THREE.BoxGeometry(w, h, d); geos.push(g);
        const m = new THREE.Mesh(g, mat(c)); m.position.set(x, y, z); parent.add(m); return m;
    };
    const cap = (r, len, c, x, y, z, parent) => {
        const g = new THREE.CapsuleGeometry(r, len, 4, 10); geos.push(g);
        const m = new THREE.Mesh(g, mat(c)); m.position.set(x, y, z); parent.add(m); return m;
    };
    const group = (x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); return g; };

    const BUILD = {
        door() {
            const g = group(0.45, 0, 2.52); // 현관 앞벽(z 2.6)에 붙은 문
            box(0.12, 2.3, 0.14, 0x8a6a4a, -0.6, 1.15, 0, g); box(0.12, 2.3, 0.14, 0x8a6a4a, 0.6, 1.15, 0, g); box(1.32, 0.12, 0.14, 0x8a6a4a, 0, 2.3, 0, g);
            const panel = box(1.1, 2.2, 0.06, 0xc49a6c, 0, 1.1, 0, g);
            panel.geometry.translate(0.55, 0, 0); panel.position.x = -0.55; panel.rotation.y = -1.1; // 열린 문
            return g;
        },
        person() { return makePerson(0x7f9cc0, 0.78); },
        child() { return makePerson(0xe9a03b, 0.5); },
        window() {
            const g = group(-2.55, 0, 0.3); // 왼쪽 벽의 창문
            box(0.08, 1.15, 1.35, 0xe8e4dc, 0, 1.45, 0, g);
            const pane = box(0.1, 1.0, 1.2, 0x34506e, 0.01, 1.45, 0, g);
            pane.material = new THREE.MeshLambertMaterial({ color: 0x34506e, emissive: 0x000000 });
            box(0.1, 0.05, 1.2, 0xe8e4dc, 0.02, 1.45, 0, g); box(0.1, 1.0, 0.05, 0xe8e4dc, 0.02, 1.45, 0, g);
            g.userData.pane = pane;
            return g;
        },
        thunder() { const l = new THREE.AmbientLight(0xdfe8ff, 0); l.userData.flash = true; return l; },
        bench() {
            const g = group(-1.3, 0, 0.2);
            box(0.5, 0.08, 1.8, 0x6f8fae, 0, 0.55, 0, g); box(0.08, 0.5, 1.8, 0x6f8fae, -0.22, 0.85, 0, g);
            for (const z of [-0.8, 0.8]) box(0.4, 0.55, 0.06, 0x50647a, 0, 0.27, z, g);
            return g;
        },
        tub() {
            const g = group(-1.15, 0, 1.0);
            box(0.9, 0.08, 1.3, 0xeef3f6, 0, 0.04, 0, g);
            box(0.08, 0.55, 1.3, 0xeef3f6, -0.45, 0.3, 0, g); box(0.08, 0.55, 1.3, 0xeef3f6, 0.45, 0.3, 0, g);
            box(0.9, 0.55, 0.08, 0xeef3f6, 0, 0.3, -0.65, g); box(0.9, 0.55, 0.08, 0xeef3f6, 0, 0.3, 0.65, g);
            box(0.82, 0.02, 1.22, 0x9fd0e8, 0, 0.42, 0, g);
            return g;
        },
        bed() {
            const g = group(0, 0, 0.02);
            const base = new THREE.CylinderGeometry(0.68, 0.7, 0.06, 32), rim = new THREE.TorusGeometry(0.68, 0.09, 10, 32);
            geos.push(base, rim);
            const b = new THREE.Mesh(base, mat(0x9bb7d4)); b.position.y = 0.03; g.add(b);
            const r = new THREE.Mesh(rim, mat(0x7f9fc2)); r.rotation.x = Math.PI / 2; r.position.y = 0.09; g.add(r);
            return g;
        },
        toy() {
            const g = new THREE.SphereGeometry(0.075, 16, 12); geos.push(g);
            const m = new THREE.Mesh(g, mat(0xe4572e)); m.position.set(0.1, 0.075, 0.8);
            return m;
        },
        bag() {
            const g = group(1.0, 0, 2.3);
            box(0.42, 0.32, 0.18, 0x5b6b4a, 0, 0.16, 0, g);
            const h = new THREE.TorusGeometry(0.12, 0.02, 6, 16, Math.PI); geos.push(h);
            const m = new THREE.Mesh(h, mat(0x3f4a33)); m.position.y = 0.32; g.add(m);
            return g;
        },
        otherDog() {
            const g = group(0.5, 0, 1.95);
            g.rotation.y = Math.PI - 0.25;
            g.scale.setScalar(0.85);
            loadOther().then(d => { g.add(d.root); g.userData.dog = d; }).catch(() => {});
            return g;
        },
    };

    function makePerson(shirt, scale) {
        const p = group();
        const skin = 0xe9c6a5, pants = 0x4d5566;
        cap(0.09, 0.62, pants, 0.11, 0.42, 0, p); cap(0.09, 0.62, pants, -0.11, 0.42, 0, p);
        const hips = group(0, 0.86, 0); p.add(hips);
        cap(0.21, 0.5, shirt, 0, 0.38, 0, hips);
        const head = new THREE.SphereGeometry(0.17, 16, 12); geos.push(head);
        const h = new THREE.Mesh(head, mat(skin)); h.position.y = 0.95; hips.add(h);
        const hair = new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2); geos.push(hair);
        const hr = new THREE.Mesh(hair, mat(0x3b2b22)); hr.position.y = 0.97; hr.rotation.x = -0.2; hips.add(hr);
        const arms = [0.3, -0.3].map(x => { const a = group(x, 0.62, 0); cap(0.06, 0.5, shirt, 0, -0.3, 0, a); hips.add(a); return a; });
        p.scale.setScalar(scale);
        p.userData = { hips, arms };
        return p;
    }

    let active = null, t0 = 0, now = 0;
    const show = (key, on) => {
        if (!made[key] && on) { made[key] = BUILD[key](); scene.add(made[key]); }
        if (made[key]) made[key].visible = on;
    };
    function setScene(sc) {
        active = sc;
        t0 = now;
        const want = new Set(sc ? sc.props : []);
        if (sc && sc.person) { want.delete('person'); want.add(sc.person.kind === 'child' ? 'child' : 'person'); }
        Object.keys(BUILD).forEach(k => show(k, want.has(k)));
    }

    const from = new THREE.Vector3(), to = new THREE.Vector3();
    // 반환값: 아직 움직이는 중이면 true (계속 그려야 함)
    function update(t, dt) {
        now = t;
        let busy = false;
        if (!active) return false;
        const per = active.person && made[active.person.kind === 'child' ? 'child' : 'person'];
        if (per) {
            const k = Math.min((t - t0) / 2.5, 1), e = k * k * (3 - 2 * k);
            from.set(active.person.from[0], 0, active.person.from[1]);
            to.set(active.person.to[0], 0, active.person.to[1]);
            per.position.lerpVectors(from, to, e);
            per.position.y = k < 1 ? Math.abs(Math.sin((t - t0) * 7)) * 0.03 : 0;
            per.rotation.y = Math.atan2(-per.position.x, -per.position.z + 0.3); // 강아지 쪽을 봄
            const lean = active.person.lean ? e : 0;
            per.userData.hips.rotation.x = lean * 0.75;
            per.userData.arms.forEach(a => { a.rotation.x = -lean * 1.2; });
            busy = k < 1;
        }
        const win = made.window, fl = made.thunder;
        if (fl && fl.visible) {
            const c = (t - t0) % 4, f = c > 1.2 && c < 1.28 || c > 1.4 && c < 1.46 ? 1 : 0; // 4초마다 번쩍번쩍
            fl.intensity = f * 2.2;
            if (win) win.userData.pane.material.emissive.setHex(f ? 0xbfd4ff : 0x000000);
        }
        const od = made.otherDog && made.otherDog.visible && made.otherDog.userData.dog;
        if (od) od.update(otherDogPose, t, dt);
        const toy = made.toy;
        if (toy && toy.visible) { toy.position.x = 0.1 + Math.sin(t * 1.2) * 0.12; toy.rotation.z = -toy.position.x * 6; }
        return busy;
    }

    function dispose() {
        geos.forEach(g => g.dispose());
        Object.values(mats).forEach(m => m.dispose());
        if (made.window) made.window.userData.pane.material.dispose();
        if (made.otherDog && made.otherDog.userData.dog) made.otherDog.userData.dog.dispose();
    }

    return { setScene, update, dispose };
}
