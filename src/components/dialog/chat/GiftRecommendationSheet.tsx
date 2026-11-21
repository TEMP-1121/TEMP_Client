import { X } from 'lucide-react'

import { DUMMY_GIFT_RECOMMENDATIONS } from '@/lib/dummyChat'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'
import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'

type GiftRecommendationSheetProps = {
  personaKeys: string[]
  onClose: () => void
  onEndConversation: () => void
  giftedKeys: string[]
  onGift: (personaKey: string) => void
}

export default function GiftRecommendationSheet({
  personaKeys,
  onClose,
  onEndConversation,
  giftedKeys,
  onGift,
}: GiftRecommendationSheetProps) {
  const philosophers = usePhilosopherStore((s) => s.philosophers)

  return (
    <div
      role='presentation'
      className='fixed inset-0 z-50 flex items-end justify-center bg-background-scrim'
      onClick={onClose}
    >
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby='gift-sheet-title'
        className='flex max-h-[84dvh] w-full max-w-117 flex-col bg-background-base'
        onClick={(event) => event.stopPropagation()}
      >
        <header className='flex shrink-0 items-start justify-between px-5 pb-4 pt-5'>
          <div>
            <h2 id='gift-sheet-title' className='text-heading-18-bold'>
              철학자들이 고른 선물
            </h2>
            <p className='mt-1 text-body-14-regular text-text-tertiary'>
              대화를 바탕으로 한 사람씩 골랐어요
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='선물 추천 닫기'
            className='-mr-2 flex size-9 shrink-0 items-center justify-center text-icon-primary'
          >
            <X className='size-6' aria-hidden />
          </button>
        </header>

        <div className='flex-1 space-y-3 overflow-y-auto px-5 pb-4'>
          {personaKeys.map((personaKey) => {
            const philosopher = philosophers.find((item) => item.key === personaKey)
            const gift = DUMMY_GIFT_RECOMMENDATIONS[personaKey]
            const gifted = giftedKeys.includes(personaKey)

            if (!gift) return null

            return (
              <article key={personaKey} className='border border-border-normal p-4'>
                <div className='flex items-center gap-2'>
                  <PhilosopherAvatar personaKey={personaKey} className='size-8 border-0' />
                  <div className='min-w-0'>
                    <h3 className='text-body-14-semibold text-text-primary'>
                      {philosopher?.name ?? personaKey}
                    </h3>
                    <p className='truncate text-body-14-regular text-text-secondary'>
                      “{gift.quote}”
                    </p>
                  </div>
                </div>

                <div className='mt-3 flex items-center gap-3'>
                  <div className='size-16 shrink-0 bg-background-subtle' aria-hidden />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-body-15-regular text-text-primary'>
                      {gift.productName}
                    </p>
                    <p className='mt-0.5 text-body-16-semibold text-text-primary'>
                      {gift.price}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => onGift(personaKey)}
                    disabled={gifted}
                    className='shrink-0 border border-border-strong px-3 py-2 text-body-14-semibold text-text-primary transition-colors hover:bg-background-subtle disabled:border-border-disabled disabled:text-text-disabled'
                  >
                    {gifted ? '선물 완료' : '선물하기'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <footer className='shrink-0 bg-background-base px-5 pb-5 pt-1'>
          <button
            type='button'
            onClick={onEndConversation}
            className='flex h-16 w-full items-center justify-center bg-accent-primary text-body-16-semibold text-text-inverse active:bg-accent-pressed'
          >
            대화 종료하기
          </button>
        </footer>
      </section>
    </div>
  )
}
