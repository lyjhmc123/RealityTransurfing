import Box from '@mui/material/Box';

/**
 * GeometricPattern 컴포넌트
 *
 * 트랜서핑 개념에 매핑된 기하학 패턴을 인라인 SVG로 렌더링한다.
 * Unsplash 이미지를 대체하는 추상적 비주얼.
 *
 * 동작 흐름:
 * 1. variant에 따라 해당 개념의 기하학 SVG 패턴이 렌더링된다
 * 2. 모노크롬 기조(#F5F2EE on #12100E)에 accent 포인트 1개(#FFC66E)
 * 3. SVG viewBox로 컨테이너에 맞게 자동 스케일된다
 *
 * Props:
 * @param {string} variant - 기하학 패턴 타입 [Required]
 *   'grid' | 'ripple' | 'warp' | 'burst' | 'flow' | 'reflect' | 'duality' | 'layers'
 * @param {string} colorStroke - 선/점 색상 [Optional, 기본값: '#F5F2EE']
 * @param {string} colorAccent - 강조 포인트 색상 [Optional, 기본값: '#FFC66E']
 * @param {string} colorBackground - 배경 색상 [Optional, 기본값: '#12100E']
 * @param {object} sx - MUI sx 스타일 [Optional]
 *
 * Example usage:
 * <GeometricPattern variant="grid" />
 * <GeometricPattern variant="ripple" colorAccent="#FFC66E" />
 */
function GeometricPattern({
  variant,
  colorStroke = '#F5F2EE',
  colorAccent = '#FFC66E',
  colorBackground = '#12100E',
  sx,
}) {
  const renderPattern = () => {
    switch (variant) {
    case 'grid':
      return <GridPattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'ripple':
      return <RipplePattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'warp':
      return <WarpPattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'burst':
      return <BurstPattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'flow':
      return <FlowPattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'reflect':
      return <ReflectPattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'duality':
      return <DualityPattern stroke={ colorStroke } accent={ colorAccent } />;
    case 'layers':
      return <LayersPattern stroke={ colorStroke } accent={ colorAccent } />;
    default:
      return <GridPattern stroke={ colorStroke } accent={ colorAccent } />;
    }
  };

  return (
    <Box
      sx={ {
        width: '100%',
        height: '100%',
        backgroundColor: colorBackground,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...sx,
      } }
    >
      <svg
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
        style={ { width: '100%', height: '100%' } }
        preserveAspectRatio="xMidYMid slice"
      >
        { renderPattern() }
      </svg>
    </Box>
  );
}

/** 변이 공간 — 원근감 있는 점 격자 (무한 섹터) */
function GridPattern({ stroke, accent }) {
  const dots = [];
  const cx = 200;
  const cy = 220;

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const x = (col - 7) * 30;
      const y = (row - 5) * 30;
      const depth = 1 + row * 0.15;
      const px = cx + x / depth;
      const py = cy + y / depth + row * 8;
      const r = Math.max(0.8, 3 - row * 0.15);
      const opacity = Math.max(0.08, 0.5 - row * 0.03);

      dots.push(
        <circle
          key={ `${row}-${col}` }
          cx={ px }
          cy={ py }
          r={ r }
          fill={ stroke }
          opacity={ opacity }
        />
      );
    }
  }

  return (
    <>
      { dots }
      <circle cx={ cx + 15 } cy={ cy + 60 } r={ 3.5 } fill={ accent } opacity={ 0.9 } />
    </>
  );
}

/** 진자 — 동심원 파동 (진동하는 에너지) */
function RipplePattern({ stroke, accent }) {
  const rings = [];
  const cx = 200;
  const cy = 250;

  for (let i = 1; i <= 12; i++) {
    const r = i * 22;
    const opacity = Math.max(0.06, 0.45 - i * 0.03);
    rings.push(
      <circle
        key={ i }
        cx={ cx }
        cy={ cy }
        r={ r }
        fill="none"
        stroke={ stroke }
        strokeWidth={ i <= 3 ? 1.2 : 0.6 }
        opacity={ opacity }
      />
    );
  }

  return (
    <>
      { rings }
      <circle cx={ cx } cy={ cy } r={ 4 } fill={ accent } opacity={ 0.9 } />
    </>
  );
}

