import { Check } from 'lucide-react'

import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage'
import { SELECTED_CARD_BG, TAG_COLOR } from '@/components/widgets/philosopher/cardBackground'
import { cn } from '@/lib/utils'
import type { PhilosopherProfile } from '@/types/philosopher'

type PhilosopherSelectCardProps = {
  philosopher: PhilosopherProfile
  selected: boolean
  disabled: boolean
  onToggle: () => void
}

export default function PhilosopherSelectCard({ philosopher, selected, disabled, onToggle }: PhilosopherSelectCardProps) {
  return (
    <label
      className={cn(
        // 시안은 한 줄 설명 기준 213px. 실제 설명은 두 줄인 경우가 있어 높이를 고정하지 않고 내용에 맞춘다 (같은 줄 카드는 그리드가 높이를 맞춘다)
        // relative가 없으면 sr-only 체크박스가 스크롤 영역 밖(레이아웃 기준)에 놓여, 누를 때 페이지 전체가 스크롤된다
        'relative flex cursor-pointer flex-col gap-6.75 rounded-card transition-colors',
        // 피그마 테두리는 안쪽 선이라 여백(14px)에 포함되지 않는다. 테두리 두께만큼 여백을 빼 내용이 가장자리에서 14px에 오게 한다
        selected
          ? cn('border-2 border-border-selected p-3', SELECTED_CARD_BG[philosopher.key] ?? 'bg-accent-light')
          : 'border border-border-normal bg-background-base p-3.25',
        disabled && 'cursor-not-allowed opacity-45',
      )}
    >
      <span className="flex items-start justify-between">
        <PhilosopherImage personaKey={philosopher.key} />
        <input
          type="checkbox"
          checked={selected}
          disabled={disabled}
          onChange={onToggle}
          aria-label={`${philosopher.name} 선택`}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-border-active"
        >
          <span
            className={cn(
              'flex size-4.5 items-center justify-center rounded-xs border-2 border-icon-primary',
              selected ? 'bg-icon-primary text-icon-inverse' : 'bg-background-base text-transparent',
            )}
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        </span>
      </span>

      <span className="flex min-w-0 flex-col gap-1.75">
        <span className="flex flex-col gap-1.5">
          <span className="truncate text-body-14-bold text-text-primary">{philosopher.name}</span>
          <span className="line-clamp-2 text-caption-12-regular text-text-secondary">{philosopher.description}</span>
        </span>
        <span className="flex flex-wrap gap-1.75">
          {philosopher.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={cn(
                'flex h-5.5 items-center rounded-full border bg-background-base px-2.5 text-caption-11-regular',
                TAG_COLOR[philosopher.key] ?? 'border-border-active text-text-brand',
              )}
            >
              #{tag}
            </span>
          ))}
        </span>
      </span>
    </label>
  )
}
