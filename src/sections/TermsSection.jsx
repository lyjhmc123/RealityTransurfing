import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { HorizontalScrollContainer } from '../components/content-transition/HorizontalScrollContainer';
import PerspectiveTransition from '../components/motion/PerspectiveTransition';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';

/**
 * TermsSection 컴포넌트
 *
 * 트랜서핑 주요 용어를 소개하는 섹션.
 * 다크 배경 위에 타이틀·리드문·CTA를 표시하고,
 * 주요 용어 카드(썸네일+타이틀+설명)를 가로 스크롤로 나열한다.
 * 각 카드는 PerspectiveTransition으로 뷰포트 진입 시 3D 회전 등장 효과를 적용한다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 Terms 섹션에 진입한다
 * 2. 섹션 타이틀, 리드 텍스트, 전체보기 CTA가 표시된다
 * 3. 계속 스크롤하면 HorizontalScrollContainer에 의해 카드가 가로로 이동한다
 * 4. 카드가 뷰포트에 진입하면 PerspectiveTransition으로 순차적으로 세워지며 등장한다
 * 5. 좌측 마진은 Container maxWidth="md"와 정렬되고, 우측은 뷰포트 끝까지 확장된다
 * 6. 카드 클릭 시 ContentsDetail 모달이 실행된다
 * 7. CTA 클릭 시 TermsList 모달이 실행된다
 *
 * Props:
 * @param {string} sectionTitle - 섹션 타이틀 텍스트 [Required]
 * @param {string} leadText - 리드 텍스트 [Optional]
 * @param {string} ctaText - CTA 버튼 텍스트 [Optional, 기본값: '전체보기']
 * @param {Array} featured - 주요 용어 카드 목록 [{ id, motif, title, description }] [Required]
 * @param {function} onCtaClick - CTA 클릭 핸들러 [Optional]
 * @param {function} onCardClick - 카드 클릭 핸들러 (id를 인자로 전달) [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <TermsSection
 *   sectionTitle="Terms"
 *   leadText="트랜서핑의 핵심 용어들을 소개합니다"
 *   featured={[
 *     { id: 'pendulum', motif: 'ripple', title: '진자', description: '...' },
 *   ]}
 *   onCardClick={(id) => openModal(id)}
 * />
 */
function TermsSection({
  sectionTitle,
  leadText,
  ctaText = '전체보기',
  featured = [],
  onCtaClick,
  onCardClick,
  sx,
}) {
  return (
    <>
      {/* 타이틀 영역 */}
      <Box
        sx={ {
          backgroundColor: 'transparent',
          pt: { xs: 8, md: 12 },
          pb: { xs: 4, md: 6 },
          ...sx,
        } }
      >
        <Container maxWidth="md">
          {/* 섹션 타이틀 */}
          <Typography
            variant="h2"
            component="h2"
            sx={ {
              fontWeight: 700,
              fontSize: { xs: '2.8rem', sm: '3.5rem', md: '5rem' },
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#F5F2EE',
              mb: 3,
            } }
          >
            { sectionTitle }
          </Typography>

          {/* 리드 텍스트 */}
          { leadText && (
            <Typography
              variant="body1"
              sx={ {
                color: 'rgba(245, 242, 238, 0.6)',
                fontSize: { xs: '1.05rem', md: '1.15rem' },
                lineHeight: 1.8,
                wordBreak: 'keep-all',
                maxWidth: 480,
                mb: 3,
              } }
            >
              { leadText }
            </Typography>
          ) }

          {/* CTA 버튼 */}
          <Button
            variant="text"
            onClick={ onCtaClick }
            sx={ {
              color: '#F5F2EE',
              letterSpacing: '0.04em',
              px: 0,
              '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8,
              },
            } }
          >
            { ctaText }
          </Button>
        </Container>
      </Box>

      {/* 카드 가로 스크롤 영역 — 좌측 마진은 Container 정렬, 우측은 뷰포트 끝까지 */}
      <HorizontalScrollContainer
        gap="32px"
        padding="max(24px, calc((100vw - 900px) / 2))"
        backgroundColor="transparent"
      >
        { featured.map((term, index) => (
          <HorizontalScrollContainer.Slide key={ term.id }>
            <PerspectiveTransition
              isTriggerOnView
              delay={ index * 120 }
              duration={ 700 }
            >
              <Box
                onClick={ () => onCardClick?.(term.id) }
                sx={ {
                  width: { xs: 320, sm: 400, md: 460 },
                  flexShrink: 0,
                  cursor: 'pointer',
                  '&:hover .geometric-pattern-wrapper': {
                    transform: 'scale(1.03)',
                  },
                } }
              >
                {/* 기하학 패턴 */}
                <Box
                  sx={ {
                    overflow: 'hidden',
                    mb: 2.5,
                  } }
                >
                  <Box
                    className="geometric-pattern-wrapper"
                    sx={ {
                      width: '100%',
                      aspectRatio: '3 / 4',
                      transition: 'transform 0.4s ease',
                    } }
                  >
                    <GeometricPattern variant={ term.motif } />
                  </Box>
                </Box>

                {/* 타이틀 */}
                <Typography
                  variant="h6"
                  sx={ {
                    fontWeight: 700,
                    color: '#F5F2EE',
                    mb: 0.5,
                  } }
                >
                  { term.title }
                </Typography>

                {/* 설명 */}
                <Typography
                  variant="body2"
                  sx={ {
                    color: 'rgba(245, 242, 238, 0.5)',
                    fontSize: '1.05rem',
                    lineHeight: 1.6,
                    wordBreak: 'keep-all',
                  } }
                >
                  { term.description }
                </Typography>
              </Box>
            </PerspectiveTransition>
          </HorizontalScrollContainer.Slide>
        )) }
      </HorizontalScrollContainer>
    </>
  );
}

export default TermsSection;