/** 중요도 — 격자 왜곡 (공간 왜곡) */
function WarpPattern({ stroke, accent }) {
  const lines = [];
  const cx = 200;
  const cy = 250;
  const gravity = 50;

  for (let i = 0; i <= 16; i++) {
    const x = i * 25;
    const distFromCenter = Math.abs(x - cx);
    const warpY = gravity * Math.exp(-distFromCenter * distFromCenter / 8000);

    lines.push(
      <path
        key={ `v${i}` }
        d={ `M ${x} 50 Q ${x} ${cy + warpY} ${x} 450` }
        fill="none"
        stroke={ stroke }
        strokeWidth={ 0.5 }
        opacity={ 0.25 }
      />
    );
  }

  for (let j = 0; j <= 16; j++) {
    const y = j * 30 + 40;
    const distFromCenter = Math.abs(y - cy);
    const warpX = 0;
    const warpYOffset = gravity * 0.6 * Math.exp(-distFromCenter * distFromCenter / 6000);

    lines.push(
      <path
        key={ `h${j}` }
        d={ `M 0 ${y} Q ${cx + warpX} ${y + warpYOffset} 400 ${y}` }
        fill="none"
        stroke={ stroke }
        strokeWidth={ 0.5 }
        opacity={ 0.25 }
      />
    );
  }

  return (
    <>
      { lines }
      <circle cx={ cx } cy={ cy + 20 } r={ 3 } fill={ accent } opacity={ 0.85 } />
    </>
  );
}

/** 인덱스 기반 결정론적 의사난수 (0~1 범위) */
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** 과잉 잠재력 — 방사형 선 폭발 (에너지 폭발) */
function BurstPattern({ stroke, accent }) {
  const lines = [];
  const cx = 200;
  const cy = 250;
  const count = 48;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const innerR = 20 + seededRandom(i * 4) * 10;
    const outerR = 100 + seededRandom(i * 4 + 1) * 140;
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;
    const opacity = 0.1 + seededRandom(i * 4 + 2) * 0.3;
    const dashLen = 4 + seededRandom(i * 4 + 3) * 8;

    lines.push(
      <line
        key={ i }
        x1={ x1 }
        y1={ y1 }
        x2={ x2 }
        y2={ y2 }
        stroke={ stroke }
        strokeWidth={ 0.6 }
        opacity={ opacity }
        strokeDasharray={ `${dashLen} ${dashLen * 1.5}` }
      />
    );
  }

  return (
    <>
      { lines }
      <circle cx={ cx } cy={ cy } r={ 5 } fill={ accent } opacity={ 0.9 } />
      <circle cx={ cx } cy={ cy } r={ 12 } fill="none" stroke={ accent } strokeWidth={ 0.8 } opacity={ 0.3 } />
    </>
  );
}

/** 외부 의도 — 흐름선 (허용의 흐름) */
function FlowPattern({ stroke, accent }) {
  const paths = [];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const startY = 30 + i * 26;
    const cp1x = 80 + Math.sin(i * 0.7) * 40;
    const cp1y = startY + 30 + Math.cos(i * 0.5) * 20;
    const cp2x = 320 + Math.cos(i * 0.6) * 40;
    const cp2y = startY - 10 + Math.sin(i * 0.8) * 25;
    const endY = startY + Math.sin(i * 0.9) * 15;
    const opacity = 0.12 + Math.sin(i * 0.4) * 0.08 + 0.08;

    paths.push(
      <path
        key={ i }
        d={ `M -10 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 410 ${endY}` }
        fill="none"
        stroke={ stroke }
        strokeWidth={ 0.7 }
        opacity={ opacity }
      />
    );
  }

  return (
    <>
      { paths }
      <circle cx={ 330 } cy={ 260 } r={ 3.5 } fill={ accent } opacity={ 0.9 } />
    </>
  );
}

