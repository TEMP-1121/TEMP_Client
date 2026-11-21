import { useNavigate } from 'react-router'

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
    // 한 화면에 다 보이도록 아래(철학자 고르기·빠르게 시작하기·입력창)는 고정하고, 위 안내 영역이 남는 높이를 나눠 쓴다
    <section className="flex min-h-0 flex-1 flex-col">
      {/* 화면이 아주 작으면 안내 영역만 스크롤된다. my-auto라 넘칠 때도 위가 잘리지 않는다 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
        <div className="my-auto flex flex-col items-center py-6 text-center">
          {/* 임시 로고. 진짜 로고가 나오면 public/assets/logo.svg 파일만 바꾼다. 아이폰 SE처럼 낮은 화면에선 제목·설명이 보이도록 숨긴다 */}
          <img src="/assets/logo.svg" alt="일세" className="size-17.5 [@media(max-height:700px)]:hidden" />
          <h2 className="mt-8 text-heading-20-bold text-text-primary [@media(max-height:700px)]:mt-0">
            오늘은 어떤 일이 지루했나요?
          </h2>
          <p className="mt-4 text-caption-13-regular text-text-tertiary">
            철학자 3명을 골라 단톡방을 열어 보세요.
            <br />
            서로 다른 시선으로 함께 이야기해 줄 거예요.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col px-4 pb-4">
        <PhilosopherPickerButton selectedIds={selectedIds} onClick={pickPhilosophers} />

        <QuickStartList
          options={QUICK_STARTS}
          selected={quickStart}
          // 선택이 풀리면('') 입력창도 비운다
          onSelect={(text) => setDraft(text, text)}
          className="mt-14 [@media(max-height:700px)]:mt-6"
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
