# 오디오 디자인 규칙 · huashu-design

> 모든 애니메이션 데모의 오디오 적용 레시피입니다. `sfx-library.md`(에셋 목록)와 함께 사용하세요.
> 실전 검증：huashu-design 릴리스 hero v1-v9 반복 · Anthropic 공식 영상 3편의 Gemini 심층 분석 · 8,000회 이상 A/B 비교

---

## 핵심 원칙 · 오디오 이중 트랙제 (철칙)

애니메이션 오디오는 **반드시 두 레이어를 독립적으로 설계**해야 하며, 하나의 레이어만으로는 충분하지 않습니다：

| 레이어 | 역할 | 시간 규모 | 시각과의 관계 | 점유 주파수 대역 |
|---|---|---|---|---|
| **SFX (비트 레이어)** | 각 시각적 beat 마킹 | 0.2-2초 짧게 | **강 동기** (프레임 단위 정렬) | **고주파 800Hz+** |
| **BGM (분위기 베이스)** | 감정 기반, 음장 구성 | 연속 20-60초 | 약 동기 (구간 단위) | **중저주파 <4kHz** |

**BGM만 있는 애니메이션은 불완전합니다** — 관람자는 무의식적으로 「화면은 움직이지만 소리가 반응하지 않는다」고 느끼며, 이것이 저렴해 보이는 근본 원인입니다.

---

## 황금 표준 · 황금 비율

이 수치들은 Anthropic 공식 영상 3편 + 자체 v9 최종본 비교를 통해 도출한 **공학적 하드 파라미터**입니다. 그대로 적용하세요：

### 음량
- **BGM 음량**：`0.40-0.50` (최대 볼륨 1.0 대비)
- **SFX 음량**：`1.00`
- **음압 차이**：BGM peak은 SFX peak보다 **-6 ~ -8 dB 낮아야 합니다** (SFX의 절대 음량이 아닌 음압 차이로 돋보이게 합니다)
- **amix 파라미터**：`normalize=0` (normalize=1은 절대 사용 금지 — 다이나믹 레인지가 압축됨)

### 주파수 대역 분리 (P1 하드 최적화)
Anthropic의 비결은 「SFX 음량이 크다」가 아니라 **주파수 대역 분리**입니다：

```bash
[bgm_raw]lowpass=f=4000[bgm]      # BGM을 <4kHz 중저주파로 제한
[sfx_raw]highpass=f=800[sfx]      # SFX를 800Hz+ 중고주파로 밀어올림
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

이유：사람의 귀는 2-5kHz 구간(「presence 대역」)에 가장 민감합니다. SFX가 이 구간에 집중되고 BGM이 전 대역을 덮으면 **SFX가 BGM의 고주파 부분에 의해 가려집니다**. highpass로 SFX를 올리고 lowpass로 BGM을 내리면 두 레이어가 주파수 스펙트럼에서 각자의 영역을 갖게 되어 SFX 선명도가 한 단계 향상됩니다.

### Fade
- BGM 인：`afade=in:st=0:d=0.3` (0.3초, 하드 컷 방지)
- BGM 아웃：`afade=out:st=N-1.5:d=1.5` (1.5초 긴 꼬리, 마무리감)
- SFX는 자체 envelope이 있어 별도 fade 불필요

---

## SFX 큐 설계 규칙

### 밀도 (10초당 SFX 개수)
Anthropic 공식 영상 3편의 실측 SFX 밀도는 세 단계입니다：

| 영상 | 10초당 SFX 수 | 제품 성격 | 장면 |
|---|---|---|---|
| Artifacts (ref-1) | **~9개/10s** | 기능 집약, 정보량 많음 | 복잡한 도구 시연 |
| Code Desktop (ref-2) | **0개** | 순수 분위기, 명상적 느낌 | 개발 도구 집중 상태 |
| Word (ref-3) | **~4개/10s** | 균형, 오피스 리듬 | 생산성 도구 |

**휴리스틱**：
- 제품 성격이 차분/집중적 → SFX 밀도 낮게 (0-3개/10s), BGM 중심
- 제품 성격이 활기/정보 많음 → SFX 밀도 높게 (6-9개/10s), SFX가 리듬을 주도
- **모든 시각적 beat를 SFX로 채우지 마세요** — 여백이 밀도보다 고급스럽습니다. **큐의 30-50%를 삭제하면 나머지가 더 드라마틱해집니다**.

### 큐 선택 우선순위
모든 시각적 beat에 SFX를 배치할 필요는 없습니다. 이 우선순위에 따라 선택하세요：

**P0 필수** (생략하면 어색함이 느껴짐)：
- 타이핑 (터미널/입력)
- 클릭/선택 (사용자 의사결정 순간)
- 포커스 전환 (시각적 주인공 이동)
- 로고 reveal (브랜드 마무리)

**P1 권장**：
- 요소 등장/퇴장 (modal / card)
- 완료/성공 피드백
- AI 생성 시작/종료
- 주요 전환 (장면 전환)

**P2 선택** (많으면 혼란스러움)：
- hover / focus-in
- 진행도 tick
- 장식적 ambient

### 타임스탬프 정렬 정밀도
- **동일 프레임 정렬** (0ms 오차)：클릭 / 포커스 전환 / 로고 착지
- **1-2 프레임 선행** (-33ms)：빠른 whoosh (관람자에게 심리적 예고)
- **1-2 프레임 후행** (+33ms)：물체 착지 / impact (실제 물리 법칙에 부합)

---

## BGM 선택 의사결정 트리

huashu-design 스킬에는 BGM 6곡이 내장되어 있습니다 (`assets/bgm-*.mp3`)：

```
애니메이션의 성격은 무엇인가요?
├─ 제품 출시 / 기술 시연 → bgm-tech.mp3 (minimal synth + piano)
├─ 튜토리얼 / 도구 사용 → bgm-tutorial.mp3 (warm, instructional)
├─ 교육 / 원리 설명 → bgm-educational.mp3 (curious, thoughtful)
├─ 마케팅 광고 / 브랜드 홍보 → bgm-ad.mp3 (upbeat, promotional)
└─ 동일 계열에서 변형이 필요한 경우 → bgm-*-alt.mp3 (각각의 대안 버전)
```

### BGM 없는 장면 (고려할 만한 선택)
Anthropic Code Desktop (ref-2) 참고：**0 SFX + 순수 Lo-fi BGM**도 충분히 고급스러울 수 있습니다.

**BGM 없음을 선택할 때**：
- 애니메이션 길이 <10s (BGM이 자리잡기 어려움)
- 제품 성격이 「집중/명상적」인 경우
- 장면 자체에 환경음/내레이션이 있는 경우
- SFX 밀도가 매우 높을 때 (청각 과부하 방지)

---

## 장면별 레시피 (바로 사용 가능)

### 레시피 A · 제품 출시 hero (huashu-design v9 동일 구성)
```
길이：25초
BGM：bgm-tech.mp3 · 45% · 주파수 <4kHz
SFX 밀도：~6개/10s

