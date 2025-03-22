<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useSidebarStore } from '@/stores/ui'
import { useScreenInfoStore } from '@/stores/screen'
import { computed, provide, ref } from 'vue'
import EmptyChatLayout from './EmptyChatLayout.vue'
import type { AssistantInfo, ChatLunaAssistant } from '@/lib/types'
import ChatLayout from './ChatLayout.vue'
import { useChatContent, useChatListStore } from '../../../stores/chat'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import ChatMessageBar from './ChatMessageBar.vue'

const { currentConversationId: conversationId } =
  storeToRefs(useChatListStore())

const { chatContent } = storeToRefs(useChatContent())
const { currentAssistant } = storeToRefs(useAssistantStore())

const isUserScroll = ref(false)
const listElement = ref<Element | null>(null)
const canScroll = ref(false)
let resizeObserver: ResizeObserver | null = null

const scrollThreshold = 5 // pixels
let lastScrollTop = 0
let touchStartY = 0

const handleScroll = () => {
  const element = listElement.value

  if (!element) {
    return
  }

  const currentScrollTop = element?.scrollTop || 0
  if (Math.abs(currentScrollTop - lastScrollTop) > scrollThreshold) {
    isUserScroll.value = true
    setTimeout(() => {
      isUserScroll.value = false
    }, 1000) // Reset after 1 second of inactivity
  }

  // check if scrollTop is scroll to bottom with a small tolerance for browser rounding errors
  const scrollTolerance = 2 // pixels tolerance for rounding errors
  if (
    Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <=
    scrollTolerance
  ) {
    isUserScroll.value = false
    canScroll.value = false
  } else {
    canScroll.value = true
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
  const element = listElement.value
  if (!element) {
    return
  }
  element.addEventListener('scroll', handleScroll)
  element.addEventListener('touchstart', handleTouchStart)
  element.addEventListener('touchmove', handleTouchMove)
  element.addEventListener('touchEnd', handleTouchEnd)

  resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      canScroll.value =
        Math.abs(
          element.scrollHeight - element.scrollTop - element.clientHeight
        ) > 10
    })
  })
  resizeObserver.observe(element)
})

onUnmounted(() => {
  if (listElement.value) {
    listElement.value.removeEventListener('scroll', handleScroll)
    listElement.value.removeEventListener('touchstart', handleTouchStart)
    listElement.value.removeEventListener('touchmove', handleTouchMove)
    listElement.value.removeEventListener('touchend', handleTouchEnd)
    resizeObserver?.disconnect()
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
provide('canScroll', canScroll)
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
  <ChatMessageBar />
</template>
