let diagnosticsData = [];

async function loadData() {
    try {
        const response = await fetch('diagnostics_data.json?v=' + new Date().getTime());
        diagnosticsData = await response.json();
        
        document.getElementById('loading').style.display = 'none';
        renderAccordion();
    } catch (error) {
        console.error("Failed to load diagnostics data:", error);
        document.getElementById('loading').innerHTML = '데이터를 불러오는 데 실패했습니다.';
    }
}

const BUTTON_TYPES = {
    TEST: {
        link: 'mung-test.html',
        btnKo: '기질 및 심리 상태 검사하기 ➔',
        btnEn: 'Take Personality & Psychology Test ➔'
    },
    AGE: {
        link: 'age-calculator.html',
        btnKo: '우리 아이 나이 계산기 바로가기 ➔',
        btnEn: 'Go to Age Calculator ➔'
    },
    SIZE: {
        link: 'size-calculator.html',
        btnKo: '맞춤형 의류 사이즈 추천 받기 ➔',
        btnEn: 'Get Personalized Clothing Size Recommendation ➔'
    },
    FOOD: {
        link: 'food-guide.html',
        btnKo: '안전한 음식 가이드 확인하기 ➔',
        btnEn: 'Check Safe Food Guide ➔'
    }
};

function renderAccordion() {
    const container = document.getElementById('acc-container');
    const lang = localStorage.getItem('mung_lang') || 'ko';

    const html = diagnosticsData.map((item, index) => {
        const title = lang === 'en' ? item.titleEn : item.titleKo;
        const data = lang === 'en' ? item.en : item.ko;

        const labelPhys = lang === 'en' ? 'Physical Causes' : '신체적 원인';
        const labelPsych = lang === 'en' ? 'Psychological Causes' : '심리적 원인';
        const labelCare = lang === 'en' ? 'Home Care Guide' : '홈케어 가이드';
        const labelRed = lang === 'en' ? 'Red Flags (Warning)' : '위험 신호 (Red Flag)';
        
        const btnType = item.buttonType || 'TEST';
        const btnConfig = BUTTON_TYPES[btnType];
        const btnText = lang === 'en' ? btnConfig.btnEn : btnConfig.btnKo;

        return `
            <div class="acc-item" id="acc-${item.id}">
                <div class="acc-header" onclick="toggleAccordion(${item.id})">
                    <span>Q. ${title}</span>
                    <span class="acc-icon">▼</span>
                </div>
                <div class="acc-content">
                    <div class="content-section">
                        <h4>🦠 ${labelPhys}</h4>
                        <p>${data.physical}</p>
                    </div>
                    <div class="content-section">
                        <h4>🧠 ${labelPsych}</h4>
                        <p>${data.psychological}</p>
                    </div>
                    <div class="content-section">
                        <h4>💡 ${labelCare}</h4>
                        <p>${data.homecare}</p>
                    </div>
                    <div class="content-section red-flag">
                        <h4>🚨 ${labelRed}</h4>
                        <p>${data.redflag}</p>
                    </div>
                    <div class="cta-box">
                        <a href="${btnConfig.link}" class="cta-btn">${btnText}</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function toggleAccordion(id) {
    const item = document.getElementById(`acc-${id}`);
    
    // Close all other
    document.querySelectorAll('.acc-item').forEach(el => {
        if (el.id !== `acc-${id}`) {
            el.classList.remove('active');
        }
    });

    item.classList.toggle('active');
}

// Listen for lang changes
window.addEventListener('languageChanged', () => {
    if (diagnosticsData.length > 0) {
        // preserve open state
        let openId = null;
        document.querySelectorAll('.acc-item').forEach(el => {
            if(el.classList.contains('active')) openId = parseInt(el.id.replace('acc-',''));
        });
        
        renderAccordion();
        
        if(openId !== null) {
            document.getElementById(`acc-${openId}`).classList.add('active');
        }
    }
});

document.addEventListener('DOMContentLoaded', loadData);
