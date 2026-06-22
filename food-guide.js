const foodData = [
    // 먹어도 되는 음식 (Safe)
    {
        id: "safe_pollack",
        type: "safe",
        icon: "🐟",
        name: "북어",
        tag: "기력 회복",
        desc: "강아지들의 보양식으로 불릴 만큼 아미노산이 풍부하고 기력 회복에 아주 좋습니다.",
        warning: "반드시 염분을 완전히 제거(물에 여러 번 담가 짠기 빼기)하고 가시를 완벽하게 발라낸 뒤 급여해야 합니다.",
        howTo: "염분을 뺀 후 푹 끓여서 국물과 함께 살코기를 주거나, 건조해서 간식으로 줍니다."
    },
    {
        id: "safe_sweetpotato",
        type: "safe",
        icon: "🍠",
        name: "고구마",
        tag: "식이섬유 풍부",
        desc: "달콤한 맛으로 기호성이 매우 높고 식이섬유가 풍부해 변비 예방에 도움을 줍니다.",
        warning: "탄수화물과 당분이 많아 과식할 경우 비만의 원인이 될 수 있습니다. 하루 섭취 칼로리의 10% 이내로 제한하세요.",
        howTo: "반드시 찌거나 구워서 완전히 익힌 후 작게 잘라 급여하며, 껍질은 질길 수 있으니 벗겨주는 것이 좋습니다."
    },
    {
        id: "safe_apple",
        type: "safe",
        icon: "🍎",
        name: "사과",
        tag: "비타민 풍부",
        desc: "비타민 A와 C가 풍부하고 수분이 많아 소화와 피로 해소에 좋습니다.",
        warning: "사과 씨앗에는 시안화물(청산가리 성분)이 들어있어 매우 위험합니다. 또한 심지와 꼭지도 질식 위험이 있으니 절대 주면 안 됩니다.",
        howTo: "깨끗이 씻은 후 씨, 심지, 껍질을 완벽히 제거하고 목에 걸리지 않도록 작게 깍둑썰기하여 급여합니다."
    },
    {
        id: "safe_carrot",
        type: "safe",
        icon: "🥕",
        name: "당근",
        tag: "눈 건강 개선",
        desc: "베타카로틴과 비타민 A가 풍부하여 시력 보호 및 털 건강에 탁월합니다. 딱딱해서 치석 제거에도 어느 정도 도움이 됩니다.",
        warning: "소화력이 약한 강아지는 생당근을 먹고 그대로 변으로 배출할 수 있습니다.",
        howTo: "생으로 작게 잘라 주거나, 소화가 잘 되도록 살짝 데쳐서 주면 베타카로틴 흡수율이 높아집니다."
    },
    
    // 먹으면 안 되는 음식 (Unsafe)
    {
        id: "unsafe_chocolate",
        type: "unsafe",
        icon: "🍫",
        name: "초콜릿",
        tag: "테오브로민 중독",
        desc: "강아지에게 치명적인 독성 물질인 테오브로민이 함유되어 있습니다.",
        warning: "구토, 설사, 과도한 헐떡임, 발작을 일으키며 심하면 급성 심부전으로 사망에 이를 수 있는 매우 위험한 음식입니다.",
        howTo: "절대 닿지 않는 곳에 보관하고, 만약 먹었다면 즉시 24시간 동물병원으로 이동해 구토 처치를 받아야 합니다."
    },
    {
        id: "unsafe_grape",
        type: "unsafe",
        icon: "🍇",
        name: "포도 및 건포도",
        tag: "급성 신부전 유발",
        desc: "포도의 알맹이, 껍질, 건포도 등 포도와 관련된 모든 것은 극소량으로도 강아지에게 치명적입니다.",
        warning: "신장을 급격하게 망가뜨려 급성 신부전을 유발합니다. 섭취 후 몇 시간 내에 구토나 식욕 부진이 나타날 수 있습니다.",
        howTo: "실수로라도 떨어뜨리지 않도록 주의해야 하며, 섭취가 의심되면 즉시 병원에 방문해야 합니다."
    },
    {
        id: "unsafe_onion",
        type: "unsafe",
        icon: "🧅",
        name: "양파 및 마늘",
        tag: "적혈구 파괴",
        desc: "양파, 마늘, 파, 부추 등의 백합과 식물에는 강아지의 적혈구를 파괴하는 N-프로필 이황화물이 포함되어 있습니다.",
        warning: "익히거나 끓여도 독성이 사라지지 않습니다. 심각한 빈혈, 혈뇨, 무기력증을 유발합니다.",
        howTo: "사람이 먹는 찌개나 국물(양파가 우러난 국물)도 절대 급여해서는 안 됩니다."
    },
    {
        id: "unsafe_macadamia",
        type: "unsafe",
        icon: "🥜",
        name: "마카다미아",
        tag: "신경계 중독",
        desc: "강아지에게만 특이적으로 작용하는 독성이 있어 소량으로도 마비 증상을 일으킵니다.",
        warning: "뒷다리 마비, 구토, 고열, 심박수 증가 등의 중독 증상이 나타납니다.",
        howTo: "마카다미아가 포함된 쿠키나 초콜릿 등 가공식품을 각별히 주의해야 합니다."
    }
];

