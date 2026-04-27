# 편집 가능한 PPTX 내보내기：HTML 하드 제약 + 크기 결정 + 자주 발생하는 오류

이 문서는 **`scripts/html2pptx.js` + `pptxgenjs`를 사용하여 HTML을 요소 단위로 진짜 편집 가능한 PowerPoint 텍스트 박스로 변환하는** 경로를 설명합니다. 이것이 `export_deck_pptx.mjs`가 지원하는 유일한 경로입니다.

> **핵심 전제**：이 경로를 사용하려면 HTML을 첫 번째 줄부터 아래의 4가지 제약에 맞춰 작성해야 합니다. **완성 후에 변환하는 것이 아닙니다** — 사후 수정은 2-3시간의 재작업을 초래합니다 (2026-04-20 프로젝트 실전 경험).
>
> 시각적 자유도를 우선시하는 장면 (애니메이션 / web component / CSS 그라디언트 / 복잡한 SVG)은 PDF 경로 (`export_deck_pdf.mjs` / `export_deck_stage_pdf.mjs`)를 사용하세요. **PPTX 내보내기가 시각적 충실도와 편집 가능성을 동시에 만족시킬 것이라고 기대하지 마세요** — 이것은 PPTX 파일 형식 자체의 물리적 제약입니다 (하단 「왜 4가지 제약이 버그가 아닌 물리적 제약인가」 참조).

---

## 캔버스 크기：960×540pt (LAYOUT_WIDE) 사용

