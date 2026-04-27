# Animations：타임라인 애니메이션 엔진

애니메이션 / 모션 디자인 HTML 작업 시 참조하세요. 원리, 사용법, 주요 패턴을 설명합니다.

## 핵심 패턴：Stage + Sprite

애니메이션 시스템(`assets/animations.jsx`)은 타임라인 기반 엔진을 제공합니다.

- **`<Stage>`**：전체 애니메이션의 컨테이너. auto-scale(fit viewport) + 스크러버 + 재생/일시정지/루프 컨트롤을 자동으로 제공합니다.
- **`<Sprite start end>`**：시간 구간. 하나의 Sprite는 `start`부터 `end`까지의 시간에만 표시됩니다. 내부에서 `useSprite()` 훅을 통해 로컬 진행도 `t` (0→1)를 읽을 수 있습니다.
- **`useTime()`**：현재 전역 시간(초)을 읽습니다.
- **`Easing.easeInOut` / `Easing.easeOut` / ...**：이징 함수.
- **`interpolate(t, from, to, easing?)`**：t에 따라 값을 보간합니다.

이 패턴은 Remotion / After Effects의 사고방식을 참고하되, 경량이며 의존성이 없습니다.

## 시작하기

```html
<script type="text/babel" src="animations.jsx"></script>
<script type="text/babel">
  const { Stage, Sprite, useTime, useSprite, Easing, interpolate } = window.Animations;

  function Title() {
    const { t } = useSprite();  // 로컬 진행도 0→1
    const opacity = interpolate(t, [0, 1], [0, 1], Easing.easeOut);
    const y = interpolate(t, [0, 1], [40, 0], Easing.easeOut);
    return (
      <h1 style={{ 
        opacity, 
        transform: `translateY(${y}px)`,
        fontSize: 120,
        fontWeight: 900,
      }}>
        Hello.
      </h1>
    );
  }

  function Scene() {
    return (
      <Stage duration={10}>  {/* 10초 애니메이션 */}
        <Sprite start={0} end={3}>
          <Title />
        </Sprite>
        <Sprite start={2} end={5}>
          <SubTitle />
        </Sprite>
        {/* ... */}
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Scene />);
</script>
```

## 자주 쓰는 애니메이션 패턴

### 1. Fade In / Fade Out

```jsx
function FadeIn({ children }) {
  const { t } = useSprite();
  const opacity = interpolate(t, [0, 0.3], [0, 1], Easing.easeOut);
  return <div style={{ opacity }}>{children}</div>;
}
```

**범위 주의**：`[0, 0.3]`은 Sprite 시간의 앞 30% 동안 페이드 인을 완료하고, 이후에는 opacity=1을 유지한다는 의미입니다.

### 2. Slide In

```jsx
function SlideIn({ children, from = 'left' }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, 0.4], [0, 1], Easing.easeOut);
  const offset = (1 - progress) * 100;
  const directions = {
    left: `translateX(-${offset}px)`,
    right: `translateX(${offset}px)`,
    top: `translateY(-${offset}px)`,
    bottom: `translateY(${offset}px)`,
  };
  return (
    <div style={{
      transform: directions[from],
      opacity: progress,
    }}>
      {children}
    </div>
  );
}
```

### 3. 글자 단위 타이핑 효과

```jsx
function Typewriter({ text }) {
  const { t } = useSprite();
  const charCount = Math.floor(text.length * Math.min(t * 2, 1));
  return <span>{text.slice(0, charCount)}</span>;
}
```

### 4. 숫자 카운트 업

```jsx
function CountUp({ from = 0, to = 100, duration = 0.6 }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, duration], [0, 1], Easing.easeOut);
  const value = Math.floor(from + (to - from) * progress);
  return <span>{value.toLocaleString()}</span>;
}
```

### 5. 단계별 설명 (교육용 애니메이션 전형)

```jsx
function Scene() {
  return (
    <Stage duration={20}>
      {/* Phase 1: 문제 제시 */}
      <Sprite start={0} end={4}>
        <Problem />
      </Sprite>

      {/* Phase 2: 접근 방식 제시 */}
      <Sprite start={4} end={10}>
        <Approach />
      </Sprite>

      {/* Phase 3: 결과 제시 */}
      <Sprite start={10} end={16}>
        <Result />
      </Sprite>

      {/* 전체 구간에 표시되는 자막 */}
      <Sprite start={0} end={20}>
        <Caption />
      </Sprite>
    </Stage>
  );
}
```

## Easing 함수

사전 정의된 이징 커브입니다.

| Easing | 특성 | 사용 장면 |
|--------|------|-----------|
| `linear` | 등속 | 스크롤 자막, 지속 애니메이션 |
| `easeIn` | 느림→빠름 | 퇴장/사라짐 |
| `easeOut` | 빠름→느림 | 등장/나타남 |
| `easeInOut` | 느림→빠름→느림 | 위치 이동 |
| **`expoOut`** ⭐ | **지수 감속** | **Anthropic 수준의 주요 easing** (물리적 무게감)|
| **`overshoot`** ⭐ | **탄성 반동** | **토글 / 버튼 팝업 / 강조 인터랙션** |
| `spring` | 스프링 | 인터랙션 피드백, 도형 복귀 |
| `anticipation` | 역방향 후 정방향 | 동작 강조 |