let currentType = 'safe'; // 'safe' or 'unsafe'
let searchQuery = '';

function renderFoodGrid() {
    const grid = document.getElementById('food-grid');
    const lang = typeof getLang === 'function' ? getLang() : 'ko';
    
    // 필터링
    const filtered = foodData.filter(food => {
        const matchType = food.type === currentType;
        const matchSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            food.tag.toLowerCase().includes(searchQuery.toLowerCase());
        return matchType && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">${lang === 'ko' ? '검색 결과가 없습니다.' : 'No results found.'}</div>`;
        return;
    }

    grid.innerHTML = filtered.map(food => {
        const cls = food.type === 'safe' ? 'safe' : 'unsafe';
        return `
            <div class="food-card ${cls}" onclick="openFoodModal('${food.id}')">
                <div class="food-icon">${food.icon}</div>
                <div class="food-name">${food.name}</div>
                <div class="food-tag">${food.tag}</div>
            </div>
        `;
    }).join('');
}

function openFoodModal(foodId) {
    const food = foodData.find(f => f.id === foodId);
    if (!food) return;

    const modal = document.getElementById('food-modal');
    const body = document.getElementById('food-modal-body');
    const lang = typeof getLang === 'function' ? getLang() : 'ko';

    const safeLabel = lang === 'ko' ? '먹어도 돼요 🟢' : 'Safe 🟢';
    const unsafeLabel = lang === 'ko' ? '먹으면 안 돼요 ❌' : 'Unsafe ❌';
    const tagCls = food.type === 'safe' ? 'safe' : 'unsafe';
    const typeLabel = food.type === 'safe' ? safeLabel : unsafeLabel;

    body.innerHTML = `
        <span class="food-modal-tag ${tagCls}">${typeLabel}</span>
        <h3><span style="font-size: 2rem;">${food.icon}</span> ${food.name}</h3>
        
        <p class="food-modal-content-text">${food.desc}</p>
        
        <div style="margin-bottom: 16px;">
            <strong style="color:var(--text); font-size:1.05rem;">💡 ${lang === 'ko' ? '급여/대처 방법' : 'How to feed / Action'}</strong>
            <p class="food-modal-content-text" style="margin-top: 4px;">${food.howTo}</p>
        </div>

        <div class="food-modal-warning">
            <strong style="color: #D93025; font-size: 0.95rem;">⚠️ ${lang === 'ko' ? '주의사항' : 'Warning'}</strong>
            <p style="margin-top: 4px; margin-bottom: 0;">${food.warning}</p>
        </div>
    `;

    modal.classList.add('active');
}

function closeFoodModal() {
    document.getElementById('food-modal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // 탭 이벤트 리스너
    const tabSafe = document.getElementById('tab-safe');
    const tabUnsafe = document.getElementById('tab-unsafe');

    tabSafe.addEventListener('click', () => {
        currentType = 'safe';
        tabSafe.classList.add('active', 'safe');
        tabUnsafe.classList.remove('active', 'unsafe');
        // Reset specific styling when removing active
        tabSafe.style.background = '';
        tabUnsafe.style.background = '';
        renderFoodGrid();
    });

    tabUnsafe.addEventListener('click', () => {
        currentType = 'unsafe';
        tabUnsafe.classList.add('active', 'unsafe');
        tabSafe.classList.remove('active', 'safe');
        renderFoodGrid();
    });

    // 검색 이벤트 리스너
    const searchInput = document.getElementById('food-search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderFoodGrid();
    });

    // 플레이스홀더 다국어 적용 (i18n.js 호환)
    const lang = typeof getLang === 'function' ? getLang() : 'ko';
    if (typeof translations !== 'undefined' && translations[lang]) {
        const ph = translations[lang].search_food_placeholder;
        if (ph) searchInput.placeholder = ph;
    }

    renderFoodGrid();
});
