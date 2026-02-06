# MagazinePage.jsx 분석

## 1. 스토리텔링 흐름

전시장 입장 → 감상 → 퇴장 메타포를 따르는 10단계 구조.

| 순서 | 섹션 | 배경 | 스토리텔링 역할 |
|------|------|------|----------------|
| 1 | **Intro** | 라이트 | 매거진 표지. 트랜서핑이 무엇인지 리드문으로 소개 |
| 2 | **Editor's Letter** | 다크 | 편집자의 개인적 경험으로 독자의 심리적 진입장벽을 낮춤 |
| 3 | **Index** | 다크 | 목차 제시. 앞으로 볼 콘텐츠에 대한 기대감 형성 |
| 4 | **Comments** | 다크 | 실제 독자 반응으로 사회적 증거(Social Proof) 제공 |
| 5 | **Terms** | 다크 | 핵심 용어 5개 소개 (변이공간, 진자, 중요도, 과잉잠재력, 외부의도) |
| 6 | **Article** | 다크 | 깊이 있는 아티클 3편 (Feature, Guide, Practice) |
| 7 | **Story** | 다크 | 실제 적용 사례 인터뷰 3편 (민수, 지영, 현우) |
| 8 | **Survey** | 다크 | 설문 결과로 정량적 데이터 제공 (89% 긍정적 변화 등) |
| 9 | **Outro** | 다크 | "당신의 세계에서 모든 것은 가능합니다" 메시지로 마무리 |
| 10 | **Footer** | 라이트 | 매거진 정보, 인스타그램 연결 |

**흐름 요약**: 개념 소개 → 용어 학습 → 심화 콘텐츠 → 실제 사례 → 데이터 검증 → 감성적 마무리

---

## 2. UX Flow

### 스크롤 구조

- `scrollSnapType: 'y mandatory'` — 섹션 단위 스크롤 스냅
- 각 섹션에 `scrollSnapAlign: 'start'` 적용

### 배경 전환

| 구간 | 배경 |
|------|------|
| Intro (진입) | 라이트 (`#F5F2EE`) |
| Editor's Letter ~ Outro (본문) | 다크 (`#12100E`) |
| Footer (퇴장) | 라이트 (`#F5F2EE`) |

### 모달 3종

| 모달 | 트리거 | 용도 |
|------|--------|------|
| `TermsListModal` | Terms 섹션 "전체보기" 클릭 | 용어 8개 전체 목록 (기본 5 + 추가 3) |
| `ContentsDetailModal` | Terms 카드 / Story 카드 클릭 | 용어/스토리 상세 (커버+제목+본문+인용문) |
| `ArticleDetailModal` | Article 카드 클릭 | 아티클 상세 (커버+제목+작성자+본문섹션+인용문) |

### 네비게이션

- `scrollToSection(sectionId)` — Index 항목 클릭 시 해당 섹션으로 스무스 스크롤
- Editor's Letter CTA → Index 섹션으로 이동

---

## 3. 사용된 컴포넌트

### 섹션 컴포넌트 (10개)

| 컴포넌트 | 경로 | 역할 |
|----------|------|------|
| `IntroSection` | `sections/IntroSection.jsx` | 전체화면 히어로, 로고+타이틀+리드문 |
| `EditorLetterSection` | `sections/EditorLetterSection.jsx` | 배경이미지+헤드라인+본문+CTA |
| `IndexSection` | `sections/IndexSection.jsx` | 목차 리스트, 클릭 시 앵커링 |
| `CommentsSection` | `sections/CommentsSection.jsx` | 마키 효과 텍스트 카드 |
| `TermsSection` | `sections/TermsSection.jsx` | 가로 스와이프 용어 카드 (최대 5개) |
| `ArticleSection` | `sections/ArticleSection.jsx` | 전체화면 배경+좌우 스와이프+인디케이터 |
| `StorySection` | `sections/StorySection.jsx` | 전체화면 배경+인터뷰 스와이프 |
| `SurveySection` | `sections/SurveySection.jsx` | 마키 효과 설문 카드 |
| `OutroSection` | `sections/OutroSection.jsx` | 대형 세리프 타이틀+CTA |
| `FooterSection` | `sections/FooterSection.jsx` | 로고+소개+인스타그램+저작권 |

### 모달 컴포넌트 (3개)

| 컴포넌트 | 경로 | 역할 |
|----------|------|------|
| `TermsListModal` | `sections/TermsListModal.jsx` | 용어 전체보기 (3열 그리드) |
| `ContentsDetailModal` | `sections/ContentsDetailModal.jsx` | Terms/Story 상세 |
| `ArticleDetailModal` | `sections/ArticleDetailModal.jsx` | Article 상세 |

### 외부 라이브러리

| 라이브러리 | 사용 |
|-----------|------|
| `react` (useState) | 모달 열기/닫기, 선택된 콘텐츠 상태 관리 |
| `@mui/material` (Box) | 스크롤 스냅 컨테이너 및 섹션 래퍼 |

### 상태 관리 (5개 useState)

| 상태 | 타입 | 용도 |
|------|------|------|
| `termsListOpen` | boolean | TermsListModal 표시 여부 |
| `contentsDetailOpen` | boolean | ContentsDetailModal 표시 여부 |
| `articleDetailOpen` | boolean | ArticleDetailModal 표시 여부 |
| `selectedContent` | object/null | Terms/Story 상세 데이터 |
| `selectedArticle` | object/null | Article 상세 데이터 |
