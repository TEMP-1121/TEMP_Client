import { X } from 'lucide-react'
import { useNavigate } from 'react-router'

import PhilosopherCard from '@/components/widgets/philosopher/PhilosopherCard'
import PhilosopherGrid from '@/components/widgets/philosopher/PhilosopherGrid'
import { PHILOSOPHERS } from '@/lib/philosophers'
import { cn } from '@/lib/utils'
import { MAX_PHILOSOPHERS, usePhilosopherStore } from '@/stores/usePhilosopherStore'

export default function PhilosopherSelectPage() {
  const navigate = useNavigate()
  const selectedIds = usePhilosopherStore((s) => s.selectedIds)
  const toggleSelect = usePhilosopherStore((s) => s.toggleSelect)
  const canContinue = selectedIds.length === MAX_PHILOSOPHERS

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-background-base">
      <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4">
        <span aria-hidden />
        <h1 className="text-heading-18-bold">철학자 고르기</h1>
        <button
          type="button"
          onClick={() => navigate('/home')}
          aria-label="닫기"
          className="flex size-9 items-center justify-center justify-self-end"
        >
          <X className="size-6 text-icon-primary" />
        </button>
      </header>

      <p className="shrink-0 px-4 pt-1 pb-4 text-body-16-semibold">함께 이야기할 철학자 3명을 골라 주세요</p>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <PhilosopherGrid
          philosophers={PHILOSOPHERS}
          renderItem={(philosopher) => {
            const isSelected = selectedIds.includes(philosopher.personaKey)
            const isDisabled = !isSelected && selectedIds.length === MAX_PHILOSOPHERS

            return (
              <label
                key={philosopher.personaKey}
                className={cn('cursor-pointer', isDisabled && 'cursor-not-allowed opacity-45')}
              >
                <PhilosopherCard
                  philosopher={philosopher}
                  selected={isSelected}
                  topRight={
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={() => toggleSelect(philosopher.personaKey)}
                      aria-label={`${philosopher.name} 선택`}
                      className="size-5.5 cursor-pointer accent-text-primary disabled:cursor-not-allowed"
                    />
                  }
                />
              </label>
            )
          }}
        />
      </div>

      <footer className="shrink-0 border-t border-border-strong bg-background-base px-4 pt-2.5 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-caption-12-regular text-text-tertiary">선택한 철학자</span>
            <div className="flex -space-x-2" aria-hidden>
              {selectedIds.map((id) => (
                <span key={id} className="size-6.5 rounded-full bg-border-strong ring-2 ring-border-inverse" />
              ))}
            </div>
          </div>
          <span className="text-body-14-bold">
            {selectedIds.length}/{MAX_PHILOSOPHERS}
          </span>
        </div>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => navigate('/home')}
          className="flex h-11 w-full items-center justify-center bg-text-primary text-body-14-bold text-text-inverse disabled:cursor-not-allowed disabled:bg-accent-disabled"
        >
          선택 완료 · 단톡방 열기
        </button>
      </footer>
    </section>
  )
}
