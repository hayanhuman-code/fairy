/* =====================================================================
   보리와 두두 — 그림책 (book.js)

   engine.js 를 쓰지 않는다. 엔진에서는 그림(art.js)만 빌려 온다.

   이 책이 하는 일은 하나다 — 받침 없는 글자를 아이 눈앞에 크게 내놓고,
   글자 하나하나를 소리와 이어 주는 것.
     · 한 페이지에 한 줄, 글자는 화면 폭의 7.4vw  (예전 자막은 27px 고정)
     · 글자 하나가 곧 버튼 — 누르면 그 소리만 또렷하게
     · 페이지가 열리면 글자를 하나씩 켜면서 읽어 준다 (소리 ↔ 모양)
     · 저절로 넘어가지 않는다. 넘기는 건 아이 손
   ===================================================================== */
(function () {
  'use strict';

  /* 화면에 보이는 글자 — 전부 받침 없음 (check_batchim.js 가 검사) */
  const KID_TEXT = {
    next: "가자 ▶",
    again: "다시 하자 ↺"
  };

  const BGM = {
    calm: "audio/bgm_lullaby.mp3",
    play: "audio/bgm_velvet.mp3",
    end:  "audio/bgm_lullaby2.mp3"
  };

  const el = id => document.getElementById(id);
  const isHangul = c => c >= '가' && c <= '힣';

  let idx = 0, voice = null, reading = 0, bgmOn = true, bgmEl = null, bgmNow = null;

  /* ---------- 목소리 ---------- */
  function pickVoice() {
    if (!window.speechSynthesis) return;
    const ko = speechSynthesis.getVoices().filter(v => (v.lang || '').toLowerCase().startsWith('ko'));
    // 또렷한 목소리를 먼저 (구글·자연음 계열)
    ko.sort((a, b) => score(b) - score(a));
    voice = ko[0] || null;
    function score(v) {
      const n = (v.name || '').toLowerCase();
      return (n.includes('google') ? 100 : 0) + (/natural|neural|premium|enhanced/.test(n) ? 60 : 0)
           + (v.localService === false ? 10 : 0);
    }
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  function say(text, done, rate) {
    if (!window.speechSynthesis || !text) { if (done) setTimeout(done, 380); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR'; if (voice) u.voice = voice;
    u.rate = rate || 0.82;      // 네 살이 따라올 만큼 천천히
    u.pitch = 1.15;
    let fired = false;
    const fin = () => { if (!fired) { fired = true; done && done(); } };
    u.onend = fin; u.onerror = fin;
    speechSynthesis.speak(u);
    // onend 가 안 오는 브라우저가 있어 읽는 시간을 어림한 타이머를 함께 건다
    setTimeout(fin, Math.max(700, text.length * 260));
  }
  const stopSpeech = () => { try { speechSynthesis.cancel(); } catch (e) {} };

  /* ---------- 배경 음악 ---------- */
  function setBgm(act) {
    const src = BGM[act] || BGM.calm;
    if (src === bgmNow) return;
    bgmNow = src;
    if (!bgmEl) { bgmEl = new Audio(); bgmEl.loop = true; bgmEl.volume = 0.28; }
    bgmEl.src = src;
    if (bgmOn) bgmEl.play().catch(() => {});
  }

  /* ---------- 그림 ---------- */
  function drawPicture(p) {
    el('bg').innerHTML = ART[p.bg] ? ART[p.bg]() : '';
    const stage = el('stage');
    stage.innerHTML = '';
    (p.props || []).forEach(o => place(stage, o, 'prop'));
    (p.actors || []).forEach(o => place(stage, o, 'actor'));
    stage.className = 'pageIn';
    void stage.offsetWidth;
  }
  function place(stage, o, cls) {
    const d = document.createElement('div');
    d.className = cls + (o.bob ? ' bob' : '');
    d.style.cssText = `left:${o.x};top:${o.y};transform:scale(${o.scale || 1})`;
    d.innerHTML = ART[o.art] ? ART[o.art](o.size || 120, o.mood || 'happy') : '';
    stage.appendChild(d);
  }

  /* ---------- 글 — 글자 하나가 곧 버튼 ---------- */
  function drawLine(text) {
    const line = el('line');
    line.innerHTML = '';
    [...text].forEach(ch => {
      const b = document.createElement('button');
      const blank = (ch === ' ');
      b.className = 'syl' + (blank ? ' gap' : '');
      b.textContent = blank ? '' : ch;
      if (isHangul(ch)) {
        b.setAttribute('aria-label', ch);
        b.addEventListener('click', () => {
          // 읽어 주던 도중이라도 아이 손이 먼저다. 읽기를 멈추고 이 글자만 들려준다.
          reading = 0;
          [...line.children].forEach(x => x.classList.remove('tapped', 'now'));
          b.classList.add('tapped');
          stopSpeech();
          say(ch, null, 0.75);          // 한 글자는 더 천천히
        });
      } else {
        b.disabled = true; b.style.cursor = 'default';
      }
      line.appendChild(b);
    });
  }

  /* 읽어 주기 — 글자를 하나씩 켜면서 읽고, 마지막에 한 줄을 이어서 */
  function readAloud() {
    const token = ++reading;
    const line = el('line');
    const tiles = [...line.children].filter(b => isHangul(b.textContent));
    let i = 0;
    const clear = () => tiles.forEach(t => t.classList.remove('now'));
    const step = () => {
      if (token !== reading) return;
      clear();
      if (i >= tiles.length) {
        say(PAGES[idx].text, () => { if (token === reading) reading = 0; });
        return;
      }
      const t = tiles[i++];
      t.classList.add('now');
      say(t.textContent, () => setTimeout(step, 80), 0.75);
    };
    step();
  }

  /* ---------- 페이지 ---------- */
  function drawDots() {
    el('dots').innerHTML = PAGES.map((_, i) => `<div class="dot${i === idx ? ' on' : ''}"></div>`).join('');
  }

  function show(n) {
    if (n < 0) n = 0;
    const last = n >= PAGES.length;
    idx = last ? PAGES.length - 1 : n;
    const p = PAGES[idx];

    reading = 0; stopSpeech();
    setBgm(p.act);
    drawPicture(p); drawLine(p.text); drawDots();
    el('parent').innerHTML = `<b>👪 같이 보기</b><br>${p.ask || ''}`;
    el('back').disabled = (idx === 0);
    el('next').textContent = (idx === PAGES.length - 1) ? KID_TEXT.again : KID_TEXT.next;

    const wrap = el('writeBox');
    if (p.write && window.renderWritePage) {
      wrap.style.display = 'block';
      wrap.innerHTML = '';
      renderWritePage(wrap, {
        word: p.write.word, index: p.write.index,
        say, stop: stopSpeech,
        onDone: () => { el('next').disabled = false; say("우와! 다 써서 고마워요!"); }
      });
      el('next').disabled = true;           // 다 쓰면 열린다
      setTimeout(() => say(p.text), 300);
    } else {
      wrap.style.display = 'none'; wrap.innerHTML = '';
      el('next').disabled = false;
      setTimeout(readAloud, 350);
    }
  }

  /* ---------- 손잡이 ---------- */
  el('next').addEventListener('click', () => {
    if (idx === PAGES.length - 1) show(0); else show(idx + 1);
  });
  el('back').addEventListener('click', () => show(idx - 1));
  el('listen').addEventListener('click', () => { if (!PAGES[idx].write) readAloud(); else say(PAGES[idx].text); });
  el('bgm').addEventListener('click', () => {
    bgmOn = !bgmOn;
    el('bgm').classList.toggle('off', !bgmOn);
    el('bgm').textContent = bgmOn ? '🎵' : '🔇';
    if (bgmEl) { if (bgmOn) bgmEl.play().catch(() => {}); else bgmEl.pause(); }
  });
  el('parentBtn').addEventListener('click', () => {
    const p = el('parent');
    p.style.display = (p.style.display === 'block') ? 'none' : 'block';
  });
  // 스페이스·오른쪽 화살표로도 넘김 (어른이 옆에서 넘겨 줄 때)
  document.addEventListener('keydown', e => {
    if (el('start').style.display !== 'none') { if (e.key === ' ' || e.key === 'Enter') el('go').click(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (!el('next').disabled) el('next').click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (!el('back').disabled) el('back').click(); }
  });

  /* ---------- 시작 ---------- */
  if (window.EXTRA_ART) Object.assign(ART, window.EXTRA_ART);   // 강아지·소품·배경 합치기
  el('startArt').innerHTML = ART.dogBori ? ART.dogBori(240, 'happy') : '';
  el('go').addEventListener('click', () => {
    el('start').style.display = 'none';
    say('');                       // 첫 터치에 음성을 깨운다 (iOS)
    show(0);
  });
})();
