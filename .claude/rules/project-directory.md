# Project Directory Rules (MUST)

새로운 컴포넌트를 추가할 때는 아래 디렉토리 룰을 따른다.
분류 기준: Vibe Dictionary 텍소노미 v0.4 (`.claude/skills/component-work/resources/taxonomy-v0.4.md`)

## 디렉토리 구조

```
src/
  components/                   # Vibe Dictionary 텍소노미 기반 분류
    typography/                 # #1 텍스트 표현과 장식 (FitText, Title 등)
    container/                  # #2 시각적 경계와 그룹핑 (SectionContainer, RatioContainer 등)
    card/                       # #3 독립적 정보 단위 (CardContainer, CustomCard 등)
    media/                      # #4 이미지, 비디오 표시 (AspectMedia, ImageCarousel 등)
    in-page-navigation/         # #6 페이지 내 탐색 (CategoryTab 등)
    input/                      # #7 사용자 입력 (FileDropzone, SearchBar 등)
    layout/                     # #8 공간 배치와 구조 (PhiSplit, BentoGrid, PageContainer 등)
    navigation/                 # #10 페이지 간 이동 (GNB, NavMenu)
    data-display/               # #5 구조화된 데이터 시각화 (Table 등)
    overlay-feedback/           # #9 맥락적 정보 표시 (Dialog 등)
    kinetic-typography/         # #11 텍스트 애니메이션 효과 (RandomRevealText, ScrambleText 등)
    content-transition/          # #13 섹션 간 전환 (HorizontalScroll 등)
    scroll/                     # #12 스크롤 기반 효과 (VideoScrubbing, ScrollRevealText 등)
    motion/                     # #14 스토리텔링 모션 (MarqueeContainer 등)
    dynamic-color/              # #15 동적 색상 변화 (GradientOverlay 등)
    templates/                  # 다수 컴포넌트 조합 템플릿 (FilterBar 등)
    storybookDocumentation/     # Storybook 문서 유틸 (DocumentTitle, SectionTitle 등)
    *.stories.jsx               # 컴포넌트와 같은 폴더에 co-locate된 Storybook 스토리

  common/                       # 공통 유틸 컴포넌트
    ui/                         # UI 요소 (Indicator 등)

  stories/                      # 문서 전용 스토리 (컴포넌트 스토리는 src/components/ 에 co-locate)
    style/                      # 디자인 토큰 문서 (Colors, Typography, Icons 등)
    overview/                   # 프로젝트 개요 문서
    page/                       # 페이지 가이드
    template/                   # 템플릿 가이드
    test-data/                  # 테스트 데이터

  hooks/                        # 커스텀 React 훅(hook) 모음
  utils/                        # 유틸리티 함수 모음
  styles/                       # 전역 스타일 또는 테마 관련 파일
  data/                         # 데이터 파일

  assets/                       # 이미지, 폰트, 비디오 등 정적 자원

.storybook/                     # Storybook 설정
  main.js                       # Storybook 메인 설정
  preview.jsx                   # Storybook 프리뷰 설정
```

## 텍소노미 카테고리 번호 (Vibe Dictionary v0.4)

| 번호 | 카테고리 | 디렉토리 | 설명 |
|------|---------|----------|------|
| 1 | Typography | `typography/` | 텍스트 표현과 장식 |
| 2 | Container | `container/` | 시각적 경계와 그룹핑 |
| 3 | Card | `card/` | 독립적 정보 단위 |
| 4 | Media | `media/` | 이미지, 비디오 표시 |
| 5 | Data Display | `data-display/` | 구조화된 데이터 시각화 |
| 6 | In-page Navigation | `in-page-navigation/` | 페이지 내 탐색 |
| 7 | Input & Control | `input/` | 사용자 입력 |
| 8 | Layout | `layout/` | 공간 배치와 구조 |
| 9 | Overlay & Feedback | `overlay-feedback/` | 맥락적 정보 표시 |
| 10 | Navigation (Global) | `navigation/` | 페이지 간 이동 |
| 11 | KineticTypography | `kinetic-typography/` | 텍스트 애니메이션 효과 (Interactive) |
| 12 | Scroll | `scroll/` | 스크롤 기반 효과 (Interactive) |
| 13 | ContentTransition | `content-transition/` | 섹션 간 전환 (Interactive) |
| 14 | Motion | `motion/` | 스토리텔링 모션 (Interactive) |
| 15 | DynamicColor | `dynamic-color/` | 동적 색상 변화 (Interactive) |

## Storybook 카테고리 매핑

| 스토리 title prefix | 설명 |
|---------------------|------|
| `Style/` | 디자인 토큰 문서 |
| `Component/1. Typography/` | Typography 컴포넌트 |
| `Component/2. Container/` | Container 컴포넌트 |
| `Component/3. Card/` | Card 컴포넌트 |
| `Component/4. Media/` | Media 컴포넌트 |
| `Component/5. Data Display/` | Data Display 컴포넌트 |
| `Component/6. In-page Navigation/` | In-page Navigation 컴포넌트 |
| `Component/7. Input & Control/` | Input & Control 컴포넌트 |
| `Component/8. Layout/` | Layout 컴포넌트 |
| `Component/9. Overlay & Feedback/` | Overlay & Feedback 컴포넌트 |
| `Component/10. Navigation/` | Navigation 컴포넌트 |
| `Interactive/11. KineticTypography/` | 텍스트 애니메이션 인터랙티브 패턴 |
| `Interactive/12. Scroll/` | 스크롤 인터랙티브 패턴 |
| `Interactive/13. ContentTransition/` | 섹션 간 전환 인터랙티브 패턴 |
| `Interactive/14. Motion/` | 모션 인터랙티브 패턴 |
| `Interactive/15. DynamicColor/` | 동적 색상 인터랙티브 패턴 |
| `Common/` | 유틸리티 컴포넌트 |
| `Template/` | 템플릿 |
| `Page/` | 페이지 |

## 새 컴포넌트 추가 시

1. `vibe-dictionary-taxonomy-v0.4.md`에서 해당 카테고리 번호 확인
2. 해당 카테고리 디렉토리에 컴포넌트 생성
3. 스토리 파일은 컴포넌트와 같은 디렉토리에 `ComponentName.stories.jsx`로 생성
4. 스토리 title은 위 매핑 테이블의 prefix 사용
5. 카테고리 디렉토리가 없으면 새로 생성 (텍소노미 번호 참조)
