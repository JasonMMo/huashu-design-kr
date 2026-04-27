# Design Philosophy Showcases — 예시 에셋 인덱스

> 8가지 시나리오 × 3가지 스타일 = 24개 사전 제작 디자인 예시
> Phase 3 디자인 방향 추천 시 "이 스타일로 만들면 어떤 모습인지" 직접 시각적으로 제시하기 위해 사용

## 스타일 설명

| 코드 | 유파 | 스타일명 | 시각적 분위기 |
|------|------|---------|---------|
| **Pentagram** | 정보 건축 파 | Pentagram / Michael Bierut | 흑백 절제, 스위스 그리드, 강한 타이포 계층, #E63946 레드 강조 |
| **Build** | 미니멀리즘 파 | Build Studio | 명품급 여백(70%+), 미묘한 자간(200-600), #D4A574 웜 골드, 정교함 |
| **Takram** | 동양 철학 파 | Takram | 부드러운 테크 감성, 자연색(베이지/회색/녹색), 둥근 모서리, 아트로서의 차트 |

## 시나리오 빠른 조회표

### 콘텐츠 디자인 시나리오

| # | 시나리오 | 규격 | Pentagram | Build | Takram |
|---|------|------|-----------|-------|--------|
| 1 | SNS 커버 이미지 | 1200×510 | `cover/cover-pentagram` | `cover/cover-build` | `cover/cover-takram` |
| 2 | PPT 데이터 페이지 | 1920×1080 | `ppt/ppt-pentagram` | `ppt/ppt-build` | `ppt/ppt-takram` |
| 3 | 세로형 인포그래픽 | 1080×1920 | `infographic/infographic-pentagram` | `infographic/infographic-build` | `infographic/infographic-takram` |

### 웹사이트 디자인 시나리오

| # | 시나리오 | 규격 | Pentagram | Build | Takram |
|---|------|------|-----------|-------|--------|
| 4 | 개인 홈페이지 | 1440×900 | `website-homepage/homepage-pentagram` | `website-homepage/homepage-build` | `website-homepage/homepage-takram` |
| 5 | AI 네비게이션 사이트 | 1440×900 | `website-ai-nav/ainav-pentagram` | `website-ai-nav/ainav-build` | `website-ai-nav/ainav-takram` |
| 6 | AI 글쓰기 도구 | 1440×900 | `website-ai-writing/aiwriting-pentagram` | `website-ai-writing/aiwriting-build` | `website-ai-writing/aiwriting-takram` |
| 7 | SaaS 랜딩 페이지 | 1440×900 | `website-saas/saas-pentagram` | `website-saas/saas-build` | `website-saas/saas-takram` |
| 8 | 개발자 문서 | 1440×900 | `website-devdocs/devdocs-pentagram` | `website-devdocs/devdocs-build` | `website-devdocs/devdocs-takram` |

> 각 항목에는 `.html`(소스 코드)과 `.png`(스크린샷) 두 파일이 있습니다.

## 사용 방법

### Phase 3 추천 시 참조
디자인 방향을 추천한 후 해당 시나리오의 사전 제작 스크린샷을 보여줄 수 있습니다:
```
"이것은 Pentagram 스타일로 SNS 커버를 만든 예시입니다 → [cover/cover-pentagram.png 표시]"
"Takram 스타일로 PPT 데이터 페이지를 만들면 이런 느낌입니다 → [ppt/ppt-takram.png 표시]"
```

### 시나리오 매칭 우선순위
1. 사용자 요구와 정확히 일치하는 시나리오가 있는 경우 → 해당 시나리오를 직접 표시
2. 정확한 매칭은 없지만 유형이 유사한 경우 → 가장 근접한 시나리오 표시 (예: "제품 공식 사이트" → SaaS 랜딩 페이지 표시)
3. 전혀 일치하지 않는 경우 → 사전 제작 예시를 건너뛰고 Phase 3.5 현장 생성으로 진행

### 横방향 비교 표시
동일 시나리오의 3가지 스타일을 나란히 표시하면 사용자가 직관적으로 비교할 수 있습니다:
- "동일한 SNS 커버를 3가지 스타일로 구현한 결과입니다"
- 표시 순서: Pentagram(이성적 절제) → Build(럭셔리 미니멀) → Takram(부드럽고 따뜻함)

