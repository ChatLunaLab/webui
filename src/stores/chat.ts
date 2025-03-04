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
    chatContent.content = ''

    // Create a transform stream that uses smoothStreamText
    const smoothingTransformer = createSmoothingTransformer()

    // Create a writable stream that updates chatContent
    const chatContentWriter = new WritableStream<string>({
      write(chunk) {
        chatContent.content += chunk
      }
    })

    // Create a readable stream from the streamChat generator
    const streamReader = (async function* () {
      for await (const content of streamChat(conversationId.value, message)) {
        yield content
      }
    })()

    const readableStream = new ReadableStream<string>({
      async start(controller) {
        for await (const chunk of streamReader) {
          controller.enqueue(chunk)
        }
        controller.close()
      }
    })

    // Pipe the streams together
    await readableStream
      .pipeThrough(smoothingTransformer)
      .pipeTo(chatContentWriter)

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

// Function to create a properly typed TransformStream for text smoothing
function createSmoothingTransformer() {
  // Define the transformer with proper typing

  return new TransformStream<string, string>({
    async transform(chunk, controller) {
      for await (const text of smoothStreamText(chunk)) {
        controller.enqueue(text)
      }
    }
  })
}

async function* smoothStreamText(text: string) {
  // Check if the text is empty
  if (!text) return

  // Determine if the text is primarily English or non-English
  const isEnglishText = /^[\x00-\x7F]+$/.test(text)

  // Variables to control the streaming speed
  let displayedLength = 0
  const totalLength = text.length
  let buffer = ''

  // Process the text character by character
  for (let i = 0; i < text.length; i++) {
    buffer += text[i]

    // For English text, output by words (on space or punctuation)
    if (
      isEnglishText &&
      (text[i] === ' ' || /[,.!?;:]/.test(text[i]) || i === text.length - 1)
    ) {
      yield buffer
      displayedLength += buffer.length
      buffer = ''
    }
    // For non-English text, output every few characters
    else if (!isEnglishText && (buffer.length >= 2 || i === text.length - 1)) {
      yield buffer
      displayedLength += buffer.length
      buffer = ''
    }
  }

  // Dynamically adjust the delay based on the ratio of displayed text to total text
  // As more text is displayed, the speed increases
  const progressRatio = displayedLength / totalLength
  const delay = Math.max(2, progressRatio * 2) // Decrease delay as progress increases

  // Small delay to create a smooth typing effect
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Ensure any remaining buffer is yielded
  if (buffer) {
    yield buffer
  }
}
