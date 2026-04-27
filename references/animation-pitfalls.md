# Animation Pitfalls: HTML 애니메이션에서 겪은 함정과 규칙

애니메이션을 만들 때 가장 자주 빠지는 버그와 회피 방법입니다. 각 규칙은 실제 실패 사례에서 나왔습니다.

애니메이션을 작성하기 전에 이 글을 읽으면 반복 수정 한 번을 줄일 수 있습니다.

## 1. 레이어 레이아웃 —— `position: relative`는 기본 의무

**겪은 함정**: sentence-wrap 요소가 3개의 bracket-layer（`position: absolute`）를 포함하고 있었습니다. sentence-wrap에 `position: relative`를 설정하지 않아서 absolute의 bracket이 `.canvas`를 좌표계로 사용해 화면 아래 200px 밖으로 날아갔습니다.

**규칙**:
- `position: absolute` 자식 요소를 포함하는 모든 컨테이너는 반드시 **명시적으로** `position: relative`를 설정해야 합니다
- 시각적으로 「오프셋」이 필요 없더라도 `position: relative`를 좌표계 앵커로 작성해야 합니다
- `.parent { ... }`를 작성할 때 자식 요소에 `.child { position: absolute }`가 있다면 반사적으로 parent에 relative를 추가하세요

**빠른 확인**: `position: absolute`가 나타날 때마다 상위 ancestor를 찾아 가장 가까운 positioned 조상이 당신이 *원하는* 좌표계인지 확인하세요.

## 2. 문자 함정 —— 희귀 Unicode에 의존하지 않는다

**겪은 함정**: `␣` (U+2423 OPEN BOX)으로 「공백 token」을 시각화하려 했습니다. Noto Serif SC / Cormorant Garamond 모두 이 글리프가 없어서 공백/두부로 렌더링되어 관객에게 전혀 보이지 않았습니다.

**규칙**:
- **애니메이션에 나타나는 모든 문자는 선택한 폰트에 존재해야 합니다**
- 일반적인 희귀 문자 블랙리스트: `␣ ␀ ␐ ␋ ␨ ↩ ⏎ ⌘ ⌥ ⌃ ⇧ ␦ ␖ ␛`
- 「공백 / 줄바꿈 / 탭」 같은 메타 문자를 표현하려면 **CSS로 구성된 의미적 박스**를 사용하세요:
  ```html
  <span class="space-key">Space</span>
  ```
  ```css
  .space-key {
    display: inline-flex;
    padding: 4px 14px;
    border: 1.5px solid var(--accent);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  ```
- Emoji도 검증이 필요합니다: 일부 emoji는 Noto Emoji 이외의 폰트에서 회색 사각형으로 fallback될 수 있으니, `emoji` font-family 또는 SVG를 사용하는 것이 좋습니다

## 3. 데이터 기반 Grid/Flex 템플릿

**겪은 함정**: 코드에 `const N = 6`개의 token이 있었지만, CSS에 `grid-template-columns: 80px repeat(5, 1fr)`이 하드코딩되어 있었습니다. 결과적으로 6번째 token에 column이 없어 전체 행렬이 어긋났습니다.

**규칙**:
- count가 JS 배열에서 나올 때（`TOKENS.length`）, CSS 템플릿도 데이터 기반이어야 합니다
- 방법 A: CSS 변수를 JS에서 주입
  ```js
  el.style.setProperty('--cols', N);
  ```
  ```css
  .grid { grid-template-columns: 80px repeat(var(--cols), 1fr); }
  ```
- 방법 B: `grid-auto-flow: column`을 사용해 브라우저가 자동으로 확장하게 함
- **「고정 숫자 + JS 상수」 조합을 금지**합니다. N을 변경해도 CSS가 동기화되지 않습니다

## 4. 전환 단절 —— 장면 전환은 연속적이어야 한다

**겪은 함정**: zoom1 (13-19s) → zoom2 (19.2-23s) 사이에서 주 문장이 이미 hidden된 상태에서, zoom1 fade out（0.6s）+ zoom2 fade in（0.6s）+ stagger delay（0.2s+）= 약 1초의 순수 공백 화면이 생겼습니다. 관객은 애니메이션이 멈췄다고 생각했습니다.

