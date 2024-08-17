<script setup lang="ts">
import type { AgentInfo, ChatLunaMessage } from '@/lib/types'
import { computed } from 'vue'
import ChatMessage from './ChatMessage.vue'

const props = defineProps<{
  conversationId: string
  agentInfo: AgentInfo
}>()

const chatHistory: ChatLunaMessage[] = [
  {
    id: '1',
    content: 'Hello, how are you?',
    role: 'user',
    createdAt: new Date()
  },
  {
    id: '2',
    content: 'I am fine, thank you.',
    role: 'assistant',
    createdAt: new Date()
  },
  {
    id: '3',
    content: 'What is your name?',
    role: 'user',
    createdAt: new Date()
  },
  {
    id: '4',
    content: 'My name is ChatGPT.',
    role: 'assistant',
    createdAt: new Date()
  },
  {
    id: '5',
    content: 'What is your favorite color?',
    role: 'user',
    createdAt: new Date()
  },
  {
    id: '6',
    content: 'I am not sure what is your favorite color.',
    role: 'assistant',
    createdAt: new Date()
  }
].map((message) => {
  message.content = (message.content + '\n').repeat(20)
  return message as ChatLunaMessage
})
</script>

<template>
  <div class="flex h-full w-full pl-3 max-w-xl sm:max-w-5xl flex-col gap-y-8 ">
    <div
      v-for="message in chatHistory
        .concat(chatHistory.slice())
        .concat(chatHistory.slice())"
      :key="message.id"
      class="flex w-full first:pt-8 last:pb-12"
    >
      <ChatMessage :message="message" :avatar="agentInfo.avatar" />
    </div>
  </div>
</template>
