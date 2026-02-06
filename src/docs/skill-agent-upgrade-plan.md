# Rules + Skill 구조 업그레이드 계획

> 현재 룰/서브룰 기반 컨텍스트 관리를 Skill 기반으로 업그레이드하는 계획
> 참조: `src/docs/ai-design-system-comprehensive-guide.md`

---

## 현재 상태 진단

```
CLAUDE.md (세션 시작 시)
  → 12개 서브룰 전부 로드 (2,602줄)
  → taxonomy 906줄, storybook-writing 575줄 포함
  → 컴포넌트 안 만드는 세션에서도 전부 로드됨
```

**문제점:**
- 16KB 이상 컨텍스트는 20-30% 성능 저하와 상관관계 (가이드 문서 근거)
- LLM은 150-200개 지시사항만 일관되게 따를 수 있음
- 매 세션마다 모든 규칙을 올리는 방식 → 컨텍스트 낭비

---

## 제안 구조

```
.claude/
├── CLAUDE.md                          ← 축소 (~80줄, 라우터 역할)
│
├── rules/                             ← 항상 로드 (~624줄)
│   ├── project-summary.md             49줄  CRITICAL
│   ├── mui-grid-usage.md              61줄  CRITICAL
│   ├── code-convention.md             60줄  MUST
│   ├── design-system.md               53줄  MUST
│   ├── project-directory.md           94줄  MUST
│   ├── components.md                  95줄  Reference (항상 로드 유지)
│   ├── easy-refactoring.md            40줄  SHOULD
│   └── mui-theme.md                   92줄  SHOULD
│
└── skills/
    └── component-work/                ← 컴포넌트 생성/수정/삭제 시 활성화
        ├── SKILL.md                   (~100줄, 워크플로우 핵심)
        └── resources/
            ├── taxonomy-v0.4.md       (906줄 → 필요 시만 Read)
            ├── taxonomy-index.md      (106줄 → 필요 시만 Read)
            ├── storybook-writing.md   (575줄 → 스토리 작성/수정 시 Read)
            └── interactive-principles.md (347줄 → 인터랙티브 작업 시만 Read)
```

---

## 각 요소의 역할 분담

| 구분 | 담당 | 이유 |
|------|------|------|
| **Rules** (8개) | 코드 컨벤션, Grid import, 디렉토리 구조, 컴포넌트 목록 | 어떤 작업이든 항상 필요한 기본 규칙 |
| **Skill** (1개) | 컴포넌트 생성/수정/삭제 워크플로우 + 텍소노미 안내 + 스토리 규칙 | 의도 기반 활성화, 참조 자료 점진적 로딩 |
| **Agent** | 현재 불필요 | 프로젝트 규모에 비해 과도. 병렬 독립 작업이 필요한 시점에 도입 |

---

## Skill: component-work 핵심 설계

### 활성화 조건

| 의도 | 트리거 예시 |
|------|-----------|
| 컴포넌트 생성 | "만들어줘", "새로 필요해", "추가하고 싶어" |
| 컴포넌트 수정 | "수정해줘", "추가해줘", "개선해줘", "변경해줘" |
| 컴포넌트 삭제 | "삭제해줘", "제거해줘" |
| 스토리 작업 | "스토리 수정", "argTypes 추가", "스토리 작성" |

### SKILL.md (~100줄)가 하는 일

```
[공통] 사용자 의도 분기
  ├── 생성 → 생성 워크플로우
  ├── 수정 → 수정 워크플로우
  ├── 삭제 → 삭제 워크플로우
  └── 스토리 → 스토리 워크플로우

[생성 워크플로우]
1. 사용자 의도 파악
   "카드 컴포넌트 만들어줘" → 카드인 건 알겠는데, 어떤 카드?

2. taxonomy-index.md Read → 카테고리 후보 제시
   "Card 카테고리에 이런 원형들이 있습니다:
    BaseCard, MediaCard, BentoCard, ExpandingCard...
    어떤 방향인가요?"

3. components.md 확인 (rules에서 이미 로드됨)
   "현재 CardContainer, CustomCard, ImageCard가 있습니다.
    기존 것으로 커버 가능한지, 새로 만들어야 하는지?"

4. 사용자 결정 후 → 구현
   - project-directory.md 규칙에 따라 위치 결정
   - storybook-writing.md Read → 스토리 작성
   - 인터랙티브 요소 감지 시 → interactive-principles.md Read
   - components.md 업데이트
   - ruleRelationships.js 동기화 (해당 시)

[수정 워크플로우]
1. 대상 컴포넌트 파악 (components.md는 이미 로드됨)
2. 현재 동작/코드 확인
3. 수정 구현
4. storybook-writing.md Read → 스토리 동기화
5. components.md 설명 업데이트 (기능 변경 시)

[삭제 워크플로우]
1. 의존성 확인
2. 컴포넌트 + 스토리 파일 삭제
3. components.md에서 항목 제거

[스토리 워크플로우]
1. storybook-writing.md Read → 규칙 확인
2. 스토리 수정/작성
```

### 핵심 포인트

텍소노미를 "이 중에서 골라라"가 아니라 **"당신이 만들려는 게 이런 맥락이 맞나요?"** 로 활용.
사용자의 모호한 의도를 체계적으로 구체화하는 대화형 가이드 역할.

### 텍소노미 활용 원칙

