# 우리 아기 이야기 (코딩 동화)

한글을 막 배우는 아이와 함께 보는 웹 그림책 모음.

## 지금 있는 이야기

| 이야기 | 폴더 | 상태 |
|---|---|---|
| 고래로봇과 배 | `coding-fairytale-stories/whale-robot/` | 완성 · 40쪽 · 놀이 3개 (사다리 세기 · 구름 모으기 · '비' 쓰기) |

각 이야기 폴더의 `SPEC.md`에 사양과 빌드 로그가 있다.

> 예전 이야기 「보리와 두두」(`dog-family/`)는 2026-09-26에 지우고 처음부터 다시 시작했다.
> git 기록에는 남아 있다.

## 보는 방법

**웹**: `https://hayanhuman-code.github.io/fairy/`

**내 컴퓨터에서**: `index.html`을 브라우저로 열면 그대로 동작한다(빌드 과정 없음).

```bash
python3 -m http.server 8000   # 그 뒤 http://localhost:8000 접속
```

**태블릿 가로 화면**이 가장 보기 좋다. 음성은 브라우저의 한국어 TTS를 쓰므로,
한국어 음성이 없는 기기에서는 소리 없이 글자만 나온다.

## 파일 구성 (고래로봇과 배)

- `art.js` — SVG 그림 전부 + 배경 + 기준선(`LINE`)
- `pages.js` — 페이지 40개. 배경 · 그림 배치 · 한 줄 글월 · 부모용 질문 · 놀이
- `book.js` — 페이지 렌더러 · 글자 타일 · 읽어 주기 · 넘김
- `games.js` — 놀이 3종 · 효과음 · 따라 쓰기 획 데이터
- `check.js` — 줄 길이(8자) · 핵심 글자 3번 이상 · 부모용 질문 · 그림 이름 검사

```bash
cd coding-fairytale-stories/whale-robot && node check.js
```

## 웹에 올리기 (GitHub Pages)

`.github/workflows/pages.yml` 이 기본 브랜치에 푸시될 때마다 저장소를 통째로 배포한다.
최초 1회는 저장소 **Settings → Pages → Source 를 "GitHub Actions"** 로 켜 두어야 한다.
