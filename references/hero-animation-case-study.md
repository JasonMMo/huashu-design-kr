# Gallery Ripple + Multi-Focus · 장면 편성 철학

> huashu-design hero 애니메이션 v9 (25초, 8장면)에서 추출한 **재사용 가능한 시각 편성 구조**입니다.
> 애니메이션 제작 파이프라인이 아니라, **어떤 장면에서 이 편성이 「올바른」 것인지**를 설명합니다.
> 실전 참고：[demos/hero-animation-v9.mp4](../demos/hero-animation-v9.mp4) · [https://www.huasheng.ai/huashu-design-hero/](https://www.huasheng.ai/huashu-design-hero/)

## 한 줄 요약

> **시각적으로 동질한 소재가 20개 이상 있고, 장면에서 「규모감과 깊이를 표현」해야 할 때, 타이포그래피를 쌓는 대신 Gallery Ripple + Multi-Focus 편성을 먼저 고려하세요.**

일반적인 SaaS 기능 애니메이션, 제품 출시회, 스킬 홍보, 시리즈 포트폴리오 전시 — 소재 수가 충분하고 스타일이 일관되다면, 이 구조는 거의 항상 효과를 냅니다.

---

## 이 기법이 실제로 표현하는 것

「소재를 과시」하는 것이 아닙니다 — **두 번의 리듬 변화**로 하나의 내러티브를 말합니다：

**첫 번째 박자 · Ripple 전개 (~1.5s)**：중심에서 사방으로 48장의 카드가 퍼져나가며, 관람자는 「양」에 압도됩니다 — 「아, 이게 이렇게 많은 결과물이 있구나」.

**두 번째 박자 · Multi-Focus (~8s, 4번 순환)**：카메라가 느린 pan을 하면서 동시에 4번, 배경을 dim + desaturate하고 특정 카드 하나를 화면 중앙으로 크게 확대합니다 — 관람자는 「양의 충격」에서 「질의 응시」로 전환되며, 각 1.7초씩 안정적인 리듬으로 반복됩니다.

**핵심 내러티브 구조**：**규모 (Ripple) → 응시 (Focus × 4) → 페이드아웃 (Walloff)**. 이 세 박자의 조합이 표현하는 것은 「Breadth × Depth」 — 많은 것을 할 수 있을 뿐 아니라, 하나하나 멈춰서 볼 만한 가치가 있습니다.

반례와 비교：

| 방식 | 관람자 인식 |
|------|---------|
| 48장 카드 정적 배열 (Ripple 없음) | 예쁘지만 내러티브 없음, grid 스크린샷처럼 보임 |
| 한 장씩 빠르게 전환 (Gallery 컨텍스트 없음) | 슬라이드쇼처럼 보이고 「규모감」을 잃음 |
| Ripple만 있고 Focus 없음 | 압도되었지만 특정 카드 하나도 기억에 남지 않음 |
| **Ripple + Focus × 4 (본 레시피)** | **먼저 양에 압도, 다음 질을 응시, 마지막으로 평화로운 페이드아웃 — 완전한 감정 아크** |

---

## 전제 조건 (모두 충족되어야 함)

이 편성은 **만능이 아닙니다**. 아래 4가지를 모두 만족해야 합니다：

1. **소재 수 ≥ 20장, 최적은 30+**
   20장 미만이면 Ripple이 「비어 보입니다」 — 48칸 모두 움직여야 밀도감이 생깁니다. v9는 48칸 × 32장 이미지(순환 채움)를 사용했습니다.

2. **소재의 시각 스타일이 일관되어야 함**
   모두 16:9 슬라이드 미리보기 / 모두 앱 스크린샷 / 모두 커버 디자인 — 비율, 색조, 레이아웃이 「한 세트」처럼 보여야 합니다. 혼재하면 Gallery가 클립보드처럼 보입니다.

3. **소재를 단독으로 확대했을 때 여전히 읽을 수 있는 정보가 있어야 함**
   Focus는 특정 카드를 960px 너비로 확대합니다. 원본 이미지를 확대했을 때 흐릿하거나 정보가 희박하면 Focus 박자가 무의미해집니다. 역방향 검증：48장 중에서 「가장 대표적인」 4장을 고를 수 있습니까? 고를 수 없다면 소재 품질이 고르지 않다는 의미입니다.

4. **장면이 가로 또는 정사각형, 세로 화면이 아닐 것**
   Gallery의 3D 기울기 (`rotateX(14deg) rotateY(-10deg)`)는 가로 방향의 뻗어나감이 필요합니다. 세로 화면에서는 기울기가 좁고 어색해 보입니다.

**조건이 부족할 때의 대안 경로**：

| 부족한 것 | 대안 |
|-------|-----------|
| 소재 < 20장 | 「3-5장 나란히 정적 배열 + 순차 focus」로 변경 |
| 스타일 불일치 | 「커버 + 3개 챕터 대형 이미지」의 keynote 스타일로 변경 |
| 정보 희박 | 「데이터 기반 대시보드」또는 「핵심 문구 + 대형 타이포그래피」로 변경 |
| 세로 화면 장면 | 「vertical scroll + sticky cards」로 변경 |

---

## 기술 레시피 (v9 실전 파라미터)

### 4-Layer 구조

```
viewport (1920×1080, perspective: 2400px)
  └─ canvas (4320×2520, 대형 overflow) → 3D tilt + pan
      └─ 8×6 grid = 48 cards (gap 40px, padding 60px)
          └─ img (16:9, border-radius 9px)
      └─ focus-overlay (absolute center, z-index 40)
          └─ img (선택된 슬라이드와 일치)
```

**핵심**：canvas가 viewport보다 2.25배 크기 때문에 pan에 「더 큰 세계를 들여다보는」 느낌이 생깁니다.

### Ripple 전개 (거리 지연 알고리즘)

```js
// 각 카드의 등장 시간 = 중심까지의 거리 × 0.8s 지연
const col = i % 8, row = Math.floor(i / 8);
const dc = col - 3.5, dr = row - 2.5;       // 중심까지의 offset
const dist = Math.hypot(dc, dr);
const maxDist = Math.hypot(3.5, 2.5);
const delay = (dist / maxDist) * 0.8;       // 0 → 0.8s
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
const opacity = expoOut(Math.min(1, localT));
```

**핵심 파라미터**：
- 총 시간 1.7s (`T.s3_ripple: [8.3, 10.0]`)
- 최대 지연 0.8s (중심이 가장 먼저, 모서리가 가장 늦게)
- 각 카드 등장 시간 0.7s
- Easing: `expoOut` (폭발감, 부드러움이 아님)

**동시에 하는 것**：canvas scale 1.25 → 0.94 (zoom out to reveal) — 등장과 함께 동기화된 줌 아웃 느낌.

### Multi-Focus (4번의 리듬)

```js
T.focuses = [
  { start: 11.0, end: 12.7, idx: 2  },  // 1.7s
  { start: 13.3, end: 15.0, idx: 3  },  // 1.7s
  { start: 15.6, end: 17.3, idx: 10 },  // 1.7s
  { start: 17.9, end: 19.6, idx: 16 },  // 1.7s
];
```

**리듬 법칙**：각 focus 1.7s, 0.6s 간격으로 숨 고르기. 총 8s (11.0–19.6s).

**각 focus 내부**：
- In ramp: 0.4s (`expoOut`)
- Hold: 중간 0.9s (`focusIntensity = 1`)
- Out ramp: 0.4s (`easeOut`)

**배경 변화 (이것이 핵심)**：

```js
if (focusIntensity > 0) {
  const dimOp = entryOp * (1 - 0.6 * focusIntensity);  // 40%로 dim
  const brt = 1 - 0.32 * focusIntensity;                // brightness 68%
  const sat = 1 - 0.35 * focusIntensity;                // saturate 65%
  card.style.filter = `brightness(${brt}) saturate(${sat})`;
}
```

**opacity만이 아닙니다 — 동시에 desaturate + darken 처리합니다**. 이로써 전경 overlay의 색채가 「튀어나오는」 것처럼 보이지, 단순히 「조금 밝아지는」 것이 아닙니다.

**Focus overlay 크기 애니메이션**：
- 400×225 (등장) → 960×540 (hold 상태)
- 외곽에 3층 shadow + 3px accent 색 outline ring, 「프레임 안에 담긴」 느낌 표현

### Pan (지속감으로 정적인 화면이 지루하지 않게)

```js
const panT = Math.max(0, t - 8.6);
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;
```

- 사인파 + 선형 drift 이중 운동 — 순수 루프가 아니라 매 순간 위치가 다름
- X/Y 주파수가 다름 (0.12 vs 0.09) — 시각적으로 「규칙적 루프」처럼 보이지 않도록
- ±900/500px 범위로 클램프하여 가장자리 이탈 방지

**왜 순수 선형 pan을 쓰지 않는가**：순수 선형이면 관람자가 「다음 초의 위치를 예측」합니다. 사인 + drift는 매 초가 새로운 위치여서 3D 기울기 아래에서 「미세한 뱃멀미 감」(좋은 쪽의)이 생기며 주의력을 붙잡아 둡니다.

---

## 5가지 재사용 가능한 패턴 (v6→v9 반복에서 증류)

### 1. **주요 easing으로 expoOut 사용, cubicOut이 아님**

`easeOut = 1 - (1-t)³` (부드러움) vs `expoOut = 1 - 2^(-10t)` (폭발 후 빠른 수렴).

**선택 이유**：expoOut은 앞 30%에서 이미 90%에 도달하며, 물리적 감쇠에 가깝고 「무거운 것이 착지하는」 직관에 부합합니다. 특히 적합한 곳：
- 카드 등장 (무게감)
- Ripple 확산 (충격파)
- 브랜드 부상 (착지감)

**여전히 cubicOut을 사용하는 경우**：focus out ramp, 대칭적인 미세 동작 효과.

### 2. **종이 느낌의 배경색 + 테라코타 오렌지 accent (Anthropic 계보)**

```css
--bg: #F7F4EE;        /* 따뜻한 종이 */
--ink: #1D1D1F;       /* 거의 검정 */
--accent: #D97757;    /* 테라코타 오렌지 */
--hairline: #E4DED2;  /* 따뜻한 선 */
```

**이유**：따뜻한 배경색은 GIF 압축 후에도 「숨 쉬는 느낌」이 남으며, 순수 흰색처럼 「화면 느낌」이 나지 않습니다. 테라코타 오렌지가 유일한 accent로 터미널 프롬프트, dir-card 선택, 커서, 브랜드 하이픈, focus ring — 모든 시각적 앵커 포인트를 이 하나의 색으로 연결합니다.

**v5 교훈**：「종이 질감」 시뮬레이션을 위해 noise overlay를 추가했더니 GIF 프레임 압축이 전부 망가졌습니다 (매 프레임이 달라짐). v6에서 「배경색 + 따뜻한 shadow만 사용」으로 변경하여 종이 느낌 90% 유지, GIF 파일 크기 60% 감소.

### 3. **두 단계 Shadow로 깊이감 구현, 진짜 3D 불필요**

```css
.gallery-card.depth-near { box-shadow: 0 32px 80px -22px rgba(60,40,20,0.22), ... }
.gallery-card.depth-far  { box-shadow: 0 14px 40px -16px rgba(60,40,20,0.10), ... }
```

`sin(i × 1.7) + cos(i × 0.73)` 결정론적 알고리즘으로 각 카드에 near/mid/far 세 단계 shadow 배정 — **시각적으로 「3차원 겹쳐짐」처럼 보이지만, 매 프레임 transform이 완전히 변하지 않아 GPU 소비 0**.

**진짜 3D의 비용**：카드 각각에 `translateZ`, GPU가 매 프레임 48개의 transform + shadow blur를 계산합니다. v4에서 시도해봤을 때 Playwright 녹화 25fps에서도 버거웠습니다. v6의 두 단계 shadow는 육안 효과 차이가 5% 미만이지만, 비용 차이는 10배입니다.

### 4. **폰트 굵기 변화 (font-variation-settings)가 폰트 크기 변화보다 영화적**

```js
const wght = 100 + (700 - 100) * morphP;  // 100 → 700 over 0.9s
wordmark.style.fontVariationSettings = `"wght" ${wght.toFixed(0)}`;
```

브랜드 워드마크가 Thin → Bold으로 0.9초에 걸쳐 변화하며, letter-spacing 미조정 포함 (-0.045 → -0.048em).

**왜 확대/축소보다 좋은가**：
- 확대/축소는 관람자가 너무 많이 봐서 기대가 고정됨
- 폰트 굵기 변화는 「내적인 충만감」이며, 「가까이 밀려오는」 것이 아니라 풍선이 채워지는 것 같음
- variable fonts는 2020년 이후 보편화된 특성으로, 관람자가 무의식적으로 「현대적」이라고 느낌

**제한**：variable font을 지원하는 폰트를 사용해야 합니다 (Inter / Roboto Flex / Recursive 등). 일반 정적 폰트는 흉내만 낼 수 있으며 (몇 가지 고정 weight 전환으로 점프가 생김).

### 5. **코너 브랜드 저강도 지속 서명**

Gallery 단계에서 좌상단에 `HUASHU · DESIGN` 소형 식별자가 있습니다 — 16% opacity, 12px 폰트, 넓은 자간.

**왜 추가하는가**：
- Ripple 폭발 후 관람자가 「어디에 집중해야 할지 모르게」 되기 쉬운데, 좌상단 가벼운 표시가 앵커 역할을 합니다
- 전체 화면 큰 로고보다 더 고급스럽습니다 — 브랜딩을 아는 사람은 브랜드 서명이 소리칠 필요가 없다는 것을 압니다
- GIF가 캡처되어 공유될 때도 귀속 신호가 남습니다

**규칙**：중간 구간 (화면이 바쁠 때)에만 표시됩니다. 오프닝에는 꺼두고 (터미널을 가리지 않도록), 엔딩에도 꺼둡니다 (브랜드 reveal이 주인공).

---

## 반례：이 편성을 쓰지 말아야 할 때

**❌ 제품 기능 시연 (기능을 보여줘야 하는 경우)**：Gallery는 모든 카드가 순식간에 지나가 관람자가 어떤 기능도 기억하지 못합니다. 「단일 화면 focus + tooltip 주석」으로 변경하세요.

**❌ 데이터 중심 콘텐츠**：관람자가 숫자를 읽어야 하는데, Gallery의 빠른 리듬은 읽을 시간을 주지 않습니다. 「데이터 차트 + 순차 reveal」로 변경하세요.

**❌ 스토리 내러티브**：Gallery는 「병렬」 구조이지만, 스토리는 「인과」가 필요합니다. keynote 챕터 전환으로 변경하세요.

**❌ 소재가 3-5장밖에 없음**：Ripple 밀도가 충분하지 않아 「패치」처럼 보입니다. 「정적 배열 + 순차 하이라이트」로 변경하세요.

**❌ 세로 화면 (9:16)**：3D tilt는 가로 방향의 뻗어나감이 필요합니다. 세로 화면에서는 기울기가 「넓게 펼쳐지는」 것이 아니라 「삐딱하게」 보입니다.

---

## 자신의 작업에 이 편성이 적합한지 판단하는 방법

3단계 빠른 확인：

**Step 1 · 소재 수 확인**：동질한 시각 소재가 몇 개인지 세어보세요. < 15 → 중단；15-25 → 억지스러움；25+ → 바로 사용.

**Step 2 · 일관성 테스트**：4장의 랜덤 소재를 나란히 놓았을 때 「한 세트」처럼 보입니까? 아니라면 → 먼저 스타일을 통일하거나 방안을 바꾸세요.

**Step 3 · 내러티브 일치 확인**：표현하려는 것이 「Breadth × Depth」 (양 × 질)입니까? 「프로세스」「기능」「스토리」입니까? 전자가 아니라면 억지로 맞추지 마세요.

세 단계 모두 yes라면, v6 HTML을 그대로 fork하여 `SLIDE_FILES` 배열과 타임라인만 바꾸면 재사용할 수 있습니다. `--bg / --accent / --ink`만 바꾸면 전체 스킨이 바뀌며 골격은 유지됩니다.

---

## 관련 레퍼런스

- 완전한 기술 흐름：[references/animations.md](animations.md) · [references/animation-best-practices.md](animation-best-practices.md)
- 애니메이션 내보내기 파이프라인：[references/video-export.md](video-export.md)
- 오디오 설정 (BGM + SFX 이중 트랙)：[references/audio-design-rules.md](audio-design-rules.md)
- Apple 갤러리 스타일 횡적 참고：[references/apple-gallery-showcase.md](apple-gallery-showcase.md)
- 소스 HTML (v6 + 오디오 통합 버전)：`www.huasheng.ai/huashu-design-hero/index.html`
