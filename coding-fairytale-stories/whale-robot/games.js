// 고래로봇과 배 — 놀이 3종
// 무실패: 틀려도 넘어갈 수 있게 도와준다. 다 하면 done() 을 불러 '다음' 잠금을 푼다.

const SVGNS = 'http://www.w3.org/2000/svg';
const NUM = ['하나', '둘', '셋', '넷', '다섯'];

// ── 효과음 (WebAudio 로 합성 — 파일 없음) ─────────────
let actx = null;
function sfx(kind) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { pop: [660], ding: [784, 1047], boop: [220], swish: [520, 780] }[kind] || [600];
    notes.forEach((f, k) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + k * .12;
      o.type = kind === 'boop' ? 'triangle' : 'sine';
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.25, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + .28);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .3);
    });
  } catch (e) { /* 소리가 안 나도 놀이는 된다 */ }
}

const gameBox = () => document.getElementById('game');
function onTap(el, fn) { el.addEventListener('pointerdown', (e) => { e.preventDefault(); fn(e); }); }

const GAMES = {
  // ── 놀이 1 · 사다리 칸 세기 ───────────────────────
  count(p, done) {
    const rungs = [...scene.querySelectorAll('.rung.hit')];
    let n = 0;
    rungs.forEach((r) => onTap(r, () => {
      if (r.classList.contains('done')) return;
      r.classList.add('done');
      const num = r.querySelector('.num');
      num.textContent = ++n; num.setAttribute('opacity', 1);
      sfx('pop'); speak(NUM[n - 1], .8);
      if (n === rungs.length) setTimeout(choose, 900);
    }));

    function choose() {
      const box = gameBox();
      box.innerHTML = '<div class="choices"></div>';
      const row = box.firstChild;
      let wrong = 0;
      speak('사다리는 몇 칸이에요?', .85);
      [2, 3, 4].forEach((k) => {
        const b = document.createElement('button');
        b.className = 'choice'; b.textContent = k;
        onTap(b, () => {
          if (row.classList.contains('solved')) return;
          if (k === p.game.answer) {
            row.classList.add('solved'); b.classList.add('right');
            sfx('ding'); speak(`${NUM[k - 1]}! 맞아요`, .85);
            done();
          } else {
            b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500);
            sfx('boop');
            if (++wrong >= 2) row.querySelector(`[data-k="${p.game.answer}"]`).classList.add('hint');
          }
        });
        b.dataset.k = k;
        row.appendChild(b);
      });
    }
  },

  // ── 놀이 2 · 구름 모으기 ─────────────────────────
  // 흩어진 구름을 누르면 글자 소리가 나고, 고래로봇 곁으로 날아온다.
  gather(p, done) {
    const layer = document.createElementNS(SVGNS, 'g');
    scene.appendChild(layer);
    let left = p.game.clouds.length;
    p.game.clouds.forEach(({ letter, from, to }) => {
      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'cloudG hit');
      g.style.transform = `translate(${from[0]}px, ${from[1]}px)`;
      g.innerHTML = `<g class="a-bob"><g transform="scale(.78)">${ART.cloud({ letter })}</g></g>`;
      layer.appendChild(g);
      onTap(g, () => {
        speak(letter, .7);
        if (g.classList.contains('done')) return;
        g.classList.add('done'); sfx('swish');
        g.style.transform = `translate(${to[0]}px, ${to[1]}px)`;
        if (--left === 0) setTimeout(() => { sfx('ding'); done(); }, 900);
      });
    });
  },

  // ── 놀이 3 · 한 글자 따라 쓰기 ───────────────────
  // 같은 획에서 2번 빗나가면 그 획을 비추고, 3번째엔 대신 그려 주고 넘어간다.
  write(p, done) {
    const { char, strokes } = STROKES[p.game.char];
    const box = gameBox();
    box.innerHTML = `
      <div class="writer">
        <svg viewBox="0 0 200 200">
          <g class="guide">${strokes.map((s) => seg(s, '')).join('')}</g>
          <g class="inked"></g>
          <g class="now"></g>
          <polyline class="pen" points=""/>
        </svg>
      </div>`;
    const svg = box.querySelector('svg'), inked = svg.querySelector('.inked'),
          now = svg.querySelector('.now'), pen = svg.querySelector('.pen');
    let k = 0, miss = 0, pts = [], drawing = false;

    function seg([[x1, y1], [x2, y2]], cls) {
      return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
    function showNow() {
      const [[x1, y1], [x2, y2]] = strokes[k];
      now.innerHTML = `${seg(strokes[k], 'cur' + (miss >= 2 ? ' glow' : ''))}
        <circle class="startDot" cx="${x1}" cy="${y1}" r="11"/>
        <text class="stepNum" x="${x1 - 20}" y="${y1 - 12}">${k + 1}</text>`;
    }
    function ink(i) { inked.insertAdjacentHTML('beforeend', seg(strokes[i], 'ok')); }
    function next() {
      ink(k); k++; miss = 0; pen.setAttribute('points', '');
      if (k < strokes.length) { sfx('pop'); showNow(); return; }
      now.innerHTML = '';
      svg.classList.add('finished');
      sfx('ding'); speak(`${char}! 잘 썼어요`, .85);
      done();
      setTimeout(() => box.querySelector('.writer').classList.add('away'), 1600);
    }
    function pt(e) {
      const m = svg.getScreenCTM().inverse(), q = svg.createSVGPoint();
      q.x = e.clientX; q.y = e.clientY; const r = q.matrixTransform(m);
      return [r.x, r.y];
    }
    const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    function distSeg(p0, a, b) {
      const L = d(a, b) ** 2, t = Math.max(0, Math.min(1, ((p0[0] - a[0]) * (b[0] - a[0]) + (p0[1] - a[1]) * (b[1] - a[1])) / L));
      return d(p0, [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
    function judge() {
      const [a, b] = strokes[k];
      if (pts.length < 2) return false;
      const len = pts.slice(1).reduce((s, q, i) => s + d(q, pts[i]), 0);
      return d(pts[0], a) < 42 && d(pts[pts.length - 1], b) < 42
        && pts.every((q) => distSeg(q, a, b) < 38) && len > d(a, b) * .5;
    }

    svg.addEventListener('pointerdown', (e) => {
      if (k >= strokes.length) return;
      e.preventDefault(); svg.setPointerCapture(e.pointerId);
      drawing = true; pts = [pt(e)]; pen.setAttribute('points', pts.join(' '));
    });
    svg.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      pts.push(pt(e)); pen.setAttribute('points', pts.map((q) => q.join(',')).join(' '));
    });
    const up = () => {
      if (!drawing) return; drawing = false;
      if (judge()) return next();
      pen.setAttribute('points', ''); sfx('boop');
      miss++;
      if (miss >= 3) { next(); return; }     // 대신 그려 주고 넘어간다
      showNow();
    };
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    showNow();
  },
};

// 획 데이터 — 200×200 칸, [시작, 끝]. 쓰는 차례대로.
const STROKES = {
  '비': { char: '비', strokes: [
    [[38, 42], [38, 158]],     // ㅂ 왼쪽 세로
    [[104, 42], [104, 158]],   // ㅂ 오른쪽 세로
    [[38, 98], [104, 98]],     // ㅂ 가운데 가로
    [[38, 158], [104, 158]],   // ㅂ 아래 가로
    [[152, 26], [152, 176]],   // ㅣ
  ] },
};
