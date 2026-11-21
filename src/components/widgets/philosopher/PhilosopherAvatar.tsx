import { cn } from '@/lib/utils'

// Tailwind는 완성된 클래스 문자열만 스캔해서 bg-philosopher-${key}로 조합하면 색이 생성되지 않는다
const COLORS: Record<string, string> = {
  epictetus: 'bg-philosopher-epictetus',
  nietzsche: 'bg-philosopher-nietzsche',
  marx: 'bg-philosopher-marx',
  camus: 'bg-philosopher-camus',
  zhuangzi: 'bg-philosopher-zhuangzi',
  epicurus: 'bg-philosopher-epicurus',
  aristotle: 'bg-philosopher-aristotle',
  arendt: 'bg-philosopher-arendt',
  weil: 'bg-philosopher-weil',
}

type PhilosopherAvatarProps = {
  personaKey: string
  className?: string
}

export default function PhilosopherAvatar({ personaKey, className }: PhilosopherAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-10 shrink-0 rounded-full border-2 border-border-inverse',
        COLORS[personaKey] ?? 'bg-background-subtle',
        className,
      )}
    />
  )
}
