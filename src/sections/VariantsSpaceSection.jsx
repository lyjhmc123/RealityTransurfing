import { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';
import ScrollRevealText from '../components/kinetic-typography/ScrollRevealText';
import VariantsSpaceCard from './VariantsSpaceCard';

/**
 * VariantsSpaceSection 컴포넌트
 *
 * 가능태 공간 용어의 타이틀 뷰 + 가로 스크롤 카드 합성 섹션.
 * 3단계 스크롤로 구성:
 *   Phase 1 — 파티클이 흩어진 상태에서 구로 수렴
 *   Phase 2 — 구가 다시 점들로 흩어지며 첫 카드의 키비주얼로 수렴
 *   Phase 3 — 카드들이 가로로 스와이프
 *
 * 동작 흐름:
 * 1. 섹션이 뷰포트에 진입하면 파티클이 별처럼 흩어져 있다
 * 2. 스크롤하면 파티클이 점점 모여 구를 형성한다 (Phase 1)
 * 3. 계속 스크롤하면 구가 다시 흩어지며 타이틀이 좌측으로 밀린다 (Phase 2)
 * 4. 구의 점들이 흩어져 첫 카드의 키비주얼 영역에 재수렴한다 (Phase 2)
 * 5. 나머지 카드들이 가로로 스와이프된다 (Phase 3)
 *
 * Props:
 * @param {object} term - 용어 데이터 객체 { id, motif, title, description, cards, ... } [Required]
 * @param {number} index - 현재 용어의 인덱스 (0-based) [Optional]
 * @param {number} totalCount - 전체 용어 개수 [Optional]
 * @param {function} onDetailClick - '자세히 보기' 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <VariantsSpaceSection term={termData} index={0} totalCount={8} />
 */
function VariantsSpaceSection({
  term,
  sx,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const scrollInfluenceRef = useRef(0);
  const firstCardInfluenceRef = useRef(0);
  const firstCardVisualRef = useRef(null);
  const titlePatternRef = useRef(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [gapWidth, setGapWidth] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth * 0.3 : 0
  );

  const cards = term.cards || [];

  /** 갭 너비 리사이즈 대응 */
  useEffect(() => {
    const onResize = () => setGapWidth(window.innerWidth * 0.3);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /** 트랙 너비 측정 — gapWidth가 DOM에 반영된 후 측정 */
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      setScrollDistance(Math.max(0, trackWidth - window.innerWidth));
    };
    const id = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', measure);
    };
  }, [cards, gapWidth]);

  /** Phase 1: 구 수렴 스크롤 높이 (1vh) */
  const convergenceHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  /** 첫 카드 너비 (카드 뷰포트 진입 계산용) */
  const cardWidth = typeof window !== 'undefined'
    ? (window.innerWidth >= 900 ? 480 : window.innerWidth - 48)
    : 480;

  /** 전체 컨테이너 높이 = 수렴 높이 + 뷰포트 + 가로 스크롤 거리 */
  const containerHeight = convergenceHeight + (typeof window !== 'undefined' ? window.innerHeight : 0) + scrollDistance;

  /** 전체 스크롤 진행도 추적 */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /** 스크롤 비율 계산 — 가로 스크롤 위치 기반 */
  const totalScrollable = convergenceHeight + scrollDistance;
  const convergenceRatio = totalScrollable > 0 ? convergenceHeight / totalScrollable : 0;

  /** 첫 카드가 뷰포트에 진입하기 시작하는 시점 (x = -gapWidth) */
  const cardEnterRatio = scrollDistance > 0
    ? convergenceRatio + (gapWidth / scrollDistance) * (1 - convergenceRatio)
    : convergenceRatio;

  /** 첫 카드가 뷰포트에 완전히 들어오는 시점 (x = -(gapWidth + cardWidth)) */
  const cardFullRatio = scrollDistance > 0
    ? convergenceRatio + ((gapWidth + cardWidth) / scrollDistance) * (1 - convergenceRatio)
    : convergenceRatio;

  /** Phase 1~2: 구 수렴 → 이동 + 흩어짐 → 첫 카드 수렴 */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    /** 타이틀 구: 수렴 (0→1) */
    if (v <= convergenceRatio) {
      scrollInfluenceRef.current = convergenceRatio > 0 ? v / convergenceRatio : 0;
    }
    /** 타이틀 구: 흩어짐 (1→0) — 첫 카드 완전 노출 시점까지 */
    else if (v <= cardFullRatio) {
      const t = (v - convergenceRatio) / (cardFullRatio - convergenceRatio);
      scrollInfluenceRef.current = 1 - t;
    }
    /** 구 완전히 흩어짐 */
    else {
      scrollInfluenceRef.current = 0;
    }

    /** 타이틀 구 캔버스: 흩어지며 첫 카드 방향으로 이동 (CSS translateX) */
    if (titlePatternRef.current) {
      if (v <= convergenceRatio) {
        titlePatternRef.current.style.transform = 'translateX(0)';
        titlePatternRef.current.style.opacity = '1';
      } else if (v <= cardFullRatio) {
        const t = (v - convergenceRatio) / (cardFullRatio - convergenceRatio);
        const targetX = window.innerWidth / 2 + gapWidth + cardWidth / 2;
        titlePatternRef.current.style.transform = `translateX(${t * targetX}px)`;
        titlePatternRef.current.style.opacity = `${Math.max(0, 1 - t * 1.5)}`;
      } else {
        titlePatternRef.current.style.opacity = '0';
      }
    }

    /** 첫 카드 키비주얼: 흩어진 상태로 안착 (0→0.15) */
    if (v < cardEnterRatio) {
      firstCardInfluenceRef.current = 0;
    } else if (v < cardFullRatio) {
      const t = (v - cardEnterRatio) / (cardFullRatio - cardEnterRatio);
      firstCardInfluenceRef.current = t * 0.15;
    } else {
      firstCardInfluenceRef.current = 0.15;
    }

    /** 첫 카드 비주얼: 카드 진입 시 서서히 노출 */
    if (firstCardVisualRef.current) {
      if (v < cardEnterRatio) {
        firstCardVisualRef.current.style.opacity = '0';
      } else if (v < cardFullRatio) {
        const t = (v - cardEnterRatio) / (cardFullRatio - cardEnterRatio);
        firstCardVisualRef.current.style.opacity = `${t}`;
      } else {
        firstCardVisualRef.current.style.opacity = '1';
      }
    }
  });

  /** 수렴 완료 후 가로 이동 */
  const x = useTransform(
    scrollYProgress,
    [convergenceRatio, 1],
    [0, -scrollDistance],
    { clamp: true }
  );

  return (
    <Box
      ref={ containerRef }
      sx={ {
        height: containerHeight,
        position: 'relative',
        ...sx,
      } }
    >
      {/* Sticky 뷰포트 — 화면에 고정 */}
      <Box
        sx={ {
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#12100E',
        } }
      >
        {/* 타이틀 구 — sticky 레벨 오버레이 (트랙 밖에서 자유 이동) */}
        <Box
          ref={ titlePatternRef }
          sx={ {
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          } }
        >
          <GeometricPattern
            variant={ term.motif }
            scrollInfluenceRef={ scrollInfluenceRef }
          />
        </Box>

        {/* 가로 슬라이드 트랙 */}
        <motion.div
          ref={ trackRef }
          style={ {
            x,
            display: 'flex',
            width: 'max-content',
            height: '100%',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          } }
        >
          {/* 첫 번째 슬라이드 — 타이틀 */}
          <Box
            sx={ {
              width: '100vw',
              height: '100vh',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-end',
              flexShrink: 0,
            } }
          >
            {/* 하단 그라데이션 */}
            <Box
              sx={ {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(18, 16, 14, 0.85), transparent)',
                zIndex: 0,
                pointerEvents: 'none',
              } }
            />

            {/* 텍스트 오버레이 */}
            <Container
              maxWidth="md"
              sx={ {
                position: 'relative',
                zIndex: 1,
                pb: { xs: 6, md: 10 },
              } }
            >
              <ScrollRevealText
                text={ term.title }
                variant="h2"
                activeColor="#F5F2EE"
                inactiveColor="rgba(245, 242, 238, 0.1)"
                autoReveal
                autoRevealDuration={ 1200 }
                sx={ {
                  '& .MuiTypography-root': {
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    mb: 2,
                  },
                } }
              />
              <ScrollRevealText
                text={ term.description }
                variant="body1"
                activeColor="rgba(245, 242, 238, 0.7)"
                inactiveColor="rgba(245, 242, 238, 0.1)"
                autoReveal
                autoRevealDuration={ 2000 }
                sx={ {
                  '& .MuiTypography-root': {
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.7,
                    maxWidth: 480,
                    mb: 0,
                  },
                } }
              />
            </Container>
          </Box>

          {/* 갭 스페이서 — 구 흩어짐 → 첫 카드 재수렴 전이 공간 */}
          <Box sx={ { width: gapWidth, flexShrink: 0 } } />

          {/* 카드 슬라이드 */}
          { cards.map((card, cardIndex) => (
            <Box key={ card.id } sx={ { flexShrink: 0 } }>
              <VariantsSpaceCard
                motif={ card.motif }
                headline={ card.headline }
                body={ card.body }
                scrollInfluenceRef={ cardIndex === 0 ? firstCardInfluenceRef : undefined }
                visualRef={ cardIndex === 0 ? firstCardVisualRef : undefined }
              />
            </Box>
          )) }
        </motion.div>
      </Box>
    </Box>
  );
}

export default VariantsSpaceSection;
