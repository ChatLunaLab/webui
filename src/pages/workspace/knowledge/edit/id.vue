<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ChatLunaKnowledgeBase } from '@/lib/types'

const route = useRoute()
const router = useRouter()
const knowledgeBaseId = computed(() => route.params.id as string)

// 模拟数据，实际应用中应该从API获取
const mockKnowledgeBases = [
  {
    id: 1,
    name: '通用知识库',
    description:
      '包含各种常见问题和知识点的通用知识库，涵盖多个领域的基础知识。这个知识库适合作为AI助手的基础知识来源，可以帮助回答用户的一般性问题。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=general-kb',
    documentCount: 120,
    shared: true,
    type: 'general'
  },
  {
    id: 2,
    name: '编程文档',
    description:
      '包含各种编程语言、框架和工具的文档和示例代码。这个知识库专注于软件开发领域，包含JavaScript、Python、Java等主流编程语言的文档，以及React、Vue、Angular等前端框架的使用指南。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=coding-kb',
    documentCount: 85,
    shared: true,
    type: 'technical'
  },
  {
    id: 3,
    name: '企业内部知识',
    description:
      '公司内部流程、政策和最佳实践的知识库。包含人力资源政策、IT支持流程、公司产品信息等内容，帮助员工快速获取公司相关信息。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=company-kb',
    documentCount: 42,
    shared: false,
    ownerId: 'user123',
    type: 'business'
  },
  {
    id: 4,
    name: '科学研究资料',
    description:
      '包含各种科学研究论文、实验数据和研究方法的知识库。涵盖物理、化学、生物等多个学科的研究资料，适合科研人员和学术工作者使用。',
    icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=science-kb',
    documentCount: 67,
    shared: false,
    ownerId: 'user456',
    type: 'scientific'
  }
]

const knowledgeBase = ref<ChatLunaKnowledgeBase | null>(null)
const isLoading = ref(true)
const documents = ref<{
  id: number
  name: string
  size: string
  updatedAt: string
  content?: string
  format?: string
  words?: number
  retrievalCount?: number
  status?: string
}[]>([])

const searchQuery = ref('')

// 当前选中查看的文档
const selectedDocument = ref<{
  id: number
  name: string
  content: string
} | null>(null)

// 过滤后的文档
const filteredDocuments = computed(() => {
  if (!searchQuery.value) return documents.value

  const query = searchQuery.value.toLowerCase()
  return documents.value.filter(doc =>
    doc.name.toLowerCase().includes(query)
  )
})

// 加载知识库详情
onMounted(async () => {
  // 模拟API请求
  setTimeout(() => {
    const kb = mockKnowledgeBases.find(kb => kb.id === parseInt(knowledgeBaseId.value))
    if (kb) {
      knowledgeBase.value = { ...kb }
      // 模拟文档数据
      documents.value = Array.from({ length: kb.documentCount || 10 }, (_, i) => ({
        id: i + 1,
        name: `心理咨询 demo ${i + 1} 个案例子.docx`,
        size: Math.floor(Math.random() * 1000) + 'KB',
        updatedAt: new Date().toISOString(),
        format: 'GENERAL',
        words: 1400 + Math.floor(Math.random() * 200),
        retrievalCount: Math.floor(Math.random() * 10),
        status: 'Available',
        content: `这是文档 ${i + 1} 的内容。这是一个示例文本，用于演示知识库文档的内容展示功能。

每个文档都包含了不同的信息和知识点，可以帮助AI模型回答用户的问题。

文档可以包含多种类型的内容，例如：
- 常见问题和解答
- 产品说明和用法
- 技术文档和指南
- 业务流程和规则

这些内容将被索引并存储在知识库中，以便AI模型可以根据用户的问题找到相关的信息。`
      }))
    }
    isLoading.value = false
  }, 500)
})

const handleSave = () => {
  // 保存知识库信息
  console.log('Saving knowledge base:', knowledgeBase.value)
  router.push('/workspace/knowledge')
}

const handleBack = () => {
  router.push('/workspace/knowledge')
}

const handleDeleteDocument = (documentId: number) => {
  documents.value = documents.value.filter(doc => doc.id !== documentId)
  if (selectedDocument.value && selectedDocument.value.id === documentId) {
    selectedDocument.value = null
  }
}

const handleUploadDocument = () => {
  console.log('Upload document')
  // 这里可以添加上传文档的逻辑
}

