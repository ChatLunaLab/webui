<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <Tabs default-value="assistant" :class="cn('', props.class ?? '')">
    <TabsList>
      <TabsTrigger value="assistant">助手</TabsTrigger>
      <TabsTrigger value="knowledge">知识库</TabsTrigger>
      <TabsTrigger value="workflow">工作流</TabsTrigger>
      <TabsTrigger value="tools">工具</TabsTrigger>
    </TabsList>
  </Tabs>
</template>
