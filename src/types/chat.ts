export type Quote = {
  text: string
  source: string
}

// 화면에서 쓰는 답변. 조언(advice) 답변은 서버가 text 대신 advice·quote로 보내 받을 때 text로 맞춘다
export type PersonaReply = {
  personaKey: string
  text: string
  quote?: Quote
}

// 서버가 실제로 보내는 답변 (Swagger에는 personaKey·text만 있지만 advice 턴은 advice·quote로 온다)
export type ServerReply = {
  personaKey: string
  text?: string
  advice?: string
  quote?: Quote
}

// conversation은 일반 대화, advice는 "이제 진지한 솔루션을 내놔라" 조언 요청
export type MessageType = 'conversation' | 'advice'

export type Turn = {
  turnId: string
  type: 'greeting' | MessageType
  clientMessageId: string | null
  message: string | null
  replies: PersonaReply[]
  createdAt: string
  // 전송에 실패한 내 메시지에 보여 줄 문구 (화면 전용, 서버에는 없음)
  failed?: string
}

export type Conversation = {
  conversationId: string
  personaKeys: string[]
  turns: Turn[]
  paused?: boolean
}

export type CreateConversationResponse = {
  conversationId: string
  personaKeys: string[]
  turn: Turn
}

export type SendMessageResponse = {
  conversationId: string
  turn: Turn
}

export type TurnFailedData = {
  conversationId: string
  clientMessageId: string
}

export type Delivery = {
  clientMessageId: string
  status: 'SUCCEEDED' | 'FAILED' | 'PENDING' | 'NOT_FOUND'
  turn: Turn | null
}

export type ConversationSummary = {
  conversationId: string
  personaKeys: string[]
  createdAt: string
  // 처음 저장된 사용자 메시지. 메시지가 아직 없는 방은 null
  title: string | null
}

export type ConversationList = {
  content: ConversationSummary[]
}

export type ConversationHistory = {
  conversationId: string
  personaKeys: string[]
  content: Turn[]
  delivery: Delivery | null
}
