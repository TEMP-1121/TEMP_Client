import { create } from 'zustand'

export const ONBOARDING_STEPS = 3

type OnboardingState = {
  step: number
  next: () => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  step: 0,
  next: () => set((s) => ({ step: Math.min(s.step + 1, ONBOARDING_STEPS - 1) })),
  reset: () => set({ step: 0 }),
}))

export const selectIsLastStep = (s: OnboardingState) => s.step === ONBOARDING_STEPS - 1
