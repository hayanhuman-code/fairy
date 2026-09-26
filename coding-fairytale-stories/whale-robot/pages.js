// 고래로봇과 배 — 페이지
// line : 화면 글월 (한 줄, 8자 이하 — 공백 빼고 문장부호 포함)
// say  : 읽어 줄 때 쓸 말 (없으면 line)
// ask  : 부모가 아이에게 던질 질문 (화면 구석, 작게)
// items: [그림, x, y, {크기 s, 뒤집기 flip, 움직임 anim, 그 밖의 옵션}]
//        y 는 발밑 선. art.js 의 LINE 값을 쓰면 뜨지 않는다.

// 구름 타고 나는 고래로봇 — 고래 뒤에 구름을 깔아 받쳐 준다
const onCloud = (x, y, s = 1, whale = {}, anim = 'fly') => [
  ['whale', x, y, { s, mood: 'happy', anim, ...whale }],
  ['cloud', x - 10 * s, y + 70 * s, { s: 1.9 * s, anim }],
];
const SHIP = (x, s, pirate, extra = {}) => ['ship', x, LINE.sea, { s, pirate, anim: 'rock', ...extra }];

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

  // ── 2막 · 타고 싶어 ──────────────────────────
  { act: 2, bg: 'sea', line: '나도 배 타고 싶어!',
    ask: '고래로봇은 뭘 하고 싶대?',
    items: [SHIP(560, 1, { mood: 'happy' }), ['whale', 240, LINE.sea, { s: .85, mood: 'happy', anim: 'bob' }]] },

  { act: 2, bg: 'sea', line: '영차! 영차!',
    ask: '고래로봇이 배에 올라가려고 해요. 같이 영차 해 볼까?',
    items: [SHIP(560, 1, { mood: 'worry' }), ['whale', 300, LINE.sea - 10, { s: .85, rot: -18, mood: 'happy' }]] },

  { act: 2, bg: 'sea', line: '아이쿠, 미끌!',
    ask: '어? 고래로봇이 어떻게 됐어?',
    items: [SHIP(560, 1, { mood: 'worry' }), ['whale', 230, LINE.sea, { s: .85, mood: 'sad' }],
            ['splash', 340, LINE.sea + 6, { s: 1.1 }]] },

  { act: 2, bg: 'sea', line: '사다리를 놓아요',
    ask: '사다리가 있으면 올라갈 수 있을까?',
    items: [SHIP(560, 1, { mood: 'happy' }), ['ladder', 330, LINE.sea + 16, { s: 1.1 }],
            ['whale', 200, LINE.sea, { s: .75, mood: 'happy', anim: 'bob' }]] },

  { act: 2, bg: 'sea', line: '사다리를 세어요', say: '사다리를 하나씩 눌러서 세어 봐요',
    ask: '사다리를 하나씩 눌러 보세요. 몇 칸일까?',
    game: { type: 'count', answer: 3 },
    items: [SHIP(560, 1, { mood: 'happy' }), ['ladder', 330, LINE.sea + 16, { s: 1.1, hit: true }],
            ['whale', 200, LINE.sea, { s: .75, mood: 'happy', anim: 'bob' }]] },

  { act: 2, bg: 'sea', line: '발이 없어요',
    ask: '사다리는 발로 올라가요. 고래로봇은 발이 있어?',
    items: [SHIP(560, 1, { mood: 'worry' }), ['ladder', 330, LINE.sea + 16, { s: 1.1 }],
            ['whale', 220, LINE.sea, { s: .78, mood: 'sad' }]] },

  { act: 2, bg: 'sea', line: '아직 안 돼', say: '해적로봇이 말해요. 아직 안 돼.',
    ask: '해적로봇이 뭐라고 했어? 얼굴을 봐. 걱정하는 것 같지?',
    items: [SHIP(500, 1.1, { mood: 'worry' }), ['whale', 190, LINE.sea, { s: .75, mood: 'sad' }]] },

  { act: 2, bg: 'sea', line: '아직 너무 커',
    ask: '고래로봇이 배보다 커? 작아?',
    items: [SHIP(500, 1.1, { mood: 'worry' }), ['whale', 190, LINE.sea, { s: .75, mood: 'sad' }]] },

  { act: 2, bg: 'sea', line: '발이 없어서 안 돼',
    ask: '해적로봇은 고래로봇이 다칠까 봐 걱정했대. 착하지?',
    items: [SHIP(500, 1.1, { mood: 'worry' }), ['whale', 190, LINE.sea, { s: .75, mood: 'sad' }]] },

  // ── 3막 · 슬퍼요 ─────────────────────────────
  { act: 3, bg: 'graySea', line: '고래로봇 슬퍼요',
    ask: '고래로봇 얼굴이 어때 보여?',
    items: [['whale', 400, LINE.sea, { s: 1.15, mood: 'sad' }]] },

  { act: 3, bg: 'graySea', line: '아직 안 된대요',
    ask: '배가 멀리 가요. 고래로봇 마음이 어떨까?',
    items: [['ship', 640, LINE.far + 6, { s: .3, pirate: { mood: 'worry' }, anim: 'sail' }],
            ['whale', 360, LINE.sea, { s: 1.05, mood: 'sad' }]] },

  { act: 3, bg: 'graySea', line: '바다도 슬퍼요',
    ask: '하늘이랑 바다 색이 어떻게 바뀌었어?',
    items: [['whale', 400, LINE.sea, { s: 1.05, mood: 'sad' }]] },

  { act: 3, bg: 'graySea', line: '눈물이 뚝뚝',
    ask: '너도 슬플 때 눈물이 나?',
    items: [['whale', 400, LINE.sea, { s: 1.15, mood: 'sad', tears: true }]] },

  { act: 3, bg: 'graySea', line: '하늘로 푸우!',
    ask: '고래로봇이 물을 어디로 뿜었어?',
    items: [['whale', 400, LINE.sea, { s: 1, mood: 'sad', spout: true }]] },

  { act: 3, bg: 'graySea', line: '구름이 생겨요',
    ask: '물을 뿜었더니 뭐가 생겼어?',
    items: [['whale', 400, LINE.sea, { s: .95, mood: 'sad', spout: true }],
            ['cloud', 420, 140, { s: .9, anim: 'bob' }]] },

  // ── 4막 · 구름을 몰고 와 ──────────────────────
  { act: 4, bg: 'cloudy', line: '구름아, 모여라!', say: '구름을 눌러서 모아 봐요',
    ask: '구름을 하나씩 눌러 보세요. 글자 소리도 들어 봐요.',
    game: { type: 'gather', clouds: [
      { letter: '구', from: [210, 90],   to: [300, 190] },
      { letter: '름', from: [590, 70],  to: [420, 170] },
      { letter: '하', from: [320, 40],  to: [540, 195] },
      { letter: '늘', from: [600, 240], to: [360, 250] },
      { letter: '비', from: [220, 260], to: [480, 250] },
    ] },
    items: [['whale', 400, LINE.sea, { s: .95, mood: 'sad', anim: 'bob' }]] },

  { act: 4, bg: 'cloudy', line: '구름을 몰고 와요',
    ask: '구름이 몇 개 모였어?',
    items: [['cloud', 300, 190, { s: .8 }], ['cloud', 420, 170, { s: .8 }], ['cloud', 540, 195, { s: .8 }],
            ['cloud', 360, 250, { s: .8 }], ['cloud', 480, 250, { s: .8 }],
            ['whale', 400, LINE.sea, { s: .95, mood: 'happy', anim: 'bob' }]] },

  { act: 4, bg: 'cloudy', line: '구름에서 비가 톡톡',
    ask: '비가 오면 무슨 소리가 날까? 톡톡톡!',
    items: [['rain', 420, 250, { w: 300 }],
            ['cloud', 300, 190, { s: .8, tone: '#e3e9ee' }], ['cloud', 420, 170, { s: .8, tone: '#e3e9ee' }],
            ['cloud', 540, 195, { s: .8, tone: '#e3e9ee' }], ['cloud', 360, 250, { s: .8, tone: '#e3e9ee' }],
            ['cloud', 480, 250, { s: .8, tone: '#e3e9ee' }],
            ['whale', 400, LINE.sea, { s: .95, mood: 'happy', anim: 'bob' }]] },

  { act: 4, bg: 'cloudy', line: '비를 써 봐요', say: '비. 비를 손가락으로 써 봐요',
    ask: '초록 점에서 시작해요. 하나, 둘, 셋, 넷, 다섯 번에 써요.',
    game: { type: 'write', char: '비' },
    items: [['rain', 420, 250, { w: 300 }],
            ['cloud', 300, 190, { s: .8, tone: '#e3e9ee' }], ['cloud', 540, 195, { s: .8, tone: '#e3e9ee' }],
            ['whale', 400, LINE.sea, { s: .95, mood: 'happy', anim: 'bob' }]] },

  { act: 4, bg: 'cloudy', line: '비가 그쳤어요',
    ask: '비가 그치니까 고래로봇 기분이 어때?',
    items: [['cloud', 300, 190, { s: .8 }], ['cloud', 420, 170, { s: .8 }], ['cloud', 540, 195, { s: .8 }],
            ['star', 250, 120, {}], ['star', 600, 110, {}], ['star', 430, 80, { s: .7 }],
            ['whale', 400, LINE.sea, { s: .95, mood: 'happy', anim: 'bob' }]] },

  { act: 4, bg: 'cloudy', line: '구름에 타요',
    ask: '구름이 고래로봇을 둥실 태워 줬어요. 어디로 갈까?',
    items: [...onCloud(400, 400, .95, {}, 'bob')] },

  // ── 5막 · 하늘을 날아 ──────────────────────────
  { act: 5, bg: 'high', line: '하늘을 날아요!',
    ask: '고래로봇이 어디에 있어?',
    items: [...onCloud(400, 320, .9)] },

  { act: 5, bg: 'high', line: '발이 없어도 날아요',
    ask: '발이 없어도 할 수 있는 게 있네! 뭐였지?',
    items: [...onCloud(380, 330, .9), ['gull', 610, 230, { s: .9, anim: 'glide' }]] },

  { act: 5, bg: 'high', line: '섬 위를 날아요',
    ask: '저 아래 뭐가 보여? 고래로봇이 살던 섬이야.',
    items: [...onCloud(360, 300, .8)] },

  { act: 5, bg: 'high', line: '바다 위를 날아요',
    ask: '바다 위에 작은 게 보이지? 뭘까?',
    items: [...onCloud(460, 310, .8), ['gull', 220, 250, { s: .7, anim: 'glide' }]] },

  { act: 5, bg: 'high', line: '섬이 작아요',
    ask: '높이 올라가면 섬이 왜 작아 보일까?',
    items: [...onCloud(500, 280, .75)] },

  { act: 5, bg: 'cloudTop', line: '구름 위에서 쉬어요',
    ask: '구름 위에 누우면 어떤 느낌일까? 폭신폭신?',
    items: [['whale', 400, 470, { s: 1, mood: 'happy', anim: 'bob' }]] },

  { act: 5, bg: 'cloudTop', line: '쿨쿨',
    ask: '쉿, 고래로봇이 자요. 우리도 조용히 해 볼까?',
    items: [['whale', 400, 470, { s: 1, mood: 'sleepy', zzz: true }]] },

  { act: 5, bg: 'high', line: '다시 하늘로!',
    ask: '푹 쉬었어요. 이제 어디로 갈까?',
    items: [...onCloud(400, 300, .9)] },

  { act: 5, bg: 'sea', line: '배 위로 사뿐!',
    ask: '고래로봇이 어디에 내려오고 있어?',
    items: [SHIP(470, 1.05, { mood: 'happy', wave: true }),
            ...onCloud(520, 250, .55, {}, 'land')] },

  { act: 5, bg: 'sea', line: '배에 탔어요!',
    ask: '발이 없어도 배에 탔네. 어떻게 탔지?',
    items: [SHIP(420, 1.25, { mood: 'happy' }, { whale: { mood: 'happy' } })] },

  { act: 5, bg: 'sea', line: '해적로봇이 웃어요',
    ask: '해적로봇이 뭐라고 했을까? "우와, 고래로봇!"',
    items: [SHIP(420, 1.25, { mood: 'happy', wave: true }, { whale: { mood: 'happy' } }),
            ['heart', 250, 250, { s: 1, anim: 'bob' }]] },

  { act: 5, bg: 'sunset', line: '같이 타고 가자!',
    ask: '둘이 같이 어디로 갈까? 끝! 다시 볼까요?',
    items: [['ship', 420, LINE.sea, { s: 1.1, pirate: { mood: 'happy', wave: true }, whale: { mood: 'happy' }, anim: 'rock' }],
            ['gull', 640, 200, { s: .7, anim: 'glide' }]] },
];
