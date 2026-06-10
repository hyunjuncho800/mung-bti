    // ===== 카카오 SDK 초기화 =====
    try {
        Kakao.init('9c311733c910878af9ea27cd77bb3f4b'); // 이 부분에 나의 실제 JavaScript 키를 대입해줘.
        console.log("Kakao SDK Initialized successfully.");
    } catch(e) {
        console.log("Kakao SDK Initialization error: ", e);
    }

    // ===== 문항 원본 =====
    const baseQuestions = [
        { id: 1,  category: 'E', text: "새로운 산책 경로나 생전 처음 보는 물건을 마주했을 때, 꼬리를 바짝 세우고 적극적으로 다가가 냄새를 맡는다." },
        { id: 2,  category: 'E', text: "택배 상자가 들어오거나 새로운 장난감을 사주면 눈빛이 돌변하며 오랜 시간 탐닉하고 집착한다." },
        { id: 3,  category: 'E', text: "산책 중 나비, 벌레, 길고양이 등을 발견하면 온몸의 근육을 긴장시키며 즉각 추적하려는 본능이 발동한다." },
        { id: 4,  category: 'S', text: "오토바이 배기음이나 천둥소리, 낯선 벨소리가 들리면 순간적으로 몸이 굳거나 침대 밑 등 구석으로 도망친다." },
        { id: 5,  category: 'S', text: "동물병원 문 앞이나 생전 처음 가보는 실내 카페에 입장하면 유독 보호자 다리 뒤에 숨으려 한다." },
        { id: 6,  category: 'S', text: "익숙하지 않은 타인이나 다른 강아지가 예고 없이 다가오면 경계하듯 짖거나 방어적인 으르렁거림을 보인다." },
        { id: 7,  category: 'M', text: "보호자가 조용히 이름을 부르거나 눈을 맞출 때 즉각적이고 격렬하게 반응한다." },
        { id: 8,  category: 'M', text: "보호자가 가짜로 우는 척을 하거나 한숨을 쉬면 다가와 얼굴을 핥아주는 등 감정적 동조 현상을 보인다." },
        { id: 9,  category: 'M', text: "간식 보상 없이도 보호자의 '말 한마디'와 '부드러운 스킨십'만으로 꼬리를 치며 행복해한다." },
        { id: 10, category: 'F', text: "난이도 높은 노즈워크나 장난감 속 숨겨진 간식을 꺼내기 위해 쉽게 포기하지 않고 끝까지 집요하게 매달린다." },
        { id: 11, category: 'F', text: "'앉아', '기다려' 등 기본 교육을 진행할 때, 주변의 사소한 자극에 한눈팔지 않고 오랫동안 주의를 집중한다." },
        { id: 12, category: 'F', text: "뼈다귀나 개껌을 주면 한자리에서 완전히 다 해체할 때까지 지치지 않는 끈기를 보여준다." },
        { id: 13, category: 'I', text: "보호자가 외출 준비를 하거나 문을 열고 나가도 하울링이나 발로 문을 긁는 행위 없이 자기 방석에서 무덤덤하게 잠을 잔다." },
        { id: 14, category: 'I', text: "벨이 울려 흥분한 상태에서도 보호자가 단호하게 '기다려'라고 지시하면 스스로 감정을 조율하고 자제한다." },
        { id: 15, category: 'I', text: "실내에서 보호자 꽁무니를 졸졸 따라다니기보다 자기만의 독립적인 휴식 공간에서 혼자만의 시간을 잘 즐긴다." },
        { id: 16, category: 'O', text: "다른 반려견을 만났을 때 으르렁대지 않고, 카밍 시그널을 부드럽게 주고받으며 양보할 줄 안다." },
        { id: 17, category: 'O', text: "미용실·목욕·발톱 깎기 등 예민할 수 있는 위생 케어 과정을 보호자나 전문가의 통제에 순응하며 안정적으로 잘 참아낸다." },
        { id: 18, category: 'O', text: "산책 중 마주치는 낯선 사람이 조심스럽게 손을 내밀 때 순하게 냄새를 맡고 받아들인다." },
        { id: 19, category: 'X', text: "갑작스러운 이사나 애견 펜션 등 생소한 환경에서도 마킹이나 구토 없이 빠르게 밥을 먹고 적응한다." },
        { id: 20, category: 'X', text: "집안 가구 배치가 크게 바뀌거나 새로운 가전제품이 거실에 들어와도 크게 경계하지 않고 편안하게 스쳐 지나간다." },
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
        const total = questions.length;
        const pct = Math.round(((currentIdx + 1) / total) * 100);

        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-label').textContent = `${currentIdx + 1} / ${total}`;
        document.getElementById('progress-count').textContent = pct + '%';

        // 뒤로가기 버튼
        document.getElementById('btn-prev').disabled = (currentIdx === 0);

        // 다음/완료 버튼
        const isLast = (currentIdx === total - 1);
        document.getElementById('btn-next').textContent = isLast ? '종합 성향 리포트 확인하기 🐾' : '다음 문항으로 →';

        const q = questions[currentIdx];
        const prevVal = answers[q.id] || null;

        const scales = [
            { val: 1, label: '전혀<br>아님' },
            { val: 2, label: '대체로<br>아님' },
            { val: 3, label: '보통' },
            { val: 4, label: '대체로<br>맞음' },
            { val: 5, label: '정말<br>맞음' },
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
            <p class="question-text">${q.text}</p>
            <div class="likert-scale">${optionsHTML}</div>
            <div class="scale-endpoints">
              <span>전혀 해당 없음</span>
              <span>완전히 해당됨</span>
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
            alert('강아지와의 궁합을 확인하기 위해 보호자님의 MBTI를 선택해주세요!');
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

        // 공유를 위해 전역에 저장
        const rawTitle = result.typeTitle.includes(' — ') ? result.typeTitle.split(' — ')[1].replace(/["']/g, '') : result.typeTitle;
        window.currentDogType = rawTitle;
        window.currentOwnerMbti = ownerMbti;
        window.currentScores = { e: E, s: S, m: M, f: F, i: I, o: O, x: X, owner: ownerMbti };

        // 차트 렌더링
        renderInherentChart(E, S, M, F);
        renderAcquiredChart(I, O, X);

        // 칩 렌더링
        const inhChips = document.getElementById('inherent-chips');
        inhChips.innerHTML = [
            { label: '탐험성', val: E },
            { label: '안전성', val: S },
            { label: '교감성', val: M },
            { label: '집중성', val: F },
        ].map(c => `<span class="score-chip blue"><span class="chip-dot"></span>${c.label} <strong>${c.val.toFixed(1)}</strong></span>`).join('');

        const acqChips = document.getElementById('acquired-chips');
        acqChips.innerHTML = [
            { label: '독립성', val: I },
            { label: '사교성', val: O },
            { label: '유연성', val: X },
        ].map(c => `<span class="score-chip green"><span class="chip-dot"></span>${c.label} <strong>${c.val.toFixed(1)}</strong></span>`).join('');

        const result = buildResult(E, S, M, F, I, O, X);

        document.getElementById('res-type-title').textContent = result.typeTitle;
        document.getElementById('res-inherent-desc').textContent = result.inherentDesc;
        document.getElementById('res-acquired-desc').textContent = result.acquiredDesc;
        document.getElementById('res-humor-comment').textContent = '🍖 ' + result.humorComment;

        document.getElementById('res-summary-list').innerHTML = [
            { label: '탐험성', val: E, cls: E >= 3.5 ? 'green' : 'orange', desc: E >= 3.5 ? '호기심 넘치는 탐험가 기질' : '신중하고 차분한 관조 기질' },
            { label: '안전성', val: S, cls: S >= 3.5 ? 'orange' : 'green', desc: S >= 3.5 ? '소음·낯선 환경에 민감함' : '외부 자극에 비교적 담대함' },
            { label: '교감성', val: M, cls: M >= 3.5 ? 'green' : 'orange', desc: M >= 3.5 ? '보호자와 강한 유대 형성' : '독립적·쿨한 애정 표현 스타일' },
            { label: '집중성', val: F, cls: F >= 3.5 ? 'green' : 'orange', desc: F >= 3.5 ? '끈질기고 포기를 모르는 집요함' : '빠른 전환과 다양성을 선호' },
            { label: '독립성', val: I, cls: I >= 3.5 ? 'green' : 'orange', desc: I >= 3.5 ? '분리 상황에도 안정적인 자율 조율' : '보호자 의존도가 높아 밀착형' },
            { label: '사교성', val: O, cls: O >= 3.5 ? 'green' : 'orange', desc: O >= 3.5 ? '타견·타인과 원만한 친화력' : '케어·사회화 훈련 강화 권장' },
            { label: '유연성', val: X, cls: X >= 3.5 ? 'green' : 'orange', desc: X >= 3.5 ? '환경 변화에 빠른 회복탄력성' : '환경 변화 시 완충 케어 필요' },
        ].map(item => `
          <li class="${item.cls}">
            <strong>${item.label} ${item.val.toFixed(1)}점</strong> — ${item.desc}
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

    // ===== 궁합 텍스트 도출 로직 =====
    function getChemistryReport(mbti, dogTitle) {
        const isE = mbti.includes('E');
        const isF = mbti.includes('F');
        let text = "", score = 0;

        if (dogTitle.includes('폭주')) {
            if (isE) {
                text = "에너지 대폭발 덤앤더머 콤비! 주말마다 온 동네 오프로드를 누비는 환상의 런닝메이트입니다. 둘 다 지치지 않아서 집안 가구가 평화롭습니다.";
                score = 95;
            } else {
                text = "집돌이 집순이 집사와 에너지 과잉 에너자이저의 만남! 강아지는 나가자고 줄을 물고 오고, 보호자는 침대와 물아일체 중이군요. 보호자님의 체력 방전을 심심한 위로를 전합니다. 산책 대행이나 노즈워크 대량 투하가 시급합니다.";
                score = 70;
            }
        } else if (dogTitle.includes('브레이크') || dogTitle.includes('소심')) {
            if (isE) {
                text = "보호자는 파티광, 강아지는 쫄보! 텐션 차이가 제법 납니다. 외향적인 보호자님이 억지로 시끌벅적한 애견카페에 데려가면 강아지는 구석에서 벌벌 떨 수 있어요. 아이의 속도에 맞춰주는 배려가 필요합니다.";
                score = 75;
            } else {
                text = "서로의 평온함을 존중하는 안정적 소울메이트! 시끄러운 세상 속 둘만의 조용한 아지트를 사랑하는 환상의 짝꿍입니다. 억지로 나가지 않아도 눈빛만으로 통하는 사이군요.";
                score = 90;
            }
        } else if (dogTitle.includes('집돌이')) {
            if (isF) {
                text = "눈물 없인 볼 수 없는 영혼의 단짝! 서로 눈빛만 봐도 가슴이 찡해지는 감성 충만 조합입니다. 단, 너무 애틋해서 생기는 분리불안을 조심하세요.";
                score = 98;
            } else {
                text = "실용주의 집사와 게으른 천재견의 만남! '필요 없는 움직임은 최소화한다'는 신념이 기가 막히게 일치합니다. 에너지를 아끼며 스마트하게 휴식하는 찰떡궁합 룸메이트입니다.";
                score = 88;
            }
        } else {
            text = "눈빛만 봐도 통하는 단짝 콤비! 서로의 영역을 존중하면서도 필요할 때 완벽한 케미를 보여줍니다.";
            score = 85;
        }
        
        return { text, score };
    }

    // ===== 내재적 기질 레이더 차트 (애니멀 테마) =====
    function renderInherentChart(E, S, M, F) {
        const ctx = document.getElementById('inherentChart').getContext('2d');
        if (inherentChartInstance) inherentChartInstance.destroy();

        inherentChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['🔍 탐험성', '🛡️ 안전성', '💞 교감성', '🎯 집중성'],
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
        const ctx = document.getElementById('acquiredChart').getContext('2d');
        if (acquiredChartInstance) acquiredChartInstance.destroy();

        acquiredChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['🏠 독립성', '🤝 사교성', '🌱 유연성'],
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
        let typeTitle = '', inherentDesc = '', acquiredDesc = '', humorComment = '';

        if (E >= 3.5 && S >= 3.5) {
            typeTitle = '🔥 호기심 천국 겁쟁이 — "이중인격 브레이크형"';
            inherentDesc = `탐험성(${E.toFixed(1)})과 안전성(${S.toFixed(1)})이 모두 높은 독특한 유전적 배열입니다. 새로운 자극을 보면 심장이 요동치며 돌진하다가도, 막상 대상을 코앞에서 마주하면 '앗 깜짝이야!' 하며 전력 후진하는 웰메이드 양가감정을 장착했습니다. 세상 모든 택배 상자는 다 뜯어야 직성이 풀리지만 초인종 소리에는 침대 밑 전용 벙커로 빛의 속도로 도피하는 유쾌한 매력이 돋보입니다. 교감성(${M.toFixed(1)})과 집중성(${F.toFixed(1)}) 수치도 함께 확인하여 학습 방향을 설정하세요.`;
        } else if (E >= 3.5 && S < 3.5) {
            typeTitle = '🚀 브레이크 고장난 탐험가 — "폭주 호기심형"';
            inherentDesc = `타고난 탐험성(${E.toFixed(1)})이 최상위권인 반면 안전성(${S.toFixed(1)})은 거의 발동하지 않는 '용감무쌍형' DNA입니다. 세상에 무서울 것이 없고 낙엽이 굴러가도 '저것은 무엇인가!' 하며 몸을 던질 기세입니다. 겁이 없어 온 동네 참견쟁이가 될 수 있으므로 충동 조절 훈련이 절대적입니다. 집중성(${F.toFixed(1)})이 높다면 노즈워크나 어질리티 스포츠로 에너지를 건강하게 해소시켜 주세요.`;
        } else if (E < 3.5 && S >= 3.5) {
            typeTitle = '🛡️ 신중하고 세심한 파수꾼 — "소심형 철학자"';
            inherentDesc = `탐험성(${E.toFixed(1)})은 낮고 안전성(${S.toFixed(1)})이 높아 낯선 자극을 만나면 흥분보다 회피 반응이 지배적입니다. 동물병원 대기실이나 새로운 공간에서 큰 스트레스를 표현합니다. 내면적으로는 일상의 변화에 긴장 속에 살아가고 있을 확률이 높으니 체계적 둔감화 훈련이 필요합니다. 교감성(${M.toFixed(1)})이 높다면 보호자의 안심 시그널이 큰 안정제가 됩니다.`;
        } else {
            typeTitle = '🛋️ 평화로운 안방 현자 — "무소유 집돌이형"';
            inherentDesc = `탐험성(${E.toFixed(1)})과 안전성(${S.toFixed(1)})이 모두 낮은 매우 평온하고 무던한 기질입니다. 이불 밖은 위험하다는 진리를 퍼피 시기부터 깨달은 현자 DNA입니다. 거창한 모험보다는 늘 가던 산책로 300m를 편안하게 왕복하는 것에 깊은 안락함을 느낍니다. 집중성(${F.toFixed(1)})을 활용한 차분한 교육으로 천천히 활력을 불어넣어 주세요.`;
        }

        if (I >= 3.5 && O >= 3.5) {
            acquiredDesc = `후천적 독립성(${I.toFixed(1)})과 사교성(${O.toFixed(1)})이 조화롭게 발달한 아주 훌륭한 상태입니다. 보호자님이 그동안 눈물겨운 간식 보상과 일관성 있는 규칙으로 아이에게 엄청난 정서적 신뢰를 제공했음을 방증합니다. 혼자 있을 때는 고독을 즐길 줄 아는 쿨한 강아지이면서도, 미용·케어 시에는 전문가 손길을 묵묵히 받아들이는 '선비형' 성격을 완성했습니다. 유연성(${X.toFixed(1)})까지 높다면 여행도 함께 떠나도 좋습니다.`;
            humorComment = `처방전: 이미 완벽합니다. 보호자님은 내일 당장 강아지 훈육 학원 차리셔도 됩니다. 지금처럼만 맛있는 동결건조 트릿을 지속 공급하십시오.`;
        } else if (I < 3.5 && O >= 3.5) {
            acquiredDesc = `사교성(${O.toFixed(1)})은 훌륭하나 독립성(${I.toFixed(1)})이 낮은 '보호자 한정 껌딱지' 성향입니다. 세상 모든 사람과 개들에겐 꼬리를 흔들며 천사처럼 행동하지만, 집에서 보호자님이 화장실만 가도 통곡의 벽을 세우는 감정 과잉 상태일 수 있습니다. 혼자 머무는 안전지대(방석) 교육을 소량씩 추가해 주는 것이 유익합니다.`;
            humorComment = `처방전: 아이의 우주는 온통 당신뿐입니다. 화장실 갈 때 문을 0.5cm만 열어두어 영혼의 단짝을 안심시키되, 가끔은 냉정한 척 '기다려'를 외치셔야 지갑(벽지 수리비)을 지킵니다.`;
        } else if (I >= 3.5 && O < 3.5) {
            acquiredDesc = `독립성(${I.toFixed(1)})은 우수하나 사교성(${O.toFixed(1)})이 낮아 케어나 사회적 상황에서 협조성 향상이 필요합니다. 혼자 시간은 잘 보내지만 낯선 사람이나 다른 개가 다가오면 경계심이 높아질 수 있습니다. 점진적 노출 훈련과 고보상 간식을 결합한 사회화 교육을 꾸준히 제공해 주세요.`;
            humorComment = `처방전: 혼자서는 완벽한 도사인데 사람 만나면 갑자기 도인 수련 중 모드 돌입. 간식으로 세상이 무섭지 않다는 것을 단계적으로 알려드리세요.`;
        } else {
            acquiredDesc = `독립성(${I.toFixed(1)})과 사교성(${O.toFixed(1)})이 모두 낮게 측정된 경우, 유연성(${X.toFixed(1)})을 높여주는 '밀당 케어'가 집중적으로 필요합니다. 무조건적인 다정함보다는 예측 가능한 스케줄 관리가 필수적입니다. 규칙적인 식사·산책 타임과 짧고 즐거운 훈련 세션이 아이에게 세상이 안전하다는 믿음을 심어줍니다.`;
            humorComment = `처방전: 겉으로는 '까칠한 고양이' 코스프레를 하지만 속으로는 보호자의 손길을 격렬히 갈구하는 완벽한 츤데레. 밀당의 고수가 되어 규칙적 스케줄로 승리하십시오.`;
        }

        return { typeTitle, inherentDesc, acquiredDesc, humorComment };
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
        const shareText = window.currentShareText || `저희 아이는 멍-BTI 검사 결과가 나왔어요! 확인해보세요.`;
        
        // 요구사항에 맞춰 방금 도출된 강아지 유형과 보호자 MBTI 변수를 가져옵니다.
        const dogType = window.currentDogType || '알수없음';
        const ownerMbti = window.currentOwnerMbti || 'MBTI 미입력';
        
        // 파라미터가 붙은 새로운 주소 변수 생성
        const shareUrl = `https://mung-test.com/?dogType=${encodeURIComponent(dogType)}&ownerMbti=${encodeURIComponent(ownerMbti)}`;
        
        // 카카오톡 SDK가 초기화되어 있다면 카카오 공유 실행 시도
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
            try {
                const shareParams = {
                    objectType: 'feed',
                    content: {
                        title: '🐾 우리 강아지 멍-BTI 검사 결과 도출!',
                        description: shareText,
                        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400', 
                        link: {
                            mobileWebUrl: shareUrl,
                            webUrl: shareUrl
                        }
                    },
                    buttons: [
                        {
                            title: '나도 궁합 보러 가기 🐾',
                            link: {
                                mobileWebUrl: shareUrl,
                                webUrl: shareUrl
                            }
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

    // ===== 초기 접속 시 파라미터 확인 =====
    document.addEventListener('DOMContentLoaded', () => {
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
