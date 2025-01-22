import axios from 'axios'

import { usePreferenceStore, useUserInfo } from '@/stores/preference'
import type { ChatLunaConversation, ChatLunaModelInfo } from '@/lib/types'
import { apiServer } from './base'
import { getAssistantInfo } from './assisant'

export async function getModelList(): Promise<ChatLunaModelInfo[]> {
  const service = apiServer()

  const response = await service.get('/v1/model/list')

  return (response.data.data as ChatLunaModelInfo[]).sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
}
