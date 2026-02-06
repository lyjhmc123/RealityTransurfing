import FooterSection from './FooterSection';
import magazineData from '../data/magazineData';

const { footer } = magazineData;

export default {
  title: 'Section/FooterSection',
  component: FooterSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    logo: { control: 'text', description: '매거진 로고 텍스트' },
    description: { control: 'text', description: '매거진 소개 텍스트' },
    instagramHandle: { control: 'text', description: '인스타그램 핸들' },
    instagramUrl: { control: 'text', description: '인스타그램 URL' },
    copyright: { control: 'text', description: '저작권 텍스트' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    logo: footer.logo,
    description: 'Intertext 매거진은 한 호에 한 컨텐츠를 깊이 있게 해석하는 텍스트 중심의 디지털 매거진입니다. 텍스트를 통해 컨텐츠가 담고 있는 세계관과 철학을 읽어냅니다. 텍스트 사이에서 나, 너, 우리의 존재를 다시 읽습니다.',
    instagramHandle: footer.instagramHandle,
    instagramUrl: footer.instagramUrl,
    copyright: footer.copyright,
  },
};
