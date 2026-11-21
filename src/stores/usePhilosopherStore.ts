import { create } from 'zustand'

import { api, handleApiError } from '@/lib/api'
import { PHILOSOPHERS } from '@/lib/philosophers'
import type { ApiResponse } from '@/types/api'
import type { PhilosopherProfile } from '@/types/philosopher'

export const MAX_PHILOSOPHERS = 3

type Persona = {
  personaKey: string
  name: string
  subtitle: string
  description: string
  tags: string[]
}

type PersonasResponse = {
  personaKeys: string[]
  personas: Persona[]
}

// key·이름·시대·태그는 서버 값으로 덮고, 카드 한 줄 설명과 모달 소개(introduction)는 디자인 문구라 로컬 값을 그대로 쓴다.
// 서버가 내려준 철학자만 남기되, 로컬 목록 순서(디자인 시안 순서)를 따른다
function mergePersonas(personas: Persona[]): PhilosopherProfile[] {
  const byKey = new Map(personas.map((persona) => [persona.personaKey, persona]))
  return PHILOSOPHERS.flatMap((local) => {
    const persona = byKey.get(local.key)
    if (!persona) return []
    return [
      {
        ...local,
        key: persona.personaKey,
        name: persona.name,
        era: persona.subtitle,
        tags: persona.tags,
      },
    ]
  })
}

type PhilosopherState = {
  philosophers: PhilosopherProfile[]
  personasLoaded: boolean
  personasLoading: boolean
  personasError: string | null
  fetchPersonas: () => Promise<void>
  selectedIds: string[]
  cardPhilosopher: PhilosopherProfile | null
  toggleSelect: (id: string) => boolean
  selectOnly: (id: string) => void
  pickRandom: (ids: string[], count?: number) => void
  openCard: (philosopher: PhilosopherProfile) => void
  closeCard: () => void
}

export const usePhilosopherStore = create<PhilosopherState>()((set, get) => ({
  philosophers: PHILOSOPHERS,
  personasLoaded: false,
  personasLoading: false,
  personasError: null,
  selectedIds: [],
  cardPhilosopher: null,

  // 실패하면 로컬 목록을 그대로 둬서, 로그인 전에도 탐색 화면을 쓸 수 있게 한다
  fetchPersonas: async () => {
    if (get().personasLoaded || get().personasLoading) return
    set({ personasLoading: true, personasError: null })
    try {
      const { data } = await api.get<ApiResponse<PersonasResponse>>('/api/v1/chat/personas')
      const philosophers = mergePersonas(data.data.personas)
      if (philosophers.length > 0) set({ philosophers })
      set({ personasLoaded: true })
    } catch (e) {
      set({ personasError: handleApiError(e) })
    } finally {
      set({ personasLoading: false })
    }
  },

  openCard: (philosopher) => set({ cardPhilosopher: philosopher }),
  closeCard: () => set({ cardPhilosopher: null }),

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

  selectOnly: (id) => set({ selectedIds: [id] }),

  pickRandom: (ids, count = MAX_PHILOSOPHERS) => {
    const shuffled = [...ids]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    set({ selectedIds: shuffled.slice(0, Math.min(count, MAX_PHILOSOPHERS)) })
  },
}))
