import axios, { isAxiosError } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
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
