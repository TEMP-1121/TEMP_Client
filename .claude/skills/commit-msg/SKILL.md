---
name: commit-msg
description: 현재 변경사항(staged/unstaged diff)을 분석해 프로젝트 컨벤션(`타입: 한국어 요약`)에 맞는 커밋 메시지 후보를 추천한다. 사용자가 /commit-msg 라고 하면 실행. 커밋은 하지 않고 메시지만 제안한다.
---

# commit-msg

현재 변경사항을 분석해 커밋 메시지 후보를 추천한다.

## 전제

- `git commit`·`git add`·`git push`를 실행하지 않는다. 메시지 문자열만 제안하고 커밋은 사용자가 직접 한다.
- 실제 diff에 있는 변경만 근거로 삼는다.
- 현재 브랜치가 `main`이나 `develop`이면 개인 브랜치(`<닉네임>`)로 옮기라고 먼저 알린다 (두 브랜치는 PR로만 반영).

## 절차

1. `git branch --show-current` → `git status --short` → `git diff --stat` → 필요하면 `git diff`. staged가 있으면 `git diff --cached`만, 없으면 unstaged + untracked 전체를 대상으로.
2. 무엇이 왜 바뀌었는지 한두 줄로 파악.
3. 관심사가 섞여 있으면 커밋을 나누자고 제안하고, 그룹별 `git add <경로>`와 각 메시지를 준다.
4. 후보 2~3개 제시.

## 컨벤션

- 형식: `타입: 한국어 요약`. 필요하면 `—` 뒤에 핵심 내용.
- 타입: `feat` 기능 추가 / `fix` 버그 수정 / `style` UI·스타일만 / `refactor` 동작 변화 없는 구조 변경 / `chore` 설정·의존성·빌드·CLAUDE.md·README
- 의도 중심. 파일명 나열 금지. 이모지 금지.
- 예:
  - `feat: 피드 카드 추가 — 작성자 닉네임·썸네일 표시`
  - `fix: 탭 이동 시 스크롤 위치 초기화`
  - `chore: Tailwind 스캔 범위를 src로 제한`
- 한 줄만. 본문 쓰지 않는다. 한 줄로 안 담기면 커밋을 나누자고 제안.

## 출력

- 후보를 번호로, 가장 적합한 것 먼저. 바로 복사할 수 있게 코드블록으로.
- 여러 관심사면 "나눠서 커밋" 섹션에 그룹별 `git add` + 메시지.
- `Co-Authored-By` 트레일러는 기본 미포함. 원하면 붙일 수 있다고만 안내.