**규칙**:
- 연속적인 장면 전환 시, fade out과 fade in을 **교차 중첩**시키세요. 이전 것이 완전히 사라진 후 다음 것이 시작되는 방식이 아닙니다
  ```js
  // 나쁜 예:
  if (t >= 19) hideZoom('zoom1');      // 19.0s out
  if (t >= 19.4) showZoom('zoom2');    // 19.4s in → 중간 0.4s 공백

  // 좋은 예:
  if (t >= 18.6) hideZoom('zoom1');    // 0.4s 먼저 fade out 시작
  if (t >= 18.6) showZoom('zoom2');    // 동시에 fade in（cross-fade）
  ```
- 또는 「앵커 요소」（예: 주 문장）를 장면 간 시각적 연결로 사용하여 zoom 전환 중에 잠깐 다시 표시
- CSS transition의 duration을 명확히 계산하여 transition이 끝나기 전에 다음 것이 트리거되지 않도록 함

## 5. Pure Render 원칙 —— 애니메이션 상태는 seek 가능해야 한다

**겪은 함정**: `setTimeout` + `fireOnce(key, fn)` 체인으로 애니메이션 상태를 트리거했습니다. 일반 재생 시에는 문제가 없었지만, 프레임별 녹화/임의 시간점 seek 시 이전 setTimeout이 이미 실행되어 「과거로 돌아갈 수 없는」 상태가 되었습니다.

**규칙**:
- `render(t)` 함수는 이상적으로 **pure function**이어야 합니다: 주어진 t에 대해 유일한 DOM 상태를 출력
- 부작용을 반드시 사용해야 할 경우（예: class 전환）, `fired` set과 명시적 reset을 함께 사용하세요:
  ```js
  const fired = new Set();
  function fireOnce(key, fn) { if (!fired.has(key)) { fired.add(key); fn(); } }
  function reset() { fired.clear(); /* 모든 .show class 제거 */ }
  ```
- Playwright / 디버깅용 `window.__seek(t)` 노출:
  ```js
  window.__seek = (t) => { reset(); render(t); };
  ```
- 애니메이션 관련 setTimeout은 >1초를 넘지 마세요. 그렇지 않으면 seek 뒤로 점프 시 혼란이 생깁니다

## 6. 폰트 로드 전 측정 = 잘못된 측정

**겪은 함정**: 페이지 DOMContentLoaded 직후 `charRect(idx)`를 호출해 bracket 위치를 측정했는데, 폰트가 아직 로드되지 않아 각 문자 너비가 fallback 폰트의 너비였고 위치가 모두 잘못되었습니다. 폰트가 로드된 후（약 500ms 후）에도 bracket의 `left: Xpx`는 여전히 구값이어서 영구적으로 오프셋되었습니다.

**규칙**:
- DOM 측정（`getBoundingClientRect`, `offsetWidth`）에 의존하는 모든 레이아웃 코드는 반드시 `document.fonts.ready.then()` 안에 있어야 합니다
  ```js
  document.fonts.ready.then(() => {
    requestAnimationFrame(() => {
      buildBrackets(...);  // 이 시점에 폰트가 준비되어 측정이 정확합니다
      tick();              // 애니메이션 시작
    });
  });
  ```
- 추가 `requestAnimationFrame`은 브라우저에게 레이아웃을 커밋할 프레임 하나를 줍니다
- Google Fonts CDN을 사용하는 경우 `<link rel="preconnect">`로 첫 번째 로드를 가속화하세요

## 7. 녹화 준비 —— 비디오 내보내기를 위한 핸들 예약

**겪은 함정**: Playwright `recordVideo` 기본값이 25fps이고 context 생성 시점부터 녹화가 시작됩니다. 페이지 로드, 폰트 로드의 처음 2초가 녹화에 포함되어, 납품 시 비디오 앞 2초가 공백/흰색으로 깜빡였습니다.

