import EditorLetterSection from './EditorLetterSection';
import magazineData from '../data/magazineData';

const { editorLetter } = magazineData;

export default {
  title: 'Section/EditorLetterSection',
  component: EditorLetterSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    coverImage: { control: 'text', description: '배경 커버 이미지 URL' },
    headline: { control: 'text', description: '섹션 헤드라인 텍스트' },
    bodyText: { control: 'text', description: '본문 텍스트' },
    ctaText: { control: 'text', description: 'CTA 버튼 텍스트' },
    tag: { control: 'text', description: '섹션 태그 라벨' },
    onCtaClick: { action: 'ctaClicked', description: 'CTA 버튼 클릭 핸들러' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    coverImage: editorLetter.coverImage,
    headline: editorLetter.headline,
    bodyText: editorLetter.bodyText,
    ctaText: editorLetter.ctaText,
    tag: editorLetter.tag,
  },
};
