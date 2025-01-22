export interface AssistantInfo {
  name?: string
  description?: string
  avatar: string
  author?: string
  examples?: {
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
  conversationId?: string
}

export interface LoginInfo {
  accessToken: string
  refreshToken: string
}

export interface SignInInfo {
  email: string
  password: string
}

export interface SignUpInfo extends SignInInfo {
  username: string
}

export interface ChatLunaConversation {
  id: string
  latestMessageId?: string
  updatedTime: string
  additional_kwargs?: Record<string, any>
  assistantId: number
  model?: string
  createdTime: string
  title?: string
}

export interface ChatLunaAssistant {
  id: number
  name: string
  preset: string
  model: string
  description?: string
  avatar?: string
  tools?: {
    name: string
    enabled: boolean
    alwaysEnabled?: boolean
    triggerKeywords?: string[]
  }[]
  files?: string[]
  shared?: boolean
  ownerId?: string
}

export interface ChatLunaModelInfo {
  name: string
  type: 'embeddings' | 'llm'
  maxTokens?: number
  capabilities: (keyof typeof ModelCapability)[]
  costPerTokenInput?: number
  costPerTokenOutput?: number
}

export enum ModelCapability {
  INPUT_TEXT = 0,
  INPUT_VOICE = 1,
  INPUT_IMAGE = 2,
  OUTPUT_TEXT = 3,
  OUTPUT_IMAGE = 4,
  OUTPUT_VOICE = 5,
  FUNCTION_CALL = 6
}
