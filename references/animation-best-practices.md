# Animation Best Practices · 올바른 애니메이션 설계 문법

> Anthropic 공식 세 가지 제품 애니메이션（Claude Design / Claude Code Desktop / Claude for Word）의
> 심층 분석을 바탕으로 추출한 "Anthropic 수준" 애니메이션 설계 규칙입니다.
>
> `animation-pitfalls.md`（함정 회피 목록）와 함께 사용하세요——본 파일은「**이렇게 해야 한다**」이고,
> pitfalls는「**이렇게 하면 안 된다**」로 서로 보완적이니 둘 다 읽어야 합니다.
>
> **제약 선언**: 본 파일에는 **움직임의 논리와 표현 스타일**만 수록하며, **브랜드 색상의 구체적 색값은 포함하지 않습니다**.
> 색상 결정은 §1.a 핵심 자산 프로토콜（브랜드 spec에서 추출）또는 「디자인 방향 컨설턴트」
> （20가지 철학별 배색 방안）를 따르세요. 본 reference는 「**어떻게 움직이는가**」를 논하며, 「**어떤 색인가**」는 다루지 않습니다.

---

## §0 · 당신은 누구인가 · 정체성과 취향

> 아래의 기술 규칙을 읽기 전에 이 섹션을 먼저 읽으세요. 규칙은 **정체성에서 비롯됩니다**——
> 그 반대가 아닙니다.

### §0.1 정체성 앵커

**당신은 Anthropic / Apple / Pentagram / Field.io의 모션 아카이브를 연구한 모션 디자이너입니다.**

애니메이션을 만들 때, 당신은 CSS transition을 조정하는 것이 아닙니다——디지털 요소로 **물리 세계를 시뮬레이션**하여
관객의 잠재의식이 「이것은 무게가 있고, 관성이 있으며, 흘러넘칠 수 있는 물체」라고 믿게 만드는 것입니다.

당신은 PowerPoint식 애니메이션을 만들지 않습니다. 당신은 「fade in fade out」 애니메이션을 만들지 않습니다. 당신이 만드는 애니메이션은 **사람들이 화면이
손을 뻗어 들어갈 수 있는 공간이라고 믿게 만듭니다**.

### §0.2 핵심 신념（3가지）

1. **애니메이션은 물리학이지, 애니메이션 커브가 아니다**
   `linear`는 숫자이고, `expoOut`는 물체입니다. 화면의 픽셀을 "물체"로 대우할 가치가 있다고 믿으세요.
   모든 easing 선택은 「이 요소는 얼마나 무거운가? 마찰 계수는 얼마인가?」라는 물리적 질문에 답하는 것입니다.

2. **타이밍 분배가 커브 형태보다 더 중요하다**
   Slow-Fast-Boom-Stop이 당신의 호흡입니다. **균일한 리듬의 애니메이션은 기술 시연이고, 리듬이 있는 애니메이션은 서사입니다.**
   올바른 순간에 느려지는 것이——잘못된 순간에 올바른 easing을 쓰는 것보다 더 중요합니다.

3. **관객을 배려하는 것이 기술 과시보다 어렵다**
   핵심 결과 전 0.5초 멈춤은 **기술**이지 타협이 아닙니다. **인간 두뇌에 반응 시간을 주는 것이 애니메이터의 최고 소양입니다.**
   AI는 기본적으로 멈춤 없이 정보 밀도가 가득한 애니메이션을 만들려 합니다——그것은 초보자의 방식입니다. 당신이 해야 할 것은 절제입니다.

### §0.3 취향 기준 · 무엇이 아름다운가

「좋다」와 「훌륭하다」의 판단 기준은 다음과 같습니다. 각각에는 **식별 방법**이 있습니다——후보 애니메이션을 볼 때
14가지 규칙을 기계적으로 대조하는 것이 아니라 이 질문들로 기준에 부합하는지 판단하세요.

