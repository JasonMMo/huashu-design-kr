# Apple Gallery Showcase · 갤러리 전시 벽 애니메이션 스타일

> 영감 출처：Claude Design 공식 사이트 hero 영상 + Apple 제품 페이지 「작품 벽」 형식 전시
> 실전 출처：huashu-design 릴리스 hero v5
> 적용 장면：**제품 출시 hero 애니메이션, 스킬 역량 시연, 포트폴리오 전시**——여러 개의 고품질 결과물을 한 화면에 전시하면서 관람객의 주의를 유도해야 하는 모든 장면

---

## 적용 판단：이 스타일을 언제 사용할까

**적합한 경우**：
- 화면에 동시에 보여줄 실제 결과물이 10개 이상인 경우 (PPT, 앱, 웹페이지, 인포그래픽 등)
- 관람객이 전문 직군인 경우 (개발자, 디자이너, 프로덕트 매니저) — 「품질감」에 민감한 대상
- 전달하고 싶은 분위기가 「절제, 전시회풍, 고급, 공간감」인 경우
- 세부 디테일과 전체 맥락을 동시에 보여줘야 하는 경우

**적합하지 않은 경우**：
- 단일 제품 집중 (frontend-design의 제품 hero 템플릿 사용)
- 감정적/스토리 중심의 애니메이션 (타임라인 내러티브 템플릿 사용)
- 소형 화면 / 세로 화면 (기울어진 시각은 작은 화면에서 흐릿하게 보임)

---

## 핵심 비주얼 Token

```css
:root {
  /* 밝은 갤러리 팔레트 */
  --bg:         #F5F5F7;   /* 주 캔버스 배경 — Apple 공식 회색 */
  --bg-warm:    #FAF9F5;   /* 따뜻한 미색 변형 */
  --ink:        #1D1D1F;   /* 주 글자색 */
  --ink-80:     #3A3A3D;
  --ink-60:     #545458;
  --muted:      #86868B;   /* 보조 텍스트 */
  --dim:        #C7C7CC;
  --hairline:   #E5E5EA;   /* 카드 1px 테두리 */
  --accent:     #D97757;   /* 테라코타 오렌지 — Claude 브랜드 */
  --accent-deep:#B85D3D;

  --serif-cn: "Noto Serif SC", "Songti SC", Georgia, serif;
  --serif-en: "Source Serif 4", "Tiempos Headline", Georgia, serif;
  --sans:     "Inter", -apple-system, "PingFang SC", system-ui;
  --mono:     "JetBrains Mono", "SF Mono", ui-monospace;
}
```

**핵심 원칙**：
1. **순수 검정 배경은 절대 사용하지 않습니다**. 검정 배경은 결과물을 영화처럼 보이게 하여 「실제로 활용 가능한 작업물」처럼 느껴지지 않습니다.
2. **테라코타 오렌지가 유일한 색조 accent**이며, 나머지는 모두 그레이스케일 + 흰색입니다.
3. **세 가지 폰트 스택** (영문 세리프 + 한국어 세리프 + 산세리프 + 모노)으로 「인터넷 제품」이 아닌 「출판물」의 분위기를 연출합니다.

---

## 핵심 레이아웃 패턴

### 1. 부유하는 카드 (이 스타일의 기본 단위)

```css
.gallery-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 6px;                          /* 내부 여백은 「액자 여백지」 */
  border: 1px solid var(--hairline);
  box-shadow:
    0 20px 60px -20px rgba(29, 29, 31, 0.12),   /* 주 그림자, 부드럽고 길게 */
    0 6px 18px -6px rgba(29, 29, 31, 0.06);     /* 두 번째 레이어, 부유감 연출 */
  aspect-ratio: 16 / 9;                  /* 슬라이드 비율 통일 */
  overflow: hidden;
}
.gallery-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 9px;                    /* 카드 모서리보다 약간 작게, 시각적 중첩감 */
}
```

**반면교사**：여백도 테두리도 그림자도 없는 타일 배치는 금지 — 그것은 인포그래픽의 밀도 표현이지 전시회가 아닙니다.

### 2. 3D 기울어진 작품 벽

```css
.gallery-viewport {
  position: absolute; inset: 0;
  overflow: hidden;
  perspective: 2400px;                   /* 깊은 원근감, 기울기가 과장되지 않음 */
  perspective-origin: 50% 45%;
}
.gallery-canvas {
  width: 4320px;                         /* 캔버스 = 뷰포트의 2.25배 */
  height: 2520px;                        /* 패닝 공간 확보 */
  transform-origin: center center;
  transform: perspective(2400px)
             rotateX(14deg)              /* 뒤로 기울임 */
             rotateY(-10deg)             /* 왼쪽으로 회전 */
             rotateZ(-2deg);             /* 약간의 기울기, 지나친 규칙성 제거 */
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 40px;
  padding: 60px;
}
```

**파라미터 sweet spot**：
- rotateX: 10-15deg (이보다 크면 VIP 행사 배경판처럼 보임)
- rotateY: ±8-12deg (좌우 대칭감)
- rotateZ: ±2-3deg (「기계가 배치한 게 아니다」라는 인간적 감각)
- perspective: 2000-2800px (2000 미만은 어안렌즈 효과, 3000 초과는 정투영에 가까워짐)

