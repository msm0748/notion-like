# 디자인 시스템 및 UI 가이드라인 (Design System & UI Guidelines)

본 프로젝트는 **나만의 Notion**을 위한 깔끔하고 직관적인 디자인을 지향합니다. UI 컴포넌트와 스타일링은 **Mantine**을 기반으로 구축하며, 아래의 디자인 토큰과 가이드라인을 준수합니다.

## 1. 타이포그래피 (Typography)

Notion과 유사한 가독성 높고 깔끔한 산세리프 폰트를 기본으로 사용합니다.

- **기본 폰트 (Font Family):**
  - 산세리프: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif`
  - 세리프 (선택적 텍스트용): `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`
  - 고정폭 (코드블록용): `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
- **폰트 크기 (Font Size):**
  - 본문 (Body): `16px` (Mantine 기본 `md`)
  - 제목 1 (H1): `32px` ~ `40px` (페이지 제목)
  - 제목 2 (H2): `24px` ~ `28px` (섹션 제목)
  - 제목 3 (H3): `20px` ~ `24px` (하위 섹션)
  - 작은 텍스트 (Small): `14px` (사이드바, 메타데이터 등)

## 2. 컬러 팔레트 (Color Palette)

Notion의 미니멀리즘을 반영하여, 흑백과 무채색(Gray)을 중심으로 구성하고 포인트 컬러를 최소화합니다. Mantine의 `theme` 설정에 아래 색상들을 맵핑하여 사용합니다.

### 2.1. 라이트 모드 (Light Mode) 기본

- **배경색 (Background):**
  - 메인 에디터 배경: `#FFFFFF` (White)
  - 사이드바 배경: `#F7F7F5`
  - 호버 배경: `#EFEFED`
- **텍스트 색상 (Text):**
  - 기본 텍스트: `#37352F`
  - 보조/설명 텍스트: `#787774` (Mantine `dimmed` 에 해당)
  - 플레이스홀더: `#9B9A97`
- **테두리 및 디바이더 (Border & Divider):**
  - 옅은 테두리: `#E9E9E7`

### 2.2. 다크 모드 (Dark Mode) 기본

- **배경색 (Background):**
  - 메인 에디터 배경: `#191919`
  - 사이드바 배경: `#202020`
  - 호버 배경: `#2C2C2C`
- **텍스트 색상 (Text):**
  - 기본 텍스트: `#FFFFFF` (또는 매우 밝은 회색 `#ECECEC`)
  - 보조/설명 텍스트: `#9B9A97`
- **테두리 및 디바이더 (Border & Divider):**
  - 옅은 테두리: `#2F2F2F`

### 2.3. 블록 및 텍스트 포인트 컬러 (Block Backgrounds & Text Colors)

에디터 내 텍스트 색상 변경 및 블록 배경색 기능에 사용되는 색상 세트입니다. (파스텔 톤 억제)

- **배경 (Backgrounds):**
  - Gray: `#F1F1EF` (Dark: `#252525`)
  - Brown: `#F4EEEE` (Dark: `#2F2723`)
  - Orange: `#FBECDD` (Dark: `#382800`)
  - Yellow: `#FBF3DB` (Dark: `#392E05`)
  - Green: `#EDF3EC` (Dark: `#0F291E`)
  - Blue: `#E7F3F8` (Dark: `#0B2838`)
  - Purple: `#F6F3F9` (Dark: `#28203B`)
  - Pink: `#FAF1F5` (Dark: `#321C28`)
  - Red: `#FDEBEC` (Dark: `#3E1515`)
- **텍스트 색상 포인트 (액센트 컬러):** 데이터 보존/경고, 혹은 링크 텍스트
  - 링크 (Link): `#0A85D1` (수정 가능성 높음)
  - 선택/드래그 (Selection): `#2383E2` (투명도 적용하여 사용)

## 3. 여백 및 레이아웃 (Spacing & Layout)

- **에디터 정렬:**
  - 기본적으로 중앙 정렬 (Max-width: `900px` 내외 제한)
  - 전체 너비(Full Width) 토글 옵션 지원 고려
- **여백 (Padding / Margin):**
  - 블록 간 여백: 상하 `2px` ~ `4px`로 밀집도 있게 구성 (Notion 특성 반영)
  - 사이드바 아이템 텍스트 패딩: 좌우 `8px`, 상하 `4px`
  - 페이지 상단 여백 (제목 위): 대략 `96px` ~ `120px` 정도로 넉넉하게 부여

## 4. 컴포넌트 특성 (Component Characteristics)

- **버튼 및 인터랙티브 요소:**
  - 기본적으로 외곽선이나 강한 그림자가 없는 'Ghost' 스타일 선호 (배경 투명, 호버 시 연한 회색 배경 표시 `[Mantine: variant="subtle"]`)
  - 모서리 둥글기(Border Radius): `4px` ~ `6px` (`sm` 정도)로 각진 편이 어울림.
- **아이콘:**
  - 얇고 미니멀한 라인 아이콘 사용 (예: `lucide-react` 또는 `tabler-icons-react`)
- **트랜지션 및 애니메이션:**
  - 마우스 호버 등 상태 변화 시 애니메이션 시간은 짧고 간결하게 (`0.1s ~ 0.2s` 수준) 적용하여 빠릿한 반응성을 제공.

## 5. 디자인 시스템 적용 규칙 (In Code)

1. 하드코딩된 색상 `#HEX` 값 사용을 최대한 피하고, **Mantine Theme Provider**에 위 팔레트를 오버라이딩하여 `theme.colors`로 접근하여 사용합니다.
2. 커스텀 CSS 속성이 필요할 경우 CSS Variables (CSS 변수) 맵핑을 통해 라이트모드/다크모드 스위칭 시 부드럽게 전환되게 합니다.
3. 컴포넌트 간 일관된 여백을 위해 Mantine의 `Stack`, `Group` 컴포넌트와 `gap` 속성을 적극 활용합니다.
