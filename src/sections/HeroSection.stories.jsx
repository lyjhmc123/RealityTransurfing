import HeroSection from './HeroSection';
import magazineData from '../data/magazineData';

const { intro } = magazineData;

export default {
  title: 'Section/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    logo: { control: 'text', description: '매거진 로고 텍스트' },
    subtitle: { control: 'text', description: '서브타이틀 텍스트' },
    title: { control: 'text', description: '메인 타이틀 텍스트' },
    leadText: { control: 'text', description: '리드 문단 텍스트' },
    footerText: { control: 'text', description: '하단 스크롤 안내 텍스트' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    logo: intro.logo,
    subtitle: intro.subtitle,
    title: intro.title,
    leadText: intro.leadText,
    footerText: intro.footerText,
  },
};
