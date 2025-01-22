import { reactive, ref, watchEffect } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { ChatLunaModelInfo } from '@/lib/types'
import { useChatListStore } from './chat'
import { useConversationStore } from './conversation'
import { getModelList } from '@/apis/model'
import { useAssistantStore } from './assistant'

export const useModelStore = defineStore('model', () => {
  let modelList = ref<ChatLunaModelInfo[]>([])
  let currentModel = reactive<Record<string, ChatLunaModelInfo>>({})

  const refreshModelList = async () => {
    const response = await getModelList()
    modelList.value = response

    return response
  }

  const setCurrentModel = async (
    conversationId: string,
    model: ChatLunaModelInfo
  ) => {
    // TODO: update currentModel
    currentModel[conversationId] = model
  }

  const getCurrentModel = (conversationId: string) => {
    let model = currentModel[conversationId]

    if (model) {
      return model
    }

    const currentConversation = conversationList.value.find(
      (conversation) => conversation.id === conversationId
    )

    const currentAssistant = (assistantList.value ?? []).find(
      (assistant) => assistant.id === currentConversation?.assistantId
    )

    if (!currentAssistant || !currentConversation) {
      return
    }

    const currentModelInfo = modelList.value?.find(
      (model) =>
        model.name ===
        (currentConversation.model ?? currentAssistant?.model ?? '')
    )

    if (!currentModelInfo) {
      return
    }

    currentModel[conversationId] = currentModelInfo
    return currentModelInfo
  }

  const { currentConversationId: conversationId } =
    storeToRefs(useChatListStore())
  const { conversationList } = storeToRefs(useConversationStore())
  const { assistantList } = storeToRefs(useAssistantStore())

  watchEffect(() => {
    const currentConversationId = conversationId.value

    if (!currentConversationId) {
      return
    }

    getCurrentModel(currentConversationId)
  })

  return {
    modelList,
    refreshModelList,
    getCurrentModel,
    setCurrentModel
  }
})
