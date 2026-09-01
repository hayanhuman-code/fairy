/* =====================================================================
   쓰기 미니게임 (write-game.js) — game:"write" 장면 담당.
   hangulssugi 리포지터리의 획순 데이터(hangul-data.js)·3겹 가이드·획순 판정을
   동화 엔진 위에 이식했다. engine.js는 수정하지 않는다: 이 파일이 engine.js
   뒤에 로드되어 전역 renderMinigame 만 감싸고, 나머지 게임은 원본에 넘긴다.

   ★ 이 동화의 본체는 이야기다. 쓰기는 이야기를 멈춰 세우는 과제가 아니라
     잠깐 흥미를 끄는 한 순간이어야 한다. 그래서 낱말 전체를 쓰게 하지 않고
     writeIndex 로 한 글자만 쓰게 한다(나머지 글자는 이미 채워진 채로 보인다).
     빗나가도 세 번이면 대신 그려 주고 넘어간다.

   장면 형식:
   { type:"minigame", game:"write", word:"바나나", writeIndex:1, bg, bgm,
     char:"dogDudu", charMood:"sad",         // 곁에 서 있는 캐릭터 (다 쓰면 happy)
     narration:"...", doneSay:"...", next:"..." }
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 화면에 표시되는 라벨 (전부 받침 없는 글자 — check_batchim.js가 검사) ---------- */
  const WG_LABELS = { erase: "지우기", demo: "다시 보기" };

  /* ---------- 판정 상수 — hangulssugi 값을 동화용으로 더 관대하게 ---------- */
  const T = {
    SAMPLES: 32,   // 안내 획을 몇 점으로 쪼개 훑는지
    COVER: 0.5,    // 안내 획의 몇 할을 지나야 통과인지
    STAY: 0.5,     // 그은 획이 안내 위에 머무른 비율
    NEAR: 1.1,     // 지나간 것으로 치는 거리 (획 굵기 배수)
    START: 2.2     // 시작점 허용 거리 (획 굵기 배수)
  };
  const MISS_HINT = 2;   // 이만큼 빗나가면 그 획을 잠깐 비춰 줌
  const MISS_AUTO = 3;   // 이만큼 빗나가면 대신 그려 주고 진행 (무실패)

  /* ---------- 스타일 주입 (index.html 무수정) ---------- */
  const css = `
  .wgWrap { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; gap:4vw; padding:90px 16px 16px; }
  /* 글씨 칸이 화면을 다 먹으면 이야기 장면이 아니라 학습지가 된다.
     배경·소품·캐릭터가 함께 보이도록 칸은 화면의 3분의 1쯤으로 둔다. */
  .wgCard { position:relative; background:#FFFDF8; border:3px solid #f0d9c2; border-radius:28px;
            box-shadow:0 6px 0 rgba(90,74,56,.12), 0 12px 24px rgba(90,74,56,.08);
            width:min(38vw, 46vh, 320px); aspect-ratio:1; }
  .wgCard svg, .wgCard canvas { position:absolute; inset:10px; width:calc(100% - 20px); height:calc(100% - 20px); }
  #wgGuide { z-index:1; transition:opacity .25s; } #wgGuide.dimmed { opacity:.18; }
  #wgCanvas { z-index:2; touch-action:none; }
  #wgDemo { z-index:3; pointer-events:none; }
  .wgSide { display:flex; flex-direction:column; align-items:center; gap:14px; }
  .wgChips { display:flex; gap:10px; }
  .wgChip { width:58px; height:58px; border-radius:14px; border:4px dashed #d9b58f; background:rgba(255,245,235,.75);
            display:grid; place-items:center; font-size:30px; font-weight:800; color:#d9b58f; }
  .wgChip.now { border-style:solid; border-color:#f6a96b; color:#c9763d; background:#fff;
                animation:hintGlow 1.2s ease-in-out infinite; }
  .wgChip.done { border-style:solid; border-color:#7ec97e; background:#fff; color:#5b4636; }
  .wgBtn { border:none; border-radius:20px; background:#fff; border:3px solid #f0d9c2; color:#8a6b4f;
           font-weight:800; font-size:19px; padding:12px 20px; cursor:pointer;
           box-shadow:0 4px 0 rgba(90,74,56,.12); display:flex; align-items:center; gap:8px; }
  .wgBtn:active { transform:translateY(3px); box-shadow:0 1px 0 rgba(90,74,56,.12); }
  .wgStrokeOutline { fill:none; stroke-linecap:round; stroke-linejoin:round; }
  .wgBand { opacity:.16; }
  .wgDots { stroke-linecap:butt; opacity:.7; }
  .wgDone { opacity:.4; } .wgLater { opacity:.07; }
  .wgBadge { animation:wgPulse 1.4s ease-in-out infinite; transform-origin:center; transform-box:fill-box; }
  @keyframes wgPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  .wgAnim { stroke-dasharray:var(--len); stroke-dashoffset:var(--len);
            animation:wgDraw var(--dur,1.4s) ease-in-out forwards; animation-delay:var(--delay,0s); }
  @keyframes wgDraw { to { stroke-dashoffset:0; } }
  .wgFlash { animation:wgFlashIn 1.6s ease-in-out both; }
  @keyframes wgFlashIn { 0%{opacity:0} 12%{opacity:.55} 75%{opacity:.55} 100%{opacity:0} }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- SVG 유틸 (hangulssugi app.js에서 이식) ---------- */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }
  function padViewBox(vb, pad) {
    const n = String(vb).trim().split(/\s+/).map(Number);
    if (n.length !== 4 || n.some(isNaN)) return vb;
    return `${n[0] - pad} ${n[1] - pad} ${n[2] + pad * 2} ${n[3] + pad * 2}`;
  }
  // 획 위 한 점에서 획 '바깥'으로 밀어낸 자리 — 시작 배지가 그을 자리를 가리지 않게
  function placeOutside(pathEl, at, sw, r, placed) {
    const len = pathEl.getTotalLength();
    const p = pathEl.getPointAtLength(at);
    const ahead = pathEl.getPointAtLength(Math.min(len, at + Math.min(12, len * 0.2)));
    const base = Math.atan2(ahead.y - p.y, ahead.x - p.x) + Math.PI;
    const dist = sw / 2 + r + sw * 0.12;
    const clash = q => placed.some(m => Math.hypot(m.x - q.x, m.y - q.y) < (m.r + r) * 1.05);
    let pick = null;
    [0, 40, -40, 80, -80, 120, -120].forEach(deg => {
      if (pick) return;
      const a = base + deg * Math.PI / 180;
      const q = { x: p.x + Math.cos(a) * dist, y: p.y + Math.sin(a) * dist, r: r };
      if (!clash(q)) pick = q;
    });
    if (!pick) pick = { x: p.x + Math.cos(base) * dist * 2, y: p.y + Math.sin(base) * dist * 2, r: r };
    placed.push(pick);
    return pick;
  }
  function addEndArrow(svg, pathEl, color, sw) {
    const len = pathEl.getTotalLength();
    if (len < sw) return;
    const tip = pathEl.getPointAtLength(len);
    const back = pathEl.getPointAtLength(Math.max(0, len - Math.min(12, len * 0.2)));
    const ang = Math.atan2(tip.y - back.y, tip.x - back.x);
    const gap = sw * 0.85;
    const a = sw * 0.36;
    svg.appendChild(svgEl('polygon', {
      points: `${-a * 0.7},${-a} ${a * 0.9},0 ${-a * 0.7},${a}`,
      fill: color,
      transform: `translate(${tip.x + Math.cos(ang) * gap},${tip.y + Math.sin(ang) * gap}) rotate(${ang * 180 / Math.PI})`
    }));
  }

  /* ---------- 획순 판정 (hangulssugi strokeFollows 이식) ---------- */
  function guideSamples(svg, canvas, d, n) {
    const probe = svgEl('path', { d: d, fill: 'none', stroke: 'none' });
    svg.appendChild(probe);
    const len = probe.getTotalLength();
    const m = probe.getScreenCTM();
    const rect = canvas.getBoundingClientRect();
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const q = probe.getPointAtLength(len * i / n);
      pts.push({ x: q.x * m.a + q.y * m.c + m.e - rect.left,
                 y: q.x * m.b + q.y * m.d + m.f - rect.top });
    }
    const scale = Math.hypot(m.a, m.b);
    probe.remove();
    return { pts: pts, scale: scale };
  }
  function nearestDist(p, list) {
    let best = Infinity;
    for (let i = 0; i < list.length; i++) {
      const dx = p.x - list[i].x, dy = p.y - list[i].y;
      const d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }
  function windingSign(pts) {
    let cx = 0, cy = 0;
    pts.forEach(p => { cx += p.x; cy += p.y; });
    cx /= pts.length; cy /= pts.length;
    let sum = 0;
    for (let i = 1; i < pts.length; i++) {
      sum += (pts[i - 1].x - cx) * (pts[i].y - cy) - (pts[i].x - cx) * (pts[i - 1].y - cy);
    }
    return Math.sign(sum);
  }
  function strokeFollows(svg, canvas, user, data, i) {
    if (!user || user.length < 2) return false;
    const sw = data.strokeWidth || 24;
    const g = guideSamples(svg, canvas, data.strokes[i].d, T.SAMPLES);
    const near = sw * g.scale * T.NEAR;
    const gs = g.pts[0], ge = g.pts[g.pts.length - 1];
    let neighbour = Infinity;
    data.strokes.forEach((s, j) => {
      if (j === i) return;
      const q = guideSamples(svg, canvas, s.d, 1).pts[0];
      neighbour = Math.min(neighbour, Math.hypot(q.x - gs.x, q.y - gs.y));
    });
    const startTol = Math.max(sw * g.scale * 0.7,
      Math.min(sw * g.scale * T.START, neighbour * 0.5));
    const u0 = user[0], u1 = user[user.length - 1];
    if (Math.hypot(u0.x - gs.x, u0.y - gs.y) > startTol) return false;

    let far = 0;
    g.pts.forEach(p => { far = Math.max(far, Math.hypot(p.x - gs.x, p.y - gs.y)); });
    const ends = Math.hypot(gs.x - ge.x, gs.y - ge.y);
    const closed = ends <= startTol && far > ends * 2;
    if (closed) {
      if (windingSign(user) !== windingSign(g.pts)) return false;
    } else if (Math.hypot(u1.x - ge.x, u1.y - ge.y) > Math.hypot(u1.x - gs.x, u1.y - gs.y)) {
      return false;   // 끝에서 시작해 거꾸로 그은 획
    }
    let hit = 0;
    g.pts.forEach(p => { if (nearestDist(p, user) <= near) hit++; });
    if (hit / g.pts.length < T.COVER) return false;
    let stay = 0;
    user.forEach(p => { if (nearestDist(p, g.pts) <= near) stay++; });
    return stay / user.length >= T.STAY;
  }

  /* ---------- 쓰기 장면 렌더러 ---------- */
  let cleanup = null;   // 이전 쓰기 장면의 리스너 정리

  function renderWrite(scene) {
    if (cleanup) { cleanup(); cleanup = null; }
    const token = sceneToken;                       // engine.js 전역 — 장면이 바뀌면 달라짐
    const alive = () => token === sceneToken;

    const item = window.buildHangulItem(scene.word || "바나나");
    if (!item) { console.warn('[write] 조립 불가:', scene.word); return; }
    const glyphs = item.parts || [item];
    const INK = scene.inkColor || "#A9640A";        // hangulssugi 단어 카테고리의 딥 컬러
    // 아이가 실제로 쓰는 글자. 지정이 없으면 전부 쓴다.
    const targets = (scene.writeIndex != null)
      ? [Math.max(0, Math.min(glyphs.length - 1, scene.writeIndex))]
      : glyphs.map((_, i) => i);

    puzzleEl.style.display = "flex";
    const ch = scene.char || "dogDudu";
    puzzleSceneEl.innerHTML =
      `<div class="wgWrap">
         <div class="wgCard">
           <svg id="wgGuide" preserveAspectRatio="xMidYMid meet"></svg>
           <canvas id="wgCanvas"></canvas>
           <svg id="wgDemo" preserveAspectRatio="xMidYMid meet"></svg>
         </div>
         <div class="wgSide">
           <div class="wgChips">${glyphs.map((g, i) =>
             `<div class="wgChip" data-gi="${i}">${g.id}</div>`).join("")}</div>
           <div class="wolfSpot" id="wgChar" style="position:static">${charHTML(ch, 175, scene.charMood || "sad")}</div>
         </div>
       </div>`;
    trayEl.innerHTML =
      `<button class="wgBtn" id="wgDemoBtn">🎬 ${WG_LABELS.demo}</button>
       <button class="wgBtn" id="wgEraseBtn">🧽 ${WG_LABELS.erase}</button>`;

    const guide = document.getElementById('wgGuide');
    const overlay = document.getElementById('wgDemo');
    const canvas = document.getElementById('wgCanvas');
    const ctx = canvas.getContext('2d');

    /* 상태 */
    let ti = 0;              // targets 안에서 몇 번째를 쓰는 중인지
    let gi = targets[0];     // 지금 쓰는 음절 (glyphs 인덱스)
    let traceIndex = 0;      // 지금 그을 획
    let miss = 0;            // 이 획에서 빗나간 횟수
    let strokes = [];        // 이 음절에서 받아들인(+진행 중) 획
    let drawing = false, activeId = null, cur = null;
    let penWidth = 16;
    let demoPlaying = false, demoToken = 0;
    const timers = [];
    const later = (fn, ms) => { const id = setTimeout(() => { if (alive()) fn(); }, ms); timers.push(id); };

    const data = () => glyphs[gi];

    function setViewBox() {
      const d = data();
      const vb = padViewBox(d.viewBox || '0 0 200 200', (d.strokeWidth || 24) * 1.25);
      guide.setAttribute('viewBox', vb);
      overlay.setAttribute('viewBox', vb);
    }
    function resizeCanvas() {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const d = data();
      const probe = svgEl('path', { d: d.strokes[0].d, fill: 'none', stroke: 'none' });
      guide.appendChild(probe);
      const m = probe.getScreenCTM();
      probe.remove();
      if (m) penWidth = (d.strokeWidth || 24) * Math.hypot(m.a, m.b) * 0.9;
      redraw();
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = penWidth;
      strokes.forEach(s => {
        if (s.points.length === 1) {
          const p = s.points[0];
          ctx.beginPath(); ctx.arc(p.x, p.y, penWidth / 2, 0, Math.PI * 2); ctx.fill();
          return;
        }
        ctx.beginPath();
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
        ctx.stroke();
      });
    }

    /* 3겹 가이드 — 다 쓴 획은 옅게, 아직 아닌 획은 아주 흐리게, 지금 획은 띠+점선+배지 */
    function renderGuide() {
      guide.innerHTML = '';
      const d = data();
      const sw = d.strokeWidth || 24;
      d.strokes.slice(0, traceIndex).forEach(st => guide.appendChild(svgEl('path',
        { d: st.d, class: 'wgStrokeOutline wgDone', stroke: INK, 'stroke-width': sw })));
      d.strokes.slice(traceIndex + 1).forEach(st => guide.appendChild(svgEl('path',
        { d: st.d, class: 'wgStrokeOutline wgLater', stroke: INK, 'stroke-width': sw })));
      const st = d.strokes[traceIndex];
      if (!st) return;
      guide.appendChild(svgEl('path', { d: st.d, class: 'wgStrokeOutline wgBand',
        stroke: INK, 'stroke-width': sw }));
      guide.appendChild(svgEl('path', { d: st.d, class: 'wgStrokeOutline wgDots',
        stroke: INK, 'stroke-width': sw * 0.12,
        'stroke-dasharray': (sw * 0.17) + ' ' + (sw * 0.30) }));
      const r = sw * 0.42;
      const probe = svgEl('path', { d: st.d, fill: 'none', stroke: 'none' });
      guide.appendChild(probe);
      const badge = placeOutside(probe, 0, sw, r, []);
      addEndArrow(guide, probe, INK, sw);
      probe.remove();
      guide.appendChild(svgEl('circle', { cx: badge.x, cy: badge.y, r: r, fill: INK,
        stroke: 'white', 'stroke-width': sw * 0.09, class: 'wgBadge' }));
      const label = svgEl('text', { x: badge.x, y: badge.y + r * 0.36, 'text-anchor': 'middle',
        'font-size': r * 1.1, 'font-weight': 'bold', fill: 'white' });
      label.textContent = traceIndex + 1;
      guide.appendChild(label);
    }
    // 아이가 쓰지 않는 글자는 처음부터 채워진 채로 보여 준다 — 낱말은 눈에
    // 다 들어오되, 손으로 쓸 것은 딱 한 글자라는 게 한눈에 보이게.
    function renderChips() {
      puzzleSceneEl.querySelectorAll('.wgChip').forEach(c => {
        const i = +c.dataset.gi;
        const isTarget = targets.indexOf(i) >= 0;
        c.classList.toggle('now', isTarget && i === gi);
        c.classList.toggle('done', !isTarget || targets.indexOf(i) < ti);
      });
    }

    /* 획순 데모 — 가이드는 흐려질 뿐 파괴되지 않는다 (hangulssugi 방식) */
    function playDemo() {
      stopDemo();
      const myDemo = ++demoToken;
      demoPlaying = true;
      guide.classList.add('dimmed');
      overlay.innerHTML = '';
      const d = data();
      const sw = d.strokeWidth || 24;
      let delay = 0;
      const paths = [];
      d.strokes.forEach(st => {
        const p = svgEl('path', { d: st.d, class: 'wgStrokeOutline',
          stroke: INK, 'stroke-width': sw });
        overlay.appendChild(p); paths.push(p);
        const len = p.getTotalLength();
        const dur = Math.max(1.0, len / 220);
        p.style.setProperty('--len', len);
        p.style.setProperty('--delay', delay + 's');
        p.style.setProperty('--dur', dur + 's');
        p.classList.add('wgAnim');
        delay += dur + 0.25;
      });
      const r = sw * 0.45, marks = [];
      d.strokes.forEach((st, i) => {
        const m = placeOutside(paths[i], 0, sw, r, marks);
        overlay.appendChild(svgEl('circle', { cx: m.x, cy: m.y, r: r, fill: 'white',
          stroke: INK, 'stroke-width': sw * 0.17 }));
        const t = svgEl('text', { x: m.x, y: m.y + r * 0.36, 'text-anchor': 'middle',
          'font-size': r * 1.1, 'font-weight': 'bold', fill: INK });
        t.textContent = i + 1;
        overlay.appendChild(t);
      });
      later(() => { if (myDemo === demoToken) stopDemo(); }, delay * 1000 + 400);
    }
    function stopDemo() {
      demoToken++;
      demoPlaying = false;
      overlay.innerHTML = '';
      guide.classList.remove('dimmed');
    }
    // 빗나갔을 때: 지금 획 하나만 잠깐 비춰 준다
    function flashStroke() {
      if (demoPlaying) return;
      const d = data();
      const st = d.strokes[traceIndex];
      if (!st) return;
      const sw = d.strokeWidth || 24;
      overlay.innerHTML = '';
      overlay.appendChild(svgEl('path', { d: st.d, class: 'wgStrokeOutline wgFlash',
        stroke: INK, 'stroke-width': sw }));
      later(() => { if (!demoPlaying) overlay.innerHTML = ''; }, 1600);
    }

    /* 음절 하나 시작.
       첫 음절의 음성은 넣지 않는다 — 엔진이 renderMinigame 직후 narration을
       읽어 주는데, speak는 이전 음성을 취소하므로 여기서 말하면 서로 끊는다. */
    function startGlyph(first) {
      traceIndex = 0; miss = 0; strokes = [];
      setViewBox(); renderGuide(); renderChips();
      requestAnimationFrame(() => { if (alive()) resizeCanvas(); });
      if (!first) speak(`'${data().id}' 자도 반짝이는 점에서부터 따라 써 볼까요?`);
      later(playDemo, first ? 900 : 350);
    }

    /* 획 판정 */
    function judge() {
      const d = data();
      const s = strokes[strokes.length - 1];
      if (!s || !d.strokes[traceIndex]) return;
      if (strokeFollows(guide, canvas, s.points, d, traceIndex)) {
        traceIndex++; miss = 0;
        Audio2.sfx("good");
        if (traceIndex >= d.strokes.length) { glyphDone(); return; }
        renderGuide();
        return;
      }
      strokes.pop(); redraw();
      Audio2.sfx("soft");
      miss++;
      if (miss >= MISS_AUTO) { autoStroke(); return; }
      if (miss >= MISS_HINT) { flashStroke(); speak("이 획이에요! 반짝이는 점에서 시작해요."); }
      else speak("반짝이는 점에서 천천히 따라가 볼까요?");
    }
    // 무실패: 대신 그려 주고 다음 획으로
    function autoStroke() {
      miss = 0;
      const d = data();
      const st = d.strokes[traceIndex];
      speak("같이 써 볼게요! 이렇게!");
      const g = guideSamples(guide, canvas, st.d, T.SAMPLES);
      strokes.push({ points: g.pts });
      redraw();
      Audio2.sfx("place");
      traceIndex++;
      if (traceIndex >= d.strokes.length) { later(glyphDone, 500); return; }
      renderGuide();
    }
    function glyphDone() {
      renderGuide();       // 전 획이 옅게 채워진 완성 모양
      Audio2.sfx("good");
      ti++;
      renderChips();
      if (ti >= targets.length) { allDone(); return; }
      gi = targets[ti];
      later(() => startGlyph(false), 800);
    }
    function allDone() {
      unbind();
      Audio2.sfx("fanfare");
      const charBox = document.getElementById('wgChar');
      if (charBox) charBox.innerHTML = charHTML(ch, 175, "happy");
      const msg = scene.doneSay || "우와! 다 써서 고마워요!";
      showDoneBar(msg, scene.next);
      speakThenAdvance(token, msg, scene.next, 1600);
    }

    /* 그리기 (Pointer Events 단일 경로 — hangulssugi 방식) */
    const pos = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    function onDown(e) {
      if (demoPlaying || drawing || (e.pointerType === 'mouse' && e.button !== 0)) return;
      Audio2.resume();
      canvas.setPointerCapture(e.pointerId);
      activeId = e.pointerId; drawing = true;
      cur = { points: [pos(e)] };
      strokes.push(cur);
      redraw();
    }
    function onMove(e) {
      if (!drawing || e.pointerId !== activeId) return;
      const p = pos(e);
      const last = cur.points[cur.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 2) { cur.points.push(p); redraw(); }
    }
    function onUp(e) {
      if (!drawing || e.pointerId !== activeId) return;
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
      drawing = false; activeId = null; cur = null;
      judge();
    }
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    const onResize = () => { if (alive()) resizeCanvas(); };
    window.addEventListener('resize', onResize);
    function unbind() {
      window.removeEventListener('resize', onResize);
      timers.forEach(clearTimeout);
    }
    cleanup = unbind;

    document.getElementById('wgDemoBtn').onclick = () => { Audio2.sfx("blip"); playDemo(); };
    document.getElementById('wgEraseBtn').onclick = () => {
      Audio2.sfx("soft");
      traceIndex = 0; miss = 0; strokes = [];
      renderGuide(); redraw();
    };

    startGlyph(true);
  }

  /* ---------- 엔진에 끼워 넣기 (engine.js 무수정) ---------- */
  const origRenderMinigame = window.renderMinigame;
  window.renderMinigame = function (scene) {
    if (scene.game === "write") return renderWrite(scene);
    return origRenderMinigame(scene);
  };

  /* ---------- 엔진 버튼 글씨를 받침 없는 말로 ----------
     engine.js 가 "다음 ▶", "다시 처음 ↺", "다른 선택 해보기 ↗" 를 장면마다 다시
     써 넣는다. 자막은 다 받침이 없는데 아이 손이 제일 자주 가는 버튼에만 받침이
     남으면 규칙이 깨진다. 엔진을 고치는 대신 글자가 바뀔 때마다 갈아 끼운다. */
  const BTN_WORDS = {
    "다음 ▶": "가자 ▶",
    "다시 처음 ↺": "다시 하자 ↺",
    "다른 선택 해보기 ↗": "다르게 가 보자 ↗"
  };
  function relabel() {
    ["nextBtn", "altBtn"].forEach(id => {
      const el = document.getElementById(id);
      if (el && BTN_WORDS[el.textContent]) el.textContent = BTN_WORDS[el.textContent];
    });
  }
  relabel();
  new MutationObserver(relabel)
    .observe(document.body, { childList: true, subtree: true, characterData: true });

  /* ---------- 이야기 전용 그림 설치 ----------
     story.js는 engine.js보다 먼저 로드되어 ART에 직접 못 넣는다.
     window.EXTRA_ART에 담아 두면 여기서(모든 스크립트 로드 후) 설치한다.
     시작 화면 hero는 initEngine이 이미 그린 뒤라 다시 채워 준다. */
  if (window.EXTRA_ART) {
    Object.assign(ART, window.EXTRA_ART);
    const sa = document.getElementById('startArt');
    if (sa && window.STORY && STORY.hero && ART[STORY.hero]) {
      sa.innerHTML = ART[STORY.hero](340, STORY.heroMood || "happy");
    }
  }
})();
