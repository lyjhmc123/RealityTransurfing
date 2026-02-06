import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FullPageSection } from '../components/layout/FullPageContainer';
import MarqueeContainer from '../components/motion/MarqueeContainer';

/**
 * SurveySection 컴포넌트
 *
 * 트랜서핑 관련 설문조사 결과를 카드 형태로 보여주는 섹션.
 * 다크 배경 위에 타이틀·리드문을 표시하고,
 * MarqueeContainer로 설문 카드가 좌우로 끊임없이 흐른다.
 *
 * 동작 흐름:
 * 1. 사용자가 스크롤하여 Survey 섹션에 진입한다
 * 2. 섹션 타이틀과 리드 텍스트가 표시된다
 * 3. 설문 결과 카드가 마퀴 효과로 무한 스크롤된다
 * 4. 카드에는 질문, 결과 수치, 설명이 표시된다
 * 5. 카드는 텍스트만 포함되며 클릭할 수 없다
 *
 * Props:
 * @param {string} sectionTitle - 섹션 타이틀 텍스트 [Required]
 * @param {string} leadText - 리드 텍스트 [Optional]
 * @param {Array} surveys - 설문 결과 목록 [{ question, result, description }] [Required]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <SurveySection
 *   sectionTitle="Survey"
 *   leadText="설문 결과입니다"
 *   surveys={[
 *     { question: '삶에 변화가 있었나요?', result: '89%', description: '긍정적 변화 경험' },
 *   ]}
 * />
 */
function SurveySection({
  sectionTitle,
  leadText,
  surveys = [],
  sx,
}) {
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

      {/* 마퀴 영역 */}
      <Box
        sx={ {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 3 },
        } }
      >
        <MarqueeContainer speed={ 25 } direction="left" gap={ 3 }>
          { surveys.map((survey, index) => (
            <Box
              key={ index }
              sx={ {
                backgroundColor: 'rgba(245, 242, 238, 0.06)',
                px: 4,
                py: 3,
                minWidth: { xs: 280, md: 340 },
                maxWidth: 420,
              } }
            >
              {/* 질문 */}
              <Typography
                variant="body2"
                sx={ {
                  color: 'rgba(245, 242, 238, 0.5)',
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  mb: 1.5,
                  wordBreak: 'keep-all',
                } }
              >
                { survey.question }
              </Typography>

              {/* 결과 수치 */}
              <Typography
                variant="h4"
                sx={ {
                  fontWeight: 700,
                  color: '#FFC66E',
                  fontSize: { xs: '2.5rem', md: '3.2rem' },
                  lineHeight: 1,
                  mb: 1,
                } }
              >
                { survey.result }
              </Typography>

              {/* 설명 */}
              <Typography
                variant="body2"
                sx={ {
                  color: 'rgba(245, 242, 238, 0.75)',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  wordBreak: 'keep-all',
                } }
              >
                { survey.description }
              </Typography>
            </Box>
          )) }
        </MarqueeContainer>
      </Box>
    </FullPageSection>
  );
}

export default SurveySection;
