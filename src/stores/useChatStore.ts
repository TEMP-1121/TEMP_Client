import { create } from 'zustand'

import { getApiErrorCode, handleApiError } from '@/lib/api'
import { dummyCreateConversation, dummyStreamMessage } from '@/lib/dummyChat'
import { revealInTurn } from '@/lib/revealInTurn'
import { uuid } from '@/lib/utils'
import type { Conversation, Turn } from '@/types/chat'

type ChatState = {
  conversations: Conversation[]
  typingKey: string | null
  creating: boolean
  sending: boolean
  error: string | null
  createConversation: (personaKeys: string[]) => Promise<string | null>
  sendMessage: (conversationId: string, message: string) => Promise<boolean>
  endConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>()((set, get) => {
  const updateConversation = (id: string, update: (c: Conversation) => Conversation) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.conversationId === id ? update(c) : c)),
    }))

  const updateTurn = (id: string, turnId: string, update: (t: Turn) => Turn) =>
    updateConversation(id, (c) => ({
      ...c,
      turns: c.turns.map((t) => (t.turnId === turnId ? update(t) : t)),
    }))

  const revealReplies = (id: string, turn: Turn) =>
    revealInTurn(
      turn.replies,
      (reply) => set({ typingKey: reply.personaKey }),
      (reply) => updateTurn(id, turn.turnId, (t) => ({ ...t, replies: [...t.replies, reply] })),
    )

  return {
    conversations: [],
    typingKey: null,
    creating: false,
    sending: false,
    error: null,

    createConversation: async (personaKeys) => {
      // 응답 전에 빈 방부터 보여야 이전 방이 잠깐 보였다가 바뀌지 않는다
      const pendingId = uuid()
      set((s) => ({
        conversations: [...s.conversations, { conversationId: pendingId, personaKeys, turns: [] }],
        creating: true,
        sending: true,
        error: null,
      }))
      try {
        const { data } = await dummyCreateConversation(personaKeys)
        const { conversationId, turn } = data.data
        updateConversation(pendingId, (c) => ({ ...c, conversationId, turns: [{ ...turn, replies: [] }] }))
        set({ creating: false })
        await revealReplies(conversationId, turn)
        return conversationId
      } catch (e) {
        set((s) => ({
          conversations: s.conversations.filter((c) => c.conversationId !== pendingId),
          error: handleApiError(e),
        }))
        return null
      } finally {
        set({ creating: false, sending: false, typingKey: null })
      }
    },

    sendMessage: async (conversationId, message) => {
      const conversation = get().conversations.find((c) => c.conversationId === conversationId)
      if (!conversation || get().sending) return false

      const clientMessageId = uuid()
      const pending: Turn = {
        turnId: clientMessageId,
        type: 'question',
        clientMessageId,
        message,
        replies: [],
        createdAt: new Date().toISOString(),
      }
      const isFirstMessage = !conversation.turns.some((t) => t.message)
      updateConversation(conversationId, (c) => ({ ...c, turns: [...c.turns, pending] }))
      set({ sending: true, error: null })

      try {
        const { turn } = await dummyStreamMessage(
          conversationId,
          conversation.personaKeys,
          isFirstMessage,
          { clientMessageId, message },
          {
            onTyping: (personaKey) => set({ typingKey: personaKey }),
            onReply: (reply) =>
              updateTurn(conversationId, pending.turnId, (t) => ({ ...t, replies: [...t.replies, reply] })),
          },
        )
        updateTurn(conversationId, pending.turnId, (t) => ({ ...turn, replies: t.replies }))
        return true
      } catch (e) {
        // 접수되지 않은 메시지는 화면에서 빼고, 입력창에 되돌려 다시 보낼 수 있게 한다
        updateConversation(conversationId, (c) => ({
          ...c,
          turns: c.turns.filter((t) => t.turnId !== pending.turnId),
        }))
        set({
          error:
            getApiErrorCode(e) === 'CHAT_CONVERSATION_BUSY'
              ? '철학자들이 아직 답하는 중이에요. 잠시 후 다시 보내 주세요.'
              : handleApiError(e),
        })
        return false
      } finally {
        set({ sending: false, typingKey: null })
      }
    },

    // 임시: 대화 종료·선물 추천 API가 없어 로컬에서 종료 상태만 표시한다
    endConversation: (conversationId) => updateConversation(conversationId, (c) => ({ ...c, ended: true })),
  }
})
