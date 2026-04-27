# Video Export：HTML 애니메이션을 MP4/GIF로 내보내기

애니메이션 HTML 완성 후 사용자가 "영상으로 내보낼 수 있나요?"라고 묻는 경우가 많습니다. 이 가이드는 전체 프로세스를 안내합니다.

## 내보내기 시점

**내보내기 타이밍**:
- 애니메이션이 완전히 동작하고 시각적으로 검증됨 (Playwright 스크린샷으로 각 시점의 상태가 올바른지 확인)
- 사용자가 브라우저에서 최소 한 번 확인하여 효과가 OK라고 인정한 경우
- 애니메이션 버그가 수정되지 않은 단계에서는 **내보내지 마십시오** — 비디오로 내보낸 후 수정하면 비용이 훨씬 큽니다

**사용자가 사용하는 트리거 표현**:
- "영상으로 내보낼 수 있나요"
- "MP4로 변환해 주세요"
- "GIF로 만들어 주세요"
- "60fps로 해주세요"

## 산출물 규격

기본적으로 세 가지 포맷을 제공하여 사용자가 선택하도록 합니다:

| 포맷 | 규격 | 적합한 용도 | 일반적인 크기 (30초) |
|---|---|---|---|
| MP4 25fps | 1920×1080 · H.264 · CRF 18 | 공식 채널 삽입, 숏폼, YouTube | 1-2 MB |
| MP4 60fps | 1920×1080 · minterpolate 보간 · H.264 · CRF 18 | 고프레임 전시, B站, 포트폴리오 | 1.5-3 MB |
| GIF | 960×540 · 15fps · palette 최적화 | Twitter/X, README, Slack 미리보기 | 2-4 MB |

## 도구 체인

`scripts/`에 두 개의 스크립트가 있습니다:

### 1. `render-video.js` — HTML → MP4

25fps MP4 기본 버전을 녹화합니다. 전역 playwright에 의존합니다.

```bash
NODE_PATH=$(npm root -g) node /path/to/claude-design/scripts/render-video.js <html파일>
```

선택적 파라미터:
- `--duration=30` 애니메이션 길이(초)
- `--width=1920 --height=1080` 해상도
- `--trim=2.2` 비디오 시작 부분에서 잘라낼 초(reload + 폰트 로딩 시간 제거)
- `--fontwait=1.5` 폰트 로딩 대기 시간(초), 폰트가 많을 때 늘리십시오

출력: HTML과 같은 디렉터리, 같은 이름의 `.mp4`.

### 2. `add-music.sh` — MP4 + BGM → MP4

무음 MP4에 배경 음악을 믹싱합니다. 분위기(mood)에 따라 내장 BGM 라이브러리에서 선택하거나 외부 오디오를 직접 지정할 수 있습니다. 길이를 자동으로 맞추고 페이드 인/아웃을 적용합니다.

```bash
bash add-music.sh <input.mp4> [--mood=<name>] [--music=<path>] [--out=<path>]
```

**내장 BGM 라이브러리** (`assets/bgm-<mood>.mp3`):

| `--mood=` | 스타일 | 적합한 장면 |
|-----------|------|---------|
| `tech` (기본) | Apple Silicon / 애플 발표회풍, 미니멀 신시사이저+피아노 | 제품 출시, AI 도구, Skill 홍보 |
| `ad` | upbeat 현대 전자음악, build + drop 있음 | 소셜 미디어 광고, 제품 티저, 프로모션 영상 |
| `educational` | 따뜻하고 밝은, 어쿠스틱 기타/일렉트릭 피아노, inviting | 교육 콘텐츠, 튜토리얼 소개, 강의 예고 |
| `educational-alt` | 동종 대체, 다른 곡으로 시도 | 위와 동일 |
| `tutorial` | lo-fi 환경음, 존재감 거의 없음 | 소프트웨어 데모, 프로그래밍 튜토리얼, 긴 데모 |
| `tutorial-alt` | 동종 대체 | 위와 동일 |

