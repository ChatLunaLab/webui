import axios from 'axios'

import { usePreferenceStore } from '@/stores/preference'
import type { ChatLunaConversation } from '@/lib/types'
import { apiServer } from './base'

export async function getConversationList(): Promise<ChatLunaConversation[]> {
  const service = apiServer()

  const response = await service.get('/v1/conversation/list')

  return response.data.data as ChatLunaConversation[]
}
