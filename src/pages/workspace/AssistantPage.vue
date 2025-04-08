<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import { storeToRefs } from 'pinia'
import { AssistantFilter } from '@/components/layout/assistant'
import { AssistantCard } from '@/components/layout/assistant'
import type { ChatLunaAssistant } from '@/lib/types'
import { TopBar } from '@/components/layout/topbar'
import { useRouter } from 'vue-router'

const assistantStore = useAssistantStore()
const router = useRouter()

// 模拟数据，实际应用中应该从API获取
const mockAssistants: ChatLunaAssistant[] = [
  {
    id: 1,
    name: '通用助手',
    preset: 'general',
    model: 'gpt-3.5-turbo',
    description:
      '一个通用的AI助手，可以回答各种问题，提供建议和帮助。无论是日常生活中的疑问，学术研究的难题，还是工作中的挑战，我都能为你提供有价值的信息和见解。我的知识库涵盖了广泛的领域，从科学技术到艺术人文，从商业经济到健康生活。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=general',
    shared: true
  },
  {
    id: 2,
    name: '编程助手',
    preset: 'coding',
    model: 'gpt-4',
    description:
      '专注于编程相关问题的助手，可以帮助你解决代码问题，提供编程建议。我精通多种编程语言，包括但不限于JavaScript、Python、Java、C++等。我可以帮助你调试代码，解释复杂的编程概念，提供最佳实践建议，以及协助你设计和实现软件架构。无论你是初学者还是有经验的开发者，我都能提供适合你水平的指导。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=coding',
    shared: true
  },
  {
    id: 3,
    name: '写作助手',
    preset: 'writing',
    model: 'gpt-4',
    description:
      '帮助你进行各种写作任务，包括文章、报告、故事等。我可以协助你构思创意，完善文章结构，优化语言表达，以及提供修改建议。无论是学术论文、商业报告、创意写作还是日常沟通文稿，我都能根据你的需求和目标受众，帮助你创作出清晰、有说服力且引人入胜的内容。我还可以提供不同写作风格的参考和指导。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=writing',
    shared: false,
    ownerId: 'user123'
  },
  {
    id: 4,
    name: '研究助手',
    preset: 'research',
    model: 'gpt-4',
    description:
      '帮助你进行研究工作，包括文献综述、数据分析等。我可以协助你梳理研究方向，整理相关文献，分析研究数据，以及撰写研究报告。我熟悉各种研究方法和工具，能够帮助你设计实验，解释研究结果，并提出有价值的见解。无论是学术研究、市场调研还是产品分析，我都能提供专业的支持和建议，帮助你获取更深入的洞察。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=research',
    shared: true
  },
  {
    id: 5,
    name: '设计助手',
    preset: 'design',
    model: 'gpt-3.5-turbo',
    description:
      '帮助你进行设计工作，提供设计建议和灵感。我可以协助你进行UI/UX设计、平面设计、产品设计等多个领域的创意构思。我了解设计原则、色彩理论、排版技巧以及用户体验设计的最佳实践。我可以帮助你分析设计趋势，提供创新思路，以及针对特定设计挑战提出解决方案。无论你是专业设计师还是对设计感兴趣的爱好者，我都能为你的项目增添价值。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=design',
    shared: false,
    ownerId: 'user123'
  },
  {
    id: 6,
    name: '翻译助手',
    preset: 'translation',
    model: 'gpt-3.5-turbo',
    description:
      '帮助你进行各种语言之间的翻译工作。我精通多种语言，包括但不限于英语、中文、日语、法语、德语、西班牙语等。我不仅可以提供准确的字面翻译，还能根据语境和文化背景进行适当的调整，确保翻译内容既忠实原意又符合目标语言的表达习惯。无论是日常对话、商务文件、学术论文还是文学作品，我都能提供高质量的翻译服务，帮助你跨越语言障碍。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=translation',
    shared: true
  }
]

// 过滤条件
const searchQuery = ref('')
const filters = ref({
  myCreations: false,
  tags: [] as string[]
})

// 根据标签映射助手
const tagMapping: Record<string, string[]> = {
  writing: ['writing', 'translation'],
  coding: ['coding'],
  design: ['design'],
  research: ['research']
}

// 过滤后的助手列表
const filteredAssistants = computed(() => {
  let result = [...mockAssistants]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (assistant) =>
        assistant.name.toLowerCase().includes(query) ||
        (assistant.description &&
          assistant.description.toLowerCase().includes(query))
    )
  }

  // 标签过滤
  if (filters.value.tags.length > 0) {
    result = result.filter((assistant) => {
      return filters.value.tags.some((tag) =>
        tagMapping[tag]?.includes(assistant.preset)
      )
    })
  }

  // 由我创建的过滤
  if (filters.value.myCreations) {
    result = result.filter(
      (assistant) => assistant.ownerId === 'user123' // 实际应用中应该使用当前用户ID
    )
  }

  return result
})

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
}

// 处理过滤
const handleFilter = (newFilters: { myCreations: boolean; tags: string[] }) => {
  filters.value = newFilters
}

// 处理创建助手
const handleCreate = () => {
  // 这里可以导航到创建助手页面或打开创建助手对话框
  console.log('创建新助手')
  // 示例：导航到创建助手页面
  // router.push('/workspace/assistant/create')
}
</script>

<template>
  <div class="mx-auto p-6">
    <AssistantFilter
      class="mb-6"
      @search="handleSearch"
      @filter="handleFilter"
      @create="handleCreate"
    />

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="assistant in filteredAssistants"
        :key="assistant.id"
        class="h-full"
      >
        <AssistantCard :assistant="assistant" />
      </div>
    </div>

    <div
      v-if="filteredAssistants.length === 0"
      class="flex flex-col items-center justify-center py-12"
    >
      <p class="text-muted-foreground">没有找到符合条件的助手</p>
    </div>
  </div>
</template>
