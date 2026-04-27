# Slide Decks: HTML 슬라이드 제작 규범

슬라이드 제작은 디자인 작업에서 자주 발생하는 시나리오입니다. 이 문서는 HTML 슬라이드를 잘 만드는 방법을 설명합니다 — 아키텍처 선택, 단일 페이지 디자인부터 PDF/PPTX 내보내기까지의 전체 경로를 다룹니다.

**본 skill의 기능 범위**:
- **HTML 프레젠테이션 버전（기본 산출물, 항상 기본적으로 반드시 제작）** → 각 페이지 독립 HTML + `assets/deck_index.html` 집계, 브라우저에서 키보드로 페이지 전환, 전체화면 발표
- HTML → PDF 내보내기 → `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- HTML → 편집 가능한 PPTX 내보내기 → `references/editable-pptx.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs`（HTML을 4가지 필수 제약에 맞게 작성해야 함）

> **⚠️ HTML이 기본이고, PDF/PPTX는 파생물입니다.** 최종 납품 형식이 무엇이든, **반드시** 먼저 HTML 집계 프레젠테이션 버전（`index.html` + `slides/*.html`）을 제작해야 합니다. 이것이 슬라이드 작품의 「원본」입니다. PDF/PPTX는 HTML에서 한 줄 명령어로 내보내는 스냅샷입니다.
>
> **HTML 우선의 이유**:
> - 발표/프레젠테이션 현장에 가장 적합（프로젝터/화면 공유 시 직접 전체화면, 키보드로 페이지 전환, Keynote/PPT 소프트웨어 불필요）
> - 개발 과정에서 각 페이지를 더블클릭하여 개별적으로 검증 가능, 매번 내보내기 실행 불필요
> - PDF/PPTX 내보내기의 유일한 업스트림（「내보낸 후에야 HTML을 수정해야 한다는 걸 알고 다시 내보내야 하는」 악순환 방지）
> - 납품물은 「HTML + PDF」또는 「HTML + PPTX」두 가지 형식으로 제공, 수령인이 원하는 것을 선택 가능
>
> 2026-04-22 moxt brochure 실제 검증: 13페이지 HTML + index.html 집계 완료 후, `export_deck_pdf.mjs` 한 줄로 PDF 내보내기, 수정 없음. HTML 버전 자체가 브라우저에서 직접 발표 가능한 납품물.

---

## 🛑 작업 시작 전 납품 형식 확인（가장 중요한 checkpoint）

**이 결정은 「단일 파일 vs 다중 파일」보다 먼저 이루어져야 합니다.** 2026-04-20 옵션 소규모 이사회 프로젝트 실제 경험: **작업 전 납품 형식을 확인하지 않으면 = 2-3시간 재작업.**

### 결정 트리（HTML-first 아키텍처）

모든 납품물은 동일한 HTML 집계 페이지（`index.html` + `slides/*.html`）에서 시작합니다. 납품 형식은 **HTML 작성 제약**과 **내보내기 명령어**만 결정합니다:

```
【항상 기본 · 필수】 HTML 집계 프레젠테이션 버전（index.html + slides/*.html）
   │
   ├── 브라우저 발표 / 로컬 HTML 보관만 필요   → 여기서 완료, HTML 시각적 자유도 최대
   │
   ├── PDF도 필요（인쇄 / 공유 / 보관）     → export_deck_pdf.mjs로 한 번에 출력
   │                                          HTML 작성 자유, 시각적 제약 없음
   │
   └── 편집 가능한 PPTX도 필요（동료가 텍스트를 편집해야 함）    → 첫 줄의 HTML부터 4가지 필수 제약에 맞게 작성
                                              export_deck_pptx.mjs로 한 번에 출력
                                              그라디언트 / web component / 복잡한 SVG 희생
```

### 작업 시작 멘트（그대로 사용 가능）

> 최종 납품이 HTML, PDF, PPTX 무엇이든, 먼저 브라우저에서 전환 및 발표 가능한 HTML 집계 버전（`index.html` + 키보드 페이지 전환）을 제작합니다 — 이것이 항상 기본 산출물입니다. 그 위에 PDF / PPTX 스냅샷도 추가로 필요한지 확인합니다.
>
> 어떤 내보내기 형식이 필요하십니까?
> - **HTML만 필요**（발표/보관） → 시각적으로 완전 자유
> - **PDF도 필요** → 동일, 내보내기 명령어 하나 추가
> - **편집 가능한 PPTX도 필요**（동료가 PPT에서 텍스트를 편집해야 함） → 첫 줄의 HTML부터 4가지 필수 제약에 맞게 작성해야 하며, 일부 시각적 기능（그라디언트 없음, web component 없음, 복잡한 SVG 없음）을 희생해야 합니다.

### 「PPTX가 필요하면 처음부터 4가지 필수 제약으로 작성해야 하는」이유

PPTX 편집 가능성의 전제는 `html2pptx.js`가 DOM을 요소별로 PowerPoint 객체로 변환할 수 있어야 한다는 것입니다. 이를 위해 **4가지 필수 제약**이 필요합니다:

1. body 고정 960pt × 540pt（`LAYOUT_WIDE`에 맞춤, 13.333″ × 7.5″, 1920×1080px가 아님）
2. 모든 텍스트를 `<p>`/`<h1>`-`<h6>` 안에 포함（div에 텍스트 직접 배치 금지, `<span>`으로 주 텍스트 담기 금지）
3. `<p>`/`<h*>` 자체에 background/border/shadow 사용 금지（외부 div에 배치）
4. `<div>`에 `background-image` 사용 금지（`<img>` 태그 사용）
5. CSS gradient 사용 금지, web component 사용 금지, 복잡한 SVG 장식 사용 금지

**본 skill의 기본 HTML 시각적 자유도는 높습니다** — 다수의 span, 중첩 flex, 복잡한 SVG, web component（예: `<deck-stage>`）, CSS 그라디언트 — **거의 어떤 것도 html2pptx 제약을 자연스럽게 통과하지 못합니다**（실제 테스트: 시각 중심 HTML을 html2pptx에 직접 적용했을 때 통과율 < 30%）.

### 두 가지 실제 경로의 비용 비교（2026-04-20 실제 경험）

| 경로 | 방법 | 결과 | 비용 |
|------|------|------|------|
| ❌ **먼저 자유롭게 HTML 작성 후 PPTX로 사후 구제** | 단일 파일 deck-stage + 다수 SVG/span 장식 | 편집 가능한 PPTX를 원할 경우 두 가지 선택지만 남음:<br>A. pptxgenjs로 수백 줄 좌표 하드코딩<br>B. 17페이지 HTML을 Path A 형식으로 재작성 | 2-3시간 재작업, 수동 작성 버전은 **유지보수 비용이 영구적**（HTML에서 텍스트 하나 바꾸면 PPTX도 수동으로 동기화해야 함） |
| ✅ **첫 번째 단계부터 Path A 제약으로 작성** | 각 페이지 독립 HTML + 4가지 필수 제약 + 960×540pt | 명령어 한 줄로 100% 편집 가능한 PPTX 내보내기, 동시에 브라우저 전체화면 발표 가능（Path A HTML 자체가 표준 브라우저 재생 가능 HTML） | HTML 작성 시 「텍스트를 `<p>` 안에 어떻게 넣을지」를 5분 더 생각하는 것, 재작업 없음 |

### 복합 납품 처리 방법

사용자가 「HTML 발표 **그리고** 편집 가능한 PPTX」를 원한다고 할 때 — **이것은 복합이 아닙니다**, PPTX 요구사항이 HTML 요구사항을 포괄합니다. Path A로 작성된 HTML은 자체적으로 브라우저 전체화면 발표가 가능합니다（`deck_index.html` 집계기만 추가하면 됨）. **추가 비용 없음.**

사용자가 「PPTX **그리고** 애니메이션 / web component」를 원한다고 할 때 — **이것은 진짜 모순입니다**. 사용자에게 알리십시오: 편집 가능한 PPTX를 원한다면 이러한 시각적 기능을 희생해야 합니다. 선택하게 하고, 몰래 pptxgenjs 수동 작성 방안을 시도하지 마십시오（영구적인 유지보수 부채가 됩니다）.

### 사후에 PPTX가 필요하다는 걸 알았을 때（긴급 구제）

극히 드문 경우: HTML을 이미 작성한 후 PPTX가 필요하다는 걸 알게 됨. **fallback 프로세스** 권장（전체 설명은 `references/editable-pptx.md` 말미 「Fallback: 시각 시안이 있는데 사용자가 editable PPTX를 원할 경우」 참조）:

1. **최우선: PDF로 변환**（시각적 100% 보존, 크로스플랫폼, 수령인이 볼 수 있고 인쇄 가능） — 수령인의 실제 요구가 「발표/보관」이라면 PDF가 최적의 납품물
2. **차선: AI가 시각 시안을 기반으로 editable HTML 버전 재작성** → editable PPTX 내보내기 — 색상/레이아웃/텍스트의 디자인 결정은 보존하되, 그라디언트, web component, 복잡한 SVG 등 시각적 기능은 희생
3. **비권장: pptxgenjs 수동 재구성** — 위치, 폰트, 정렬을 수동으로 조정해야 하고 유지보수 비용이 높으며, HTML에서 텍스트 하나 바꿀 때마다 PPTX도 수동으로 동기화해야 함

항상 선택지를 사용자에게 알리고 사용자가 결정하게 하십시오. **절대로 첫 번째 반응으로 pptxgenjs 수동 작성을 시작하지 마십시오** — 그것은 최후의 수단입니다.

---

## 🛑 일괄 제작 전: 먼저 2페이지 showcase로 grammar 확립

**deck이 5페이지 이상이면, 절대로 1페이지부터 마지막 페이지까지 바로 작성하면 안 됩니다.** 2026-04-22 moxt brochure 실전에서 검증된 올바른 순서:

1. **시각적 차이가 가장 큰 2가지 페이지 유형** 먼저 showcase 제작（예: 「표지」+「감성/인용 페이지」, 또는 「표지」+「제품 전시 페이지」）
2. 스크린샷으로 사용자에게 grammar 확인（masthead / 폰트 / 색상 / 간격 / 구조 / 한영 비중）
3. 방향이 승인된 후 나머지 N-2 페이지를 일괄 제작하며, 각 페이지에 이미 구축된 grammar 재사용
4. 모두 완료 후 HTML 집계 + PDF / PPTX 파생물 합성

**이유**: 바로 13페이지를 끝까지 작성 → 사용자가 「방향이 아니다」라고 하면 = 13번 재작업. 먼저 2페이지 showcase → 방향이 틀리면 = 2번 재작업. 시각적 grammar가 일단 확립되면 이후 N 페이지의 결정 공간이 크게 좁아지며, 「콘텐츠를 어떻게 배치할지」만 남습니다.

**showcase 페이지 선택 원칙**: 시각적 구조가 가장 다른 두 페이지를 선택합니다. 이 두 페이지가 통과되면 = 다른 중간 상태도 모두 통과됩니다.

| Deck 유형 | 권장 showcase 페이지 조합 |
|-----------|---------------------|
| B2B brochure / 제품 발표 | 표지 + 콘텐츠 페이지（이념/감성 페이지） |
| 브랜드 론칭 | 표지 + 제품 특징 페이지 |
| 데이터 보고서 | 데이터 대형 이미지 페이지 + 분석 결론 페이지 |
| 튜토리얼 강의 자료 | 챕터 표지 페이지 + 구체적인 지식 포인트 페이지 |

---

## 📐 출판물 grammar 템플릿（moxt 실전 재사용 가능）

B2B brochure / 제품 발표 / 장문 보고서 계열 deck에 적합합니다. 각 페이지에 이 구조를 재사용하면 13페이지가 시각적으로 완전히 일관되며 재작업이 없습니다.

### 각 페이지 골격

```
┌─ masthead（상단 strip + 가로선）────────────┐
│  [logo 22-28px] · A Product Brochure                Issue · Date · URL │
├──────────────────────────────────────────┤
│                                          │
│  ── kicker（녹색 짧은 선 + uppercase 레이블）   │
│  CHAPTER XX · SECTION NAME                 │
│                                          │
│  H1（한자 Noto Serif SC 900）             │
│  중요 단어에 브랜드 메인 색상 적용                      │
│                                          │
│  English subtitle (Lora italic, 부제목)   │
│  ─────────── 구분선 ──────────            │
│                                          │
│  [구체적 콘텐츠: 이중 칼럼 60/40 / 2x2 grid / 목록] │
│                                          │
├──────────────────────────────────────────┤
│ section name                     XX / total │
└──────────────────────────────────────────┘
```

### 스타일 약정（그대로 사용 가능）

- **H1**: 한자 Noto Serif SC 900, 정보량에 따라 80-140px, 중요 단어에만 브랜드 메인 색상 적용（전체 텍스트에 색상 과다 사용 금지）
- **영문 부제목**: Lora italic 26-46px, 브랜드 시그니처 단어（예: "AI team"）굵게 + 메인 색상 이탤릭
- **본문**: Noto Serif SC 17-21px, line-height 1.75-1.85
- **accent 하이라이트**: 본문 내 메인 색상 굵게 키워드 표시, 페이지당 3곳 초과 금지（과다 사용 시 앵커 효과 상실）
- **배경**: 따뜻한 베이지 바탕 #FAFAFA + 극히 옅은 radial-gradient noise（`rgba(33,33,33,0.015)`）로 종이 질감 추가

### 시각적 주역은 반드시 차별화해야 합니다

13페이지가 전부 「텍스트 + 스크린샷 한 장」이면 너무 단조롭습니다. **각 페이지의 시각적 주역 유형을 순환합니다**:

| 시각적 유형 | 적합한 섹션 |
|---------|---------------|
| 표지 타이포그래피（대형 문자 + masthead + pillar） | 첫 페이지 / 챕터 표지 |
| 단독 캐릭터 portrait（초대형 단독 momo 등） | 단일 개념/캐릭터 소개 |
| 다중 캐릭터 단체 사진 / 아바타 카드 나열 | 팀 / 사용자 사례 |
| 타임라인 카드 진행 | 「장기 관계」「발전」표현 |
| 지식 그래프 / 연결 노드 다이어그램 | 「협업」「흐름」표현 |
| Before/After 비교 카드 + 중앙 화살표 | 「변화」「차이」표현 |
| 제품 UI 스크린샷 + 테두리 디바이스 프레임 | 구체적인 기능 전시 |
| 대형 인용구 big-quote（반 페이지 대형 문자） | 감성 페이지 / 문제 페이지 / 인용 페이지 |
| 실제 아바타 + 인용 카드（2×2 또는 1×4） | 사용자 증언 / 사용 시나리오 |
| 대형 문자 뒷표지 + URL 타원 버튼 | CTA / 마지막 페이지 |

---

## ⚠️ 자주 발생하는 실수（moxt 실전 정리）

### 1. Emoji가 Chromium / Playwright 내보내기 시 렌더링되지 않음

Chromium은 기본적으로 컬러 이모지 폰트를 포함하지 않으므로, `page.pdf()` 또는 `page.screenshot()` 시 이모지가 빈 사각형으로 표시됩니다.

**대책**: Unicode 텍스트 기호（`✦` `✓` `✕` `→` `·` `—`）로 대체하거나, 순수 텍스트로 변경합니다（「Email · 23」, 「📧 23 emails」 사용 금지）.

### 2. `export_deck_pdf.mjs` 오류: `Cannot find package 'playwright'`

원인: ESM 모듈 해석이 스크립트 위치에서 위로 `node_modules`를 검색합니다. 스크립트가 `~/.claude/skills/huashu-design/scripts/`에 있으면 해당 위치에 의존성이 없습니다.

**대책**: 스크립트를 deck 프로젝트 디렉토리（예: `brochure/build-pdf.mjs`）에 복사하고, 프로젝트 루트에서 `npm install playwright pdf-lib`를 실행한 뒤, `node build-pdf.mjs --slides slides --out output/deck.pdf` 실행.

### 3. Google Fonts가 로드되기 전에 스크린샷 → 한자가 시스템 기본 고딕체로 표시

Playwright 스크린샷/PDF 전에 최소 `wait-for-timeout=3500` 대기하여 webfont 다운로드 및 paint를 완료합니다. 또는 폰트를 `shared/fonts/`에 self-host하여 네트워크 의존성을 줄입니다.

### 4. 정보 밀도 불균형: 콘텐츠 페이지에 너무 많은 내용

moxt philosophy 페이지 첫 번째 버전에 2×2 = 4단락 + 하단 3가지 신조 = 7개 콘텐츠 블록이 있어 빽빽하고 반복적이었습니다. 1×3 = 3단락으로 변경하자 여백감이 즉시 회복되었습니다.

**대책**: 각 페이지는 「1개 핵심 메시지 + 3-4개 보조 포인트 + 1개 시각적 주역」으로 제한하고, 초과하면 새 페이지로 분리합니다. **적을수록 좋습니다** — 청중이 한 페이지를 10초 보는 상황에서, 4개 기억 포인트보다 1개 기억 포인트를 주는 것이 더 잘 기억됩니다.

---

## 🛑 먼저 아키텍처 결정: 단일 파일 vs 다중 파일?

**이 선택은 슬라이드 제작의 첫 번째 단계입니다. 잘못 선택하면 반복적인 문제가 발생합니다. 이 섹션을 다 읽은 후 시작하십시오.**

### 두 가지 아키텍처 비교

| 차원 | 단일 파일 + `deck_stage.js` | **다중 파일 + `deck_index.html` 집계기** |
|------|--------------------------|--------------------------------------|
| 코드 구조 | 하나의 HTML, 모든 slide가 `<section>` | 각 페이지 독립 HTML, `index.html`이 iframe으로 집계 |
| CSS 범위 | ❌ 전역, 한 페이지의 스타일이 모든 페이지에 영향 | ✅ 자연적 격리, iframe이 각자 독립 |
| 검증 단위 | ❌ JS goTo로만 특정 페이지로 전환 가능 | ✅ 단일 페이지 파일을 더블클릭하면 브라우저에서 바로 확인 |
| 병렬 개발 | ❌ 하나의 파일, 여러 agent가 수정하면 충돌 | ✅ 여러 agent가 다른 페이지를 병렬로 제작, 충돌 없이 merge |
| 디버깅 난이도 | ❌ CSS 하나가 잘못되면 전체 deck 오류 | ✅ 한 페이지 오류가 자신에게만 영향 |
| 내부 인터랙션 | ✅ 페이지 간 상태 공유 간단 | 🟡 iframe 간 postMessage 필요 |
| PDF 인쇄 | ✅ 내장 | ✅ 집계기 beforeprint로 iframe 순회 |
| 키보드 내비게이션 | ✅ 내장 | ✅ 집계기 내장 |

### 어느 것을 선택할까?（결정 트리）

```
│ 질문: deck 예상 페이지 수는?
├── ≤10 페이지, in-deck 애니메이션 또는 페이지 간 인터랙션 필요, pitch deck → 단일 파일
└── ≥10 페이지, 학술 강연, 강의 자료, 장문 deck, 다중 agent 병렬 → 다중 파일（권장）
```

**기본적으로 다중 파일 경로를 따릅니다**. 이것은 「대안」이 아니라 **장문 deck과 팀 협업의 주요 경로**입니다. 이유: 단일 파일 아키텍처의 모든 장점（키보드 내비게이션, 인쇄, scale）을 다중 파일도 갖추고 있으며, 다중 파일의 범위 격리와 검증 가능성은 단일 파일이 보완할 수 없습니다.

### 이 규칙이 이렇게 강경한 이유（실제 사고 기록）

단일 파일 아키텍처는 AI 심리학 강연 deck 제작 중 네 가지 함정에 연속으로 빠졌습니다:

1. **CSS 특이성 충돌**: `.emotion-slide { display: grid }` (특이성 10)이 `deck-stage > section { display: none }` (특이성 2)를 덮어씌워 모든 페이지가 동시에 렌더링되며 겹쳤습니다.
2. **Shadow DOM slot 규칙이 외부 CSS에 의해 압제됨**: `::slotted(section) { display: none }`이 outer rule의 덮어씌움을 막지 못해 section들이 숨겨지지 않음.
3. **localStorage + hash 내비게이션 경합**: 새로고침 후 hash 위치로 이동하지 않고 localStorage에 기록된 이전 위치에 멈춤.
4. **검증 비용 높음**: 특정 페이지를 캡처하려면 반드시 `page.evaluate(d => d.goTo(n))`을 사용해야 하며, 직접 `goto(file://.../slides/05-X.html)`보다 두 배 느리고 오류도 자주 발생.

모든 근본 원인은 **단일 전역 네임스페이스** — 다중 파일 아키텍처는 물리적 층위에서 이러한 문제들을 제거합니다.

---

## 경로 A（기본）: 다중 파일 아키텍처

### 디렉토리 구조

```
내 Deck/
├── index.html              # assets/deck_index.html에서 복사 후 MANIFEST 수정
├── shared/
│   ├── tokens.css          # 공유 디자인 토큰（색상 팔레트/폰트 크기/공통 chrome）
│   └── fonts.html          # Google Fonts <link> 삽입（각 페이지에 include）
└── slides/
    ├── 01-cover.html       # 각 파일이 완전한 1920×1080 HTML
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### 각 slide의 템플릿 골격

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>P05 · Chapter Title</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* 이 페이지 고유 스타일. 어떤 class 이름을 사용해도 다른 페이지를 오염시키지 않습니다. */
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920×1080의 콘텐츠（body의 width/height가 tokens.css에서 고정됨）-->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**핵심 제약**:
- `<body>`가 캔버스이므로 직접 그 위에 레이아웃합니다. `<section>` 또는 다른 wrapper로 감싸지 마십시오.
- `width: 1920px; height: 1080px`은 `shared/tokens.css`의 `body` 규칙으로 고정됩니다.
- `shared/tokens.css`를 참조하여 디자인 토큰（색상 팔레트, 폰트 크기, page-header/footer 등）을 공유합니다.
- 폰트 `<link>`는 각 페이지에서 자체적으로 작성합니다（폰트 독립 import 비용이 낮으며, 각 페이지가 독립적으로 열릴 수 있음을 보장）.

