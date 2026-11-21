import { useNavigate } from 'react-router'

import Logo from '@/components/common/Logo'
import ChatInput from '@/components/widgets/chat/ChatInput'
import QuickStartList from '@/components/widgets/home/QuickStartList'
import PhilosopherPickerButton from '@/components/widgets/philosopher/PhilosopherPickerButton'
import { useChatStore } from '@/stores/useChatStore'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'

const QUICK_STARTS = ['반복 업무가 의미 없게 느껴져요', '번아웃이 온 것 같아요', '동료 고민 상담하기']

export default function HomePage() {
  const navigate = useNavigate()
  const selectedIds = usePhilosopherStore((s) => s.selectedIds)
  const draft = useChatStore((s) => s.draft)
  const quickStart = useChatStore((s) => s.draftQuickStart)
  const setDraft = useChatStore((s) => s.setDraft)

  const pickPhilosophers = () => navigate('/philosophers')

  return (
    <section className="flex flex-1 flex-col px-4 pb-4">
      <div className="flex flex-col items-center pt-8 text-center">
        <Logo className="size-17.5" />
        <h2 className="mt-8 text-heading-20-bold text-text-primary">오늘은 어떤 일이 지루했나요?</h2>
        <p className="mt-4 text-caption-13-regular text-text-tertiary">
          철학자 3명을 골라 단톡방을 열어 보세요.
          <br />
          서로 다른 시선으로 함께 이야기해 줄 거예요.
        </p>
      </div>

      <div className="mt-auto flex flex-col pt-10">
        <PhilosopherPickerButton selectedIds={selectedIds} onClick={pickPhilosophers} />

        <QuickStartList
          options={QUICK_STARTS}
          selected={quickStart}
          // 선택이 풀리면('') 입력창도 비운다
          onSelect={(text) => setDraft(text, text)}
          className="mt-14"
        />

        <div className="mt-6">
          {/* 빠르게 시작하기를 바꿀 때만 다시 그려 입력창을 그 문장으로 채운다. 직접 입력한 글은 스토어에 남아 화면을 오가도 유지된다 */}
          <ChatInput
            key={quickStart}
            defaultValue={draft}
            placeholder="ex.) 업무능력이 잘 오르지 않는 것 같아요"
            className="border-t-0 p-0"
            onTextChange={(text) => setDraft(text)}
            onSend={async (text) => {
              setDraft(text)
              pickPhilosophers()
              return true
            }}
          />
          <p className="mt-2.5 text-center text-caption-11-regular text-text-tertiary">
            철학자 3명을 고르면 대화를 시작할 수 있어요
          </p>
        </div>
      </div>
    </section>
  )
}