큐：
  터미널 타이핑 → type × 4 (0.6초 간격)
  엔터          → enter
  카드 집중     → card × 4 (0.2초 엇갈림)
  선택됨        → click
  Ripple        → whoosh
  4회 포커스    → focus × 4
  로고          → thud (1.5초)

음량：BGM 0.45 / SFX 1.0 · amix normalize=0
```

### 레시피 B · 도구 기능 시연 (Anthropic Code Desktop 참고)
```
길이：30-45초
BGM：bgm-tutorial.mp3 · 50%
SFX 밀도：0-2개/10s (매우 적게)

전략：BGM + 내레이션 voiceover가 주도하고, SFX는 결정적 순간(파일 저장/명령 실행 완료)에만 사용
```

### 레시피 C · AI 생성 시연
```
길이：15-20초
BGM：bgm-tech.mp3 또는 BGM 없음
SFX 밀도：~8개/10s (고밀도)

큐：
  사용자 입력          → type + enter
  AI 처리 시작         → magic/ai-process (1.2초 루프)
  생성 완료            → feedback/complete-done
  결과 표시            → magic/sparkle
  
포인트：ai-process를 2-3회 루프하여 전체 생성 과정에 걸쳐 사용 가능
```

### 레시피 D · 순수 분위기 롱 샷 (Artifacts 참고)
```
길이：10-15초
BGM：없음
SFX：정교하게 설계된 3-5개의 큐만 사용

전략：각 SFX가 주인공이 되어 BGM이 「뭉개는」 문제가 없습니다.
적합：단일 제품 슬로우 모션, 클로즈업 전시
```

---

## ffmpeg 합성 템플릿

### 템플릿 1 · 단일 SFX를 비디오에 오버레이
```bash
ffmpeg -y -i video.mp4 -itsoffset 2.5 -i sfx.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4
```

### 템플릿 2 · 다중 SFX 타임라인 합성 (큐 시간에 맞춰 정렬)
```bash
ffmpeg -y \
  -i sfx-type.mp3 -i sfx-enter.mp3 -i sfx-click.mp3 -i sfx-thud.mp3 \
  -filter_complex "\
[0:a]adelay=1100|1100[a0];\
[1:a]adelay=3200|3200[a1];\
[2:a]adelay=7000|7000[a2];\
[3:a]adelay=21800|21800[a3];\
[a0][a1][a2][a3]amix=inputs=4:duration=longest:normalize=0[mixed]" \
  -map "[mixed]" -t 25 sfx-track.mp3