### 3. 2×2 사각 집중 (선택 장면)

```css
.grid22 {
  display: grid;
  grid-template-columns: repeat(2, 800px);
  gap: 56px 64px;
  align-items: start;
}
```

각 카드는 해당 코너(tl/tr/bl/br)에서 중심을 향해 슬라이드 인 + fade in됩니다. 대응하는 `cornerEntry` 벡터：

```js
const cornerEntry = {
  tl: { dx: -700, dy: -500 },
  tr: { dx:  700, dy: -500 },
  bl: { dx: -700, dy:  500 },
  br: { dx:  700, dy:  500 },
};
```

---

## 다섯 가지 핵심 애니메이션 패턴

### 패턴 A · 사각 집중 (0.8-1.2s)

4개 요소가 뷰포트 사각에서 슬라이드 인되며 동시에 0.85→1.0으로 스케일 업됩니다 (ease-out). 「다방향 선택지를 보여주는」 오프닝에 적합합니다.

```js
const inP = easeOut(clampLerp(t, start, end));
card.style.transform = `translate3d(${(1-inP)*ce.dx}px, ${(1-inP)*ce.dy}px, 0) scale(${0.85 + 0.15*inP})`;
card.style.opacity = inP;
```

### 패턴 B · 선택된 카드 확대 + 나머지 슬라이드 아웃 (0.8s)

선택된 카드는 1.0→1.28로 확대되고, 나머지 카드는 fade out + blur + 각 코너로 복귀됩니다：

```js
// 선택된 카드
card.style.transform = `translate3d(${cellDx*outP}px, ${cellDy*outP}px, 0) scale(${1 + 0.28*easeOut(zoomP)})`;
// 선택되지 않은 카드
card.style.opacity = 1 - outP;
card.style.filter = `blur(${outP * 1.5}px)`;
```

**핵심**：선택되지 않은 카드는 blur 처리합니다 — 단순 fade가 아닙니다. blur는 피사계심도를 모방하여 선택된 카드를 시각적으로 「앞으로 끌어냅니다」.

### 패턴 C · Ripple 파문 전개 (1.7s)

중심에서 바깥으로, 거리에 따른 delay로 각 카드가 순차적으로 fade in + 1.25x에서 0.94x로 축소됩니다 (「카메라 줌 아웃」 효과)：

```js
const col = i % COLS, row = Math.floor(i / COLS);
const dc = col - (COLS-1)/2, dr = row - (ROWS-1)/2;
const dist = Math.sqrt(dc*dc + dr*dr);
const delay = (dist / maxDist) * 0.8;
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
card.style.opacity = easeOut(Math.min(1, localT));

// 전체 스케일 1.25→0.94 동시 적용
const galleryScale = 1.25 - 0.31 * easeOut(rippleProgress);
```

### 패턴 D · Sinusoidal Pan (지속 드리프트)

사인파 + 선형 드리프트를 조합하여 marquee처럼 「시작점과 끝점이 있는」 루프감을 방지합니다：

```js
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;    // 수평 왼쪽 드리프트
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;    // 수직 위쪽 드리프트
const clampedX = Math.max(-900, Math.min(900, panX));   // 가장자리 노출 방지
```

**파라미터**：
- 사인 주기 `0.09-0.15 rad/s` (느리게, 약 30-50초에 한 번 진동)
- 선형 드리프트 `5-8 px/s` (눈 깜빡임보다 느리게)
- 진폭 `120-220 px` (느낄 수 있을 만큼 크되, 어지럽지 않을 만큼 작게)

### 패턴 E · Focus Overlay (포커스 전환)

**핵심 설계**：focus overlay는 **평면 요소** (기울어지지 않음)로, 기울어진 캔버스 위에 부유합니다. 선택된 슬라이드가 타일 위치 (약 400×225)에서 화면 중앙 (960×540)으로 확대되고, 배경 캔버스는 기울기 변화 없이 **45%로 어두워집니다**：

```js
// Focus overlay (flat, centered)
focusOverlay.style.width = (startW + (endW - startW) * focusIntensity) + 'px';
focusOverlay.style.height = (startH + (endH - startH) * focusIntensity) + 'px';
focusOverlay.style.opacity = focusIntensity;

// 배경 카드 어둡게, 하지만 여전히 보이도록 (핵심! 100% 가림 금지)
card.style.opacity = entryOp * (1 - 0.55 * focusIntensity);   // 1 → 0.45
card.style.filter = `brightness(${1 - 0.3 * focusIntensity})`;
```

**선명도 철칙**：
- Focus overlay의 `<img>`는 반드시 원본 이미지에 `src`를 직접 연결하고, **갤러리의 압축 썸네일을 재사용하지 마세요**.
- 모든 원본 이미지를 `new Image()[]` 배열로 미리 preload하세요.
- overlay 자체의 `width/height`는 프레임마다 계산되며, 브라우저가 매 프레임 원본 이미지를 리샘플링합니다.

