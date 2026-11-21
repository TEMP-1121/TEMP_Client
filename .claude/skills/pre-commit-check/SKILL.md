---
name: pre-commit-check
description: 커밋 전에 현재 변경사항이 AGENTS.md 규칙과 해커톤 심사 기준에 어긋나는지 점검해 보고한다. 사용자가 /pre-commit-check 라고 하거나 "커밋 전에 확인해줘"라고 하면 실행. 파일을 고치거나 커밋하지 않고 보고만 한다.
---

# pre-commit-check

현재 변경사항을 AGENTS.md 규칙과 해커톤 심사 기준으로 점검한다.

## 전제

- 파일 수정, `git add`, `git commit`, `git push`를 하지 않는다. 보고만 하고, 사용자가 요청하면 그때 고친다.
- 실제 diff와 코드에 있는 것만 근거로. 추측으로 지적하지 않는다.
- AGENTS.md가 규칙의 기준이다 (CLAUDE.md는 `@AGENTS.md`로 불러오기만 한다). 이 문서와 AGENTS.md가 다르면 AGENTS.md를 따른다.

## 절차

1. 범위 파악: `git branch --show-current`, `git status --short`, staged가 있으면 `git diff --cached`, 없으면 `git diff` + untracked 파일.
2. 자동 검사: `node -v`가 24인지 확인 후 `yarn build`, `yarn lint`.
3. 변경된 파일을 읽고 아래 A·B·C 항목을 확인. B는 변경된 화면·스토어 기준으로 본다.
4. 결과를 출력 형식대로 보고.

## A. 규칙 위반 (AGENTS.md)

차단 (커밋 전에 반드시 수정):
- `yarn build` 또는 `yarn lint` 실패
- `.env`, `.env.*`, 키·토큰·비밀번호가 변경사항에 포함
- `VITE_` 변수에 비밀값 (빌드 JS에 그대로 노출됨)
- 현재 브랜치가 `main` 또는 `develop` (개인 `<닉네임>` 브랜치에서 커밋)
- `package-lock.json`, `pnpm-lock.yaml` 생성 (yarn만 사용)
- `http://` 로 시작하는 API·리소스 주소 (APK에서 막힘), 하드코딩된 API 주소

경고:
- `CLAUDE.md`에 `@AGENTS.md` 외 내용이 추가됨 → 그 내용을 `AGENTS.md`로 옮기고 `CLAUDE.md`는 `@AGENTS.md` 한 줄로 되돌리기 (Codex 사용자가 못 봄)
- `console.log` 잔존
- `src/lib/api.ts` 밖에서 `axios.create` 또는 axios 직접 사용
- 컴포넌트·페이지에서 `api`를 직접 호출 (도메인 스토어 안에서 호출. 한 화면에서만 잠깐 쓰는 호출은 예외), `lib/api.ts`에 엔드포인트 함수 추가
- Zustand 스토어를 selector 없이 통째로 구독 (`const { a, b } = useXxxStore()`)
- Tailwind 동적 클래스 조합 (`` `bg-${x}` ``), 스케일로 표현 가능한 임의값 (`w-[16px]` → `w-4`)
- 인라인 `style` 남용, 컴포넌트별 CSS 파일 추가
- `lucide-react` 외 아이콘 라이브러리·커스텀 SVG 아이콘
- 주석: 이모지, 장식 구분선, 주석 처리한 옛 코드, 코드를 다시 말하는 주석
- 파일 위치·이름: 공통 → `components/common/`, 기능 전용 → `components/widgets/<기능>/`, 모달 → `components/dialog/<기능>/`, 화면 → `pages/XxxPage.tsx`, 스토어 → `stores/useXxxStore.ts`, 이미지 → `public/assets/`
- 페이지 최상위가 `<main>` 또는 `min-h-dvh` (Layout이 이미 처리)
- WebView 전제 위반: `window.ReactNativeWebView` 브리지 코드, `env(safe-area-inset-*)`, 빌드 타깃 변경, `vercel.json` rewrite 삭제, `user-scalable=no`
- 페이지 이동을 `<Link>`/`navigate()` 대신 `window.location` 으로 (Android 뒤로 가기 히스토리가 안 쌓임)

