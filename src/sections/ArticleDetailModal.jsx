import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';
import RandomRevealText from '../components/kinetic-typography/RandomRevealText';

/**
 * 아티클 ID에 따른 기하학 패턴 variant 매핑
 */
const ARTICLE_MOTIF_MAP = {
  'article-1': 'grid',
  'article-2': 'ripple',
  'article-3': 'layers',
};

/**
 * 섹션 구분 장식 — 좌우 라인 + 중앙 텍스트
 * 레퍼런스의 "——— Authors ———" 패턴
 */
function SectionDivider({ label }) {
  return (
    <Box
      sx={ {
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        my: { xs: 6, md: 8 },
      } }
    >
      <Box sx={ { flex: 1, height: '1px', backgroundColor: 'rgba(245, 242, 238, 0.12)' } } />
      <Typography
        variant="body2"
        sx={ {
          fontFamily: '"Cormorant Garamond", "Pretendard Variable", serif',
          fontStyle: 'italic',
          fontSize: { xs: '1.05rem', md: '1.2rem' },
          color: 'rgba(245, 242, 238, 0.5)',
          flexShrink: 0,
          letterSpacing: '0.04em',
        } }
      >
        { label }
      </Typography>
      <Box sx={ { flex: 1, height: '1px', backgroundColor: 'rgba(245, 242, 238, 0.12)' } } />
    </Box>
  );
}

/**
 * ArticleDetailModal 컴포넌트
 *
 * 아티클 상세 콘텐츠를 풀스크린 에디토리얼 레이아웃 모달로 보여주는 컴포넌트.
 * 상단은 2단 히어로(좌측 비주얼 + 우측 헤더), 하단은 단일 칼럼 본문 구조.
 * 매거진 리딩 경험을 제공하기 위한 텍스트 중심의 에디토리얼 레이아웃.
 *
 * 동작 흐름:
 * 1. ArticleSection에서 아티클 행을 클릭하면 이 모달이 열린다
 * 2. 히어로 영역에 좌측 기하학 패턴 비주얼 + 우측 태그/헤드라인/작성자가 표시된다
 * 3. 스크롤하면 본문(body)이 이어서 표시된다
 * 4. 각 섹션(sections)이 장식 구분자 + 소제목 + 내용으로 나열된다
 * 5. 하단에 인용문(quotes)이 장식 구분자와 함께 표시된다
 * 6. 우상단 닫기 버튼 클릭 시 모달이 닫힌다
 *
 * Props:
 * @param {boolean} isOpen - 모달 열림 여부 [Required]
 * @param {function} onClose - 모달 닫기 핸들러 [Required]
 * @param {object} article - 아티클 데이터 객체 [Optional]
 *   { id, headline, leadText, tag, author, date, body, sections, quotes }
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <ArticleDetailModal
 *   isOpen={true}
 *   onClose={() => setOpen(false)}
 *   article={articleData}
 * />
 */
