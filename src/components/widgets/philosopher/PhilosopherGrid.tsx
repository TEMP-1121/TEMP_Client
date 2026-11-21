import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import type { PhilosopherProfile } from '@/types/philosopher'

type PhilosopherGridProps = {
  philosophers: PhilosopherProfile[]
  renderItem: (philosopher: PhilosopherProfile) => ReactNode
  className?: string
}

// grid는 행마다 가장 긴 카드에 맞춰 줄이 벌어져서, 열을 따로 쌓아 카드 사이 간격을 일정하게 한다
export default function PhilosopherGrid({ philosophers, renderItem, className }: PhilosopherGridProps) {
  const columns = [0, 1].map((col) => philosophers.filter((_, i) => i % 2 === col))

  return (
    <div className={cn('grid grid-cols-2 items-start gap-3', className)}>
      {columns.map((column, col) => (
        <div key={col} className="flex flex-col gap-3">
          {column.map(renderItem)}
        </div>
      ))}
    </div>
  )
}