### 집계기: `deck_index.html`

**`assets/deck_index.html`에서 직접 복사합니다**. 수정할 곳은 단 하나 — `window.DECK_MANIFEST` 배열로, 모든 slide 파일명과 사람이 읽을 수 있는 레이블을 순서대로 나열합니다:

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "표지" },
  { file: "slides/02-agenda.html",   label: "목차" },
  { file: "slides/03-problem.html",  label: "문제 진술" },
  // ...
];
```

집계기에는 이미 내장되어 있습니다: 키보드 내비게이션（←/→/Home/End/숫자키/P 인쇄）, scale + letterbox, 우하단 카운터, localStorage 기억, hash 페이지 이동, 인쇄 모드（iframe을 페이지별로 순회하여 PDF 출력）.

### 단일 페이지 검증（다중 파일 아키텍처의 킬러 장점）

각 slide가 독립적인 HTML입니다. **한 장 완성 후 브라우저에서 더블클릭하여 확인합니다**:

```bash
open slides/05-personas.html
```

Playwright 스크린샷도 직접 `goto(file://.../slides/05-personas.html)`, JS로 페이지 이동 불필요, 다른 페이지의 CSS에 의한 간섭도 없습니다. 이를 통해 「수정 후 즉시 검증」하는 작업 흐름의 비용이 거의 0에 수렴합니다.

### 병렬 개발

각 slide 작업을 다른 agent에 배분하여 동시에 실행 — HTML 파일이 서로 독립적이므로 merge 시 충돌이 없습니다. 장문 deck에 이 병렬 방식을 사용하면 제작 시간을 1/N로 단축할 수 있습니다.

### `shared/tokens.css`에 넣어야 할 것

**진정으로 페이지 간 공유**되는 것만 넣습니다:

- CSS 변수（색상 팔레트, 폰트 크기 단계, 간격 단계）
- `body { width: 1920px; height: 1080px; }` 와 같은 캔버스 고정
- `.page-header` / `.page-footer` 와 같이 모든 페이지에서 똑같이 사용하는 chrome

**넣지 마십시오**: 단일 페이지의 레이아웃 class — 그렇게 하면 단일 파일 아키텍처의 전역 오염 문제로 퇴보합니다.

---

## 경로 B（소형 deck）: 단일 파일 + `deck_stage.js`

≤10 페이지, 페이지 간 상태 공유 필요（예: React tweaks 패널이 모든 페이지를 제어해야 함）, 또는 pitch deck 데모처럼 극도로 압축된 형태가 필요한 시나리오에 적합합니다.

### 기본 사용법

1. `assets/deck_stage.js`에서 내용을 읽어 HTML의 `<script>`에 삽입（또는 `<script src="deck_stage.js">`）
2. body 안에서 `<deck-stage>`로 slide 감싸기
3. 🛑 **script 태그는 반드시 `</deck-stage>` 이후에 위치해야 합니다**（아래 필수 제약 참조）

```html
<body>

  <deck-stage>
    <section>
      <h1>Slide 1</h1>
    </section>
    <section>
      <h1>Slide 2</h1>
    </section>
  </deck-stage>

  <!-- ✅ 올바름: script가 deck-stage 이후에 위치 -->
  <script src="deck_stage.js"></script>

</body>
```

### 🛑 Script 위치 필수 제약（2026-04-20 실제 경험）

**`<script src="deck_stage.js">`를 `<head>` 안에 배치하면 안 됩니다.** `<head>` 안에 있어도 `customElements`를 정의할 수는 있지만, parser가 `<deck-stage>` 시작 태그를 파싱할 때 `connectedCallback`이 실행됩니다 — 이 시점에 자식 `<section>`이 아직 파싱되지 않아 `_collectSlides()`가 빈 배열을 가져오고, 카운터에 `1 / 0`이 표시되며 모든 페이지가 동시에 겹쳐서 렌더링됩니다.

**세 가지 올바른 작성 방법**（하나 선택）:

```html
<!-- ✅ 가장 권장: script가 </deck-stage> 이후에 위치 -->
</deck-stage>
<script src="deck_stage.js"></script>

<!-- ✅ 가능: script가 head에 있지만 defer 추가 -->
<head><script src="deck_stage.js" defer></script></head>

<!-- ✅ 가능: module 스크립트는 자연적으로 defer -->
<head><script src="deck_stage.js" type="module"></script></head>
```

`deck_stage.js` 자체에는 이미 `DOMContentLoaded` 지연 수집 방어가 내장되어 있어, script를 head에 넣어도 완전히 오류가 발생하지는 않습니다 — 하지만 `defer` 또는 body 하단에 배치하는 것이 더 깔끔한 방법이며 방어 분기에 의존하는 것을 피할 수 있습니다.

### ⚠️ 단일 파일 아키텍처의 CSS 함정（반드시 읽으십시오）

단일 파일 아키텍처에서 가장 흔한 함정 — **`display` 속성이 단일 페이지 스타일에 의해 탈취됩니다**.

일반적인 잘못된 방법 1（section에 직접 display: flex 작성）:

```css
/* ❌ 외부 CSS 특이성 2, shadow DOM의 ::slotted(section){display:none}（특이성도 2）을 덮어씌움 */
deck-stage > section {
  display: flex;            /* 모든 페이지가 동시에 겹쳐서 렌더링됩니다！ */
  flex-direction: column;
  padding: 80px;
  ...
}
```

일반적인 잘못된 방법 2（section에 특이성이 더 높은 class）:

```css
.emotion-slide { display: grid; }   /* 특이성: 10, 더 심각 */
```

두 가지 모두 **모든 slide가 동시에 겹쳐서 렌더링됩니다** — 카운터는 `1 / 10`으로 정상처럼 보일 수 있지만, 시각적으로는 첫 번째 페이지 위에 두 번째 페이지, 세 번째 페이지가 겹칩니다.

### ✅ 시작 CSS（바로 복사 사용, 함정 없음）

**section 자체**는 「보이기/숨기기」만 담당; **layout（flex/grid 등）은 `.active`에 작성**:

```css
/* section은 display 외의 공통 스타일만 정의 */
deck-stage > section {
  background: var(--paper);
  padding: 80px 120px;
  overflow: hidden;
  position: relative;
  /* ⚠️ 여기에 display를 작성하지 마십시오! */
}

/* 「비활성화 = 숨김」을 특이성+가중치 이중 보험으로 고정 */
deck-stage > section:not(.active) {
  display: none !important;
}

/* 활성화된 페이지에만 필요한 display + layout 작성 */
deck-stage > section.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 인쇄 모드: 모든 페이지가 표시되어야 하므로 :not(.active) 덮어씌움 */
@media print {
  deck-stage > section { display: flex !important; }
  deck-stage > section:not(.active) { display: flex !important; }
}
```

대안: **단일 페이지의 flex/grid를 내부 wrapper `<div>`에 작성**하고, section 자체는 영원히 `display: block/none`의 전환기만 담당합니다. 이것이 가장 깔끔한 방법입니다:

```html
<deck-stage>
  <section>
    <div class="slide-content flex-layout">...</div>
  </section>
</deck-stage>
```

### 사용자 정의 크기

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 세로형 -->
</deck-stage>
```

---

## Slide Labels

Deck_stage와 deck_index 모두 각 페이지에 레이블을 부여합니다（카운터 표시）. **더 의미 있는** 레이블을 부여하십시오:

**다중 파일**: `MANIFEST`에 `{ file, label: "04 문제 진술" }` 작성
**단일 파일**: section에 `<section data-screen-label="04 Problem Statement">` 추가

**핵심: Slide 번호는 1부터 시작하며 0부터 시작하지 않습니다**.

사용자가 "slide 5"라고 말할 때, 그는 다섯 번째 슬라이드를 의미하며, 절대로 배열 위치 `[4]`를 의미하지 않습니다. 사람은 0 인덱스로 말하지 않습니다.

---

## Speaker Notes

**기본적으로 추가하지 않으며**, 사용자가 명시적으로 요청할 때만 추가합니다.

Speaker notes를 추가하면 slide 위의 텍스트를 최소화하여 임팩트 있는 비주얼에 집중할 수 있습니다 — notes가 전체 스크립트를 담당합니다.

### 형식

**다중 파일**: `index.html`의 `<head>` 안에 작성:

```html
<script type="application/json" id="speaker-notes">
[
  "첫 번째 슬라이드의 스크립트...",
  "두 번째 슬라이드의 스크립트...",
  "..."
]
</script>
```

**단일 파일**: 동일한 위치.

### Notes 작성 요점

- **완전함**: 개요가 아니라 실제로 말할 내용
- **대화체**: 평소 말하는 방식, 문어체 금지
- **대응**: 배열의 N번째 항목이 N번째 slide에 대응
- **길이**: 200-400자 최적
- **감정선**: 강조, 멈춤, 강조 포인트 표시

---

## Slide 디자인 패턴

### 1. 시스템 구축（필수）

design context 탐색 후, **사용할 시스템을 먼저 말로 설명합니다**:

```markdown
Deck 시스템:
- 배경색: 최대 2가지（90% 흰색 + 10% 어두운 section divider）
- 폰트: display는 Instrument Serif, body는 Geist Sans
- 리듬: section divider는 full-bleed 컬러 + 흰 텍스트, 일반 slide는 흰 배경
- 이미지: hero slide는 full-bleed 사진, data slide는 차트

이 시스템으로 제작하겠습니다. 문제가 있으면 알려주십시오.
```

사용자 확인 후 진행합니다.

### 2. 자주 사용하는 slide layouts

- **Title slide**: 단색 배경 + 거대한 제목 + 부제목 + 작성자/날짜
- **Section divider**: 컬러 배경 + 챕터 번호 + 챕터 제목
- **Content slide**: 흰 배경 + 제목 + 1-3 bullet points
- **Data slide**: 제목 + 큰 차트/숫자 + 간단한 설명
- **Image slide**: full-bleed 사진 + 하단 소형 caption
- **Quote slide**: 여백 + 거대한 인용구 + attribution
- **Two-column**: 좌우 비교（vs / before-after / problem-solution）

하나의 deck에서 최대 4-5가지 layout을 사용합니다.

### 3. Scale（재강조）

- 본문 최소 **24px**, 이상적으로 28-36px
- 제목 **60-120px**
- Hero 텍스트 **180-240px**
- 슬라이드는 10미터 밖에서 보는 것이므로, 텍스트가 충분히 커야 합니다

### 4. 시각적 리듬

Deck에는 **의도적인 다양성**이 필요합니다:

- 색상 리듬: 대부분 흰 배경 + 가끔 컬러 section divider + 가끔 dark 세그먼트
- 밀도 리듬: 텍스트가 많은 몇 장 + 이미지가 많은 몇 장 + 인용구 여백 몇 장
- 폰트 크기 리듬: 일반 제목 + 가끔 거대한 hero 텍스트

**모든 slide가 똑같이 생기면 안 됩니다** — 그것은 PPT 템플릿이지 디자인이 아닙니다.

### 5. 공간 여백（데이터 밀집 페이지 필독）

**초보자가 가장 쉽게 빠지는 함정**: 넣을 수 있는 모든 정보를 한 페이지에 압축합니다.

정보 밀도 ≠ 효과적인 정보 전달. 학술/강연 계열 deck에서는 특히 자제해야 합니다:

- 목록/매트릭스 페이지: N개 요소를 모두 같은 크기로 그리지 마십시오. **주요/보조 계층화** 사용 — 오늘 다룰 5개를 크게 주역으로, 나머지 16개는 작게 배경 힌트로.
- 대형 숫자 페이지: 숫자 자체가 시각적 주역입니다. 주변 caption은 3줄을 초과하지 않아야 합니다. 그렇지 않으면 청중의 눈이 이리저리 이동합니다.
- 인용 페이지: 인용구와 attribution 사이에 여백을 두어야 합니다. 바짝 붙이면 안 됩니다.

「데이터가 주역인가」「텍스트가 붙어있지 않은가」두 가지 자기 검토 항목으로 점검하고, 여백이 약간 불안할 정도가 될 때까지 수정하십시오.

---

## PDF로 인쇄

**다중 파일**: `deck_index.html`이 이미 `beforeprint` 이벤트를 처리하여 페이지별 PDF를 출력합니다.

**단일 파일**: `deck_stage.js`도 동일하게 처리합니다.

인쇄 스타일은 이미 작성되어 있으므로, 추가로 `@media print` CSS를 작성할 필요가 없습니다.

---

## PPTX / PDF로 내보내기（셀프 서비스 스크립트）

HTML 우선이 제1원칙입니다. 하지만 사용자는 자주 PPTX/PDF 납품을 요구합니다. 두 가지 범용 스크립트를 제공하며, **모든 다중 파일 deck에서 사용 가능**, `scripts/` 아래에 위치합니다:

### `export_deck_pdf.mjs` — 벡터 PDF 내보내기（다중 파일 아키텍처）

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**특징**:
- 텍스트 **벡터 보존**（복사 가능, 검색 가능）
- 시각적 100% 충실도（Playwright 내장 Chromium 렌더링 후 인쇄）
- **HTML의 어떤 부분도 수정 불필요**
- 각 slide 독립적으로 `page.pdf()`, 이후 `pdf-lib`로 합병

**의존성**: `npm install playwright pdf-lib`

**제한**: PDF는 텍스트를 다시 편집할 수 없음 — 수정하려면 HTML로 돌아가서 수정.

### `export_deck_stage_pdf.mjs` — 단일 파일 deck-stage 아키텍처 전용 ⚠️

**사용 시기**: deck이 단일 HTML 파일 + `<deck-stage>` web component로 N개 `<section>`을 감싼 형태（즉 경로 B 아키텍처）인 경우. 이때 `export_deck_pdf.mjs`의 「각 HTML을 한 번씩 `page.pdf()`」방식이 작동하지 않으므로, 이 전용 스크립트를 사용해야 합니다.

```bash
node scripts/export_deck_stage_pdf.mjs --html deck.html --out deck.pdf
```

**export_deck_pdf.mjs를 재사용할 수 없는 이유**（2026-04-20 실제 경험 기록）:

1. **Shadow DOM이 `!important`를 이김**: deck-stage의 shadow CSS에 `::slotted(section) { display: none }`이 있음（active인 페이지만 `display: block`）. light DOM에서 `@media print { deck-stage > section { display: block !important } }`를 사용해도 압도되지 않음 — `page.pdf()`가 print 미디어를 트리거하면 Chromium 최종 렌더링은 active 페이지 하나뿐이며, **전체 PDF가 1페이지**（현재 active slide 반복）.

2. **각 페이지로 goto 루프해도 여전히 1페이지만 출력**: 직관적인 해결책 「각 `#slide-N`으로 한 번씩 이동 후 `page.pdf({pageRanges:'1'})`」도 실패 — print CSS가 shadow DOM 밖에서도 `deck-stage > section { display: block }` 규칙이 override된 후, 최종 렌더링이 항상 section 목록의 첫 번째 항목（이동한 페이지가 아님）. 결과적으로 17번 루프가 17장의 P01 표지.

3. **absolute 자식 요소가 다음 페이지로 넘어감**: 모든 section이 렌더링되더라도, section 자체가 `position: static`이면, absolute 위치의 `cover-footer`/`slide-footer`가 initial containing block을 기준으로 배치됩니다 — section이 print에 의해 1080px 높이로 강제될 때, absolute footer가 다음 페이지로 밀릴 수 있습니다（PDF가 section 수보다 1페이지 많고, 추가된 페이지에는 footer 고아만 있는 현상）.

**수정 전략**（스크립트에 이미 구현됨）:

```js
// HTML 열기 후, page.evaluate로 section을 deck-stage slot에서 꺼내
// 직접 body 아래 일반 div에 연결하고, inline style로 position:relative + 고정 크기 보장
await page.evaluate(() => {
  const stage = document.querySelector('deck-stage');
  const sections = Array.from(stage.querySelectorAll(':scope > section'));
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
      @page { size: 1920px 1080px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; }
      deck-stage { display: none !important; }
    `,
  }));
  const container = document.createElement('div');
  sections.forEach(s => {
    s.style.cssText = 'width:1920px!important;height:1080px!important;display:block!important;position:relative!important;overflow:hidden!important;page-break-after:always!important;break-after:page!important;background:#F7F4EF;margin:0!important;padding:0!important;';
    container.appendChild(s);
  });
  // 마지막 페이지 페이지 나눔 비활성화, 끝 빈 페이지 방지
  sections[sections.length - 1].style.pageBreakAfter = 'auto';
  sections[sections.length - 1].style.breakAfter = 'auto';
  document.body.appendChild(container);
});

