import ArticleDetailModal from './ArticleDetailModal';
import magazineData from '../data/magazineData';

const { articles } = magazineData;

export default {
  title: 'Section/ArticleDetailModal',
  component: ArticleDetailModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: { control: 'boolean', description: '모달 열림 여부' },
    onClose: { action: 'closed', description: '모달 닫기 핸들러' },
    article: { control: 'object', description: '아티클 데이터 객체' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    isOpen: true,
    article: articles.items[0],
  },
};

export const GuideArticle = {
  args: {
    isOpen: true,
    article: articles.items[1],
  },
};

export const PracticeArticle = {
  args: {
    isOpen: true,
    article: articles.items[2],
  },
};
