import { create } from 'zustand'

import { DUMMY_PHILOSOPHERS } from '@/lib/dummyChat'
import type { Philosopher } from '@/types/philosopher'

export const MAX_PHILOSOPHERS = 3

type PhilosopherState = {
  philosophers: Philosopher[]
  selectedIds: string[]
  toggleSelect: (id: string) => boolean
  pickRandom: (ids: string[], count?: number) => void
}

export const usePhilosopherStore = create<PhilosopherState>()((set, get) => ({
  // 임시: 철학자 목록 API가 나오면 fetchPhilosophers로 받아 온다
  philosophers: DUMMY_PHILOSOPHERS,
  selectedIds: [],

  toggleSelect: (id) => {
    const { selectedIds } = get()
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((selected) => selected !== id) })
      return true
    }
    if (selectedIds.length >= MAX_PHILOSOPHERS) return false
    set({ selectedIds: [...selectedIds, id] })
    return true
  },

  pickRandom: (ids, count = MAX_PHILOSOPHERS) => {
    const shuffled = [...ids]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    set({ selectedIds: shuffled.slice(0, Math.min(count, MAX_PHILOSOPHERS)) })
  },
}))
