<script setup lang="ts">
import type { AssistantInfo, ChatLunaMessage } from '@/lib/types'
import {
  computed,
  effect,
  inject,
  provide,
  ref,
  toRef,
  watch,
  watchEffect,
  nextTick
} from 'vue'
import { cn } from '@/lib/utils'
import { useChatContent } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import type { PromisifyFn } from '@vueuse/core'
import { Markdown } from '@/components/layout/markdown'

const props = defineProps<{
  message: ChatLunaMessage
  avatar?: string
}>()

const { chatContent } = storeToRefs(useChatContent())

const contentRef = toRef(chatContent.value, 'content')
const isStreaming = computed(() => {
  return (
    chatContent.value.id === props.message.id && chatContent.value.streaming
  )
})

const messageContent = ref(props.message.content)
const scrollFunction = inject<PromisifyFn<() => void>>('scrollFunction')

const markdownContainer = ref<HTMLElement | null>(null)

watch(contentRef, (newValue) => {
  if (!isStreaming.value) {
    return
  }

  messageContent.value = newValue
  scrollFunction?.()
})

watchEffect(() => {
  console.log(isStreaming, messageContent.value)
})
</script>

<template>
  <div class="flex relative w-full flex-col px-4 xl:px-8 md:px-6">
    <div
      :class="
        cn(
          'flex max-w-full min-w-0 justify-start',
          props.message.role === 'user' ? 'flex-col items-end' : 'items-start'
        )
      "
    >
      <div class="shrink-0" v-if="message.role === 'assistant'">
        <img :src="avatar" class="rounded-full size-8" alt="avatar" />
      </div>
      <div
        :class="
          cn(
            'px-6 pb-3 pt-1 text-sm md:text-base max-w-xs transition-all duration-150 ease-in-out',
            message.role === 'user' &&
              'lg:max-w-[34rem] md:max-w-[28rem] bg-accent/80 rounded-[1.5rem] pt-3',
            message.role === 'assistant' && 'grow max-w-full'
          )
        "
      >
        <div
          v-if="isStreaming && !messageContent"
          class="flex gap-1 items-center h-6"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_0.5s_infinite_0s]"
          />
          <span
            class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_0.5s_infinite_0.15s]"
          />
          <span
            class="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_0.5s_infinite_0.3s]"
          />
        </div>
        <Markdown
          v-else
          ref="markdownContainer"
          :source="messageContent"
          class="transition-all duration-150 ease-in-out animate-[messageIn_0.5s_ease-out_forwards]"
        ></Markdown>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.message-animate) {
  background: linear-gradient(
    to bottom,
    transparent,
    hsl(var(--accent)) 50%,
    transparent
  );
  background-size: 100% 200%;
  background-position: top;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation:
    messageIn 0.5s ease-out forwards,
    revealGradient 0.5s ease-out forwards;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-16px);
  }
}

@keyframes messageIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes revealGradient {
  0% {
    background-position: top;
    -webkit-mask-position: 0 -100%;
    mask-position: 0 -100%;
  }
  100% {
    background-position: bottom;
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
}
</style>
