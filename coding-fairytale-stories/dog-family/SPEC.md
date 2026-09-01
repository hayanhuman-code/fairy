# 코딩 동화 사양서 — 보리와 두두 (강아지 네 마리의 비 오는 날)

## 1. 메타
- **폴더**: `coding-fairytale-stories/dog-family/`
- **작성일**: 2026-09-01
- **대상**: 한글을 막 배우기 시작한 만 4세 (글 못 읽는 아이 기준 + 무받침 읽기 연습)
- **특별 규칙**: 화면 표시 한국어 전부 **받침 없는 글자만** (`parentPrompt`·음성전용 문구 제외)
- **컨펌 상태**: ☐ 확인 대기

## 2. 한 줄 줄거리 (로그라인)
비가 와서 마당에서 못 놀게 된 강아지 자매 보리와 두두가, 아빠 코코와 브릭 배를
짓고 온 가족이 상상 항해(바다 또는 우주)를 떠난 뒤, 노래·이야기로 하루를 마무리한다.

## 3. 주제·정서
상상의 즐거움 — "여기 이대로도 어디든 갈 수 있어". 부모가 놀이의 공동 플레이어
(아빠=선장 역할극, 엄마=간식 요정). 명랑·포근, 위기 없음.
(이전 '도와주기·위로'(야옹이), '성장·기다림'(씨앗)과 겹치지 않음)

## 4. 등장인물
| 아이가 말한 것 | 캐릭터 키 | 역할 | 색·크기 | 표정변화 |
|---|---|---|---|---|
| **"동물들"**, **"블루이 같은"** (이 두 마디가 전부 → 강아지 가족 4마리로 구성) | dogBori(신규) | 보리 — 언니, 주인공 | 노랑 · scale 0.80 | ✅ happy/sad 신규 |
| 〃 | dogDudu(신규) | 두두 — 동생 | 하양+갈색 귀 · 0.65 | ✅ happy/sad 신규 |
| 〃 | dogMomo(신규) | 모모 — 엄마 | 크림 · 1.05 | ✅ happy/sad 신규 |
| 〃 | dogCoco(신규) | 코코 — 아빠 | 갈색 · 1.15 | ✅ happy/sad 신규 |

- "블루이 같은" 해석: 강아지 가족(자매+엄마아빠)의 집·마당 상상놀이 일상극.
  블루이의 실제 캐릭터·이름·설정은 쓰지 않음.
- ⚠️ "엄마·언니·동생·가족·강아지"는 전부 받침 단어 → **화면에는 이름만**.
  관계 설명은 `parentPrompt` 담당.
- 엔진 `dog`는 단색·표정 없음 → **engine.js 무수정** 확장: story.js 끝에서
  `DOMContentLoaded` 후 `ART`에 4색 변형(mood 지원, 기존 cat/dog 화풍)을 추가.
  (엔진은 렌더 시점에만 ART를 읽으므로 안전. 시작 화면 hero도 같은 시점에 채움)

## 5. 미니게임 구성 (3개 · build 1 / **write(쓰기)** 1 / math 1 · 정답 모두 과거와 다르게)
| 순서 | 종류 | 맥락 | 정답(정확히) | 비고 |
|---|---|---|---|---|
| 1 | build | 브릭으로 상상 배 짓기 | `slots: 5` (브릭×5) | 과거 build 3·4와 다름. loopHint 끔(받침 회피) |
| 2 | **write(쓰기·신규)** | 두두 간식 — **'바나나'를 손가락으로 직접 씀** | `word: "바나나"` | hangulssugi 리포의 획순 데이터·판정 방식 재사용 (사용자 요청) |
| 3 | math(덧셈) | 사과나무에서 사과 따기 | `a:4, b:1` (4+1=5, 합≤5) | 과거 3+2·2+2·5-2와 다름 |
- 정답 한 줄: **브릭×5 / 바나나(쓰기) / 4+1=5** (누적 풀: 자음ㄱㄴㄷ·ㄹㅁㅂ / 모음ㅏㅑㅓ·ㅗㅛㅜ·ㅡㅣㅐ / ABC / 3+2·2+2 / 5-2 / 친구·로봇·보물 / build3·4 — 전부 회피 확인)
- 무실패 처리는 엔진 기본 그대로(재구현 안 함). 화면 표시되는 `doneSay`는 무받침으로
  직접 지정(엔진 기본값에 받침 있음), 음성 전용 `tryAgainSay` 등은 자연스러운 문장 허용.

