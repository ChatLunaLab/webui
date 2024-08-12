<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import { ref } from 'vue'
import EmptyChatLayout from './EmptyChatLayout.vue'
import type { AgentInfo } from '@/lib/types'

const sidebarStore = useSidebarStore()

const screenInfoStore = useScreenInfoStore()

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

const conversationId = ref<string | null>(null)
</script>

<template>
  <div
    id="chat-root"
    class="grow h-full w-full overflow-y-auto overflow-x-hidden"
  >
    <div id="chat-content" class="w-full h-full flex flex-col items-center">
      <EmptyChatLayout v-if="conversationId == null" :agentInfo="agentInfo" />
    </div>
  </div>
</template>
