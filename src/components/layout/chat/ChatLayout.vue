<script setup lang="ts">
import type { AgentInfo, ChatLunaMessage } from '@/lib/types'
import { computed, effect, inject, provide, ref, watch, watchEffect } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatListStore } from '@/stores/chat'
import { useDebounceFn, type PromisifyFn } from '@vueuse/core'

const props = defineProps<{
  conversationId: string
  agentInfo: AgentInfo
}>()

const chatListStore = useChatListStore()

const scrollFunction = inject<PromisifyFn<() => void>>('scrollFunction')

watch(
  () => chatListStore.currentChatList,
  () => {
    scrollFunction?.()
  }
)
</script>

<template>
  <TransitionGroup
    name="list"
    class="flex flex-col h-full w-full pl-3 max-w-xl sm:max-w-5xl gap-y-8"
    tag="div"
  >
    <div
      v-for="message in chatListStore.currentChatList"
      :key="message.id"
      class="flex w-full first:pt-8 last:pb-12"
    >
      <ChatMessage :message="message" :avatar="agentInfo.avatar" />
    </div>
  </TransitionGroup>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
