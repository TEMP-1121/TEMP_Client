import { CircleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

type UserMessageProps = {
  text: string
  // 전송에 실패했을 때 보여 줄 문구. 메시지는 흐리게 남기고 그 아래에서 다시 보낼 수 있게 한다
  failed?: string
  retryDisabled?: boolean
  onRetry?: () => void
}

export default function UserMessage({ text, failed, retryDisabled = false, onRetry }: UserMessageProps) {
  return (
    <div className="flex max-w-69.5 flex-col items-end gap-1.5 self-end">
      <p
        className={cn(
          'rounded-2xl rounded-tr-sm bg-accent-primary px-3.5 py-2.5 text-body-14-medium whitespace-pre-wrap text-text-inverse',
          failed && 'opacity-50',
        )}
      >
        {text}
      </p>
      {failed && (
        <p role="alert" className="flex items-center gap-1 text-caption-12-regular text-state-negative">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden />
          {failed}
          <span aria-hidden>·</span>
          <button
            type="button"
            onClick={onRetry}
            disabled={retryDisabled}
            className="text-caption-12-bold underline underline-offset-2 disabled:text-text-disabled"
          >
            다시 보내기
          </button>
        </p>
      )}
    </div>
  )
}
