document.addEventListener('DOMContentLoaded', () => {
    initAgeSelects();
    initKakao();
});

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

    // 유효성 검사
    if (!nameInput) {
        alert("강아지 이름을 입력해주세요.");
        document.getElementById('dog-name').focus();
        return;
    }
    if (!breedSelect.value) {
        alert("견종을 선택해주세요.");
        breedSelect.focus();
        return;
    }
    if (years === 0 && months === 0) {
        alert("나이를 입력해주세요.");
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
    if (age >= 0 && age <= 6) {
        return {
            stage: "영유아기",
            text: `${name}(이)는 눈 뜨고 걷기 시작하며 세상 모든 것이 신기한 꼬마 시절입니다. 호기심이 넘쳐 사고도 치지만, ${name}의 존재만으로도 미소를 짓게 하는 천사 같은 시기입니다.`
        };
    } else if (age >= 7 && age <= 15) {
        return {
            stage: "질풍노도 퍼피",
            text: `${name}(이)는 이가 간지러워 이것저것 물어뜯고, 개구쟁이처럼 에너지가 폭발하는 시기입니다. 올바른 사회화와 교감이 ${name}의 평생 성격을 좌우하는 중요한 때이기도 합니다.`
        };
    } else if (age >= 16 && age <= 25) {
        return {
            stage: "청년기",
            text: `${name}(이)는 골격이 다져지고 근육이 완성되는 빛나는 청춘입니다. 에너지가 최고조에 달하며, 보호자와 발맞춰 뛰고 걷는 최고의 산책 메이트입니다.`
        };
    } else if (age >= 26 && age <= 40) {
        return {
            stage: "성견기",
            text: `${name}(이)는 성격이 차분하게 자리 잡고, 눈빛만 봐도 보호자의 마음을 읽어내는 시기입니다. 든든한 가족이자 그 어떤 것과도 바꿀 수 없는 완벽한 단짝 친구입니다.`
        };
    } else if (age >= 41 && age <= 55) {
        return {
            stage: "중년기",
            text: `${name}의 입가에 하얀 털이 조금씩 보이기 시작합니다. 여전히 산책을 사랑하지만, 예전보다 잠이 조금 늘어나는 여유롭고 평화로운 중년입니다.`
        };
    } else if (age >= 56 && age <= 70) {
        return {
            stage: "시니어",
            text: `${name}의 활동량이 눈에 띄게 줄고, 뛸 때 관절을 신경 써주어야 합니다. 함께 걷는 산책 속도를 조금 늦춰주며, 정기적인 건강 검진과 식단 관리가 필요한 시기입니다.`
        };
    } else {
        return {
            stage: "노령견",
            text: `${name}(이)는 예전처럼 멀리 걷지 못하고 눈동자가 조금 탁해질 수 있습니다. 아픈 곳을 숨기려 할 수 있으니, 아주 세심한 관찰과 따뜻한 품이 필요한 귀중하고 애틋한 시간입니다.`
        };
    }
}

// ==========================================
// 기능: 이미지로 저장하기
// ==========================================
function saveResultImage() {
    const captureTarget = document.getElementById('capture-area');
    const saveBtn = document.querySelector('.btn-save');

    saveBtn.disabled = true;
    saveBtn.textContent = '이미지 생성 중... ⏳';

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
        saveBtn.textContent = '결과 이미지로 저장하기 📥';
    }).catch(err => {
        console.error('Image Capture Error:', err);
        alert('이미지 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
        saveBtn.disabled = false;
        saveBtn.textContent = '결과 이미지로 저장하기 📥';
    });
}

// ==========================================
// 기능: 카카오톡 공유하기 (템플릿 메시지 적용)
// ==========================================
function shareKakao() {
    if (!KAKAO_JS_KEY) {
        alert("카카오톡 공유 기능이 설정되지 않았습니다. (JS 키 누락)");
        return;
    }
    if (!KAKAO_TEMPLATE_ID) {
        alert("카카오톡 메시지 템플릿 ID가 설정되지 않았습니다.");
        return;
    }

    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        const dogName = document.getElementById('res-dog-name').textContent;
        const humanAge = document.getElementById('res-human-age').textContent;
        
        Kakao.Share.sendCustom({
            templateId: KAKAO_TEMPLATE_ID,
            templateArgs: {
                'dogName': dogName,
                'humanAge': humanAge,
                'link': window.location.href
            }
        });
    } else {
        alert("카카오톡 SDK가 초기화되지 않았습니다.");
    }
}

// ==========================================
// 다시 계산하기
// ==========================================
function resetCalculator() {
    document.getElementById('dog-name').value = '';
    document.getElementById('dog-breed').selectedIndex = 0;
    document.getElementById('dog-age-years').selectedIndex = 0;
    document.getElementById('dog-age-months').selectedIndex = 0;
    
    document.getElementById('result-wrapper').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
