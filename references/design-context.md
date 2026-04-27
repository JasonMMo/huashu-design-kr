# 디자인 컨텍스트：기존 컨텍스트에서 출발하기

**이것이 이 스킬에서 가장 중요한 한 가지입니다.**

좋은 high-fidelity 디자인은 반드시 기존 디자인 컨텍스트에서 성장해야 합니다. **컨텍스트 없이 hi-fi를 만드는 것은 최후의 수단이며, 반드시 일반적인 결과물이 나옵니다**. 그러므로 모든 디자인 작업을 시작할 때, 먼저 물어보세요：참고할 수 있는 것이 있습니까?

## 디자인 컨텍스트란

우선순위가 높은 것부터 낮은 순서로：

### 1. 사용자의 Design System / UI Kit
사용자 제품에 이미 있는 컴포넌트 라이브러리, 색상 토큰, 폰트 규범, 아이콘 시스템. **가장 이상적인 상황**입니다.

### 2. 사용자의 Codebase
사용자가 코드베이스를 제공하면, 그 안에 살아있는 컴포넌트 구현체가 있습니다. 이런 파일들을 읽으세요：
- `theme.ts` / `colors.ts` / `tokens.css` / `_variables.scss`
- 구체적인 컴포넌트 (Button.tsx, Card.tsx)
- 레이아웃 scaffold (App.tsx, MainLayout.tsx)
- 전역 스타일시트

**코드를 읽고 정확한 값을 그대로 사용하세요**：hex 코드, 간격 스케일, 폰트 스택, border radius. 기억에 의존해 다시 그리지 마세요.

### 3. 사용자의 출시된 제품
사용자에게 출시된 제품이 있지만 코드를 주지 않는 경우, Playwright를 사용하거나 사용자에게 스크린샷을 요청하세요.

```bash
# Playwright로 공개 URL 스크린샷
npx playwright screenshot https://example.com screenshot.png --viewport-size=1920,1080
```

실제 시각적 어휘(vocabulary)를 확인할 수 있습니다.

### 4. 브랜드 가이드 / 로고 / 기존 소재
사용자에게 있을 수 있는 것：로고 파일, 브랜드 색상 규범, 마케팅 자료, 슬라이드 템플릿. 이 모두가 컨텍스트입니다.

### 5. 경쟁사 레퍼런스
사용자가 「XX 웹사이트처럼」이라고 말한다면 — URL이나 스크린샷을 제공해 달라고 요청하세요. **절대** 학습 데이터의 모호한 인상으로 작업하지 마세요.

### 6. 알려진 디자인 시스템 (fallback)
위의 모든 것이 없다면, 공인된 디자인 시스템을 베이스로 사용하세요：
- Apple HIG
- Material Design 3
- Radix Colors (배색)
- shadcn/ui (컴포넌트)
- Tailwind 기본 팔레트

사용자에게 어떤 시스템을 사용하는지 명확히 알리고, 이것이 출발점이지 최종본이 아님을 알게 하세요.

## 컨텍스트 수집 프로세스

### Step 1：사용자에게 물어보기

작업 시작 시 필수 질문 목록 (`workflow.md` 참조)：

```markdown
1. 기존에 쓰시는 design system / UI kit / 컴포넌트 라이브러리가 있나요? 어디에 있나요?
2. 브랜드 가이드, 색상/폰트 규범이 있나요?
3. 기존 제품의 스크린샷이나 URL을 제공해 주실 수 있나요?
4. 제가 읽을 수 있는 codebase가 있나요?
```

### Step 2：사용자가 「없다」고 할 때, 직접 찾아보기

바로 포기하지 마세요. 이렇게 시도해 보세요：

```markdown
단서가 없는지 살펴볼게요：
- 이전 프로젝트에 관련 디자인이 있나요?
- 회사 마케팅 웹사이트에서 어떤 색상/폰트를 사용하나요?
- 제품의 로고는 어떤 스타일인가요? 하나 보내주실 수 있나요?
- 참고할 만하다고 생각하는 제품이 있나요?
```

### Step 3：찾을 수 있는 모든 컨텍스트 읽기

사용자가 codebase 경로를 제공하면：
1. **먼저 파일 구조를 살펴보세요**：style / theme / component 관련 파일 찾기
2. **theme / token 파일 읽기**：구체적인 hex / px 값 추출
3. **대표적인 컴포넌트 2-3개 읽기**：시각적 어휘 파악 (hover state, shadow, border, padding 패턴)
4. **전역 스타일시트 읽기**：기본 리셋, 폰트 로딩
5. **Figma 링크 / 스크린샷이 있다면**：이미지를 보되, **코드를 더 신뢰하세요**

**중요**：**한 번 보고 인상으로 작업하지 마세요**. 30개 이상의 구체적인 값을 추출했을 때 진짜로 컨텍스트를 흡수한 것입니다.

### Step 4：사용할 시스템을 사용자에게 말하기

컨텍스트를 파악한 후, 사용할 시스템을 사용자에게 알려주세요：