| 아름다움의 차원 | 식별 방법（관객 반응） |
|---|---|
| **물리적 무게감** | 애니메이션이 끝날 때 요소가 "**떨어져**" 안정되는 느낌——단순히 "**멈추는**" 것이 아닙니다. 관객의 잠재의식이 "이것은 무게가 있다"고 느낍니다 |
| **관객 배려** | 핵심 정보 출현 전 감지할 수 있는 pause（≥300ms）가 있습니다——관객이 "**볼 수 있는**" 시간이 있습니다 |
| **여백** | 마무리는 갑작스러운 중단 + hold이지, fade to black이 아닙니다. 마지막 프레임이 선명하고, 확신에 차 있으며, 결정적입니다 |
| **절제** | 전체에서 딱 한 곳만 「120% 정교함」이고, 나머지 80%는 적절함——**곳곳에서 기술을 과시하는 것은 저급한 신호입니다** |
| **손의 느낌** | 곡선（직선 아님）, 불규칙함（setInterval의 기계적 리듬 아님）, 호흡감 |
| **존중** | 수정 과정을 보여주고, 버그 수정을 보여주는 것——**작업을 숨기지 않고, "마법"을 보여주지 않습니다**. AI는 협력자이지 마술사가 아닙니다 |

### §0.4 자가 점검 · 관객 첫 반응 방법

애니메이션을 완성한 후, **관객이 보고 나서 첫 반응은 무엇인가?**——이것이 당신이 최적화해야 할 유일한 지표입니다.

| 관객 반응 | 등급 | 진단 |
|---|---|---|
| "꽤 부드럽네" | good | 합격이지만 특색 없음, PowerPoint를 만들고 있습니다 |
| "이 애니메이션 정말 자연스럽다" | good+ | 기술적으로는 맞지만 놀랍지는 않습니다 |
| "이것이 **책상 위에서 떠오르는 것처럼** 진짜 같다" | great | 물리적 무게감에 닿았습니다 |
| "이것은 AI가 만든 것 같지 않다" | great+ | Anthropic의 문턱에 닿았습니다 |
| "**스크린샷 찍어서** 공유하고 싶다" | great++ | 관객이 자발적으로 전파하게 만들었습니다 |

**great와 good의 차이는 기술적 정확도에 있지 않고 취향 판단에 있습니다**. 기술적 정확 + 올바른 취향 = great.
기술적 정확 + 빈 취향 = good. 기술적 오류 = 아직 입문하지 못했습니다.

### §0.5 정체성과 규칙의 관계

아래 §1-§8의 기술 규칙은 이 정체성이 구체적인 시나리오에서의 **실행 수단**입니다——독립적인 규칙 목록이 아닙니다.

- 규칙이 다루지 않는 상황을 만났을 때 → §0으로 돌아가 **정체성**으로 판단하고, 추측하지 마세요
- 규칙들 사이에 충돌이 있을 때 → §0으로 돌아가 **취향 기준**으로 어느 것이 더 중요한지 판단하세요
- 규칙을 깨고 싶을 때 → 먼저 답하세요: "이렇게 하는 것이 §0.3의 어떤 아름다움에 부합하는가?" 답할 수 있으면 깨고, 답할 수 없으면 깨지 마세요

좋습니다. 계속 읽으세요.

---

## 개요 · 애니메이션은 물리학의 세 가지 전개

대부분의 AI 생성 애니메이션이 저렴한 느낌을 주는 근본 원인은——**그것들이 「물체」가 아닌 「숫자」처럼 행동하기 때문**입니다.
실제 세계의 물체는 질량, 관성, 탄성이 있고 흘러넘칩니다. Anthropic 세 편의 「고급스러운 느낌」의 근원은
디지털 요소에 **물리 세계의 운동 규칙** 한 세트를 부여하는 데 있습니다.

이 규칙에는 3가지 레이어가 있습니다:

1. **서사 리듬 레이어**: Slow-Fast-Boom-Stop의 타이밍 분배
2. **모션 커브 레이어**: Expo Out / Overshoot / Spring, linear 거부
3. **표현 언어 레이어**: 과정 표시, 마우스 곡선, Logo 변형 수렴

