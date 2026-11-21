import { useEffect, useState } from 'react'

// 이 문장을 사용자 메시지로 보이고, 서버에는 type: advice(조언 요청)로 보낸다
const SOLUTION_REQUEST = '이제 진지한 솔루션을 내놔라'
const HINT_DURATION_MS = 4000

// 조언을 요청했는데 정보가 부족해 철학자가 되물었을 때, 솔루션 대신 질문이 온 이유를 잠깐 알려 준다
function AskingMoreHint() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), HINT_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [])
  if (!visible) return null
  return (
    <p role="status" className="rounded-2xl rounded-tr-xs bg-state-negative-light px-4 py-2.5 text-body-14-medium text-text-primary">
      어떤 일이 있었는지 조금 더 이야기해주겠나?
    </p>
  )
}

type ChatActionsProps = {
  disabled: boolean
  onSolution: (text: string) => void
  // 답을 기다리는 보충 질문(question) 턴. 새 질문마다 안내를 다시 띄우려고 ID로 받는다
  questionTurnId?: string
}

// 스크롤되지 않고 입력창 바로 위에 고정
export default function ChatActions({ disabled, onSolution, questionTurnId }: ChatActionsProps) {
  return (
    <div className="relative flex flex-col items-center gap-3 bg-background-surface px-4 pb-4">
      {/* 메시지 위에 겹치면 방금 온 질문 말풍선을 가려서, 버튼 위에 자리를 차지하게 둔다 */}
      {questionTurnId && <AskingMoreHint key={questionTurnId} />}
      {/* 스크롤되는 메시지가 버튼 위에서 뚝 잘려 보이지 않게 흐리게 사라지도록. 목록 아래 여백(16px)과 같은 높이라 맨 아래 메시지는 가리지 않는다 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-full h-4 bg-linear-to-b from-transparent to-background-surface"
      />
      <button
        onClick={() => onSolution(SOLUTION_REQUEST)}
        disabled={disabled}
        className="h-12 w-full rounded-2xl bg-accent-primary text-body-15-bold text-text-inverse active:bg-accent-pressed disabled:bg-accent-disabled"
      >
        {SOLUTION_REQUEST}
      </button>
    </div>
  )
}