const handleTestKnowledgeBase = () => {
  console.log('Testing knowledge base:', knowledgeBase.value)
  // 测试知识库的逻辑
}

const handleViewDocument = (document: any) => {
  selectedDocument.value = {
    id: document.id,
    name: document.name,
    content: document.content || ''
  }
}

const closeDocumentView = () => {
  selectedDocument.value = null
}
</script>

<template>
  <div class="flex flex-col h-full overflow-auto">
    <!-- 顶部栏 -->
    <div class="border-b p-4 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <Button variant="outline" size="sm" @click="handleBack">
          <span class="mr-2">←</span> 返回
        </Button>
        <h1 class="text-xl font-semibold">
          {{ knowledgeBase?.name || '加载中...' }}
        </h1>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="handleUploadDocument">上传文档</Button>
        <Button @click="handleTestKnowledgeBase">知识库测试</Button>
      </div>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="text-lg">加载中...</div>
      </div>
    </div>

    <div v-else class="flex flex-col gap-6 p-6">
      <!-- 基本信息编辑 -->
      <div class="border rounded-lg p-6 bg-card">
        <h2 class="text-lg font-medium mb-4">基本信息</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">名称</label>
            <Input v-if="knowledgeBase" v-model="knowledgeBase.name" placeholder="知识库名称" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">描述</label>
            <Textarea v-if="knowledgeBase" v-model="knowledgeBase.description" placeholder="知识库描述" rows="3" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">共享</label>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="shared" v-if="knowledgeBase" v-model="knowledgeBase.shared"
                class="h-4 w-4 rounded border-gray-300" />
              <label for="shared">公开共享这个知识库</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 文档管理 -->
      <div class="border rounded-lg p-6 bg-card">
        <div class="flex flex-col gap-4">
          <div>
            <h2 class="text-lg font-medium">文档</h2>
            <p class="text-sm text-muted-foreground mt-1">
              知识库的所有文件都显示在这里，整个知识库可以链接到引用或通过聊天插件进行索引。
              <a href="#" class="text-blue-600 hover:underline">了解更多</a>
            </p>
          </div>

          <!-- 搜索框 -->
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input v-model="searchQuery" class="pl-10" placeholder="搜索" />
          </div>

          <!-- 文档表格 -->
          <div class="border rounded-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-muted/50">
                <tr>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">
                    <input type="checkbox" class="h-4 w-4 rounded border-gray-300">
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8">
                    #
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    名称
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    分块模式
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    词数
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    检索次数
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    上传时间
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col"
                    class="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-card divide-y divide-gray-200">
                <tr v-for="(doc, index) in filteredDocuments" :key="doc.id" class="hover:bg-muted/30">
                  <td class="px-3 py-4 whitespace-nowrap">
                    <input type="checkbox" class="h-4 w-4 rounded border-gray-300">
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {{ index + 1 }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-6 w-6 mr-2">
                        <!-- 文档类型图标 -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-500" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div>
                        <button @click="handleViewDocument(doc)"
                          class="text-blue-600 hover:underline text-sm font-medium">
                          {{ doc.name }}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ doc.format }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ doc.words }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ doc.retrievalCount }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ new Date(doc.updatedAt).toLocaleDateString() }} {{ new Date(doc.updatedAt).toLocaleTimeString()
                    }}
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <span class="flex items-center">
                      <span class="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      <span class="text-sm text-gray-700">{{ doc.status }}</span>
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center space-x-2">
                      <button @click="handleDeleteDocument(doc.id)" class="text-red-600 hover:text-red-900">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button class="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredDocuments.length === 0" class="text-center py-12 border rounded-md">
            <p class="text-muted-foreground">没有找到文档</p>
            <Button class="mt-4" size="sm" @click="handleUploadDocument">上传文档</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档内容查看弹窗 -->
    <div v-if="selectedDocument" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-card rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-medium">{{ selectedDocument.name }}</h3>
          <button @click="closeDocumentView" class="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        <div class="p-4 overflow-auto flex-grow">
          <div class="whitespace-pre-wrap bg-muted p-4 rounded-md">
            {{ selectedDocument.content }}
          </div>
        </div>
        <div class="border-t p-4 flex justify-end">
          <Button variant="outline" @click="closeDocumentView">关闭</Button>
        </div>
      </div>
    </div>
  </div>
</template>
