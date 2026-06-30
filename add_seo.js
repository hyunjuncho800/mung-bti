const fs = require('fs');

function updateSEO(file, title, desc, keywords, type, path) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove old keywords if present
    content = content.replace(/<meta name="keywords"[\s\S]*?>\n?\s*/i, '');
    // Ensure meta keywords
    const keywordsTag = `<meta name="keywords" content="${keywords}">\n    `;
    
    const ogTags = `
    <!-- Open Graph -->
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="https://mung-test.com/${path}">
    <meta property="og:title" content="${title} | mung-test.com">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="https://hyunjuncho800.github.io/mung-bti/share_thumbnail.jpg">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="https://hyunjuncho800.github.io/mung-bti/share_thumbnail.jpg">

    <!-- JSON-LD 구조화 데이터 -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "description": "${desc}",
      "author": {
        "@type": "Organization",
        "name": "mung-test.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "mung-test.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hyunjuncho800.github.io/mung-bti/share_thumbnail.jpg"
        }
      },
      "image": "https://hyunjuncho800.github.io/mung-bti/share_thumbnail.jpg"
    }
    </script>
`;
    // Find canonical and insert there
    const robotsMatch = content.match(/<meta name="robots" content="index, follow">/i);
    if(robotsMatch) {
        // If OG tags already exist, don't add them again (check for og:type)
        if(!content.includes('<meta property="og:type"')) {
            content = content.replace(robotsMatch[0], robotsMatch[0] + '\n' + ogTags);
            // Re-insert keywords after description
            const descMatch = content.match(/<meta name="description"[\s\S]*?>/i);
            if(descMatch) {
                content = content.replace(descMatch[0], descMatch[0] + '\n    ' + keywordsTag);
            }
        }
    }
    fs.writeFileSync(file, content);
}

// 1. breeds.html
updateSEO('breeds.html', 
    '견종 백과사전', 
    '우리나라 인기 반려견들의 역사, 성격, 유전병, 의류 선택 팁까지 모든 것을 담은 심도 깊은 백과사전입니다.', 
    '견종 백과사전, 말티즈, 푸들, 포메라니안, 비숑, 강아지 성격, 강아지 유전병, 소형견 특징, 강아지 종류', 
    'article', 
    'breeds.html'
);

// 2. diagnostics.html
updateSEO('diagnostics.html', 
    '자가진단 가이드', 
    '반려견의 이상 행동과 증상의 원인을 파악하고, 집에서 할 수 있는 홈케어 방법을 알아보는 자가진단 가이드입니다.', 
    '강아지 자가진단, 강아지 이상행동, 강아지 구토, 강아지 설사, 강아지 홈케어, 강아지 건강, 수의학 가이드', 
    'article', 
    'diagnostics.html'
);

// 3. travel.html
updateSEO('travel.html', 
    '여행 및 아웃도어 가이드', 
    '반려견과 함께하는 장거리 여행, 펜션 에티켓, 대중교통 탑승 등 프로 아웃도어 라이프를 위한 필수 가이드입니다.', 
    '애견동반 여행, 강아지 비행기, 강아지 기차 탑승, 애견 펜션 에티켓, 강아지 카시트, 반려견 장거리 이동', 
    'article', 
    'travel.html'
);

console.log("SEO updated.");
