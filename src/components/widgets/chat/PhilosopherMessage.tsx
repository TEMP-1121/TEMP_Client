import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { cn } from '@/lib/utils'
import type { Quote } from '@/types/chat'

type PhilosopherMessageProps = {
  personaKey: string
  name: string
  text: string
  // "이제 진지한 솔루션을 내놔라"에 대한 조언 답변. 시안상 연분홍 배경에 278px을 꽉 채운다
  advice?: boolean
  quote?: Quote | null
}

export default function PhilosopherMessage({ personaKey, name, text, advice = false, quote }: PhilosopherMessageProps) {
  return (
    <div className="flex gap-2">
      <PhilosopherAvatar personaKey={personaKey} className="size-7.5" />
      <div className="flex min-w-0 flex-col items-start gap-1">
        <span className="text-caption-12-bold text-text-secondary">{name}</span>
        <div
          className={cn(
            'max-w-69.5 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-body-14-regular whitespace-pre-wrap text-text-primary',
            advice ? 'w-69.5 bg-state-negative-light' : 'bg-background-subtle',
          )}
        >
          <p>{text}</p>
          {/* 인용문 디자인은 아직 시안이 없어 본문 아래 작은 글씨로 둔다 */}
          {quote && (
            <p className="mt-2 text-caption-12-regular text-text-secondary">
              “{quote.text}” — {quote.source}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
