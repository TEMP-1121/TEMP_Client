// 이 문장을 사용자 메시지로 보이고, 서버에는 type: advice(조언 요청)로 보낸다
const SOLUTION_REQUEST = '이제 진지한 솔루션을 내놔라'

type ChatActionsProps = {
  disabled: boolean
  onSolution: (text: string) => void
  // 답을 기다리는 보충 질문(question) 턴. 조언을 요청했는데 정보가 부족해 철학자가 되물은 상태
  questionTurnId?: string
}

// 스크롤되지 않고 입력창 바로 위에 고정
export default function ChatActions({ disabled, onSolution, questionTurnId }: ChatActionsProps) {
  return (
    <div className="flex flex-col items-center gap-3 bg-background-surface px-4 pb-4">
      {/* 솔루션 대신 질문이 온 이유를 답할 때까지 띄워 둔다. 메시지 위에 겹치면 질문 말풍선을 가려 버튼 위에 자리를 차지하게 두고,
          저절로 사라지면 버튼이 내려앉으며 화면이 흔들려 보여 시간제한을 두지 않는다 */}
      {questionTurnId && (
        <p role="status" className="rounded-2xl rounded-tr-xs bg-state-negative-light px-4 py-2.5 text-body-14-medium text-text-primary">
          어떤 일이 있었는지 조금 더 이야기해주겠나?
        </p>
      )}
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
