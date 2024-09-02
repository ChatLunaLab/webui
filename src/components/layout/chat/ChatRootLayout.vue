<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import { provide, ref } from 'vue'
import EmptyChatLayout from './EmptyChatLayout.vue'
import type { AgentInfo } from '@/lib/types'
import ChatLayout from './ChatLayout.vue'
import { useChatContent, useChatListStore } from '../../../stores/chat'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'

const { chatContent } = storeToRefs(useChatContent())
const chatListStore = storeToRefs(useChatListStore())
const agentInfo: AgentInfo = {
  /*  name: '默认',
  description: '与任意模型对话',
  author: 'chatluna 官方', */
  avatar: 'https://avatars.githubusercontent.com/u/139454032?s=200&v=4',

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
      prompt: '你能要求我列出厨房里的五种食材，然后帮我用它们制作一个新食谱吗？'
    }
  ]
}

const conversationId = ref<string | null>('123')
const isUserScroll = ref(false)
const list = ref<Element | null>(null)

const scrollThreshold = 5 // pixels
let lastScrollTop = 0
let touchStartY = 0

const handleScroll = () => {
  const currentScrollTop = list.value?.scrollTop || 0
  if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
    isUserScroll.value = true
    setTimeout(() => {
      isUserScroll.value = false
    }, 10000) // Reset after 1 second of inactivity
  }
  // check if scrollTop is scroll to bottom
  if (currentScrollTop === list.value?.scrollHeight) {
    isUserScroll.value = false
  }
  lastScrollTop = currentScrollTop
}

const handleTouchStart = (e: Event) => {
  touchStartY = (e as TouchEvent).touches[0].clientY
}

const handleTouchMove = (e: Event) => {
  const touchMoveY = (e as TouchEvent).touches[0].clientY
  if (Math.abs(touchMoveY - touchStartY) > scrollThreshold) {
    isUserScroll.value = true
  }
}

const handleTouchEnd = () => {
  setTimeout(() => {
    isUserScroll.value = false
  }, 1000) // Reset after 1 second
}

onMounted(() => {
  if (list.value) {
    list.value.addEventListener('scroll', handleScroll)
    list.value.addEventListener('touchstart', handleTouchStart)
    list.value.addEventListener('touchmove', handleTouchMove)
    list.value.addEventListener('touchEnd', handleTouchEnd)
  }
})

onUnmounted(() => {
  if (list.value) {
    list.value.removeEventListener('scroll', handleScroll)
    list.value.removeEventListener('touchstart', handleTouchStart)
    list.value.removeEventListener('touchmove', handleTouchMove)
    list.value.removeEventListener('touchend', handleTouchEnd)
  }
})

setTimeout(() => {
  chatListStore.conversationId.value = conversationId.value
}, 10)

const scrollFunction = useDebounceFn(
  () => {
    if (isUserScroll.value && chatContent.value.streaming) {
      return
    }
    list.value?.scrollTo({ behavior: 'smooth', top: list.value.scrollHeight })
  },
  30,
  {
    maxWait: 50
  }
)

provide('scrollFunction', scrollFunction)
</script>

<template>
  <div
    id="chat-root"
    class="grow h-full w-full overflow-y-auto overflow-x-hidden"
    ref="list"
  >
    <div id="chat-content" class="w-full h-full flex flex-col items-center">
      <EmptyChatLayout v-if="conversationId == null" :agentInfo="agentInfo" />
      <ChatLayout
        v-if="conversationId != null"
        :conversationId="conversationId"
        :agentInfo="agentInfo"
      />
    </div>
  </div>
</template>
