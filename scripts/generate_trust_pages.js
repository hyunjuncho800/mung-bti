const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\HJ\\Desktop\\강아지심리테스트';

const baseContent = fs.readFileSync(path.join(dir, 'travel.html'), 'utf8');

const generatePage = (filename, title, heading, bodyContent) => {
    let newContent = baseContent.replace(/<title>.*?<\/title>/, `<title>${title} | mung-test.com</title>`);
    
    // Replace Open Graph / Meta tags roughly
    newContent = newContent.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${title} 페이지입니다.">`);
    newContent = newContent.replace(/<meta property="og:title" content=".*?">/, `<meta property="og:title" content="${title} | mung-test.com">`);
    newContent = newContent.replace(/<meta property="og:description" content=".*?">/, `<meta property="og:description" content="${title} 페이지입니다.">`);
    
    const mainMatch = newContent.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if(mainMatch) {
        const newMain = `<main class="container" style="max-width: 800px; margin: 40px auto; min-height: 50vh;">
            <div class="page-header">
                <h1 class="page-title" style="margin-bottom: 20px;">${heading}</h1>
            </div>
            <div style="background: var(--card); padding: 40px; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); line-height: 1.8; color: var(--text);">
                ${bodyContent}
            </div>
        </main>`;
        newContent = newContent.replace(/<main[^>]*>[\s\S]*?<\/main>/, newMain);
    }
    
    // Also remove any <script src="travel.js"></script> if present inside
    newContent = newContent.replace(/<script src="travel.js.*?"><\/script>/, '');

    fs.writeFileSync(path.join(dir, filename), newContent, 'utf8');
};

const aboutBody = `
    <h2>환영합니다! mung-test.com에 오신 것을 환영합니다.</h2>
    <p>저희 사이트는 반려견과 보호자가 더욱 행복하고 건강한 삶을 누릴 수 있도록 돕기 위해 설립된 종합 라이프 가이드 플랫폼입니다. 단순한 흥미 위주의 정보가 아닌, 동물 행동학에 기반한 심도 있는 통찰과 실제 양육 현장에서 꼭 필요한 실전 팁을 제공합니다.</p>
    <br>
    <h3>우리의 미션</h3>
    <p>반려견은 우리 가족의 소중한 일원입니다. 강아지의 기질과 행동 양식을 깊이 이해함으로써 분리불안, 공격성, 짖음 등의 문제를 사전에 예방하고, 보호자와 반려견 간의 깊은 교감을 형성하는 것이 우리의 가장 큰 목표입니다.</p>
    <br>
    <h3>주요 제공 서비스</h3>
    <ul>
        <li><strong>견종 백과사전:</strong> 각 견종별 역사, 성격, 유전적 특징 및 건강 관리법을 체계적으로 제공합니다.</li>
        <li><strong>자가진단 가이드:</strong> 강아지의 이상 행동이나 증상을 바탕으로 원인을 파악하고, 집에서 할 수 있는 적절한 홈케어 방법을 제시합니다.</li>
        <li><strong>여행 가이드:</strong> 반려견과 함께하는 외출, 대중교통 이용, 캠핑 및 수영 등 다양한 아웃도어 활동 시 필요한 펫티켓과 안전 수칙을 안내합니다.</li>
    </ul>
    <br>
    <p>앞으로도 양질의 고부가가치 콘텐츠를 지속적으로 업데이트하여, 모든 보호자님들이 신뢰할 수 있는 최고의 반려견 백과사전이 되도록 노력하겠습니다. 감사합니다.</p>
`;

const privacyBody = `
    <h2>개인정보처리방침 (Privacy Policy)</h2>
    <p>mung-test.com (이하 '본 사이트')은(는) 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립 및 공개합니다.</p>
    <br>
    <h3>1. 수집하는 개인정보의 항목 및 수집 방법</h3>
    <p>본 사이트는 회원가입 기능을 제공하지 않으며, 서비스 이용 과정에서 별도의 개인 식별 정보를 수집하거나 저장하지 않습니다. 다만, 서비스 이용 과정이나 사업 처리 과정에서 다음과 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.</p>
    <ul>
        <li>IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
    </ul>
    <br>
    <h3>2. 개인정보의 수집 및 이용 목적</h3>
    <p>자동으로 수집되는 정보는 사이트의 접속 빈도 파악, 통계 분석, 서비스 개선 및 구글 애드센스와 같은 맞춤형 광고 제공을 위한 목적으로만 사용됩니다.</p>
    <br>
    <h3>3. 구글 애드센스 (Google AdSense) 및 쿠키 사용</h3>
    <p>본 사이트는 제3자 광고 사업자인 Google의 애드센스를 게재하고 있습니다. Google은 쿠키를 사용하여 본 사이트나 다른 웹사이트에 대한 사용자의 이전 방문을 기반으로 맞춤 광고를 제공합니다. 사용자는 구글 광고 설정 페이지를 통해 맞춤 광고에 사용되는 쿠키의 사용을 거부할 수 있습니다.</p>
    <br>
    <h3>4. 개인정보의 파기절차 및 방법</h3>
    <p>본 사이트는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
    <br>
    <p>본 방침은 2026년 7월 16일부터 시행됩니다.</p>
`;

