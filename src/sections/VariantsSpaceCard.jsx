import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GeometricPattern from '../components/dynamic-color/GeometricPattern';

/** 본문 텍스트에서 bodyHighlights 배열에 해당하는 문자열의 첫 등장만 볼드+액센트로 렌더링 */
function renderBodyWithHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return text;

  let segments = [text];

  highlights.forEach((hl) => {
    let found = false;
    const next = [];

    segments.forEach((seg) => {
      if (found || typeof seg !== 'string') {
        next.push(seg);
        return;
      }
      const idx = seg.indexOf(hl);
      if (idx === -1) {
        next.push(seg);
        return;
      }
      found = true;
      if (idx > 0) next.push(seg.slice(0, idx));
      next.push({ text: hl });
      if (idx + hl.length < seg.length) next.push(seg.slice(idx + hl.length));
    });

    segments = next;
  });

  return segments.map((seg, i) => {
    if (typeof seg === 'string') return seg;
    return (
      <span
        key={ i }
        style={ { color: '#FFC66E', fontWeight: 700 } }
      >
        { seg.text }
      </span>
    );
  });
}

/**
 * VariantsSpaceCard 컴포넌트
 *
 * 가능태 공간 섹션의 가로 스크롤 카드.
 * 키비주얼 상단 배치, 아래에 헤드라인 + 본문이 넓게 표시된다.
 *
 * 동작 흐름:
 * 1. 사용자가 가로 스크롤하여 카드가 뷰포트에 진입한다
 * 2. 상단에 GeometricPattern 모티프가 렌더링된다
 * 3. 아래에 헤드라인과 본문이 표시된다
 *
 * Props:
 * @param {string} motif - GeometricPattern variant [Required]
 * @param {string} headline - 카드 제목 [Required]
 * @param {string} body - 카드 본문 [Required]
 * @param {string} bodyHighlight - 본문 하단 강조 텍스트 (볼드 + 액센트 컬러) [Optional]
 * @param {string[]} bodyHighlights - 본문 내 인라인 강조 문자열 배열 (볼드 + 액센트 컬러) [Optional]
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
  bodyHighlight,
  bodyHighlights = [],
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
      {/* 상단 여백 */}
      <Box sx={ { flex: '0 0 12vh' } } />

      {/* 키비주얼 — GeometricPattern */}
      <Box
        ref={ visualRef }
        sx={ {
          flex: '0 0 28vh',
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

      {/* 텍스트 영역 — ~60vh */}
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
          component="div"
          sx={ {
            color: 'rgba(245, 242, 238, 0.7)',
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            lineHeight: 1.85,
            wordBreak: 'keep-all',
            whiteSpace: 'pre-line',
          } }
        >
          { renderBodyWithHighlights(body, bodyHighlights) }
        </Typography>

        {/* 강조 텍스트 */}
        { bodyHighlight && (
          <Typography
            variant="body1"
            sx={ {
              color: '#FFC66E',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', md: '0.95rem' },
              lineHeight: 1.85,
              wordBreak: 'keep-all',
            } }
          >
            { bodyHighlight }
          </Typography>
        ) }
      </Box>
    </Box>
  );
}

export default VariantsSpaceCard;
