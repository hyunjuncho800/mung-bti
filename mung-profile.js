// 멍설명서·멍궁합 공통: 내 기질검사 결과 읽기, 점수 단계 나누기, 공유 링크 데이터 만들기와 검증.
// 점수와 유형은 기질검사(script.js)가 저장한 값을 그대로 쓴다. 여기서 새로 계산하거나 바꾸지 않는다.
// 브라우저에서는 window.MungProfile, Node(빌드·테스트)에서는 require로 쓴다.
(function (root) {
    // 기질검사 7개 축. 문항이 실제로 묻는 범위를 about에 적어 두고, 문구는 이 범위를 넘지 않게 쓴다.
    var AXES = {
        e: { label: '탐험성', about: '처음 보는 길·물건에 다가가기, 새 장난감에 몰두, 움직이는 것 쫓기' },
        s: { label: '안전성', about: '큰 소리·낯선 곳에서 놀라거나 숨기, 예고 없이 다가오면 경계 (높을수록 조심스러움)' },
        m: { label: '교감성', about: '보호자의 부름·눈맞춤·말과 손길에 대한 반응' },
        f: { label: '집중성', about: '노즈워크·교육·씹기에 오래 집중하기' },
        i: { label: '독립성', about: '보호자가 나가도 차분하기, 흥분을 스스로 가라앉히기, 혼자 쉬기' },
        o: { label: '사교성', about: '다른 강아지와 부드럽게 인사, 미용·발톱 깎기 참기, 낯선 사람이 내민 손 받아들이기' },
        x: { label: '유연성', about: '이사·여행 같은 새 환경, 가구 배치 변화에 적응' },
    };
    var AXIS_ORDER = ['e', 's', 'm', 'f', 'i', 'o', 'x'];
    var TYPES = {
        1: { name: '이중인격 브레이크형', sub: '호기심 천국 겁쟁이', tone: '#FFB8C6' },
        2: { name: '폭주 호기심형', sub: '브레이크 고장난 탐험가', tone: '#FFCF5C' },
        3: { name: '소심형 철학자', sub: '신중하고 세심한 파수꾼', tone: '#A9D6F5' },
        4: { name: '무소유 집돌이형', sub: '평화로운 안방 현자', tone: '#BFE3A8' },
    };
    // 기질검사와 같은 기준: 3.5 이상이면 높음. 2.5 이하면 낮음. 그 사이는 '보통'이라 문구를 만들지 않는다.
    var HIGH = 3.5, LOW = 2.5, STRONG_HIGH = 4.3, STRONG_LOW = 1.7;
    function band(v) { return v >= HIGH ? 'h' : v <= LOW ? 'l' : 'm'; }
    function strength(v) { return v >= STRONG_HIGH || v <= STRONG_LOW ? 'strong' : 'normal'; }

    // 저장값 읽기. mung_result(점수 포함)는 2026-11 이후 검사부터 있고, 그 전 검사는 mung_dog(유형만)뿐이다.
    function readMine(storage) {
        var dog = null, res = null;
        try { dog = JSON.parse(storage.getItem('mung_dog') || 'null'); } catch (e) {}
        try { res = JSON.parse(storage.getItem('mung_result') || 'null'); } catch (e) {}
        var type = res && TYPES[res.type] ? res.type : dog && TYPES[dog.type] ? dog.type : null;
        if (!type) return null;
        var scores = null;
        if (res && res.v === 1 && res.type === type && AXIS_ORDER.every(function (k) { return typeof res[k] === 'number' && res[k] >= 1 && res[k] <= 5; })) {
            scores = {};
            AXIS_ORDER.forEach(function (k) { scores[k] = res[k]; });
        }
        return { type: type, typeName: TYPES[type].name, name: (dog && dog.name) || '', scores: scores };
    }
    function bandsOf(scores) {
        var b = {};
        AXIS_ORDER.forEach(function (k) { b[k] = band(scores[k]); });
        return b;
    }

    // 사용자가 쓴 글: 제어문자·꺾쇠 제거, 길이 제한. 화면에는 textContent로만 넣는다.
    function cleanText(s, max) {
        return String(s == null ? '' : s).replace(/[\t\n\r]/g, ' ').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
    }

    // 공유 데이터 <-> 주소의 # 뒤 문자열 (base64url JSON). 서버로 가지 않고, 받은 쪽에서 다시 검증한다.
    function b64encode(str) {
        var bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(str) : Buffer.from(str, 'utf8');
        var bin = '';
        for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        var b = typeof btoa !== 'undefined' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
        return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    function b64decode(s) {
        s = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
        if (!/^[A-Za-z0-9+/]*$/.test(s) || s.length > 4000) return null;
        while (s.length % 4) s += '=';
        try {
            var bin = typeof atob !== 'undefined' ? atob(s) : Buffer.from(s, 'base64').toString('binary');
            var bytes = new Uint8Array(bin.length);
            for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            return typeof TextDecoder !== 'undefined' ? new TextDecoder().decode(bytes) : Buffer.from(bytes).toString('utf8');
        } catch (e) { return null; }
    }
    function pack(obj) { return b64encode(JSON.stringify(obj)); }
    function unpack(s) {
        var t = b64decode(s);
        if (!t) return null;
        try { var o = JSON.parse(t); return o && typeof o === 'object' && !Array.isArray(o) ? o : null; } catch (e) { return null; }
    }
    // 주소의 # 뒤에서 key=값 읽기 (예: #g=...&via=link)
    function hashParam(hash, key) {
        var m = String(hash || '').replace(/^#/, '').split('&').filter(function (p) { return p.indexOf(key + '=') === 0; })[0];
        return m ? decodeURIComponent(m.slice(key.length + 1)) : null;
    }

    // 공유 링크로 들어온 방문자 표시 (그 뒤 검사 시작·완료를 '공유 방문자 전환'으로 세기 위함). 개인정보 없음.
    function markShared(storage, content) {
        try { storage.setItem('mung_from_share', JSON.stringify({ c: content, at: Date.now() })); } catch (e) {}
    }
    function sharedOrigin(storage) {
        try {
            var f = JSON.parse(storage.getItem('mung_from_share') || 'null');
            return f && Date.now() - f.at < 7 * 86400000 ? f.c : null;
        } catch (e) { return null; }
    }

    var api = { AXES: AXES, AXIS_ORDER: AXIS_ORDER, TYPES: TYPES, HIGH: HIGH, LOW: LOW, band: band, strength: strength, readMine: readMine, bandsOf: bandsOf, cleanText: cleanText, pack: pack, unpack: unpack, hashParam: hashParam, markShared: markShared, sharedOrigin: sharedOrigin };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.MungProfile = api;
})(this);
