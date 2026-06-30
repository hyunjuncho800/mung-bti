let travelData = [];

async function loadData() {
    try {
        const response = await fetch('travel_data.json?v=' + new Date().getTime());
        travelData = await response.json();
        
        document.getElementById('loading').style.display = 'none';
        renderGrid();
    } catch (error) {
        console.error("Failed to load travel data:", error);
        document.getElementById('loading').innerHTML = '데이터를 불러오는 데 실패했습니다.';
    }
}

const BUTTON_TYPES = {
    TEST: {
        link: 'mung-test.html',
        titleKo: '여행 가기 전, 우리 아이 기질을 미리 파악하세요!',
        titleEn: 'Check your dog\'s temperament before traveling!',
        btnKo: '기질 및 심리 상태 검사하기 ➔',
        btnEn: 'Take Personality & Psychology Test ➔'
    },
    AGE: {
        link: 'age-calculator.html',
        titleKo: '우리 아이 나이에 맞는 여행 준비가 궁금하다면?',
        titleEn: 'Curious about travel prep for your dog\'s age?',
        btnKo: '우리 아이 나이 계산기 바로가기 ➔',
        btnEn: 'Go to Age Calculator ➔'
    },
    SIZE: {
        link: 'size-calculator.html',
        titleKo: '안전한 야외활동을 위한 맞춤형 사이즈 확인!',
        titleEn: 'Check custom size for safe outdoor activities!',
        btnKo: '맞춤형 의류 사이즈 추천 받기 ➔',
        btnEn: 'Get Personalized Clothing Size Recommendation ➔'
    },
    FOOD: {
        link: 'food-guide.html',
        titleKo: '여행지에서도 안전하게! 먹거리 가이드 확인',
        titleEn: 'Stay safe on trips! Check the food guide',
        btnKo: '안전한 음식 가이드 확인하기 ➔',
        btnEn: 'Check Safe Food Guide ➔'
    }
};

function renderGrid() {
    const grid = document.getElementById('travel-grid');
    const lang = localStorage.getItem('mung_lang') || 'ko';

    const icons = ['🚗', '⛺', '🎒', '🚂', '🌲', '🏖️', '✈️', '🐾', '📸', '🌭'];

    const html = travelData.map((item, index) => {
        const title = lang === 'en' ? item.titleEn : item.titleKo;
        const icon = icons[index % icons.length];
        
        return `
            <div class="travel-card" onclick="openModal(${item.id})">
                <div class="card-img-placeholder">${icon}</div>
                <div class="card-body">
                    <div class="card-title">${title}</div>
                    <div class="card-readmore">Read Guide →</div>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
}

function openModal(id) {
    const item = travelData.find(b => b.id === id);
    if (!item) return;

    const modalElement = document.getElementById('travel-modal');
    modalElement.setAttribute('data-current-id', id);

    const lang = localStorage.getItem('mung_lang') || 'ko';
    const data = lang === 'en' ? item.en : item.ko;
    const title = lang === 'en' ? item.titleEn : item.titleKo;

    document.getElementById('modal-title').innerText = title;
    // Replace newlines with <br> and parse simple lists if needed
    let formattedContent = data.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    
    // Bold numbers if it looks like a list item
    formattedContent = formattedContent.replace(/(\d\.\s.+?)(<br>)/g, '<strong>$1</strong>$2');

    document.getElementById('modal-content-area').innerHTML = formattedContent;
    
    const btnType = item.buttonType || 'TEST';
    const btnConfig = BUTTON_TYPES[btnType];
    const btnBoxTitle = lang === 'en' ? btnConfig.titleEn : btnConfig.titleKo;
    const btnBoxText = lang === 'en' ? btnConfig.btnEn : btnConfig.btnKo;

    document.getElementById('modal-dynamic-btn').innerHTML = `
        <div style="margin-top: 40px; padding: 24px; background: #f0f8ff; border: 2px dashed #1fa2ff; border-radius: 12px; text-align: center;">
            <h3 style="margin-top: 0; color: #1fa2ff; font-size: 1.15rem; margin-bottom: 12px;">${btnBoxTitle}</h3>
            <a href="${btnConfig.link}" style="display: inline-block; background: #1fa2ff; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 1.05rem; transition: background 0.2s;">${btnBoxText}</a>
        </div>
    `;
    
    const modal = document.getElementById('travel-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('travel-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Window click to close
window.onclick = function(event) {
    const modal = document.getElementById('travel-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Listen for lang changes
window.addEventListener('languageChanged', () => {
    if (travelData.length > 0) {
        renderGrid();
        const modal = document.getElementById('travel-modal');
        if (modal.classList.contains('active')) {
            const currentId = parseInt(modal.getAttribute('data-current-id'));
            if(currentId) openModal(currentId);
        }
    }
});

document.addEventListener('DOMContentLoaded', loadData);
