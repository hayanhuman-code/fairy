/* =====================================================================
   보리와 두두 — 페이지 내용 (pages.js)

   ★ 이 책이 하는 일은 하나다: 받침 없는 글자를 크게 내놓고 소리와 이어 주기.
     그래서 한 페이지에 한 줄, 한 줄은 4~9자를 넘지 않는다.
     (예전에는 한 화면에 29자를 27px 자막으로 몰아 넣었다.)

   ★ 글자는 우연에 맡기지 않는다. 아래 CORE 스물두 자를 먼저 정하고,
     각 글자가 최소 세 번 이상 나오도록 문장을 맞췄다.
     node check_batchim.js 가 받침과 반복 횟수를 함께 검사한다.

   ★ 받침 없는 글자만 쓴다. 쓸 수 없어 돌아간 말:
     마당→나무 아래, 벽돌→네모, 거실→여기, 집→자리, 못→어려워요,
     시무룩→귀가 처져요, 커다란→"아주 커요"(문장을 쪼갬),
     하늘·구름·별·달·아침·오늘, 조사 은/는/을/를, 과거형 전부.
   ===================================================================== */

/* 아이가 이 책에서 여러 번 만나게 할 글자 — 이름과 사물 위주로 고른다 */
window.CORE = [..."보리두코모나무그네비배바다고래사과우주노"];

