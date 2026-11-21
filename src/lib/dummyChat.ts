// 임시: BE 연동 전 채팅 흐름 테스트용. docs/TEMP_CHAT_API.md와 같은 응답을 돌려준다
// API가 나오면 이 파일을 지우고 useChatStore에서 api를 호출한다 (목데이터가 남으면 API 점수 0점)
import { revealInTurn } from '@/lib/revealInTurn'
import { uuid } from '@/lib/utils'
import type { ApiResponse } from '@/types/api'
import type { CreateConversationResponse, PersonaReply, SendMessageResponse, Turn } from '@/types/chat'

export const DUMMY_PERSONAS: Record<string, string> = {
  socrates: '소크라테스',
  seneca: '세네카',
  camus: '카뮈',
}

const GREETINGS: Record<string, string> = {
  socrates: '어서 오게. 무엇이 자네의 마음을 무겁게 하는가?',
  seneca: '반갑네. 오늘 그대가 붙들고 있는 고민을 들려주게.',
  camus: '왔군. 오늘은 어떤 바위를 밀고 있었나?',
}

const QUESTIONS: Record<string, string> = {
  socrates: '그 일에서 가장 바꾸고 싶은 것은 무엇인가?',
  seneca: '그중 그대가 바꿀 수 있는 부분은 어디까지인가?',
  camus: '그 반복 안에 자네가 스스로 고른 것은 있나?',
}

const ADVICE: Record<string, string> = {
  socrates: '"캐묻지 않는 삶은 살 가치가 없다." 답을 서두르지 말고 질문을 하나 더 품어 보게.',
  seneca: '"우리는 현실보다 상상 속에서 더 자주 괴로워한다." 오늘 할 수 있는 한 가지만 정하게.',
  camus: '"시지프는 행복하다고 상상해야 한다." 반복 속에서 자네만의 의미를 골라 보게.',
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const turn = (fields: Omit<Turn, 'turnId' | 'createdAt'>): Turn => ({
  turnId: uuid(),
  createdAt: new Date().toISOString(),
  ...fields,
})

export async function dummyCreateConversation(personaKeys: string[]) {
  await wait(500)
  const data: ApiResponse<CreateConversationResponse> = {
    code: 'SUCCESS',
    message: '채팅방을 개설했습니다.',
    data: {
      conversationId: uuid(),
      personaKeys,
      turn: turn({
        type: 'greeting',
        clientMessageId: null,
        message: null,
        replies: personaKeys.map((key) => ({ personaKey: key, text: GREETINGS[key] ?? '반갑네.' })),
      }),
    },
  }
  return { data }
}

export type StreamHandlers = {
  onTyping: (personaKey: string) => void
  onReply: (reply: PersonaReply) => void
}

// SSE 흉내: 철학자 답이 완성되는 대로 한 명씩 도착한다. 첫 메시지엔 질문, 그다음부터는 조언
// 실제 SSE 이벤트 형식이 나오면 이벤트를 onTyping·onReply로 넘기는 부분만 새로 만든다
export async function dummyStreamMessage(
  conversationId: string,
  personaKeys: string[],
  isFirstMessage: boolean,
  body: { clientMessageId: string; message: string },
  handlers: StreamHandlers,
): Promise<SendMessageResponse> {
  await wait(800)
  const lines = isFirstMessage ? QUESTIONS : ADVICE
  const replies = personaKeys.map((key) => ({ personaKey: key, text: lines[key] ?? '더 말해 주겠나?' }))
  await revealInTurn(replies, (reply) => handlers.onTyping(reply.personaKey), handlers.onReply)
  return {
    conversationId,
    turn: turn({ ...body, type: isFirstMessage ? 'question' : 'advice', replies }),
  }
}
