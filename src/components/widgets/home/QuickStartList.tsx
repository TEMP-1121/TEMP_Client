import { cn } from '@/lib/utils'

type QuickStartListProps = {
  options: string[]
  selected: string
  onSelect: (text: string) => void
  className?: string
}

export default function QuickStartList({ options, selected, onSelect, className }: QuickStartListProps) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-caption-12-regular text-text-tertiary">빠르게 시작하기</p>
      <div className="flex flex-col gap-2">
        {options.map((text) => (
          <button
            key={text}
            aria-pressed={selected === text}
            // 선택된 문장을 한 번 더 누르면 선택을 푼다
            onClick={() => onSelect(selected === text ? '' : text)}
            className={cn(
              // 2px 선을 안쪽으로 그려 선택돼도 크기·글자 위치가 바뀌지 않게 한다 (테두리 1px + 안쪽 링 1px)
              'flex h-9.5 items-center rounded-card border bg-background-base px-4 text-left text-text-primary',
              selected === text
                ? 'border-border-active text-caption-13-bold inset-ring inset-ring-border-active'
                : 'border-border-normal text-caption-13-regular',
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
