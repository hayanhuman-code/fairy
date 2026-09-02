/* =====================================================================
   받침·반복 검사 (check_batchim.js) — node check_batchim.js

   두 가지를 본다.
   ① 화면에 보이는 모든 한국어에 받침(종성)이 없는가
      판별: (code - 0xAC00) % 28 !== 0 이면 종성 있음
   ② 아이에게 여러 번 보여주기로 한 핵심 글자(CORE)가 실제로 반복되는가
      — 예전 판(장면 16개)은 서로 다른 글자 80종 중 24%가 딱 한 번만 나왔다.
        노출만 되고 반복이 없으면 읽기 연습이 되지 않는다.

   검사 대상(화면 표시): 책 제목·페이지 글월·쓰기 낱말·버튼 글자.
   제외(부모용·음성 전용): parentPrompt 류.
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const problems = [];
let checked = 0;

const batchimChars = str => [...String(str)].filter(ch => {
  const c = ch.codePointAt(0);
  return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
});

function check(where, str) {
  if (str == null || str === '') return;
  checked++;
  const bad = batchimChars(str);
  if (bad.length) problems.push({ where, str, bad: [...new Set(bad)].join(' ') });
}

/* pages.js 를 브라우저 흉내 컨텍스트에서 실행 */
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'pages.js'), 'utf8'), ctx, { filename: 'pages.js' });
const PAGES = ctx.window.PAGES;
const CORE = ctx.window.CORE || [];
if (!PAGES) { console.error('pages.js 에서 PAGES 를 읽지 못함'); process.exit(2); }

PAGES.forEach((p, i) => {
  check(`PAGES[${i}].text`, p.text);
  if (p.write) check(`PAGES[${i}].write.word`, p.write.word);
});

/* index.html 안의 아이용 글자 (제목·버튼) */
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
[[/<h1[^>]*>([^<]*)<\/h1>/g, '제목'],
 [/<button[^>]*>([^<]*)<\/button>/g, '버튼'],
 [/data-kid-text="([^"]*)"/g, '화면 글자']].forEach(([re, label]) => {
  let m; while ((m = re.exec(html))) check('index.html ' + label, m[1].replace(/[▶◀🔊🎵👪✍️↺]/g, '').trim());
});

/* book.js·write-page.js 안의 화면 라벨 */
['book.js', 'write-page.js'].forEach(f => {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) return;
  const m = fs.readFileSync(p, 'utf8').match(/KID_TEXT\s*=\s*\{([\s\S]*?)\n\s*\}/);
  if (m) (m[1].match(/"([^"]*)"/g) || []).forEach(s => check(f + ' KID_TEXT', s.slice(1, -1)));
});

/* ---------- 결과 ① 받침 ---------- */
if (problems.length) {
  console.log(`❌ 받침 발견 — ${problems.length}곳 (검사 ${checked}개 문자열)`);
  problems.forEach(p => console.log(`  ${p.where}: "${p.str}" ← 받침 글자: ${p.bad}`));
  process.exit(1);
}
console.log(`✅ 받침 없음 — 표시 문자열 ${checked}개 전부 통과`);

/* ---------- 결과 ② 글자 반복 ---------- */
const freq = new Map();
PAGES.forEach(p => [...(p.text || '')].forEach(ch => {
  if (ch >= '가' && ch <= '힣') freq.set(ch, (freq.get(ch) || 0) + 1);
}));
const syllables = [...PAGES].reduce((n, p) => n + [...(p.text || '')].filter(c => c >= '가' && c <= '힣').length, 0);
const perPage = (syllables / PAGES.length).toFixed(1);
const longest = PAGES.reduce((m, p) => Math.max(m, [...(p.text || '')].filter(c => c >= '가' && c <= '힣').length), 0);

console.log(`\n페이지 ${PAGES.length}개 · 글자 ${syllables}자 · 한 페이지 평균 ${perPage}자 · 제일 긴 줄 ${longest}자`);

const MIN = 3;
const weak = CORE.filter(c => (freq.get(c) || 0) < MIN);
console.log(`\n핵심 글자 ${CORE.length}자가 ${MIN}번 이상 나오는가`);
console.log('  ' + CORE.map(c => `${c}${freq.get(c) || 0}`).join('  '));
if (weak.length) {
  console.log(`  ⚠ ${MIN}번에 못 미치는 글자: ${weak.map(c => `${c}(${freq.get(c) || 0})`).join(', ')}`);
} else {
  console.log(`  ✅ 전부 ${MIN}번 이상`);
}
const once = [...freq].filter(([, n]) => n === 1).map(([c]) => c);
console.log(`\n서로 다른 글자 ${freq.size}종 · 딱 한 번만 나온 글자 ${once.length}종 (${Math.round(once.length / freq.size * 100)}%)`);
if (once.length) console.log('  ' + once.join(' '));
if (longest > 8) { console.log(`\n❌ 한 줄이 8자를 넘음 (${longest}자) — 큰 글자에서 두 줄로 접힌다. 더 쪼갤 것`); process.exit(1); }
