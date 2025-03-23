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
import type { ChatLunaAssistant } from '@/lib/types'
import { useAssistantStore } from '@/stores/assistant'
import { useRouter } from 'vue-router'
import { useChatListStore } from '@/stores/chat'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.vue'
import { ref } from 'vue'
import { createConversation } from '@/apis/conversation'

const props = defineProps<{
  assistant: ChatLunaAssistant
  showActions?: boolean
}>()

const router = useRouter()
const { setAssistant } = useAssistantStore()
const dropdownOpen = ref(false)

const startChat = async () => {
  setAssistant(props.assistant)
  await createConversation(props.assistant.id.toString())
  router.push('/chat')
}

const editAssistant = () => {
  // 编辑助手的逻辑
  console.log('Edit assistant:', props.assistant.id)
}

const deleteAssistant = () => {
  // 删除助手的逻辑
  console.log('Delete assistant:', props.assistant.id)
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
              assistant.avatar ||
              'https://api.dicebear.com/7.x/bottts/svg?seed=' + assistant.name
            "
            alt="Assistant avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <CardTitle class="text-sm sm:text-base">
              {{ assistant.name }}
            </CardTitle>
            <CardDescription
              class="text-xs truncate max-w-[150px] sm:max-w-[200px] mt-1"
            >
              {{ assistant.model }}
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
            <DropdownMenuItem @click="editAssistant">编辑</DropdownMenuItem>
            <DropdownMenuItem @click="startChat">对话</DropdownMenuItem>
            <DropdownMenuItem
              @click="deleteAssistant"
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
        {{ assistant.description || '没有描述' }}
      </p>
    </CardContent>

    <!-- 移除纯色遮罩 -->

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
          @click="editAssistant"
        >
          编辑
        </Button>
        <Button size="sm" class="flex-1 text-xs sm:text-sm" @click="startChat">
          对话
        </Button>
      </div>
    </div>
  </Card>
</template>
