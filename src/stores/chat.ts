import { computed, effect, reactive, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getMessageList, streamChat } from '@/apis/index'
import { asyncComputed, useAsyncState } from '@vueuse/core'
import type { ChatLunaMessage } from '@/lib/types'
import { TypeWriter } from '@/lib/type_writer'
import { usePreferenceStore } from './preference'
import { useConversation } from './conversation'
import {
  createConversation,
  summaryConversationTitle
} from '@/apis/conversation'
import { useAssistant } from './assistant'

export const useChatListStore = defineStore('chatList', () => {
  const globalChatListMap = reactive<Record<string, ChatLunaMessage[]>>({})

  const conversationId = ref<string>('')

  watch(conversationId, (newValue) => {
    const { set } = usePreferenceStore()

    const conversationId = newValue

    if (conversationId == null) {
      return
    }

    set({
      conversationId
    })
  })

  const getChatList = async (id: string) => {
    const newChatList = await getMessageList(id)
    globalChatListMap[id] = newChatList
    return newChatList
  }

  const currentChatList = asyncComputed(
    async () => {
      const id = conversationId.value
      if (!id) {
        return []
      }
      const cache = globalChatListMap[id]
      if (cache) {
        return cache
      } else {
        return await getChatList(id)
      }
    },
    [],
    {}
  )

  const putMessage = (message: ChatLunaMessage) => {
    const id = conversationId.value
    if (!id) {
      return
    }
    globalChatListMap[id] = globalChatListMap[id].concat(message)
  }

  const setMessage = (messageId: string, message: Partial<ChatLunaMessage>) => {
    const id = conversationId.value
    if (!id) {
      return
    }
    const messageIndex = globalChatListMap[id].findIndex(
      (m) => m.id === messageId
    )

    if (messageIndex !== -1) {
      globalChatListMap[id][messageIndex] = Object.assign(
        {},
        globalChatListMap[id][messageIndex],
        message
      )
      globalChatListMap[id] = globalChatListMap[id].slice()
    }
  }

  return {
    putMessage,
    getChatList,
    currentChatList,
    conversationId,
    setMessage
  }
})

export const useChatContent = defineStore('chatContent', () => {
  const chatListStore = useChatListStore()
  const { putMessage, setMessage, getChatList } = chatListStore
  const { refreshConversationList } = useConversation()
  const { currentChatList, conversationId } = storeToRefs(chatListStore)
  const { conversationList } = storeToRefs(useConversation())
  const { currentAssistant } = storeToRefs(useAssistant())

  const chatContent = reactive({
    content: '',
    id: '',
    streaming: false
  })

  const typeWriter = new TypeWriter()

  const chat = async (message: ChatLunaMessage) => {
    // create new conversation
    if (!conversationId.value || conversationId.value === '') {
      const newConversation = await createConversation(
        currentAssistant.value?.name,
        undefined,
        currentAssistant.value?.id
      )
      conversationId.value = newConversation.id
      await getChatList(conversationId.value)
      await refreshConversationList()
    }

    const baseList = currentChatList.value

    const lastMessage = baseList[baseList.length - 1]

    message.id =
      lastMessage == null ? '0' : (parseInt(lastMessage.id) + 1).toString()

    const nextMessageId = (parseInt(message.id) + 1).toString()

    chatContent.id = nextMessageId

    putMessage(message)
    putMessage({
      role: 'assistant',
      id: nextMessageId,
      createdAt: new Date(),
      content: ''
    })

    chatContent.streaming = true

    typeWriter.start((text) => {
      if (text === '[DONE]') {
        chatContent.streaming = false
        setMessage(nextMessageId, {
          content: chatContent.content
        })
        chatContent.content = ''
        return
      }
      chatContent.content += text
    })

    for await (const content of streamChat(conversationId.value, message)) {
      await typeWriter.write(content)
    }

    typeWriter.done()

    // update conversation title
    const conversationListValue = conversationList.value

    if (conversationListValue == null) {
      return
    }

    const currentConversation = conversationListValue.find((c) => {
      return c.id === conversationId.value
    })

    if (
      currentConversation != null &&
      (currentConversation.title == null || currentConversation.title === '')
    ) {
      const newConversation = await summaryConversationTitle(
        conversationId.value
      )

      conversationList.value = conversationListValue.map((c) => {
        if (c.id === conversationId.value) {
          return newConversation
        }
        return c
      })
    }
  }

  return {
    chatContent,
    chat
  }
})
