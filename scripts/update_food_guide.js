const fs = require('fs');
let code = fs.readFileSync('food-guide.js', 'utf8');

// 1. Helpers
const helpers = 
function getCategoryKey(cat) {
    if (cat === '전체') return 'category_all';
    if (cat === '과일류') return 'category_fruit';
    if (cat === '채소 및 야채류') return 'category_veg';
    if (cat === '육류 및 해산물류') return 'category_meat';
    if (cat === '곡물, 견과류 및 유지류') return 'category_grain';
    if (cat === '유제품 및 기타 가공식품류') return 'category_dairy';
    return cat;
}
function getStatusKey(status) {
    if (status === '먹어도 돼요' || status === '안전') return 'status_safe';
    if (status === '소량만 가능해요' || status === '소량만 급여 가능') return 'status_warning';
    if (status === '먹으면 안 돼요' || status === '절대 급여 금지') return 'status_unsafe';
    return status;
}
;
if(!code.includes('getCategoryKey')) {
    code = code.replace('let activeCategories = categoriesKo;', 'let activeCategories = categoriesKo;\n' + helpers);
}

// 2. food_data parsing
code = code.replace(
    'name: food.name,', 
    'name: food.name,\n                name_en: food.name_en || food.name,'
);
code = code.replace(
    'warning: food.description', 
    'warning: food.description,\n                warning_en: food.description_en || food.description'
);

// 3. Category chips
code = code.replace(
    /\<button class="category-chip \$\{cat === currentCategory \? 'active' : ''\}" data-cat="\$\{cat\}"\>\$\{cat\}\<\/button\>/g,
    '<button class="category-chip " data-cat=""></button>'
);

// 4. renderFoodGrid map
code = code.replace(
    'const htmlString = itemsToShow.map(food => {',
    'const lang = typeof getLang === \\'function\\' ? getLang() : (localStorage.getItem(\\'lang\\') || \\'ko\\');\n    const htmlString = itemsToShow.map(food => {\n        const displayName = (lang === \\'en\\' && food.name_en) ? food.name_en : food.name;\n        const displayTag = window.t ? window.t(getStatusKey(food.tag), food.tag) : food.tag;'
);
code = code.replace(
    '<div class="food-name"></div>',
    '<div class="food-name"></div>'
);
code = code.replace(
    /let tagHtml = <div class="food-tag" style="\$\{food.type === 'warning' \? 'color:#d35400; background:#fdf2e9; border: 1px solid #e67e22;' : ''\}"\>#\$\{food.tag\}\<\/div\>;\n        if \(food.type === 'unsafe'\) tagHtml = <div class="food-tag"\>#\$\{food.tag\}\<\/div\>;/g,
    'let tagHtml = <div class="food-tag" style="">#</div>;\n        if (food.type === \\'unsafe\\') tagHtml = <div class="food-tag">#</div>;'
);

// 5. openFoodModal
code = code.replace(
    'const typeLabel = food.tag;',
    'const lang = typeof getLang === \\'function\\' ? getLang() : (localStorage.getItem(\\'lang\\') || \\'ko\\');\n    const displayTag = window.t ? window.t(getStatusKey(food.tag), food.tag) : food.tag;\n    const typeLabel = displayTag;'
);
code = code.replace(
    '<h3><span style="font-size: 2rem;"></span> </h3>',
    'const displayName = (lang === \\'en\\' && food.name_en) ? food.name_en : food.name;\n        <h3><span style="font-size: 2rem;"></span> </h3>'
);
code = code.replace(
    '<p class="food-modal-content-text" style="font-weight:bold; color:var(--text);"></p>',
    'let descKey = \\'\\';\n        if (food.type === \\'safe\\') descKey = \\'modal_safe_desc\\';\n        else if (food.type === \\'warning\\') descKey = \\'modal_warning_desc\\';\n        else descKey = \\'modal_unsafe_desc\\';\n        const displayDesc = window.t ? window.t(descKey, food.desc) : food.desc;\n        <p class="food-modal-content-text" style="font-weight:bold; color:var(--text);"></p>'
).replace('<p class', '<p class').replace('</p>', '</p>');

code = code.replace(
    '<strong style="color:var(--text); font-size:1.05rem;">?? 상세 설명 / 급여 주의사항</strong>',
    '<strong style="color:var(--text); font-size:1.05rem;"></strong>'
);
code = code.replace(
    '<p class="food-modal-content-text" style="margin-top: 8px; line-height: 1.6;"></p>',
    'const displayWarning = (lang === \\'en\\' && food.warning_en) ? food.warning_en : food.warning;\n            <p class="food-modal-content-text" style="margin-top: 8px; line-height: 1.6;"></p>'
).replace('<p class="food', '<p class="food').replace('</p>', '</p>');

// 6. Add translation change listener
const listenerCode = 
    window.addEventListener('languageChanged', () => {
        initCategoryChips();
        const tabSafe = document.getElementById('tab-safe');
        const tabWarning = document.getElementById('tab-warning');
        const tabUnsafe = document.getElementById('tab-unsafe');
        if (tabSafe) tabSafe.textContent = window.t ? window.t('status_safe', '먹어도 돼요') : '먹어도 돼요';
        if (tabWarning) tabWarning.textContent = window.t ? window.t('status_warning', '소량만 가능해요') : '소량만 가능해요';
        if (tabUnsafe) tabUnsafe.textContent = window.t ? window.t('status_unsafe', '먹으면 안 돼요') : '먹으면 안 돼요';
        renderFoodGrid(true);
    });
});;
code = code.replace(/}\);\n$/g, listenerCode);

fs.writeFileSync('food-guide.js', code);
console.log('Update successful.');