### 5-1. write 미니게임 (hangulssugi 참고 — 사용자 요청 반영)
- **글자 조립·획순 데이터**: hangulssugi의 `hangul-data.js`를 그대로 복사해 로드.
  `buildHangulItem("바나나")`이 음절별(`parts`) 획순 데이터를 만들어 줌 → 바·나·나를
  **한 글자씩 차례로** 씀 (한글쓰기 앱의 단어 방식 그대로).
- **안내(따라쓰기)**: 한글쓰기 v2의 3겹 가이드 재현 — ①연한 띠(16%) ②가는 점선 중심선
  ③획 바깥의 시작 배지+끝 화살표. 진입 시 획순 애니메이션 1회 자동 재생.
- **판정**: 한글쓰기의 `strokeFollows`(시작점·방향·경로 커버율만 보고 모양 채점 없음)를
  동화용으로 더 관대하게 이식. 획순대로 한 획씩 받음.
- **무실패**: 같은 획에서 2번 빗나가면 그 획을 잠깐 비춰 주고(힌트 플래시),
  4번째엔 그 획을 대신 그려 주고 다음 획으로 진행 (이야기가 멈추지 않게).
- **구현 위치**: 신규 `write-game.js` — engine.js 뒤에 로드되어 전역 `renderMinigame`을
  감싸 `game:"write"`만 가로챔. **engine.js는 무수정**, index.html에 `<script>` 2줄만 추가.
- 화면 표시 문구(전부 무받침): 음절 칩 `바·나·나`, 버튼 `지우기`·`다시 보기`,
  격려는 텍스트 없이 음성+배지 반짝임으로만.

## 6. 분기 · 멀티엔딩 (분기 2곳 · 엔딩 3종)
- **branchPoint**: `choice1` (엔딩의 '다른 선택 해보기' 복귀 지점)
- 분기 1 `choice1`: `바다로 가요`(→sea) / `우주로 가요`(→space). 이후 snack으로 합류
  → **어느 길이든 미니게임 3개 모두 경험**.
- 분기 2 `choice2`(최종): 엔딩 3택.
  - A. `우리 노래해요` → end_song: 마당 노래 파티. bgPlay.
  - B. `이야기 해 주세요` → end_tale: 밤, 코코의 이야기 듣고 잠들기. bgNight.
  - C. `다시 가요` → end_again: 배 타고 밤 우주로 한 바퀴 더. bgSpace.
    (엔진에 분기 상태 저장이 없어 '안 가 본 세계' 자동 선택은 불가 → 우주 고정)

