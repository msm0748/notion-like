# Notion Clone

React + Supabase 기반의 Notion 스타일 웹 애플리케이션입니다.

## 기술 스택

| 영역          | 기술                         |
| ------------- | ---------------------------- |
| 프레임워크    | React 19, TypeScript         |
| 빌드          | Vite 8                       |
| UI            | Mantine 8, Emotion           |
| 라우팅        | TanStack Router (파일 기반)  |
| 서버 상태     | TanStack React Query v5      |
| 에디터        | BlockNote                    |
| 백엔드        | Supabase (Auth + PostgreSQL) |
| 패키지 매니저 | pnpm                         |

## 주요 기능

- Google 소셜 로그인
- 페이지 생성 / 편집 / 삭제 (소프트 삭제 + 휴지통)
- BlockNote 기반 블록 에디터 (헤딩, 코드블록, 테이블, 하위 페이지 등)
- 즐겨찾기
- 페이지 제목 검색
- 하위 페이지 (트리 구조)

## 시작하기

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd notion
pnpm install
```

### 2. Supabase 프로젝트 생성 및 키 발급

1. [Supabase](https://supabase.com)에 접속하여 로그인합니다.
2. **New Project**를 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 생성 후 **Project Settings → API** 메뉴로 이동합니다.
4. 아래 두 값을 복사합니다.
   - **Project URL** — `https://xxxxx.supabase.co` 형태
   - **anon (public) key** — `eyJhbG...` 형태의 JWT

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고, 위에서 복사한 값을 넣습니다.

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 4. 데이터베이스 테이블 생성

Supabase 대시보드의 **SQL Editor**에서 아래 SQL을 실행합니다.

```sql
-- pages 테이블
create table pages (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references auth.users(id),
  title text not null default '',
  content jsonb,
  "parentId" uuid references pages(id),
  "isShared" boolean not null default false,
  "isTrashed" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- favorites 테이블
create table favorites (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null,
  "pageId" uuid not null references pages(id),
  "createdAt" timestamptz not null default CURRENT_TIMESTAMP,
  unique ("userId", "pageId")
);

-- 인덱스
create index "pages_userId_idx" on pages ("userId");
create index "pages_parentId_idx" on pages ("parentId");
create index "favorites_userId_idx" on favorites ("userId");

-- RLS 활성화
alter table pages enable row level security;
alter table favorites enable row level security;

-- pages RLS 정책
create policy "Users can view own or shared pages"
  on pages for select
  using (auth.uid() = "userId" or "isShared" = true);

create policy "Users can insert own pages"
  on pages for insert
  with check (auth.uid() = "userId");

create policy "Users can update own pages"
  on pages for update
  using (auth.uid() = "userId");

create policy "Users can delete own pages"
  on pages for delete
  using (auth.uid() = "userId");

-- favorites RLS 정책
create policy "Users can select own favorites"
  on favorites for select
  using (auth.uid() = "userId");

create policy "Users can insert own favorites"
  on favorites for insert
  with check (auth.uid() = "userId");

create policy "Users can update own favorites"
  on favorites for update
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");

create policy "Users can delete own favorites"
  on favorites for delete
  using (auth.uid() = "userId");

-- 이미지 스토리지 버킷
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'page-images',
  'page-images',
  true,
  10485760,
  array['image/jpeg','image/png','image/gif','image/webp','image/svg+xml']
);

-- 스토리지 RLS 정책
create policy "Authenticated users can upload images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'page-images');

create policy "Anyone can view page images"
  on storage.objects for select
  using (bucket_id = 'page-images');

create policy "Users can update own images"
  on storage.objects for update to authenticated
  using (bucket_id = 'page-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'page-images' and (storage.foldername(name))[1] = auth.uid()::text);
```

### 5. Google 로그인 설정

#### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com)에 접속합니다.
2. 프로젝트를 선택하거나 새로 만듭니다.
3. **API 및 서비스 → OAuth 동의 화면**으로 이동합니다.
   - User Type: **외부** 선택
   - 앱 이름, 지원 이메일 등 필수 항목을 입력하고 저장합니다.
4. **API 및 서비스 → 사용자 인증 정보**로 이동합니다.
5. **+ 사용자 인증 정보 만들기 → OAuth 클라이언트 ID**를 클릭합니다.
   - 애플리케이션 유형: **웹 애플리케이션**
   - 승인된 리디렉션 URI에 아래 값을 추가합니다:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (`xxxxx` 부분은 본인 Supabase 프로젝트 URL에 맞게 변경)
6. 생성 후 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 복사합니다.

#### Supabase에 Google Provider 등록

1. Supabase 대시보드에서 **Authentication → Providers**로 이동합니다.
2. **Google**을 찾아 활성화합니다.
3. 위에서 복사한 값을 입력합니다:
   - **Client ID** — Google OAuth 클라이언트 ID
   - **Client Secret** — Google OAuth 클라이언트 보안 비밀번호
4. **Save**를 클릭합니다.

### 6. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 스크립트

| 명령어         | 설명                       |
| -------------- | -------------------------- |
| `pnpm dev`     | 개발 서버 실행 (포트 3000) |
| `pnpm build`   | 프로덕션 빌드              |
| `pnpm preview` | 빌드 결과 미리보기         |
| `pnpm lint`    | ESLint 검사                |

## 프로젝트 구조

```
src/
├── app/              # AuthProvider, MantineProvider, 테마
├── entities/         # 도메인 모델 (pages, auth)
│   ├── auth/         #   AuthContext, useAuth
│   └── pages/        #   Supabase API, React Query options, 타입
├── features/         # 기능 단위 모듈
│   ├── auth/         #   Google OAuth UI/API
│   ├── editor/       #   BlockNote 에디터 (스키마, UI)
│   └── pages/        #   페이지 CRUD 뮤테이션, 검색 모달
├── routes/           # TanStack Router 파일 기반 라우트
│   ├── _layout/      #   인증 필요 레이아웃 (홈, 페이지, 휴지통)
│   └── login/        #   로그인 페이지
├── shared/           # 공통 유틸, 상수, Supabase 클라이언트
└── widgets/          # 레이아웃 위젯 (사이드바, MainLayout)
```
