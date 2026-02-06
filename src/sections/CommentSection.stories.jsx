import CommentSection from './CommentSection';
import magazineData from '../data/magazineData';

const { comments } = magazineData;

export default {
  title: 'Section/CommentSection',
  component: CommentSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sectionTitle: { control: 'text', description: '섹션 타이틀 텍스트' },
    leadText: { control: 'text', description: '리드 텍스트' },
    comments: { control: 'object', description: '코멘트 목록 [{ id, text }]' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    sectionTitle: comments.sectionTitle,
    comments: comments.comments,
  },
};
