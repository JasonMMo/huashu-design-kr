# Tweaks：디자인 변형 실시간 파라미터 조정

Tweaks는 이 skill의 핵심 기능으로, 사용자가 코드를 수정하지 않고도 variations를 실시간으로 전환하거나 파라미터를 조정할 수 있게 해 줍니다.

**크로스 agent 환경 호환성**: 일부 design-agent 네이티브 환경(예: Claude.ai Artifacts)은 host의 postMessage를 통해 tweak 값을 소스 코드에 다시 써서 영속화합니다. 본 skill은 **순수 프론트엔드 localStorage 방식**을 채택합니다. 효과는 동일하며(새로고침 후에도 상태 유지), 영속화는 소스 코드 파일이 아닌 브라우저 localStorage에서 이루어집니다. 이 방식은 어떤 agent 환경(Claude Code / Codex / Cursor / Trae / 등)에서도 동작합니다.

## Tweaks를 추가할 시점

- 사용자가 명시적으로 "파라미터 조정 가능"/"여러 버전 전환"을 요청한 경우
- 디자인에 비교가 필요한 여러 variations가 있는 경우
- 사용자가 명시하지 않았더라도, **몇 가지 유익한 tweaks를 추가하면 사용자가 가능성을 볼 수 있다고 판단될 때**

기본 권장: **모든 디자인에 2~3개의 tweaks를 추가하십시오**(색상 테마/폰트 크기/레이아웃 변형). 사용자가 요청하지 않더라도 가능성의 공간을 보여 주는 것은 디자인 서비스의 일부입니다.

## 구현 방식 (순수 프론트엔드 버전)

### 기본 구조

```jsx
const TWEAK_DEFAULTS = {
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
};

function useTweaks() {
  const [tweaks, setTweaks] = React.useState(() => {
    try {
      const stored = localStorage.getItem('design-tweaks');
      return stored ? { ...TWEAK_DEFAULTS, ...JSON.parse(stored) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const update = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    try {
      localStorage.setItem('design-tweaks', JSON.stringify(next));
    } catch {}
  };

  const reset = () => {
    setTweaks(TWEAK_DEFAULTS);
    try {
      localStorage.removeItem('design-tweaks');
    } catch {}
  };

  return { tweaks, update, reset };
}
```

### Tweaks 패널 UI

우측 하단 플로팅 패널. 접을 수 있습니다:

```jsx
function TweaksPanel() {
  const { tweaks, update, reset } = useTweaks();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
    }}>
      {open ? (
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e5',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          width: 280,
          fontFamily: 'system-ui',
          fontSize: 13,
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <strong>Tweaks</strong>
            <button onClick={() => setOpen(false)} style={{
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 16,
            }}>×</button>
          </div>

          {/* 색상 */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>주색상</div>
            <input 
              type="color" 
              value={tweaks.primaryColor} 
              onChange={e => update({ primaryColor: e.target.value })}
              style={{ width: '100%', height: 32 }}
            />
          </label>

          {/* 폰트 크기 slider */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>폰트 크기 ({tweaks.fontSize}px)</div>
            <input 
              type="range" 
              min={12} max={24} step={1}
              value={tweaks.fontSize}
              onChange={e => update({ fontSize: +e.target.value })}
              style={{ width: '100%' }}
            />
          </label>

          {/* 밀도 옵션 */}
          <label style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ marginBottom: 4, color: '#666' }}>밀도</div>
            <select 
              value={tweaks.density}
              onChange={e => update({ density: e.target.value })}
              style={{ width: '100%', padding: 6 }}
            >
              <option value="compact">촘촘</option>
              <option value="comfortable">보통</option>
              <option value="spacious">여유</option>
            </select>
          </label>

          {/* 다크 모드 toggle */}
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}>
            <input 
              type="checkbox" 
              checked={tweaks.dark}
              onChange={e => update({ dark: e.target.checked })}
            />
            <span>다크 모드</span>
          </label>

          <button onClick={reset} style={{
            width: '100%',
            padding: '8px 12px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
          }}>초기화</button>
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          style={{
            background: '#1A1A1A',
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '10px 16px',
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >⚙ Tweaks</button>
      )}
    </div>
  );
}
```

### Tweaks 적용

메인 컴포넌트에서 Tweaks 사용:

```jsx
function App() {
  const { tweaks } = useTweaks();

  return (
    <div style={{
      '--primary': tweaks.primaryColor,
      '--font-size': `${tweaks.fontSize}px`,
      background: tweaks.dark ? '#0A0A0A' : '#FAFAFA',
      color: tweaks.dark ? '#FAFAFA' : '#1A1A1A',
    }}>
      {/* 콘텐츠 */}
      <TweaksPanel />
    </div>
  );
}
```

