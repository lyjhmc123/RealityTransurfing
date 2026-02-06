# MUI Custom Theme (SHOULD)

MUI 커스텀 테마 설정 규칙 — Intertext Magazine

## 테마 파일 관리

- 커스텀 테마는 별도의 파일로 관리한다
- 위치: `src/styles/themes/default.js`

## Typography

### 본문
- **Pretendard Variable** 버전을 웹폰트로 사용

### Headline
- **영어**: Google Font의 **Cormorant Garamond** (클래식 세리프, 심각하고 신비로운 무드)
- **한글**: Pretendard의 가장 높은 weight
- 최대 fontWeight: **700** (Cormorant Garamond는 700이 최대)

## Color

### Primary Color — Accent Gold (의식이 향하는 곳)
```jsx
primary: {
  light: '#FFD68A',
  main: '#FFC66E',   // 3800K Accent
  dark: '#E6A84E',
  contrastText: '#12100E',
}
```

### Secondary Color — Dark Surface
```jsx
secondary: {
  light: '#2A2623',
  main: '#12100E',   // Warm Black
  dark: '#0A0908',
  contrastText: '#F5F2EE',
}
```

### Magazine Semantic Colors
```jsx
theme.magazine = {
  surface: {
    dark: '#12100E',    // 변이 공간 (다크 섹션 배경)
    light: '#F5F2EE',   // 현실 세계 (라이트 섹션 배경)
    warm: '#F2E9DA',    // 라이트 보조 서피스
  },
  accent: '#FFC66E',    // 의식이 향하는 곳에만 사용
  text: {
    onDark: '#F5F2EE',
    onDarkSecondary: 'rgba(245, 242, 238, 0.6)',
    onLight: '#12100E',
    onLightSecondary: 'rgba(18, 16, 14, 0.6)',
  },
}
```

## Elevation

Paper에 기본적으로 사용되는 elevation의 box shadow 설정:

- x, y offset: 0
- opacity 값: 낮춤
- blur 값: 높임 (dimmed shadow)
- Warm Black 기반 rgba

```jsx
shadows: [
  'none',
  '0 0 12px rgba(18, 16, 14, 0.06)',
  '0 0 16px rgba(18, 16, 14, 0.08)',
  // ...
]
```

## Border Radius

인라인으로 직접 지정하지 않는 이상 모든 컴포넌트의 borderRadius는 **0**

```jsx
shape: {
  borderRadius: 0
}
```

## 테마 적용 예시

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#FFC66E' },     // Accent Gold
    secondary: { main: '#12100E' },   // Warm Black
    background: { default: '#F5F2EE' },
  },
  typography: {
    fontFamily: 'Pretendard Variable, sans-serif',
    h1: {
      fontFamily: 'Cormorant Garamond, Pretendard Variable, serif',
      fontWeight: 700,
    },
    // ...
  },
  shape: {
    borderRadius: 0,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 앱 내용 */}
    </ThemeProvider>
  );
}
```