/** 거울 원칙 — 좌우 대칭 패턴 (반영) */
function ReflectPattern({ stroke, accent }) {
  const elements = [];
  const cx = 200;

  for (let row = 0; row < 12; row++) {
    for (let col = 1; col <= 6; col++) {
      const spacing = 18;
      const y = 60 + row * 35;
      const offsetX = col * spacing + Math.sin(row * 0.5) * 8;
      const r = 1.2 + Math.cos(row * col * 0.3) * 0.5;
      const opacity = 0.15 + Math.cos(row * 0.4) * 0.1;

      elements.push(
        <circle key={ `l-${row}-${col}` } cx={ cx - offsetX } cy={ y } r={ r } fill={ stroke } opacity={ opacity } />
      );
      elements.push(
        <circle key={ `r-${row}-${col}` } cx={ cx + offsetX } cy={ y } r={ r } fill={ stroke } opacity={ opacity } />
      );
    }
  }

  elements.push(
    <line key="axis" x1={ cx } y1={ 40 } x2={ cx } y2={ 460 } stroke={ stroke } strokeWidth={ 0.3 } opacity={ 0.15 } />
  );

  return (
    <>
      { elements }
      <circle cx={ cx - 36 } cy={ 250 } r={ 2.5 } fill={ accent } opacity={ 0.85 } />
      <circle cx={ cx + 36 } cy={ 250 } r={ 2.5 } fill={ accent } opacity={ 0.85 } />
    </>
  );
}

/** 영혼과 이성 — 이중 원형 (조화) */
function DualityPattern({ stroke, accent }) {
  const particles = [];
  const cx1 = 160;
  const cx2 = 240;
  const cy = 250;
  const r = 80;

  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const px1 = cx1 + Math.cos(angle) * r;
    const py1 = cy + Math.sin(angle) * r;
    const px2 = cx2 + Math.cos(angle) * r;
    const py2 = cy + Math.sin(angle) * r;

    particles.push(
      <circle key={ `a-${i}` } cx={ px1 } cy={ py1 } r={ 1 } fill={ stroke } opacity={ 0.3 } />
    );
    particles.push(
      <circle key={ `b-${i}` } cx={ px2 } cy={ py2 } r={ 1 } fill={ stroke } opacity={ 0.3 } />
    );
  }

  return (
    <>
      <circle cx={ cx1 } cy={ cy } r={ r } fill="none" stroke={ stroke } strokeWidth={ 0.6 } opacity={ 0.2 } />
      <circle cx={ cx2 } cy={ cy } r={ r } fill="none" stroke={ stroke } strokeWidth={ 0.6 } opacity={ 0.2 } />
      { particles }
      <circle cx={ 200 } cy={ cy } r={ 3 } fill={ accent } opacity={ 0.9 } />
    </>
  );
}

/** 슬라이드 — 겹쳐진 사각형 (현실의 레이어) */
function LayersPattern({ stroke, accent }) {
  const rects = [];
  const cx = 200;
  const cy = 250;
  const count = 7;

  for (let i = 0; i < count; i++) {
    const size = 260 - i * 30;
    const x = cx - size / 2;
    const y = cy - size / 2 + i * 5;
    const rotation = i * 3;
    const opacity = 0.08 + i * 0.04;

    rects.push(
      <rect
        key={ i }
        x={ x }
        y={ y }
        width={ size }
        height={ size }
        fill="none"
        stroke={ stroke }
        strokeWidth={ i === count - 1 ? 1 : 0.5 }
        opacity={ opacity }
        transform={ `rotate(${rotation} ${cx} ${cy})` }
      />
    );
  }

  return (
    <>
      { rects }
      <circle cx={ cx + 5 } cy={ cy + 10 } r={ 3 } fill={ accent } opacity={ 0.9 } />
    </>
  );
}

export default GeometricPattern;
