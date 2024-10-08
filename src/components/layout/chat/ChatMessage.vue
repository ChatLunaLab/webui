<script setup lang="ts">
import type { AgentInfo, ChatLunaMessage } from '@/lib/types'
import { computed, effect, inject, provide, ref, toRef, watch } from 'vue'
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
const scrollFunction =
  inject<PromisifyFn<() => void>>('scrollFunction')

watch(contentRef, (newValue) => {
  if (!isStreaming.value) {
    return
  }
  messageContent.value = newValue
  scrollFunction?.()
})
</script>

<template>
  <div class="flex relative w-full flex-col px-8 xl:px-0">
    <div
      :class="
        cn(
          'flex  max-w-full min-w-0 justify-start',
          props.message.role === 'user' ? 'flex-col items-end' : 'items-start '
        )
      "
    >
      <div class="shrink-0" v-if="message.role === 'assistant'">
        <img :src="avatar" class="rounded-full size-8" alt="avatar" />
      </div>
      <div
        :class="
          cn(
            ' px-6 pb-3 pt-1 text-sm md:text-base max-w-xs ',
            message.role === 'user' &&
              'lg:max-w-[34rem] md:max-w-[24rem] bg-accent/80 rounded-[1.5rem] pt-3',
            message.role === 'assistant' && 'grow max-w-full'
          )
        "
      >
        <Markdown
          :source="messageContent"
          class="transition-all duration-150 ease-in-out"
        ></Markdown>
      </div>
    </div>
  </div>
</template>