const termsBody = `
    <h2>서비스 이용약관 (Terms of Service)</h2>
    <p>이 약관은 mung-test.com (이하 '본 사이트')에서 제공하는 인터넷 관련 서비스의 이용조건 및 절차, 이용자와 본 사이트의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.</p>
    <br>
    <h3>제1조 (목적 및 효력)</h3>
    <p>본 약관은 본 사이트가 제공하는 모든 서비스의 이용과 관련하여 기본적으로 적용됩니다. 사이트를 방문하고 서비스를 이용하는 것은 본 약관에 동의하는 것으로 간주됩니다.</p>
    <br>
    <h3>제2조 (정보의 제공 및 한계)</h3>
    <p>본 사이트에서 제공하는 모든 반려견 관련 정보(질병 증상, 행동 교정, 의류 사이즈 등)는 일반적인 정보 제공을 목적으로 하며, 수의사의 전문적인 의학적 진단이나 행동 교정 전문가의 상담을 대신할 수 없습니다. 따라서 사이트에서 제공된 정보를 바탕으로 취해진 조치에 대해 본 사이트는 어떠한 법적 책임도 지지 않습니다. 반려견의 건강에 심각한 이상이 있을 경우, 즉시 수의사에게 진찰을 받아야 합니다.</p>
    <br>
    <h3>제3조 (저작권의 귀속 및 이용 제한)</h3>
    <p>본 사이트가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 본 사이트에 귀속됩니다. 이용자는 본 사이트를 이용함으로써 얻은 정보를 본 사이트의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 등 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</p>
    <br>
    <h3>제4조 (광고의 게재)</h3>
    <p>본 사이트는 서비스 운영과 관련하여 서비스 화면 등에 광고를 게재할 수 있습니다. 이는 사이트 유지 관리를 위한 필수적인 부분임을 양해 부탁드립니다.</p>
`;

const contactBody = `
    <h2>문의하기 (Contact Us)</h2>
    <p>본 사이트를 이용해 주셔서 감사합니다. 서비스 이용 중 궁금하신 사항, 비즈니스 제안, 제휴 및 광고 관련 문의, 혹은 사이트 내 정보 수정 요청이 있으신 경우 언제든지 아래의 연락처로 문의해 주시기 바랍니다.</p>
    <br>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
        <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 15px;"><strong>📧 이메일 (Email):</strong> <a href="mailto:mungtest12@gmail.com" style="color: var(--primary);">mungtest12@gmail.com</a></li>
            <li style="margin-bottom: 15px;"><strong>🕒 답변 시간 (Operating Hours):</strong> 평일 10:00 - 18:00 (주말 및 공휴일 제외)</li>
            <li><strong>📍 기타 사항:</strong> 문의해 주신 내용은 확인 후 신속하고 친절하게 답변해 드리겠습니다. 다만, 주말이나 공휴일에는 답변이 지연될 수 있는 점 양해 부탁드립니다.</li>
        </ul>
    </div>
    <br>
    <p>항상 더 나은 정보를 제공하기 위해 노력하는 mung-test.com이 되겠습니다. 감사합니다.</p>
`;

generatePage('about.html', '사이트 소개 (About Us)', '사이트 소개 (About Us)', aboutBody);
generatePage('privacy.html', '개인정보처리방침 (Privacy Policy)', '개인정보처리방침', privacyBody);
generatePage('terms.html', '서비스 이용약관 (Terms of Service)', '서비스 이용약관', termsBody);
generatePage('contact.html', '문의하기 (Contact Us)', '문의하기', contactBody);

console.log('4 trust pages generated successfully.');
