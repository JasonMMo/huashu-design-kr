# SFX Library · huashu-design

> 전부 ElevenLabs Sound Generation API로 생성되었으며, 애플 키노트 수준의 음질을 자랑합니다.
> 제품급 SFX 에셋 라이브러리로, 화슈 애니메이션/프레젠테이션/제품 데모 전 시나리오를 커버합니다.

**에셋 위치**: `assets/sfx/<category>/<name>.mp3`
**총 수량**: 37개 SFX（일괄 생성 30개 + v7b 보존 7개）
**생성 모델**: ElevenLabs Sound Generation API（prompt_influence 0.4）
**음질**: 44.1kHz MP3, 애플 키노트 수준 선명도, 추가 리버브 없음

---

## 디렉토리 구조

```
assets/sfx/
├── keyboard/      type, type-fast, delete-key, space-tap, enter
├── ui/            click, click-soft, focus, hover-subtle, tap-finger, toggle-on
├── transition/    whoosh, whoosh-fast, swipe-horizontal, slide-in, dissolve
├── container/     card-snap, card-flip, stack-collapse, modal-open
├── feedback/      success-chime, error-tone, notification-pop, achievement
├── progress/      loading-tick, complete-done, generate-start
├── impact/        logo-reveal, logo-reveal-v2, brand-stamp, drop-thud
├── magic/         sparkle, ai-process, transform
└── terminal/      command-execute, output-appear, cursor-blink
```

---

## 빠른 색인

### ⌨️ Keyboard（키보드 입력）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/keyboard/type.mp3` | 0.5s | 단일 키 입력（mechanical keyboard single key） | mechanical keyboard single key press |
| `sfx/keyboard/type-fast.mp3` | 1.5s | 연속 빠른 타이핑（프롬프트 입력 데모） | fast continuous typing rhythm, apple magic keyboard |
| `sfx/keyboard/delete-key.mp3` | 0.5s | backspace 삭제 | single backspace key, low pitched thud |
| `sfx/keyboard/space-tap.mp3` | 0.5s | 스페이스바 가볍게 누르기 | soft spacebar tap, wide flat |
| `sfx/keyboard/enter.mp3` | 0.5s | 엔터 확인（v7b 보존） | enter key press, crisp tactile |

### 🎯 UI（인터페이스 인터랙션）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/ui/click.mp3` | 0.5s | 표준 UI 클릭（v7b 보존） | crisp modern interface click |
| `sfx/ui/click-soft.mp3` | 0.5s | 부드러운 UI click（보조 버튼/링크） | soft gentle button click, mid pitched |
| `sfx/ui/focus.mp3` | 0.5s | 요소 포커스/선택（v7b 보존） | subtle focus tone, element highlight |
| `sfx/ui/hover-subtle.mp3` | 0.5s | 호버 힌트（마이크로초 단위 피드백） | barely audible tick, air whisper |
| `sfx/ui/tap-finger.mp3` | 0.5s | 모바일 tap（iOS 인터페이스） | finger tap on touchscreen, muted thud |
| `sfx/ui/toggle-on.mp3` | 0.5s | 스위치 켜기 | ios toggle switch flip, satisfying click |

### 🌊 Transition（전환）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/transition/whoosh.mp3` | 0.5s | 표준 whoosh（v7b 보존） | air whoosh transition |
| `sfx/transition/whoosh-fast.mp3` | 0.6s | 빠른 whoosh（제목 플래시 인, 탭 전환） | quick fast air whoosh, cinematic |
| `sfx/transition/swipe-horizontal.mp3` | 0.7s | 가로 스와이프（캐러셀, 탭 전환） | smooth left-to-right air movement |
| `sfx/transition/slide-in.mp3` | 0.6s | 요소 슬라이드 인（사이드 패널, 드로어） | smooth soft whoosh with arrival |
| `sfx/transition/dissolve.mp3` | 0.8s | 부드러운 페이드（이미지 페이드아웃/인） | soft dissolve, airy shimmer |

