import type { CSSProperties } from 'react'

import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage'
import { SELECTED_CARD_BG, TAG_COLOR } from '@/components/widgets/philosopher/cardBackground'
import { cn } from '@/lib/utils'
import type { PhilosopherProfile } from '@/types/philosopher'

type OnboardingPhilosopherCardProps = {
  philosopher: PhilosopherProfile
  className?: string
  style?: CSSProperties
}

// 시안의 온보딩 카드는 철학자 카드 팝업(354×514)을 0.5778배(204.55×297)로 줄인 모양이다.
// 소수점 크기를 따로 두지 않고 팝업과 같은 크기·토큰으로 그린 뒤 통째로 줄인다. 움직임은 감싸는 쪽(className)에서 준다
export default function OnboardingPhilosopherCard({ philosopher, className, style }: OnboardingPhilosopherCardProps) {
  return (
    <div aria-hidden className={cn('h-74.25 w-51.25 shrink-0', className)} style={style}>
      <div
        className={cn(
          'flex h-128.5 w-88.5 origin-top-left scale-[0.5778] flex-col gap-8 rounded-xl px-6 pt-11.5 pb-6.75',
          SELECTED_CARD_BG[philosopher.key] ?? 'bg-accent-light',
        )}
      >
        <PhilosopherImage personaKey={philosopher.key} className="size-46.5" />

        <div className="flex flex-1 flex-col gap-6.75">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-heading-20-bold text-text-primary">{philosopher.name}</p>
                <p className="text-caption-12-regular text-text-secondary">{philosopher.era}</p>
              </div>
              <p className="line-clamp-2 text-body-14-regular text-text-primary">{philosopher.introduction}</p>
            </div>

            <ul className="flex flex-wrap gap-1.75">
              {philosopher.tags.map((tag) => (
                <li
                  key={tag}
                  className={cn(
                    'flex h-7.5 items-center rounded-full border bg-background-base px-2.5 text-caption-13-regular',
                    TAG_COLOR[philosopher.key] ?? 'border-border-active text-text-brand',
                  )}
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <span className="mt-auto flex h-12 shrink-0 items-center justify-center rounded-xl bg-background-base text-body-15-bold text-text-secondary">
            이 철학자와 단톡방 열기
          </span>
        </div>
      </div>
    </div>
  )
}
