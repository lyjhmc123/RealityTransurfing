import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
  DocumentTitle,
  PageContainer,
  SectionTitle,
  TreeNode,
} from '../../components/storybookDocumentation';
import magazineData from '../../data/magazineData';

export default {
  title: 'Page/Magazine Data',
  parameters: {
    layout: 'padded',
  },
};

/**
 * 필드 테이블 렌더 헬퍼
 *
 * @param {Array} fields - 필드 목록 [Required]
 */
const renderFieldTable = (fields) => (
  <TableContainer sx={{ mb: 4 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
          <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {fields.map((field) => (
          <TableRow key={field.name}>
            <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{field.name}</TableCell>
            <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{field.type}</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontSize: 13 }}>{field.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

/**
 * 섹션 헤더 렌더 헬퍼
 *
 * @param {string} number - 섹션 번호 [Required]
 * @param {string} key - 데이터 키 [Required]
 * @param {string} description - 섹션 설명 [Required]
 */
const renderSectionHeader = (number, key, description) => (
  <>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
      {number}. {key}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      {description}
    </Typography>
  </>
);

export const Docs = {
  render: () => {
    const dataStructure = Object.fromEntries(
      Object.entries(magazineData).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return [key, Object.fromEntries(
            Object.entries(value).map(([k, v]) => {
              if (Array.isArray(v)) return [k, `Array(${v.length})`];
              if (typeof v === 'object' && v !== null) return [k, '{...}'];
              return [k, typeof v === 'string' && v.length > 40 ? v.slice(0, 40) + '...' : v];
            })
          )];
        }
        return [key, value];
      })
    );

    return (
      <>
        <DocumentTitle
          title="Magazine Data"
          status="Available"
          note="Content data for Intertext Magazine Issue No.1"
          brandName="Intertext"
          systemName="Magazine"
          version="1.0"
        />
        <PageContainer>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Magazine Data
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Intertext Magazine Issue No.1 - Reality Transurfing 전체 페이지에서 사용하는 텍스트/이미지 데이터입니다.
          </Typography>

          {/* 데이터 구조 */}
          <SectionTitle title="데이터 구조" description="magazineData 객체의 전체 계층 구조" />
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 4 }}>
            <Box sx={{ fontFamily: 'monospace' }}>
              {Object.entries(dataStructure).map(([key, value]) => (
                <TreeNode
                  key={key}
                  keyName={key}
                  value={value}
                  depth={0}
                  defaultOpen={false}
                />
              ))}
            </Box>
          </Box>

          {/* 섹션별 데이터 필드 */}
          <SectionTitle title="섹션별 데이터 필드" description="각 섹션에서 사용하는 필드 목록" />

          {renderSectionHeader('1', 'intro', '매거진 표지 섹션')}
          {renderFieldTable([
            { name: 'logo', type: 'string', description: '매거진 로고 텍스트' },
            { name: 'subtitle', type: 'string', description: '서브타이틀' },
            { name: 'title', type: 'string', description: '메인 타이틀' },
            { name: 'leadText', type: 'string', description: '리드 문단' },
            { name: 'footerText', type: 'string', description: '하단 안내 텍스트' },
          ])}

          {renderSectionHeader('2', 'editorLetter', '에디터 레터 섹션')}
          {renderFieldTable([
            { name: 'coverImage', type: 'string (URL)', description: '커버 이미지 URL' },
            { name: 'headline', type: 'string', description: '헤드라인 제목' },
            { name: 'bodyText', type: 'string', description: '본문 텍스트' },
            { name: 'ctaText', type: 'string', description: 'CTA 버튼 텍스트' },
            { name: 'tag', type: 'string', description: '섹션 태그' },
          ])}

          {renderSectionHeader('3', 'index', '목차 섹션')}
          {renderFieldTable([
            { name: 'label', type: 'string', description: '섹션 라벨' },
            { name: 'headline', type: 'string', description: '헤드라인' },
            { name: 'items', type: 'Array(5)', description: '목차 항목 배열 (id, title, description)' },
          ])}

          {renderSectionHeader('4', 'comments', '트랜서핑에 대한 말말말 섹션')}
          {renderFieldTable([
            { name: 'sectionTitle', type: 'string', description: '섹션 제목' },
            { name: 'comments', type: 'Array(8)', description: '댓글 배열 (id, text)' },
          ])}

          {renderSectionHeader('5', 'terms', '트랜서핑 주요 용어 섹션')}
          {renderFieldTable([
            { name: 'sectionTitle', type: 'string', description: '섹션 제목' },
            { name: 'leadText', type: 'string', description: '리드 텍스트' },
            { name: 'termsListLeadText', type: 'string', description: '전체보기 리드 텍스트' },
            { name: 'featured', type: 'Array(5)', description: '주요 용어 (id, thumbnail, title, description, body, quotes)' },
            { name: 'extra', type: 'Array(3)', description: '추가 용어 (id, thumbnail, title, description, body, quotes)' },
          ])}

          {renderSectionHeader('6', 'articles', '직접 작성한 아티클 섹션')}
          {renderFieldTable([
            { name: 'sectionTitle', type: 'string', description: '섹션 제목' },
            { name: 'items', type: 'Array(3)', description: '아티클 배열 (id, coverImage, headline, leadText, tag, author, date, body, sections, quotes)' },
          ])}

          {renderSectionHeader('7', 'stories', '트랜서핑 인터뷰 섹션')}
          {renderFieldTable([
            { name: 'sectionTitle', type: 'string', description: '섹션 제목' },
            { name: 'items', type: 'Array(3)', description: '인터뷰 배열 (id, coverImage, headline, subtitle, leadText, tag, body, quotes)' },
          ])}

          {renderSectionHeader('8', 'survey', '설문조사 결과 섹션')}
          {renderFieldTable([
            { name: 'sectionTitle', type: 'string', description: '섹션 제목' },
            { name: 'headline', type: 'string', description: '헤드라인' },
            { name: 'leadText', type: 'string', description: '리드 텍스트' },
            { name: 'surveys', type: 'Array(5)', description: '설문 항목 배열 (question, result, description)' },
          ])}

          {renderSectionHeader('9', 'outro', '마무리 인사 섹션')}
          {renderFieldTable([
            { name: 'titles', type: 'Array(3)', description: '타이틀 텍스트 배열 (text)' },
            { name: 'ctaText', type: 'string', description: 'CTA 버튼 텍스트' },
            { name: 'links', type: 'Array(2)', description: '링크 배열 (label)' },
          ])}

          {renderSectionHeader('10', 'footer', '푸터 섹션')}
          {renderFieldTable([
            { name: 'logo', type: 'string', description: '로고 텍스트' },
            { name: 'instagramHandle', type: 'string', description: '인스타그램 핸들' },
            { name: 'instagramUrl', type: 'string (URL)', description: '인스타그램 URL' },
            { name: 'copyright', type: 'string', description: '저작권 표시' },
          ])}

          {/* 사용 예시 */}
          <SectionTitle title="사용 예시" description="magazineData 임포트 및 활용 방법" />
          <Box
            component="pre"
            sx={{
              backgroundColor: 'grey.100',
              p: 2,
              fontSize: 12,
              fontFamily: 'monospace',
              overflow: 'auto',
              borderRadius: 1,
              mb: 4,
            }}
          >
{`import magazineData from '../data/magazineData';

// 인트로 타이틀
<Typography>{magazineData.intro.title}</Typography>

// 용어 카드 렌더링
{magazineData.terms.featured.map((term) => (
  <Card key={term.id}>
    <img src={term.thumbnail} alt={term.title} />
    <Typography>{term.title}</Typography>
    <Typography>{term.description}</Typography>
  </Card>
))}

// 아티클 목록
{magazineData.articles.items.map((article) => (
  <ArticleCard
    key={article.id}
    headline={article.headline}
    leadText={article.leadText}
    coverImage={article.coverImage}
  />
))}`}
          </Box>

          {/* Vibe Coding Prompt */}
          <SectionTitle
            title="Vibe Coding Prompt"
            description="AI 코딩 도구에서 활용할 수 있는 프롬프트 예시"
          />
          <Box
            component="pre"
            sx={{
              backgroundColor: 'grey.900',
              color: 'grey.100',
              p: 2,
              fontSize: 12,
              fontFamily: 'monospace',
              overflow: 'auto',
              borderRadius: 1,
            }}
          >
{`"magazineData.intro 데이터를 사용해서 히어로 섹션을 만들어줘.
title은 h1, leadText는 body1으로 렌더링해줘."

"magazineData.terms.featured 배열을 카드 그리드로 보여줘.
각 카드에 thumbnail, title, description을 표시해줘."

"magazineData.stories.items를 사용해서 인터뷰 섹션을 만들어줘.
coverImage를 배경으로, headline과 leadText를 오버레이로 보여줘."`}
          </Box>
        </PageContainer>
      </>
    );
  },
};
