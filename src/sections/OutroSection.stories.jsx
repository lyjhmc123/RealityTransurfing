import OutroSection from './OutroSection';
import magazineData from '../data/magazineData';

const { outro } = magazineData;

export default {
  title: 'Section/OutroSection',
  component: OutroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    titles: { control: 'object', description: '타이틀 행 목록 [{ text }]' },
    ctaText: { control: 'text', description: 'CTA 버튼 텍스트' },
    links: { control: 'object', description: '링크 목록 [{ label }]' },
    onCtaClick: { action: 'ctaClicked', description: 'CTA 클릭 핸들러' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    titles: outro.titles,
    ctaText: outro.ctaText,
    links: outro.links,
  },
};
