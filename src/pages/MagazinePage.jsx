import { useRef, useState } from 'react';
import HeroSection from '../sections/HeroSection';
import LeadTextSection from '../sections/LeadTextSection';
import TermFullscreenSection from '../sections/TermFullscreenSection';
import VariantsSpaceSection from '../sections/VariantsSpaceSection';
import TermsDetailModal from '../sections/TermsDetailModal';
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
 * 용어 중심 몰입형 경험 — 각 트랜서핑 용어가 풀스크린 섹션으로 표시된다.
 *
 * 동작 흐름:
 * 1. 사용자가 페이지에 진입하면 HeroSection(표지)이 보인다
 * 2. 스크롤하면 8개 트랜서핑 용어가 각각 풀스크린 섹션으로 나타난다
 * 3. 각 용어 섹션의 '자세히 보기' 클릭 시 TermsDetailModal이 열린다
 * 4. 모든 용어를 지나면 Outro, Footer가 이어진다
 *
 * Example usage:
 * <MagazinePage />
 */
function MagazinePage() {
  const { intro, terms, outro, footer } = magazineData;
  const outroRef = useRef(null);
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
        footerText={ intro.footerText }
      />

      {/* 리드문 — 다크 배경 위 리드 텍스트 */}
      <LeadTextSection text={ intro.leadText } />

      {/* 매거진 입장 — 용어 풀스크린 여정 (LeadTextSection과 100svh 겹침) */}
      <SectionContainer sx={ { py: 0, position: 'relative', zIndex: 2, marginTop: '-100svh' } }>
        { terms.allTerms.map((term, index) => (
          term.id === 'variants-space' ? (
            <VariantsSpaceSection
              key={ term.id }
              term={ term }
              index={ index }
              totalCount={ terms.allTerms.length }
              onDetailClick={ () => setSelectedTerm(term) }
            />
          ) : (
            <TermFullscreenSection
              key={ term.id }
              term={ term }
              index={ index }
              totalCount={ terms.allTerms.length }
              onDetailClick={ () => setSelectedTerm(term) }
            />
          )
        )) }

        {/* GradientOverlay 라이트 전환 트리거 — Outro 진입 전에 전환 시작 */}
        <Box ref={ outroRef } />

        {/* Outro — 마무리 인사 */}
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

      {/* 용어 상세 모달 */}
      <TermsDetailModal
        isOpen={ Boolean(selectedTerm) }
        onClose={ () => setSelectedTerm(null) }
        term={ selectedTerm }
      />
    </PageContainer>
  );
}

export default MagazinePage;