## 콘텐츠 상세

### SNS 커버 이미지 (cover/)
- 내용: Claude Code Agent 워크플로우 — 8개 병렬 에이전트 아키텍처
- Pentagram: 거대한 빨간색 "8" + 스위스 그리드 라인 + 데이터 바
- Build: 초가는 자간의 "Agent" 70% 여백 위에 부유 + 웜 골드 세선
- Takram: 8노드 방사형 플로우차트를 아트피스로 표현 + 베이지 배경

### PPT 데이터 페이지 (ppt/)
- 내용: GLM-4.7 오픈소스 모델 코딩 능력 돌파 (AIME 95.7 / SWE-bench 73.8% / τ²-Bench 87.4)
- Pentagram: 260px "95.7" 앵커 + 레드/그레이/연그레이 대조 막대그래프
- Build: 3조 120px 초가는 숫자 부유 + 웜 골드 그라데이션 대조 바
- Takram: SVG 레이더 차트 + 3색 오버레이 + 둥근 데이터 카드

### 세로형 인포그래픽 (infographic/)
- 내용: AI 메모리 시스템 CLAUDE.md 93KB에서 22KB로 최적화
- Pentagram: 거대한 "93→22" 숫자 + 번호 블록 + CSS 데이터 바
- Build: 극단적 여백 + 부드러운 그림자 카드 + 웜 골드 연결선
- Takram: SVG 도넛 차트 + 유기적 곡선 플로우차트 + 글래스모피즘 카드

### 개인 홈페이지 (website-homepage/)
- 내용: 독립 개발자 Alex Chen의 포트폴리오 홈페이지
- Pentagram: 112px 큰 이름 + 스위스 그리드 분할 + 에디토리얼 숫자
- Build: 글래스 네비게이션 + 부유 통계 카드 + 초가는 자간
- Takram: 종이 질감 + 작은 원형 프로필 이미지 + 헤어라인 구분선 + 비대칭 레이아웃

### AI 네비게이션 사이트 (website-ai-nav/)
- 내용: AI Compass — 500+ AI 도구 디렉터리
- Pentagram: 각진 검색창 + 번호가 붙은 도구 목록 + 대문자 카테고리 레이블
- Build: 둥근 검색창 + 정교한 흰색 도구 카드 + 필 레이블
- Takram: 유기적으로 엇갈린 카드 레이아웃 + 부드러운 카테고리 레이블 + 차트식 연결

### AI 글쓰기 도구 (website-ai-writing/)
- 내용: Inkwell — AI 글쓰기 어시스턴트
- Pentagram: 86px 대형 제목 + 와이어프레임 에디터 모델 + 그리드 특성 열
- Build: 부유 에디터 카드 + 웜 골드 CTA + 럭셔리 글쓰기 경험
- Takram: 시적인 세리프 제목 + 유기적 에디터 + 플로우차트

### SaaS 랜딩 페이지 (website-saas/)
- 내용: Meridian — 비즈니스 인텔리전스 분석 플랫폼
- Pentagram: 흑백 분할 + 구조화된 대시보드 + 140px "3x" 앵커
- Build: 부유 대시보드 카드 + SVG 영역 차트 + 웜 골드 그라데이션
- Takram: 둥근 막대그래프 + 플로우 노드 + 부드러운 어스 컬러

### 개발자 문서 (website-devdocs/)
- 내용: Nexus API — 통합 AI 모델 게이트웨이
- Pentagram: 왼쪽 네비게이션 바 + 각진 코드 블록 + 빨간색 문자열 하이라이트
- Build: 중앙 부유 코드 카드 + 부드러운 그림자 + 웜 골드 아이콘
- Takram: 베이지 코드 블록 + 플로우차트 연결 + 점선 특성 카드

## 파일 통계

- HTML 소스 파일: 24개
- PNG 스크린샷: 24개
- 총 에셋: 48개 파일

---

**버전**: v1.0
**제작일**: 2026-02-13
**적용 대상**: design-philosophy 스킬 Phase 3 추천 단계
