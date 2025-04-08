<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ToolFilter, ToolCard } from '@/components/layout/tools'
import { TopBar } from '@/components/layout/topbar'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import PlusIcon from '@/components/icons/PlusIcon.vue'

const router = useRouter()

// 模拟数据，实际应用中应该从API获取
const mockTools = [
  {
    id: 1,
    name: '文本分析工具',
    description:
      '强大的文本分析工具，可以进行情感分析、关键词提取、文本分类等操作。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=tool-text',
    category: '分析',
    usageCount: 128,
    isInstalled: true
  },
  {
    id: 2,
    name: '图像处理工具',
    description: '专业的图像处理工具，支持图像识别、分类、编辑和优化等功能。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=tool-image',
    category: '媒体',
    usageCount: 85,
    isInstalled: true
  },
  {
    id: 3,
    name: '数据可视化工具',
    description:
      '将复杂数据转化为直观图表的工具，支持多种图表类型和交互式数据探索。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=tool-data',
    category: '数据',
    usageCount: 64,
    isInstalled: false
  },
  {
    id: 4,
    name: '语言翻译工具',
    description: '支持多种语言之间的实时翻译，具有高准确度和自然的翻译结果。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=tool-translate',
    category: '语言',
    usageCount: 210,
    isInstalled: true
  }
]

// 搜索和过滤逻辑
const searchQuery = ref('')
const filteredTools = computed(() => {
  if (!searchQuery.value) return mockTools

  const query = searchQuery.value.toLowerCase()
  return mockTools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(query) ||
      (tool.description && tool.description.toLowerCase().includes(query)) ||
      (tool.category && tool.category.toLowerCase().includes(query))
  )
})

// 处理添加工具
const handleAddTool = () => {
  console.log('Add tool')
  // 这里可以跳转到添加工具的页面或打开添加工具的对话框
}

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
}
</script>

<template>
  <div class="flex flex-col p-6 gap-6 h-full overflow-auto">
    <!-- 顶部过滤和操作栏 -->
    <ToolFilter @search="handleSearch" @add="handleAddTool" />

    <!-- 工具列表 -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6"
    >
      <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
    </div>

    <!-- 空状态 -->
    <div
      v-if="filteredTools.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div class="text-4xl mb-4">🔧</div>
      <h3 class="text-xl font-medium mb-2">没有找到工具</h3>
      <p class="text-muted-foreground mb-6">
        {{
          searchQuery ? '尝试使用其他关键词搜索' : '添加一个新的工具开始使用'
        }}
      </p>
      <Button @click="handleAddTool" class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        <span>添加工具</span>
      </Button>
    </div>
  </div>
</template>
