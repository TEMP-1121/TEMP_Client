import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import StepIndicator from '@/components/widgets/onboarding/StepIndicator'
import {
  ONBOARDING_STEPS,
  selectIsLastStep,
  useOnboardingStore,
} from '@/stores/useOnboardingStore'

const slides = [
  {
    title: '일이 지루하게 느껴질 때',
    description: '매일 비슷한 일, 무엇이 나를 지치게 하는지 철학자와 함께 들여다보세요.',
  },
  {
    title: '나에게 맞는 철학자를 골라 보세요',
    description:
      '철학자마다 성격과 질문하는 방식이 달라요. 특징을 보고 마음에 드는 사수를 직접 선택해 보세요.',
  },
  {
    title: '새로운 시선을 일상에서 시험해 보세요',
    description: '대화를 나누고 나면 지금 나에게 맞는 활동과 물건을 추천해 드려요.',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const step = useOnboardingStore((s) => s.step)
  const isLast = useOnboardingStore(selectIsLastStep)
  const next = useOnboardingStore((s) => s.next)
  const reset = useOnboardingStore((s) => s.reset)
  const slide = slides[step]

  useEffect(() => {
    reset()
  }, [reset])

  const finish = () => navigate('/philosophers')

  return (
    <section className="flex flex-1 flex-col bg-background-base px-4 pb-12">
      <div className="flex h-14 items-center justify-end">
        {!isLast && (
          <button
            type="button"
            onClick={finish}
            className="px-1 py-2 text-body-14-regular text-text-tertiary"
          >
            건너뛰기
          </button>
        )}
      </div>

      <div className="mt-8 flex h-90 items-center justify-center bg-background-subtle" aria-hidden>
        <span className="text-caption-12-regular text-text-tertiary">일러스트 영역</span>
      </div>

      <div className="mt-10 min-h-32">
        <h1 className="min-h-20 text-title-24-semibold text-text-primary">{slide.title}</h1>
        <p className="text-body-15-regular text-text-tertiary">{slide.description}</p>
      </div>

      <div className="flex-1" />

      <StepIndicator total={ONBOARDING_STEPS} current={step} />

      <button
        type="button"
        onClick={isLast ? finish : next}
        className="mt-12 flex h-14 w-full items-center justify-center bg-text-primary text-body-16-semibold text-text-inverse active:opacity-90"
      >
        {isLast ? '시작하기' : '다음'}
      </button>
    </section>
  )
}
