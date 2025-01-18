import { computed, effect, reactive, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getMessageList, streamChat } from '@/apis/index'
import { asyncComputed, useAsyncState } from '@vueuse/core'
import type { ChatLunaMessage } from '@/lib/types'
import { TypeWriter } from '@/lib/type_writer'
import { usePreferenceStore } from './preference'

export const useChatListStore = defineStore('chatList', () => {
  const globalChatListMap = reactive<Record<string, ChatLunaMessage[]>>({})

  const conversationId = ref<string | null>('')

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
  const { putMessage, setMessage } = chatListStore
  const { currentChatList } = storeToRefs(chatListStore)

  const chatContent = reactive({
    content: '',
    id: '',
    streaming: false
  })

  const conversationId = computed(() => {
    return chatListStore.conversationId
  })

  const typeWriter = new TypeWriter()

  const chat = async (message: ChatLunaMessage) => {
    if (!conversationId.value) {
      return
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
  }

  return {
    chatContent,
    chat
  }
})
