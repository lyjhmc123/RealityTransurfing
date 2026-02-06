import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { FullPageSection } from '../components/layout/FullPageContainer';
import RandomRevealText from '../components/kinetic-typography/RandomRevealText';

/**
 * OutroSection 컴포넌트
 *
 * 매거진의 마무리 인사 섹션.
 * 투명 배경(GradientOverlay가 배경 담당) 위에 대형 타이틀을 수직으로 배치하고,
 * CTA 버튼과 링크를 하단에 표시한다.
 * forwardRef로 감싸져 있어 GradientOverlay의 scrollOutRef 기준점으로 사용된다.
 * 이 섹션에서 배경이 다크→라이트로 전환되므로, 텍스트는 라이트 모드(검정) 색상을 사용한다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 Outro 섹션에 진입하면 배경이 라이트로 전환된다
 * 2. "당신의 세계에서 / 모든 것은 / 가능합니다" 대형 타이틀이 중앙에 표시된다
 * 3. CTA 버튼과 링크가 하단에 표시된다
 * 4. 계속 스크롤하면 Footer로 이동한다
 *
 * Props:
 * @param {Array} titles - 타이틀 행 목록 [{ text }] [Required]
 * @param {string} ctaText - CTA 버튼 텍스트 [Optional]
 * @param {Array} links - 링크 목록 [{ label }] [Optional]
 * @param {function} onCtaClick - CTA 클릭 핸들러 [Optional]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <OutroSection
 *   titles={[{ text: '당신의 세계에서' }, { text: '모든 것은' }, { text: '가능합니다' }]}
 *   ctaText="다음 호 알림 받기"
 * />
 */
const OutroSection = forwardRef(function OutroSection({
  titles = [],
  ctaText,
  links = [],
  onCtaClick,
  sx,
}, ref) {
  return (
    <FullPageSection
      ref={ ref }
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
          alignItems: 'center',
          textAlign: 'center',
          py: { xs: 8, md: 12 },
        } }
      >
        {/* 대형 타이틀 — 각 행이 순차적 delay로 blur에서 나타남 */}
        <Box sx={ { mb: { xs: 6, md: 8 } } }>
          { titles.map((title, index) => (
            <RandomRevealText
              key={ index }
              text={ title.text }
              variant="h1"
              delay={ 300 + index * 400 }
              stagger={ 70 }
              sx={ {
                fontSize: { xs: '3.5rem', sm: '5rem', md: '7.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#12100E',
                display: 'block',
              } }
            />
          )) }
        </Box>

        {/* CTA 버튼 */}
        { ctaText && (
          <Button
            variant="text"
            onClick={ onCtaClick }
            sx={ {
              color: '#12100E',
              letterSpacing: '0.04em',
              mb: 4,
              '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8,
              },
            } }
          >
            { ctaText }
          </Button>
        ) }

        {/* 링크 */}
        { links.length > 0 && (
          <Box
            sx={ {
              display: 'flex',
              gap: 3,
            } }
          >
            { links.map((link, index) => (
              <Typography
                key={ index }
                variant="body2"
                sx={ {
                  color: 'rgba(18, 16, 14, 0.4)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  '&:hover': { color: 'rgba(18, 16, 14, 0.7)' },
                } }
              >
                { link.label }
              </Typography>
            )) }
          </Box>
        ) }
      </Container>
    </FullPageSection>
  );
});

export default OutroSection;
