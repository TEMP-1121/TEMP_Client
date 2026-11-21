import { useEffect } from 'react'

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
        className="flex min-h-140 w-full max-w-88.5 flex-col bg-background-base p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-50 shrink-0 bg-background-subtle">
          {philosopher.imageUrl && (
            <img src={philosopher.imageUrl} alt="" className="size-full object-cover" />
          )}
        </div>

        <h2 id="philosopher-card-name" className="mt-5 text-title-24-semibold">
          {philosopher.name}
        </h2>
        <p className="mt-1 text-caption-12-regular text-text-tertiary">{philosopher.era}</p>
        <p className="mt-3 text-body-14-regular">{philosopher.introduction}</p>
        <p className="mt-6 text-caption-13-regular text-text-tertiary">
          대화 스타일 · {philosopher.conversationStyle}
        </p>

        <button
          type="button"
          onClick={() => onStartChat(philosopher)}
          className="mt-auto h-13 shrink-0 bg-text-primary text-body-16-semibold text-text-inverse"
        >
          이 철학자와 단톡방 열기
        </button>
      </div>
    </div>
  )
}
