import { create } from 'zustand';

import { getApiErrorCode, handleApiError } from '@/lib/api';
import { dummyCreateConversation, dummyStreamMessage } from '@/lib/dummyChat';
import { revealInTurn } from '@/lib/revealInTurn';
import { uuid } from '@/lib/utils';
import type { Conversation, Turn } from '@/types/chat';

type ChatState = {
  conversations: Conversation[];
  typingKey: string | null;
  creating: boolean;
  sending: boolean;
  error: string | null;
  createConversation: (
    personaKeys: string[],
    firstMessage?: string,
  ) => Promise<string | null>;
  sendMessage: (conversationId: string, message: string) => Promise<boolean>;
  endConversation: (conversationId: string) => void;
};

export const useChatStore = create<ChatState>()((set, get) => {
  const updateConversation = (
    id: string,
    update: (c: Conversation) => Conversation,
  ) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.conversationId === id ? update(c) : c,
      ),
    }));

  const updateTurn = (id: string, turnId: string, update: (t: Turn) => Turn) =>
    updateConversation(id, (c) => ({
      ...c,
      turns: c.turns.map((t) => (t.turnId === turnId ? update(t) : t)),
    }));

  const revealReplies = (id: string, turn: Turn) =>
    revealInTurn(
      turn.replies,
      (reply) => set({ typingKey: reply.personaKey }),
      (reply) =>
        updateTurn(id, turn.turnId, (t) => ({
          ...t,
          replies: [...t.replies, reply],
        })),
    );

  const userTurn = (message: string): Turn => {
    const clientMessageId = uuid();
    return {
      turnId: clientMessageId,
      type: 'question',
      clientMessageId,
      message,
      replies: [],
      createdAt: new Date().toISOString(),
    };
  };

  // 화면에 이미 올라간 사용자 턴을 서버에 보내고, 철학자 답을 오는 대로 그 턴에 붙인다
  const deliver = async (
    conversationId: string,
    personaKeys: string[],
    isFirstMessage: boolean,
    clientMessageId: string,
    message: string,
  ) => {
    const turnId = clientMessageId;
    try {
      const { turn } = await dummyStreamMessage(
        conversationId,
        personaKeys,
        isFirstMessage,
        { clientMessageId, message },
        {
          onTyping: (personaKey) => set({ typingKey: personaKey }),
          onReply: (reply) =>
            updateTurn(conversationId, turnId, (t) => ({
              ...t,
              replies: [...t.replies, reply],
            })),
        },
      );
      updateTurn(conversationId, turnId, (t) => ({
        ...turn,
        replies: t.replies,
      }));
      return true;
    } catch (e) {
      // 접수되지 않은 메시지는 화면에서 빼고, 입력창에 되돌려 다시 보낼 수 있게 한다
      updateConversation(conversationId, (c) => ({
        ...c,
        turns: c.turns.filter((t) => t.turnId !== turnId),
      }));
      set({
        error:
          getApiErrorCode(e) === 'CHAT_CONVERSATION_BUSY'
            ? '철학자들이 아직 답하는 중이에요. 잠시 후 다시 보내 주세요.'
            : handleApiError(e),
      });
      return false;
    }
  };

  return {
    conversations: [],
    activeConversationId: null,
    typingKey: null,
    creating: false,
    sending: false,
    error: null,

    createConversation: async (personaKeys, firstMessage) => {
      // 응답 전에 방(과 홈에서 먼저 말한 고민)부터 보여야 이전 방이 잠깐 보였다가 바뀌지 않는다
      const pendingId = uuid();
      const pending = firstMessage ? userTurn(firstMessage) : null;
      set((s) => ({
        conversations: [
          ...s.conversations,
          {
            conversationId: pendingId,
            personaKeys,
            turns: pending ? [pending] : [],
          },
        ],
        creating: true,
        sending: true,
        error: null,
      }));
      try {
        const { data } = await dummyCreateConversation(personaKeys);
        const { conversationId, turn } = data.data;
        // 고민을 먼저 말하고 들어온 방에서 인사가 그 뒤에 뜨면 어색해서 띄우지 않는다
        updateConversation(pendingId, (c) => ({
          ...c,
          conversationId,
          turns: pending ? c.turns : [{ ...turn, replies: [] }],
        }));
        set({ creating: false });
        if (pending && firstMessage)
          await deliver(
            conversationId,
            personaKeys,
            true,
            pending.turnId,
            firstMessage,
          );
        else await revealReplies(conversationId, turn);
        return conversationId;
      } catch (e) {
        set((s) => ({
          conversations: s.conversations.filter(
            (c) => c.conversationId !== pendingId,
          ),
          error: handleApiError(e),
        }));
        return null;
      } finally {
        set({ creating: false, sending: false, typingKey: null });
      }
    },

    sendMessage: async (conversationId, message) => {
      const conversation = get().conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (!conversation || get().sending) return false;

      const pending = userTurn(message);
      const isFirstMessage = !conversation.turns.some((t) => t.message);
      updateConversation(conversationId, (c) => ({
        ...c,
        turns: [...c.turns, pending],
      }));
      set({ sending: true, error: null });
      try {
        return await deliver(
          conversationId,
          conversation.personaKeys,
          isFirstMessage,
          pending.turnId,
          message,
        );
      } finally {
        set({ sending: false, typingKey: null });
      }
    },

    // 임시: 대화 종료·선물 추천 API가 없어 로컬에서 종료 상태만 표시한다
    endConversation: (conversationId) =>
      updateConversation(conversationId, (c) => ({ ...c, ended: true })),
  };
});
