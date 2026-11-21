import { useEffect } from 'react'

import ChatPage from '@/pages/ChatPage'
import { useChatStore } from '@/stores/useChatStore'

const TEST_CONVERSATION_ID = 'chat-pause-test'

// 위기 감지 API가 아직 없어, 멈춤 상태의 방을 스토어에 직접 넣어 안내 카드를 확인한다 (개발 서버 전용)
export default function ChatPauseTestPage() {
  const ready = useChatStore((s) => s.conversations[s.conversations.length - 1]?.conversationId === TEST_CONVERSATION_ID)

  useEffect(() => {
    useChatStore.setState((s) => ({
      conversations: [
        ...s.conversations.filter((c) => c.conversationId !== TEST_CONVERSATION_ID),
        {
          conversationId: TEST_CONVERSATION_ID,
          personaKeys: ['epictetus', 'nietzsche', 'epicurus'],
          paused: true,
          turns: [
            {
              turnId: 'chat-pause-test-turn',
              type: 'question',
              clientMessageId: null,
              message: '매일 같은 보고서만 써서 지겨워요',
              replies: [],
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ],
    }))
  }, [])

  return ready ? <ChatPage /> : null
}
