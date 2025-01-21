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

export const useAssistant = defineStore(
  'assistant',
  () => {
    let assistantList = ref<ChatLunaAssistant[]>([])

    let currentAssistant = ref<ChatLunaAssistant>()

    let fetchAssistantList = computedAsync(
      async () => {
        const response = await getAssistantList()
        assistantList.value = response

        if (!currentAssistant.value) {
          currentAssistant.value = response.find((assistant) => {
            return assistant.name === 'Assistant'
          })
        }

        return response
      },
      [],
      {
        lazy: true
      }
    )

    let computedCurrentAssistant = computedAsync(() => {
      if (!currentAssistant.value) {
        assistantList.value = fetchAssistantList.value
      }
      return {
        ...currentAssistant.value,
        examples: [
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
      } as ChatLunaAssistant
    })

    const setAssistant = (assistant: ChatLunaAssistant) => {
      currentAssistant.value = assistant
    }

    return {
      assistantList,
      currentAssistant: computedCurrentAssistant,
      setAssistant,
      fetchAssistantList
    }
  },
  {
    persist: true
  }
)
