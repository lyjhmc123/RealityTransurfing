import ArticleSection from './ArticleSection';
import magazineData from '../data/magazineData';

const { articles } = magazineData;

export default {
  title: 'Section/ArticleSection',
  component: ArticleSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sectionTitle: { control: 'text', description: '섹션 타이틀 텍스트' },
    items: { control: 'object', description: '아티클 목록 [{ id, headline, leadText, tag }]' },
    onCardClick: { action: 'cardClicked', description: '아티클 클릭 핸들러 (article 객체 전달)' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    sectionTitle: articles.sectionTitle,
    items: articles.items,
  },
};
