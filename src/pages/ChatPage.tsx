import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import EndChatDialog from '@/components/dialog/chat/EndChatDialog'
import ChatInput from '@/components/widgets/chat/ChatInput'
import { useAutoScroll } from '@/components/widgets/chat/hooks/useAutoScroll'
import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { useChatStore } from '@/stores/useChatStore'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'

const withSubject = (name: string) => {
  const code = name.charCodeAt(name.length - 1) - 0xac00
  return name + (code >= 0 && code <= 11171 && code % 28 ? '이' : '가')
}

const status = 'px-4 text-body-14-regular text-text-tertiary'

export default function ChatPage() {
  const navigate = useNavigate()
  const conversation = useChatStore((s) => s.conversations[s.conversations.length - 1])
  const typingKey = useChatStore((s) => s.typingKey)
  const creating = useChatStore((s) => s.creating)
  const sending = useChatStore((s) => s.sending)
  const error = useChatStore((s) => s.error)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const endConversation = useChatStore((s) => s.endConversation)
  const [confirmingEnd, setConfirmingEnd] = useState(false)
  const philosophers = usePhilosopherStore((s) => s.philosophers)
  const nameOf = (key: string) => philosophers.find((p) => p.key === key)?.name ?? key

  const replyCount = conversation?.turns.reduce((n, t) => n + 1 + t.replies.length, 0)
  const { ref, onScroll, stickToBottom } = useAutoScroll<HTMLDivElement>(
    `${conversation?.conversationId}-${replyCount}-${typingKey}-${sending}`,
  )

  // 새로고침·딥링크로 바로 들어오면 돌아갈 히스토리가 없어 홈으로 보낸다
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/home', { replace: true }))

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border-normal px-2">
        <button onClick={goBack} aria-label="뒤로 가기" className="flex size-10 items-center justify-center">
          <ChevronLeft className="size-6 text-icon-primary" />
        </button>
        {conversation && (
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 pr-10">
            <div className="flex shrink-0 -space-x-2">
              {conversation.personaKeys.map((key) => (
                <PhilosopherAvatar key={key} personaKey={key} className="size-7" />
              ))}
            </div>
            <p className="truncate text-body-14-medium text-text-secondary">
              {conversation.personaKeys.map(nameOf).join(' · ')}
            </p>
          </div>
        )}
      </header>

      {!conversation ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
          <p className="text-body-16-regular text-text-tertiary">아직 상담방이 없어요</p>
          {error && <p className="text-body-14-regular text-state-negative">{error}</p>}
          {creating ? (
            <p className="text-body-14-regular text-text-tertiary">방을 만드는 중…</p>
          ) : (
            <Link to="/home" className="bg-accent-primary px-5 py-3 text-body-16-semibold text-text-inverse">
              고민 시작하기
            </Link>
          )}
        </div>
      ) : (
        <>
          <div ref={ref} onScroll={onScroll} className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
            {conversation.turns.map((turn) => (
              <div key={turn.turnId} className="flex flex-col gap-4">
                {turn.message && (
                  <p className="mx-4 max-w-4/5 self-end bg-background-subtle px-4 py-3 text-body-15-regular whitespace-pre-wrap">
                    {turn.message}
                  </p>
                )}
                {turn.replies.map((reply) => (
                  <div key={reply.personaKey} className="flex gap-2 pr-12 pl-4">
                    <PhilosopherAvatar personaKey={reply.personaKey} />
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-caption-12-semibold text-text-secondary">
                        {nameOf(reply.personaKey)}
                      </span>
                      <p className="border border-border-normal px-4 py-3 text-body-15-regular whitespace-pre-wrap">
                        {reply.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {typingKey ? (
              <p className={status}>{withSubject(nameOf(typingKey))} 입력 중…</p>
            ) : (
              sending && <p className={status}>…</p>
            )}
          </div>

          {error && <p className="px-4 pt-2 text-body-14-regular text-state-negative">{error}</p>}

          {conversation.ended ? (
            <p className="border-t border-border-normal p-4 text-center text-body-14-regular text-text-tertiary">
              이 상담은 종료되었어요
            </p>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              <button
                onClick={() => setConfirmingEnd(true)}
                disabled={sending}
                className="border border-border-strong py-3 text-body-16-semibold disabled:text-text-disabled"
              >
                대화 종료하고 선물 받기
              </button>
              <ChatInput
                disabled={sending}
                placeholder="철학자들에게 이야기해 보세요"
                className="border-t-0 p-0"
                onSend={(text) => {
                  stickToBottom()
                  return sendMessage(conversation.conversationId, text)
                }}
              />
            </div>
          )}
        </>
      )}

      {confirmingEnd && conversation && (
        <EndChatDialog
          onCancel={() => setConfirmingEnd(false)}
          onConfirm={() => {
            endConversation(conversation.conversationId)
            setConfirmingEnd(false)
          }}
        />
      )}
    </section>
  )
}
