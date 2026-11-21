import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import GiftRecommendationSheet from '@/components/dialog/chat/GiftRecommendationSheet'
import ChatActions from '@/components/widgets/chat/ChatActions'
import ChatHeader from '@/components/widgets/chat/ChatHeader'
import ChatInput from '@/components/widgets/chat/ChatInput'
import PhilosopherMessage from '@/components/widgets/chat/PhilosopherMessage'
import TypingIndicator from '@/components/widgets/chat/TypingIndicator'
import UserMessage from '@/components/widgets/chat/UserMessage'
import { useAutoScroll } from '@/components/widgets/chat/hooks/useAutoScroll'
import { useChatStore } from '@/stores/useChatStore'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'

export default function ChatPage() {
  const navigate = useNavigate()
  const conversation = useChatStore((s) => s.conversations[s.conversations.length - 1])
  const typingKey = useChatStore((s) => s.typingKey)
  const creating = useChatStore((s) => s.creating)
  const sending = useChatStore((s) => s.sending)
  const error = useChatStore((s) => s.error)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const endConversation = useChatStore((s) => s.endConversation)
  const [showingGiftSheet, setShowingGiftSheet] = useState(false)
  const [giftedKeys, setGiftedKeys] = useState<string[]>([])
  const philosophers = usePhilosopherStore((s) => s.philosophers)
  const nameOf = (key: string) => philosophers.find((p) => p.key === key)?.name ?? key

  const replyCount = conversation?.turns.reduce((n, t) => n + 1 + t.replies.length, 0)
  const { ref, onScroll, stickToBottom } = useAutoScroll<HTMLDivElement>(
    `${conversation?.conversationId}-${replyCount}-${typingKey}-${sending}`,
  )

  const send = (text: string) => {
    if (!conversation) return Promise.resolve(false)
    stickToBottom()
    return sendMessage(conversation.conversationId, text)
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <ChatHeader
        title={conversation && (conversation.turns.find((t) => t.message)?.message ?? '새 고민')}
        names={conversation?.personaKeys.map(nameOf)}
        // 단톡방을 닫으면 철학자 선택으로 돌아가지 않고 홈으로 간다
        onClose={() => navigate('/home', { replace: true })}
      />

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
          <div ref={ref} onScroll={onScroll} className="flex flex-1 flex-col gap-4 overflow-y-auto bg-background-surface p-4">
            {conversation.turns.map((turn) => (
              <div key={turn.turnId} className="flex flex-col gap-4">
                {turn.message && <UserMessage text={turn.message} />}
                {turn.replies.map((reply) => (
                  <PhilosopherMessage
                    key={reply.personaKey}
                    personaKey={reply.personaKey}
                    name={nameOf(reply.personaKey)}
                    text={reply.text}
                  />
                ))}
              </div>
            ))}
            {(typingKey || sending) && (
              <TypingIndicator personaKey={typingKey ?? undefined} name={typingKey ? nameOf(typingKey) : undefined} />
            )}
          </div>

          {error && <p className="px-4 pt-2 text-body-14-regular text-state-negative">{error}</p>}

          {conversation.ended ? (
            <p className="border-t border-border-normal p-4 text-center text-body-14-regular text-text-tertiary">
              이 상담은 종료되었어요
            </p>
          ) : (
            <>
              <ChatActions disabled={sending} onSolution={send} onGift={() => setShowingGiftSheet(true)} />
              <ChatInput
                disabled={sending}
                placeholder="철학자들에게 고민을 이야기해 보세요"
                className="p-4"
                onSend={send}
              />
            </>
          )}
        </>
      )}

      {showingGiftSheet && conversation && (
        <GiftRecommendationSheet
          personaKeys={conversation.personaKeys}
          giftedKeys={giftedKeys}
          onClose={() => setShowingGiftSheet(false)}
          onGift={(personaKey) =>
            setGiftedKeys((current) =>
              current.includes(personaKey) ? current : [...current, personaKey],
            )
          }
          onEndConversation={() => {
            endConversation(conversation.conversationId)
            setShowingGiftSheet(false)
          }}
        />
      )}
    </section>
  )
}
