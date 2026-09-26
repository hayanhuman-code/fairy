// 고래로봇과 배 — 검사: node check.js
// ① 한 줄 8자 이하(공백 빼고, 문장부호 포함) ② 핵심 글자 20자가 3번 이상
// ③ 모든 쪽에 부모용 질문 ④ 그림·배경·놀이 이름이 실제로 있는지
const fs = require('fs'), vm = require('vm');
const ctx = {};
vm.createContext(ctx);
for (const f of ['art.js', 'pages.js']) vm.runInContext(fs.readFileSync(__dirname + '/' + f, 'utf8'), ctx);
const { PAGES, ART, BG } = vm.runInContext('({ PAGES, ART, BG })', ctx);
const GAME_TYPES = ['count', 'gather', 'write'];
const CORE = [...'로봇고래해적배섬구름하늘비바다타아직날발'];
const MAX = 8;

const errs = [], count = Object.fromEntries(CORE.map((c) => [c, 0]));
let total = 0;
PAGES.forEach((p, i) => {
  const n = p.line.replace(/\s/g, '').length;
  total += n;
  if (n > MAX) errs.push(`${i}쪽 "${p.line}" — ${n}자 (${MAX}자 넘음)`);
  if (!p.ask) errs.push(`${i}쪽 부모용 질문 없음`);
  if (!BG[p.bg]) errs.push(`${i}쪽 배경 "${p.bg}" 없음`);
  (p.items || []).forEach(([a]) => { if (!ART[a]) errs.push(`${i}쪽 그림 "${a}" 없음`); });
  if (p.game && !GAME_TYPES.includes(p.game.type)) errs.push(`${i}쪽 놀이 "${p.game.type}" 없음`);
  for (const c of p.line) if (c in count) count[c]++;
});
const few = CORE.filter((c) => count[c] < 3);
few.forEach((c) => errs.push(`핵심 글자 "${c}" — ${count[c]}번 (3번 미만)`));

console.log(`쪽 ${PAGES.length} · 글자 ${total}자 · 평균 ${(total / PAGES.length).toFixed(1)}자/쪽 · 최대 ${Math.max(...PAGES.map((p) => p.line.replace(/\s/g, '').length))}자`);
console.log(`놀이 ${PAGES.filter((p) => p.game).length}개 · 핵심 글자: ` + CORE.map((c) => `${c}${count[c]}`).join(' '));
if (errs.length) { console.log('\n❌ ' + errs.join('\n❌ ')); process.exit(1); }
console.log('✅ 통과');