await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
```

**이것이 작동하는 이유**:
- section을 shadow DOM slot에서 light DOM의 일반 div로 이동 — `::slotted(section) { display: none }` 규칙을 완전히 우회
- inline `position: relative`로 absolute 자식 요소가 section을 기준으로 배치, 넘침 없음
- `page-break-after: always`로 브라우저 print 시 각 section이 독립적인 페이지
- `:last-child` 페이지 나눔 없음으로 끝 빈 페이지 방지

**`mdls -name kMDItemNumberOfPages`로 검증할 때 주의**: macOS의 Spotlight 메타데이터는 캐시가 있어, PDF 재작성 후 `mdimport file.pdf`를 실행하여 강제 갱신해야 합니다. 그렇지 않으면 이전 페이지 수가 표시됩니다. 실제 페이지 수는 `pdfinfo` 또는 `pdftoppm`으로 확인하십시오.

---

### `export_deck_pptx.mjs` — 편집 가능한 PPTX 내보내기

```bash
# 유일한 모드: 텍스트 상자 원본 편집 가능（폰트는 시스템 폰트로 폴백됨）
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx
```

작동 원리: `html2pptx`가 요소별로 computedStyle을 읽어 DOM을 PowerPoint 객체（text frame / shape / picture）로 변환합니다. 텍스트가 실제 텍스트 상자가 되어 PPT에서 더블클릭하면 편집 가능합니다.

**필수 제약**（HTML이 반드시 충족해야 하며, 그렇지 않으면 해당 페이지가 skip됨. 자세한 설명은 `references/editable-pptx.md` 참조）:
- 모든 텍스트는 반드시 `<p>`/`<h1>`-`<h6>`/`<ul>`/`<ol>` 안에 있어야 함（나체 텍스트 div 금지）
- `<p>`/`<h*>` 태그 자체에 background/border/shadow 금지（외부 div에 배치）
- `::before`/`::after`로 장식 텍스트 삽입 금지（의사 요소는 추출 불가）
- inline 요소（span/em/strong）에 margin 금지
- CSS gradient 금지（렌더링 불가）
- div에 `background-image` 금지（`<img>` 사용）

스크립트에는 이미 **자동 전처리기**가 내장 — 「리프 div 안의 나체 텍스트」를 자동으로 `<p>`로 감쌉니다（class 보존). 이로써 가장 일반적인 위반（나체 텍스트）을 해결합니다. 하지만 다른 위반（p에 border, span에 margin 등）은 여전히 HTML 소스에서 준수해야 합니다.

**폰트 폴백 주의사항**:
- Playwright는 webfont로 텍스트 상자 크기를 측정; PowerPoint/Keynote는 로컬 폰트로 렌더링
- 양쪽이 다를 경우 **넘침 또는 오정렬** 발생 — 각 페이지를 육안으로 검토해야 함
- 목표 기기에 HTML에서 사용한 폰트를 설치하거나, `system-ui`로 폴백하는 것을 권장

**시각 우선 시나리오에서는 이 경로를 사용하지 마십시오** → `export_deck_pdf.mjs`로 PDF 출력. PDF는 시각적으로 100% 충실, 벡터, 크로스플랫폼, 텍스트 검색 가능 — 시각 우선 deck의 진정한 귀착지이며, 「편집 불가능한 타협안」이 아닙니다.

### 처음부터 HTML을 내보내기 친화적으로 작성하는 방법

가장 안정적인 deck: **HTML을 작성할 때부터 editable의 4가지 필수 제약에 맞게 작성합니다**. 이렇게 하면 `export_deck_pptx.mjs`가 전부 통과할 수 있습니다. 추가 비용은 크지 않습니다:

```html
<!-- ❌ 좋지 않음 -->
<div class="title">핵심 발견</div>

