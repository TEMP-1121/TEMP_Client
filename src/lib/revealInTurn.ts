const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function typingDelay(text: string) {
  return Math.min(1800, 600 + text.length * 20)
}

// AI는 한 번 호출로 전원 답을 주지만, 한꺼번에 뜨면 단톡방이 아니라 답변 목록처럼 보여 한 명씩 타이핑하듯 띄운다
export async function revealInTurn<T extends { text: string }>(
  items: T[],
  onTyping: (item: T) => void,
  onReveal: (item: T) => void,
) {
  for (const item of items) {
    onTyping(item)
    await wait(typingDelay(item.text))
    onReveal(item)
  }
}