---

## 1. 서사 리듬 · Slow-Fast-Boom-Stop 5단 구조

Anthropic 세 편의 영상이 예외 없이 따르는 구조:

| 단계 | 비율 | 리듬 | 역할 |
|---|---|---|---|
| **S1 트리거** | ~15% | 느림 | 인간에게 반응 시간 부여, 현실감 구축 |
| **S2 생성** | ~15% | 중간 | 시각적 하이라이트 등장 |
| **S3 과정** | ~40% | 빠름 | 제어 가능성/밀도/디테일 표시 |
| **S4 폭발** | ~20% | Boom | 카메라 후퇴/3D pop-out/다중 패널 등장 |
| **S5 낙하** | ~10% | 정지 | 브랜드 Logo + 갑작스러운 중단 |

**구체적 타이밍 매핑**（15초 애니메이션 예시）:
S1 트리거 2s · S2 생성 2s · S3 과정 6s · S4 폭발 3s · S5 낙하 2s

**금지 사항**:
- ❌ 균일한 리듬（매초 정보 밀도가 동일）— 관객 피로
- ❌ 지속적인 고밀도 — 피크 없음, 기억에 남는 것 없음
- ❌ 점차 약해지는 마무리（fade out으로 투명하게）— **갑작스럽게 중단**해야 합니다

**자가 점검**: 종이에 5개의 thumbnail을 그리세요. 각각은 각 단계의 하이라이트 장면을 나타냅니다. 5장의 그림이 비슷하다면,
리듬이 구현되지 않은 것입니다.

---

## 2. Easing 철학 · linear 거부, 물리학 수용

Anthropic 세 편의 모든 애니메이션 효과는 「댐핑 감」이 있는 베지어 커브를 사용합니다. 기본 cubic easeOut
（`1-(1-t)³`）은 **충분히 날카롭지 않습니다**——시작이 충분히 빠르지 않고, 정지가 충분히 안정적이지 않습니다.

### 세 가지 핵심 Easing（animations.jsx에 내장됨）

```js
// 1. Expo Out · 빠른 시작 느린 제동（가장 많이 사용, 기본 주 easing）
// CSS 대응: cubic-bezier(0.16, 1, 0.3, 1)
Easing.expoOut(t) // = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

// 2. Overshoot · 탄성 있는 toggle/버튼 팝업
// CSS 대응: cubic-bezier(0.34, 1.56, 0.64, 1)
Easing.overshoot(t)

// 3. Spring 물리 · 기하학적 요소 귀환, 자연스러운 착지
Easing.spring(t)
```

### 사용 매핑

| 시나리오 | 어떤 Easing 사용 |
|---|---|
| 카드 rise-in / 패널 입장 / Terminal fade / focus overlay | **`expoOut`**（주 easing, 가장 많이 사용） |
| Toggle 전환 / 버튼 팝업 / 강조 인터랙션 | `overshoot` |
| Preview 기하 요소 귀환 / 물리적 착지 / UI 요소 탄성 | `spring` |
| 지속 움직임（마우스 궤적 보간 등） | `easeInOut`（대칭성 유지） |

### 반직관적 인사이트

대부분의 제품 홍보 애니메이션은 **너무 빠르고 딱딱합니다**. `linear`는 디지털 요소를 기계처럼 만들고, `easeOut`은 기본 점수이며,
`expoOut`가 바로 「고급스러운 느낌」의 기술적 근원입니다——디지털 요소에 **물리 세계의 무게감**을 줍니다.

---

## 3. 모션 언어 · 8가지 공통 원칙

### 3.1 배경색에 순수 흑백을 사용하지 않는다

Anthropic 세 편의 영상 중 어느 것도 `#FFFFFF` 또는 `#000000`을 주요 배경색으로 사용하지 않습니다. **색온도가 있는 중성색**
（따뜻하거나 차갑거나）은 "종이 / 캔버스 / 책상"의 물질감이 있어 기계적인 느낌을 줄여줍니다.

