import { isAxiosError } from 'axios'
import { create } from 'zustand'

import { api, getApiErrorCode, handleApiError } from '@/lib/api'
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
  accessToken: string | null

  startKakaoLogin: () => void
  completeKakaoCallback: (search: string) => Promise<void>
  fetchSignupDefaults: () => Promise<boolean>
  submitSignup: (form: SignupForm) => Promise<boolean>
  refreshAccessToken: () => Promise<string | null>
  fetchMe: () => Promise<string | null>
}

type TokenResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

const SIGNUP_FIELDS = Object.keys(SIGNUP_FIELD_MESSAGES) as SignupField[]

// 가입 대기 상태는 JSESSIONID, 로그인 유지는 temp_refresh 쿠키로 이어 가므로 인증 요청은 쿠키를 함께 보낸다
const withSession = { withCredentials: true }

// 갱신할 때마다 refresh 쿠키가 교체돼, 동시에 여러 번 보내면 뒤 요청은 이미 바뀐 쿠키로 실패한다. 진행 중인 갱신 하나를 같이 기다린다
let refreshing: Promise<string | null> | null = null

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
  accessToken: null,

  startKakaoLogin: () => {
    // OAuth 시작은 XHR이 아니라 페이지 이동이어야 카카오 인증 화면으로 302가 이어진다
    window.location.assign(api.getUri({ url: '/oauth2/authorization/kakao' }))
  },

  // 인가 코드 교환은 백엔드가 끝내고 쿠키만 남긴 채 이 화면으로 돌려보낸다.
  // 기존 회원이면 temp_refresh로 토큰이 나오고, 신규 회원이면 JSESSIONID로 가입 정보가 나오는 것으로 구분한다
  completeKakaoCallback: async (search) => {
    // StrictMode의 이중 실행이나 재렌더로 같은 확인을 다시 하지 않는다
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

    if (new URLSearchParams(search).has('error')) {
      set({ callbackStatus: 'failed', callbackError: '카카오 인증이 취소되었거나 실패했어요.' })
      return
    }

    // 콜백 JSON의 data.signupRequired를 백엔드가 리다이렉트 쿼리로 넘겨 주면 그대로 따르고,
    // 아직 넘겨 주지 않으면 쿠키로 판별한다 (기존 회원은 temp_refresh, 신규 회원은 JSESSIONID만 받는다)
    const signupRequired = new URLSearchParams(search).get('signupRequired')

    if (signupRequired !== 'true' && (await get().refreshAccessToken())) {
      await get().fetchMe()
      set({ callbackStatus: 'existing' })
      return
    }
    if (signupRequired !== 'false' && (await get().fetchSignupDefaults())) {
      set({ callbackStatus: 'signupRequired' })
      return
    }
    set({
      callbackStatus: 'failed',
      callbackError: signupRequired === 'false' ? '로그인을 완료하지 못했어요.' : get().signupError,
    })
  },

  fetchSignupDefaults: async () => {
    set({ defaultsLoading: true, signupError: null, accountId: null })
    try {
      const { data } = await api.get<ApiResponse<SignupDefaults>>('/api/v1/auth/signup', withSession)
      const { csrfToken, ...defaults } = data.data
      set({ signupDefaults: defaults, csrfToken, signupExpired: false })
      return true
    } catch (e) {
      if (getApiErrorCode(e) === 'AUTH_SIGNUP_EXPIRED') set({ signupExpired: true })
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
        // 403은 CSRF 토큰과 JSESSIONID가 맞지 않는 경우. 가입 정보를 다시 조회해 새 토큰으로 한 번만 재시도한다
        if (!isAxiosError(e) || e.response?.status !== 403) throw e
        if (!(await get().fetchSignupDefaults())) return false
        response = await post()
      }
      // 가입 응답과 함께 temp_refresh 쿠키가 오므로 바로 토큰을 받는다. 실패해도 가입은 끝났고, 보호 API 호출 때 다시 갱신한다
      await get().refreshAccessToken()
      set({ accountId: response.data.data.accountId })
      return true
    } catch (e) {
      if (getApiErrorCode(e) === 'AUTH_SIGNUP_EXPIRED') set({ signupExpired: true })
      set({ signupError: handleApiError(e), fieldErrors: toFieldErrors(e) })
      return false
    } finally {
      set({ submitting: false })
    }
  },

  refreshAccessToken: () => {
    refreshing ??= api
      .post<ApiResponse<TokenResponse>>('/api/v1/auth/refresh', null, withSession)
      .then(({ data }) => {
        set({ accessToken: data.data.accessToken })
        return data.data.accessToken
      })
      .catch(() => {
        set({ accessToken: null })
        return null
      })
      .finally(() => {
        refreshing = null
      })
    return refreshing
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get<ApiResponse<{ accountId: string }>>('/api/v1/auth/me')
      set({ accountId: data.data.accountId })
      return data.data.accountId
    } catch {
      return null
    }
  },
}))
