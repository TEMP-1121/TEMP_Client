export type Philosopher = {
  key: string
  name: string
  description: string
  tags: string[]
}

export type PhilosopherProfile = Philosopher & {
  era: string
  introduction: string
  conversationStyle: string
}
