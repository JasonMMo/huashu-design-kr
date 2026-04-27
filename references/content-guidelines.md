# 콘텐츠 가이드라인：Anti-AI Slop, 콘텐츠 기준, 스케일 규범

AI 디자인에서 가장 빠지기 쉬운 함정들입니다. 이것은 「하지 말아야 할 것」 목록으로, 「해야 할 것」보다 더 중요합니다 — AI slop은 기본값이기 때문에 의식적으로 피하지 않으면 자동으로 발생합니다.

## AI Slop 완전 블랙리스트

### 시각적 함정

**❌ 공격적인 그라디언트 배경**
- 보라색 → 분홍색 → 파란색 전체 화면 그라디언트 (AI 생성 웹페이지의 전형적인 느낌)
- 모든 방향의 rainbow gradient
- Mesh gradient 배경 전면 사용
- ✅ 그라디언트를 사용해야 한다면：subtle하게, 단색 계열, 의도적으로 포인트로만 (예：버튼 hover)

**❌ 둥근 카드 + 왼쪽 border accent 색**
```css
/* AI 감성 카드의 전형적인 서명 */
.card {
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  padding: 16px;
}
```
이런 카드는 AI 생성 Dashboard에 넘쳐납니다. 강조가 필요하다면 더 디자인적인 방법을 사용하세요：배경색 대비, 폰트 굵기/크기 대비, 단순 구분선, 또는 카드 자체를 쓰지 않는 것.

**❌ Emoji 장식**
브랜드 자체가 emoji를 사용하는 경우(예：Notion, Slack)가 아니라면 UI에 emoji를 넣지 마세요. **특히 금지**：
- 제목 앞의 🚀 ⚡️ ✨ 🎯 💡
- Feature 목록의 ✅
- CTA 버튼 안의 → (화살표 단독 사용은 OK, emoji 화살표는 불가)

아이콘이 필요하다면 진짜 아이콘 라이브러리를 사용하세요 (Lucide / Heroicons / Phosphor), 또는 placeholder를 사용하세요.

**❌ SVG로 이미지 그리기**
SVG로 인물, 배경, 기기, 사물, 추상 예술을 그리려 하지 마세요. AI가 그린 SVG 이미지는 한 눈에 AI 티가 나며, 유치하고 저렴해 보입니다. **회색 직사각형 + "일러스트 위치 1200×800" 텍스트 레이블이 서툰 SVG hero illustration보다 100배 낫습니다**.

SVG를 사용해도 되는 유일한 경우：
- 진짜 아이콘 (16×16 ~ 32×32 수준)
- 장식 요소로서의 기하도형
- 데이터 시각화 차트

**❌ 과도한 아이콘 사용**
모든 제목 / feature / 섹션에 아이콘이 필요한 것은 아닙니다. 아이콘을 남발하면 인터페이스가 장난감처럼 보입니다. Less is more.

**❌ "데이터 Slop"**
꾸며낸 통계 장식：
- "10,000+ 만족 고객" (실제로 있는지 알 수도 없음)
- "99.9% 가동 시간" (진짜 데이터 없으면 쓰지 마세요)
- 아이콘 + 숫자 + 단어로 구성된 장식용 「지표 카드」
- Mock 테이블 안의 화려하게 꾸며진 가짜 데이터

진짜 데이터가 없다면 placeholder를 남기거나 사용자에게 요청하세요.

**❌ "Quote Slop"**
꾸며낸 사용자 후기, 유명인 명언으로 페이지를 장식하는 것. Placeholder를 남기고 사용자에게 진짜 인용문을 요청하세요.

### 폰트 함정

**❌ 이런 흔해빠진 폰트는 피하세요**：
- Inter (AI 생성 웹페이지 기본값)
- Roboto
- Arial / Helvetica
- 순수 시스템 폰트 스택
- Fraunces (AI가 발견하고 남용함)
- Space Grotesk (최근 AI가 가장 좋아하는 폰트)

**✅ 특색 있는 display + body 조합을 사용하세요**. 방향 참고：
- 세리프 display + 산세리프 body (editorial feel)
- Mono display + sans body (technical feel)
- Heavy display + light body (contrast)
- Variable font으로 hero의 두께 애니메이션

