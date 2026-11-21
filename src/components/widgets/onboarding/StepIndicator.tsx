import { cn } from '@/lib/utils'

type StepIndicatorProps = {
  total: number
  current: number
  className?: string
}

export default function StepIndicator({ total, current, className }: StepIndicatorProps) {
  return (
    <div
      role="img"
      aria-label={`온보딩 ${total}단계 중 ${current + 1}단계`}
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-2 transition-[width,background-color]',
            index === current ? 'w-4 bg-text-primary' : 'w-2 bg-border-strong',
          )}
        />
      ))}
    </div>
  )
}
