export type PersonaReply = {
  personaKey: string
  text: string
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

export type ConversationHistory = {
  conversationId: string
  personaKeys: string[]
  content: Turn[]
  delivery: Delivery | null
}
