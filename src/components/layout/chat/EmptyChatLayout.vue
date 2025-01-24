<script setup lang="ts">
import type { AssistantInfo, ChatLunaAssistant } from '@/lib/types'
import { useChatContent } from '@/stores/chat';
import { computed } from 'vue'

const props = defineProps<{
  assistant: ChatLunaAssistant & {
    examples?: {
      title: string
      prompt: string
    }[]
    author?: string
  }
}>()

const currentAssistant = computed(() => props.assistant)

const hasAssistant = computed(() => {
  return props.assistant.name != null
})

const { chat } = useChatContent()
</script>

<template>
  <div
    class="flex h-full w-full max-w-xl sm:max-w-2xl flex-col gap-12 justify-center items-center"
  >
    <div class="flex w-full flex-col gap-3 items-center">
      <img class="size-12 rounded-full" :src="currentAssistant.avatar" alt="" />
      <p v-if="hasAssistant" class="text-2xl font-medium">
        {{ currentAssistant.name }}
      </p>
      <p v-if="hasAssistant" class="text-sm text-muted-foreground">
        创建者: {{ currentAssistant.author }}
      </p>
      <p v-if="hasAssistant" class="text-sm text-foreground">
        {{ currentAssistant.description }}
      </p>
    </div>
    <div
      class="items-stretch flex max-w-sm md:max-w-2xl gap-x-5 gap-y-5 lg:gap-y-3 md:flex-no-wrap flex-wrap justify-center"
    >
      <div
        v-if="hasAssistant && currentAssistant.examples"
        v-for="(example, index) in currentAssistant.examples"
        :key="index"
        @click="
          chat({
            role: 'user',
            content: example.prompt,
            createdAt: new Date(),
            id: '0'
          })
        "
        class="pt-4 pb-6 px-4 hover:bg-muted/50 rounded-xl border bg-card text-muted-foreground shadow-sm hover:cursor-pointer"
      >
        <p class="text-sm break-words line-clamp-3 max-w-28">
          {{ example.title }}
        </p>
      </div>
    </div>
  </div>
</template>