- 텍소노미는 100% 절대 기준이 아님
- 확장성 있는 카테고리 제공이 목적
- 사용자의 불확실한 목적을 체계적으로 구체화
- 텍소노미에 없는 패턴도 가장 가까운 카테고리에 배치 가능

---

## 시뮬레이션 검증

6개 실제 시나리오로 적합성 검증 완료.

### 시나리오별 결과

| # | 시나리오 | Skill | 로드량 | 판정 |
|---|---------|-------|-------|------|
| 1 | "모달처럼 확장되는 카드 만들어줘" | 활성화 | 1,752줄 | ✅ |
| 2 | "CustomCard에 그라데이션 추가해줘" | 활성화 | ~1,300줄 | ✅ |
| 3 | "테마 primary 색상 변경해줘" | 미활성화 | 624줄 | ✅ |
| 4 | "패럴랙스 히어로 섹션 만들어줘" | 활성화 | 1,752줄 | ✅ |
| 5 | "어떤 레이아웃 컴포넌트가 있어?" | 미활성화 | 624줄 | ✅ |
| 6 | "ImageCarousel 스토리에 argTypes 추가" | 활성화 | ~1,300줄 | ✅ |

### 시뮬레이션에서 발견된 Gap과 해결

원래 계획(`create-component` + `components.md` skill 이동)에서 3개 Gap 발견:

| Gap | 원인 | 해결 |
|-----|------|------|
| 컴포넌트 수정 시 규칙 공백 | Skill이 "생성"만 커버 | Skill → `component-work`로 확장 |
| 스토리 수정 시 규칙 공백 | 스토리 작업이 Skill 범위 밖 | Skill 트리거에 스토리 작업 포함 |
| 컴포넌트 조회 시 목록 미로드 | `components.md`가 skill resource | `components.md`를 rules/에 유지 |

**추가 비용**: components.md 95줄 (+3.6%). 모든 Gap 해결.

---

## 하지 않는 것 (오버 엔지니어링 방지)

| 하지 않는 것 | 이유 |
|-------------|------|
| Agent 도입 | 1인 작업 기준, 병렬 독립 실행이 필요한 규모가 아님 |
| 다수 Skill 분리 | component-work 하나로 80% 커버. 나머지는 rules로 충분 |
| path-based rules | 프로젝트가 작아서 경로 매칭 오버헤드가 이득보다 큼 |
| llms.txt 생성 | 외부 AI 도구 연동이 목적이 아닌 내부 운영용 |
| MCP 서버 | 현재 Figma 연동 등 외부 도구 연결 필요 없음 |

---

## 마이그레이션 단계

### Phase 1: Skill 구조 생성 + resources 이동

1. `.claude/skills/component-work/` 디렉토리 생성
2. `SKILL.md` 작성 (~100줄, 생성/수정/삭제/스토리 분기 포함)
3. taxonomy, index, storybook-writing, interactive-principles를 resources/로 복사

### Phase 2: CLAUDE.md 축소 (라우터 역할로 전환)

1. Skill로 이동된 SHOULD급 규칙 참조 제거 (storybook-writing, interactive-principles)
2. Reference 문서 참조 제거 (taxonomy, index)
3. Workflow 섹션 간소화 → skill이 담당하는 부분 위임
4. `components.md`는 rules/에 유지 (참조 유지)

### Phase 3: rules에서 Skill resource로 이동된 문서 정리

1. storybook-writing.md → skill resource로 이동 (rules에서 제거)
2. interactive-component-principles.md → skill resource로 이동 (rules에서 제거)
3. taxonomy, index → skill resource로 이동 (rules에서 제거)
4. **components.md → rules에 유지** (수정/조회 시 항상 필요)
5. easy-refactoring.md, mui-theme.md → rules에 유지

### Phase 4: 검증 + 동기화

1. `pnpm build-storybook` 빌드 확인
2. `src/data/ruleRelationships.js` 업데이트 (skill 노드/엣지 추가)
3. Storybook `Overview/Rule Relationships` 시각화 업데이트

---

## 예상 효과

| 지표 | Before | After |
|------|--------|-------|
| 세션 시작 시 로드 | 2,602줄 | ~624줄 (rules만) |
| 비컴포넌트 작업 시 | 2,602줄 | ~624줄 (76% 절약) |
| 컴포넌트 작업 최대 | 2,602줄 | ~1,752줄 (33% 절약) |
| 텍소노미 로드 | 매 세션 | 컴포넌트 작업 시만 |
| 컴포넌트 가이드 | 체크리스트 (수동) | 대화형 워크플로우 (자동) |
| 카테고리 결정 | 사용자가 직접 찾아야 함 | Skill이 후보 제시 + 확인 |
| 시나리오 Gap | - | 0개 (시뮬레이션 검증 완료) |

---

## 향후 확장 가능성 (현재는 하지 않음)

- **Agent 도입 시점**: 팀 규모 확대, 병렬 독립 작업 필요 시
- **추가 Skill 후보**: design-token-audit (토큰 감사), accessibility-check (접근성 검증)
- **MCP 서버**: Figma 연동 필요 시 Figma MCP 도입
- **path-based rules**: 프로젝트 규모 확대 시 경로별 규칙 분리

---

*문서 작성: 2026-02-04*
*시뮬레이션 검증: 2026-02-04*
*상태: 계획 단계 (미구현)*