---

## 타임라인 아키텍처 (재사용 가능한 골격)

```js
const T = {
  DURATION: 25.0,
  s1_in: [0.0, 0.8],    s1_type: [1.0, 3.2],  s1_out: [3.5, 4.0],
  s2_in: [3.9, 5.1],    s2_hold: [5.1, 7.0],  s2_out: [7.0, 7.8],
  s3_hold: [7.8, 8.3],  s3_ripple: [8.3, 10.0],
  panStart: 8.6,
  focuses: [
    { start: 11.0, end: 12.7, idx: 2  },
    { start: 13.3, end: 15.0, idx: 3  },
    { start: 15.6, end: 17.3, idx: 10 },
    { start: 17.9, end: 19.6, idx: 16 },
  ],
  s4_walloff: [21.1, 21.8], s4_in: [21.8, 22.7], s4_hold: [23.7, 25.0],
};

// 핵심 easing
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function lerp(time, start, end, fromV, toV, easing) {
  if (time <= start) return fromV;
  if (time >= end) return toV;
  let p = (time - start) / (end - start);
  if (easing) p = easing(p);
  return fromV + (toV - fromV) * p;
}

// 단일 render(t) 함수가 타임스탬프를 읽고 모든 요소에 씁니다
function render(t) { /* ... */ }
requestAnimationFrame(function tick(now) {
  const t = ((now - startMs) / 1000) % T.DURATION;
  render(t);
  requestAnimationFrame(tick);
});
```

**아키텍처의 핵심**：**모든 상태는 타임스탬프 t에서 도출됩니다** — 상태 머신도 setTimeout도 없습니다. 이를 통해：
- 임의 시점으로 `window.__setTime(12.3)` 즉시 점프 가능 (Playwright 프레임별 스크린샷에 유리)
- 루프가 자연스럽게 이음새 없이 처리됨 (t mod DURATION)
- 디버그 시 임의 프레임을 고정할 수 있음

---

## 질감 디테일 (놓치기 쉽지만 치명적)

### 1. SVG noise texture

밝은 배경에서 가장 우려되는 것은 「너무 평평함」입니다. 매우 약한 fractalNoise 레이어를 겹쳐주세요：

```html
<style>
.stage::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.078  0 0 0 0 0.078  0 0 0 0 0.074  0 0 0 0.035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: 0.5;
  pointer-events: none;
  z-index: 30;
}
</style>
```

있을 때는 차이가 없어 보이지만, 제거하면 확연히 느껴집니다.

### 2. 코너 브랜드 식별자

```html
<div class="corner-brand">
  <div class="mark"></div>
  <div>HUASHU · DESIGN</div>
</div>
```

```css
.corner-brand {
  position: absolute; top: 48px; left: 72px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
```

작품 벽 장면에서만 표시되며, 페이드 인/아웃됩니다. 미술관 전시 라벨처럼 보입니다.

### 3. 브랜드 워드마크

```css
.brand-wordmark {
  font-family: var(--sans);
  font-size: 148px;
  font-weight: 700;
  letter-spacing: -0.045em;   /* 네거티브 자간이 핵심 — 글자를 로고처럼 압축 */
}
.brand-wordmark .accent {
  color: var(--accent);
  font-weight: 500;           /* accent 문자는 오히려 가늘게, 시각적 대비 */
}
```

`letter-spacing: -0.045em`은 Apple 제품 페이지 대형 타이포그래피의 표준 방식입니다.

---

## 자주 발생하는 실패 패턴

| 증상 | 원인 | 해결책 |
|---|---|---|
| PPT 템플릿처럼 보임 | 카드에 shadow / hairline이 없음 | 두 레이어 box-shadow + 1px border 추가 |
| 기울기가 저렴해 보임 | rotateY만 사용하고 rotateZ를 추가하지 않음 | ±2-3deg rotateZ로 규칙성 깨기 |
| Pan이 「끊김」처럼 느껴짐 | setTimeout 또는 CSS keyframes 루프 사용 | rAF + sin/cos 연속 함수로 전환 |
| Focus 시 텍스트가 흐릿함 | 갤러리 타일의 저해상도 이미지를 재사용 | 독립 overlay + 원본 이미지 src 직접 연결 |
| 배경이 너무 비어 보임 | 단순 `#F5F5F7` 단색 | SVG fractalNoise 0.5 opacity 레이어 추가 |
| 폰트가 「인터넷 제품」처럼 보임 | Inter만 사용 | Serif (영문/한국어 각각) + mono 세 가지 스택 추가 |

---

## 참고

- 완성 구현 샘플：`/Users/alchain/Documents/写作/01-公众号写作/项目/2026.04-huashu-design发布/配图/hero-animation-v5.html`
- 원본 영감：claude.ai/design hero 영상
- 참고 미감：Apple 제품 페이지, Dribbble 샷 컬렉션 페이지

「여러 개의 고품질 결과물을 전시해야 하는」 애니메이션 요청이 들어오면, 이 파일의 골격을 그대로 복사하여 콘텐츠와 타이밍만 바꿔 사용하세요.
