document.addEventListener('DOMContentLoaded', () => {
    initAgeSelects();
    initKakao();

    // 햄버거 메뉴 토글 이벤트 리스너 추가
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 공유된 링크로 들어왔을 경우 파라미터 확인 및 자동 렌더링
    checkAndRenderSharedResult();
});

// ==========================================
// 공유된 쿼리 파라미터 확인 및 결과 자동 렌더링
// ==========================================
function checkAndRenderSharedResult() {
    const params = new URLSearchParams(window.location.search);
    const dogName = params.get('name');
    const humanAge = params.get('humanAge');
    let stage = params.get('stage');

    // 결과값이 존재하면 자동 실행
    if (dogName && humanAge) {
        // 처음의 견종/나이 입력 폼 영역 숨기기
        const calcCard = document.querySelector('.calc-card');
        if (calcCard) calcCard.style.display = 'none';

        // 결과 DOM 업데이트
        document.getElementById('res-dog-name').textContent = dogName;
        document.getElementById('res-human-age').textContent = humanAge;

        // 스토리텔링 추출 (넘겨받은 나이 기반)
        const storyInfo = getStoryByAge(parseInt(humanAge, 10), dogName);
        if (!stage) {
            stage = storyInfo.stage;
        }

        document.getElementById('res-stage-tag').textContent = `🐾 ${stage}`;
        document.getElementById('res-story-text').textContent = storyInfo.text;

        // 결과창 표시
        const resultWrapper = document.getElementById('result-wrapper');
        resultWrapper.style.display = 'block';
    }
}

// ==========================================
// 카카오톡 공유 설정 변수
// ==========================================
// 카카오 JS 키와 메시지 템플릿 ID
const KAKAO_JS_KEY = '9c311733c910878af9ea27cd77bb3f4b';
const KAKAO_TEMPLATE_ID = 134227;

function initKakao() {
    try {
        if (KAKAO_JS_KEY && typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            Kakao.init(KAKAO_JS_KEY);
            console.log("Kakao SDK Initialized.");
        }
    } catch (e) {
        console.error("Kakao Init Error:", e);
    }
}

// ==========================================
// 나이 선택(년/개월) 옵션 생성
// ==========================================
function initAgeSelects() {
    const yearSelect = document.getElementById('dog-age-years');
    const monthSelect = document.getElementById('dog-age-months');

    // 년 (0 ~ 25년)
    for (let i = 0; i <= 25; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        if(i === 0) option.selected = true;
        yearSelect.appendChild(option);
    }

    // 개월 (0 ~ 11개월)
    for (let i = 0; i <= 11; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        if(i === 0) option.selected = true;
        monthSelect.appendChild(option);
    }
}

