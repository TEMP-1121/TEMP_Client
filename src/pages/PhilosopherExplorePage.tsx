import { useNavigate } from 'react-router'

import PhilosopherCardDialog from '@/components/dialog/philosopher/PhilosopherCardDialog'
import PhilosopherCard from '@/components/widgets/philosopher/PhilosopherCard'
import { PHILOSOPHERS } from '@/lib/philosophers'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'
import type { PhilosopherProfile } from '@/types/philosopher'

export default function PhilosopherExplorePage() {
  const navigate = useNavigate()
  const openCard = usePhilosopherStore((s) => s.openCard)
  const openedKey = usePhilosopherStore((s) => s.cardPhilosopher?.key)

  const startChat = (philosopher: PhilosopherProfile) => {
    const { selectOnly, closeCard } = usePhilosopherStore.getState()
    selectOnly(philosopher.key)
    closeCard()
    navigate('/philosophers')
  }

  return (
    <section className="flex-1 bg-background-surface px-4 pt-5 pb-6">
      <h2 className="text-center text-heading-20-bold text-text-primary">철학자 탐색</h2>
      <p className="mt-0.5 text-center text-caption-13-regular text-text-tertiary">
        철학을 몰라도 괜찮아요! 마음에 드는 철학자를 골라 보세요
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {PHILOSOPHERS.map((philosopher) => (
          <button
            key={philosopher.key}
            type="button"
            onClick={() => openCard(philosopher)}
            aria-haspopup="dialog"
            className="flex text-left"
          >
            <PhilosopherCard
              philosopher={philosopher}
              selected={openedKey === philosopher.key}
              className="w-full"
            />
          </button>
        ))}
      </div>

      <PhilosopherCardDialog onStartChat={startChat} />
    </section>
  )
}