```markdown
codebase와 제품 스크린샷을 기반으로 제가 정리한 디자인 시스템입니다：

**색상**
- Primary: #C27558 (tokens.css에서)
- Background: #FDF9F0
- Text: #1A1A1A
- Muted: #6B6B6B

**폰트**
- Display: Instrument Serif (global.css의 @font-face에서)
- Body: Geist Sans
- Mono: JetBrains Mono

**간격** (스케일 시스템 기반)
- 4, 8, 12, 16, 24, 32, 48, 64

**Shadow 패턴**
- `0 1px 2px rgba(0,0,0,0.04)` (subtle card)
- `0 10px 40px rgba(0,0,0,0.1)` (elevated modal)

**Border-radius**
- 소형 컴포넌트 4px, 카드 12px, 버튼 8px

**컴포넌트 어휘**
- Button：채워진 primary, 테두리만 있는 secondary, ghost tertiary, 모두 border-radius 8px
- Card：흰색 배경, subtle shadow, 테두리 없음

이 시스템으로 작업을 시작하겠습니다. 문제가 없으면 확인해 주세요.
```

사용자 확인 후 작업을 시작하세요.

## 컨텍스트 없이 디자인하기 (컨텍스트가 없을 때의 fallback)

**강한 경고**：이 상황에서의 결과물 품질은 현저히 낮아집니다. 사용자에게 명확히 알려주세요.

```markdown
디자인 컨텍스트가 없어서 일반적인 직관에 의존해서만 작업할 수 있습니다.
결과물은 「보기에는 괜찮지만 독자성이 부족한」 것이 될 것입니다.
계속 진행하시겠습니까, 아니면 먼저 참고 자료를 준비하시겠습니까?
```

사용자가 그래도 진행을 원한다면, 다음 순서로 결정하세요：

### 1. aesthetic direction 선택
일반적인 결과를 주지 마세요. 명확한 방향을 하나 선택하세요：
- brutally minimal
- editorial / magazine
- brutalist / raw
- organic / natural
- luxury / refined
- playful / toy
- retro-futuristic
- soft / pastel

사용자에게 어떤 방향을 선택했는지 알려주세요.

### 2. 알려진 디자인 시스템을 골격으로 선택
- Radix Colors로 배색 (https://www.radix-ui.com/colors)
- shadcn/ui로 컴포넌트 어휘 (https://ui.shadcn.com)
- Tailwind 간격 스케일 (4의 배수)

### 3. 특색 있는 폰트 조합 선택

Inter / Roboto를 사용하지 마세요. 추천 조합 (Google Fonts 무료)：
- Instrument Serif + Geist Sans
- Cormorant Garamond + Inter Tight
- Bricolage Grotesque + Söhne (유료)
- Fraunces + Work Sans (Fraunces는 AI가 남용하기 시작했으니 주의)
- JetBrains Mono + Geist Sans (기술적인 느낌)

### 4. 핵심 결정마다 근거를 명시하기

조용히 선택하지 마세요. HTML comment에 작성하세요：

```html
<!--
Design decisions:
- Primary color: warm terracotta (oklch 0.65 0.18 25) — fits the "editorial" direction  
- Display: Instrument Serif for humanist, literary feel
- Body: Geist Sans for cleanness contrast
- No gradients — committed to minimal, no AI slop
- Spacing: 8px base, golden ratio friendly (8/13/21/34)
-->
```

## Import 전략 (사용자가 codebase를 제공한 경우)

사용자가 「이 codebase를 참고해서 만들어 달라」고 할 때：

### 소형 (<50개 파일)
전부 읽고 컨텍스트를 내재화하세요.

### 중형 (50-500개 파일)
이 부분에 집중하세요：
- `src/components/` 또는 `components/`
- 모든 styles / tokens / theme 관련 파일
- 대표적인 전체 페이지 컴포넌트 2-3개 (Home.tsx, Dashboard.tsx)

### 대형 (>500개 파일)
사용자에게 포커스를 명확히 해달라고 요청하세요：
- 「settings 페이지를 만들고 싶다」 → 기존 settings 관련 파일 읽기
- 「새로운 기능을 추가하고 싶다」 → 전체 shell + 가장 유사한 레퍼런스 읽기
- 전체를 다 읽으려 하지 말고, 정확한 부분을 읽으세요

## Figma / 디자인 시안과의 협업

사용자가 Figma 링크를 제공한 경우：

- **Figma를 HTML로 직접 변환할 수 있다고 기대하지 마세요** — 추가 도구가 필요합니다
- Figma 링크는 일반적으로 공개 접근이 불가능합니다
- 사용자에게 요청하세요：**스크린샷**으로 내보내 전달 + 구체적인 color / spacing 값 알려주기

Figma 스크린샷만 받은 경우 사용자에게 알려주세요：
- 시각적인 내용은 볼 수 있지만 정확한 값은 가져올 수 없습니다
- 핵심 수치 (hex, px)를 알려주시거나, Figma의 코드 내보내기 기능을 사용해 주세요 (Figma 지원 기능)

## 마지막 당부

**프로젝트 디자인 품질의 상한선은 확보한 컨텍스트의 품질에 의해 결정됩니다.**

컨텍스트 수집에 10분을 투자하는 것이, 컨텍스트 없이 hi-fi를 1시간 동안 그리는 것보다 훨씬 가치 있습니다.

**컨텍스트가 없는 상황에서는, 무리하게 진행하기보다 먼저 사용자에게 요청하세요.**
