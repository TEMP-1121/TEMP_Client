import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/useAuthStore'

// 백엔드는 웹과 같은 주소 아래(/api …)로 프록시된다 (배포: vercel.json, 로컬: vite.config.ts). 다른 사이트로 부르면 로그인 쿠키가 막힌다
export const api = axios.create({
  timeout: 15000,
})

const REFRESH_URL = '/api/v1/auth/refresh'

// SSE는 axios를 거치지 않아(lib/sse.ts) 같은 토큰을 헤더로 직접 붙인다
export function authHeader(): Record<string, string> {
  const token = useAuthStore.getState().accessToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token && config.url !== REFRESH_URL) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Access Token은 15분이면 만료돼, 401이 오면 refresh 쿠키로 새 토큰을 받아 한 번만 다시 보낸다
api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!isAxiosError(error) || error.response?.status !== 401) throw error
  const config = error.config as (InternalAxiosRequestConfig & { retried?: boolean }) | undefined
  if (!config || config.retried || config.url === REFRESH_URL) throw error

  const token = await useAuthStore.getState().refreshAccessToken()
  if (!token) throw error
  config.retried = true
  config.headers.Authorization = `Bearer ${token}`
  return api(config)
})

export function handleApiError(error: unknown, fallback = '잠시 후 다시 시도해 주세요.') {
  if (isAxiosError(error)) {
    if (!error.response) return '인터넷 연결을 확인해 주세요.'
    const message = error.response.data?.message
    if (Array.isArray(message)) return String(message[0])
    if (typeof message === 'string') return message
  }
  return fallback
}

export function getApiErrorCode(error: unknown) {
  if (!isAxiosError(error)) return undefined
  const code: unknown = error.response?.data?.code
  return typeof code === 'string' ? code : undefined
}
