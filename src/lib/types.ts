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
