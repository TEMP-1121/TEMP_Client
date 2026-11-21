export type PersonaReply = {
  personaKey: string
  text: string
}

export type Turn = {
  turnId: string
  type: 'greeting' | 'question' | 'advice'
  clientMessageId: string | null
  message: string | null
  replies: PersonaReply[]
  createdAt: string
}

export type Conversation = {
  conversationId: string
  personaKeys: string[]
  turns: Turn[]
  ended?: boolean
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
