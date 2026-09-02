/* =====================================================================
   이야기 전용 그림 (story-art.js) — 강아지 가족 · 소품 · 배경.
   art.js(엔진에서 떼어 온 기본 그림) 뒤에 올려 ART 에 합쳐 쓴다.
   ===================================================================== */
window.EXTRA_ART = (function () {
  let uid = 0; const gid = p => p + "x" + (++uid);

  /* 강아지 가족 — 엔진 dog 화풍을 따르되 색을 바꾸고 표정(happy/sad)을 더함.
     네 마리가 한 화면에 서니 색과 크기(scale)로 서로 구별되게 했다. */
  function dogArt(key, c) {
    return (s = 120, mood = "happy") => {
      const g = gid(key);
      return `<svg data-asset="${key}" viewBox="0 0 140 150" width="${s}" height="${s * 1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="${c.hi}"/><stop offset="1" stop-color="${c.lo}"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="44" ry="9" fill="#000" opacity=".07"/>
    <ellipse cx="70" cy="106" rx="42" ry="36" fill="url(#${g})"/>
    <circle cx="70" cy="72" r="38" fill="url(#${g})"/>
    <ellipse cx="34" cy="74" rx="14" ry="27" fill="${c.ear}"/><ellipse cx="106" cy="74" rx="14" ry="27" fill="${c.ear}"/>
    <ellipse cx="70" cy="88" rx="20" ry="15" fill="${c.muzzle}"/>
    <ellipse cx="70" cy="80" rx="7" ry="5" fill="#5a4636"/>
    <circle cx="57" cy="68" r="5.2" fill="#5b4636"/><circle cx="83" cy="68" r="5.2" fill="#5b4636"/>
    <circle cx="59" cy="66" r="1.7" fill="#fff"/><circle cx="85" cy="66" r="1.7" fill="#fff"/>
    ${mood === "sad"
      ? `<path d="M62 95 Q70 88 78 95" stroke="#7a5a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
         <ellipse cx="55" cy="80" rx="3" ry="5" fill="#9ad2f0"/>
         <path d="M49 62 Q55 59 60 62" stroke="#8a6b4f" stroke-width="2" fill="none" stroke-linecap="round"/>
         <path d="M80 62 Q85 59 91 62" stroke="#8a6b4f" stroke-width="2" fill="none" stroke-linecap="round"/>`
      : `<path d="M61 88 Q70 98 79 88" stroke="#7a5a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
         <path d="M70 92 Q70 99 65 100" stroke="#e8837a" stroke-width="3" fill="none" stroke-linecap="round"/>`}
    <circle cx="48" cy="80" r="6" fill="${c.cheek}" opacity=".55"/><circle cx="92" cy="80" r="6" fill="${c.cheek}" opacity=".55"/>
    ${c.extra || ""}
  </svg>`;
    };
  }

  return {
    /* 보리(언니·주인공) — 노랑 + 머리 리본 */
    dogBori: dogArt("dogBori", { hi: "#fbe9b7", lo: "#eec871", ear: "#d9a94e", muzzle: "#fdf6e3", cheek: "#f0a06a",
      extra: `<path d="M56 38 L70 30 L84 38 L70 46 Z" fill="#f6a5bd" opacity=".9"/><circle cx="70" cy="38" r="4" fill="#e98ba0"/>` }),
    /* 두두(동생) — 하양 + 갈색 귀, 몸에 갈색 점 */
    dogDudu: dogArt("dogDudu", { hi: "#ffffff", lo: "#efe6d8", ear: "#b98a55", muzzle: "#fbf4e8", cheek: "#f0b0a0",
      extra: `<circle cx="88" cy="98" r="9" fill="#c9a06a" opacity=".8"/>` }),
    /* 모모(엄마) — 크림 */
    dogMomo: dogArt("dogMomo", { hi: "#fdf3e2", lo: "#ecd7b4", ear: "#d0b184", muzzle: "#fffaf0", cheek: "#eda487" }),
    /* 코코(아빠) — 갈색 */
    dogCoco: dogArt("dogCoco", { hi: "#e3c49a", lo: "#c09263", ear: "#8f6238", muzzle: "#f2e3cb", cheek: "#d9926a" }),

    /* ---- 소품 ---- */
    /* 바나나 — 두두의 간식 */
    banana: (s = 110) => { const g = gid("bnn"); return `<svg data-asset="banana" viewBox="0 0 120 100" width="${s}" height="${s * 0.83}">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#f2c94c"/></linearGradient></defs>
      <ellipse cx="60" cy="90" rx="34" ry="6" fill="#000" opacity=".07"/>
      <path d="M22 34 C30 66 58 84 92 78 C98 77 102 82 96 85 C58 98 20 74 12 38 C11 30 20 28 22 34 Z" fill="url(#${g})" stroke="#d9a92e" stroke-width="3"/>
      <rect x="10" y="27" width="12" height="10" rx="3" fill="#8f6238"/>
      <path d="M30 42 C38 62 56 74 78 74" stroke="#fff3c0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    </svg>`; },

    /* 네모로 지은 배 — 아이가 build로 만든 그 배가 이야기 내내 따라다닌다 */
    boat: (s = 200) => { const g = gid("bt"); return `<svg data-asset="boat" viewBox="0 0 220 190" width="${s}" height="${s * 0.86}">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ec9a6e"/><stop offset="1" stop-color="#d4794b"/></linearGradient></defs>
      <ellipse cx="110" cy="180" rx="80" ry="8" fill="#000" opacity=".07"/>
      <path d="M30 120 L190 120 L164 168 L56 168 Z" fill="url(#${g})" stroke="#b8623a" stroke-width="4"/>
      <line x1="66" y1="144" x2="156" y2="144" stroke="#bd6b41" stroke-width="3"/>
      <line x1="90" y1="120" x2="86" y2="168" stroke="#bd6b41" stroke-width="3"/>
      <line x1="134" y1="120" x2="132" y2="168" stroke="#bd6b41" stroke-width="3"/>
      <line x1="110" y1="120" x2="110" y2="26" stroke="#8a5a3a" stroke-width="6" stroke-linecap="round"/>
      <path d="M116 32 Q168 58 116 96 Z" fill="#fff6de" stroke="#e8d5ae" stroke-width="3"/>
      <path d="M104 40 Q66 62 104 90 Z" fill="#ffe9c4" stroke="#e8d5ae" stroke-width="3"/>
      <path d="M104 22 l4 8 l8 2 l-8 3 l-4 8 l-4 -8 l-8 -3 l8 -2 Z" fill="#ffe08a"/>
    </svg>`; },

    /* 고래 — 바다에서 만나 배를 업어 주는 친구 */
    whale: (s = 200) => { const g = gid("wh"); return `<svg data-asset="whale" viewBox="0 0 240 150" width="${s}" height="${s * 0.63}">
      <defs><radialGradient id="${g}" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#9fd8ee"/><stop offset="1" stop-color="#5fa8ce"/></radialGradient></defs>
      <path d="M196 60 q22 -30 34 -22 q6 26 -12 42 Z" fill="#7cc0dd"/>
      <path d="M28 92 C36 50 96 34 148 48 C186 58 202 78 200 96 C198 114 160 128 112 128 C64 128 26 118 28 92 Z" fill="url(#${g})"/>
      <path d="M56 112 C92 128 152 128 194 106 C176 124 130 136 96 132 C76 130 62 122 56 112 Z" fill="#f0f8fc" opacity=".85"/>
      <circle cx="70" cy="82" r="6" fill="#3c5a68"/><circle cx="72.5" cy="79.5" r="2" fill="#fff"/>
      <path d="M44 96 q10 8 22 6" stroke="#3c5a68" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M120 44 q6 -22 -6 -34" stroke="#bfe6f4" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="112" cy="8" r="7" fill="#cfeefb"/><circle cx="128" cy="18" r="5" fill="#cfeefb"/>
    </svg>`; },

    /* 무지개 — 비가 그친 뒤 */
    rainbow: (s = 240) => `<svg data-asset="rainbow" viewBox="0 0 240 130" width="${s}" height="${s * 0.54}">
      ${[['#f08a7a', 0], ['#f6b56b', 14], ['#f5dd7a', 28], ['#9ed69a', 42], ['#8fc4e8', 56], ['#b6a8de', 70]]
        .map(([c, o]) => `<path d="M${14 + o} 126 A${106 - o} ${106 - o} 0 0 1 ${226 - o} 126" stroke="${c}" stroke-width="13" fill="none" stroke-linecap="round"/>`).join("")}
    </svg>`,

    /* ---- 배경 (엔진 _bg 화풍 그대로) ---- */
    /* 여기(집 안) — 창밖에 비가 내린다 */
    bgLiving: () => ART._bg('#fbe6cf', '#fdf3e6', '#e0c39c',
      `<rect x="70" y="90" width="250" height="200" rx="14" fill="#cfe6f2" stroke="#c79b6c" stroke-width="10"/>
       <line x1="195" y1="90" x2="195" y2="290" stroke="#c79b6c" stroke-width="8"/>
       <line x1="70" y1="190" x2="320" y2="190" stroke="#c79b6c" stroke-width="8"/>
       ${[100, 140, 180, 230, 270, 300].map((x, i) =>
         `<line x1="${x}" y1="${110 + i * 12}" x2="${x - 14}" y2="${150 + i * 12}" stroke="#8fc4dd" stroke-width="5" stroke-linecap="round"/>`).join("")}
       <rect x="430" y="300" width="300" height="120" rx="26" fill="#e8a07a" stroke="#cf7f56" stroke-width="6"/>
       <rect x="452" y="256" width="110" height="60" rx="18" fill="#f2bd9a"/>
       <rect x="596" y="256" width="110" height="60" rx="18" fill="#f2bd9a"/>
       <ellipse cx="400" cy="500" rx="230" ry="42" fill="#d9b98f" opacity=".55"/>`),

    /* 놀이방 — 네모가 흩어져 있는 바닥 */
    bgRoom: () => ART._bg('#e9e2f4', '#f5f1fb', '#e2d3b8',
      `<rect x="60" y="150" width="180" height="230" rx="16" fill="#d9c9a8" stroke="#bda87f" stroke-width="6"/>
       <line x1="60" y1="228" x2="240" y2="228" stroke="#bda87f" stroke-width="6"/>
       <line x1="60" y1="304" x2="240" y2="304" stroke="#bda87f" stroke-width="6"/>
       ${[[86, 180, '#f6a96b'], [140, 180, '#9ad2f0'], [196, 258, '#f2c94c'], [92, 258, '#a9dcae'], [150, 334, '#f0a8c0']]
         .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="42" height="34" rx="8" fill="${c}"/>`).join("")}
       <path d="M560 190 L640 130 L720 190 Z" fill="#f0b7c8"/>
       <rect x="576" y="188" width="128" height="96" rx="12" fill="#fdf3e6" stroke="#e3c3a3" stroke-width="5"/>
       ${[[330, 470], [420, 500], [510, 462]].map(([x, y]) =>
         `<rect x="${x}" y="${y}" width="54" height="42" rx="10" fill="#ec9a6e" stroke="#b8623a" stroke-width="4"/>`).join("")}`),

    /* 네모가 쌓인 곳 — 코코가 배 지을 네모를 꺼내 오는 자리 */
    bgAttic: () => ART._bg('#efe0cb', '#f8efe1', '#d8bf9a',
      `<g stroke="#c2a179" stroke-width="12" stroke-linecap="round">
         <line x1="0" y1="120" x2="800" y2="120"/><line x1="150" y1="120" x2="150" y2="0"/><line x1="650" y1="120" x2="650" y2="0"/>
       </g>
       <circle cx="400" cy="70" r="46" fill="#fdf0cf" stroke="#d8bf9a" stroke-width="7"/>
       <line x1="400" y1="24" x2="400" y2="116" stroke="#d8bf9a" stroke-width="6"/>
       ${[[70, 338, '#ec9a6e'], [70, 404, '#f2c94c'], [148, 404, '#9ad2f0'], [640, 338, '#a9dcae'], [640, 404, '#f0a8c0'], [718, 404, '#ec9a6e']]
         .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="72" height="66" rx="12" fill="${c}" stroke="#00000018" stroke-width="4"/>`).join("")}
       <ellipse cx="400" cy="520" rx="300" ry="50" fill="#c9ab84" opacity=".45"/>`),

    /* 바다 위 작은 섬 — 고래를 만나는 자리 */
    bgIsland: () => ART._bg('#cdeaf2', '#e6f5f9', '#7fc6e0',
      `<circle cx="140" cy="104" r="58" fill="#fff3c4"/>
       <g><rect x="588" y="300" width="20" height="130" rx="8" fill="#c39b6e"/>
         ${[[-1, -18], [1, -18], [-1, 16], [1, 16]].map(([d, o]) =>
           `<path d="M598 306 q${d * 86} ${o - 26} ${d * 116} ${o + 24} q${-d * 60} ${-o - 44} ${-d * 116} ${-o + 2} Z" fill="#8fcf8a"/>`).join("")}
         <circle cx="598" cy="300" r="13" fill="#7ab877"/></g>
       <ellipse cx="600" cy="440" rx="180" ry="42" fill="#f1e0b0"/>
       <path d="M0 452 Q400 424 800 452 L800 600 L0 600 Z" fill="#7fc6e0"/>
       <path d="M0 470 Q400 442 800 470" stroke="#bfe6f4" stroke-width="7" fill="none"/>
       <path d="M0 528 Q200 512 400 528 T800 528" stroke="#a9def0" stroke-width="6" fill="none"/>`)
  };
})();
