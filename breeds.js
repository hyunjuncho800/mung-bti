let breedsData = [];

async function loadData() {
    try {
        const response = await fetch('breeds_data.json?v=' + new Date().getTime());
        breedsData = await response.json();
        
        document.getElementById('loading').style.display = 'none';
        renderGrid();
    } catch (error) {
        console.error("Failed to load breeds data:", error);
        document.getElementById('loading').innerHTML = '데이터를 불러오는 데 실패했습니다.';
    }
}

function renderGrid() {
    const grid = document.getElementById('breed-grid');
    const lang = localStorage.getItem('mung_lang') || 'ko';

    const html = breedsData.map(breed => {
        const name = lang === 'en' ? breed.breedNameEn : breed.breedNameKo;
        let icon = "🐕";
        if(breed.breedNameKo.includes('푸들')) icon = "🐩";
        
        return `
            <div class="breed-card" onclick="openModal(${breed.id})">
                <div class="breed-icon">${icon}</div>
                <div class="breed-name">${name}</div>
                <div class="breed-en">${breed.breedNameEn}</div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
}

function openModal(id) {
    const breed = breedsData.find(b => b.id === id);
    if (!breed) return;

    const modalElement = document.getElementById('breed-modal');
    modalElement.setAttribute('data-current-id', id);

    const lang = localStorage.getItem('mung_lang') || 'ko';
    const data = lang === 'en' ? breed.en : breed.ko;
    const name = lang === 'en' ? breed.breedNameEn : breed.breedNameKo;

    document.getElementById('modal-title').innerHTML = `🐕 ${name} (${breed.breedNameEn})`;

    // Formatting titles based on language
    const titleHistory = lang === 'en' ? 'History & Origin' : '역사 및 기원';
    const titlePersonality = lang === 'en' ? 'Personality Traits' : '성격적 특징';
    const titleHealth = lang === 'en' ? 'Genetic Diseases & Health Care' : '유전병 및 건강 관리';
    const titleClothing = lang === 'en' ? 'Body Features & Clothing Tips' : '체형 특성 및 의류 선택 팁';

    // Buttons
    const btnTest = lang === 'en' ? 'Take Personality & Psychology Test ➔' : '기질 및 심리 상태 검사하기 ➔';
    const btnSize = lang === 'en' ? 'Get Clothing Size Recommendation ➔' : '의류 사이즈 추천 받기 ➔';
    const btnAge = lang === 'en' ? 'Calculate Dog Age in Human Years ➔' : '우리 아이 사람 나이 계산하기 ➔';

    const bodyHtml = `
        <div class="modal-section">
            <h3>📖 ${titleHistory}</h3>
            <p>${data.history.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="modal-section">
            <h3>💖 ${titlePersonality}</h3>
            <p>${data.personality.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="modal-section">
            <h3>🩺 ${titleHealth}</h3>
            <p>${data.health.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="modal-section">
            <h3>👕 ${titleClothing}</h3>
            <p>${data.clothing.replace(/\n/g, '<br>')}</p>
        </div>

        <div class="cta-container">
            <a href="mung-test.html" class="cta-btn">${btnTest}</a>
            <a href="size-calculator.html" class="cta-btn">${btnSize}</a>
            <a href="age-calculator.html" class="cta-btn">${btnAge}</a>
        </div>
    `;

    document.getElementById('modal-body').innerHTML = bodyHtml;
    
    const modal = document.getElementById('breed-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('breed-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Window click to close
window.onclick = function(event) {
    const modal = document.getElementById('breed-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Listen for lang changes
window.addEventListener('languageChanged', () => {
    if (breedsData.length > 0) {
        renderGrid();
        const modal = document.getElementById('breed-modal');
        if (modal.classList.contains('active')) {
            const currentId = parseInt(modal.getAttribute('data-current-id'));
            if(currentId) openModal(currentId);
        }
    }
});

document.addEventListener('DOMContentLoaded', loadData);
