export interface AgentInfo {
  name?: string
  description?: string
  avatar: string
  author?: string
  examples: {
    title: string
    prompt: string
  }[]
}

export interface ChatLunaMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  name?: string
  id: string
  createdAt: Date
}

export interface Preference {
  baseURL?: string
}
