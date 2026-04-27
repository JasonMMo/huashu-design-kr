# Verification：출력 검증 프로세스

일부 design-agent 네이티브 환경(예: Claude.ai Artifacts)에는 내장된 `fork_verifier_agent`가 있어 subagent를 통해 iframe 스크린샷으로 검사합니다. 대부분의 agent 환경(Claude Code / Codex / Cursor / Trae / 등)에는 이 내장 기능이 없으므로, Playwright를 수동으로 활용하면 동일한 검증 시나리오를 커버할 수 있습니다.

## 검증 체크리스트

HTML을 산출할 때마다 이 체크리스트를 한 번씩 수행하십시오.

### 1. 브라우저 렌더링 확인 (필수)

가장 기본: **HTML을 열 수 있는가**? macOS에서:

```bash
open -a "Google Chrome" "/path/to/your/design.html"
```

또는 Playwright 스크린샷(다음 섹션) 사용.

### 2. 콘솔 오류 확인

HTML 파일에서 가장 흔한 문제는 JS 오류로 인한 흰 화면입니다. Playwright로 한 번 실행해 보십시오:

```bash
python ~/.claude/skills/claude-design/scripts/verify.py path/to/design.html
```

이 스크립트는 다음을 수행합니다:
1. headless Chromium으로 HTML 열기
2. 스크린샷을 프로젝트 디렉터리에 저장
3. 콘솔 오류 캡처
4. 상태 보고

자세한 내용은 `scripts/verify.py`를 참고하십시오.

### 3. 다중 뷰포트 확인

반응형 디자인이라면 여러 viewport로 캡처하십시오:

```bash
python verify.py design.html --viewports 1920x1080,1440x900,768x1024,375x667
```

### 4. 인터랙션 확인

Tweaks, 애니메이션, 버튼 전환 — 기본 정적 스크린샷으로는 확인할 수 없습니다. **사용자에게 직접 브라우저를 열고 한 번 클릭해 보도록 안내하거나**, Playwright 녹화를 사용하십시오:

```python
page.video.record('interaction.mp4')
```

### 5. 슬라이드 페이지별 확인

덱 형태의 HTML은 한 장씩 캡처하십시오:

```bash
python verify.py deck.html --slides 10  # 앞 10장 캡처
```

`deck-slide-01.png`, `deck-slide-02.png`... 형식으로 생성되어 빠르게 훑어볼 수 있습니다.

## Playwright 설정

처음 사용 시 필요한 작업:

```bash
# 아직 설치하지 않은 경우
npm install -g playwright
npx playwright install chromium

# 또는 Python 버전
pip install playwright
playwright install chromium
```

사용자가 이미 Playwright를 전역 설치했다면 바로 사용하면 됩니다.

## 스크린샷 모범 사례

### 전체 페이지 캡처

```python
page.screenshot(path='full.png', full_page=True)
```

### 뷰포트 캡처

```python
page.screenshot(path='viewport.png')  # 기본적으로 보이는 영역만 캡처
```

### 특정 요소 캡처

```python
element = page.query_selector('.hero-section')
element.screenshot(path='hero.png')
```

### 고해상도 스크린샷

```python
page = browser.new_page(device_scale_factor=2)  # retina
```

### 애니메이션이 끝난 후 캡처

```python
page.wait_for_timeout(2000)  # 2초 기다려 애니메이션이 안정되도록
page.screenshot(...)
```

## 스크린샷을 사용자에게 전달

### 로컬 스크린샷 바로 열기

```bash
open screenshot.png
```

사용자가 자신의 Preview/Figma/VSCode/브라우저에서 확인합니다.

### 이미지 호스팅 서비스에 업로드하여 링크 공유

원격 협업자에게 보여 줘야 할 경우(예: Slack/Feishu/WeChat), 사용자의 이미지 호스팅 도구나 MCP를 통해 업로드하도록 안내하십시오:

```bash
python ~/Documents/写作/tools/upload_image.py screenshot.png
```

ImgBB의 영구 링크가 반환되어 어디서든 붙여넣을 수 있습니다.

## 검증 오류 발생 시

### 페이지 흰 화면

콘솔에 반드시 오류가 있습니다. 먼저 확인할 사항:

1. React+Babel script 태그의 integrity hash가 올바른지 (`react-setup.md` 참고)
2. `const styles = {...}` 네이밍 충돌이 없는지
3. 파일 간 컴포넌트가 `window`에 export되어 있는지
4. JSX 문법 오류 (babel.min.js는 오류를 표시하지 않으므로 비압축 버전인 babel.js로 교체)

### 애니메이션 버벅임

- Chrome DevTools Performance 탭에서 구간 녹화
- layout thrashing(빈번한 reflow) 찾기
- 애니메이션 효과는 `transform`과 `opacity` 우선 사용 (GPU 가속)

### 폰트 오류

- `@font-face`의 url에 접근 가능한지 확인
- fallback 폰트 확인
- 한국어/중국어 폰트는 로딩이 느리므로: 먼저 fallback을 표시하고 로딩 완료 후 전환

### 레이아웃 틀어짐

- `box-sizing: border-box`가 전역 적용되었는지 확인
- `* { margin: 0; padding: 0 }` reset 확인
- Chrome DevTools에서 gridlines를 켜서 실제 레이아웃 확인

## 검증 = 디자이너의 두 번째 눈

**항상 직접 한 번 확인하십시오.** AI가 코드를 작성할 때 흔히 발생하는 문제들:

- 겉으로는 맞아 보이지만 interaction에 버그가 있음
- 정적 스크린샷은 괜찮지만 스크롤 시 틀어짐
- 넓은 화면에서는 예쁘지만 좁은 화면에서 무너짐
- Dark mode 테스트를 잊어버림
- Tweaks 전환 후 일부 컴포넌트가 반응하지 않음

**마지막 1분의 검증이 1시간의 재작업을 줄여 줍니다.**

## 자주 사용하는 검증 스크립트 명령어

```bash
# 기본: 열기 + 스크린샷 + 오류 캡처
python verify.py design.html

# 다중 viewport
python verify.py design.html --viewports 1920x1080,375x667

# 다중 슬라이드
python verify.py deck.html --slides 10

# 지정 디렉터리로 출력
python verify.py design.html --output ./screenshots/

# headless=false, 실제 브라우저를 열어 확인
python verify.py design.html --show
```
