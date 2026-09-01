/* =====================================================================
   받침 검사 (check_batchim.js) — node check_batchim.js
   story.js의 화면 표시 문자열 + write-game.js의 버튼 라벨을 전부 훑어
   받침(종성) 있는 한글이 있으면 어디의 어느 글자인지 알려 준다.
   판별: 유니코드 (code - 0xAC00) % 28 !== 0 이면 종성 있음.

   검사 대상(화면에 실제로 표시되는 것):
     STORY.title / subtitle
     scene.narration                       — 자막(하단 카드·상단 배너)
     scene.choices[].label                 — 선택 버튼
     scene.doneSay                         — 미니게임 완료 배너
     scene.solution / scene.word           — order 타일 · write 쓰는 단어
     scene.itemLabel (loopHint일 때)       — build 힌트 배지
     write-game.js의 WG_LABELS             — 지우기 · 다시 보기 버튼
   제외(음성 전용·부모용): say·tryAgainSay·countSay·parentPrompt.
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const problems = [];
let checked = 0;

function batchimChars(str) {
  const bad = [];
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    if (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0) bad.push(ch);
  }
  return bad;
}
function check(where, str) {
  if (str == null || str === "") return;
  checked++;
  const bad = batchimChars(str);
  if (bad.length) problems.push({ where, str, bad: [...new Set(bad)].join(" ") });
}

/* story.js를 브라우저 흉내 컨텍스트에서 실행해 STORY를 얻는다 */
const ctx = { window: {}, document: undefined, console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'story.js'), 'utf8'), ctx, { filename: 'story.js' });
const STORY = ctx.window.STORY || ctx.STORY;
if (!STORY) { console.error('story.js에서 STORY를 읽지 못함'); process.exit(2); }

check('title', STORY.title);
check('subtitle', STORY.subtitle);
(STORY.scenes || []).forEach(sc => {
  const at = f => `scenes[${sc.id}].${f}`;
  check(at('narration'), sc.narration);
  check(at('doneSay'), sc.doneSay);
  if (sc.word) check(at('word'), sc.word);
  if (Array.isArray(sc.solution)) sc.solution.forEach((s, i) => check(at(`solution[${i}]`), s));
  if (sc.loopHint && sc.itemLabel) check(at('itemLabel'), sc.itemLabel);
  (sc.choices || []).forEach((c, i) => check(at(`choices[${i}].label`), c.label));
});

/* write-game.js의 화면 라벨 */
const wg = fs.readFileSync(path.join(dir, 'write-game.js'), 'utf8');
const m = wg.match(/WG_LABELS\s*=\s*\{([^}]*)\}/);
if (m) {
  const labels = m[1].match(/"([^"]+)"/g) || [];
  labels.forEach(l => check('write-game.WG_LABELS', l.slice(1, -1)));
} else {
  console.warn('경고: write-game.js에서 WG_LABELS를 찾지 못함');
}

/* 엔진 버튼을 갈아 끼우는 말(BTN_WORDS의 오른쪽 값) — 실제로 화면에 남는 글자 */
const bw = wg.match(/BTN_WORDS\s*=\s*\{([\s\S]*?)\}/);
if (bw) {
  const pairs = bw[1].match(/"[^"]*"\s*:\s*"([^"]*)"/g) || [];
  pairs.forEach(p => check('write-game.BTN_WORDS(바꾼 뒤)', p.split(':').pop().trim().slice(1, -1)));
} else {
  console.warn('경고: write-game.js에서 BTN_WORDS를 찾지 못함');
}

/* index.html에서 아이가 보는 버튼 글자 */
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const sb = html.match(/<button id="startBtn">([^<]*)<\/button>/);
if (sb) check('index.html startBtn', sb[1]);

/* 저장소 첫 화면(웹 주소로 들어오면 제일 먼저 보는 곳)의 아이용 글자 */
const home = path.join(dir, '..', '..', 'index.html');
if (fs.existsSync(home)) {
  const h = fs.readFileSync(home, 'utf8');
  const grab = (re, where) => { let m; while ((m = re.exec(h))) check(where, m[1].trim()); };
  grab(/<h1>([^<]*)<\/h1>/g, '홈 h1');
  grab(/class="name">([^<]*)</g, '홈 .name');
  grab(/class="sub">([^<]*)</g, '홈 .sub');
  grab(/class="go">([^<]*)</g, '홈 .go');
  const t = h.match(/<title>([^<]*)<\/title>/);
  if (t) check('홈 title', t[1]);
} else {
  console.warn('경고: 저장소 첫 화면(index.html)을 찾지 못함');
}

/* 결과 */
if (problems.length) {
  console.log(`❌ 받침 발견 — ${problems.length}곳 (검사 ${checked}개 문자열)`);
  problems.forEach(p => console.log(`  ${p.where}: "${p.str}" ← 받침 글자: ${p.bad}`));
  process.exit(1);
}
console.log(`✅ 통과 — 표시 문자열 ${checked}개 전부 받침 없음 (장면 ${(STORY.scenes || []).length}개)`);
