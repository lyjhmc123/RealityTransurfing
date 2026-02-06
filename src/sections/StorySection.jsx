import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FullPageSection } from '../components/layout/FullPageContainer';
import { SplitScreen } from '../components/layout/SplitScreen';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';

/**
 * StorySection 컴포넌트
 *
 * 트랜서핑을 삶에 적용한 사람들의 인터뷰를 좌우 분할 레이아웃으로 보여주는 섹션.
 * 좌측에 기하학 패턴, 우측에 전체 스토리 목록을 배치하여
 * ArticleSection(수직 스택)과 시각적으로 차별화한다.
 * GradientOverlay가 배경을 담당하므로 투명 배경을 사용한다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 Story 섹션에 진입한다
 * 2. 좌측(40%)에 첫 번째 스토리의 기하학 패턴이 풀하이트로 표시된다
 * 3. 우측(60%)에 섹션 타이틀과 전체 스토리 목록이 수직으로 나열된다
 * 4. 스토리 행에 마우스를 올리면 좌측 패턴이 해당 스토리의 motif로 전환된다
 * 5. 스토리 행 클릭 시 onCardClick 핸들러가 실행된다
 * 6. 모바일(md 미만)에서는 패턴 위 → 목록 아래로 스택된다
 *
 * Props:
 * @param {string} sectionTitle - 섹션 타이틀 텍스트 [Required]
 * @param {Array} items - 인터뷰 목록 [{ id, motif, headline, subtitle, leadText, tag }] [Required]
 * @param {function} onCardClick - 스토리 클릭 핸들러 (story 객체를 인자로 전달) [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <StorySection
 *   sectionTitle="Story"
 *   items={[
 *     { id: 'story-1', motif: 'flow', headline: '민수의 이야기', subtitle: '32세', leadText: '...' },
 *   ]}
 *   onCardClick={(story) => openModal(story)}
 * />
 */
function StorySection({
  sectionTitle,
  items = [],
  onCardClick,
  sx,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMotif = items[activeIndex]?.motif || 'flow';

  if (items.length === 0) return null;

  return (
    <FullPageSection
      sx={ {
        backgroundColor: 'transparent',
        ...sx,
      } }
    >
      <SplitScreen
        ratio="40:60"
        stackAt="md"
        isFullHeight
        left={
          /* 좌측: hover/선택된 스토리의 기하학 패턴 */
          <Box
            sx={ {
              width: '100%',
              height: { xs: 'auto', lg: '100%' },
              aspectRatio: { xs: '16 / 9', lg: 'unset' },
              overflow: 'hidden',
              position: 'relative',
            } }
          >
            <GeometricPattern
              variant={ activeMotif }
              sx={ {
                width: '100%',
                height: '100%',
                transition: 'opacity 0.4s ease',
              } }
            />
          </Box>
        }
        right={
          /* 우측: 섹션 타이틀 + 스토리 목록 */
          <Box
            sx={ {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              px: { xs: 3, md: 6, lg: 8 },
              py: { xs: 4, md: 6 },
            } }
          >
            {/* 섹션 타이틀 */}
            <Typography
              variant="overline"
              sx={ {
                color: 'rgba(245, 242, 238, 0.5)',
                mb: { xs: 3, md: 5 },
              } }
            >
              { sectionTitle }
            </Typography>

            {/* 스토리 목록 — 컨테이너 높이 n등분 */}
            <Box
              sx={ {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              } }
            >
              { items.map((story, index) => (
                <Box
                  key={ story.id }
                  onMouseEnter={ () => setActiveIndex(index) }
                  onClick={ () => onCardClick?.(story) }
                  sx={ {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderTop: '1px solid rgba(245, 242, 238, 0.1)',
                    cursor: onCardClick ? 'pointer' : 'default',
                    transition: 'opacity 0.2s ease',
                    opacity: activeIndex === index ? 1 : 0.55,
                    '&:hover': {
                      opacity: 1,
                    },
                    '&:last-child': {
                      borderBottom: '1px solid rgba(245, 242, 238, 0.1)',
                    },
                  } }
                >
                  {/* 태그 */}
                  { story.tag && (
                    <Typography
                      variant="caption"
                      sx={ {
                        color: '#FFC66E',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        display: 'block',
                        mb: 0.5,
                      } }
                    >
                      { story.tag }
                    </Typography>
                  ) }

                  {/* 헤드라인 + 화살표 */}
                  <Box
                    sx={ {
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 2,
                      mb: 0.5,
                    } }
                  >
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={ {
                        fontWeight: 700,
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        color: '#F5F2EE',
                      } }
                    >
                      { story.headline }
                    </Typography>
                    <Typography
                      sx={ {
                        color: 'rgba(245, 242, 238, 0.3)',
                        fontSize: '1.1rem',
                        flexShrink: 0,
                      } }
                    >
                      →
                    </Typography>
                  </Box>

                  {/* 서브타이틀 */}
                  { story.subtitle && (
                    <Typography
                      variant="body2"
                      sx={ {
                        color: 'rgba(245, 242, 238, 0.4)',
                        fontSize: '0.95rem',
                        letterSpacing: '0.02em',
                        mb: 1,
                      } }
                    >
                      { story.subtitle }
                    </Typography>
                  ) }

                  {/* 리드문 */}
                  { story.leadText && (
                    <Typography
                      variant="body2"
                      sx={ {
                        color: 'rgba(245, 242, 238, 0.45)',
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        lineHeight: 1.6,
                        wordBreak: 'keep-all',
                        maxWidth: 420,
                      } }
                    >
                      { story.leadText }
                    </Typography>
                  ) }
                </Box>
              )) }
            </Box>
          </Box>
        }
      />
    </FullPageSection>
  );
}

export default StorySection;
