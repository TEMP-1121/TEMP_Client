import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { cn } from '@/lib/utils'

// 점마다 시작을 늦춰 차례로 튀게 한다. Tailwind에 animation-delay 스케일이 없어 임의값을 쓴다
const DOT_DELAYS = ['motion-safe:[animation-delay:0ms]', 'motion-safe:[animation-delay:150ms]', 'motion-safe:[animation-delay:300ms]']

type TypingIndicatorProps = {
  personaKey?: string
  name?: string
}

const withSubject = (name: string) => {
  const code = name.charCodeAt(name.length - 1) - 0xac00
  return name + (code >= 0 && code <= 11171 && code % 28 ? '이' : '가')
}

// 누가 답하는지 정해지기 전(응답 대기)에는 점 묶음만 보여 준다
export default function TypingIndicator({ personaKey, name }: TypingIndicatorProps) {
  return (
    <div role="status" className="relative flex items-center gap-2">
      {personaKey && (
        <PhilosopherAvatar personaKey={personaKey} className="size-5" />
      )}
      <span aria-hidden className="flex h-5 w-12.5 items-center justify-between rounded-full bg-background-subtle px-3">
        {DOT_DELAYS.map((delay) => (
          <span key={delay} className={cn('size-1 rounded-full bg-icon-tertiary motion-safe:animate-typing-dot', delay)} />
        ))}
      </span>
      {name ? (
        <span className="text-caption-12-regular text-text-tertiary">{withSubject(name)} 입력 중</span>
      ) : (
        <span className="sr-only">답변을 기다리는 중</span>
      )}
    </div>
  )
}
