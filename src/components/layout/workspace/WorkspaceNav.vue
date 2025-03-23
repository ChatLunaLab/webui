<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="cn('flex flex-col gap-4', props.class ?? '')">
    <Tabs default-value="assistant">
      <TabsList>
        <TabsTrigger asChild value="assistant">
          <a href="/workspace/assistant">助手</a>
        </TabsTrigger>
        <TabsTrigger asChild value="knowledge">
          <a href="/workspace/knowledge">知识库</a>
        </TabsTrigger>
        <TabsTrigger asChild value="workflow">
          <a href="/workspace/workflow">工作流</a>
        </TabsTrigger>
        <TabsTrigger asChild value="tools">
          <a href="/workspace/tools">工具</a>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>