폰트 리소스：
- Google Fonts의 잘 알려지지 않은 좋은 옵션 (Instrument Serif, Cormorant, Bricolage Grotesque, JetBrains Mono)
- 오픈소스 폰트 사이트 (Fraunces의 형제 폰트, Adobe Fonts)
- 폰트 이름을 임의로 만들지 마세요

### 색상 함정

**❌ 색상을 임의로 만들어내기**
낯선 색 조합을 처음부터 디자인하지 마세요. 대부분 조화롭지 않습니다.

**✅ 전략**：
1. 브랜드 색이 있는 경우 → 브랜드 색 사용, 부족한 color token은 oklch 보간으로 채우기
2. 브랜드 색은 없지만 레퍼런스가 있는 경우 → 레퍼런스 제품 스크린샷에서 색상 추출
3. 완전히 처음부터 시작하는 경우 → 검증된 색상 시스템 선택 (Radix Colors / Tailwind 기본 팔레트 / Anthropic 브랜드), 직접 조색하지 마세요

**oklch로 색상 정의**하는 것이 가장 현대적인 방법입니다：
```css
:root {
  --primary: oklch(0.65 0.18 25);      /* 따뜻한 테라코타 */
  --primary-light: oklch(0.85 0.08 25); /* 동일 색조 밝은 버전 */
  --primary-dark: oklch(0.45 0.20 25);  /* 동일 색조 어두운 버전 */
}
```
oklch는 밝기를 조절해도 색조가 흔들리지 않아 hsl보다 사용하기 편합니다.

**❌ 다크 모드를 단순히 색상 반전으로 처리**
색상을 단순히 invert하는 것이 아닙니다. 좋은 다크 모드는 채도, 대비, accent 색을 다시 조정해야 합니다. 다크 모드를 제대로 만들기 어렵다면 처음부터 하지 마세요.

### 레이아웃 함정

**❌ Bento grid 과도한 남용**
AI가 생성하는 랜딩 페이지마다 bento를 시도합니다. 정보 구조가 실제로 bento에 맞지 않는다면 다른 레이아웃을 사용하세요.

**❌ 큰 hero + 3열 features + 후기 + CTA**
이 랜딩 페이지 템플릿은 너무 많이 쓰였습니다. 혁신하려면 진짜로 혁신하세요.

**❌ 카드 그리드에서 모든 카드가 동일한 모양**
비대칭, 다양한 크기의 카드, 이미지가 있는 것과 텍스트만 있는 것, 열을 걸치는 것 — 이런 것이 진짜 디자이너가 만든 것처럼 보입니다.

## 콘텐츠 기준

### 1. 채우기용 콘텐츠를 추가하지 마세요

모든 요소는 자기 자리를 스스로 증명해야 합니다. 여백은 디자인 문제이며, **구성**으로 해결합니다 (대비, 리듬, 여백). **콘텐츠로 채우는 것**이 해결책이 아닙니다.

**채우기용 콘텐츠인지 판단하는 질문**：
- 이 콘텐츠를 제거하면 디자인이 나빠지나요? 대답이 "아니오"라면 제거하세요.
- 이 요소가 해결하는 진짜 문제는 무엇인가요? "페이지가 너무 비어 보여서"라면 삭제하세요.
- 이 통계 / 인용문 / 기능이 진짜 데이터로 뒷받침되나요? 없다면 임의로 작성하지 마세요.

「One thousand no's for every yes」.

### 2. 추가하기 전에 먼저 물어보세요

섹션 하나 / 페이지 하나 / 항목 하나를 더 추가하면 더 좋아질 것 같다고요? 먼저 사용자에게 물어보고, 일방적으로 추가하지 마세요.

이유：
- 사용자는 자신의 대상 독자를 여러분보다 잘 압니다
- 콘텐츠 추가에는 비용이 따르며, 사용자가 원하지 않을 수 있습니다
- 일방적으로 콘텐츠를 추가하는 것은 「주니어 디자이너가 매니저에게 보고하는」 관계에 어긋납니다

### 3. 사전에 시스템을 구축하세요

디자인 컨텍스트 파악 후, **사용할 시스템을 먼저 구두로 설명하여 사용자의 확인을 받으세요**：

```markdown
저의 디자인 시스템：
- 색상：#1A1A1A 기본 + #F0EEE6 배경 + #D97757 accent (브랜드에서 가져옴)
- 폰트：Instrument Serif를 display로 + Geist Sans를 body로
- 리듬：섹션 제목은 full-bleed 컬러 배경 + 흰 글자; 일반 섹션은 흰 배경
- 이미지：hero는 full-bleed 사진, feature 섹션은 제공해 주실 때까지 placeholder 사용
- 배경색은 최대 2가지만 사용하여 복잡함 방지

이 방향이 맞으면 작업을 시작하겠습니다.
```