```
**핵심 파라미터**：
- `adelay=N|N`：앞은 좌채널 딜레이(ms), 뒤는 우채널 — 스테레오 정렬을 위해 두 번 작성
- `normalize=0`：다이나믹 레인지 보존, 필수!
- `-t 25`：지정 길이로 자르기

### 템플릿 3 · 비디오 + SFX 트랙 + BGM (주파수 대역 분리 포함)
```bash
ffmpeg -y -i video.mp4 -i sfx-track.mp3 -i bgm.mp3 \
  -filter_complex "\
[2:a]atrim=0:25,afade=in:st=0:d=0.3,afade=out:st=23.5:d=1.5,\
     lowpass=f=4000,volume=0.45[bgm];\
[1:a]highpass=f=800,volume=1.0[sfx];\
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k final.mp4
```

---

## 실패 패턴 빠른 참조

| 증상 | 근본 원인 | 수정 방법 |
|---|---|---|
| SFX가 들리지 않음 | BGM 고주파가 가림 | BGM에 `lowpass=f=4000` + SFX에 `highpass=f=800` 추가 |
| 음효가 너무 크고 자극적 | SFX 절대 음량 과다 | SFX 음량을 0.7로 낮추고 BGM도 0.3으로 낮춰 차이 유지 |
| BGM과 SFX 리듬이 충돌 | BGM 선택 잘못됨 (강한 비트의 음악 사용) | ambient / minimal synth BGM으로 교체 |
| 애니메이션 종료 시 BGM이 갑자기 끊김 | fade out 없음 | `afade=out:st=N-1.5:d=1.5` 적용 |
| SFX가 겹쳐 뭉개짐 | 큐 밀도 과다 + 각 SFX 길이 과다 | SFX 길이를 0.5초 이내로 제한, 큐 간격 ≥ 0.2초 |
| 채널 mp4에서 소리가 없음 | 플랫폼에 따라 자동 재생을 음소거하는 경우 있음 | 걱정 불필요 — 사용자가 열면 소리 나옴; GIF는 원래 소리 없음 |

---

## 시각과의 연동 (고급)

### SFX 음색은 시각 스타일과 일치해야 합니다
- 따뜻한 미색 / 종이질감 시각 → SFX는 **목재적/부드러운** 음색 사용 (Morse, paper snap, soft click)
- 차가운 하이테크 시각 → SFX는 **금속적/디지털** 음색 사용 (beep, pulse, glitch)
- 손그림 / 동화적 시각 → SFX는 **카툰/과장된** 음색 사용 (boing, pop, zap)

현재 `apple-gallery-showcase.md`의 따뜻한 미색 배경 → `keyboard/type.mp3` (mechanical) + `container/card-snap.mp3` (soft) + `impact/logo-reveal-v2.mp3` (cinematic bass)와 매칭됩니다.

### SFX가 시각적 리듬을 유도할 수 있습니다
고급 기법：**먼저 SFX 타임라인을 설계하고, 그 다음 시각 애니메이션이 SFX에 맞춰 조정합니다** (반대 방향이 아닙니다).
SFX의 각 큐는 하나의 「시계 tick」이므로 시각 애니메이션이 SFX 리듬에 맞춰 가면 매우 안정적입니다. 반대로 SFX가 시각을 뒤쫓으면 ±1 프레임의 어긋남으로도 어색함이 생깁니다.

---

## 품질 점검 체크리스트 (출시 전 자가 점검)

- [ ] 음압 차이：SFX peak - BGM peak = -6 ~ -8 dB인가요?
- [ ] 주파수 대역：BGM lowpass 4kHz + SFX highpass 800Hz?
- [ ] amix normalize=0 (다이나믹 레인지 보존)?
- [ ] BGM fade-in 0.3s + fade-out 1.5s?
- [ ] SFX 개수가 적절한가요 (장면 성격에 맞는 밀도 선택)?
- [ ] 각 SFX와 시각적 beat가 동일 프레임 정렬 (±1 프레임 이내)?
- [ ] 로고 reveal 음효 길이가 충분한가요 (1.5초 권장)?
- [ ] BGM 끄고 들어보기：SFX 단독으로 충분한 리듬감이 있나요?
- [ ] SFX 끄고 들어보기：BGM 단독으로 감정 기복이 있나요?

두 레이어 각각을 단독으로 들었을 때 모두 자연스러워야 합니다. 두 레이어를 합쳤을 때만 좋게 들린다면 아직 완성되지 않은 것입니다.

---

## 참고

- SFX 에셋 목록：`sfx-library.md`
- 시각 스타일 참고：`apple-gallery-showcase.md`
- Anthropic 공식 영상 3편 심층 오디오 분석：`/Users/alchain/Documents/写作/01-公众号写作/项目/2026.04-huashu-design发布/参考动画/AUDIO-BEST-PRACTICES.md`
- huashu-design v9 실전 사례：`/Users/alchain/Documents/写作/01-公众号写作/项目/2026.04-huashu-design发布/配图/hero-animation-v9-final.mp4`
