# temp-client

`../temp_webview`(Expo + react-native-webview 셸)이 배포된 https 주소로 띄우는 웹.
모바일 전용, 페이지 여러 개.

> 팀 규칙은 이 파일 하나에만 적는다. Codex는 이 파일을, Claude Code는 `CLAUDE.md`(`@AGENTS.md` 한 줄)로 같은 내용을 읽는다. `CLAUDE.md`에 규칙을 직접 적지 않기

## 스택 (바꾸지 않기)

- Vite + React + TypeScript. Next.js 쓰지 않음 (SSR 없음, `'use client'` 불필요)
- 라우팅: `react-router` (`createBrowserRouter`)
- 스타일: Tailwind CSS v4 (`@tailwindcss/vite`, 설정 파일 없이 `src/index.css`의 `@import "tailwindcss"`). shadcn/ui 쓰지 않음
- 상태: Zustand
- API: axios (`src/lib/api.ts`)
- 아이콘: `lucide-react`만. 다른 아이콘 라이브러리·커스텀 SVG 아이콘 금지
- 패키지 매니저: yarn 1 (`packageManager: yarn@1.22.22`). npm/pnpm 명령 쓰지 않기, `package-lock.json` 만들지 않기
- Node 24: `.node-version`으로 이 프로젝트만 고정, `engines: >=24 <25`. 명령 실행 전 `node -v`가 24인지 확인

## 명령

- `yarn dev`: 개발 서버 (`host: true`라 같은 와이파이 휴대폰에서 접속 가능)
- `yarn build`: `tsc -b && vite build` → `dist/`
- `yarn lint`: oxlint
- 변경 후 `yarn build`와 `yarn lint` 통과 확인

## 폴더 구조 (추가 시 위치 준수)

```
src/
├─ main.tsx              # 라우터 정의. 페이지 추가 시 children에 한 줄
├─ index.css             # Tailwind import + @theme 브랜드 토큰 + 전역 스타일
├─ pages/                # 화면 단위: XxxPage.tsx
├─ components/
│  ├─ common/            # 여러 페이지 공통: Layout, Header, Button, Card 등 프리미티브
│  ├─ widgets/<기능>/    # 특정 기능 전용 컴포넌트 (예: widgets/feed/FeedCard.tsx)
│  └─ dialog/<기능>/     # 모달 (예: dialog/profile/EditProfileDialog.tsx)
├─ stores/               # Zustand 스토어: useXxxStore.ts
└─ lib/                  # api.ts, utils.ts(cn) 등 유틸
public/assets/           # 이미지(PNG). `/assets/파일명.png`로 참조
```

- 판단 기준: 여러 페이지 공통 → `common/`, 특정 기능 전용 → `widgets/<기능>/`, 모달 → `dialog/<기능>/`
- `ui/` 폴더 없음 (shadcn 미사용). 기본 부품도 `common/`에 직접 만든다
- 기능 폴더 안에 `hooks/`로 관련 훅 분리 가능
- 여러 곳에서 쓰는 타입이 생기면 `src/types/<도메인>.ts`. 한 곳에서만 쓰면 그 파일 안에 둔다
- 입력창(`TextField`) 같은 범용 폼 부품은 기능 이름을 붙이지 말고 `common/`에 (`SignupTextField` ✗ → `common/TextField` ○)
- 레이아웃: `components/common/Layout.tsx`가 402px(`max-w-100.5`, 디자인 시안 기준) 중앙 프레임 + `Header` + `<main>`(`<Outlet />`) + `BottomNavigation`
  - 페이지는 `<main>` 안에 들어가므로 최상위를 `<section className="flex-1 ...">`로 (`main`, `min-h-dvh` 쓰지 않기)
  - 하단 탭 추가: `BottomNavigation.tsx`의 `tabs` 배열에 한 줄 + `main.tsx`에 라우트
  - 디자인 확정 전 임시 구현. 디자인이 나오면 Header/BottomNavigation은 새로 만든다

## 파일 명명

