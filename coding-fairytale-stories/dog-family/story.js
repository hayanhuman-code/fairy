/* =====================================================================
   "보리와 두두" — 강아지 네 마리의 비 오는 날 (SPEC.md 참고)

   ★ 이 동화의 본체는 이야기다. 미니게임 셋(네모 배 짓기 · 나 자 쓰기 · 사과 세기)은
     이야기 사이에 끼는 짧은 놀이지, 이야기를 멈춰 세우는 과제가 아니다.
     그래서 쓰기도 '바나나' 가운데 한 글자만 쓴다(writeIndex).

   ★ 받침 규칙: 화면에 보이는 모든 한국어(title·subtitle·narration·
     choices[].label·doneSay·itemLabel·word)는 받침 없는 글자만 쓴다.
     쓸 수 없어 돌아간 말: 마당→나무 아래, 벽돌→네모, 반짝→커져요,
     오늘·하늘·구름·별·달·같이·함께·좋아요, 조사 은/는/을/를.
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

    /* 고래 — 바다 길에서 만나는 친구 */
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

    /* ---- 배경 (엔진 _bg 화풍 그대로) ---- */
    /* 거실 — 창밖에 비가 내린다 */
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

    /* ---- 선택 버튼 ---- */
    btnWave: () => `<svg viewBox="0 0 110 100"><path d="M6 46 Q28 22 50 46 T96 46 L96 84 L6 84 Z" fill="#7fc6e0"/><path d="M6 60 Q28 38 50 60 T96 60" stroke="#bfe6f4" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="82" cy="24" r="14" fill="#fff3c4"/></svg>`,
    btnRocket: () => `<svg viewBox="0 0 100 100"><path d="M50 10 C68 28 70 54 66 72 L34 72 C30 54 32 28 50 10 Z" fill="#f0f4fa" stroke="#b9c8dc" stroke-width="3"/><circle cx="50" cy="42" r="10" fill="#9ad2f0" stroke="#6fa9c8" stroke-width="3"/><path d="M34 60 L18 80 L34 74 Z" fill="#e8837a"/><path d="M66 60 L82 80 L66 74 Z" fill="#e8837a"/><path d="M42 74 q8 20 16 0 q-8 12 -16 0 Z" fill="#f6a96b"/><path d="M44 80 q6 14 12 0" fill="#ffd36b"/></svg>`,
    btnNote: () => `<svg viewBox="0 0 100 100"><path d="M40 74 L40 24 L78 16 L78 62" stroke="#9bbf6b" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="32" cy="76" rx="15" ry="12" fill="#9bbf6b"/><ellipse cx="70" cy="64" rx="15" ry="12" fill="#9bbf6b"/><circle cx="20" cy="26" r="6" fill="#f6a5bd"/><circle cx="88" cy="82" r="5" fill="#ffd36b"/></svg>`,
    btnMoon: () => `<svg viewBox="0 0 100 100"><path d="M62 14 A38 38 0 1 0 62 86 A30 30 0 1 1 62 14 Z" fill="#fdf0a8" stroke="#efd88a" stroke-width="3"/><path d="M20 20 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="#ffe08a"/><path d="M80 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/></svg>`
  };
})();

