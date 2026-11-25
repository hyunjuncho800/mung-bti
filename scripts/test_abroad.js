// 해외여행 페이지 점검: 나라마다 체크리스트·공식 출처·확인 날짜가 있고, 체크리스트 원문이 본문에 섞이지 않았는지.
// 실행: node scripts/test_abroad.js   (빌드 후)
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };

const slugs = fs.readdirSync(path.join(ROOT, 'content/abroad')).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));
ok(slugs.length >= 13, `나라 페이지 ${slugs.length}개`);
for (const slug of slugs) {
    const src = fs.readFileSync(path.join(ROOT, 'content/abroad', `${slug}.html`), 'utf8');
    const items = ((src.match(/<!-- checklist:\n([\s\S]*?)\n-->/) || ['', ''])[1]).split('\n').filter(Boolean);
    ok(items.length >= 5, `${slug}: 체크리스트 항목 ${items.length}개`);
    ok(items.every(l => /^[^|]+\|[^|]+$/.test(l)), `${slug}: '단계|항목' 형식`);
    ok(/<!-- sources: .*https?:\/\//.test(src), `${slug}: 공식 출처 있음`);

    const html = fs.readFileSync(path.join(ROOT, 'abroad', slug, 'index.html'), 'utf8');
    const ids = [...html.matchAll(/data-id="([^"]+)"/g)].map(m => m[1]);
    ok(ids.length === items.length, `${slug}: 화면 항목 수(${ids.length}) = 원본 항목 수(${items.length})`);
    ok(new Set(ids).size === ids.length, `${slug}: 항목 id 중복 없음`);
    ok(html.includes(`data-checklist="${slug}"`) && html.includes('href="#checklist"'), `${slug}: 체크리스트와 바로가기`);
    ok(!/checklist:|미리 준비\|/.test(html.replace(/data-checklist="[^"]*"/g, '')), `${slug}: 체크리스트 원문이 본문에 안 섞임`);
    ok(/\d{4}-\d{2}-\d{2} 공식 안내 확인/.test(html), `${slug}: 확인 날짜 표시`);
}
console.log(`해외여행 페이지 테스트 통과: ${n}개 확인`);
