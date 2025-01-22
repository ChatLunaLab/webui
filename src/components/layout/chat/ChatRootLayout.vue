<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import { provide, ref } from 'vue'
import EmptyChatLayout from './EmptyChatLayout.vue'
import type { AssistantInfo, ChatLunaAssistant } from '@/lib/types'
import ChatLayout from './ChatLayout.vue'
import { useChatContent, useChatListStore } from '../../../stores/chat'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'
import { useAssistantStore } from '@/stores/assistant'

const { currentConversationId: conversationId } =
  storeToRefs(useChatListStore())

const { chatContent } = storeToRefs(useChatContent())
const { currentAssistant } = storeToRefs(useAssistantStore())

const isUserScroll = ref(false)
const listElement = ref<Element | null>(null)

const scrollThreshold = 5 // pixels
let lastScrollTop = 0
let touchStartY = 0

const handleScroll = () => {
  const currentScrollTop = listElement.value?.scrollTop || 0
  if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
    isUserScroll.value = true
    setTimeout(() => {
      isUserScroll.value = false
    }, 10000) // Reset after 1 second of inactivity
  }
  // check if scrollTop is scroll to bottom
  if (currentScrollTop === listElement.value?.scrollHeight) {
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
  if (listElement.value) {
    listElement.value.addEventListener('scroll', handleScroll)
    listElement.value.addEventListener('touchstart', handleTouchStart)
    listElement.value.addEventListener('touchmove', handleTouchMove)
    listElement.value.addEventListener('touchEnd', handleTouchEnd)
  }
})

onUnmounted(() => {
  if (listElement.value) {
    listElement.value.removeEventListener('scroll', handleScroll)
    listElement.value.removeEventListener('touchstart', handleTouchStart)
    listElement.value.removeEventListener('touchmove', handleTouchMove)
    listElement.value.removeEventListener('touchend', handleTouchEnd)
  }
})

const scrollFunction = useDebounceFn(
  () => {
    if (isUserScroll.value && chatContent.value.streaming) {
      return
    }
    listElement.value?.scrollTo({
      behavior: 'smooth',
      top: listElement.value.scrollHeight
    })
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
    ref="listElement"
  >
    <div id="chat-content" class="w-full h-full flex flex-col items-center">
      <EmptyChatLayout
        v-if="conversationId == null || conversationId.length < 1"
        :assistant="currentAssistant as ChatLunaAssistant"
      />
      <ChatLayout
        v-else
        :key="conversationId"
        :conversationId="conversationId"
        :assistant="currentAssistant as ChatLunaAssistant"
      />
    </div>
  </div>
</template>
