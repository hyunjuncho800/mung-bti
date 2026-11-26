// 멍퀴즈 화면: 난이도 고르기 → 10문항(3D 강아지 관찰 + 4지선다 + 해설) → 멍통역사 결과·공유.
// 3D 화면은 멍시그널 본 화면과 같은 signal-view.js를 쓴다. 기록은 이 브라우저에만 남는다.
const D = window.MungSignalData, R = window.MungSignalRules, SC = window.MungSignalScenes, QD = window.MungQuizData, L = window.MungLearn;
const root = document.querySelector('[data-quiz]');
const panel = root && root.querySelector('[data-quiz-panel]');
const track = (n, p) => window.mungTrack && window.mungTrack(n, p);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LS = (() => { try { localStorage.getItem('x'); return localStorage; } catch (e) { return { getItem: () => null, setItem() {} }; } })();

const state = { target: Object.assign({}, D.DEFAULTS, D.BEHAVIORS[0].pose), motion: {}, paused: matchMedia('(prefers-reduced-motion: reduce)').matches, loop: true, speed: 1 };
let view = null, round = null;
const LEVEL_NAME = { 1: '초급', 2: '중급', 3: '고급', mix: '섞어서', review: '틀린 문제 다시 풀기' };

// 3D 강아지에 문항 장면 보여 주기
function show(spec) {
    const b = D.BEHAVIORS.find(x => x.id === spec.behavior) || D.BEHAVIORS[0];
    state.target = Object.assign({}, D.DEFAULTS, b.pose, spec.pose || {});
    state.motion = b.motion;
    if (!view) return;
    view.poseChanged();
    view.replay();
    view.setScene(spec.scene ? SC.SCENES.find(s => s.id === spec.scene) : null);
    view.setView(spec.view || 'angle');
}

// ---------------------------------------------------------------- 시작 화면
function renderStart() {
    round = null;
    show({ behavior: 'curious', view: 'angle' });
    const rec = L.loadRecord(LS);
    const mine = window.MungProfile ? window.MungProfile.readMine(LS) : null;
    const tips = L.recommend(mine);
    panel.innerHTML = `
        <h2 class="quiz-title">멍퀴즈</h2>
        <p>3D 강아지를 보고 몸짓의 뜻이나 보호자가 할 일을 골라요. 한 번에 10문제, 문제마다 정답과 다른 보기의 해설이 나와요.</p>
        ${rec.attempts ? `<p class="quiz-record">지금까지 ${rec.attempts}번 도전했어요. 최고 점수는 <b>${rec.best}점</b>이에요.</p>` : ''}
        <p class="signal-group-label">난이도를 골라 시작하세요</p>
        <div class="quiz-levels">
            <button type="button" class="btn" data-level="1"><b>초급</b><span>대표 신호 구별</span></button>
            <button type="button" class="btn" data-level="2"><b>중급</b><span>여러 신호 함께 읽기</span></button>
            <button type="button" class="btn" data-level="3"><b>고급</b><span>상황과 함께 읽기</span></button>
            <button type="button" class="btn btn-ghost" data-level="mix"><b>섞어서</b><span>세 난이도를 골고루</span></button>
        </div>
        ${rec.wrong.length ? `<button type="button" class="btn btn-ghost quiz-review" data-level="review">틀린 문제 다시 풀기 (${rec.wrong.length}문제)</button>` : ''}
        ${tips.length ? `<div class="quiz-tips"><p class="signal-group-label">${esc(mine.name || '우리 강아지')}(${esc(mine.typeName)}) 보호자라면 먼저 살펴보면 좋은 신호</p>
            <ul>${tips.map(t => `<li><a href="/mung-signal/#${t.scene ? 's-' + t.scene : 'b-' + t.behavior}">${esc(D.BEHAVIORS.find(b => b.id === t.behavior).name)}</a> ${esc(t.why)}</li>`).join('')}</ul>
            <p class="check-note">기질검사 결과로 우리 강아지의 실제 감정을 알 수는 없어요. 먼저 익혀 두면 좋은 신호를 골랐어요.</p></div>` : ''}`;
    panel.querySelectorAll('[data-level]').forEach(b => b.addEventListener('click', () => startRound(b.dataset.level)));
}

function startRound(level) {
    const lv = /^[123]$/.test(level) ? Number(level) : level;
    const rec = L.loadRecord(LS);
    const qs = L.pick(lv, Math.random, rec.wrong);
    if (!qs.length) return renderStart();
    round = { level: lv, qs, i: 0, results: [] };
    track('signal_quiz_start', { level: String(level) });
    renderQuestion();
}

