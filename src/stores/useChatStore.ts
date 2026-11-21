import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
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
          set({ creating: true, error: null })
          try {
            const { data } = await dummyCreateConversation(personaKeys)
            const { conversationId, turn } = data.data
            set((s) => ({
              conversations: [
                ...s.conversations,
                { conversationId, personaKeys, turns: [{ ...turn, replies: [] }] },
              ],
              creating: false,
              sending: true,
            }))
            await revealReplies(conversationId, turn)
            return conversationId
          } catch (e) {
            set({ error: handleApiError(e) })
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
      }
    },
    // 임시: 대화 기록은 localStorage에만 있다. BE에 이력 조회 API가 생기면 그걸로 받고 persist를 뺀다
    { name: 'ilse-chat', partialize: (s) => ({ conversations: s.conversations }) },
  ),
)
