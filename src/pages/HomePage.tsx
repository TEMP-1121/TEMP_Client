import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router'

import ChatInput from '@/components/widgets/chat/ChatInput'
import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { cn } from '@/lib/utils'
import { MAX_PHILOSOPHERS, usePhilosopherStore } from '@/stores/usePhilosopherStore'

const QUICK_STARTS = ['반복 업무가 의미 없게 느껴져요', '번아웃이 온 것 같아요', '동료 고민 상담하기']

export default function HomePage() {
  const navigate = useNavigate()
  const selectedIds = usePhilosopherStore((s) => s.selectedIds)
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState('')
  const hasMessage = message.trim() !== ''

  const pickPhilosophers = (text: string) => navigate('/philosophers', { state: { message: text.trim() } })

  return (
    <section className="flex flex-1 flex-col px-4 pb-4">
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="flex -space-x-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-20 rounded-full border-2 border-border-inverse bg-background-subtle" />
          ))}
        </div>
        <h2 className="mt-8 text-title-24-semibold">오늘은 어떤 일이 지루했나요?</h2>
        <p className="mt-3 text-body-14-regular text-text-tertiary">
          철학자 3명을 골라 단톡방을 열어 보세요. 서로 다른 시선으로 함께 이야기해 줄 거예요.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <p className="text-body-14-regular text-text-tertiary">빠르게 시작하기</p>
        {QUICK_STARTS.map((text) => (
          <button
            key={text}
            onClick={() => {
              setDraft(text)
              setMessage(text)
            }}
            className={cn(
              'border px-4 py-3 text-left text-body-15-regular',
              draft === text ? 'border-border-active bg-accent-light text-text-brand' : 'border-border-normal',
            )}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-10">
        <button
          type="button"
          onClick={() => pickPhilosophers(message)}
          className="flex items-center gap-4 border border-border-strong px-4 py-3 text-left"
        >
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) =>
              selectedIds[i] ? (
                <PhilosopherAvatar key={i} personaKey={selectedIds[i]} className="size-9" />
              ) : (
                <span key={i} className="size-9 rounded-full border border-dashed border-border-strong bg-background-base" />
              ),
            )}
          </div>
          <span className="flex-1 text-body-16-semibold">철학자 3명 고르기</span>
          <span className="flex items-center text-body-14-regular text-text-tertiary">
            {selectedIds.length}/{MAX_PHILOSOPHERS}
            <ChevronRight className="size-4" />
          </span>
        </button>

        <ChatInput
          key={draft}
          defaultValue={draft}
          placeholder="매일 같은 보고서만 써서 지겨워요"
          className="border-t-0 p-0"
          onTextChange={setMessage}
          onSend={async (text) => {
            pickPhilosophers(text)
            return true
          }}
        />
        {!hasMessage && <p className="text-caption-12-regular text-text-tertiary">고민을 입력하면 함께 이야기할 철학자를 고를 수 있어요</p>}
      </div>
    </section>
  )
}
