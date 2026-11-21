import { create } from 'zustand'

import { DUMMY_PHILOSOPHERS } from '@/lib/dummyChat'
import type { Philosopher } from '@/types/philosopher'

export const MAX_PHILOSOPHERS = 3

// 아바타 이니셜 폰트(Noto Sans KR)는 그 글자를 처음 그릴 때 받기 시작해 첫 철학자의 이니셜만 늦게 뜬다. 목록이 정해지면 미리 받아 둔다
const preloadInitials = (philosophers: Philosopher[]) =>
  document.fonts.load('700 1em "Noto Sans KR"', philosophers.map((p) => p.name[0]).join('')).catch(() => {})

preloadInitials(DUMMY_PHILOSOPHERS)

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
