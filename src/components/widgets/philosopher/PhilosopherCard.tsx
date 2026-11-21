import type { ReactNode } from 'react'

import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { cn } from '@/lib/utils'
import type { PhilosopherProfile } from '@/types/philosopher'

type PhilosopherCardProps = {
  philosopher: PhilosopherProfile
  size?: 'md' | 'lg'
  selected?: boolean
  topRight?: ReactNode
  className?: string
}

// label·button 안에 들어가므로 블록 요소 대신 span만 쓴다
export default function PhilosopherCard({
  philosopher,
  size = 'md',
  selected = false,
  topRight,
  className,
}: PhilosopherCardProps) {
  return (
    <span
      className={cn(
        'flex flex-col gap-1.5 bg-background-base text-left',
        selected ? 'border-2 border-border-active p-3.25' : 'border border-border-normal p-3.5',
        className,
      )}
    >
      <span className="flex items-start justify-between">
        <PhilosopherAvatar personaKey={philosopher.key} className={size === 'lg' ? 'size-14' : 'size-11'} />
        {topRight}
      </span>
      <span className={size === 'lg' ? 'text-body-16-semibold' : 'text-body-14-bold'}>{philosopher.name}</span>
      <span className="text-caption-12-regular text-text-secondary">{philosopher.description}</span>
      <span className="text-caption-12-regular text-text-tertiary">
        {philosopher.tags.map((tag) => `#${tag}`).join(' ')}
      </span>
    </span>
  )
}
