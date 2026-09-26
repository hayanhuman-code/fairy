// 고래로봇과 배 — 페이지
// line : 화면 글월 (한 줄, 8자 이하 — 공백 빼고 문장부호 포함)
// say  : 읽어 줄 때 쓸 말 (없으면 line)
// ask  : 부모가 아이에게 던질 질문 (화면 구석, 작게)
// items: [그림, x, y, {크기 s, 뒤집기 flip, 움직임 anim, 그 밖의 옵션}]
//        y 는 발밑 선. art.js 의 LINE 값을 쓰면 뜨지 않는다.

const PAGES = [
  // ── 1막 · 섬 ────────────────────────────────
  { act: 1, bg: 'island', cover: true, line: '고래로봇과 배',
    ask: '같이 읽어 볼까요? 글자를 눌러 보세요.',
    items: [
      ['ship', 640, LINE.far + 4, { s: .3, pirate: { mood: 'happy' } }],
      ['whale', 480, LINE.sea, { s: 1, mood: 'happy', anim: 'bob' }],
      ['gull', 260, 150, { s: 1, anim: 'glide' }],
    ] },

  { act: 1, bg: 'island', line: '섬이 있어요',
    ask: '섬에는 뭐가 있을까?',
    items: [
      ['gull', 460, 180, { s: .9, anim: 'glide' }],
      ['gull', 600, 230, { s: .6, anim: 'glide' }],
    ] },

  { act: 1, bg: 'island', line: '고래로봇이 살아요',
    ask: '섬에 누가 살고 있어?',
    items: [
      ['whale', 500, LINE.sea, { s: 1.1, mood: 'happy', anim: 'bob' }],
    ] },

  { act: 1, bg: 'island', line: '바다를 봐요',
    ask: '고래로봇은 뭘 보고 있을까?',
    items: [
      ['whale', 480, LINE.sea, { s: 1.1, mood: 'happy', anim: 'bob' }],
      ['gull', 660, 200, { s: .8, anim: 'glide' }],
    ] },

  { act: 1, bg: 'sea', line: '저기 배가 와요',
    ask: '저 멀리 뭐가 보여?',
    items: [
      ['ship', 590, LINE.far + 6, { s: .4, pirate: { mood: 'happy' }, anim: 'sail' }],
      ['whale', 320, LINE.sea, { s: 1, mood: 'happy', anim: 'bob' }],
    ] },

  { act: 1, bg: 'sea', line: '배 위에 해적로봇',
    ask: '배 위에 누가 있어? 해적로봇은 착한 로봇이래.',
    items: [
      ['ship', 450, LINE.sea, { s: 1.1, pirate: { mood: 'happy' }, anim: 'rock' }],
    ] },

  { act: 1, bg: 'sea', line: '안녕, 해적로봇!',
    say: '안녕, 해적로봇!',
    ask: '우리도 해적로봇한테 손 흔들어 볼까?',
    items: [
      ['ship', 530, LINE.sea, { s: .95, pirate: { mood: 'happy', wave: true }, anim: 'rock' }],
      ['whale', 270, LINE.sea, { s: .85, mood: 'happy', anim: 'bob' }],
    ] },
];
