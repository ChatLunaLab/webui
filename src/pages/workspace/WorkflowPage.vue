<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { WorkflowFilter, WorkflowCard } from '@/components/layout/workflow'
import { TopBar } from '@/components/layout/topbar'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import PlusIcon from '@/components/icons/PlusIcon.vue'

const router = useRouter()

// 模拟数据，实际应用中应该从API获取
const mockWorkflows = [
  {
    id: 1,
    name: '数据处理流程',
    description:
      '自动化数据清洗、转换和分析的工作流，可以处理多种格式的数据源并生成报告。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=workflow-data',
    steps: 8,
    lastRun: '2023-12-15T10:30:00Z',
    status: 'active'
  },
  {
    id: 2,
    name: '内容审核流程',
    description:
      '自动化内容审核工作流，可以检测文本、图像中的敏感内容，并根据规则进行分类和处理。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=workflow-review',
    steps: 5,
    lastRun: '2023-12-10T14:20:00Z',
    status: 'active'
  },
  {
    id: 3,
    name: '客户服务自动化',
    description:
      '自动化客户服务流程，包括问题分类、路由和初步回复，提高客户服务效率。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=workflow-service',
    steps: 6,
    lastRun: '2023-12-05T09:15:00Z',
    status: 'inactive'
  },
  {
    id: 4,
    name: '数据备份流程',
    description:
      '定期自动备份重要数据的工作流，包括数据压缩、加密和存储到多个位置。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=workflow-backup',
    steps: 4,
    lastRun: '2023-12-01T23:00:00Z',
    status: 'active'
  }
]

// 搜索和过滤逻辑
const searchQuery = ref('')
const filteredWorkflows = computed(() => {
  if (!searchQuery.value) return mockWorkflows

  const query = searchQuery.value.toLowerCase()
  return mockWorkflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(query) ||
      (workflow.description &&
        workflow.description.toLowerCase().includes(query))
  )
})

// 处理创建工作流
const handleCreateWorkflow = () => {
  console.log('Create workflow')
  // 这里可以跳转到创建工作流的页面或打开创建工作流的对话框
}

// 处理导入工作流
const handleImportWorkflow = () => {
  console.log('Import workflow')
  // 这里可以打开导入工作流的对话框
}

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
}
</script>

<template>
  <div class="flex flex-col p-6 gap-6 h-full overflow-auto">
    <!-- 顶部过滤和操作栏 -->
    <WorkflowFilter
      @search="handleSearch"
      @create="handleCreateWorkflow"
      @import="handleImportWorkflow"
    />

    <!-- 工作流列表 -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6"
    >
      <WorkflowCard
        v-for="workflow in filteredWorkflows"
        :key="workflow.id"
        :workflow="workflow"
      />
    </div>

    <!-- 空状态 -->
    <div
      v-if="filteredWorkflows.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div class="text-4xl mb-4">⚙️</div>
      <h3 class="text-xl font-medium mb-2">没有找到工作流</h3>
      <p class="text-muted-foreground mb-6">
        {{
          searchQuery ? '尝试使用其他关键词搜索' : '创建一个新的工作流开始使用'
        }}
      </p>
      <Button @click="handleCreateWorkflow" class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        <span>创建工作流</span>
      </Button>
    </div>
  </div>
</template>