PPTX의 단위는 **inch** (물리적 크기)이지 px가 아닙니다. 결정 원칙：body의 computedStyle 크기가 **presentation layout의 inch 크기와 일치**해야 합니다 (±0.1", `html2pptx.js`의 `validateDimensions`가 강제 검사).

### 3가지 후보 크기 비교

| HTML body | 물리적 크기 | 대응 PPT 레이아웃 | 선택 시점 |
|---|---|---|---|
| **`960pt × 540pt`** | **13.333″ × 7.5″** | **pptxgenjs `LAYOUT_WIDE`** | ✅ **기본 권장** (현대 PowerPoint 16:9 표준) |
| `720pt × 405pt` | 10″ × 5.625″ | 사용자 정의 | 사용자가 「구버전 PowerPoint Widescreen」 템플릿을 명시한 경우에만 |
| `1920px × 1080px` | 20″ × 11.25″ | 사용자 정의 | ❌ 비표준 크기, 프로젝터 투사 후 폰트가 비정상적으로 작아 보임 |

**HTML 크기를 해상도로 생각하지 마세요.** PPTX는 벡터 문서이며, body 크기는 **물리적 크기**를 결정하지 선명도를 결정하지 않습니다. body가 크다고 (20″×11.25″) 텍스트가 더 선명해지지 않습니다 — 오히려 pt 폰트 크기가 캔버스 대비 상대적으로 작아져, 프로젝터 투사 / 인쇄 시 더 보기 어려워집니다.

### body 작성 방법 세 가지 (모두 동일)

```css
body { width: 960pt;  height: 540pt; }    /* 가장 명확, 권장 */
body { width: 1280px; height: 720px; }    /* 동일, px 선호 시 */
body { width: 13.333in; height: 7.5in; }  /* 동일, inch 직관 */
```

대응하는 pptxgenjs 코드：

```js
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, 별도 정의 불필요
```

---

## 4가지 하드 제약 (위반 시 즉시 오류 발생)

`html2pptx.js`는 HTML DOM을 요소 단위로 PowerPoint 객체로 변환합니다. PowerPoint의 형식 제약이 HTML에 투영된 것이 아래 4가지 규칙입니다.

### 규칙 1：DIV 안에 텍스트를 직접 작성 금지 — 반드시 `<p>` 또는 `<h1>`-`<h6>`으로 감싸야 합니다

```html
<!-- ❌ 잘못된 방법：텍스트가 div 안에 직접 있음 -->
<div class="title">Q3 매출 23% 성장</div>

<!-- ✅ 올바른 방법：텍스트가 <p> 또는 <h1>-<h6> 안에 있음 -->
<div class="title"><h1>Q3 매출 23% 성장</h1></div>
<div class="body"><p>신규 사용자가 주요 동인입니다</p></div>
```

**이유**：PowerPoint 텍스트는 반드시 text frame 안에 있어야 하며, text frame은 HTML의 단락 수준 요소(p/h*/li)에 대응합니다. 단순 `<div>`는 PPTX에서 대응하는 텍스트 컨테이너가 없습니다.

**`<span>`도 주 텍스트를 담을 수 없습니다** — span은 인라인 요소로, 독립적인 텍스트 박스로 정렬될 수 없습니다. span은 p/h\* **안에서** 부분 스타일 (굵기, 색상 변경)용으로만 사용하세요.

### 규칙 2：CSS 그라디언트 지원 안 됨 — 단색만 사용 가능

```css
/* ❌ 잘못된 방법 */
background: linear-gradient(to right, #FF6B6B, #4ECDC4);

/* ✅ 올바른 방법：단색 */
background: #FF6B6B;

/* ✅ 여러 색 스트라이프가 꼭 필요하다면, flex 자식 요소로 각각 단색 처리 */
.stripe-bar { display: flex; }
.stripe-bar div { flex: 1; }
.red   { background: #FF6B6B; }
.teal  { background: #4ECDC4; }
```

**이유**：PowerPoint의 shape fill은 solid / gradient-fill 두 가지를 지원하지만, pptxgenjs의 `fill: { color: ... }`는 solid만 매핑됩니다. 그라디언트를 PowerPoint 네이티브 gradient로 사용하려면 별도 구조가 필요하며, 현재 툴체인은 이를 지원하지 않습니다.

### 규칙 3：배경 / 테두리 / 그림자는 DIV에만 지정 가능, 텍스트 태그에는 불가

```html
<!-- ❌ 잘못된 방법：<p>에 배경색이 있음 -->
<p style="background: #FFD700; border-radius: 4px;">강조 내용</p>

<!-- ✅ 올바른 방법：외부 div가 배경/테두리를 담당, <p>는 텍스트만 -->
<div style="background: #FFD700; border-radius: 4px; padding: 8pt 12pt;">
  <p>강조 내용</p>
</div>
```

**이유**：PowerPoint에서 shape (사각형 / 둥근 직사각형)과 text frame은 두 개의 별도 객체입니다. HTML의 `<p>`는 text frame으로만 변환되며, 배경 / 테두리 / 그림자는 shape에 해당하므로 **텍스트를 감싸는 div**에 작성해야 합니다.

### 규칙 4：DIV에 `background-image` 사용 금지 — `<img>` 태그를 사용하세요

```html
<!-- ❌ 잘못된 방법 -->
<div style="background-image: url('chart.png')"></div>

<!-- ✅ 올바른 방법 -->
<img src="chart.png" style="position: absolute; left: 50%; top: 20%; width: 300pt; height: 200pt;" />
```

**이유**：`html2pptx.js`는 `<img>` 요소에서만 이미지 경로를 추출하며, CSS의 `background-image` URL은 파싱하지 않습니다.

---

## Path A HTML 템플릿 골격

슬라이드마다 독립적인 HTML 파일 하나 (단일 파일 덱의 CSS 오염 방지를 위해 서로 스코프 격리).

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 960pt; height: 540pt;           /* ⚠️ LAYOUT_WIDE에 맞춤 */
    font-family: system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif;
    background: #FEFEF9;                    /* 단색, 그라디언트 불가 */
    overflow: hidden;
  }
  /* DIV는 레이아웃 / 배경 / 테두리 담당 */
  .card {
    position: absolute;
    background: #1A4A8A;                    /* 배경은 DIV에 */
    border-radius: 4pt;
    padding: 12pt 16pt;
  }
  /* 텍스트 태그는 폰트 스타일만 담당, 배경/테두리 없음 */
  .card h2 { font-size: 24pt; color: #FFFFFF; font-weight: 700; }
  .card p  { font-size: 14pt; color: rgba(255,255,255,0.85); }
</style>
</head>
<body>

  <!-- 제목 영역：외부 div로 위치 지정, 내부 텍스트 태그 -->
  <div style="position: absolute; top: 40pt; left: 60pt; right: 60pt;">
    <h1 style="font-size: 36pt; color: #1A1A1A; font-weight: 700;">제목은 단언문으로, 주제어가 아니라</h1>
    <p style="font-size: 16pt; color: #555555; margin-top: 10pt;">부제목 보충 설명</p>
  </div>

  <!-- 내용 카드：div가 배경 담당, h2/p가 텍스트 담당 -->
  <div class="card" style="top: 130pt; left: 60pt; width: 240pt; height: 160pt;">
    <h2>핵심 포인트 1</h2>
    <p>간결한 설명 텍스트</p>
  </div>

  <!-- 목록：ul/li 사용, 수동 • 기호 사용 금지 -->
  <div style="position: absolute; top: 320pt; left: 60pt; width: 540pt;">
    <ul style="font-size: 16pt; color: #1A1A1A; padding-left: 24pt; list-style: disc;">
      <li>첫 번째 포인트</li>
      <li>두 번째 포인트</li>
      <li>세 번째 포인트</li>
    </ul>
  </div>

  <!-- 이미지：<img> 태그 사용, background-image 금지 -->
  <img src="illustration.png" style="position: absolute; right: 60pt; top: 110pt; width: 320pt; height: 240pt;" />

</body>
</html>
```

---

## 자주 발생하는 오류 빠른 참조

| 오류 메시지 | 원인 | 수정 방법 |
|---------|------|---------|
| `DIV element contains unwrapped text "XXX"` | div 안에 직접 텍스트가 있음 | 텍스트를 `<p>` 또는 `<h1>`-`<h6>`으로 감싸세요 |
| `CSS gradients are not supported` | linear/radial-gradient 사용 | 단색으로 바꾸거나, flex 자식 요소로 분할 처리 |
| `Text element <p> has background` | `<p>` 태그에 배경색이 있음 | 외부에 `<div>` 를 감싸 배경을 담당하게 하고, `<p>`는 텍스트만 작성 |
| `Background images on DIV elements are not supported` | div에 background-image 사용 | `<img>` 태그로 변경 |
| `HTML content overflows body by Xpt vertically` | 콘텐츠가 540pt를 초과 | 콘텐츠 줄이기 또는 폰트 크기 축소, 또는 `overflow: hidden`으로 잘라내기 |
| `HTML dimensions don't match presentation layout` | body 크기와 presentation 레이아웃 불일치 | body를 `960pt × 540pt`로 설정하고 `LAYOUT_WIDE` 사용; 또는 defineLayout으로 커스텀 크기 정의 |
| `Text box "XXX" ends too close to bottom edge` | 큰 폰트의 `<p>`가 body 하단 경계에서 < 0.5 inch 이내 | 위로 이동시키고 충분한 하단 여백 확보; PPT 하단은 원래 일부가 가려질 수 있음 |

---

## 기본 워크플로 (3단계로 PPTX 출력)

### Step 1：제약에 맞게 페이지별 독립 HTML 작성

```
내 덱/
├── slides/
│   ├── 01-cover.html    # 각 파일이 완전한 960×540pt HTML
│   ├── 02-agenda.html
│   └── ...
└── illustration/        # 모든 <img>가 참조하는 이미지
    ├── chart1.png
    └── ...
```

### Step 2：`html2pptx.js`를 호출하는 build.js 작성

```js
const pptxgen = require('pptxgenjs');
const html2pptx = require('../scripts/html2pptx.js');  // 본 스킬 스크립트

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inch, HTML의 960×540pt에 대응

  const slides = ['01-cover.html', '02-agenda.html', '03-content.html'];
  for (const file of slides) {
    await html2pptx(`./slides/${file}`, pres);
  }

  await pres.writeFile({ fileName: 'deck.pptx' });
})();
```

### Step 3：열어서 확인

- PowerPoint / Keynote로 내보낸 PPTX 열기
- 텍스트를 더블 클릭하면 직접 편집 가능해야 합니다 (이미지로 나타난다면 규칙 1 위반)
- overflow 검증：각 페이지가 body 범위 안에 있고, 잘려나간 것이 없는지 확인

---

## 이 경로 vs 다른 옵션 (언제 무엇을 선택할까)

| 필요 사항 | 선택 |
|------|------|
| 동료가 PPTX의 텍스트를 수정할 예정 / 비기술 직군에게 전달하여 계속 편집 | **본 문서 경로** (편집 가능, HTML을 처음부터 4가지 제약에 맞게 작성 필요) |
| 발표용 / 보관용으로만 사용, 이후 수정 없음 | `export_deck_pdf.mjs` (다중 파일) 또는 `export_deck_stage_pdf.mjs` (단일 파일 deck-stage), 벡터 PDF 출력 |
| 시각적 자유도 우선 (애니메이션, web component, CSS 그라디언트, 복잡한 SVG), 편집 불가 수용 | **PDF** (동일) — PDF는 시각적 충실도와 크로스플랫폼 모두 만족하며, 「이미지 PPTX」보다 적합 |

**이미 시각적으로 완성된 HTML에 html2pptx를 무리하게 적용하지 마세요** — 실전 테스트 결과 시각 중심 HTML의 통과율이 30% 미만이며, 나머지 페이지의 수정은 처음부터 다시 쓰는 것보다 더 느립니다. 이런 경우는 PDF를 출력해야 하며, PPTX를 강제 출력해서는 안 됩니다.

---

## Fallback：이미 시각 시안이 있지만 사용자가 편집 가능한 PPTX를 고집하는 경우

이런 상황이 간혹 발생합니다：이미 시각 중심의 HTML (그라디언트, web component, 복잡한 SVG 모두 사용)이 완성되어 PDF 출력이 가장 적합하지만, 사용자가 「편집 가능한 PPTX」여야 한다고 명확히 요구하는 경우입니다.

**`html2pptx`를 무리하게 실행하고 통과를 기대하지 마세요** — 실전 테스트에서 시각 중심 HTML의 html2pptx 통과율은 30% 미만이며, 나머지 70%는 오류 또는 레이아웃 망가짐이 발생합니다. 올바른 fallback은 다음과 같습니다：

### Step 1 · 먼저 한계를 알리기 (투명한 소통)

한 문장으로 세 가지를 명확히 전달하세요：

> 「현재 HTML에는 [구체적으로 나열：그라디언트 / web component / 복잡한 SVG / ...]가 포함되어 있어, 직접 편집 가능한 PPTX로 변환하면 실패합니다. 두 가지 방안이 있습니다：
> - A. **PDF 출력** (권장) — 시각을 100% 보존하며, 수신자가 열람과 인쇄는 가능하지만 텍스트 수정은 불가
> - B. **시각 시안을 기반으로 편집 가능한 HTML 재작성** (색상/레이아웃/문안의 디자인 의사결정은 유지하되, 4가지 하드 제약에 맞게 HTML 구조를 재조직, **그라디언트, web component, 복잡한 SVG 등의 시각 능력은 포기**) → 편집 가능한 PPTX 출력
>
> 어느 쪽을 선택하시겠습니까?」

B 방안을 가볍게 설명하지 마세요 — **무엇을 포기하게 되는지** 명확히 알려주세요. 사용자가 결정하도록 하세요.

### Step 2 · 사용자가 B를 선택한 경우：AI가 직접 재작성, 사용자에게 직접 작성하도록 하지 않음

여기서의 원칙은：**사용자가 제공하는 것은 디자인 의도이며, 여러분이 적합한 구현으로 번역하는 책임이 있습니다**. 사용자에게 4가지 하드 제약을 학습시키고 스스로 재작성하도록 하지 마세요.

재작성 시 준수 원칙：
- **유지**：색상 시스템 (주색/보조색/중성색), 정보 위계 (제목/부제목/본문/주석), 핵심 문안, 레이아웃 골격 (상중하 / 좌우 2열 / 그리드), 페이지 리듬
- **다운그레이드**：CSS 그라디언트 → 단색 또는 flex 분할, web component → 단락 수준 HTML, 복잡한 SVG → 단순화된 `<img>` 또는 단색 기하도형, 그림자 → 삭제 또는 최소화, 커스텀 폰트 → 시스템 폰트로 전환
- **재작성**：bare 텍스트 → `<p>` / `<h*>`으로 감싸기, `background-image` → `<img>` 태그, `<p>`의 배경/테두리 → 외부 div로 이동

### Step 3 · 비교 목록 출력 (투명한 납품)

재작성 완료 후 before/after 비교를 사용자에게 제공하여 어떤 시각 디테일이 단순화되었는지 알려주세요：

```
원본 디자인 → 편집 가능 버전 조정 사항
- 제목 영역 보라색 그라디언트 → 주색 #5B3DE8 단색 배경
- 데이터 카드 그림자 → 삭제 (2pt 테두리로 구분)
- 복잡한 SVG 꺾은선 그래프 → 단순화된 <img> PNG (HTML 스크린샷으로 생성)
- Hero 영역 web component 동적 효과 → 정적 첫 프레임 (web component 변환 불가)
```

### Step 4 · 내보내기 & 두 가지 형식 납품

- `editable` 버전 HTML → `scripts/export_deck_pptx.mjs` 실행하여 편집 가능 PPTX 출력
- **원본 시각 시안도 보존할 것을 권장** → `scripts/export_deck_pdf.mjs` 실행하여 고충실도 PDF 출력
- 두 가지 형식을 함께 납품：시각 시안의 PDF + 편집 가능한 PPTX, 각각의 역할에 맞게 사용

### B 방안을 직접 거부해야 하는 경우

일부 상황에서는 재작성 비용이 과도하여 사용자에게 편집 가능한 PPTX 포기를 권고해야 합니다：
- HTML의 핵심 가치가 애니메이션 또는 인터랙션인 경우 (재작성 후 정적 첫 프레임만 남아 정보량이 50%+ 손실)
- 페이지 수 > 30, 재작성 비용이 2시간 초과
- 시각 디자인이 정밀한 SVG / 커스텀 filter에 깊이 의존하는 경우 (재작성 후 원본과 거의 관계 없어짐)

이 경우 사용자에게 말하세요：「이 덱은 재작성 비용이 너무 높습니다. PDF 출력을 권장하며, PPTX 형식을 편집 가능하게 만들려면 시각적으로 크게 단순화되는 것을 감수해야 합니다 — PDF로 바꾸시겠습니까?」

---

## 왜 4가지 제약이 버그가 아닌 물리적 제약인가

이 4가지는 `html2pptx.js` 작성자의 나태함이 아닙니다 — 이것은 **PowerPoint 파일 형식 (OOXML) 자체의 제약**이 HTML에 투영된 결과입니다：

- PPTX에서 텍스트는 반드시 text frame (`<a:txBody>`) 안에 있어야 하며, 이것이 단락 수준 HTML 요소에 대응
- PPTX의 shape과 text frame은 두 개의 별도 객체로, 동일 요소에 배경을 그리면서 텍스트를 작성할 수 없음
- PPTX의 shape fill은 그라디언트 지원이 제한적 (일부 preset gradient만 지원, CSS 임의 각도 그라디언트는 지원하지 않음)
- PPTX의 picture 객체는 반드시 실제 이미지 파일을 참조해야 하며, CSS 속성이 아님

이 점을 이해하면, **도구가 더 똑똑해지기를 기대하지 말고** — HTML 작성 방식이 PPTX 형식에 맞춰야 하며, 반대가 아닙니다.