**기본 주요 easing은 `expoOut`을 사용합니다** (`easeOut`이 아닙니다) — `animation-best-practices.md` §2 참조.
등장에는 `expoOut`, 퇴장에는 `easeIn`, 토글에는 `overshoot`——Anthropic 수준 애니메이션의 기본 법칙입니다.

## 리듬 및 타이밍 가이드

### 마이크로 인터랙션 (0.1-0.3초)
- 버튼 hover
- 카드 expand
- 툴팁 등장

### UI 전환 (0.3-0.8초)
- 페이지 전환
- 모달 등장
- 리스트 아이템 추가

### 내러티브 애니메이션 (구간당 2-10초)
- 개념 설명의 한 페이즈
- 데이터 차트 reveal
- 장면 전환

### 단일 구간 내러티브 애니메이션은 최대 10초를 초과하지 않습니다
사람의 주의력에는 한계가 있습니다. 10초 안에 한 가지를 전달하고, 다음으로 넘어가세요.

## 애니메이션 설계 사고 순서

### 1. 콘텐츠/스토리 먼저, 그 다음 애니메이션

**잘못된 방법**：먼저 화려한 애니메이션을 구상하고, 그 안에 콘텐츠를 채워 넣음
**올바른 방법**：먼저 전달할 정보를 명확히 정의하고, 그 정보를 서비스하는 방향으로 애니메이션을 활용

애니메이션은 **신호(signal)**이지 **장식**이 아닙니다. fade-in은 "여기가 중요하니 봐주세요"라는 의미를 강조합니다. 모든 요소가 fade-in으로 나타나면 신호의 의미가 사라집니다.

### 2. 장면을 나눈 후 타임라인 작성

```
0:00 - 0:03   문제 등장 (fade in)
0:03 - 0:06   문제 확대/전개 (zoom+pan)
0:06 - 0:09   해결책 등장 (slide in from right)
0:09 - 0:12   해결책 상세 설명 (typewriter)
0:12 - 0:15   결과 시연 (counter up + chart reveal)
0:15 - 0:18   핵심 한 줄 요약 (static, 3초 읽기)
0:18 - 0:20   CTA 또는 fade out
```

타임라인을 먼저 작성한 후 컴포넌트를 구현하세요.

### 3. 에셋 준비를 먼저

애니메이션에 사용할 이미지 / 아이콘 / 폰트는 **미리** 준비하세요. 작업 중간에 소재를 찾으러 나가면 작업 흐름이 끊깁니다.

## 자주 묻는 질문

**애니메이션이 끊깁니다**
→ 대부분 layout thrashing 문제입니다. `transform`과 `opacity`를 사용하고, `top` / `left` / `width` / `height` / `margin`은 변경하지 마세요. 브라우저는 `transform`을 GPU 가속합니다.

**애니메이션이 너무 빨라 내용을 파악하기 어렵습니다**
→ 사람이 한 단어를 읽는 데 100-500ms가 필요합니다. 텍스트로 이야기를 전달한다면 한 문장당 최소 3초를 확보하세요.

**애니메이션이 너무 느려 지루합니다**
→ 흥미로운 시각적 변화를 밀도 있게 배치하세요. 정적인 화면이 5초 이상 이어지면 지루해집니다.

**여러 애니메이션이 서로 영향을 줍니다**
→ CSS `will-change: transform`으로 브라우저에 미리 이 요소가 움직일 것임을 알려 reflow를 줄이세요.

**비디오로 녹화하고 싶습니다**
→ 스킬 내장 툴체인을 사용하세요 (명령 하나로 세 가지 포맷 출력). `video-export.md` 참조.
- `scripts/render-video.js` — HTML → 25fps MP4 (Playwright + ffmpeg)
- `scripts/convert-formats.sh` — 25fps MP4 → 60fps MP4 + 최적화 GIF
- 더 정확한 프레임 렌더링이 필요하다면? render(t)를 pure function으로 만드세요. `animation-pitfalls.md` 5번 항목 참조.

## 비디오 도구와의 연계

이 스킬은 **HTML 애니메이션**(브라우저에서 실행되는)을 대상으로 합니다. 최종 결과물을 비디오 소재로 사용해야 하는 경우:

- **짧은 애니메이션 / 컨셉 데모**：이 방법으로 HTML 애니메이션 제작 → 화면 녹화
- **장편 영상 / 내러티브**：본 스킬은 HTML 애니메이션에 특화되어 있습니다. 장편 영상은 AI 영상 생성 스킬이나 전문 영상 편집 소프트웨어를 사용하세요.
- **모션 그래픽**：After Effects / Motion Canvas 등 전문 도구가 더 적합합니다.

## Popmotion 등 라이브러리에 대하여

실제로 물리 애니메이션(spring, decay, precise timing keyframes)이 필요하다면 현재 엔진으로는 한계가 있습니다. 이 경우 Popmotion으로 fallback할 수 있습니다.

```html
<script src="https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js"></script>
```

그러나 **먼저 현재 엔진을 시도해 보세요**. 90%의 경우에는 충분합니다.
