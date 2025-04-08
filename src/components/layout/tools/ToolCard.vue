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
  tool: {
    id: number
    name: string
    description?: string
    icon?: string
    category?: string
    usageCount?: number
    isInstalled: boolean
  }
  showActions?: boolean
}>()

const router = useRouter()
const dropdownOpen = ref(false)

const configureTool = () => {
  // 配置工具的逻辑
  console.log('Configure tool:', props.tool.id)
}

const useTool = () => {
  // 使用工具的逻辑
  console.log('Use tool:', props.tool.id)
}

const installTool = () => {
  // 安装工具的逻辑
  console.log('Install tool:', props.tool.id)
}

const uninstallTool = () => {
  // 卸载工具的逻辑
  console.log('Uninstall tool:', props.tool.id)
}

const exportTool = () => {
  // 导出工具的逻辑
  console.log('Export tool:', props.tool.id)
}

const deleteTool = () => {
  // 删除工具的逻辑
  console.log('Delete tool:', props.tool.id)
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
              tool.icon ||
              'https://api.dicebear.com/7.x/bottts/svg?seed=' + tool.name
            "
            alt="Tool icon"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <CardTitle class="text-sm sm:text-base">
              {{ tool.name }}
            </CardTitle>
            <CardDescription
              class="text-xs truncate max-w-[150px] sm:max-w-[200px] mt-1"
            >
              {{ tool.category }}
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
            <DropdownMenuItem @click="configureTool">配置</DropdownMenuItem>
            <DropdownMenuItem @click="exportTool">导出</DropdownMenuItem>
            <DropdownMenuItem
              @click="deleteTool"
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
        :title="tool.description"
      >
        {{ tool.description }}
      </p>
    </CardContent>

    <CardFooter class="px-4 sm:px-6 py-4 border-t flex-shrink-0">
      <div class="w-full flex items-center justify-between">
        <span
          :class="[
            'text-xs px-2 py-1 rounded-full',
            tool.isInstalled
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          ]"
        >
          {{ tool.isInstalled ? '已安装' : '未安装' }}
        </span>

        <span class="text-xs text-muted-foreground">
          {{ tool.category }}
        </span>
      </div>
    </CardFooter>
  </Card>
</template>
