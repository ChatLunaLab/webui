import { computed, effect, reactive, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getMessageList, streamChat } from '@/apis/index'
import { asyncComputed, computedAsync, useAsyncState } from '@vueuse/core'
import type {
  ChatLunaAssistant,
  ChatLunaConversation,
  ChatLunaMessage
} from '@/lib/types'
import { TypeWriter } from '@/lib/type_writer'
import { getConversationList } from '@/apis/conversation'
import { getAssistantInfo, getAssistantList } from '@/apis/assisant'

export const useAssistant = defineStore(
  'assistant',
  () => {
    let assistantList = ref<ChatLunaAssistant[]>([])

    let fetchAssistantList = computedAsync(
      async () => {
        const response = await getAssistantList()
        assistantList.value = response
        return response
      },
      [],
      {
        lazy: true
      }
    )

    return {
      assistantList,
      fetchAssistantList
    }
  }
)