**규칙**:
- `render-video.js` 도구로 처리: warmup navigate → reload로 애니메이션 재시작 → duration 대기 → ffmpeg trim head + H.264 MP4 변환
- 애니메이션의 **제0 프레임**은 최종 레이아웃이 완성된 완전한 초기 상태여야 합니다（공백이나 로딩 중이 아님）
- 60fps를 원하시면? ffmpeg `minterpolate` 후처리를 사용하고, 브라우저 소스 프레임률에 의존하지 마세요
- GIF를 원하시면? 두 단계 palette（`palettegen` + `paletteuse`）, 30s 1080p 애니메이션을 3MB로 압축 가능

완전한 스크립트 사용법은 `video-export.md`를 참조하세요.

## 8. 배치 내보내기 —— tmp 디렉토리에 반드시 PID를 포함시켜 동시 충돌 방지

**겪은 함정**: `render-video.js`로 3개 프로세스를 병렬로 3개 HTML을 녹화했습니다. TMP_DIR이 `Date.now()`만으로 명명되어 3개 프로세스가 동일 밀리초에 시작하면 같은 tmp 디렉토리를 공유했습니다. 가장 먼저 완료된 프로세스가 tmp를 정리하면 다른 두 개는 디렉토리를 읽을 때 `ENOENT`가 발생하며 모두 크래시되었습니다.

**규칙**:
- 여러 프로세스가 공유할 수 있는 임시 디렉토리는 반드시 **PID 또는 랜덤 접미사**를 포함해야 합니다:
  ```js
  const TMP_DIR = path.join(DIR, '.video-tmp-' + Date.now() + '-' + process.pid);
  ```
- 여러 파일을 병렬로 처리하려면 shell의 `&` + `wait`를 사용하고, node 스크립트 내에서 fork하지 마세요
- 여러 HTML을 일괄 녹화할 때, 보수적인 방법: **직렬** 실행（2개 이하는 병렬 가능, 3개 이상은 순서대로 처리）

## 9. 녹화 화면에 진행바/재생 버튼 —— Chrome 요소가 비디오를 오염시킨다

**겪은 함정**: 애니메이션 HTML에 `.progress` 진행바, `.replay` 재생 버튼, `.counter` 타임스탬프를 추가했습니다. 이것들은 사람이 재생을 디버깅할 때 편리했습니다. MP4로 납품할 때 이 요소들이 비디오 하단에 나타나 개발자 도구를 스크린샷에 포함시킨 것처럼 보였습니다.

**규칙**:
- HTML에서 사람이 사용하는 「chrome 요소」（progress bar / replay button / footer / masthead / counter / phase labels）와 비디오 콘텐츠 본체를 분리하여 관리하세요
- **약속된 class 이름** `.no-record`: 이 class가 있는 요소는 녹화 스크립트가 자동으로 숨깁니다
- 스크립트（`render-video.js`）가 기본적으로 일반적인 chrome class 이름을 숨기는 CSS를 주입합니다:
  ```
  .progress .counter .phases .replay .masthead .footer .no-record [data-role="chrome"]
  ```
- Playwright의 `addInitScript`로 주입（매번 navigate 전에 적용되며, reload도 안정적）
- 원본 HTML（chrome 포함）을 보려면 `--keep-chrome` 플래그를 추가하세요

## 10. 녹화 초반 몇 초의 애니메이션 반복 —— Warmup 프레임 누출

**겪은 함정**: `render-video.js`의 구 플로우 `goto → fonts 1.5s 대기 → reload → duration 대기`. 녹화가 context 생성 시점부터 시작되어 warmup 단계에서 애니메이션이 이미 일부 재생되고, reload 후 0에서 재시작됩니다. 결과적으로 비디오 초반 몇 초가 「애니메이션 중간 + 전환 + 애니메이션 처음부터 시작」이어서 반복감이 강했습니다.

**규칙**:
- **Warmup과 Record는 반드시 독립적인 context를 사용해야 합니다**:
  - Warmup context（`recordVideo` 옵션 없음）: URL 로드, 폰트 대기 후 close만 담당
  - Record context（`recordVideo` 있음）: fresh 상태에서 시작, 애니메이션이 t=0부터 녹화
