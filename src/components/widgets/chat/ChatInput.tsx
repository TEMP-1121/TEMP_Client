import { useState, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'

type ChatInputProps = {
  disabled?: boolean
  defaultValue?: string
  placeholder?: string
  className?: string
  onTextChange?: (text: string) => void
  onSend: (text: string) => Promise<boolean>
}

export default function ChatInput({
  disabled = false,
  defaultValue = '',
  placeholder = '고민을 이야기해 보세요',
  className,
  onTextChange,
  onSend,
}: ChatInputProps) {
  const [text, setText] = useState(defaultValue)
  const canSend = !disabled && text.trim() !== ''

  const send = async () => {
    if (!canSend) return
    const sent = text.trim()
    setText('')
    if (!(await onSend(sent))) setText((current) => current || sent)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 조합 중 Enter는 글자 확정용이라 여기서 보내면 마지막 글자가 한 번 더 전송된다
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return
    e.preventDefault()
    send()
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        send()
      }}
      className={cn('flex items-end gap-2 border-t border-border-normal bg-background-base p-3', className)}
    >
      {/* 시안대로 14px. iOS는 16px 미만 입력창에 포커스하면 화면을 확대한다 (docs/checklist.md 참고) */}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onTextChange?.(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        maxLength={2000}
        placeholder={placeholder}
        aria-label="메시지"
        className="min-h-12 max-h-32 flex-1 resize-none rounded-2xl bg-background-subtle px-4.5 py-3.5 text-body-14-regular text-text-primary outline-none placeholder:text-text-placeholder"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="보내기"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-primary text-text-inverse active:bg-accent-pressed disabled:bg-accent-disabled"
      >
        <ArrowUp className="size-6" />
      </button>
    </form>
  )
}
