# React + Babel 프로젝트 규범

HTML+React+Babel로 프로토타입을 제작할 때 반드시 준수해야 하는 기술 규범입니다. 이를 지키지 않으면 오류가 발생합니다.

## Pinned Script Tags（반드시 이 버전을 사용하십시오）

HTML의 `<head>` 안에 아래 세 개의 script 태그를 넣으십시오. **고정 버전 + integrity hash**를 사용합니다:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
```

**사용하지 마십시오**: `react@18` 또는 `react@latest` 와 같이 버전을 고정하지 않은 형태 — 버전 드리프트 및 캐시 문제가 발생합니다.

**생략하지 마십시오**: `integrity` — CDN이 탈취되거나 변조될 경우 이것이 최후의 방어선입니다.

## 파일 구조

```
프로젝트명/
├── index.html               # 메인 HTML
├── components.jsx           # 컴포넌트 파일（type="text/babel"로 로드）
├── data.js                  # 데이터 파일
└── styles.css               # 추가 CSS（선택）
```

HTML에서의 로드 방식:

```html
<!-- 먼저 React+Babel -->
<script src="https://unpkg.com/react@18.3.1/..."></script>
<script src="https://unpkg.com/react-dom@18.3.1/..."></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/..."></script>

<!-- 이후 컴포넌트 파일 -->
<script type="text/babel" src="components.jsx"></script>
<script type="text/babel" src="pages.jsx"></script>

<!-- 마지막으로 메인 진입점 -->
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

**사용하지 마십시오**: `type="module"` — Babel과 충돌합니다.

## 반드시 지켜야 할 세 가지 규칙

### 규칙 1: styles 객체는 반드시 고유한 이름을 사용하십시오

**잘못된 예**（여러 컴포넌트가 있을 경우 반드시 오류 발생）:
```jsx
// components.jsx
const styles = { button: {...}, card: {...} };

// pages.jsx  ← 동일 이름으로 덮어씌워짐！
const styles = { container: {...}, header: {...} };
```

**올바른 예**: 각 컴포넌트 파일의 styles에 고유한 접두사를 사용합니다.

```jsx
// terminal.jsx
const terminalStyles = { 
  screen: {...}, 
  line: {...} 
};

// sidebar.jsx
const sidebarStyles = { 
  container: {...}, 
  item: {...} 
};
```

**또는 inline styles를 사용하십시오**（소형 컴포넌트에 권장）:
```jsx
<div style={{ padding: 16, background: '#111' }}>...</div>
```

이 규칙은 **협상 불가**입니다. `const styles = {...}` 를 작성할 때마다 반드시 구체적인 이름으로 교체해야 합니다. 그렇지 않으면 여러 컴포넌트를 로드할 때 전체 오류가 발생합니다.

### 규칙 2: Scope는 공유되지 않으므로 수동으로 export 해야 합니다

**핵심 이해**: 각 `<script type="text/babel">` 은 Babel에 의해 독립적으로 컴파일되며, 파일 간에 **scope가 연결되지 않습니다**. `components.jsx`에서 정의한 `Terminal` 컴포넌트는 `pages.jsx`에서 **기본적으로 undefined**입니다.

**해결 방법**: 각 컴포넌트 파일 말미에 공유할 컴포넌트/유틸리티를 `window`에 export합니다:

```jsx
// components.jsx 말미
function Terminal(props) { ... }
function Line(props) { ... }
const colors = { green: '#...', red: '#...' };

Object.assign(window, {
  Terminal, Line, colors,
  // 다른 곳에서 사용할 모든 항목을 여기에 나열합니다
});
```

그러면 `pages.jsx`에서 바로 `<Terminal />`을 사용할 수 있습니다. JSX가 `window.Terminal`을 찾기 때문입니다.

### 규칙 3: scrollIntoView를 사용하지 마십시오

`scrollIntoView`는 전체 HTML 컨테이너를 위로 밀어올려 web harness의 레이아웃을 망가뜨립니다. **절대 사용하지 마십시오**.

대안:
```js
// 컨테이너 내 특정 위치로 스크롤
container.scrollTop = targetElement.offsetTop;

// 또는 element.scrollTo 사용
container.scrollTo({
  top: targetElement.offsetTop - 100,
  behavior: 'smooth'
});
```

## Claude API 호출（HTML 내）

일부 네이티브 design-agent 환경（예: Claude.ai Artifacts）에는 별도 설정 없이 사용 가능한 `window.claude.complete`가 있지만, 대부분의 agent 환경（Claude Code / Codex / Cursor / Trae / etc.）의 로컬에는 **없습니다**.

HTML 프로토타입에서 LLM을 호출하여 데모를 만들어야 할 경우（예: 채팅 인터페이스），두 가지 옵션이 있습니다:

### 옵션 A: 실제 호출하지 않고 mock 사용

