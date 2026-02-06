import TermsSection from './TermsSection';
import magazineData from '../data/magazineData';

const { terms } = magazineData;

export default {
  title: 'Section/TermsSection',
  component: TermsSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sectionTitle: { control: 'text', description: '섹션 타이틀 텍스트' },
    leadText: { control: 'text', description: '리드 텍스트' },
    ctaText: { control: 'text', description: 'CTA 버튼 텍스트' },
    featured: { control: 'object', description: '주요 용어 카드 목록 [{ id, thumbnail, title, description }]' },
    onCtaClick: { action: 'ctaClicked', description: 'CTA 클릭 핸들러' },
    onCardClick: { action: 'cardClicked', description: '카드 클릭 핸들러' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    sectionTitle: terms.sectionTitle,
    leadText: terms.leadText,
    featured: terms.featured,
  },
};