### 🃏 Container（카드/컨테이너）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/container/card-snap.mp3` | 0.5s | 카드 스냅/위치 고정（v7b 보존） | card snap into place |
| `sfx/container/card-flip.mp3` | 0.7s | 카드 뒤집기（앞뒤 전환） | playing card flip, crisp snap |
| `sfx/container/stack-collapse.mp3` | 0.8s | 스택 접기（목록 집계） | cards stacking, paper taps collapsing |
| `sfx/container/modal-open.mp3` | 0.6s | 모달 창 열기 | modal popping open, whoosh + thud |

### 🔔 Feedback（알림/피드백）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/feedback/success-chime.mp3` | 1.0s | 성공 알림（결제 완료, 작업 완료） | two ascending bell tones, ios-style |
| `sfx/feedback/error-tone.mp3` | 0.7s | 오류 알림（경고, 실패） | descending two-note warning, soft |
| `sfx/feedback/notification-pop.mp3` | 0.6s | 메시지 팝업（toast, 알림） | notification bloop, ios message alert |
| `sfx/feedback/achievement.mp3` | 1.5s | 달성 완료（마일스톤, 배지） | triumphant rising arpeggio, game-style |

### ⏳ Progress（진행/상태）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/progress/loading-tick.mp3` | 0.5s | 로딩 타이밍（프로그레스 바 비트） | soft short pulse, minimal ambient |
| `sfx/progress/complete-done.mp3` | 0.8s | 완료 확인（step 완료） | two ascending satisfying tones |
| `sfx/progress/generate-start.mp3` | 0.8s | AI 생성 시작 | soft rising shimmer, magical whoosh |

### 💥 Impact（브랜드/임팩트）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/impact/logo-reveal.mp3` | 0.7s | Logo impact（v7b 보존） | logo reveal thud |
| `sfx/impact/logo-reveal-v2.mp3` | 1.5s | 더 긴 Logo impact（영화적 느낌） | cinematic bass hit with shimmer tail |
| `sfx/impact/brand-stamp.mp3` | 1.0s | 도장 강타（인증, 스탬프） | rubber stamp thud, paper contact |
| `sfx/impact/drop-thud.mp3` | 0.7s | 물체 착지（삽입, 배치） | heavy thud, wood surface contact |

### ✨ Magic（AI 변환）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/magic/sparkle.mp3` | 0.8s | 마법 섬광（AI 하이라이트, 서프라이즈） | bright twinkling stars, fairy dust |
| `sfx/magic/ai-process.mp3` | 1.2s | AI 처리 음（thinking 상태） | modulating digital hum with shimmer |
| `sfx/magic/transform.mp3` | 1.0s | 변환 전환（morph 효과） | rising shimmer whoosh with sparkle tail |

### 💻 Terminal（커맨드라인）

| 파일 | 길이 | 용도 | Prompt 요점 |
|---|---|---|---|
| `sfx/terminal/command-execute.mp3` | 0.5s | 명령 실행 | crisp digital beep with tick, hacker ui |
| `sfx/terminal/output-appear.mp3` | 0.6s | 출력 표시 | rapid digital ticks, retro printout |
| `sfx/terminal/cursor-blink.mp3` | 0.5s | 커서 깜빡임 | subtle soft digital pulse, rhythmic |

---

## 시나리오별 추천 조합

### 💻 Terminal 인터랙션 데모
```
type (0.5s) → enter (0.5s) → command-execute (0.5s) → output-appear (0.6s)
```
반복 요소: `cursor-blink`를 idle 시 환경음으로 사용.

### 🃏 카드 선택 흐름
```
hover-subtle (0.5s, UI 호버) → click-soft (0.5s, 클릭) → card-snap (0.5s, 위치 고정)
```
또는 심화 버전: `card-flip`으로 앞뒤 전환.

### 🤖 AI 생성 전체 흐름
```
generate-start (0.8s, 시작) → ai-process (1.2s, 처리) → sparkle (0.8s, 등장) → complete-done (0.8s, 완료)
```
오류 발생 시 `complete-done` 대신 `error-tone` 사용.

