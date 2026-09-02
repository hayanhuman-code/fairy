/* =====================================================================
   글자 쓰기 (write-page.js) — 이 책에서 아이가 손으로 글자를 써 보는 한 장면.

   engine.js 에 기대지 않는다. 부르는 쪽이 그릇(container)과 말하기(say)만 넘겨 주면
   그 안에서 혼자 돌아간다:
       renderWritePage(container, { word, index, say, stop, onDone })

   획순 데이터·3겹 안내·획순 판정은 hangulssugi 리포에서 가져왔다.
   낱말 전체를 쓰게 하지 않는다 — index 로 지정한 한 글자만. 나머지는 채워진 채로
   보여서, 낱말은 눈에 다 들어오되 손으로 쓸 것은 하나라는 게 한눈에 보인다.
   ===================================================================== */
(function () {
  'use strict';

  /* 화면에 보이는 글자 — 전부 받침 없음 (check_batchim.js 가 검사) */
  const KID_TEXT = { erase: "지우기", demo: "다시 보기" };

  /* 판정 — hangulssugi 값을 네 살 손에 맞춰 더 관대하게 */
  const T = { SAMPLES: 32, COVER: 0.5, STAY: 0.5, NEAR: 1.1, START: 2.2 };
  const MISS_HINT = 2;   // 이만큼 빗나가면 그 획을 잠깐 비춰 준다
  const MISS_AUTO = 3;   // 이만큼 빗나가면 대신 그려 주고 넘어간다 (막히지 않게)

  const CSS = `
  .wp { position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
        gap:3vw; background:rgba(253,246,239,.86); }
  .wpCard { position:relative; background:#FFFDF8; border:3px solid #f0d9c2; border-radius:24px;
            box-shadow:0 5px 0 rgba(90,74,56,.12); width:min(34vw,52vh,290px); aspect-ratio:1; }
  .wpCard svg, .wpCard canvas { position:absolute; inset:8px; width:calc(100% - 16px); height:calc(100% - 16px); }
  .wpGuide { z-index:1; transition:opacity .25s; } .wpGuide.dim { opacity:.18; }
  .wpCanvas { z-index:2; touch-action:none; }
  .wpDemo { z-index:3; pointer-events:none; }
  .wpSide { display:flex; flex-direction:column; align-items:center; gap:14px; }
  .wpChips { display:flex; gap:8px; }
  .wpChip { width:54px; height:54px; border-radius:13px; border:4px dashed #d9b58f;
            background:rgba(255,245,235,.75); display:grid; place-items:center;
            font-size:28px; font-weight:800; color:#d9b58f; }
  .wpChip.now  { border-style:solid; border-color:#f6a96b; color:#c9763d; background:#fff;
                 animation:wpGlow 1.2s ease-in-out infinite; }
  .wpChip.done { border-style:solid; border-color:#7ec97e; background:#fff; color:#5b4636; }
  @keyframes wpGlow { 0%,100%{box-shadow:0 0 0 rgba(246,169,107,0)} 50%{box-shadow:0 0 16px 4px rgba(246,169,107,.8)} }
  .wpBtns { display:flex; gap:10px; }
  .wpBtn { border:none; border-radius:18px; background:#fff; border:3px solid #f0d9c2; color:#8a6b4f;
           font-family:inherit; font-weight:800; font-size:17px; padding:10px 16px; cursor:pointer;
           box-shadow:0 4px 0 rgba(90,74,56,.12); }
  .wpBtn:active { transform:translateY(3px); box-shadow:0 1px 0 rgba(90,74,56,.12); }
  .wpStroke { fill:none; stroke-linecap:round; stroke-linejoin:round; }
  .wpBand { opacity:.16; }  .wpDots { stroke-linecap:butt; opacity:.7; }
  .wpDone2 { opacity:.4; }  .wpLater { opacity:.07; }
  .wpBadge { animation:wpPulse 1.4s ease-in-out infinite; transform-origin:center; transform-box:fill-box; }
  @keyframes wpPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  .wpAnim { stroke-dasharray:var(--len); stroke-dashoffset:var(--len);
            animation:wpDraw var(--dur,1.4s) ease-in-out forwards; animation-delay:var(--delay,0s); }
  @keyframes wpDraw { to { stroke-dashoffset:0 } }
  .wpFlash { animation:wpFlashIn 1.6s ease-in-out both; }
  @keyframes wpFlashIn { 0%{opacity:0} 12%{opacity:.55} 75%{opacity:.55} 100%{opacity:0} }
  @media (prefers-reduced-motion: reduce) { .wpBadge,.wpChip.now { animation:none !important } }
  `;
  if (!document.getElementById('wpStyle')) {
    const s = document.createElement('style'); s.id = 'wpStyle'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- SVG 도우미 (hangulssugi 에서 이식) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, at) => { const e = document.createElementNS(NS, tag);
    for (const k in at) e.setAttribute(k, at[k]); return e; };
  function padViewBox(vb, pad) {
    const n = String(vb).trim().split(/\s+/).map(Number);
    if (n.length !== 4 || n.some(isNaN)) return vb;
    return `${n[0] - pad} ${n[1] - pad} ${n[2] + pad * 2} ${n[3] + pad * 2}`;
  }
  // 시작 배지를 획 '바깥'으로 밀어낸다 — 획 위에 얹으면 이제 그으려는 자리를 가린다
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
    placed.push(pick); return pick;
  }
  function addEndArrow(svg, pathEl, color, sw) {
    const len = pathEl.getTotalLength();
    if (len < sw) return;
    const tip = pathEl.getPointAtLength(len);
    const back = pathEl.getPointAtLength(Math.max(0, len - Math.min(12, len * 0.2)));
    const ang = Math.atan2(tip.y - back.y, tip.x - back.x);
    const gap = sw * 0.85, a = sw * 0.36;
    svg.appendChild(svgEl('polygon', {
      points: `${-a * 0.7},${-a} ${a * 0.9},0 ${-a * 0.7},${a}`, fill: color,
      transform: `translate(${tip.x + Math.cos(ang) * gap},${tip.y + Math.sin(ang) * gap}) rotate(${ang * 180 / Math.PI})`
    }));
  }

  /* ---------- 획순 판정 (모양은 채점하지 않는다. 시작점·방향·경로만) ---------- */
  function guideSamples(svg, canvas, d, n) {
    const probe = svgEl('path', { d: d, fill: 'none', stroke: 'none' });
    svg.appendChild(probe);
    const len = probe.getTotalLength(), m = probe.getScreenCTM();
    const rect = canvas.getBoundingClientRect(), pts = [];
    for (let i = 0; i <= n; i++) {
      const q = probe.getPointAtLength(len * i / n);
      pts.push({ x: q.x * m.a + q.y * m.c + m.e - rect.left,
                 y: q.x * m.b + q.y * m.d + m.f - rect.top });
    }
    const scale = Math.hypot(m.a, m.b);
    probe.remove();
    return { pts, scale };
  }
  function nearestDist(p, list) {
    let best = Infinity;
    for (let i = 0; i < list.length; i++) {
      const dx = p.x - list[i].x, dy = p.y - list[i].y, d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }
  function windingSign(pts) {
    let cx = 0, cy = 0;
    pts.forEach(p => { cx += p.x; cy += p.y; });
    cx /= pts.length; cy /= pts.length;
    let sum = 0;
    for (let i = 1; i < pts.length; i++)
      sum += (pts[i-1].x - cx) * (pts[i].y - cy) - (pts[i].x - cx) * (pts[i-1].y - cy);
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
    const startTol = Math.max(sw * g.scale * 0.7, Math.min(sw * g.scale * T.START, neighbour * 0.5));
    const u0 = user[0], u1 = user[user.length - 1];
    if (Math.hypot(u0.x - gs.x, u0.y - gs.y) > startTol) return false;

    let far = 0;
    g.pts.forEach(p => { far = Math.max(far, Math.hypot(p.x - gs.x, p.y - gs.y)); });
    const ends = Math.hypot(gs.x - ge.x, gs.y - ge.y);
    if (ends <= startTol && far > ends * 2) {              // 고리(ㅇ 같은 것)
      if (windingSign(user) !== windingSign(g.pts)) return false;
    } else if (Math.hypot(u1.x - ge.x, u1.y - ge.y) > Math.hypot(u1.x - gs.x, u1.y - gs.y)) {
      return false;                                        // 거꾸로 그은 획
    }
    let hit = 0; g.pts.forEach(p => { if (nearestDist(p, user) <= near) hit++; });
    if (hit / g.pts.length < T.COVER) return false;
    let stay = 0; user.forEach(p => { if (nearestDist(p, g.pts) <= near) stay++; });
    return stay / user.length >= T.STAY;
  }

  /* ---------- 본체 ---------- */
  window.renderWritePage = function (container, opt) {
    const say  = opt.say  || function (t, d) { d && d(); };
    const stop = opt.stop || function () {};
    const item = window.buildHangulItem(opt.word);
    if (!item) { console.warn('[write] 조립 불가:', opt.word); opt.onDone && opt.onDone(); return; }
    const glyphs = item.parts || [item];
    const target = Math.max(0, Math.min(glyphs.length - 1, opt.index == null ? 0 : opt.index));
    const INK = '#A9640A';
    const data = glyphs[target];

    container.innerHTML =
      `<div class="wp">
         <div class="wpCard">
           <svg class="wpGuide" preserveAspectRatio="xMidYMid meet"></svg>
           <canvas class="wpCanvas"></canvas>
           <svg class="wpDemo" preserveAspectRatio="xMidYMid meet"></svg>
         </div>
         <div class="wpSide">
           <div class="wpChips">${glyphs.map((g, i) =>
             `<div class="wpChip ${i === target ? 'now' : 'done'}">${g.id}</div>`).join('')}</div>
           <div class="wpBtns">
             <button class="wpBtn" data-act="demo">🎬 ${KID_TEXT.demo}</button>
             <button class="wpBtn" data-act="erase">🧽 ${KID_TEXT.erase}</button>
           </div>
         </div>
       </div>`;

    const guide   = container.querySelector('.wpGuide');
    const overlay = container.querySelector('.wpDemo');
    const canvas  = container.querySelector('.wpCanvas');
    const ctx = canvas.getContext('2d');
    const sw = data.strokeWidth || 24;

    let traceIndex = 0, miss = 0, strokes = [], finished = false;
    let drawing = false, activeId = null, cur = null, penWidth = 14;
    let demoPlaying = false, demoToken = 0;
    const timers = [];
    const alive = () => document.body.contains(canvas);
    const later = (fn, ms) => { const t = setTimeout(() => { if (alive()) fn(); }, ms); timers.push(t); return t; };

    const vb = padViewBox(data.viewBox || '0 0 200 200', sw * 1.25);
    guide.setAttribute('viewBox', vb);
    overlay.setAttribute('viewBox', vb);

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const probe = svgEl('path', { d: data.strokes[0].d, fill: 'none', stroke: 'none' });
      guide.appendChild(probe);
      const m = probe.getScreenCTM(); probe.remove();
      if (m) penWidth = sw * Math.hypot(m.a, m.b) * 0.9;
      redraw();
    }
    function redraw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = penWidth;
      strokes.forEach(s => {
        if (s.points.length === 1) {
          const p = s.points[0];
          ctx.beginPath(); ctx.arc(p.x, p.y, penWidth / 2, 0, Math.PI * 2); ctx.fill(); return;
        }
        ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
        ctx.stroke();
      });
    }

    /* 3겹 안내: 연한 띠 → 가는 점선 → 획 바깥의 배지·화살표 */
    function renderGuide() {
      guide.innerHTML = '';
      data.strokes.slice(0, traceIndex).forEach(st => guide.appendChild(
        svgEl('path', { d: st.d, class: 'wpStroke wpDone2', stroke: INK, 'stroke-width': sw })));
      data.strokes.slice(traceIndex + 1).forEach(st => guide.appendChild(
        svgEl('path', { d: st.d, class: 'wpStroke wpLater', stroke: INK, 'stroke-width': sw })));
      const st = data.strokes[traceIndex];
      if (!st) return;
      guide.appendChild(svgEl('path', { d: st.d, class: 'wpStroke wpBand', stroke: INK, 'stroke-width': sw }));
      guide.appendChild(svgEl('path', { d: st.d, class: 'wpStroke wpDots', stroke: INK,
        'stroke-width': sw * 0.12, 'stroke-dasharray': (sw * 0.17) + ' ' + (sw * 0.30) }));
      const r = sw * 0.42;
      const probe = svgEl('path', { d: st.d, fill: 'none', stroke: 'none' });
      guide.appendChild(probe);
      const badge = placeOutside(probe, 0, sw, r, []);
      addEndArrow(guide, probe, INK, sw);
      probe.remove();
      guide.appendChild(svgEl('circle', { cx: badge.x, cy: badge.y, r: r, fill: INK,
        stroke: 'white', 'stroke-width': sw * 0.09, class: 'wpBadge' }));
      const label = svgEl('text', { x: badge.x, y: badge.y + r * 0.36, 'text-anchor': 'middle',
        'font-size': r * 1.1, 'font-weight': 'bold', fill: 'white' });
      label.textContent = traceIndex + 1;
      guide.appendChild(label);
    }

    /* 획순 데모 — 안내는 흐려질 뿐 부서지지 않는다 */
    function playDemo() {
      stopDemo();
      const mine = ++demoToken;
      demoPlaying = true;
      guide.classList.add('dim');
      overlay.innerHTML = '';
      let delay = 0; const paths = [];
      data.strokes.forEach(st => {
        const p = svgEl('path', { d: st.d, class: 'wpStroke', stroke: INK, 'stroke-width': sw });
        overlay.appendChild(p); paths.push(p);
        const len = p.getTotalLength(), dur = Math.max(1.0, len / 220);
        p.style.setProperty('--len', len);
        p.style.setProperty('--delay', delay + 's');
        p.style.setProperty('--dur', dur + 's');
        p.classList.add('wpAnim');
        delay += dur + 0.25;
      });
      const r = sw * 0.45, marks = [];
      data.strokes.forEach((st, i) => {
        const m = placeOutside(paths[i], 0, sw, r, marks);
        overlay.appendChild(svgEl('circle', { cx: m.x, cy: m.y, r: r, fill: 'white',
          stroke: INK, 'stroke-width': sw * 0.17 }));
        const t = svgEl('text', { x: m.x, y: m.y + r * 0.36, 'text-anchor': 'middle',
          'font-size': r * 1.1, 'font-weight': 'bold', fill: INK });
        t.textContent = i + 1;
        overlay.appendChild(t);
      });
      later(() => { if (mine === demoToken) stopDemo(); }, delay * 1000 + 400);
    }
    function stopDemo() { demoToken++; demoPlaying = false; overlay.innerHTML = ''; guide.classList.remove('dim'); }
    function flashStroke() {
      if (demoPlaying) return;
      const st = data.strokes[traceIndex];
      if (!st) return;
      overlay.innerHTML = '';
      overlay.appendChild(svgEl('path', { d: st.d, class: 'wpStroke wpFlash', stroke: INK, 'stroke-width': sw }));
      later(() => { if (!demoPlaying) overlay.innerHTML = ''; }, 1600);
    }

    /* 판정 — 틀렸다고 말하지 않는다. 지우고 다시 가리킬 뿐 */
    function judge() {
      const s = strokes[strokes.length - 1];
      if (!s || !data.strokes[traceIndex]) return;
      if (strokeFollows(guide, canvas, s.points, data, traceIndex)) {
        traceIndex++; miss = 0;
        if (traceIndex >= data.strokes.length) { done(); return; }
        renderGuide();
        return;
      }
      strokes.pop(); redraw(); miss++;
      if (miss >= MISS_AUTO) { autoStroke(); return; }
      if (miss >= MISS_HINT) { flashStroke(); say("이 획이에요! 반짝이는 점에서 시작해요."); }
      else say("반짝이는 점에서 천천히 따라가 볼까요?");
    }
    function autoStroke() {                 // 막히지 않게 대신 그려 준다
      miss = 0;
      const st = data.strokes[traceIndex];
      say("같이 써 볼게요! 이렇게!");
      strokes.push({ points: guideSamples(guide, canvas, st.d, T.SAMPLES).pts });
      redraw();
      traceIndex++;
      if (traceIndex >= data.strokes.length) { later(done, 500); return; }
      renderGuide();
    }
    function done() {
      if (finished) return;
      finished = true;
      renderGuide();
      container.querySelectorAll('.wpChip').forEach(c => { c.classList.remove('now'); c.classList.add('done'); });
      opt.onDone && opt.onDone();
    }

    /* 그리기 — Pointer Events 한 갈래로 (손가락·펜·마우스) */
    const pos = e => { const r = canvas.getBoundingClientRect();
                       return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    canvas.addEventListener('pointerdown', e => {
      if (finished || demoPlaying || drawing || (e.pointerType === 'mouse' && e.button !== 0)) return;
      stop();
      canvas.setPointerCapture(e.pointerId);
      activeId = e.pointerId; drawing = true;
      cur = { points: [pos(e)] }; strokes.push(cur); redraw();
    });
    canvas.addEventListener('pointermove', e => {
      if (!drawing || e.pointerId !== activeId) return;
      const p = pos(e), last = cur.points[cur.points.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) > 2) { cur.points.push(p); redraw(); }
    });
    const up = e => {
      if (!drawing || e.pointerId !== activeId) return;
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
      drawing = false; activeId = null; cur = null;
      judge();
    };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    container.querySelector('[data-act="demo"]').onclick = playDemo;
    container.querySelector('[data-act="erase"]').onclick = () => {
      if (finished) return;
      traceIndex = 0; miss = 0; strokes = []; renderGuide(); redraw();
    };
    const onResize = () => { if (alive()) resize(); };
    window.addEventListener('resize', onResize);

    renderGuide();
    requestAnimationFrame(() => { if (alive()) resize(); });
    later(playDemo, 900);
  };
})();
