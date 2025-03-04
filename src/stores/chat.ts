import {
  computed,
  effect,
  reactive,
  ref,
  toRef,
  toRefs,
  watch,
  watchEffect
} from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getMessageList, streamChat } from '@/apis/index'
import { asyncComputed, useAsyncState } from '@vueuse/core'
import type { ChatLunaMessage } from '@/lib/types'
import { TypeWriter } from '@/lib/type_writer'
import { usePreferenceStore } from './preference'
import { useConversationStore } from './conversation'
import {
  createConversation,
  summaryConversationTitle
} from '@/apis/conversation'
import { useAssistantStore } from './assistant'
import { useModelStore } from './model'

export const useChatListStore = defineStore('chatList', () => {
  const globalChatListMap = reactive<Record<string, ChatLunaMessage[]>>({})

  const currentConversationId = ref<string>('')

  watchEffect(() => {
    const { set } = usePreferenceStore()
    const conversationId = currentConversationId.value

    set({
      conversationId
    })
  })

  const fetchChatList = async (id: string) => {
    const newChatList = await getMessageList(id)
    globalChatListMap[id] = newChatList
    return newChatList
  }

  const currentChatList = asyncComputed(
    async () => {
      const id = currentConversationId.value
      if (!id) {
        return []
      }
      const cache = globalChatListMap[id]
      if (cache) {
        return cache
      } else {
        return await fetchChatList(id)
      }
    },
    [],
    {}
  )

  const getChatList = async (id: string) => {
    if (!globalChatListMap[id]) {
      await fetchChatList(id)
    }

    return globalChatListMap[id]
  }

  const putMessage = (id: string, message: ChatLunaMessage) => {
    globalChatListMap[id] = globalChatListMap[id].concat(message)
  }

  const createMessageList = (id: string, messages: ChatLunaMessage[]) => {
    console.log(id, messages)
    globalChatListMap[id] = messages
  }

  const setMessage = (
    id: string,
    messageId: string,
    message: Partial<ChatLunaMessage>
  ) => {
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
    fetchChatList,
    currentChatList,
    currentConversationId,
    createMessageList,
    setMessage
  }
})

export const useChatContent = defineStore('chatContent', () => {
  const chatListStore = useChatListStore()
  const { putMessage, setMessage, createMessageList } = chatListStore
  const { refreshConversationList } = useConversationStore()
  const { currentChatList, currentConversationId: conversationId } =
    storeToRefs(chatListStore)
  const { conversationList } = storeToRefs(useConversationStore())
  const { currentAssistant } = storeToRefs(useAssistantStore())

  const chatContent = reactive({
    content: '',
    id: '',
    streaming: false
  })

  const typeWriter = new TypeWriter()

  const newConversation = async () => {
    const { currentModel } = useModelStore()
    const newConversation = await createConversation(
      currentAssistant.value?.name,
      undefined,
      currentAssistant.value?.id,
      currentModel
    )
    conversationId.value = newConversation.id
    createMessageList(newConversation.id, [])

    await refreshConversationList()
    return newConversation.id
  }

  const chat = async (message: ChatLunaMessage) => {
    let currentConversationId = conversationId.value
    // create new conversation
    if (!currentConversationId || currentConversationId === '') {
      currentConversationId = await newConversation()
    }

    const baseList = currentChatList.value

    const lastMessage = baseList[baseList.length - 1]

    message.id =
      lastMessage == null ? '0' : (parseInt(lastMessage.id) + 1).toString()

    const nextMessageId = (parseInt(message.id) + 1).toString()

    chatContent.id = nextMessageId

    putMessage(currentConversationId, message)
    putMessage(currentConversationId, {
      role: 'assistant',
      id: nextMessageId,
      createdAt: new Date(),
      content: ''
    })

    chatContent.streaming = true

    for await (const content of streamChat(conversationId.value, message)) {
      chatContent.content += content
    }

    setMessage(currentConversationId, nextMessageId, {
      content: chatContent.content
    })
    chatContent.streaming = false
    chatContent.content = ''

    // update conversation title
    const conversationListValue = conversationList.value

    if (conversationListValue == null) {
      return
    }

    const currentConversation = conversationListValue.find((c) => {
      return c.id === conversationId.value
    })

    if (currentConversation != null && currentConversation.title == null) {
      await summaryConversationTitle(conversationId.value)

      await refreshConversationList()
    }
  }

  return {
    chatContent,
    newConversation,
    chat
  }
})
