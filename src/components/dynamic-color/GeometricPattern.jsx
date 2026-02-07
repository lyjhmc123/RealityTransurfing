import { useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import Box from '@mui/material/Box';

/** GLSL vertex shader — 유랑(부유) ↔ 귀결(3D 구 수렴) */
const blackholeVertexShader = `
  attribute float aBaseRadius;
  attribute float aAngle;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aOpacity;
  attribute float aDepth;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

  varying float vConvergence;
  varying float vOpacity;
  varying float vDepthShade;

  void main() {
    // 개별 수렴 타이밍 (빠른 파티클 먼저 수렴 → 캐스케이드 효과)
    float delay = (1.0 - aSpeed) * 0.3;
    float blend = smoothstep(delay, delay + 0.7, uMouseInfluence);

    // === 유랑: 떠다니는 가능성 ===
    float t = uTime * aSpeed * 0.2;
    float driftX = aBaseRadius * cos(aAngle + t * 0.3)
                 + sin(t * 0.7 + aAngle * 2.3) * 0.5
                 + cos(t * 1.3 + aAngle * 4.1) * 0.15;
    float driftY = aBaseRadius * sin(aAngle + t * 0.25) * 1.2
                 + cos(t * 0.5 + aAngle * 1.7) * 0.4
                 + sin(t * 1.1 + aAngle * 3.7) * 0.12;
    float driftZ = aDepth * sin(t * 0.15 + aAngle) * 0.5;

    // === 귀결: 단단한 현실 (커서 주위 3D 구 포메이션) ===
    vec2 mouseWorld = uMouse * 3.0;
    float breathe = 1.0 + sin(uTime * 0.5) * 0.03;
    float sphereR = 1.1 * breathe;

    // 구 내부 균일 분포 (cube root → 체적 균일)
    float normR = clamp((aBaseRadius - 0.5) / 3.0, 0.0, 1.0);
    float volR = sphereR * pow(max(normR, 0.01), 0.333);

    // 구면 좌표: aDepth → cos(polar), aAngle → azimuthal
    float sinPhi = sqrt(max(0.0, 1.0 - aDepth * aDepth));
    float theta = aAngle + uTime * 0.02;

    float localX = volR * sinPhi * cos(theta);
    float localY = volR * sinPhi * sin(theta);
    float localZ = volR * aDepth;

    // Y축 기준 느린 강체 회전 → 3D 깊이감
    float rot = uTime * 0.1;
    float cR = cos(rot);
    float sR = sin(rot);
    float rxX = localX * cR - localZ * sR;
    float rxZ = localX * sR + localZ * cR;

    float hoverX = mouseWorld.x + rxX;
    float hoverY = mouseWorld.y + localY;
    float hoverZ = rxZ;

    // 깊이 기반 셰이딩 (앞면 밝고 크게, 뒷면 어둡고 작게)
    float depthNorm = clamp(hoverZ / sphereR * 0.5 + 0.5, 0.0, 1.0);

    // === 블렌딩 ===
    vec3 pos = vec3(
      mix(driftX, hoverX, blend),
      mix(driftY, hoverY, blend),
      mix(driftZ, hoverZ, blend)
    );

    vConvergence = blend;
    vDepthShade = mix(1.0, depthNorm, blend);

    // 투명도: 수렴 시 깊이 기반, 유랑 시 기본값
    float idleOpacity = aOpacity * 0.35;
    float hoverOpacity = mix(0.02, 0.25, depthNorm);
    vOpacity = mix(idleOpacity, hoverOpacity, blend);

    // 포인트 크기: 수렴 시 깊이 기반 (촘촘한 밀도), 유랑 시 기본 크기
    float perspScale = 1.0 / (1.0 + abs(pos.z) * 0.3);
    float idleSize = aSize * 0.8;
    float hoverSize = aSize * mix(0.5, 2.0, depthNorm);
    gl_PointSize = mix(idleSize, hoverSize, blend) * perspScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/** GLSL fragment shader — 수렴도 + 깊이 기반 3D 구 셰이딩 */
const blackholeFragmentShader = `
  uniform vec3 uColorStroke;
  uniform vec3 uColorAccent;

  varying float vConvergence;
  varying float vOpacity;
  varying float vDepthShade;

  void main() {
    // 원형 포인트 스프라이트 (소프트 엣지)
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float alpha = 1.0 - smoothstep(0.35, 0.5, dist);

    if (alpha < 0.01) discard;

    // 수렴도에 따라 stroke → accent(노란색)으로 그라데이션
    vec3 color = mix(uColorStroke, uColorAccent, vConvergence);

    // 3D 구 깊이감 — 앞면 밝고, 뒷면 어둡게
    color *= (0.55 + 0.45 * vDepthShade);

    // 수렴 시 파티클 중심에 미세한 글로우
    float glow = 1.0 + vConvergence * smoothstep(0.3, 0.0, dist) * 0.4;
    color *= glow;

    gl_FragColor = vec4(color, alpha * vOpacity);
  }
`;

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
 * 4. warp variant: 마우스오버 시 커서 주변 격자가 왜곡되며, 커서를 벗어나면 원래 형태로 복귀
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
 * <GeometricPattern variant="warp" />
 */
function GeometricPattern({
  variant,
  colorStroke = '#F5F2EE',
  colorAccent = '#FFC66E',
  colorBackground = '#12100E',
  sx,
}) {
  const svgRef = useRef(null);
  const targetRef = useRef({ x: 200, y: 250, influence: 0 });
  const currentRef = useRef({ x: 200, y: 250, influence: 0 });
  const rafRef = useRef(null);
  const isHoveringRef = useRef(false);
  const [warpState, setWarpState] = useState(null);

  const animate = useCallback(() => {
    const cur = currentRef.current;
    const tgt = targetRef.current;
    const posEase = isHoveringRef.current ? 0.12 : 0.06;
    const infEase = isHoveringRef.current ? 0.1 : 0.04;

    const dx = tgt.x - cur.x;
    const dy = tgt.y - cur.y;
    const di = tgt.influence - cur.influence;

    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3 || Math.abs(di) > 0.003) {
      cur.x += dx * posEase;
      cur.y += dy * posEase;
      cur.influence += di * infEase;
      setWarpState({ x: cur.x, y: cur.y, influence: cur.influence });
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cur.x = tgt.x;
      cur.y = tgt.y;
      cur.influence = tgt.influence;
      if (tgt.influence > 0.001) {
        setWarpState({ x: tgt.x, y: tgt.y, influence: tgt.influence });
      } else {
        setWarpState(null);
      }
      rafRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseMove = useCallback((e) => {
    /** grid variant는 SVG 없이 부모 Box 기준 좌표 사용 */
    const el = svgRef.current || e.currentTarget;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 500;

    targetRef.current = { x, y, influence: 1 };
    isHoveringRef.current = true;
    startAnimation();
  }, [startAnimation]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    targetRef.current = { x: 200, y: 250, influence: 0 };
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isInteractive = variant === 'warp' || variant === 'grid' || variant === 'ripple';

  const renderPattern = () => {
    switch (variant) {
    case 'ripple':
      return <RipplePattern stroke={ colorStroke } accent={ colorAccent } mouseCenter={ warpState } />;
    case 'warp':
      return <WarpPattern stroke={ colorStroke } accent={ colorAccent } warpCenter={ warpState } />;
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
      return null;
    }
  };

  /** grid variant → Three.js 캔버스 경로 */
  if (variant === 'grid') {
    return (
      <Box
        onMouseMove={ handleMouseMove }
        onMouseLeave={ handleMouseLeave }
        sx={ {
          width: '100%',
          height: '100%',
          backgroundColor: colorBackground,
          overflow: 'hidden',
          ...sx,
        } }
      >
        <BlackholeGridPattern
          colorStroke={ colorStroke }
          colorAccent={ colorAccent }
          colorBackground={ colorBackground }
          mouseCenter={ warpState }
        />
      </Box>
    );
  }

  /** 나머지 variant → 기존 SVG 경로 */
  return (
    <Box
      onMouseMove={ isInteractive ? handleMouseMove : undefined }
      onMouseLeave={ isInteractive ? handleMouseLeave : undefined }
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
        ref={ svgRef }
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

/**
 * 펜듈럼 — 6개 고정 추, 개별 마우스오버 인터랙션.
 * 특정 추에 마우스를 올리면 해당 추가 금색으로 변하며 흔들리고,
 * 결합력을 통해 양옆 추를 치는 모션이 전파된다.
 * 인접 추는 거리에 따라 노란색 그라데이션으로 물든다.
 *
 * 동작 흐름:
 * 1. 6개 추가 수직으로 고정되어 정지 상태를 유지한다
 * 2. 사용자가 특정 추 위에 마우스를 올린다
 * 3. 해당 추가 금색으로 변하며 좌우 진동을 시작한다
 * 4. 진동이 결합력으로 양옆 추에 전파된다 (치는 모션)
 * 5. 인접 추는 거리에 비례하여 노란색 그라데이션으로 점등된다
 * 6. 마우스를 벗어나면 감쇠로 자연 정지하고 초기 상태로 복귀한다
 */
function RipplePattern({ stroke, accent, mouseCenter }) {
  const COUNT = 6;
  const GAP = 56;
  const R = 24;
  const LEN = 380;
  const X0 = 200 - ((COUNT - 1) / 2) * GAP;

  /** 마우스 좌표를 ref로 유지 — rAF 루프에서 최신값 참조 */
  const mxRef = useRef(-999);
  const infRef = useRef(0);
  mxRef.current = mouseCenter?.x ?? -999;
  infRef.current = mouseCenter?.influence ?? 0;

  /** 물리 상태: 각도(angles)와 각속도(vels) */
  const physRef = useRef({
    angles: new Array(COUNT).fill(0),
    vels: new Array(COUNT).fill(0),
  });
  const [renderState, setRenderState] = useState(() => ({
    angles: new Array(COUNT).fill(0),
    hovered: -1,
  }));
  const frameRef = useRef(null);
  const runningRef = useRef(false);

  /** 시뮬레이션 루프 시작 (이미 실행 중이면 무시) */
  const startLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    const K = 0.0015;
    const COUPLE = 0.0012;
    const DAMP = 0.993;
    const PUSH = 0.003;

    const tick = () => {
      const { angles: a, vels: v } = physRef.current;
      const mx = mxRef.current;
      const inf = infRef.current;

      /** 마우스에 가장 가까운 추 판별 */
      let hovered = -1;
      if (inf > 0.3) {
        let minDist = Infinity;
        for (let i = 0; i < COUNT; i++) {
          const px = X0 + i * GAP;
          const dist = Math.abs(mx - px);
          if (dist < GAP * 0.6 && dist < minDist) {
            hovered = i;
            minDist = dist;
          }
        }
      }

      for (let i = 0; i < COUNT; i++) {
        let f = -K * a[i];
        if (i > 0) f += COUPLE * (a[i - 1] - a[i]);
        if (i < COUNT - 1) f += COUPLE * (a[i + 1] - a[i]);

        /** 호버된 추에 주기적 진동력 적용 (양옆 치는 모션) */
        if (i === hovered) {
          f += PUSH * Math.sin(performance.now() * 0.0042);
        }

        v[i] = (v[i] + f) * DAMP;
      }

      let peak = 0;
      for (let i = 0; i < COUNT; i++) {
        a[i] += v[i];
        peak = Math.max(peak, Math.abs(a[i]), Math.abs(v[i]) * 100);
      }
      setRenderState({ angles: [...a], hovered });

      /** 모든 추가 정지 + 마우스 이탈 → 슬립 */
      if (peak < 0.0005 && hovered < 0) {
        runningRef.current = false;
        a.fill(0);
        v.fill(0);
        setRenderState({ angles: new Array(COUNT).fill(0), hovered: -1 });
      } else {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, []);

  /** 마우스 진입 시 루프 시작 */
  useEffect(() => {
    if ((mouseCenter?.influence ?? 0) > 0.3) startLoop();
  }, [mouseCenter?.influence, startLoop]);

  /** 언마운트 시 정리 */
  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  /** 렌더링 */
  const { angles: renderAngles, hovered } = renderState;
  const els = [];

  for (let i = 0; i < COUNT; i++) {
    const ax = X0 + i * GAP;
    const angle = renderAngles[i];
    const bx = ax + Math.sin(angle) * LEN;
    const by = Math.cos(angle) * LEN;

    /** 색상: 호버 추 = 금색, 인접 추 = 거리 기반 노란색 그라데이션 */
    let colorWeight = 0;
    if (hovered >= 0) {
      const dist = Math.abs(i - hovered);
      colorWeight = Math.max(0, 1 - dist * 0.3);
    }
    /** 변위 기반 글로우 (파동 전파 시각화) */
    const dispGlow = Math.min(1, Math.abs(angle) / 0.05) * 0.7;
    colorWeight = Math.max(colorWeight, dispGlow);

    /** 줄 */
    els.push(
      <line
        key={ `s${i}` }
        x1={ ax } y1={ 0 }
        x2={ bx } y2={ by }
        stroke={ stroke } strokeWidth={ 0.6 } opacity={ 0.15 + colorWeight * 0.1 }
      />
    );

    /** 추 — 베이스 (stroke 색상) */
    els.push(
      <circle
        key={ `b${i}` }
        cx={ bx } cy={ by } r={ R }
        fill={ stroke } opacity={ 0.35 * (1 - colorWeight) }
      />
    );

    /** 추 — 금색 오버레이 (그라데이션) */
    if (colorWeight > 0.01) {
      els.push(
        <circle
          key={ `g${i}` }
          cx={ bx } cy={ by } r={ R }
          fill={ accent } opacity={ colorWeight * 0.9 }
        />
      );
    }
  }

  return <>{ els }</>;
}

/** 중요도 — 격자 왜곡 (공간 왜곡). 마우스오버 시 커서 주변 격자가 추가 왜곡된다 */
function WarpPattern({ stroke, accent, warpCenter }) {
  const lines = [];
  const cx = 200;
  const cy = 250;
  const gravity = 50;

  const mx = warpCenter?.x ?? cx;
  const my = warpCenter?.y ?? cy;
  const influence = warpCenter?.influence ?? 0;

  for (let i = 0; i <= 16; i++) {
    const x = i * 25;
    const distFromDefault = Math.abs(x - cx);

    /** 기본 정적 왜곡 (항상 적용) */
    const baseWarpY = gravity * Math.exp(-distFromDefault * distFromDefault / 8000);

    /** 마우스 인력 (influence에 비례하여 적용) */
    const distFromMouse = Math.abs(x - mx);
    const mouseFalloff = Math.exp(-distFromMouse * distFromMouse / 8000);
    const pullX = (mx - x) * 0.4 * mouseFalloff * influence;
    const pullY = (my - (cy + baseWarpY)) * 0.5 * mouseFalloff * influence;

    const controlX = x + pullX;
    const controlY = cy + baseWarpY + pullY;
    const opacity = 0.25 + 0.15 * mouseFalloff * influence;
    const lineWidth = 0.5 + 0.7 * mouseFalloff * influence;

    lines.push(
      <path
        key={ `v${i}` }
        d={ `M ${x} 50 Q ${controlX} ${controlY} ${x} 450` }
        fill="none"
        stroke={ stroke }
        strokeWidth={ lineWidth }
        opacity={ opacity }
      />
    );
  }

  for (let j = 0; j <= 16; j++) {
    const y = j * 30 + 40;
    const distFromDefault = Math.abs(y - cy);

    /** 기본 정적 왜곡 (항상 적용) */
    const baseWarpYOffset = gravity * 0.6 * Math.exp(-distFromDefault * distFromDefault / 6000);

    /** 마우스 인력 (influence에 비례하여 적용) */
    const distFromMouse = Math.abs(y - my);
    const mouseFalloff = Math.exp(-distFromMouse * distFromMouse / 6000);
    const pullX = (mx - cx) * 0.5 * mouseFalloff * influence;
    const pullY = (my - (y + baseWarpYOffset)) * 0.35 * mouseFalloff * influence;

    const controlX = cx + pullX;
    const controlY = y + baseWarpYOffset + pullY;
    const opacity = 0.25 + 0.15 * mouseFalloff * influence;
    const lineWidth = 0.5 + 0.7 * mouseFalloff * influence;

    lines.push(
      <path
        key={ `h${j}` }
        d={ `M 0 ${y} Q ${controlX} ${controlY} 400 ${y}` }
        fill="none"
        stroke={ stroke }
        strokeWidth={ lineWidth }
        opacity={ opacity }
      />
    );
  }

  /** accent dot — 정적 위치와 커서 위치 사이를 influence로 보간 */
  const dotX = cx + (mx - cx) * influence;
  const dotY = (cy + 20) + (my - cy - 20) * influence;
  const dotR = 3 + influence;

  return (
    <>
      { lines }
      <circle cx={ dotX } cy={ dotY } r={ dotR } fill={ accent } opacity={ 0.85 + 0.05 * influence } />
    </>
  );
}

/** 인덱스 기반 결정론적 의사난수 (0~1 범위) */
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** Hex 색상을 0-1 범위 RGB 배열로 변환 */
function hexToGLColor(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [0, 0, 0];
}

/**
 * BlackholeGridPattern — 떠다니는 가능성이 단단한 현실이 되는 인터랙션
 *
 * 동작 흐름:
 * 1. 400개 파티클이 공간 위를 자유롭게 부유한다 (유랑 — 떠다니는 가능성)
 * 2. 마우스오버 시 파티클이 커서 주위 3D 구 체적으로 수렴한다 (귀결 — 단단한 현실)
 * 3. 구면 좌표 + cube root 분포로 내부가 채워진 단단한 구를 형성한다
 * 4. Y축 강체 회전 + 깊이 기반 셰이딩(크기/밝기)으로 3D 입체감을 표현한다
 * 5. 수렴 과정에서 stroke → accent 노란색으로 그라데이션 전환된다
 * 6. 빠른 파티클부터 먼저 수렴하여 캐스케이드 효과가 발생한다
 * 7. 마우스를 벗어나면 구가 해체되며 다시 부유 상태로 복귀한다
 *
 * Props:
 * @param {string} colorStroke - 파티클 기본 색상 [Required]
 * @param {string} colorAccent - 수렴 시 노란색 강조 색상 [Required]
 * @param {string} colorBackground - 배경 색상 [Required]
 * @param {object} mouseCenter - 마우스 좌표 {x, y, influence} [Optional]
 */
function BlackholeGridPattern({ colorStroke, colorAccent, colorBackground, mouseCenter }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, influence: 0 });
  const animationIdRef = useRef(0);

  /** mouseCenter prop → ref 동기화 (rAF 루프에서 최신값 참조) */
  useEffect(() => {
    if (mouseCenter) {
      mouseRef.current = {
        x: (mouseCenter.x / 200 - 1),
        y: -(mouseCenter.y / 250 - 1),
        influence: mouseCenter.influence,
      };
    } else {
      mouseRef.current = { x: 0, y: 0, influence: 0 };
    }
  }, [mouseCenter]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const PARTICLE_COUNT = 200000;

    /** Three.js 씬 초기화 */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colorBackground);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    container.appendChild(renderer.domElement);

    /** 파티클 어트리뷰트 초기화 (seededRandom 기반 결정론적 배치) */
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const baseRadii = new Float32Array(PARTICLE_COUNT);
    const angles = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);
    const depths = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const si = i * 6;
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      baseRadii[i] = 0.5 + seededRandom(si) * 3.0;
      angles[i] = seededRandom(si + 1) * Math.PI * 2;
      speeds[i] = 0.3 + seededRandom(si + 2) * 0.7;
      sizes[i] = 1.0 + seededRandom(si + 3) * 4.0;
      opacities[i] = 0.15 + seededRandom(si + 4) * 0.55;
      depths[i] = -1.0 + seededRandom(si + 5) * 2.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aBaseRadius', new THREE.BufferAttribute(baseRadii, 1));
    geometry.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));

    /** bounding sphere 수동 설정 (vertex shader에서 위치 덮어쓰므로) */
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 10);

    /** 색상 uniform */
    const strokeRgb = hexToGLColor(colorStroke);
    const accentRgb = hexToGLColor(colorAccent);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: 0 },
      uColorStroke: { value: new THREE.Color(...strokeRgb) },
      uColorAccent: { value: new THREE.Color(...accentRgb) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: blackholeVertexShader,
      fragmentShader: blackholeFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /** ResizeObserver로 컨테이너 크기 추적 */
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          renderer.setSize(w, h);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(container);

    /** 렌더 루프 */
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      /** 마우스 uniform 이징 업데이트 */
      const m = mouseRef.current;
      const currentMouse = uniforms.uMouse.value;
      currentMouse.x += (m.x - currentMouse.x) * 0.08;
      currentMouse.y += (m.y - currentMouse.y) * 0.08;
      uniforms.uMouseInfluence.value += (m.influence - uniforms.uMouseInfluence.value) * 0.06;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    /** 리소스 정리 */
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [colorStroke, colorAccent, colorBackground]);

  return (
    <Box
      ref={ containerRef }
      sx={ {
        width: '100%',
        height: '100%',
        '& canvas': {
          display: 'block',
          width: '100% !important',
          height: '100% !important',
        },
      } }
    />
  );
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
