import { useEffect } from 'react'
import { MessageSquareMore, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router'

import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'

import { useChatStore } from '@/stores/useChatStore'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'

function formatDate(value?: string) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return '오늘'
  if (date.toDateString() === yesterday.toDateString()) return '어제'

  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export default function ConversationSidebar({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const conversations = useChatStore((s) => s.conversationList)
  const listLoading = useChatStore((s) => s.listLoading)
  const listError = useChatStore((s) => s.listError)
  const fetchConversations = useChatStore((s) => s.fetchConversations)
  const philosophers = usePhilosopherStore((s) => s.philosophers)
  const nameOf = (key: string) => philosophers.find((philosopher) => philosopher.key === key)?.name ?? key

  // 보관함을 열 때마다 서버 목록을 다시 받아 방금 만든 방까지 보이게 한다
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return (
    <div
      role='presentation'
      className='absolute inset-0 z-50 flex bg-background-scrim'
      onClick={onClose}
    >
      <aside
        role='dialog'
        aria-modal='true'
        aria-labelledby='conversation-sidebar-title'
        className='flex h-full w-3/4 max-w-88 flex-col overflow-y-auto bg-background-base'
        onClick={(event) => event.stopPropagation()}
      >
        <div className='shrink-0 px-5 pt-16'>
          <h2 id='conversation-sidebar-title' className='text-heading-18-bold'>
            대화 보관함
          </h2>
          <button
            type='button'
            onClick={() => {
              onClose()
              navigate('/home')
            }}
            className='mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-primary text-body-16-semibold text-text-inverse active:bg-accent-pressed'
          >
            <MessageSquareMore className='size-4' aria-hidden />
            새로 상담하기
          </button>
          <div className='mt-6 border-t border-border-normal pb-3 pt-5'>
            <p className='text-body-14-regular text-text-tertiary'>
              대화 {conversations.length}
            </p>
          </div>
        </div>

        {listLoading && conversations.length === 0 ? (
          <p className='px-5 pt-1 text-body-14-regular text-text-tertiary'>대화를 불러오는 중…</p>
        ) : listError ? (
          <div className='flex flex-col items-start gap-2 px-5 pt-1'>
            <p className='text-body-14-regular text-state-negative'>{listError}</p>
            <button
              type='button'
              onClick={() => fetchConversations()}
              className='text-caption-12-bold text-text-secondary underline underline-offset-2'
            >
              다시 불러오기
            </button>
          </div>
        ) : conversations.length > 0 ? (
          <div className='flex flex-col px-5 pb-6'>
            {conversations.map((conversation) => (
              <button
                key={conversation.conversationId}
                type='button'
                onClick={() => {
                  onClose()
                  // 대화는 ChatPage가 주소의 방 ID로 불러온다
                  navigate(`/chat/${conversation.conversationId}`)
                }}
                className='flex w-full items-center gap-2 border-b border-border-normal py-4 text-left last:border-b-0'
              >
                <div className='flex shrink-0 -space-x-2'>
                  {conversation.personaKeys.slice(0, 3).map((key) => (
                    <PhilosopherAvatar
                      key={key}
                      personaKey={key}
                      name={nameOf(key)}
                      className='size-7 text-caption-10-bold'
                    />
                  ))}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-2'>
                    {/* 서버 제목은 처음 보낸 고민. 고민 없이 연 방은 null */}
                    <p className='line-clamp-1 text-body-14-semibold text-text-primary'>
                      {conversation.title ?? '새 고민'}
                    </p>
                    <span className='shrink-0 text-caption-12-regular text-text-tertiary'>
                      {formatDate(conversation.createdAt)}
                    </span>
                  </div>
                  <p className='mt-1 line-clamp-1 text-body-14-regular text-text-tertiary'>
                    {conversation.personaKeys.map(nameOf).join(' · ')}
                  </p>
                </div>
                <MoreHorizontal className='size-5 shrink-0 text-icon-tertiary' aria-hidden />
              </button>
            ))}
          </div>
        ) : (
          <p className='px-5 pt-1 text-body-14-regular text-text-tertiary'>
            아직 보관된 대화가 없어요
          </p>
        )}
      </aside>
      <div className='flex-1' aria-hidden />
    </div>
  )
}
