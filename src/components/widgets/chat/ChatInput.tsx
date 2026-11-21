import { useState, type KeyboardEvent } from 'react'
import { SendHorizontal } from 'lucide-react'

type ChatInputProps = {
  disabled?: boolean
  onSend: (text: string) => Promise<boolean>
}

export default function ChatInput({ disabled = false, onSend }: ChatInputProps) {
  const [text, setText] = useState('')
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
      className="flex items-end gap-2 border-t border-neutral-200 bg-white p-3"
    >
      {/* text-base(16px) 미만이면 iOS가 포커스할 때 화면을 확대한다 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={2000}
        placeholder="고민을 이야기해 보세요"
        aria-label="메시지"
        className="max-h-32 flex-1 resize-none rounded-2xl bg-neutral-100 px-4 py-2 text-base outline-none"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="보내기"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white disabled:bg-neutral-300"
      >
        <SendHorizontal className="size-5" />
      </button>
    </form>
  )
}
