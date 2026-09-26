// 고래로봇과 배 — 그림 전부 (SVG 조각)
// 장면 좌표: 800 × 600. 화면 비율에 따라 위(하늘)나 양옆이 더 보이므로 배경은 넓게 그린다.
// 어느 화면에서나 다 보이는 건 x 110~690, y 0~600 (안전 영역). 주인공은 이 안에 둔다. 사람·사물 그림은 모두 "발밑 가운데"가 (0,0)이다.
// 그래서 pages.js 의 y 값이 곧 그 그림이 서 있는(떠 있는) 선이다.

// 장면 기준선 — 배치할 때 이 숫자만 쓰면 뜨지 않는다.
const LINE = {
  sea: 520,     // 앞바다 물높이 (고래로봇·배가 떠 있는 선)
  far: 318,     // 먼 바다 수평선 (멀리 있는 배)
  beach: 505,   // 섬 모래밭
};

// 모든 장면이 같이 쓰는 그라디언트
const DEFS = `
<defs>
  <linearGradient id="gWhale" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a9dcf5"/><stop offset="1" stop-color="#5fb3e0"/>
  </linearGradient>
  <linearGradient id="gWhaleSad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9fbccb"/><stop offset="1" stop-color="#6f93a8"/>
  </linearGradient>
  <linearGradient id="gPirate" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffc07a"/><stop offset="1" stop-color="#f08c3c"/>
  </linearGradient>
  <linearGradient id="gHull" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b8744a"/><stop offset="1" stop-color="#8a5234"/>
  </linearGradient>
  <linearGradient id="gSky" gradientUnits="userSpaceOnUse" x1="0" y1="-500" x2="0" y2="330">
    <stop offset="0" stop-color="#7cc8f5"/><stop offset="1" stop-color="#d4f1ff"/>
  </linearGradient>
  <radialGradient id="gSun" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#fff6b0"/><stop offset=".6" stop-color="#ffd84d"/><stop offset="1" stop-color="#ffd84d" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gGlow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#fffbd0"/><stop offset="1" stop-color="#ffd84d"/>
  </radialGradient>
</defs>`;

