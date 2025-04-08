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
  workflow: {
    id: number
    name: string
    description?: string
    icon?: string
    steps: number
    lastRun?: string
    status: 'active' | 'inactive'
  }
  showActions?: boolean
}>()

const router = useRouter()
const dropdownOpen = ref(false)

const viewWorkflow = () => {
  // 查看工作流的逻辑
  console.log('View workflow:', props.workflow.id)
  // 这里可以跳转到工作流详情页面
}

const editWorkflow = () => {
  // 编辑工作流的逻辑
  console.log('Edit workflow:', props.workflow.id)
}

const exportWorkflow = () => {
  // 导出工作流的逻辑
  console.log('Export workflow:', props.workflow.id)
}

const deleteWorkflow = () => {
  // 删除工作流的逻辑
  console.log('Delete workflow:', props.workflow.id)
}

const runWorkflow = () => {
  // 运行工作流的逻辑
  console.log('Run workflow:', props.workflow.id)
}
</script>

<template>
  <Card
    class="flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 group relative h-full"
  >
    <CardHeader class="pb-3 pt-5 px-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img
            :src="
              workflow.icon ||
              'https://api.dicebear.com/7.x/bottts/svg?seed=' + workflow.name
            "
            alt="Workflow icon"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <CardTitle class="text-sm sm:text-base">
              {{ workflow.name }}
            </CardTitle>
            <CardDescription
              class="text-xs truncate max-w-[150px] sm:max-w-[200px] mt-1"
            >
              {{ workflow.steps }} 步骤
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
            <DropdownMenuItem @click="editWorkflow">编辑</DropdownMenuItem>
            <DropdownMenuItem @click="exportWorkflow">导出</DropdownMenuItem>
            <DropdownMenuItem @click="runWorkflow">运行</DropdownMenuItem>
            <DropdownMenuItem
              @click="deleteWorkflow"
              class="text-destructive focus:text-destructive"
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>

    <CardContent class="px-4 sm:px-6 py-2 flex-grow">
      <p
        class="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]"
        :title="workflow.description"
      >
        {{ workflow.description }}
      </p>
    </CardContent>

    <CardFooter class="px-4 sm:px-6 py-4 border-t flex-shrink-0">
      <div class="w-full flex items-center justify-between">
        <span
          :class="[
            'text-xs px-2 py-1 rounded-full',
            workflow.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          ]"
        >
          {{ workflow.status === 'active' ? '活跃' : '未激活' }}
        </span>

        <span class="text-xs text-muted-foreground">
          {{
            workflow.lastRun
              ? new Date(workflow.lastRun).toLocaleString()
              : '从未运行'
          }}
        </span>
      </div>
    </CardFooter>
  </Card>
</template>