CSS에서 변수 사용:

```css
button.cta {
  background: var(--primary);
  color: white;
  font-size: var(--font-size);
}
```

## 대표적인 Tweak 옵션

디자인 유형별로 추가할 tweaks:

### 공통
- 주색상 (color picker)
- 폰트 크기 (slider 12-24px)
- 서체 (select: display font vs body font)
- 다크 모드 (toggle)

### 슬라이드 덱
- 테마 (light/dark/brand)
- 배경 스타일 (solid/gradient/image)
- 폰트 대비 (더 장식적 vs 더 절제된)
- 정보 밀도 (minimal/standard/dense)

### 제품 프로토타입
- 레이아웃 변형 (layout A / B / C)
- 인터랙션 속도 (animation speed 0.5x-2x)
- 데이터 양 (mock 데이터 건수 5/20/100)
- 상태 (empty/loading/success/error)

### 애니메이션
- 속도 (0.5x-2x)
- 반복 (once/loop/ping-pong)
- Easing (linear/easeOut/spring)

### Landing page
- Hero 스타일 (image/gradient/pattern/solid)
- CTA 문구 (여러 변형)
- 구조 (single column / two column / sidebar)

## Tweaks 설계 원칙

### 1. 의미 있는 옵션, 번거롭지 않은 옵션

각 tweak은 **실제 디자인 선택지**를 보여 줘야 합니다. 아무도 실제로 전환하지 않을 tweak은 추가하지 마십시오(예: border-radius 0~50px slider — 중간값들이 모두 어색하다는 것을 사용자가 직접 확인하게 됩니다).

좋은 tweak은 **이산적이고 사려 깊은 variations**를 노출합니다:
- "모서리 스타일": 각짐 / 약간 둥금 / 크게 둥금 (세 가지 옵션)
- 아닌 것: "모서리": 0-50px slider

### 2. 적을수록 좋습니다

하나의 디자인에서 Tweaks 패널은 **최대 5~6개** 옵션이 적절합니다. 그 이상은 "설정 페이지"가 되어 버려 variations를 빠르게 탐색하는 의미를 잃습니다.

### 3. 기본값이 완성된 디자인

Tweaks는 **추가 가치**입니다. 기본값 자체가 완전하고 배포 가능한 디자인이어야 합니다. 사용자가 Tweaks 패널을 닫았을 때 보이는 것이 바로 결과물입니다.

### 4. 합리적인 그룹핑

옵션이 많을 때는 그룹으로 나눠 표시하십시오:

```
---- 시각 ----
주색상 | 폰트 크기 | 다크 모드

---- 레이아웃 ----
밀도 | 사이드바 위치

---- 콘텐츠 ----
데이터 표시 양 | 상태
```

## 소스 코드 수준 영속화 host와의 순방향 호환

향후 디자인을 소스 코드 수준 tweaks를 지원하는 환경(예: Claude.ai Artifacts)에 올려도 동작하게 하려면 **EDITMODE 마커 블록**을 유지하십시오:

```jsx
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "density": "comfortable",
  "dark": false
}/*EDITMODE-END*/;
```

마커 블록은 localStorage 방식에서는 **아무 효과가 없습니다**(단순 주석에 불과), 그러나 소스 코드 재작성을 지원하는 host에서는 읽혀 소스 코드 수준 영속화를 실현합니다. 현재 환경에 무해하면서 순방향 호환성을 유지합니다.

## 자주 묻는 질문

**Tweaks 패널이 디자인 콘텐츠를 가립니다**
→ 접을 수 있도록 만드십시오. 기본으로 닫혀 있고 작은 버튼만 보이다가 사용자가 클릭하면 펼쳐지도록 하세요.

**사용자가 tweaks 전환 후 다시 설정해야 합니다**
→ 이미 localStorage를 사용하고 있습니다. 새로고침 후에도 영속되지 않는다면 localStorage 사용 가능 여부를 확인하십시오(시크릿 모드에서는 실패하므로 반드시 catch해야 합니다).

**여러 HTML 페이지에서 tweaks를 공유하고 싶습니다**
→ localStorage 키에 프로젝트 이름을 추가하십시오: `design-tweaks-[projectName]`.

**tweak 간에 연동 관계를 만들고 싶습니다**
→ `update` 내부에 로직을 추가하십시오:

```jsx
const update = (patch) => {
  let next = { ...tweaks, ...patch };
  // 연동: dark mode 선택 시 자동으로 텍스트 색상 전환
  if (patch.dark === true && !patch.textColor) {
    next.textColor = '#F0EEE6';
  }
  setTweaks(next);
  localStorage.setItem(...);
};
```
