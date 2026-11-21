import { Link } from 'react-router'

import ChatInput from '@/components/widgets/chat/ChatInput'
import { useAutoScroll } from '@/components/widgets/chat/hooks/useAutoScroll'
import { DUMMY_PERSONAS } from '@/lib/dummyChat'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/useChatStore'

const nameOf = (key: string) => DUMMY_PERSONAS[key] ?? key

function Bubble({ mine, name, text }: { mine?: boolean; name?: string; text: string }) {
  return (
    <div className={cn('flex max-w-4/5 flex-col gap-1', mine && 'self-end')}>
      {name && <span className="text-caption-12-regular text-text-tertiary">{name}</span>}
      <p
        className={cn(
          'rounded-2xl px-4 py-2 text-body-15-regular whitespace-pre-wrap',
          mine ? 'bg-accent-primary text-text-inverse' : 'bg-background-subtle',
        )}
      >
        {text}
      </p>
    </div>
  )
}

export default function ChatPage() {
  const conversation = useChatStore((s) => s.conversations[s.conversations.length - 1])
  const typingKey = useChatStore((s) => s.typingKey)
  const creating = useChatStore((s) => s.creating)
  const sending = useChatStore((s) => s.sending)
  const error = useChatStore((s) => s.error)
  const sendMessage = useChatStore((s) => s.sendMessage)

  const replyCount = conversation?.turns.reduce((n, t) => n + 1 + t.replies.length, 0)
  const { ref, onScroll, stickToBottom } = useAutoScroll<HTMLDivElement>(
    `${conversation?.conversationId}-${replyCount}-${typingKey}-${sending}`,
  )

  const title = conversation?.turns.find((t) => t.message)?.message ?? '새 고민'

  if (!conversation) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
        <p className="text-body-16-regular text-text-tertiary">아직 상담방이 없어요</p>
        {error && <p className="text-body-14-regular text-state-negative">{error}</p>}
        {creating ? (
          <p className="text-body-14-regular text-text-tertiary">방을 만드는 중…</p>
        ) : (
          <Link to="/home" className="rounded-full bg-accent-primary px-5 py-2 text-body-16-semibold text-text-inverse">
            고민 시작하기
          </Link>
        )}
      </section>
    )
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border-normal px-4 py-2">
        <p className="truncate text-body-16-semibold">{title}</p>
        <Link to="/home" className="shrink-0 text-body-14-medium text-text-secondary">
          + 새 고민
        </Link>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {conversation.turns.map((turn) => (
          <div key={turn.turnId} className="flex flex-col gap-3">
            {turn.message && <Bubble mine text={turn.message} />}
            {turn.replies.map((reply) => (
              <Bubble key={reply.personaKey} name={nameOf(reply.personaKey)} text={reply.text} />
            ))}
          </div>
        ))}
        {typingKey ? (
          <p className="text-body-14-regular text-text-tertiary">{nameOf(typingKey)}님이 입력 중…</p>
        ) : (
          sending && <p className="text-body-14-regular text-text-tertiary">…</p>
        )}
      </div>

      {error && <p className="px-4 pt-2 text-body-14-regular text-state-negative">{error}</p>}
      <ChatInput
        disabled={sending}
        onSend={(text) => {
          stickToBottom()
          return sendMessage(conversation.conversationId, text)
        }}
      />
    </section>
  )
}
