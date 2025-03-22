<script setup lang="ts">
import { HomeIcon, TokensIcon } from '@radix-icons/vue'
import SideBarTextItem from './SideBarTextItem.vue'
import SideBarIconItem from './SideBarIconItem.vue'
import { computed, provide, ref, watchEffect, watch, onMounted } from 'vue'
import SideBarUserCard from './SideBarUserCard.vue'
import { useConversationStore } from '@/stores/conversation'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { usePreferenceStore } from '@/stores'
import { getConversationInfo } from '@/apis/conversation'
import { useToast } from '@/components/ui/toast'
import { useChatListStore } from '@/stores/chat'
import { useAssistantStore } from '@/stores/assistant'
import AvatarIcon from '../avatar/AvatarIcon.vue'
import { computedAsync } from '@vueuse/core'
import type { ChatLunaAssistant } from '@/lib/types'

const { currentConversationId: currentConversationId } =
  storeToRefs(useChatListStore())
const { groupedConversationList, conversationList } = storeToRefs(
  useConversationStore()
)

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const { preference } = storeToRefs(usePreferenceStore())
const { assistantList } = storeToRefs(useAssistantStore())
const { setAssistant } = useAssistantStore()

const isWorkspace = computed(() => {
  return route.path.startsWith('/workspace')
})

const routeConversationId = route.params.conversationId as string

provide('currentConversationId', currentConversationId)
currentConversationId.value = preference.value.conversationId ?? ''

if (routeConversationId) {
  // check conversation
  ;(async () => {
    try {
      await getConversationInfo(route.params.conversationId as string)
      currentConversationId.value = routeConversationId
    } catch (error) {
      // if conversation not found, redirect to home
      router.replace('/')
      currentConversationId.value = ''

      toast({
        title: '对话不存在',
        description: '对话不存在或已被删除',
        variant: 'destructive'
      })
    }
  })()
} else if (currentConversationId.value !== '') {
  ;(async () => {
    try {
      await getConversationInfo(currentConversationId.value as string)
    } catch (error) {
      // if conversation not found, redirect to home
      router.replace('/')
      currentConversationId.value = ''

      toast({
        title: '对话不存在',
        description: '对话不存在或已被删除',
        variant: 'destructive'
      })
    }
  })()
}

function conversationItemClick(id: string) {
  currentConversationId.value = id
}

function assistantItemClick(assistant: ChatLunaAssistant) {
  setAssistant(assistant)
  currentConversationId.value = ''
}

onMounted(() => {
  const { refreshConversationList } = useConversationStore()
  refreshConversationList()
})
</script>

<template>
  <div
    class="flex h-full flex-col p-2 w-full overflow-x-hidden overflow-y-auto"
  >
    <!-- header -->
    <div class="flex flex-col w-full">
      <SideBarIconItem
        v-for="label in assistantList"
        href="/home"
        @click="assistantItemClick(label)"
        :key="label.id"
        :label="label.name"
        variant="ghost"
      >
        <AvatarIcon
          :src="label.avatar"
          :first-char="label.name[0]"
          class="size-4 opacity-50"
        />
      </SideBarIconItem>

      <SideBarIconItem
        :showDots="false"
        label="工作台"
        href="/workspace/assistant"
        @click="conversationItemClick('')"
        :variant="isWorkspace ? 'secondary' : 'ghost'"
      >
        <TokensIcon class="size-5 opacity-50 shrink-0" />
      </SideBarIconItem>
    </div>

    <!-- chat contents -->
    <div class="space-y-3 w-full grow">
      <div
        v-for="data in groupedConversationList"
        :key="data.time"
        class="mt-4 first:mt-6"
      >
        <p class="text-xs text-muted-foreground ml-2 mb-4">
          {{ data.time }}
        </p>

        <ol>
          <li v-for="conversation in data.conversations" :key="conversation.id">
            <SideBarTextItem
              :href="`/c/` + conversation.id"
              @click="conversationItemClick(conversation.id)"
              :label="conversation.title ?? '未命名对话'"
              :variant="
                conversation.id === currentConversationId
                  ? 'secondary'
                  : 'ghost'
              "
              :conversationId="conversation.id"
              :key="`${conversation.id}-${currentConversationId}`"
            />
          </li>
        </ol>
      </div>
    </div>
  </div>
  <SideBarUserCard />
</template>
