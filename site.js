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
