import { useEffect, useRef } from 'react'

const NEAR_BOTTOM_PX = 80

export function useAutoScroll<T extends HTMLElement>(trigger: unknown) {
  const ref = useRef<T>(null)
  const stick = useRef(true)

  useEffect(() => {
    const el = ref.current
    // 위쪽 대화를 읽는 중이면 새 답이 와도 끌어내리지 않는다
    if (el && stick.current) el.scrollTo({ top: el.scrollHeight })
  }, [trigger])

  const onScroll = () => {
    const el = ref.current
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX
  }

  const stickToBottom = () => {
    stick.current = true
  }

  return { ref, onScroll, stickToBottom }
}
