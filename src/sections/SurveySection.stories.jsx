import SurveySection from './SurveySection';
import magazineData from '../data/magazineData';

const { survey } = magazineData;

export default {
  title: 'Section/SurveySection',
  component: SurveySection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    sectionTitle: { control: 'text', description: '섹션 타이틀 텍스트' },
    leadText: { control: 'text', description: '리드 텍스트' },
    surveys: { control: 'object', description: '설문 결과 목록 [{ question, result, description }]' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    sectionTitle: survey.sectionTitle,
    leadText: survey.leadText,
    surveys: survey.surveys,
  },
};