## 7. 장면 흐름 (총 12장면 = 공통 8 + 루트 2 + 엔딩 3, 인접 장면 배경 모두 다름)
| # | id | type | bg | 요약 · 표시 자막(무받침) | next |
|---|---|---|---|---|---|
| 1 | intro | narrative | bgHouseDone | 아침 마당, 자매 그네(swing). "보리와 두두예요. 그네 타요" | rain |
| 2 | rain | narrative | bgLiving(신규) | 거실, 창밖 비. 코코: "우리 배 타고 가 보자" | build |
| 3 | build | minigame/build | bgRoom(신규) | 브릭 5개로 배 짓기 "우리 배 지어요" | choice1 |
| 4 | choice1 | choice | bgLiving | 배(boat prop)가 반짝. "어디로 가지?" (분기) | sea / space |
| 5a | sea | narrative | **bgSea**(미사용) | 상상 바다, 모모 합류, 고래와 노래. "우와 바다예요" | snack |
| 5b | space | narrative | **bgSpace**(미사용) | 배가 로케트로! "우와 우주예요. 슈우우" | snack |
| 6 | snack | minigame/**write** | bgSnow† | 구름 위 하얀 세계, 두두 시무룩 "배가 고파요" → '바나나' 손가락 쓰기(신규 prop) | orchard |
| 7 | orchard | minigame/math | **bgCastle**(미사용) | 사과나무(bigtree) 궁전 마당, 코코와 사과 따기 "4+1=?" | choice2 |
| 8 | choice2 | choice | bgSunset | 마당 노을 "비가 그쳐요. 이제 뭐 하지?" (3택) | 엔딩 3종 |
| - | end_song | narrative | bgPlay | 마당 노래 파티 "라라라 노래해요. 야호!" | null |
| - | end_tale | narrative | bgNight | 별 아래 이야기, 자매 잠들기 "이제 코 자요" | null |
| - | end_again | narrative | bgSpace | 밤 우주로 한 바퀴 더 "우리 또 가자!" | null |

† bgSnow는 프롬프트에 미사용으로 안내됐으나 실제로는 야옹이(이글루·눈밭 엔딩)에서
사용됨 → 이번엔 '구름 위 하얀 세계'라는 다른 맥락으로 재사용. bgSunset·bgNight·
bgPlay·bgHouseDone도 일상·엔딩 배경으로 재사용(상상 세계 3종은 전부 첫 사용).

## 8. BGM (audio/ 기존 mp3 3개 그대로)
- CALM(`bgm_lullaby`): intro·rain·choice1·choice2 / PLAY(`bgm_velvet`): build·sea·space·snack·orchard·end_song / END(`bgm_lullaby2`): end_tale·end_again

## 9. 신규 그림·파일 (engine.js 무수정)
- 캐릭터: dogBori·dogDudu·dogMomo·dogCoco (각 happy/sad, 기존 dog/cat 화풍) — `window.EXTRA_ART`로 story.js에 정의, write-game.js가 로드 후 ART에 설치
- 배경: bgLiving(거실+비 창문), bgRoom(놀이방)
- 소품: boat(브릭 배+돛), banana(바나나)
- 선택 버튼: btnWave(파도), btnRocket(로케트), btnNote(음표), btnMoon(달)
- 신규 파일: `hangul-data.js`(hangulssugi에서 복사), `write-game.js`(쓰기 미니게임),
  `check_batchim.js`(받침 검사 스크립트). index.html은 `<script>` 2줄 추가만.

## 10. 받침 없는 글자 규칙 (재확인)
- 검사 대상(화면 표시): title·subtitle·narration·choices[].label·doneSay·write의 word·
  write-game 버튼 라벨. 음성 전용(tryAgainSay·tap.say·countSay·choice say)과 parentPrompt는 제외.
- 판별: `(code-0xAC00)%28===0`. 빌드 후 story.js 전체를 훑는 검사 스크립트
  (`check_batchim.js`) 실행 결과를 빌드 로그에 기록.
- 문체: 현재형(~해요/~예요)·청유형(~하자)·목적격 조사 생략. 조사는 가/이/도/에/로/와/의/야만.

## 11. 이전 동화와 차별점
- 주제: 위로(야옹이)·성장(씨앗) → **상상놀이·가족 일상**(신규). 주인공 wolf·robot·cat → **dog 가족 4마리**(신규, 색·크기 구분).
- 구조: 처음으로 **부모 캐릭터가 놀이에 동참**, 분기 1이 '어느 세계로 갈까'(양쪽 다 정답).
- 학습: 처음으로 **표시 텍스트 전량 무받침** — 자막이 그대로 한글 읽기 연습 교재.
- 정답: 브릭×5·바나나·4+1 전부 신규. 배경: bgSea·bgSpace·bgCastle 첫 사용.

---
## 빌드 로그
- (빌드 후 기입) 검증 결과: 장면 수 — / 미니게임 수 — / 엔딩 수 — / 받침 검사 —
- 컨펌 대비 변경점: —
- 사후 수정: —
- 비고/다음에 참고할 점: —