window.PAGES = [

  /* ── 1막. 비 오는 날 ─────────────────────────────── */
  { act: "calm", bg: "bgHouseDone",
    props:  [ { art: "swing", x: "52%", y: "10%", size: 175 } ],
    actors: [ { art: "dogBori", x: "56%", y: "27%", scale: .95, bob: true },
              { art: "dogDudu", x: "32%", y: "64%", scale: .8 } ],
    text: "보리와 두두예요",
    ask: "우리 딸 이름도 말해볼까요?" },

  { act: "calm", bg: "bgHouseDone",
    props:  [ { art: "swing", x: "52%", y: "10%", size: 175 } ],
    actors: [ { art: "dogBori", x: "56%", y: "27%", scale: .95, bob: true },
              { art: "dogDudu", x: "32%", y: "64%", scale: .8, bob: true } ],
    text: "나무 아래 그네 타요",
    ask: "그네를 타면 기분이 어때요?" },

  { act: "calm", bg: "bgPlay",
    actors: [ { art: "dogBori", x: "30%", y: "58%", scale: 1.0, bob: true },
              { art: "dogDudu", x: "56%", y: "70%", scale: .85, bob: true } ],
    text: "야호! 재미나요",
    ask: "제일 재미있는 놀이는 뭐예요?" },

  { act: "calm", bg: "bgLiving",
    actors: [ { art: "dogDudu", x: "44%", y: "64%", scale: .9, mood: "sad" } ],
    text: "어? 비가 와요",
    ask: "비 오는 소리를 같이 내볼까요?" },

  { act: "calm", bg: "bgLiving",
    actors: [ { art: "dogDudu", x: "34%", y: "70%", scale: .9, mood: "sad" },
              { art: "dogBori", x: "62%", y: "58%", scale: 1.0 } ],
    text: "비가 주루루 와요",
    ask: "비가 오면 무슨 소리가 나요?" },

  { act: "calm", bg: "bgLiving",
    actors: [ { art: "dogDudu", x: "30%", y: "70%", scale: .9, mood: "sad" },
              { art: "dogBori", x: "58%", y: "58%", scale: 1.0 } ],
    text: "두두 귀가 처져요",
    ask: "두두는 지금 기분이 어떨까요?" },

  { act: "calm", bg: "bgAttic",
    actors: [ { art: "dogCoco", x: "46%", y: "64%", scale: 1.2, bob: true } ],
    text: "코코가 와요",
    ask: "코코는 아빠예요. 무얼 들고 왔을까요?" },

  { act: "calm", bg: "bgAttic",
    props:  [ { art: "brick", x: "16%", y: "56%", size: 105 } ],
    actors: [ { art: "dogCoco", x: "46%", y: "58%", scale: 1.2 },
              { art: "dogDudu", x: "72%", y: "70%", scale: .8, bob: true } ],
    text: "네모 가지고 와요",
    ask: "네모로 무엇을 만들 수 있을까요?" },

  { act: "play", bg: "bgRoom",
    props:  [ { art: "brick", x: "22%", y: "50%", size: 110 },
              { art: "brick", x: "60%", y: "50%", size: 110 } ],
    actors: [ { art: "dogCoco", x: "40%", y: "64%", scale: 1.2 } ],
    text: "우리 배 지어 보자",
    ask: "블록으로 배를 만들어 본 적 있어요?" },

  { act: "play", bg: "bgRoom",
    props:  [ { art: "boat", x: "34%", y: "26%", size: 210 } ],
    actors: [ { art: "dogBori", x: "12%", y: "58%", scale: .95, bob: true },
              { art: "dogDudu", x: "74%", y: "70%", scale: .8, bob: true } ],
    text: "우와! 배가 되어요",
    ask: "이 배를 타면 어디로 가고 싶어요?" },

  { act: "play", bg: "bgLiving",
    props:  [ { art: "boat", x: "26%", y: "26%", size: 250 } ],
    actors: [ { art: "dogBori", x: "26%", y: "58%", scale: .9 },
              { art: "dogMomo", x: "68%", y: "70%", scale: 1.1, bob: true } ],
    text: "모모도 배에 타요",
    ask: "모모는 엄마예요. 누구누구 탔지요?" },

  { act: "play", bg: "bgLiving",
    props:  [ { art: "boat", x: "22%", y: "18%", size: 300 } ],
    actors: [ { art: "dogBori", x: "24%", y: "58%", scale: .9, bob: true },
              { art: "dogDudu", x: "48%", y: "70%", scale: .75, bob: true } ],
    text: "배가 커져요",
    ask: "배가 얼마나 커졌을까요? 팔로 표현해볼까요?" },

  /* ── 2막. 바다 ───────────────────────────────────── */
  { act: "play", bg: "bgSea",
    props:  [ { art: "boat", x: "8%", y: "44%", size: 190 } ],
    actors: [ { art: "dogBori", x: "42%", y: "58%", scale: .95, bob: true },
              { art: "dogDudu", x: "62%", y: "70%", scale: .8 } ],
    text: "우와, 바다예요",
    ask: "바다는 무슨 색일까요?" },

  { act: "play", bg: "bgSea",
    props:  [ { art: "boat", x: "34%", y: "40%", size: 210 } ],
    actors: [ { art: "dogCoco", x: "14%", y: "58%", scale: 1.15 },
              { art: "dogMomo", x: "72%", y: "70%", scale: 1.05 } ],
    text: "파도가 차르르",
    ask: "파도 소리를 같이 내볼까요?" },

  { act: "play", bg: "bgSea",
    props:  [ { art: "boat", x: "20%", y: "42%", size: 200 } ],
    actors: [ { art: "dogBori", x: "50%", y: "58%", scale: .95, bob: true },
              { art: "dogMomo", x: "72%", y: "70%", scale: 1.05, bob: true } ],
    text: "바다가 노래해요",
    ask: "바다도 노래를 할까요?" },

  { act: "play", bg: "bgIsland",
    props:  [ { art: "whale", x: "18%", y: "44%", size: 260 } ],
    actors: [ { art: "dogBori", x: "26%", y: "58%", scale: .9, bob: true },
              { art: "dogDudu", x: "44%", y: "70%", scale: .75 } ],
    text: "저기 고래가 와요",
    ask: "고래를 본 적 있어요?" },

  { act: "play", bg: "bgIsland",
    props:  [ { art: "whale", x: "14%", y: "40%", size: 300 } ],
    actors: [ { art: "dogCoco", x: "76%", y: "64%", scale: 1.15 } ],
    text: "고래가 아주 커요",
    ask: "고래는 얼마나 클까요? 팔을 벌려볼까요?" },

  { act: "play", bg: "bgIsland",
    props:  [ { art: "whale", x: "16%", y: "42%", size: 280 },
              { art: "boat", x: "24%", y: "22%", size: 150 } ],
    actors: [ { art: "dogBori", x: "26%", y: "58%", scale: .85, bob: true },
              { art: "dogDudu", x: "70%", y: "70%", scale: .8, bob: true } ],
    text: "고래야, 고마워",
    ask: "고마울 때는 뭐라고 말하지요?" },

  /* ── 3막. 간식 — 여기서 글자를 손으로 써 본다 ────── */
  { act: "play", bg: "bgSnow",
    props:  [ { art: "banana", x: "8%", y: "74%", size: 120 } ],
    actors: [ { art: "dogDudu", x: "46%", y: "64%", scale: .95, mood: "sad" } ],
    text: "두두가 배가 고파요",
    ask: "배가 고플 때 무엇을 먹고 싶어요?" },

  { act: "play", bg: "bgSnow",
    write: { word: "바나나", index: 1 },
    props:  [ { art: "banana", x: "6%", y: "75%", size: 115 } ],
    actors: [ { art: "dogDudu", x: "78%", y: "64%", scale: .85, mood: "sad" } ],
    text: "여기 나 써 주세요",
    ask: "'바나나' 가운데 글자를 손가락으로 짚어볼까요?" },

  { act: "play", bg: "bgSnow",
    props:  [ { art: "banana", x: "10%", y: "69%", size: 150 } ],
    actors: [ { art: "dogDudu", x: "46%", y: "58%", scale: 1.0, bob: true },
              { art: "dogMomo", x: "72%", y: "70%", scale: 1.05 } ],
    text: "우와, 바나나예요",
    ask: "바나나는 무슨 색이지요?" },

  { act: "play", bg: "bgSnow",
    actors: [ { art: "dogDudu", x: "34%", y: "70%", scale: 1.0, bob: true },
              { art: "dogBori", x: "58%", y: "58%", scale: 1.0 } ],
    text: "두두가 고마워요",
    ask: "두두 표정이 어떻게 바뀌었어요?" },

  /* ── 4막. 밤과 우주 ──────────────────────────────── */
  { act: "calm", bg: "bgNight",
    props:  [ { art: "boat", x: "10%", y: "42%", size: 200 } ],
    actors: [ { art: "dogMomo", x: "48%", y: "58%", scale: 1.1 },
              { art: "dogDudu", x: "70%", y: "70%", scale: .8 } ],
    text: "이제 어두워요",
    ask: "밤이 되면 무엇이 보일까요?" },

  { act: "calm", bg: "bgNight",
    actors: [ { art: "dogMomo", x: "40%", y: "58%", scale: 1.15, bob: true },
              { art: "dogBori", x: "18%", y: "64%", scale: .9 },
              { art: "dogDudu", x: "68%", y: "70%", scale: .8 } ],
    text: "모모가 노래해요",
    ask: "엄마가 불러주는 노래가 있어요?" },

  { act: "calm", bg: "bgNight",
    actors: [ { art: "dogMomo", x: "44%", y: "64%", scale: 1.15, bob: true } ],
    text: "라라라 라라라",
    ask: "우리도 같이 라라라 해볼까요?" },

  { act: "play", bg: "bgSpace",
    props:  [ { art: "boat", x: "12%", y: "38%", size: 230 } ],
    actors: [ { art: "dogBori", x: "48%", y: "58%", scale: .95, bob: true },
              { art: "dogDudu", x: "68%", y: "70%", scale: .8, bob: true } ],
    text: "우와! 로케트예요",
    ask: "로켓 소리를 같이 내볼까요?" },

  { act: "play", bg: "bgSpace",
    props:  [ { art: "boat", x: "8%", y: "36%", size: 230 } ],
    actors: [ { art: "dogCoco", x: "50%", y: "58%", scale: 1.2 },
              { art: "dogMomo", x: "74%", y: "70%", scale: 1.1 } ],
    text: "슈우우 우주로 가요",
    ask: "우주에는 무엇이 있을까요?" },

  { act: "play", bg: "bgCastle",
    props:  [ { art: "bigtree", x: "6%", y: "6%", size: 250 } ],
    actors: [ { art: "dogBori", x: "58%", y: "64%", scale: .95, bob: true } ],
    text: "저기 사과 나무예요",
    ask: "사과는 무슨 맛이에요?" },

  { act: "play", bg: "bgCastle",
    props:  [ { art: "bigtree", x: "8%", y: "6%", size: 260 } ],
    actors: [ { art: "dogDudu", x: "60%", y: "64%", scale: .85, bob: true } ],
    text: "사과가 다 커요",
    ask: "사과가 몇 개 보여요?" },

  { act: "play", bg: "bgCastle",
    props:  [ { art: "bigtree", x: "4%", y: "4%", size: 270 },
              { art: "apple", x: "48%", y: "50%", size: 70 } ],
    actors: [ { art: "dogCoco", x: "64%", y: "58%", scale: 1.2 },
              { art: "dogDudu", x: "40%", y: "70%", scale: .8, bob: true } ],
    text: "사과 하나 주세요",
    ask: "사과가 몇 개 보여요? 같이 세어볼까요?" },

  /* ── 5막. 돌아오는 길 ────────────────────────────── */
  { act: "calm", bg: "bgSunset",
    props:  [ { art: "boat", x: "10%", y: "42%", size: 210 } ],
    actors: [ { art: "dogBori", x: "46%", y: "58%", scale: .95 },
              { art: "dogDudu", x: "66%", y: "70%", scale: .8 } ],
    text: "이제 자리로 가요",
    ask: "오늘 어디어디에 다녀왔지요?" },

  { act: "calm", bg: "bgSunset",
    actors: [ { art: "dogCoco", x: "30%", y: "58%", scale: 1.2 },
              { art: "dogMomo", x: "56%", y: "70%", scale: 1.1 } ],
    text: "해가 바다로 가요",
    ask: "해가 지면 무엇이 올까요?" },

  { act: "calm", bg: "bgSunset",
    props:  [ { art: "boat", x: "60%", y: "46%", size: 170 } ],
    actors: [ { art: "dogBori", x: "22%", y: "64%", scale: .95 } ],
    text: "하루가 다 가요",
    ask: "오늘 하루 중에 뭐가 제일 좋았어요?" },

  { act: "calm", bg: "bgLiving",
    actors: [ { art: "dogDudu", x: "44%", y: "64%", scale: .9, bob: true } ],
    text: "어? 비가 그쳐요",
    ask: "비가 그치면 무엇이 뜰까요?" },

  { act: "calm", bg: "bgLiving",
    props:  [ { art: "rainbow", x: "8%", y: "12%", size: 260 } ],
    actors: [ { art: "dogDudu", x: "34%", y: "70%", scale: .85, bob: true },
              { art: "dogBori", x: "62%", y: "58%", scale: .95, bob: true } ],
    text: "저기 무지개예요",
    ask: "무지개는 몇 가지 색일까요?" },

  { act: "play", bg: "bgPlay",
    props:  [ { art: "swing", x: "78%", y: "24%", size: 150 } ],
    actors: [ { art: "dogCoco", x: "52%", y: "58%", scale: 1.2, bob: true },
              { art: "dogMomo", x: "34%", y: "64%", scale: 1.1, bob: true },
              { art: "dogBori", x: "10%", y: "70%", scale: .95, bob: true } ],
    text: "우리 노래해요",
    ask: "우리 가족이 다 모였어요. 누구누구지요?" },

  { act: "play", bg: "bgPlay",
    actors: [ { art: "dogBori", x: "22%", y: "58%", scale: 1.0, bob: true },
              { art: "dogDudu", x: "56%", y: "70%", scale: .85, bob: true } ],
    text: "라라라 야호!",
    ask: "같이 한 곡 불러볼까요?" },

  { act: "play", bg: "bgPlay",
    props:  [ { art: "swing", x: "50%", y: "16%", size: 175 } ],
    actors: [ { art: "dogBori", x: "54%", y: "32%", scale: .95, bob: true },
              { art: "dogDudu", x: "24%", y: "64%", scale: .8, bob: true } ],
    text: "그네도 타자",
    ask: "그네를 또 타고 싶어요?" },

  { act: "end", bg: "bgRoom",
    actors: [ { art: "dogCoco", x: "48%", y: "58%", scale: 1.2 },
              { art: "dogBori", x: "16%", y: "64%", scale: .95 },
              { art: "dogDudu", x: "74%", y: "70%", scale: .8 } ],
    text: "코코가 이야기해요",
    ask: "자기 전에 어떤 이야기가 좋아요?" },

  { act: "end", bg: "bgRoom",
    props:  [ { art: "nest", x: "8%", y: "75%", size: 130 } ],
    actors: [ { art: "dogBori", x: "40%", y: "58%", scale: .95 },
              { art: "dogDudu", x: "64%", y: "70%", scale: .8 } ],
    text: "이제 코 자요",
    ask: "잘 때 인사는 뭐라고 하지요?" },

  { act: "end", bg: "bgNight",
    props:  [ { art: "boat", x: "72%", y: "48%", size: 150 },
              { art: "nest", x: "8%", y: "75%", size: 130 } ],
    actors: [ { art: "dogCoco", x: "46%", y: "58%", scale: 1.2 },
              { art: "dogMomo", x: "64%", y: "62%", scale: 1.1 },
              { art: "dogBori", x: "18%", y: "66%", scale: .95 },
              { art: "dogDudu", x: "32%", y: "70%", scale: .8 } ],
    text: "보리도 두두도 자요",
    ask: "다들 잠들었어요. 조용히 인사해볼까요?" },

  { act: "end", bg: "bgNight",
    props:  [ { art: "boat", x: "16%", y: "40%", size: 200 } ],
    actors: [ { art: "dogBori", x: "52%", y: "58%", scale: 1.0, bob: true },
              { art: "dogDudu", x: "72%", y: "70%", scale: .85, bob: true } ],
    text: "우리 또 가자",
    ask: "내일은 어디로 가볼까요?" }
];
