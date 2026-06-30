// 상태 관리
let foodData = [];
let currentType = 'safe'; // 'safe' or 'unsafe'
let currentCategory = '전체'; // 카테고리 필터
let searchQuery = '';

// 페이지네이션
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let filteredDataCache = []; // 필터링된 전체 결과 캐싱

const categoriesKo = ['전체', '과일류', '채소 및 야채류', '육류 및 해산물류', '곡물, 견과류 및 유지류', '유제품 및 기타 가공식품류'];
let activeCategories = categoriesKo;

async function initData() {
    try {
        const response = await fetch('food_data.json?v=' + new Date().getTime());
        const rawData = await response.json();
        
        foodData = rawData.map(food => {
            let icon = "🍽️";
            if (food.category === "과일류") icon = "🍎";
            else if (food.category === "채소 및 야채류") icon = "🥦";
            else if (food.category === "육류 및 해산물류") icon = "🥩";
            else if (food.category === "곡물, 견과류 및 유지류") icon = "🥜";
            else if (food.category === "유제품 및 기타 가공식품류") icon = "🥛";

            // 사과, 수박 등 특정 아이템에 이모지 덮어쓰기 (선택사항)
            if(food.name.includes('사과')) icon = '🍎';
            if(food.name.includes('수박')) icon = '🍉';
            if(food.name.includes('바나나')) icon = '🍌';
            if(food.name.includes('딸기')) icon = '🍓';
            if(food.name.includes('고구마')) icon = '🍠';
            if(food.name.includes('당근')) icon = '🥕';
            if(food.name.includes('초콜릿')) icon = '🍫';
            if(food.name.includes('아이스크림')) icon = '🍦';

            let foodType = 'unsafe';
            if (food.safetyLevel === '안전') foodType = 'safe';
            else if (food.safetyLevel === '소량만 급여 가능') foodType = 'warning';

            return {
                id: food.id,
                type: foodType,
                icon: icon,
                name: food.name,
                category: food.category,
                tags: [food.safetyLevel, food.category], 
                tag: food.safetyLevel, // 메인 태그 (카드 표시용)
                desc: food.safetyLevel === '안전' ? '안전하게 급여 가능합니다.' : (food.safetyLevel === '소량만 급여 가능' ? '주의하여 소량만 급여하세요.' : '절대 급여 금지'),
                warning: food.description
            };
        });

        initCategoryChips();
        applyFilters();

    } catch (error) {
        console.error("Failed to load food data:", error);
        document.getElementById('food-grid').innerHTML = '<p style="text-align:center; padding:40px;">데이터를 불러오는 데 실패했습니다.</p>';
    }
}

function initCategoryChips() {
    const chipContainer = document.getElementById('category-chips');
    chipContainer.innerHTML = activeCategories.map(cat => 
        `<button class="category-chip ${cat === currentCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');

    chipContainer.querySelectorAll('.category-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentCategory = e.target.dataset.cat;
            
            // UI 업데이트
            chipContainer.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // 초기화 후 렌더링
            currentPage = 1;
            applyFilters();
        });
    });
}

function applyFilters() {
    const defaultCat = activeCategories[0]; // '전체'
    filteredDataCache = foodData.filter(food => {
        // 1. 안전 여부 필터
        const matchType = food.type === currentType;
        
        // 2. 카테고리 필터
        const matchCategory = currentCategory === defaultCat || food.category === currentCategory;

        // 3. 검색어 필터 (이름 또는 태그 배열 내 텍스트 매칭)
        const query = searchQuery.toLowerCase();
        const matchSearch = food.name.toLowerCase().includes(query) || 
                            food.tags.some(tag => tag.toLowerCase().includes(query));

        return matchType && matchCategory && matchSearch;
    });

    renderFoodGrid(true); // reset = true
}

function renderFoodGrid(reset = false) {
    const grid = document.getElementById('food-grid');
    const loadMoreBtn = document.getElementById('btn-load-more');
    
    if (reset) {
        grid.innerHTML = '';
    }

    if (filteredDataCache.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🐶💦</div>
                <div class="empty-text">
                    앗, '<b>${searchQuery}</b>'에 대한 검색 결과가 없어요!<br>다른 음식을 검색해보시거나 필터를 변경해보세요.
                </div>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }

    // 현재 페이지에 해당하는 데이터 조각 (Slice)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const itemsToShow = filteredDataCache.slice(startIndex, endIndex);

    const htmlString = itemsToShow.map(food => {
        let cls = food.type; // 'safe', 'warning', 'unsafe'
        // 소량 급여의 경우 약간의 스타일 구분을 줄 수도 있음 (여기선 태그 텍스트로 구분)
        let tagHtml = `<div class="food-tag" style="${food.type === 'warning' ? 'color:#d35400; background:#fdf2e9; border: 1px solid #e67e22;' : ''}">#${food.tag}</div>`;
        if (food.type === 'unsafe') tagHtml = `<div class="food-tag">#${food.tag}</div>`;

        return `
            <div class="food-card ${cls}" onclick="openFoodModal(${food.id})">
                <div class="food-icon">${food.icon}</div>
                <div class="food-name">${food.name}</div>
                ${tagHtml}
            </div>
        `;
    }).join('');

    // DOM에 추가
    if (reset) {
        grid.innerHTML = htmlString;
    } else {
        grid.insertAdjacentHTML('beforeend', htmlString);
    }

    // 더보기 버튼 표시 여부 결정
    if (filteredDataCache.length > endIndex) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

