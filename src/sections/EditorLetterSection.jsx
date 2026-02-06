import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { FullPageSection } from '../components/layout/FullPageContainer';
import RandomRevealText from '../components/kinetic-typography/RandomRevealText';

/**
 * EditorLetterSection 컴포넌트
 *
 * 에디터 레터 섹션. 투명 배경 위에 태그·헤드라인·본문·CTA를 수직 배치한다.
 * GradientOverlay가 배경을 담당하므로 투명 배경을 사용한다.
 * 매거진 본문 진입 직전, 독자의 심리적 진입장벽을 낮추는 역할.
 *
 * 동작 흐름:
 * 1. 히어로 섹션에서 스크롤하여 이 섹션으로 전환된다
 * 2. 태그, 헤드라인, 본문이 순서대로 표시된다
 * 3. CTA 버튼 클릭 시 목차(Index) 섹션으로 이동한다
 *
 * Props:
 * @param {string} headline - 섹션 헤드라인 텍스트 [Required]
 * @param {string} bodyText - 본문 텍스트 [Required]
 * @param {string} ctaText - CTA 버튼 텍스트 [Optional, 기본값: '목차 보기']
 * @param {string} tag - 섹션 태그 라벨 [Optional]
 * @param {function} onCtaClick - CTA 버튼 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <EditorLetterSection
 *   headline="Editor's Letter"
 *   bodyText="트랜서핑을 처음 접했을 때..."
 *   ctaText="목차 보기"
 *   onCtaClick={() => scrollToSection('index')}
 * />
 */
function EditorLetterSection({
  headline,
  bodyText,
  ctaText = '목차 보기',
  tag,
  onCtaClick,
  sx,
}) {
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
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
          py: { xs: 6, md: 10 },
        } }
      >
        {/* 태그 */}
        { tag && (
          <Typography
            variant="overline"
            sx={ {
              color: '#F5F2EE',
              mb: 3,
            } }
          >
            { tag }
          </Typography>
        ) }

        {/* 헤드라인 — 다크 배경 진입 시 blur에서 나타남 */}
        <RandomRevealText
          text={ headline }
          variant="h2"
          delay={ 200 }
          stagger={ 80 }
          sx={ {
            fontWeight: 700,
            fontSize: { xs: '2.8rem', sm: '3.5rem', md: '5rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#F5F2EE',
            mb: { xs: 4, md: 6 },
            display: 'block',
          } }
        />

        {/* 본문 */}
        <Typography
          variant="body1"
          sx={ {
            maxWidth: 520,
            color: 'rgba(245, 242, 238, 0.75)',
            lineHeight: 1.9,
            whiteSpace: 'pre-line',
            fontSize: { xs: '1.05rem', md: '1.15rem' },
            wordBreak: 'keep-all',
            mb: { xs: 5, md: 8 },
          } }
        >
          { bodyText }
        </Typography>

        {/* CTA 버튼 */}
        <Box>
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
        </Box>
      </Container>
    </FullPageSection>
  );
}

export default EditorLetterSection;