## B. 심사 기준 (해커톤 가이드)

배점은 판단할 때 참고용. 변경된 범위에서 점수를 잃을 수 있는 부분만 지적한다.

1. 기능 구현 완성도 (30점: 핵심 기능 20 / 사용자 흐름 5 / 에러 2.5 / 빈 상태 2.5)
   - API 호출이 있는 화면에 **에러 상태**가 사용자에게 보이는가 (`handleApiError` 메시지 표시, 다시 시도 수단)
   - 목록·검색 결과에 **빈 상태** 화면이 있는가 (데이터 0개일 때 빈 화면만 나오지 않는지)
   - **로딩 상태** 안내가 있는가 (버튼 중복 클릭 방지 포함)
   - 막다른 화면: 다음 행동이 없는 화면, 동작하지 않는 버튼 (`onClick={() => {}}`, `href="#"`), 연결 안 된 라우트
   - 사용자 입력 검증: 빈 값·잘못된 형식으로 제출했을 때 안내가 있는가
2. 디자인 구현 완성도 (20점)
   - 색·폰트·간격이 `@theme` 토큰이 아닌 제각각 값으로 들어갔는가 (일관성)
   - 좁은 화면(360px)에서 깨질 만한 고정 폭·`whitespace-nowrap` 긴 텍스트
3. 서버 및 API 연동 (20점: 목데이터만 쓰면 0점)
   - 하드코딩된 목·더미 데이터가 실제 API 자리를 차지하고 있는가 (`mock`, `dummy`, `sample` 배열 등). 있으면 어떤 API로 바꿔야 하는지 표시
   - fetch뿐 아니라 생성·수정·삭제(mutation) 후 화면 상태가 갱신되는가
4. 애플리케이션 완성도 (20점: 웹에선 되는데 앱에서 안내 없이 안 되면 건당 -2점)
   - WebView에서 안 되거나 다르게 동작할 수 있는 기능에 **안내 메시지나 대체 동작**이 있는가:
     `window.open`, `navigator.geolocation`, `navigator.clipboard`, `<input type="file">`·카메라, `download` 링크, `Notification`, `navigator.share`
   - 외부 도메인 링크는 셸이 휴대폰 브라우저로 연다. 앱 안에서 열려야 하는 흐름이면 셸 `IN_APP_HOSTS` 추가가 필요하다고 알림
   - 4xx·없는 경로가 `NotFoundPage` 등 웹 화면으로 처리되는가
5. 팀워크 (10점: 작업별 커밋 분리 5 / 컨벤션 5)
   - 변경사항에 관심사가 여러 개 섞였으면 나눠서 커밋하자고 제안 (그룹별 `git add <경로>`)
   - 커밋 메시지는 `/commit-msg`로 추천받으라고 안내

참고 (지적하지 말고 필요할 때만 한 줄): 가이드는 애니메이션 제외, 상태 관리 최소화, 리렌더링 최적화보다 기능 완성 우선을 권장한다. 이런 항목으로 커밋을 막지 않는다.

## C. 출력 형식

```
## 점검 결과: <커밋 가능 | 수정 필요>
브랜치: <이름> / build: <통과|실패> / lint: <통과|실패>

### 차단
- `파일:줄` 내용 → 고치는 방법

### 경고
- `파일:줄` 내용 → 고치는 방법

### 심사 기준
- [기능 30] `파일:줄` 내용 → 제안
- [API 20] ...

### 커밋 나누기
- 그룹별 `git add <경로>` (관심사가 하나면 생략)
```

- 해당 항목이 없는 섹션은 생략. 아무 문제도 없으면 "점검 결과: 커밋 가능"과 build/lint 줄만.
- 차단이 하나라도 있으면 "수정 필요".
- 마지막에 한 줄: 고칠 항목을 말하면 수정하겠다고 안내.
