import { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { motion, useScroll, useMotionValue, useMotionValueEvent, animate } from 'framer-motion';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';
import ScrollRevealText from '../components/kinetic-typography/ScrollRevealText';
import VariantsSpaceCard from './VariantsSpaceCard';
import { Indicator } from '../common/ui/Indicator';

/**
 * VariantsSpaceSection 컴포넌트
 *
 * 가능태 공간 용어의 타이틀 뷰 + 스크롤 기반 카드 캐러셀 합성 섹션.
 * 3단계로 구성:
 *   Phase 1 — 파티클이 흩어진 상태에서 구로 수렴 (스크롤)
 *   Phase 2 — 구가 다시 점들로 흩어지며 첫 카드의 키비주얼로 수렴 (스크롤)
 *   Phase 3 — 카드들이 한 장씩 스크롤로 전환 (각 카드 1vh 할당, 풀스크린 고정)
 *
 * 동작 흐름:
 * 1. 섹션이 뷰포트에 진입하면 파티클이 별처럼 흩어져 있다
 * 2. 스크롤하면 파티클이 점점 모여 구를 형성한다 (Phase 1)
 * 3. 계속 스크롤하면 구가 다시 흩어지며 타이틀이 좌측으로 밀린다 (Phase 2)
 * 4. 구의 점들이 흩어져 첫 카드의 키비주얼 영역에 재수렴한다 (Phase 2)
 * 5. 첫 카드 안착 후 스크롤을 계속하면 카드가 한 장씩 전환된다 (Phase 3)
 * 6. 모든 카드를 본 후에야 다음 섹션으로 이동 가능
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
  const stickyRef = useRef(null);
  const scrollInfluenceRef = useRef(0);
  const firstCardInfluenceRef = useRef(0);
  const firstCardVisualRef = useRef(null);
  const titlePatternRef = useRef(null);
  const firstCardContainerRef = useRef(null);

  /** Phase 3 카드 전환 추적 */
  const lastCardIdxRef = useRef(-1);
  const isInCardPhaseRef = useRef(false);
  const pointerStartRef = useRef(null);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isInCardPhase, setIsInCardPhase] = useState(false);
  const [gapWidth, setGapWidth] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth * 0.3 : 0
  );

  /** 가로 이동 모션 값 (스크롤 기반) */
  const xMotion = useMotionValue(0);

  const cards = term.cards || [];

  /** 갭 너비 리사이즈 대응 */
  useEffect(() => {
    const onResize = () => setGapWidth(window.innerWidth * 0.3);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /** Phase 1: 구 수렴 스크롤 높이 (1vh) */
  const convergenceHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0;

  /** 첫 카드 너비 (카드 뷰포트 진입 계산용) */
  const cardWidth = typeof window !== 'undefined'
    ? (window.innerWidth >= 900 ? 480 : window.innerWidth - 48)
    : 480;

  /** Phase 2 거리: 갭 + 첫 카드 너비 (첫 카드가 완전히 보일 때까지) */
  const phase2Distance = gapWidth + cardWidth;

  /** Phase 3 높이: 각 카드에 1vh 할당 (모든 카드를 봐야 다음 섹션으로 이동) */
  const cardPhaseHeight = cards.length * vh;

  /** 전체 컨테이너 높이 = Phase 1 + 뷰포트 + Phase 2 + Phase 3 */
  const containerHeight = convergenceHeight + vh + phase2Distance + cardPhaseHeight;

  /** 스크롤 가능 거리 (컨테이너 높이 - 뷰포트) */
  const totalScrollable = convergenceHeight + phase2Distance + cardPhaseHeight;

  /** 스크롤 비율 계산 */
  const convergenceRatio = totalScrollable > 0 ? convergenceHeight / totalScrollable : 0;
  const phase2EndRatio = totalScrollable > 0 ? (convergenceHeight + phase2Distance) / totalScrollable : 0;

  /** Phase 2 내부 비율 계산 */
  const phase2Range = phase2EndRatio - convergenceRatio;
  const cardEnterRatio = phase2Distance > 0
    ? convergenceRatio + (gapWidth / phase2Distance) * phase2Range
    : convergenceRatio;

  /** 첫 카드가 뷰포트에 10% 드러나는 시점 (핸드오프 기준점) */
  const card10Ratio = cardEnterRatio + (phase2EndRatio - cardEnterRatio) * 0.1;

  /** 첫 카드 슬라이드업 완료 시점 */
  const slideUpEndRatio = Math.min(phase2EndRatio, card10Ratio + (phase2EndRatio - card10Ratio) * 0.15);

  /** 첫 카드 구 정렬용 세로 오프셋 (카드 비주얼 중심 26vh → 구 중심 50vh) */
  const cardAlignOffset = typeof window !== 'undefined' ? window.innerHeight * 0.24 : 0;

  /** 카드 i의 목표 x 위치 계산 */
  const getCardTargetX = useCallback((cardIndex) => {
    return -phase2Distance - cardIndex * cardWidth;
  }, [phase2Distance, cardWidth]);

  /** 전체 스크롤 진행도 추적 */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /** Phase 1~3: 구 수렴 → 이동 + 흩어짐 → 첫 카드 안착 → 스크롤 기반 카드 전환 */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    /** 타이틀 구: 수렴 (0→1) */
    if (v <= convergenceRatio) {
      scrollInfluenceRef.current = convergenceRatio > 0 ? v / convergenceRatio : 0;
    }
    /** 타이틀 구: 흩어짐 (1→0) — 10% 진입 시점까지 */
    else if (v <= card10Ratio) {
      const t = (v - convergenceRatio) / (card10Ratio - convergenceRatio);
      scrollInfluenceRef.current = 1 - t;
    }
    /** 구 완전히 흩어짐 */
    else {
      scrollInfluenceRef.current = 0;
    }

    /** 타이틀 구 캔버스: 흩어지며 첫 카드 방향으로 이동, 10% 진입 전 페이드아웃 완료 */
    if (titlePatternRef.current) {
      if (v <= convergenceRatio) {
        titlePatternRef.current.style.transform = 'translateX(0)';
        titlePatternRef.current.style.opacity = '1';
      } else if (v <= card10Ratio) {
        const t = (v - convergenceRatio) / (card10Ratio - convergenceRatio);
        const targetX = window.innerWidth / 2 + gapWidth + cardWidth / 2;
        titlePatternRef.current.style.transform = `translateX(${t * targetX}px)`;
        /** 이동 후반(60%~100%)에서 페이드아웃 */
        titlePatternRef.current.style.opacity = t < 0.6
          ? '1'
          : `${Math.max(0, 1 - (t - 0.6) / 0.4)}`;
      } else {
        titlePatternRef.current.style.opacity = '0';
      }
    }

    /** 첫 카드 키비주얼: 10% 진입 시 흩어진 상태로 안착 */
    firstCardInfluenceRef.current = v >= card10Ratio ? 0.15 : 0;

    /** 첫 카드 비주얼: 10% 진입 시 노출 */
    if (firstCardVisualRef.current) {
      firstCardVisualRef.current.style.opacity = v >= card10Ratio ? '1' : '0';
    }

    /** 첫 카드 컨테이너: 구 정렬 → 10% 진입 후 상단으로 슬라이드업 */
    if (firstCardContainerRef.current) {
      if (v < card10Ratio) {
        firstCardContainerRef.current.style.transform = `translateY(${cardAlignOffset}px)`;
      } else if (v < slideUpEndRatio) {
        const t = (v - card10Ratio) / (slideUpEndRatio - card10Ratio);
        firstCardContainerRef.current.style.transform = `translateY(${cardAlignOffset * (1 - t)}px)`;
      } else {
        firstCardContainerRef.current.style.transform = 'translateY(0)';
      }
    }

    /** Phase 1~2: 스크롤이 x를 제어 */
    if (v <= convergenceRatio) {
      xMotion.set(0);
      lastCardIdxRef.current = -1;
    } else if (v < phase2EndRatio) {
      const progress = (v - convergenceRatio) / (phase2EndRatio - convergenceRatio);
      xMotion.set(-phase2Distance * Math.min(1, progress));
      lastCardIdxRef.current = -1;
    }
    /** Phase 3: 스크롤 기반 카드 전환 — 각 카드 1vh 할당 */
    else {
      const cardPhaseRange = 1 - phase2EndRatio;
      const cardProgress = cardPhaseRange > 0
        ? Math.min((v - phase2EndRatio) / cardPhaseRange, 1)
        : 0;
      const cardIdx = Math.min(
        Math.floor(cardProgress * cards.length),
        cards.length - 1
      );

      if (cardIdx !== lastCardIdxRef.current) {
        lastCardIdxRef.current = cardIdx;
        setActiveCardIndex(cardIdx);
        animate(xMotion, getCardTargetX(cardIdx), {
          type: 'tween',
          duration: 0.35,
          ease: 'easeOut',
        });
      }
    }

    /** 인디케이터 표시 상태 */
    const inCardPhase = v >= phase2EndRatio;
    if (inCardPhase !== isInCardPhaseRef.current) {
      isInCardPhaseRef.current = inCardPhase;
      setIsInCardPhase(inCardPhase);
    }
  });

  /** 카드로 스크롤 이동 (인디케이터 클릭 / 스와이프) */
  const scrollToCard = useCallback((cardIndex) => {
    if (!containerRef.current) return;
    const clampedIndex = Math.max(0, Math.min(cardIndex, cards.length - 1));
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const cardPhaseRange = 1 - phase2EndRatio;
    const perCardFraction = cardPhaseRange / cards.length;
    const targetProgress = phase2EndRatio + (clampedIndex + 0.5) * perCardFraction;
    const targetScroll = containerTop + targetProgress * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [phase2EndRatio, cards.length, totalScrollable]);

  /** PointerEvent 핸들러 — 가로 스와이프로 카드 전환 (스크롤 연동) */
  const handlePointerDown = useCallback((e) => {
    if (!isInCardPhaseRef.current) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    pointerStartRef.current = null;

    if (!isInCardPhaseRef.current) return;

    const SWIPE_THRESHOLD = 50;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const direction = dx < 0 ? 1 : -1;
      window.scrollBy({ top: direction * vh, behavior: 'smooth' });
    }
  }, [vh]);

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
        ref={ stickyRef }
        onPointerDown={ handlePointerDown }
        onPointerUp={ handlePointerUp }
        sx={ {
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#12100E',
          touchAction: 'pan-y',
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
          style={ {
            x: xMotion,
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
            <Box
              key={ card.id }
              ref={ cardIndex === 0 ? firstCardContainerRef : undefined }
              sx={ { flexShrink: 0 } }
            >
              <VariantsSpaceCard
                motif={ card.motif }
                headline={ card.headline }
                body={ card.body }
                bodyHighlight={ card.bodyHighlight }
                bodyHighlights={ card.bodyHighlights }
                scrollInfluenceRef={ cardIndex === 0 ? firstCardInfluenceRef : undefined }
                visualRef={ cardIndex === 0 ? firstCardVisualRef : undefined }
              />
            </Box>
          )) }
        </motion.div>

        {/* 카드 인디케이터 — 카드 Phase 시에만 표시 */}
        <Box
          sx={ {
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            opacity: isInCardPhase ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: isInCardPhase ? 'auto' : 'none',
          } }
        >
          <Indicator
            total={ cards.length }
            current={ activeCardIndex }
            variant="dot"
            size="sm"
            onClick={ (index) => scrollToCard(index) }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default VariantsSpaceSection;
