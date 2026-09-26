// 고래로봇과 배 — 책 넘기기 · 글자 타일 · 읽어 주기
// 원칙: 저절로 넘어가지 않는다 / 글자 하나 = 버튼 하나 / 읽는 중에 글자를 누르면 그 글자가 먼저

const $ = (id) => document.getElementById(id);
const scene = $('scene'), lineEl = $('line');
const st = { i: 0, timers: [], started: false, locked: false };

// ── 화면 비율에 맞춰 보이는 영역 잡기 ─────────────────
// 안전 영역(x 110~690, y 0~600)은 늘 다 보인다. 화면이 넓으면 양옆을 더,
// 좁으면 양옆을 안전 영역까지 자르고, 그래도 좁으면 위로 하늘을 더 보여 준다.
const SAFE_W = 580;
function fit() {
  const r = scene.clientWidth / Math.max(1, scene.clientHeight);
  let x, y = 0, w, h = 600;
  if (r >= SAFE_W / 600) { w = 600 * r; x = 400 - w / 2; }
  else { w = SAFE_W; x = 400 - w / 2; h = w / r; y = 600 - h; }
  scene.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
}
window.addEventListener('resize', fit);

// ── 그림 ─────────────────────────────────────────
function drawItem([name, x, y, o = {}]) {
  const s = o.s || 1, sx = o.flip ? -s : s;
  const inner = ART[name](o);
  const anim = o.anim ? ` class="a-${o.anim}"` : '';
  return `<g transform="translate(${x} ${y}) scale(${sx} ${s})"><g${anim}>${inner}</g></g>`;
}
function drawScene(p) {
  const bg = BG[p.bg];
  scene.innerHTML = DEFS + bg.back + (p.items || []).map(drawItem).join('') + (bg.front || '');
  fit();
  scene.classList.remove('enter'); void scene.getBoundingClientRect(); scene.classList.add('enter');
}

// ── 글자 타일 ────────────────────────────────────
const isHangul = (c) => /[가-힣]/.test(c);
function drawLine(p) {
  lineEl.innerHTML = '';
  lineEl.className = p.cover ? 'cover' : '';
  [...p.line].forEach((c) => {
    let el;
    if (c === ' ') { el = document.createElement('span'); el.className = 'gap'; }
    else if (isHangul(c)) {
      el = document.createElement('button'); el.className = 'ch'; el.textContent = c;
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); tapLetter(el, c); });
    } else { el = document.createElement('span'); el.className = 'punc'; el.textContent = c; }
    lineEl.appendChild(el);
  });
}

// ── 소리 (브라우저 한국어 TTS) ──────────────────────
let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter((v) => /^ko/i.test(v.lang));
  voice = vs.find((v) => /google|yuna|sora|heami|seoyeon/i.test(v.name)) || vs[0] || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

function speak(text, rate, onstart) {
  if (!('speechSynthesis' in window) || !voice) { onstart && onstart(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR'; u.voice = voice; u.rate = rate; u.pitch = 1.1;
  let fired = false;
  const go = () => { if (!fired) { fired = true; onstart && onstart(); } };
  u.onstart = go;
  setTimeout(go, 700);          // onstart 가 안 오는 기기도 있다
  speechSynthesis.speak(u);
}
function stopReading() {
  st.timers.forEach(clearTimeout); st.timers = [];
  lineEl.querySelectorAll('.on').forEach((e) => e.classList.remove('on'));
}

// 읽어 주기 — 글자가 차례로 켜진다
function readLine() {
  stopReading();
  const p = PAGES[st.i];
  const tiles = [...lineEl.children];
  speak(p.say || p.line, .82, () => {
    let t = 0;
    tiles.forEach((el) => {
      if (el.classList.contains('ch')) {
        st.timers.push(setTimeout(() => {
          lineEl.querySelectorAll('.on').forEach((e) => e.classList.remove('on'));
          el.classList.add('on');
        }, t));
        t += 300;
      } else t += el.classList.contains('gap') ? 120 : 200;
    });
    st.timers.push(setTimeout(() => lineEl.querySelectorAll('.on').forEach((e) => e.classList.remove('on')), t + 250));
  });
}

// 아이가 글자를 누르면 — 읽는 중이어도 멈추고 그 글자를 들려준다
function tapLetter(el, c) {
  stopReading();
  el.classList.add('tap');
  setTimeout(() => el.classList.remove('tap'), 600);
  speak(c, .7);
}

// ── 넘기기 ────────────────────────────────────────
function show(i) {
  st.i = Math.max(0, Math.min(PAGES.length - 1, i));
  const p = PAGES[st.i];
  stopReading();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  drawScene(p);
  drawLine(p);
  $('ask').textContent = p.ask || '';
  $('count').textContent = `${st.i + 1} / ${PAGES.length}`;
  $('prev').hidden = st.i === 0;
  $('next').hidden = st.i === PAGES.length - 1 && !p.last;
  $('next').classList.toggle('pulse', !!p.cover);
  st.locked = false; $('next').classList.remove('locked');
  if (p.game && window.GAMES) {                // 놀이 페이지: 다 할 때까지 '다음' 잠김
    st.locked = true; $('next').classList.add('locked');
    GAMES[p.game.type](p, () => { st.locked = false; $('next').classList.remove('locked'); $('next').classList.add('pulse'); });
  }
  if (st.started) setTimeout(readLine, 350);   // 넘길 때 한 번 읽어 준다 (첫 화면은 손이 닿은 뒤부터)
}

$('next').addEventListener('click', () => {
  if (st.locked) return;
  st.started = true;
  show(st.i + 1);
});
$('prev').addEventListener('click', () => { st.started = true; show(st.i - 1); });
$('say').addEventListener('click', () => { st.started = true; readLine(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') $('next').click();
  if (e.key === 'ArrowLeft') $('prev').click();
});

show(Number(new URLSearchParams(location.search).get('p')) || 0);
