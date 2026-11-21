import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage'
import { SELECTED_CARD_BG } from '@/components/widgets/philosopher/cardBackground'
import { cn } from '@/lib/utils'

type PhilosopherAvatarProps = {
  personaKey: string
  className?: string
}

// 철학자 고르기에서 선택한 카드와 같은 철학자 색 배경 원 안에 철학자 도형을 원 지름의 약 60%로 넣는다
export default function PhilosopherAvatar({ personaKey, className }: PhilosopherAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full',
        SELECTED_CARD_BG[personaKey] ?? 'bg-background-subtle',
        className,
      )}
    >
      <PhilosopherImage personaKey={personaKey} className="size-3/5" />
    </span>
  )
}
