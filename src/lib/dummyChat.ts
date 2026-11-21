// 임시: BE 연동 전 채팅 흐름 테스트용. docs/TEMP_CHAT_API.md와 같은 응답을 돌려준다
// API가 나오면 이 파일을 지우고 useChatStore에서 api를 호출한다 (목데이터가 남으면 API 점수 0점)
import { revealInTurn } from '@/lib/revealInTurn'
import { uuid } from '@/lib/utils'
import type { ApiResponse } from '@/types/api'
import type { CreateConversationResponse, PersonaReply, SendMessageResponse, Turn } from '@/types/chat'
import type { Philosopher } from '@/types/philosopher'

// 디자인 시스템의 철학자 9명(--color-philosopher-*) 기준
export const DUMMY_PHILOSOPHERS: Philosopher[] = [
  { key: 'epictetus', name: '에픽테토스', description: '내게 달린 선택에 집중해요.', tags: ['통제', '선택'] },
  { key: 'nietzsche', name: '니체', description: '남의 성공 기준을 의심하고 내 기준을 세워요.', tags: ['내기준', '자기극복'] },
  { key: 'marx', name: '마르크스', description: '누가 일을 결정하는지 보고, 바꿀 조건을 찾아요.', tags: ['노동', '구조'] },
  { key: 'camus', name: '카뮈', description: '답이 없는 반복 속에서 내가 취할 태도를 찾아요.', tags: ['반복', '태도'] },
  { key: 'zhuangzi', name: '장자', description: '당연한 기준을 뒤집어 다른 길을 보여줘요.', tags: ['관점전환', '자유'] },
  { key: 'epicurus', name: '에피쿠로스', description: '꼭 필요한 욕구와 불안을 키우는 욕구를 나눠요.', tags: ['욕구', '작은행복'] },
  { key: 'aristotle', name: '아리스토텔레스', description: '되고 싶은 사람에 가까워지는 습관을 제안해요.', tags: ['습관', '성장'] },
  { key: 'arendt', name: '한나 아렌트', description: '동료와 함께 새롭게 시작할 일을 찾아요.', tags: ['협업', '새시작'] },
  { key: 'weil', name: '시몬 베유', description: '일하는 사람을 지치게 하는 업무 조건을 짚어요.', tags: ['업무조건', '번아웃'] },
]

const GREETINGS: Record<string, string> = {
  epictetus: '어서 오게. 오늘 자네 손에 달린 일과 아닌 일을 함께 나눠 보세.',
  nietzsche: '왔군! 오늘은 무엇이 자네를 지치게 했나?',
  marx: '반갑네. 그 일이 누구를 위해 돌아가는지부터 들어 보세.',
  camus: '왔군. 오늘은 어떤 바위를 밀고 있었나?',
  zhuangzi: '반갑네. 쓸모를 잠시 내려놓고 이야기해 보게.',
  epicurus: '어서 오게. 차 한 잔 하며 천천히 이야기하세.',
  aristotle: '반갑네. 자네가 잘하고 싶은 일이 무엇인지 들려주게.',
  arendt: '반가워요. 오늘 어떤 일을 했는지부터 이야기해 볼까요?',
  weil: '어서 와요. 지금 무엇에 주의를 빼앗기고 있나요?',
}

const QUESTIONS: Record<string, string> = {
  epictetus: '그 일에서 자네가 바꿀 수 있는 부분은 어디까지인가?',
  nietzsche: '오늘을 영원히 다시 살아야 한다면, 무엇을 바꾸겠나?',
  marx: '그 일의 결과는 누구에게 돌아가나?',
  camus: '그 반복 안에 자네가 스스로 고른 것은 있나?',
  zhuangzi: '꼭 쓸모 있는 사람이어야만 하는가?',
  epicurus: '오늘 업무 사이에 자네만의 작은 즐거움은 있었나?',
  aristotle: '그 일을 잘 해냈을 때 자네는 어떤 사람이 되어 있나?',
  arendt: '그 일은 노동인가요, 작업인가요, 아니면 행위인가요?',
  weil: '그 일에 온전히 주의를 기울인 순간이 있었나요?',
}

const ADVICE: Record<string, string> = {
  epictetus: '"우리를 괴롭히는 것은 일이 아니라 일에 대한 생각이다." 생각부터 나눠 보게.',
  nietzsche: '지겹다면 부숴 버리게! 같은 일도 자네 방식으로 다시 쓰면 창조일세.',
  marx: '자네가 만든 것에서 자네가 빠져 있다면, 지치는 게 당연하네.',
  camus: '"시지프는 행복하다고 상상해야 한다." 반복 속에서 자네만의 의미를 골라 보게.',
  zhuangzi: '쓸모없는 나무가 오래 사는 법이지. 오늘은 조금 쓸모없어도 괜찮네.',
  epicurus: '일 끝나면 좋아하는 커피 한 잔을 상으로 주게. 작은 즐거움이 하루를 버티게 하네.',
  aristotle: '탁월함은 습관일세. 오늘 하나만 어제보다 낫게 해 보게.',
  arendt: '생각 없이 반복하는 게 가장 위험해요. 오늘 한 줄은 당신의 생각으로 써 보세요.',
  weil: '주의는 가장 드문 너그러움이에요. 한 가지 일에만 온전히 머물러 보세요.',
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