- ffmpeg `-ss trim`은 Playwright의 약간의 startup latency（~0.3s）만 잘라낼 수 있으며, **warmup 프레임을 감추는 데 사용할 수 없습니다**; 소스가 깨끗해야 합니다
- 녹화 context 종료 = webm 파일이 디스크에 쓰임, 이것은 Playwright의 제약입니다
- 관련 코드 패턴:
  ```js
  // 1단계: warmup (버리기)
  const warmupCtx = await browser.newContext({ viewport });
  const warmupPage = await warmupCtx.newPage();
  await warmupPage.goto(url, { waitUntil: 'networkidle' });
  await warmupPage.waitForTimeout(1200);
  await warmupCtx.close();

  // 2단계: record (fresh)
  const recordCtx = await browser.newContext({ viewport, recordVideo });
  const page = await recordCtx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(DURATION * 1000);
  await page.close();
  await recordCtx.close();
  ```

## 11. 화면 안에 「가짜 chrome」 그리지 않기 —— 장식용 player UI와 진짜 chrome 충돌

**겪은 함정**: 애니메이션이 `Stage` 컴포넌트를 사용했는데, 이미 scrubber + 타임코드 + 일시정지 버튼이 있었습니다（`.no-record` chrome에 속하여 내보낼 때 자동으로 숨겨짐）. 그런데 화면 하단에 「`00:60 ──── CLAUDE-DESIGN / ANATOMY`」라는 "잡지 페이지 번호 느낌의 장식 진행바"를 그렸습니다. **결과**: 사용자가 두 개의 진행바를 보았습니다——하나는 Stage 컨트롤러, 하나는 내가 그린 장식. 시각적으로 완전히 충돌하여 버그로 인식되었습니다. 「비디오 안에 진행바가 있는 게 뭐냐?」

**규칙**:

- Stage가 이미 제공합니다: scrubber + 타임코드 + 일시정지/재생 버튼. **화면 안에 다시** 진행 표시, 현재 타임코드, 저작권 표시바, 챕터 카운터를 그리지 마세요——그것들은 chrome과 충돌하거나, filler slop（「earn its place」 원칙 위반）입니다.
- 「페이지 번호 느낌」「잡지 느낌」「하단 저작자 표시바」같은 **장식 욕구**는 AI가 자동으로 추가하는 고빈도 filler입니다. 나타날 때마다 경계하세요——이것이 정말 대체 불가능한 정보를 전달하는가? 아니면 단순히 공백을 채우는 것인가?
- 하단 바가 반드시 있어야 한다고 확신한다면（예: 애니메이션 주제 자체가 player UI를 설명하는 경우）, 그것은 반드시 **서사적으로 필요**해야 하며, **Stage scrubber와 시각적으로 명확하게 구분**되어야 합니다（다른 위치, 다른 형식, 다른 색조）.

**요소 귀속 테스트**（canvas에 그린 모든 요소가 답할 수 있어야 함）:

| 어디에 속하는가 | 처리 |
|------------|------|
| 특정 장면의 서사 내용 | OK, 유지 |
| 전체 chrome（제어/디버깅용） | `.no-record` class 추가, 내보낼 때 숨기기 |
| **어떤 장면에도 속하지 않고, chrome도 아닌** | **삭제**. 이것은 주인 없는 것이며, filler slop입니다 |

**자가 점검（납품 전 3초）**: 정적 이미지를 캡처하여 스스로에게 묻습니다——

- 화면에 「video player UI처럼 보이는 것」（수평 진행바, 타임코드, 컨트롤 버튼 모양）이 있는가?
- 있다면, 그것을 삭제해도 서사가 손상되지 않는가? 손상되지 않으면 삭제.
- 동일한 종류의 정보（진행/시간/저작자）가 두 번 나타나는가? chrome 한 곳으로 통합.

**반례**: 하단에 `00:42 ──── PROJECT NAME` 그리기, 화면 오른쪽 아래 "CH 03 / 06" 챕터 카운터 그리기, 화면 가장자리에 버전 번호 "v0.3.1" 그리기——모두 가짜 chrome filler입니다.

## 12. 녹화 전 공백 + 녹화 시작점 오프셋 —— `__ready` × tick × lastTick 삼중 함정