**동작**:
- 음악을 비디오 길이에 맞게 잘라냄
- 0.3초 페이드 인 + 1초 페이드 아웃 (하드컷 방지)
- 비디오 스트림 `-c:v copy`로 재인코딩 없음, 오디오 AAC 192k
- `--music=<path>` 옵션이 `--mood`보다 우선순위가 높으며, 임의의 외부 오디오를 직접 지정 가능
- 잘못된 mood 이름을 입력하면 사용 가능한 옵션을 모두 나열하며 조용히 실패하지 않음

**전형적인 파이프라인** (애니메이션 내보내기 3단계 + 배경음악):
```bash
node render-video.js animation.html                        # 녹화
bash convert-formats.sh animation.mp4                      # 60fps + GIF 파생
bash add-music.sh animation-60fps.mp4                      # 기본 tech BGM 추가
# 또는 용도별:
bash add-music.sh tutorial-demo.mp4 --mood=tutorial
bash add-music.sh product-promo.mp4 --mood=ad --out=promo-final.mp4
```

### 3. `convert-formats.sh` — MP4 → 60fps MP4 + GIF

기존 MP4에서 60fps 버전과 GIF를 생성합니다.

```bash
bash /path/to/claude-design/scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

출력 (입력과 같은 디렉터리):
- `<name>-60fps.mp4` — 기본적으로 `fps=60` 프레임 복사 사용(광범위한 호환성); `--minterpolate` 추가 시 고품질 보간 활성화
- `<name>.gif` — palette 최적화된 GIF (기본 960 너비, 변경 가능)

**60fps 모드 선택**:

| 모드 | 명령 | 호환성 | 사용 시나리오 |
|---|---|---|---|
| 프레임 복사(기본) | `convert-formats.sh in.mp4` | QuickTime/Safari/Chrome/VLC 전부 가능 | 범용 납품, 플랫폼 업로드, 소셜 미디어 |
| minterpolate 보간 | `convert-formats.sh in.mp4 --minterpolate` | macOS QuickTime/Safari에서 재생 거부 가능 | B站 등 실제 보간이 필요한 전시 장면, **납품 전 반드시 로컬에서 대상 플레이어 테스트** |

기본값을 프레임 복사로 변경한 이유? minterpolate 출력 H.264 elementary stream에 known compat 버그가 있습니다 — 이전에 기본값이 minterpolate였을 때 "macOS QuickTime에서 열리지 않는" 문제를 여러 번 겪었습니다. 자세한 내용은 `animation-pitfalls.md` §14 참고.

`gif_width` 파라미터:
- 960 (기본) — 소셜 플랫폼 범용
- 1280 — 더 선명하지만 파일 크기 증가
- 600 — Twitter/X 우선 로딩

## 전체 프로세스 (표준 권장)

사용자가 "영상 내보내기"를 요청한 후:

```bash
cd <프로젝트 디렉터리>

# $SKILL은 본 skill의 루트 디렉터리를 가리킨다고 가정 (설치 위치에 맞게 교체)

# 1. 25fps 기본 MP4 녹화
NODE_PATH=$(npm root -g) node "$SKILL/scripts/render-video.js" my-animation.html

# 2. 60fps MP4 및 GIF 파생
bash "$SKILL/scripts/convert-formats.sh" my-animation.mp4

