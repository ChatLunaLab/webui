<script setup lang="ts">
import { deleteConversation } from '@/apis/conversation'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/toast'
import { useChatListStore } from '@/stores/chat'
import { useConversationStore } from '@/stores/conversation'
import { Pencil2Icon, Share2Icon, TrashIcon } from '@radix-icons/vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const { toast } = useToast()
const props = defineProps<{
  conversationId: string
}>()

const onDeleteAction = async () => {
  try {
    await deleteConversation(props.conversationId)
    const { conversationId: currentConversationId } =
      storeToRefs(useChatListStore())

    const { refreshConversationList } = useConversationStore()

    router.replace('/home')
    toast({
      title: '删除成功！',
      description: '对话已被删除',
      variant: 'default'
    })

    currentConversationId.value = ''

    refreshConversationList()
  } catch (error) {
    toast({
      title: '删除时出现错误！',
      description: '请稍后再试',
      variant: 'destructive'
    })
    router.replace('/home')
    router.go(0)
  }
}
</script>

<template>
  <DropdownMenuItem>编辑</DropdownMenuItem>
  <DropdownMenuItem>分享</DropdownMenuItem>
  <DropdownMenuItem @select="onDeleteAction">
    <span class="text-red-500">删除</span>
  </DropdownMenuItem>
</template>