**구체적 색값 결정**은 §1.a 핵심 자산 프로토콜（브랜드 spec에서 추출）또는 「디자인 방향 컨설턴트」
（20가지 철학별 배경색 방안）를 따르세요. 본 reference는 구체적 색값을 제시하지 않습니다——그것은 **브랜드 결정**이지 모션 규칙이 아닙니다.

### 3.2 Easing은 절대 linear가 아니다

§2 참조.

### 3.3 Slow-Fast-Boom-Stop 서사

§1 참조.

### 3.4 「과정」을 보여주고 「마법 결과」를 보여주지 않는다

- Claude Design은 tweak 파라미터, 슬라이더 드래그를 보여줍니다（일키 완벽한 결과를 생성하는 것이 아닙니다）
- Claude Code는 코드 에러 + AI 수정을 보여줍니다（한 번에 성공하는 것이 아닙니다）
- Claude for Word는 Redline 빨간 삭제 초록 추가의 수정 과정을 보여줍니다（바로 최종본을 주는 것이 아닙니다）

**공통 함의**: 제품은 **협력자, 페어 엔지니어, 시니어 편집자**입니다——원클릭 마술사가 아닙니다.
이것은 전문 사용자의 「제어 가능성」과 「진실성」에 대한 페인포인트를 정확하게 공략합니다.

**Anti-AI slop**: AI는 기본적으로 「마법 원클릭 성공」 애니메이션을 만들려 합니다（원클릭 생성 → 완벽한 결과），
이것이 공통 분모입니다. **반대로 하는 것**——과정 보여주기, tweak 보여주기, 버그와 수정 보여주기——
이 브랜드 인식도의 출처입니다.

### 3.5 마우스 궤적 수동 그리기（곡선 + Perlin Noise）

실제 마우스 움직임은 직선이 아니라 「가속 시작 → 곡선 → 감속 수정 → 클릭」입니다.
AI가 직접 직선 보간하는 마우스 궤적은 **잠재의식적 거부감**을 줍니다.

```js
// 이차 베지어 곡선 보간（시작점 → 제어점 → 끝점）
function bezierQuadratic(p0, p1, p2, t) {
  const x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
  const y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
  return [x, y];
}

// 경로: 시작점 → 이탈 중간점 → 끝점（곡선 만들기）
const path = [[100, 100], [targetX - 200, targetY + 80], [targetX, targetY]];

// 극소 Perlin Noise（±2px）를 더해 「손 떨림」 효과 생성
const jitterX = (simpleNoise(t * 10) - 0.5) * 4;
const jitterY = (simpleNoise(t * 10 + 100) - 0.5) * 4;
```

### 3.6 Logo「형태 변환 수렴」(Morph)

Anthropic 세 편의 Logo 등장은 **단순한 fade-in이 아닙니다**. **이전 시각적 요소가 변형되어 등장합니다**.

**공통 패턴**: 마지막 1-2초에 Morph / Rotate / Converge를 하여 전체 서사가 브랜드 포인트에서 「수렴」합니다.

**저비용 구현**（실제 morph 불필요）:
이전 시각적 요소를 「수축」시켜 색상 블록으로 만들고（scale → 0.1, 중심으로 translate），
색상 블록이 다시 「팽창」하여 wordmark로 전개됩니다. 전환에는 150ms 빠른 전환 + motion blur
（`filter: blur(6px)` → `0`）를 사용합니다.

```js
<Sprite start={13} end={14}>
  {/* 수축: 이전 요소 scale 0.1, opacity 유지, filter blur 증가 */}
  const scale = interpolate(t, [0, 0.5], [1, 0.1], Easing.expoOut);
  const blur = interpolate(t, [0, 0.5], [0, 6]);
</Sprite>
<Sprite start={13.5} end={15}>
  {/* 팽창: Logo가 색상 블록 중심에서 scale 0.1 → 1, blur 6 → 0 */}
  const scale = interpolate(t, [0, 0.6], [0.1, 1], Easing.overshoot);
  const blur = interpolate(t, [0, 0.6], [6, 0]);
</Sprite>
```

