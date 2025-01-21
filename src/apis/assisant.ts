import axios from 'axios'

import { usePreferenceStore, useUserInfo } from '@/stores/preference'
import type { ChatLunaAssistant, ChatLunaConversation } from '@/lib/types'
import { apiServer } from './base'

export async function getAssistantList(): Promise<ChatLunaAssistant[]> {
  const service = apiServer()

  const response = await service.get('/v1/assistant/list')

  return response.data.data as ChatLunaAssistant[]
}

export async function getAssistantInfo(
  idOrName: number | string
): Promise<ChatLunaAssistant> {
  const service = apiServer()
  const response = await service.get(`/v1/assistant/info/${idOrName}`)
  return response.data.data as ChatLunaAssistant
}
