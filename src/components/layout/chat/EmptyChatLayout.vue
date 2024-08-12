<script setup lang="ts">
import type { AgentInfo } from '@/lib/types'

defineProps<{
  agentInfo: AgentInfo
}>()
</script>

<template>
  <div class="flex h-full w-full max-w-xl sm:max-w-2xl  flex-col gap-12 justify-center">
    <div class="flex w-full flex-col gap-3 justify-center items-center">
      <img class="size-12 rounded-full" :src="agentInfo.avatar" alt="" />
      <p class="text-2xl font-medium">{{ agentInfo.name }}</p>
      <p class="text-sm text-muted-foreground">
        创建者: {{ agentInfo.author }}
      </p>
      <p class="text-sm text-foreground">{{ agentInfo.description }}</p>
    </div>
    <div class="grid gap-3 grid-cols-2 md:grid-cols-4 justify-center">
      <div
        v-for="(example, index) in agentInfo.examples"
        :key="index"
        class="pt-4 pb-6 px-4 hover:bg-muted/50 rounded-xl border bg-card text-muted-foreground shadow hover:cursor-pointer"
      >

        <p class="text-sm break-words line-clamp-3">{{ example.title }}</p>
      </div>
    </div>
  </div>
</template>