### 3.7 세리프 + 산세리프 듀얼 폰트

- **브랜드 / 내레이션**: 세리프（「학술적 / 출판물 / 취향」이 있는 느낌）
- **UI / 코드 / 데이터**: 산세리프 + 등폭

**단일 폰트는 모두 올바르지 않습니다**. 세리프는 「취향」을 주고, 산세리프는 「기능」을 줍니다.

구체적인 폰트 선택은 브랜드 spec（brand-spec.md의 Display / Body / Mono 세 가지 스택）또는 디자인 방향
컨설턴트의 20가지 철학을 따르세요. 본 reference는 구체적인 폰트를 제시하지 않습니다——그것은 **브랜드 결정**입니다.

### 3.8 포커스 전환 = 배경 약화 + 전경 선명화 + Flash 가이드

포커스 전환은 **단순히** opacity를 낮추는 것이 아닙니다. 완전한 레시피:

```js
// 비포커스 요소의 필터 조합
tile.style.filter = `
  brightness(${1 - 0.5 * focusIntensity})
  saturate(${1 - 0.3 * focusIntensity})
  blur(${focusIntensity * 4}px)        // ← 핵심: blur를 추가해야 진짜 "뒤로 물러남"
`;
tile.style.opacity = 0.4 + 0.6 * (1 - focusIntensity);

// 포커스 완료 후 포커스 위치에서 150ms Flash highlight로 시선 유도
focusOverlay.animate([
  { background: 'rgba(255,255,255,0.3)' },
  { background: 'rgba(255,255,255,0)' }
], { duration: 150, easing: 'ease-out' });
```

**blur가 필수인 이유**: opacity + brightness만으로는 포커스 외 요소가 여전히 「선명」하여,
시각적으로 「뒤 경에 물러남」 효과가 없습니다. blur(4-8px)가 비포커스 요소를 실제로 한 레이어 깊이감 있게 물러나게 합니다.

---

## 4. 구체적인 모션 기법（직접 사용 가능한 코드 스니펫）

### 4.1 FLIP / Shared Element Transition

버튼이 「팽창」하여 입력창이 되는 것은, 버튼이 사라지고 새 패널이 나타나는 것이 **아닙니다**. 핵심은 **동일한 DOM 요소**가
두 상태 사이에서 transition하는 것이지, 두 요소가 cross-fade하는 것이 아닙니다.

```jsx
// Framer Motion layoutId 사용
<motion.div layoutId="design-button">Design</motion.div>
// ↓ 클릭 후 동일한 layoutId
<motion.div layoutId="design-button">
  <input placeholder="Describe your design..." />
</motion.div>
```

네이티브 구현 참조 https://aerotwist.com/blog/flip-your-animations/

### 4.2 「호흡식」 확장（width→height）

패널 확장은 **width와 height를 동시에 당기는 것이 아니라**:
- 앞 40% 시간: width만 당김（height는 작게 유지）
- 뒤 60% 시간: width 유지, height 확장

이것은 물리 세계의 「먼저 펼치고, 그다음 물을 채우는」 느낌을 시뮬레이션합니다.

```js
const widthT = interpolate(t, [0, 0.4], [0, 1], Easing.expoOut);
const heightT = interpolate(t, [0.3, 1], [0, 1], Easing.expoOut);
style.width = `${widthT * targetW}px`;
style.height = `${heightT * targetH}px`;
```

### 4.3 Staggered Fade-up（30ms stagger）

표 행, 카드 열, 목록 항목 입장 시, **각 요소가 30ms 지연**되고, `translateY`는 10px에서 0으로 돌아옵니다.

```js
rows.forEach((row, i) => {
  const localT = Math.max(0, t - i * 0.03);  // 30ms stagger
  row.style.opacity = interpolate(localT, [0, 0.3], [0, 1], Easing.expoOut);
  row.style.transform = `translateY(${
    interpolate(localT, [0, 0.3], [10, 0], Easing.expoOut)
  }px)`;
});
```

