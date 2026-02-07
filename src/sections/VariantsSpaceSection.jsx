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
 * 2단계 스크롤로 구성:
 *   Phase 1 — 파티클이 흩어진 상태에서 구로 수렴 (스크롤 기반)
 *   Phase 2 — 구 수렴 완료 후, 타이틀이 좌측으로 밀리며 카드가 우측에서 등장
 *
 * 동작 흐름:
 * 1. 섹션이 뷰포트에 진입하면 파티클이 별처럼 흩어져 있다
 * 2. 스크롤하면 파티클이 점점 모여 구를 형성한다
 * 3. 구가 완전히 형성된 후 계속 스크롤하면 타이틀이 좌측으로 밀린다
 * 4. 6개 카드가 순서대로 우측에서 등장하며 가로 스와이프된다
 * 5. 마지막 카드를 지나면 다시 세로 스크롤로 전환된다
 *
 * Props:
 * @param {object} term - 용어 데이터 객체 { id, motif, title, description, cards, ... } [Required]
 * @param {number} index - 현재 용어의 인덱스 (0-based) [Optional]
 * @param {number} totalCount - 전체 용어 개수 [Optional]
 * @param {function} onDetailClick - '자세히 보기' 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <VariantsSpaceSection
 *   term={termData}
 *   index={0}
 *   totalCount={8}
 * />
 */
function VariantsSpaceSection({
  term,
  sx,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const scrollInfluenceRef = useRef(0);
  const [scrollDistance, setScrollDistance] = useState(0);

  const cards = term.cards || [];

  /** 트랙 너비 측정 → 가로 스크롤 거리 계산 */
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      setScrollDistance(Math.max(0, trackWidth - viewportWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [cards]);

  /** Phase 1 스크롤 높이: 구 수렴에 사용되는 스크롤 거리 (1vh) */
  const convergenceHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  /** 전체 컨테이너 높이 = 수렴 스크롤 + 뷰포트 + 가로 스크롤 거리 */
  const containerHeight = convergenceHeight + (typeof window !== 'undefined' ? window.innerHeight : 0) + scrollDistance;

  /** 전체 스크롤 진행도 추적 */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /** 수렴 비율: 전체 스크롤 중 Phase 1이 차지하는 비율 */
  const totalScrollable = containerHeight - (typeof window !== 'undefined' ? window.innerHeight : 0);
  const convergenceRatio = totalScrollable > 0 ? convergenceHeight / totalScrollable : 0;

  /** Phase 1: 스크롤 진행도 → 구 수렴 (0→1) */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (convergenceRatio > 0) {
      scrollInfluenceRef.current = Math.min(1, v / convergenceRatio);
    }
  });

  /** Phase 2: 수렴 완료 후 → 가로 이동 (0→-scrollDistance px) */
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
        {/* 가로 슬라이드 트랙 */}
        <motion.div
          ref={ trackRef }
          style={ {
            x,
            display: 'flex',
            width: 'max-content',
            height: '100%',
            alignItems: 'center',
          } }
        >
          {/* 첫 번째 슬라이드 — 타이틀 + 구 */}
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
            {/* 배경: GeometricPattern (grid) — 스크롤 기반 수렴 */}
            <Box
              sx={ {
                position: 'absolute',
                inset: 0,
                zIndex: 0,
              } }
            >
              <GeometricPattern
                variant={ term.motif }
                scrollInfluenceRef={ scrollInfluenceRef }
              />
            </Box>

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
              {/* 타이틀 — 자동 리빌 */}
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

              {/* 설명 — 자동 리빌 */}
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

          {/* 카드 슬라이드 */}
          { cards.map((card) => (
            <Box key={ card.id } sx={ { flexShrink: 0 } }>
              <VariantsSpaceCard
                motif={ card.motif }
                headline={ card.headline }
                body={ card.body }
              />
            </Box>
          )) }
        </motion.div>
      </Box>
    </Box>
  );
}

export default VariantsSpaceSection;