function ArticleDetailModal({
  isOpen,
  onClose,
  article,
  sx,
}) {
  if (!article) return null;

  const motif = ARTICLE_MOTIF_MAP[article.id] || 'grid';

  return (
    <Dialog
      open={ isOpen }
      onClose={ onClose }
      fullScreen
      PaperProps={ {
        sx: {
          backgroundColor: '#12100E',
          backgroundImage: 'none',
          ...sx,
        },
      } }
    >
      {/* 닫기 버튼 — 고정 */}
      <IconButton
        onClick={ onClose }
        aria-label="닫기"
        sx={ {
          position: 'fixed',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 32 },
          zIndex: 10,
          color: '#F5F2EE',
          fontSize: '1.2rem',
          '&:hover': {
            backgroundColor: 'rgba(245, 242, 238, 0.08)',
          },
        } }
      >
        ✕
      </IconButton>

      {/* 스크롤 영역 */}
      <Box
        sx={ {
          overflowY: 'auto',
          height: '100%',
        } }
      >
        {/* ── 히어로 영역: 2단 레이아웃 ── */}
        <Container
          maxWidth="lg"
          sx={ {
            pt: { xs: 10, md: 14 },
            pb: { xs: 4, md: 6 },
          } }
        >
          <Box
            sx={ {
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, md: 8 },
              alignItems: { md: 'center' },
              minHeight: { md: '55vh' },
            } }
          >
            {/* 좌측: 기하학 패턴 비주얼 */}
            <Box
              sx={ {
                flex: { md: '0 0 42%' },
                aspectRatio: { xs: '4 / 3', md: '3 / 4' },
                maxHeight: { xs: 280, md: 'none' },
                overflow: 'hidden',
              } }
            >
              <GeometricPattern variant={ motif } />
            </Box>

            {/* 우측: 헤더 정보 */}
            <Box
              sx={ {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              } }
            >
              {/* 헤드라인 — 모달 진입 시 blur에서 나타남 */}
              <RandomRevealText
                key={ article.id }
                text={ article.headline }
                variant="h2"
                delay={ 200 }
                stagger={ 50 }
                sx={ {
                  fontWeight: 700,
                  fontSize: { xs: '3rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: '#F5F2EE',
                  mb: 2,
                  display: 'block',
                } }
              />

              {/* 작성자/날짜 — 이탤릭 세리프 */}
              { (article.author || article.date) && (
                <Typography
                  variant="body1"
                  sx={ {
                    fontFamily: '"Cormorant Garamond", "Pretendard Variable", serif',
                    fontStyle: 'italic',
                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                    color: 'rgba(245, 242, 238, 0.55)',
                    mb: 3,
                  } }
                >
                  { [article.author, article.date].filter(Boolean).join(' · ') }
                </Typography>
              ) }

              {/* 태그 — 아웃라인 뱃지 */}
              { article.tag && (
                <Box sx={ { mb: 4 } }>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={ {
                      display: 'inline-block',
                      border: '1px solid rgba(245, 242, 238, 0.25)',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      color: 'rgba(245, 242, 238, 0.6)',
                    } }
                  >
                    { article.tag }
                  </Typography>
                </Box>
              ) }

              {/* 리드문 */}
              { article.body && (
                <Typography
                  variant="body1"
                  sx={ {
                    color: 'rgba(245, 242, 238, 0.7)',
                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                    lineHeight: 1.9,
                    wordBreak: 'keep-all',
                    maxWidth: 520,
                  } }
                >
                  { article.body }
                </Typography>
              ) }
            </Box>
          </Box>
        </Container>

        {/* ── 본문 섹션들 — 단일 칼럼 ── */}
        { article.sections?.length > 0 && (
          <Container maxWidth="sm">
            { article.sections.map((section, index) => (
              <Box key={ index }>
                <SectionDivider label={ section.heading } />
                <Typography
                  variant="body1"
                  sx={ {
                    color: 'rgba(245, 242, 238, 0.75)',
                    fontSize: { xs: '1.05rem', md: '1.15rem' },
                    lineHeight: 2,
                    wordBreak: 'keep-all',
                  } }
                >
                  { section.content }
                </Typography>
              </Box>
            )) }
          </Container>
        ) }

        {/* ── 인용문 ── */}
        { article.quotes?.length > 0 && (
          <Container maxWidth="sm" sx={ { pb: { xs: 10, md: 14 } } }>
            <SectionDivider label="Quotes" />
            { article.quotes.map((quote, index) => (
              <Box
                key={ index }
                sx={ {
                  textAlign: 'center',
                  mb: { xs: 5, md: 6 },
                } }
              >
                <Typography
                  variant="h5"
                  component="blockquote"
                  sx={ {
                    fontFamily: '"Cormorant Garamond", "Pretendard Variable", serif',
                    fontSize: { xs: '1.6rem', md: '2rem' },
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'rgba(245, 242, 238, 0.65)',
                    mb: 1.5,
                  } }
                >
                  &ldquo;{ quote.text }&rdquo;
                </Typography>
                { quote.source && (
                  <Typography
                    variant="caption"
                    sx={ {
                      color: 'rgba(245, 242, 238, 0.35)',
                      fontSize: '0.95rem',
                      letterSpacing: '0.04em',
                    } }
                  >
                    — { quote.source }
                  </Typography>
                ) }
              </Box>
            )) }
          </Container>
        ) }
      </Box>
    </Dialog>
  );
}

export default ArticleDetailModal;