### 🎬 Logo Reveal（브랜드 순간）
```
whoosh-fast (0.6s, 복선) → logo-reveal-v2 (1.5s, 임팩트) → sparkle (0.8s, 여운)
```
간략 버전: `whoosh → logo-reveal`（v7b 투피스）.

### 📱 UI 인터랙션 데모（모바일）
```
tap-finger (0.5s, 탭) → slide-in (0.6s, 패널 슬라이드 인) → toggle-on (0.5s, 스위치)
```
완료 후: `success-chime` 또는 `notification-pop`.

### 📊 데이터 시각화/대시보드
```
loading-tick (0.5s, 비트) × N → complete-done (0.8s, 데이터 도착) → achievement (1.5s, 임팩트 포인트)
```

### 🎯 폼 제출 흐름
```
click-soft (0.5s) → loading-tick ×2 (1.0s) → success-chime (1.0s)
```
실패 분기: `error-tone (0.7s)`.

### 🪄 Magic Transform 시나리오
```
whoosh-fast (0.6s) → transform (1.0s) → sparkle (0.8s)
```
적합 용도: 요소 변형, 효과 전후 비교, "AI 재작성" 데모 등.

---

## 사용 규범

### 볼륨 권장값（apple-gallery-showcase.md 오디오 이중 트랙 방식에서）
- **SFX 메인 트랙**: `1.0`（감쇠 없음）
- **BGM 배경 트랙**: `0.4 ~ 0.5`（SFX가 명확하게 투과）
- **SFX 다중 믹스**: `amix=inputs=N:duration=longest:normalize=0` 사용하여 다이나믹 레인지 보존

### ffmpeg 편집 템플릿
```bash
# 단일 SFX 타임포인트 정렬:
ffmpeg -i video.mp4 -itsoffset 2.5 -i sfx/ui/click.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4

# 다중 SFX + BGM:
ffmpeg -i video.mp4 \
  -itsoffset 1.0 -i sfx/transition/whoosh-fast.mp3 \
  -itsoffset 1.6 -i sfx/impact/logo-reveal-v2.mp3 \
  -i bgm.mp3 \
  -filter_complex "[3:a]volume=0.4[bgm];[0:a][1:a][2:a][bgm]amix=inputs=4:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4
```

### 선택 결정 트리
1. **tactile 동작이 있는 경우**（타이핑/클릭/스와이프） → `keyboard/` 또는 `ui/`
2. **요소 등장/퇴장** → `transition/`
3. **컨테이너 레이어 조작**（카드/모달） → `container/`
4. **상태 피드백**（성공/실패/알림） → `feedback/`
5. **진행/시간 경과** → `progress/`
6. **브랜드 임팩트/중요한 순간** → `impact/`
7. **AI 마법/변환** → `magic/`
8. **커맨드라인/코드 데모** → `terminal/`

### 음향 중첩 방지
- 동일 시간대 `최대 2개 SFX` 동시 사용
- BGM이 0.3 이하로 낮아졌을 때 3개까지 허용
- 브랜드 impact 시 다른 SFX 모두 제거（0.2s 공백 후 임팩트 포인트）

---

## Prompt 작성 원칙（재사용 가능）

참고 스타일: `apple keynote, tight, minimal, no reverb unless ambient, crisp, elegant`

**좋은 prompt의 세 가지 요소**:
1. **소리의 물리적 묘사**: 어떤 물체, 어떤 동작（"mechanical keyboard single key press"）
2. **질감/스타일 한정**: apple-style / ios-style / cinematic / retro
3. **반례 제외**: no reverb / clean studio / minimal

❌ "click sound"
✅ "crisp ui button click, clean modern interface sound, apple-style, high pitched"

❌ "magic"
✅ "bright twinkling stars sound, high pitched glittery chime, fairy dust"

---

## 참고 문서
- 오디오 이중 트랙 방식 및 ffmpeg 편집: `apple-gallery-showcase.md`
- 원본 생성 스크립트: `/tmp/gen_sfx_batch.sh`（일회성 일괄 생성기）
