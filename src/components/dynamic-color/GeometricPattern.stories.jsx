import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GeometricPattern from './GeometricPattern';

export default {
  title: 'Interactive/15. DynamicColor/GeometricPattern',
  component: GeometricPattern,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid', 'ripple', 'warp', 'burst', 'flow', 'reflect', 'duality', 'layers'],
      description: '기하학 패턴 타입',
    },
    colorStroke: {
      control: 'color',
      description: '선/점 색상',
    },
    colorAccent: {
      control: 'color',
      description: '강조 포인트 색상',
    },
    colorBackground: {
      control: 'color',
      description: '배경 색상',
    },
  },
};

export const Default = {
  args: {
    variant: 'grid',
    colorStroke: '#F5F2EE',
    colorAccent: '#FFC66E',
    colorBackground: '#12100E',
  },
  render: (args) => (
    <Box sx={ { width: 400, aspectRatio: '3 / 4' } }>
      <GeometricPattern { ...args } />
    </Box>
  ),
};

const VARIANTS = [
  { variant: 'grid', label: '변이 공간' },
  { variant: 'ripple', label: '진자' },
  { variant: 'warp', label: '중요도' },
  { variant: 'burst', label: '과잉 잠재력' },
  { variant: 'flow', label: '외부 의도' },
  { variant: 'reflect', label: '거울 원칙' },
  { variant: 'duality', label: '영혼과 이성' },
  { variant: 'layers', label: '슬라이드' },
];

export const Variants = {
  render: () => (
    <Box
      sx={ {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 3,
      } }
    >
      { VARIANTS.map(({ variant, label }) => (
        <Box key={ variant }>
          <Box sx={ { aspectRatio: '3 / 4', mb: 1 } }>
            <GeometricPattern variant={ variant } />
          </Box>
          <Typography
            variant="caption"
            sx={ { color: 'text.secondary', display: 'block', textAlign: 'center' } }
          >
            { variant } — { label }
          </Typography>
        </Box>
      )) }
    </Box>
  ),
};