### 4.4 비선형 호흡 · 핵심 결과 전 0.5s 정지

기계는 빠르고 연속적으로 실행하지만, **핵심 결과 전 0.5초 정지**로 관객 두뇌에 반응 시간을 줍니다.

```jsx
// 전형적인 시나리오: AI 생성 완료 → 0.5s 정지 → 결과 등장
<Sprite start={8} end={8.5}>
  {/* 0.5s 멈춤——아무것도 움직이지 않음, 관객이 로딩 상태를 바라보게 함 */}
  <LoadingState />
</Sprite>
<Sprite start={8.5} end={10}>
  <ResultAppear />
</Sprite>
```

**반례**: AI 생성 완료 후 즉시 끊김 없이 결과로 전환——관객에게 반응 시간이 없어, 정보 손실이 발생합니다.

### 4.5 Chunk Reveal · token 스트리밍 시뮬레이션

AI 텍스트 생성 시 **`setInterval`로 한 글자씩 튀어나오는 방식을 사용하지 마세요**（구형 영화 자막처럼）. **chunk reveal**을 사용하세요
——한 번에 2-5개 문자가 나타나고, 간격이 불규칙하여 실제 token 스트리밍 출력을 시뮬레이션합니다.

```js
// 문자 단위가 아닌 chunk 단위로 분할
const chunks = text.split(/(\s+|,\s*|\.\s*|;\s*)/);  // 단어 + 구두점으로 분할
let i = 0;
function reveal() {
  if (i >= chunks.length) return;
  element.textContent += chunks[i++];
  const delay = 40 + Math.random() * 80;  // 불규칙 40-120ms
  setTimeout(reveal, delay);
}
reveal();
```

### 4.6 Anticipation → Action → Follow-through

디즈니 12원칙의 3가지. Anthropic이 명시적으로 사용합니다:

- **Anticipation**（예비）: 동작 시작 전 작은 역방향 움직임（버튼이 살짝 축소 후 팝업）
- **Action**（동작）: 주요 동작 자체
- **Follow-through**（추적）: 동작 종료 후 여운（카드가 착지 후 살짝 bounce）

```js
// 카드 입장의 완전한 세 단계
const anticip = interpolate(t, [0, 0.2], [1, 0.95], Easing.easeIn);     // 예비
const action  = interpolate(t, [0.2, 0.7], [0.95, 1.05], Easing.expoOut); // 주요 동작
const settle  = interpolate(t, [0.7, 1], [1.05, 1], Easing.spring);       // 바운스
// 최종 scale = 세 단계의 곱 또는 분할 적용
```

**반례**: Anticipation + Follow-through 없이 Action만 있는 애니메이션은 「PowerPoint 애니메이션」처럼 보입니다.

### 4.7 3D Perspective + translateZ 레이어링

「기울어진 3D + 부유하는 카드」 분위기를 원한다면, 컨테이너에 perspective를 추가하고 개별 요소에 다른 translateZ를 적용하세요:

```css
.stage-wrap {
  perspective: 2400px;
  perspective-origin: 50% 30%;  /* 시선이 약간 아래에서 바라보는 느낌 */
}
.card-grid {
  transform-style: preserve-3d;
  transform: rotateX(8deg) rotateY(-4deg);  /* 황금 비율 */
}
.card:nth-child(3n) { transform: translateZ(30px); }
.card:nth-child(5n) { transform: translateZ(-20px); }
.card:nth-child(7n) { transform: translateZ(60px); }
```

**rotateX 8° / rotateY -4°가 황금 비율인 이유**:
- 10° 초과 → 요소가 너무 비틀려 「쓰러지는」 느낌
- 5° 미만 → 「원근감」이 아닌 「전단」처럼 보임
- 8° × -4°의 비대칭 비율은 「카메라가 책상 왼쪽 위에서 내려다보는」 자연스러운 각도를 시뮬레이션