- 컴포넌트·페이지: PascalCase `.tsx` (`FeedCard.tsx`, `FeedPage.tsx`)
- 스토어: `use` + 도메인 + `Store` `.ts` (`useFeedStore.ts`)
- 유틸·훅: camelCase `.ts` (`utils.ts`, `useScroll.ts`)
- import는 `@/` 절대 경로 (`@/components/common/Layout`)

## 상태 관리 (Zustand)

- 큰 도메인(DB 테이블·API 리소스)마다 스토어 파일 하나 (Redux slice 하나 = 스토어 하나). 루트 스토어·`stores/index`·Provider 없음
- slices pattern(여러 slice를 스토어 하나로 합치기) 쓰지 않음. 다른 스토어 값은 `useXxxStore.getState()`로 읽기
- 상태 + 액션(동기/비동기)을 한 스토어에. `createAsyncThunk` 대신 스토어 안 async 함수에서 `api` 호출
- **API 호출은 해당 도메인 스토어 안에.** `lib/api.ts`는 axios 설정과 `handleApiError`만 두고 엔드포인트 함수를 넣지 않음. `api/xxx.ts` 같은 엔드포인트 모음 파일 만들지 않기
- 컴포넌트에서 `api`를 직접 호출하지 않기. 결과를 한 화면에서만 잠깐 쓰는 호출(예: 중복 확인)만 예외
- 컴포넌트에서는 selector로 필요한 값만 구독: `useFeedStore((s) => s.items)`. 스토어 전체 구조 분해 금지 (불필요한 리렌더)
- 계산이 들어간 selector만 스토어 파일에서 export (`export const selectHasMore = (s: FeedState) => ...`)
- 컴포넌트 밖(api.ts 등)에서는 `useXxxStore.getState()`
- 새로고침 후에도 유지할 값만 `persist` 미들웨어 (zustand 내장)
- 로컬 UI 상태(입력값, 모달 열림)는 `useState`

```ts
import { create } from 'zustand'
import { api, handleApiError } from '@/lib/api'

type FeedState = {
  items: Item[]
  loading: boolean
  error: string | null
  fetchFeed: () => Promise<void>
}

export const useFeedStore = create<FeedState>()((set) => ({
  items: [],
  loading: false,
  error: null,
  fetchFeed: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get<Item[]>('/feed')
      set({ items: data })
    } catch (e) {
      set({ error: handleApiError(e) })
    } finally {
      set({ loading: false })
    }
  },
}))
```

## API

- 모든 호출은 `src/lib/api.ts`의 `api` (axios 인스턴스). axios를 직접 `create` 하지 않기
  - 예외: SSE 응답은 axios가 브라우저에서 스트림을 못 읽어 `lib/sse.ts`의 `postForEvent`(fetch)로 받는다. 토큰은 `authHeader()`로 똑같이 붙인다
- 호출 위치는 도메인 스토어 (상태 관리 섹션 참고)
- 주소는 `.env`의 `VITE_API_URL`. 하드코딩 금지
- `VITE_`로 시작하는 값은 빌드 결과 JS에 그대로 들어가 누구나 볼 수 있음. API 키·비밀번호 같은 비밀값은 넣지 않기 (서버에서 처리)
- 서버 응답 형식은 `ApiResponse<T>` (`{ code, message, data }`, `src/types/api.ts`). 필드 검증 에러는 `FieldError[]`
- 에러 메시지는 `handleApiError(e)`로 한국어 문장으로 변환해서 표시. 에러 코드 분기는 `getApiErrorCode(e)` (스토어마다 따로 만들지 않기)
- 채팅 API는 Bearer JWT 필요. 토큰은 `useAuthStore.accessToken`에 있고 axios 인터셉터·`authHeader()`(SSE)가 붙인다. 401이면 refresh 쿠키로 한 번 갱신 후 재시도 (axios·SSE 동일). 메시지 전송은 SSE이고 서버가 끝날 때 `turn.completed`/`turn.failed` 이벤트 하나에 전원 답을 보낸다. 웹은 `revealInTurn`으로 한 명씩 "입력 중"과 함께 띄운다
  - 메시지 `type`: 일반 대화 `conversation`, "이제 진지한 솔루션을 내놔라" `advice`
  - 종료 이벤트 없이 연결이 끊기면 이력 조회(`GET …/{id}?clientMessageId=`)로 결과 확인
