import axios from 'axios'

import { usePreferenceStore, useUserInfo } from '@/stores/preference'
import type { ChatLunaConversation } from '@/lib/types'
import { apiServer } from './base'
import { getAssistantInfo } from './assisant'

export async function getConversationList(): Promise<ChatLunaConversation[]> {
  const service = apiServer()

  const response = await service.get('/v1/conversation/list')

  return response.data.data as ChatLunaConversation[]
}

export async function getConversationInfo(
  id: string
): Promise<ChatLunaConversation> {
  const service = apiServer()
  const response = await service.get(`/v1/conversation/info/${id}`)
  return response.data.data as ChatLunaConversation
}

export async function deleteConversation(id: string) {
  const service = apiServer()
  await service.delete(`/v1/conversation/delete/${id}`)
}

export async function createConversation(
  assistant?: string,
  title?: string,
  assistantId?: number
) {
  const service = apiServer()
  const { userInfo } = useUserInfo()

  if (assistant == null) {
    assistant = 'empty'
  }

  if (assistantId == null) {
    const assistantInfo = await getAssistantInfo(assistant)

    assistantId = assistantInfo.id
  }

  const response = await service.post('/v1/conversation/create', {
    conversation: {
      assistantId
    },
    additional: {
      userId: userInfo?.bindId,
      owner: true,
      assistant: assistant
    }
  })

  return response.data.data as ChatLunaConversation
}
