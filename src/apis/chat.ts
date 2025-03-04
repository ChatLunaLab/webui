import type { ChatLunaMessage } from '@/lib/types'
import EventSourceStream from '@server-sent-stream/web'
import { apiServer } from './base'

export async function getMessageList(
  conversationId: string
): Promise<ChatLunaMessage[]> {
  const service = apiServer()

  const response = await service.get(`v1/chat/${conversationId}/messages`)

  return response.data.data as ChatLunaMessage[]
}

export async function* streamChat(
  conversationId: string,
  message: ChatLunaMessage
): AsyncGenerator<string> {
  const service = apiServer()

  const response = await service.post(
    `v1/chat/${conversationId}`,
    {
      message: message
    },
    {
      responseType: 'stream'
    }
  )

  const stream = response.data // <- should be a ReadableStream

  const decoder = new EventSourceStream()
  stream.pipeThrough(decoder)

  // Read from the EventSourceStream
  const reader = decoder.readable.getReader()

  while (true) {
    const { value, done } = await reader.read()
    if (done || value.data === '[DONE]') {
      reader.releaseLock()
      break
    }

    const chunk = JSON.parse(value.data) as DeltaChunk
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content
    }
  }
}

interface DeltaChunk {
  id: string
  object: string
  created: number
  model: string
  choices: [
    {
      index: number
      delta?: {
        role: string
        content: string
      }
      finish_reason: string | null
    }
  ]
}
