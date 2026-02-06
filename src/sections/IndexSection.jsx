import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FullPageSection } from '../components/layout/FullPageContainer';
import { SlidingHighlightMenu } from '../components/navigation/SlidingHighlightMenu';

/**
 * IndexSection 컴포넌트
 *
 * 매거진 목차 섹션. 다크 배경(투명, GradientOverlay가 배경 담당) 위에 라벨·헤드라인을 표시하고,
 * SlidingHighlightMenu(background 인디케이터)를 활용해
 * 각 섹션의 타이틀과 설명을 나열하며 클릭 시 해당 섹션으로 이동한다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 목차 섹션에 진입한다
 * 2. 라벨(Contents)과 헤드라인(Issue No.1)이 표시된다
 * 3. 세로 방향의 SlidingHighlightMenu로 섹션 목록이 나열된다
 * 4. 각 아이템은 "타이틀 — 설명" 형식으로 표시된다
 * 5. 아이템에 마우스를 올리면 배경 하이라이트가 이동한다
 * 6. 아이템 클릭 시 해당 섹션으로 이동한다
 *
 * Props:
 * @param {string} label - 섹션 라벨 텍스트 [Optional]
 * @param {string} headline - 헤드라인 텍스트 [Required]
 * @param {Array} items - 목차 아이템 목록 [{ id, title, description }] [Required]
 * @param {function} onItemClick - 아이템 클릭 시 실행할 함수 (id를 인자로 전달) [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <IndexSection
 *   label="Contents"
 *   headline="Issue No.1"
 *   items={[
 *     { id: 'terms', title: 'Terms', description: '트랜서핑 주요 용어' },
 *   ]}
 *   onItemClick={(id) => scrollTo(id)}
 * />
 */
function IndexSection({
  label,
  headline,
  items = [],
  onItemClick,
  sx,
}) {
  const menuItems = items.map((item) => ({
    id: item.id,
    label: (
      <>
        <Box component="span" sx={ { fontWeight: 700 } }>{ item.title }</Box>
        <Box
          component="span"
          sx={ { mx: 1.5, color: 'rgba(245, 242, 238, 0.2)' } }
        >
          —
        </Box>
        <Box
          component="span"
          sx={ { fontWeight: 400, color: 'rgba(245, 242, 238, 0.5)' } }
        >
          { item.description }
        </Box>
      </>
    ),
    onClick: () => onItemClick?.(item.id),
  }));

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
          py: { xs: 6, md: 10 },
        } }
      >
        {/* 라벨 */}
        { label && (
          <Typography
            variant="overline"
            sx={ {
              color: 'rgba(245, 242, 238, 0.5)',
              mb: 3,
            } }
          >
            { label }
          </Typography>
        ) }

        {/* 헤드라인 */}
        <Typography
          variant="h2"
          component="h2"
          sx={ {
            fontWeight: 700,
            fontSize: { xs: '2.8rem', sm: '3.5rem', md: '5rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#F5F2EE',
            mb: { xs: 5, md: 8 },
          } }
        >
          { headline }
        </Typography>

        {/* 목차 네비게이션 */}
        <Box>
          <SlidingHighlightMenu
            items={ menuItems }
            indicator="background"
            direction="vertical"
            highlightColor="rgba(245, 242, 238, 0.1)"
            sx={ {
              display: 'flex',
              width: '100%',
              '& .MuiTypography-root': {
                color: '#F5F2EE',
                fontSize: { xs: '1.15rem', md: '1.35rem' },
                fontFamily: '"Cormorant Garamond", "Pretendard Variable", serif',
                textAlign: 'left',
                transition: 'color 0.2s',
              },
              '& > button': {
                py: 3.5,
                px: 2.5,
                width: '100%',
                textAlign: 'left',
                borderBottom: '1px solid',
                borderColor: 'rgba(245, 242, 238, 0.12)',
              },
              '& > button:hover .MuiTypography-root, & > button:hover span': {
                color: '#FFC66E',
              },
            } }
          />
        </Box>
      </Container>
    </FullPageSection>
  );
}

export default IndexSection;
