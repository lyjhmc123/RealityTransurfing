import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FullPageSection } from '../components/layout/FullPageContainer';

/**
 * ArticleSection 컴포넌트
 *
 * 트랜서핑 관련 아티클을 매거진 목차 스타일의 수직 스택으로 보여주는 섹션.
 * 모든 아티클이 한 화면에 번호·태그·헤드라인으로 나열되어,
 * 어떤 콘텐츠가 있는지 즉시 파악할 수 있다.
 * GradientOverlay가 배경을 담당하므로 투명 배경을 사용한다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 Article 섹션에 진입한다
 * 2. 섹션 타이틀(overline)과 전체 아티클 목록이 수직으로 표시된다
 * 3. 각 아티클 행은 번호 + 태그 + 헤드라인 + 리드문으로 구성된다
 * 4. 아티클 행 클릭 시 onCardClick 핸들러가 실행된다
 *
 * Props:
 * @param {string} sectionTitle - 섹션 타이틀 텍스트 [Required]
 * @param {Array} items - 아티클 목록 [{ id, headline, leadText, tag }] [Required]
 * @param {function} onCardClick - 아티클 클릭 핸들러 (article 객체를 인자로 전달) [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ArticleSection
 *   sectionTitle="Article"
 *   items={[
 *     { id: 'article-1', headline: '제목', leadText: '설명', tag: 'Feature' },
 *   ]}
 *   onCardClick={(article) => openModal(article)}
 * />
 */
function ArticleSection({
  sectionTitle,
  items = [],
  onCardClick,
  sx,
}) {
  if (items.length === 0) return null;

  return (
    <FullPageSection
      sx={ {
        backgroundColor: 'transparent',
        ...sx,
      } }
    >
      <Container
        maxWidth="md"
        sx={ {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 8, md: 12 },
        } }
      >
        {/* 섹션 타이틀 (overline) */}
        <Typography
          variant="overline"
          sx={ {
            color: 'rgba(245, 242, 238, 0.5)',
            mb: { xs: 4, md: 6 },
          } }
        >
          { sectionTitle }
        </Typography>

        {/* 아티클 목록 — 컨테이너 높이 n등분 */}
        <Box
          sx={ {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          } }
        >
          { items.map((article, index) => (
            <Box
              key={ article.id }
              onClick={ () => onCardClick?.(article) }
              sx={ {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: 3 },
                borderTop: '1px solid rgba(245, 242, 238, 0.12)',
                cursor: onCardClick ? 'pointer' : 'default',
                transition: 'opacity 0.2s ease',
                '&:hover': {
                  opacity: onCardClick ? 0.75 : 1,
                },
                '&:last-child': {
                  borderBottom: '1px solid rgba(245, 242, 238, 0.12)',
                },
              } }
            >
              {/* 번호 */}
              <Typography
                variant="body2"
                sx={ {
                  color: 'rgba(245, 242, 238, 0.35)',
                  fontFamily: '"Cormorant Garamond", "Pretendard Variable", serif',
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  fontWeight: 400,
                  lineHeight: { xs: 1.5, md: 1.1 },
                  minWidth: { xs: 24, md: 32 },
                  flexShrink: 0,
                  pt: { xs: 0, md: '0.15em' },
                } }
              >
                { String(index + 1).padStart(2, '0') }
              </Typography>

              {/* 태그 + 헤드라인 + 리드문 */}
              <Box sx={ { flex: 1, minWidth: 0 } }>
                {/* 태그 */}
                { article.tag && (
                  <Typography
                    variant="caption"
                    sx={ {
                      color: '#FFC66E',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontSize: '0.8rem',
                      display: 'block',
                      mb: 1,
                    } }
                  >
                    { article.tag }
                  </Typography>
                ) }

                {/* 헤드라인 */}
                <Typography
                  variant="h4"
                  component="h3"
                  sx={ {
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: '#F5F2EE',
                    mb: { xs: 0.5, md: 1 },
                  } }
                >
                  { article.headline }
                </Typography>

                {/* 리드문 */}
                { article.leadText && (
                  <Typography
                    variant="body2"
                    sx={ {
                      color: 'rgba(245, 242, 238, 0.5)',
                      fontSize: { xs: '0.95rem', md: '1.05rem' },
                      lineHeight: 1.6,
                      wordBreak: 'keep-all',
                      maxWidth: 480,
                    } }
                  >
                    { article.leadText }
                  </Typography>
                ) }
              </Box>

              {/* 화살표 아이콘 */}
              <Typography
                sx={ {
                  color: 'rgba(245, 242, 238, 0.3)',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  flexShrink: 0,
                  pt: { xs: 0, md: '0.15em' },
                  lineHeight: { xs: 1.5, md: 1.1 },
                } }
              >
                →
              </Typography>
            </Box>
          )) }
        </Box>
      </Container>
    </FullPageSection>
  );
}

export default ArticleSection;
