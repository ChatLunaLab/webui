<script setup lang="ts">
import type { AgentInfo, ChatLunaMessage } from '@/lib/types'
import { computed } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatListStore } from '@/stores/chat'

const props = defineProps<{
  conversationId: string
  agentInfo: AgentInfo
}>()

const chatListStore = useChatListStore()
</script>

<template>
  <div class="flex h-full w-full pl-3 max-w-xl sm:max-w-5xl flex-col gap-y-8">
    <div
      v-for="message in chatListStore.currentChatList"
      :key="message.id"
      class="flex w-full first:pt-8 last:pb-12"
    >
      <ChatMessage :message="message" :avatar="agentInfo.avatar" />
    </div>
  </div>
</template>
