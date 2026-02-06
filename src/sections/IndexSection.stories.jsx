import IndexSection from './IndexSection';
import magazineData from '../data/magazineData';

const { index } = magazineData;

export default {
  title: 'Section/IndexSection',
  component: IndexSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: { control: 'text', description: '섹션 라벨 텍스트' },
    headline: { control: 'text', description: '헤드라인 텍스트' },
    items: { control: 'object', description: '목차 아이템 목록 [{ id, title, description }]' },
    onItemClick: { action: 'itemClicked', description: '아이템 클릭 핸들러' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    label: index.label,
    headline: index.headline,
    items: index.items,
  },
};