**겪은 함정（A · 전 공백）**: 60초 애니메이션을 MP4로 내보냈더니 앞 2-3초가 공백 페이지였습니다. `ffmpeg --trim=0.3`으로 잘라낼 수 없었습니다.

**겪은 함정（B · 시작점 오프셋, 2026-04-20 실제 사고）**: 24초 비디오를 내보냈더니 사용자 관점에서 「비디오 19초에서야 첫 프레임이 재생된다」고 느꼈습니다. 실제로는 애니메이션이 t=5에서 녹화를 시작해서 t=24까지 녹화한 후 t=0으로 루프백하고, 다시 5초를 녹화하여 end까지——따라서 비디오의 마지막 5초가 애니메이션의 진짜 시작이었습니다.

**근본 원인**（두 함정이 하나의 근본 원인을 공유）:

Playwright `recordVideo`는 `newContext()` 시점부터 WebM 쓰기를 시작하며, 이때 Babel/React/폰트 로드에 L초（2-6s）가 소요됩니다. 녹화 스크립트는 `window.__ready = true`를 「애니메이션이 여기서 시작된다」는 앵커로 대기합니다——이것은 애니메이션 `time = 0`과 반드시 엄격하게 pair되어야 합니다. 두 가지 일반적인 오류:

| 오류 방식 | 증상 |
|------|------|
| `__ready`가 `useEffect` 또는 동기 setup 단계에서 설정됨（tick 첫 프레임 이전） | 녹화 스크립트는 애니메이션이 시작되었다고 생각하지만, 실제 WebM은 여전히 공백 페이지를 녹화 중 → **전 공백** |
| tick의 `lastTick = performance.now()`가 **스크립트 최상위**에서 초기화됨 | 폰트 로드 L초가 첫 프레임 `dt`에 계산되어, `time`이 순간적으로 L로 점프 → 녹화 전체가 L초 지연 → **시작점 오프셋** |

**✅ 올바른 완전한 starter tick 템플릿**（수동 작성 애니메이션에 반드시 이 골격을 사용해야 함）:

```js
// ━━━━━━ state ━━━━━━
let time = 0;
let playing = false;   // ❗ 기본적으로 재생하지 않음, 폰트 ready 후 시작
let lastTick = null;   // ❗ sentinel——tick 첫 프레임에서 dt를 강제로 0으로（performance.now() 사용 금지）
const fired = new Set();

// ━━━━━━ tick ━━━━━━
function tick(now) {
  if (lastTick === null) {
    lastTick = now;
    window.__ready = true;   // ✅ pair: 「녹화 시작점」과 「애니메이션 t=0」이 동일 프레임
    render(0);               // DOM이 준비되었는지 확인하기 위해 다시 렌더링（이 시점에 폰트가 ready）
    requestAnimationFrame(tick);
    return;
  }
  const dt = (now - lastTick) / 1000;   // 첫 프레임 이후부터 dt가 진행되기 시작
  lastTick = now;

  if (playing) {
    let t = time + dt;
    if (t >= DURATION) {
      t = window.__recording ? DURATION - 0.001 : 0;  // 녹화 시 loop하지 않음, 0.001s로 마지막 프레임 유지
      if (!window.__recording) fired.clear();
    }
    time = t;
    render(time);
  }
  requestAnimationFrame(tick);
}

// ━━━━━━ boot ━━━━━━
// 최상위에서 즉시 rAF하지 않음——폰트 로드 완료 후 시작
document.fonts.ready.then(() => {
  render(0);                 // 먼저 초기 화면을 그림（폰트가 준비됨）
  playing = true;
  requestAnimationFrame(tick);  // 첫 번째 tick이 __ready + t=0을 pair
});

// ━━━━━━ seek 인터페이스（render-video의 방어적 보정용）━━━━━━
window.__seek = (t) => { fired.clear(); time = t; lastTick = null; render(t); };
```

**이 템플릿이 올바른 이유**:

| 환경 | 왜 이렇게 해야 하는가 |
|------|-------------|
| `lastTick = null` + 첫 프레임 `return` | 「스크립트 로드부터 tick 첫 실행까지」의 L초가 애니메이션 시간에 계산되는 것을 방지 |
| `playing = false` 기본값 | 폰트 로드 중 `tick`이 실행되어도 time을 진행시키지 않아 렌더링 오류 방지 |
| `__ready`가 tick 첫 프레임에서 설정됨 | 녹화 스크립트가 이 시점부터 타이밍을 시작하며, 이는 애니메이션의 진짜 t=0에 해당 |
| `document.fonts.ready.then(...)` 안에서만 tick 시작 | 폰트 fallback 너비 측정 방지, 첫 프레임 폰트 점프 방지 |
| `window.__seek` 존재 | `render-video.js`가 적극적으로 보정 가능——두 번째 방어선 |

**녹화 스크립트 쪽의 대응 방어**:
1. `addInitScript`로 `window.__recording = true` 주입（page goto 이전）
2. `waitForFunction(() => window.__ready === true)`, 이 시점의 오프셋을 ffmpeg trim으로 기록
3. **추가로**: `__ready` 후 주동적으로 `page.evaluate(() => window.__seek && window.__seek(0))`을 실행하여 HTML의 가능한 time 오프셋을 강제로 0으로 归零——이것이 두 번째 방어선으로, starter 템플릿을 엄격하게 따르지 않는 HTML에 대응합니다

**검증 방법**: MP4 내보낸 후
```bash
ffmpeg -i video.mp4 -ss 0 -vframes 1 frame-0.png
ffmpeg -i video.mp4 -ss $DURATION-0.1 -vframes 1 frame-end.png
```
첫 프레임은 반드시 애니메이션 t=0의 초기 상태여야 합니다（중간이나 검정이 아님）. 마지막 프레임은 반드시 애니메이션의 최종 상태여야 합니다（두 번째 루프의 어떤 시점이 아님）.

**참조 구현**: `assets/animations.jsx`의 Stage 컴포넌트, `scripts/render-video.js`는 모두 이 프로토콜에 따라 구현되었습니다. 수동 HTML 작성 시 starter tick 템플릿을 반드시 사용해야 합니다——각 줄은 구체적인 버그를 방지합니다.

## 13. 녹화 시 loop 금지 —— `window.__recording` 신호

**겪은 함정**: 애니메이션 Stage 기본값 `loop=true`（브라우저에서 효과를 편리하게 볼 수 있음）. `render-video.js`가 duration초를 녹화한 후 300ms를 더 기다린 후 중지하는데, 이 300ms에 Stage가 다음 루프에 진입했습니다. ffmpeg `-t DURATION` 절단 시 마지막 0.5-1s가 다음 루프에 속해——비디오 마지막이 갑자기 첫 프레임（Scene 1）으로 돌아가 관객은 비디오에 버그가 있다고 생각했습니다.

**근본 원인**: 녹화 스크립트와 HTML 사이에 "내가 녹화 중"이라는 핸드쉐이크 프로토콜이 없었습니다. HTML은 자신이 녹화 중임을 모르고 브라우저 인터랙션 시나리오처럼 계속 루프합니다.

**규칙**:

1. **녹화 스크립트**: `addInitScript`에서 `window.__recording = true` 주입（page goto 이전）:
   ```js
   await recordCtx.addInitScript(() => { window.__recording = true; });
   ```

2. **Stage 컴포넌트**: 이 신호를 인식하여 loop=false 강제 적용:
   ```js
   const effectiveLoop = (typeof window !== 'undefined' && window.__recording) ? false : loop;
   // ...
   if (next >= duration) return effectiveLoop ? 0 : duration - 0.001;
   //                                                       ↑ 0.001 유지하여 Sprite end=duration이 꺼지지 않도록
   ```

3. **마지막 Sprite의 fadeOut**: 녹화 시나리오에서 `fadeOut={0}`으로 설정해야 합니다. 그렇지 않으면 비디오 마지막이 투명/어두운 색으로 페이드——사용자는 투명해지는 것이 아닌 선명한 마지막 프레임을 기대합니다. 수동 HTML 작성 시 마지막 Sprite에 모두 `fadeOut={0}`을 사용하는 것을 권장합니다.

