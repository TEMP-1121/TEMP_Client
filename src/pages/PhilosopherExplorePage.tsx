import { useNavigate } from 'react-router'

import PhilosopherCardDialog from '@/components/dialog/philosopher/PhilosopherCardDialog'
import PhilosopherCard from '@/components/widgets/philosopher/PhilosopherCard'
import PhilosopherGrid from '@/components/widgets/philosopher/PhilosopherGrid'
import { PHILOSOPHERS } from '@/lib/philosophers'
import { usePhilosopherStore } from '@/stores/usePhilosopherStore'
import type { PhilosopherProfile } from '@/types/philosopher'

export default function PhilosopherExplorePage() {
  const navigate = useNavigate()
  const openCard = usePhilosopherStore((s) => s.openCard)

  const startChat = (philosopher: PhilosopherProfile) => {
    const { selectOnly, closeCard } = usePhilosopherStore.getState()
    selectOnly(philosopher.key)
    closeCard()
    navigate('/philosophers')
  }

  return (
    <section className="flex-1 px-4 pt-4 pb-6">
      <h2 className="text-title-24-semibold">철학자 탐색</h2>
      <p className="mt-1 text-caption-13-regular text-text-tertiary">
        철학을 몰라도 괜찮아요. 마음에 드는 철학자를 골라 보세요.
      </p>

      <PhilosopherGrid
        philosophers={PHILOSOPHERS}
        className="mt-5"
        renderItem={(philosopher) => (
          <button
            key={philosopher.key}
            type="button"
            onClick={() => openCard(philosopher)}
            className="block text-left"
          >
            <PhilosopherCard philosopher={philosopher} size="lg" />
          </button>
        )}
      />

      <PhilosopherCardDialog onStartChat={startChat} />
    </section>
  )
}