### 4.8 사선 Pan · XY 동시 이동

카메라 움직임은 순수 상하나 순수 좌우가 아니라, **XY를 동시에 이동**하여 사선 움직임을 시뮬레이션합니다:

```js
const panX = Math.sin(flowT * 0.22) * 40;
const panY = Math.sin(flowT * 0.35) * 30;
stage.style.transform = `
  translate(-50%, -50%)
  rotateX(8deg) rotateY(-4deg)
  translate3d(${panX}px, ${panY}px, 0)
`;
```

**핵심**: X와 Y의 주파수가 다릅니다（0.22 vs 0.35）. Lissajous 순환이 규칙적으로 보이는 것을 방지합니다.

---

## 5. 장면 레시피（세 가지 서사 템플릿）

참고 자료의 세 편의 영상은 세 가지 제품 성격에 대응합니다. **당신의 제품에 가장 잘 맞는 하나를 선택**하고, 혼합하지 마세요.

### 레시피 A · Apple Keynote 드라마틱（Claude Design 유형）

**적합**: 대형 버전 출시, hero 애니메이션, 시각적 강렬함 우선
**리듬**: Slow-Fast-Boom-Stop 강한 호
**Easing**: 전체 `expoOut` + 소량 `overshoot`
**SFX 밀도**: 높음（~0.4/s）, SFX 음고를 BGM 음계에 맞춤
**BGM**: IDM / 미니멀 테크 일렉트로닉, 차분함+정밀함
**수렴**: 카메라 급격히 후퇴 → drop → Logo 변형 → 공허한 단음 → 갑작스러운 중단

### 레시피 B · 원샷 도구형（Claude Code 유형）

**적합**: 개발자 도구, 생산성 앱, 플로우 상태 시나리오
**리듬**: 지속적으로 안정적인 flow, 명확한 피크 없음
**Easing**: `spring` 물리 + `expoOut`
**SFX 밀도**: **0**（순수하게 BGM으로 편집 리듬 구동）
**BGM**: Lo-fi Hip-hop / Boom-bap, 85-90 BPM
**핵심 기법**: 핵심 UI 동작이 BGM kick/snare 과도기에 맞음——「**음악 리듬이 곧 인터랙션 효과음**」

### 레시피 C · 오피스 효율 서사형（Claude for Word 유형）

**적합**: 기업 소프트웨어, 문서/표/캘린더 유형, 전문성 우선
**리듬**: 다중 scene 하드 컷 + Dolly In/Out
**Easing**: `overshoot`（toggle）+ `expoOut`（패널）
**SFX 밀도**: 중간（~0.3/s）, UI 클릭 위주
**BGM**: Jazzy Instrumental, 단조, BPM 90-95
**핵심 하이라이트**: 특정 장면에서 반드시 「전체 하이라이트」가 있음—— 3D pop-out / 평면에서 분리되어 부유

---

## 6. 반례 · 이렇게 하면 AI slop

| 안티 패턴 | 왜 잘못된가 | 올바른 방법 |
|---|---|---|
| `transition: all 0.3s ease` | `ease`는 linear의 친척, 모든 요소가 동일한 속도 | `expoOut` + 요소별 stagger 사용 |
| 모든 입장이 `opacity 0→1` | 움직임 방향감 없음 | `translateY 10→0` + Anticipation과 함께 사용 |
| Logo 페이드인 | 서사 수렴감 없음 | Morph / Converge / 수축-전개 |
| 마우스 직선 이동 | 잠재의식적 기계 느낌 | 베지어 곡선 + Perlin Noise |
| 타이핑 한 글자씩 튀어나옴（setInterval） | 구형 영화 자막 같음 | Chunk Reveal, 랜덤 간격 |
| 핵심 결과 전 정지 없음 | 관객에게 반응 시간 없음 | 결과 전 0.5s 정지 |
| 포커스 전환 시 opacity만 변경 | 포커스 외 요소가 여전히 선명 | opacity + brightness + **blur** |
| 순수 검정 배경 / 순수 흰색 배경 | 사이버 느낌 / 반사 피로 | 색온도 있는 중성색（브랜드 spec 참조） |
| 모든 애니메이션이 동일하게 빠름 | 리듬 없음 | Slow-Fast-Boom-Stop |
| Fade out 마무리 | 결정감 없음 | 갑작스러운 중단（마지막 프레임 hold） |

