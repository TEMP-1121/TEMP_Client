import { X } from 'lucide-react'
import { useEffect } from 'react'

import PhilosopherImage from '@/components/widgets/philosopher/PhilosopherImage'
import { TAG_COLOR } from '@/components/widgets/philosopher/cardBackground'
import { cn } from '@/lib/utils'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'
import type { PhilosopherProfile } from '@/types/philosopher'

type PhilosopherCardDialogProps = {
  onStartChat: (philosopher: PhilosopherProfile) => void
}

export default function PhilosopherCardDialog({ onStartChat }: PhilosopherCardDialogProps) {
  const philosopher = usePhilosopherStore((s) => s.cardPhilosopher)
  const closeCard = usePhilosopherStore((s) => s.closeCard)

  useEffect(() => {
    if (!philosopher) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCard()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [philosopher, closeCard])

  if (!philosopher) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="philosopher-card-name"
      className="fixed inset-0 z-20 flex items-center justify-center bg-background-scrim p-6"
      onClick={closeCard}
    >
      <div
        className="relative flex w-full max-w-88.5 flex-col gap-8 rounded-xl bg-background-base px-6 pt-11.5 pb-6.75"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeCard}
          aria-label="닫기"
          className="absolute top-2.75 right-6 text-icon-secondary"
        >
          <X className="size-6" aria-hidden />
        </button>

        <PhilosopherImage personaKey={philosopher.key} className="size-46.5" />

        <div className="flex flex-col gap-6.75">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <h2 id="philosopher-card-name" className="text-heading-20-bold text-text-primary">
                  {philosopher.name}
                </h2>
                <p className="text-caption-12-regular text-text-secondary">{philosopher.era}</p>
              </div>
              <p className="text-body-14-regular text-text-primary">{philosopher.introduction}</p>
            </div>

            <ul className="flex flex-wrap gap-1.75">
              {philosopher.tags.map((tag) => (
                <li
                  key={tag}
                  className={cn(
                    'flex h-7.5 items-center rounded-full border bg-background-base px-2.5 text-caption-13-regular',
                    TAG_COLOR[philosopher.key] ?? 'border-border-active text-text-brand',
                  )}
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onStartChat(philosopher)}
            className="h-12 shrink-0 rounded-xl bg-accent-primary text-body-15-bold text-text-inverse active:bg-accent-pressed"
          >
            이 철학자와 단톡방 열기
          </button>
        </div>
      </div>
    </div>
  )
}
