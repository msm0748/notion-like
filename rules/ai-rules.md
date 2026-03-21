# 프로젝트 규칙 (Project Rules)

본 프로젝트는 **나만의 Notion과 같은 서비스**를 구축하기 위한 프로젝트입니다. 개발을 진행할 때 아래에 정의된 기술 스택과 아키텍처 원칙(FSD)을 반드시 준수해야 합니다.

## 1. 핵심 기술 스택 (Tech Stack)

- **프레임워크:** TanStack Start (SSR 및 라우팅)
- **상태 관리 및 데이터 페칭:** TanStack Query (React Query)
- **UI / CSS 라이브러리:** Mantine
- **패키지 매니저:** pnpm

## 2. 아키텍처: FSD (Feature-Sliced Design)

프로젝트의 폴더 구조와 모듈 분리는 **FSD (Feature-Sliced Design)** 구조를 엄격하게 따릅니다.

### 2.1 레이어 구성 (상위 → 하위)

> **단방향 의존성 원칙:** 상위 레이어는 하위 레이어를 import 할 수 있지만, 하위 레이어는 상위 레이어를 import 할 수 없습니다.

1. **app:** 애플리케이션 초기화, 전역 설정, 전역 스타일, 프로바이더(Provider) 등
2. **pages(또는 routes):** 화면의 전체 페이지 (TanStack Start의 File-based Routing 적용)
3. **widgets:** 여러 Feature와 Entity를 조합하여 만든 독립적이고 복합적인 UI 블록 (예: `Sidebar`, `EditorWorkspace`, `TopNav`)
4. **features:** 특정 비즈니스 가치를 지니는 사용자 상호작용 및 오퍼레이션. 주로 데이터의 **CUD (Create, Update, Delete)**를 담당합니다. (예: `CreateDocument`, `BlockFormatting`, `AuthAction`)
5. **entities:** 비즈니스 핵심 도메인 모델, 타입 및 상태 관리. 주로 데이터의 **Read**만 담당합니다. (예: `Document`, `Block`, `User`, `Workspace`)
6. **shared:** 비즈니스 로직에 종속되지 않는 재사용 가능한 코드 (예: `ui`(Mantine 래퍼), `api`, `config`, `lib`, `hooks` 등)

### 2.2 Public API 원칙 (공개 인터페이스)

모든 슬라이스(Slice)는 반드시 **루트의 `index.ts`를 통해서만 외부에 공개**해야 합니다. 이것이 해당 슬라이스의 유일한 진입점(Entry Point)입니다.

#### 핵심 규칙

- **외부 모듈은 슬라이스의 내부 파일에 직접 접근할 수 없습니다.** 반드시 `index.ts`를 통해서만 import 합니다.
- `index.ts`에서 **명시적으로 export하지 않은 것은 모두 비공개(private)**로 간주합니다. 내부 구현 상세(헬퍼 함수, 내부 상수, 내부 컴포넌트 등)는 외부에 노출하지 않습니다.
- 이를 통해 슬라이스 내부 구현을 자유롭게 리팩터링하더라도 외부에 영향을 주지 않는 **캡슐화**를 보장합니다.

#### 올바른 import 예시

```ts
// ✅ 올바름: index.ts(Public API)를 통한 import
import { LoginForm } from '@/features/auth'
import { DocumentCard, type Document } from '@/entities/document'
import { apiClient } from '@/shared/api'

// ❌ 금지: 슬라이스 내부 파일에 직접 접근
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useDocumentQuery } from '@/entities/document/api/queries'
import { formatDate } from '@/shared/api/date/formatDate'
```

#### 슬라이스 내부 구조 및 `index.ts` 작성 예시

```
src/features/auth/
├── ui/
│   ├── LoginForm.tsx        # 내부 컴포넌트
│   └── LogoutButton.tsx     # 내부 컴포넌트
├── model/
│   ├── useAuth.ts           # 내부 훅
│   └── types.ts             # 내부 타입
├── api/
│   └── authApi.ts           # 내부 API 호출 로직
└── index.ts                 # ✅ 유일한 공개 진입점
```

```ts
// src/features/auth/index.ts

// 외부에 필요한 것만 선별적으로 export
export { LoginForm } from './ui/LoginForm'
export { LogoutButton } from './ui/LogoutButton'
export { useAuth } from './model/useAuth'
export type { AuthUser, AuthState } from './model/types'

// authApi 내부의 세부 함수는 export하지 않음 → 비공개 유지
```

### 2.3 슬라이스 내부 세그먼트 (Segment) 구성

각 슬라이스 내부는 역할별로 다음 세그먼트 폴더를 사용하여 관심사를 분리합니다.

- **`ui/`** — 컴포넌트, UI 관련 로직
- **`model/`** — 비즈니스 로직, 상태(store), 타입 정의, 훅
- **`api/`** — 서버 요청 관련 함수 (TanStack Query의 queryFn, mutationFn 등)
- **`lib/`** — 슬라이스 내부에서만 쓰이는 유틸리티 함수
- **`config/`** — 슬라이스 관련 설정 값, 상수

