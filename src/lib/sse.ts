import { AxiosError, AxiosHeaders } from 'axios'

import { api, authHeader } from '@/lib/api'
import { useAuthStore } from '@/stores/useAuthStore'

export type SseEvent<T> = { event: string; data: T }

// 접수 전 오류(JSON)나 실패 이벤트를 AxiosError로 바꿔 handleApiError·getApiErrorCode를 그대로 쓴다
export function toApiError(data: unknown, status: number) {
  const message =
    typeof data === 'object' && data && 'message' in data ? String(data.message) : '요청에 실패했어요.'
  return new AxiosError(message, String(status), undefined, undefined, {
    data,
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  })
}

function parseBlock(block: string) {
  let event = 'message'
  const data: string[] = []
  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''))
  }
  return { event, data: data.join('\n') }
}

// axios는 브라우저에서 응답 스트림을 읽지 못해 SSE만 fetch로 받는다.
// endEvents 중 하나가 오면 그 이벤트를 돌려주고, 결과 없이 연결이 끝나면 null (호출한 쪽이 이력 조회로 확인)
export async function postForEvent<T>(url: string, body: unknown, endEvents: string[]): Promise<SseEvent<T> | null> {
  const send = () =>
    fetch(api.getUri({ url }), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream', ...authHeader() },
      body: JSON.stringify(body),
    })
  let res = await send()
  // axios 응답 인터셉터와 같은 규칙: 토큰이 만료돼 401이면 refresh 쿠키로 새 토큰을 받아 한 번만 다시 보낸다
  if (res.status === 401 && (await useAuthStore.getState().refreshAccessToken())) res = await send()
  if (!res.ok) throw toApiError(await res.json().catch(() => null), res.status)
  if (!res.body) return null

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const blocks = buffer.split(/\r?\n\r?\n/)
    buffer = done ? '' : (blocks.pop() ?? '')
    for (const block of blocks) {
      const { event, data } = parseBlock(block)
      if (endEvents.includes(event)) {
        await reader.cancel()
        return { event, data: JSON.parse(data) as T }
      }
    }
    if (done) return null
  }
}