/* ---------- 이야기 ---------- */
const STORY = {
  title: "보리와 두두",
  subtitle: "우리 배 타고 가자",
  hero: "dogBori", heroMood: "happy",
  branchPoint: "choice1",     /* 엔딩의 '다르게 가 보자' 가 돌아오는 자리 */

  scenes: [
    /* 1. 나무 아래 그네 — 보리와 두두를 눌러 보게 한다 */
    { id: "intro", type: "narrative", bg: "bgHouseDone", bgm: CALM, holdMs: 3000,
      /* 강아지 그림은 120px 기준이라(엔진의 wolf는 260px) y를 작게 주면 하늘에 뜬다.
         발이 땅에 닿아 보이는 자리는 대체로 y 46~62% 사이다. */
      actors: [
        { art: "dogBori", x: "55%", y: "35%", scale: .8, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "보리예요! 그네가 하늘까지 올라가요!", sfx: "blip" } },
        { art: "dogDudu", x: "44%", y: "60%", scale: .65, mood: "happy",
          tap: { action: "shake", say: "두두예요! 언니, 나도 나도!", sfx: "blip" } }
      ],
      /* 그네는 집(배경 왼쪽)과 겹치지 않게 오른쪽에 세우고 보리를 그 위에 앉힌다.
         소품 크기는 px 고정이라 x를 더 오른쪽에 두면 폰 세로에서 화면 밖으로 잘린다. */
      props: [ { art: "swing", x: "50%", y: "24%", size: 180 } ],
      narration: "보리와 두두가 나무 아래에서 그네 타요. 히히, 재미나요!",
      parentPrompt: "아이에게: 그네를 타면 기분이 어때요? 우리도 누구랑 같이 타 볼까요?",
      next: "rain" },

    /* 2. 비 — 코코가 놀이를 제안한다 */
    { id: "rain", type: "narrative", bg: "bgLiving", bgm: CALM, holdMs: 3200,
      actors: [
        { art: "dogCoco", x: "48%", y: "47%", scale: 1.15, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "코코예요. 비 오는 날에는 집이 바다가 될 수도 있단다!", sfx: "blip" } },
        { art: "dogDudu", x: "20%", y: "60%", scale: .65, mood: "sad",
          tap: { action: "shake", say: "두두: 비가 와서 그네를 못 타요...", sfx: "whimper" } },
        { art: "dogBori", x: "72%", y: "54%", scale: .8, mood: "happy" }
      ],
      narration: "비가 주루루 와요. 그네 타러 나가기가 어려워요. 코코가 이야기해요. 우리 배 타고 가 보자!",
      parentPrompt: "아이에게: 비 오는 날 집에서는 무슨 놀이를 하고 싶어요?",
      next: "build" },

    /* 3. [미니게임 · 짓기] 네모 5개로 배 짓기 */
    { id: "build", type: "minigame", game: "build", bg: "bgRoom", bgm: PLAY,
      slots: 5, itemLabel: "네모", loopHint: true,
      char: "dogCoco", charMood: "happy",
      props: [ { art: "boat", x: "58%", y: "28%", size: 130 } ],
      countSay: "하나, 둘, 셋, 넷, 다섯! 차곡차곡 쌓아요.",
      narration: "네모 하나 하나 모아 배 지어요! 5 개 다 채워 보자",
      doneSay: "우와! 우리 배가 다 되어요!",
      parentPrompt: "아이에게: 블록으로 배를 만들면 어디로 가고 싶어요?",
      next: "choice1" },

    /* 4. [분기] 어디로 가지 — 바다 / 우주 */
    { id: "choice1", type: "choice", bg: "bgLiving", bgm: CALM,
      /* 선택 장면은 버튼이 화면 가운데를 덮는다. 강아지는 버튼 바깥
         (좌우 끝)에 세워야 아이 눈에 보인다. */
      actors: [
        { art: "dogBori", x: "3%", y: "52%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "88%", y: "58%", scale: .65, mood: "happy", anim: "anim-bob" }
      ],
      props: [ { art: "boat", x: "36%", y: "3%", size: 190 } ],
      narration: "우리 배가 커져요! 어디로 가지?",
      choices: [
        { art: "btnWave",   label: "바다로 가요", say: "바다로 가자!", next: "sea" },
        { art: "btnRocket", label: "우주로 가요", say: "우주로 가자!", next: "space" }
      ],
      parentPrompt: "아이에게: 바다랑 우주 중에 어디로 가고 싶어요? 왜 그럴까요?" },

    /* 5-가. 바다 길 */
    { id: "sea", type: "narrative", bg: "bgSea", bgm: PLAY, holdMs: 3200,
      actors: [
        { art: "dogCoco", x: "42%", y: "46%", scale: 1.15, mood: "happy" },
        { art: "dogBori", x: "14%", y: "54%", scale: .8, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "보리: 파도가 배를 살랑살랑 흔들어요!", sfx: "blip" } },
        { art: "dogDudu", x: "28%", y: "60%", scale: .65, mood: "happy" }
      ],
      props: [ { art: "boat", x: "1%", y: "58%", size: 160 }, { art: "whale", x: "64%", y: "56%", size: 230 } ],
      narration: "우와, 바다예요! 파도가 두두 코에 스쳐요. 저기 고래가 노래해요!",
      parentPrompt: "아이에게: 바다에서 또 누구를 만날 수 있을까요?",
      next: "snack" },

    /* 5-나. 우주 길 */
    { id: "space", type: "narrative", bg: "bgSpace", bgm: PLAY, holdMs: 3200,
      actors: [
        { art: "dogCoco", x: "62%", y: "44%", scale: 1.15, mood: "happy" },
        { art: "dogBori", x: "28%", y: "40%", scale: .8, mood: "happy", anim: "anim-bob",
          tap: { action: "cheer", say: "보리: 우리 배가 로케트가 됐어요! 슈우우!", sfx: "blip" } },
        { art: "dogDudu", x: "45%", y: "48%", scale: .65, mood: "happy", anim: "anim-bob" }
      ],
      /* 배는 왼쪽 끝으로. 가운데 두면 돛대가 보리를 꿰뚫고 지나간다. */
      props: [ { art: "boat", x: "3%", y: "48%", size: 200 } ],
      narration: "우와, 우주예요! 우리 배가 로케트가 되어요. 슈우우!",
      parentPrompt: "아이에게: 우주에는 무엇이 떠다닐까요? 별을 본 적 있어요?",
      next: "snack" },

    /* 6. [미니게임 · 쓰기] 하얀 나라 — 배고픈 두두에게 바나나
       바·나·나 가운데 한 글자만 손가락으로 쓴다. 이야기가 멈추지 않게. */
    { id: "snack", type: "minigame", game: "write", bg: "bgSnow", bgm: PLAY,
      word: "바나나", writeIndex: 1,
      char: "dogDudu", charMood: "sad",
      /* 배는 오른쪽 아래로 — 위에 두면 자막 띠에 가린다 */
      props: [ { art: "banana", x: "4%", y: "60%", size: 120 },
               { art: "boat", x: "84%", y: "62%", size: 120 } ],
      narration: "두두가 배가 고파요. 모모가 바나나 가지고 와요. 여기 나 하고 써 주세요!",
      doneSay: "우와, 바나나예요! 두두가 고마워요!",
      parentPrompt: "아이에게: '바나나'를 손가락으로 같이 짚어볼까요? 가운데 글자가 무엇이지요?",
      next: "orchard" },

    /* 7. [미니게임 · 셈] 사과나무에서 사과 따기 (4 + 1) */
    { id: "orchard", type: "minigame", game: "math", bg: "bgCastle", bgm: PLAY,
      a: 4, b: 1, op: "+", icon: "apple",
      showWolf: true, char: "dogCoco", charMood: "happy",
      props: [ { art: "bigtree", x: "2%", y: "6%", size: 230 } ],
      narration: "사과 나무예요! 코코와 사과 따요. 모두 세어 보자",
      tryAgainSay: "천천히 다시 세어볼까요? 넷에 하나를 더하면?",
      doneSay: "우와! 사과가 모두 5 개예요!",
      parentPrompt: "아이에게: 사과 네 개에 한 개가 더 오면 몇 개일까요? 손가락으로 같이!",
      next: "choice2" },

    /* 8. [분기] 비가 그친 뒤 — 엔딩 3택 */
    { id: "choice2", type: "choice", bg: "bgSunset", bgm: CALM,
      actors: [
        { art: "dogBori", x: "2%", y: "52%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "88%", y: "56%", scale: .65, mood: "happy" }
      ],
      narration: "비가 그쳐요. 해가 다시 나와요. 이제 뭐 하지?",
      choices: [
        { art: "btnNote",   label: "우리 노래해요",   say: "다 같이 노래하자!",    next: "end_song" },
        { art: "btnMoon",   label: "이야기 해 주세요", say: "코코, 이야기 해 주세요!", next: "end_tale" },
        { art: "btnRocket", label: "다시 가요",       say: "한 번 더 가 보자!",     next: "end_again" }
      ],
      parentPrompt: "아이에게: 오늘 놀이 중에 무엇이 제일 재미있었어요?" },

    /* 엔딩 가 — 다 같이 노래 */
    { id: "end_song", type: "narrative", bg: "bgPlay", bgm: END, holdMs: 3000,
      actors: [
        { art: "dogCoco", x: "62%", y: "46%", scale: 1.15, mood: "happy", anim: "anim-bob" },
        { art: "dogMomo", x: "42%", y: "48%", scale: 1.05, mood: "happy", anim: "anim-bob" },
        { art: "dogBori", x: "12%", y: "54%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "28%", y: "60%", scale: .65, mood: "happy", anim: "anim-bob" }
      ],
      props: [ { art: "swing", x: "80%", y: "38%", size: 150 } ],
      narration: "라라라! 보리와 두두와 모모와 코코가 노래해요. 우리 노래가 나무 위로 가요. 야호!",
      parentPrompt: "아이에게: 우리도 같이 한 곡 불러볼까요? 어떤 노래가 좋아요?",
      next: null },

    /* 엔딩 나 — 코코의 이야기, 스르르 잠 */
    { id: "end_tale", type: "narrative", bg: "bgNight", bgm: END, holdMs: 3000,
      actors: [
        { art: "dogCoco", x: "56%", y: "46%", scale: 1.15, mood: "happy" },
        { art: "dogMomo", x: "74%", y: "48%", scale: 1.05, mood: "happy" },
        { art: "dogBori", x: "16%", y: "54%", scale: .8, mood: "happy" },
        { art: "dogDudu", x: "32%", y: "60%", scale: .65, mood: "happy" }
      ],
      props: [ { art: "nest", x: "4%", y: "62%", size: 140 } ],
      narration: "코코가 이야기해 주어요. 보리와 두두가 스르르 코 자요. 하루가 다 가요",
      parentPrompt: "아이에게: 아빠가 자기 전에 어떤 이야기를 해주면 좋겠어요?",
      next: null },

    /* 엔딩 다 — 배 타고 한 바퀴 더 */
    { id: "end_again", type: "narrative", bg: "bgSpace", bgm: END, holdMs: 3000,
      actors: [
        { art: "dogBori", x: "26%", y: "40%", scale: .8, mood: "happy", anim: "anim-bob" },
        { art: "dogDudu", x: "42%", y: "48%", scale: .65, mood: "happy", anim: "anim-bob" },
        { art: "dogMomo", x: "60%", y: "42%", scale: 1.05, mood: "happy" },
        { art: "dogCoco", x: "76%", y: "48%", scale: 1.15, mood: "happy" }
      ],
      props: [ { art: "boat", x: "4%", y: "46%", size: 200 } ],
      narration: "우리 또 가자! 배가 다시 슈우우 가요. 저기 새 나라가 보여요!",
      parentPrompt: "아이에게: 내일은 어디로 떠나 볼까요?",
      next: null }
  ]
};
window.STORY = STORY;
