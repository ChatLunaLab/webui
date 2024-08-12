<script setup lang="ts">
import type { AgentInfo } from '@/lib/types'
import { computed } from 'vue';

const props = defineProps<{
  agentInfo: AgentInfo
}>()

const hasAgentInfo = computed(() => {
  return props.agentInfo.name != null
})

</script>

<template>
  <div
    class="flex h-full w-full max-w-xl sm:max-w-2xl flex-col gap-12 justify-center items-center"
  >
    <div class="flex w-full flex-col gap-3  items-center">
      <img class="size-12 rounded-full" :src="agentInfo.avatar" alt="" />
      <p v-if="hasAgentInfo" class="text-2xl font-medium">
        {{ agentInfo.name }}
      </p>
      <p v-if="hasAgentInfo" class="text-sm text-muted-foreground">
        创建者: {{ agentInfo.author }}
      </p>
      <p v-if="hasAgentInfo" class="text-sm text-foreground">
        {{ agentInfo.description }}
      </p>

    </div>
    <div
      class="items-stretch flex max-w-sm md:max-w-2xl gap-x-5 gap-y-5 lg:gap-y-3  md:flex-no-wrap flex-wrap justify-center "
    >
      <div
        v-for="(example, index) in agentInfo.examples"
        :key="index"
        class="pt-4 pb-6 px-4 hover:bg-muted/50 rounded-xl border bg-card text-muted-foreground shadow hover:cursor-pointer"
      >
        <p class="text-sm break-words line-clamp-3 max-w-28">{{ example.title }}</p>
      </div>
    </div>
  </div>
</template>
