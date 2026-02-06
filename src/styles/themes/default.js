/**
 * Default Theme — Intertext Magazine
 *
 * 프로젝트의 기본 디자인 토큰을 정의하는 표준 테마입니다.
 * 피그마의 Design Tokens / Variables와 동일한 역할입니다.
 *
 * ## 핵심 철학
 * - **Sharp Corners**: borderRadius 0 (날카로운 모서리)
 * - **Dimmed Shadow**: offset 없이 blur만 사용하는 은은한 그림자
 * - **Warm Tones**: 따뜻한 색온도 기반의 라이트/다크 서피스
 * - **3800K Accent**: 의식이 향하는 곳에만 사용하는 #FFC66E
 *
 * ## 매거진 컬러 스킴
 * - Light Surface: #F5F2EE (Wall Tint White)
 * - Dark Surface: #12100E (Warm Black)
 * - Accent: #FFC66E (3800K Accent)
 * - Warm Secondary: #F2E9DA (3800K White)
 */

import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

// ============================================================
// 매거진 시맨틱 컬러 (섹션 컴포넌트에서 직접 참조용)
// ============================================================
const magazine = {
  surface: {
    dark: '#12100E',      // Warm Black — 변이 공간 (다크 섹션 배경)
    light: '#F5F2EE',     // Wall Tint White — 현실 세계 (라이트 섹션 배경)
    warm: '#F2E9DA',      // 3800K White — 라이트 보조 서피스
  },
  accent: '#FFC66E',      // 3800K Accent — 의식이 향하는 곳에만 사용
  text: {
    onDark: '#F5F2EE',
    onDarkSecondary: 'rgba(245, 242, 238, 0.6)',
    onDarkDisabled: 'rgba(245, 242, 238, 0.38)',
    onLight: '#12100E',
    onLightSecondary: 'rgba(18, 16, 14, 0.6)',
  },
  particle: 'rgba(245, 242, 238, 0.15)',
};

// ============================================================
// 1. Color Tokens (색상 토큰)
// ============================================================
const palette = {
  mode: 'light',
  // 브랜드 색상 — 매거진 Accent Gold
  primary: {
    light: '#FFD68A',
    main: '#FFC66E',
    dark: '#E6A84E',
    contrastText: '#12100E',
  },
  // 다크 서피스 — Warm Black
  secondary: {
    light: '#2A2623',
    main: '#12100E',
    dark: '#0A0908',
    contrastText: '#F5F2EE',
  },

  // 상태 색상 (Feedback) — 따뜻한 톤으로 조정
  error: {
    light: '#ef5350',
    main: '#d32f2f',
    dark: '#c62828',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FFD68A',
    main: '#FFC66E',
    dark: '#E6A84E',
    contrastText: '#12100E',
  },
  success: {
    light: '#4caf50',
    main: '#2e7d32',
    dark: '#1b5e20',
    contrastText: '#FFFFFF',
  },
  info: {
    light: '#F2E9DA',
    main: '#D4C4A8',
    dark: '#B8A88E',
    contrastText: '#12100E',
  },

  // 텍스트 색상 — Warm Black 기반
  text: {
    primary: '#12100E',
    secondary: 'rgba(18, 16, 14, 0.6)',
    disabled: 'rgba(18, 16, 14, 0.38)',
  },

  // 배경 색상 — Wall Tint White
  background: {
    default: '#F5F2EE',
    paper: '#F5F2EE',
  },

  // 구분선
  divider: 'rgba(18, 16, 14, 0.12)',

  // 액션 상태
  action: {
    active: 'rgba(18, 16, 14, 0.54)',
    hover: 'rgba(18, 16, 14, 0.04)',
    selected: 'rgba(18, 16, 14, 0.08)',
    disabled: 'rgba(18, 16, 14, 0.26)',
    disabledBackground: 'rgba(18, 16, 14, 0.12)',
    focus: 'rgba(18, 16, 14, 0.12)',
  },

  // Grey 스케일
  grey: {
    50: grey[50],
    100: grey[100],
    200: grey[200],
    300: grey[300],
    400: grey[400],
    500: grey[500],
    600: grey[600],
    700: grey[700],
    800: grey[800],
    900: grey[900],
  },
};

