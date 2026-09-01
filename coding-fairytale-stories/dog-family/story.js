/* =====================================================================
   "보리와 두두" — 강아지 네 마리의 비 오는 날 (SPEC.md 참고)

   ★ 체크포인트 빌드: 쓰기 미니게임 장면(snack)만 완성된 상태.
     확인 후 나머지 11개 장면을 채운다. 임시로 snack이 첫 장면이다.

   ★ 받침 규칙: 화면에 표시되는 모든 한국어(title·subtitle·narration·
     choices[].label·doneSay·word)는 받침 없는 글자만 쓴다.
     음성 전용(say·tryAgainSay 등)과 parentPrompt는 자유.
   ===================================================================== */
const CALM = "audio/bgm_lullaby.mp3";
const PLAY = "audio/bgm_velvet.mp3";
const END  = "audio/bgm_lullaby2.mp3";

/* ---------- 이야기 전용 그림 (engine.js 무수정 — write-game.js가 ART에 설치) ---------- */
window.EXTRA_ART = (function () {
  let uid = 0; const gid = p => p + "x" + (++uid);

  /* 강아지 가족 — 엔진 dog 화풍을 따르되 색을 바꾸고 표정(happy/sad)을 더함 */
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
    /* 보리(언니·주인공) — 노랑 */
    dogBori: dogArt("dogBori", { hi: "#fbe9b7", lo: "#eec871", ear: "#d9a94e", muzzle: "#fdf6e3", cheek: "#f0a06a",
      extra: `<path d="M56 38 L70 30 L84 38 L70 46 Z" fill="#f6a5bd" opacity=".9"/><circle cx="70" cy="38" r="4" fill="#e98ba0"/>` }),
    /* 두두(동생) — 하양+갈색 귀 */
    dogDudu: dogArt("dogDudu", { hi: "#ffffff", lo: "#efe6d8", ear: "#b98a55", muzzle: "#fbf4e8", cheek: "#f0b0a0",
      extra: `<circle cx="88" cy="98" r="9" fill="#c9a06a" opacity=".8"/>` }),
    /* 모모(엄마) — 크림 */
    dogMomo: dogArt("dogMomo", { hi: "#fdf3e2", lo: "#ecd7b4", ear: "#d0b184", muzzle: "#fffaf0", cheek: "#eda487" }),
    /* 코코(아빠) — 갈색 */
    dogCoco: dogArt("dogCoco", { hi: "#e3c49a", lo: "#c09263", ear: "#8f6238", muzzle: "#f2e3cb", cheek: "#d9926a" }),

    /* 바나나 — 두두의 간식 */
    banana: (s = 110) => { const g = gid("bnn"); return `<svg data-asset="banana" viewBox="0 0 120 100" width="${s}" height="${s * 0.83}">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#f2c94c"/></linearGradient></defs>
      <ellipse cx="60" cy="90" rx="34" ry="6" fill="#000" opacity=".07"/>
      <path d="M22 34 C30 66 58 84 92 78 C98 77 102 82 96 85 C58 98 20 74 12 38 C11 30 20 28 22 34 Z" fill="url(#${g})" stroke="#d9a92e" stroke-width="3"/>
      <rect x="10" y="27" width="12" height="10" rx="3" fill="#8f6238"/>
      <path d="M30 42 C38 62 56 74 78 74" stroke="#fff3c0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    </svg>`; },

    /* 브릭 배 — 아이가 build로 지은 상상 배 (돛 달림) */
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
    </svg>`; }
  };
})();

/* ---------- 이야기 ---------- */
const STORY = {
  title: "보리와 두두",
  subtitle: "우리 배 타고 가자",
  hero: "dogBori", heroMood: "happy",
  branchPoint: "snack",   /* 체크포인트 임시값 — 전체 빌드에서 choice1로 바꿈 */

  scenes: [
    /* [미니게임 · 쓰기] 구름 위 하얀 세계 — 배고픈 두두에게 '바나나' 써 주기
       hangulssugi 획순 데이터로 바·나·나를 한 글자씩 손가락으로 따라 쓴다. */
    { id: "snack", type: "minigame", game: "write", bg: "bgSnow", bgm: PLAY,
      word: "바나나",
      char: "dogDudu", charMood: "sad",
      props: [ { art: "banana", x: "4%", y: "62%", size: 110 } ],
      narration: "두두가 배가 고파요. 바나나 하고 써 봐요!",
      doneSay: "우와, 바나나예요! 두두가 고마워요!",
      parentPrompt: "아이에게: '바나나' 글자를 손가락으로 같이 짚어볼까요? 획순 점선을 따라 천천히!",
      next: "snack_done" },

    /* 체크포인트 임시 스텁 — 전체 빌드에서 orchard(사과 세기)로 교체 */
    { id: "snack_done", type: "narrative", bg: "bgCastle", bgm: PLAY, holdMs: 2600,
      actors: [
        { art: "dogDudu", x: "40%", y: "56%", scale: .65, mood: "happy", anim: "anim-bob" },
        { art: "dogBori", x: "58%", y: "52%", scale: .8, mood: "happy" }
      ],
      props: [ { art: "banana", x: "26%", y: "64%", size: 100 } ],
      narration: "야호! 이제 가자!",
      parentPrompt: "여기까지가 확인용 장면이에요. 나머지 이야기는 곧 이어져요!",
      next: null }
  ]
};
window.STORY = STORY;