사용자 확인 후 작업을 시작하세요. 이 체크인으로 「절반 완성 후 방향이 틀렸음을 깨닫는」 상황을 방지할 수 있습니다.

## 스케일 규범

### 슬라이드 (1920×1080)

- 본문 최소 **24px**, 이상적으로는 28-36px
- 제목 60-120px
- 섹션 제목 80-160px
- Hero 헤드라인은 180-240px의 큰 글자 사용 가능
- 슬라이드에는 절대 24px 미만 글자를 사용하지 마세요

### 인쇄 문서

- 본문 최소 **10pt** (≈13.3px), 이상적으로는 11-12pt
- 제목 18-36pt
- 캡션 8-9pt

### 웹 및 모바일

- 본문 최소 **14px** (고령자 친화를 위해 16px 권장)
- 모바일 본문 **16px** (iOS 자동 확대 방지)
- Hit target (클릭 가능한 요소) 최소 **44×44px**
- 줄 높이 1.5-1.7 (한국어 1.7-1.8)

### 대비

- 본문 vs 배경 **최소 4.5:1** (WCAG AA)
- 대형 글자 vs 배경 **최소 3:1**
- Chrome DevTools의 accessibility 도구로 확인하세요

## CSS 활용 팁

**최신 CSS 기능**은 디자이너의 좋은 친구입니다. 과감하게 활용하세요：

### 타이포그래피

```css
/* 제목 줄바꿈을 더 자연스럽게, 마지막 줄에 단어 하나만 남지 않도록 */
h1, h2, h3 { text-wrap: balance; }

/* 본문 줄바꿈, 고아 단어 방지 */
p { text-wrap: pretty; }

/* 한국어 타이포그래피：구두점 압축, 행 시작/끝 제어 */
p { 
  text-spacing-trim: space-all;
  hanging-punctuation: first;
}
```

### 레이아웃

```css
/* CSS Grid + named areas = 가독성 극대화 */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Subgrid로 카드 내용 정렬 */
.card { display: grid; grid-template-rows: subgrid; }
```

### 시각 효과

```css
/* 디자인 감성 있는 스크롤바 */
* { scrollbar-width: thin; scrollbar-color: #666 transparent; }

/* 글래스모피즘 (절제해서 사용) */
.glass {
  backdrop-filter: blur(20px) saturate(150%);
  background: color-mix(in oklch, white 70%, transparent);
}

/* View Transitions API로 페이지 전환을 부드럽게 */
@view-transition { navigation: auto; }
```

### 인터랙션

```css
/* :has() 선택자로 조건부 스타일 적용 */
.card:has(img) { padding-top: 0; } /* 이미지가 있는 카드는 상단 padding 없음 */

/* container queries로 컴포넌트가 진짜 반응형이 되도록 */
@container (min-width: 500px) { ... }

/* 새로운 color-mix 함수 */
.button:hover {
  background: color-mix(in oklch, var(--primary) 85%, black);
}
```

## 결정 빠른 참조：고민될 때

- 그라디언트를 추가하고 싶다? → 대부분의 경우 추가하지 마세요
- emoji를 추가하고 싶다? → 추가하지 마세요
- 카드에 둥근 모서리 + border-left accent를 추가하고 싶다? → 추가하지 말고 다른 방법을 사용하세요
- SVG로 hero 일러스트를 그리고 싶다? → 그리지 말고 placeholder를 사용하세요
- 인용문 장식을 추가하고 싶다? → 먼저 사용자에게 진짜 인용문이 있는지 물어보세요
- 아이콘 features 한 줄을 추가하고 싶다? → 먼저 아이콘이 필요한지 물어보세요, 필요 없을 수 있습니다
- Inter를 사용하려고 한다? → 더 특색 있는 폰트로 바꾸세요
- 보라색 그라디언트를 사용하려고 한다? → 근거 있는 색상 체계로 바꾸세요

**「추가하면 더 좋아 보일 것 같다」는 생각이 들 때 — 그것은 대부분 AI slop의 징조입니다**. 먼저 가장 단순한 버전을 만들고, 사용자가 요청할 때만 추가하세요.
