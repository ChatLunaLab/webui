<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ChatLunaKnowledgeBase } from '@/lib/types'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.vue'
import { ref } from 'vue'

const props = defineProps<{
  knowledgeBase: ChatLunaKnowledgeBase
  showActions?: boolean
}>()

const router = useRouter()
const dropdownOpen = ref(false)

const viewKnowledgeBase = () => {
  // 查看知识库的逻辑
  console.log('View knowledge base:', props.knowledgeBase.id)
  // 这里可以跳转到知识库详情页面
}

const editKnowledgeBase = () => {
  // 编辑知识库的逻辑
  console.log('Edit knowledge base:', props.knowledgeBase.id)
}

const exportKnowledgeBase = () => {
  // 导出知识库的逻辑
  console.log('Export knowledge base:', props.knowledgeBase.id)
}

const deleteKnowledgeBase = () => {
  // 删除知识库的逻辑
  console.log('Delete knowledge base:', props.knowledgeBase.id)
}
</script>

<template>
  <Card
    class="flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 group relative"
  >
    <CardHeader class="pb-3 pt-5 px-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            :src="
              knowledgeBase.icon ||
              'https://api.dicebear.com/7.x/bottts/svg?seed=' +
                knowledgeBase.name
            "
            alt="Knowledge base icon"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <CardTitle class="text-sm sm:text-base">
              {{ knowledgeBase.name }}
            </CardTitle>
            <CardDescription
              class="text-xs truncate max-w-[150px] sm:max-w-[200px] mt-1"
            >
              {{ knowledgeBase.documentCount || 0 }} 文档
            </CardDescription>
          </div>
        </div>

        <!-- 三点菜单 -->
        <DropdownMenu v-model:open="dropdownOpen">
          <DropdownMenuTrigger
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontalIcon class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-[160px]">
            <DropdownMenuItem @click="editKnowledgeBase">编辑</DropdownMenuItem>
            <DropdownMenuItem @click="exportKnowledgeBase">
              导出
            </DropdownMenuItem>
            <DropdownMenuItem
              @click="deleteKnowledgeBase"
              class="text-destructive focus:text-destructive"
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent class="flex-grow pb-5 px-4 sm:px-6">
      <p class="text-sm text-muted-foreground line-clamp-4 h-[80px] mb-2">
        {{ knowledgeBase.description || '没有描述' }}
      </p>
    </CardContent>

    <!-- 底部按钮 -->
    <div
      class="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-background to-transparent"
      v-if="showActions !== false"
    >
      <div class="flex justify-between w-full">
        <Button
          variant="outline"
          size="sm"
          class="flex-1 mr-2 text-xs sm:text-sm"
          @click="editKnowledgeBase"
        >
          编辑
        </Button>
        <Button
          size="sm"
          class="flex-1 text-xs sm:text-sm"
          @click="viewKnowledgeBase"
        >
          查看
        </Button>
      </div>
    </div>
  </Card>
</template>
