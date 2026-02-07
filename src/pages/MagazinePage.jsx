import { useRef, useState } from 'react';
import { LayoutGroup } from 'framer-motion';
import HeroSection from '../sections/HeroSection';
import EditorLetterSection from '../sections/EditorLetterSection';
import IndexSection from '../sections/IndexSection';
import CommentSection from '../sections/CommentSection';
import TermsSection from '../sections/TermsSection';
import ArticleSection from '../sections/ArticleSection';
import ArticleDetailModal from '../sections/ArticleDetailModal';
import TermsDetailModal from '../sections/TermsDetailModal';
import StorySection from '../sections/StorySection';
import SurveySection from '../sections/SurveySection';
import OutroSection from '../sections/OutroSection';
import FooterSection from '../sections/FooterSection';
import GradientOverlay from '../components/dynamic-color/GradientOverlay';
import Box from '@mui/material/Box';
import { PageContainer } from '../components/layout/PageContainer';
import { SectionContainer } from '../components/container/SectionContainer';
import magazineData from '../data/magazineData';

/**
 * MagazinePage 컴포넌트
 *
 * Intertext Magazine Issue No.1 전체 페이지.
 * 각 섹션 컴포넌트를 순서대로 배치한다.
 * (스크롤 스냅은 임시 해제 상태)
 *
 * 동작 흐름:
 * 1. 사용자가 페이지에 진입하면 HeroSection(표지)이 보인다
 * 2. 스크롤하면 커버 이미지가 확대되며 EditorLetterSection으로 전환된다
 * 3. EditorLetterSection의 CTA 클릭 시 다음 섹션(Index)으로 스크롤 이동한다
 *
 * Example usage:
 * <MagazinePage />
 */
function MagazinePage() {
  const { intro, editorLetter, index, comments, terms, articles, stories, survey, outro, footer } = magazineData;
  const outroRef = useRef(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);

  return (
    <PageContainer maxWidth={ false } disableGutters>
      {/* WebGL 그라데이션 배경 — 스크롤에 따라 라이트→다크→라이트 전환 */}
      <GradientOverlay
        colorLight="#F5F2EE"
        colorDark="#12100E"
        scrollOutRef={ outroRef }
      />

      {/* 사이트 진입 — 라이트 영역 */}
      <HeroSection
        logo={ intro.logo }
        subtitle={ intro.subtitle }
        title={ intro.title }
        leadText={ intro.leadText }
        footerText={ intro.footerText }
      />

      {/* 매거진 입장 — 메인 컨텐츠 영역 */}
      <SectionContainer sx={ { py: 0, position: 'relative', zIndex: 2 } }>
        {/* 2. Editor's Letter — 에디터 레터 */}
        <EditorLetterSection
          headline={ editorLetter.headline }
          bodyText={ editorLetter.bodyText }
          ctaText={ editorLetter.ctaText }
          tag={ editorLetter.tag }
          sx={ { mt: '-10vh', position: 'relative', zIndex: 1 } }
        />

        {/* 3. Index — 목차 */}
        <IndexSection
          label={ index.label }
          headline={ index.headline }
          items={ index.items }
        />

        {/* 4. Comments — 트랜서핑에 대한 말말말 */}
        <CommentSection
          sectionTitle={ comments.sectionTitle }
          comments={ comments.comments }
        />

        {/* 5. Terms — 트랜서핑 주요 용어 (LayoutGroup으로 카드→모달 공유 애니메이션) */}
        <LayoutGroup>
          <TermsSection
            sectionTitle={ terms.sectionTitle }
            leadText={ terms.leadText }
            featured={ terms.featured }
            onCardClick={ (term) => setSelectedTerm(term) }
          />
          <TermsDetailModal
            isOpen={ Boolean(selectedTerm) }
            onClose={ () => setSelectedTerm(null) }
            term={ selectedTerm }
          />
        </LayoutGroup>

        {/* 6. Article — 깊이 있는 아티클 */}
        <ArticleSection
          sectionTitle={ articles.sectionTitle }
          items={ articles.items }
          onCardClick={ (article) => setSelectedArticle(article) }
        />

        {/* 7. Story — 트랜서핑 인터뷰 */}
        <StorySection
          sectionTitle={ stories.sectionTitle }
          items={ stories.items }
        />

        {/* 8. Survey — 설문조사 결과 */}
        <SurveySection
          sectionTitle={ survey.sectionTitle }
          leadText={ survey.leadText }
          surveys={ survey.surveys }
        />

        {/* GradientOverlay 라이트 전환 트리거 — Outro 진입 전에 전환 시작 */}
        <Box ref={ outroRef } />

        {/* 9. Outro — 마무리 인사 */}
        <OutroSection
          titles={ outro.titles }
          ctaText={ outro.ctaText }
          links={ outro.links }
        />
      </SectionContainer>

      {/* 퇴장 — 라이트 영역 */}
      <FooterSection
        logo={ footer.logo }
        description="Intertext 매거진은 한 호에 한 컨텐츠를 깊이 있게 해석하는 텍스트 중심의 디지털 매거진입니다. 텍스트를 통해 컨텐츠가 담고 있는 세계관과 철학을 읽어냅니다. 텍스트 사이에서 나, 너, 우리의 존재를 다시 읽습니다."
        instagramHandle={ footer.instagramHandle }
        instagramUrl={ footer.instagramUrl }
        copyright={ footer.copyright }
      />
      {/* Article 상세 모달 */}
      <ArticleDetailModal
        isOpen={ Boolean(selectedArticle) }
        onClose={ () => setSelectedArticle(null) }
        article={ selectedArticle }
      />
    </PageContainer>
  );
}

export default MagazinePage;