> 모든 세그먼트가 항상 필요한 것은 아닙니다. 슬라이스의 복잡도에 따라 필요한 세그먼트만 생성합니다.

### 2.4 Cross-Import 원칙

같은 레이어 내의 슬라이스끼리는 **기본적으로 서로 직접 import 할 수 없습니다.** 상위 레이어에서 조합하거나 shared로 내리는 것이 원칙입니다.

단, entity 간에 서로를 참조해야 하는 경우가 발생할 수 있으며, 이때는 아래 전략을 사용합니다.

#### 전략 : Cross-Import Public API (`@x` 디렉터리)

참조 대상 entity 내부에, **참조하는 측 전용 Public API**를 `@x/` 디렉터리에 둡니다.

```
src/entities/document/
├── @x/
│   ├── block.ts          # block entity 전용 Public API
│   └── user.ts           # user entity 전용 Public API
├── ui/
├── model/
├── api/
└── index.ts              # 기본 Public API
```

```ts
// src/entities/document/@x/block.ts
// block entity에서 사용할 수 있는 부분만 선별적으로 export
export type { Document } from '../model/types'
```

```ts
// src/entities/block/model/types.ts
// @x를 통한 명시적 Cross-Import
import type { Document } from '@/entities/document/@x/block'

export interface Block {
  id: string
  content: string
  document: Document
}
```

이 방식은 entity 간 의존 관계를 코드 구조에서 명확하게 드러내고, 무분별한 상호 참조를 방지합니다.

```ts
// ❌ 금지: 일반 index.ts를 통한 같은 레이어 간 직접 import
import { Document } from '@/entities/document'

// ✅ 허용: @x를 통한 명시적 Cross-Import
import type { Document } from '@/entities/document/@x/block'
```

### 2.5 폴더 구조 전체 요약

```
src/
├── app/                          # 레이어: 앱 초기화, 프로바이더, 전역 설정
│   ├── providers/
│   ├── styles/
│   └── index.ts
│
├── routes/                       # 레이어: 페이지 (TanStack Start File-based Routing)
│   ├── index.tsx
│   ├── documents.$id.tsx
│   └── ...
│
├── widgets/                      # 레이어: 복합 UI 블록
│   ├── sidebar/
│   │   ├── ui/
│   │   ├── model/
│   │   └── index.ts
│   └── editor-workspace/
│       ├── ui/
│       ├── model/
│       └── index.ts
│
├── features/                     # 레이어: 비즈니스 액션 (CUD)
│   ├── auth/
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts              # ✅ Public API
│   └── create-document/
│       ├── ui/
│       ├── model/
│       ├── api/
│       └── index.ts              # ✅ Public API
│
├── entities/                     # 레이어: 도메인 모델 (Read)
│   ├── document/
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.ts              # ✅ Public API
│   ├── block/
│   │   ├── ui/
│   │   ├── model/
│   │   └── index.ts              # ✅ Public API
│   └── user/
│       ├── ui/
│       ├── model/
│       └── index.ts              # ✅ Public API
│
└── shared/                       # 레이어: 비즈니스 무관 공용 코드
    ├── api/
    │   └── index.ts
    ├── ui/
    │   └── index.ts
    ├── lib/
    │   └── index.ts
    ├── config/
    │   └── index.ts
    └── hooks/
        └── index.ts
```

## 3. 도메인 (Notion Clone) 주요 요구사항 (Entities & Features)

- **블록 기반 에디터 (Block-based Editor):** 텍스트, 이미지, 체크리스트 등 다양한 블록 타입 지원
- **계층형 문서 구조 (Nested Documents):** 무한 뎁스(Depth)로 이어지는 트리 구조의 문서 네비게이션
- **상태 동기화:** TanStack Query를 기반으로 빠른 데이터 브라우징 및 자동 저장(Auto-save) 구현

## 4. 컴포넌트 및 스타일 작성 규칙

- UI 개발 시에는 최대한 **Mantine 라이브러리**의 컴포넌트 및 Hooks를 활용합니다.
- 복잡한 사용자 상호작용은 개별 `features`로 분리하여 관리합니다.
- 데이터 로딩, 캐싱, 뮤테이션(변경) 등 서버와의 동기화 작업은 모두 **TanStack Query** 기반으로 작성하며, 비동기 로직과 UI를 명확하게 분리합니다.
- Mantine 컴포넌트의 스타일을 커스터마이징할 때는 **React의 `style` 속성 대신 Mantine의 `sx` 속성을 사용해야 합니다.**

### Mantine 스타일 규칙

- Mantine 컴포넌트에 스타일을 적용할 때는 **`style` prop 사용을 지양합니다.**
- 대신 Mantine의 **`sx` prop**을 사용하여 스타일을 작성합니다.
- `sx`를 사용하면 Mantine theme 시스템과의 호환성을 유지할 수 있습니다.

예시:

```tsx
<Box
  sx={{
    padding: 16,
    backgroundColor: 'gray.0',
    borderRadius: 8,
  }}
/>
```
