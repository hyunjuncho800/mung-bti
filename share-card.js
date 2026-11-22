// 멍테스트 공유 카드: 결과를 1080x1350(인스타 세로) 이미지로 그린다. 외부 라이브러리 없이 canvas만 씀.
// 기질검사(index.html)와 행동 체크(/check/)에서 같이 쓴다. 전역 MungCard 하나만 만든다.
(function () {
    var INK = '#1F2622';
    var TONE = { 1: '#FFB8C6', 2: '#FFCF5C', 3: '#A9D6F5', 4: '#BFE3A8' };
    var DISPLAY = '"Bagel Fat One", Pretendard, sans-serif';
    var BODY = 'Pretendard, -apple-system, sans-serif';

    // 웹폰트는 글자 묶음별로 나눠 받으므로, 카드에 그릴 글자를 넘겨서 그 묶음을 먼저 받아 둔다
    function fontsReady(sample) {
        if (!document.fonts || !document.fonts.load) return Promise.resolve();
        var t = String(sample || '') + 'mung-test.com 0123456789.';
        return Promise.all(['80px "Bagel Fat One"', '500 40px Pretendard', '600 40px Pretendard', '700 40px Pretendard', '800 40px Pretendard']
            .map(function (f) { return document.fonts.load(f, t); })).catch(function () {});
    }
    function sampleOf(d) { return JSON.stringify(d); }
    function loadImg(src) {
        return new Promise(function (ok) {
            var im = new Image();
            im.onload = function () { ok(im); };
            im.onerror = function () { ok(null); };
            im.src = src;
        });
    }
    function rr(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    // 띄어쓰기 단위로 줄바꿈, 한 단어가 너무 길면 글자 단위로 자름
    function wrap(ctx, text, maxW) {
        var lines = [], line = '';
        String(text).split(' ').forEach(function (word) {
            var t = line ? line + ' ' + word : word;
            if (ctx.measureText(t).width <= maxW) { line = t; return; }
            if (line) lines.push(line);
            line = '';
            for (var i = 0; i < word.length; i++) {
                if (ctx.measureText(line + word[i]).width > maxW && line) { lines.push(line); line = ''; }
                line += word[i];
            }
        });
        if (line) lines.push(line);
        return lines;
    }
    function text(ctx, s, x, y, font, align) {
        ctx.font = font; ctx.textAlign = align || 'left'; ctx.fillText(s, x, y);
    }
    function contain(ctx, im, x, y, w, h) {
        if (!im) return;
        var k = Math.min(w / im.naturalWidth, h / im.naturalHeight);
        var iw = im.naturalWidth * k, ih = im.naturalHeight * k;
        ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
    }
    function canvas(w, h, bg) {
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = INK; ctx.textBaseline = 'alphabetic';
        return { c: c, ctx: ctx };
    }

    // 기질검사 카드. d: { type, subject, typeName, typeSub, stats:[{label,val}], chem }
    function temperament(d) {
        return Promise.all([fontsReady(sampleOf(d) + '멍테스트 강아지 성격 카드'), loadImg('/img/type-' + d.type + '.webp')]).then(function (r) {
            var k = canvas(1080, 1350, TONE[d.type] || TONE[2]), ctx = k.ctx;
            text(ctx, '멍테스트 강아지 성격 카드', 540, 110, '800 38px ' + BODY, 'center');
            ctx.fillStyle = '#FFFFFF'; rr(ctx, 90, 150, 900, 560, 48); ctx.fill();
            contain(ctx, r[1], 130, 180, 820, 500);
            ctx.fillStyle = INK;
            text(ctx, d.subject, 540, 800, '700 44px ' + BODY, 'center');
            var size = 96;
            ctx.font = size + 'px ' + DISPLAY;
            while (ctx.measureText(d.typeName).width > 920 && size > 60) { size -= 4; ctx.font = size + 'px ' + DISPLAY; }
            text(ctx, d.typeName, 540, 900, size + 'px ' + DISPLAY, 'center');
            if (d.typeSub) text(ctx, d.typeSub, 540, 960, '700 36px ' + BODY, 'center');
            (d.stats || []).slice(0, 4).forEach(function (s, i) {
                var y = 1030 + i * 58;
                text(ctx, s.label, 150, y + 12, '800 34px ' + BODY);
                ctx.fillStyle = 'rgba(31,38,34,0.15)'; rr(ctx, 320, y - 10, 520, 26, 13); ctx.fill();
                ctx.fillStyle = INK; rr(ctx, 320, y - 10, Math.max(26, 520 * s.val / 5), 26, 13); ctx.fill();
                text(ctx, s.val.toFixed(1), 930, y + 12, '800 34px ' + BODY, 'right');
            });
            if (d.chem) text(ctx, d.chem, 540, 1268, '800 34px ' + BODY, 'center');
            ctx.globalAlpha = 0.7;
            text(ctx, 'mung-test.com', 540, d.chem ? 1320 : 1295, '700 30px ' + BODY, 'center');
            ctx.globalAlpha = 1;
            return k.c;
        });
    }

    // 행동 체크 카드. d: { title, tone, img, causes:[{name, summary}] }
    function check(d) {
        return Promise.all([fontsReady(sampleOf(d) + '멍고민 행동 체크 이런 쪽에 가까웠어요 상황 답변을 바탕으로 한 참고 정보예요. 진단이 아니에요.'), loadImg('/img/' + d.img + '.webp')]).then(function (r) {
            var k = canvas(1080, 1350, d.tone || TONE[1]), ctx = k.ctx;
            text(ctx, '멍고민 행동 체크', 90, 120, '800 38px ' + BODY);
            ctx.font = '78px ' + DISPLAY;
            var tl = wrap(ctx, d.title, 900), y = 230;
            tl.slice(0, 3).forEach(function (l) { text(ctx, l, 90, y, '78px ' + DISPLAY); y += 96; });
            y += 10;
            ctx.fillStyle = '#FFFFFF'; rr(ctx, 70, y, 940, 1350 - y - 170, 44); ctx.fill();
            contain(ctx, r[1], 830, y + 30, 150, 150);
            ctx.fillStyle = INK;
            var cy = y + 90;
            text(ctx, '이런 쪽에 가까웠어요', 120, cy, '800 34px ' + BODY);
            cy += 40;
            (d.causes || []).slice(0, 3).forEach(function (c) {
                cy += 50;
                ctx.font = '800 44px ' + BODY;
                wrap(ctx, c.name, 700).forEach(function (l) { text(ctx, l, 120, cy, '800 44px ' + BODY); cy += 56; });
                ctx.font = '500 34px ' + BODY;
                wrap(ctx, c.summary, 840).slice(0, 3).forEach(function (l) { text(ctx, l, 120, cy, '500 34px ' + BODY); cy += 48; });
            });
            text(ctx, '상황 답변을 바탕으로 한 참고 정보예요. 진단이 아니에요.', 540, 1250, '600 28px ' + BODY, 'center');
            ctx.globalAlpha = 0.7;
            text(ctx, 'mung-test.com/check', 540, 1300, '700 30px ' + BODY, 'center');
            ctx.globalAlpha = 1;
            return k.c;
        });
    }

    // 공유 미리보기 이미지(1200x630). 사이트에 넣을 파일을 만들 때만 씀.
    function og(d) {
        return Promise.all([fontsReady(sampleOf(d) + '강아지 성격 테스트 결과'), loadImg('/img/type-' + d.type + '.webp')]).then(function (r) {
            var k = canvas(1200, 630, TONE[d.type]), ctx = k.ctx;
            ctx.fillStyle = '#FFFFFF'; rr(ctx, 60, 60, 510, 510, 44); ctx.fill();
            contain(ctx, r[1], 85, 85, 460, 460);
            ctx.fillStyle = INK;
            text(ctx, '강아지 성격 테스트 결과', 630, 170, '800 36px ' + BODY);
            ctx.font = '76px ' + DISPLAY;
            var y = 280;
            wrap(ctx, d.typeName, 520).forEach(function (l) { text(ctx, l, 630, y, '76px ' + DISPLAY); y += 90; });
            text(ctx, d.line, 630, y + 10, '700 34px ' + BODY);
            ctx.globalAlpha = 0.7;
            text(ctx, 'mung-test.com', 630, 540, '700 30px ' + BODY);
            ctx.globalAlpha = 1;
            return k.c;
        });
    }

    // 모바일은 공유 시트(인스타, 카톡 등으로 바로), 아니면 파일로 저장
    function deliver(c, fileName, shareText) {
        return new Promise(function (done) {
            c.toBlob(function (blob) {
                var file = new File([blob], fileName, { type: 'image/png' });
                var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                var download = function () {
                    var a = document.createElement('a');
                    a.download = fileName; a.href = URL.createObjectURL(blob);
                    document.body.appendChild(a); a.click(); a.remove();
                    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
                    done('download');
                };
                if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({ files: [file], text: shareText || '' }).then(function () { done('share'); }, function (e) {
                        if (e && e.name === 'AbortError') done('cancel'); else download();
                    });
                } else download();
            }, 'image/png');
        });
    }

    window.MungCard = { temperament: temperament, check: check, og: og, deliver: deliver };
})();
