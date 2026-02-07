import { useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { FullPageContainer } from '../components/layout/FullPageContainer';
import FadeTransition from '../components/motion/FadeTransition';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';

/**
 * TermFullscreenSection 컴포넌트
 *
 * 트랜서핑 용어 하나를 풀스크린(100svh) 섹션으로 보여주는 컴포넌트.
 * GeometricPattern이 배경 전체를 채우고, 하단에 텍스트가 오버레이되는 구조.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 이 섹션이 뷰포트에 진입한다
 * 2. GeometricPattern이 배경 전체에 렌더링되며 마우스 인터랙션에 반응한다
 * 3. 하단에서 순서 인디케이터, 용어 타이틀, 설명이 페이드인으로 나타난다
 * 4. '자세히 보기' 버튼을 클릭하면 onDetailClick이 호출된다
 *
 * Props:
 * @param {object} term - 용어 데이터 객체 { id, motif, title, description, body, quotes } [Required]
 * @param {number} index - 현재 용어의 인덱스 (0-based) [Required]
 * @param {number} totalCount - 전체 용어 개수 [Required]
 * @param {function} onDetailClick - '자세히 보기' 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <TermFullscreenSection
 *   term={termData}
 *   index={0}
 *   totalCount={8}
 *   onDetailClick={() => setSelectedTerm(termData)}
 * />
 */
function TermFullscreenSection({
  term,
  index,
  totalCount,
  onDetailClick,
  sx,
}) {
  const orderLabel = `${String(index + 1).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;

  /** 스크롤 기반 구 수렴 (grid variant 전용) */
  const sectionRef = useRef(null);
  const scrollInfluenceRef = useRef(0);
  const isGridVariant = term.motif === 'grid';

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;

    /** 진입: 섹션 상단이 뷰포트 하단→상단으로 이동 (0→1) */
    const enterProgress = 1 - (rect.top / vh);
    /** 퇴장: 섹션 하단이 뷰포트 하단→상단으로 이동 (1→0) */
    const leaveProgress = rect.bottom / vh;

    const raw = Math.max(0, Math.min(1, Math.min(enterProgress, leaveProgress)));
    /** ease-out: 진입 시 빠르게 수렴, 퇴장 시 자연스럽게 해체 */
    scrollInfluenceRef.current = 1 - (1 - raw) * (1 - raw);
  }, []);

  useEffect(() => {
    if (!isGridVariant) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isGridVariant, handleScroll]);

  return (
    <Box ref={ sectionRef }>
      <FullPageContainer
        heightMode="svh"
        align="end"
        sx={ {
          position: 'relative',
          overflow: 'hidden',
          ...sx,
        } }
      >
        {/* 배경: GeometricPattern (풀스크린) */}
        <Box
          sx={ {
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          } }
        >
          <GeometricPattern
            variant={ term.motif }
            scrollInfluenceRef={ isGridVariant ? scrollInfluenceRef : undefined }
          />
        </Box>

      {/* 하단 그라데이션 — 텍스트 가독성 확보 */}
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
          pointerEvents: 'none',
          pb: { xs: 6, md: 10 },
        } }
      >
        <FadeTransition
          isTriggerOnView
          direction="up"
          distance={ 32 }
          duration={ 600 }
        >
          <Box sx={ { pointerEvents: 'auto' } }>
            {/* 순서 인디케이터 */}
            <Typography
              variant="caption"
              sx={ {
                color: 'rgba(245, 242, 238, 0.5)',
                fontFamily: '"Cormorant Garamond", "Pretendard Variable", serif',
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                letterSpacing: '0.08em',
                mb: 1.5,
                display: 'block',
              } }
            >
              { orderLabel }
            </Typography>

            {/* 용어 타이틀 */}
            <Typography
              variant="h2"
              sx={ {
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#F5F2EE',
                mb: 2,
              } }
            >
              { term.title }
            </Typography>

            {/* 설명 */}
            <Typography
              variant="body1"
              sx={ {
                color: 'rgba(245, 242, 238, 0.7)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.7,
                maxWidth: 480,
                mb: 3,
                wordBreak: 'keep-all',
              } }
            >
              { term.description }
            </Typography>

            {/* CTA 버튼 */}
            <Button
              onClick={ onDetailClick }
              variant="text"
              sx={ {
                color: '#FFC66E',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                letterSpacing: '0.02em',
                px: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.8,
                },
              } }
            >
              자세히 보기 →
            </Button>
          </Box>
        </FadeTransition>
      </Container>
      </FullPageContainer>
    </Box>
  );
}

export default TermFullscreenSection;