<!-- ✅ 좋음（p로 감쌈, class 상속） -->
<p class="title">핵심 발견</p>

<!-- ❌ 좋지 않음（border가 p에 있음） -->
<p class="stat" style="border-left: 3px solid red;">41%</p>

<!-- ✅ 좋음（border가 외부 div에 있음） -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">41%</p>
</div>
```

### 어느 것을 선택할까

| 시나리오 | 권장 |
|------|------|
| 주최측/아카이브 보관 | **PDF**（범용, 고충실도, 텍스트 검색 가능） |
| 협업자에게 텍스트 미세 조정 요청 | **PPTX editable**（폰트 폴백 허용） |
| 현장 발표, 내용 변경 없음 | **PDF**（벡터 충실도, 크로스플랫폼） |
| HTML이 주요 표현 매체 | 브라우저에서 직접 재생, 내보내기는 백업만 |

## 편집 가능한 PPTX로 내보내기 심화 경로（장기 프로젝트 전용）

deck을 장기적으로 유지보수하고, 반복적으로 수정하며, 팀이 협업하는 경우 — **처음부터 html2pptx 제약에 맞게 HTML을 작성**하는 것을 권장합니다. 이렇게 하면 `export_deck_pptx.mjs`가 전부 통과할 수 있습니다. 자세한 내용은 `references/editable-pptx.md`（4가지 필수 제약 + HTML 템플릿 + 일반 오류 빠른 참조 + 시각 시안이 있는 경우의 fallback 프로세스） 참조.

---

## 자주 묻는 질문

**다중 파일: iframe 안의 페이지가 열리지 않음 / 흰 화면**
→ `MANIFEST`의 `file` 경로가 `index.html` 기준으로 올바른지 확인하십시오. 브라우저 DevTools에서 iframe의 src를 직접 접근할 수 있는지 확인하십시오.

**다중 파일: 특정 페이지 스타일이 다른 페이지와 충돌**
→ 불가능합니다（iframe 격리）. 충돌처럼 느껴진다면 캐시 문제입니다 — Cmd+Shift+R로 강제 새로고침.

**단일 파일: 여러 slide가 동시에 렌더링되어 겹침**
→ CSS 특이성 문제입니다. 위의 「단일 파일 아키텍처의 CSS 함정」 섹션을 참조하십시오.

**단일 파일: 축소가 올바르지 않아 보임**
→ 모든 slide가 `<deck-stage>` 아래 직접 `<section>`으로 있는지 확인하십시오. 중간에 `<div>`로 감싸면 안 됩니다.

**단일 파일: 특정 slide로 이동하고 싶음**
→ URL에 hash 추가: `index.html#slide-5`로 5번째 슬라이드로 이동.

**두 가지 아키텍처 모두: 다른 화면에서 텍스트 위치가 일관되지 않음**
→ 고정 크기（1920×1080）와 `px` 단위를 사용하고, `vw`/`vh` 또는 `%`를 사용하지 마십시오. 축소는 통일적으로 처리됩니다.

---

## 검증 체크리스트（deck 완성 후 반드시 통과）

1. [ ] 브라우저에서 직접 `index.html`（또는 메인 HTML）열기, 첫 페이지에 깨진 이미지 없음, 폰트 로드 완료 확인
2. [ ] → 키로 각 페이지 넘기기, 빈 페이지 없음, 레이아웃 오류 없음
3. [ ] P 키로 인쇄 미리보기, 각 페이지가 정확히 A4 한 장（또는 1920×1080）이며 잘림 없음
4. [ ] 임의로 3개 페이지 선택하여 Cmd+Shift+R 강제 새로고침, localStorage 기억이 정상 작동
5. [ ] Playwright 일괄 스크린샷（단일 페이지 아키텍처: `slides/*.html` 순회; 단일 파일 아키텍처: goTo로 전환）, 육안으로 한 번 검토
6. [ ] `TODO` / `placeholder` 잔재 검색, 모두 정리 확인