// ---------------------------------------------------------------- 문항
function renderQuestion() {
    const q = round.qs[round.i];
    show(q.show);
    const choices = L.choicesOf(q, Math.random);
    // 화면을 못 보는 경우를 위한 설명: 규칙 엔진의 '눈에 띄는 신호'(해석이 아닌 몸 상태)
    const seen = R.interpret(state.target).signals;
    panel.innerHTML = `
        <p class="quiz-progress"><b>${round.i + 1}</b> / ${round.qs.length} · ${QD.LEVELS[q.level]} · ${QD.TYPES[q.type]}</p>
        <div class="quiz-bar"><i style="width:${round.i / round.qs.length * 100}%"></i></div>
        <h2 class="quiz-q">${esc(q.q)}</h2>
        <details class="quiz-desc"${view ? '' : ' open'}><summary>화면 설명 보기</summary><p>${esc(seen.join(', ') || '특별히 눈에 띄는 신호가 없어요')}${q.show.scene ? ` · 상황: ${esc(SC.SCENES.find(s => s.id === q.show.scene).title)}` : ''}</p></details>
        <div class="quiz-choices" role="group" aria-label="보기">
            ${choices.map((c, i) => `<button type="button" class="quiz-choice" data-i="${i}">${esc(c.text)}</button>`).join('')}
        </div>
        <div class="quiz-feedback" data-feedback aria-live="polite"></div>`;
    panel.querySelectorAll('.quiz-choice').forEach(btn => btn.addEventListener('click', () => answer(q, choices, Number(btn.dataset.i))));
    // 다음 문제로 넘어가면 키보드·화면 읽기 사용자가 새 문제부터 듣도록 초점 이동
    const h = panel.querySelector('.quiz-q');
    h.setAttribute('tabindex', '-1');
    if (round.i) h.focus({ preventScroll: true });
}

function answer(q, choices, picked) {
    const c = choices[picked], right = choices.find(x => x.correct);
    round.results.push({ q, correct: c.correct });
    panel.querySelectorAll('.quiz-choice').forEach((btn, i) => {
        btn.disabled = true;
        if (choices[i].correct) btn.classList.add('is-right');
        else if (i === picked) btn.classList.add('is-wrong');
    });
    const last = round.i === round.qs.length - 1;
    const fb = panel.querySelector('[data-feedback]');
    fb.innerHTML = `
        <p class="quiz-verdict ${c.correct ? 'is-right' : 'is-wrong'}">${c.correct ? '맞았어요' : '아쉬워요'}</p>
        <p><b>정답: ${esc(right.text)}</b> ${esc(right.why)}</p>
        <ul class="quiz-why">${choices.filter(x => !x.correct).map(x => `<li><b>${esc(x.text)}</b> ${esc(x.why)}</li>`).join('')}</ul>
        <button type="button" class="btn" data-next>${last ? '결과 보기' : '다음 문제'}</button>`;
    fb.querySelector('[data-next]').addEventListener('click', () => {
        if (last) finish(); else { round.i++; renderQuestion(); toTop(); }
    });
    fb.querySelector('[data-next]').focus();
}

// 휴대폰은 3D 화면이 위에 있어서, 새 문제·결과가 나오면 퀴즈 맨 위(강아지)부터 보이게
function toTop() {
    if (matchMedia('(max-width: 820px)').matches) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    else panel.scrollIntoView({ block: 'nearest' });
}

// ---------------------------------------------------------------- 결과
function finish() {
    const today = new Date().toISOString().slice(0, 10);
    const rec = L.saveRound(LS, round.level, round.results, today);
    const s = L.scoreOf(round.results);
    if (round.level === 'review') return renderReviewDone(s, rec);
    track('signal_quiz_complete', { level: String(round.level), score: s.score });
    renderResult(s, rec);
}

function topicList(list) {
    return `<ul class="quiz-topics">${list.map(t => `<li><a href="${t.guide ? `/mung-signal/guide/${t.guide}/` : `/mung-signal/#b-${t.behavior}`}">${esc(t.label)}</a></li>`).join('')}</ul>`;
}

