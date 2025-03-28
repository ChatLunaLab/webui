<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { ref, watch } from 'vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'

const props = defineProps<{
  class?: string
}>()

const searchQuery = ref('')

const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'create'): void
  (e: 'import'): void
}>()

// Watch for changes in searchQuery and emit search event in real-time
watch(searchQuery, (newValue) => {
  emit('search', newValue)
})

const handleCreate = () => {
  emit('create')
}

const handleImport = () => {
  emit('import')
}
</script>

<template>
  <div
    :class="props.class ?? ''"
    class="flex flex-col sm:flex-row gap-4 items-center justify-start w-full"
  >
    <!-- 搜索框 -->
    <div class="relative max-w-md">
      <SearchIcon
        class="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
      />
      <Input v-model="searchQuery" placeholder="搜索知识库..." class="pl-8" />
    </div>

    <div class="flex gap-2">
      <!-- 导入按钮 -->
      <Button
        @click="handleImport"
        variant="outline"
        class="flex items-center gap-2"
      >
        <span>导入</span>
      </Button>

      <!-- 创建知识库按钮 -->
      <Button @click="handleCreate" class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        <span>创建知识库</span>
      </Button>
    </div>
  </div>
</template>
