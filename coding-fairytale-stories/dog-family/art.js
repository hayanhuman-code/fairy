/* =====================================================================
   그림 자산 (art.js) — engine.js 에서 ART 객체만 떼어 온 것.
   엔진의 장면 진행·자막·미니게임 로직은 가져오지 않는다.
   이 책은 그림만 엔진에서 빌려 쓰고, 보여 주는 방식은 새로 짠다.

   ⚠️ engine.js 와 같은 페이지에 함께 올리지 말 것 — 둘 다 _uid·gid·ART 를
      전역으로 선언해서 나란히 두면 SyntaxError 가 난다. 새 그림책은
      engine.js 대신 이 파일을 쓴다. (지금 index.html 은 아직 engine.js 쪽)
   ===================================================================== */
let _uid = 0; const gid = (p) => p + (++_uid);
const ART = {
  rabbit: (s=120) => { const g=gid('rb'); return `<svg data-asset="rabbit" viewBox="0 0 140 172" width="${s}" height="${s*1.23}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fbe3ec"/></radialGradient></defs>
    <ellipse cx="70" cy="162" rx="44" ry="9" fill="#000" opacity=".07"/>
    <path d="M52 74 C40 32 44 6 57 9 C68 11 65 46 64 76 Z" fill="url(#${g})" stroke="#f3cdd9" stroke-width="2"/>
    <path d="M88 74 C100 32 96 6 83 9 C72 11 75 46 76 76 Z" fill="url(#${g})" stroke="#f3cdd9" stroke-width="2"/>
    <path d="M55 66 C50 38 52 20 57 22 C61 24 60 46 60 66 Z" fill="#f9b8cd"/>
    <path d="M85 66 C90 38 88 20 83 22 C79 24 80 46 80 66 Z" fill="#f9b8cd"/>
    <ellipse cx="70" cy="122" rx="41" ry="39" fill="url(#${g})"/>
    <ellipse cx="52" cy="154" rx="13" ry="9" fill="#fff" stroke="#f3cdd9" stroke-width="2"/>
    <ellipse cx="88" cy="154" rx="13" ry="9" fill="#fff" stroke="#f3cdd9" stroke-width="2"/>
    <circle cx="70" cy="88" r="35" fill="url(#${g})"/>
    <circle cx="58" cy="86" r="5.2" fill="#5b4636"/><circle cx="82" cy="86" r="5.2" fill="#5b4636"/>
    <circle cx="60" cy="84" r="1.7" fill="#fff"/><circle cx="84" cy="84" r="1.7" fill="#fff"/>
    <circle cx="49" cy="96" r="6.5" fill="#f9b8cd" opacity=".75"/><circle cx="91" cy="96" r="6.5" fill="#f9b8cd" opacity=".75"/>
    <ellipse cx="70" cy="97" rx="5" ry="3.6" fill="#f08fae"/>
    <path d="M63 103 Q70 109 77 103" stroke="#c98ba0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g stroke="#ecccd6" stroke-width="1.4" stroke-linecap="round">
      <line x1="57" y1="98" x2="38" y2="95"/><line x1="57" y1="101" x2="38" y2="105"/>
      <line x1="83" y1="98" x2="102" y2="95"/><line x1="83" y1="101" x2="102" y2="105"/></g>
  </svg>`; },
  pig: (s=120) => { const g=gid('pg'); return `<svg data-asset="pig" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#fcdce3"/><stop offset="1" stop-color="#f4b6c5"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="46" ry="9" fill="#000" opacity=".07"/>
    <path d="M40 54 L29 28 L57 46 Z" fill="#f0a8ba"/><path d="M100 54 L111 28 L83 46 Z" fill="#f0a8ba"/>
    <ellipse cx="70" cy="108" rx="43" ry="37" fill="url(#${g})"/>
    <rect x="47" y="134" width="14" height="12" rx="6" fill="#eaa6b6"/><rect x="79" y="134" width="14" height="12" rx="6" fill="#eaa6b6"/>
    <circle cx="70" cy="74" r="41" fill="url(#${g})"/>
    <ellipse cx="70" cy="87" rx="20" ry="14" fill="#f09fb1"/>
    <ellipse cx="62" cy="87" rx="3.8" ry="6" fill="#cf7d8e"/><ellipse cx="78" cy="87" rx="3.8" ry="6" fill="#cf7d8e"/>
    <circle cx="56" cy="66" r="5.2" fill="#5b4636"/><circle cx="84" cy="66" r="5.2" fill="#5b4636"/>
    <circle cx="58" cy="64" r="1.7" fill="#fff"/><circle cx="86" cy="64" r="1.7" fill="#fff"/>
    <circle cx="45" cy="78" r="6.5" fill="#e98ba0" opacity=".6"/><circle cx="95" cy="78" r="6.5" fill="#e98ba0" opacity=".6"/>
  </svg>`; },
  chick: (s=120) => { const g=gid('ck'); return `<svg data-asset="chick" viewBox="0 0 130 150" width="${s}" height="${s*1.15}">
    <defs><radialGradient id="${g}" cx="48%" cy="30%" r="74%"><stop offset="0" stop-color="#fff7d2"/><stop offset="1" stop-color="#fbdd86"/></radialGradient></defs>
    <ellipse cx="65" cy="140" rx="38" ry="8" fill="#000" opacity=".07"/>
    <ellipse cx="65" cy="100" rx="39" ry="37" fill="url(#${g})"/>
    <path d="M31 98 Q17 105 31 118 Q41 110 41 100 Z" fill="#f4cf72"/>
    <circle cx="65" cy="58" r="33" fill="url(#${g})"/>
    <path d="M57 30 Q61 15 66 30" stroke="#f1c95e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M66 30 Q72 16 75 32" stroke="#f1c95e" stroke-width="5" fill="none" stroke-linecap="round"/>
    <line x1="56" y1="135" x2="56" y2="147" stroke="#f0a04a" stroke-width="4" stroke-linecap="round"/>
    <line x1="74" y1="135" x2="74" y2="147" stroke="#f0a04a" stroke-width="4" stroke-linecap="round"/>
    <circle cx="55" cy="56" r="5.2" fill="#5b4636"/><circle cx="75" cy="56" r="5.2" fill="#5b4636"/>
    <circle cx="57" cy="54" r="1.7" fill="#fff"/><circle cx="77" cy="54" r="1.7" fill="#fff"/>
    <path d="M59 67 L71 67 L65 75 Z" fill="#f5a23f"/>
    <circle cx="45" cy="64" r="5.5" fill="#f3b76a" opacity=".6"/><circle cx="85" cy="64" r="5.5" fill="#f3b76a" opacity=".6"/>
  </svg>`; },
  mouse: (s=120) => { const g=gid('ms'); return `<svg data-asset="mouse" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#efeaf7"/><stop offset="1" stop-color="#d6cce8"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="40" ry="8" fill="#000" opacity=".07"/>
    <path d="M103 120 Q130 122 122 94" stroke="#cdbfe0" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="48" r="20" fill="url(#${g})"/><circle cx="96" cy="48" r="20" fill="url(#${g})"/>
    <circle cx="44" cy="50" r="11" fill="#f0bcd2"/><circle cx="96" cy="50" r="11" fill="#f0bcd2"/>
    <ellipse cx="70" cy="108" rx="39" ry="35" fill="url(#${g})"/>
    <circle cx="70" cy="76" r="35" fill="url(#${g})"/>
    <circle cx="58" cy="74" r="5.2" fill="#5b4636"/><circle cx="82" cy="74" r="5.2" fill="#5b4636"/>
    <circle cx="60" cy="72" r="1.7" fill="#fff"/><circle cx="84" cy="72" r="1.7" fill="#fff"/>
    <ellipse cx="70" cy="85" rx="5" ry="3.6" fill="#e98ba8"/>
    <circle cx="48" cy="83" r="6.5" fill="#e9a6c2" opacity=".6"/><circle cx="92" cy="83" r="6.5" fill="#e9a6c2" opacity=".6"/>
    <path d="M64 91 Q70 96 76 91" stroke="#b58ba0" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <g stroke="#cabfdd" stroke-width="1.4" stroke-linecap="round">
      <line x1="58" y1="86" x2="40" y2="83"/><line x1="58" y1="89" x2="40" y2="93"/>
      <line x1="82" y1="86" x2="100" y2="83"/><line x1="82" y1="89" x2="100" y2="93"/></g>
  </svg>`; },
  wolf: (s=240, mood="sad") => { const g=gid('wf'), b=gid('wb'); return `<svg data-asset="wolf" viewBox="0 0 220 232" width="${s}" height="${s*1.05}">
    <defs>
      <radialGradient id="${g}" cx="50%" cy="38%" r="66%"><stop offset="0" stop-color="#e8eef6"/><stop offset="1" stop-color="#c1cddc"/></radialGradient>
      <radialGradient id="${b}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#dde6f0"/></radialGradient>
    </defs>
    <ellipse cx="110" cy="220" rx="80" ry="11" fill="#000" opacity=".08"/>
    <ellipse cx="110" cy="162" rx="86" ry="66" fill="url(#${g})"/>
    <ellipse cx="72" cy="214" rx="22" ry="13" fill="#d2dbe8"/><ellipse cx="148" cy="214" rx="22" ry="13" fill="#d2dbe8"/>
    <path d="M52 72 L40 26 L86 60 Z" fill="url(#${g})" stroke="#b3c0d2" stroke-width="2"/>
    <path d="M168 72 L180 26 L134 60 Z" fill="url(#${g})" stroke="#b3c0d2" stroke-width="2"/>
    <path d="M59 67 L53 41 L80 60 Z" fill="#d9c2ce"/><path d="M161 67 L167 41 L140 60 Z" fill="#d9c2ce"/>
    <circle cx="110" cy="112" r="66" fill="url(#${g})"/>
    <ellipse cx="110" cy="134" rx="52" ry="43" fill="url(#${b})"/>
    <circle cx="86" cy="106" r="8" fill="#4a4a55"/><circle cx="134" cy="106" r="8" fill="#4a4a55"/>
    <circle cx="89" cy="103" r="2.6" fill="#fff"/><circle cx="137" cy="103" r="2.6" fill="#fff"/>
    <ellipse cx="110" cy="130" rx="13" ry="9" fill="#5a5a66"/>
    <path d="M110 139 L110 148" stroke="#9aa3b2" stroke-width="3" stroke-linecap="round"/>
    ${mood==="sad"
      ? `<path d="M96 160 Q110 152 124 160" stroke="#8a93a2" stroke-width="4" fill="none" stroke-linecap="round"/>
         <path d="M76 94 Q85 89 94 94" stroke="#9aa3b2" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M126 94 Q135 89 144 94" stroke="#9aa3b2" stroke-width="3" fill="none" stroke-linecap="round"/>
         <ellipse cx="80" cy="122" rx="5" ry="7" fill="#a9d2f0" opacity=".9"/>`
      : `<path d="M92 154 Q110 172 128 154" stroke="#8a93a2" stroke-width="4" fill="none" stroke-linecap="round"/>
         <circle cx="74" cy="130" r="11" fill="#f7b9cf" opacity=".5"/><circle cx="146" cy="130" r="11" fill="#f7b9cf" opacity=".5"/>`}
  </svg>`; },
  robot: (s=240, mood="sad") => { const g=gid('ro'); return `<svg data-asset="robot" viewBox="0 0 200 232" width="${s}" height="${s*1.16}">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eaf1f8"/><stop offset="1" stop-color="#b9c8dc"/></linearGradient></defs>
    <ellipse cx="100" cy="222" rx="66" ry="10" fill="#000" opacity=".08"/>
    <line x1="100" y1="40" x2="100" y2="22" stroke="#aab6c7" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="17" r="9" fill="#f6a96b"/>
    <rect x="70" y="196" width="22" height="26" rx="9" fill="#aab6c7"/><rect x="108" y="196" width="22" height="26" rx="9" fill="#aab6c7"/>
    <rect x="56" y="120" width="88" height="86" rx="22" fill="url(#${g})" stroke="#9fb0c6" stroke-width="3"/>
    <circle cx="100" cy="164" r="15" fill="#cfe0f0" stroke="#9fb0c6" stroke-width="2"/>
    <circle cx="100" cy="164" r="6" fill="#f6a96b"/>
    <rect x="30" y="128" width="20" height="52" rx="10" fill="#c2cedd"/><rect x="150" y="128" width="20" height="52" rx="10" fill="#c2cedd"/>
    <rect x="54" y="44" width="92" height="76" rx="24" fill="url(#${g})" stroke="#9fb0c6" stroke-width="3"/>
    <rect x="66" y="58" width="68" height="48" rx="15" fill="#3b4a5e"/>
    ${mood==="sad"
      ? `<circle cx="86" cy="78" r="7" fill="#9ad2f0"/><circle cx="114" cy="78" r="7" fill="#9ad2f0"/>
         <path d="M86 98 Q100 90 114 98" stroke="#9ad2f0" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M88 86 q-2 9 -2 16" stroke="#9ad2f0" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<circle cx="86" cy="76" r="7.5" fill="#7ee0a0"/><circle cx="114" cy="76" r="7.5" fill="#7ee0a0"/>
         <circle cx="88" cy="73.5" r="2" fill="#fff"/><circle cx="116" cy="73.5" r="2" fill="#fff"/>
         <path d="M84 92 Q100 104 116 92" stroke="#7ee0a0" stroke-width="3" fill="none" stroke-linecap="round"/>
         <circle cx="73" cy="92" r="6" fill="#f7b9cf" opacity=".5"/><circle cx="127" cy="92" r="6" fill="#f7b9cf" opacity=".5"/>`}
  </svg>`; },
  horse: (s=120) => { const g=gid('ho'); return `<svg data-asset="horse" viewBox="0 0 150 160" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#f1dcbb"/><stop offset="1" stop-color="#d6b184"/></radialGradient></defs>
    <ellipse cx="78" cy="150" rx="46" ry="9" fill="#000" opacity=".07"/>
    <path d="M118 102 Q138 112 128 142" stroke="#a87f50" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="80" cy="108" rx="46" ry="36" fill="url(#${g})"/>
    <rect x="56" y="132" width="13" height="20" rx="6" fill="#caa472"/><rect x="94" y="132" width="13" height="20" rx="6" fill="#caa472"/>
    <path d="M44 104 Q32 64 50 46 L74 58 Q64 88 66 106 Z" fill="url(#${g})"/>
    <ellipse cx="46" cy="46" rx="23" ry="20" fill="url(#${g})"/>
    <path d="M36 30 L31 15 L46 26 Z" fill="#d6b184"/><path d="M54 26 L58 13 L65 28 Z" fill="#d6b184"/>
    <path d="M60 30 Q72 52 60 96" stroke="#a87f50" stroke-width="9" fill="none" stroke-linecap="round"/>
    <ellipse cx="37" cy="54" rx="13" ry="10" fill="#e8c99e"/>
    <circle cx="33" cy="54" r="2.4" fill="#7a5a3a"/><circle cx="41" cy="56" r="2.4" fill="#7a5a3a"/>
    <circle cx="48" cy="42" r="4.6" fill="#5b4636"/><circle cx="49.5" cy="40.5" r="1.5" fill="#fff"/>
    <circle cx="56" cy="52" r="5" fill="#e89aa0" opacity=".5"/>
  </svg>`; },
  cat: (s=120, mood) => { const g=gid('ct'); return `<svg data-asset="cat" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#fdeede"/><stop offset="1" stop-color="#f3cda0"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="44" ry="9" fill="#000" opacity=".07"/>
    <path d="M40 60 L34 28 L62 50 Z" fill="url(#${g})"/><path d="M100 60 L106 28 L78 50 Z" fill="url(#${g})"/>
    <path d="M45 56 L42 38 L58 50 Z" fill="#f0b9c4"/><path d="M95 56 L98 38 L82 50 Z" fill="#f0b9c4"/>
    <ellipse cx="70" cy="106" rx="42" ry="36" fill="url(#${g})"/>
    <path d="M108 116 Q132 110 126 86" stroke="#e0b074" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="70" cy="72" r="38" fill="url(#${g})"/>
    <circle cx="57" cy="70" r="5.2" fill="#5b4636"/><circle cx="83" cy="70" r="5.2" fill="#5b4636"/>
    <circle cx="59" cy="68" r="1.7" fill="#fff"/><circle cx="85" cy="68" r="1.7" fill="#fff"/>
    <path d="M67 79 L73 79 L70 83 Z" fill="#e89aa0"/>
    ${mood==="sad"
      ? `<path d="M63 92 Q70 85 77 92" stroke="#7a5a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="58" cy="83" rx="3" ry="5" fill="#9ad2f0"/>`
      : `<path d="M63 86 Q70 94 77 86" stroke="#7a5a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`}
    <circle cx="48" cy="82" r="6" fill="#f0a8b6" opacity=".6"/><circle cx="92" cy="82" r="6" fill="#f0a8b6" opacity=".6"/>
    <g stroke="#e7c79c" stroke-width="1.5" stroke-linecap="round"><line x1="58" y1="82" x2="38" y2="78"/><line x1="58" y1="86" x2="38" y2="92"/><line x1="82" y1="82" x2="102" y2="78"/><line x1="82" y1="86" x2="102" y2="92"/></g>
  </svg>`; },
  dog: (s=120) => { const g=gid('dg'); return `<svg data-asset="dog" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#f5e3c8"/><stop offset="1" stop-color="#dab787"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="44" ry="9" fill="#000" opacity=".07"/>
    <ellipse cx="70" cy="106" rx="42" ry="36" fill="url(#${g})"/>
    <circle cx="70" cy="72" r="38" fill="url(#${g})"/>
    <ellipse cx="34" cy="74" rx="14" ry="27" fill="#b98a55"/><ellipse cx="106" cy="74" rx="14" ry="27" fill="#b98a55"/>
    <ellipse cx="70" cy="88" rx="20" ry="15" fill="#f7ecd8"/>
    <ellipse cx="70" cy="80" rx="7" ry="5" fill="#5a4636"/>
    <circle cx="57" cy="68" r="5.2" fill="#5b4636"/><circle cx="83" cy="68" r="5.2" fill="#5b4636"/>
    <circle cx="59" cy="66" r="1.7" fill="#fff"/><circle cx="85" cy="66" r="1.7" fill="#fff"/>
    <path d="M70 86 Q70 95 63 97" stroke="#7a5a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="48" cy="80" r="6" fill="#e8a07a" opacity=".5"/><circle cx="92" cy="80" r="6" fill="#e8a07a" opacity=".5"/>
  </svg>`; },
  bear: (s=120) => { const g=gid('be'); return `<svg data-asset="bear" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#e6c9a3"/><stop offset="1" stop-color="#c39b6e"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="44" ry="9" fill="#000" opacity=".07"/>
    <ellipse cx="70" cy="106" rx="44" ry="38" fill="url(#${g})"/>
    <circle cx="44" cy="46" r="16" fill="url(#${g})"/><circle cx="96" cy="46" r="16" fill="url(#${g})"/>
    <circle cx="44" cy="46" r="8" fill="#d8b48c"/><circle cx="96" cy="46" r="8" fill="#d8b48c"/>
    <circle cx="70" cy="74" r="38" fill="url(#${g})"/>
    <ellipse cx="70" cy="86" rx="18" ry="14" fill="#f0e0c8"/>
    <ellipse cx="70" cy="82" rx="6" ry="4.5" fill="#5a4636"/>
    <circle cx="57" cy="68" r="5.2" fill="#5b4636"/><circle cx="83" cy="68" r="5.2" fill="#5b4636"/>
    <circle cx="59" cy="66" r="1.7" fill="#fff"/><circle cx="85" cy="66" r="1.7" fill="#fff"/>
    <circle cx="48" cy="80" r="6" fill="#e0a07a" opacity=".45"/><circle cx="92" cy="80" r="6" fill="#e0a07a" opacity=".45"/>
  </svg>`; },
  dino: (s=120) => { const g=gid('di'); return `<svg data-asset="dino" viewBox="0 0 150 150" width="${s}" height="${s}">
    <defs><radialGradient id="${g}" cx="45%" cy="32%" r="72%"><stop offset="0" stop-color="#bce8b3"/><stop offset="1" stop-color="#7fc77f"/></radialGradient></defs>
    <ellipse cx="76" cy="142" rx="48" ry="8" fill="#000" opacity=".07"/>
    <path d="M120 110 Q146 104 138 80" stroke="#7fc77f" stroke-width="9" fill="none" stroke-linecap="round"/>
    <ellipse cx="74" cy="104" rx="46" ry="38" fill="url(#${g})"/>
    <path d="M52 72 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l8 12 Z" fill="#5fae5f"/>
    <rect x="54" y="132" width="14" height="16" rx="6" fill="#6cbb6c"/><rect x="84" y="132" width="14" height="16" rx="6" fill="#6cbb6c"/>
    <circle cx="74" cy="74" r="36" fill="url(#${g})"/>
    <circle cx="62" cy="70" r="5.2" fill="#3b4a3b"/><circle cx="86" cy="70" r="5.2" fill="#3b4a3b"/>
    <circle cx="64" cy="68" r="1.7" fill="#fff"/><circle cx="88" cy="68" r="1.7" fill="#fff"/>
    <path d="M66 84 Q74 90 82 84" stroke="#3b6a3b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="54" cy="80" r="6" fill="#f0a8b6" opacity=".5"/><circle cx="94" cy="80" r="6" fill="#f0a8b6" opacity=".5"/>
  </svg>`; },
  goat: (s=120) => { const g=gid('gt'); return `<svg data-asset="goat" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e0d6"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="44" ry="9" fill="#000" opacity=".07"/>
    <ellipse cx="70" cy="106" rx="42" ry="36" fill="url(#${g})"/>
    <rect x="50" y="134" width="13" height="16" rx="5" fill="#cfc7ba"/><rect x="78" y="134" width="13" height="16" rx="5" fill="#cfc7ba"/>
    <circle cx="70" cy="72" r="36" fill="url(#${g})"/>
    <path d="M52 44 Q44 26 50 20" stroke="#cbb58f" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M88 44 Q96 26 90 20" stroke="#cbb58f" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="39" cy="72" rx="12" ry="7" fill="#ded7ca" transform="rotate(-20 39 72)"/>
    <ellipse cx="101" cy="72" rx="12" ry="7" fill="#ded7ca" transform="rotate(20 101 72)"/>
    <circle cx="58" cy="68" r="5.2" fill="#5b4636"/><circle cx="82" cy="68" r="5.2" fill="#5b4636"/>
    <circle cx="60" cy="66" r="1.7" fill="#fff"/><circle cx="84" cy="66" r="1.7" fill="#fff"/>
    <ellipse cx="70" cy="84" rx="11" ry="8" fill="#efe7da"/>
    <circle cx="66" cy="84" r="1.8" fill="#9a8a78"/><circle cx="74" cy="84" r="1.8" fill="#9a8a78"/>
    <path d="M64 92 Q70 110 76 92 Z" fill="#f3efe7" stroke="#ded7ca" stroke-width="1.5"/>
    <circle cx="50" cy="80" r="6" fill="#f0c2c2" opacity=".5"/><circle cx="90" cy="80" r="6" fill="#f0c2c2" opacity=".5"/>
  </svg>`; },
  polarbear: (s=120) => { const g=gid('pb'); return `<svg data-asset="polarbear" viewBox="0 0 140 150" width="${s}" height="${s*1.07}">
    <defs><radialGradient id="${g}" cx="48%" cy="32%" r="72%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe9f0"/></radialGradient></defs>
    <ellipse cx="70" cy="140" rx="44" ry="9" fill="#000" opacity=".07"/>
    <ellipse cx="70" cy="106" rx="45" ry="38" fill="url(#${g})"/>
    <circle cx="44" cy="46" r="15" fill="url(#${g})"/><circle cx="96" cy="46" r="15" fill="url(#${g})"/>
    <circle cx="44" cy="46" r="7" fill="#cfe0ea"/><circle cx="96" cy="46" r="7" fill="#cfe0ea"/>
    <circle cx="70" cy="74" r="38" fill="url(#${g})"/>
    <ellipse cx="70" cy="86" rx="18" ry="14" fill="#eef5fa"/>
    <ellipse cx="70" cy="82" rx="6" ry="4.5" fill="#5a5a66"/>
    <circle cx="57" cy="68" r="5.2" fill="#4a4a55"/><circle cx="83" cy="68" r="5.2" fill="#4a4a55"/>
    <circle cx="59" cy="66" r="1.7" fill="#fff"/><circle cx="85" cy="66" r="1.7" fill="#fff"/>
    <circle cx="48" cy="80" r="6" fill="#bcd6ea" opacity=".6"/><circle cx="92" cy="80" r="6" fill="#bcd6ea" opacity=".6"/>
  </svg>`; },
  brick: (s=78) => { const g=gid('bk'); return `<svg data-asset="brick" viewBox="0 0 100 78" width="${s}" height="${s*0.78}">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ec9a6e"/><stop offset="1" stop-color="#d4794b"/></linearGradient></defs>
    <rect x="6" y="10" width="88" height="58" rx="11" fill="url(#${g})" stroke="#b8623a" stroke-width="3"/>
    <rect x="13" y="15" width="74" height="13" rx="5" fill="#fff" opacity=".2"/>
    <line x1="50" y1="40" x2="50" y2="66" stroke="#bd6b41" stroke-width="3"/>
    <line x1="10" y1="40" x2="90" y2="40" stroke="#bd6b41" stroke-width="3"/>
  </svg>`; },
  apple: (s=46) => { const g=gid('ap'); return `<svg viewBox="0 0 60 60" width="${s}" height="${s}">
    <defs><radialGradient id="${g}" cx="40%" cy="35%" r="65%"><stop offset="0" stop-color="#ff8a7a"/><stop offset="1" stop-color="#e3503f"/></radialGradient></defs>
    <path d="M30 16 C24 8 14 12 14 24 C14 40 24 52 30 52 C36 52 46 40 46 24 C46 12 36 8 30 16 Z" fill="url(#${g})"/>
    <rect x="28" y="8" width="4" height="9" rx="2" fill="#8a5a3a"/>
    <ellipse cx="38" cy="14" rx="7" ry="4" fill="#7ec97e" transform="rotate(-25 38 14)"/>
    <ellipse cx="22" cy="26" rx="5" ry="8" fill="#fff" opacity=".35"/></svg>`; },
  btnRun: () => `<svg viewBox="0 0 120 100"><g fill="#c3ccda"><ellipse cx="26" cy="74" rx="8" ry="11" transform="rotate(-18 26 74)"/><ellipse cx="46" cy="60" rx="7" ry="10" transform="rotate(-18 46 60)"/><ellipse cx="64" cy="48" rx="6.5" ry="9" transform="rotate(-18 64 48)"/><ellipse cx="80" cy="38" rx="6" ry="8" transform="rotate(-18 80 38)"/><ellipse cx="94" cy="30" rx="5" ry="7" transform="rotate(-18 94 30)"/></g><path d="M96 22 q10 -4 16 4" stroke="#aab4c4" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  btnApproach: () => `<svg viewBox="0 0 100 100"><path d="M50 84 C16 60 20 30 39 30 C49 30 50 41 50 41 C50 41 51 30 61 30 C80 30 84 60 50 84 Z" fill="#f6a5bd" stroke="#e98ba0" stroke-width="3"/><ellipse cx="40" cy="50" rx="6" ry="9" fill="#fff" opacity=".45"/></svg>`,
  btnBall: () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="36" fill="#ffd36b" stroke="#f0a83f" stroke-width="3"/><path d="M14 52 H86 M50 16 V88" stroke="#f0a83f" stroke-width="3.5" fill="none"/><path d="M22 28 Q50 52 22 76 M78 28 Q50 52 78 76" stroke="#f0a83f" stroke-width="3.5" fill="none"/><ellipse cx="38" cy="36" rx="9" ry="6" fill="#fff" opacity=".5"/></svg>`,
  btnHide: () => `<svg viewBox="0 0 110 100"><ellipse cx="55" cy="70" rx="44" ry="26" fill="#9fd2a2"/><ellipse cx="32" cy="62" rx="22" ry="18" fill="#b4dfb5"/><ellipse cx="78" cy="62" rx="22" ry="18" fill="#b4dfb5"/><ellipse cx="55" cy="56" rx="22" ry="18" fill="#a9d9ab"/><circle cx="46" cy="64" r="5" fill="#5b4636"/><circle cx="66" cy="64" r="5" fill="#5b4636"/><circle cx="47.5" cy="62.5" r="1.6" fill="#fff"/><circle cx="67.5" cy="62.5" r="1.6" fill="#fff"/></svg>`,
  btnStar: () => `<svg viewBox="0 0 100 100"><path d="M50 12 L61 40 L92 42 L67 62 L76 92 L50 74 L24 92 L33 62 L8 42 L39 40 Z" fill="#ffd86b" stroke="#f0b84a" stroke-width="3" stroke-linejoin="round"/><circle cx="42" cy="46" r="3" fill="#fff" opacity=".6"/></svg>`,
  btnHome: () => `<svg viewBox="0 0 100 100"><path d="M20 50 L50 24 L80 50 Z" fill="#d98a5a"/><rect x="28" y="48" width="44" height="36" rx="5" fill="#f0c89b" stroke="#cf9b66" stroke-width="3"/><rect x="44" y="62" width="14" height="22" rx="3" fill="#b87a4a"/></svg>`,

  /* ---- 소품(props): 이야기에 나오는 사물을 화면에 그려줌 ---- */
  sprout: (s=110) => `<svg data-asset="sprout" viewBox="0 0 100 100" width="${s}" height="${s}"><ellipse cx="50" cy="90" rx="26" ry="6" fill="#000" opacity=".08"/><ellipse cx="50" cy="88" rx="22" ry="8" fill="#cbb78f"/><path d="M50 88 L50 58" stroke="#6cae5f" stroke-width="5" stroke-linecap="round"/><path d="M50 66 Q28 60 24 40 Q46 42 51 64 Z" fill="#8fcf7f"/><path d="M50 60 Q72 52 78 32 Q54 36 50 60 Z" fill="#7ec06f"/></svg>`,
  bigtree: (s=260) => `<svg data-asset="bigtree" viewBox="0 0 200 240" width="${s}" height="${s*1.2}"><ellipse cx="100" cy="232" rx="60" ry="8" fill="#000" opacity=".08"/><rect x="88" y="148" width="24" height="86" rx="8" fill="#b07d4f"/><circle cx="100" cy="112" r="62" fill="#86c47f"/><circle cx="58" cy="132" r="44" fill="#97d18f"/><circle cx="142" cy="132" r="44" fill="#97d18f"/><circle cx="100" cy="78" r="40" fill="#9ad693"/>${[[70,100],[132,96],[100,132],[55,122],[146,126],[100,70]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#e3503f"/><circle cx="${x-3}" cy="${y-3}" r="3" fill="#ff9a8a"/>`).join("")}</svg>`,
  nest: (s=150) => `<svg data-asset="nest" viewBox="0 0 150 110" width="${s}" height="${s*0.73}"><ellipse cx="75" cy="100" rx="46" ry="7" fill="#000" opacity=".08"/><path d="M24 74 Q75 106 126 74 Q128 92 75 98 Q22 92 24 74 Z" fill="#c89a5e"/><ellipse cx="75" cy="70" rx="48" ry="21" fill="#b9863f"/><ellipse cx="75" cy="66" rx="37" ry="14" fill="#7a5a3a"/><ellipse cx="62" cy="66" rx="9" ry="7" fill="#f3ead2"/><ellipse cx="84" cy="64" rx="9" ry="7" fill="#f3ead2"/><ellipse cx="73" cy="70" rx="9" ry="7" fill="#f3ead2"/></svg>`,
  swing: (s=150) => `<svg data-asset="swing" viewBox="0 0 150 200" width="${s}" height="${s*1.33}"><path d="M32 6 L32 150" stroke="#b59a72" stroke-width="4"/><path d="M118 6 L118 150" stroke="#b59a72" stroke-width="4"/><rect x="22" y="150" width="106" height="16" rx="7" fill="#d18a52" stroke="#a86a3f" stroke-width="3"/><line x1="6" y1="8" x2="144" y2="8" stroke="#8a6a44" stroke-width="6" stroke-linecap="round"/></svg>`,
  seed: (s=110) => `<svg data-asset="seed" viewBox="0 0 100 80" width="${s}" height="${s*0.8}"><ellipse cx="50" cy="66" rx="30" ry="7" fill="#000" opacity=".08"/><ellipse cx="50" cy="62" rx="32" ry="12" fill="#cbb78f"/><ellipse cx="50" cy="50" rx="11" ry="15" fill="#9c6b3f"/><path d="M50 38 Q44 50 50 62 Q56 50 50 38 Z" fill="#7a5230" opacity=".6"/><ellipse cx="45" cy="46" rx="3" ry="5" fill="#fff" opacity=".4"/><path d="M70 30 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#ffe08a"/></svg>`,

  /* ---- 배경: 장면마다 다르게 (분기 느낌) ---- */
  _bg: (skyTop, skyBot, ground, extra="") => { const g=gid('bg'); return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#${g})"/>
    <ellipse cx="240" cy="470" rx="360" ry="130" fill="${ground}" opacity=".75"/>
    <ellipse cx="620" cy="492" rx="320" ry="130" fill="${ground}"/>
    <rect y="478" width="800" height="130" fill="${ground}"/>${extra}</svg>`; },
  _tree: (x, top='#9ccf9f', mid='#aedcb0') => `<g><rect x="${x-9}" y="300" width="18" height="152" rx="6" fill="#bd9a78"/><circle cx="${x}" cy="278" r="58" fill="${top}"/><circle cx="${x-36}" cy="300" r="40" fill="${mid}"/><circle cx="${x+36}" cy="300" r="40" fill="${mid}"/><circle cx="${x}" cy="260" r="34" fill="${mid}"/></g>`,
  _flowers: () => [[180,520,'#f7b9cf'],[330,556,'#fff3b0'],[470,524,'#cdb9f0'],[600,556,'#f7b9cf']].map(([x,y,c])=>`<g><circle cx="${x}" cy="${y}" r="6" fill="${c}"/><circle cx="${x-9}" cy="${y}" r="6" fill="${c}"/><circle cx="${x+9}" cy="${y}" r="6" fill="${c}"/><circle cx="${x}" cy="${y-9}" r="6" fill="${c}"/><circle cx="${x}" cy="${y+9}" r="6" fill="${c}"/><circle cx="${x}" cy="${y}" r="4" fill="#ffe08a"/></g>`).join(""),

  bgForest:    () => ART._bg('#def3e6','#eaf7ec','#bfe5c2', `<circle cx="680" cy="108" r="80" fill="#fff3c4" opacity=".35"/><circle cx="680" cy="108" r="62" fill="#fff3c4"/>${ART._tree(90)}${ART._tree(210)}${ART._tree(560)}${ART._tree(720)}${ART._flowers()}`),
  bgForestWolf:() => ART._bg('#cfe0ea','#e3eef1','#b3d4bd', `<ellipse cx="240" cy="120" rx="70" ry="30" fill="#fff" opacity=".7"/><ellipse cx="300" cy="135" rx="50" ry="24" fill="#fff" opacity=".6"/>${ART._tree(120,'#8ec293','#a3d3a8')}${ART._tree(660,'#8ec293','#a3d3a8')}`),
  bgBushes:    () => ART._bg('#e0f0e4','#eef7ee','#a9d6ad', `${ART._tree(140)}${ART._tree(680)}<ellipse cx="140" cy="540" rx="120" ry="60" fill="#8fc996"/><ellipse cx="640" cy="560" rx="150" ry="66" fill="#86c48d"/><ellipse cx="400" cy="585" rx="180" ry="60" fill="#9ad19f"/>`),
  bgWolfClose: () => ART._bg('#e9f3ec','#f5faef','#c4e7c7', `<circle cx="140" cy="120" r="70" fill="#fff6d6"/><circle cx="140" cy="120" r="52" fill="#fff1b8"/>${ART._flowers()}`),
  bgGate:      () => ART._bg('#e7e2f1','#f1eef9','#cdc2a6', `<rect x="300" y="150" width="200" height="300" rx="20" fill="#c9bfa8"/><rect x="330" y="190" width="140" height="260" rx="70" fill="#efe9da"/><rect x="288" y="138" width="224" height="34" rx="12" fill="#bcae90"/><circle cx="400" cy="120" r="44" fill="#fff3c4" opacity=".7"/>`),
  bgStream:    () => ART._bg('#dff0ec','#eaf7f2','#bfe5c2', `${ART._tree(110)}${ART._tree(710)}<path d="M0 470 Q400 430 800 470 L800 540 Q400 500 0 540 Z" fill="#9ad3ea"/><path d="M0 478 Q400 440 800 478" stroke="#bfe6f4" stroke-width="6" fill="none"/>`),
  bgOrchard:   () => ART._bg('#e7f3df','#f1f7e6','#bce0a0', `${[140,300,500,680].map(x=>`<g>${ART._tree(x,'#8fc77f','#a6d68f')}<circle cx="${x-18}" cy="285" r="7" fill="#e35040"/><circle cx="${x+20}" cy="270" r="7" fill="#e35040"/><circle cx="${x}" cy="300" r="7" fill="#e35040"/></g>`).join("")}`),
  bgHouse:     () => ART._bg('#fdeacf','#fbf1e1','#e7d0af', `<circle cx="132" cy="108" r="56" fill="#fff1c2"/><circle cx="660" cy="100" r="40" fill="#fff" opacity=".7"/><circle cx="700" cy="90" r="28" fill="#fff" opacity=".7"/>${[60,300,640,742].map(x=>`<path d="M${x} 484 q4 -22 8 0 q4 -26 8 0 q4 -22 8 0" stroke="#cbb78f" stroke-width="3" fill="none"/>`).join("")}`),
  bgHouseDone: () => ART._bg('#fdeacf','#fbf1e1','#e7d0af', `<circle cx="132" cy="108" r="56" fill="#fff1c2"/><g><rect x="120" y="300" width="200" height="170" rx="8" fill="#f0c89b" stroke="#cf9b66" stroke-width="4"/><path d="M104 300 L220 215 L336 300 Z" fill="#d98a5a" stroke="#b86a40" stroke-width="4"/><rect x="190" y="380" width="60" height="90" rx="6" fill="#b87a4a"/><rect x="140" y="330" width="48" height="40" rx="6" fill="#bfe5f0" stroke="#cf9b66" stroke-width="3"/></g>`),
  bgPlay:      () => ART._bg('#fdeedd','#fff5e8','#e7d0af', `<circle cx="120" cy="110" r="50" fill="#fff1c2"/>${ART._flowers()}<circle cx="600" cy="430" r="26" fill="#ffd36b" stroke="#f0a83f" stroke-width="3"/>`),
  bgSunset:    () => ART._bg('#ffd9a0','#ffb088','#dd9a6a', `<circle cx="400" cy="368" r="130" fill="#ffd89a" opacity=".4"/><circle cx="400" cy="368" r="96" fill="#ffce8a"/><circle cx="150" cy="120" r="4" fill="#fff" opacity=".8"/><circle cx="640" cy="92" r="3" fill="#fff" opacity=".7"/>`),
  bgSea:    () => ART._bg('#cdeaf2','#e4f4f8','#f1e0b0', `<circle cx="660" cy="106" r="60" fill="#fff3c4"/><path d="M0 420 Q400 392 800 420 L800 540 Q400 516 0 540 Z" fill="#7fc6e0"/><path d="M0 430 Q400 404 800 430" stroke="#bfe6f4" stroke-width="6" fill="none"/><path d="M0 486 Q200 470 400 486 T800 486" stroke="#a9def0" stroke-width="5" fill="none"/>`),
  bgSnow:   () => ART._bg('#dceaf5','#eef6fb','#eef4f8', `<circle cx="120" cy="110" r="50" fill="#fff7e0"/>${[120,260,520,680].map(x=>`<g><rect x="${x-8}" y="320" width="16" height="130" rx="5" fill="#bd9a78"/><circle cx="${x}" cy="300" r="50" fill="#cfe2ea"/><circle cx="${x}" cy="288" r="40" fill="#eef6fb"/></g>`).join("")}${[[180,520],[340,556],[480,524],[620,556],[90,500],[720,520],[300,510]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join("")}`),
  bgNight:  () => { const g=gid('ni'); return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4a78"/><stop offset="1" stop-color="#6a7bb0"/></linearGradient></defs><rect width="800" height="600" fill="url(#${g})"/><circle cx="660" cy="110" r="44" fill="#fdf6c8"/><circle cx="645" cy="100" r="38" fill="url(#${g})" opacity=".95"/>${[[100,90],[240,150],[400,80],[520,140],[720,200]].map(([x,y])=>`<path d="M${x} ${y-7} l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fdf6c8"/>`).join("")}<ellipse cx="240" cy="480" rx="340" ry="120" fill="#4e7a52"/><ellipse cx="640" cy="500" rx="320" ry="120" fill="#456f48"/><rect y="488" width="800" height="120" fill="#456f48"/></svg>`; },
  bgSpace:  () => { const g=gid('sp'); return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2350"/><stop offset="1" stop-color="#4a3f73"/></linearGradient></defs><rect width="800" height="600" fill="url(#${g})"/>${[[80,90],[200,150],[320,70],[520,120],[680,80],[740,210],[150,260],[600,240]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity=".9"/>`).join("")}<circle cx="640" cy="130" r="46" fill="#ffd86b"/><circle cx="624" cy="120" r="10" fill="#e8c25a"/><ellipse cx="400" cy="560" rx="520" ry="120" fill="#6b5e8f"/><rect y="540" width="800" height="80" fill="#6b5e8f"/><circle cx="200" cy="560" r="22" fill="#5a4f7a"/><circle cx="560" cy="575" r="30" fill="#5a4f7a"/></svg>`; },
  bgCastle: () => ART._bg('#e9e3f2','#f3eef9','#cfc2a6', `<circle cx="660" cy="110" r="56" fill="#fff3c4"/><g fill="#cdb9d6" stroke="#b3a0c4" stroke-width="3"><rect x="300" y="200" width="200" height="250"/><rect x="278" y="170" width="52" height="280"/><rect x="470" y="170" width="52" height="280"/><polygon points="278,170 304,118 330,170"/><polygon points="470,170 496,118 522,170"/></g><rect x="372" y="320" width="58" height="130" rx="27" fill="#9a86b0"/>`),
};
window.ART = ART;
