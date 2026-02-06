import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ScrollScaleContainer } from '../components/scroll/ScrollScaleContainer';
import Placeholder from '../common/ui/Placeholder';
import RandomRevealText from '../components/kinetic-typography/RandomRevealText';

/**
 * HeroSection 컴포넌트
 *
 * 매거진 표지 역할의 전체화면 히어로 섹션.
 * 라이트 배경(Wall Tint White #F5F2EE) 위에 로고, 서브타이틀, 타이틀, 리드문을 수직 배치.
 * 하단의 커버 이미지 영역은 두 섹션 사이에 걸쳐 배치된다.
 *
 * 동작 흐름:
 * 1. 사용자가 페이지에 진입하면 100vh 크기의 표지가 표시된다
 * 2. 상단에 로고, 중앙에 서브타이틀·타이틀·리드문이 수직 정렬된다
 * 3. 하단에 스크롤 안내 텍스트가 표시된다
 * 4. 커버 이미지가 히어로와 다음 섹션 사이에 걸쳐 위치한다
 * 5. 스크롤하면 커버 이미지가 작은 상태에서 점점 확대되며 입장하는 효과가 발생한다
 *
 * Props:
 * @param {string} logo - 매거진 로고 텍스트 [Required]
 * @param {string} subtitle - 서브타이틀 텍스트 [Required]
 * @param {string} title - 메인 타이틀 텍스트 [Required]
 * @param {string} leadText - 리드 문단 텍스트 [Required]
 * @param {string} footerText - 하단 스크롤 안내 텍스트 [Optional, 기본값: 'Scroll to explore']
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <HeroSection
 *   logo="Intertext"
 *   subtitle="Intertext issue no.1"
 *   title="Reality Transurfing"
 *   leadText="리얼리티 트랜서핑은..."
 * />
 */
function HeroSection({
  logo,
  subtitle,
  title,
  leadText,
  footerText = 'Scroll to explore',
  sx,
}) {
  return (
    <Box
      sx={ {
        height: '100vh',
        position: 'relative',
        overflow: 'visible',
        backgroundColor: 'transparent',
        zIndex: 2,
        ...sx,
      } }
    >
      {/* 히어로 텍스트 영역 */}
      <Container
        maxWidth="md"
        sx={ {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 4, md: 6 },
        } }
      >
        {/* 상단: 로고 */}
        <Typography
          variant="h6"
          component="div"
          sx={ {
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#12100E',
            pt: { xs: 2, md: 4 },
          } }
        >
          { logo }
        </Typography>

        {/* 중앙: 서브타이틀 + 타이틀 + 리드문 */}
        <Box
          sx={ {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          } }
        >
          {/* 서브타이틀 */}
          <Typography
            variant="overline"
            sx={ {
              color: 'rgba(18, 16, 14, 0.5)',
              mb: 2,
            } }
          >
            { subtitle }
          </Typography>

          {/* 메인 타이틀 — 글자가 랜덤 순서로 blur에서 나타남 */}
          <RandomRevealText
            text={ title }
            variant="h1"
            delay={ 200 }
            stagger={ 60 }
            sx={ {
              fontSize: { xs: '3.5rem', sm: '4.5rem', md: '7rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#12100E',
              mb: { xs: 4, md: 6 },
              display: 'block',
            } }
          />

          {/* 리드 문단 */}
          <Typography
            variant="body1"
            sx={ {
              maxWidth: 520,
              color: 'rgba(18, 16, 14, 0.65)',
              lineHeight: 1.9,
              whiteSpace: 'pre-line',
              fontSize: { xs: '1.05rem', md: '1.15rem' },
              wordBreak: 'keep-all',
            } }
          >
            { leadText }
          </Typography>
        </Box>

        {/* 하단: 스크롤 안내 */}
        <Typography
          variant="caption"
          sx={ {
            color: 'rgba(18, 16, 14, 0.3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            pb: { xs: 2, md: 4 },
          } }
        >
          { footerText }
        </Typography>
      </Container>

      {/* 커버 이미지 — 히어로 하단에서 시작해 다음 섹션까지 걸침 */}
      {/* <Box
        sx={ {
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          mt: { xs: '-38vh', md: '-42vh' },
        } }
      >
        <Container maxWidth="md">
          <ScrollScaleContainer
            scaleFrom={ 0.8 }
            scaleTo={ 1 }
          >
            <Placeholder.Image
              ratio="16/9"
              sx={ {
                width: '100%',
                borderRadius: '40px',
              } }
            />
          </ScrollScaleContainer>
        </Container>
      </Box> */}
    </Box>
  );
}

export default HeroSection;
