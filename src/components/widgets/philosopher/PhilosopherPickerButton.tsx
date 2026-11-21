import { ChevronRight } from 'lucide-react'

import PhilosopherAvatar from '@/components/widgets/philosopher/PhilosopherAvatar'
import { MAX_PHILOSOPHERS } from '@/stores/usePhilosopherStore'

type PhilosopherPickerButtonProps = {
  selectedIds: string[]
  onClick: () => void
}

export default function PhilosopherPickerButton({ selectedIds, onClick }: PhilosopherPickerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 items-center gap-3 rounded-card bg-accent-primary px-4 text-left text-text-inverse active:bg-accent-pressed"
    >
      {/* 32px 원 3개를 8px씩 겹쳐 시안의 80px 폭 */}
      <div className="flex w-20 shrink-0 -space-x-2">
        {Array.from({ length: MAX_PHILOSOPHERS }, (_, i) =>
          selectedIds[i] ? (
            <PhilosopherAvatar key={i} personaKey={selectedIds[i]} className="size-8" />
          ) : (
            <span key={i} className="size-8 rounded-full bg-background-base" />
          ),
        )}
      </div>
      <span className="flex-1 font-noto text-body-14-bold">철학자 {MAX_PHILOSOPHERS}명 고르기</span>
      <span className="flex h-6 items-center font-noto text-caption-13-medium">
        {selectedIds.length}/{MAX_PHILOSOPHERS}
        <ChevronRight className="size-6" />
      </span>
    </button>
  )
}