function renderResult(s, rec) {
    const g = L.gradeOf(s.score), sum = L.summarize(round.results);
    show({ behavior: g.pose, view: 'angle' });
    const shareUrl = `${location.origin}/mung-signal/quiz/s/${g.id}/?s=${s.score}`;
    const hasTest = !!(window.MungProfile && window.MungProfile.readMine(LS));
    panel.innerHTML = `
        <p class="quiz-progress">멍통역사 결과 · ${LEVEL_NAME[round.level]}</p>
        <h2 class="quiz-grade">${esc(g.name)}</h2>
        <p class="quiz-score"><b>${s.score}점</b> (${s.total}문제 중 ${s.right}문제)</p>
        <p>${esc(g.line)}</p>
        ${sum.good.length ? `<h3>잘 이해한 신호</h3>${topicList(sum.good)}` : ''}
        ${sum.review.length ? `<h3>복습이 필요한 신호</h3>${topicList(sum.review)}` : ''}
        <p class="check-note">재미와 학습을 위한 결과예요. 반려견 행동 전문 자격이나 실제 강아지의 행동 평가를 뜻하지 않아요.</p>
        <div class="quiz-actions">
            <button type="button" class="btn" data-again>다시 도전하기</button>
            ${rec.wrong.length ? `<button type="button" class="btn btn-ghost" data-review>틀린 문제 다시 풀기 (${rec.wrong.length}문제)</button>` : ''}
        </div>
        <h3>친구에게 공유하기</h3>
        <div class="quiz-actions">
            <button type="button" class="btn btn-ghost" data-img="feed">피드 이미지 저장</button>
            <button type="button" class="btn btn-ghost" data-img="story">스토리 이미지 저장</button>
            <button type="button" class="btn btn-ghost" data-link>${navigator.share ? '링크 공유하기' : '링크 복사'}</button>
        </div>
        <aside class="quiz-cta">
            <b>우리 강아지는 어떤 성격일까?</b>
            <p>기질검사로 우리 강아지 성향을 알아보고, 성향에 맞춰 먼저 익힐 신호도 추천받아요.</p>
            <a class="btn" href="/">${hasTest ? '기질검사 다시 보기' : '기질검사 시작하기'}</a>
        </aside>`;
    panel.querySelector('[data-again]').addEventListener('click', renderStart);
    const rv = panel.querySelector('[data-review]');
    if (rv) rv.addEventListener('click', () => startRound('review'));
    panel.querySelectorAll('[data-img]').forEach(btn => btn.addEventListener('click', () => saveImage(btn, g, s.score)));
    panel.querySelector('[data-link]').addEventListener('click', e => shareLink(e.currentTarget, shareUrl, g, s.score));
    toTop();
}

function renderReviewDone(s, rec) {
    show({ behavior: s.right === s.total ? 'greeting' : 'curious', view: 'angle' });
    panel.innerHTML = `
        <h2 class="quiz-title">복습 끝</h2>
        <p>${s.total}문제 중 ${s.right}문제를 맞혔어요. ${rec.wrong.length ? `아직 ${rec.wrong.length}문제가 복습 목록에 남아 있어요.` : '복습 목록을 모두 끝냈어요.'}</p>
        <div class="quiz-actions">
            ${rec.wrong.length ? '<button type="button" class="btn" data-review>남은 문제 다시 풀기</button>' : ''}
            <button type="button" class="btn btn-ghost" data-again>처음 화면으로</button>
        </div>`;
    const rv = panel.querySelector('[data-review]');
    if (rv) rv.addEventListener('click', () => startRound('review'));
    panel.querySelector('[data-again]').addEventListener('click', renderStart);
}

function saveImage(btn, g, score) {
    if (!window.MungCard) return;
    const label = btn.textContent;
    btn.textContent = '이미지 만드는 중...'; btn.disabled = true;
    track('signal_quiz_share', { method: 'image_' + btn.dataset.img });
    const dog = view ? view.capture(900, 760) : null;
    window.MungCard.signal({ format: btn.dataset.img, grade: g, score, dog })
        .then(c => window.MungCard.deliver(c, `mungtest-quiz-${btn.dataset.img}.png`, `멍퀴즈 결과: ${g.name} ${score}점`))
        .catch(() => alert('이미지를 만들지 못했어요.'))
        .then(() => { btn.textContent = label; btn.disabled = false; });
}

function shareLink(btn, url, g, score) {
    const text = `멍퀴즈에서 ${g.name}(${score}점)이 나왔어요. 너도 강아지 마음 읽기에 도전해 봐!`;
    if (navigator.share) {
        track('signal_quiz_share', { method: 'native' });
        navigator.share({ title: '멍퀴즈 결과', text, url }).catch(() => {});
        return;
    }
    track('signal_quiz_share', { method: 'link' });
    const done = () => { btn.textContent = '링크를 복사했어요'; setTimeout(() => { btn.textContent = '링크 복사'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt('링크를 복사해 주세요', url));
    else prompt('링크를 복사해 주세요', url);
}

// ---------------------------------------------------------------- 3D
function hasWebGL() {
    if (/[?&]nowebgl\b/.test(location.search)) return false;
    try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}
async function start3d() {
    const stage = root.querySelector('[data-stage]');
    const fail = msg => {
        stage.classList.add('is-fallback');
        stage.querySelector('[data-stage-msg]').textContent = msg;
        panel.querySelectorAll('details.quiz-desc').forEach(d => { d.open = true; });
    };
    if (!hasWebGL()) { fail('이 기기에서는 3D 화면을 볼 수 없어요. 문제마다 "화면 설명"을 보고 풀 수 있어요.'); return; }
    try {
        const { createView } = await import('signal-view');
        view = await createView(stage, state, D, { onFail: fail });
    } catch (e) { view = null; fail('3D 화면을 불러오지 못했어요. 문제마다 "화면 설명"을 보고 풀 수 있어요.'); return; }
    // 지금 보이는 문항(또는 시작 화면)의 장면을 다시 적용
    const q = round && round.qs[round.i];
    show(q ? q.show : { behavior: 'curious', view: 'angle' });
}

if (root && D && R && SC && QD && L) {
    renderStart();
    start3d();
}
