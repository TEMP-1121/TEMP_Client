import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { cn } from '@/lib/utils'

type PhilosopherMessageProps = {
  personaKey: string
  name: string
  text: string
  // "이제 진지한 솔루션을 내놔라"에 대한 조언 답변. 시안상 연분홍 배경에 278px을 꽉 채운다
  advice?: boolean
}

export default function PhilosopherMessage({ personaKey, name, text, advice = false }: PhilosopherMessageProps) {
  return (
    <div className="flex gap-2">
      <PhilosopherAvatar personaKey={personaKey} name={name} className="size-7.5" />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-caption-12-bold text-text-secondary">{name}</span>
        <p
          className={cn(
            'max-w-69.5 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-body-14-regular whitespace-pre-wrap text-text-primary',
            advice ? 'w-69.5 bg-state-negative-light' : 'bg-background-subtle',
          )}
        >
          {text}
        </p>
      </div>
    </div>
  )
}
