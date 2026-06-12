document.addEventListener('DOMContentLoaded', () => {
    initKakao();
    
    const weightSlider = document.getElementById('dog-weight-slider');
    const weightInput = document.getElementById('dog-weight-input');

    // 동기화
    weightSlider.addEventListener('input', (e) => {
        weightInput.value = e.target.value;
        calculateSize(false); // 실시간 계산
    });

    weightInput.addEventListener('input', (e) => {
        weightSlider.value = e.target.value;
        calculateSize(false); // 실시간 계산
    });

    const breedSelect = document.getElementById('dog-breed');
    breedSelect.addEventListener('change', () => calculateSize(false));

    const hairRadios = document.querySelectorAll('input[name="hair-length"]');
    hairRadios.forEach(radio => {
        radio.addEventListener('change', () => calculateSize(false));
    });
});

const breedModifiers = {
    // 깊은 흉곽형 (+1.5)
    '푸들': 1.5,
    '말티푸': 1.5,
    '이탈리안 그레이하운드': 1.5,
    
    // 넓은 흉곽형 (+3.5)
    '닥스훈트': 3.5,
    '웰시코기': 3.5,
    '잭러셀 테리어': 3.5,
    
    // 근육/불독형 (+7.0)
    '프렌치 불독': 7.0,
    '퍼그': 7.0,
    '보스턴 테리어': 7.0,
    
    // 표준형 및 기타 (0)
    // 명시하지 않은 견종은 0으로 처리
};

function calculateSize(showScroll = true) {
    const breedSelect = document.getElementById('dog-breed');
    const t = translations[getLang()];
    
    if (!breedSelect.value && showScroll) {
        alert(t.size_alert_breed);
        return;
    }
    
    if (!breedSelect.value) return; // 실시간 계산 방지 (견종 미선택시)

    const selectedOption = breedSelect.options[breedSelect.selectedIndex];
    const breed = selectedOption.dataset.name || "";

    const weight = parseFloat(document.getElementById('dog-weight-input').value);
    const hairRadios = document.querySelectorAll('input[name="hair-length"]');
    let hairModifier = 0;
    hairRadios.forEach(radio => {
        if (radio.checked) {
            hairModifier = parseFloat(radio.value);
        }
    });

    let baseChest = 25 + (3.5 * weight);
    let breedModifier = breedModifiers[breed] || 0;
    
    let finalChest = baseChest + breedModifier + hairModifier;
    
    let size = '';
    if (finalChest <= 32) {
        size = 'S';
    } else if (finalChest <= 35) {
        size = 'SM';
    } else if (finalChest <= 40) {
        size = 'M';
    } else if (finalChest <= 45) {
        size = 'L';
    } else if (finalChest <= 51) {
        size = 'XL';
    } else {
        size = '2XL';
    }

    // 결과 렌더링
    const resultWrapper = document.getElementById('result-wrapper');
    const resSize = document.getElementById('res-size');
    const resChest = document.getElementById('res-chest');

    resSize.textContent = size;
    resChest.textContent = t.res_chest_text + finalChest.toFixed(1) + 'cm';

    resultWrapper.style.display = 'block';
    
    // 강제 리플로우를 통한 애니메이션 재시작
    resultWrapper.classList.remove('fadeInSlide');
    void resultWrapper.offsetWidth; 
    resultWrapper.style.animation = 'none';
    setTimeout(() => {
        resultWrapper.style.animation = 'fadeInSlide 0.5s ease forwards';
    }, 10);

    if (showScroll) {
        resultWrapper.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// 카카오톡 공유 설정 변수
// ==========================================
const KAKAO_JS_KEY = '9c311733c910878af9ea27cd77bb3f4b';

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
// 카카오톡 공유하기
// ==========================================
function shareKakao() {
    const t = translations[getLang()];
    if (!KAKAO_JS_KEY) {
        alert(t.size_alert_kakao);
        return;
    }

    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
        const shareUrl = `https://mung-test.com/size-calculator.html`;
        
        let finalChest = '00';
        let size = 'M';
        if (document.getElementById('result-wrapper').style.display === 'block') {
            size = document.getElementById('res-size').textContent;
            const chestText = document.getElementById('res-chest').textContent;
            const match = chestText.match(/(\d+\.\d+)cm/);
            if(match) finalChest = match[1];
        }

        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: t.size_kakao_title,
                description: t.size_kakao_desc.replace('{{ chest }}', finalChest).replace('{{ size }}', size),
                imageUrl: 'https://hyunjuncho800.github.io/mung-bti/share_thumbnail.jpg',
                link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                },
            },
            buttons: [
                {
                    title: t.size_kakao_btn,
                    link: {
                        mobileWebUrl: shareUrl,
                        webUrl: shareUrl,
                    },
                },
            ],
        });
    } else {
        alert(t.size_alert_kakao_sdk);
    }
}

// ==========================================
// 다시 계산하기
// ==========================================
function resetCalculator() {
    document.getElementById('dog-breed').selectedIndex = 0;
    
    // 몸무게 초기화
    const weightSlider = document.getElementById('dog-weight-slider');
    const weightInput = document.getElementById('dog-weight-input');
    weightSlider.value = 5.0;
    weightInput.value = 5.0;
    
    // 털 길이 초기화 (기본값: 짧음)
    document.getElementById('hair-short').checked = true;
    
    // 결과창 숨기기
    document.getElementById('result-wrapper').style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 언어 변경 시 결과 텍스트 리렌더링
// ==========================================
window.addEventListener('languageChanged', (e) => {
    if (document.getElementById('result-wrapper').style.display === 'block') {
        // 이미 계산된 값이 있으면 그 값을 다시 계산해서 렌더링
        calculateSize(false);
    }
});