**참조 구현**: `assets/animations.jsx`의 Stage / `scripts/render-video.js` 모두 핸드쉐이크가 내장되어 있습니다. 수동 Stage 작성 시 반드시 `__recording` 감지를 구현해야 합니다——그렇지 않으면 녹화 시 반드시 이 함정에 빠집니다.

**검증**: MP4 내보낸 후 `ffmpeg -ss 19.8 -i video.mp4 -frames:v 1 end.png`, 마지막 0.2초가 여전히 예상된 마지막 프레임인지, 갑자기 다른 scene으로 전환되지 않는지 확인합니다.

## 14. 60fps 비디오 기본값은 프레임 복제 사용 —— minterpolate 호환성 문제

**겪은 함정**: `convert-formats.sh`가 `minterpolate=fps=60:mi_mode=mci...`로 생성한 60fps MP4가 macOS QuickTime / Safari 일부 버전에서 열리지 않았습니다（검정 화면이나 직접 거부）. VLC / Chrome에서는 열렸습니다.

**근본 원인**: minterpolate 출력의 H.264 elementary stream에 일부 플레이어가 파싱하기 어려운 SEI / SPS 필드가 포함됩니다.

**규칙**:

- 기본 60fps는 간단한 `fps=60` filter 사용（프레임 복제）, 호환성 넓음（QuickTime/Safari/Chrome/VLC 모두 열림）
- 고품질 프레임 보간은 `--minterpolate` 플래그로 명시적으로 활성화——단, **반드시 로컬에서 대상 플레이어 테스트 후 납품**
- 60fps 레이블의 가치는 **업로드 플랫폼의 알고리즘 인식**（Bilibili / YouTube에서 60fps 표시로 우선 추천）이며, CSS 애니메이션의 실제 체감 부드러움 향상은 미미합니다
- `-profile:v high -level 4.0` 추가로 H.264 통용 호환성 향상

**`convert-formats.sh`가 기본적으로 호환 모드로 변경되었습니다**. 고품질 프레임 보간이 필요하면 `--minterpolate` 플래그를 추가하세요:
```bash
bash convert-formats.sh input.mp4 --minterpolate
```

## 15. `file://` + 외부 `.jsx`의 CORS 함정 —— 단일 파일 납품 시 엔진을 반드시 인라인해야 함

**겪은 함정**: 애니메이션 HTML에서 `<script type="text/babel" src="animations.jsx"></script>`로 외부에서 엔진을 로드했습니다. 로컬에서 더블클릭（`file://` 프로토콜）하면 Babel Standalone이 XHR로 `.jsx`를 가져오려 했고 Chrome이 `Cross origin requests are only supported for protocol schemes: http, https, chrome, chrome-extension...`을 보고했습니다 → 전체 페이지 검정 화면. `pageerror`가 아닌 console error만 보고되어 「애니메이션이 트리거되지 않음」으로 잘못 진단하기 쉬웠습니다.

HTTP server를 시작해도 해결이 안 될 수 있습니다——로컬에 전역 프록시가 있는 경우 `localhost`도 프록시를 통해 502 / 연결 실패가 반환됩니다.

**규칙**:

- **단일 파일 납품（더블클릭으로 사용 가능한 HTML）** → `animations.jsx`는 반드시 `<script type="text/babel">...</script>` 태그 안에 **인라인**해야 합니다. `src="animations.jsx"` 사용 금지
- **다중 파일 프로젝트（HTTP server로 시연）** → 외부 로드 가능, 단 납품 시 `python3 -m http.server 8000` 명령을 명시적으로 작성
- 판단 기준: 사용자에게 납품하는 것이 "HTML 파일"인가 아니면 "server가 있는 프로젝트 디렉토리"인가? 전자는 인라인 사용
- Stage 컴포넌트 / animations.jsx는 종종 200+ 줄——HTML `<script>` 블록에 붙여넣어도 완전히 괜찮습니다. 크기를 걱정하지 마세요

**최소 검증**: 생성된 HTML을 더블클릭하여 **어떤 server도 통하지 않고** 열어보세요. Stage가 애니메이션 첫 프레임을 정상적으로 표시하면 통과입니다.

