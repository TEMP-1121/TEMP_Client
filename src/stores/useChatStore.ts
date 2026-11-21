import { create } from 'zustand';

import { api, getApiErrorCode, handleApiError } from '@/lib/api';
import { revealInTurn } from '@/lib/revealInTurn';
import { postForEvent, toApiError } from '@/lib/sse';
import { uuid } from '@/lib/utils';
import type { ApiResponse } from '@/types/api';
import type {
  Conversation,
  ConversationHistory,
  CreateConversationResponse,
  MessageType,
  SendMessageResponse,
  Turn,
  TurnFailedData,
} from '@/types/chat';

type ChatState = {
  conversations: Conversation[];
  activeConversationId: string | null;
  typingKey: string | null;
  creating: boolean;
  sending: boolean;
  error: string | null;
  // 홈에서 쓰던 고민. 철학자 선택 화면을 오가도 남아 있어야 해서 페이지 상태가 아니라 여기 둔다
  draft: string;
  draftQuickStart: string;
  setDraft: (text: string, quickStart?: string) => void;
  createConversation: (
    personaKeys: string[],
    firstMessage?: string,
  ) => Promise<string | null>;
  sendMessage: (
    conversationId: string,
    message: string,
    type?: MessageType,
  ) => Promise<boolean>;
  endConversation: (conversationId: string) => void;
  setActiveConversation: (conversationId: string) => void;
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

  const userTurn = (message: string, type: MessageType): Turn => {
    const clientMessageId = uuid();
    return {
      turnId: clientMessageId,
      type,
      clientMessageId,
      message,
      replies: [],
      createdAt: new Date().toISOString(),
    };
  };

  // 종료 이벤트를 못 받고 연결이 끊기면 명세대로 이력 조회에 clientMessageId를 넘겨 처리 결과를 확인한다
  const findDelivered = async (conversationId: string, clientMessageId: string) => {
    const { data } = await api.get<ApiResponse<ConversationHistory>>(
      `/api/v1/chat/conversations/${conversationId}`,
      { params: { clientMessageId, size: 1 } },
    );
    const delivery = data.data.delivery;
    if (delivery?.status === 'SUCCEEDED' && delivery.turn) return delivery.turn;
    throw toApiError(
      {
        code: delivery?.status === 'PENDING' ? 'CHAT_TURN_PENDING' : 'CHAT_TURN_FAILED',
        message: '답을 받지 못했어요. 다시 보내 주세요.',
      },
      409,
    );
  };

  // 화면에 이미 올라간 사용자 턴을 서버에 보내고, SSE로 받은 철학자 답을 한 명씩 그 턴에 붙인다
  const deliver = async (
    conversationId: string,
    clientMessageId: string,
    message: string,
    type: MessageType,
  ) => {
    const turnId = clientMessageId;
    try {
      const result = await postForEvent<ApiResponse<SendMessageResponse | TurnFailedData>>(
        `/api/v1/chat/conversations/${conversationId}/messages`,
        { clientMessageId, message, type },
        ['turn.completed', 'turn.failed'],
      );
      if (result?.event === 'turn.failed') throw toApiError(result.data, 409);
      const turn =
        result && 'turn' in result.data.data
          ? result.data.data.turn
          : await findDelivered(conversationId, clientMessageId);

      // 서버는 전원의 답을 한 번에 보내지만, 단톡방처럼 보이도록 한 명씩 입력 중 표시와 함께 띄운다
      updateTurn(conversationId, turnId, () => ({ ...turn, turnId, replies: [] }));
      await revealReplies(conversationId, { ...turn, turnId });
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
    setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),

    draft: '',
    draftQuickStart: '',

    setDraft: (text, quickStart) =>
      set(quickStart === undefined ? { draft: text } : { draft: text, draftQuickStart: quickStart }),

    createConversation: async (personaKeys, firstMessage) => {
      // 응답 전에 방(과 홈에서 먼저 말한 고민)부터 보여야 이전 방이 잠깐 보였다가 바뀌지 않는다
      const pendingId = uuid();
      const pending = firstMessage ? userTurn(firstMessage, 'conversation') : null;
      set((s) => ({
        conversations: [
          ...s.conversations,
          {
            conversationId: pendingId,
            personaKeys,
            turns: pending ? [pending] : [],
          },
        ],
        activeConversationId: pendingId,
        creating: true,
        sending: true,
        error: null,
      }));
      try {
        const { data } = await api.post<ApiResponse<CreateConversationResponse>>(
          '/api/v1/chat/conversations',
          { personaKeys },
        );
        const { conversationId, turn } = data.data;
        // 고민을 먼저 말하고 들어온 방에서 인사가 그 뒤에 뜨면 어색해서 띄우지 않는다
        updateConversation(pendingId, (c) => ({
          ...c,
          conversationId,
          turns: pending ? c.turns : [{ ...turn, replies: [] }],
        }));
        set({ activeConversationId: conversationId, creating: false });
        if (pending && firstMessage)
          await deliver(conversationId, pending.turnId, firstMessage, 'conversation');
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

    sendMessage: async (conversationId, message, type = 'conversation') => {
      const conversation = get().conversations.find(
        (c) => c.conversationId === conversationId,
      );
      if (!conversation || get().sending) return false;

      const pending = userTurn(message, type);
      updateConversation(conversationId, (c) => ({
        ...c,
        turns: [...c.turns, pending],
      }));
      set({ sending: true, error: null });
      try {
        return await deliver(conversationId, pending.turnId, message, type);
      } finally {
        set({ sending: false, typingKey: null });
      }
    },

    // 임시: 대화 종료·선물 추천 API가 없어 로컬에서 종료 상태만 표시한다
    endConversation: (conversationId) =>
      updateConversation(conversationId, (c) => ({ ...c, ended: true })),
  };
});
