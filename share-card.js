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

    // ---------------------------------------------------------------- 멍설명서·멍궁합 카드
    // d: { format: feed|story|og, theme: pastel|minimal|character, type, name, headline, sub, photo(Image|null), blocks:[{title, items:[...]}], footer }
    // 규격마다 안전 여백 안에만 글자를 둔다. 스토리는 인스타 위·아래 UI(약 250px, 300px)를 피한다.
    var FORMATS = {
        feed: { w: 1080, h: 1350, pad: 90, brandY: 112, photo: [340, 160, 400, 400], nameY: 670, headY: 742, subY: 796, blockY: 860, blockEnd: 1215, footY: 1290 },
        story: { w: 1080, h: 1920, pad: 100, brandY: 300, photo: [300, 360, 480, 480], nameY: 960, headY: 1040, subY: 1098, blockY: 1170, blockEnd: 1570, footY: 1640 },
        og: { w: 1200, h: 630, pad: 60, og: true },
    };
    // 한 줄 넘치면 말줄임
    function fitLine(ctx, s, maxW) {
        if (ctx.measureText(s).width <= maxW) return s;
        while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1);
        return s + '…';
    }
    function drawPhoto(ctx, im, x, y, w, h, round, ring) {
        ctx.save();
        if (ring) { ctx.fillStyle = '#FFFFFF'; rr(ctx, x - 14, y - 14, w + 28, h + 28, round + 14); ctx.fill(); }
        rr(ctx, x, y, w, h, round); ctx.clip();
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x, y, w, h);
        if (im) {
            var iw = im.naturalWidth || im.width, ih = im.naturalHeight || im.height;
            if (im.__illustration) { contain(ctx, im, x + 20, y + 20, w - 40, h - 40); }
            else { var k = Math.max(w / iw, h / ih); ctx.drawImage(im, x + (w - iw * k) / 2, y + (h - ih * k) / 2, iw * k, ih * k); } // 사진은 꽉 채워 자름
        }
        ctx.restore();
    }
    // 블록(제목 + 항목) 그리기. 영역을 넘기면 남은 항목은 그리지 않는다.
    function drawBlocks(ctx, blocks, x, y, maxW, yEnd, sizes) {
        ctx.textAlign = 'left'; // 앞에서 가운데 정렬로 그린 글이 있어도 항목은 왼쪽 정렬
        for (var b = 0; b < blocks.length; b++) {
            var bl = blocks[b];
            if (bl.title) {
                if (y + sizes.title > yEnd) return;
                ctx.font = '800 ' + sizes.title + 'px ' + BODY; ctx.textAlign = 'left';
                ctx.fillText(fitLine(ctx, bl.title, maxW), x, y + sizes.title); y += sizes.title + 14;
            }
            for (var i = 0; i < bl.items.length; i++) {
                ctx.font = '600 ' + sizes.item + 'px ' + BODY;
                var lines = wrap(ctx, bl.items[i], maxW - 34);
                if (lines.length > 2) { lines = lines.slice(0, 2); lines[1] = fitLine(ctx, lines[1] + '…', maxW - 34); }
                if (y + sizes.item * 1.35 * lines.length > yEnd) return;
                ctx.beginPath(); ctx.arc(x + 9, y + sizes.item * 0.62, 7, 0, Math.PI * 2); ctx.fill();
                lines.forEach(function (l) { ctx.fillText(l, x + 34, y + sizes.item); y += sizes.item * 1.35; });
                y += 8;
            }
            y += 18;
        }
    }
    function profile(d) {
        var f = FORMATS[d.format] || FORMATS.feed;
        var tone = TONE[d.type] || TONE[2];
        var sample = JSON.stringify(d.blocks) + d.name + d.headline + d.sub + 'MUNG TEST 멍테스트' + (d.footer || '');
        return Promise.all([fontsReady(sample), d.photo ? Promise.resolve(d.photo) : loadImg('/img/type-' + d.type + '.webp').then(function (im) { if (im) im.__illustration = true; return im; })]).then(function (r) {
            var im = r[1];
            var bg = d.theme === 'minimal' ? '#FFFFFF' : tone;
            var k = canvas(f.w, f.h, bg), ctx = k.c.getContext('2d');
            ctx.fillStyle = INK;
            if (d.theme === 'minimal') {
                ctx.strokeStyle = INK; ctx.lineWidth = 4; rr(ctx, 36, 36, f.w - 72, f.h - 72, 36); ctx.stroke();
                ctx.fillStyle = tone; ctx.fillRect(36 + 36, 36, f.w - 144, 14); ctx.fillStyle = INK;
            } else if (d.theme === 'character') {
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                [[0.12, 0.08, 0.16], [0.9, 0.2, 0.12], [0.08, 0.9, 0.2], [0.92, 0.82, 0.14]].forEach(function (c) { ctx.beginPath(); ctx.arc(f.w * c[0], f.h * c[1], f.w * c[2], 0, Math.PI * 2); ctx.fill(); });
                ctx.fillStyle = INK;
            }
            var brand = function (x, y, align) {
                ctx.globalAlpha = 0.8; text(ctx, 'MUNG TEST · 멍테스트', x, y, '800 30px ' + BODY, align); ctx.globalAlpha = 1;
            };
            var foot = function (x, y, align) { ctx.globalAlpha = 0.7; text(ctx, d.footer || 'mung-test.com', x, y, '700 28px ' + BODY, align); ctx.globalAlpha = 1; };
            var nameFont = function (max) {
                var size = max; ctx.font = size + 'px ' + DISPLAY;
                while (ctx.measureText(d.name).width > (f.og ? 520 : f.w - f.pad * 2) && size > 40) { size -= 4; ctx.font = size + 'px ' + DISPLAY; }
                return size + 'px ' + DISPLAY;
            };
            if (f.og) {
                // 미리보기: 왼쪽 사진/그림, 오른쪽 글
                drawPhoto(ctx, im, 70, 70, 470, 470, d.theme === 'character' ? 235 : 40, d.theme !== 'minimal');
                ctx.fillStyle = INK;
                brand(620, 120, 'left');
                text(ctx, d.name, 620, 225, nameFont(72), 'left');
                ctx.font = '800 36px ' + BODY; text(ctx, fitLine(ctx, d.headline, 520), 620, 290, '800 36px ' + BODY, 'left');
                var items = [];
                d.blocks.forEach(function (b) { items = items.concat(b.items); });
                drawBlocks(ctx, [{ items: items.slice(0, 3) }], 620, 330, 520, 540, { title: 30, item: 28 });
                foot(620, 585, 'left');
                return k.c;
            }
            brand(f.w / 2, f.brandY, 'center');
            var p = f.photo;
            if (d.theme === 'character') drawPhoto(ctx, im, p[0], p[1], p[2], p[3], p[2] / 2, true);
            else drawPhoto(ctx, im, p[0], p[1], p[2], p[3], 44, d.theme === 'pastel');
            ctx.fillStyle = INK;
            text(ctx, d.name, f.w / 2, f.nameY, nameFont(d.theme === 'character' ? 92 : 84), 'center');
            ctx.font = '800 40px ' + BODY; text(ctx, fitLine(ctx, d.headline, f.w - f.pad * 2), f.w / 2, f.headY, '800 40px ' + BODY, 'center');
            if (d.sub) { ctx.font = '600 32px ' + BODY; text(ctx, fitLine(ctx, d.sub, f.w - f.pad * 2), f.w / 2, f.subY, '600 32px ' + BODY, 'center'); }
            // 블록 영역: 파스텔·캐릭터는 흰 판 위에
            var bx = f.pad, bw = f.w - f.pad * 2;
            if (d.theme !== 'minimal') { ctx.fillStyle = '#FFFFFF'; rr(ctx, bx - 30, f.blockY - 24, bw + 60, f.blockEnd - f.blockY + 40, 36); ctx.fill(); ctx.fillStyle = INK; }
            drawBlocks(ctx, d.blocks, bx, f.blockY, bw, f.blockEnd, { title: 32, item: 32 });
            foot(f.w / 2, f.footY, 'center');
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

    // 멍퀴즈 결과 카드. d: { format: feed|story, grade: {name, line}, score, dog: canvas|null }
    // 강아지는 3D 화면을 찍은 그림(dog)을 쓰고, 3D가 안 되는 기기면 기본 그림을 쓴다.
    function signal(d) {
        var story = d.format === 'story', W = 1080, H = story ? 1920 : 1350;
        var top = story ? 300 : 110; // 스토리는 인스타 위쪽 UI를 피한다
        return Promise.all([fontsReady(sampleOf(d) + '멍테스트 멍퀴즈 멍통역사 결과 점 너도 우리 강아지 마음을 읽을 수 있을까? 도전해 봐 www.mung-test.com 재미로 보는 학습 결과예요'), d.dog ? null : loadImg('/img/type-2.webp')]).then(function (r) {
            var k = canvas(W, H, '#A9D6F5'), ctx = k.ctx;
            text(ctx, '멍테스트 멍퀴즈', W / 2, top, '800 40px ' + BODY, 'center');
            var bx = 110, by = top + 50, bw = W - 220, bh = story ? 620 : 520;
            ctx.fillStyle = '#FFFFFF'; rr(ctx, bx, by, bw, bh, 48); ctx.fill();
            if (d.dog) { var kk = Math.min((bw - 40) / d.dog.width, (bh - 40) / d.dog.height), dw = d.dog.width * kk, dh = d.dog.height * kk; ctx.drawImage(d.dog, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh); }
            else contain(ctx, r[1], bx + 40, by + 30, bw - 80, bh - 60);
            ctx.fillStyle = INK;
            var y = by + bh + (story ? 130 : 110);
            text(ctx, '멍통역사 결과', W / 2, y, '700 40px ' + BODY, 'center');
            var size = 104;
            ctx.font = size + 'px ' + DISPLAY;
            while (ctx.measureText(d.grade.name).width > 900 && size > 60) { size -= 4; ctx.font = size + 'px ' + DISPLAY; }
            text(ctx, d.grade.name, W / 2, y + 125, size + 'px ' + DISPLAY, 'center');
            text(ctx, d.score + '점', W / 2, y + 215, '800 64px ' + BODY, 'center');
            ctx.font = '600 36px ' + BODY;
            wrap(ctx, d.grade.line, 860).slice(0, 2).forEach(function (l, i) { text(ctx, l, W / 2, y + 290 + i * 50, '600 36px ' + BODY, 'center'); });
            var fy = story ? H - 330 : H - 110;
            text(ctx, '너도 우리 강아지 마음을 읽을 수 있을까? 도전해 봐!', W / 2, fy - 60, '800 36px ' + BODY, 'center');
            ctx.globalAlpha = 0.75;
            text(ctx, 'www.mung-test.com', W / 2, fy, '700 34px ' + BODY, 'center');
            text(ctx, '재미로 보는 학습 결과예요', W / 2, fy + 46, '600 26px ' + BODY, 'center');
            ctx.globalAlpha = 1;
            return k.c;
        });
    }

    window.MungCard = { temperament: temperament, check: check, og: og, profile: profile, deliver: deliver, signal: signal };
})();
