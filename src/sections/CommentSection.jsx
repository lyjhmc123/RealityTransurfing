import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FullPageSection } from '../components/layout/FullPageContainer';
import MarqueeContainer from '../components/motion/MarqueeContainer';

/**
 * CommentSection 컴포넌트
 *
 * 트랜서핑에 대한 온라인·SNS 상의 코멘트를 카드 형태로 보여주는 섹션.
 * 다크 배경 위에 타이틀·리드문을 표시하고,
 * MarqueeContainer로 코멘트 카드가 좌우로 끊임없이 흐른다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 Comments 섹션에 진입한다
 * 2. 섹션 타이틀과 리드 텍스트가 표시된다
 * 3. 코멘트 카드 두 줄이 반대 방향으로 무한 스크롤된다
 * 4. 카드에 마우스를 올리면 해당 줄이 일시정지된다
 * 5. 카드는 텍스트만 포함되며 클릭할 수 없다
 *
 * Props:
 * @param {string} sectionTitle - 섹션 타이틀 텍스트 [Required]
 * @param {string} leadText - 리드 텍스트 [Optional]
 * @param {Array} comments - 코멘트 목록 [{ id, text }] [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <CommentSection
 *   sectionTitle="Comments"
 *   comments={[
 *     { id: '1', text: '트랜서핑 덕분에 불안이 줄었어요.' },
 *   ]}
 * />
 */
function CommentSection({
  sectionTitle,
  leadText,
  comments = [],
  sx,
}) {
  const midpoint = Math.ceil(comments.length / 2);
  const topRow = comments.slice(0, midpoint);
  const bottomRow = comments.slice(midpoint);

  return (
    <FullPageSection
      sx={ {
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx,
      } }
    >
      {/* 타이틀 영역 */}
      <Container
        maxWidth="md"
        sx={ { mb: { xs: 4, md: 6 } } }
      >
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
            } }
          >
            { leadText }
          </Typography>
        ) }
      </Container>

      {/* 마퀴 영역 — 전체 너비 사용 */}
      <Box
        sx={ {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
        } }
      >
        {/* 상단 줄: 왼쪽으로 흐름 */}
        <MarqueeContainer speed={ 30 } direction="left" gap={ 3 }>
          { topRow.map((comment) => (
            <Box
              key={ comment.id }
              sx={ {
                backgroundColor: 'rgba(245, 242, 238, 0.06)',
                px: 3,
                py: 2.5,
                minWidth: { xs: 260, md: 320 },
                maxWidth: 400,
              } }
            >
              <Typography
                variant="body2"
                sx={ {
                  color: 'rgba(245, 242, 238, 0.75)',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.7,
                  wordBreak: 'keep-all',
                } }
              >
                { comment.text }
              </Typography>
            </Box>
          )) }
        </MarqueeContainer>

        {/* 하단 줄: 오른쪽으로 흐름 */}
        <MarqueeContainer speed={ 35 } direction="right" gap={ 3 }>
          { bottomRow.map((comment) => (
            <Box
              key={ comment.id }
              sx={ {
                backgroundColor: 'rgba(245, 242, 238, 0.06)',
                px: 3,
                py: 2.5,
                minWidth: { xs: 260, md: 320 },
                maxWidth: 400,
              } }
            >
              <Typography
                variant="body2"
                sx={ {
                  color: 'rgba(245, 242, 238, 0.75)',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  lineHeight: 1.7,
                  wordBreak: 'keep-all',
                } }
              >
                { comment.text }
              </Typography>
            </Box>
          )) }
        </MarqueeContainer>
      </Box>
    </FullPageSection>
  );
}

export default CommentSection;
