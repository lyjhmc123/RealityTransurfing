import StorySection from './StorySection';
import magazineData from '../data/magazineData';

const { stories } = magazineData;

export default {
  title: 'Section/StorySection',
  component: StorySection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sectionTitle: { control: 'text', description: '섹션 타이틀 텍스트' },
    items: { control: 'object', description: '인터뷰 목록 [{ id, motif, headline, subtitle, leadText, tag }]' },
    onCardClick: { action: 'cardClicked', description: '스토리 클릭 핸들러 (story 객체 전달)' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    sectionTitle: stories.sectionTitle,
    items: stories.items,
  },
};
