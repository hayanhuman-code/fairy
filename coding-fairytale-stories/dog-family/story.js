/* =====================================================================
   "보리와 두두" — 강아지 네 마리의 비 오는 날 (SPEC.md 참고)

   ★ 분기 없는 한 줄기 이야기. 고르게 하지 않는다.
     예전에는 '바다냐 우주냐'로 갈라져서 한 번에 아홉 장면밖에 못 봤다.
     이제 바다도 우주도 다 지나간다 — 아이는 늘 이야기 전부를 본다.

   ★ 이야기가 본체다. 미니게임 셋(네모 배 짓기 · 나 자 쓰기 · 사과 세기)은
     이야기 사이에 끼는 짧은 놀이지, 이야기를 멈춰 세우는 과제가 아니다.

   ★ 받침 규칙: 화면에 보이는 모든 한국어(title·subtitle·narration·
     doneSay·itemLabel·word)는 받침 없는 글자만 쓴다.
     쓸 수 없어 돌아간 말: 마당→나무 아래, 벽돌→네모, 거실→여기,
     집→자리, 시무룩→두 귀가 아래로 처져요, 커다란→"아주 커다래요"(문장을 쪼갬),
     별·달·하늘·구름·아침·조용히·가만히, 조사 은/는/을/를, 과거형 전부.
     음성 전용(say·tryAgainSay·countSay)과 parentPrompt는 자유.
   ===================================================================== */
const CALM = "audio/bgm_lullaby.mp3";
const PLAY = "audio/bgm_velvet.mp3";
const END  = "audio/bgm_lullaby2.mp3";

/* ---------- 이야기 전용 그림 (engine.js 무수정 — write-game.js가 ART에 설치) ---------- */
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

