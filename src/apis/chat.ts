import type { ChatLunaMessage } from '@/lib/types'
import EventSourceStream from '@server-sent-stream/web'
import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

export async function getMessageList(
  conversationId: string
): Promise<ChatLunaMessage[]> {
  // TODO: get message list
  return []
}

export async function* streamChat(
  /* conversationId: string, */
  /* message: ChatLunaMessage */
  messageList: ChatLunaMessage[]
): AsyncGenerator<string> {
  // TODO: use the default axios client

  const response = await service.post(
    `chat/completions`,
    {
      messages: messageList.map((message) => {
        return {
          role: message.role,
          content: message.content
        }
      }),
      max_tokens: 2048,
      temperature: 1,
      n: 1,
      model: 'gpt-4o-mini',
      stream: true
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      responseType: 'stream',
      adapter: 'fetch'
    }
  )

  const stream = response.data // <- should be a ReadableStream

  const decoder = new EventSourceStream()
  stream.pipeThrough(decoder)

  // Read from the EventSourceStream
  const reader = decoder.readable.getReader()

  while (true) {
    const { value, done } = await reader.read()
    if (done || value.data === 'DONE') break

    const chunk = JSON.parse(value.data) as OpenAIDeltaChunk
    if (chunk.choices[0]?.finish_reason === 'stop') {
      break
    }
    if (chunk.choices[0]?.delta?.content) {
      yield chunk.choices[0].delta.content
    }
  }
}

interface OpenAIDeltaChunk {
  id: string
  object: string
  created: number
  model: string
  system_fingerprint: string
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