// ==========================================
// 사람 나이 환산 및 결과 렌더링
// ==========================================
function calculateAge() {
    const nameInput = document.getElementById('dog-name').value.trim();
    const breedSelect = document.getElementById('dog-breed');
    const years = parseInt(document.getElementById('dog-age-years').value);
    const months = parseInt(document.getElementById('dog-age-months').value);

    const t = translations[getLang()];

    // 유효성 검사
    if (!nameInput) {
        alert(t.age_alert_name);
        document.getElementById('dog-name').focus();
        return;
    }
    if (!breedSelect.value) {
        alert(t.age_alert_breed);
        breedSelect.focus();
        return;
    }
    if (years === 0 && months === 0) {
        alert(t.age_alert_age);
        return;
    }

    const dogName = nameInput;
    const dogSize = breedSelect.value; // 'small', 'medium', 'large'
    const totalDogYears = years + (months / 12);

    let humanAge = 0;

    // AKC 기준 나이 변환 로직
    if (totalDogYears <= 1) {
        // 첫 1년은 15살
        humanAge = 15 * totalDogYears;
    } else if (totalDogYears <= 2) {
        // 2년 차는 9살 추가 (2살 = 24살)
        humanAge = 15 + 9 * (totalDogYears - 1);
    } else {
        // 3년 차 이후: 소형(+4), 중형(+5), 대형(+6)
        let addFactor = 4;
        if (dogSize === 'medium') addFactor = 5;
        if (dogSize === 'large') addFactor = 6;
        
        humanAge = 24 + addFactor * (totalDogYears - 2);
    }

    // 반올림
    humanAge = Math.round(humanAge);
    
    // 스토리텔링 추출
    const storyInfo = getStoryByAge(humanAge, dogName);

    // DOM 업데이트
    document.getElementById('res-dog-name').textContent = dogName;
    document.getElementById('res-human-age').textContent = humanAge;
    document.getElementById('res-stage-tag').textContent = `🐾 ${storyInfo.stage}`;
    document.getElementById('res-story-text').textContent = storyInfo.text;

    // 결과창 표시 및 스크롤 이동
    const resultWrapper = document.getElementById('result-wrapper');
    resultWrapper.style.display = 'block';
    
    setTimeout(() => {
        resultWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ==========================================
// 스토리텔링 매핑
// ==========================================
function getStoryByAge(age, name) {
    const t = translations[getLang()];
    if (age >= 0 && age <= 6) {
        return {
            stage: t.age_stage1,
            text: t.age_story1.replace(/\{\{ name \}\}/g, name)
        };
    } else if (age >= 7 && age <= 15) {
        return {
            stage: t.age_stage2,
            text: t.age_story2.replace(/\{\{ name \}\}/g, name)
        };
    } else if (age >= 16 && age <= 25) {
        return {
            stage: t.age_stage3,
            text: t.age_story3.replace(/\{\{ name \}\}/g, name)
        };
    } else if (age >= 26 && age <= 40) {
        return {
            stage: t.age_stage4,
            text: t.age_story4.replace(/\{\{ name \}\}/g, name)
        };
    } else if (age >= 41 && age <= 55) {
        return {
            stage: t.age_stage5,
            text: t.age_story5.replace(/\{\{ name \}\}/g, name)
        };
    } else if (age >= 56 && age <= 70) {
        return {
            stage: t.age_stage6,
            text: t.age_story6.replace(/\{\{ name \}\}/g, name)
        };
    } else {
        return {
            stage: t.age_stage7,
            text: t.age_story7.replace(/\{\{ name \}\}/g, name)
        };
    }
}

// ==========================================
// 기능: 이미지로 저장하기
// ==========================================
function saveResultImage() {
    const t = translations[getLang()];
    const captureTarget = document.getElementById('capture-area');
    const saveBtn = document.querySelector('.btn-save');

    saveBtn.disabled = true;
    saveBtn.textContent = t.age_save_loading;

    html2canvas(captureTarget, {
        scale: 2, // 고해상도 캡처
        backgroundColor: '#fffdf9',
        useCORS: true
    }).then(canvas => {
        const dogName = document.getElementById('res-dog-name').textContent;
        const link = document.createElement('a');
        link.download = `나이계산기_${dogName}_결과.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        saveBtn.disabled = false;
        saveBtn.textContent = t.age_save_btn;
    }).catch(err => {
        console.error('Image Capture Error:', err);
        alert(t.age_alert_img_err);
        saveBtn.disabled = false;
        saveBtn.textContent = t.age_save_btn;
    });
}

// ==========================================
// 기능: 카카오톡 공유하기 (피드 방식 적용)
// ==========================================
function shareKakao() {
    const t = translations[getLang()];
    if (!KAKAO_JS_KEY) {
        alert(t.age_alert_kakao_key);
        return;
    }

    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        // 결과 화면에 렌더링된 최종 결과값 가져오기
        const dogName = document.getElementById('res-dog-name').textContent || '강아지';
        const humanAge = document.getElementById('res-human-age').textContent || '0';
        const currentStageRaw = document.getElementById('res-stage-tag').textContent || '';
        const currentStage = currentStageRaw.replace('🐾 ', '').trim();
        
        // 쿼리 파라미터 조립 (기질 검사처럼 결과값 전송)
        const shareUrl = `https://mung-test.com/age-calculator.html?name=${encodeURIComponent(dogName)}&humanAge=${humanAge}&stage=${encodeURIComponent(currentStage)}`;

        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: t.age_kakao_title,
                description: t.age_kakao_desc.replace('{{ name }}', dogName),
                imageUrl: 'https://hyunjuncho800.github.io/mung-bti/share_thumbnail.jpg',
                link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                },
            },
            buttons: [
                {
                    title: t.age_kakao_btn,
                    link: {
                        mobileWebUrl: shareUrl,
                        webUrl: shareUrl,
                    },
                },
            ],
        });
    } else {
        alert(t.age_alert_kakao_sdk);
    }
}

// ==========================================
// 다시 계산하기
// ==========================================
function resetCalculator() {
    // 공유된 결과 화면일 때는 파라미터가 없는 순수 주소로 새로고침
    if (window.location.search) {
        window.location.href = window.location.origin + window.location.pathname;
        return;
    }

    document.getElementById('dog-name').value = '';
    document.getElementById('dog-breed').selectedIndex = 0;
    document.getElementById('dog-age-years').selectedIndex = 0;
    document.getElementById('dog-age-months').selectedIndex = 0;
    
    document.getElementById('result-wrapper').style.display = 'none';
    const calcCard = document.querySelector('.calc-card');
    if (calcCard) calcCard.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 언어 변경 시 결과 리렌더링
// ==========================================
window.addEventListener('languageChanged', (e) => {
    // 결과창이 열려있으면 텍스트 다시 렌더링
    if (document.getElementById('result-wrapper').style.display === 'block') {
        const humanAge = parseInt(document.getElementById('res-human-age').textContent);
        const dogName = document.getElementById('res-dog-name').textContent;
        if (!isNaN(humanAge) && dogName) {
            const storyInfo = getStoryByAge(humanAge, dogName);
            document.getElementById('res-stage-tag').textContent = `🐾 ${storyInfo.stage}`;
            document.getElementById('res-story-text').textContent = storyInfo.text;
        }
    }
});