- 인증은 카카오 OAuth + 세션 쿠키(JSESSIONID). 인증 관련 요청은 `withCredentials: true`, 가입 POST는 `X-CSRF-TOKEN` 헤더 (`useAuthStore` 참고)

## 스타일

- Tailwind 클래스 우선. 컴포넌트별 CSS 파일 만들지 않기 (전역은 `src/index.css`만)
- 브랜드 색·폰트는 `src/index.css`의 `@theme`에 토큰으로 정의 (디자이너 디자인 시스템 그대로)
  - 화면에서는 시멘틱 토큰만: `bg-background-*`, `text-text-*`, `border-border-*`, `text-icon-*`, `bg-accent-*`, `text-state-*`
  - `palette-*`(원색 팔레트)와 Tailwind 기본 색(`neutral-900`, `white`, `red-500` …)은 화면에 직접 쓰지 않기
  - 글자는 `@utility` 글자 스타일 하나로: `text-body-16-regular`, `text-title-24-semibold` 등. `text-sm`·`font-bold` 따로 쓰지 않기
  - 글자 스타일은 `cn()`이 글자 크기로 인식하게 `lib/utils.ts`에 등록돼 있음. 새 글자 스타일 접두어(`title`/`heading`/`body`/`caption` 외)를 만들면 거기도 추가
- 조건부·덮어쓰기 클래스는 `cn()` (`@/lib/utils`). `common/` 컴포넌트는 `className` prop을 받아 `cn()`으로 병합
- Tailwind는 완전한 클래스 문자열만 스캔 — `bg-${x}` 동적 조합 금지
- 임의값(`[...]`)보다 기본 스케일 클래스 우선. v4는 spacing이 `값/4` 숫자로 다 표현됨 (`max-w-[402px]` → `max-w-100.5`, `w-[18px]` → `w-4.5`, `scale-[.98]` → `scale-98`)
  - 임의값은 스케일로 표현 안 되는 값만 (예: `grid-cols-[36px_1fr]`). 반복되는 색·크기는 `@theme` 토큰으로
  - IntelliSense `suggestCanonicalClasses` 경고가 뜨면 제안대로 바꾼다
- `.vscode/settings.json`이 `*.css`를 `tailwindcss` 언어로 연다 (VS Code 기본 CSS 검사기가 `source()`·`@apply`·`@theme`을 에러로 표시하기 때문). Tailwind CSS IntelliSense 확장 필요
- 클래스 스캔은 `src/`만 (`@import "tailwindcss" source("../src")`). 지우지 않기 — 없으면 AGENTS.md·문서 속 예시 클래스까지 CSS에 들어감
- 높이는 `dvh` 단위 (Layout에서 처리). 모바일 우선
- 확대 막기(`user-scalable=no`)는 접근성 때문에 넣지 않음

## WebView 셸 전제

- 웹은 Vercel/Netlify에 배포하고 셸의 `BASE_URL`에 https 주소를 넣음. 앱 번들에 넣지 않으므로 `base: './'`, HashRouter 불필요
- `vercel.json`의 SPA rewrite 유지 (없으면 새로고침·딥링크에서 404). Netlify면 `public/_redirects`에 `/* /index.html 200`
- 셸에 `onMessage` 없음. RN 브리지(`window.ReactNativeWebView`) 코드 추가하지 않기 (셸 쪽 작업이 먼저)
- safe-area는 셸의 `SafeAreaView`가 처리. 웹에서 `env(safe-area-inset-*)` 넣지 않기
- 우리 도메인이 아닌 링크는 셸이 휴대폰 기본 브라우저로 엶. 앱 안에서 열어야 하면 셸의 `IN_APP_HOSTS` 수정
- Android 뒤로 가기는 셸이 WebView 히스토리로 처리 → 페이지 이동은 `<Link>`/`navigate()`로 (히스토리가 쌓이게)
  - 예외: OAuth 시작처럼 다른 origin(백엔드)으로 가야 하는 이동만 `window.location.assign`