/* ---------- 이야기 (분기 없는 한 줄기 · 장면 16개) ---------- */
const STORY = {
  title: "보리와 두두",
  subtitle: "우리 배 타고 가자",
  hero: "dogBori", heroMood: "happy",
  branchPoint: null,   /* 분기 없음 — 엔딩의 '다르게 가 보자' 버튼도 나오지 않는다 */

  scenes: [
    /* ── 1막. 비 오는 날 ───────────────────────────────── */

    /* 1. 나무 아래 그네 */
    { id: "intro", type: "narrative", bg: "bgHouseDone", bgm: CALM, holdMs: 3200,
      /* 강아지 그림은 120px 기준이라(엔진의 wolf는 260px) y를 작게 주면 하늘에 뜬다.
         발이 땅에 닿아 보이는 자리는 대체로 y 46~62% 사이다. */
      actors: [
        { art: "dogBori", x: "55%", y: "35%", scale: .8, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "보리예요! 그네가 하늘까지 올라가요!", sfx: "blip" } },
        { art: "dogDudu", x: "40%", y: "60%", scale: .65, mood: "happy",
          tap: { action: "shake", say: "두두예요! 언니, 나도 나도!", sfx: "blip" } }
      ],
      /* 소품 크기는 px 고정이라 x를 더 오른쪽에 두면 폰 세로에서 화면 밖으로 잘린다. */
      props: [ { art: "swing", x: "50%", y: "24%", size: 180 } ],
      narration: "보리와 두두가 나무 아래에서 그네 타요. 해가 나와서 매우 재미나요. 야호!",
      parentPrompt: "아이에게: 그네를 타면 기분이 어때요? 누구랑 같이 타고 싶어요?",
      next: "rain" },

    /* 2. 비가 와요 — 두두가 풀이 죽는다 */
    { id: "rain", type: "narrative", bg: "bgLiving", bgm: CALM, holdMs: 3400,
      actors: [
        { art: "dogDudu", x: "20%", y: "60%", scale: .65, mood: "sad",
          tap: { action: "shake", say: "두두: 그네 타고 싶은데... 비가 안 그쳐요.", sfx: "whimper" } },
        { art: "dogBori", x: "68%", y: "54%", scale: .8, mood: "happy",
          tap: { action: "cheer", say: "보리: 두두야, 괜찮아. 우리 다른 놀이 하자!", sfx: "blip" } }
      ],
      narration: "그러다가 비가 주루루 와요. 이제 그네 타러 가기가 어려워요. 두두 두 귀가 아래로 처져요.",
      parentPrompt: "아이에게: 두두는 지금 기분이 어떨까요? 우리는 속상할 때 어떻게 하면 좋을까요?",
      next: "idea" },

    /* 3. 코코가 네모를 가지고 온다 */
    { id: "idea", type: "narrative", bg: "bgAttic", bgm: CALM, holdMs: 3400,
      actors: [
        { art: "dogCoco", x: "50%", y: "46%", scale: 1.15, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "코코: 비 오는 날에는 집이 바다가 될 수도 있단다!", sfx: "blip" } },
        { art: "dogDudu", x: "34%", y: "58%", scale: .65, mood: "happy",
          tap: { action: "shake", say: "두두: 우와! 이게 다 뭐예요?", sfx: "blip" } },
        { art: "dogBori", x: "62%", y: "52%", scale: .8, mood: "happy" }
      ],
      /* 배경에 이미 네모가 쌓여 있으니, 앞에는 코코가 내미는 하나만 둔다 */
      props: [ { art: "brick", x: "42%", y: "62%", size: 105 } ],
      narration: "코코가 네모 가지고 와요. 우리 이 네모로 배 지어 보자! 두두 귀가 다시 서요.",
      parentPrompt: "아이에게: 아빠 코코가 뭘 가져왔을까요? 이걸로 무엇을 만들 수 있을까요?",
      next: "build" },

    /* 4. [미니게임 · 짓기] 네모 5개로 배 짓기 */
    { id: "build", type: "minigame", game: "build", bg: "bgRoom", bgm: PLAY,
      slots: 5, itemLabel: "네모", loopHint: true,
      char: "dogCoco", charMood: "happy",
      props: [ { art: "boat", x: "58%", y: "28%", size: 130 } ],
      countSay: "하나, 둘, 셋, 넷, 다섯! 차곡차곡 쌓아요.",
      narration: "네모 하나 하나 모아 배 지어요! 5 개 다 채워 보자",
      doneSay: "우와! 우리 배가 다 되어요!",
      parentPrompt: "아이에게: 블록을 몇 개 쌓았어요? 같이 세어 볼까요?",
      next: "sail" },

    /* 5. 배가 커진다 — 모모도 타고, 여기가 바다가 된다 */
    { id: "sail", type: "narrative", bg: "bgLiving", bgm: PLAY, holdMs: 3400,
      actors: [
        { art: "dogBori", x: "25%", y: "41%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "44%", y: "43%", scale: .65, mood: "happy", anim: "anim-bob" },
        { art: "dogMomo", x: "60%", y: "52%", scale: 1.05, mood: "happy",
          tap: { action: "cheer", say: "모모: 나도 태워 줘! 간식도 챙겨 왔단다.", sfx: "blip" } },
        { art: "dogCoco", x: "78%", y: "50%", scale: 1.15, mood: "happy" }
      ],
      /* 자매가 갑판 위에 서 보이도록 배를 키우고 돛대를 피해 세운다 */
      props: [ { art: "boat", x: "24%", y: "34%", size: 300 } ],
      narration: "배가 커져요. 커져요. 아주 커다래요! 모모도 배에 타요. 여기가 바다가 되어요!",
      parentPrompt: "아이에게: 우리 집에서 배를 타면 어디로 가고 싶어요?",
      next: "sea" },

    /* ── 2막. 바다 ─────────────────────────────────────── */

    /* 6. 바다 */
    { id: "sea", type: "narrative", bg: "bgSea", bgm: PLAY, holdMs: 3400,
      actors: [
        { art: "dogCoco", x: "42%", y: "46%", scale: 1.15, mood: "happy" },
        { art: "dogBori", x: "14%", y: "54%", scale: .8, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "보리: 파도가 배를 살랑살랑 흔들어요!", sfx: "blip" } },
        { art: "dogDudu", x: "28%", y: "60%", scale: .65, mood: "happy" },
        { art: "dogMomo", x: "62%", y: "50%", scale: 1.05, mood: "happy" }
      ],
      props: [ { art: "boat", x: "1%", y: "58%", size: 160 } ],
      narration: "우와, 바다예요! 파도가 배 아래에서 차르르 노래해요. 두두 코에 바다가 스쳐요.",
      parentPrompt: "아이에게: 바다는 무슨 색일까요? 파도 소리를 같이 내볼까요?",
      next: "island" },

    /* 7. 고래가 배를 업어 준다 */
    { id: "island", type: "narrative", bg: "bgIsland", bgm: PLAY, holdMs: 3600,
      actors: [
        { art: "dogBori", x: "26%", y: "36%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "38%", y: "42%", scale: .65, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "두두: 고래야, 등이 미끄러워! 히히!", sfx: "blip" } },
        { art: "dogCoco", x: "74%", y: "48%", scale: 1.15, mood: "happy" },
        { art: "dogMomo", x: "88%", y: "52%", scale: 1.05, mood: "happy" }
      ],
      /* 고래 등에 배를 얹는다 — 자막이 "배 어부바"라고 말하는데 배가 없으면 안 맞는다 */
      props: [ { art: "whale", x: "22%", y: "52%", size: 250 },
               { art: "boat", x: "26%", y: "40%", size: 140 } ],
      narration: "저기 고래가 와요. 아주 커다래요! 고래가 우리 배 어부바 해 주어요. 고래야, 고마워!",
      parentPrompt: "아이에게: 고래는 얼마나 클까요? 팔을 벌려서 표현해 볼까요?",
      next: "snack" },

    /* 8. [미니게임 · 쓰기] 차가운 나라 — 배고픈 두두에게 바나나.
       '바나나' 가운데 한 글자만 쓴다. 이야기가 멈추지 않게. */
    { id: "snack", type: "minigame", game: "write", bg: "bgSnow", bgm: PLAY,
      word: "바나나", writeIndex: 1,
      char: "dogDudu", charMood: "sad",
      /* 배는 오른쪽 아래로 — 위에 두면 자막 띠에 가린다 */
      props: [ { art: "banana", x: "4%", y: "60%", size: 120 },
               { art: "boat", x: "84%", y: "62%", size: 120 } ],
      narration: "여기 차가워요. 두두가 배가 고파요. 여기 나 하고 써 주세요!",
      doneSay: "우와, 바나나예요! 두두가 고마워요!",
      parentPrompt: "아이에게: '바나나'를 손가락으로 같이 짚어볼까요? 가운데 글자가 무엇이지요?",
      next: "night" },

    /* ── 3막. 밤과 우주 ────────────────────────────────── */

    /* 9. 어두워진다 — 모모의 노래 */
    { id: "night", type: "narrative", bg: "bgNight", bgm: CALM, holdMs: 3400,
      actors: [
        { art: "dogMomo", x: "40%", y: "46%", scale: 1.05, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "모모: 라라라— 우리 아기 잘도 자지.", sfx: "blip" } },
        { art: "dogBori", x: "26%", y: "54%", scale: .8, mood: "happy" },
        { art: "dogDudu", x: "54%", y: "58%", scale: .65, mood: "happy" },
        { art: "dogCoco", x: "74%", y: "48%", scale: 1.15, mood: "happy" }
      ],
      props: [ { art: "boat", x: "6%", y: "50%", size: 180 } ],
      narration: "이제 어두워요. 배가 스르르 가요. 모모가 노래해요. 라라라.",
      parentPrompt: "아이에게: 밤이 되면 무엇이 보일까요? 우리도 자장가를 불러볼까요?",
      next: "space" },

    /* 10. 배가 로케트가 된다 */
    { id: "space", type: "narrative", bg: "bgSpace", bgm: PLAY, holdMs: 3400,
      actors: [
        { art: "dogBori", x: "28%", y: "40%", scale: .8, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "보리: 우리 배가 로케트가 됐어요! 슈우우!", sfx: "blip" } },
        { art: "dogDudu", x: "45%", y: "48%", scale: .65, mood: "happy", anim: "anim-bob" },
        { art: "dogCoco", x: "62%", y: "44%", scale: 1.15, mood: "happy" },
        { art: "dogMomo", x: "78%", y: "42%", scale: 1.05, mood: "happy" }
      ],
      /* 배는 왼쪽 끝으로. 가운데 두면 돛대가 보리를 꿰뚫고 지나간다. */
      props: [ { art: "boat", x: "3%", y: "48%", size: 200 } ],
      narration: "우와! 배가 로케트가 되어요. 슈우우! 우리가 우주로 가요!",
      parentPrompt: "아이에게: 우주에는 무엇이 떠다닐까요? 로켓 소리를 같이 내볼까요?",
      next: "castle" },

    /* 11. [미니게임 · 셈] 우주 너머 사과나무 (4 + 1) */
    { id: "castle", type: "minigame", game: "math", bg: "bgCastle", bgm: PLAY,
      a: 4, b: 1, op: "+", icon: "apple",
      showWolf: true, char: "dogCoco", charMood: "happy",
      props: [ { art: "bigtree", x: "2%", y: "6%", size: 230 } ],
      narration: "우주 저 너머에 사과 나무예요! 코코와 사과 따요. 모두 세어 보자",
      tryAgainSay: "천천히 다시 세어볼까요? 넷에 하나를 더하면?",
      doneSay: "우와! 사과가 모두 5 개예요!",
      parentPrompt: "아이에게: 사과 네 개에 한 개가 더 오면 몇 개일까요? 손가락으로 같이!",
      next: "home" },

    /* ── 4막. 돌아오는 길 ──────────────────────────────── */

    /* 12. 노을 — 자리로 */
    { id: "home", type: "narrative", bg: "bgSunset", bgm: CALM, holdMs: 3400,
      actors: [
        { art: "dogBori", x: "30%", y: "50%", scale: .8, mood: "happy" },
        { art: "dogDudu", x: "46%", y: "56%", scale: .65, mood: "happy" },
        { art: "dogMomo", x: "62%", y: "48%", scale: 1.05, mood: "happy" },
        { art: "dogCoco", x: "78%", y: "46%", scale: 1.15, mood: "happy" }
      ],
      props: [ { art: "boat", x: "4%", y: "50%", size: 185 } ],
      narration: "이제 우리 자리로 가요. 해가 바다 아래로 가요. 하루가 다 가요.",
      parentPrompt: "아이에게: 오늘 배를 타고 어디어디에 갔었지요? 같이 떠올려 볼까요?",
      next: "dry" },

    /* 13. 비가 그치고 무지개 */
    { id: "dry", type: "narrative", bg: "bgLiving", bgm: CALM, holdMs: 3400,
      actors: [
        { art: "dogDudu", x: "24%", y: "58%", scale: .65, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "두두: 무지개다! 빨강 주황 노랑...", sfx: "blip" } },
        { art: "dogBori", x: "40%", y: "52%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogMomo", x: "62%", y: "48%", scale: 1.05, mood: "happy" },
        { art: "dogCoco", x: "80%", y: "46%", scale: 1.15, mood: "happy" }
      ],
      props: [ { art: "rainbow", x: "6%", y: "16%", size: 250 } ],
      narration: "어느새 비가 그쳐요. 저기 무지개가 떠요! 우리 다시 나가 보자.",
      parentPrompt: "아이에게: 무지개는 무슨 색이 있을까요? 몇 개나 보여요?",
      next: "song" },

    /* 14. 마당에서 다 같이 노래 */
    { id: "song", type: "narrative", bg: "bgPlay", bgm: PLAY, holdMs: 3600,
      actors: [
        { art: "dogCoco", x: "62%", y: "46%", scale: 1.15, mood: "happy", anim: "anim-bob" },
        { art: "dogMomo", x: "42%", y: "48%", scale: 1.05, mood: "happy", anim: "anim-bob" },
        { art: "dogBori", x: "12%", y: "54%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "28%", y: "60%", scale: .65, mood: "happy", anim: "anim-bob" }
      ],
      props: [ { art: "swing", x: "80%", y: "38%", size: 150 } ],
      narration: "보리와 두두와 모모와 코코가 다 모여요. 라라라 노래해요. 우리 노래가 나무 위로 가요. 야호!",
      parentPrompt: "아이에게: 우리도 같이 한 곡 불러볼까요? 어떤 노래가 좋아요?",
      next: "bed" },

    /* 15. 코코의 이야기 */
    { id: "bed", type: "narrative", bg: "bgRoom", bgm: END, holdMs: 3400,
      actors: [
        { art: "dogCoco", x: "56%", y: "46%", scale: 1.15, mood: "happy",
          tap: { action: "cheer", say: "코코: 옛날 옛날에, 배를 타고 바다로 간 강아지가 있었어요...", sfx: "blip" } },
        { art: "dogBori", x: "16%", y: "54%", scale: .8, mood: "happy" },
        { art: "dogDudu", x: "32%", y: "60%", scale: .65, mood: "happy" },
        { art: "dogMomo", x: "76%", y: "48%", scale: 1.05, mood: "happy" }
      ],
      narration: "이제 자리에 누워요. 코코가 이야기 해 주어요. 오래오래 재미나요.",
      parentPrompt: "아이에게: 아빠가 자기 전에 어떤 이야기를 해주면 좋겠어요?",
      next: "sleep" },

    /* 16. 끝 — 다 자요 */
    { id: "sleep", type: "narrative", bg: "bgNight", bgm: END, holdMs: 3600,
      actors: [
        { art: "dogCoco", x: "56%", y: "46%", scale: 1.15, mood: "happy" },
        { art: "dogMomo", x: "74%", y: "48%", scale: 1.05, mood: "happy" },
        { art: "dogBori", x: "16%", y: "54%", scale: .8, mood: "happy" },
        { art: "dogDudu", x: "32%", y: "60%", scale: .65, mood: "happy" }
      ],
      props: [ { art: "nest", x: "3%", y: "62%", size: 140 }, { art: "boat", x: "84%", y: "60%", size: 120 } ],
      narration: "보리와 두두가 스르르 코 자요. 우리 배도 자요. 우리 또 가자!",
      parentPrompt: "아이에게: 내일은 배를 타고 어디로 떠나 볼까요? 잘 자요!",
      next: null }
  ]
};
window.STORY = STORY;
