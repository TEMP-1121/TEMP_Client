import { isAxiosError } from 'axios'
import { create } from 'zustand'

import { api, getApiErrorCode, handleApiError } from '@/lib/api'
import type { ApiResponse } from '@/types/api'

type CallbackStatus = 'idle' | 'loading' | 'done' | 'failed'

type SignupPrefill = {
  name: string | null
  email: string | null
  csrfToken: string
}

type AuthState = {
  handledCallbackQuery: string | null
  callbackStatus: CallbackStatus
  callbackError: string | null
  // 카카오 닉네임. 가입 기본값으로만 받을 수 있어 이번 로그인에서 새로 가입한 경우에만 있다 (온보딩 인사)
  userName: string | null
  accessToken: string | null

  startKakaoLogin: () => void
  completeKakaoCallback: (search: string) => Promise<void>
  refreshAccessToken: () => Promise<string | null>
}

type TokenResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

// 가입 대기 상태는 JSESSIONID, 로그인 유지는 temp_refresh 쿠키로 이어 가므로 인증 요청은 쿠키를 함께 보낸다
const withSession = { withCredentials: true }

// 갱신할 때마다 refresh 쿠키가 교체돼, 동시에 여러 번 보내면 뒤 요청은 이미 바뀐 쿠키로 실패한다. 진행 중인 갱신 하나를 같이 기다린다
let refreshing: Promise<string | null> | null = null

// 가입 화면 없이 카카오 정보만으로 가입한다. 서버는 필드를 빼는 건 허용하지만 보낸 값은 검증한다(빈 문자열은 거절).
// 그래서 카카오가 준 값만 넣고 전화번호와 없는 값은 아예 보내지 않는다
async function signUpWithKakao() {
  const prefill = async () =>
    (await api.get<ApiResponse<SignupPrefill>>('/api/v1/auth/signup', withSession)).data.data
  const post = (csrfToken: string, form: { name?: string; email?: string }) =>
    api.post('/api/v1/auth/signup', form, { ...withSession, headers: { 'X-CSRF-TOKEN': csrfToken } })

  let { name, email, csrfToken } = await prefill()
  const form = { ...(name ? { name } : {}), ...(email ? { email } : {}) }
  try {
    await post(csrfToken, form)
  } catch (e) {
    // 403은 CSRF 토큰과 JSESSIONID가 맞지 않는 경우. 새 토큰으로 한 번만 다시 보낸다
    if (!isAxiosError(e) || e.response?.status !== 403) throw e
    ;({ name, email, csrfToken } = await prefill())
    await post(csrfToken, form)
  }
  return name
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  handledCallbackQuery: null,
  callbackStatus: 'idle',
  callbackError: null,
  userName: null,
  accessToken: null,

  startKakaoLogin: () => {
    // OAuth 시작은 XHR이 아니라 페이지 이동이어야 카카오 인증 화면으로 302가 이어진다
    window.location.assign(api.getUri({ url: '/oauth2/authorization/kakao' }))
  },

  // 인가 코드 교환은 백엔드가 끝내고 쿠키만 남긴 채 이 화면으로 돌려보낸다.
  // 기존 회원이면 temp_refresh로 바로 토큰이 나오고, 신규 회원이면 JSESSIONID로 가입한 뒤 토큰을 받는다
  completeKakaoCallback: async (search) => {
    // StrictMode의 이중 실행이나 재렌더로 같은 확인을 다시 하지 않는다
    if (get().handledCallbackQuery === search) return
    set({ handledCallbackQuery: search, callbackStatus: 'loading', callbackError: null })

    const query = new URLSearchParams(search)
    if (query.has('error')) {
      set({ callbackStatus: 'failed', callbackError: '카카오 인증이 취소되었거나 실패했어요.' })
      return
    }

    if (query.get('signupRequired') !== 'true' && (await get().refreshAccessToken())) {
      set({ callbackStatus: 'done' })
      return
    }
    try {
      const userName = await signUpWithKakao()
      // 가입 응답과 함께 temp_refresh 쿠키가 온다
      if (!(await get().refreshAccessToken())) throw new Error('refresh failed')
      set({ userName, callbackStatus: 'done' })
    } catch (e) {
      set({
        callbackStatus: 'failed',
        callbackError:
          getApiErrorCode(e) === 'AUTH_SIGNUP_EXPIRED'
            ? '가입 가능 시간이 지났어요.\n카카오 인증부터 다시 진행해 주세요.'
            : isAxiosError(e)
              ? handleApiError(e)
              : '로그인을 완료하지 못했어요.',
      })
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
}))
