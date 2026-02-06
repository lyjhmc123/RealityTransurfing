# UX Flow (SHOULD)

## Page Flow 개요

원페이지 스크롤로 섹션을 이동하는 Flow

- **섹션**: 스크롤로 이동되는 페이지
- **모달**: 클릭 시 실행되는 페이지

## Page Structure

| 타입 | 페이지 | 설명 | 연결 |
|------|--------|------|------|
| 섹션 | Intro | 매거진 표지 | - |
| 섹션 | Editor's Letter | 에디터 레터 | - |
| 섹션 | Index | 목차 | - |
| 섹션 | Comments | 트랜서핑에 대한 말말말 | - |
| 섹션 | Terms | 트랜서핑 주요 용어 및 책 속 구절 | 카드 클릭 → ContentsDetail 모달 |
| 모달 | TermsList | 용어 전체보기 | 카드 클릭 → ContentsDetail 모달 |
| 모달 | ContentsDetail | Terms 상세 페이지 | - |
| 섹션 | Article | 직접 작성한 컨텐츠 | CTA 클릭 → ContentsDetail 모달 |
| 모달 | ContentsDetail | Article 상세 페이지 | - |
| 섹션 | Story | 트랜서핑 인터뷰 | CTA 클릭 → ContentsDetail 모달 |
| 모달 | ContentsDetail | Story 상세 페이지 | - |
| 섹션 | Survey | 트랜서핑 설문조사 | - |
| 섹션 | Outro | 마무리 인사 | - |
| 섹션 | Footer | 푸터 | - |

---

## 섹션별 상세 명세

### 0. Header

Intro 섹션에만 노출. 상단에 고정.

| 위치 | 요소 | 설명 |
|------|------|------|
| 가운데 | 타이틀 | Intertext 로고 |
| 좌상단 | 햄버거 메뉴 | 컨텐츠 꼭지 네비게이션 (항시 고정) |
| 우상단 | 댓글 아이콘 | 컨텐츠별 댓글 섹션 |

---

### 1. Intro

| 요소 | 내용 |
|------|------|
| 서브타이틀 | Intertext issue no.1 |
| 타이틀 | Reality Transurfing |
| 리드문단 | 리얼리티 트랜서핑(Reality Transurfing)은 러시아의 작가 바딤 젤란드가 제시한 현실 인식 및 자기계발 이론입니다.<br/><br/>이 이론은 현실을 단일한 결과가 아닌, 무한한 가능성의 집합으로 바라보며 개인은 그중 하나의 시나리오를 선택하며 살아간다는 관점을 제시합니다.<br/><br/>인터텍스트 매거진은 이 텍스트를 자기계발 이론이 아니라, 하나의 사유해볼 대상으로 다룹니다.<br/><br/>본 호에서는 트랜서핑의 주요 개념들이 이야기하고 있는 세계관이 무엇인지, 그리고 이 세계관을 현실에 적용했을 때 어떤 삶의 변화가 발생하는지에 주목합니다. |
| 인터랙션 | 스크롤 시 다음 섹션인 Editor's Letter 커버 이미지 로딩 |
| 헤더 가운데 | Intertext 로고 |
| 헤더 우상단 | 메뉴 햄버거버튼 |

---

### 2. Editor's Letter

| 요소 | 내용 |
|------|------|
| 커버이미지 | 점점 커지며 로딩 |
| HeadlineTitle | Editor's Letter |
| BodyText | 블라블라 |
| 인터랙션 | 스크롤 시 하단 섹션으로 이동 |
This version of Antigravity is no longer supported. Please update to receive the latest features!
| 헤더 우상단 | 메뉴 햄버거버튼 |

---

### 3. Index

| 요소 | 내용 |
|------|------|
| ItemTitle | Index |
| IndexTitle | Editor's Letter / Terms / Article / Story / Survey |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 4. Comments

트랜서핑에 대한 온라인, SNS 상에서의 말들을 카드 UI 형태로 제공하는 섹션

| 요소 | 내용 |
|------|------|
| ItemTitle | Comments |
| ItemLeadText | 블라블라 |
| ItemCard | 코멘트들이 카드 형태로 노출 |
| 카드 특성 | 옆으로 계속 흐름 / 그림 없이 텍스트만 / 클릭 불가 |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 5. Terms