---

## 7. 자가 점검 목록（애니메이션 납품 전 60초）

- [ ] 서사 구조가 Slow-Fast-Boom-Stop이고, 균일한 리듬이 아닌가?
- [ ] 기본 easing이 `expoOut`이고, `easeOut`이나 `linear`가 아닌가?
- [ ] Toggle / 버튼 팝업에 `overshoot`를 사용했는가?
- [ ] 카드 / 목록 입장에 30ms stagger가 있는가?
- [ ] 핵심 결과 전 0.5s 정지가 있는가?
- [ ] 타이핑에 Chunk Reveal을 사용하고, setInterval 단일 문자가 아닌가?
- [ ] 포커스 전환에 blur를 추가했는가（opacity만이 아닌）?
- [ ] Logo가 형태 변환 수렴（Morph）이고, 페이드인이 아닌가?
- [ ] 배경색이 순수 검정 / 순수 흰색이 아닌가（색온도 있음）?
- [ ] 텍스트에 세리프 + 산세리프 계층이 있는가?
- [ ] 마무리가 갑작스러운 중단이고, 점차 약해지는 것이 아닌가?
- [ ] （마우스가 있는 경우）마우스 궤적이 곡선이고, 직선이 아닌가?
- [ ] SFX 밀도가 제품 성격에 맞는가（레시피 A/B/C 참조）?
- [ ] BGM과 SFX가 6-8dB 음량 차이가 있는가?（`audio-design-rules.md` 참조）

---

## 8. 다른 reference와의 관계

| reference | 위치 | 관계 |
|---|---|---|
| `animation-pitfalls.md` | 기술적 함정 회피（16가지） | 「**이렇게 하면 안 된다**」· 본 파일의 반면 |
| `animations.md` | Stage/Sprite 엔진 사용법 | 애니메이션을 **어떻게 작성하는가**의 기초 |
| `audio-design-rules.md` | 이중 트랙 오디오 규칙 | 애니메이션에 **오디오를 매칭하는** 규칙 |
| `sfx-library.md` | 37개 SFX 목록 | 효과음 **자산 라이브러리** |
| `apple-gallery-showcase.md` | Apple 갤러리 쇼케이스 스타일 | 특정 모션 스타일의 전문 주제 |
| **본 파일** | 올바른 모션 설계 문법 | 「**이렇게 해야 한다**」 |

**호출 순서**:
1. 먼저 SKILL.md 워크플로우 Step 3의 위치 네 가지 질문을 봅니다（서사 역할과 시각적 온도 결정）
2. 방향 결정 후 본 파일을 읽어 **모션 언어**를 확인합니다（레시피 A/B/C）
3. 코드 작성 시 `animations.md` 및 `animation-pitfalls.md` 참조
4. 비디오 내보내기 시 `audio-design-rules.md` + `sfx-library.md` 참조

---

## 부록 · 본 파일의 자료 출처

- Anthropic 공식 애니메이션 분석: 화숙 프로젝트 디렉토리의 `참고 애니메이션/BEST-PRACTICES.md`
- Anthropic 오디오 분석: 동일 디렉토리 `AUDIO-BEST-PRACTICES.md`
- 세 편의 참조 영상: `ref-{1,2,3}.mp4` + 해당 `gemini-ref-*.md` / `audio-ref-*.md`
- **엄격한 필터링**: 본 reference는 구체적인 브랜드 색값, 폰트 이름, 제품명을 수록하지 않습니다.
  색상/폰트 결정은 §1.a 핵심 자산 프로토콜 또는 20가지 디자인 철학을 따릅니다.
