import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage'
import { SELECTED_CARD_BG } from '@/components/widgets/philosopher/cardBackground'
import { cn } from '@/lib/utils'
import type { PhilosopherProfile } from '@/types/philosopher'

type PhilosopherCardProps = {
  philosopher: PhilosopherProfile
  selected?: boolean
  className?: string
}

// button 안에 들어가므로 블록 요소 대신 span만 쓴다
export default function PhilosopherCard({ philosopher, selected = false, className }: PhilosopherCardProps) {
  return (
    <span
      className={cn(
        'flex min-h-55 flex-col gap-6.75 rounded-card border px-3.5 pt-6 pb-3.5 text-left transition-colors',
        selected
          ? cn('border-border-active', SELECTED_CARD_BG[philosopher.key] ?? 'bg-accent-light')
          : 'border-transparent bg-background-base',
        className,
      )}
    >
      <span className="flex justify-center">
        <PhilosopherImage personaKey={philosopher.key} />
      </span>
      <span className="flex flex-col gap-1.75">
        <span className="flex flex-col gap-1.5">
          <span className="text-body-14-bold text-text-primary">{philosopher.name}</span>
          <span className="text-caption-12-regular text-text-secondary">{philosopher.description}</span>
        </span>
        <span className="flex flex-wrap gap-1.75">
          {philosopher.tags.map((tag) => (
            <span
              key={tag}
              className="flex h-5.5 items-center rounded-full border border-border-active bg-background-base px-2.5 text-caption-11-regular text-text-brand"
            >
              #{tag}
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}