function openFoodModal(foodId) {
    const food = foodData.find(f => f.id === foodId);
    if (!food) return;

    const modal = document.getElementById('food-modal');
    const body = document.getElementById('food-modal-body');

    const typeLabel = food.tag; // 안전, 소량만 급여 가능, 절대 금지
    let tagCls = food.type; // 'safe', 'warning', 'unsafe'

    body.innerHTML = `
        <span class="food-modal-tag ${tagCls}" style="${food.type === 'warning' ? 'background:#f39c12; color:#fff;' : ''}">${typeLabel}</span>
        <h3><span style="font-size: 2rem;">${food.icon}</span> ${food.name}</h3>
        
        <p class="food-modal-content-text" style="font-weight:bold; color:var(--text);">${food.desc}</p>
        
        <div style="margin-bottom: 16px;">
            <strong style="color:var(--text); font-size:1.05rem;">💡 상세 설명 / 급여 주의사항</strong>
            <p class="food-modal-content-text" style="margin-top: 8px; line-height: 1.6;">${food.warning}</p>
        </div>
    `;

    modal.classList.add('active');
}

function closeFoodModal() {
    document.getElementById('food-modal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 데이터 로드 및 렌더링
    initData();

    // 2. 탭 이벤트 리스너
    const tabSafe = document.getElementById('tab-safe');
    const tabWarning = document.getElementById('tab-warning');
    const tabUnsafe = document.getElementById('tab-unsafe');

    function resetTabs() {
        tabSafe.classList.remove('active', 'safe');
        tabWarning.classList.remove('active', 'warning');
        tabUnsafe.classList.remove('active', 'unsafe');
        tabSafe.style.background = '';
        tabWarning.style.background = '';
        tabUnsafe.style.background = '';
    }

    tabSafe.addEventListener('click', () => {
        currentType = 'safe';
        resetTabs();
        tabSafe.classList.add('active', 'safe');
        
        currentPage = 1;
        applyFilters();
    });

    tabWarning.addEventListener('click', () => {
        currentType = 'warning';
        resetTabs();
        tabWarning.classList.add('active', 'warning');
        
        currentPage = 1;
        applyFilters();
    });

    tabUnsafe.addEventListener('click', () => {
        currentType = 'unsafe';
        resetTabs();
        tabUnsafe.classList.add('active', 'unsafe');
        
        currentPage = 1;
        applyFilters();
    });

    // 3. 검색 이벤트 리스너
    const searchInput = document.getElementById('food-search-input');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        currentPage = 1;
        applyFilters();
    });

    // 4. 더보기 버튼 이벤트 리스너
    const loadMoreBtn = document.getElementById('btn-load-more');
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderFoodGrid(false); // reset = false 로 계속 이어붙이기
    });
});

// Modal background click to close
window.addEventListener('click', (e) => {
    if(e.target.classList.contains('legal-modal')) {
        e.target.classList.remove('active');
    }
});
