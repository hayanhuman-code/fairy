# 우리 아기 이야기 (코딩 동화)

받침 없는 글자로만 쓴, 한글을 막 배우는 아이용 웹 동화 모음.

## 지금 있는 이야기

| 이야기 | 폴더 | 내용 |
|---|---|---|
| 보리와 두두 | `coding-fairytale-stories/dog-family/` | 받침 없는 글자 그림책. 페이지 42 · 글자 쓰기 1 |

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

이 책은 **엔진을 쓰지 않는다.** 예전에 쓰던 `engine.js` 에서 **그림만** 떼어
`art.js` 로 두고, 보여 주는 방식은 직접 짰다. 엔진을 그대로 쓰면 자막 크기·자동 넘김
같은 것이 엔진에 박혀 있어 바꿀 수 없기 때문이다.

- `art.js` — 엔진에서 떼어 온 그림 45종. (⚠️ `engine.js` 와 전역이 겹치니 같이 올리지 말 것)
- `story-art.js` — 이 이야기 전용 그림 (강아지 4마리·소품·배경)
- `pages.js` — 페이지 42개. 그림 배치 · 한 줄 글월 · 부모용 질문
- `book.js` — 페이지 렌더러. 글자 하나를 버튼으로 만들고, 읽어 줄 때 차례로 켠다
- `write-page.js` — 글자 쓰기. 혼자 도는 부품이라 `renderWritePage(그릇, 옵션)` 으로 부른다
- `hangul-data.js` — 획순 데이터 (별도 저장소 `hangulssugi` 에서 가져옴)
- `check_batchim.js` — 받침 · 핵심 글자 반복 · 줄 길이를 함께 검사한다

```bash
cd coding-fairytale-stories/dog-family && node check_batchim.js
```

검사는 세 가지를 본다 — ①화면 글자에 받침이 없는가 ②핵심 글자 20자가 3번 이상
나오는가 ③한 줄이 8자를 넘지 않는가. 받침 없이 글을 쓸 때 걸리는 것들과
설계 원칙은 `SPEC.md` 에 정리해 두었다.
