import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';

/**
 * VariantsSpaceCard 컴포넌트
 *
 * 가능태 공간 섹션의 가로 스크롤 카드.
 * 키비주얼이 뷰포트 세로 중앙에 위치하고, 그 아래에 헤드라인 + 본문이 표시된다.
 * 타이틀 슬라이드의 구와 키비주얼이 일직선 상에 놓인다.
 *
 * 동작 흐름:
 * 1. 사용자가 가로 스크롤하여 카드가 뷰포트에 진입한다
 * 2. 중앙에 GeometricPattern 모티프가 렌더링된다
 * 3. 아래에 헤드라인과 본문이 표시된다
 *
 * Props:
 * @param {string} motif - GeometricPattern variant [Required]
 * @param {string} headline - 카드 제목 [Required]
 * @param {string} body - 카드 본문 [Required]
 * @param {object} scrollInfluenceRef - 스크롤 기반 수렴 제어 ref (grid variant 전용) [Optional]
 * @param {object} visualRef - 비주얼 영역 DOM ref (부모에서 opacity 제어용) [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <VariantsSpaceCard
 *   motif="grid"
 *   headline="현실은 하나로 고정되어 있지 않다"
 *   body="양자역학의 기본 전제는..."
 * />
 */
function VariantsSpaceCard({
  motif,
  headline,
  body,
  scrollInfluenceRef,
  visualRef,
  sx = {},
}) {
  return (
    <Box
      sx={ {
        width: { xs: 'calc(100vw - 48px)', md: 480 },
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...sx,
      } }
    >
      {/* 상단 여백 — 키비주얼 중앙 정렬 (구 중심 = 50vh) */}
      <Box sx={ { flex: '0 0 calc(50vh - 17.5vh)' } } />

      {/* 키비주얼 — GeometricPattern (중심이 뷰포트 50vh에 위치) */}
      <Box
        ref={ visualRef }
        sx={ {
          flex: '0 0 35vh',
          position: 'relative',
          minHeight: 0,
          opacity: visualRef ? 0 : 1,
        } }
      >
        <GeometricPattern
          variant={ motif }
          scrollInfluenceRef={ scrollInfluenceRef }
        />
      </Box>

      {/* 텍스트 영역 */}
      <Box
        sx={ {
          flex: '1 1 auto',
          px: { xs: 3, md: 4 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'auto',
          minHeight: 0,
        } }
      >
        {/* 헤드라인 */}
        <Typography
          variant="h4"
          sx={ {
            fontWeight: 700,
            fontSize: { xs: '1.4rem', md: '1.6rem' },
            lineHeight: 1.3,
            color: '#F5F2EE',
            wordBreak: 'keep-all',
          } }
        >
          { headline }
        </Typography>

        {/* 본문 */}
        <Typography
          variant="body1"
          sx={ {
            color: 'rgba(245, 242, 238, 0.7)',
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            lineHeight: 1.85,
            wordBreak: 'keep-all',
            whiteSpace: 'pre-line',
          } }
        >
          { body }
        </Typography>
      </Box>
    </Box>
  );
}

export default VariantsSpaceCard;
