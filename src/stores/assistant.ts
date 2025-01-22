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
import { getUserInfo } from '@/apis/auth'
import { useChatListStore } from './chat'
import { useConversationStore } from './conversation'

export const useAssistantStore = defineStore(
  'assistant',
  () => {
    const _assistantList = ref<ChatLunaAssistant[]>([])

    let currentAssistant = ref<ChatLunaAssistant>()

    const refreshAssistantList = async () => {
      const response = await getAssistantList()
      _assistantList.value = response
      if (!currentAssistant.value) {
        currentAssistant.value = response.find((assistant) => {
          return assistant.name === 'Assistant'
        })
      }
      return response
    }

    let computedCurrentAssistant = computed(() => {
      return {
        ...currentAssistant.value,
        examples:
          currentAssistant.value?.name === 'Assistant'
            ? [
                {
                  title: '用我喜欢的体裁编写一个故事',
                  prompt:
                    '让我们来创作一个引人入胜的短篇故事。你能先询问我最喜欢的是哪种体裁，以及我希望包含在故事中的主题或元素吗？'
                },
                {
                  title: '设计一款有趣的编程游戏',
                  prompt:
                    '你能帮我设计一个用于教授基础编程技能的游戏概念吗？先询问我希望使用哪种编程语言。'
                },
                {
                  title: '编写一篇关于人工智能的学术论文',
                  prompt:
                    '我想让你编写一篇关于人工智能的学术论文。请确保你的论文符合学术规范，并使用最新的学术术语和学术写作风格。'
                },
                {
                  title: '用厨房里的已有的食材制作一个美食菜谱',
                  prompt:
                    '你能要求我列出厨房里的五种食材，然后帮我用它们制作一个新食谱吗？'
                }
              ]
            : []
      } as ChatLunaAssistant
    })

    const setAssistant = (assistant: ChatLunaAssistant) => {
      currentAssistant.value = assistant
    }

    const { conversationId } = storeToRefs(useChatListStore())
    const { conversationList } = storeToRefs(useConversationStore())

    watch(conversationId, (newValue) => {
      const conversationId = newValue

      if (conversationId == null) {
        return
      }

      const currentConversation = conversationList.value.find(
        (conversation) => conversation.id === conversationId
      )

      if (currentConversation) {
        currentAssistant.value = _assistantList.value.find(
          (assistant) => assistant.id === currentConversation.assistantId
        )
      }
    })

    return {
      assistantList: computedAsync(async () => {
        if (_assistantList.value.length < 1) {
          await refreshAssistantList()
        }

        return _assistantList.value
      }),
      currentAssistant: computedCurrentAssistant,
      setAssistant,
      refreshAssistantList
    }
  },
  {
    persist: true
  }
)