## 16. scene 간 반전 색상 컨텍스트 —— 화면 내 요소에 색상을 하드코딩하지 않는다

**겪은 함정**: 다중 장면 애니메이션을 만들 때, `ChapterLabel` / `SceneNumber` / `Watermark` 등 **여러 scene에 걸쳐 나타나는** 요소들이 컴포넌트에 `color: '#1A1A1A'`（어두운 텍스트）를 하드코딩했습니다. 처음 4개 scene의 밝은 배경에서는 OK였지만, 5번째 검정 배경 scene에서 "05"와 워터마크가 직접 사라졌습니다——오류 없음, 어떤 검사도 트리거되지 않음, 핵심 정보가 보이지 않음.

**규칙**:

- **여러 scene에서 재사용되는 화면 내 요소**（챕터 레이블 / scene 번호 / 타임코드 / 워터마크 / 저작권 바）는 **색상값을 하드코딩하면 안 됩니다**
- 세 가지 방법 중 하나를 사용하세요:
  1. **`currentColor` 상속**: 요소에 `color: currentColor`만 작성하고, 부모 scene 컨테이너에서 `color: 계산값` 설정
  2. **invert prop**: 컴포넌트가 `<ChapterLabel invert />`를 받아 수동으로 명암을 전환
  3. **배경색 기반 자동 계산**: `color: contrast-color(var(--scene-bg))`（CSS 4 새 API, 또는 JS로 판단）
- 납품 전 Playwright로 **각 scene의 대표 프레임**을 추출하여, 육안으로 "scene 간 요소"가 모두 보이는지 확인

이 함정의 교묘함은——**버그 경고가 없다**는 것입니다. 육안 또는 OCR만이 발견할 수 있습니다.

## 빠른 자가 점검 목록（작업 시작 전 5초）

- [ ] `position: absolute`의 부모 요소 모두 `position: relative`가 있는가?
- [ ] 애니메이션의 특수 문자（`␣` `⌘` `emoji`）가 폰트에 존재하는가?
- [ ] Grid/Flex 템플릿의 count와 JS 데이터의 length가 일치하는가?
- [ ] 장면 전환 사이에 cross-fade가 있고, >0.3s의 순수 공백이 없는가?
- [ ] DOM 측정 코드가 `document.fonts.ready.then()` 안에 있는가?
- [ ] `render(t)`가 pure하거나 명확한 reset 메커니즘이 있는가?
- [ ] 제0 프레임이 완전한 초기 상태이고, 공백이 아닌가?
- [ ] 화면 안에 「가짜 chrome」 장식이 없는가（진행바/타임코드/하단 서명바가 Stage scrubber와 충돌하지 않음）?
- [ ] 애니메이션 tick 첫 프레임에서 동기적으로 `window.__ready = true`를 설정하는가?（animations.jsx 사용 시 자동; 수동 HTML 작성 시 직접 추가）
- [ ] Stage가 `window.__recording`을 감지하여 loop=false를 강제 적용하는가?（수동 HTML 작성 시 필수）
- [ ] 마지막 Sprite의 `fadeOut`이 0으로 설정되어 있는가（비디오 마지막에 선명한 프레임 유지）?
- [ ] 60fps MP4 기본값이 프레임 복제 모드（호환성）를 사용하고, 고품질 프레임 보간 시에만 `--minterpolate`를 추가하는가?
- [ ] 내보낸 후 제0 프레임 + 마지막 프레임을 추출하여 애니메이션 초기/최종 상태인지 확인하는가?
- [ ] 특정 브랜드 관련（Stripe/Anthropic/Lovart/...）: 「브랜드 자산 프로토콜」（SKILL.md §1.a 다섯 단계）을 완료했는가? `brand-spec.md`를 작성했는가?
- [ ] 단일 파일 납품 HTML: `animations.jsx`가 인라인이고, `src="..."`가 아닌가?（file:// 에서 external .jsx는 CORS 검정 화면이 됨）
- [ ] scene 간 나타나는 요소（챕터 레이블/워터마크/scene 번호）가 색상을 하드코딩하지 않았는가? 각 scene 배경 아래에서 모두 보이는가?
