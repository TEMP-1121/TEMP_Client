import axios, { isAxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

// 채팅 API는 Bearer JWT가 필요하다. 토큰 발급 흐름(카카오 로그인 → POST /api/v1/auth/refresh)이 정해지면 로그인 쪽에서 setAccessToken으로 넣는다
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function authHeader(): Record<string, string> {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
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