# 산출물 목록:
# my-animation.mp4         (25fps · 1-2 MB)
# my-animation-60fps.mp4   (60fps · 1.5-3 MB)
# my-animation.gif         (15fps · 2-4 MB)
```

## 기술 세부 사항 (트러블슈팅용)

### Playwright recordVideo의 주의사항

- 프레임 레이트가 25fps로 고정되어 있으며, 60fps 직접 녹화 불가 (Chromium headless compositor 상한)
- context 생성 시부터 녹화가 시작되므로 앞부분 로딩 시간은 반드시 `trim`으로 잘라내야 함
- 기본 webm 포맷이므로 범용 재생을 위해 ffmpeg으로 H.264 MP4 변환 필요

`render-video.js`가 위 문제들을 모두 처리합니다.

### ffmpeg minterpolate 파라미터

현재 설정: `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`

- `mi_mode=mci` — motion compensation interpolation(운동 보상)
- `mc_mode=aobmc` — adaptive overlapped block motion compensation
- `me_mode=bidir` — 양방향 움직임 추정
- `vsbmc=1` — 가변 크기 블록 움직임 보상

CSS **transform 애니메이션**(translate/scale/rotate)에 효과적입니다.
**순수 fade**에서는 약간의 ghosting이 발생할 수 있습니다 — 사용자가 불편해한다면 단순 프레임 복사로 대체하십시오:

```bash
ffmpeg -i input.mp4 -r 60 -c:v libx264 ... output.mp4
```

### GIF palette를 2단계로 처리하는 이유

GIF는 256색만 지원합니다. 1회 pass GIF는 전체 애니메이션 색상을 256색 공용 palette로 압축하여, 베이지 바탕+오렌지색 같은 섬세한 배색이 뭉개집니다.

2단계 처리:
1. `palettegen=stats_mode=diff` — 먼저 전체를 스캔하여 **이 애니메이션에 최적화된 palette** 생성
2. `paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle` — 이 palette로 인코딩, rectangle diff는 변화된 영역만 업데이트하여 파일 크기를 크게 줄임

fade 전환에는 `dither=bayer`가 `none`보다 더 부드럽지만 파일 크기가 약간 커집니다.

## Pre-flight 체크 (내보내기 전)

내보내기 전 30초 자가 점검:

- [ ] HTML을 브라우저에서 완전히 실행, 콘솔 오류 없음
- [ ] 애니메이션 0프레임이 완전한 초기 상태 (빈 로딩 중 상태가 아님)
- [ ] 애니메이션 마지막 프레임이 안정적인 마무리 상태 (중간에 잘린 상태가 아님)
- [ ] 폰트/이미지/emoji가 모두 정상 렌더링됨 (`animation-pitfalls.md` 참고)
- [ ] Duration 파라미터가 HTML 내 실제 애니메이션 길이와 일치함
- [ ] HTML 내 Stage 감지 `window.__recording`이 loop=false 강제 설정됨 (수동 작성 Stage는 반드시 확인; `assets/animations.jsx` 사용 시 내장됨)
- [ ] 마지막 Sprite의 `fadeOut={0}` (비디오 마지막 프레임에서 페이드아웃 없음)
- [ ] "Created by Huashu-Design" 워터마크 포함 (애니메이션 장면에만 필수; 서드파티 브랜드 작품에는 "비공식 제작 · " 접두사 추가. 자세한 내용은 SKILL.md §「Skill 홍보 워터마크」 참고)

## 납품 시 첨부할 안내문

내보내기 완료 후 사용자에게 전달하는 표준 안내문 형식:

```
**전체 납품물**

| 파일 | 포맷 | 규격 | 크기 |
|---|---|---|---|
| foo.mp4 | MP4 | 1920×1080 · 25fps · H.264 | X MB |
| foo-60fps.mp4 | MP4 | 1920×1080 · 60fps(운동 보간) · H.264 | X MB |
| foo.gif | GIF | 960×540 · 15fps · palette 최적화 | X MB |

**안내**
- 60fps는 minterpolate 운동 추정 보간을 사용하여 transform 애니메이션 효과가 우수합니다
- GIF는 palette 최적화를 적용하여 30초 애니메이션을 약 3MB까지 압축 가능합니다

크기나 프레임 레이트를 변경하고 싶으시면 말씀해 주십시오.
```

## 자주 있는 추가 요청

| 사용자 요청 | 대응 방법 |
|---|---|
| "너무 크네요" | MP4: CRF를 23-28로 높임; GIF: 해상도를 600으로 낮추거나 fps를 10으로 낮춤 |
| "GIF가 너무 흐려요" | `gif_width`를 1280으로 높임; 또는 MP4 사용을 권장 (WeChat도 지원) |
| "세로형 9:16 원해요" | HTML 소스에서 `--width=1080 --height=1920`으로 변경 후 재녹화 |
| "워터마크 추가해 주세요" | ffmpeg에 `-vf "drawtext=..."` 또는 PNG `overlay=` 추가 |
| "투명 배경 원해요" | MP4는 alpha 미지원; WebM VP9 + alpha 또는 APNG 사용 |
| "무손실로 원해요" | CRF를 0으로 + preset veryslow 설정 (파일 크기 10배 증가) |