- 카카오 로그인 흐름은 앱 안에서 이어져야 함 → 셸 `IN_APP_HOSTS`에 백엔드 도메인, `kauth.kakao.com`, `accounts.kakao.com` 필요 (없으면 외부 브라우저로 빠져 앱은 로그인 안 됨)
- 빌드 타깃 `es2020` 유지 (구형 Android WebView)
- 4xx는 웹이 직접 화면으로 보여 줘야 함 (`NotFoundPage`). 셸은 5xx만 에러 화면 처리
- 로그인 없이 첫 화면에서 바로 핵심 기능을 쓸 수 있게 (해커톤 심사용)

## 주석

- 기본은 주석 없이. 이름과 코드로 읽히게 쓴다
- 코드를 그대로 다시 말하는 주석 금지 (`// 상태 업데이트`, `// 버튼 클릭 핸들러`)
- 이모지, 장식용 구분선(`// ====`, `// ----`), 주석 처리한 옛 코드, `TODO` 남발 금지
- 남기는 건 코드만 봐서는 알 수 없는 **이유**뿐 (예: 셸·WebView 제약, 서버 쪽 사정)

## 금지

- `console.log` 남기기
- 하드코딩된 API URL
- 인라인 `style` 남용
- `useEffect` 의존성 배열 누락

## Git

- remote: `origin` → https://github.com/TEMP-1121/TEMP_Client.git
- `docs/`는 gitignore (로컬 참고 문서용, 예: 셸 빌드 가이드)
- `.env`, `.env.*`는 절대 커밋하지 않음 (gitignore). 새 환경변수를 추가하면 이름과 용도를 이 문서에 적고 팀에는 따로 공유. 배포 값은 Vercel 환경변수에서 관리
  - 현재 변수: `VITE_API_URL` (백엔드 주소)

### 브랜치

| 브랜치 | 용도 | 직접 push |
|---|---|---|
| `main` | 배포용. Vercel 프로덕션 = 셸 `BASE_URL`이 보는 화면 | 금지 (develop에서 PR로만) |
| `develop` | 배포 전 통합. 개발자들의 작업이 모이는 곳 | 금지 (개인 브랜치에서 PR로만) |
| `<닉네임>` | 개발자별 작업 브랜치. develop에서 따서 계속 사용 | 본인만 |

- 개인 브랜치 이름은 영문 소문자 닉네임 (예: `gildong`). 기능마다 새로 따지 않고 같은 브랜치에서 계속 작업
- 작업 흐름:
  1. 처음 한 번: `git switch develop && git pull && git switch -c <닉네임> && git push -u origin <닉네임>`
  2. 작업 전·PR 전에 develop 최신 반영: `git pull origin develop` (merge. 공유 이력이 있으니 rebase·force push 하지 않기)
  3. PR: `<닉네임>` → `develop`. 충돌은 개인 브랜치에서 해결 후 올림
  4. 배포: `develop` → `main` PR
- PR merge 방식은 **merge commit** (squash 금지). 개인 브랜치를 계속 쓰기 때문에 squash하면 다음 PR부터 같은 변경이 다시 충돌함
- PR 전 `yarn build`·`yarn lint` 통과 확인

### 커밋 메시지

- 형식: `타입: 한국어 요약` — 의도 중심, 파일명 나열 금지. 필요하면 `—` 뒤에 핵심 내용
  - 예: `feat: 피드 카드 추가 — 작성자 닉네임·썸네일 표시`, `fix: 탭 이동 시 스크롤 위치 초기화`
- 타입:
  - `feat` 기능 추가 / `fix` 버그 수정 / `style` UI·스타일만 변경 / `refactor` 동작 변화 없는 구조 변경
  - `chore` 설정·의존성·빌드·AGENTS.md·README
- 한 커밋에 한 관심사. 섞이면 나눠서 커밋
- 한 줄만. 본문 쓰지 않기 (길어지면 커밋을 나눈다)
- AI 도구(Claude·Codex)는 커밋·push 하지 않고 메시지만 제안 (커밋은 개발자가 직접). Claude는 `/commit-msg`
- 커밋 전 `/pre-commit-check`로 규칙·심사 기준 점검 (보고만, 수정은 요청 시)
