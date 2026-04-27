<sub>🌐 <a href="README.en.md">English</a> · <a href="README.md">中文</a> · <b>한국어</b></sub>

<div align="center">

# Huashu Design

> *「타이핑. 엔터. 바로 납품 가능한 디자인.」*
> *"Type. Hit enter. A finished design lands in your lap."*

[![License](https://img.shields.io/badge/License-Personal%20Use%20Only-orange.svg)](LICENSE)
[![Agent-Agnostic](https://img.shields.io/badge/Agent-Agnostic-blueviolet)](https://skills.sh)
[![Skills](https://img.shields.io/badge/skills.sh-Compatible-green)](https://skills.sh)

<br>

**에이전트(agent)에게 한 마디만 건네면, 바로 납품 가능한 디자인이 돌아옵니다.**

<br>

3분에서 30분 안에 **제품 출시 애니메이션**, 실제로 클릭 가능한 앱 프로토타입, 편집 가능한 PPT, 인쇄 수준의 인포그래픽을 완성할 수 있습니다.

"AI가 만든 것 치고는 괜찮다"는 수준이 아닙니다. 대형 IT 기업 디자인 팀이 만든 것처럼 보입니다. 브랜드 자산(로고, 컬러 팔레트, UI 스크린샷)을 제공하면 브랜드 아이덴티티를 정확히 반영하고, 아무것도 제공하지 않아도 내장된 20가지 디자인 어휘로 AI 특유의 진부함 없이 결과물을 만들어냅니다.

**이 README에 있는 모든 애니메이션은 huashu-design이 직접 만들었습니다.** Figma도 After Effects도 아닌, 프롬프트 한 줄과 skill 실행만으로 완성했습니다. 다음 제품 출시 홍보 영상, 이제 여러분도 만들 수 있습니다.

```
npx skills add alchaincyf/huashu-design
```

에이전트를 가리지 않습니다 — Claude Code, Cursor, Codex, OpenClaw, Hermes 모두 설치 가능합니다.

[데모 갤러리 보기](#데모-갤러리) · [설치하기](#바로-사용하기) · [기능 소개](#기능-소개) · [핵심 메커니즘](#핵심-메커니즘) · [Claude Design과의 관계](#claude-design과의-관계)

</div>

---

<p align="center">
  <img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/hero-animation-v10-en.gif" alt="huashu-design Hero · 타이핑 → 방향 선택 → 갤러리 전개 → 포커스 → 브랜드 등장" width="100%">
</p>

<p align="center"><sub>
  ▲ 25초 · Terminal → 4방향 → Gallery ripple → 4회 Focus → Brand reveal<br>
  👉 <a href="https://www.huasheng.ai/huashu-design-hero/">음향 효과 포함 HTML 인터랙티브 버전 보기</a> ·
  <a href="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/hero-animation-v10-en.mp4">MP4 다운로드 (BGM+SFX 포함 · 10MB)</a>
</sub></p>

---

## 바로 사용하기

```bash
npx skills add alchaincyf/huashu-design
```

설치 후 Claude Code에서 바로 말을 걸어보세요:

```
「AI 심리학 강연 PPT를 만들어줘. 스타일 방향 3가지를 추천해서 고를 수 있게 해줘」
「AI 뽀모도로 타이머 iOS 프로토타입 만들어줘. 핵심 화면 4개가 실제로 클릭되어야 해」
「이 내용을 60초 애니메이션으로 만들고 MP4와 GIF로 내보내줘」
「이 디자인을 5가지 차원으로 전문가 리뷰해줘」
```

버튼도, 패널도, Figma 플러그인도 필요 없습니다.

---

## Star 추이

<p align="center">
  <a href="https://star-history.com/#alchaincyf/huashu-design&Date">
    <img src="https://api.star-history.com/svg?repos=alchaincyf/huashu-design&type=Date" alt="huashu-design Star History" width="80%">
  </a>
</p>

---

## 기능 소개

| 기능 | 결과물 | 소요 시간 |
|------|--------|----------|
| 인터랙티브 프로토타입 (앱 / 웹) | 단일 HTML 파일 · 실제 iPhone 베젤 · 클릭 가능 · Playwright 검증 | 10–15분 |
| 발표 슬라이드 | HTML 덱 (브라우저 발표용) + 편집 가능한 PPTX (텍스트 상자 유지) | 15–25분 |
| 타임라인 애니메이션 | MP4 (25fps / 60fps 보간) + GIF (팔레트 최적화) + BGM | 8–12분 |
| 디자인 변형 | 3개 이상 나란히 비교 · Tweaks 실시간 파라미터 조정 · 다차원 탐색 | 10분 |
| 인포그래픽 / 데이터 시각화 | 인쇄 수준 레이아웃 · PDF/PNG/SVG 내보내기 | 10분 |
| 디자인 방향 컨설팅 | 5개 유파 × 20종 디자인 철학 · 방향 3가지 추천 · 데모 병렬 생성 | 5분 |
| 5차원 전문가 리뷰 | 레이더 차트 + Keep/Fix/Quick Wins · 실행 가능한 수정 목록 | 3분 |

---

## 데모 갤러리

### 디자인 방향 컨설팅

요구사항이 모호할 때의 폴백(fallback): 5개 유파 × 20종 디자인 철학에서 차별화된 방향 3가지를 선별해 데모 3개를 병렬로 생성하여 선택할 수 있게 합니다.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/w3-fallback-advisor.gif" width="100%"></p>

### iOS 앱 프로토타입

iPhone 15 Pro 정밀 베젤 (Dynamic Island / 상태 표시줄 / Home Indicator) · 상태 기반 다중 화면 전환 · 실제 이미지는 Wikimedia/Met/Unsplash에서 가져옴 · Playwright 자동 클릭 테스트.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/c1-ios-prototype.gif" width="100%"></p>

### 모션 디자인 엔진

Stage + Sprite 타임 슬라이스 모델 · `useTime` / `useSprite` / `interpolate` / `Easing` 4가지 API로 모든 애니메이션 요구사항 처리 · 명령 하나로 MP4 / GIF / 60fps 보간 / BGM 포함 완성본 내보내기.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/c3-motion-design.gif" width="100%"></p>

### HTML 슬라이드 → 편집 가능한 PPTX

HTML 덱 브라우저 발표 · `html2pptx.js`가 DOM의 computedStyle을 읽어 요소별로 PowerPoint 객체로 변환 · 내보낸 파일은 **실제 텍스트 상자**이며, 이미지로 깔린 것이 아닙니다.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/c2-slides-pptx.gif" width="100%"></p>

### Tweaks · 실시간 변형 전환

색상 / 서체 / 정보 밀도 등 파라미터화 · 사이드 패널 전환 · 순수 프론트엔드 + `localStorage` 영속화 · 새로고침해도 유지.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/c4-tweaks.gif" width="100%"></p>

### 인포그래픽 / 데이터 시각화

매거진 수준 레이아웃 · CSS Grid 정밀 컬럼 분할 · `text-wrap: pretty` 타이포그래피 세부 설정 · 실제 데이터 기반 · PDF 벡터 / PNG 300dpi / SVG 내보내기 가능.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/c5-infographic.gif" width="100%"></p>

### 5차원 전문가 리뷰

철학적 일관성 · 시각적 위계 · 세부 실행력 · 기능성 · 혁신성 각 0–10점 · 레이더 차트 시각화 · Keep / Fix / Quick Wins 목록 출력.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/c6-expert-review.gif" width="100%"></p>

### 주니어 디자이너 워크플로

무작정 큰 결과물을 만들지 않습니다: 먼저 가정(assumptions), 플레이스홀더, 근거(reasoning)를 작성하고 빠르게 보여준 뒤 반복합니다. 잘못 이해했을 때 빨리 수정할수록 비용이 100배 줄어듭니다.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/w2-junior-designer.gif" width="100%"></p>

### 브랜드 자산 프로토콜 5단계 강제 프로세스

특정 브랜드가 관련될 때 강제 실행: 묻기 → 검색 → 다운로드 (3단계 폴백) → 색상 값 grep → `brand-spec.md` 작성.

<p align="center"><img src="https://github.com/alchaincyf/huashu-design/releases/download/v2.0/w1-brand-protocol.gif" width="100%"></p>

---

## 핵심 메커니즘

### 브랜드 자산 프로토콜

skill에서 가장 엄격한 규칙입니다. 특정 브랜드(Stripe, Linear, Anthropic, 자사 등)가 관련될 때 5단계를 강제로 실행합니다:

| 단계 | 행동 | 목적 |
|------|------|------|
| 1 · 묻기 | 사용자에게 브랜드 가이드라인이 있는지 확인 | 기존 자산 존중 |
| 2 · 공식 브랜드 페이지 검색 | `<brand>.com/brand` · `brand.<brand>.com` · `<brand>.com/press` | 공식 색상 값 확보 |
| 3 · 자산 다운로드 | SVG 파일 → 공식 사이트 HTML 전문 → 제품 스크린샷에서 색상 추출 | 3단계 폴백, 앞 단계 실패 시 즉시 다음 단계로 |
| 4 · grep으로 색상 값 추출 | 자산에서 모든 `#xxxxxx` 추출, 빈도순 정렬, 무채색 필터링 | **절대 기억에서 브랜드 색상을 추측하지 않음** |
| 5 · 스펙 고정 | `brand-spec.md` + CSS 변수 작성, 모든 HTML에서 `var(--brand-*)` 참조 | 고정하지 않으면 잊어버림 |

A/B 테스트(v1 대 v2, 각 6개 에이전트 실행): **v2의 안정성 분산이 v1보다 5배 낮습니다.** 안정성의 안정성, 이것이 skill의 진정한 경쟁 우위입니다.

### 디자인 방향 컨설팅 (폴백)

사용자 요구사항이 너무 모호해 작업을 시작할 수 없을 때 작동합니다:

- 막연한 직관으로 억지로 만들지 않고, 폴백 모드로 진입합니다
- 5개 유파 × 20종 디자인 철학에서 **반드시 서로 다른 유파**에서 온 차별화된 방향 3가지를 추천합니다
- 각 방향에는 대표 작품, 분위기 키워드, 대표 디자이너를 포함합니다
- 시각적 데모 3개를 병렬로 생성하여 사용자가 선택하도록 합니다
- 선택 후 주니어 디자이너 메인 플로우로 진입합니다

### 주니어 디자이너 워크플로

기본 작업 모드로, 모든 작업에 걸쳐 적용됩니다:

- 작업 시작 전 질문 목록을 한 번에 사용자에게 전달하고, 모든 답변을 받은 후 작업 시작
- HTML에 가정(assumptions), 플레이스홀더, 근거 주석(reasoning comments) 먼저 작성
- 가능한 한 빨리 사용자에게 보여줌 (회색 박스여도 좋음)
- 실제 콘텐츠 채우기 → 변형 생성 → Tweaks 적용 세 단계마다 각각 한 번씩 더 보여줌
- 납품 전 Playwright로 브라우저에서 육안 확인

### 반(反) AI 진부함 규칙

한눈에 AI 작품인 것을 알 수 있는 시각적 최대공약수를 피합니다 (보라색 그라디언트 / 이모지 아이콘 / 둥근 모서리 + 왼쪽 border accent / SVG로 그린 얼굴 / Inter로 디스플레이 처리). 대신 `text-wrap: pretty` + CSS Grid + 신중하게 선택한 serif 디스플레이 서체와 oklch 색상을 사용합니다.

---

## Claude Design과의 관계

솔직하게 인정합니다: 브랜드 자산 프로토콜의 철학은 커뮤니티에 공유된 Claude Design의 프롬프트에서 배웠습니다. 그 프롬프트는 **좋은 고충실도 디자인은 백지에서 시작하는 것이 아니라, 이미 존재하는 디자인 컨텍스트에서 자라난다**고 반복해서 강조했습니다. 이 원칙이 65점 결과물과 90점 결과물을 가르는 분기점입니다.

포지셔닝 차이:

| | Claude Design | huashu-design |
|---|---|---|
| 형태 | 웹 제품 (브라우저에서 사용) | skill (Claude Code에서 사용) |
| 쿼터 | 구독 쿼터 | API 소비 · 에이전트 병렬 실행 시 쿼터 제한 없음 |
| 결과물 | 캔버스 내 + Figma 내보내기 가능 | HTML / MP4 / GIF / 편집 가능한 PPTX / PDF |
| 작동 방식 | GUI (클릭, 드래그, 수정) | 대화 (말하고, 에이전트가 완성할 때까지 대기) |
| 복잡한 애니메이션 | 제한적 | Stage + Sprite 타임라인 · 60fps 내보내기 |
| 크로스 에이전트 | Claude.ai 전용 | 모든 skill 호환 에이전트 |

Claude Design은 **더 나은 그래픽 도구**이고, huashu-design은 **그래픽 도구라는 계층 자체를 없애는 것**입니다. 두 가지 방향, 서로 다른 사용자.

---

## Limitations

- **레이어 단위로 편집 가능한 PPTX에서 Figma로의 변환은 지원하지 않습니다.** HTML을 결과물로 제공하며, 스크린샷, 녹화, 이미지 내보내기는 가능하지만 Keynote에서 텍스트 위치를 드래그해 바꾸는 것은 불가능합니다.
- **Framer Motion 수준의 복잡한 애니메이션은 지원하지 않습니다.** 3D, 물리 시뮬레이션, 파티클 시스템은 skill의 범위를 벗어납니다.
- **완전히 빈 브랜드를 처음부터 디자인하면 품질이 60–65점으로 떨어집니다.** 아무 컨텍스트 없이 고충실도 디자인을 만드는 것은 원래 최후의 수단입니다.

이것은 80점짜리 skill이며, 100점짜리 제품이 아닙니다. 그래픽 인터페이스를 열고 싶지 않은 사람에게는 80점짜리 skill이 100점짜리 제품보다 유용합니다.

---

## 저장소 구조

```
huashu-design/
├── SKILL.md                 # 메인 문서 (에이전트용)
├── README.md                # 이 파일 (사용자용)
├── assets/                  # 스타터 컴포넌트
│   ├── animations.jsx       # Stage + Sprite + Easing + interpolate
│   ├── ios_frame.jsx        # iPhone 15 Pro 베젤
│   ├── android_frame.jsx
│   ├── macos_window.jsx
│   ├── browser_window.jsx
│   ├── deck_stage.js        # HTML 슬라이드 엔진
│   ├── deck_index.html      # 다중 파일 덱 합성기
│   ├── design_canvas.jsx    # 나란히 변형 비교
│   ├── showcases/           # 24개 프리셋 예제 (8가지 시나리오 × 3가지 스타일)
│   └── bgm-*.mp3            # 6개의 씬별 배경 음악
├── references/              # 작업별 심층 참조 문서
│   ├── animation-pitfalls.md
│   ├── design-styles.md     # 20종 디자인 철학 상세 라이브러리
│   ├── slide-decks.md
│   ├── editable-pptx.md
│   ├── critique-guide.md
│   ├── video-export.md
│   └── ...
├── scripts/                 # 내보내기 툴체인
│   ├── render-video.js      # HTML → MP4
│   ├── convert-formats.sh   # MP4 → 60fps + GIF
│   ├── add-music.sh         # MP4 + BGM
│   ├── export_deck_pdf.mjs
│   ├── export_deck_pptx.mjs
│   ├── html2pptx.js
│   └── verify.py
└── demos/                   # 9개의 기능 데모 (c*/w*), 중영문 이중 버전 GIF/MP4/HTML + hero v10
```

---

## 탄생 배경

Anthropic이 Claude Design을 출시하던 날, 저는 새벽 4시까지 써봤습니다. 며칠 후 한 번도 다시 열지 않았다는 것을 깨달았습니다. 나쁜 제품이어서가 아닙니다. 이 분야에서 현재 가장 성숙한 제품입니다. 저는 그저 어떤 그래픽 인터페이스도 열고 싶지 않고, 에이전트가 터미널에서 알아서 해주는 편을 택하게 됐습니다.

그래서 에이전트로 하여금 Claude Design 자체를 분해하게 했습니다 (커뮤니티에 공유된 시스템 프롬프트, 브랜드 자산 프로토콜, 컴포넌트 메커니즘 포함). 이를 구조화된 스펙으로 증류한 뒤, skill로 작성해 자신의 Claude Code에 장착했습니다.

Anthropic이 Claude Design의 프롬프트를 명확하게 작성해준 것에 감사드립니다. 다른 제품에서 영감을 받은 이러한 2차 창작은, AI 시대 오픈소스 문화의 새로운 형태입니다.

---

## License · 사용 허가

**개인 사용은 무료이며 자유롭습니다** — 학습, 연구, 창작, 개인 프로젝트, 글 작성, 부업, SNS 게시 모두 별도 문의 없이 자유롭게 사용하세요.

**기업 상업적 사용은 금지됩니다** — 회사, 팀, 또는 영리 목적의 조직이 본 skill을 제품에 통합하거나, 외부 서비스에 활용하거나, 고객에게 납품하는 작업에 사용하려면 **반드시 사전에 화생(花生)에게 연락하여 허가를 받아야 합니다.** 다음을 포함하되 이에 한정되지 않습니다:
- skill을 사내 툴체인의 일부로 사용하는 경우
- skill의 결과물을 대외 납품물의 주요 창작 수단으로 사용하는 경우
- skill을 기반으로 2차 개발하여 상업 제품을 만드는 경우
- 클라이언트 프로젝트에서 사용하는 경우

**상업적 사용 허가 문의**는 아래 소셜 플랫폼을 통해 연락해 주세요.

---

## Connect · 화생(花生, 화숙)

화생은 AI 네이티브 코더이자 독립 개발자, AI 콘텐츠 크리에이터입니다. 대표작: 小猫补光灯 (AppStore 유료 앱 Top 1), 《一本书玩转 DeepSeek》, 女娲 .skill (GitHub 12,000+ 스타). 전 플랫폼 팔로워 30만 명 이상.

| 플랫폼 | 계정 | 링크 |
|---|---|---|
| X / Twitter | @AlchainHust | https://x.com/AlchainHust |
| 위챗(WeChat) 공식계정 | 花叔 | 위챗에서 「花叔」 검색 |
| Bilibili | 花叔 | https://space.bilibili.com/14097567 |
| YouTube | 花叔 | https://www.youtube.com/@Alchain |
| 샤오홍수(小红书) | 花叔 | https://www.xiaohongshu.com/user/profile/5abc6f17e8ac2b109179dfdf |
| 공식 사이트 | huasheng.ai | https://www.huasheng.ai/ |
| 개발자 홈페이지 | bookai.top | https://bookai.top |

상업적 사용 허가, 협업 문의, 콘텐츠 기고 → 위 플랫폼 어디서든 화생에게 DM을 보내주세요.
