import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

/**
 * FooterSection 컴포넌트
 *
 * 매거진 하단 푸터. 라이트 배경으로 전환되며,
 * 매거진 소개, 인스타그램 링크, 저작권 정보를 표시한다.
 *
 * 동작 흐름:
 * 1. 사용자가 Outro 섹션을 지나 Footer에 도달한다
 * 2. 다크 배경에서 라이트 배경으로 전환된다
 * 3. 매거진 로고, 소개 텍스트, 인스타그램 링크, 저작권이 표시된다
 *
 * Props:
 * @param {string} logo - 매거진 로고 텍스트 [Required]
 * @param {string} description - 매거진 소개 텍스트 [Optional]
 * @param {string} instagramHandle - 인스타그램 핸들 [Optional]
 * @param {string} instagramUrl - 인스타그램 URL [Optional]
 * @param {string} copyright - 저작권 텍스트 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <FooterSection
 *   logo="Intertext"
 *   description="한 호에 한 컨텐츠를 깊이 있게 해석하는 매거진"
 *   instagramHandle="@inter._text"
 *   instagramUrl="https://instagram.com/inter._text"
 *   copyright="© 2024 Intertext Magazine."
 * />
 */
function FooterSection({
  logo,
  description,
  instagramHandle,
  instagramUrl,
  copyright,
  sx,
}) {
  return (
    <Box
      component="footer"
      sx={ {
        backgroundColor: '#F5F2EE',
        position: 'relative',
        zIndex: 2,
        py: { xs: 8, md: 12 },
        ...sx,
      } }
    >
      <Container maxWidth="md">
        {/* 로고 */}
        <Typography
          variant="h5"
          sx={ {
            fontWeight: 700,
            color: '#12100E',
            mb: 3,
          } }
        >
          { logo }
        </Typography>

        {/* 매거진 소개 */}
        { description && (
          <Typography
            variant="body2"
            sx={ {
              color: 'rgba(18, 16, 14, 0.6)',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.8,
              wordBreak: 'keep-all',
              maxWidth: 480,
              mb: 4,
            } }
          >
            { description }
          </Typography>
        ) }

        {/* 인스타그램 */}
        { instagramHandle && (
          <Box sx={ { mb: 4 } }>
            <Typography
              variant="caption"
              sx={ {
                color: 'rgba(18, 16, 14, 0.4)',
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.5,
              } }
            >
              Contact
            </Typography>
            <Typography
              component="a"
              href={ instagramUrl }
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
              sx={ {
                color: '#12100E',
                fontSize: '1.05rem',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { opacity: 0.6 },
              } }
            >
              Instagram { instagramHandle }
            </Typography>
          </Box>
        ) }

        {/* 저작권 */}
        { copyright && (
          <Typography
            variant="caption"
            sx={ {
              color: 'rgba(18, 16, 14, 0.35)',
              fontSize: '0.8rem',
            } }
          >
            { copyright }
          </Typography>
        ) }
      </Container>
    </Box>
  );
}

export default FooterSection;
