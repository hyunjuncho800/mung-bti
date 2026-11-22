    // ===== 분석 이벤트 (site.js의 mungTrack, 허용된 항목만 전송) =====
    function track(name, params) { if (window.mungTrack) window.mungTrack(name, params); }
    // 공유 링크로 들어온 방문자가 직접 검사를 하는지 (mung-profile.js의 markShared와 같은 저장값, 7일 안)
    function sharedFrom() {
        try { const f = JSON.parse(localStorage.getItem('mung_from_share') || 'null'); return f && Date.now() - f.at < 7 * 86400000 ? f.c : null; } catch (e) { return null; }
    }
    const withNameNow = () => { const b = document.getElementById('share-name'); return !!(b && b.checked && window.currentShare && window.currentShare.name); };
    // 공유 링크에 어떤 방법으로 보냈는지 표시 (받은 사람이 들어올 때 유입 경로로 기록)
    const viaUrl = (url, via) => url + (url.includes('#') ? '&' : '#') + 'via=' + via;

    // ===== 카카오 SDK: defer로 불러오므로 공유 버튼을 누를 때 초기화 =====
    function kakaoReady() {
        try {
            if (typeof Kakao === 'undefined') return false;
            if (!Kakao.isInitialized()) Kakao.init('9c311733c910878af9ea27cd77bb3f4b');
            return Kakao.isInitialized();
        } catch (e) { return false; }
    }

    const SITE_URL = 'https://mung-test.com/';
    const NO_MBTI = 'MBTI 미입력';

    // ===== 문항 원본 =====
    const baseQuestions = [
        { id: 1,  category: 'E' }, { id: 2,  category: 'E' }, { id: 3,  category: 'E' },
        { id: 4,  category: 'S' }, { id: 5,  category: 'S' }, { id: 6,  category: 'S' },
        { id: 7,  category: 'M' }, { id: 8,  category: 'M' }, { id: 9,  category: 'M' },
        { id: 10, category: 'F' }, { id: 11, category: 'F' }, { id: 12, category: 'F' },
        { id: 13, category: 'I' }, { id: 14, category: 'I' }, { id: 15, category: 'I' },
        { id: 16, category: 'O' }, { id: 17, category: 'O' }, { id: 18, category: 'O' },
        { id: 19, category: 'X' }, { id: 20, category: 'X' },
    ];

    // Fisher-Yates 셔플
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // 이름 뒤에 은/는 붙이기 (받침 유무)
    function withTopic(name) {
        const c = name.charCodeAt(name.length - 1);
        if (c >= 0xAC00 && c <= 0xD7A3) return name + ((c - 0xAC00) % 28 ? '은' : '는');
        return name + '는';
    }

    function show(id) {
        ['intro-zone', 'test-zone', 'mbti-zone', 'result-zone'].forEach(z => {
            const el = document.getElementById(z);
            if (el) el.style.display = (z === id) ? 'block' : 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== 상태 =====
    let questions = [];
    let currentIdx = 0;
    let answers = {};
    let advanceTimer = null;

    // ===== 시작 =====
    function startTest() {
        if (!document.getElementById('test-zone')) {
            window.location.href = '/';
            return;
        }
        const nameInput = document.getElementById('dog-name');
        window.dogName = nameInput ? nameInput.value.trim().slice(0, 10) : '';
        questions = shuffle(baseQuestions);
        track('temperament_test_start');
        if (sharedFrom()) track('shared_visitor_test_start', { from: sharedFrom() });
        currentIdx = 0;
        answers = {};
        show('test-zone');
        renderQuestion();
    }

    // ===== 문항 렌더링 =====
    function renderQuestion() {
        const t = translations[getLang()];
        const total = questions.length;
        const pct = Math.round(((currentIdx + 1) / total) * 100);

        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-label').textContent = `${currentIdx + 1} / ${total}`;
        document.getElementById('btn-prev').disabled = (currentIdx === 0);

        const q = questions[currentIdx];
        const prevVal = answers[q.id];
        const subject = window.dogName ? withTopic(window.dogName) : '';

        const optionsHTML = [5, 4, 3, 2, 1].map(val => `
            <button type="button" class="answer-btn${prevVal === val ? ' selected' : ''}" onclick="selectOption(${q.id}, ${val}, this)">${t['likert_' + val].replace('<br>', ' ')}</button>`).join('');

        document.getElementById('question-container').innerHTML = `
            <div class="question-card">
                <p class="question-who"></p>
                <p class="question-text">${t['q' + q.id]}</p>
                <div class="answer-list">${optionsHTML}</div>
            </div>`;
        // 이름은 사용자가 입력한 값이므로 textContent로만 넣음
        document.querySelector('.question-who').textContent = subject ? `${subject} 평소에` : '';
    }

    function selectOption(qid, val, btn) {
        answers[qid] = val;
        document.querySelectorAll('.answer-btn').forEach(b => b.classList.toggle('selected', b === btn));
        clearTimeout(advanceTimer);
        advanceTimer = setTimeout(nextQuestion, 220);
    }

    function nextQuestion() {
        if (answers[questions[currentIdx].id] === undefined) return;
        currentIdx++;
        if (currentIdx >= questions.length) {
            show('mbti-zone');
        } else {
            renderQuestion();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function prevQuestion() {
        clearTimeout(advanceTimer);
        if (document.getElementById('mbti-zone').style.display === 'block') {
            currentIdx = questions.length - 1;
            show('test-zone');
            renderQuestion();
            return;
        }
        if (currentIdx <= 0) return;
        currentIdx--;
        renderQuestion();
    }

    // ===== 보호자 MBTI 선택 (건너뛰기 가능) =====
    function submitMbtiAndShowResult(mbti) {
        document.getElementById('owner-mbti').value = mbti || '';
        show('result-zone');
        calculateAndShowResults();
    }

    // ===== 결과 계산 =====
    function calculateAndShowResults(passed = null) {
        let E, S, M, F, I, O, X, ownerMbti;

        if (passed) {
            [E, S, M, F, I, O, X] = ['e', 's', 'm', 'f', 'i', 'o', 'x'].map(k => {
                const v = parseFloat(passed[k]);
                return isNaN(v) ? 3 : Math.min(5, Math.max(1, v));
            });
            ownerMbti = passed.owner || NO_MBTI;
            window.dogName = (passed.name || '').slice(0, 10);
        } else {
            const scores = { E: [], S: [], M: [], F: [], I: [], O: [], X: [] };
            questions.forEach(q => { scores[q.category].push(answers[q.id] || 3); });
            const avg = cat => Math.round(scores[cat].reduce((a, b) => a + b, 0) / scores[cat].length * 10) / 10;
            E = avg('E'); S = avg('S'); M = avg('M'); F = avg('F');
            I = avg('I'); O = avg('O'); X = avg('X');
            ownerMbti = document.getElementById('owner-mbti').value || NO_MBTI;
        }
        const hasMbti = /^[EI][NS][TF][JP]$/.test(ownerMbti);
        const name = window.dogName || '';
        window.currentScores = { e: E, s: S, m: M, f: F, i: I, o: O, x: X, owner: ownerMbti, name };

        const t = translations[getLang()];
        const result = buildResult(E, S, M, F, I, O, X);
        const [typeSub, typeRaw] = result.typeTitle.includes(' — ')
            ? result.typeTitle.split(' — ')
            : ['', result.typeTitle];
        const typeName = typeRaw.replace(/["']/g, '');
        const typeNo = E >= 3.5 ? (S >= 3.5 ? 1 : 2) : (S >= 3.5 ? 3 : 4);
        const chem = hasMbti ? getChemistryReport(ownerMbti, typeName) : null;
        const subject = name ? withTopic(name) : (getLang() === 'ko' ? '우리 강아지는' : '');

        window.currentDogType = typeName;
        window.currentOwnerMbti = ownerMbti;

        // --- 공유 카드 ---
        const card = document.getElementById('share-card');
        card.dataset.type = typeNo;
        const cardImg = document.getElementById('card-img');
        cardImg.src = `/img/type-${typeNo}.webp`;
        cardImg.alt = `${typeName} 강아지 그림`;
        document.getElementById('card-subject').textContent = subject;
        document.getElementById('res-type-title').textContent = typeName;
        document.getElementById('res-type-sub').textContent = typeSub;
        const inherent = [
            { label: t.sum_e_label, val: E }, { label: t.sum_s_label, val: S },
            { label: t.sum_m_label, val: M }, { label: t.sum_f_label, val: F },
        ];
        document.getElementById('card-stats').innerHTML = inherent.map(s => `
            <li><span>${s.label}</span><i style="--v:${(s.val / 5 * 100).toFixed(0)}%"></i><b>${s.val.toFixed(1)}</b></li>`).join('');
        const chemLine = document.getElementById('card-chem');
        chemLine.textContent = chem ? `보호자 ${ownerMbti}와 궁합 ${chem.score}점` : '';
        chemLine.hidden = !chem;

        // --- 상세 결과 ---
        document.getElementById('res-desc').textContent = result.letterDesc;
        document.getElementById('res-features-desc').innerHTML = result.featuresDesc;
        document.getElementById('res-stress-desc').innerHTML = result.stressDesc;
        document.getElementById('res-tips-desc').innerHTML = result.tipsDesc;
        document.getElementById('res-match-desc').innerHTML = result.matchDesc;
        document.getElementById('res-humor-comment').textContent = result.humorComment;

        const axes = [
            ['e', t.sum_e_label, E], ['s', t.sum_s_label, S], ['m', t.sum_m_label, M], ['f', t.sum_f_label, F],
            ['i', t.sum_i_label, I], ['o', t.sum_o_label, O], ['x', t.sum_x_label, X],
        ];
        document.getElementById('res-axes').innerHTML = axes.map(([k, label, v]) => `
            <li>
                <div class="axis-top"><b>${label}</b><span>${v.toFixed(1)} / 5</span></div>
                <i class="axis-bar" style="--v:${(v / 5 * 100).toFixed(0)}%"></i>
                <p>${v >= 3.5 ? t['sum_' + k + '_high'] : t['sum_' + k + '_low']}</p>
            </li>`).join('');

        const chemWrap = document.getElementById('res-chemistry-wrapper');
        chemWrap.hidden = !chem;
        if (chem) {
            document.getElementById('res-chemistry-score').textContent = `${ownerMbti} 보호자와 궁합 ${chem.score}점`;
            document.getElementById('res-chemistry-text').innerHTML = chem.text;
        }

        // --- 유형별로 이어 읽을 글 ---
        const NEXT = {
            1: [[16, '카밍 시그널 이해하기: 몸짓으로 보는 속마음'], [11, '성향별 산책 코스와 강도 조절법'], [7, '분리불안 자가 진단과 교정 교육']],
            2: [[11, '성향별 산책 코스와 강도 조절법'], [21, '짖음 문제 원인별 대처법'], [30, '반려견 동반 여행: 자동차 매너와 멀미 예방']],
            3: [[16, '카밍 시그널 이해하기: 몸짓으로 보는 속마음'], [22, '여러 마리 키울 때 첫 대면 규칙'], [29, '바닥 핥기, 벽 핥기 행동의 원인']],
            4: [[7, '분리불안 자가 진단과 교정 교육'], [15, '슬개골 탈구 예방 실내 운동'], [6, '아파트에서 키우기 좋은 견종과 층간소음']],
        };
        document.getElementById('res-next').innerHTML = NEXT[typeNo].map(([id, title]) =>
            `<li><a class="row-link plain" href="/blog/${id}/"><div><b>${title}</b></div></a></li>`).join('');

        // 내 결과면 다른 메뉴에서 맞춤 추천에 쓰도록 저장 (친구가 보낸 결과는 저장 안 함)
        if (!passed) {
            try { localStorage.setItem('mung_dog', JSON.stringify({ name, type: typeNo, typeName })); } catch (e) {}
            // 멍설명서·멍궁합이 쓰도록 7개 축 점수도 저장 (이 브라우저에만, 채점은 그대로)
            try { localStorage.setItem('mung_result', JSON.stringify({ v: 1, type: typeNo, e: E, s: S, m: M, f: F, i: I, o: O, x: X, at: (d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)(new Date()) })); } catch (e) {}
            track('temperament_test_complete', { type: typeNo, has_mbti: hasMbti });
            if (sharedFrom()) track('shared_visitor_test_complete', { from: sharedFrom() });
            // 친구 궁합 초대를 받고 검사하러 왔다면 이어서 볼 수 있게
            let inv = null;
            try { inv = localStorage.getItem('mung_pending_invite'); } catch (e) {}
            const invBox = document.getElementById('res-invite');
            if (invBox) { invBox.hidden = !(inv && /^\/match\/invite\/#p=[A-Za-z0-9_-]+$/.test(inv)); if (!invBox.hidden) invBox.querySelector('a').href = inv; }
        }

        // --- 공유용 데이터 ---
        window.currentShare = { E, S, M, F, I, O, X, ownerMbti, hasMbti, name, typeNo, typeName, typeSub, chem, stats: inherent };
        const nameOpt = document.getElementById('share-name-opt');
        if (nameOpt) {
            nameOpt.hidden = !name || !!passed;
            document.getElementById('share-name-label').textContent = name ? `공유할 때 이름(${name}) 넣기` : '';
            document.getElementById('share-name').checked = false;
        }
        updateShareData();
        // 주소창도 결과 링크로 바꿔서 새로고침/주소 복사로도 같은 결과가 보이게 함
        history.replaceState(null, '', '/?' + shareParams(!!passed).toString());
    }

    // 공유 링크에는 점수와(보호자가 고른 경우) MBTI만. 강아지 이름은 '이름 넣기'를 골랐을 때만 넣음.
    function shareParams(withName) {
        const d = window.currentShare;
        const params = new URLSearchParams({ e: d.E, s: d.S, m: d.M, f: d.F, i: d.I, o: d.O, x: d.X });
        if (d.hasMbti) params.set('owner', d.ownerMbti);
        if (withName && d.name) params.set('name', d.name);
        return params;
    }
    function updateShareData() {
        const d = window.currentShare;
        const box = document.getElementById('share-name');
        const withName = !!(box && box.checked);
        const subject = withName && d.name ? withTopic(d.name) : '우리 강아지는';
        // 유형별 공유 페이지(/r/N/)에 미리보기 이미지가 있고, 점수는 # 뒤에 담아 서버로 가지 않게 함
        window.currentResultUrl = `${SITE_URL}r/${d.typeNo}/#${shareParams(withName).toString()}`;
        window.currentCardSubject = subject;
        window.currentCardTitle = `${subject} ${d.typeName}`;
        window.currentShareText = d.chem
            ? `${window.currentCardTitle}, 보호자(${d.ownerMbti})랑 궁합은 ${d.chem.score}점이래요. 우리 강아지는 어떤 성격일까요?`
            : `${window.currentCardTitle}${/[가-힣]$/.test(d.typeName) && (d.typeName.charCodeAt(d.typeName.length - 1) - 0xAC00) % 28 ? '이래요' : '래요'}. 우리 강아지는 어떤 성격일까요?`;
    }

    // 다국어 변경 시 현재 화면 갱신
    window.addEventListener('languageChanged', () => {
        const tz = document.getElementById('test-zone');
        const rz = document.getElementById('result-zone');
        if (tz && tz.style.display === 'block') renderQuestion();
        if (rz && rz.style.display === 'block' && window.currentScores) calculateAndShowResults(window.currentScores);
    });

    // ===== 궁합 텍스트 도출 로직 =====
    function getChemistryReport(mbti, dogTitle) {
        const isE = mbti.includes('E');
        const isF = mbti.includes('F');
        const t = translations[getLang()];
        let text = "", score = 0;

        if (dogTitle.includes('폭주') || dogTitle.includes('Runaway')) {
            if (isE) {
                text = t.chem1_text;
                score = 95;
            } else {
                text = t.chem2_text;
                score = 70;
            }
        } else if (dogTitle.includes('브레이크') || dogTitle.includes('소심') || dogTitle.includes('Coward') || dogTitle.includes('Timid')) {
            if (isE) {
                text = t.chem3_text;
                score = 75;
            } else {
                text = t.chem4_text;
                score = 90;
            }
        } else if (dogTitle.includes('집돌이') || dogTitle.includes('Homebody')) {
            if (isF) {
                text = t.chem5_text;
                score = 98;
            } else {
                text = t.chem6_text;
                score = 88;
            }
        } else {
            text = t.chem7_text;
            score = 85;
        }
        
        return { text, score };
    }

    // ===== 결과 텍스트 =====
    function buildResult(E, S, M, F, I, O, X) {
        const t = translations[getLang()];
        let typeTitle = '', inherentDesc = '', acquiredDesc = '', humorComment = '';
        let letterDesc = '', featuresDesc = '', stressDesc = '', tipsDesc = '', matchDesc = '';

        if (E >= 3.5 && S >= 3.5) {
            typeTitle = t.res1_title;
            inherentDesc = t.res1_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            letterDesc = t.res1_letter || '';
            featuresDesc = t.res1_features || '';
            stressDesc = t.res1_stress || '';
            tipsDesc = t.res1_tips || '';
            matchDesc = t.res1_match || '';
        } else if (E >= 3.5 && S < 3.5) {
            typeTitle = t.res2_title;
            inherentDesc = t.res2_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            letterDesc = t.res2_letter || '';
            featuresDesc = t.res2_features || '';
            stressDesc = t.res2_stress || '';
            tipsDesc = t.res2_tips || '';
            matchDesc = t.res2_match || '';
        } else if (E < 3.5 && S >= 3.5) {
            typeTitle = t.res3_title;
            inherentDesc = t.res3_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            letterDesc = t.res3_letter || '';
            featuresDesc = t.res3_features || '';
            stressDesc = t.res3_stress || '';
            tipsDesc = t.res3_tips || '';
            matchDesc = t.res3_match || '';
        } else {
            typeTitle = t.res4_title;
            inherentDesc = t.res4_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            letterDesc = t.res4_letter || '';
            featuresDesc = t.res4_features || '';
            stressDesc = t.res4_stress || '';
            tipsDesc = t.res4_tips || '';
            matchDesc = t.res4_match || '';
        }

        if (I >= 3.5 && O >= 3.5) {
            acquiredDesc = t.res1_acquired.replace('{{ I }}', I.toFixed(1)).replace('{{ O }}', O.toFixed(1)).replace('{{ X }}', X.toFixed(1));
            humorComment = t.res1_humor;
        } else if (I < 3.5 && O >= 3.5) {
            acquiredDesc = t.res2_acquired.replace('{{ I }}', I.toFixed(1)).replace('{{ O }}', O.toFixed(1)).replace('{{ X }}', X.toFixed(1));
            humorComment = t.res2_humor;
        } else if (I >= 3.5 && O < 3.5) {
            acquiredDesc = t.res3_acquired.replace('{{ I }}', I.toFixed(1)).replace('{{ O }}', O.toFixed(1)).replace('{{ X }}', X.toFixed(1));
            humorComment = t.res3_humor;
        } else {
            acquiredDesc = t.res4_acquired.replace('{{ I }}', I.toFixed(1)).replace('{{ O }}', O.toFixed(1)).replace('{{ X }}', X.toFixed(1));
            humorComment = t.res4_humor;
        }

        return { typeTitle, inherentDesc, acquiredDesc, humorComment, letterDesc, featuresDesc, stressDesc, tipsDesc, matchDesc };
    }


    // ===== 다시 시작 =====
    function restartTest() {
        currentIdx = 0;
        answers = {};
        history.replaceState(null, '', '/');
        show('intro-zone');
    }

    // ===== 카카오톡 공유 =====
    function shareKakao() {
        const url = viaUrl(window.currentResultUrl || SITE_URL, 'kakao');
        const title = window.currentCardTitle || '강아지 성격 테스트';
        const text = window.currentShareText || '우리 강아지는 어떤 성격일까요?';

        if (kakaoReady()) {
            try {
                (Kakao.Share || Kakao.Link).sendDefault({
                    objectType: 'feed',
                    content: {
                        title,
                        description: text,
                        imageUrl: window.currentShare ? `${SITE_URL}img/og-type-${window.currentShare.typeNo}.jpg` : SITE_URL + 'og-image.png',
                        link: { mobileWebUrl: url, webUrl: url }
                    },
                    buttons: [{ title: '우리 강아지도 해보기', link: { mobileWebUrl: url, webUrl: url } }]
                });
                track('result_share', { content: 'temperament', method: 'kakao', with_name: withNameNow() });
                return;
            } catch (err) {
                console.error('카카오 공유 에러:', err);
            }
        }
        shareResultLink();
    }

    // ===== 링크 공유 (모바일은 공유 시트, PC는 복사) =====
    function shareResultLink() {
        const url = viaUrl(window.currentResultUrl || window.location.href, 'link');
        track('result_share', { content: 'temperament', method: 'link', with_name: withNameNow() });
        const text = window.currentShareText || '';
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && navigator.share) {
            navigator.share({ title: window.currentCardTitle || document.title, text, url })
                .catch(err => { if (err.name !== 'AbortError') executeCopy(url); });
        } else {
            executeCopy(url);
        }
    }

    function executeCopy(text) {
        copyToClipboard(text, translations[getLang()]);
    }

    // ===== 결과 카드 이미지 저장 (1080x1350 세로 카드, share-card.js) =====
    function saveAsImage() {
        const btn = document.getElementById('btn-save');
        const label = btn.textContent;
        const done = () => { btn.textContent = label; btn.disabled = false; };
        btn.textContent = '이미지 만드는 중...';
        btn.disabled = true;

        const d = window.currentShare;
        track('result_share', { content: 'temperament', method: 'image', with_name: withNameNow() });
        MungCard.temperament({
            type: d.typeNo, subject: window.currentCardSubject, typeName: d.typeName, typeSub: d.typeSub,
            stats: d.stats, chem: d.chem ? `보호자 ${d.ownerMbti}와 궁합 ${d.chem.score}점` : '',
        }).then(canvas => MungCard.deliver(canvas, `mungtest-${d.typeName}.png`, window.currentShareText || ''))
        .then(done).catch(err => {
            console.error('이미지 저장 에러:', err);
            alert('이미지를 만들지 못했어요. 화면을 캡처해서 공유해 주세요.');
            done();
        });
    }

    // ===== 공유 링크로 들어온 경우 결과 바로 보여주기 =====
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('result-zone')) return;
        const p = new URLSearchParams(window.location.search);

        if (p.has('e') || p.has('dogType')) {
            let passed;
            if (p.has('e')) {
                passed = Object.fromEntries(['e', 's', 'm', 'f', 'i', 'o', 'x'].map(k => [k, p.get(k)]));
            } else {
                // 예전 공유 링크(dogType만 있는 경우) 호환
                const dogType = p.get('dogType') || '';
                let e = 3, s = 3;
                if (dogType.includes('브레이크')) { e = 4.5; s = 4.5; }
                else if (dogType.includes('폭주')) { e = 4.5; s = 2.0; }
                else if (dogType.includes('소심')) { e = 2.0; s = 4.5; }
                else if (dogType.includes('집돌이')) { e = 2.0; s = 2.0; }
                passed = { e, s, m: 4, f: 4, i: 4, o: 4, x: 4 };
            }
            passed.owner = p.get('owner') || p.get('ownerMbti') || NO_MBTI;
            passed.name = p.get('name') || '';

            show('result-zone');
            document.getElementById('result-zone').classList.add('is-shared');
            calculateAndShowResults(passed);
            track('shared_link_visit', { content: 'temperament', via: p.get('via') || 'unknown' });
        } else if (p.get('start') === 'true') {
            startTest();
        }
    });
