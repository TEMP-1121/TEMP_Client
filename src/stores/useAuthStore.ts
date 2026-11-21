import { isAxiosError } from 'axios'
import { create } from 'zustand'

import { api, handleApiError } from '@/lib/api'
import { SIGNUP_FIELD_MESSAGES } from '@/lib/validateSignup'
import type { ApiResponse, FieldError } from '@/types/api'
import type { SignupField, SignupFieldErrors, SignupForm } from '@/types/auth'

type CallbackStatus = 'idle' | 'loading' | 'existing' | 'signupRequired' | 'failed'

type SignupDefaults = {
  name: string | null
  email: string | null
  csrfToken: string
}

type AuthState = {
  handledCallbackQuery: string | null
  callbackStatus: CallbackStatus
  callbackError: string | null

  signupDefaults: Omit<SignupDefaults, 'csrfToken'> | null
  csrfToken: string | null
  defaultsLoading: boolean
  submitting: boolean
  signupExpired: boolean
  signupError: string | null
  fieldErrors: SignupFieldErrors
  accountId: string | null

  startKakaoLogin: () => void
  completeKakaoCallback: (search: string) => Promise<void>
  fetchSignupDefaults: () => Promise<boolean>
  submitSignup: (form: SignupForm) => Promise<boolean>
}

const SIGNUP_FIELDS = Object.keys(SIGNUP_FIELD_MESSAGES) as SignupField[]

// JSESSIONID로 OAuth state와 가입 대기 상태를 이어 가므로 인증 요청은 쿠키를 함께 보낸다
const withSession = { withCredentials: true }

function getErrorCode(error: unknown) {
  if (!isAxiosError(error)) return undefined
  const code: unknown = error.response?.data?.code
  return typeof code === 'string' ? code : undefined
}

function toFieldErrors(error: unknown): SignupFieldErrors {
  if (!isAxiosError(error)) return {}
  const data: unknown = error.response?.data?.data
  if (!Array.isArray(data)) return {}
  const errors: SignupFieldErrors = {}
  // 서버 detail은 요청 언어에 따라 영어로 올 수 있어 필드별 한국어 문구로 바꿔 보여 준다
  for (const item of data as FieldError[]) {
    const field = SIGNUP_FIELDS.find((key) => item.pointer === `/${key}`)
    if (field) errors[field] = SIGNUP_FIELD_MESSAGES[field]
  }
  return errors
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  handledCallbackQuery: null,
  callbackStatus: 'idle',
  callbackError: null,

  signupDefaults: null,
  csrfToken: null,
  defaultsLoading: false,
  submitting: false,
  signupExpired: false,
  signupError: null,
  fieldErrors: {},
  accountId: null,

  startKakaoLogin: () => {
    // OAuth 시작은 XHR이 아니라 페이지 이동이어야 카카오 인증 화면으로 302가 이어진다
    window.location.assign(api.getUri({ url: '/oauth2/authorization/kakao' }))
  },

  completeKakaoCallback: async (search) => {
    // 인가 코드는 한 번만 교환할 수 있어 StrictMode의 이중 실행이나 재렌더로 다시 보내지 않는다
    if (get().handledCallbackQuery === search) return
    set({
      handledCallbackQuery: search,
      callbackStatus: 'loading',
      callbackError: null,
      accountId: null,
      signupExpired: false,
      signupError: null,
      fieldErrors: {},
    })

    const params = new URLSearchParams(search)
    if (params.has('error') || !params.has('code')) {
      set({ callbackStatus: 'failed', callbackError: '카카오 인증이 취소되었거나 실패했어요.' })
      return
    }

    try {
      const { data } = await api.get<ApiResponse<{ signupRequired: boolean }>>(
        `/login/oauth2/code/kakao${search}`,
        withSession,
      )
      set({ callbackStatus: data.data.signupRequired ? 'signupRequired' : 'existing' })
    } catch (e) {
      set({ callbackStatus: 'failed', callbackError: handleApiError(e) })
    }
  },

  fetchSignupDefaults: async () => {
    set({ defaultsLoading: true, signupError: null, accountId: null })
    try {
      const { data } = await api.get<ApiResponse<SignupDefaults>>('/api/v1/auth/signup', withSession)
      const { csrfToken, ...defaults } = data.data
      set({ signupDefaults: defaults, csrfToken, signupExpired: false })
      return true
    } catch (e) {
      if (getErrorCode(e) === 'AUTH_SIGNUP_EXPIRED') set({ signupExpired: true })
      set({ signupError: handleApiError(e) })
      return false
    } finally {
      set({ defaultsLoading: false })
    }
  },

  submitSignup: async (form) => {
    set({ submitting: true, signupError: null, fieldErrors: {} })

    const post = () =>
      api.post<ApiResponse<{ accountId: string }>>('/api/v1/auth/signup', form, {
        ...withSession,
        headers: { 'X-CSRF-TOKEN': get().csrfToken ?? '' },
      })

    try {
      let response
      try {
        response = await post()
      } catch (e) {
        // 403은 CSRF 토큰 불일치. 명세대로 같은 세션에서 기본값을 다시 받아 한 번만 재시도한다
        if (getErrorCode(e) !== 'AUTH_FORBIDDEN') throw e
        if (!(await get().fetchSignupDefaults())) return false
        response = await post()
      }
      set({ accountId: response.data.data.accountId })
      return true
    } catch (e) {
      const code = getErrorCode(e)
      if (code === 'AUTH_SIGNUP_EXPIRED' || code === 'AUTH_FORBIDDEN') set({ signupExpired: true })
      set({ signupError: handleApiError(e), fieldErrors: toFieldErrors(e) })
      return false
    } finally {
      set({ submitting: false })
    }
  },
}))
