# 씬 템플릿 라이브러리: 출력 유형별 정리

> design-styles.md의 「프롬프트 DNA」와 조합하여 사용합니다.
> 공식: `[스타일 프롬프트 DNA] + [씬 템플릿] + [구체적 콘텐츠 설명]`

---

## 1. 공식 계정 커버 / 아티클 대표 이미지

**규격**:
- 커버 이미지: 2.35:1（900×383px 또는 1200×510px）
- 본문 삽화: 16:9（1200×675px）또는 4:3（1200×900px）

**핵심 디자인 요소**:
- 시각적 임팩트 우선（사용자가 피드에서 빠르게 스캔하므로）
- 텍스트 최소화 또는 무텍스트（공식 계정 제목이 위에 표시됨）
- 적당한 색채 채도（WeChat 읽기 환경은 흰색 계열）
- 과도한 디테일 지양（썸네일에서도 식별 가능해야 함）

**권장 스타일**: 01 Pentagram / 11 Build / 12 Sagmeister / 18 Kenya Hara / 07 Field.io

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Article cover image for WeChat subscription
- Landscape format, 2.35:1 aspect ratio
- Bold visual impact, minimal or no text
- Moderate color saturation for white reading environment
- Must remain recognizable as thumbnail
- Clean composition with clear focal point
```

---

## 2. 본문 삽화 / 개념 일러스트

**규격**:
- 16:9（1200×675px）범용성 가장 높음
- 1:1（800×800px）강조에 적합
- 4:3（1200×900px）정보 밀도가 높은 경우 적합

**핵심 디자인 요소**:
- 아티클의 논지를 뒷받침하며 장식이 되어서는 안 됨
- 전후 문맥과 시각적 리듬 형성
- 하나의 핵심 개념을 간결하게 표현
- AI 생성 우선, HTML 스크린샷은 정확한 데이터 표가 필요한 경우에만 사용

**권장 스타일**: 아티클 톤에 맞게 선택, 주로 01/04/10/17/18 사용

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Article illustration, concept visualization
- [16:9 / 1:1 / 4:3] aspect ratio
- Single clear concept: [핵심 개념 설명]
- Serve the argument, not decoration
- [Light/Dark] background to match article tone
```

---

## 3. 인포그래픽 / 데이터 시각화

**규격**:
- 세로형 긴 이미지: 1080×1920px（모바일 읽기）
- 가로형: 1920×1080px（아티클 삽입）
- 정방형: 1080×1080px（소셜 미디어）

**핵심 디자인 요소**:
- 정보 계층이 명확해야 함（제목 → 핵심 데이터 → 세부사항）
- 데이터는 정확하며 조작하지 않음
- 시각적 유도선（사용자 읽기 경로）
- 아이콘/차트를 적절히 활용하여 이해 보조

**권장 스타일**: 04 Fathom / 10 Müller-Brockmann / 02 Stamen / 17 Takram

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Infographic / data visualization
- [Vertical 1080x1920 / Horizontal 1920x1080 / Square 1080x1080]
- Clear information hierarchy: title → key data → details
- Visual flow guiding reader's eye path
- Icons and charts for comprehension
- Data-accurate, no decorative distortion
```

---

## 4. PPT / Keynote 프레젠테이션

**규격**:
- 표준: 16:9（1920×1080px）
- 와이드스크린: 16:10（1920×1200px）

**핵심 디자인 요소**:
- 페이지당 하나의 핵심 메시지（과적재 금지）
- 폰트 크기 계층 명확（제목 40pt+ / 본문 24pt+ / 주석 16pt+）
- 충분한 여백, 프로젝터 출력 시 더 선명하게 표시
- 이미지:텍스트 비율 최소 60:40
- 일관된 시각 시스템（색상、폰트、간격）

**권장 스타일**: 01 Pentagram / 10 Müller-Brockmann / 11 Build / 18 Kenya Hara / 04 Fathom

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Presentation slide design, 16:9
- One core message per slide
- Clear type hierarchy (title 40pt+, body 24pt+)
- Generous whitespace for projection clarity
- Consistent visual system throughout
- [Light/Dark] theme
```

---

## 5. PDF 백서 / 기술 보고서

**규격**:
- A4 세로（210×297mm / 595×842pt）
- Letter 세로（216×279mm / 612×792pt）

