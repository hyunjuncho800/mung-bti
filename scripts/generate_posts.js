const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'post-template.html');
const koDataPath = path.join(__dirname, '../blog_data.json');
const enDataPath = path.join(__dirname, '../blog_data_en.json');
const outputDir = path.join(__dirname, '../');

function getExcerpt(htmlContent) {
    // Strip HTML tags
    let text = htmlContent.replace(/<[^>]+>/g, ' ');
    // Remove extra spaces
    text = text.replace(/\s+/g, ' ').trim();
    if (text.length > 120) {
        return text.substring(0, 120) + '...';
    }
    return text;
}

function generateCTA(postKo, isEnglish) {
    const contentString = (postKo.title + ' ' + postKo.category + ' ' + (postKo.tags ? postKo.tags.join(' ') : '')).toLowerCase();
    
    const behaviorKeywords = ['행동', '성격', '심리', '기질', '분리불안', '카밍', '짖음', '핥기'];
    const sizeKeywords = ['사이즈', '몸무게', '체형', '의류', '패딩', '슬개골'];
    const foodKeywords = ['음식', '영양', '사료', '식단', '자연식'];
    const ageKeywords = ['나이', '생애', '노령', '노화', '치매', '스케줄', '수명'];

    const isBehavior = behaviorKeywords.some(kw => contentString.includes(kw));
    const isSize = sizeKeywords.some(kw => contentString.includes(kw));
    const isFood = foodKeywords.some(kw => contentString.includes(kw));
    const isAge = ageKeywords.some(kw => contentString.includes(kw));

    if (isBehavior) {
        return `
        <div style="margin-top: 40px; padding: 24px; background: #fffaf0; border: 2px dashed #f39c12; border-radius: 12px; text-align: center;">
            <h3 style="margin-top: 0; color: #d35400; font-size: 1.15rem; margin-bottom: 12px;">${isEnglish ? "Curious about your dog's temperament?" : "우리 아이의 행동학적 기질이 더 궁금하다면?"}</h3>
            <a href="index.html?start=true" style="display: inline-block; background: #e67e22; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 1.05rem; transition: background 0.2s;">${isEnglish ? "Take the Temperament Test ➔" : "우리 아이 기질 검사하러 가기 ➔"}</a>
        </div>`;
    } else if (isSize) {
        return `
        <div style="margin-top: 40px; padding: 24px; background: #fffaf0; border: 2px dashed #f39c12; border-radius: 12px; text-align: center;">
            <h3 style="margin-top: 0; color: #d35400; font-size: 1.15rem; margin-bottom: 12px;">${isEnglish ? "Looking for the perfect clothing size for your dog?" : "우리 강아지에게 딱 맞는 옷 사이즈를 찾고 싶다면?"}</h3>
            <a href="size-calculator.html" style="display: inline-block; background: #e67e22; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 1.05rem; transition: background 0.2s;">${isEnglish ? "Get Size Recommendation ➔" : "맞춤형 의류 사이즈 추천 받기 ➔"}</a>
        </div>`;
    } else if (isFood) {
        return `
        <div style="margin-top: 40px; padding: 24px; background: #fffaf0; border: 2px dashed #f39c12; border-radius: 12px; text-align: center;">
            <h3 style="margin-top: 0; color: #d35400; font-size: 1.15rem; margin-bottom: 12px;">${isEnglish ? "Is this food safe for my dog?" : "이 음식, 강아지가 먹어도 될까?"}</h3>
            <a href="food-guide.html" style="display: inline-block; background: #e67e22; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 1.05rem; transition: background 0.2s;">${isEnglish ? "Check Food Guide ➔" : "안전한 음식 가이드 사전 보기 ➔"}</a>
        </div>`;
    } else if (isAge) {
        return `
        <div style="margin-top: 40px; padding: 24px; background: #fffaf0; border: 2px dashed #f39c12; border-radius: 12px; text-align: center;">
            <h3 style="margin-top: 0; color: #d35400; font-size: 1.15rem; margin-bottom: 12px;">${isEnglish ? "How old is my dog in human years?" : "우리 강아지는 사람 나이로 몇 살일까?"}</h3>
            <a href="age-calculator.html" style="display: inline-block; background: #e67e22; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 1.05rem; transition: background 0.2s;">${isEnglish ? "Calculate Dog Age ➔" : "우리 아이 사람 나이 계산하기 ➔"}</a>
        </div>`;
    }
    return '';
}

function main() {
    console.log("Reading templates and data...");
    const template = fs.readFileSync(templatePath, 'utf8');
    const koData = JSON.parse(fs.readFileSync(koDataPath, 'utf8'));
    
    let enData = [];
    if (fs.existsSync(enDataPath)) {
        enData = JSON.parse(fs.readFileSync(enDataPath, 'utf8'));
    } else {
        console.warn("blog_data_en.json not found. Using KO data for EN as fallback.");
        enData = koData;
    }

    const enDataMap = {};
    enData.forEach(p => { enDataMap[p.id] = p; });

    console.log(`Generating ${koData.length} post pages...`);

    koData.forEach(postKo => {
        const postEn = enDataMap[postKo.id] || postKo;
        
        const excerptKo = getExcerpt(postKo.content);
        const titleEn = postKo.title_en || postEn.title;
        const contentEn = postKo.content_en || postEn.content;
        const excerptEn = getExcerpt(contentEn);
        
        const ctaKo = generateCTA(postKo, false);
        const ctaEn = generateCTA(postKo, true);

        let html = template;
        html = html.replace(/\{\{POST_ID\}\}/g, postKo.id);
        
        html = html.replace(/\{\{TITLE_KO\}\}/g, postKo.title);
        html = html.replace(/\{\{EXCERPT_KO\}\}/g, excerptKo);
        html = html.replace(/\{\{CONTENT_KO\}\}/g, postKo.content);
        html = html.replace(/\{\{CTA_KO\}\}/g, ctaKo);
        
        html = html.replace(/\{\{TITLE_EN\}\}/g, titleEn);
        html = html.replace(/\{\{CONTENT_EN\}\}/g, contentEn);
        html = html.replace(/\{\{CTA_EN\}\}/g, ctaEn);

        const outFilePath = path.join(outputDir, `post-${postKo.id}.html`);
        fs.writeFileSync(outFilePath, html, 'utf8');
        console.log(`Generated post-${postKo.id}.html`);
    });

    console.log("All pages generated successfully.");
}

main();
