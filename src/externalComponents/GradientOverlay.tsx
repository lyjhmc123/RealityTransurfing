import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { COLORS } from '../constants';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScrollIn;
  uniform float uScrollOut;
  uniform vec2 uResolution;
  uniform vec3 uColorLight;
  uniform vec3 uColorDark;

  varying vec2 vUv;

  // Simplex Noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Film Grain
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // 경계 영역에서 동적으로 일렁이는 효과 - 넓고 자연스러운 곡선
    float wave = snoise(vec2(vUv.x * 0.8, uTime * 0.25)) * 0.04;
    float distortedY = vUv.y + wave;

    // Phase 1: 어두운색이 아래에서 올라옴 (Hero → Section1)
    float progressIn = uScrollIn * 1.2 + 0.15;
    float maskIn = smoothstep(progressIn - 0.2, progressIn + 0.2, distortedY);

    // Hero→Section1: 어두운색이 아래에서 올라옴
    float darkFromIn = 1.0 - maskIn;

    // Outro: 밝은색이 아래에서 올라오고, 상단 엣지는 항상 어둡게 유지
    // 상단 15%는 항상 어두운 엣지로 유지 (Hero 하단의 거울상)
    float topEdge = smoothstep(0.85, 1.0, distortedY);

    // 밝은 영역이 아래에서 위로 올라옴 (85% 지점까지만)
    float lightReach = uScrollOut * 0.85;
    float isLight = smoothstep(lightReach + 0.15, lightReach - 0.15, distortedY);

    // 최종 어두운 정도: 밝은 영역이 아니거나 상단 엣지면 어둡게
    float outroDark = 1.0 - isLight * (1.0 - topEdge);

    // 섹션에서는 darkFromIn, outro에서는 outroDark 적용
    float darkAmount = darkFromIn * (1.0 - uScrollOut + uScrollOut * outroDark);

    // 밝은색에서 어두운색으로
    vec3 color = mix(uColorLight, uColorDark, darkAmount);

    // 필름 그레인
    float grain = random(vUv * uResolution + uTime) * 0.035;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Hex to RGB (0-1 range)
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ];
  }
  return [0, 0, 0];
}

interface Props {
  outroRef?: React.RefObject<HTMLElement | null>;
}

const GradientOverlay: React.FC<Props> = ({ outroRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Colors
    const colorLight = hexToRgb(COLORS.bgLight);
    const colorDark = hexToRgb(COLORS.bgDark);

    // Uniforms
    const uniforms = {
      uTime: { value: 0 },
      uScrollIn: { value: 0 },
      uScrollOut: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColorLight: { value: new THREE.Color(...colorLight) },
      uColorDark: { value: new THREE.Color(...colorDark) }
    };

    // Material & Mesh
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Scroll handling
    let targetScrollIn = 0;
    let targetScrollOut = 0;
    let currentScrollIn = 0;
    let currentScrollOut = 0;

    const updateScrollTarget = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Hero → Section1 진행도
      targetScrollIn = Math.min(scrollY / windowHeight, 1);

      // Section3 → Outro 진행도
      if (outroRef?.current) {
        const outroRect = outroRef.current.getBoundingClientRect();
        let outroProgress = (windowHeight - outroRect.top) / windowHeight;
        targetScrollOut = Math.max(0, Math.min(1, outroProgress));
      }
    };

    // Resize handling
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation
      currentScrollIn += (targetScrollIn - currentScrollIn) * 0.06;
      currentScrollOut += (targetScrollOut - currentScrollOut) * 0.06;

      uniforms.uTime.value = elapsedTime;
      uniforms.uScrollIn.value = currentScrollIn;
      uniforms.uScrollOut.value = currentScrollOut;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [COLORS.bgLight, COLORS.bgDark, outroRef]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default GradientOverlay;