// ============================================================
// 2. Typography Tokens (타이포그래피 토큰)
// ============================================================
// 헤딩: Cormorant Garamond — 클래식 세리프, 심각하고 신비로운 무드
// 본문: Pretendard Variable — 가독성 높은 한글/영문 산세리프
const HEADING_FONT = '"Cormorant Garamond", "Pretendard Variable", Pretendard, serif';

const typography = {
  // 기본 폰트 패밀리
  fontFamily: [
    '"Pretendard Variable"',
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    '"Helvetica Neue"',
    '"Segoe UI"',
    '"Apple SD Gothic Neo"',
    '"Noto Sans KR"',
    '"Malgun Gothic"',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    'sans-serif',
  ].join(','),

  // 헤딩 폰트 패밀리
  headingFontFamily: HEADING_FONT,

  // 폰트 크기 기준
  fontSize: 14,
  htmlFontSize: 16,

  // 폰트 굵기
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  // 헤딩 스타일 — Cormorant Garamond (심각 + 신비)
  // 극단적 사이즈 대비: h1은 압도적으로 크고, body는 절제됨
  h1: {
    fontFamily: HEADING_FONT,
    fontWeight: 700,
    fontSize: '3.5rem',      // 56px — 압도적 존재감
    lineHeight: 1.1,
    letterSpacing: '0.01em',
  },
  h2: {
    fontFamily: HEADING_FONT,
    fontWeight: 600,
    fontSize: '2.5rem',      // 40px
    lineHeight: 1.15,
    letterSpacing: '0.01em',
  },
  h3: {
    fontFamily: HEADING_FONT,
    fontWeight: 600,
    fontSize: '2rem',        // 32px
    lineHeight: 1.2,
    letterSpacing: '0.01em',
  },
  h4: {
    fontFamily: HEADING_FONT,
    fontWeight: 500,
    fontSize: '1.5rem',      // 24px
    lineHeight: 1.3,
    letterSpacing: '0.01em',
  },
  h5: {
    fontFamily: HEADING_FONT,
    fontWeight: 500,
    fontSize: '1.25rem',     // 20px
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  h6: {
    fontFamily: HEADING_FONT,
    fontWeight: 500,
    fontSize: '1.125rem',    // 18px
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },

  // 본문 스타일 — 매거진 리딩을 위한 넉넉한 행간
  body1: {
    fontSize: '1rem',        // 16px
    lineHeight: 1.8,
    letterSpacing: '0.01em',
  },
  body2: {
    fontSize: '0.875rem',    // 14px
    lineHeight: 1.7,
    letterSpacing: '0.01em',
  },

  // 부제목
  subtitle1: {
    fontSize: '1rem',        // 16px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  subtitle2: {
    fontSize: '0.875rem',    // 14px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },

  // 기타
  button: {
    fontFamily: HEADING_FONT,
    fontSize: '0.875rem',    // 14px
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: '0.75rem',     // 12px
    lineHeight: 1.5,
    letterSpacing: '0.02em',
  },
  overline: {
    fontFamily: HEADING_FONT,
    fontSize: '0.75rem',     // 12px
    fontWeight: 600,
    lineHeight: 2,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
};

// ============================================================
// 3. Spacing Token (간격 토큰)
// ============================================================
const spacing = 8; // 기본 단위: 8px

// ============================================================
// 4. Shape Token (모양 토큰)
// ============================================================
const shape = {
  borderRadius: 0, // Sharp corners (0px)
};

// ============================================================
// 5. Shadow Tokens (그림자 토큰)
// ============================================================
const customShadows = {
  none: 'none',
  sm: '0 0 12px rgba(18, 16, 14, 0.06)',
  md: '0 0 16px rgba(18, 16, 14, 0.08)',
  lg: '0 0 20px rgba(18, 16, 14, 0.10)',
  xl: '0 0 24px rgba(18, 16, 14, 0.12)',
};

// ============================================================
// 6. Breakpoints (브레이크포인트)
// ============================================================
const breakpoints = {
  values: {
    xs: 0,      // 모바일
    sm: 600,    // 태블릿 세로
    md: 900,    // 태블릿 가로
    lg: 1200,   // 데스크톱
    xl: 1536,   // 대형 데스크톱
  },
};

// ============================================================
// 7. Z-Index (레이어 순서)
// ============================================================
const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// ============================================================
// 8. Transitions (전환 효과)
// ============================================================
const transitions = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
};

// ============================================================
// 9. Component Overrides (컴포넌트 오버라이드)
// ============================================================
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: customShadows.lg,
      },
      elevation0: {
        boxShadow: customShadows.none,
      },
      elevation1: {
        boxShadow: customShadows.sm,
      },
      elevation2: {
        boxShadow: customShadows.md,
      },
      elevation3: {
        boxShadow: customShadows.lg,
      },
      elevation4: {
        boxShadow: customShadows.xl,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        textTransform: 'none',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 4,
      },
    },
  },
};

