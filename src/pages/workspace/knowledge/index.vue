<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  KnowledgeBaseFilter,
  KnowledgeBaseCard
} from '@/components/layout/knowledge'
import type { ChatLunaKnowledgeBase } from '@/lib/types'
import { TopBar } from '@/components/layout/topbar'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import PlusIcon from '@/components/icons/PlusIcon.vue'

const router = useRouter()

// 模拟数据，实际应用中应该从API获取
const mockKnowledgeBases: ChatLunaKnowledgeBase[] = [
  {
    id: 1,
    name: '通用知识库',
    description:
      '包含各种常见问题和知识点的通用知识库，涵盖多个领域的基础知识。这个知识库适合作为AI助手的基础知识来源，可以帮助回答用户的一般性问题。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=general-kb',
    documentCount: 120,
    shared: true
  },
  {
    id: 2,
    name: '编程文档',
    description:
      '包含各种编程语言、框架和工具的文档和示例代码。这个知识库专注于软件开发领域，包含JavaScript、Python、Java等主流编程语言的文档，以及React、Vue、Angular等前端框架的使用指南。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=coding-kb',
    documentCount: 85,
    shared: true
  },
  {
    id: 3,
    name: '企业内部知识',
    description:
      '公司内部流程、政策和最佳实践的知识库。包含人力资源政策、IT支持流程、公司产品信息等内容，帮助员工快速获取公司相关信息。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=company-kb',
    documentCount: 42,
    shared: false,
    ownerId: 'user123'
  },
  {
    id: 4,
    name: '科学研究资料',
    description:
      '包含各种科学研究论文、实验数据和研究方法的知识库。涵盖物理、化学、生物等多个学科的研究资料，适合科研人员和学术工作者使用。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=science-kb',
    documentCount: 67,
    shared: false,
    ownerId: 'user456'
  }
]

// 搜索和过滤逻辑
const searchQuery = ref('')
const filteredKnowledgeBases = computed(() => {
  if (!searchQuery.value) return mockKnowledgeBases

  const query = searchQuery.value.toLowerCase()
  return mockKnowledgeBases.filter(
    (kb) =>
      kb.name.toLowerCase().includes(query) ||
      (kb.description && kb.description.toLowerCase().includes(query))
  )
})

// 处理创建知识库
const handleCreateKnowledgeBase = () => {
  console.log('Create knowledge base')
  // 这里可以跳转到创建知识库的页面或打开创建知识库的对话框
}

// 处理导入知识库
const handleImportKnowledgeBase = () => {
  console.log('Import knowledge base')
  // 这里可以打开导入知识库的对话框
}

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
}

// 处理编辑知识库
const handleEditKnowledgeBase = (knowledgeBaseId: number) => {
  router.push(`/workspace/knowledge/edit/${knowledgeBaseId}`)
}
</script>

<template>
  <div class="flex flex-col p-6 gap-6 h-full overflow-auto">
    <!-- 顶部过滤和操作栏 -->
    <KnowledgeBaseFilter @search="handleSearch" @create="handleCreateKnowledgeBase"
      @import="handleImportKnowledgeBase" />

    <!-- 知识库列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
      <KnowledgeBaseCard v-for="kb in filteredKnowledgeBases" :key="kb.id" :knowledge-base="kb"
        @click="handleEditKnowledgeBase(kb.id)" class="cursor-pointer hover:shadow-md transition-shadow" />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredKnowledgeBases.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
      <div class="text-4xl mb-4">📚</div>
      <h3 class="text-xl font-medium mb-2">没有找到知识库</h3>
      <p class="text-muted-foreground mb-6">
        {{
          searchQuery ? '尝试使用其他关键词搜索' : '创建一个新的知识库开始使用'
        }}
      </p>
      <Button @click="handleCreateKnowledgeBase" class="flex items-center gap-2">
        <PlusIcon class="h-4 w-4" />
        <span>创建知识库</span>
      </Button>
    </div>
  </div>
</template>
