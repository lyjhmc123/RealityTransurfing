import React, { useRef } from 'react';
import { Box } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

/**
 * HorizontalScroll - 가로 스크롤 컨테이너
 *
 * 세로 스크롤을 가로 이동으로 변환하는 순수 컨테이너입니다.
 * 주어진 콘텐츠만큼만 스크롤하고, 빈 공간 없이 다음 섹션으로 넘어갑니다.
 *
 * 스크롤 계산 (padding 포함):
 * - 콘텐츠 너비 = (slideWidth × slideCount) + (gap × (slideCount - 1))
 * - 가용 뷰포트 = 100vw - (padding × 2)
 * - 스크롤 거리 = 콘텐츠 너비 - 가용 뷰포트
 * - 스크롤 높이 = 콘텐츠 너비 + (padding × 2) (vh 단위, 비례 스크롤)
 *
 * 시작/종료 위치:
 * - 시작: 첫 슬라이드 좌측 = padding 위치
 * - 종료: 마지막 슬라이드 우측 = 100vw - padding 위치
 *
 * Props:
 * @param {React.ReactNode} children - HorizontalScroll.Slide로 감싼 슬라이드들 [Required]
 * @param {string} slideWidth - 각 슬라이드의 콘텐츠 너비 [Optional, 기본값: '80vw']
 * @param {string} gap - 슬라이드 간 간격 [Optional, 기본값: '0vw']
 * @param {string} padding - 좌우 패딩 (vw 단위) [Optional, 기본값: '0vw']
 * @param {string} backgroundColor - 배경색 [Optional, 기본값: 'transparent']
 * @param {function} onScrollProgress - 스크롤 진행도 콜백 (0-1) [Optional]
 *
 * Example usage:
 * <HorizontalScroll slideWidth="50vw" gap="2vw" padding="3vw">
 *   <HorizontalScroll.Slide>콘텐츠1</HorizontalScroll.Slide>
 *   <HorizontalScroll.Slide>콘텐츠2</HorizontalScroll.Slide>
 *   <HorizontalScroll.Slide>콘텐츠3</HorizontalScroll.Slide>
 * </HorizontalScroll>
 */
function HorizontalScroll({
  children,
  slideWidth,
  gap = '0vw',
  padding = '0vw',
  backgroundColor = 'transparent',
  onScrollProgress,
}) {
  const containerRef = useRef(null);

  // children 개수 자동 감지
  const slideCount = React.Children.count(children);
  const totalSlides = slideCount || 1;

  // slideWidth에서 숫자값 추출 (예: '80vw' → 80)
  const slideWidthValue = parseFloat(slideWidth);
  const slideWidthUnit = slideWidth.replace(/[\d.]/g, '') || 'vw';

  // gap에서 숫자값 추출 (예: '2vw' → 2)
  const gapValue = parseFloat(gap) || 0;

  // padding에서 숫자값 추출 (예: '3vw' → 3)
  const paddingValue = parseFloat(padding) || 0;

  // 콘텐츠 너비 계산 (슬라이드 너비 + 간격, 패딩 제외)
  // gap은 슬라이드 사이에만 존재하므로 (totalSlides - 1)개
  const totalGapWidth = gapValue * Math.max(0, totalSlides - 1);
  const contentWidth = (slideWidthValue * totalSlides) + totalGapWidth;

  // 가용 뷰포트 너비 = 100vw - 좌우 패딩
  const viewportWidth = 100; // vw 단위 가정
  const availableViewport = viewportWidth - (paddingValue * 2);

  // 스크롤 거리 = 콘텐츠 너비 - 가용 뷰포트
  // 첫 슬라이드는 paddingLeft에서 시작, 마지막 슬라이드는 100vw - paddingRight에서 끝남
  const scrollDistance = Math.max(0, contentWidth - availableViewport);

  // 전체 트랙 너비 (패딩 포함)
  const totalTrackWidth = contentWidth + (paddingValue * 2);

  // 스크롤 높이를 트랙 너비에 비례하게 설정
  const scrollHeight = Math.max(100, totalTrackWidth);

  // 스크롤 진행도 추적
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 스크롤 진행도 콜백 호출
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    onScrollProgress?.(v);
  });

  // 가로 이동 변환: 0 → -scrollDistance
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [`0${slideWidthUnit}`, `${-scrollDistance}${slideWidthUnit}`]
  );

  return (
    <Box
      ref={containerRef}
      component="section"
      sx={{
        // 세로 스크롤 영역: 트랙 너비에 비례 (gap + padding 포함)
        height: `${scrollHeight}vh`,
        position: 'relative',
      }}
    >
      {/* Sticky 컨테이너 - 화면에 고정 */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor,
        }}
      >
        {/* 가로 슬라이드 트랙 */}
        <motion.div
          style={{
            x,
            display: 'flex',
            gap,
            alignItems: 'center',
            height: '100%',
            paddingLeft: padding,
            paddingRight: padding,
          }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}

/**
 * HorizontalScroll.Slide - 슬라이드 아이템
 * 내부 콘텐츠 크기에 자연스럽게 맞춤 (fit-content)
 */
function Slide({ children }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content',
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

HorizontalScroll.Slide = Slide;

export default HorizontalScroll;
