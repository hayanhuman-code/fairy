# 우리 아기 이야기 (코딩 동화)

받침 없는 글자로만 쓴, 한글을 막 배우는 아이용 웹 동화 모음.

## 지금 있는 이야기

| 이야기 | 폴더 | 내용 |
|---|---|---|
| 보리와 두두 | `coding-fairytale-stories/dog-family/` | 강아지 가족 4마리의 비 오는 날 상상 항해. 장면 12 · 미니게임 3 · 엔딩 3 |

각 이야기 폴더의 `SPEC.md`에 사양과 빌드 로그가 있다.

## 보는 방법

**웹**: 아래 "웹에 올리기"를 한 번 해 두면 주소로 바로 볼 수 있다.

**내 컴퓨터에서**: `index.html`을 브라우저로 열면 그대로 동작한다(빌드 과정 없음).
주소창 없이 깔끔하게 보려면 간단한 서버를 띄워도 된다.

```bash
python3 -m http.server 8000   # 그 뒤 http://localhost:8000 접속
```

**태블릿 가로 화면**이 가장 보기 좋다. 폰 세로에서도 되지만 그림이 좌우로 잘린다.
소리(음성·배경음악)가 나오므로 볼륨을 확인할 것. 음성은 브라우저의 한국어 TTS를
쓰므로, 한국어 음성이 없는 기기에서는 소리 없이 자막만 나온다.

## 웹에 올리기 (GitHub Pages)

`.github/workflows/pages.yml` 이 기본 브랜치에 푸시될 때마다 저장소를 통째로 배포한다.
**최초 1회만 사람이 켜 줘야 한다**:

> 저장소 **Settings → Pages → Build and deployment → Source 를 "GitHub Actions"** 로 변경

워크플로가 `enablement: true` 로 대신 켜 보려 하지만, 자동 토큰에는 Pages 생성 권한이
없어 실패한다("Resource not accessible by integration"). 한 번 켠 뒤로는 푸시할 때마다
자동 배포된다. 켠 다음 **Actions → Deploy to GitHub Pages → Run workflow** 로 첫 배포를
직접 돌릴 수 있다.

주소: `https://hayanhuman-code.github.io/fairy/`

## 새 이야기를 만들 때

폴더 하나에 `index.html` · `engine.js` · `story.js` · `audio/` 가 한 벌이다.
**엔진(`engine.js`)은 건드리지 않고 `story.js` 만 새로 쓴다.**

- `story.js` — 장면·대사·캐릭터 배치. 이 이야기 전용 그림은 `window.EXTRA_ART` 에 담는다
  (story.js 가 engine.js 보다 먼저 로드되어 `ART` 에 직접 못 넣기 때문).
- `write-game.js` — 손가락으로 글자를 쓰는 미니게임(`game:"write"`).
  획순 데이터는 `hangul-data.js`(별도 저장소 `hangulssugi` 에서 가져옴)를 쓴다.
- `check_batchim.js` — 화면에 보이는 글자에 받침이 있는지 검사한다.

```bash
cd coding-fairytale-stories/dog-family && node check_batchim.js
```

받침 없이 글을 쓸 때 걸리는 것들은 `SPEC.md` 의 "다음에 참고할 점"에 정리해 두었다.