데모 시나리오에 권장합니다. 가짜 helper를 작성하여 미리 설정된 response를 반환합니다:
```jsx
window.claude = {
  async complete(prompt) {
    await new Promise(r => setTimeout(r, 800)); // 지연 시뮬레이션
    return "이것은 mock 응답입니다. 실제 배포 시 진짜 API로 교체하십시오.";
  }
};
```

### 옵션 B: Anthropic API 실제 호출

API key가 필요하며, 사용자가 HTML에 직접 key를 입력해야 실행 가능합니다. **절대 key를 HTML에 하드코딩하지 마십시오**.

```html
<input id="api-key" placeholder="Anthropic API key를 붙여넣으십시오" />
<script>
window.claude = {
  async complete(prompt) {
    const key = document.getElementById('api-key').value;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.content[0].text;
  }
};
</script>
```

**주의**: 브라우저에서 직접 Anthropic API를 호출하면 CORS 문제가 발생합니다. 사용자가 제공한 미리보기 환경이 CORS bypass를 지원하지 않는 경우 이 방법은 사용할 수 없습니다. 이때는 옵션 A의 mock을 사용하거나, 사용자에게 proxy 백엔드가 필요하다고 안내하십시오.

### 옵션 C: agent 측의 LLM 능력으로 mock 데이터 생성

로컬 데모 전용인 경우, 현재 agent 세션에서 해당 agent의 LLM 능력（또는 사용자가 설치한 multi-model 계열 skill）을 임시로 활용하여 mock 응답 데이터를 미리 생성한 뒤 HTML에 하드코딩합니다. 이 방식은 HTML 실행 시 어떠한 API에도 의존하지 않습니다.

## 기본 HTML 시작 템플릿

이 템플릿을 React 프로토타입의 골격으로 복사하여 사용하십시오:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prototype Name</title>

  <!-- React + Babel pinned -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; width: 100%; }
    body { 
      font-family: -apple-system, 'SF Pro Text', sans-serif;
      background: #FAFAFA;
      color: #1A1A1A;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- 컴포넌트 파일 -->
  <script type="text/babel" src="components.jsx"></script>

  <!-- 메인 진입점 -->
  <script type="text/babel">
    const { useState, useEffect } = React;

    function App() {
      return (
        <div style={{padding: 40}}>
          <h1>Hello</h1>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

## 자주 발생하는 오류와 해결 방법

**`styles is not defined` 또는 `Cannot read property 'button' of undefined`**
→ 한 파일에서 `const styles`를 정의했는데 다른 파일이 이를 덮어씌운 경우입니다. 각 파일에서 구체적인 이름으로 변경하십시오.

**`Terminal is not defined`**
→ 파일 간 참조 시 scope가 연결되지 않습니다. Terminal을 정의한 파일 말미에 `Object.assign(window, {Terminal})`을 추가하십시오.

**전체 페이지가 흰 화면이고 콘솔에 오류 없음**
→ 대부분 JSX 문법 오류이지만 Babel이 콘솔에 출력하지 않은 경우입니다. `babel.min.js`를 임시로 `babel.js` 비압축 버전으로 교체하면 오류 메시지가 더 명확하게 표시됩니다.

**ReactDOM.createRoot is not a function**
→ 버전이 잘못된 경우입니다. react-dom@18.3.1（17 또는 기타 버전이 아닌）을 사용하고 있는지 확인하십시오.

**`Objects are not valid as a React child`**
→ JSX/문자열이 아닌 객체를 렌더링하고 있습니다. 보통 `{someObj}`를 `{someObj.name}`으로 써야 할 경우에 발생합니다.

## 대형 프로젝트에서 파일 분리하는 방법

**1000줄 이상의 단일 파일**은 유지보수가 어렵습니다. 분리 방법:

```
프로젝트/
├── index.html
├── src/
│   ├── primitives.jsx      # 기본 요소: Button、Card、Badge...
│   ├── components.jsx      # 비즈니스 컴포넌트: UserCard、PostList...
│   ├── pages/
│   │   ├── home.jsx        # 홈 페이지
│   │   ├── detail.jsx      # 상세 페이지
│   │   └── settings.jsx    # 설정 페이지
│   ├── router.jsx          # 간단한 라우팅（React state 전환）
│   └── app.jsx             # 진입 컴포넌트
└── data.js                 # mock data
```

HTML에서 순서대로 로드:
```html
<script type="text/babel" src="src/primitives.jsx"></script>
<script type="text/babel" src="src/components.jsx"></script>
<script type="text/babel" src="src/pages/home.jsx"></script>
<script type="text/babel" src="src/pages/detail.jsx"></script>
<script type="text/babel" src="src/pages/settings.jsx"></script>
<script type="text/babel" src="src/router.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
```

**각 파일 말미**에 `Object.assign(window, {...})`으로 공유할 항목을 export해야 합니다.
