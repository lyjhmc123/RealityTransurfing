import TermsDetailModal from './TermsDetailModal';
import magazineData from '../data/magazineData';

const { terms } = magazineData;

export default {
  title: 'Section/TermsDetailModal',
  component: TermsDetailModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: { control: 'boolean', description: '모달 열림 여부' },
    onClose: { action: 'closed', description: '모달 닫기 핸들러' },
    term: { control: 'object', description: '용어 데이터 객체' },
    sx: { control: 'object', description: '추가 MUI sx 스타일' },
  },
};

export const Default = {
  args: {
    isOpen: true,
    term: terms.featured[0],
  },
};

export const Pendulum = {
  args: {
    isOpen: true,
    term: terms.featured[1],
  },
};

export const Importance = {
  args: {
    isOpen: true,
    term: terms.featured[2],
  },
};