// ============================================================
// Theme 생성
// ============================================================
const defaultTheme = createTheme({
  palette,
  typography,
  spacing,
  shape,
  breakpoints,
  zIndex,
  transitions,
  components,
});

// 커스텀 속성 추가 (타입 확장 없이 접근 가능하도록)
defaultTheme.customShadows = customShadows;

// 매거진 시맨틱 컬러 토큰 — 섹션 컴포넌트에서 theme.magazine으로 접근
defaultTheme.magazine = magazine;

/**
 * 대시보드 스타일 설정 (Default)
 */
defaultTheme.dashboard = {
  style: 'default',
  iconStyle: 'outlined',
  iconWeight: 400,
  cardBorderRadius: 0,
  cardColors: [
    'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
    'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
    'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
    'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
    'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
    'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
  ],
  subCardColors: [
    'linear-gradient(to bottom, #F2E9DA 0%, #F2E9DA 100%)',
    'linear-gradient(to bottom, #F2E9DA 0%, #F2E9DA 100%)',
    'linear-gradient(to bottom, #F2E9DA 0%, #F2E9DA 100%)',
    'linear-gradient(to bottom, #F2E9DA 0%, #F2E9DA 100%)',
    'linear-gradient(to bottom, #F2E9DA 0%, #F2E9DA 100%)',
    'linear-gradient(to bottom, #F2E9DA 0%, #F2E9DA 100%)',
  ],
  textColor: palette.text.primary,
  textSecondary: palette.text.secondary,
  textShadow: '0 0 0 rgba(18, 16, 14, 0)',
  backdropFilter: 'blur(0px)',
  WebkitBackdropFilter: 'blur(0px)',
  border: '1px solid transparent',
  borderColor: 'transparent',
  shadow: customShadows.lg,
  subBorder: '1px solid rgba(18, 16, 14, 0.06)',
  subShadow: '0 0 0 rgba(18, 16, 14, 0)',
  subBackdropFilter: 'blur(0px)',
  subBorderRadius: 0,
  dividerColor: 'rgba(18, 16, 14, 0.12)',
  progressHeight: 6,
  progressTrackColor: 'rgba(18, 16, 14, 0.08)',
  progressBarColor: palette.primary.main,
  progressGradient: false,
  progressBorderRadius: 0,
  background: '#F5F2EE',
  atmosphere: 'linear-gradient(to bottom, #F5F2EE 0%, #F5F2EE 100%)',
  atmosphereOpacity: 0,
  accentColor: palette.primary.main,
  accentColors: {
    wind: '#4DB6AC',
    humidity: '#FFB74D',
    uvIndex: '#FF8A65',
    pressure: '#64B5F6',
  },
  blobs: null,
};

export default defaultTheme;

// 개별 토큰 내보내기 (문서화용)
export {
  magazine,
  palette,
  typography,
  spacing,
  shape,
  customShadows,
  breakpoints,
  zIndex,
  transitions,
  components,
};
