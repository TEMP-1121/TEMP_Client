import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage'
import { cn } from '@/lib/utils'

type PhilosopherAvatarProps = {
  personaKey: string
  className?: string
}

// 철학자 고르기 화면의 선택 표시와 같은 모양: 회색 원 안에 철학자 도형을 원 지름의 약 60%로 넣는다
export default function PhilosopherAvatar({ personaKey, className }: PhilosopherAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-subtle',
        className,
      )}
    >
      <PhilosopherImage personaKey={personaKey} className="size-3/5" />
    </span>
  )
}