const ART = {
  // ── 고래로봇 ─────────────────────────────── 폭 ~340 · 높이 ~160 · 오른쪽을 봄 · 발 없음
  whale({ mood = 'happy' } = {}) {
    const sad = mood === 'sad', sleepy = mood === 'sleepy';
    const skin = sad ? 'url(#gWhaleSad)' : 'url(#gWhale)';
    const line = sad ? '#4f6f82' : '#3c86b5';
    let eye, mouth, extra = '';
    if (sleepy) {
      eye = `<path d="M72 -88 Q84 -78 96 -88" stroke="#24445a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="112" cy="-52" rx="5" ry="4" fill="#24445a"/>`;
    } else if (sad) {
      eye = `<circle cx="84" cy="-86" r="14" fill="#fff"/><circle cx="84" cy="-82" r="7" fill="#24445a"/>
             <path d="M68 -108 L98 -100" stroke="#24445a" stroke-width="4" stroke-linecap="round"/>`;
      mouth = `<path d="M100 -48 Q112 -60 124 -48" stroke="#24445a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      extra = `<path d="M80 -66 Q74 -52 80 -46 Q86 -52 80 -66Z" fill="#7ec8ff" class="a-drip"/>`;
    } else {
      eye = `<circle cx="84" cy="-86" r="14" fill="#fff"/><circle cx="86" cy="-86" r="7.5" fill="#24445a"/>
             <circle cx="89" cy="-89" r="2.6" fill="#fff"/>`;
      mouth = `<path d="M98 -58 Q112 -42 126 -58" stroke="#24445a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    return `
      <path d="M-112 -52 Q-150 -72 -176 -118 Q-150 -108 -138 -90 Q-164 -62 -192 -58 Q-152 -40 -116 -28Z"
            fill="${skin}" stroke="${line}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-122 -22 C-132 -92 -62 -142 20 -142 C92 -142 134 -102 134 -52 C134 -12 104 0 62 0 L-82 0 C-106 0 -120 -8 -122 -22Z"
            fill="${skin}" stroke="${line}" stroke-width="4"/>
      <path d="M-114 -16 Q10 -2 132 -40 C130 -10 102 0 62 0 L-82 0 C-100 0 -112 -6 -114 -16Z" fill="#eef8ff" opacity=".9"/>
      <path d="M-40 -138 Q-46 -80 -34 -20 M50 -136 Q58 -80 48 -12" stroke="${line}" stroke-width="2.5" fill="none" opacity=".45"/>
      <circle cx="-72" cy="-98" r="4" fill="#dfeff8" stroke="${line}" stroke-width="2"/>
      <circle cx="-2" cy="-124" r="4" fill="#dfeff8" stroke="${line}" stroke-width="2"/>
      <circle cx="-92" cy="-58" r="4" fill="#dfeff8" stroke="${line}" stroke-width="2"/>
      <circle cx="30" cy="-104" r="4" fill="#dfeff8" stroke="${line}" stroke-width="2"/>
      <rect x="16" y="-160" width="26" height="22" rx="6" fill="#d7e4ec" stroke="${line}" stroke-width="3"/>
      <line x1="29" y1="-160" x2="29" y2="-176" stroke="${line}" stroke-width="3"/>
      <circle cx="29" cy="-180" r="6" fill="${sad ? '#c9d3d9' : '#ff7a8a'}" stroke="${line}" stroke-width="2"/>
      <circle cx="4" cy="-48" r="15" fill="${sad ? '#cfd8c0' : 'url(#gGlow)'}" stroke="${line}" stroke-width="3"/>
      <g class="${sad ? '' : 'a-wave'}">
        <path d="M48 -34 Q66 -8 90 -12 Q84 -26 60 -40Z" fill="${skin}" stroke="${line}" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="92" cy="-12" r="6" fill="#d7e4ec" stroke="${line}" stroke-width="2.5"/>
      </g>
      ${eye}${mouth}${extra}
      ${sad ? '' : '<ellipse cx="108" cy="-70" rx="9" ry="6" fill="#ff9aa8" opacity=".6"/>'}`;
  },

  // ── 해적로봇 ─────────────────────────────── 높이 ~150 · 동글동글 주황 · 해골 대신 별
  pirate({ mood = 'happy', wave = false } = {}) {
    const worry = mood === 'worry';
    const brows = worry
      ? `<path d="M-24 -110 L-10 -116 M10 -116 L24 -110" stroke="#5a3a24" stroke-width="3.5" stroke-linecap="round"/>`
      : '';
    const mouth = worry
      ? `<ellipse cx="0" cy="-86" rx="6" ry="5" fill="#5a3a24"/>`
      : `<path d="M-11 -90 Q0 -78 11 -90" stroke="#5a3a24" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const armR = wave
      ? `<g class="a-hello"><path d="M30 -56 L50 -86" stroke="#c8691f" stroke-width="9" stroke-linecap="round"/><circle cx="52" cy="-90" r="8" fill="#ffd9a8" stroke="#c8691f" stroke-width="3"/></g>`
      : `<path d="M30 -52 L44 -30" stroke="#c8691f" stroke-width="9" stroke-linecap="round"/><circle cx="46" cy="-27" r="8" fill="#ffd9a8" stroke="#c8691f" stroke-width="3"/>`;
    return `
      <rect x="-22" y="-14" width="16" height="14" rx="5" fill="#3c4a5a"/>
      <rect x="6" y="-14" width="16" height="14" rx="5" fill="#3c4a5a"/>
      <rect x="-34" y="-72" width="68" height="62" rx="22" fill="url(#gPirate)" stroke="#c8691f" stroke-width="4"/>
      <path d="M-30 -40 H30" stroke="#fff" stroke-width="6" opacity=".7"/>
      <path d="M-30 -28 H30" stroke="#e25b4b" stroke-width="6" opacity=".7"/>
      <path d="M-30 -52 L-44 -30" stroke="#c8691f" stroke-width="9" stroke-linecap="round"/>
      <circle cx="-46" cy="-27" r="8" fill="#ffd9a8" stroke="#c8691f" stroke-width="3"/>
      ${armR}
      <rect x="-32" y="-128" width="64" height="54" rx="20" fill="#ffd9a8" stroke="#c8691f" stroke-width="4"/>
      <circle cx="-12" cy="-104" r="8" fill="#fff" stroke="#5a3a24" stroke-width="2"/>
      <circle cx="-11" cy="-103" r="4.5" fill="#5a3a24"/>
      <rect x="4" y="-112" width="22" height="16" rx="5" fill="#8a9aa8" stroke="#5a3a24" stroke-width="2.5"/>
      <circle cx="26" cy="-104" r="6" fill="#bfe6ff" stroke="#5a3a24" stroke-width="2.5"/>
      ${brows}${mouth}
      ${worry ? '' : '<ellipse cx="-22" cy="-88" rx="6" ry="4" fill="#ff8f8f" opacity=".5"/><ellipse cx="22" cy="-88" rx="6" ry="4" fill="#ff8f8f" opacity=".5"/>'}
      <path d="M-50 -126 Q0 -150 50 -126 Q40 -160 0 -164 Q-40 -160 -50 -126Z" fill="#2f3e57" stroke="#1d2838" stroke-width="3"/>
      <path d="M0 -158 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1Z" fill="#ffd84d"/>`;
  },

  // ── 배 ──────────────────────────────────── 폭 ~320 · 갑판 y=-84 · pirate 를 주면 갑판 위에 세움
  ship({ pirate = null } = {}) {
    const crew = pirate ? `<g transform="translate(-60 -80) scale(.8)">${ART.pirate(pirate)}</g>` : '';
    return `
      <line x1="30" y1="-84" x2="30" y2="-300" stroke="#6b3f25" stroke-width="8"/>
      <path d="M36 -290 Q120 -230 36 -130Z" fill="#fffaf0" stroke="#d8cbb2" stroke-width="3"/>
      <path d="M24 -280 Q-50 -220 24 -150Z" fill="#fffaf0" stroke="#d8cbb2" stroke-width="3"/>
      <path d="M62 -214 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1Z" fill="#ffc94d"/>
      <path d="M30 -300 L74 -290 L30 -278Z" fill="#e25b4b"/>
      ${crew}
      <path d="M-164 -96 L166 -96 L150 -28 Q140 0 110 0 L-110 0 Q-140 0 -150 -28Z"
            fill="url(#gHull)" stroke="#5e351f" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-164 -96 H166" stroke="#5e351f" stroke-width="7" stroke-linecap="round"/>
      <path d="M-156 -60 H158" stroke="#d99a4e" stroke-width="7"/>
      <circle cx="-90" cy="-34" r="11" fill="#bfe6ff" stroke="#5e351f" stroke-width="4"/>
      <circle cx="-30" cy="-34" r="11" fill="#bfe6ff" stroke="#5e351f" stroke-width="4"/>
      <circle cx="30" cy="-34" r="11" fill="#bfe6ff" stroke="#5e351f" stroke-width="4"/>
      <circle cx="90" cy="-34" r="11" fill="#bfe6ff" stroke="#5e351f" stroke-width="4"/>`;
  },

  // ── 갈매기 ───────────────────────────────── 날고 있는 모습 · (0,0)이 몸 가운데
  gull() {
    return `
      <g class="a-flap">
        <path d="M-6 -2 Q-26 -26 -50 -16 Q-30 -12 -12 6Z" fill="#fff" stroke="#8a9aa8" stroke-width="2.5"/>
        <path d="M6 -2 Q26 -26 50 -16 Q30 -12 12 6Z" fill="#fff" stroke="#8a9aa8" stroke-width="2.5"/>
      </g>
      <ellipse cx="0" cy="4" rx="22" ry="11" fill="#fff" stroke="#8a9aa8" stroke-width="2.5"/>
      <circle cx="16" cy="-2" r="9" fill="#fff" stroke="#8a9aa8" stroke-width="2.5"/>
      <circle cx="19" cy="-4" r="2.4" fill="#33424f"/>
      <path d="M24 0 L34 2 L24 5Z" fill="#ffb13b"/>`;
  },

  // ── 작은 것들 ─────────────────────────────
  sun() {
    return `<circle r="110" fill="url(#gSun)"/><circle r="46" fill="#ffe066"/>`;
  },
  cloud({ letter = '', tone = '#fff' } = {}) {
    return `
      <path d="M-70 0 Q-92 0 -90 -22 Q-88 -44 -62 -42 Q-56 -72 -22 -70 Q2 -92 34 -74 Q66 -76 70 -46 Q94 -42 90 -18 Q86 0 64 0Z"
            fill="${tone}" stroke="#c7d6e3" stroke-width="3"/>
      ${letter ? `<text x="0" y="-22" text-anchor="middle" font-size="44" font-weight="900" fill="#3c86b5">${letter}</text>` : ''}`;
  },
  palm() {
    return `
      <path d="M0 0 Q-6 -80 18 -170" stroke="#9a6a3c" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M18 -170 Q-40 -196 -86 -150 Q-40 -170 18 -170Z" fill="#3fae6a"/>
      <path d="M18 -170 Q70 -200 116 -150 Q70 -170 18 -170Z" fill="#3fae6a"/>
      <path d="M18 -170 Q-10 -230 -60 -222 Q-14 -206 18 -170Z" fill="#4fc27a"/>
      <path d="M18 -170 Q50 -230 96 -216 Q52 -204 18 -170Z" fill="#4fc27a"/>
      <circle cx="10" cy="-164" r="8" fill="#8a5a2c"/><circle cx="26" cy="-162" r="8" fill="#8a5a2c"/>`;
  },
  heart() {
    return `<path d="M0 0 C-30 -20 -30 -46 -12 -46 Q-2 -46 0 -34 Q2 -46 12 -46 C30 -46 30 -20 0 0Z" fill="#ff7a8a"/>`;
  },
};

// ── 배경 ─────────────────────────────────────
// back: 인물 뒤에 그림 / front: 인물 앞에 그리는 물결(고래·배가 물에 잠겨 보이게)
const WAVES = (y, c1, c2) => {
  let a = `M-800 ${y}`, b = `M-800 ${y + 34}`;
  for (let x = -800; x < 1600; x += 100) a += ` Q${x + 50} ${y - 14} ${x + 100} ${y}`;
  for (let x = -800; x < 1600; x += 120) b += ` Q${x + 60} ${y + 22} ${x + 120} ${y + 34}`;
  return `<path d="${a} V700 H-800Z" fill="${c1}" opacity=".92"/><path d="${b} V700 H-800Z" fill="${c2}"/>`;
};

const BG = {
  island: {
    back: `
      <rect x="-800" y="-900" width="2400" height="1500" fill="url(#gSky)"/>
      <g transform="translate(120 100)">${ART.sun()}</g>
      <g transform="translate(560 120) scale(.7)" opacity=".9">${ART.cloud()}</g>
      <rect x="-800" y="${LINE.far}" width="2400" height="${700 - LINE.far}" fill="#4fb6e8"/>
      <path d="M-800 ${LINE.far} H1600" stroke="#e8f7ff" stroke-width="3" opacity=".7"/>
      <path d="M-800 700 L-800 440 Q-300 400 -20 420 Q60 380 170 392 Q260 400 330 470 Q360 520 340 700Z" fill="#f6dd9c"/>
      <path d="M-20 430 Q80 395 170 404 Q250 412 316 470" stroke="#fff4d0" stroke-width="10" fill="none" opacity=".7"/>
      <g transform="translate(120 420)">${ART.palm()}</g>
      <circle cx="220" cy="470" r="9" fill="#ff9aa8"/><circle cx="250" cy="500" r="7" fill="#fff"/>`,
    front: `
      <path d="M330 700 L330 600 Q400 540 480 548 T640 540 T800 548 T960 540 T1120 548 T1280 540 V700Z" fill="#3aa3d8" opacity=".95"/>
      <path d="M340 586 Q420 568 500 578 T660 572 T820 580 T980 572 T1140 580 T1300 572" stroke="#e8f7ff" stroke-width="4" fill="none" opacity=".7"/>`,
  },
  sea: {
    back: `
      <rect x="-800" y="-900" width="2400" height="1500" fill="url(#gSky)"/>
      <g transform="translate(680 90) scale(.8)">${ART.sun()}</g>
      <g transform="translate(200 110) scale(.6)" opacity=".9">${ART.cloud()}</g>
      <g transform="translate(470 70) scale(.45)" opacity=".8">${ART.cloud()}</g>
      <rect x="-800" y="${LINE.far}" width="2400" height="${700 - LINE.far}" fill="#4fb6e8"/>
      <path d="M-800 ${LINE.far} H1600" stroke="#e8f7ff" stroke-width="3" opacity=".7"/>
      <path d="M40 ${LINE.far} q20 -26 50 -24 q34 2 46 24Z" fill="#6cc48a"/>`,
    front: WAVES(LINE.sea - 6, '#3aa3d8', '#2e8fc2'),
  },
};