트랜서핑 주요 용어들을 소개하는 섹션

| 요소 | 내용 |
|------|------|
| ItemTitle | Terms |
| ItemLeadText | 블라블라 |
| CTA | 전체보기 → TermsList 모달 실행 |
| ItemCardFeatured | 주요 용어 카드 (썸네일 + 타이틀 + 디스크립션) |
| 카드 특성 | 우측 스와이프 / 최대 5개 노출 / 클릭 시 ContentsDetail 모달 실행 |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 5-1. TermsList (모달)

Terms 섹션 '전체보기' 버튼 클릭 시 노출되는 모달

| 요소 | 내용 |
|------|------|
| ItemTitle | Terms |
| ItemLeadText | 블라블라 |
| ItemCard | 주요 용어 카드 (썸네일 + 타이틀 + 디스크립션) |
| 카드 특성 | 클릭 시 ContentsDetail 모달 실행 |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 5-2. ContentsDetail (모달)

컨텐츠 상세 페이지. 모달 형태로 실행.

| 요소 | 내용 |
|------|------|
| ContentsCover | 상단 커버 이미지 |
| ContentsBox | 텍스트 박스 컨테이너 |
| ItemTitle | Terms |
| ContentsTitle | 제목 |
| ContentsBody | 본문 |
| ContentsQuotes | 인용문 |
| 헤더 우상단 | 댓글 버튼 |

---

### 6. Article

트랜서핑과 관련하여 직접 작성한 아티클 섹션

| 요소 | 내용 |
|------|------|
| CoverImg | 전체 화면으로 로딩되는 배경 이미지 |
| Indicate | 우측 스와이프 시 다음 컨텐츠로 이동하는 인디케이터 |
| ItemTitle | Article |
| ItemHeadlineTitle | 블라블라 |
| ItemLeadText | 블라블라 |
| CTA | 보러가기 → ContentsDetail 모달 실행 |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 7. Story

트랜서핑을 삶에 적용한 사람들의 인터뷰 섹션

| 요소 | 내용 |
|------|------|
| CoverImg | 전체 화면으로 로딩되는 배경 이미지 |
| Indicate | 우측 스와이프 시 다음 컨텐츠로 이동하는 인디케이터 |
| ItemTitle | Story |
| ItemHeadlineTitle | 블라블라 |
| ItemLeadText | 블라블라 |
| CTA | 보러가기 → ContentsDetail 모달 실행 |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 8. Survey

트랜서핑과 관련된 간단한 설문조사 결과

| 요소 | 내용 |
|------|------|
| ItemTitle | Survey |
| ItemLeadText | 블라블라 |
| ItemCard | 서베이 카드 형태로 노출 |
| 카드 특성 | 옆으로 계속 흐름 / 그림 없이 텍스트만 / 클릭 불가 |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 9. Outro

마무리 인사

| 요소 | 내용 |
|------|------|
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

### 10. Footer

| 요소 | 내용 |
|------|------|
| 매거진 소개 | Intertext 매거진은 한 호에 한 컨텐츠를 깊이 있게 해석하는 텍스트 중심의 디지털 매거진입니다.<br/>텍스트를 통해 컨텐츠가 담고 있는 세계관과 철학을 읽어냅니다.<br/>텍스트 사이에서 나, 너, 우리의 존재를 다시 읽습니다. |
| Contact | Instagram @inter._text |
| 헤더 우상단 | 메뉴 햄버거버튼 플로팅 |

---

## User Journey

| 단계 | 영역 | 배경 |
|------|------|------|
| 사이트 진입 | Intro | 라이트 배경 |
| 매거진 입장 | Editor's Letter ~ Outro | 다크 배경 |
| 퇴장 | Footer | 라이트 배경 |

---

## Key Interactions

| 인터랙션 | 영역 | 동작 |
|----------|------|------|
| 스크롤 | 전체 | 스크롤 하면 한 페이지씩 앵커링 |
| 스크롤 | Comments ~ Outro | 해당 영역 진입 시 배경 다크모드로 전환 |
