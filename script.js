    // ===== 카카오 SDK 초기화 =====
    try {
        Kakao.init('9c311733c910878af9ea27cd77bb3f4b'); // 이 부분에 나의 실제 JavaScript 키를 대입해줘.
        console.log("Kakao SDK Initialized successfully.");
    } catch(e) {
        console.log("Kakao SDK Initialization error: ", e);
    }

    // i18n 로직은 외부 파일(i18n.js)로 이관되었습니다.

    // ===== 문항 원본 =====
    const baseQuestions = [
        { id: 1,  category: 'E' },
        { id: 2,  category: 'E' },
        { id: 3,  category: 'E' },
        { id: 4,  category: 'S' },
        { id: 5,  category: 'S' },
        { id: 6,  category: 'S' },
        { id: 7,  category: 'M' },
        { id: 8,  category: 'M' },
        { id: 9,  category: 'M' },
        { id: 10, category: 'F' },
        { id: 11, category: 'F' },
        { id: 12, category: 'F' },
        { id: 13, category: 'I' },
        { id: 14, category: 'I' },
        { id: 15, category: 'I' },
        { id: 16, category: 'O' },
        { id: 17, category: 'O' },
        { id: 18, category: 'O' },
        { id: 19, category: 'X' },
        { id: 20, category: 'X' },
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

    // ===== 상태 =====
    let questions = [];
    let currentIdx = 0;
    let answers = {};
    let inherentChartInstance = null;
    let acquiredChartInstance = null;

    // ===== 시작 =====
    function startTest() {
        questions = shuffle(baseQuestions);      // 랜덤 순서 적용
        currentIdx = 0;
        answers = {};
        document.getElementById('intro-zone').style.display = 'none';
        document.getElementById('test-zone').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderQuestion();
    }

    function scrollToTest() {
        document.getElementById('btn-start-main').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ===== 문항 렌더링 =====
    function renderQuestion() {
        const lang = getLang();
        const t = translations[lang];
        const total = questions.length;
        const pct = Math.round(((currentIdx + 1) / total) * 100);

        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-label').textContent = `${currentIdx + 1} / ${total}`;
        document.getElementById('progress-count').textContent = pct + '%';

        // 뒤로가기 버튼
        document.getElementById('btn-prev').disabled = (currentIdx === 0);

        // 다음/완료 버튼
        const isLast = (currentIdx === total - 1);
        document.getElementById('btn-next').textContent = isLast ? t.btn_next_finish : t.btn_next;

        const q = questions[currentIdx];
        const qText = t['q' + q.id];
        const prevVal = answers[q.id] || null;

        const scales = [
            { val: 1, label: t.likert_1 },
            { val: 2, label: t.likert_2 },
            { val: 3, label: t.likert_3 },
            { val: 4, label: t.likert_4 },
            { val: 5, label: t.likert_5 },
        ];

        const optionsHTML = scales.map(s => {
            const isSelected = (prevVal === s.val);
            const selectedClass = isSelected ? 'selected' : '';
            const checkedAttr = isSelected ? 'checked' : '';
            return `
              <div class="likert-option">
                <label class="likert-label-wrap ${selectedClass}" onclick="selectOption(${q.id}, ${s.val}, this)">
                  <input type="radio" name="q_current" value="${s.val}" ${checkedAttr} readonly>
                  <div class="likert-circle" data-val="${s.val}"></div>
                  <span class="likert-label">${s.label}</span>
                </label>
              </div>`;
        }).join('');

        document.getElementById('question-container').innerHTML = `
          <div class="question-card">
            <div class="question-number-badge">${currentIdx + 1}</div>
            <p class="question-text">${qText}</p>
            <div class="likert-scale">${optionsHTML}</div>
            <div class="scale-endpoints">
              <span>${t.scale_end1}</span>
              <span>${t.scale_end2}</span>
            </div>
          </div>`;
    }

    function selectOption(qid, val, clickedLabel) {
        answers[qid] = val;
        // 같은 문항 내 모든 label에서 selected 제거 후 클릭된 것에만 추가
        document.querySelectorAll('.likert-label-wrap').forEach(lbl => lbl.classList.remove('selected'));
        if (clickedLabel) clickedLabel.classList.add('selected');
        // radio input도 동기화
        document.querySelectorAll('input[name="q_current"]').forEach(r => { r.checked = (parseInt(r.value) === val); });
    }

    // ===== 다음 =====
    function nextQuestion() {
        const q = questions[currentIdx];
        const selected = document.querySelector('input[name="q_current"]:checked');

        if (!selected && answers[q.id] === undefined) {
            const card = document.querySelector('.question-card');
            card.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.4)';
            card.style.borderColor = '#e74c3c';
            setTimeout(() => {
                card.style.boxShadow = '';
                card.style.borderColor = '';
            }, 1000);
            return;
        }

        if (selected) answers[q.id] = parseInt(selected.value);

        currentIdx++;
        if (currentIdx >= questions.length) {
            document.getElementById('test-zone').style.display = 'none';
            document.getElementById('mbti-zone').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            renderQuestion();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ===== 이전 =====
    function prevQuestion() {
        if (currentIdx <= 0) return;
        // 현재 선택값 저장
        const q = questions[currentIdx];
        const selected = document.querySelector('input[name="q_current"]:checked');
        if (selected) answers[q.id] = parseInt(selected.value);

        currentIdx--;
        renderQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== 보호자 MBTI 제출 및 결과 계산 =====
    function submitMbtiAndShowResult() {
        const mbtiSelect = document.getElementById('owner-mbti');
        if (!mbtiSelect.value) {
            alert(translations[getLang()].alert_mbti);
            return;
        }
        
        document.getElementById('mbti-zone').style.display = 'none';
        document.getElementById('result-zone').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        calculateAndShowResults();
    }

    // ===== 결과 계산 =====
    function calculateAndShowResults(passedParams = null) {
        let E, S, M, F, I, O, X;
        let ownerMbti = 'MBTI 미입력';

        if (passedParams) {
            E = parseFloat(passedParams.e);
            S = parseFloat(passedParams.s);
            M = parseFloat(passedParams.m);
            F = parseFloat(passedParams.f);
            I = parseFloat(passedParams.i);
            O = parseFloat(passedParams.o);
            X = parseFloat(passedParams.x);
            ownerMbti = passedParams.owner || 'MBTI 미입력';
        } else {
            const scores = { E: [], S: [], M: [], F: [], I: [], O: [], X: [] };
            questions.forEach(q => { scores[q.category].push(answers[q.id] || 3); });

            const avg = cat => {
                const arr = scores[cat];
                return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));
            };

            E = avg('E'); S = avg('S'); M = avg('M'); F = avg('F');
            I = avg('I'); O = avg('O'); X = avg('X');
            ownerMbti = document.getElementById('owner-mbti').value || 'MBTI 미입력';
        }

        // 공유를 위해 임시 점수만 먼저 전역 저장 (유형 이름은 아래에서 저장)
        window.currentScores = { e: E, s: S, m: M, f: F, i: I, o: O, x: X, owner: ownerMbti };

        // 차트 렌더링
        renderInherentChart(E, S, M, F);
        renderAcquiredChart(I, O, X);

        // 칩 렌더링
        const t = translations[getLang()];
        
        const inhChips = document.getElementById('inherent-chips');
        inhChips.innerHTML = [
            { label: t.sum_e_label, val: E },
            { label: t.sum_s_label, val: S },
            { label: t.sum_m_label, val: M },
            { label: t.sum_f_label, val: F },
        ].map(c => `<span class="score-chip blue"><span class="chip-dot"></span>${c.label} <strong>${c.val.toFixed(1)}</strong></span>`).join('');

        const acqChips = document.getElementById('acquired-chips');
        acqChips.innerHTML = [
            { label: t.sum_i_label, val: I },
            { label: t.sum_o_label, val: O },
            { label: t.sum_x_label, val: X },
        ].map(c => `<span class="score-chip green"><span class="chip-dot"></span>${c.label} <strong>${c.val.toFixed(1)}</strong></span>`).join('');

        const result = buildResult(E, S, M, F, I, O, X);

        // 결과 도출 후 전역 변수에 저장 (공유 기능용)
        const rawTitle = result.typeTitle.includes(' — ') ? result.typeTitle.split(' — ')[1].replace(/["']/g, '') : result.typeTitle;
        window.currentDogType = rawTitle;
        window.currentOwnerMbti = ownerMbti;

        document.getElementById('res-type-title').textContent = result.typeTitle;
        document.getElementById('res-inherent-desc').textContent = result.inherentDesc;
        
        // 새로 추가된 SEO 최적화 텍스트 바인딩
        document.getElementById('res-features-desc').innerHTML = result.featuresDesc;
        document.getElementById('res-tips-desc').innerHTML = result.tipsDesc;
        document.getElementById('res-match-desc').innerHTML = result.matchDesc;

        document.getElementById('res-acquired-desc').textContent = result.acquiredDesc;
        document.getElementById('res-humor-comment').textContent = '🍖 ' + result.humorComment;

        // 차트 라벨 번역 업데이트 처리 (임시)
        renderInherentChart(E, S, M, F);
        renderAcquiredChart(I, O, X);

        document.getElementById('res-summary-list').innerHTML = [
            { label: t.sum_e_label, val: E, cls: E >= 3.5 ? 'green' : 'orange', desc: E >= 3.5 ? t.sum_e_high : t.sum_e_low },
            { label: t.sum_s_label, val: S, cls: S >= 3.5 ? 'orange' : 'green', desc: S >= 3.5 ? t.sum_s_high : t.sum_s_low },
            { label: t.sum_m_label, val: M, cls: M >= 3.5 ? 'green' : 'orange', desc: M >= 3.5 ? t.sum_m_high : t.sum_m_low },
            { label: t.sum_f_label, val: F, cls: F >= 3.5 ? 'green' : 'orange', desc: F >= 3.5 ? t.sum_f_high : t.sum_f_low },
            { label: t.sum_i_label, val: I, cls: I >= 3.5 ? 'green' : 'orange', desc: I >= 3.5 ? t.sum_i_high : t.sum_i_low },
            { label: t.sum_o_label, val: O, cls: O >= 3.5 ? 'green' : 'orange', desc: O >= 3.5 ? t.sum_o_high : t.sum_o_low },
            { label: t.sum_x_label, val: X, cls: X >= 3.5 ? 'green' : 'orange', desc: X >= 3.5 ? t.sum_x_high : t.sum_x_low },
        ].map(item => `
          <li class="${item.cls}">
            <strong>${item.label} ${item.val.toFixed(1)}</strong> — ${item.desc}
          </li>`).join('');

        // MBTI 궁합 매칭 연산
        const chemistryResult = getChemistryReport(ownerMbti, rawTitle);
        
        document.getElementById('res-chemistry-text').innerHTML = `
            <span style="display:inline-block; margin-bottom: 8px; font-weight: bold; color: #8e44ad; background: #f4ecf7; padding: 4px 12px; border-radius: 20px; font-size: 0.9rem;">
                👨‍👩‍👧 보호자 ${ownerMbti} × 🐶 강아지 ${rawTitle}
            </span><br>
            ${chemistryResult.text}
        `;

        // 카카오톡 공유용 전역 텍스트 저장
        window.currentShareText = `저희 아이는 [${rawTitle}], 저는 [${ownerMbti}]가 나와서 궁합 점수 ${chemistryResult.score}점 나왔어요!\n\n우리 궁합 보러 가기`;
    }
    
    // 글로벌 이벤트 리스너: 다국어 변경 시 현재 보이는 화면을 갱신
    window.addEventListener('languageChanged', (e) => {
        const lang = e.detail.lang;
        
        // 검사 중이면 문항 렌더링 다시
        if (document.getElementById('test-zone').style.display === 'block') {
            renderQuestion();
        }
        
        // 결과창 표시 중이면 결과 계산 텍스트 다시 렌더링
        if (document.getElementById('result-zone').style.display === 'block') {
            // 이미 계산된 점수와 MBTI를 활용하여 다시 표시
            if (window.currentScores) {
                calculateAndShowResults(window.currentScores);
            }
        }
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

    // ===== 내재적 기질 레이더 차트 (애니멀 테마) =====
    function renderInherentChart(E, S, M, F) {
        const t = translations[getLang()];
        const ctx = document.getElementById('inherentChart').getContext('2d');
        if (inherentChartInstance) inherentChartInstance.destroy();

        inherentChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [t.sum_e_label, t.sum_s_label, t.sum_m_label, t.sum_f_label],
                datasets: [{
                    label: '본능 점수',
                    data: [E, S, M, F],
                    backgroundColor: 'rgba(99, 179, 237, 0.22)',
                    borderColor: 'rgba(74, 144, 226, 0.9)',
                    pointBackgroundColor: ['#f6ad55','#68d391','#fc8181','#76e4f7'],
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2.5,
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                }]
            },
            options: {
                animation: {
                    duration: 900,
                    easing: 'easeOutQuart',
                },
                scales: {
                    r: {
                        min: 0, max: 5,
                        ticks: {
                            stepSize: 1,
                            font: { size: 10 },
                            color: '#b0bec5',
                            backdropColor: 'transparent',
                        },
                        grid: {
                            color: 'rgba(99,179,237,0.18)',
                            lineWidth: 1.5,
                        },
                        angleLines: {
                            color: 'rgba(99,179,237,0.2)',
                        },
                        pointLabels: {
                            font: { size: 13, weight: '600', family: 'Noto Sans KR' },
                            color: '#34495e',
                            padding: 14,
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(44, 62, 80, 0.9)',
                        titleFont: { size: 12 },
                        bodyFont: { size: 13, weight: 'bold' },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.r.toFixed(1)} / 5.0점`
                        }
                    }
                },
                responsive: true,
            }
        });
    }

    // ===== 후천 성향 레이더 차트 (애니멀 테마) =====
    function renderAcquiredChart(I, O, X) {
        const t = translations[getLang()];
        const ctx = document.getElementById('acquiredChart').getContext('2d');
        if (acquiredChartInstance) acquiredChartInstance.destroy();

        acquiredChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [t.sum_i_label, t.sum_o_label, t.sum_x_label],
                datasets: [{
                    label: '조율 성향 점수',
                    data: [I, O, X],
                    backgroundColor: 'rgba(72, 199, 142, 0.2)',
                    borderColor: 'rgba(39, 174, 96, 0.9)',
                    pointBackgroundColor: ['#b794f4','#f6ad55','#68d391'],
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2.5,
                    pointRadius: 7,
                    pointHoverRadius: 9,
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                }]
            },
            options: {
                animation: {
                    duration: 900,
                    easing: 'easeOutQuart',
                },
                scales: {
                    r: {
                        min: 0, max: 5,
                        ticks: {
                            stepSize: 1,
                            font: { size: 10 },
                            color: '#b0bec5',
                            backdropColor: 'transparent',
                        },
                        grid: {
                            color: 'rgba(72, 199, 142, 0.18)',
                            lineWidth: 1.5,
                        },
                        angleLines: {
                            color: 'rgba(72,199,142,0.22)',
                        },
                        pointLabels: {
                            font: { size: 13, weight: '600', family: 'Noto Sans KR' },
                            color: '#34495e',
                            padding: 14,
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(44, 62, 80, 0.9)',
                        titleFont: { size: 12 },
                        bodyFont: { size: 13, weight: 'bold' },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => ` ${ctx.parsed.r.toFixed(1)} / 5.0점`
                        }
                    }
                },
                responsive: true,
            }
        });
    }

    // ===== 결과 텍스트 =====
    function buildResult(E, S, M, F, I, O, X) {
        const t = translations[getLang()];
        let typeTitle = '', inherentDesc = '', acquiredDesc = '', humorComment = '';
        let featuresDesc = '', tipsDesc = '', matchDesc = '';

        if (E >= 3.5 && S >= 3.5) {
            typeTitle = t.res1_title;
            inherentDesc = t.res1_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            featuresDesc = t.res1_features || '';
            tipsDesc = t.res1_tips || '';
            matchDesc = t.res1_match || '';
        } else if (E >= 3.5 && S < 3.5) {
            typeTitle = t.res2_title;
            inherentDesc = t.res2_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            featuresDesc = t.res2_features || '';
            tipsDesc = t.res2_tips || '';
            matchDesc = t.res2_match || '';
        } else if (E < 3.5 && S >= 3.5) {
            typeTitle = t.res3_title;
            inherentDesc = t.res3_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            featuresDesc = t.res3_features || '';
            tipsDesc = t.res3_tips || '';
            matchDesc = t.res3_match || '';
        } else {
            typeTitle = t.res4_title;
            inherentDesc = t.res4_inherent.replace('{{ E }}', E.toFixed(1)).replace('{{ S }}', S.toFixed(1)).replace('{{ M }}', M.toFixed(1)).replace('{{ F }}', F.toFixed(1));
            featuresDesc = t.res4_features || '';
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

        return { typeTitle, inherentDesc, acquiredDesc, humorComment, featuresDesc, tipsDesc, matchDesc };
    }

    // ===== 다시 시작 =====
    function restartTest() {
        currentIdx = 0;
        answers = {};
        if (inherentChartInstance) { inherentChartInstance.destroy(); inherentChartInstance = null; }
        if (acquiredChartInstance) { acquiredChartInstance.destroy(); acquiredChartInstance = null; }
        document.getElementById('result-zone').style.display = 'none';
        document.getElementById('intro-zone').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== 검사 결과 공유하기 =====
    function shareKakao() {
        const t = translations[getLang()];
        const dogType = window.currentDogType || '알수없음';
        const ownerMbti = window.currentOwnerMbti || 'MBTI 미입력';
        const score = getChemistryReport(ownerMbti, window.currentDogType || '').score;

        let shareText = t.kakao_share_text.replace('{{ dogType }}', dogType).replace('{{ ownerMbti }}', ownerMbti).replace('{{ score }}', score);
        const shareUrl = `https://mung-test.com/?dogType=${encodeURIComponent(dogType)}&ownerMbti=${encodeURIComponent(ownerMbti)}`;
        
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
            try {
                const shareParams = {
                    objectType: 'feed',
                    content: {
                        title: t.kakao_share_title,
                        description: shareText,
                        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400', 
                        link: { mobileWebUrl: shareUrl, webUrl: shareUrl }
                    },
                    buttons: [
                        {
                            title: t.kakao_share_btn,
                            link: { mobileWebUrl: shareUrl, webUrl: shareUrl }
                        }
                    ]
                };
                if (Kakao.Share) {
                    Kakao.Share.sendDefault(shareParams);
                } else if (Kakao.Link) {
                    Kakao.Link.sendDefault(shareParams);
                }
                return; // 성공적으로 호출되면 종료
            } catch (err) {
                console.error("카카오 공유 에러:", err);
                alert("카카오톡 공유를 실행할 수 없습니다.\n카카오 디벨로퍼스에 현재 도메인이 등록되어 있는지 확인해주세요.\n\n대신 결과 링크를 복사합니다.");
                // 에러 발생 시 아래 폴백(Fallback)으로 넘어가도록 진행
            }
        }

        // 모바일 환경인지 간단히 체크 (PC에서는 Share API 동작이 불안정할 수 있으므로 바로 클립보드 복사)
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            navigator.share({
                title: '🐾 우리 강아지 멍-BTI 검사 결과!',
                text: shareText,
                url: shareUrl
            }).catch(function(error) {
                console.log('공유 실패 또는 취소:', error);
                // 사용자가 공유창을 닫은 경우(AbortError)가 아니면 클립보드 시도
                if (error.name !== 'AbortError') {
                    executeCopy(shareUrl);
                }
            });
        } else {
            executeCopy(shareUrl);
        }
    }

    // 클립보드 복사 공통 함수
    function executeCopy(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert("결과 링크가 복사되었습니다. 친구에게 공유해보세요!");
        } catch (err) {
            alert("링크 복사에 실패했습니다. 브라우저 주소창의 URL을 직접 복사해주세요.");
        }
        document.body.removeChild(textArea);
    }

    // ===== 이미지로 저장하기 =====
    function saveAsImage() {
        const resultZone = document.getElementById('result-zone');
        // 로딩 피드백 (버튼 텍스트 변경 등)
        const btnSave = document.getElementById('btn-save');
        const originalText = btnSave.innerHTML;
        btnSave.innerHTML = '저장 중... ⏳';
        btnSave.disabled = true;

        // html2canvas 옵션: 차트 렌더링을 위해 배경색 흰색 보장, CORS 이미지 허용
        html2canvas(resultZone, {
            backgroundColor: '#f5f7fa',
            scale: 2, // 고해상도
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            // 이미지 데이터 URL 추출
            const imgData = canvas.toDataURL('image/png');
            // 다운로드 링크 생성 및 클릭
            const link = document.createElement('a');
            link.download = 'mung-bti-result.png';
            link.href = imgData;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 버튼 원복
            btnSave.innerHTML = originalText;
            btnSave.disabled = false;
        }).catch(err => {
            console.error('이미지 저장 에러:', err);
            alert('이미지 저장 중 오류가 발생했습니다.');
            btnSave.innerHTML = originalText;
            btnSave.disabled = false;
        });
    }

    // ===== 모달 =====
    function openModal(type) { document.getElementById('modal-' + type).classList.add('open'); }
    function closeModal(type) { document.getElementById('modal-' + type).classList.remove('open'); }
    function closeOnBg(e, type) { if (e.target === document.getElementById('modal-' + type)) closeModal(type); }

    // ===== 참여자 수 카운팅 애니메이션 =====
    function animateParticipantCount(targetElement, targetNumber, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutExpo 효과
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeOut * targetNumber);
            targetElement.innerText = currentCount.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                targetElement.innerText = targetNumber.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    // ===== 초기 접속 시 파라미터 확인 =====
    document.addEventListener('DOMContentLoaded', () => {
        // 모바일 햄버거 메뉴 토글 이벤트 추가
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('nav');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // 참여자 수 애니메이션 실행
        const countElement = document.getElementById('participant-count');
        if (countElement && document.getElementById('intro-zone').style.display !== 'none') {
            const mockTarget = 85294; // 가상의 누적 참여자 수
            animateParticipantCount(countElement, mockTarget, 2500);
        }

        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('dogType') || urlParams.has('e')) {
            const dogType = urlParams.get('dogType') || '';
            const ownerMbti = urlParams.get('ownerMbti') || urlParams.get('owner') || 'MBTI 미입력';
            
            let e = 3, s = 3, m = 4, f = 4, i = 4, o = 4, x = 4;
            
            // e 파라미터가 있다면 우선 적용 (이전 버전 하위호환)
            if (urlParams.has('e')) {
                e = urlParams.get('e'); s = urlParams.get('s'); m = urlParams.get('m');
                f = urlParams.get('f'); i = urlParams.get('i'); o = urlParams.get('o'); x = urlParams.get('x');
            } else {
                // dogType만 있는 경우 차트를 그리기 위해 매핑 점수 생성
                if (dogType.includes('브레이크')) { e=4.5; s=4.5; }
                else if (dogType.includes('폭주')) { e=4.5; s=2.0; }
                else if (dogType.includes('소심')) { e=2.0; s=4.5; }
                else if (dogType.includes('집돌이')) { e=2.0; s=2.0; }
            }

            const passedParams = {
                e: e, s: s, m: m, f: f, i: i, o: o, x: x,
                owner: ownerMbti
            };
            
            // UI 처리
            document.getElementById('intro-zone').style.display = 'none';
            document.getElementById('test-zone').style.display = 'none';
            document.getElementById('mbti-zone').style.display = 'none';
            document.getElementById('result-zone').style.display = 'block';

            // 버튼 그룹 토글 (공유된 뷰)
            document.getElementById('btn-group-owner').style.display = 'none';
            document.getElementById('btn-group-shared').style.display = 'flex';

            calculateAndShowResults(passedParams);
        }
    });