**핵심 디자인 요소**:
- 장문 읽기 최적화（행 너비 66자, 줄간격 1.5-1.8）
- 명확한 챕터 내비게이션 시스템
- 헤더/푸터/페이지 번호의 통일된 디자인
- 도표와 본문의 우아한 공존
- 인용/주석 시스템
- 표지 디자인을 정교하게

**권장 스타일**: 10 Müller-Brockmann / 04 Fathom / 03 Information Architects / 17 Takram / 19 Irma Boom

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- PDF document / white paper design
- A4 portrait format (210×297mm)
- Long-form reading optimized (66 char line width, 1.5 line height)
- Clear chapter navigation system
- Elegant header/footer/page number design
- Charts integrated with body text
- Professional cover page
```

---

## 6. 랜딩 페이지 / 제품 공식 사이트

**규격**:
- Desktop: 1440px 너비 설계（320px까지 반응형）
- 첫 화면 높이: 100vh

**핵심 디자인 요소**:
- 첫 화면에서 5초 이내에 핵심 가치 전달
- 명확한 CTA（액션 버튼）
- 스크롤 내러티브 구조（문제→솔루션→증거→행동）
- 모바일 대응
- 로딩 속도

**권장 스타일**: 05 Locomotive / 01 Pentagram / 11 Build / 08 Resn / 06 Active Theory

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Landing page / product website
- Desktop 1440px width, responsive
- Hero section 100vh, core value in 5 seconds
- Clear CTA button design
- Scroll narrative: problem → solution → proof → action
- Modern web aesthetic
```

---

## 7. App UI / 프로토타입 인터페이스

**규격**:
- iOS: 390×844pt（iPhone 15）
- Android: 360×800dp
- 태블릿: 1024×1366pt（iPad Pro）

**핵심 디자인 요소**:
- 터치 친화적（최소 탭 영역 44×44pt）
- 시스템 디자인 언어 일관성
- 상태 표시줄/내비게이션 바/탭 바의 표준 처리
- 적당한 정보 밀도（모바일은 과밀 지양）

**권장 스타일**: 17 Takram / 11 Build / 03 Information Architects / 01 Pentagram

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Mobile app UI design
- iOS [390×844pt] / Android [360×800dp]
- Touch-friendly (44pt minimum tap targets)
- Consistent design system
- Standard status bar / navigation / tab bar
- Moderate information density
```

---

## 8. 샤오홍슈 배치 이미지

**규격**:
- 세로형: 3:4（1080×1440px）최적
- 정방형: 1:1（1080×1080px）
- 첫 번째 이미지가 클릭률을 결정함

**핵심 디자인 요소**:
- 시각적 매력 최우선（폭포형 피드에서 경쟁）
- 소량의 텍스트 가능（화면의 20%를 초과하지 않을 것）
- 색채가 선명하지만 속되지 않음
- 라이프스타일 감각 / 질감 / 분위기감

**권장 스타일**: 12 Sagmeister / 11 Build / 20 Neo Shen / 09 Experimental Jetset

**씬 프롬프트 템플릿**:
```
[스타일 DNA 삽입]
- Social media image for Xiaohongshu (RED)
- Vertical 3:4 (1080×1440px)
- Eye-catching in waterfall feed
- Minimal text overlay (under 20% of area)
- Vivid but tasteful colors
- Lifestyle/texture/atmosphere feel
```

---

## 조합 예시

**시나리오**: 공식 계정 커버, AI 코딩 툴 소개, 전문적이지만 따뜻한 느낌 원함

**Step 1**: 스타일 선택 → 17 Takram（전문성+따뜻함）
**Step 2**: Takram 프롬프트 DNA + 공식 계정 커버 템플릿 가져오기

```
Takram Japanese speculative design:
- Elegant concept prototypes and diagrams
- Soft tech aesthetic (rounded corners, gentle shadows)
- Charts and diagrams as art pieces
- Modest sophistication
- Neutral natural colors (beige, soft gray, muted green)
- Design as philosophical inquiry

Article cover image for WeChat subscription
- Landscape format, 2.35:1 aspect ratio (1200×510px)
- Bold visual impact, minimal text
- Moderate color saturation for white reading environment
- Must remain recognizable as thumbnail
- Clean composition with clear focal point

Content: An AI coding assistant tool, showing the concept of human-AI collaboration
in software development, warm and professional atmosphere
```

---

**버전**: v1.0
**업데이트 날짜**: 2026-02-13
