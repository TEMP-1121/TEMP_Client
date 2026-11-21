// 임시: 조언을 요청하는 API·플래그가 정해지기 전까지 이 문장을 사용자 메시지로 보낸다
const SOLUTION_REQUEST = '이제 진지한 솔루션을 내놔라'

type ChatActionsProps = {
  disabled: boolean
  onSolution: (text: string) => void
}

// 스크롤되지 않고 입력창 바로 위에 고정
export default function ChatActions({ disabled, onSolution }: ChatActionsProps) {
  return (
    <div className="relative bg-background-surface px-4 pb-4">
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
